window.onload = function() {
    console.log("LOADED");

    //Configuration variables
    var updateInterval = 20 //in ms
    var numberElements = 200;

    //Globals
    var updateCount = 0;

    // Chart Objects
    var humiChart = $("#HumiChart");
    var airTempChart = $("#AirTempChart");
    
    var soilTempChart = $("#SoilTempChart");
    var soilMoistureChart = $("#SoilMoistureChart");
    var soilPhChart = $("#SoilpHChart");

     var soilTempChart2 = $("#SoilTempChart2");
    var soilMoistureChart2 = $("#SoilMoistureChart2");
    var soilPhChart2 = $("#SoilpHChart2")

    //chart instances & configuration
    var commonOptions = {
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                millisecond: 'mm:ss:SSS'
              }
            }
          }],
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
        legend: {display: false},
        tooltips:{
          enabled: false
        }
    };

    var humiChartInstance = new Chart(humiChart, {
        type: 'line',
        data: {
          datasets: [{
              label: "Air Humidity",
              data: 0,
              fill: false,
              borderColor: '#343e9a',
              borderWidth: 1
          }]
        },
        options: Object.assign({}, commonOptions, {
          title:{
            display: true,
            text: "Air Humidity",
            fontSize: 18
          }
        })
    });

    var airTempChartInstance = new Chart(airTempChart, {
        type: 'line',
        data: {
          datasets: [{
              label: "Air Temperature",
              data: 0,
              fill: false,
              borderColor: '#343e9a',
              borderWidth: 1
          }]
        },
        options: Object.assign({}, commonOptions, {
          title:{
            display: true,
            text: "Air Temperature",
            fontSize: 18
          }
        })
    });

    var soilTempChartInstance = new Chart(soilTempChart, {
        type: 'line',
        data: {
          datasets: [{
              label: "Soil Temperature",
              data: 0,
              fill: false,
              borderColor: '#343e9a',
              borderWidth: 1
          }]
        },
        options: Object.assign({}, commonOptions, {
          title:{
            display: true,
            text: "Soil Temperature",
            fontSize: 18
          }
        })
    });

    var soilTempChartInstance2 = new Chart(soilTempChart2, {
        type: 'line',
        data: {
          datasets: [{
              label: "Soil Temperature 2",
              data: 0,
              fill: false,
              borderColor: '#343e9a',
              borderWidth: 1
          }]
        },
        options: Object.assign({}, commonOptions, {
          title:{
            display: true,
            text: "Soil Temperature ",
            fontSize: 18
          }
        })
    });

    var soilMoistureChartInstance = new Chart(soilMoistureChart, {
        type: 'line',
        data: {
          datasets: [{
              label: "Soil Moisture",
              data: 0,
              fill: false,
              borderColor: '#343e9a',
              borderWidth: 1
          }]
        },
        options: Object.assign({}, commonOptions, {
          title:{
            display: true,
            text: "Soil Moisture",
            fontSize: 18
          }
        })
    });

    var soilMoistureChartInstance2 = new Chart(soilMoistureChart2, {
        type: 'line',
        data: {
          datasets: [{
              label: "Soil Moisture 2",
              data: 0,
              fill: false,
              borderColor: '#343e9a',
              borderWidth: 1
          }]
        },
        options: Object.assign({}, commonOptions, {
          title:{
            display: true,
            text: "Soil Moisture ",
            fontSize: 18
          }
        })
    });

    var soilPhChartInstance = new Chart(soilPhChart, {
        type: 'line',
        data: {
          datasets: [{
              label: "Soil pH",
              data: 0,
              fill: false,
              borderColor: '#343e9a',
              borderWidth: 1
          }]
        },
        options: Object.assign({}, commonOptions, {
          title:{
            display: true,
            text: "Soil pH",
            fontSize: 18
          }
        })
    });

    var soilPhChartInstance2 = new Chart(soilPhChart2, {
        type: 'line',
        data: {
          datasets: [{
              label: "Soil pH 2",
              data: 0,
              fill: false,
              borderColor: '#343e9a',
              borderWidth: 1
          }]
        },
        options: Object.assign({}, commonOptions, {
          title:{
            display: true,
            text: "Soil pH ",
            fontSize: 18
          }
        })
    });

    function addData(data) {
      if(data){
        humiChartInstance.data.labels.push(new Date());
        humiChartInstance.data.datasets.forEach((dataset) =>{dataset.data.push(data['airHumidity'])});
          
        airTempChartInstance.data.labels.push(new Date());
        airTempChartInstance.data.datasets.forEach((dataset) =>{dataset.data.push(data['airTemperature'])});
          
        soilTempChartInstance.data.labels.push(new Date());
        soilTempChartInstance.data.datasets.forEach((dataset) =>{dataset.data.push(data['soilTemperature'])});

        soilTempChartInstance2.data.labels.push(new Date());
        soilTempChartInstance2.data.datasets.forEach((dataset) =>{dataset.data.push(data['soilTemperature2'])});
          
        soilMoistureChartInstance.data.labels.push(new Date());
        soilMoistureChartInstance.data.datasets.forEach((dataset) =>{dataset.data.push(data['soilMoisture'])});

        soilMoistureChartInstance2.data.labels.push(new Date());
        soilMoistureChartInstance2.data.datasets.forEach((dataset) =>{dataset.data.push(data['soilMoisture2'])});

        soilPhChartInstance.data.labels.push(new Date());
        soilPhChartInstance.data.datasets.forEach((dataset) =>{dataset.data.push(data['soilpH'])});

        soilPhChartInstance2.data.labels.push(new Date());
        soilPhChartInstance2.data.datasets.forEach((dataset) =>{dataset.data.push(data['soilpH2'])});
  
          
        if(updateCount > numberElements){
          humiChartInstance.data.labels.shift();
          humiChartInstance.data.datasets[0].data.shift();
            
          airTempChartInstance.data.labels.shift();
          airTempChartInstance.data.datasets[0].data.shift();
            
          soilTempChartInstance.data.labels.shift();
          soilTempChartInstance.data.datasets[0].data.shift();

          soilTempChartInstance2.data.labels.shift();
          soilTempChartInstance2.data.datasets[0].data.shift();
            
          soilMoistureChartInstance.data.labels.shift();
          soilMoistureChartInstance.data.datasets[0].data.shift();

          soilMoistureChartInstance2.data.labels.shift();
          soilMoistureChartInstance2.data.datasets[0].data.shift();
            
          soilPhChartInstance.data.labels.shift();
          soilPhChartInstance.data.datasets[0].data.shift();

          soilPhChartInstance2.data.labels.shift();
          soilPhChartInstance2.data.datasets[0].data.shift();  
            
        }
        else updateCount++;
        humiChartInstance.update();
        airTempChartInstance.update();
        soilTempChartInstance.update();
        soilMoistureChartInstance.update();
        soilPhChartInstance.update();

        soilTempChartInstance2.update();
        soilMoistureChartInstance2.update();
        soilPhChartInstance2.update();
      }
    };

    function updateData() {
      console.log("Update Data");
      $.getJSON("dataGenerator.php", addData);
      setTimeout(updateData,updateInterval);
    }

    updateData();
}
