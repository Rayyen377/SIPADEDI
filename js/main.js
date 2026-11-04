import { $, p2, esc, sleep } from './utils.js';
import { I, heroSVG } from './icons.js';
import { FACS, CATS } from './facs-data.js';
import { renderDetail, refreshDate, calHTML, img } from './detail.js'; // <-- Pastikan 'img' ada di sini
import { renderBookings } from './bookings.js';

const HERO = heroSVG();
const PAGE_SIZE = 4;
const KEY = 'sipadedi.booking.v1';
const SLOTS = [['06:00', '09:00'], ['10:00', '12:00'], ['13:00', '15:00'], ['16:00', '18:00']];
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const isoOf = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return isoOf(d) };
const TODAY = isoOf(new Date());

function isPast(date, i) {
    if (date < TODAY) return true; if (date > TODAY) return false;
    const n = new Date(), [h, m] = SLOTS[i][0].split(':').map(Number);
    return n.getHours() * 60 + n.getMinutes() >= h * 60 + m;
}
const MIN = SLOTS.every((_, i) => isPast(TODAY, i)) ? addDays(TODAY, 1) : TODAY;
function h32(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
const takenByOthers = (fid, date, i) => h32(fid + '|' + date + '|' + i) % 100 < 30;
const uid = () => 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const seed = () => [{ id: uid(), fid: 'lab-komputer', date: addDays(MIN, 3), slot: 2 }];
function load() { try { const r = localStorage.getItem(KEY); if (r) { const o = JSON.parse(r); if (o && Array.isArray(o.b)) return o.b } } catch (e) { } return null }

const S = { view: 'home', page: 1, q: '', cat: 'all', cap: 'all', fid: null, date: MIN, editId: null, backTo: 'home', menu: false, cal: null, flash: null, bookings: load() || seed(), MIN };
function save() { try { localStorage.setItem(KEY, JSON.stringify({ b: S.bookings })) } catch (e) { } }
save();
const findB = id => S.bookings.find(b => b.id === id);

function slotState(fid, date, i) {
    const mine = S.bookings.find(b => b.fid === fid && b.date === date && b.slot === i);
    if (mine) return { k: 'mine', b: mine };
    if (isPast(date, i)) return { k: 'past' };
    if (takenByOthers(fid, date, i)) return { k: 'booked' };
    const clash = S.bookings.find(b => b.date === date && b.slot === i && b.fid !== fid);
    if (clash) return { k: 'clash', b: clash };
    return { k: 'free' };
}

function updateNav() {
    const n = S.bookings.length, cur = S.view === 'bookings' ? 'bookings' : 'home';
    $('#nav').innerHTML = `<button class="nv" data-act="nav" data-to="home" ${cur === 'home' ? 'aria-current="page"' : ''}>${cur === 'home' ? I.homeF : I.home}<span>Beranda</span></button>
  <button class="nv" data-act="nav" data-to="bookings" ${cur === 'bookings' ? 'aria-current="page"' : ''}>${cur === 'bookings' ? I.markF : I.mark}<span>Booking Saya</span>${n ? `<span class="badge">${n}</span>` : ''}</button>`;
}

function capOk(c, k) { return k === 'all' || (k === 'sm' && c <= 30) || (k === 'md' && c > 30 && c <= 60) || (k === 'lg' && c > 60) }
function filtered() {
    const q = S.q.trim().toLowerCase();
    return FACS.filter(f => (S.cat === 'all' || f.cat === S.cat) && capOk(f.cap, S.cap) && (!q || (f.name + ' ' + f.loc + ' ' + f.desc + ' ' + f.cat).toLowerCase().includes(q)));
}

function cardHTML(f, i) {
    return `<article class="card" style="--i:${i}" data-act="open" data-id="${f.id}" tabindex="0" role="button" aria-label="Pilih sesi ${esc(f.name)}">
    <div class="card-img"><img src="${img(f, 'card')}" alt=""></div>
    <div class="card-b"><h3>${esc(f.name)}</h3><p class="loc">${I.pin}<span>${esc(f.loc)}</span></p><p class="desc">${esc(f.desc)}</p></div>
    <div class="card-f"><span class="cap">${I.people}Kapasitas ${f.cap} Orang</span><span class="go">Pilih Sesi ${I.right}</span></div></article>`;
}

function renderList(dir) {
    const list = filtered(), pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    S.page = Math.min(Math.max(1, S.page), pages);
    const from = (S.page - 1) * PAGE_SIZE, slice = list.slice(from, from + PAGE_SIZE);
    const g = $('#grid');
    g.style.setProperty('--dx', dir > 0 ? '34px' : dir < 0 ? '-34px' : '0px');
    g.innerHTML = slice.length ? slice.map(cardHTML).join('') : `<div class="empty"><b>Fasilitas tidak ditemukan</b><p>Tidak ada fasilitas yang cocok dengan filter ini.</p></div>`;
    $('#count').textContent = `${list.length} Fasilitas`;
}

function renderHome() {
    $('#view').innerHTML = `<section class="view">
    <header class="hero"><div class="hero-bg" style="background-image:url(${HERO})"></div>
      <div class="hero-top"><span class="tag">Departemen Teknik Elektro &amp; Informatika</span><span class="univ">Sekolah Vokasi UGM</span></div>
      <div class="hero-main"><h1 class="brand">SIPADEDI</h1><p class="sub">Sistem Informasi Peminjaman Fasilitas DTEDI</p></div>
    </header>
    <div class="panel filters">
      <label class="fld fld-q"><input id="q" type="text" placeholder="Cari fasilitas..." value="${esc(S.q)}">${I.search}</label>
      <label class="fld"><select id="cat"><option value="all">Semua Kategori</option>${CATS.map(c => `<option value="${esc(c)}" ${S.cat === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>${I.down}</label>
    </div>
    <div class="panel" id="listp"><div class="list-h"><h2>Daftar Fasilitas DTEDI SV UGM</h2><span class="count" id="count"></span></div><div class="grid" id="grid"></div><div class="pager" id="pager"></div></div>
  </section>`;
    renderList(0);
}

function render() {
    if (S.view === 'home') renderHome();
    else if (S.view === 'detail') renderDetail(S, SLOTS, slotState, findB, BULAN, TODAY);
    else renderBookings(S, TODAY, SLOTS);
    updateNav();
    window.scrollTo(0, 0);
}
function go(v) { S.view = v; S.cal = null; render(); }

// Global Event Listeners
document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;

    if (act === 'nav') go(el.dataset.to);
    if (act === 'open') { S.fid = el.dataset.id; S.backTo = 'home'; go('detail'); }
    if (act === 'back') go(S.backTo);
    if (act === 'cal') {
        S.cal = S.cal ? null : { y: parse(S.date).getFullYear(), m: parse(S.date).getMonth() };
        const h = $('#calHost'); if (h) h.innerHTML = S.cal ? calHTML(S, TODAY, BULAN) : '';
    }
    if (act === 'day') {
        S.date = addDays(S.date, Number(el.dataset.n));
        refreshDate(S, SLOTS, slotState, true);
    }
    if (act === 'calday') {
        S.date = el.dataset.d; S.cal = null;
        refreshDate(S, SLOTS, slotState, true);
    }
    if (act === 'slot') {
        const i = Number(el.dataset.i);
        if (slotState(S.fid, S.date, i).k === 'free') {
            if (S.editId) {
                S.bookings = S.bookings.filter(b => b.id !== S.editId);
                S.editId = null;
            }
            const newId = uid();
            S.bookings.push({ id: newId, fid: S.fid, date: S.date, slot: i });
            save();
            S.flash = newId;
            go('bookings');
        }
    }
    if (act === 'del') {
        S.bookings = S.bookings.filter(b => b.id !== el.dataset.id);
        save();
        render();
    }
    if (act === 'edit') {
        const b = findB(el.dataset.id);
        if (b) {
            S.editId = b.id; S.fid = b.fid; S.date = b.date; S.backTo = 'bookings';
            go('detail');
        }
    }
});

document.addEventListener('input', e => {
    if (e.target.id === 'q') { S.q = e.target.value; S.page = 1; renderList(0); }
});

document.addEventListener('change', e => {
    if (e.target.id === 'cat') { S.cat = e.target.value; S.page = 1; renderList(0); }
    if (e.target.id === 'cap') { S.cap = e.target.value; S.page = 1; renderList(0); }
});

document.addEventListener('DOMContentLoaded', () => render());