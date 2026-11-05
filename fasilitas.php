<?php
// File ini hanya merender kartu. Variabel $hasil disiapkan oleh dashboard.php.

if (!isset($hasil) || $hasil->num_rows === 0) {
    echo '<div class="empty"><b>Fasilitas tidak ditemukan</b><p>Coba ubah kata kunci atau filter yang dipilih.</p></div>';
    return;
}

$i = 0;
while ($data = $hasil->fetch_assoc()) {
    $nama      = h($data['nama']);
    $lokasi    = h($data['lokasi']);
    $kapasitas = (int) $data['kapasitas'];
    $deskripsi = h($data['desc'] ?? '');
    $id        = urlencode($data['id'] ?? '');
    $gambar = ($data['kategori'] === 'Lab Komputer') ? 'img/lab_komputer.jpg' : 'img/ruang_kuliah.jpg';

    echo '<a class="card" style="--i:' . $i . '" href="detailRuangan.php?id=' . $id . '" aria-label="Pilih sesi ' . $nama . '">';
    echo '<div class="card-img"><img src="' . $gambar . '" alt="" loading="lazy"></div>';
    echo '<div class="card-b">';
    echo '<h3>' . $nama . '</h3>';
    echo '<p class="loc"><svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg><span>' . $lokasi . '</span></p>';
    echo '<p class="desc">' . $deskripsi . '</p>';
    echo '</div>';
    echo '<div class="card-f">';
    echo '<span class="cap"><svg class="ic f" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.7"/><path d="M2.3 19.8c0-3.7 3-6 6.7-6s6.7 2.3 6.7 6z"/><circle cx="17.2" cy="8.8" r="2.9"/><path d="M16.9 13.7c3 .1 5.4 2 5.4 5.4v.7h-4.6c0-2.2-.3-4.2-.8-6.1z"/></svg>Kapasitas ' . $kapasitas . ' Orang</span>';
    echo '<span class="go">Pilih Sesi <svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></span>';
    echo '</div>';
    echo '</a>';

    $i++;
}