//JS file for Sensors

    // Configuration variables
    var updateInterval = 10000; //5 mins //10s
    var numberElements = 30;
    var updateCount = 0;
    
  // Chart Objects

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
        lineTension: 0.1,
      },
      {
        label: "Sensor 2",
        data: [],
        fill: false,
        borderColor: "rgb(0,128,0)",
        lineTension: 0.1,
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
        borderColor: "#3cb371",
        tension: 0.1
      },
      {
        label: "Sensor 2",
        data: [],
        fill: false,
        borderColor: "#5f6062",
        tension: 0.1
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
        borderColor: "#363031",
        tension: 0.1
      },
      {
        label: "Sensor 2",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1
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
        localStorage.setItem(chartInstance.canvas.id, JSON.stringify(chartInstance.data));

        // Update the chart
        chartInstance.update();

        updateCount++; // Increment the updateCount
    }
}


function addDataDHT(data, chartInstance) {
  if (data && chartInstance) {
    const currentTime = new Date();
    const formattedTime = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();

    // Push data to chart labels and datasets
    chartInstance.data.labels.push(formattedTime);
    chartInstance.data.datasets[0].data.push(data);

    // Limit the number of data points to 'numberElements'
    if (chartInstance.data.labels.length > numberElements) {
      chartInstance.data.labels.shift(); // Remove the oldest label
      chartInstance.data.datasets.forEach((dataset) => {
        dataset.data.shift(); // Remove the oldest data point for each dataset
      });
    }

    // Update stored data in sessionStorage
    localStorage.setItem(chartInstance.canvas.id, JSON.stringify(chartInstance.data));

    // Update the chart
    chartInstance.update();

    updateCount++; // Increment the updateCount
  }
}

let lastDataFetchTimestamp = 0;
let throttlingInterval = 10000; // 10 seconds

// Update the updateDataSensors function
function updateDataSensors() {
  const lastFetchTimestamp = parseInt(localStorage.getItem('lastDataFetchTimestampSensor') || '0', 10);
  const currentTime = Date.now();

  if (currentTime - lastFetchTimestamp >= 10000) {
    localStorage.setItem('lastDataFetchTimestampSensor', currentTime.toString());

    // Use XHR to fetch data for Sensor 1 and 2 from PHP script
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/dataGenerator.php', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var data = JSON.parse(xhr.responseText);
          if (data.isActive) { // Check if isActive is true
            addData(data['soilTemperature'], Temp, 0);
            addData(data['soilMoisture'], Moist, 0);
            addData(data['soilpH'], phLevel, 0);
            // Continue to fetch data periodically
            setTimeout(updateDataSensors, updateInterval);
          } else {
            console.log('The Python script is not active. No updates will be made to the chart.');
          }
        } else {
          // Handle any errors if the request fails
          console.error("Error fetching data from the server. Status code: " + xhr.status);
        }
      }
    };

    xhr.onerror = function () {
      // Handle any errors if the request fails
      console.error("Error fetching data from the server.");
    };

    xhr.send();
  } else {
    setTimeout(updateDataSensors, 10000 - (currentTime - lastFetchTimestamp));
  }
}

// Update the updateDHT function
function updateDHT() {
  const lastFetchTimestamp = parseInt(localStorage.getItem('lastDataFetchTimestampDHT') || '0', 10);
  const currentTime = Date.now();

  if (currentTime - lastFetchTimestamp >= 10000) {
    localStorage.setItem('lastDataFetchTimestampDHT', currentTime.toString());

    // Use XHR to fetch data for DHT from PHP script
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/dataGenerator.php', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var data = JSON.parse(xhr.responseText);
          if (data.isActive) { // Check if isActive is true
            addDataDHT(data['airHumidity'], Humidity);
            addDataDHT(data['airTemperature'], AirTemperature);
            // Continue to fetch data periodically
            setTimeout(updateDHT, updateInterval);
          } else {
            console.log('The Python script is not active. No updates will be made to the chart.');
          }
        } else {
          // Handle any errors if the request fails
          console.error("Error fetching data from the server. Status code: " + xhr.status);
        }
      }
    };

    xhr.onerror = function () {
      // Handle any errors if the request fails
      console.error("Error fetching data from the server.");
    };

    xhr.send();
  } else {
    setTimeout(updateDHT, 10000 - (currentTime - lastFetchTimestamp));
  }
}


  function restoreChartState(chartInstance) {
    // Retrieve stored data from sessionStorage
    const storedData =  localStorage.getItem(chartInstance.canvas.id);

    if (storedData) {
        const parsedData = JSON.parse(storedData);
        chartInstance.data = parsedData;
        chartInstance.update();
    }
}

function clearAllCharts() {
  // Clear the data for all charts
  Temp.data.labels = [];
  Temp.data.datasets.forEach(function (dataset) {
    dataset.data = [];
  });

  Moist.data.labels = [];
  Moist.data.datasets.forEach(function (dataset) {
    dataset.data = [];
  });

  phLevel.data.labels = [];
  phLevel.data.datasets.forEach(function (dataset) {
    dataset.data = [];
  });

  Humidity.data.labels = [];
  Humidity.data.datasets.forEach(function (dataset) {
    dataset.data = [];
  });

  AirTemperature.data.labels = [];
  AirTemperature.data.datasets.forEach(function (dataset) {
    dataset.data = [];
  });

  // Clear stored data in sessionStorage
  localStorage.clear();

  // Reset the timestamp counter
  updateCount = 0;

  // Update to clear the charts and remove existing data
  Temp.update();
  Moist.update();
  phLevel.update();
  Humidity.update();
  AirTemperature.update();
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("LOADED");

   // Restore chart states on page load
   restoreChartState(Temp);
   restoreChartState(Moist);
   restoreChartState(phLevel);
   restoreChartState(Humidity);
   restoreChartState(AirTemperature);

   updateDataSensors();
   updateDHT();

  // Event listener for the "Reset" button
  document.getElementById("resetButton").addEventListener("click", function () {
    clearAllCharts(); // Call the function to clear all charts
  });

});
