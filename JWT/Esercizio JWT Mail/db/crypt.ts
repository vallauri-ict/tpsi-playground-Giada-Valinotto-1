// ts-node crypt.ts

import {MongoClient, ObjectId}  from "mongodb";
import bcrypt from "bcryptjs"

const DBNAME = "mail"
const CONNECTIONSTRING = "mongodb+srv://admin:admin@cluster0.exf0a.mongodb.net/mail?retryWrites=true&w=majority";


let cnt=0;
MongoClient.connect(CONNECTIONSTRING,  function(err, client) { ///Client sarebbe la connessione
    if (err)
        console.log("Errore di connessione al database");
    else {
        const DB = client.db(DBNAME); //Imposto DB e Connection
        const COLLECTION = DB.collection('mail');

        COLLECTION.find().project({"password":1}).toArray(function(err, vet) { //Restituisce ID e Password di tutti i record
			if(err){
				console.log("Errore esecuzione query" + err.message)
				client.close(); //Chiudo la connessione
			}
			else
			{
				for(let item of vet){ //Scorro tutti i record di vet 
					let oid = new ObjectId(item["_id"]); //Definisco un object ID per lìpoter lavorare su ID
					// se lancio una seconda volta lo script NON DEVE FARE NULLA
                    // le stringhe bcrypt inizano con $2[ayb]$ e sono lunghe 60
					let regex = new RegExp("^\\$2[ayb]\\$.{56}$"); //Controllo con cosa inzia la password per controllare se è già criptata o meno
                    // se la password corrente non è in formato bcrypt
					if (!regex.test(item["password"]))     // item[password] è la password in chiaro  
					{
						// Asincrone
						console.log("aggiornamento in corso ... ", item);
						let password = bcrypt.hashSync(item["password"], 10)					
						COLLECTION.updateOne({"_id":oid}, //La query prende l'id e fa updateOne sulla base dell'ID dove al posto della password originale metto quella cifrata
						                     {"$set":{"password":password}}, 
											 function(err, data){
							if(err)
								console.log("errore aggiornamento record", 
							                           item["_id"], err.message)
							else
								aggiornaCnt(vet.length, client)
						})
					}
					else 
						aggiornaCnt(vet.length, client)
				}
				// aggiornaCnt(vet.length)  NOK !! perchè UpdateOne è asincrono 
			}
        });
    }
});


function aggiornaCnt(length, client){
	cnt++;
	if(cnt==length){
		console.log("Aggiornamento eseguito correttamente")
		client.close();
	}	
}