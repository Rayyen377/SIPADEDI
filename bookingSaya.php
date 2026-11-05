<?php
include "koneksi.php";

function h($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }

function sudahSelesai($tanggal, $slot) {
    // ambil jam akhir dari "06:00 - 09:00 WIB"
    if (!preg_match('/-\s*(\d{2}:\d{2})/', $slot, $m)) return false;
    return strtotime($tanggal . ' ' . $m[1]) < time();
}

// ---------- Batalkan booking (POST lalu redirect) ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['aksi'] ?? '') === 'batal') {
    $id      = (int) ($_POST['id'] ?? 0);
    $tanggal = $_POST['tanggal'] ?? '';
    $slot    = $_POST['slot'] ?? '';

    if (sudahSelesai($tanggal, $slot)) {
    header('Location: bookingSaya.php');
    exit;
}

    $stmt = $koneksi->prepare("DELETE FROM ketersediaan WHERE id = ? AND tanggal = ? AND slot = ? AND status = '1'");
    $stmt->bind_param('iss', $id, $tanggal, $slot);
    $stmt->execute();

    header('Location: bookingSaya.php?batal=1');
    exit;
}

// ---------- Ambil booking milik user (status = 'mine') ----------
// Booking = baris di ketersediaan dengan status 'mine', digabung dengan data ruangan di fasilitas.
$sql = "SELECT k.id, k.tanggal, k.slot, f.nama, f.lokasi, f.kategori, f.`desc` AS deskripsi
        FROM ketersediaan k
        JOIN fasilitas f ON f.id = k.id
        WHERE k.status = 1
        ORDER BY k.tanggal ASC, k.slot ASC";
$hasil = $koneksi->query($sql);
$semua = $hasil ? $hasil->fetch_all(MYSQLI_ASSOC) : [];

foreach ($semua as &$row) {
    $row['selesai'] = sudahSelesai($row['tanggal'], $row['slot']);
    $row['gambar']  = ($row['kategori'] === 'Lab Komputer') ? 'img/lab_komputer.jpg' : 'img/ruang_kuliah.jpg';
}
unset($row);

usort($semua, fn($a, $b) => $a['selesai'] <=> $b['selesai']);

$jumlah = count($semua);
$aktif  = count(array_filter($semua, fn($b) => !$b['selesai']));
?>
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Booking Saya - SIPADEDI</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        /* Perbaikan layout (melengkapi style.css) */
        a{color:inherit;text-decoration:none}
        .back{color:#fff}
        .chip{list-style:none;cursor:pointer}
        .chip::-webkit-details-marker{display:none}
        .accwrap[open] .chip .ic{transform:rotate(180deg)}
        .menu-i{display:flex;flex-direction:column;gap:2px;padding:9px 10px;font-size:13px;color:var(--side-mute)}
        .menu-i b{color:#fff;font-weight:600;font-size:14px;word-break:break-all}

        .view>.panel{margin-bottom:20px}
        .btn-ok{display:inline-grid;place-items:center;text-decoration:none}
        .bk-a form{display:contents}
        .trash{border:0;cursor:pointer}
        .bk .desc{margin-top:6px}
        .notice{padding:14px 18px;border-radius:14px;border:1px solid var(--ok-line);background:var(--ok-bg)}
        .empty .btn-ok{margin-top:6px}
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

                <div class="panel head"><h2>Booking Saya</h2></div>

                <?php if (isset($_GET['batal'])): ?>
                    <div class="notice" role="status">Booking berhasil dibatalkan.</div>
                <?php endif; ?>

                <?php if ($jumlah === 0): ?>
                    <div class="panel">
                        <div class="empty">
                            <b>Belum ada booking</b>
                            <p>Kamu belum memesan fasilitas apa pun. Pilih fasilitas di beranda untuk mengajukan booking.</p>
                            <a class="btn-ok" href="dashboard.php">Lihat Fasilitas</a>
                        </div>
                    </div>
                <?php else: ?>
                    <?php foreach ($semua as $i => $b):
    $tglTampil = date('d/m/Y', strtotime($b['tanggal']));
    $linkEdit  = 'detailRuangan.php?' . http_build_query(['id' => $b['id'], 'tanggal' => $b['tanggal']]);
?>
                    
                    <article class="panel bk" style="--i:<?= $i ?>">
                        <div class="bk-img"><img src="<?= h($b['gambar']) ?>" alt="<?= h($b['nama']) ?>"></div>
                        <h3><?= h($b['nama']) ?><?php if ($b['selesai']): ?><span class="done-tag">Selesai</span><?php endif; ?></h3>
                        <p class="loc"><svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg><span><?= h($b['lokasi']) ?></span></p>
                        <p class="desc"><?= h($b['deskripsi']) ?></p>
                        <div class="bk-a">
                            <?php if ($b['selesai']): ?>
                            <div class="pill c"><?= h($b['slot']) ?></div>
                            
                            <?php else: ?><div class="pill"><svg class="ic f" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4" width="19" height="17.5" rx="3.5"/><rect x="6.5" y="1.8" width="2.2" height="4.6" rx="1.1"/><rect x="15.3" y="1.8" width="2.2" height="4.6" rx="1.1"/></svg><span><?= h($tglTampil) ?></span><svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16.5" rx="3.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg></div>
                            <div class="pill c"><?= h($b['slot']) ?></div>
                            <a class="btn-ok" href="<?= h($linkEdit) ?>">Edit Booking</a>
                            <form method="POST" action="bookingSaya.php" onsubmit="return confirm('Batalkan booking ini?');">
                                <input type="hidden" name="aksi" value="batal">
                                <input type="hidden" name="id" value="<?= (int) $b['id'] ?>">
                                <input type="hidden" name="tanggal" value="<?= h($b['tanggal']) ?>">
                                <input type="hidden" name="slot" value="<?= h($b['slot']) ?>">
                                <button class="trash" type="submit" aria-label="Batalkan booking <?= h($b['nama']) ?>"><svg class="ic f" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.2 2.5h5.6l.8 1.8H20a.9.9 0 0 1 0 1.8H4a.9.9 0 0 1 0-1.8h4.4z"/><path fill-rule="evenodd" d="M5.5 8h13l-.9 12.2a1.9 1.9 0 0 1-1.9 1.8H8.3a1.9 1.9 0 0 1-1.9-1.8zM9.4 10.5v8.2h1.5v-8.2zm3.7 0v8.2h1.5v-8.2z"/></svg></button>
                            </form>
                            <?php endif; ?>
                        </div>
                    </article>
                    <?php $i++; endforeach; ?>
                <?php endif; ?>
            </section>
        </div>
    </main>
</div>
</body>
</html>