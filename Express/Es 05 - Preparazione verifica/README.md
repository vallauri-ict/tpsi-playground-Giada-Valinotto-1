# ES 05 - PREPARAZIONE ALLA VERIFICA (UPLOAD + WEB SOCKET)


### Scambio dei dati attarverso i Socket
A questo punto, stabilita la connessione, sia il client che il server possono inviare dei dati sulla connessione
mediante il metodo emit() che presenta due parametri entrambi di tipo stringa.
```javascript
socket.emit(key, data);
```
- Il primo parametro key è un identificativo che identifica univocamente il messaggio.
- Il secondo parametro data rappresenta il dato vero e proprio
Sull'host remoto, in corrispondenza di ogni **emit()**, si verfica un evento differente per ogni key inviato dal
mittente. I vari eventi saranno in ascolto sulla key definita dal mittente ed hanno come callback una
funzione alla quale vengono iniettati i dati corrispondenti.
```javascript
socket.on(key, function (data) { }
```
### Messaggi di broadcast
```javascript
socket.broadcast.emit(key, data);
```
Questo metodo consente al server di inviare dei dati in
broadcast a tutti gli host attualmente connessi, con esclusione di quello identificato dal socket corrente
```javascript
io.sockets.emit(datatName, data);
```
Metodo statico che consente al server di inviare un messaggio
a tutti gli host attualmente connessi, mittente compreso.
### Chiusura della connesione
La richiesta di chiusura della connessione può essere eseguita indifferentemente in qualsiasi momento sia
dal client che dal server tramite il richiamo del metodo
```javascript
socket.disconnect();
```
Normalmente comunque è il browser che invia la richiesta di disconnessione, che viene inviata
automaticamente in corrispondenza della chiusura della scheda di navigazione.
In corrispondenza del richiamo del metodo socket.disconnect()viene automaticamente generato sia
sul client sia sul server il seguente evento:
```javascript
socket.on('disconnect', function(){});
```

_Stud. Giada Valinotto, classe 5B Informatica 2021/2022_
