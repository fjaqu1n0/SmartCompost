<?php
include "db_conn.php";

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if the required fields are set and not empty
    if (isset($_POST['user']) && isset($_POST['pass']) && isset($_POST['confirmPassword'])) {
        $username = $_POST['user'];
        $password = $_POST['pass'];
        $confirmPassword = $_POST['confirmPassword'];

        // Validate if passwords match
        if ($password !== $confirmPassword) {
            header("Location: ../addUser.php?msg=Passwords do not match.");
            exit();
        }

        // Prepare the SQL statement to check if username already exists
        $checkUserSql = "SELECT * FROM users WHERE username = '$username'";

        // Execute the SQL statement to check for existing username
        $result = mysqli_query($con, $checkUserSql);
        if (mysqli_num_rows($result) > 0) {
            // Username already exists
            header("Location: ../addUser.php?msg=Username is already taken.");
            exit();
        } else {
            // Username does not exist, proceed with inserting new user
            $sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";

            // Execute the SQL statement
            if (mysqli_query($con, $sql)) {
                header("Location: ../accountManagement.php?msg=You have successfully added an account!");
                exit();
            } else {
                echo "Error: " . $sql . "<br>" . mysqli_error($con);
            }
        }
    } else {
        echo "Username or password not provided.";
        exit();
    }
} else {
    // Redirect if accessed directly
    header("Location: ../addUser.php");
    exit();
}
?>
