//JS file for Sensors

document.addEventListener("DOMContentLoaded", function () {
    console.log("LOADED");
  
    // Configuration variables
    var updateInterval = 10000; // 5s in ms
    var numberElements = 30;
    var updateCount = 0;

    let mutex = false; // Shared mutex variable
    
   // Chart instances & configuration
   var Humidity = new Chart(document.querySelector('#Humidity'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Humidity',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  var AirTemperature = new Chart(document.querySelector('#AirTemp'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Air Temperature',
        data: [],
        fill: false,
        borderColor: '#706f6f',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

   var Temp = new Chart(document.querySelector('#SoilTemperature'), {
    type: 'line',
    data: {
    datasets: [
      {
        label: "Sensor 1",
        data: [],
        fill: false,
        borderColor: "#990000",
        borderWidth: 1,
        lineTension: 0.5,
      },
      {
        label: "Sensor 2",
        data: [],
        fill: false,
        borderColor: "rgb(0,128,0)",
        borderWidth: 1,
        lineTension: 0.5,
          },
        ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  var Moist = new Chart(document.querySelector('#SoilMoisture'), {
    type: 'line',
    data: {
    datasets: [
      {
        label: "Sensor 1",
        data: [],
        fill: false,
        borderColor: "#990000",
        borderWidth: 1,
        lineTension: 0.5,
      },
      {
        label: "Sensor 2",
        data: [],
        fill: false,
        borderColor: "#706f6f",
        borderWidth: 1,
        lineTension: 0.5,
          },
        ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


 var phLevel= new Chart(document.querySelector('#SoilpH'), {
    type: 'line',
    data: {
    datasets: [
      {
        label: "Sensor 1",
        data: [],
        fill: false,
        borderColor: "#990000",
        borderWidth: 1,
        lineTension: 0.5,
      },
      {
        label: "Sensor 2",
        data: [],
        fill: false,
        borderColor: "#706f6f",
        borderWidth: 1,
        lineTension: 0.5,
          },
        ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  function addData(data, chartInstance, datasetIndex) {
    if (data && chartInstance) {
        const currentTime = new Date();
        const formattedTime =
            currentTime.getHours() +
            ":" +
            currentTime.getMinutes() +
            ":" +
            currentTime.getSeconds();

        // Check if the timestamp already exists, if yes, only add the data to the existing timestamp
        const existingTimestampIndex = chartInstance.data.labels.indexOf(formattedTime);
        if (existingTimestampIndex !== -1) {
            chartInstance.data.datasets[datasetIndex].data[existingTimestampIndex] = data;
        } else {
            chartInstance.data.labels.push(formattedTime);
            chartInstance.data.datasets[datasetIndex].data.push(data);

            // Limit the number of data points to 'numberElements'
            if (chartInstance.data.labels.length > numberElements) {
                chartInstance.data.labels.shift(); // Remove the oldest label
                chartInstance.data.datasets.forEach((dataset) => {
                    dataset.data.shift(); // Remove the oldest data point for each dataset
                });
            }
        }

        // Update stored data in sessionStorage
        sessionStorage.setItem(chartInstance.canvas.id, JSON.stringify(chartInstance.data));

        // Update the chart
        chartInstance.update();

        updateCount++; // Increment the updateCount
    }
}


function addDataDHT(data, chartInstance) {
  if (data && chartInstance) {
      const currentTime = new Date();
      const formattedTime =
          currentTime.getHours() +
          ":" +
          currentTime.getMinutes() +
          ":" +
          currentTime.getSeconds();

      chartInstance.data.labels.push(formattedTime);

      // DHT data has only one dataset
      chartInstance.data.datasets[0].data.push(data);

      // Limit the number of data points to 'numberElements'
      if (chartInstance.data.labels.length > numberElements) {
          chartInstance.data.labels.shift(); // Remove the oldest label
          chartInstance.data.datasets.forEach((dataset) => {
              dataset.data.shift(); // Remove the oldest data point for each dataset
          });
      }
       // Update stored data in sessionStorage
       sessionStorage.setItem(chartInstance.canvas.id, JSON.stringify(chartInstance.data));

      // Update stored data in sessionStorage
      chartInstance.update();

      updateCount++; // Increment the updateCount
  }
}

function updateDataSensors() {
  if (mutex) return; // Check if mutex is locked

  mutex = true; // Acquire mutex lock

  // Use AJAX to fetch data for Sensor 1 and 2 from PHP script
  $.ajax({
    url: "php/dataGenerator.php", // URL to PHP script
    dataType: "json",
    success: function (data) {
      // Handle the data received from the PHP script for Sensor 1 and 2
      addData(data['soilTemperature'], Temp, 0);
      addData(data['soilTemperature2'], Temp, 1);
      addData(data['soilMoisture'], Moist, 0);
      addData(data['soilMoisture2'], Moist, 1);
      addData(data['soilpH'], phLevel, 0);
      addData(data['soilpH2'], phLevel, 1);

      // Release mutex lock
      mutex = false;

      // Continue to fetch data for Sensor 1 and 2 periodically
      setTimeout(updateDataSensors, updateInterval);
    },
    error: function () {
      // Handle any errors if the request fails
      console.error("Error fetching data from the server.");

      // Release mutex lock
      mutex = false;
    },
  });
}
  updateDataSensors();
  
  function updateDHT() {
    if (mutex) return; // Check if mutex is locked
  
    mutex = true; // Acquire mutex lock
  
    // Use AJAX to fetch data for DHT from PHP script
    $.ajax({
      url: "php/dataGenerator.php", // URL to PHP script
      dataType: "json",
      success: function (data) {
        // Handle the data received from the PHP script for DHT
        addDataDHT(data['airHumidity'], Humidity);
        addDataDHT(data['airTemperature'], AirTemperature);
  
        // Release mutex lock
        mutex = false;
  
        // Continue to fetch data for DHT periodically
        setTimeout(updateDHT, updateInterval);
      },
      error: function () {
        // Handle any errors if the request fails
        console.error("Error fetching data for DHT from the server.");
  
        // Release mutex lock
        mutex = false;
      },
    });
  }
  updateDHT();

  function restoreChartState(chartInstance) {
    // Retrieve stored data from sessionStorage
    const storedData = sessionStorage.getItem(chartInstance.canvas.id);

    if (storedData) {
        const parsedData = JSON.parse(storedData);
        chartInstance.data = parsedData;
        chartInstance.update();
    }
}

   // Restore chart states on page load
   restoreChartState(Temp);
   restoreChartState(Moist);
   restoreChartState(phLevel);
   restoreChartState(Humidity);
   restoreChartState(AirTemperature);

// Event listener for the "Reset" button
document.getElementById("resetButton").addEventListener("click", function () {
  clearAllCharts(); // Call the function to clear all charts
});

function clearAllCharts() {
  // Clear the data for all charts
  Temp.data.labels = [];
  Temp.data.datasets.forEach(dataset => dataset.data = []);

  Moist.data.labels = [];
  Moist.data.datasets.forEach(dataset => dataset.data = []);

  phLevel.data.labels = [];
  phLevel.data.datasets.forEach(dataset => dataset.data = []);

  Humidity.data.labels = [];
  Humidity.data.datasets.forEach(dataset => dataset.data = []);

  AirTemperature.data.labels = [];
  AirTemperature.data.datasets.forEach(dataset => dataset.data = []);

  // Clear stored data in sessionStorage
  sessionStorage.clear();

  // Reset the timestamp counter
  updateCount = 0;

  // Update to clear the charts and remove existing data
  Temp.update();
  Moist.update();
  phLevel.update();
  Humidity.update();
  AirTemperature.update();

  // Calculate the time remaining until the next interval
  const remainingTime = updateInterval - (Date.now() % updateInterval);

  // Fetch new data with the next timestamp after the full interval has elapsed
  setTimeout(() => {
    updateDataSensors();
    updateDHT();
  }, remainingTime);
}


  });