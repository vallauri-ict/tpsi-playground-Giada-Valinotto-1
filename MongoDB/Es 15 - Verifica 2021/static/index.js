$(document).ready(function () {
  let facts=[];
  let select = $("#lst");
  let textarea = $("#txt");
  selectCreation();
  select.on("change",()=>{
    textarea.val(facts.find((fact)=>fact._id===select.val()).value);
  });


  $("#btnSalva").on("click",()=>{
    let request = inviaRichiesta("post","/api/saveFact",{"_id":select.val(),"value":textarea.val()});
    request.fail(errore);
    request.done(function (data) {
      selectCreation();
    });
  })

  function selectCreation(){
    select.empty();
    textarea.val('');
    let request = inviaRichiesta("get", "/api/getFacts");
    request.fail(errore);
    request.done(function (data) {
      facts=data;
      console.log(data);
      for (const item of data) {
        let option = $("<option>").html(item._id);
        select.append(option);
      }
      select.trigger("change");
    });
  }
});
