"use strict"
let myChart;
$("document").ready(function(){
    $(".dropdown-item").on("click",function(){
        let id = $(this).text().split(' ')[0];
        let request = inviaRichiesta("GET","/api/getData", {"sensor":id})
        request.done(function(data){
            console.log(data)
            disegnaGrafico(data)
        });
        request.fail(errore)
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
            label: data[0].sensor.sensorId,
            data: values,
            backgroundColor: [
                'rgba(153, 102, 255, 0.2)'  
            ],
            borderColor: [
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
    }
})
 
}