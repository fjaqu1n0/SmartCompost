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
});
