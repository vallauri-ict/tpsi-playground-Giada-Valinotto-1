# ES 13 - AGGREGATE

### Descrizione e finalità dell'esercizio
L'esercizio consiste nell'eseguire una serie di query, le quali hanno lo scopo di resistuire alcuni recordset sulla base dell'uso del metodo aggregate().

Le query di esempio sono estrapolate dalle [dispense utilizzate in classe](http://robertomana.it/).

### Metodo aggregate()
Mentre **find()** esegue un singolo comando (costituito eventualmente da una AND di tante condizioni), il
metodo **aggregate()** si aspetta come parametro un vettore enumerativo contenente un elenco ordinato
di operatori di aggregazione (pipeline) che:
- vengono eseguito sequenzialmente uno dopo l‟altro
- ognuno opera a catena sul recordset restituito dall‟operatore precedente
È simile al **group by** degli R-DBMS ma con notevoli potenzialità aggiuntive.

Gli operatori principali sono:
- $match applica un filtro sul recordset ricevuto ed utilizza la stessa sintassi del find(). È possibile utilizzare più macth successvi per concatenare condizioni multiple.
- $group raggruppa i record sulla base di uno o più campi indicati.
- $project consente di realizzare una proiezione sui campi che dovranno essere utilizzati dall'operatore successivo. Accetta al suo interno l‟utilizzo delle funzioni di aggregazione (come ad esempio $avg()) in modo da poter eseguire calcoli che coinvolgono più colonne oppure su campi singoli costituiti da vettori enumerativi
- $unwind consente di "srotolare" un campo costituito da un vettore enumerativo producendo un elenco di N documenti ciascuno contenente una sola delle voci presenti all‟interno del vettore enumerativo.
- $sort esegue un ordinamento sul recordset finale. Accetta come parametro un JSON avente come chiavi una o più delle chiavi restituite dall'operatore $group
- $limit
- $skip

A differenza del find(), in cui viene eseguito SEMPRE prima lo SKIP, questa volta i
due operatori vengono eseguiti nell'ordine in cui sono scritti:
- {$limit:100}, {$skip:10} Ne prende 100 e poi elimina i primi 10 [10-100]
- {$skip:10}, {$limit:100} Ne esclude 10 poi prende i primi 100 [10-110]

Le opzioni $match e $project possono essere utilizzate anche DOPO l'opzione $group, nel qual caso
agiscono sui gruppi restituiti da $group, consentendo di fatto di realizzare il tipico costrutto having ($match)
oppure di rielaborare ulteriormente le colonne restituite da $group ($project). L'opzione $group a sua volta
può essere richiamata una seconda volta per raggruppare ulteriormente i gruppi già creati dal primo $group
ed eventualmente filtrati tramite $match e $project.

### Database
L'esercizio si regge sui seguenti database:
- ORDERS
```json
[ {"_id": 1,  "cust_id": "abc1",  "status": "A",  "amount": 50,  "qta":30,  "nDettagli" : [7, 12, 11]  },
  {"_id": 2,  "cust_id": "xyz1",  "status": "A",  "amount": 100, "qta":46,  "nDettagli" : [10, 16, 20]  },
  {"_id": 3,  "cust_id": "xyz1",  "status": "D",  "amount": 25,  "qta":70,  "nDettagli" : [30, 20, 20]  },
  {"_id": 4,  "cust_id": "xyz1",  "status": "D",  "amount": 125, "qta":20,  "nDettagli"  : [5, 10, 5]  },
  {"_id": 5,  "cust_id": "abc1",  "status": "A",  "amount": 25,  "qta":32,  "nDettagli" : [10, 10, 12]  }
]
```
- STUDENTS
```json
[ {"_id": 1, "quizzes": [10,6,7], "labs": [5,8], "midterm": 75, "final": 80 },
  {"_id": 2, "quizzes": [9,10 ],  "labs": [8,8], "midterm": 80, "final": 95 },
  {"_id": 3, "quizzes": [4,5,5],  "labs": [6,5], "midterm": 70, "final": 78 }
]
```
- QUIZZES
```json
[ {"_id": 1, "quizzes": [10,6,7], "labs": [5,8], "midterm": 75, "final": 80 },
  {"_id": 2, "quizzes": [9,10 ],  "labs": [8,8], "midterm": 80, "final": 95 },
  {"_id": 3, "quizzes": [4,5,5],  "labs": [6,5], "midterm": 70, "final": 78 }
]
```
- UNICORNS
 ```json
 [ {"name":"Horny",  "dob":"1992-02-13", "loves": ["carrot","papaya"], "weight": 600, "gender": "m", "vampires":63, "hair":"grey"},
  {"name":"Aurora", "dob":"1991-01-24", "loves": ["carrot","grape"], "weight": 450, "gender": "f", "vampires": 43, "hair":"blonde"},
  {"name":"Unico",  "dob":"1973-01-09", "loves": ["energon","strawberry"], "weight": 984, "gender": "m", "vampires": 182, "hair":"brown"},
  {"name":"Roodles","dob":"1979-07-18", "loves": ["apple"], "weight": 575, "gender": "m", "vampires": 99, "hair":"brown"},
  {"name":"Solnara","dob":"1985-06-04", "loves": ["apple","carrot","chocolate"], "weight":550, "gender":"f", "vampires":80, "hair":"grey"},
  {"name":"Ayna",   "dob":"1998-02-07", "loves": ["strawberry","lemon"], "weight":733, "gender":"f", "vampires": 40, "hair":"brown"},
  {"name":"Kenny",  "dob":"1997-06-01", "loves": ["grape","lemon"], "weight": 690, "gender": "m", "vampires": 39, "hair":"grey"},
  {"name":"Raleigh","dob":"2005-04-03", "loves": ["apple", "sugar"], "weight": 421, "gender": "m", "vampires": 2, "hair":"brown"},
  {"name":"Leia",   "dob":"2001-09-08", "loves": ["apple", "watermelon"], "weight":601, "gender":"f", "vampires": 33, "hair":"blonde"},
  {"name":"Pilot",  "dob":"1997-02-01", "loves": ["apple", "watermelon"], "weight":650, "gender":"m", "vampires": 54, "hair":"brown"},
  {"name":"Nimue",  "dob":"1999-11-20", "loves": ["grape", "energon"], "weight": 540, "gender": "f", "hair":"blonde", "vaccinated":true},
  {"name":"Dunx",   "dob":"1976-06-18", "loves": ["grape", "watermelon"], "weight":704, "gender":"m", "vampires":165, "hair":"grey"}
]
```
_stud. Valinotto Giada, classe 5B Informatica 2021/2022_
