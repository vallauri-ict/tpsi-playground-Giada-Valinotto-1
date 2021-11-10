import * as _http from "http"
import { Dispatcher } from "./dispatcher";
import HEADERS from "./headers.json";
import * as _mongodb from "mongodb";
const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";

/* Server HTTP
const port : number = 1337; // node js
const dispatcher : Dispatcher = new Dispatcher();

const server = _http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})
server.listen(port);
console.log("server in ascolto sulla porta: " + port);
*/

// Inserimento di un nuovo record
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
        let db = client.db("5B_Studenti");
        let collection = db.collection("Studenti");
        let student = {"nome":"Giada","hobbies":["nuoto","padel"],"cognome":"Valinotto","residenza":{"citta":"Genola","provincia":"CN","CAP":"12045"},"indirizzo":"Informatica","sezione":"B","lavoratore":false};
        collection.insertOne(student,function(err,data){
            if(!err){
                console.log("INSERT",data);
            }
            else{
                console.log("Errore esecuzione query " + err.message);
            }
            client.close();
        });
    }
    else{
        console.log("Errore nella connessione al DB " + err.message);
    }
});

// Modello di accesso al database
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
        let db = client.db("5B_Studenti");
        let collection = db.collection("Studenti");
        collection.find().toArray(function(err,data){
            if(!err){
                console.log("FIND",data);
            }
            else{
                console.log("Errore esecuzione query " + err.message);
            }
            client.close();
        });
    }
    else{
        console.log("Errore nella connessione al DB " + err.message);
    }
});

// Update di un record
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
        let db = client.db("5B_Studenti");
        let collection = db.collection("Studenti");
        collection.updateOne({"nome":"Fabio"},{$set:{"residenza":"Fossano"}},function(err,data){
            if(!err){
                console.log("UPDATEONE",data);
            }
            else{
                console.log("Errore esecuzione query " + err.message);
            }
            client.close();
        });
    }
    else{
        console.log("Errore nella connessione al DB " + err.message);
    }
});

// Delete di un record
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
        let db = client.db("5B_Studenti");
        let collection = db.collection("Studenti");
        collection.deleteMany({"residenza":"Fossano"},function(err,data){
            if(!err){
                console.log("DELETE",data);
            }
            else{
                console.log("Errore esecuzione query " + err.message);
            }
            client.close();
        });
    }
    else{
        console.log("Errore nella connessione al DB " + err.message);
    }
});