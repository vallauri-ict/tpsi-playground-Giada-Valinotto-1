'use strict';

// Viene scatenato quando la pagina è pronta
document.addEventListener('deviceready', onDeviceReady, false);

/** ======
 *  ## VARIABILI GLOBALI
 * ============================================== **/
let perizie = []
let perizia = null

// Utile per selezionare la perizia da visualizzare/modificare
let index_perizia = 0

// Utile per selezionare l'immagine da visualizzare
let index_carousel = 0


/** ======
 *  ## MAIN
 * ============================================== **/
function onDeviceReady() {
    const login_page = $("#login_page")
    const main_page = $("#main_page")

    // Visualizzazione della pagina di login con l'effetto fade-in
    $(login_page).fadeIn(100, function () { $(login_page).addClass('active') });

    /** !== LOGIN == **/
    $("#btn_login").on('click', function ()  {
        // Dati inviati al server
        let data = {
            email: $("#email").val(),
            password: $("#pwd").val()
        }

        // Controllo se i campi non sono vuoti
        if(data.email !== '' && data.password !== ''){
            // Reset dei valori dei campi
            $('#email').val(''); $('#pwd').val('')
            inviaRichiesta('POST', '/api/operatore_login', data).then(function (result)  {
                // Controllo se le credenziali erano corrette
                if(result.ris === "ok"){
                    // Salvo il token nel session storage
                    sessionStorage.setItem('token', result.token)
					console.log(result)
					$("#lbl_nome").html(result.data.cognome + ' ' + result.data.nome)
                    // Ottengo e salvo le perizie dell'operatore
                    inviaRichiesta('POST', '/api/operatore_getall', {}).then(function (result)  {
                        perizie = result
                        perizie.forEach(function (perizia) { print_perizia(perizia) })

                        // Chiudo la pagina di login con l'animazione fade-out e apro quella principale
                        $(login_page).fadeOut(100, function ()  {
                            $(login_page).removeClass('active')
                            $(main_page).addClass('active')
                        })
                    })
                }
                else{
                    show_message('Email e/o password errata', 'Errore')
                }
            })
        }
        else
            show_message('Inserire mail e/o password', 'Errore')
    })

    /** !== LOGOUT == **/
    $("#btn_logout").on('click', function ()  {
        logout()
    })

    /** !== SIDEBAR == **/
    // Apre il menu laterale
    $("#btn-sidebar").on('click', function ()  {
        $("#sidebar").addClass('active')
        $(".content").addClass('active')
    })

    // Si chiude cliccando sullo sfondo nero trasparente
    $(".bg").on('click', function ()  {
        $("#sidebar").removeClass('active')
        $(".content").removeClass('active')
    })

    /** !== ADD EVALUATION === **/
    $("#btn_add").on('click', function ()  {
        /*
            Ottengo, se è possibile, la posizione dell'operatore.
            Se questo non è possibile, allora l'operatore non può aggiungere la perizia
         */
        navigator.geolocation.getCurrentPosition(function (pos)  {
            let data = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                description: $("#add_description").val(),
                date: new Date().toLocaleDateString(), // Ritorna la data in formato gg/mm/yyyy
                images: []
            }
            // Controllo che il campo non sia vuoto
            if(data.description !== ''){
                inviaRichiesta('POST', '/api/operatore_create', data).then(function (result)  {
                    // Salvo la nuova perizia in locale e la "stampo" nella schermata
                    data._id = result.id
                    perizie.push(data)
                    print_perizia(data)
                    // Reseto il campo
                    $('#add_description').val('')
                    show_message('Perizia aggiunta con successo', 'Fatto!')
                })
            }
            else{
                show_message('Inserire la descrizione della perizia', 'Errore')
            }
        }, function (err) { show_message(err, 'Errore') });
    });

    /** !== ADD IMAGES == **/
    /*
        Per evitare di mostrare all'utente il solito "Scegli file" come avviene nel browser,
        lo inserisco nella pagina html e lo nascondo. Quando clicco sul button "Aggiungi foto", creo una
        simulazione del click sull'input di tipo 'file'
     */
    $("#btn_file").on('click', function () { $("#file").trigger('click') })

    /** !== UPDATE DESCRIPTION == **/
    $("#btn_update").on('click', function ()  {
        let data = {
            id: perizia._id,
            description: $("#update_description").val()
        }
        inviaRichiesta('POST', '/api/operatore_update', data).then(function ()  {
            // Aggiorno i dati localmente
            let index = perizie.findIndex(function (p) { return p === perizia })
            perizie[index].description = data.description;
            show_message('Descrizione aggiornata con successo!', 'Fatto!')
        })
    })

    /** !== CAROUSEL == **/
    /*
        Gestione dell'immagine da mostrare all'utente tramite i button
     */

    $("#btn_backward").on('click', function ()  {
        // Controllo dell'indice
        if (index_carousel>0){
            index_carousel--
            $("#img").attr('src', perizia.images[index_carousel])
        }
    })

    $("#btn_forward").on('click', function ()  {
        // Controllo dell'indice
        if (index_carousel!==perizia.length-1){
            index_carousel++
            $("#img").attr('src', perizia.images[index_carousel])
        }
    })
}

/** ======
 *  ## FUNZIONI
 * ============================================== **/

/*
    Funzione che permette di selezionare il tab da visualizzare.
    N.B: il tab è un widget di bootstrap
 */
function change_tab (item)  {
    // Nascondo il "vecchio" tab
    $(".tab-pane.active").removeClass('active')
    // Mostro il tab da visualizzare
    $(item).addClass('active')

    // Chiudo il menu laterale
    $("#sidebar").removeClass('active')
    $(".content").removeClass('active')
}


/*
    Funzione che permette di mostrare un messaggio all'utente.
 */
function show_message (text, title)  {
    // Uso il widget dedicato in caso ci trovassimo su android
    if(navigator){
        navigator.notification.alert(
            text,    // message
            null,    // callback
            title,   // title
            'OK'     // buttonName
        );
    }
    else{
        window.alert(text)
    }
}


/*
    Funzione che permette di "stampare" una perizia sullo schermo
 */
function print_perizia (data)  {
    // Creo la carta
    let card = $("<div onclick=\"show_perizia(" + index_perizia + ")\" class=\"card-perizia d-flex align-items-center border rounded justify-content-between px-4 py-3\">")

    // Creo il div con il numero della perizia e la data in cui è stata creata
    let title = $("<div>")
    title.append("<h6 class=\"mb-0\">" + (index_perizia+1) + "° PERIZIA</h6>")
    title.append("<span class=\"small\">" + data.date + "</span>")

    // Aggiungo il div appena creato e l'icona della freccia a destra
    card.append(title)
    card.append("<svg width=\"15\" fill=\"#21C7A7\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\"><path d=\"M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z\"/></svg>")

    // Aggiungo la carta appena creata alla griglia
    $("#perizie").append(card)

    index_perizia++
}

/*
    Funzione che permette di visualizzare i dati di una perizia selezionata
 */
function show_perizia (index)  {
    perizia = perizie[index]
    index_carousel=0

    // Visualizzo, se è presente, la prima immagine
    if(perizia.images.length!==0)
        $("#img").attr('src', perizia.images[0])
    else
        $("#img").attr('src', 'null')

    // Setto l'url per mostrare la posizione della perizia su Google Maps
    $("#btn_maps").attr('href', 'https://maps.google.com/?q='+ perizia.lat +',' + perizia.lng)

    // Mostro la descrizione della perizia
    $("#update_description").val(perizia.description)

    // Cambio il tab
    change_tab('#perizia_tab')
}

/*
    Funzione che permette di effettuare il logout all'utente
 */
function logout ()  {
    // Cancello il token
    sessionStorage.clear()
    // Reset variabili globali
    index_carousel = index_perizia = 0
    // Reset grafica
    $("#perizie").children().remove()
	// Chiudo il menu laterale
	$("#sidebar").removeClass('active')
	$(".content").removeClass('active')
	change_tab('#perizie_tab')
    // Nascondo la pagina principale tramite l'animazione fade-out e mostro quella di login
    $('#main_page').fadeOut(100, function ()  {
        $('#main_page').removeClass('active')
        $('#login_page').addClass('active')
    })
}

/*
    Funzione che permette di caricare una foto sul server
 */
function upload_image (event)  {
    // Ottengo l'immagine selezionata
    let file = event.target.files[0];

    // Creo l'oggetto FileReader, utile per codificare l'immagine in una stringa base64
    const fr = new FileReader()
    fr.readAsDataURL(file)

    // Viene scatenato quando il file reader finisce di codificare l'immagine
    fr.onload = function ()  {
        let data = {
            id: perizia._id,
            image: fr.result
        }

        // la stringa viene inviata al server e verrà salvata sul servizio Cloudinary
        inviaRichiesta('POST', '/api/operatore_addimage', data).then( function (result)  {
            let index = perizie.findIndex(function (p) { return p === perizia })
            perizie[index].images.push(result.url)
            console.log(perizia)

            // se è la prima immagine della perizia, la visualizzo
            if(perizia.images.length===1)
                $("#img").attr('src', perizia.images[0])

            show_message('Immagine aggiunta con successo!', 'Fatto!')
        })
    }
}
