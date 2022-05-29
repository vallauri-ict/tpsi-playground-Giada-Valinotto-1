"use strict"

let myChart;
$("document").ready(function(){
    $("#statistica").hide();
    $(".dropdown-item").on("click",function(){
        let id = $(this).text().split(' ')[0];
        let timer = setInterval(function(){
        let request = inviaRichiesta("GET","/api/getData", {"sensor":id})
        request.done(function(data){
            let ultimi200valori = data.reverse().splice(0,201); //Ottengo gli ultimi 200 valori registrati
            console.log(data)
            disegnaGrafico(ultimi200valori)
            $("#valoreMedio").html((media(ultimi200valori)).toFixed(3));
            $("#deviazioneStandard").html(deviazioneStandard(ultimi200valori,$("#valoreMedio").html()).toFixed(3));
            $("#statistica").fadeIn();
        });
        request.fail(errore)
    },5000)
})
})

function disegnaGrafico(data)
{
    const ctx = $("canvas")[0];
    let labels = [] ;
    let values = [];
    for (const item of data) {
        labels.push(item.timestamp);
        values.push(item.value);
    }
    if(myChart)
    {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Sensore "+data[0].sensor.sensorId,
            data: values,
            backgroundColor: [
                '#9ed3d9' 
            ],
            borderColor: [
                '#9ed3d9'
            ],
            borderWidth: 1
        }]
    },
    options: {
    }
})
}

function media(ultimi200valori)
{
    let somma = 0;
    ultimi200valori.forEach(valore => {
        somma+=valore.value;
    });
    console.log(somma/ultimi200valori.length);
    return (somma/ultimi200valori.length);
}

function deviazioneStandard(ultimi200valori, media)
{
    let somma = 0;
    ultimi200valori.forEach(valore => {
        somma += Math.pow(media-(valore.value),2)
    });
    return Math.sqrt(somma/ultimi200valori.length);
}