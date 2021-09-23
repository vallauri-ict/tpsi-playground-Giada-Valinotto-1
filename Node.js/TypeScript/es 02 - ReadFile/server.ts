"use strict"

// librerie native
import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";

// librerie non native
import * as _mime from "mime";

const HEADERS = require("./headers.json");

const PORT : number = 1337;
let paginaErrore : string;

// istanza di un server, che mettiamo in ascolto tramite .listen()
var server = _http.createServer(function(req, res) {
    let metodo = req.method;
    let url = _url.parse(req.url, true);
    let risorsa = url.pathname;
    let parametri = url.query;
    console.log(`Richiesta: ${metodo}:${risorsa}, param: ${JSON.stringify(parametri)}`);

    if (risorsa == "/") {
        risorsa = "/index.html";
    }

    if (!risorsa.startsWith("/api/")) {
        risorsa = "./static" + risorsa;
        // lettura di file asincrona
        _fs.readFile(risorsa, (err, data) => {
            // data contiene il contenuto del file
            if (!err) {
                let header = {
                    "Content-Type": _mime.getType(risorsa),
                };
                res.writeHead(200, header);
                res.write(data);
                res.end();
            } else {
                res.writeHead(404, HEADERS.html);
                res.write(paginaErrore);
                res.end();
            };
        });
    } else if (risorsa == "/api/servizio1") {
        // gestione servizio1
        let json = {
            "ris": "ok",
        };

        res.writeHead(200, HEADERS.json);
        // dobbiamo renderlo stringa, poi il client
        // se lo fa da solo grazie a HEADERS.json
        res.write(JSON.stringify(json));
        res.end();
    } else {
        // errore, servizio non esistente

        res.writeHead(404, HEADERS.text);
        res.write("Servizio richiesto non esistente");  
        res.end();
    }
});

server.listen(PORT, () => {
    _fs.readFile("./static/error.html", (err, data) => {
        if (!err) {
            paginaErrore = data.toString();
        } else {
            paginaErrore = "<h1>Pagina non trovata</h1>";
        };
    });
});
console.log("Server in esecuzione sulla porta " + PORT);