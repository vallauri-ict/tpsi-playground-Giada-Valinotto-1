# ES 02 - READFILE

Il modulo FS (File System) permette di leggere e scrivere risorse nel file system del server, eseguendo tutte le operazioni tipiche di
questo ambito come ad esempio la copia, la lettura. la scrittura. la cancellazione di files e cartelle.

```javascript
var fs = require('fs');
```       

Il metodo readFile() legge l‟intero file ricevuto come parametro.

```javascript
fs.readFile(path, 'utf8', function (err, data){});
```  

Parametri:
- il path del file da leggere
- il tipo di encoding. Il file viene restituito come raw buffer, cioè come buffer binario nudo e
crudo. Il parametro encoding consente di convertire il raw buffer nella codifica indicata, che può
essere “utf8” per il testo, “base64” per immagini base64, “binary” per files binari.
Nel caso di immagini occorre omettere il parametro encoding e trasmettere il buffer cos‟ì com‟è
Il 2° parametro in realtà può sempre essere omesso. In caso di file testuale può essere
visualizzato semplicemente facendo 
```javascript
data.toString()
```  

- una funzione di callback che dovrà essere eseguita al termine della lettura del file e che riceve
due parametri:
  - un oggetto err che è null in caso di successo oppure settato in caso di errore
  - un oggetto data contenente i dati desiderati.


Esempio:

```javascript
fs.readFile('./myFile’, function (err, data) {
 if (err) console.log('Error’);
 else console.log(data.toString()); });
 ```
 
Il metodo readFileSync è analogo al precedente ma sincrono, cioè bloccante fino al termine della lettura


```javascript
var data = fs.readFileSync("./myFile", "utf8");
fs.existsSync("./myFile");
```

Restituisce true se il file esiste, altrimenti false


_stud. Giada Valinotto, 5B INF_
