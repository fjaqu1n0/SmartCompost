document.addEventListener("DOMContentLoaded", function () {
  console.log("LOADED");

  // Retrieve the data from localStorage and populate the table
  retrieveTableData();

  // Set an interval to update the table every 5 mins
  setInterval(updateTable, 10000); // Update every 5 mins

  // Store the table data in localStorage
  function storeTableData(data) {
    sessionStorage.setItem('sensorData', JSON.stringify(data));
  }

  function retrieveTableData() {
    const storedData = JSON.parse(sessionStorage.getItem('sensorData'));
    if (storedData) {
      populateTable(storedData);
    }
    return storedData;
  }

  // Create an XMLHttpRequest object                         
  var xhr = new XMLHttpRequest();

  // Set the request method and URL
  xhr.open('GET', 'php/tableGenerator.php');

  // Set the request header
  xhr.setRequestHeader('Updated-Data', true); // Indicate data might be updated


  // Define a function to populate the table
  function populateTable(data) {
    if (!data) {
      console.error("No data provided to populate table.");
      return;
    }
    var table = document.getElementById('sensorData');
    table.innerHTML = ''; // Clear the table

    // Add table headers
    var headerRow = table.insertRow(0);
    var headerCells = ['Timestamp', 'Humidity', 'Air Temp', 'Soil Temp', 'Soil Moisture', 'Soil pH']; //'Soil Temp 2', 'Soil Moisture 2', 'Soil pH 2'
    for (var i = 0; i < headerCells.length; i++) {
      var headerCell = headerRow.insertCell(-1);
      headerCell.innerHTML = headerCells[i];
    }

    // Iterate over the data and populate the table
    for (var i = 0; i < data.length; i++) {
      var row = table.insertRow(); // Insert a new row for each data entry

      // Extract data from the JSON object
      var timestamp = data[i].timestamp;
      var humidity = data[i].air_humidity;
      var airTemperature = data[i].air_temperature;
     var soilTemperature = data[i].soil_temperature;
     var soilMoisture = data[i].soil_moisture_3in1;
      var soilpH = data[i].soil_pH;
     // var soilTemperature2 = data[i].soil_temperature2;
     // var soilMoisture2 = data[i].soil_moisture_3in1_2;
     // var soilpH2 = data[i].soil_pH2;

      // Create table cells and add data
      var timestampCell = row.insertCell(-1);
      timestampCell.innerHTML = timestamp;

      var humidityCell = row.insertCell(-1);
      humidityCell.innerHTML = humidity;

      var airTemperatureCell = row.insertCell(-1);
      airTemperatureCell.innerHTML = airTemperature;

      var soilTemperatureCell = row.insertCell(-1);
      soilTemperatureCell.innerHTML = soilTemperature;

      var soilMoistureCell = row.insertCell(-1);
      soilMoistureCell.innerHTML = soilMoisture;

      var soilpHCell = row.insertCell(-1);
      soilpHCell.innerHTML = soilpH;

      /*var soilTemperature2Cell = row.insertCell(-1);
      soilTemperature2Cell.innerHTML = soilTemperature2;

      var soilMoisture2Cell = row.insertCell(-1);
      soilMoisture2Cell.innerHTML = soilMoisture2;

      var soilpH2Cell = row.insertCell(-1);
      soilpH2Cell.innerHTML = soilpH2;*/
    }
  }

  function getLastEntryTimestamp() {
    // Get the table element
    const table = document.getElementById('sensorData');
  
    // Check if there are any entries
    if (table.rows.length === 0) {
      return null; // No entries, return null
    }
  
    // Get the last row and extract timestamp
    const lastRow = table.rows[table.rows.length - 1];
    const timestampCell = lastRow.cells[0]; // Assuming timestamp is in first cell
  
    return timestampCell.innerHTML; // Return the timestamp as string
  }

  var dataDeleted = false;
  const tableElement = document.getElementById('sensorData'); // Assuming table ID is 'sensorData'

  function updateTable(manualDeletion) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/tableGenerator.php');

    if (isDataManuallyDeleted && tableElement.classList.contains('table-cleared')) {
        // If table is still cleared, don't update and reset flag
        console.log("Skipping update due to manual deletion.");
        isDataManuallyDeleted = false;
        return;
    }

    // Send timestamp of last entry or flag indicating deletion
    xhr.setRequestHeader('Last-Updated-Timestamp', getLastEntryTimestamp());
    xhr.setRequestHeader('Deleted', dataDeleted); // Set true after deletion

    xhr.send();

    xhr.onload = function () {
        if (xhr.status === 200) {
            // Parse the JSON response
            var data = JSON.parse(xhr.responseText);

            // Check for new data
            if (data.length > 0 || dataDeleted) {
                // Store and populate if new data or deletion confirmation
                dataDeleted = false;
                storeTableData(data);
                populateTable(data);
                console.log("Data updated.");
            } else {
                if (manualDeletion) {
                    // If all data is deleted, clear the table and local storage
                    clearTableRows();
                    sessionStorage.removeItem('sensorData');
                    console.log("All data deleted. Table and local storage cleared.");
                } else {
                    console.log("No new data.");
                }
            }
            dataDeleted = false; // Reset deletion flag
        } else {
            console.log('Failed to retrieve sensor data. Status code: ' + xhr.status);
        }
    };

    // Remove visual indication on successful update
    tableElement.classList.remove('table-cleared');

    console.log("Data updated after manual deletion.");
}


  function createAndDownloadCSV(data) {
    if (data.length === 0) {
      alert("Table is empty. Cannot export data.");
      return;
    }

    var csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Timestamp,Humidity,Air Temp,Soil Temp,Soil Moisture,Soil pH\n";//,Soil Temp 2,Soil Moisture 2,Soil pH 2

    var dateFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

    data.forEach(function (entry) {
      // Format timestamp using Date object
      //var timestampDate = new Date(entry.timestamp);
      //var formattedTimestamp = timestampDate.toLocaleString('en-US', dateFormatOptions);

      var rowData = [
        //formattedTimestamp,
        entry.timestamp,
        entry.air_humidity,
        entry.air_temperature,
        entry.soil_temperature,
        entry.soil_moisture_3in1,
        entry.soil_pH,
       // entry.soil_temperature2,
        //entry.soil_moisture_3in1_2,
       // entry.soil_pH2
      ];
      csvContent += rowData.join(",") + "\n";
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sensor_data.csv");
    document.body.appendChild(link);
    link.click();
  }
  
  var updateInterval = setInterval(updateTable, 5000);
  var isDataManuallyDeleted = false;

  function deleteEntries() {
    // Get the table element
    var table = document.getElementById('sensorData');
  
    // Check if the table is already empty
    if (table.rows.length <= 1) {
      window.alert("Table is already empty.");
      return;
    }
  
    // Clear displayed entries and localStorage data
    clearTableRows();
    isDataManuallyDeleted = true;
  
    // Notify the server about data deletion
    updateTable(true);
  
    // Stop automatic updates after deletion
    clearInterval(updateInterval);
  
    // Display visual indication of cleared data
    tableElement.classList.add('table-cleared'); // Add a CSS class for styling
  
    console.log("Table data cleared.");
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('exportCsv').addEventListener('click', function(e) {
      e.preventDefault(); // Prevent the default link behavior
      var storedData = retrieveTableData();
      if (storedData && storedData.length > 0) {
        console.log("Using stored data for export.");
        createAndDownloadCSV(storedData);
      } else {
        alert("Table data empty.");
      }
    });
  });
  
  // Function to clear table rows
  function clearTableRows() {
    var table = document.getElementById('sensorData');
    var rowCount = table.rows.length;

    // Start from the bottom to avoid skipping rows during removal
    for (var i = rowCount - 1; i > 0; i--) {
      table.deleteRow(i);
    }

    console.log("Table rows deleted.");
  }

  
var deleteButton = document.getElementById('deleteButton');
deleteButton.addEventListener('click', deleteEntries);

  // Populate the table with data
  populateTable();
});

document.addEventListener("DOMContentLoaded", function() {
  const dropdownButton = document.getElementById("dropdownMenuButton");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  dropdownButton.addEventListener("click", function() {
    dropdownMenu.classList.toggle("show");
  });

  // Close dropdown when clicking outside of it
  window.addEventListener("click", function(event) {
    if (!event.target.matches('.btn') && !event.target.matches('.dropdown-menu')) {
      dropdownMenu.classList.remove("show");
    }
  });

});