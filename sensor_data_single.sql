-- phpMyAdmin SQL Dump
-- version 5.0.4deb2+deb11u1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 16, 2024 at 05:57 PM
-- Server version: 10.5.21-MariaDB-0+deb11u1
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `testdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `sensor_data_single`
--

CREATE TABLE `sensor_data_single` (
  `id` int(11) NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `air_humidity` double DEFAULT NULL,
  `air_temperature` double DEFAULT NULL,
  `soil_temperature` double DEFAULT NULL,
  `soil_moisture_3in1` double DEFAULT NULL,
  `soil_pH` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sensor_data_single`
--

INSERT INTO `sensor_data_single` (`id`, `timestamp`, `air_humidity`, `air_temperature`, `soil_temperature`, `soil_moisture_3in1`, `soil_pH`) VALUES
(4396, '2024-02-13 17:38:04', 17.2, 41.9, 31, 57.1, 7),
(4397, '2024-02-16 17:37:31', 27.9, 24.3, 23, 0, 3),
(4398, '2024-02-16 17:38:33', 28.1, 24.3, 23, 0, 3),
(4399, '2024-02-16 17:39:03', 28.2, 24.3, 23, 0, 3),
(4400, '2024-02-16 17:39:33', 28.1, 24.3, 23, 0, 3),
(4401, '2024-02-16 17:40:03', 28.2, 24.3, 23, 0, 3),
(4402, '2024-02-16 17:40:33', 28.3, 24.2, 23.1, 0, 3),
(4403, '2024-02-16 17:41:03', 28.3, 24.3, 23.1, 0, 3),
(4404, '2024-02-16 17:41:33', 28.2, 24.3, 23.2, 0, 3),
(4405, '2024-02-16 17:42:03', 28.2, 24.3, 23.2, 0, 3),
(4406, '2024-02-16 17:42:33', 28.3, 24.3, 23.2, 0, 3),
(4407, '2024-02-16 17:43:03', 28.5, 24.4, 23.2, 0, 3),
(4408, '2024-02-16 17:43:33', 28.4, 24.3, 23.2, 0, 3),
(4409, '2024-02-16 17:44:03', 28.5, 24.3, 23.2, 0, 3),
(4410, '2024-02-16 17:44:33', 28.5, 24.3, 23.2, 2.6, 3),
(4411, '2024-02-16 17:45:04', 28.6, 24.3, 23.2, 0, 3),
(4412, '2024-02-16 17:45:34', 28.6, 24.3, 23.2, 0, 3),
(4413, '2024-02-16 17:46:04', 28.5, 24.3, 23.2, 2, 3),
(4414, '2024-02-16 17:46:34', 28.3, 24.3, 23.2, 0, 3),
(4415, '2024-02-16 17:47:04', 28.3, 24.2, 23.2, 0, 3),
(4416, '2024-02-16 17:47:34', 28.2, 24.3, 23.2, 0, 3),
(4417, '2024-02-16 17:48:04', 28.2, 24.3, 23.2, 0, 3),
(4418, '2024-02-16 17:48:34', 28.1, 24.3, 23.1, 0, 3),
(4419, '2024-02-16 17:49:04', 28.1, 24.3, 23.1, 0, 3),
(4420, '2024-02-16 17:49:34', 28.1, 24.3, 23.1, 0, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sensor_data_single`
--
ALTER TABLE `sensor_data_single`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sensor_data_single`
--
ALTER TABLE `sensor_data_single`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4437;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
