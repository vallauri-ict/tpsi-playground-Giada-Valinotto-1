let modulo = require("modulo.js"); //linko la libreria
modulo(); //richiamo la funzione in forma anonima come nomeModulo()
let ris1 = modulo.somma(3,7);
let ris2 = modulo.moltiplicazione(3,7);
console.log(`Il risultato della somma è ${ris1} \nIl risultato della moltiplicazione è ${ris2}`);
console.log(modulo.json.nome); 
modulo.json.setNome("Pluto");
console.log(modulo.json.nome); 
var myClass = modulo.myClass;
console.log(myClass.nome);
