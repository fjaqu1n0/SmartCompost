<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: index.html');
    exit;
}

include "php/db_conn.php";
$id = $_GET['id'];
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>Change Password</title>
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
        <nav class="header-nav ms-auto">
            <ul class="d-flex align-items-center">

                <li class="nav-item dropdown pe-3">

                    <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                        <span class="d-none d-md-block dropdown-toggle ps-2">Account</span>
                    </a><!-- End Profile Iamge Icon -->

                    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">

                        <li>
                            <a class="dropdown-item d-flex align-items-center" href="accountManagement.php">
                                <i class="bi bi-gear"></i>
                                <span>Account Management</span>
                            </a>
                        </li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>

                        <li>
                            <a class="dropdown-item d-flex align-items-center" href="php/logout.php">
                                <i class="bi bi-box-arrow-right"></i>
                                <span>Logout</span>
                            </a>
                        </li>

                    </ul><!-- End Profile Dropdown Items -->
                </li><!-- End Profile Nav -->

            </ul>
        </nav><!-- End Icons Navigation -->
    
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

        </ul>

    </aside><!-- End Sidebar-->

  <main id="main" class="main">

    <div class="pagetitle">
      <h1>Change Password</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="home.php">Home</a></li>
          <li class="breadcrumb-item"><a href="accountmanagement.php">Account Management</a></li>
          <li class="breadcrumb-item active">Change Password</li>
        </ol>
      </nav>
    </div><!-- End Page Title -->
    
    <section class="section">
      <div class="row">
        <div class="container">
        <?php
            if (isset($_GET["msg"])) {
                $msg = $_GET["msg"];
                echo '<div class="alert alert-danger alert-dismissible fade show" role="alert">
                    ' . $msg . '
                    <button type="button" class="btn-close" style="background-color: inherit; color: inherit; border: none;" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>';
            }
        ?>
            <div class="row justify-content-center">
                <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                    <div class="d-flex justify-content-center py-4">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="pt-4 pb-2">
                                    <h5 class="card-title text-center pb-0 fs-4">Change Password</h5>
                                </div>
                                <?php
                                    $sql = "SELECT * FROM `users` WHERE id = $id LIMIT 1";
                                    $result = mysqli_query($con, $sql);
                                    $row = mysqli_fetch_assoc($result);
                                ?>
                                <div id="frm">
                                    <form name="f1" action="php/updatePassword.php" method="POST" class="row g-3">
                                        <!-- Your form inputs and other elements here -->
                                        <!-- Example to display fetched data -->
                                        <div class="col-12">
                                            <label for="currentPassword" class="form-label">Current Password:</label>
                                            <input type="password" name="currentPassword" class="form-control" id="currentPassword" required>
                                            <div class="invalid-feedback">Please enter your current password</div>
                                        </div>

                                        <div class="col-12">
                                            <label for="newPassword" class="form-label">New Password:</label>
                                            <input type="password" name="newPassword" class="form-control" id="newPassword" required>
                                            <div class="invalid-feedback">Please enter your new password</div>
                                        </div>

                                        <div class="col-12">
                                            <label for="confirmNewPassword" class="form-label">Confirm New Password:</label>
                                            <input type="password" name="confirmNewPassword" class="form-control" id="confirmNewPassword" required>
                                            <div class="invalid-feedback">Please confirm your new password</div>
                                        </div>

                                        <input type="hidden" name="id" value="<?php echo $id; ?>">

                                        <div class="col-12">
                                            <button type="submit" class="btn btn-dark no-border w-100">Edit Account</button>
                                        </div>
                                        <div class="col-12">
                                            <a href="accountManagement.php" class="btn btn-outline-danger w-100">Cancel</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
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
      Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
    </div>
  </footer><!-- End Footer -->

  <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

  <!-- Vendor JS Files -->
  <script src="assets/vendor/apexcharts/apexcharts.min.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/chart.js/chart.umd.js"></script>
  <script src="assets/vendor/echarts/echarts.min.js"></script>
  <script src="assets/vendor/quill/quill.min.js"></script>
  <script src="assets/vendor/simple-datatables/simple-datatables.js"></script>
  <script src="assets/vendor/tinymce/tinymce.min.js"></script>
  <script src="assets/vendor/php-email-form/validate.js"></script>

  <!-- Template Main JS File -->
  <script src="assets/js/main.js"></script>

</body>

</html>
