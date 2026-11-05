<?php
date_default_timezone_set('Asia/Jakarta');
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "sipadedi";

// Membuat koneksi
$koneksi = mysqli_connect($servername, $username, $password, $dbname);

// Periksa koneksi (variabel harus $koneksi, bukan $conn)
if (!$koneksi) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

mysqli_set_charset($koneksi, "utf8mb4");

// Jumlah booking yang masih berjalan (belum lewat jam akhir sesi)
function hitungBookingAktif($koneksi) {
    $sekarang = date('Y-m-d H:i:s');
    $stmt = $koneksi->prepare(
        "SELECT COUNT(*) FROM ketersediaan
         WHERE status = 1
           AND CONCAT(tanggal, ' ', SUBSTRING(slot, 9, 5)) >= ?"
    );
    $stmt->bind_param('s', $sekarang);
    $stmt->execute();
    return (int) $stmt->get_result()->fetch_row()[0];
}
?>