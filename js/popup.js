(function () {
  let terakhirFokus = null;

  function tutup(scrim) {
    scrim.classList.add('out');
    setTimeout(function () {
      scrim.remove();
      document.body.style.overflow = '';
      if (terakhirFokus) terakhirFokus.focus();
    }, 180);
  }

  function formatTanggal(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  function bukaKonfirmasi(d) {
    const scrim = document.createElement('div');
    scrim.className = 'scrim';
    scrim.innerHTML =
      '<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dt">' +
        '<button type="button" class="dlg-x" aria-label="Tutup">' +
          '<svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
        '<div class="dlg-ic"><svg class="ic o" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.6 9.2a3.5 3.5 0 1 1 5.6 2.8c-1.3.9-2.2 1.6-2.2 3.2"/><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none"/></svg></div>' +
        '<h2 id="dt">Apakah kamu yakin ingin memilih sesi ini?</h2>' +
        '<p class="dlg-l">Pilihan Sesi Anda:</p>' +
        '<p class="dlg-v"></p>' +
        '<form class="dlg-b" method="POST" action="detailRuangan.php">' +
          '<input type="hidden" name="aksi" value="booking">' +
          '<input type="hidden" name="id">' +
          '<input type="hidden" name="tanggal">' +
          '<input type="hidden" name="slot">' +
          '<button type="button" class="btn-o" data-batal>Batal</button>' +
          '<button type="submit" class="btn-f">Yakin</button>' +
        '</form>' +
      '</div>';

    // isi nilai lewat textContent / value (aman dari XSS)
    scrim.querySelector('.dlg-v').textContent = formatTanggal(d.tanggal) + ' - ' + d.slot;
    const f = scrim.querySelector('form');
    f.elements.id.value = d.id;
    f.elements.tanggal.value = d.tanggal;
    f.elements.slot.value = d.slot;

    terakhirFokus = document.activeElement;
    document.body.style.overflow = 'hidden';
    document.body.appendChild(scrim);
    f.querySelector('.btn-f').focus();

    scrim.addEventListener('click', function (e) {
      if (e.target === scrim || e.target.closest('.dlg-x') || e.target.closest('[data-batal]')) {
        tutup(scrim);
      }
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', esc);
        if (scrim.isConnected) tutup(scrim);
      }
    });
  }

  // Klik slot yang tersedia -> popup
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a.slot.free[data-slot]');
    if (!a) return;
    e.preventDefault();
    bukaKonfirmasi({ id: a.dataset.id, tanggal: a.dataset.tanggal, slot: a.dataset.slot });
  });
})();