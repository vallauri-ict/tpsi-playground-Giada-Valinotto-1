import * as _http from "http";
import HEADERS from "./headers.json"
import {Dispatcher} from "./dispatcher"
import * as mongodb from "mongodb";
const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B"

let port : number = 1337;

let dispatcher : Dispatcher =  new Dispatcher();

let server = _http.createServer(function(req, res){
    dispatcher.dispatch(req, res);
})
server.listen(port);
console.log("Server in ascolto sulla porta " + port);

//Registrazione del servizio 
dispatcher.addListener("POST", "/api/servizio1", function(req, res){
    let dataStart = new Date(req["BODY"].dataStart);
    let dataEnd = new Date(req["BODY"].dataEnd);

    //QUERY 1 
    mongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (!err) {
      let db = client.db(DB_NAME);
      let collection = db.collection("vallauri");
      collection.find({"$and":[{"$gte":{"dob":dataStart}}, {"$lte":{"dob":dataEnd}}]})
      .project({"nome":1, "classe":1})
      .toArray((err, data) => {
        if (!err) {
          console.log("Query 1", data);
        } else {
            res.writeHead(500,HEADERS.text);
            res.write("Errore esecuzione query");
            res.end();
        }
        client.close();
      });
    } else{
      console.log("Errore connessione al db: " + err.message);
    }
    });  
});

//QUERY 2
mongoClient.connect(CONNECTION_STRING, function (err, client) {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("vallauri");
    let req = collection.aggregate([{
      $project:
      {
        nome: 1,classe:1,
        italiano: { $avg: "$italiano" },
        matematica: { $avg: "$matematica" },
        informatica: { $avg: "$informatica" },
        sistemi: { $avg: "$sistemi" },
      }
    }, {
      $project: {
        nome: 1,classe:1,
        mediaTot: { $avg: ["$italiano", "$matematica", "$informatica", "$sistemi"] }
      }
    },{$group:{_id:"$classe",mediaClasse:{$avg:"$mediaTot"}}},
      {$project:{_id:1,mediaClasse:{$round:["$mediaClasse",2]}}},
      {$sort:{mediaClasse:-1}}
  
  ]).toArray();
    req.then(function (data) {
      console.log("Query 2", data);
    });
    req.catch(function (err) {
      console.log("Errore esecuzione query " + err.message);
    })
    req.finally(function () {
      client.close();
    })
  }
  else {
    console.log("Errore nella connessione al DB " + err.message);
  }
});

//QUERY 4
mongoClient.connect(CONNECTION_STRING, function (err, client) {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("vallauri");
    collection.deleteMany({sistemi:{$in:[3]}},
      (err, data) => {
        if (!err) {
          console.log("Query 4", data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      }
    );
  } else {
    console.log("Errore connessione al db");
  }
});

//QUERY 5 
mongoClient.connect(CONNECTION_STRING, function (err, client) {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("vallauri");
    collection.aggregate([
      {$group:{_id:"$classe", //su cosa fare il gruppo
      giorniAssenza:{$sum:"$assenze"}}}, //cosa considerare
      {$sort:{giorniAssenza:-1}} //ordino i risultati
    ]).toArray(
      (err, data) => {
        if (!err) {
          console.log("Query 5", data);
        } else {
          console.log("Errore esecuzione query " + err.message);
        }
        client.close();
      }
    );
  } else {
    console.log("Errore connessione al db");
  }
});


