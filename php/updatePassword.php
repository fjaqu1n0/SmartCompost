<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: ../index.html');
    exit;
}

// Include database connection
include 'db_conn.php';

// Validate form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if ID parameter is received
    if (isset($_POST["id"])) {
        $id = $_POST["id"];
    } else {
        header("Location: ../editAccount.php?msg=No ID parameter received.");
        exit();
    }

    // Collect form data
    $currentPassword = $_POST['currentPassword'];
    $newPassword = $_POST['newPassword'];
    $confirmNewPassword = $_POST['confirmNewPassword'];

    // Query the database to retrieve the current password
    $sql = "SELECT password FROM users WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $storedPassword = $row['password'];

    // Verify if the entered current password matches the stored password
    if ($currentPassword !== $storedPassword) {
        header("Location: ../editAccount.php?msg=Current Password is incorrect&id=$id");
        exit();
    }

    // Validate new password
    if ($newPassword !== $confirmNewPassword) {
        // New passwords do not match
        header("Location: ../editAccount.php?msg=New passwords do not match&id=$id");
        exit();
    }

    // Update the password in the database
    $updateSql = "UPDATE users SET password = ? WHERE id = ?";
    $updateStmt = $con->prepare($updateSql);
    $updateStmt->bind_param("si", $newPassword, $id);

    if ($updateStmt->execute()) {
        if ($updateStmt->affected_rows > 0) {
            header("Location: ../accountManagement.php?msg=You have successfully changed the password");
            exit;
        } else {
            header("Location: ../editAccount.php?msg=Please use a different password&id=$id");
            exit;
        }
    } else {
        echo "Error executing SQL: " . $updateStmt->error;
    }

    $updateStmt->close();
} else {
    // Redirect if accessed directly
    header('Location: ../index.html');
    exit();
}
?>
