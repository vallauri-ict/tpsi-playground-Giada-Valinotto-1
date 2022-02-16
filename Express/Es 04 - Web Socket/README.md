# ES 04 - WEB SOCKET

## Web Socket
WebSocket è una tecnologia web che fornisce canali di comunicazione full-duplex attraverso una singola connessione TCP. L'API del WebSocket è stata standardizzata dal W3C e il protocollo WebSocket è stato standardizzato dall'IETF come RFC 6455.

WebSocket è progettato per essere implementato sia lato browser che lato server, ma può essere utilizzato anche da qualsiasi applicazione client-server. Il protocollo è un'implementazione basata sul protocollo TCP. La sua unica correlazione con l'HTTP è nel modo in cui fa l'handshake durante una Upgrade request tra server. Il protocollo WebSocket permette maggiore interazione tra un browser e un server, facilitando la realizzazione di applicazioni che forniscono contenuti e giochi in tempo reale. Questo è reso possibile fornendo un modo standard per il server di mandare contenuti al browser senza dover essere sollecitato dal client e permettendo ai messaggi di andare e venire tenendo la connessione aperta.

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
