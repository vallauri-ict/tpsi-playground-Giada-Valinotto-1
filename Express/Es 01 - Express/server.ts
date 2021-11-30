import * as _http from "http"
import express from "express";
import HEADERS from "./headers.json";
import * as _mongodb from "mongodb";

//const mongoClient = _mongodb.MongoClient;
//const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";

const port : number = 1337; 
let app = express();

const server = _http.createServer(app); //funzione fondamentale richiamata ad ogni richiesta
server.listen(port, function(){
    console.log("server in ascolto sulla porta: " + port);
});

//****** Elenco delle route (listener) associate al metodo app ******/
app.use("*", function (req, res, next) {
    console.log(" -----> " + req.method + " : " + req.originalUrl);
    next();
});
app.get("*", function(req,res,next){
    res.send("This is the response"); //serializza in automatico
})

