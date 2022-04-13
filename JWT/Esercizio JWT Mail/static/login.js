"use strict"

$(document).ready(function() {	
	let _username = $("#usr") //username
	let _password = $("#pwd") //password
	let _lblErrore = $("#lblErrore") //errore
	
    _lblErrore.hide();


	$("#btnLogin").on("click", controllaLogin) //submit credenziali
	
	// il submit deve partire anche senza click 
	// con il solo tasto INVIO
	$(document).on('keydown', function(event) {	 //evento generato qualsiasi tasto viene premuto
	   if (event.keyCode == 13)   //13 corrisponde all'Invio 
		   controllaLogin();
	});
	
	
	function controllaLogin(){
        _username.removeClass("is-invalid"); //rimuove la classe dello username
		_username.prev().removeClass("icona-rossa");  	//mettte un colore al bordino del login in caso di			
        _password.removeClass("is-invalid"); //rimuove la classe della pwd
		_password.prev().removeClass("icona-rossa"); 

		_lblErrore.hide();		
		
        if (_username.val() == "") {
            _username.addClass("is-invalid");  
			_username.prev().addClass("icona-rossa");  
        } 
		else if (_password.val() == "") {
            _password.addClass("is-invalid"); 
			_password.prev().addClass("icona-rossa"); 
        }		
		else { //se è andato a buon fine 
			let request = inviaRichiesta('POST', '/api/login',  
				{ "username": _username.val(),
				  "password": _password.val() 
				}
			);
			request.fail(function(jqXHR, test_status, str_error) {
				if (jqXHR.status == 401) {  // unauthorized -> 401 = ho sbagliato password o username 
					_lblErrore.text(jqXHR.responseText);
					_lblErrore.show(); //mostro l'errore
				} else //errore diverso da 401
					errore(jqXHR, test_status, str_error) //la procedura errore fa semplicementte delle alert
			});
			request.done(function(data, textStatus, jqXHR) {	//Questi parametri permettono di vedere il token	
				alert(jqXHR.getResponseHeader('Authorization'));	
				//Ricevuto il token, lo salvo in localstorage, mediante una versione modificata di inviaRichiesta con il campo beforeSend
				
				window.location.href = "index.html" //vado sulla pagina principale 
			})			
		}
	}
	
	
	_lblErrore.children("button").on("click", function(){
		_lblErrore.hide();
	})
	
});