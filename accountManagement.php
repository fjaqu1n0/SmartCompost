<?php
		error_reporting(E_ALL);
		ini_set('display_errors', 1);
		
    session_start();
    if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
        header('Location: index.html');
        exit;
    }

    include "php/db_conn.php";

    function debug($message) {
        echo '<pre>';
        print_r($message);
        echo '</pre>';
    }
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>Account Management</title>
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
	    <button id="startButton">Start Data</button> 
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
      <h1>Account Management</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="Home.php">Home</a></li>
          <li class="breadcrumb-item"><a href="accountManagement.php">Account Management</a></li>
        </ol>
      </nav>
    </div><!-- End Page Title -->

		<section class="section">
			<div class="row">
					<div class="col-lg">
							<div class="card">
									<div class="card-body">
											<h5 class="card-title">Accounts</h5>
											<div class="container">
													<?php
															if (isset($_GET["msg"])) {
																	$msg = $_GET["msg"];
																	echo '<div class="alert alert-success alert-dismissible fade show" role="alert">
																					' . $msg . '
																					<button type="button" class="btn-close" style="background-color: inherit; color: inherit; border: none;" data-bs-dismiss="alert" aria-label="Close"></button>
																				</div>';
															}
													?>  
													<a href="addUser.php" class="btn btn-dark mb-3">Add New</a>
													<table class="table table-hover table-bordered text-center" style="width: 100%; table-layout: fixed;">
                            	<thead class="table-dark">
                                	<tr>
                                  		<th scope="col" style="width: 10%;">ID</th>
                                 			<th scope="col" style="width: 60%;">Username</th>
                                  		<th scope="col" style="width: 30%;">Action</th>
                                	</tr>
															</thead>
															<tbody>
																	<?php
																	$sql = "SELECT * FROM `users`";
																	$result = mysqli_query($con, $sql);
																	$row_count = 0; // Counter to track the number of rows
																	while ($row = mysqli_fetch_assoc($result)) {
																			$row_count++; // Increment the row count
																	?>
																			<tr>
																				<td class="counterCell"></td>
																				<td><?php echo $row["username"] ?></td>
																				<td>
																						<!-- <div style="display: flex;"> -->
																								<a href="editAccount.php?id=<?php echo $row["id"] ?>" class="link-dark" style="flex-grow: 1; text-align: center; margin-right: 8px;"><i class='bx bxs-edit'></i>Edit</a>
																								<?php if ($row_count > 1): // Check if it's not the first row ?>
																								<a href="#" data-bs-toggle="modal" data-bs-target="#deleteModal<?php echo $row["id"] ?>" class="link-dark" style="flex-grow: 1; text-align: center; margin-left: 8px;"><i class='bx bx-trash'></i>Delete</a>
																								<?php endif; ?>
																						<!-- </div> -->
																						<!-- Modal -->
																						<div class="modal fade" id="deleteModal<?php echo $row["id"] ?>" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
																								<div class="modal-dialog modal-dialog-centered">
																										<div class="modal-content">
																												<div class="modal-header">
																														<h3 class="modal-title fs-5" id="deleteModalLabel">Confirm Deletion</h3>
																												</div>
																												<div class="modal-body">
																														Are you sure you want to delete this account?
																												</div>
																												<div class="modal-footer">
																														<a href="php/deleteAccount.php?id=<?php echo $row["id"] ?>" class="btn btn-danger flex-fill mx-1 col" style="width: 100px;">Delete</a>
																														<a href="#" data-bs-dismiss="modal" class="btn btn-dark no-border flex-fill mx-1 col" style="width: 100px;">No</a>
																												</div>
																										</div>
																								</div>
																						</div>
																				</td>
																		</tr>
																	<?php
																	}
																	?>
															</tbody>
													</table>
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
       Designed by <strong><span>Raphael Ungab</span></strong> using  <a href="https://bootstrapmade.com/">BootstrapMade</a>
    </div>
  </footer><!-- End Footer -->

  <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

  <!-- Vendor JS Files -->
  <script src="assets/vendor/apexcharts/apexcharts.min.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>


  <!-- Template Main JS File -->
  <script src="assets/js/main.js"></script>
  <script src="assets/js/data.js"></script>

	<script>
		const myModal = document.getElementById('myModal')
		const myInput = document.getElementById('myInput')

		myModal.addEventListener('shown.bs.modal', () => {
			myInput.focus()
		})
	</script>

</body>

</html>
