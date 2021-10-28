 <img src="https://www.ovhcloud.com/sites/default/files/styles/text_media_horizontal/public/2021-05/MongoDB_Logo_FullColorBlack_RGB-4td3yuxzjs.png"></img>
 
 
 ### Overview
MongoDB (da humongous = gigantesto) è un database noSQL, document oriented, schema-free. 
Secondo recenti statistiche, è il DBMS noSQL più utilizzato al mondo (lo utilizzano tra gli altri eBay,
Foursquare, SourceForgee ed il New York Times). 
MongoDB è stato sviluppato a partire dal 2007 in C++ dalla piccola società americana 10gen (oggi
diventata MongoDB Inc.) e rilasciato sotto una combinazione della GNU Affero General Public License e
dell'Apache License. La versione base è libera e open source.

---------------------------------------------------------------------------------------------------
 
### Semplifica lo sviluppo
Il modello del documento di MongoDB è facile da comprendere e utilizzare per gli sviluppatori, e offre allo stesso tempo tutte le funzionalità richieste per soddisfare i requisiti più complessi a qualsiasi scala. Sono disponibili driver per più di 10 linguaggi, oltre alle varie decine sviluppati dalla community.

---------------------------------------------------------------------------------------------------

### Caratteriestiche fondamentali
Supporta la replicazione multi-server, in modo da garantire la persistenza dei dati.
Dalla versione 2.0 il journaling è attivo per default, il che garantisce il recupero rapido dei dati di un server
che sia andato in crash o che abbia subito una perdita di alimentazione.

MongoDB può gestire più database ognuno dei quali può contenere più collezioni.
Una collezione è una raccolta di documenti. Ogni documento può avere un suo set specifico di campi.

Volendo fare una analogia con gli R-DBMS si potrebbe dire che :
1. collezione -> tabella
2.  documento -> riga (record della tabella)
3. campo -> campo del record

- Il valore di un campo può essere a sua volta un altro JSON Object o un vettore
- Ogni documento deve essere identificato da un valore univoco, detto ObjectID e denominato _id
Il campo _id può essere definito esplicitamente in fase di inserimento oppure si può lasciare che sia
MongoDB a generare un valore. Può essere indifferentemente numerico (1, 2, 3, etc) oppure stringa
("a1", "2", "a3", etc). Quello generato da mongo è di tipo ObjectID. Per impostazione predefinita è
indicizzato. Se si imposta un _id già esistente, viene generato un errore di chiave duplicata.
- Su ogni collezione è possibile definire degli indici analoghi agli indici degli R-DBMS.
- Quando si chiedono dati a MongoDB questi restituisce un puntatore al set dei risultati chiamato
cursore che è analogo al puntatore a recordset restituito da un R-DBMS. Con il cursore si possono
compiere operazioni come contare i documenti o spostarsi in avanti, prima ancora di scaricare i dati.

---------------------------------------------------------------------------------------------------

### Principali vantaggi
- MongoDB memorizza i dati in documenti flessibili JSON-like, il che significa che i campi possono variare da un documento all'altro ed è possibile modificare nel tempo la struttura dei dati

- Il modello di documento mappa gli oggetti del codice applicativo, semplificando il lavoro sui dati

- Le query ad hoc, l'indicizzazione e l'aggregazione in tempo reale offrono efficaci modalità di accesso e analisi dei dati

- MongoDB è concepito in origine come database distribuito; l'alta disponibilità, la scalabilità orizzontale e la distribuzione geografica sono quindi native e facili da usare

- MongoDB è utilizzabile gratuitamente. Le versioni rilasciate prima del 16 ottobre 2018 sono pubblicate sotto licenza AGPL. Tutte le versioni rilasciate dopo il 16 ottobre 2018, incluse le patch correttive per le versioni precedenti, sono pubblicate sotto licenza [Server Side Public License (SSPL) v1] (/ licensing / server-side-public-licence).
