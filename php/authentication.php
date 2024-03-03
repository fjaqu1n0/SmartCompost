<?php
    session_start(); // Start the session
    
    $host = "localhost";  
    $user = "root";  
    $password = '';  
    $db_name = "testdb";  
      
    $con = mysqli_connect($host, $user, $password, $db_name);  
    if(mysqli_connect_errno()) {  
        die("Failed to connect with MySQL: ". mysqli_connect_error());  
    }  
    $username = $_POST['user'];
    $password = $_POST['pass'];

    //to prevent from mysqli injection
    $username = stripcslashes($username);
    $password = stripcslashes($password);
    $username = mysqli_real_escape_string($con, $username);
    $password = mysqli_real_escape_string($con, $password);

    $sql = "SELECT * FROM login WHERE username = '$username' AND password = '$password'";
    $result = mysqli_query($con, $sql);
    $count = mysqli_num_rows($result);

    if($count == 1) {
        session_start(); // Start the session
        $_SESSION['loggedin'] = true; // Set a session variable
        $_SESSION['username'] = $username; // Store the username as well
        echo "<script>window.location='../Home.php';</script>"; // Redirect to index.html
    }
     else {
        // Set error message to be passed to login page
        $error_message = "Invalid username or password.";
        // Redirect back to login page with error message as URL parameter
        header("Location: ../index.html?error=" . urlencode($error_message));
        exit(); // Stop further execution
    }
?>
