$(document).ready(function() {
  var lastId = localStorage.getItem('lastId') ? parseInt(localStorage.getItem('lastId'), 10) : 0;
  var table = $('#sensorData').DataTable({
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

  setInterval(function() {
      table.ajax.reload(); // Reload the table data regularly
  }, 10000); // 10 seconds refresh rate

   // Dropdown toggle
    $('#dropdownMenuButton').on('click', function (event) {
        $('.dropdown-menu').toggle(); // Toggles the visibility of the dropdown menu
    });

    // Close the dropdown menu if clicked outside
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('.dropdown-menu').hide(); // Hide the dropdown menu
        }
    });

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
