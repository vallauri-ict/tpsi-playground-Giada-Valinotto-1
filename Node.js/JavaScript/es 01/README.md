# ES 01 - CREAZIONE SERVER

## Obiettivo
Realizzare un semplice web server che restituisca al client una pagina HTML contenente le tre informazioni ricevute in fase di richiesta, cioè risorsa richiesta, parametri e
metodo di chiamata. Il codice è basato sul metodo **http.createServer** che crea e restituisce un server HTTP. 

## Il metodo createServer: 
Si aspetta come parametro una **funzione di callback** (indicata come RequestListener) che sarà eseguita in corrispondenza di ogni richiesta ricevuta dal server. 
In corrispondenza di ogni richiesta, alla funzione di callback verranno automaticamente iniettati due parametri:  
**request**, un oggetto di tipo http.IncomingMessage che rappresenta il messaggio HTTP ricevuto dal client contenente tutte le informazioni relative alla richiesta response,
un oggetto di tipo **http.ServerResponse** all'interno del quale il server dovrà andare a  scrivere la risposta da restituire al client  

## Avvio del server:
Per avviare il server è necessario eseguire il comando **Start Debugging** (Visual Studio Code) sulla cartella corrente, viene visualizzata nel prompt la **porta d'ascolto**.
Per provare il funzionamento del web sever aprire un browser e digitare: **http://localhost:1337/**, in questo esercizio verranno visualizzate le informazioni della richiesta

_stud. Valinotto Giada, 5B INF_
