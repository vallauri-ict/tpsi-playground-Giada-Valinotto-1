# ES 02 - CREAZIONE DI UN CRUD SERVER

## Descrizione e finalità dell'esercizio
Realizzazione di un CRUD Server che lavora su una serie di collezioni contenute all'interno di un database di lavoro.
![image](https://user-images.githubusercontent.com/62563624/145955061-824e100c-b12e-4ba4-9c2a-f070aa0cae05.png)


## Crud Server
Il termine CRUD è strettamente collegato alla gestione dei dati digitali. Detto più precisamente, CRUD è un acronimo, che deriva dalle iniziali dalle quattro operazioni fondamentali compiute nei database:
- Create (creare i dati)
- Read o Retrieve (leggere i dati)
- Update (aggiornare i dati)
- Delete o Destroy (eliminare i dati)

Più semplicemente la tavola CRUD riassume le funzioni di cui un utente ha bisogno per creare e gestire i dati. I diversi processi per la gestione dei dati si basano sul CRUD, dove le operazioni sono adattate specificamente alle richieste del sistema e dell’utente, a prescindere dal fatto che si gestiscano dei database o si usino delle applicazioni. Così le operazioni sono gli strumenti di accesso tipici e irrinunciabili con cui gli esperti possono ad esempio verificare dei problemi del database, mentre con una tavola CRUD un utente può creare (create) un account e utilizzarlo (read) quando vuole, aggiornarlo (update) o eliminarlo (delete). Le operazioni CRUD vengono eseguite in maniera diversa a seconda dell’ambiente di programmazione in cui si trovano.

## Svolgimento dell'esercizio
### Realizzazione dell'esercizio
1. All’avvio il client richiede al server l’elenco delle collezioni contenute all’interno del database di lavoro e le visualizza tramite gli appositi Option Button contenuti nel frame di sinistra.
2. In corrispondenza del click su una collezione, l’applicazione deve:
    - Aggiornare le due label superiori con il nome della collezione corrente ed il numero di documenti contenuti
    - Visualizzare all’interno della tabella centrale l’elenco di tutti i record e tutti i campi restituiti dal server. In corrispondenza di questa richiesta il server invia i campi _id, name, gender e hair. Se qualcuno di questi campi indicati nel project non esiste, semplicemente non viene restituito
    - Se la collezione richiesta è unicorns, visualizzare la sezione relativa ai filtri (inizialmente nascosta)

3. In corrispondenza del click su una voce dell’elenco, l’applicazione deve visualizzare nel riquadro di destra tutti i dettagli relativi alla voce selezionata, riportando le chiavi in neretto.
4. 
