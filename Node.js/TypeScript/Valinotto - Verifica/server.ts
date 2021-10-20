"use strict"
import * as http from "http";
import * as _url from 'url'
import * as _fs from 'fs'
import * as _mime from 'mime';
import FACTS from "./facts.json";
import HEADERS from "./headers.json";

// due modelli di import export:
//  - es5 (commonjs) -> require per le export
//  - es6 -> import per le export, require() è reso disponibile grazie a types/node

import { Dispatcher } from "./dispatcher";

let dispatcher:Dispatcher = new Dispatcher();

const PORT:number = 1337;

const categories = ["career","money","explicit","history","celebrity","dev","fashion","food","movie","music","political","religion","science","sport","animal","travel"]

const icon_url = "https://assets.chucknorris.host/img/avatar/chuck-norris.png";
const api_url = "https://api.chucknorris.io"
const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]

let server = http.createServer((req:any, res:any) => {
    dispatcher.dispatch(req, res);
});

server.listen(PORT);


console.log("Server in ascolto sulla porta " + PORT);

// ======= registrazione dei servizi =======

dispatcher.addListener("GET", "/api/categories", function(req, res){
    res.writeHead(200,HEADERS.json);
    res.write(JSON.stringify(categories));
    res.end();
});

dispatcher.addListener("GET", "/api/facts", (req, res) => {
    let param = req["GET"].category;
    let facts = [];
    for (const fact of FACTS.facts) {
        if(fact.categories.includes(param)){
            facts.push(fact);
        }
    }
    res.writeHead(200,HEADERS.json);
    res.write(JSON.stringify(facts));
    res.end();
  });