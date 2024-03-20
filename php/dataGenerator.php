<?php
// Connect to the MySQL database
include 'db_conn.php';

// Query the database for the latest sensor data and isActive status
$sql = "SELECT * FROM sensor_data_single ORDER BY timestamp DESC LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // Extract the values from the database row
    $timestamp = $row['timestamp'];
    $airHumidity = $row['air_humidity'];
    $airTemperature = $row['air_temperature'];
    $soilTemperature = $row['soil_temperature'];
    $soilMoisture = $row['soil_moisture_3in1'];
    $soilpH = $row['soil_pH'];
    $isActive = $row['isActive'];

    // Check if isActive is true or false and update the value accordingly
    // For boolean values in MySQL, 1 represents true and 0 represents false
    $isActive = $isActive == 1 ? true : false;

    // Format the data as a JSON object
    $data = array(
        'timestamp' => $timestamp,
        'airHumidity' => $airHumidity,
        'airTemperature' => $airTemperature,
        'soilTemperature' => $soilTemperature,
        'soilMoisture' => $soilMoisture,
        'soilpH' => $soilpH,
        'isActive' => $isActive
    );

    // Set the content type to JSON and output the data
    header('Content-Type: application/json');
    echo json_encode($data);
} else {
    // If no data is available, return an error JSON object
    echo json_encode(array("error" => "No data available"));
}

// Close the database connection
$conn->close();
?>
