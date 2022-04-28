//#region import
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import * as bodyParser from "body-parser";
import express from "express";
import * as mongodb from "mongodb";
import cors from "cors";
import { createPrivateKey } from "crypto";
import nodemailer from "nodemailer";
import { getEnvironmentData } from "worker_threads";
import environment from "./environment.json";
//#endregion

//#region mongoDB
const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING =
  process.env.MONGODB_URI ||
  "mongodb+srv://admin:admin@cluster0.exf0a.mongodb.net/recipeBook?retryWrites=true&w=majority";
// const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
// const CONNECTION_STRING =
//   "mongodb+srv://admin:admin@cluster0.niwz6.mongodb.net/5B?retryWrites=true&w=majority";
const DB_NAME = "recipeBook";
//#endregion

const PORT: number = parseInt(process.env.PORT) || 1337;
const portHttps: number = 1338;

const app = express();
let privateKey = fs.readFileSync("keys/privateKey.pem", "utf-8");
let certificate = fs.readFileSync("keys/certificate.crt", "utf-8");
const credentials = {"key": privateKey, "cert": certificate}

const serverHttp = http.createServer(app);
const serverHttps = https.createServer(credentials, app);

serverHttp.listen(PORT, () => {
  init();
});

serverHttps.listen(portHttps, () => {
  console.log(`Server HTTP in ascolto sulla porta: ${PORT}`);
  console.log(`Server HTTPS in ascolto sulla porta: ${portHttps}`);
  init();
});

let paginaErrore = "";
let message = "";
fs.readFile("./message.html", (err, data) => {
  if (!err) message = data.toString();
  //In caso di errore la variabile message rimane vuota
});

function init() {
  fs.readFile("./static/error.html", (err, data) => {
    if (!err) paginaErrore = data.toString();
    else paginaErrore = "<h2>Risorsa non trovata</h2>";
  });
}

/*  ******************************************
    //  elenco delle routes middleware
    ****************************************** */

//  1. Log
app.use("/", (req, res, next) => {
  console.log("---> ", req.method + ": " + req.originalUrl);
  next();
});

//  2. Static route
app.use("/", express.static("./static")); //  next fa in automatico

//  3. Route lettura paramentri post
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({ extended: true }));

//  4. Log dei parametri
app.use("/", (req, res, next) => {
  if (Object.keys(req.query).length > 0) console.log("GET --->", req.query);
  if (Object.keys(req.body).length > 0) console.log("BODY --->", req.body);
  next();
});

//  5. Connessione al DB
app.use("/", (req, res, next) => {
  mongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (err) res.status(503).send("DB connection error");
    else {
      req["client"] = client;
      next();
    }
  });
});

//  6. Middleware cors
const whitelist = [
  "http://localhost:4200",
  "http://localhost:1337",
  "https://localhost:1338",
  "https://valinotto-giada-crud-server.herokuapp.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    } else return callback(null, true);
  },
  credentials: true,
};
app.use("/", cors(corsOptions));

/*  ******************************************
    elenco delle routes di risposta al client
    ****************************************** */

let transporter = nodemailer.createTransport({"service":"gmail",
                                              "auth": environment.MAIL_CREDENTIALS})    
app.post("/api/newmail", function(req,res,next){
let msg =message.replace("__user", "Pippo").replace("__password","Pippo");
let mailOptions = {
                    "from":environment.MAIL_CREDENTIALS.user,
                    "to": req.body.to,
                    "subject":req.body.sobject,
                    //"text":msg //senza formattazione HTML, va bene per testo normale
                    "html":msg,
                    "attachments": [
                                    {"filename":"QRcode.png", //personalizzabile
                                      "path":"./qrCode.png"}
                                   ]
                  }
transporter.sendMail(mailOptions, function(err,data){
//risposta al client
if(!err)
{
  console.log("ok");
  res.send({"ris":"ok"});
}
else{
  res.status(500).send("Errore invio mail: "+err.message);
}
})
})

//  middleware di intercettazione dei parametri
let currentCollection: string = "";
let id: string = "";

app.use("/api/:collection/:id?", (req, res, next) => {
  currentCollection = req.params.collection;
  id = req.params.id;
  next();
});

//  lettura delle collezioni presenti nel db
app.get("/api/getCollections", (req, res, next) => {
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collections = db
    .listCollections()
    .toArray()
    .then((data) => res.send(data))
    .catch((err) => res.status(503).send("QUERY: Syntax error"))
    .finally(() => req["client"].close());
});

//  listener specifici



app.get("/api/*", (req, res, next) => {
  if (currentCollection) {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection(currentCollection);
    if (!id) {
      collection
        .find(req["query"])
        .toArray()
        .then((data) => res.send(data))
        .catch((err) => res.status(503).send("QUERY: Syntax error"))
        .finally(() => req["client"].close());
    } else {
      const oId = new mongodb.ObjectId(id);
      collection
        .findOne({ _id: oId })
        .then((data) => res.send(data))
        .catch((err) => res.status(503).send("QUERY: Syntax error"))
        .finally(() => req["client"].close());
    }
  } else {
    res.status(400).send("Parametro mancante: collection");
    req["client"].close();
  }
});

app.post("/api/*", (req, res, next) => {
  if (currentCollection) {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection(currentCollection);
    collection
      .insertOne(req["body"])
      .then((data) => res.send(data))
      .catch((err) => res.status(503).send("QUERY: Syntax error"))
      .finally(() => req["client"].close());
  }
});

app.delete("/api/*", (req, res, next) => {
  if (currentCollection) {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection(currentCollection);
    const oId = new mongodb.ObjectId(id);
    collection
      .deleteOne({ _id: oId })
      .then((data) => res.send(data))
      .catch((err) => res.status(503).send("QUERY: Syntax error"))
      .finally(() => req["client"].close());
  }
});

app.patch("/api/*", (req, res, next) => {
  if (currentCollection) {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection(currentCollection);
    const oId = new mongodb.ObjectId(id);
    collection
      .updateOne({ _id: oId }, { $set: req["body"] })
      .then((data) => res.send(data))
      .catch((err) => res.status(503).send("QUERY: Syntax error"))
      .finally(() => req["client"].close());
  }
});

app.put("/api/*", (req, res, next) => {
  if (currentCollection) {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection(currentCollection);
    const oId = new mongodb.ObjectId(id);
    collection
      .replaceOne({ _id: oId }, req["body"])
      .then((data) => res.send(data))
      .catch((err) => res.status(503).send("QUERY: Syntax error"))
      .finally(() => req["client"].close());
  }
});

/*  ******************************************
    default route e route di gestione degli errori
    ****************************************** */
app.use("/", (err, req, res, next) => {
  console.log("**** ERRORE SERVER ***** " + err); //  da correggere
});
