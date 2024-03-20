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

 <!-- Bootstrap 5 Data Table CSS Files -->
 <link  href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css"  rel="stylesheet"/>
 <link  href="https://cdn.datatables.net/2.0.1/css/dataTables.bootstrap5.css" rel="stylesheet" />
 <link  href="https://cdn.datatables.net/select/2.0.0/css/select.dataTables.min.css" rel="stylesheet" />
 

  <!-- Template Main CSS File -->
  <link href="assets/css/style.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" rel="stylesheet" >

  <!-- Boostrap Data Table JS-->
  <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.datatables.net/2.0.1/js/dataTables.js"></script>
  <script src="https://cdn.datatables.net/2.0.1/js/dataTables.bootstrap5.js"></script>
  <script src="https://cdn.datatables.net/select/2.0.0/js/dataTables.select.min.js"></script>
     
  <!-- Template Main JS File -->
  
  <script src="assets/js/tables.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
  
</head>

<body>

   <!-- ======= Header ======= -->
   <header id="header" class="header fixed-top d-flex align-items-center">

    <div class="d-flex align-items-center justify-content-between">
      <a href="index.html" class="logo d-flex align-items-center">
        <img src="assets/img/mmcm.png" alt="">
        <span class="d-none d-lg-block">SmartCompost</span>
      </a>
      <i class="bi bi-list toggle-sidebar-btn"></i>
    </div><!-- End Logo -->

      <nav class="header-nav ms-auto">
        <ul class="d-flex align-items-center">
          <li class="nav-item dropdown pe-3">
              <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                  <span class="d-none d-md-block dropdown-toggle ps-2">Account</span>
              </a>
              <ul class="dropdown-menu no-edit dropdown-menu-end dropdown-menu-arrow profile">
                  <li>
                      <a class="dropdown-item d-flex align-items-center" href="accountManagement.php">
                          <i class="bi bi-gear"></i>
                          <span>Account Management</span>
                      </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                      <a class="dropdown-item d-flex align-items-center" href="php/logout.php">
                          <i class="bi bi-box-arrow-right"></i>
                          <span>Logout</span>
                      </a>
                  </li>
              </ul>
          </li>
        </ul>
      </nav><!-- End Icons Navigation -->


  </header><!-- End Header -->

  <!-- ======= Sidebar ======= -->
  <aside id="sidebar" class="sidebar">

    <ul class="sidebar-nav" id="sidebar-nav">

      <li class="nav-item">
        <a class="nav-link collapsed" href="Home.php">
          <i class='bx bx-line-chart'></i>
          <span>Dashboard</span>
        </a>
      </li><!-- End Home Nav -->

      <li class="nav-item">
        <a class="nav-link collapsed" href="Controls.php">
            <i class='bx bxs-cog' ></i>
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
      <h1>Data Table</h1>
    </div><!-- End Page Title -->

    <section class="section">
      <div class="row">
        <div class="col-lg-12">

          <div class="card">
            <div class="card-body">
              <div class="table-header">
                <h5 class="card-title">Sensor Data</h5>
                <button type="button" class="btn btn-dark" id="deleteButton" data-target="#deleteConfirmationModal">
                    Delete
                </button>
                <!-- Modal -->
                <div class="modal fade" id="deleteConfirmationModal" tabindex="-1" role="dialog" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="deleteConfirmationModalLabel">Confirm Deletion</h5>
                        </button>
                      </div>
                      <div class="modal-body">
                        Are you sure you want to delete selected row(s)?
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary flex-fill mx-1 col" style="width: 100px;" data-bs-dismiss="modal">Cancel</button>
                        <!-- <button type="button" class="btn btn-danger" id="confirmDeleteButton">Delete</button> -->
                        <a href="#" class="btn btn-danger flex-fill mx-1 col" style="width: 100px;" id="confirmDeleteButton">Delete</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Alert when no rows selected -->
              <!-- <div class="alert alert-warning alert-dismissible fade show" role="alert" id="noRowsAlert" style="display: none;">
                  No rows selected to delete.
                  <button type="button" class="btn-close" style="background-color: inherit; color: inherit; border: none;" data-bs-dismiss="alert" aria-label="Close"></button>
                  </button>
                </div> -->
                <div id="alertPlaceholder"></div>
              <!-- Table with stripped rows -->
              <table id="sensorData" class="table table-striped" style="width:100%"> <!--class="display""table table-striped"-->
                <thead>
                    <tr>
                        <th><input type="checkbox" id="selectAll"></th>
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
        <button id="editButton" type="button" class="btn btn-dark" data-bs-target="#editModal">
          Edit
        </button>
        <!-- Modal -->
        <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="editModalLabel">Edit Row</h1>
              </div>
              <div class="modal-body">
                <form id="editForm">
                  <div class="form-group row mb-3">
                    <label for="editTimestamp" class="col-sm-3 col-form-label">Timestamp:</label>
                    <div class="col-sm-9">
                      <input type="text" class="form-control" id="editTimestamp" name="editTimestamp">
                    </div>
                  </div>
                  <div class="form-group row mb-3">
                    <label for="editHumidity" class="col-sm-3 col-form-label">Humidity:</label>
                    <div class="col-sm-9">
                      <input type="number" class="form-control" id="editHumidity" name="editHumidity">
                    </div>
                  </div>
                  <div class="form-group row mb-3">
                    <label for="editAirTemp" class="col-sm-3 col-form-label">Air Temperature:</label>
                    <div class="col-sm-9">
                      <input type="number" class="form-control" id="editAirTemp" name="editAirTemp">
                    </div>
                  </div>
                  <div class="form-group row mb-3">
                    <label for="editSoilTemp" class="col-sm-3 col-form-label">Soil Temperature:</label>
                    <div class="col-sm-9">
                      <input type="number" class="form-control" id="editSoilTemp" name="editSoilTemp">
                    </div>
                  </div>
                  <div class="form-group row mb-3">
                    <label for="editSoilMoist" class="col-sm-3 col-form-label">Soil Moisture:</label>
                    <div class="col-sm-9">
                      <input type="number" class="form-control" id="editSoilMoist" name="editSoilMoist">
                    </div>
                  </div>
                  <div class="form-group row mb-3">
                    <label for="editSoilPH" class="col-sm-3 col-form-label">pH:</label>
                    <div class="col-sm-9">
                      <input type="number" class="form-control" id="editSoilPH" name="editSoilPH">
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="saveChanges">Update</button>
              </div>
            </div>
          </div>
        </div>
        <!-- End of modal-->
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" aria-haspopup="true" aria-expanded="false">
            Export
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" href="#" id="exportCsv">CSV</a></li>
            <li><a class="dropdown-item" href="#" id="exportSQL">SQL</a></li>
            <li><a class="dropdown-item" href="#" id ="exportTXT">TXT</a></li>
          </ul>
        </div>
        <div class="dropdown1">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" aria-haspopup="true" aria-expanded="false">
            Hide Column
          </button>
          <ul class="dropdown-menu1" aria-labelledby="dropdownMenuButton1">
            <li><a href="#" id="Humidity">Humidity</a></li>
            <li><a href="#" id="AirTemp">Air Temperature</a></li>
            <li><a href="#" id ="SoilTemp">Soil Temperature</a></li>
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
      Designed by <strong><span>Francis Jacob Aquino</span></strong> using  <a href="https://bootstrapmade.com/">BootstrapMade</a>
    </div>
  </footer><!-- End Footer -->

  <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

  <script src ="assets/js/main.js"></script>

</body>

</html>
