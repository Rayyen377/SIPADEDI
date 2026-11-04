export const P = {
    jaringan: { w1: '#dfe6ee', w2: '#c3ceda', f1: '#9aa2ae', f2: '#707988', sc: '#3d7bd9' },
    rpl: { w1: '#efe6d6', w2: '#d9ccb4', f1: '#a8a49d', f2: '#7e7a73', sc: '#35a979' },
    elektro: { w1: '#e3e9e6', w2: '#c5d0cb', f1: '#a2a8a4', f2: '#777e7a', sc: '#e0883a' },
    kelas: { w1: '#eef1f4', w2: '#d5dbe3', f1: '#bcae95', f2: '#92846c' },
    kelas2: { w1: '#f2ede4', w2: '#ddd3c1', f1: '#b7ad9d', f2: '#8c8374' },
    rapat: { w1: '#e8ebf2', w2: '#cdd3e1', f1: '#8e857a', f2: '#645d54', sc: '#4a79d6', lamp: '#f3d77a' },
    himp: { w1: '#f0e8dc', w2: '#dcccb6', f1: '#9c8f80', f2: '#72675a', sc: '#c85b4a', lamp: '#f3c27a' },
    hall: { w1: '#2a3556', w2: '#1d2540', f1: '#76523a', f2: '#45301f', dr: '#7d1f2b', ban: '#3b4c86', ch: '#2f3a63' },
    seminar: { w1: '#3b4a77', w2: '#2a3659', f1: '#6b6f7d', f2: '#444857', dr: '#233a6b', ban: '#566aa8', ch: '#e0b64f' },
    studio: { w1: '#232837', w2: '#171b27', f1: '#10131c', f2: '#0a0c13' }
};

export const FACS = [
    { id: 'lab-komputer', name: 'Laboratorium Komputer', loc: 'Gedung Teknologi Lt. 2', desc: 'Laboratorium komputer spesifikasi praktikum pemrograman web, rekayasa perangkat lunak, dan pengelolaan basis data.', cap: 40, cat: 'Laboratorium', mgr: 'Laboran', fas: ['40 PC High Spec', 'Projector HD', 'AC 2 Unit'], photo: 'lab' },
    { id: 'ruang-diskusi-a', name: 'Ruang Diskusi A', loc: 'Gedung Utama Lt. 1', desc: 'Ruang diskusi eksklusif untuk sidang akhir, rapat koordinasi dosen, maupun kunjungan tamu resmi.', cap: 50, cat: 'Ruang Rapat', mgr: 'Staf Akademik', fas: ['Layar TV 65 Inci', 'Meja Konferensi', 'AC 2 Unit', 'WiFi Cepat'], photo: 'diskusi' },
    { id: 'lab-rpl-9', name: 'Laboratorium RPL 9', loc: 'Gedung Teknologi Lt. 2', desc: 'Laboratorium rekayasa perangkat lunak untuk praktikum pemrograman berorientasi objek, pengujian perangkat lunak, dan proyek kelompok.', cap: 36, cat: 'Laboratorium', mgr: 'Laboran', fas: ['36 PC Developer', 'Projector HD', 'Papan Tulis Kaca', 'AC 2 Unit'], kind: 'lab', col: P.rpl },
    { id: 'lab-jaringan', name: 'Laboratorium Jaringan', loc: 'Gedung Teknologi Lt. 3', desc: 'Praktikum jaringan komputer, routing dan switching, serta keamanan jaringan dengan perangkat Cisco dan MikroTik.', cap: 30, cat: 'Laboratorium', mgr: 'Laboran', fas: ['30 PC', 'Router dan Switch Cisco', 'Rak Server', 'AC 2 Unit'], kind: 'lab', col: P.jaringan },
    { id: 'hall-sv', name: 'Hall SV', loc: 'Gedung Utama Lt. 1', desc: 'Hall besar untuk seminar, wisuda tingkat departemen, dan kegiatan himpunan mahasiswa DTEDI.', cap: 300, cat: 'Hall dan Aula', mgr: 'Staf Sarpras', fas: ['Panggung', 'Sound System', 'Layar Lebar', 'AC Sentral'], kind: 'hall', col: P.hall },
    { id: 'ruang-kuliah-301', name: 'Ruang Kuliah 3.01', loc: 'Gedung Kuliah Lt. 3', desc: 'Ruang perkuliahan reguler dengan tata letak meja baris untuk kelas teori dan ujian tertulis.', cap: 60, cat: 'Ruang Kuliah', mgr: 'Staf Akademik', fas: ['Proyektor', 'Papan Tulis', 'AC 2 Unit', 'WiFi Cepat'], kind: 'kelas', col: P.kelas },
    { id: 'ruang-kuliah-205', name: 'Ruang Kuliah 2.05', loc: 'Gedung Kuliah Lt. 2', desc: 'Ruang kuliah ukuran sedang untuk kelas kecil, tutorial, dan kuliah tamu.', cap: 45, cat: 'Ruang Kuliah', mgr: 'Staf Akademik', fas: ['Proyektor', 'Papan Tulis', 'AC 1 Unit'], kind: 'kelas', col: P.kelas2 },
    { id: 'ruang-rapat-dept', name: 'Ruang Rapat Departemen', loc: 'Gedung Utama Lt. 2', desc: 'Ruang rapat untuk pimpinan departemen, koordinasi program studi, dan rapat dengan mitra industri.', cap: 20, cat: 'Ruang Rapat', mgr: 'Admin Departemen', fas: ['Video Conference', 'TV 55 Inci', 'AC 2 Unit'], kind: 'rapat', col: P.rapat },
    { id: 'studio-multimedia', name: 'Studio Multimedia', loc: 'Gedung Teknologi Lt. 1', desc: 'Studio produksi video, podcast, dan fotografi untuk kebutuhan konten akademik dan himpunan.', cap: 15, cat: 'Studio', mgr: 'Laboran', fas: ['Kamera Mirrorless', 'Lighting Set', 'Green Screen', 'Mic Podcast'], kind: 'studio', col: P.studio },
    { id: 'lab-elektronika', name: 'Laboratorium Elektronika Dasar', loc: 'Gedung Teknologi Lt. 1', desc: 'Praktikum rangkaian listrik dan elektronika dasar dengan meja kerja lengkap dan alat ukur.', cap: 28, cat: 'Laboratorium', mgr: 'Laboran', fas: ['Osiloskop', 'Power Supply', 'Function Generator', 'Breadboard Kit'], kind: 'lab', col: P.elektro },
    { id: 'ruang-seminar', name: 'Ruang Seminar', loc: 'Gedung Utama Lt. 2', desc: 'Ruang seminar proposal, kolokium, dan pelatihan dengan panggung kecil dan kursi tatap muka.', cap: 80, cat: 'Hall dan Aula', mgr: 'Staf Sarpras', fas: ['Podium', 'Sound System', 'Proyektor', 'AC Sentral'], kind: 'hall', col: P.seminar },
    { id: 'ruang-himpunan', name: 'Ruang Himpunan', loc: 'Gedung Mahasiswa Lt. 1', desc: 'Ruang kumpul dan rapat internal himpunan mahasiswa DTEDI untuk persiapan kegiatan.', cap: 25, cat: 'Ruang Rapat', mgr: 'Pengurus Himpunan', fas: ['Meja Panjang', 'TV 43 Inci', 'Kipas Angin', 'WiFi Cepat'], kind: 'rapat', col: P.himp }
];

export const CATS = [...new Set(FACS.map(f => f.cat))];
export const FAC = id => FACS.find(f => f.id === id);