import { $, esc, short } from './utils.js';
import { I } from './icons.js';
import { FAC } from './facs-data.js';
import { img, slotLabel } from './detail.js';

export function bkHTML(b, i, S, TODAY, SLOTS) {
    const f = FAC(b.fid), done = b.date < TODAY;
    return `<article class="panel bk${S.flash === b.id ? ' flash' : ''}" style="--i:${i}" data-bk="${b.id}">
    <div class="bk-img"><img src="${img(f, 'banner')}" alt="${esc(f.name)}"></div>
    <h3>${esc(f.name)}${done ? '<span class="done-tag">Selesai</span>' : ''}</h3>
    <p class="loc">${I.pin}<span>${esc(f.loc)}</span></p><p class="desc">${esc(f.desc)}</p>
    <div class="bk-a">
      <div class="pill">${I.calF}<span>${short(b.date)}</span>${I.calO}</div>
      <div class="pill c">${slotLabel(b.slot, SLOTS)}</div>
      <button class="btn-ok" data-act="edit" data-id="${b.id}" ${done ? 'disabled title="Sesi sudah berlalu"' : ''}>Edit Booking</button>
      <button class="trash" data-act="del" data-id="${b.id}" aria-label="Batalkan booking ${esc(f.name)}">${I.trash}</button>
    </div></article>`;
}

export function renderBookings(S, TODAY, SLOTS) {
    const list = [...S.bookings].sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot));
    $('#view').innerHTML = `<section class="view">
    <div><button class="back" data-act="back">${I.left}<span>Kembali</span></button></div>
    <div class="panel head"><h2>Booking Saya</h2></div>
    ${list.length ? list.map((b, i) => bkHTML(b, i, S, TODAY, SLOTS)).join('') : `<div class="panel"><div class="empty"><b>Belum ada booking</b><p>Pilih fasilitas di Beranda, lalu ambil sesi yang masih tersedia. Booking kamu akan muncul di sini.</p><button class="btn-f" data-act="nav" data-to="home">Pilih Fasilitas</button></div></div>`}
  </section>`;
    S.flash = null;
}