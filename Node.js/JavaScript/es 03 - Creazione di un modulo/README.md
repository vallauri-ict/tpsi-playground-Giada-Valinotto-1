# ES 03 - CREAZIONE DI UN MODULO

In un'architettura modulare e scalabile risulta molto comodo suddividere il codice in moduli che saranno
poi riutilizzabili in altre applicazioni.

Un modulo è un file che definisce una serie di funzioni o oggetti
JavaScript e che saranno poi utilizzabili in molte applicazioni differenti.


Per la gestione dei moduli in javascript esistono due standard differenti:
- **CommonJS (ES5)** caratterizzato dall‟utilizzo dei metodi module.exports e require()
- **ES-modules (ES6)** caratterizzato dall‟utilizzo dei metodi import ed export

Tra i due standard ci sono alcune differenze non solo sintattiche ma anche funzionali:

-  Il metodo **require()** carica i moduli in modo sincrono, cioè bloccante, uno dopo l'altro.
Viceversa il metodo **import** carica i moduli dinamicamente in modo asincron con una callback
che rende disponibile il modulo all'applicazione. Molto più prestante.
-  Il metodo **require()** può essere richiamato ovunque all'interno del main, nel momento in cui
insorge la necessità di una certa libreria. Viceversa il metodo **import** deve necessariamente
essere richiamato all‟inizio del file prima di qualsiasi altra istruzione.
-  Il metodo **require()** importa sempre l'intera libreria indicata, mentre il metodo **import**
consente di importare la libreria intera oppure soltanto I metodi che servono all‟applicazione, in
modo da non appesantire troppo l‟applicazione stessa
- Nel caso di CommonJS i moduli sono trattati come semplici "script" a visibilità gloable, mentre ESmodules li gestisce come veri e propri namescape con un loro scope interno

## Standard CommonJS
CommonJS si basa sui due metodi
- module.exports per esportare gli oggetti di un modulo
- require() per importare un modulo in una applicazione principale

Il metodo require() si aspetta come parametro:
- il nome di un modulo, nel qual caso lo andrà a cercare 1) fra i moduli nativi di nodejs 2) nella
sottocartella node_modules della cartella corrente 3) nella sottocartella node_modules delle
cartelle a monte 4) nel percorso indicato da NODE_PATH
- un percorso (URL) relativo o assoluto che indica dove reperire il modulo

Il codice scritto direttamente viene eseguito nel momento stesso del require(), senza necessità di
utilizzare il metodo module.exports

**modulo.js**
```javascript
console.log(“Codice scritto direttamente”);
```
**main.js**
```javascript
require('modulo.js');
```
