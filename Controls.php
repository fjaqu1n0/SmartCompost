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

  <title>Controls - SmartCompost</title>
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

  <!-- Template Main CSS File -->
  <link href="assets/css/style.css" rel="stylesheet">

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
      <h1>Machine Controls</h1>
      </nav>
    </div><!-- End Page Title -->

   <section class="section">
      <div class="iconslist">

        <div class="icon">
          <img class ="blades" src="assets/img/blades.png" alt="">
          <div class="label">Mixer</div>
          <div class="container">
            <div class="toggle">
              <div id="motorButton" class="toggle-btn" data-device="motor"></div>
            </div>
            <br><br>
            <div class="text3">OFF</div>
          </div>
          <div class="text3">Speed Control</div>
          <div class="slider-container">
            <div class="slider">
              <div id="slider-value-left">0</div>
              <input type = "range" min="0" max="255" id="Slide">
              <div id="slider-value-right">255</div>
            </div>
            <div id="slider-value-mixer" class="slider-value">0</div>
          </div>
        </div>

        <div class="icon">
          <i class="bi bi-fan"></i>
          <div class="label">CPU Fan</div>
         <div class="container">
            <div class="toggle1">
              <div  id="fanButton" class="toggle-btn" data-device="fan"></div>
            </div>
            <br><br>
            <div class="text3">OFF</div>
          </div>
          <div class="text3">Speed Control</div>
          <div class="slider-container">
            <div class="slider">
              <div id="slider-value-left">0</div>
              <input type = "range" min="0" max="255" id="Slide1">
              <div id="slider-value-right">255</div>
            </div>
            <div id="slider-value-fan" class="slider-value">0</div>
          </div>
        </div>

        <div class="icon">
          <i class="bi bi-droplet-fill"></i>
          <div class="label">Water Pump</div>
          <div class="container">
            <div class="toggle2">
              <div id="pumpButton" class="toggle-btn" data-device="pump"></div>
            </div>
            <div class="text2">OFF</div>
            <br><br>
            <div class="text3">OFF</div>
          </div>
          <div class="text3">Speed Control</div>
          <div class="slider-container">
            <div class="slider">
              <div id="slider-value-left">0</div>
              <input type = "range" min="0" max="255" id="Slide2">
              <div id="slider-value-right">255</div>
            </div>
            <div id="slider-value-pump" class="slider-value">0</div>
          </div>
        </div>

        <div class="icon">
          <i class="bi bi-fire"></i>
          <div class="label">Heater</div>
          <div class="container">
            <div class="toggle3">
              <div id="heaterButton" class="toggle-btn" data-device="heater"></div>
            </div>
            <br><br>
            <div class="text3">OFF</div>
          </div>
          <div class="text3">Speed Control</div>
          <div class="slider-container">
            <div class="slider">
              <div id="slider-value-left">0</div>
              <input type="range" min="0" max="255" id="Slide3">
              <div id="slider-value-right">255</div>
            </div>
            <div id="slider-value-heater" class="slider-value">0</div>
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

  <!-- Template Main JS File -->
  <script src="assets/js/main.js"></script>
  <script src="assets/js/controls.js"></script>

</body>

</html>
