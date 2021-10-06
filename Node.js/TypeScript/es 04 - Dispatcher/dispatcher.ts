/*Libreria*/
import * as _http from "http"; 
import * as _url from "url"; 
import * as _fs from "fs"; 
import * as _mime from "mime"; 
import * as _querystring from "query-string";
import { addListener } from "process";
import { inherits } from "util";
import { json } from "stream/consumers";
let HEADERS = require("./headers.json");
let paginaErrore : string;
class Dispatcher{
    /*definisco proprietà e metodi*/
    prompt:string=">>>  ";
     //Un listener ha come chiave il nome della risorsa e come valore la callback da eseguire
     // {"nomeRisorsa":"Callback"}
     //I listener sono suddivisi in base al tipo di chiamata
    listeners:any={  //any="Qualunque tipo"
        "GET":{},
        "POST":{},
        "DELETE":{},
        "PUT":{},
        "PATCH":{}
    };

    constructor(){
        init();
    }

    addListener(metodo:string, risorsa:string, callaback:any)
    {
        metodo=metodo.toUpperCase();
       /* if(this.listeners[metodo]) //Controllo che sia diverso da null*/

        if(metodo in this.listeners) //Controllo se il metodo esiste
        {
            //Vado nel vettore del metodo corrispondente, creare una nuova chiave di nome risorsa e con la rispettiva callback
            this.listeners[metodo][risorsa]=callaback;
        }
        else
        {
            throw new Error("Richiesta non valida");
            
        }
    }

    dispatch(req,res){
        let metodo=req.method.toUpperCase();
        if(metodo="GET")
        {
            innerDispatch(req,res);
        }
        else{
            let parametriBody : string ="";
            req.on("data", function(data)
            {
                parametriBody+=data;
            })
            let paramJson={};
            req.on("end", function()
            {
                //provo una conversione json per vedere se i param sono json o URLencode
                try{
                    //se i par sono json, la conversione è andata a buon fine
                    paramJson=JSON.parse(parametriBody);
                }
                catch(errpr)
                {
                    parametriBody= _querystring.parse();
                }
            })
        }
    }
}

//Metto nella classe solo le funzioni che poi devo o posso richiamare dal main
//Le altre vanno dichiarate qui fuori con la sintassi normale
function staticListener(req,res,risorsa)
{
    if(risorsa=="/")
    {
        risorsa= "/index.html"; //le risorse iniziano sempre con lo /
    }
    let fileName ="./static"+risorsa; //i nomi dei file inizano sempre con il percorso -> ./ = "Parti dalla cartella"
    _fs.readFile(fileName, function(err,data){
        if(!err)
        {
            let header= {"Content-Type": _mime.getType(fileName)};
            res.writeHead(200,header); //Non so se è un file html o css, ecc
            res.write(data);
            res.end();
        }
        else
        {
            console.log(`        ${err.code}:${err.message}`);
            //il client si aspetta una pagina
            res.writeHead(404,HEADERS.text);
            res.write("Servizio non trovato");
            res.end();
        }
    });
}

function init()
{
    _fs.readFile("./static/error.html", function(err,data){
    if(!err)
    {
        paginaErrore = data.toString();
    }
    else
    {
        paginaErrore="<h1>Pagina non trovata :(</h1>"
    }
    });
}
function innerDispatch(req,res)
{
    //lettura di motodo, risorsa e parametri
    let metodo = req.method;
    let url = _url.parse(req.url, true);
    let risorsa = url.pathname;
    let parametri = url.query;

    //creo una nuova chiave su req
    req["GET"]=parametri;

    console.log(`${this.prompt} ${metodo}:${risorsa}${JSON.stringify(parametri)}`);

    if(risorsa.startsWith("/api/"))
    {
        if(risorsa in this.listeners[metodo])
        {
            let _callback = this.listeners[metodo][risorsa]; //vado a cercare ciò che devo eseguire con la callback
            _callback(req,res); //lancio in esecuzione la callback
        }
        else
        {
            //Errore 404
            res.writeHead(404,HEADERS.text);
            res.write("Servizio non trovato");
            res.end();
        }
    }
    else
    {
        //Richiesta di una pagina che vado a cercare dal File System
        //Per comodità chiamo una procedura esterna
        staticListener(req,res,risorsa);
    }
}
//Export 
module.exports = new Dispatcher();

