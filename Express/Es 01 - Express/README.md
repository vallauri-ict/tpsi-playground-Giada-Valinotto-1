# ES 01 - INTRODUZIONE AD EXPRESS

Esercizio introduttivo finalizzato a trattare i seguenti argomenti:
- Sintassi di Express
- Gestione delle Routes
- Parametro next
- Middleware

## Gestione delle Routes
Nel linguaggio express i listener vengono indicati come routes.
Per ogni route occorre definire :
- **route method** (get, post, put, delete, etc)
- **route path** (la risorsa a cui rispondere)
- **route handler** (le funzioni di callback da eseguire come risposta alla richiesta)

In corrispondenza dell’arrivo di una richiesta, express scorre sequenzialmente l’elenco delle routes fermandosi automaticamente alla prima route che va a buon fine. Quando trova una route che soddisfa questi parametri esegue il codice relativo a questa route.

Le routes vengono eseguite in sequenza, per cui è fondamentale l’ordine con cui vengono scritte.

- ```app.get  (resourse, callback(req, res, next)``` Crea un listener per la gestione della risorsa GET indicata.
- ```app.post  (resourse, callback(req, res, next)```Crea un listener per la gestione della risorsa POST indicata
- ```app.put (resourse, callback(req, res, next)```  Crea un listener per la gestione della risorsa PUT indicata
  
 - ```app.use**  (resource, callback(req, res, next)``` Crea un listener per la gestione della risorsa indicata. La funzione di callback viene eseguita sempre, indipendentemente dal metodo utilizzato per la richiesta.

In tutti i metodi il parametro resource può assumere il valore “*” che ha il significato di “qualsiasi
risorsa”. In pratica il listener viene eseguito in corrispondenza di qualsiasi richiesta.

## Il parametro next ed il codice middleware
Nel momento in cui una route va a buon fine, express la esegue ed interrompe la ricerca a meno che, al
termine della procedura, non venga richiamato il metodo **_next()_**, quello passato come terzo parametro
(opzionale) che è un puntatore ad una funzione interna di express che fa ripartire la scansione delle routes
a partire dalla route successiva.

Le routes che utilizzano un ```next()``` finale, nel linguaggio di express sono indicate come middleware (codice
intermedio). Le **_funzioni middleware_** sono normalmente associate a routes aventi come risorsa "*",
che dunque saranno eseguite in corrispondenza di ogni richiesta, ad esempio per stampare dei log
oppure per eseguire altre elaborazioni.

_stud. Valinotto Giada, classe 5B inf_
