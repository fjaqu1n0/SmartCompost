<?php
    session_start();
    if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
        header('Location: index.html');
        exit;
    }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>Home - SmartCompost</title>
    <meta content="" name="description">
    <meta content="" name="keywords">

    <!-- Favicons -->
    <link href="assets/img/mmcm.png" rel="icon">
    <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">

    <!-- Google Fonts -->
    <link href="https://fonts.gstatic.com" rel="preconnect">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

    <!-- Vendor CSS Files -->
    <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
    <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">


    <!-- Template Main CSS File -->
    <link href="assets/css/style.css" rel="stylesheet">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- =======================================================
    * Template Name: NiceAdmin
    * Updated: Nov 17 2023 with Bootstrap v5.3.2
    * Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
    * Author: BootstrapMade.com
    * License: https://bootstrapmade.com/license/
    ======================================================== -->
</head>

<body>

    <!-- ======= Header ======= -->
    <header id="header" class="header fixed-top d-flex align-items-center">

        <div class="d-flex align-items-center justify-content-between">  
            <a href="Home.php" class="logo d-flex align-items-center">
              <img src="assets/img/mmcm.png" alt="">
              <span class="d-none d-lg-block">SmartCompost</span>
            </a>
            <i class="bi bi-list toggle-sidebar-btn"></i>        
        </div>
    
    </header><!-- End Header -->

    <!-- ======= Sidebar ======= -->
    <aside id="sidebar" class="sidebar">

        <ul class="sidebar-nav" id="sidebar-nav">

            <li class="nav-item">
                <a class="nav-link collapsed" href="Home.php">
                    <i class='bx bx-line-chart'></i>
                    <span>Home</span>
                </a>
            </li><!-- End Home Nav -->

            <li class="nav-item">
                <a class="nav-link collapsed" href="Controls.php">
                    <i class='bx bxs-cog'></i>
                    <span>Controls</span>
                </a>
            </li><!-- End Controls Page Nav -->

            <li class="nav-item">
                <a class="nav-link collapsed" href="DataTable.php">
                    <i class='bx bx-table'></i>
                    <span>Data Table</span>
                </a>
            </li><!-- End Data Logs Page Nav -->

            <li class="nav-item">
                <a class="nav-link collapsed" href="php/logout.php"> <!-- Changed href to logout.php -->
                    <i class='bx bx-log-out'></i>
                    <span>Logout</span>
                </a>
            </li><!-- End Data Logs Page Nav -->

        </ul>

    </aside><!-- End Sidebar-->

    <main id="main" class="main">

        <div class="pagetitle">
            <h1>Sensor Data</h1>
            <button id="resetButton">Clear</button>

        </div><!-- End Page Title -->


        <section class="section">
            <div class="row">

                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Air Humidity</h5>

                            <!-- Line Chart (Humidity)-->
                            <canvas id="Humidity" style="max-height: 400px;"></canvas>
                            <!-- End Line Chart -->

                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Air Temperature</h5>

                            <!-- Line Chart (Humidity)-->
                            <canvas id="AirTemp" style="max-height: 400px;"></canvas>

                            <!-- End Line CHart -->

                        </div>
                    </div>
                </div>

                <!-- Line Chart (Temperature)-->
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Soil Temperature</h5>


                            <canvas id="SoilTemperature" style="max-height: 400px;"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Line Chart (Moisture)-->
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Soil Moisture</h5>
                            <canvas id="SoilMoisture" style="max-height: 400px;"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Line Chart (pH)-->
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Soil pH</h5>
                            <canvas id="SoilpH" style="max-height: 400px;"></canvas>
                        </div>
                    </div>
                </div>

            </div>
        </section>

    </main><!-- End #main -->

    <!-- ======= Footer ======= -->
    <footer id="footer" class="footer">
        <div class="copyright">
            &copy; Copyright <strong><span>NiceAdmin</span></strong>. All Rights Reserved
        </div>
        <div class="credits">
            <!-- All the links in the footer should remain intact. -->
            <!-- You can delete the links only if you purchased the pro version. -->
            <!-- Licensing information: https://bootstrapmade.com/license/ -->
            <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ -->
            Designed by <strong><span>Francis Jacob Aquino</span></strong> using <a href="https://bootstrapmade.com/">BootstrapMade</a>
        </div>
    </footer><!-- End Footer -->

    <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

    <!-- Vendor JS Files -->
    <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="assets/vendor/chart.js/chart.umd.js"></script>

    <!-- Template Main JS File -->
    <script src="assets/js/main.js"></script>
    <script src="assets/js/sensors.js"></script>

    <!--  jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>


    <script>
    $(document).ready(function() {
         $('form').submit(function(event) {
            event.preventDefault(); // Prevent the form from submitting via the browser
            var username = $('#username').val();
            var password = $('#password').val();
            console.log(username, password);
            // Here you can write further logic to validate the user credentials,
            // typically via an AJAX request to your server-side script (e.g., PHP)
        });
    });
    </script>
    
    <!-- Validation -->
    <script>  
      function validation()  
      {  
          var id=document.f1.user.value;  
          var ps=document.f1.pass.value;  
          if(id.length=="" && ps.length=="") {  
              alert("User Name and Password fields are empty");  
              return false;  
          }  
          else  
          {  
              if(id.length=="") {  
                  alert("User Name is empty");  
                  return false;  
              }   
              if (ps.length=="") {  
              alert("Password field is empty");  
              return false;  
              }  
          }                             
      }  
    </script>  

</body>
</html>
