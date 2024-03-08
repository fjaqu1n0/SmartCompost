<?php
include "db_conn.php";
$id = $_GET["id"];
$sql = "DELETE FROM `users` WHERE id = $id";
$result = mysqli_query($con, $sql);

if ($result) {
  header("Location: ../accountManagement.php?msg=Account has been deleted successfully");
} else {
  echo "Failed: " . mysqli_error($cnn);
}