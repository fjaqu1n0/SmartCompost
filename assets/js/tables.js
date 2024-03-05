$(document).ready(function() {
  var lastId = localStorage.getItem('lastId') ? parseInt(localStorage.getItem('lastId'), 10) : 0;
  var table = $('#sensorData').DataTable({
     "columnDefs": [
        { "targets": [2, 3, 4, 5], "visible": true, "searchable": true }
    ],
      "ajax": {
          "url": "php/tableGenerator.php",
          "type": "POST",
          "data": {
              "lastId": lastId
          },
          "dataSrc": ""
      },
      "columns": [
          { "data": "timestamp" },
          { "data": "air_humidity" },
          { "data": "air_temperature" },
          { "data": "soil_temperature" },
          { "data": "soil_moisture_3in1" },
          { "data": "soil_pH" }
      ]
  });

  $('#deleteButton').on('click', function() {
      $.ajax({
          url: 'php/tableGenerator.php',
          type: 'GET',
          data: { action: 'fetchHighestId' },
          success: function(data) {
              lastId = parseInt(data.highestId, 10);
              localStorage.setItem('lastId', lastId); // Update the local storage with the new lastId
              table.clear().draw(); // Clear the DataTable
          }
      });
  });
  
 //---ONCLICK LISTENERS --------------------------------//

  setInterval(function() {
      table.ajax.reload(); // Reload the table data regularly
  }, 10000); // 10 seconds refresh rate

   // Dropdown toggle
    $('#dropdownMenuButton').on('click', function (event) {
        $('.dropdown-menu').toggle(); // Toggles the visibility of the dropdown menu
    });

  $('#dropdownMenuButton1').on('click', function (event) {
        $('.dropdown-menu1').toggle(); // Toggles the visibility of the dropdown menu
    });

    // Close the dropdown menu if clicked outside
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('.dropdown-menu').hide(); // Hide the dropdown menu
        }
    });
  
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.dropdown1').length) {
            $('.dropdown-menu1').hide(); // Hide the dropdown menu
        }
    });

  //-------------EVENT HANDLERs --------------------------------//

    // Export option listeners
    $('#exportCsv, #exportSQL, #exportTXT').on('click', function() {
        console.log("Export button clicked"); // Debugging line
        if (isTableEmpty()) {
            alert('The table is empty. No data to export.');
            return; // Stop the function if the table is empty
        }

        var exportType = $(this).attr('id').replace('export', '').toUpperCase(); // Get the export type (CSV, SQL, TXT)
        console.log('Exporting:', exportType); // Debugging line to check which export type is selected
        exportTableData(exportType); // Call the export function with the determined type
    });

     // Event handler for hiding the Humidity column
        $('#Humidity').on('click', function(e) {
            e.preventDefault();
            // Toggle the visibility of the Humidity column (index 1)
            var column = table.column(1);
            column.visible(!column.visible());
        });

      $('#AirTemp').on('click', function(e) {
        e.preventDefault();
        var column = table.column(2); // Adjust the index for Air Temperature
        column.visible(!column.visible());
    });

    $('#SoilTemp').on('click', function(e) {
        e.preventDefault();
        var column = table.column(3); // Adjust the index for Soil Temperature
        column.visible(!column.visible());
    });

    $('#Moist').on('click', function(e) {
        e.preventDefault();
        var column = table.column(4); // Adjust the index for Soil Moisture
        column.visible(!column.visible());
    });

    $('#pH').on('click', function(e) {
        e.preventDefault();
        var column = table.column(5); // Adjust the index for pH
        column.visible(!column.visible());
    });

  //---  FUNCTIONS --------------------------------
    // Function to check if the table is empty
    function isTableEmpty() {
        return $('#sensorData').DataTable().data().count() === 0;
    }
 function exportTableData(exportType) {
        var dataToExport = '';
    
        if (exportType === 'CSV') {
            dataToExport = exportToCSV();
            downloadFile(dataToExport, 'exportedData.csv', 'text/csv;charset=utf-8;');
        } else if (exportType === 'SQL') {
            dataToExport = exportToSQL();
            downloadFile(dataToExport, 'exportedData.sql', 'application/sql');
        } else if (exportType === 'TXT') {
            dataToExport = exportToTXT();
            downloadFile(dataToExport, 'exportedData.txt', 'text/plain');
        } else {
            alert('Export for ' + exportType + ' format not implemented.');
        }
    }
    function exportToCSV() {
        var csv = '';
        var table = $('#sensorData').DataTable();
    
        // Get headers
        $('#sensorData thead tr th').each(function() {
            csv += '"' + $(this).text() + '",';
        });
        csv = csv.slice(0, -1); // Remove last comma
        csv += "\r\n";
    
        // Get table data for displayed rows only
        table.$('tr', {"filter":"applied"}).each(function() {
            $('td', this).each(function() {
                var cellData = $(this).text();
                // Escape double quotes in cell data
                csv += '"' + cellData.replace(/"/g, '""') + '",';
            });
            csv = csv.slice(0, -1); // Remove the last comma
            csv += "\r\n";
        });
    
        return csv;
    }
    
    function exportToSQL() {
        var sql = '';
        var table = $('#sensorData').DataTable();
    
        // Generate SQL for displayed rows only
        table.$('tr', {"filter":"applied"}).each(function() {
            sql += 'INSERT INTO your_table_name (Timestamp, Humidity, Air Temperature, Soil Temperature, Soil Moisture, pH) VALUES (';
            $('td', this).each(function(index) {
                // Properly format and escape the value based on its type
                var value = $(this).text();
                // Assuming all values are strings or numbers, adjust as necessary
                value = isNaN(value) ? "'" + value.replace(/'/g, "''") + "'" : value;
                sql += index > 0 ? ', ' + value : value;
            });
            sql += ");\n";
        });
    
        return sql;
    }    
    
    function exportToTXT() {
        var txt = '';
        var table = $('#sensorData').DataTable();
    
        // Get headers
        $('#sensorData thead tr th').each(function() {
            txt += $(this).text() + '\t';
        });
        txt = txt.trim() + "\n";
    
        // Generate TXT for displayed rows only
        table.$('tr', {"filter":"applied"}).each(function() {
            $('td', this).each(function() {
                var cellData = $(this).text();
                txt += cellData + '\t';
            });
            txt = txt.trim() + "\n";
        });
    
        return txt;
    }

    function downloadFile(data, filename, type) {
        var file = new Blob([data], {type: type});
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
    
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
});
