import * as mongodb from "mongodb";

const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

//2
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("Unicorns")
      .insertOne(
        {"name":"Pippo", "dob":new Date(),"gender":"m","loves": ["sugar"],"weight":80}
      )
      .then((data) => console.log("Query 2", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//3
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("Unicorns")
      .updateOne(
        {weight:{$gt:500}},{$addToSet: {loves: 'chocolate'}, $set:{"underweigth":true}}
      )
      .then((data) => console.log("Query 3", data)
      )
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});


//4
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("Unicorns")
      .aggregate([
        { "$group": {"_id":{"gender":"$gender", "hair":"$hair"},
        "media":{"$avg":"$vampires"}} },
        { "$sort" : {"media":-1} }
      ]
      ).toArray()
      .then((data) => console.log("Query 4", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//5
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("Unicorns")
      .find(
        {loves: {$in:['grape']}}
      ).count()
      .then((data) => console.log("Query 5", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//6
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    var regex = new RegExp("[y]", "i");

    db.collection("Unicorns")
      .find(
        {"name": regex}
      ).toArray()
      .then((data) => console.log("Query 6", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});