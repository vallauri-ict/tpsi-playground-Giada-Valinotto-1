//questo file è il main
"use strict"

import * as _http from "http";
import {HEADERS} from "./headers";
import {notizie} from "./notizie"; //Lasciando json, sarebbe import notizie from "./notizie.json"
import * as _fs from "fs";
import * as _mime from "mime";
let paginaErrore:string;
//NB: esportiamo in questa maniera perchè in dispatcher non c'è alcuna funzione
//o metodo o property al di fuori della classe dispatcher in se
//nel caso in cui ci siano più funzioni, vedere esercizio 3.
import {Dispatcher} from "./dispatcher";
const PORT:number = 1337;

let dispatcher = new Dispatcher();

let server = _http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})

server.listen(PORT);
console.log("Server in ascolto sulla porta " + PORT);

//aggiungo tutti i listener
dispatcher.addListener("GET","/api/elenco",function(req,res){
    //invio la risposta
    res.writeHead(200,HEADERS.json);
    res.write(JSON.stringify(notizie));
    res.end();
})

dispatcher.addListener("POST", "/api/dettagli", function(req,res){
    let risorsa = "./news/" + req["BODY"].nomeFile;
    _fs.readFile(risorsa, function (err, data) {
        if (!err) {
          res.writeHead(200, HEADERS.json);
          res.write(JSON.stringify({"file":`${data}`}));
        } else {
          res.writeHead(404, HEADERS.html);
          res.write("<h1>File non trovato</h1>");
        }
        res.end();
      });
})
