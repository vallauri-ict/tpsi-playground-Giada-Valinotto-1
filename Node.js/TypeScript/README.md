![image](https://user-images.githubusercontent.com/62563624/137487500-37380a6c-0043-4ab2-b5a3-53418dcc288c.png)

### Specifiche
Per scrivere una applicazione basata su Nodejs (e quindi anche nel caso di Express e Angular) è stato
creato un nuovo linguaggio che si chiama typeScript maggiormente strutturato rispetto al semplice
javaScript e che quindi consente un maggiore controllo del flusso ed una migliore leggibilità del codice.
Le nuove caratteristiche fondamentali di typescript sono essenzialmente due:
- La possibilità di tipizzare le variabili. La tipizzazione non è obbligatoria. Il tipo viene indicato
DOPO il nome della variabile e suddiviso tramite i DUE PUNTI, quasi come un json.
È disponibile un tipo any che sta ad indicare “qualsiasi tipo” e che fondamentalmente equivale
alle varibili non tipizzate di javascript
- Una gestione delle classi maggiormente Object Oriented rispetto a javascript
Per contro, se utilizzato lato client, l'applicazione deve essere compilata prima di essere inviata al client
perché il browser non è in grado di interpretare il codice typescript

### Gestione delle classi in TypeScript
Type Script utilizza la tipica sintassi Java Script ES6 con alcune aggiunte
- Le Property possono essere tipizzate e possono avere un qualificatore di visibilità (non ammesso in
ES6). Il default è 
```typescript
public class Person {
public name: string;
public description: string;
 public imagePath: string;
 constructor() { }
}
```
-  In javascript ES6 la dichiarazione esplicita delle Property non è obbligatoria. Le property possono
essere create in qualunque momento all‟interno di un metodo mediante una istruzione del tipo
```typescript
this.name = parametroRicevuto
```
In Type Script questo invece NON è possibile. Le Property devono SEMPRE essere dichiarate
esplicitamente.Al limite una Property può essere dichiarata come parametro del costruttore


- Le Property possono essere inizializzate in fase di dichiarazione oppure all'interno del costruttore
- Non è utilizzabile il prototype. Tutti i metodi di istanza devono essere definiti all‟interno della classe
- È stata aggiunta l'ereditarietà, cioè è possibile ereditare da una classe ad un'altra
```typescript
class Dog extends Animal {
 bark() {
 console.log("Woof! Woof!");
 }
}
```

### Utilizzo di TypeScript in una applicazione Node
Per poter utilizzare typeScript in una applicazione node occorre installare a livello globale due librerie:
- typescript -> è una libreria contenete un compilatore denominato tsc per la traduzione del codice
TypeScript in javascript.
```tsc --version // versione di tsc installata
tsc --init // crea un file tsconfig.json contenente le opzioni base per la compilazione.
```

“rootDir” indica la cartella contenente i files TypeScript aventi estensione .ts.
Per default vale “./” però potrebbe ad esempio essere impostata a “./src”.
“outDir” indica la cartella in cui il compilatore dovrà posizionare i files compilati Ad es “./dist”
Questo file DEVE essere creato in tutti i casi, anche se non si intende utilizzare esplicitamente
il compilatore. Importantissimo impostare "strict":false, altrimenti viene abilitato un
controllo dei tipi pesantissimo da gestire (che peraltro è già false per default).

```javascript
Esempio di file tsconfig.json creato automaticamente
{
 "compilerOptions": {
 "target": "es5",
 "module": "commonjs",
 "outDir": "dist",
 "esModuleInterop": true,
 "forceConsistentCasingInFileNames": true,
 "strict": false,
 "skipLibCheck": true
 }
}
```
tsc // eseguito senza parametri compila tutti i files.ts della rootDir posizionando i files
compilati all‟interno della outDir.
Lanciando infine node dist/server.js si avvia l‟applicazione.


Ricompilare l'applicazione tutte le volte è però decisamente scomodo e oneroso.
- ts-node è una libreria che consente di avviare in esecuzione direttamente un file TypeScript.
In realtà esegue una compilazione in RAM e poi lancia node sul file compilato, esattamente come
nel caso precedente. Occorre quindi avere sempre il compilatore installato.
```ts-node server.ts```

Le due librerie possono essere installate con un unico commando:
```npm install –g typescript ts-node```
