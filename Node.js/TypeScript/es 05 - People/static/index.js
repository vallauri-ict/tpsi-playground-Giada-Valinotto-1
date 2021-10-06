"use strict"
$(document).ready(function() {
    let _lstNazioni = $("#lstNazioni");
    let _tabStudenti = $("#tabStudenti");
    let _divDettagli = $("#divDettagli");

    _divDettagli.hide()

 //All’avvio il client invia al server una richiesta /nazioni e visualizza una lista con tutte le nazioni ricevute.
    let requestNazioni= inviaRichiesta("GET","/api/nazioni");
    requestNazioni.fail(errore);
    requestNazioni.done(function(data){
        console.log(data);
    })
})