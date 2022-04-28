function inviaRichiesta(method, url, parameters = {}) {
    let contentType;
    if (method.toUpperCase() == "GET") {
        contentType = "application/x-www-form-urlencoded; charset=UTF-8"
    } 
	else {
        contentType = "application/json; charset=utf-8"
        parameters = JSON.stringify(parameters);
    }

    return $.ajax({
        url: url, //default: currentPage
        type: method,
        data: parameters,
        contentType: contentType,
        dataType: "json",
        timeout: 5000,
        //prima di spedire la richiesta al server 
        // recupera il token da localStorage
		beforeSend: function(jqXHR) {
		   /*if ("token" in localStorage) {
				let token = localStorage.getItem("token");  
				jqXHR.setRequestHeader("Authorization", token);
		   }*/
		},
        //dopo aver ricevuto il token dal server lo salva su localStorage
		success: function(data, textStatus, jqXHR){
			//let token = jqXHR.getResponseHeader('Authorization')
			//localStorage.setItem("token", token)  
            console.log(document.cookie)
		}
    });
}



function errore(jqXHR, testStatus, strError) {
    if (jqXHR.status == 0)
        alert("Connection refused or Server timeout");
    else if (jqXHR.status == 200)
        alert("Formato dei dati non corretto : " + jqXHR.responseText);
    else if (jqXHR.status == 403) // forbidden
        window.location.href = "login.html"
    else
        alert("Server Error: " + jqXHR.status + " - " + jqXHR.responseText);
}