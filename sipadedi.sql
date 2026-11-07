-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 05, 2026 at 02:29 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sipadedi`
--

-- --------------------------------------------------------

--
-- Table structure for table `fasilitas`
--

CREATE TABLE `fasilitas` (
  `id` int NOT NULL,
  `nama` varchar(100) NOT NULL,
  `lokasi` varchar(100) NOT NULL,
  `kapasitas` int NOT NULL,
  `fasilitas` text NOT NULL,
  `status` varchar(50) NOT NULL,
  `kategori` varchar(25) NOT NULL,
  `pengelola` varchar(25) NOT NULL,
  `desc` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fasilitas`
--

INSERT INTO `fasilitas` (`id`, `nama`, `lokasi`, `kapasitas`, `fasilitas`, `status`, `kategori`, `pengelola`, `desc`) VALUES
(1, 'LAB RPL 1', 'Gedung Herman Johannes | HU108', 30, 'komputer, papan tulis, smarttv', 'true', 'Lab Komputer', 'laboran', 'Fasilitas laboratorium komputer di Gedung Herman Johannes yang dapat menampung hingga 30 pengguna untuk kegiatan praktikum maupun riset teknologi. Tersedia sarana penunjang lengkap meliputi unit komputer siap pakai, Smart TV, dan papan tulis yang dikelola langsung oleh laboran.'),
(2, 'LAB RPL 2', 'Gedung Herman Johannes | HU107', 30, 'komputer, papan tulis, smarttv', 'true', 'Lab Komputer', 'laboran', 'Fasilitas laboratorium komputer di Gedung Herman Johannes yang dapat menampung hingga 30 pengguna untuk kegiatan praktikum maupun riset teknologi. Tersedia sarana penunjang lengkap meliputi unit komputer siap pakai, Smart TV, dan papan tulis yang dikelola langsung oleh laboran.'),
(3, 'LAB RPL 3', 'Gedung Herman Johannes | HU106', 30, 'komputer, papan tulis, smarttv', 'true', 'Lab Komputer', 'laboran', 'Fasilitas laboratorium komputer di Gedung Herman Johannes yang dapat menampung hingga 30 pengguna untuk kegiatan praktikum maupun riset teknologi. Tersedia sarana penunjang lengkap meliputi unit komputer siap pakai, Smart TV, dan papan tulis yang dikelola langsung oleh laboran.'),
(4, 'R. kuliah', 'Gedung Herman Johannes | HU207', 60, 'papan tulis, proyektor, microphone', 'true', 'Ruang Kelas', 'staff akademik', 'Ruang perkuliahan di lantai dua Gedung Herman Johannes yang mampu menampung hingga 60 mahasiswa untuk berbagai aktivitas akademik. Dilengkapi dengan proyektor, mikrofon, dan papan tulis untuk memfasilitasi jalannya presentasi serta diskusi di dalam kelas'),
(5, 'R. kuliah', 'Gedung Herman Johannes | HU208', 60, 'papan tulis, proyektor, microphone', 'true', 'Ruang Kelas', 'staff akademik', 'Ruang perkuliahan di lantai dua Gedung Herman Johannes yang mampu menampung hingga 60 mahasiswa untuk berbagai aktivitas akademik. Dilengkapi dengan proyektor, mikrofon, dan papan tulis untuk memfasilitasi jalannya presentasi serta diskusi di dalam kelas'),
(6, 'R. kuliah', 'Gedung Herman Johannes | HU209', 60, 'papan tulis, proyektor, microphone', 'true', 'Ruang Kelas', 'staff akademik', 'Ruang perkuliahan di lantai dua Gedung Herman Johannes yang mampu menampung hingga 60 mahasiswa untuk berbagai aktivitas akademik. Dilengkapi dengan proyektor, mikrofon, dan papan tulis untuk memfasilitasi jalannya presentasi serta diskusi di dalam kelas');

-- --------------------------------------------------------

--
-- Table structure for table `ketersediaan`
--

CREATE TABLE `ketersediaan` (
  `id` int NOT NULL,
  `tanggal` date NOT NULL,
  `slot` varchar(30) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ketersediaan`
--

INSERT INTO `ketersediaan` (`id`, `tanggal`, `slot`, `status`) VALUES
(1, '2026-11-04', '06:00 - 09:00 WIB', 1),
(1, '2026-11-05', '06:00 - 09:00 WIB', 1),
(1, '2026-11-05', '13:00 - 15:00 WIB', 1),
(2, '2026-11-05', '10:00 - 12:00 WIB', 1),
(1, '2026-11-06', '06:00 - 09:00 WIB', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `fasilitas`
--
ALTER TABLE `fasilitas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ketersediaan`
--
ALTER TABLE `ketersediaan`
  ADD KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `fasilitas`
--
ALTER TABLE `fasilitas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ketersediaan`
--
ALTER TABLE `ketersediaan`
  ADD CONSTRAINT `ketersediaan_ibfk_1` FOREIGN KEY (`id`) REFERENCES `fasilitas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
