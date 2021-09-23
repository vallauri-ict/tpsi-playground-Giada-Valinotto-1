"use strict"

const _http = require("http");
const _url = require("url");
const _fs = require("fs"); //modulo per accedere al file system
const _mime = require("mime"); //libreria che ci consente di gestire le diverse estensioni possibili
const HEADERS = require("./headers.json")
const _color=require("colors");

const PORT = 1337;
let paginaErrore; //NON può essere una costante

var server = _http.createServer(function(req, res) {
//lettura di motodo, risorsa e parametri
let metodo = req.method;
let url = _url.parse(req.url, true);
let risorsa = url.pathname;
let parametri = url.query;
console.log(`Richiesta: ${metodo} - ${risorsa}, parametri: ${JSON.stringify(parametri)}`);
//La libreria mime gestisce il problema delle estensioni -> installata

//L'header cambia a seconda del tipo di risposta -> Mi vieta di usare un ciclo
//Tutte le richieste per un servizio, per convenzione, iniziano con /api/
if(risorsa=="/")
{
    risorsa="/index.html";
}
if(!risorsa.startsWith("/api/")) //in questo caso si tratta di una pagina
{
    risorsa="./static" + risorsa; //lo / ad inizio di risorsa è già messo in automatico dal Browser
    _fs.readFile(risorsa, function(error, data){ //error -> codice di errore data -> contenuto risorsa
        if(!error)
        {
            let header = {"Content-Type": _mime.getType(risorsa)};
            res.writeHead(200, header);
            res.write(data);
            res.end();
        }
        else{
                res.writeHead(404, HEADERS.html);
                res.write(paginaErrore);
                res.end();
        }
    }) 
}
else if(risorsa== "/api/servizio1")
{
    //gestione servizio
    let json = {"ris":"ok"};
    res.writeHead(200,HEADERS.json)
    res.write(JSON.stringify(json));
    res.end();
}
else{
 res.writeHead(404, HEADERS.text)
 res.wwrite("Servizio inesistente")
 res.end();
}
});

server.listen(PORT), function(){
    _fs.readFile("./static/error.html", function(errore, data)
    {
        //se va in errore vuol dire che non c'è il file altrimenti mando la pagina
        if(!errore)
        {
            paginaErrore=data;
        }
        else
        {
            paginaErrore="<h1>Pagina non trovata</h1>";
        }
    })
};
console.log("Server in esecuzione sulla porta " +PORT);

