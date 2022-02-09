"use strict";
import http from 'http';
import colors from 'colors';
import express from 'express';
const app = express();

const httpServer = http.createServer(app);

import {Server, Socket} from 'socket.io'; // import solo l‟oggetto Server
const io = new Server(httpServer);

const PORT = 1337

httpServer.listen(PORT, function() {
    console.log('Server listening on port ' + PORT);
});

app.use(express.static('./static'));


/************************* gestione web socket ********************** */
let users = []; // vettore in cui si salvano i socket degli utenti connessi, si aggiorna ad ogni nuova connessione

/* in corrispondenza della connessione di un client,
  per ogni utente viene generato un evento 'connection' a cui
  viene inettato il 'clientSocket' contenente IP e PORT del client.
  Per ogni utente la funzione di callback crea una variabile locale
  'user' contenente tutte le informazioni relative al singolo utente  */

io.on('connection', function(clientSocket) { //Evento che si verifica quando un client fa un connect 
	let user = {} as {username:string, socket: Socket, room:string};

//EVENTI LEGATI AL CLIENT 

	// 1) ricezione username
	clientSocket.on('login', function(userInfo) { // Quando il client fa emit con chiave login

		userInfo = JSON.parse(userInfo); //N.B.: PARSIFICARE

		// controllo se user esiste già
		let item = users.find(function(item) { // Cerca l'utente corrente nel vettore degli utenti e ritorna l'item dove username = username del vettore user
			return (item.username == userInfo.username)// In sostanza, controlla l'esistenza dell'utente e restituisce il suo socketClient
		})
		if (item != null) { // Se, in fase di registrazione, si trova un utente con lo stesso nome 
			clientSocket.emit("loginAck", "NOK")
		}
		else{
			user.username = userInfo.username;
			user.room= userInfo.room;
			user.socket = clientSocket;
			users.push(user);
			clientSocket.emit("loginAck", "OK")
			log('User ' + colors.yellow(user.username) +
						" (sockID=" + user.socket.id + ') connected!');

			//Inserisco username nella stanza corretta
			this.join(user.room);
		}
	});

	// 2) ricezione di un messaggio	 
	clientSocket.on('message', function(msg) {
		log('User ' + colors.yellow(user.username) + 
		          " (sockID=" + user.socket.id + ') sent ' + colors.green(msg))
		// notifico a tutti i socket (mittente compreso) il messaggio ricevuto 
		let response = {
			'from': user.username,
			'message': msg,
			'date': new Date()
		}
		io.sockets.emit('message_notify', JSON.stringify(response));
	});

    // 3) disconnessione dell'utente
    clientSocket.on('disconnect', function() {
		// ritorna -1 se non lo trova
		let index = users.findIndex(function(item){
			return (item.username == user.username)
		})
		users.splice(index, 1)
		log(' User ' + user.username + ' disconnected!');
    });
});

// stampa i log con data e ora
function log(msg) {
	console.log(colors.cyan("[" + new Date().toLocaleTimeString() + "]") + ": " +msg)
}