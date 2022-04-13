# JWT - JSON Web Token
![JWT-1_ccexpress](https://user-images.githubusercontent.com/62563624/160847719-cab4428f-9b54-4847-8fb7-b625018ec2de.png)

La sicurezza in informatica è in continua evoluzione. Lo studio di sistemi per la protezione di dati e di big data è in continuo progresso. JWT, acronimo di JSON Web Token, è un sistema di cifratura e di contatto in formato JSON per lo scambio di informazioni tra i vari servizi di un server. Si genera così un token che può essere cifrato e firmato tramite una chiave disponibile solo a colui che lo ha effettivamente generato.

L’algoritmo di firma viene elaborato tramite HMAC o con chiavi pubbliche e/o private con standard RSA o ECDSA.

I JWT sono ormai una consolidata realtà e vengono utilizzati nei web services per autenticare un client. Il sistema di funzionamento è abbastanza semplice: il client invia una richiesta al server e questo genera un token di autenticazione che il client utilizzerà tutte le volte che andrà a collegarsi allo stesso nodo.

## Token Authentication
Json Web Token (JWT) è uno standard abbastanza recente di Token Authentication, standardizzato
all‟inizio del 2015 in cui il server, in corrispondenza della validazione del login, provvede a creare un
token „cifrato‟ (signature based) contenente alcune informazioni dell‟utente ed una scadenza.

Questo token viene trasmesso al client che lo utilizzerà come identificativo per tutte le successive
richieste. Sostanzialmente invece di trasmettere username e password, in corrispondenza di ogni
richiesta, al loro posto viene trasmesso il token.

Un esempio di token è rappresentato dalla API KEY che occorre scaricare per poter accedere alle
Google Maps. In quel caso il token non viene rilasciato a seguito di un login, ma occorre registrarsi e
scaricare manualmente il token che dovrà poi essere allegato ad ogni richiesta accodandolo alla url.

### Vantaggi dell’autenticazione tramite Token
- Il meccanismo del token è completamente stateless, cioè le informazioni di autenticazione stanno
direttamente nel token, evitando di dover passare dal database o di usare le sessioni per
memorizzare le informazioni sull‟autenticazione. Quindi non richiede la memorizzazione di alcuna
informazione sul server. Inoltre se i server sono replicati è sufficiente che tutti utilizzino lo stesso
tipo di token ed il problema è completamente risolto.
- Il token viene trasmesso nell‟intestazione della richiesta. Se il token non è valido al dispatching
della richiesta non si arriva nemmeno, per cui l‟impegno del server è minimo.
- Lo stesso token può essere utilizzato anche per accedere a sistemi diversi rispetto a quello che lo
ha generato. Meccanismo detto SSO Single Sign On utilizzato da google per uniformare gli
accessi ai diversi servizi ma ormai utilizzato anche in grandi aziende che espongono molteplici
portali relativamente a servizi differenti (spedizioni, logistica, etc).

### Sicurezza dell’autenticazione tramite Token
- La pagina di login che valida l‟utente e distribuisce il token deve essere protetta in modo
sistemistico facendo ad esempio in modo che, in caso di più richieste successive da parte dello
stesso indirizzo IP, il sistema disattivi temporaneamente o definitivamente le richieste da parte di
quell‟indirizzo IP
- Durante le successive comunicazioni con il server occorre necessariamente „proteggere‟ il token in
modo che non possa essere intercettato. Questo è uno dei motivi che, nel 2015, ha portato alla
migrazione di quasi tutti i servizi da HTTP a HTTPs, anche quelli in apparenza meno sensibili.
L‟unica altra alternativa potrebbe essere quella di cifrare manualmente il token tramite un algoritmo
noto sia al client che al server ma sconosciuto agli altri (che è poi esattamente ciò che fa HTTPs)
- Il token, anche se non contiene informazioni sensibili come ad esempio la password personale e
non può in alcun modo essere modificato, in caso di intercettazione potrebbe comunque essere
utilizzato per accedere indebitamente ai servizi. Per questo ogni volta che ci si collega ad un
servizio da un nuovo dispositivo viene immediatamente inviata una mail di ‘NUOVO
ACCESSO’ in cui è possibile richiedere la disattivazione immediata del token. Nel caso di
servizi più sensibili come la home banking, per alcune operazioni viene attivato un secondo livello
di sicurezza con l‟inserimento di un PIN personale memorizzato su una scheda o su un dispositivo
- Spesso i token sono a rinnovo automatico, nel senso che se il token sta per scadere o è appena
scaduto, il server ne crea ed invia uno nuovo con la scadenza aggiornata. Se non ci si collega per
più giorni occorre poi rifare il login.

## Gestione delle password tramite la libreria bcrypt
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

👩‍🎓 _Stud. Valinotto Giada, 5B INF 2021/2022_

🏫 _I.I.S. G. Vallauri Fossano_
