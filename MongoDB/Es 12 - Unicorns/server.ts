"use strict"

import * as http from "http";
import * as fs from "fs";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";
import * as mongodb from "mongodb";
import { ObjectID } from "bson";
const mongoClient = mongodb.MongoClient;

const dispatcher: Dispatcher = new Dispatcher();

const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";

// query 1
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
//distinct è un'alternativa a find la cui utilità è analoga al distinct SQL
//è molto leggero e permette la restituzione di un unico campo
//restituisce un vettore di stringhe senza aggiunta di .ToArray 
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
//le query sequenziali vanno eseguite una nella 
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
//metodo UPDATE (uodateOne e updateMany)
//Se il campo vampires non esiste lo crea e lo setta ad 1
//{"upsert":true} crea automaticamente il record Pilot se non viene trovato e setta vampires a 1
// di default non fa nulla
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
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
mongoClient.connect(CONNECTIONSTRING, function (err, client) {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection("Unicorns");
        collection.updateOne({"name":"Aurora"},{"$addToSet":{"loves":"carrots"}} (err, data) => {
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