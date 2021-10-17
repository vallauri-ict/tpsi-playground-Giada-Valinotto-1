"use strict"
$(window).ready(function(){
    let _wrapper=$("#wrapper");
    let _news = $("#news");
    let request = inviaRichiesta("get", "/api/elenco");
    request.fail(errore);
    request.done(function(notizie){
        console.log(notizie);
        for (const notizia of notizie) {
            let span= $("<span>");
            span.text(notizia.titolo);
            span.addClass("titolo");
            span.appendTo(_wrapper);
            let a = $("<a>");
            a.text(" Leggi ");
            a.prop("href","#");
            a.prop("notizia", notizia);
            a.appendTo(_wrapper);
            span= $("<span>");
            span.addClass("nVis");
            span.text("[Visualizzato "+ notizia.visualizzazioni +" volte]");
            span.appendTo(_wrapper);
            let br= $("<br>");
            br.appendTo(_wrapper);
        }
    })
    _wrapper.on("click","a",leggiFile);

    function leggiFile()
    {
        let nomeFile= $(this).prop("notizia").file;
        console.log(nomeFile);
        let request = inviaRichiesta("POST","/api/dettagli", {"nomeFile":nomeFile});
        request.fail(errore);
        request.done(function(data)
        {
            console.log(data);
            let contenuto= data.file;
            _news.html(contenuto);
        })
    }
})