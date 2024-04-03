$(document).ready(function() {
    var isRunning = false;
  
    $('#startButton').click(function() {
        // Toggle the button text
        var buttonText = isRunning ? "Start Data" : "Stop Data";
        $(this).text(buttonText);
        
        // Send an AJAX request to toggle data generation
        $.ajax({
            url: 'php/toggleData.php', // The PHP script that will trigger randomVal.py
            type: 'POST',
            data: { running: isRunning },
            success: function(response) {
                console.log(response);
            },
            error: function(status, error) {
                console.error("Error: " + status + " " + error);
            }
        });
        
        // Toggle the running state
        isRunning = !isRunning;
    });
  });
