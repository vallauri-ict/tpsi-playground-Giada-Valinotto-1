"use strict"
// cordova plugin add cordova-plugin-dialogs, cordova-plugin-geolocation

const URL = "https://maps.googleapis.com/maps/api"
$(document).ready(function(){

	//Segue procedura fissa per caricare le mappe grazie alla chiave 
	let promise = caricaGoogleMaps(); //lancia il caricamento delle Google maps sotto forma di promise 
	promise.then(documentReady); //successo -> faccio quel che andrebbe fatto nel document.ready
	promise.catch(function(err){ //fail
		alert('Errore caricamento google maps')	});
})	

function documentReady () {	
  document.addEventListener('deviceready', function() { //aspetta che siano stati agganciati tutti i sensori
														//da usare solo qualora si usino sensori 
 
	let mapContainser = $("#mapContainer")[0]  // js
	let results =  $("#results")
	
    $("#btnAvvia").on("click", startWatch)
    $("#btnArresta").on("click", stopWatch);

	let gpsOptions = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	}
	
 	let watchID = null;
    function startWatch() {
        results.html("");
 		if (!watchID) {	
			watchID = navigator.geolocation.watchPosition(visualizzaPosizione, error, gpsOptions)
            notifica("Lettura Avviata");
		}	
    }	
	
	function stopWatch(){
        if (watchID){	
			navigator.geolocation.clearWatch(watchID);
			watchID=null;
			map=null;
			notifica("Lettura Arrestata");	       
		}		
	}

    /* ************************************************ */
	let map = null;
	let marker = null;
    function visualizzaPosizione(position) {
		results.html(`${position.coords.latitude.toFixed(5)}, 
						  ${position.coords.longitude.toFixed(5)}  
						  &plusmn;${position.coords.accuracy.toFixed(0)}m 
						  - altitudine:${position.coords.altitude}m`)	
        let currentPos = new google.maps.LatLng(position.coords.latitude,
		                                       position.coords.longitude)
		if(!map){		
			let mapOptions = {
				center:currentPos,
				zoom: 16,
			};		
			map = new google.maps.Map(mapContainer, mapOptions);
			marker = new google.maps.Marker({
				map: map,
				position: currentPos,
				title: "Questa è la tua posizione!",
				animation:google.maps.Animation.BOUNCE,
			});	
		}
		
		else{
			marker.setPosition(currentPos);
			// non consente di 'spostare' la mappa. Fastidioso
			// map.setCenter(currentPos)		
		}
    }
	
    function error(err) {
		// Gli errori di timeout sono abbastanza frequenti
		console.log("Errore: " + err.code + " - " + err.message);
    }
	
  })
}



function notifica(msg){		 
	navigator.notification.alert(
		msg,    
		function() {},       
		"GPS",       // Titolo finestra
		"Ok"          // pulsante di chiusura
	);			
}

function caricaGoogleMaps(){ // proccedura fissa
	let promise = new Promise(function(resolve, reject){ // si istanzia una romise a cui passo una function di callback e inietto i due ountatori
		let script = document.createElement('script'); //creo un tag script dinamicamente e lo appendo 
		script.type = 'application/javascript';
		script.src = URL + '/js?v=3&key=' + MAP_KEY; //appendo lo script contenente la key
		document.body.appendChild(script);
		// Il tag script possiede due puntatori a funzione: 
		script.onload = resolve; // codice terminato correttamente
		script.onerror = reject; // codice terminato con errore 
	})
	return promise;
}
