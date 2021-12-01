![image](https://user-images.githubusercontent.com/62563624/144075801-5d8e8a12-9ea2-4241-a736-b95642c15680.png)

# EXPRESS
Express è un modulo aggiuntivo di NodeJs che permette di gestire al meglio un server http.
Rispetto all'utilizzo diretto di Node presenta due vantaggi importanti :
- Presenza di un dispatcher integrato, che nella terminologia di Express si chiama router e che ha come compito quello di servire le richieste provenienti dal client.
- Disponibilità di molte librerie aggiuntive ad hoc per express (es express-session, body-parser, etc)

Esiste anche una utility express – generator che consente di creare automaticamente un web site completo basato su express e su jade che è un template per scrivere rapidamente pagine html che saranno poi convertite in html vero e proprio da jade stesso.

## Installazione di express
```npm install express```
## Primo oggetto
```var express = require('express');```

```var app = express();```

express() restituisce il riferimento ad una applicazione web completa che può essere passata al metodo.

createServer() al posto della funzione di callback utilizzata nel caso di node js.

```const server = http.createServer(app);```

```server.listen(port, [ipAddress], callback())```

Il metodo .listen() avvia un server sulla porta indicata. La funzione di callback viene richiamata in
corrispondenza dell‟avvio e serve per eventuali inizializzazioni.

## Gestione delle route
Nel linguaggio express i listener vengono indicati come routes.

Per ogni route occorre definire :
- route method (get, post, put, delete, etc)
- route path (la risorsa a cui rispondere)
- route handler (le funzioni di callback da eseguire come risposta alla richiesta)

In corrispondenza dell’arrivo di una richiesta, express scorre sequenzialmente l’elenco delle routes
fermandosi automaticamente alla prima route che va a buon fine, cioè che corrisponde per il metodo
(get, post) e per il nome della risorsa (“/api/elencoUser”). Quando trova una route che soddisfa questi
parametri esegue il codice relativo a questa route.

Le routes vengono eseguite in sequenza, per cui è fondamentale l’ordine con cui vengono scritte.

```app.get(resourse, callback(req, res, next)```
Crea un listener per la gestione della risorsa GET indicata.

```app.post(resourse, callback(req, res, next)```
Crea un listener per la gestione della risorsa POST indicata

```app.put(resourse, callback(req, res, next)```
Crea un listener per la gestione della risorsa PUT indicata

```app.use(resource, callback(req, res, next)```
Crea un listener per la gestione della risorsa
indicata.

La funzione di callback viene eseguita sempre, indipendentemente dal metodo utilizzato per la
richiesta (get, post, put, delete, etc)
In tutti i metodi il parametro resource può assumere il valore “*” che ha il significato di “qualsiasi
risorsa”. In pratica il listener viene eseguito in corrispondenza di qualsiasi richiesta.
