<?php
include "koneksi.php";

function h($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }

// ---------- Konfigurasi ----------
// Daftar sesi tetap. Teks harus SAMA dengan isi kolom `slot` di tabel ketersediaan.
$daftarSlot = [
    '06:00 - 09:00 WIB',
    '10:00 - 12:00 WIB',
    '13:00 - 15:00 WIB',
    '16:00 - 18:00 WIB',
];
$tglMin = date('Y-m-d');   // tidak boleh booking tanggal yang sudah lewat
$tglMax = '2027-03-31';

// Sesi dianggap lewat kalau jam akhirnya sudah terlewati (sama seperti bookingSaya.php)
function slotLewat($tanggal, $slot) {
    // ambil jam akhir dari "06:00 - 09:00 WIB"
    if (!preg_match('/-\s*(\d{2}:\d{2})/', $slot, $m)) return false;
    return strtotime($tanggal . ' ' . $m[1]) < time();
}

// ---------- Simpan booking (POST dari popup) ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['aksi'] ?? '') === 'booking') {
    $pid   = (int) ($_POST['id'] ?? 0);
    $ptgl  = $_POST['tanggal'] ?? '';
    $pslot = $_POST['slot'] ?? '';

    $dt    = DateTime::createFromFormat('Y-m-d', $ptgl);
    $valid = $pid > 0 && in_array($pslot, $daftarSlot, true)
          && $dt && $dt->format('Y-m-d') === $ptgl
          && $ptgl >= $tglMin && $ptgl <= $tglMax
          && !slotLewat($ptgl, $pslot);

    if ($valid) {
        $cek = $koneksi->prepare("SELECT status FROM ketersediaan WHERE id = ? AND tanggal = ? AND slot = ?");
        $cek->bind_param('iss', $pid, $ptgl, $pslot);
        $cek->execute();
        $row = $cek->get_result()->fetch_assoc();

        $ok = false;
        if (!$row) {
            $q = $koneksi->prepare("INSERT INTO ketersediaan (id, tanggal, slot, status) VALUES (?, ?, ?, 1)");
            $q->bind_param('iss', $pid, $ptgl, $pslot);
            $ok = $q->execute();
        } elseif ((int) $row['status'] === 0) {
            $q = $koneksi->prepare("UPDATE ketersediaan SET status = 1 WHERE id = ? AND tanggal = ? AND slot = ?");
            $q->bind_param('iss', $pid, $ptgl, $pslot);
            $ok = $q->execute();
        }

        if ($ok) {
            header('Location: bookingSaya.php?berhasil=1');
            exit;
        }
    }
    header('Location: ' . urlDetail($pid, $ptgl ?: $tglMin) . '&gagal=1');
    exit;
}

// ---------- Ambil ID ruangan ----------
$id = (int) ($_GET['id'] ?? 0);
if ($id <= 0) {
    header('Location: dashboard.php');
    exit;
}

$stmt = $koneksi->prepare("SELECT * FROM fasilitas WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();
$ruang = $stmt->get_result()->fetch_assoc();

if (!$ruang) {
    http_response_code(404);
    echo "Ruangan tidak ditemukan. <a href='dashboard.php'>Kembali</a>";
    exit;
}

// ---------- Validasi tanggal ----------
$tanggal = $_GET['tanggal'] ?? $tglMin;
$d = DateTime::createFromFormat('Y-m-d', $tanggal);
if (!$d || $d->format('Y-m-d') !== $tanggal) { $tanggal = $tglMin; }
if ($tanggal < $tglMin) { $tanggal = $tglMin; }
if ($tanggal > $tglMax) { $tanggal = $tglMax; }

$prev = date('Y-m-d', strtotime($tanggal . ' -1 day'));
$next = date('Y-m-d', strtotime($tanggal . ' +1 day'));

function urlDetail($id, $tgl) {
    return 'detailRuangan.php?' . http_build_query(['id' => $id, 'tanggal' => $tgl]);
}

// ---------- Ambil ketersediaan pada tanggal tsb ----------
// Asumsi: kolom `id` di tabel ketersediaan = id fasilitas.
// Baris dengan status 'booked' / '1' berarti sesi terisi. Tidak ada baris = tersedia.
$status = [];
$stmt = $koneksi->prepare("SELECT slot, status FROM ketersediaan WHERE id = ? AND tanggal = ?");
$stmt->bind_param('is', $id, $tanggal);
$stmt->execute();
$res = $stmt->get_result();
while ($r = $res->fetch_assoc()) {
    $status[trim($r['slot'])] = strtolower(trim($r['status']));
}

// ---------- Siapkan data tampilan ----------
$nama      = $ruang['nama'];
$lokasi    = $ruang['lokasi'];
$kapasitas = (int) $ruang['kapasitas'];
$pengelola = ucwords($ruang['pengelola'] ?? '-');
$deskripsi = $ruang['desc'] ?? '';
$gambar    = ($ruang['kategori'] === 'Lab Komputer') ? 'img/lab_komputer.jpg' : 'img/ruang_kuliah.jpg';

// kolom fasilitas berisi teks dipisah koma: "komputer, papan tulis, smarttv"
$listFasilitas = array_filter(array_map('trim', explode(',', (string) $ruang['fasilitas'])));
$aktif = hitungBookingAktif($koneksi);
?>
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= h($nama) ?> - SIPADEDI</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        /* Perbaikan layout halaman detail (melengkapi style.css) */
        a{color:inherit;text-decoration:none}
        .slot{display:grid;place-items:center;text-align:center;padding:0 10px;text-decoration:none}
        .slot.booked,.slot.mine,.slot.past{user-select:none}
        .slot.past{opacity:.4;cursor:not-allowed;text-decoration:line-through}
        .lg.past{background:#999;opacity:.4}
        .arr{text-decoration:none;color:inherit}
        .arr.off{opacity:.25;pointer-events:none}
        .datewrap{margin:0}
        .datepill{cursor:pointer}
        .datepill input[type="date"]{
            font:inherit;color:inherit;background:transparent;border:0;outline:0;
            padding:0;min-width:0;cursor:pointer;font-variant-numeric:tabular-nums;
            color-scheme:light dark;
        }
        .datepill:focus-within{box-shadow:0 0 0 3px color-mix(in srgb,var(--ink-2),transparent 70%)}
        .date-go{margin-left:10px;height:54px;padding:0 18px;border:0;border-radius:16px;
            background:var(--btn);color:var(--btn-ink);font:inherit;font-weight:600;cursor:pointer}
        .datewrap{display:flex;align-items:center}
        .rows .row b{text-align:right}
        .chips:empty::after{content:"Belum ada data fasilitas";color:var(--ink-2);font-size:15px}
        @media (max-width:560px){
            .datepill{height:48px;font-size:15px}
            .datepill .ic{width:1.3em;height:1.3em}
            .slot{height:56px;font-size:13px}
        }
    </style>
</head>
<body>
<div class="app">
    <aside class="side" aria-label="Navigasi utama">
        <div class="logo sp">SIPADEDI</div>

        <div class="sec acc sp">
            <p class="lab">Account</p>
            <details class="accwrap">
                <summary class="chip">
                    <span class="avatar" aria-hidden="true"></span>
                    <b>Mahasiswa</b>
                    <svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7"/></svg>
                </summary>
                <div class="menu">
                    <div class="menu-i">Masuk sebagai<b>mahasiswa@sipadedi.test</b></div>
                </div>
            </details>
        </div>

        <div class="sec gen sp">
            <p class="lab">General</p>
            <nav aria-label="Menu">
                <a class="nv" href="dashboard.php">
                    <svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h4.5v-5.5h4v5.5h4.5V10"/></svg><span>Beranda</span>
                </a>
                <a class="nv" href="bookingSaya.php" aria-current="page">
                    <svg class="ic f" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12a.5.5 0 0 1 .5.5v17.6a.4.4 0 0 1-.65.3L12 17l-5.85 4.4a.4.4 0 0 1-.65-.3V3.5A.5.5 0 0 1 6 3z"/></svg><span>Booking Saya</span>
                    <?php if ($aktif > 0): ?><span class="badge"><?= $aktif ?></span><?php endif; ?>
                </a>
            </nav>
        </div>
    </aside>

    <main class="main">
        <div class="wrap">
            <section class="view">
                <div>
                    <a class="back" href="dashboard.php"><svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>Kembali</span></a>
                </div>

                <!-- ===== Detail ruangan (dari tabel fasilitas) ===== -->
                <div class="panel detail">
                    <div class="d-img"><img src="<?= h($gambar) ?>" alt="<?= h($nama) ?>"></div>
                    <h2><?= h($nama) ?></h2>
                    <p class="loc big"><svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg><span><?= h($lokasi) ?></span></p>
                    <p class="desc big"><?= h($deskripsi) ?></p>
                    <hr>
                    <div class="rows">
                        <div class="row"><span><svg class="ic f" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.7"/><path d="M2.3 19.8c0-3.7 3-6 6.7-6s6.7 2.3 6.7 6z"/><circle cx="17.2" cy="8.8" r="2.9"/><path d="M16.9 13.7c3 .1 5.4 2 5.4 5.4v.7h-4.6c0-2.2-.3-4.2-.8-6.1z"/></svg>Kapasitas</span><b><?= $kapasitas ?> Orang</b></div>
                        <div class="row"><span><svg class="ic f" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z"/></svg>Pengelola</span><b><?= h($pengelola) ?></b></div>
                    </div>
                    <hr>
                    <h3>Fasilitas</h3>
                    <div class="chips">
                        <?php foreach ($listFasilitas as $n => $f): ?>
                            <span class="cp" style="animation-delay:<?= $n * 70 ?>ms"><i><svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 12.5l4.2 4.2L18.5 8"/></svg></i><?= h(ucfirst($f)) ?></span>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- ===== Ajukan booking (dari tabel ketersediaan) ===== -->
                <div class="panel book">
                    <h3>Ajukan Booking</h3>

                    <div class="datebar">
                        <?php if ($tanggal > $tglMin): ?>
                            <a class="arr" href="<?= h(urlDetail($id, $prev)) ?>" aria-label="Hari sebelumnya" rel="prev"><svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></a>
                        <?php else: ?>
                            <span class="arr off" aria-hidden="true"><svg class="ic o" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></span>
                        <?php endif; ?>

                        <form class="datewrap" method="GET" action="detailRuangan.php">
                            <input type="hidden" name="id" value="<?= $id ?>">
                            <label class="datepill">
                                <svg class="ic f" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4" width="19" height="17.5" rx="3.5"/><rect x="6.5" y="1.8" width="2.2" height="4.6" rx="1.1"/><rect x="15.3" y="1.8" width="2.2" height="4.6" rx="1.1"/></svg>
                                <span class="sr">Tanggal booking</span>
                                <input id="tanggal" type="date" name="tanggal" value="<?= h($tanggal) ?>" min="<?= h($tglMin) ?>" max="<?= h($tglMax) ?>" required onchange="this.form.submit()">
                            </label>
                            <noscript><button class="date-go" type="submit">Tampilkan</button></noscript>
                        </form>

                        <?php if ($tanggal < $tglMax): ?>
                            <a class="arr" href="<?= h(urlDetail($id, $next)) ?>" aria-label="Hari berikutnya" rel="next"><svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></a>
                        <?php else: ?>
                            <span class="arr off" aria-hidden="true"><svg class="ic o" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></span>
                        <?php endif; ?>
                    </div>

                    <div class="legend">
                        <span><i class="lg free"></i>Available</span>
                        <span><i class="lg booked"></i>Booked</span>
                        <span><i class="lg mine"></i>Yours</span>
                        <span><i class="lg past"></i>Lewat</span>
                    </div>

                    <div class="slots">
                        <?php foreach ($daftarSlot as $i => $slot):
                            $st    = $status[$slot] ?? 'free';
                            $lewat = slotLewat($tanggal, $slot);
                            if ($st === 'booked'):
                        ?>
                            <span class="slot booked" style="--i:<?= $i ?>" title="Sudah dibooking pengguna lain" aria-disabled="true"><?= h($slot) ?></span>
                        <?php elseif ($st === '1'): ?>
                            <span class="slot mine" style="--i:<?= $i ?>" title="Booking Anda"><?= h($slot) ?></span>
                        <?php elseif ($lewat): ?>
                            <span class="slot past" style="--i:<?= $i ?>" title="Sesi sudah lewat" aria-disabled="true"><?= h($slot) ?></span>
                        <?php else:
                            $link = 'konfirmasi.php?' . http_build_query(['id' => $id, 'tanggal' => $tanggal, 'slot' => $slot]);
                        ?>
                            <a class="slot free" style="--i:<?= $i ?>" href="<?= h($link) ?>"
                               data-id="<?= $id ?>" data-tanggal="<?= h($tanggal) ?>" data-slot="<?= h($slot) ?>"
                               title="Tersedia"><?= h($slot) ?></a>
                        <?php endif; endforeach; ?>
                    </div>
                </div>
            </section>
        </div>
    </main>
</div>
<script src="js/popup.js" defer></script>
</body>
</html>