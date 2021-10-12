import * as _http from "http";
let HEADERS = require("./headers.json");
let dispatcher = require("./dispatcher.ts");
//All’avvio il server legge e mantiene in memoria il contenuto del file (semplice require)
let people = require("./persons.json");
let port: number = 1337;

let server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});
server.listen(port);
console.log("Server in ascolto sulla porta " + port);



// *********** Registrazione dei servizi ********** 

dispatcher.addListener("GET", "/api/nazioni", function (req, res) { //sempre
 let nazioni=[];
    for (const person of people.results) {
        if(person.location.country)
        {
            if(!nazioni.includes(person.location.country))
            {
                nazioni.push(person.location.country)

             }
        }
    }
    nazioni.sort();

    res.writeHead(200, HEADERS.json);    //sempre
    res.write(JSON.stringify({ "nazioni": nazioni})); //sempre
    res.end();    //sempre
});

dispatcher.addListener("GET", "/api/persone", function (req, res) {
let nazione = req["GET"].nazione;
let vetPeople = [];
for (const person of people.results) {
    if(person.location.country==nazione)
    {
        let jsonP={
            "name":person.name.title + " " + person.name.first + " " +person.name.last,
            "city": person.location.city,
            "state": person.location.state,
            "cell":person.cell
        };
        vetPeople.push(jsonP);
    }
}
res.writeHead(200, HEADERS.json);    //sempre
res.write(JSON.stringify(vetPeople)); //sempre
res.end();    //sempre
});