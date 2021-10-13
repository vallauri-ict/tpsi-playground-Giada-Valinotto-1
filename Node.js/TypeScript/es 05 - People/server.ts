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

dispatcher.addListener("GET", "/api/persone", function (req, res) {
    let personReq = req["BODY"].person; //pesco la cosa richiesta dal client
    let trovato = false;
    let person;
    for (person of people.results) {
        if((person.name.title + " " + person.name.first + " " +person.name.last) == personReq)
        {
            trovato=true;
            break; //quando faccio il break person punta alla persona corretnte, quella giusta
        }
    }
    if(trovato)
    {
        //spedisco la risposta
        res.writeHead(200, HEADERS.json);    //sempre
        res.write(JSON.stringify(person)); //sempre
        res.end();    //sempre
    }
    else
    {
        //spedisco la risposta di errore -> errore sui json mando indietro un text
        res.writeHead(404, HEADERS.text);    //sempre
        res.write("Persona non trovata"); //sempre
        res.end();    //sempre
    }
})