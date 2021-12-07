"use strict"
import * as http from "http";
import * as fs from "fs";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";
import * as mongodb from "mongodb";
import { ObjectID } from "bson";
const mongoClient = mongodb.MongoClient;

const dispatcher: Dispatcher = new Dispatcher();

// const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const CONNECTIONSTRING = "mongodb+srv://ValinottoGiada:Valinotto1208@cluster-valinotto.mkzyu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const DBNAME = "5B";

// query 1
//Trovare gli unicorni che hanno un peso compreso tra 700 e 800
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.find({"weight": {"$lte": 800, "$gte": 700}}).toArray((err, data) => {
            if (!err) {
                console.log("QUERY 1: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 2
//Trovare gli unicorni di genere maschile che amano l’uva e che hanno ucciso più di 60 vampiri
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        // se volessimo cercare l'unicorno che vuole esattamente olo l'uva
        // (o anche altra roba che aggiungiamo nel vettore) usiamo "loves": ["grape"]
        
        // se volessimo cercare l'unicorno che vuole o uva o anguria 
        // (ed eventualmente altra roba) usiamo "loves": {"$in": ["grape", "watermelon"]}

        // ATTENZIONE PER TROVARE UN UNICORNO CHE AMA SOLO GRAPE E WATERMELON
        // NON CI SONO DEGLI OPERATORI PRECISI !!!
        collection.find({"$and": [{"gender": "m"}, {"loves": "grape"}, {"vampires": {"$gt": 60}}]}).toArray((err, data) => {
            if (!err) {
                console.log("QUERY 2: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 3
//Trovare gli unicorni di genere femminile o che pesano meno di 700 kg
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.find({"$or": [{"gender": "f"}, {"weight": {"$lte": 700}}]}).toArray((err, data) => {
            if (!err) {
                console.log("QUERY 3: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 4
//Trovare gli unicorni che amano (l’uva o le mele) e che hanno ucciso più di 60 vampiri
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.find({"$and": [{"loves": {"$in": ["apple", "grape"]}}, {"vampires": {"$gte": 60}}]}).toArray((err, data) => {
            if (!err) {
                console.log("QUERY 4: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 5
//Trovare gli unicorni che amano (l’uva e il watermelon) e che hanno ucciso più di 60 vampiri
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.find({"loves": {"$all": ["watermelon", "grape"]}}).toArray((err, data) => {
            if (!err) {
                console.log("QUERY 5: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 6 A
//Trovare gli unicorni che hanno il pelo marrone oppure grigio
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.find({"$or": [{"hair": "brown"}, {"hair": "grey"}]}).toArray((err, data) => {
            if (!err) {
                console.log("QUERY 6 A: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 6 B
//Trovare gli unicorni che hanno il pelo marrone oppure grigio
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.find({"hair": {"$in": ["grey", "brown"]}}).toArray((err, data) => {
            if (!err) {
                console.log("QUERY 6 B: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 7
// Trovare gli unicorni non vaccinati
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.find({"$and": [{"vaccinated": {"$exists": true}}, {"vaccinated": true}]}).toArray((err, data) => {
            if (!err) {
                console.log("QUERY 7: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 9
// Trovare gli unicorni di genere femminile il cui nome inizia con la lettera A
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        let regex = new RegExp("^A", "i");
        collection.find({"$and": [{"name": {"$regex": regex}}, {"gender": "f"}]}).toArray((err, data) => {
            if (!err) {
                console.log("QUERY 9: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 10
//Trovare un unicorno sulla base dell’ID
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.find({"_id": new mongodb.ObjectId("61823ae5e294691b96e1ee96")}).toArray((err, data) => {
            if (!err) {
                console.log("QUERY 10: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 11 A
//Visualizzare nome e vampiri uccisi per tutti gli unicorni di genere maschile
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.find({"gender": "m"}).project({"name": 1, "vampires": 1, "_id": 0}).toArray((err, data) => {
            if (!err) {
                console.log("QUERY 11 A: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 11 B
// Visualizzare i dati precedenti in modo ordinato sul n. decrescente di vampiri uccisi
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        // il secondo parametro del sort è chiamato in causa quando si trova
        // un parimerito nel primo
        collection.find({"gender": "m"}).project({"name": 1, "vampires": 1, "_id": 0}).sort({"vampires": -1, "name": 1}).toArray((err, data) => {
            if (!err) {
                console.log("QUERY 11 B (" + data.length + " Record): ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 11 C
// Rispetto al recordset precedente, visualizzare soltanto i primi 3 record
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        // il secondo parametro del sort è chiamato in causa quando si trova
        // un parimerito nel primo
        collection.find({"gender": "m"}).project({"name": 1, "vampires": 1, "_id": 0}).sort({"vampires": -1, "name": 1}).skip(1).limit(3).toArray((err, data) => {
            if (!err) {
                console.log("QUERY 11 C (" + data.length + " Record): ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 12
// Contare il numero di vampiri che pesano più di 500 kg
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.find({"weight": {"$gt": 500}}).count((err, data) => {
            if (!err) {
                console.log("QUERY 12: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 13
// Visualizzare peso e pelo dell’unicorno Aurora (findOne)
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.findOne({"name": "Aurora"}, {"projection": {"hair": 1, "weight": 1}}, (err, data) => {
            if (!err) {
                console.log("QUERY 13: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// query 14
//Visualizzare i frutti amati dagli unicorni di genere femminile (ogni frutto una sola volta)
//distinct è un'alternativa a find la cui utilità è analoga al distinct SQL
//è molto leggero e permette la restituzione di un unico campo
//restituisce un vettore di stringhe senza aggiunta di .ToArray 
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.distinct("loves", {"gender":"f"}, (err, data) => {
            if (!err) {
                console.log("QUERY 14: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

//query 15
//Inserire un nuovo unicorno e, al termine dell’inserimento, cancellarlo nella stessa query
//le query sequenziali vanno eseguite una nella 
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.insertOne({"name":"Deto", "gender":"m", "loves":["apple","lemon"]}, (err, data) => {
            if (!err) {
                console.log("QUERY 15: ", data);
                //eliminazione unicorno
                collection.deleteMany({"name":"Deto"}, (err,data)=> 
                {
                    if(!err)
                    {
                        console.log("QUERY 15B", data)
                    }
                    else
                    {
                        console.log("Errore nell'esecuzione della query");
                    }
                    client.close(); //NB: la connessione va chiusa nella query più interna
                });
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

//query 16
//Incrementare di 1 il numero dei vampiri uccisi da Pilot
//metodo UPDATE (uodateOne e updateMany)
//Se il campo vampires non esiste lo crea e lo setta ad 1
//{"upsert":true} crea automaticamente il record Pilot se non viene trovato e setta vampires a 1
// di default non fa nulla
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.updateOne({"name":"Pilot"},{"$inc":{"vampires":1},},{"upsert":true}, (err, data) => { 
            if (!err) {
                console.log("QUERY 16: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

//query 17
//Aggiungere che l’unicorno Aurora ama anche le carote ed il suo peso è aumentato di 10kg
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err){
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.updateOne({"name":"Aurora"},{"$addToSet":{"loves":"carrot"},"$inc":{weight:10}},function(err,data){
            if(!err)
            {
                console.log("QUERY 17",data);
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

//query 18
//Incrementare di 1 il numero di vampiri uccisi dall’unicorno Pluto. Se il record non esiste crearlo
//per la cereazione se il record non esiste si usa il terzo parametro UPSERT
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.updateOne({"name":"Pluto"},{"$inc":{"vampires":1},},{"upsert":true}, (err, data) => { 
            if (!err) {
                console.log("QUERY 18: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

//query 19
// Aggiungere il campo vaccinated=false a tutti gli unicorni che non dispongono del campo vaccinated
// uso exists per verificare l'esistenza di un campo
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.updateMany({vaccinated: {"$exists": false}}, {"$set":{"vaccinated":true}}, (err, data) => {
            if (!err) {
                console.log("QUERY 19: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

//query 20
//Rimuovere gli unicorni che amano sia l’uva sia le carote
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.deleteMany({"loves": {"$all":['grape','carrot']}}, (err, data) => {
            if (!err) {
                console.log("QUERY 20: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

//query 21
//Trovare l’unicorno femmina che ha ucciso il maggior numero di vampiri. Restituire nome e numero di vampiri uccisi
//faccio un ordinamento decrescente sul campo vampires e prendo solo il primo
//il findOne non accetta in coda il .project -> si rimedia con projection inserito come parametro -> REF QUERY 13
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.find({"gender":"f"}).sort({"vampires":-1}).limit(1).project({"name":1, "vampires":1, "_id":0}).toArray((err, data) => { //find() deve essere il primo, ToArray() l'ultimo
            if (!err) {
                console.log("QUERY 21: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

//query 22
//Sostituire completamente il record dell’unicorno Pluto con un nuovo record
//sostituire un record necessita del medoto replace
//replaceOne cancella tutti i campi del record tranne id, dunque vanno re-inseriti tutti i campi da mantenere
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("unicorns");
        collection.replaceOne({"name":"Pluto"},{"name":"Pluto","loves":["apple","watermelon","lemon","carrot"],"residenza":"Fossano"},(err, data) => {
            if (!err) {
                console.log("QUERY 22: ", data);
            } else {
                console.error("Errore esecuzione query: " + err.message);
            }
            client.close();
        });
    } else {
        console.error("Errore nella connessione al database: " + err.message);
    }
});

// Query 1 con uso delle promise 
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
      let db = client.db(DBNAME)
      let collection = db.collection('unicorns')
      let req = collection.find({ weight: { $lte: 800, $gte: 700 } }).toArray()
  
      req.then((data) => {
        console.log('Query 1B', data)
      })
      req.catch((err) => {
        console.log('Errore esecuzione query: ' + err.message)
      })
  
      req.finally(() => {
        client.close()
      })
    } else {
      console.log('Errore connessione al db: ' + err.message)
    }
  })