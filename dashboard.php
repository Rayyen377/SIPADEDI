<?php
include "koneksi.php";

function h($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }

// ---------- Ambil filter ----------
$q          = trim($_GET['q'] ?? '');
$kategori   = $_GET['kategori'] ?? 'all';
$kapasitas  = $_GET['kapasitas'] ?? 'all';
$halaman    = max(1, (int) ($_GET['halaman'] ?? 1));
$perHalaman = 4;

$where  = [];
$params = [];
$types  = '';

if ($q !== '') {
    $where[]  = "nama LIKE ?";
    $params[] = "%$q%";
    $types   .= 's';
}
if ($kategori !== 'all') {
    $where[]  = "kategori = ?";
    $params[] = $kategori;
    $types   .= 's';
}
if ($kapasitas === 'sm') {
    $where[] = "kapasitas <= 30";
} elseif ($kapasitas === 'md') {
    $where[] = "kapasitas BETWEEN 31 AND 60";
} elseif ($kapasitas === 'lg') {
    $where[] = "kapasitas > 60";
}
$whereSql = $where ? " WHERE " . implode(" AND ", $where) : "";

// ---------- Hitung total ----------
$stmt = $koneksi->prepare("SELECT COUNT(*) FROM fasilitas" . $whereSql);
if ($params) { $stmt->bind_param($types, ...$params); }
$stmt->execute();
$total = (int) $stmt->get_result()->fetch_row()[0];

$totalHalaman = max(1, (int) ceil($total / $perHalaman));
$halaman      = min($halaman, $totalHalaman);
$offset       = ($halaman - 1) * $perHalaman;

// ---------- Ambil data halaman ini ----------
$stmt = $koneksi->prepare("SELECT * FROM fasilitas" . $whereSql . " ORDER BY nama LIMIT ? OFFSET ?");
$p2 = $params;
$p2[] = $perHalaman;
$p2[] = $offset;
$stmt->bind_param($types . 'ii', ...$p2);
$stmt->execute();
$hasil = $stmt->get_result();

// Daftar kategori untuk dropdown
$daftarKategori = $koneksi->query("SELECT DISTINCT kategori FROM fasilitas ORDER BY kategori");

function urlHalaman($n) {
    $p = $_GET;
    $p['halaman'] = $n;
    return 'dashboard.php?' . http_build_query($p);
}

$dari   = $total ? $offset + 1 : 0;
$sampai = min($offset + $perHalaman, $total);
$aktif = hitungBookingAktif($koneksi);
?>
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SIPADEDI</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        /* Perbaikan layout (melengkapi style.css) */
        a{color:inherit;text-decoration:none}

        /* Tombol cari di dalam kolom pencarian */
        .fld-q input{padding-right:60px}
        .fld-btn{position:absolute;right:8px;top:50%;translate:0 -50%;width:42px;height:42px;
            display:grid;place-items:center;border:0;border-radius:10px;background:transparent;color:var(--ink);padding:0;
            transition:background .2s}
        .fld-btn:hover{background:color-mix(in srgb,var(--panel),var(--ink) 10%)}
        .fld-btn .ic{width:1.4em;height:1.4em}

        /* Menu akun (details/summary) */
        .chip{list-style:none;cursor:pointer}
        .chip::-webkit-details-marker{display:none}
        .accwrap[open] .chip .ic{transform:rotate(180deg)}
        .menu-i{display:flex;flex-direction:column;gap:2px;padding:9px 10px;font-size:13px;color:var(--side-mute)}
        .menu-i b{color:#fff;font-weight:600;font-size:14px;word-break:break-all}

        /* Kartu fasilitas */
        .card{height:100%}
        .card-b .desc{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:3.1em}
        .card-b .loc span{min-width:0}

        /* Pagination: tombol nonaktif */
        .pg.disabled{opacity:.4;cursor:not-allowed;pointer-events:none}
        .pg-nav{justify-content:flex-end}
        @media (max-width:560px){.pg-nav{justify-content:center}}
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
                <a class="nv" href="dashboard.php" aria-current="page">
                    <svg class="ic f" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 1.8 11.7a.8.8 0 0 0 .5 1.4H4.5V20a1 1 0 0 0 1 1H10v-6h4v6h4.5a1 1 0 0 0 1-1v-6.9h2.2a.8.8 0 0 0 .5-1.4z"/></svg><span>Beranda</span>
                </a>
                <a class="nv" href="bookingSaya.php">
                    <svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3.5h11v17L12 16.6l-5.5 3.9z"/></svg><span>Booking Saya</span>
                    <?php if ($aktif > 0): ?><span class="badge"><?= $aktif ?></span><?php endif; ?>
                </a>
            </nav>
        </div>
    </aside>

    <main class="main">
        <div class="wrap">
            <section class="view">
                <header class="hero">
                    <div class="hero-bg" style="background-image:url('img/dashboard.jpg')"></div>
                    <div class="hero-top">
                        <span class="tag">Departemen Teknik Elektro &amp; Informatika</span>
                        <span class="univ">Sekolah Vokasi UGM</span>
                    </div>
                    <div class="hero-main">
                        <h1 class="brand">SIPADEDI</h1>
                        <p class="sub">Sistem Informasi Peminjaman Fasilitas DTEDI</p>
                        <p class="lead">Layanan sistem peminjaman laboratorium komputer, ruang perkuliahan, ruang rapat, dan hall untuk kegiatan akademik, praktikum, serta kegiatan himpunan mahasiswa DTEDI.</p>
                    </div>
                </header>

                <!-- Tombol "Terapkan" dihapus: dropdown langsung submit saat berubah -->
                <form class="panel filters" method="GET" action="dashboard.php" role="search">
                    <label class="fld fld-q">
                        <span class="sr">Cari fasilitas</span>
                        <input id="q" type="search" name="q" value="<?= h($q) ?>" placeholder="Cari fasilitas, contoh: Hall SV…" autocomplete="off">
                        <button class="fld-btn" type="submit" aria-label="Cari"><svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7"/><path d="M16 16l5 5"/></svg></button>
                    </label>
                    <label class="fld">
                        <span class="sr">Kategori</span>
                        <select id="kategori" name="kategori" onchange="this.form.submit()">
                            <option value="all">Semua Kategori</option>
                            <?php while ($k = $daftarKategori->fetch_assoc()): ?>
                                <option value="<?= h($k['kategori']) ?>" <?= $kategori === $k['kategori'] ? 'selected' : '' ?>><?= h($k['kategori']) ?></option>
                            <?php endwhile; ?>
                        </select>
                        <svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7"/></svg>
                    </label>
                    <label class="fld">
                        <span class="sr">Kapasitas</span>
                        <select id="kapasitas" name="kapasitas" onchange="this.form.submit()">
                            <option value="all" <?= $kapasitas === 'all' ? 'selected' : '' ?>>Semua Kapasitas</option>
                            <option value="sm"  <?= $kapasitas === 'sm'  ? 'selected' : '' ?>>Hingga 30 orang</option>
                            <option value="md"  <?= $kapasitas === 'md'  ? 'selected' : '' ?>>31 – 60 orang</option>
                            <option value="lg"  <?= $kapasitas === 'lg'  ? 'selected' : '' ?>>Lebih dari 60 orang</option>
                        </select>
                        <svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7"/></svg>
                    </label>
                </form>

                <div class="panel" id="daftar">
                    <div class="list-h">
                        <h2>Daftar Fasilitas DTEDI SV UGM</h2>
                        <span class="count"><?= $total ?> Fasilitas</span>
                    </div>

                    <div class="grid" id="fasilitas">
                        <?php include "fasilitas.php"; ?>
                    </div>

                    <?php if ($total > 0): ?>
                    <div class="pager">
                        <span class="pg-info">Menampilkan <?= $dari ?>–<?= $sampai ?> dari <?= $total ?> fasilitas</span>
                        <nav class="pg-nav" aria-label="Halaman fasilitas">
                            <?php if ($halaman > 1): ?>
                                <a class="pg" href="<?= h(urlHalaman($halaman - 1)) ?>" rel="prev"><svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>Sebelumnya</a>
                            <?php else: ?>
                                <span class="pg disabled" aria-disabled="true"><svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>Sebelumnya</span>
                            <?php endif; ?>

                            <?php for ($n = 1; $n <= $totalHalaman; $n++): ?>
                                <?php if ($n === $halaman): ?>
                                    <span class="pg num" aria-current="page"><?= $n ?></span>
                                <?php else: ?>
                                    <a class="pg num" href="<?= h(urlHalaman($n)) ?>" aria-label="Halaman <?= $n ?>"><?= $n ?></a>
                                <?php endif; ?>
                            <?php endfor; ?>

                            <?php if ($halaman < $totalHalaman): ?>
                                <a class="pg next" href="<?= h(urlHalaman($halaman + 1)) ?>" rel="next">Berikutnya<svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></a>
                            <?php endif; ?>
                        </nav>
                    </div>
                    <?php endif; ?>
                </div>
            </section>
        </div>
    </main>
</div>
</body>
</html>