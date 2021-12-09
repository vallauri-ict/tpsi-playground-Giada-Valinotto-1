$(document).ready(function () {
  let select = $("#lst");
  selectCreation(select);
  });


  $("#btnSalva").on("click",()=>{
    let request = inviaRichiesta("get","/api/FindUnicorn",{"name":select.val(),"gender":"f"});
    request.fail(errore);
    request.done(function (data) {
      console.log(data);
    });
  })

  function selectCreation(){
    select.empty();
    let request = inviaRichiesta("get", "/api/getUnicorns");
    request.fail(errore);
    request.done(function (data) {
      console.log(data);
      for (const item of data) {
        let option = $("<option>").html(item.name);
        select.append(select);
      }
      select.trigger("change");
    });
  }

