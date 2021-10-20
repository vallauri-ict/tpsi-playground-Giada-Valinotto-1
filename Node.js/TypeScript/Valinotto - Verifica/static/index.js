$(document).ready(function() {
    let _categorylist = $("#categoryList");
    let _btnAdd = $("btnAdd");
    let _mainWrapper = $("#mainWrapper");
    let request = inviaRichiesta("GET", "api/categories");
    request.fail(errore);
    request.done(function(categorie){
        console.log(categorie);
        let lst = $("<select>");
        for (const categoria of categorie) {
            let opt= $("<option>");
            opt.html(categoria);
            opt.appendTo(lst);
        }
        lst.appendTo(_categorylist);
    })

    let requestFacts = inviaRichiesta("GET", "api/facts", {"category": "career"});
    requestFacts.fail(errore);
    requestFacts.done(function(facts){
        console.log(facts);

        for (const fact of facts) {
            let _chk= $("<input>");
            _chk.prop("type","checkbox"); 
            _chk.appendTo(_mainWrapper);
            let _p = $("<p>");
            _p.text(fact.value);
            _p.appendTo(_mainWrapper);
        }
    })
    // _btnAdd.on("click",function(){
    //     let requestRate= inviaRichiesta("POST", "/api/rate", {"ids":""});
    // })
});
