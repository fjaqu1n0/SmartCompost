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

  <title>Data Table - SmartCompost</title>
  <meta content="" name="description">
  <meta content="" name="keywords">

  <!-- Favicons -->
  <link href="assets/img/mmcm.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">

  <!-- Google Fonts -->
  <link href="https://fonts.gstatic.com" rel="preconnect">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

  <!-- Vendor CSS Files -->
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link  href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css"  rel="stylesheet"/>
  <link  href="https://cdn.datatables.net/2.0.0/css/dataTables.bootstrap5.css" rel="stylesheet" />

  <!-- Template Main CSS File -->
  <link href="assets/css/style.css" rel="stylesheet">
  
  <!-- Data Table JS -->
  <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.datatables.net/2.0.0/js/dataTables.js"></script>
  <script src="https://cdn.datatables.net/2.0.0/js/dataTables.bootstrap5.js"></script>

    <!-- Template Main JS File -->
    <script defer src="assets/js/main.js"></script>
    <script defer src="assets/js/tables.js"></script>
  
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
      <h1>Data Table</h1>
    </div><!-- End Page Title -->

    <section class="section">
      <div class="row">
        <div class="col-lg-12">

          <div class="card">
            <div class="card-body">
              <div class="table-header">
                <h5 class="card-title">Sensor Data</h5>
                <button id="deleteButton">Delete</button>
            </div>
              <!-- Table with stripped rows -->
              <table id="sensorData" class="table table-striped" style="width:100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Timestamp</th>
                        <th>Humidity</th>
                        <th>Air Temperature</th>
                        <th>Soil Temperature</th>
                        <th>Soil Moisture</th>
                        <th>pH</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
              <!-- End Table with stripped rows -->

            </div>
          </div>

        </div>
      </div>
    </section>
      <div class="button-container">
      <div class="left-buttons">
        <button id="EditButton">Edit</button>
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" aria-haspopup="true" aria-expanded="false">
            Export
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a href="#" id="exportCsv">CSV</a></li>
            <li><a href="#" id="exportSQL">SQL</a></li>
            <li><a href="#" id ="exportTXT">TXT</a></li>
          </ul>
        </div>
        <div class="dropdown1">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" aria-haspopup="true" aria-expanded="false">
            Hide Column
          </button>
          <ul class="dropdown-menu1" aria-labelledby="dropdownMenuButton1">
            <li><a href="#" id="Humidity">Humidity</a></li>
            <li><a href="#" id="AirTemp">Air Temperature</a></li>
            <li><a href="#" id ="SoilTemp">Soil Moisture</a></li>
            <li><a href="#" id ="Moist">Soil Moisture</a></li>
            <li><a href="#" id ="pH">Soil pH</a></li>
          </ul>
        </div>
      </div>
      </div>

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
      Designed by <strong><span>Francis Jacob Aquino</span></strong> using  <a href="https://bootstrapmade.com/">BootstrapMade</a>
    </div>
  </footer><!-- End Footer -->

  <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

</body>

</html>