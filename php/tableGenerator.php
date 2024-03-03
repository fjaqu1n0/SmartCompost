<?php
session_start();
$servername = "localhost";
$username = "root";
$password = '';
$dbname = "testdb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_GET['action']) && $_GET['action'] === 'fetchHighestId') {
    $sql = "SELECT MAX(id) AS highestId FROM sensor_data_single";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $_SESSION['lastId'] = $row['highestId']; // Store the lastId in the session
    echo json_encode(['highestId' => $row['highestId']]);
} else {
    $lastId = isset($_SESSION['lastId']) ? $_SESSION['lastId'] : 0;
    $sql = "SELECT * FROM sensor_data_single WHERE id > $lastId ORDER BY id ASC";
    $result = $conn->query($sql);
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

$conn->close();
?>
