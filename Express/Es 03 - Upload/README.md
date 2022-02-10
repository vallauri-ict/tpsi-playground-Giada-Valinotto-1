# ES 03 - UPLOAD DI IMMAGINI

## Descrizione e finalità dell'esercizio
L'esercizio si pone come scopo quello di realizzare una applicazione che permetta di caricare, associate al nome di chi ne ha effettuato l'upload, di immagini nei formati:
- Binario
- Base64
- Immagine da [Cloudinary](https://cloudinary.com/)

## Formato base64
Una delle codifiche più utilizzate per il web è sicuramente quella chiamata Base64. Difatti, viene utilizzata in uno dei principali strumenti che internet ci mette a disposizione, la posta elettronica: più specificatamente Base64 è usata per convertire le email da binario a ASCII e viceversa.
Il nome deriva dal fatto che utilizza 64 simboli proprio di ASCII, ognuno dei quali ha una corrispondenza binaria ben precisa. Questo algoritmo ovviamente non presenta nessuna caratteristica di sicurezza e quindi sconsigliamo l’utilizzo al fine di criptare le password o qualsiasi altro tipo di dato sensibile.

Il procedimento di conversione di Base64 è molto semplice: l’algoritmo prende ogni singolo simbolo (lettere, numeri e segni) che compongono una email, lo converte in binario e successivamente, a partire da questa conversione, in vari segmenti, ciascuno di essi composto da 6 bit.

Ogni segmento, a sua volta, è convertito in simbolo in base al  proprio valore numerico, secondo uno schema definito: le cifre da 0 a 25 corrispondono alle lettere maiuscole, dal 26 in poi le minuscole, i numeri, il segno dell’addizione quello della barra obliqua, lo slash.

I primi esempi di questo tipo di codifica furono utilizzati per le comunicazioni dial-up analogiche tra sistemi che usavano lo stesso sistema operativo e quindi la stessa tipologia di caratteri. Per esempio, uuencode (utilizzato allora sui sistemi UNIX) usa lettere maiuscole, cifre e molti caratteri di punteggiatura, ma non le lettere minuscole.

## File storage su cloudinary.com
Molto spesso i web server, specie nelle versioni free, non consentono lo storage dei file.

**Cloudinary** è un server di storage gratuito e di facile utilizzo.

Viene usato principalmente per le immagini per le quali dispone di diversi strumenti di editing che
consentono di applicare alle immagini effetti anche molto interessanti.
Una volta eseguita la registrazione ed il login, i file possono essere semplicemente trascinati nell‟apposita
area oppure uploadati mediante l‟utilizzo qualsiasi linguaggio di programmazione. Esistono librerie di
accesso a cloudinary in quasi tutti i linguaggi di programmazione.

In corrispondenza dell'upload di una immagine che può essere espressa in formato binario oppure in
formato base64, Cloudinary restituisce una URL pubblica della posizione in cui è stato salvato il file.
La richiesta di storage può essere gestita in due modi:
- Direttamente dal client che poi invia al server la URL ricevuta da cloudinary
- Il client invia il file al server in formato binario oppure in formato base64 ed il server provvederà lui a
salvarlo su cloudinary che gli restituirà la URL da salvare nel database.

L'upload fatto dal server è sicuramente più pesante ma anche più sicuro perchè può essere protetto con le
chiavi di accesso a cloudinary. Viceversa, nel caso del client, è assolutamente sconsigliato salvare le chiavi
sul client che quindi, solitamente, esegue i propri upload senza alcuna autenticazione.
Molti esempi della documentazione ufficiale sono disponibili soltanto per i linguaggi lato server.
### Utilizzo lato server tramite node.js
```javascript
const CLOUD_NAME = "roberto-mana "
const API_KEY = "673959956397347"
const API_SECRET = "********************"
const CLOUDINARY_URL = "cloudinary://673959956397347:******************@roberto-mana"
```
CLOUDINARY_URL è l'unione delle tre precedenti
```
npm install cloudinary
```
Allo stato attuale, la libreria è già compatibile con TypeScript senza necessità di un wrapper esterno
```javascript
const cloudinary = require('cloudinary')
cloudinary.v2.config({
 cloud_name: CLOUD_NAME,
 api_key: API_KEY,
 api_secret: API_SECRET,
});
```


## Upload immagini base64 su Cloudinary
Sia req.body.image l‟immagine base64 inviata dal client al server nodejs.
Per eseguire l‟upload su cloudinary si può eseguire il seguente codice:
```javascript
app.post("/api/uploadImage/", function(req, res, next){
 cloudinary.v2.uploader.upload(req.body.image)
 .catch((error) => {
 res.status(500).send("error uploading file to cloudinary")
 })
 .then((result) => {
 res.send({"url":result.secure_url})
 })
})

```
dove result è un json contenente, tra le altre cose, all‟interno del campo secure_url la url pubblica
assegnata da cloudinary all‟immagine. 
```javascript
{
 asset_id: 'b8246a3779ed2c7889aaf1118219ce25',
 public_id: 'fhneqkvepqey9iceyzav',
 version: 1617889660,
 version_id: '216ef74442fa57cf3deec888b403f927',
 signature: 'b58250fd6dbc2023c56f974c028fd7fa0770f1d2',
 width: 300,
 height: 225,
 format: 'jpg',
 resource_type: 'image',
 created_at: '2021-04-08T13:47:40Z',
 tags: [],
 bytes: 42165,
 type: 'upload',
 etag: '5f00140464423022c6be23e2a55a28bf',
 placeholder: false,
 url: 'http://res.cloudinary.com/
 roberto-mana /image/upload/v1617889660/fhneqkvepqey9iceyzav.jpg',
 secure_url: 'https://res.cloudinary.com/
 roberto-mana /image/upload/v1617889660/fhneqkvepqey9iceyzav.jpg'
}
```

_stud. Valinotto giada, classe 5B Informatica 2021/2022_
