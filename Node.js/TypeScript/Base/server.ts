import * as http from "http";

import HEADERS from "./headers.json";

// due modelli di import export:
//  - es5 (commonjs) -> require per le export
//  - es6 -> import per le export, require() è reso disponibile grazie a types/node

import { Dispatcher } from "./dispatcher";

let dispatcher:Dispatcher = new Dispatcher();

const PORT:number = 1337;

let server = http.createServer((req:any, res:any) => {
    dispatcher.dispatch(req, res);
});

server.listen(PORT);



console.log("Server in ascolto sulla porta " + PORT);

// ======= registrazione dei servizi =======
dispatcher.addListener("POST", "/api/servizio1", (req, res) => {
    res.writeHead(200, HEADERS.json);
    let nome = req["BODY"].nome;
    res.end(JSON.stringify({
        "ris": nome,
        "id": req["GET"].id
    }));
});

dispatcher.addListener("GET", "/api/servizio2", (req, res) => {
    res.writeHead(200, HEADERS.json);
    let nome = req["GET"].nome;
    res.end(JSON.stringify({
        "ris": nome
    }));
});