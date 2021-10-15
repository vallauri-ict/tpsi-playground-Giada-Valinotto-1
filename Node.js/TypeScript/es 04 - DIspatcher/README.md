# ESERCIZIO 04 - DISPATCHER

Il dispatcher rappresenta l'interfaccia di front-end di un web server, cioè il modulo che si prende
in carico le Http Request e ritorna al chiamante le corrispondenti Http Response.
In italiano significa letteralmente centralino o smistatore, cioè un componente che permette di
differenziare le chiamate effettuate dall'utente, effettuando la selezione sulla base della risorsa richiesta

In node.js il dispatcher può essere richiamato all'interno della funzione di callback del metodo
```createServer()``` dell'oggetto http con l'injection dei parametri request e resposne.
Per ogni richiesta ricevuta, il Dispatcher dovrà prendere in considerazione le solite tre informazioni :
- Metodo usato per la richiesta
- Risorsa richiesta
- Eventuali Parametri aggiuntivi

### Struttura della classe Dispatcher
```javascript
class Dispatcher {
prompt:string = ">>> "
listeners:any = {
 "GET": { /* "risorsa1":"callback1", "risorsa2":"callback2" */ },
 "POST": {},
 "DELETE": {},
 "PUT": {},
 "PATCH": {}
 }
 constructor() {
 init();
 }
}
```

La proprietà listeners è un JSON preposto a contenere un elenco di listeners che dovranno
servire le varie richieste provenienti dal client. I listeners sono suddivisi in base al tipo di chiamata:
avremo un JSON per i listeners GET, uno per i listener POST, etc.
Questa suddivisione è una scelta del tutto arbitraria simile alla modalità di lavoro di express.
In realtà in un'ottica CRUD sarebbe meglio tenere tutti i listener raggruppati insieme
(indipendentemente dal metodo). In questo modo per ogni risorsa si avrebbe un unico listener che potrà
intraprendere azioni diverse a seconda del tipo di chiamata (post=inserimento, delete=cancellazione,
etc).

Ogni listener è costituito da un json avente come chiave la risorsa da servire, e come valore
una funzione di callback da eseguire in corrispondenza della richiesta di quella risorsa.
```javascript
{ "risorsa1": callback1,
 "risorsa2": callback2,
 "risorsa3": callback3 }
 ```
 
 _stud Giada Valinotto, 5B INF_
