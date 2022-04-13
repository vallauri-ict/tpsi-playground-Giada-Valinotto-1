"use strict"

// ***************************** Librerie *************************************
import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import body_parser from "body-parser";  //Serve ad intercettare i parametri del body
import cors from "cors";                // Senza i permessi CORS, il Server (per default) risponderebbe solo ai Client che hanno scaricato le pagine dal Server e hanno la sua stessa URL
                                        //Con CORS posso specificare i diritti di accesso alle API fornite dal Server
import fileUpload, { UploadedFile } from "express-fileupload";  //Per upload dei file binari
import cloudinary, { UploadApiResponse } from "cloudinary";    //STorage dei file su Cloudinary
import {MongoClient, ObjectId}  from "mongodb";     //Per interfacciarsi con MongoDB
import bcrypt from "bcryptjs"   
import jwt from "jsonwebtoken" //Gestione dei Web Token
import environment from "./environment.json" //File che contiene le chiavi di accesso a Cloudinary e al DB
import { createToken } from "typescript";

// ***************************** Costanti *************************************
const app = express();
const CONNECTION_STRING = environment.CONNECTION_STRING_ATLAS
const DBNAME = "mail"
const DURATA_TOKEN = 60 // sec
const HTTP_PORT = 1337
const HTTPS_PORT = 1338
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8"); //Lette dalla cartella keys
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const credentials = { "key": privateKey, "cert": certificate };
const JWTkey = fs.readFileSync("keys/JWTkey.pem", "utf8");

cloudinary.v2.config({
	cloud_name: environment.CLOUDINARY.CLOUD_NAME,
	api_key: environment.CLOUDINARY.API_KEY,
	api_secret: environment.CLOUDINARY.API_SECRET,
})



// ***************************** Avvio ****************************************
const httpsServer = https.createServer(credentials, app); //Il Server parte sulla porta https -> NON pubblicabile su Heroku dove serve pubblicare con http 
httpsServer.listen(HTTPS_PORT, function() { //Per pubblicazione HTTP tolgo la S e le credentials
    console.log("Server HTTPS in ascolto sulla porta " + HTTPS_PORT);
    init();
});
let paginaErrore = "";
function init() {
    fs.readFile("./static/error.html", function(err, data) {
        if (!err)
            paginaErrore = data.toString();
        else
            paginaErrore = "<h1>Risorsa non trovata</h1>"
    });
}
// app.response.log = function(err){console.log(`*** Error *** ${err.message}`)}
app.response["log"] = function(err){console.log(`*** Error *** ${err.message}`)} //Metodo log che punta ad una function con err.message
                                                                                 //In questo modo faccio il send al client che il log sul server in un'unica volta



/* *********************** (Sezione 1) Middleware ********************* */
// 1. Request log
app.use("/", function(req, res, next) {
    console.log("** " + req.method + " ** : " + req.originalUrl);
    next();
});


// 2 - route risorse statiche
app.use("/", express.static('./static'));


// 3 - routes di lettura dei parametri post
// Possono essere in formato URLencoded o in formato JSON
// In ogni caso, sono passati nel Body
app.use("/", body_parser.json({ "limit": "10mb" }));
app.use("/", body_parser.urlencoded({"extended": true, "limit": "10mb"}));


// 4 - log dei parametri GET e dei parametri BODY 
app.use("/", function(req, res, next) {
    if (Object.keys(req.query).length > 0)
        console.log("        Parametri GET: ", req.query)
    if (Object.keys(req.body).length != 0)
        console.log("        Parametri BODY: ", req.body)
    next();
});


// 5. Apertura di CORS per rispondere a chiunque
const corsOptions = {
    origin: function(origin, callback) {
          return callback(null, true);
    },
    credentials: true
};
app.use("/", cors(corsOptions));


// 6 - Upload di file binari con un limite alla dimensione degli upload passati attraverso parametri FormData
app.use("/", fileUpload({
    "limits": { "fileSize": (10 * 1024 * 1024) } // 10*1024*1024 // 10 M
}));



/* ***************** (Sezione 2) middleware relativi a JWT ****************** */

// Gestione dei login di tipo post
app.post("/api/login", function (req, res, next){
    //Connessione al DB
    MongoClient.connect(CONNECTION_STRING, function(err,client){
        if(err)
        {
            res.status(501).send("Errore nella connessione al database")["log"](err); //Per errori diversi da 500 è sufficiente la stringa 
        }
        else
        {
            const db = client.db(DBNAME);
            const collection = db.collection("mail");
            let username = req.body.username;
            collection.findOne({"username": username}, function(err, dbuser){
                if(err)
                {
                    res.status(500).send("Errore esecuzione query")["log"](err);
                }
                else
                {
                    //Controllo se ha trovato l'utente -> Username non corretto
                    if(!dbuser)
                    {
                        res.status(401).send("Username non valido")["log"](err);
                    }
                    else
                    {
                        //Se ha trovato l'utente 
                        //Confronto la password mandata (che devo prima cifrare) e quella corrente salvata nel DB
                        //NON mandare la possword in chiaro !!!
                        if(req.body.password) //Se il client ha mandato una password (ulteriore controllo)
                        {
                            //Controllo della validità della password prendendo il salt value (lo fa per noi il bcript compare)
                            if(bcrypt.compareSync(req.body.password, dbuser.password))
                            {
                                //Creare e inviare il TOKEN
                                let token = creaToken(dbuser); //passo le info dell'utente
                                res.setHeader("authorization", token)
                                
                                //Risposta al Browser
                                res.send({"ris": "ok"});

                            }
                            else
                            {
                                //Error 401
                                res.status(401).send("Password mancante");
                            }
                        }
                        else
                        {
                            res.status(401).send("Password non valida");
                        }
                    }
                }
            });
        }
    });
})

function creaToken(dbUser) //dbUser è un JSON 
{
    let data = Math.floor(((new Date()).getTime())/1000); //getTime restituisce i millsecondi, divido quindi per 1000 per avere il tempo in secondi
    
    let payload = {
                    "id": dbUser.id,
                    "username": dbUser.username,
                    "iat": dbUser.iat || data, //Se il primo esiste, mette quello. Altrimenti, mette il secondo. 
                    "exp": data + DURATA_TOKEN //expire delToken
                  }
    let token = jwt.sign(payload, JWTkey);
    return token;
}

/* Middleware che risponde solo sui servizi per il CONTROLLO DEL TOKEN
Usando / -> Risorsa completa richiesta dal Client
Usando * -> Stringa vuota*/
app.use("/api/", function(req,res,next) //Preferibile usare / per questioni di utilizzo di request.url
{
    //Controllo del Token
    let token;
    if(req.headers.authorization) //Se c'è intestazione Authorizaion quindi c'è il Token 
    {
        token = req.headers.authorization;
        //Controllo validità del Token 
        jwt.verify(token, JWTkey, function (err, payload){ //jwt.verify inietta alla funzione di callback il paload del token
            if(err)
            {
                res.status(403).send("Token non valido");
            }
            else
            {
              //Rinnovo token
              let newToken = creaToken(payload);
              res.setHeader("authorization", newToken);
              //Salvo id preso dal payload del token(NON tutto il Token!!) 
              req["_id"] = newToken._id;
              next();
            }
        })
    }
    else
    {
        //Errore 403
        res.status(403).send("Token mancante");
    }
})

/* ********************** (Sezione 3) USER ROUTES  ************************** */

/* GESTIONE ELENCO MAIL */
app.get("/api/elencoMail", function(req,res,next)
{
    //Middleware speciale in sezione JWT

    //Step 1 : aprteura connessione al server
    MongoClient.connect(CONNECTION_STRING, function(err,client){
        if(err)
        {
            res.status(503).send("Errore connessione al DB");
        }
        else
        {
            const db = client.db(DBNAME);
            const collection = db.collection("mail");
            //Prendo id utente dall'header Authorization
            const _id = req["_id"]; 
            let oid = new ObjectId(_id);
            let request = collection.findOne({"_id":oid})
            request.then(function(data)
            {
                console.log(data);
                res.send(data.mail.reverse());
            });
            request.catch(function(){
                res.status(500).send("Errore esecuzione Query");
            })
            request.finally(function(){
                client.close();
            })
        }
    });
});

/* INVIO NUOVA MAIL */
app.post("/api/newMail", function(req,res,next)
{
    MongoClient.connect(CONNECTION_STRING, function(err,client){
        if(err)
        {
            res.status(503).send("Errore connessione al DB");
        }
        else
        {
            const db = client.db(DBNAME);
            const collection = db.collection("mail");
            //Prendo id utente dall'header Authorization
            const _id = req["_id"]; 
            let oid = new ObjectId(_id);
            let mail = req.body.mail;
            let request = collection.findOne({"_id":oid})
            request.then(function(data)
            {
                console.log(data);
                res.send(data.mail.reverse());
            });
            request.catch(function(){
                res.status(500).send("Errore esecuzione Query");
            })
            request.finally(function(){
                client.close();
            })
        }
})

/* ***************** (Sezione 4) DEFAULT ROUTE and ERRORS ******************* */
// gestione degli errori
app.use(function(err, req, res, next) {
    console.log(err.stack); // stack completo    
});

// default route
app.use('/', function(req, res, next) {
    res.status(404)
    if (req.originalUrl.startsWith("/api/")) {
        res.send("Risorsa non trovata");
    }
	else res.send(paginaErrore);
});