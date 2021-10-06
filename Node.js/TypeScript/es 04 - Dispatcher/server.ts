import * as _http from "http";     //import per le librerie di sistema, require per le nostre librerie
let HEADERS = require("./headers.json"); //./ cerca nella cartella corrente
let _dispatcher = require("./dispatcher.ts"); //Importa soltanto ciò che è stato esportato in dispatcher.ts
let port : number = 1337;
//Primo step: Creare il server
let server = _http.createServer(function(req,res){  //Funzione di callback richiamata ad ogni arrivo di una richiesta, con i 2 parametri req e res
    //Verifico se si tratta di una richiesta di risorsa statica (pagina) o dinamica (servizio)
    _dispatcher.dispatch(req, res); //tutte le volte che arriva una richiesta dal client viene richiamata
});

//Metto in ascolto il server sulla porta 
server.listen(port);
console.log("Server in ascolto sulla porta "+port);

//Registrazione dei servizi
_dispatcher.addListener("POST","/api/servizio1", function(req, res){ //Parametri: tipo di richiesta, tipo di risorsa e function anonima di callback con req e ris come parametri
    //Codice di risposta al servizio
    res.writeHead(200,HEADERS.json);
    res.write(JSON.stringify({"ris":"ok"}));
    res.end();
}); 

_dispatcher.addListener("POST","/api/servizio2", function(req, res){ //Parametri: tipo di richiesta, tipo di risorsa e function anonima di callback con req e ris come parametri
    //Codice di risposta al servizio
    res.writeHead(200,HEADERS.json);
    let nome = req["GET"].nome;
    res.write(JSON.stringify({"ris":nome}));
    res.end();
}); 