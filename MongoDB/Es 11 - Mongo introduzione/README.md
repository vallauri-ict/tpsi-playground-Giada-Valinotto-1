# ES 11 - INTRODUZIONE A MONGODB

## Descrizione e finalità
Esercizio introduttivo volto a familiarizzare con **MongoDB** e **MongoDB Compass**, l'interfaccia grafica di MongoDB.

È stato scelto di utilizzare come esempio il database 5b_Studenti contenente la collezione Studenti, la quale contiene alcuni dati relativi agli studenti frequentanti la classe 5B.

------------------------------------------------------------------------------------------------

### Accesso ai dati da Node.js tramite il Driver MongoDB
```
npm install mongodb
var mongo = require("mongodb");
var mongoClient = mongo.MongoClient;
```
### Connessione al database e lettura dei dati
```javascript
_mongoClient.connect("mongodb://127.0.0.1:27017",function(err,client){ 
if(!err){ 
    let db = client.db("5b_Studenti"); 
    let collection = db.collection("Studenti"); 
    collection.find().toArray(function(err, data){
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
```

### Scrittura di dati sul database
```javascript
_mongoClient.connect("mongodb://127.0.0.1:27017",function(err,client){ 
if(!err){ 
    let db = client.db("5b_Studenti");
    let collection = db.collection("Studenti"); 
    let student = {"nome":"nomeStudente","cognome":"cognomeStudente","hobbies":["cheerleading","gaming"],"indirizzo":"informatica","sezione":"B","lavoratore":false, "residenza":{"citta":"ALlba", "provincia":"Cuneo"}};
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
```

### Modifica di dati sul database
```javascript
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
```

### Eliminazione di dati sul database
```javascript
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
```

_stud. Giada Valinotto, 5B Informatica 2021/2022_
