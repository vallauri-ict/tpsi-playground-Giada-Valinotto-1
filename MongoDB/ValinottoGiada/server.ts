import * as http from "http";
import * as mongodb from "mongodb";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";

const PORT: number = 1337;
const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

let dispatcher: Dispatcher = new Dispatcher();

let server = http.createServer((req, res) => {
  dispatcher.dispatch(req, res);
});

server.listen(PORT);
console.log(`Server in ascolto sulla porta: ${PORT}`);

//  registrazione dei servizi
dispatcher.addListener("GET", "/api/getUnicorns", (req, res) => {
  mongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (!err) {
      let db = client.db(DB_NAME);
      db.collection("Unicorns")
        .find()
        .project({ name: 1 })
        .toArray()
        .then((data) => {
          res.writeHead(200, HEADERS.json);
          res.end(JSON.stringify(data));
        })
        .catch((err) => console.log("Errore esecuzione query: " + err.message))
        .finally(() => client.close());
    } else {
      console.log("Errore connessione al db: " + err.message);
    }
  });
});