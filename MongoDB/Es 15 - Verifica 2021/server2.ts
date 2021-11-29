import * as mongodb from "mongodb";

const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

//query 2
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("facts")
      .find({$or:[
        {"categories":{$in:["music"]}},
        {"score":{$gt:620}}         
      ]}).project({"categories":1,"score":1})
      .toArray()
      .then((data) => console.log("Query 2", data)
      )
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});


const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
"Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
"m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"];
function generaId(){
  let id:string="";
  for (let index = 0; index < 22; index++) {
      id+=(base64Chars[generaNumero(0,base64Chars.length-1)]);
  }
      return id;
}
function generaNumero(min,max){
let n = Math.floor((max-min+1)*Math.random()+min);
return n;
}

//  query 3
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let id = generaId();
    let db = client.db(DB_NAME);
    db.collection("facts")
      .insertOne(
        {"value":"I'm inserting a new chuck norris's fact",_id: id as any,"updated_at":new Date(),"created_at":new Date(),"score":0,
        "icon_url":"https://assets.chucknorris.host/img/avatar/chuck-norris.png","url":`https://api.chucknorris.io/jokes/${id}`}
      )
      .then((data) => console.log("Query 3", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 4
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("facts")
      .deleteMany({$and:[
        {"created_at":{$gt:new Date("2021-11-15T00:00:00.000Z")}},
        {"score":0}
      ]})
      .then((data) => console.log("Query 4", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 5
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  console.log(new Date("2021-11-15T00:00:00.000Z"));
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("facts")
      .aggregate([
        {
          $unwind:"$categories"
        },
        {
          $group:{
            "_id":"$categories",
            "mediaScore":{$avg:"$score"}
          }
        },
        {
          $project:{
            "mediaScore":{$round:["$mediaScore",2]},
            "_id":1
          }
        },  
        {
          $sort:{
            "mediaScore":-1,
            "_id":-1
          }
        }
      ]
      ).toArray()
      .then((data) => console.log("Query 5", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 6a
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  console.log(new Date("2021-11-15T00:00:00.000Z"));
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("facts")
      .distinct("categories")
      .then((data) => console.log("Query 6a", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
})

//  query 6b
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  console.log(new Date("2021-11-15T00:00:00.000Z"));
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("facts")
      .aggregate([
        {
          $unwind:"$categories"
        },
        {
          $group:{
            "_id":"$categories",
          }
        },
       {
         $sort:
         {_id:1}
       }
      ]
      ).toArray()
      .then((data) => console.log("Query 6b", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
})