# Esercizio JWT Mail - Cookies 🍪🍪

## Obiettivo   

L'obiettivo dell'esercizio è quello di realizzare un client di posta alla quale gli utenti posso accedere grazie all'utilizzo di un token.

L'utente effettua l'accesso inserendo il suo indirizzo mail e la corrispondente password. In seguito alla verifica della validità del token, l'utente può così accedere alla visualizzazione delle mail e inviarne di nuove.

I dettagli della realizzazione dell'esercizio sono indicati nell'[apposito file](https://github.com/vallauri-ict/tpsi-playground-Giada-Valinotto-1/blob/main/JWT/Esercizio%20JWT%20Mail/Esercizio%20JWT%20Mail.pdf)

## JWT Token Authentication
- L'utente si autentica mediante username e password
- In caso di credenziali valide il server restituisce un token „firmato‟ digitalmente
- Il client, mediante javascript, memorizza il token e lo invia in ogni richiesta successiva
- In corrispondenza di ogni richiesta il server controlla il token e, se valido, restituisce i dati richiesti

Un Token JWT è costituito da 3 parti:
1. Header
2. Payload
3. Signature

Il token finale viene ottenuto con il concatenamento delle 3 stringhe precedenti suddivise da un puntino.

Il server, in corrispondenza di ogni richiesta, dovrà verificare la presenza del token e la sua validità.
I passi da eseguire sono i seguenti:
- Sulla base dell'header e del payload ricalcola la signature utilizzando la propria chiave privata.
Se la signature differisce da quella ricevuta significa che il token è corrotto (o modificato) e la
richiesta viene rifiutata.
- Legge il payload verificando che la data di scadenza sia ancora valida
- Decide se eventualmente aggiornare il token
## Libreria bcrypt 
La libreria bcrypt distribuita tramite npm è scritta in C++ e non è supportata da heroku.
Sono invece supportate bcrypt-nodejs (più vecchia di bcrypt) e bcryptjs che è una libreria
interamente scritta in javascript considerata del tutto equivalente a bcrypt (soltanto più lenta). 

Utilizza una salt-criptography. Il nome deriva dal fatto che il sale solitamente ostruisce le arterie ed in
questo caso viene utilizzato per ostruire eventuali attacchi mirati alla scoperta delle password.
La ragione che sta alla base della salt-criptography è che di solito gli utenti tendono a scegliere
password semplici e conosciute in modo da poterle facilmente ricordare. 

Le password normalmente vengono salvate all‟interno del database non in modo diretto ma tramite una
impronta irreversibile come ad esempio una hash MD5. Se però la password è semplice esistono molte
applicazioni che, tramite ricerca sequenziale, consentono di risalire alla password originaria.
Lo scopo della salt-criptography è quello di ‘randomizzare’ una password comune, in modo da
creare una password risultante meno standard e difficilmente individuabile in un database di reverte. 

## Considerazioni sulla Trasmissione del token
Una volta creato il token, il server lo può trasmettere al client attraverso due diverse modalità:
1. lo può trasmettere all'interno di un cookie. In questo caso, la gestione lato client è
completamente trasparente. Il browser salverà il token nell'area dedicata ai cookies e lo
ritrasmetterà in automatico in corrispondenza di ogni richiesta successiva.
2. lo può trasmettere il token al client all'interno di una intestazione HTTP preposta (tipicamente
authorization o x-auth-token). In questo caso tipicamente il client andrà a salvare il token
in localStorage e, in corrispondenza di ogni richiesta, andrà a leggerlo dal localStorage e ad
aggiungerlo manualmente all'interno dell'http request.

Dal punto di vista della sicurezza la soluzione migliore sembrerebbe essere quella di salvare il token
all'interno di un cookie ```httponly=true``` e ```secure=true``` non accessibile da java script.

👩‍🎓 _Stud. Valinotto Giada, 5B INF 2021/2022_

🏫 _I.I.S. G. Vallauri Fossano_
