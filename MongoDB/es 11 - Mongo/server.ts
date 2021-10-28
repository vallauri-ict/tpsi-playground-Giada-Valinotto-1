import * as http from "http";
import * as _mongodb from "mongodb";
import HEADERS from "./headers.json";
const _mongoClient = _mongodb.MongoClient;

// due modelli di import export:
//  - es5 (commonjs) -> require per le export
//  - es6 -> import per le export, require() è reso disponibile grazie a types/node

import { Dispatcher } from "./dispatcher";

const dispatcher:Dispatcher = new Dispatcher();

const PORT:number = 1337; //La porta rimane 1337
                          //Sarà l'applicazione Node a prende i dati da MongoDB

const server = http.createServer((req:any, res:any) => {
    dispatcher.dispatch(req, res);
});

server.listen(PORT);

console.log("Server in ascolto sulla porta " + PORT);

//Node.js può lavorare sia come web server che come utility.
//Per un semplice esempio, uutilizziamo un'utility.



/*********** INSERIMENTO DI UN NUOVO RECORD ************/
_mongoClient.connect("mongodb://127.0.0.1:27017",function(err,client){ 
// console.log(err); -> Se error è undefined, non si sono verificati errori
if(!err){ 
    let db = client.db("5b_Studenti"); //client è l'oggetto che punta al DB
    let collection = db.collection("Studenti"); 
    let student = {"nome":"Bianca","cognome":"Velardi","hobbies":["cheerleading","gaming"],"indirizzo":"informatica","sezione":"B","lavoratore":false, "residenza":{"citta":"ALlba", "provincia":"Cuneo"}};
    collection.insertOne(student, function(err,data){
        if(!err)
        {
            console.log(data);
        }
        else
        {
            console.log("Record non aggiunto: " + err.message);
        }
        client.close();
    }); 
}
else
{
    console.log("Errore nella connessione al database: "+ err.message);
}
});
/*********** MODELLO DI ACCESSO AL DATABASE ************/

_mongoClient.connect("mongodb://127.0.0.1:27017",function(err,client){ 
// console.log(err); -> Se error è undefined, non si sono verificati errori
if(!err){ 
    let db = client.db("5b_Studenti"); //client è l'oggetto che punta al DB
    let collection = db.collection("Studenti"); 
    collection.find().toArray(function(err, data){//prendo tutti gli elementi e li converto in array enumerativo
        if(!err)
        {
            console.log(data);
        }
        else
        {
            console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
    }); 
}
else
{
    console.log("Errore nella connessione al database: "+ err.message);
}
});

