<?php
// Connect to the MySQL database
$servername = "192.168.1.128";
$username = "admin";
$password = "Capstone23";
$dbname = "testdb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Check if the parameter for deleting all data is set
if (isset($_GET['deleteAll']) && $_GET['deleteAll'] == true) {
  // Query to delete all data
  $deleteQuery = "DELETE FROM sensor_data_single";
  if ($conn->query($deleteQuery) === TRUE) {
    // Return an empty JSON object
    header('Content-Type: application/json');
    echo json_encode([]);
  } else {
    // Return an error JSON object
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Failed to delete data']);
  }
} else {
  // Query the database for all sensor data
  $sql = "SELECT * FROM sensor_data_single";
  $result = $conn->query($sql);

  // If there is data, encode it as JSON and return it
  if ($result->num_rows > 0) {
    $data = array();

    while ($row = $result->fetch_assoc()) {
      $data[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($data);
  } else {
    // If there is no data, return an empty JSON object
    header('Content-Type: application/json');
    echo json_encode([]);
  }
}

$conn->close();
?>
