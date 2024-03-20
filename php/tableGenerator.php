<?php
session_start();
include 'db_conn.php';

// Include total row count in the response
$totalRowsSql = "SELECT COUNT(*) AS totalRows FROM sensor_data_single";
$totalRowsResult = $con->query($totalRowsSql);
$totalRowsRow = $totalRowsResult->fetch_assoc();

if (isset($_GET['action']) && $_GET['action'] === 'fetchHighestId') {
    $sql = "SELECT MAX(id) AS highestId FROM sensor_data_single";
    $result = $con->query($sql);
    $row = $result->fetch_assoc();
    $_SESSION['lastId'] = $row['highestId']; // Store the lastId in the session
    echo json_encode(['highestId' => $row['highestId']]);
} else {
    $lastId = isset($_SESSION['lastId']) ? $_SESSION['lastId'] : 0;
    $sql = "SELECT * FROM sensor_data_single WHERE id > $lastId ORDER BY id ASC";
    $result = $con->query($sql);
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

$con->close();
?>
