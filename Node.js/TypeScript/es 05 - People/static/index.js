"use strict"

const { request } = require("http");

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
        _divDettagli.hide();
        for (const person of data)
        {
            let tr=$("<tr>").appendTo(_tabStudenti);
            for (const key in person)
                { //Il forin scorre le chiavi di un json
                $("<td>").appendTo(tr).html(person[key]); //person.key NON va bene
                }
                let td=  $("<td>").appendTo(tr);
                $("<button>").appendTo(td).html("Dettagli").on("click", dettagli).prop("name",person.name);
                td=  $("<td>").appendTo(tr);
                $("<button>").appendTo(td).html("Elimina").prop("name",person.name); //in alternativa all'on usato su dettagli, uso Delegate             
            }
            
        })
    }


    //Delegate Event per il Button Elimina -> Pseudo-selettore CSS come secondo parametro
    //Punta a TUTTI i button che contengono al loro interno la parola "Elimina"
    //In alternativa posso utilizzare un selettore asociato ad una classe che do al button
    _tabStudenti.on("click", "button:contains(Elimina)" ,function()
    {
            let requestElimina = inviaRichiesta("DELETE","/api/elimina", {"person":$(this).prop("name")});
            request.fail(errore);
            request.done(function(data)
            {

            })
            
    })

    function dettagli()
    {
        let requestDettagli = inviaRichiesta("PATCH", "/api/dettagli", {"person": $(this).prop("name")});
        let name= this.prop("name");
        requestDettagli.fail(errore);  
        request.done(function(person)
        {
            console.log(person)
            _divDettagli.show(1000);
            $(".card-img-top").prop('src',person.picture.thumbnail);
            $(".card-title").html(name);
            let s= `<b>gender:</b> ${JSON.stringify(person.gender)}<br>`;
            s += `<b>address:</b> ${JSON.stringify(person.location)}<br>`;
            s += `<b>email:</b> ${JSON.stringify(person.email)}<br>`;
            s += `<b>dob:</b> ${JSON.stringify(person.dob)}<br>`;

        })
    }
})