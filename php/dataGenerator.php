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

// Query the database for the latest sensor data
$sql = "SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();

  // Format the data as a JSON object
  $data = array(
    'airHumidity' => $row['air_humidity'],
    'airTemperature' => $row['air_temperature'],
    'soilTemperature' => $row['soil_temperature'],
    'soilMoisture' => $row['soil_moisture_3in1'],
    'soilpH' => $row['soil_pH'],
    'soilTemperature2' => $row['soil_temperature2'],
    'soilMoisture2' => $row['soil_moisture_3in1_2'],
    'soilpH2' => $row['soil_pH2']
  );

  // Output the data as a JSON object
  header('Content-Type: application/json');
  echo json_encode($data);
} else {
  echo "No data available";
}

$conn->close();
?>