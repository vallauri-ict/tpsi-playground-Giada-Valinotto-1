/*Libreria*/
import * as _http from "http"; 
import * as _url from "url"; 
import * as _fs from "fs"; 
import * as _mime from "mime"; 
import { addListener } from "process";
let HEADERS = require("headers.json");
let paginaErrore : string;
class Dispatcher{
    /*definisco proprietà e metodi*/
    prompt:string=">>>";
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
    constructor(){}
    addListener(metodo:string, risorsa:string, callaback:any)
    {
        metodo=metodo.toUpperCase();
       /* if(this.listeners[metodo]) //Controllo che sia diverso da null
        {
            
        }*/
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
}