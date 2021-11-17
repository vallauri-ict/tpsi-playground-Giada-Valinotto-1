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

  /************ PROVA DEGLI ESEMPI SULLE DISPENSE *************/

//ESEMPIO 1 
//Si vogliono selezionare i record che hanno status A, raggrupparli secondo il campo cust_id e, per ogni
//gruppo, eseguire la somma del campo amount (importo unitario)
//I nome dei campi devono essere oreceduti da $ SOLO SE SONO USATI A DESTRA DEI :
//Dopo aver fatto i gruppi con $group, il recordset risultante avrà solo 2 colonne: _id e totale.
//Gli altri campi non sono più visibili
 mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
      let db = client.db(DBNAME)
      let collection = db.collection('orders')
      let req = collection.aggregate([
          {"$match":{"status":"A"}},
          {"$group":{"_id":"$cust_id", "totale":{"$sum":"$amount"}}},
          {"$sort":{"totale":-1}}
        ]).toArray();
  
      req.then((data) => {
        console.log('ESEMPIO 1: ', data)
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

//ESEMPIO 2
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
      let db = client.db(DBNAME)
      let collection = db.collection('orders')
      let req = collection.aggregate([
            {"$group":{
                "_id":"$cust_id",
                "media":{"$avg":"$amount"}, //media dei tre record 
                "mediaProdotto":{"$avg":{"$multiply": ["$qta","$amount"]}} //media del prodotto tra la quantità e l'amount
            }}
        ]).toArray();
  
      req.then((data) => {
        console.log('ESEMPIO 2: ', data)
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

  //ESEMPIO 3
  //Conteggio degli unicorni maschi e degli unicorni femmina
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME)
    let collection = db.collection('Unicorns')
    let req = collection.aggregate([
      {"$match":{"gender":{"$exists":true}}},
      //uso match per non visualizzare gli unicorni che non hanno uno specifico gender, ovvero
      //per i quali non esiste il campo gender
          {"$group":{
              "_id":"$gender", //campo sul quale vengono fatti i gruppi
              "totale":{"$sum":1} //somma uno ogni volta 
          }}
      ]).toArray();

    req.then((data) => {
      console.log('ESEMPIO 3: ', data)
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

//ESEMPIO 4
// Calcolare il numero medio di vampiri uccisi dagli unicorni femmina e dagli unicorni maschi
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
      let db = client.db(DBNAME)
      let collection = db.collection('orders')
      let req = collection.aggregate([
            {
              "$group":{
                "_id":{"gender":"$gender"}, //è simile all'utilizzo di un alias 
                "mediaVampiri":{"$avg":"$vampires"}, //media dei tre record 
            }}
        ]).toArray();
  
      req.then((data) => {
        console.log('ESEMPIO 4: ', data)
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

  //ESEMPIO 5
  //Aggregazione su campi multipli
  //La sintassi dell‟esempio precedente consente di raggruppare i record utilizzando chiavi multiple.
 //Esempio: raggruppare gli unicorni per genere e tipo di pelo
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME)
    let collection = db.collection('orders')
    let req = collection.aggregate([
          {"$group":{
              "_id":{"gender":"$gender","hair":"$hair"},
              "nEsemplari":{"$sum":1}, 
          }},
          {"$sort":{"nEsemplari":-1,"id_gender":-1}}
      ]).toArray();

    req.then((data) => {
      console.log('ESEMPIO 5: ', data)
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
//ESEMPIO 6 
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("Unicorns");
    let req = collection.aggregate([{$group:{"_id": {},"mediaVampiri" : {"$avg" : "$vampires"}}},{"$project" : {"_id" : 0, "mediaVampiri" : {$round : "$mediaVampiri"}}}]).toArray();
    req.then(function(data){
      console.log("ESEMPIO 6 : ", data);
    });
    req.catch(function(err){
      console.log("errore nell'esecuzione della query " + err);
    });
    req.finally(function(){
      client.close();
    })
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});

//ESEMPIO 7
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("quizzes");
    let req = collection.aggregate([
      {$project : {"quizAvg" : {$avg : "$quizzes"},"labAvg" : {$avg : "$labs"}, "examAvg" : {$avg : ["$final", "$midterm"]}}},
      {$project : {"_id" : 0, "quizAvg" : {$round : "$quizAvg"}, "labAvg" : {$round : "$labAvg"}, "examAvg" : {$round : "$examAvg"}}},
      {$group : {"_id" : {}, "mediaQuiz" : {$avg : "$quizAvg"}, "mediaLab" : {$avg : "$labAvg"}, "mediaExam": {$avg : "$examAvg"}}}]).toArray();
    req.then(function(data){
      console.log("ESEMPIO 7: ", data);
    });
    req.catch(function(err){
      console.log("errore nell'esecuzione della query " + err);
    });
    req.finally(function(){
      client.close();
    })
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});


//ESEMPIO 7B
/*mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME)
    let collection = db.collection('quizzes')
    let req = collection.aggregate([
          {"$project":{
            "quizAvg":{"$avg":"$quizzes"},
            "labAvg":{"$avg":"$labs"},
            "examAvg":["$midterm","$final"]
          }
          },
          {"$group":{"_id":{}, "mediaQuiz":{"$avg":"$quizAvg"}, "mediaLab":{"$avg":"$labAvg"}, "mediaExam":{"avg":"examAvg"}}}
      ]).toArray();

    req.then((data) => {
      console.log('ESEMPIO 7B: ', data)
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
})*/

//ESEMPIO 8
//Supponendo di avere una collezione di studenti dove, per ogni studente è riportato un array
//enumerativo con l‟elenco dei suoi voti, individuare nome e codice del secondo studente femmina
//con la media più alta
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME)
    let collection = db.collection('students')
    let req = collection.aggregate([
      { "$match": { "genere": "f" } }, //isolo le studentesse di genere femminile
      { "$project": {"nome":1, "classe":1, "media":{"$avg": "$voti"}} }, //con il project decido cosa mostrare
      { "$sort": {"media": -1 } }, //ordino in base alla media dei voti DECRESCENTE, dunque dalla media maggiore alla minore
      { "$limit":2 }, //Prendo solo i primi due risultati
      { "$skip":1 } //Salto il primo record
      ]).toArray();

    req.then((data) => {
      console.log('ESEMPIO 8: ', data)
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

//ESEMPIO 9
//Unwind agisce sui campi vettoriali e restituisce un record per ogni voce
//Utile per le elaborazioni numeriche, che vengono in questo modo semplificate
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME)
    let collection = db.collection('orders')
    let req = collection.aggregate([
      { "$project": { "status": 1, "nDettagli": 1 } },
      { "$unwind": "$nDettagli" },
      { "$group": { "_id": "$status", "sommaDettagli": { "$sum": "$nDettagli" } } }
      ]).toArray();

    req.then((data) => {
      console.log('ESEMPIO 9: ', data)
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

// ELABORAZIONE DELLE DATE
//ESEMPIO 10
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("students");
    let req = collection.aggregate([{$group : {_id : "$classe" , "nAlunni" : {$sum : 1}}}]).toArray();
    req.then(function(data){
      console.log("ESEMPIO 10 : ", data);
    });
    req.catch(function(err){
      console.log("errore nell'esecuzione della query " + err);
    });
    req.finally(function(){
      client.close();
    })
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});

//ESEMPIO 10B
mongoClient.connect(CONNECTIONSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection("students");
    let req = collection.aggregate([{$group : {_id : "$classe", "mediaClasse" : {$avg : {$avg : "$voti"}}}}]).toArray();
    req.then(function(data){
      console.log("ESEMPIO 10B : ", data);
    });
    req.catch(function(err){
      console.log("errore nell'esecuzione della query " + err);
    });
    req.finally(function(){
      client.close();
    })
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});