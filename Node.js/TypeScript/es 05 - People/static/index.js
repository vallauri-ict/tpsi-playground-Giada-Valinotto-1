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
        for(let i =0; i< data.nazioni.length;i++)
        {
            $('<a>',{
                'class':'dropdown-item',
                'href':'#',
                'text':data.nazioni[i],
                'click':visualizzaPersone
            }).appendTo(_lstNazioni);
        }
    })


    function visualizzaPersone()
    {
        let nation= $(this).text();
        let requestPersone= inviaRichiesta("GET","/api/persone",{"nazione":nation});
        requestPersone.fail(errore);
        requestPersone.done(function(data){
        console.log(data);
        _tabStudenti.empty(); // = .html("");
        for (const person of people)
        {
            let tr=$("<tr>").appendTo(_tabStudenti);
            for (const key in person)
                { //Il forin scorre le chiavi di un json
                $("<tr>").appendTo(tr).html(person[key]); //person.key NON va bene
                }
                let td=  $("<tr>").appendTo(tr);
                $("button").appendTo(td).html("Dettagli");
                td=  $("<tr>").appendTo(tr);
                $("button").appendTo(td).html("Elimina");              
        }
    })
    }
})