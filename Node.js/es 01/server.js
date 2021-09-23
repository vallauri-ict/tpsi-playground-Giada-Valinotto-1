const _http = require("http"); //richiesta della libreria con il metodo REQUIRE, funzionalità aggiuntiva NON js
const _url = require("url");  //2 librerie da linkare in tutti gli esercizi e salvare in due variabili puntatori alla libreria
const _colors= require("colors");
const HEADERS = require("./headers.json") //Carico un file utile linkandolo allo stesso modo ma con il path, essendo un mio file indico dove andare a prenderlo
                                        // ./ rappresenta la cartella corrente. È un file di intestazioni

const port = 1337; //Porta di Node (si può variare ma è inutile) --> In un progetto pubblicato non posso usarlo perchè il client non la scrive

const server=_http.createServer(function (req, res) { //req=request -> info sulla richiesta  res=response -> oggetto su cui il server scrive la risposta
    //Metodo dell'oggetto http
    //Vado a creare un web server e mi viene restituito un puntatore
    //Il server non viene avviato
    //Si aspetta una callback anonima a cui vengono iniettati i parametri req e res
    //Verrà eseguita ogni volta che arriva una qualunque richiesta da qualunque client
    //Nel debug metto il breakpoint nella prima istruzione	

    /*
    BASE
    // 1. Scrvere l'intestazione con il metodo writeHead
    res.writeHead(200, HEADERS.text);

    // 2. Scrivere il corpo della risposta
    res.write("Richiesta eseguita correttamente");

    // 3. Invio
    res.end();
    console.log("Richiesta ok");
    */

    //LETTURA DI METODO, RISORSA E PARAMETRI
    let metodo = req.method;
    let url = _url.parse(req.url, true);
    let risorsa = url.pathname;
    let parametri = url.query;
    let dominio = req.headers.host;

    res.writeHead(200, HEADERS.html);
    res.write("<h1>Informazioni richiesta ricevuta</h1>");
    res.write("<br>")
    res.write(`<p> <b> Risorsa richiesta: </b> ${risorsa} </p>`)
    res.write(`<p> <b> Metodo: </b> ${metodo} </p>`)
    res.write(`<p> <b> Parametri: </b> ${JSON.stringify(parametri)} </p>`) //ricordare di serializzare i parametri con JSON.strigify()
    res.write(`<p> <b> Dominio richiesto: </b> ${dominio} </p>`)
    res.write(`<p> Grazie per la richiesta! </p>`)

    res.end();
    console.log('Rchiesta ricevuta: ' + req.url.rainbow);
});
// se non si specifica l'indirizzo IP di ascolto il server viene avviato su tutte le interfacce
server.listen(port); //Avvia il server, in ascolto sulla porta 1337. Si aspetta la porta e gli indirizzi IP di ascolto.
                    //Ad esempio con il 127.0.0.0 sono in loopback -> Ci lavoro solo io 
                   // Se lo ometto lavora su tutte le interfacce
console.log("server in ascolto sulla porta " + port);

// Run -> Run without debugging
//Farlo partire da terminale --> CTRL + Shift + ò --> node server (server è il nome del file, posso omettere l'estensione)
//Farlo fermare --> CTRL +  C
//Su Chrome --> http://localhost:1337