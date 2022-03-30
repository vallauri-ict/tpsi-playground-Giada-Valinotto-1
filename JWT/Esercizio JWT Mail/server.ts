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

// ***************************** Costanti *************************************
const app = express();
const CONNECTION_STRING = environment.CONNECTION_STRING_LOCAL
const DBNAME = "mail"
const DURATA_TOKEN = 60 // sec
const HTTP_PORT = 1337
const HTTPS_PORT = 1338
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8"); //Lette dalla cartella keys
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const credentials = { "key": privateKey, "cert": certificate };
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





/* ********************** (Sezione 3) USER ROUTES  ************************** */




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