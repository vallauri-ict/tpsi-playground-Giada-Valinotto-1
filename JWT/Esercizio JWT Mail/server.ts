"use strict"

// ***************************** Librerie *************************************
import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import body_parser from "body-parser";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import cloudinary, { UploadApiResponse } from "cloudinary";
import {MongoClient, ObjectId}  from "mongodb";
import bcrypt from "bcryptjs" //cifratura
import jwt from "jsonwebtoken" //gestione web token
import environment from "./environment.json"

// ***************************** Costanti *************************************
const app = express();
const CONNECTION_STRING = environment.CONNECTION_STRING_ATLAS
const DBNAME = "mail"
const DURATA_TOKEN = 60 // sec
const HTTP_PORT = 1337
const HTTPS_PORT = 1338
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const jwtKey = fs.readFileSync("keys/jwtKey.pem", "utf8");
const credentials = { "key": privateKey, "cert": certificate };
cloudinary.v2.config({
	cloud_name: environment.CLOUDINARY.CLOUD_NAME,
	api_key: environment.CLOUDINARY.API_KEY,
	api_secret: environment.CLOUDINARY.API_SECRET,
})



// ***************************** Avvio ****************************************
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(HTTPS_PORT, function() {
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
app.response["log"] = function(err){console.log(`*** Error *** ${err.message}`)}



/* *********************** (Sezione 1) Middleware ********************* */
// 1. Request log
app.use("/", function(req, res, next) {
    console.log("** " + req.method + " ** : " + req.originalUrl);
    next();
});


// 2 - route risorse statiche
app.use("/", express.static('./static'));


// 3 - routes di lettura dei parametri post
app.use("/", body_parser.json({ "limit": "10mb" }));
app.use("/", body_parser.urlencoded({"extended": true, "limit": "10mb"}));


// 4 - log dei parametri 
app.use("/", function(req, res, next) {
    if (Object.keys(req.query).length > 0)
        console.log("        Parametri GET: ", req.query)
    if (Object.keys(req.body).length != 0)
        console.log("        Parametri BODY: ", req.body)
    next();
});


// 5. cors accepting every call
const corsOptions = {
    origin: function(origin, callback) {
          return callback(null, true);
    },
    credentials: true
};
app.use("/", cors(corsOptions));


// 6 - binary upload
app.use("/", fileUpload({
    "limits": { "fileSize": (10 * 1024 * 1024) } // 10*1024*1024 // 10 M
}));



/* ***************** (Sezione 2) middleware relativi a JWT ****************** */
//gestione login 
app.post("/api/login", function(req, res, next){
    MongoClient.connect(CONNECTION_STRING, function(err, client){
        if(err){
            res.status(501).send("Errore connesione database")["log"](err); //log dell'errore
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("mail");
            let username = req.body.username;
            //controllo keysUnsensitive username
            let regex = new RegExp("^"+username+"$","i")
            collection.findOne({"username" : regex}, function(err, dbUser){
                console.log("DBUSER -> " + dbUser);
                if(err){
                    res.status(500).send("Errore esecuzione query")["log"](err); //log dell'errore
                }
                else{
                    if(dbUser){
                        //non bisogna passare la chiave in chiaro ma bisogna 
                        //cifrarla dal client
                        if(req.body.password){
                            if(bcrypt.compareSync(req.body.password, dbUser.password)){
                                let token = creaToken(dbUser);
                                res.setHeader("authorization", token);
                                res.send({"ris":"ok"});
                            } 
                            else{
                                res.status(401).send("Password non valida")
                            }
                        }
                        else{
                            res.status(401).send("Password mancante")
                        }  
                    }
                    else{
                        res.status(401).send("Username non valido"); //log dell'errore 
                    }
                }
            });
        }
    })
})


function creaToken(dbUser){
    //getTime restituisce i millisecondi, divisi per mille ottengo i secondi
    let data = Math.floor(((new Date()).getTime()) / 1000);
    let payload = {
        "_id" : dbUser._id,
        "username" : dbUser.username,
        "iat" : dbUser.iat || data ,
        "exp" : data + DURATA_TOKEN
    }
    //return token
    return jwt.sign(payload, jwtKey);       
}

app.use("/api/", function(req, res, next){
    let token ;
    if(req.headers.authorization){
        token = req.headers.authorization;
        //JWT.verify inietta il payload del token alla funzione di callback
        jwt.verify(token, jwtKey, function (err, payload) {
            if(err){
                res.status(403).send("Unauthorized: token non valido");
            }
            else{
                let newToken = creaToken(payload);
                res.setHeader("authorization", newToken);
                req["payload"] = payload;
                next();
            }
        })    
    }
    else{
        res.status(403).send("token assente");
    }
})


/* ********************** (Sezione 3) USER ROUTES  ************************** */
//gestione elencoMail 
app.get("/api/elencoMail", function(req, res, next){
    MongoClient.connect(CONNECTION_STRING, function(err, client){
        if(err){
            res.status(503).send("Errore connessione database");
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("mail");
            const _id = req["payload"]._id;
            var oid = new ObjectId(_id);
            let request = collection.findOne({"_id":oid})
            request.then(function(data){
                res.send(data.mail.reverse())
            })
            request.catch(function(){
                res.status(500).send("Errore esecuzione jquery")
            })
            request.finally(function(){
                client.close();
            })  
        }
    })
})

// gestione newMail
app.post("/api/newMail", function(req, res, next){
    MongoClient.connect(CONNECTION_STRING, function(err, client){
        if(err){
            res.status(503).send("Errore connessione database");
        }
        else{
            const db = client.db(DBNAME);
            const collection = db.collection("mail");

            
            let mittente = req["payload"].username
            let mail = {"from":mittente,"subject":req.body.subject,"body":req.body.message};

            let request = collection.updateOne({"username":req.body.to}, {$push:{"mail":mail}})

            request.then(function(data){
                res.send({"ris":"ok"});
                
            })
            request.catch(function(){
                res.status(500).send("Errore esecuzione jquery");
            })
            request.finally(function(){
                client.close();
            })  
        }
    })
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