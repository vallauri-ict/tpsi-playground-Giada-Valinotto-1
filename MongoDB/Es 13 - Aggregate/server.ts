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

//Query di riferimento
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
      let db = client.db(DBNAME)
      let collection = db.collection('Unicorns')
      let req = collection.find({ weight: { $lte: 800, $gte: 700 } }).toArray()
  
      req.then((data) => {
        console.log('Esempio: ', data)
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
  /************ PROVA DEGLI ESEMPI SULLE DISPENSE *************/

  //Si vogliono selezionare i record che hanno status A, raggrupparli secondo il campo cust_id e, per ogni
 //gruppo, eseguire la somma del campo amount (importo unitario)
