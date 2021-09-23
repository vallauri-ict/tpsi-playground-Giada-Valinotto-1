# Node.js <img src="https://user-images.githubusercontent.com/62563624/134513026-0b4e7fc7-4eef-47b2-877d-1155ba1a81e9.png" style="width: 50px"></img>


### Introduzione
<p>È la base di una piattaforma denominata MEAN (Mongo, Express, Angular, Node) mirata alla
realizzazione di applicazioni web di tipo client server interamente basate sul linguaggio JavaScript,
arricchito con diverse funzionalità server side.</p>

- Mongo = database
- Express = web server
- Angular = client side
- Node = server side
<p>È basato sul JavaScript Engine V8, che è una piattaforma open source che gira su tutti i principali SO.
La scelta di edificare Node.js “sopra” V8 è una garanzia di sicurezza, portabilità e stabilità.</p>


### Caratteristiche:
- Completamente basato sulla programmazione asincrona
- Ottime prestazioni (sia su server di piccole dimensioni sia su server di grandi dimensioni)
- Possibilità di interfacciamento con i socket a livello 4 della pila ISO OSI

<p>Node.js gestisce tutte le principaliattività in modo asincrono, sfruttando al massimo l‟approccio event-loop tipico di javascript. </p>

![image](https://user-images.githubusercontent.com/62563624/134511029-8378d904-a770-4536-bbb3-353d6ea232ac.png)

### Installazione ed esecuzione
<p>L'applicazione viene installata in C:/Programmi/Nodejs e,
nelle versioni più recenti, viene creato un Nodejs command prompt che gestisce in automatico alcune
variabili d'ambiente relative alle librerie installate in modo globale all'interno del profilo utente.
L'ultima versione stabile e con supporto garantito a lungo termine (LTS = long term
  support) è la <a href="https://nodejs.org/it/">versione 14.17.6</a>.</p>
  <p>Il comando node senza parametri apre un terminale che consente di interagire a linea di comando con
node.js. Ad esempio il comando c:> console.log(“hello world”);
chiede a node di stampare a video la stringa “hello world”.

  Il comando node –v consente di visualizzare la versione di Note correntemente installata.
Digitando da terminale where node si può vedere il percorso completo di installazione di node. 

Normalmente però Node viene lanciato passandogli come parametro sulla linea di comando il nome di un
file testuale.js contenente le istruzioni da eseguire: node filename.js
  
  
L'impostazione del path set PATH = %PATH%;C:\Program Files\node.js
nelle ultime versioni fatto in automatico dall'installer.</p>

