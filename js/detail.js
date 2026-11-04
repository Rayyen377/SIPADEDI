import { $, p2, esc, short, long, svgUri } from './utils.js';
import { I } from './icons.js';
import { FAC } from './facs-data.js';

// Generator Sketsa / Ilustrasi SVG Fasilitas
const WOOD = '#c79a62', WOODH = '#e0bd8a';
function mon(x, y, w, h, col) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#20263a"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 11}" rx="2" fill="${col}"/><rect x="${x + 8}" y="${y + 9}" width="${(w - 16) * .55}" height="3" rx="1.5" fill="#fff" opacity=".75"/><rect x="${x + 8}" y="${y + 16}" width="${(w - 16) * .4}" height="3" rx="1.5" fill="#fff" opacity=".45"/><rect x="${x + w / 2 - 4}" y="${y + h}" width="8" height="9" fill="#20263a"/><rect x="${x + w / 2 - 15}" y="${y + h + 8}" width="30" height="4" rx="2" fill="#20263a"/>` }
function box(x, y, w, h, col, r) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r == null ? Math.min(w, h) / 3 : r}" fill="${col}"/>` }

function scene(kind, c) {
    if (!c) c = { w1: '#dfe6ee', w2: '#c3ceda', f1: '#9aa2ae', f2: '#707988', sc: '#3d7bd9' };
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 330" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.w1}"/><stop offset="1" stop-color="${c.w2}"/></linearGradient><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.f1}"/><stop offset="1" stop-color="${c.f2}"/></linearGradient></defs><rect width="800" height="330" fill="url(#w)"/><rect y="212" width="800" height="118" fill="url(#f)"/><rect y="208" width="800" height="5" fill="#000" opacity=".12"/>`;
    if (kind === 'lab') {
        s += box(40, 26, 230, 128, '#bcd8f2', 6) + box(530, 26, 230, 128, '#bcd8f2', 6);
        for (let i = 0; i < 9; i++) s += box(40, 32 + i * 14, 230, 5, '#fff', 0).replace('fill="#fff"', 'fill="#fff" opacity=".55"') + box(530, 32 + i * 14, 230, 5, '#fff', 0).replace('fill="#fff"', 'fill="#fff" opacity=".55"');
        for (let i = 0; i < 5; i++) s += mon(75 + i * 150, 118, 66, 40, c.sc);
        s += box(20, 168, 760, 9, WOOD, 3);
        for (let i = 0; i < 5; i++) s += mon(52 + i * 150, 170, 96, 56, c.sc);
        s += box(10, 236, 780, 16, WOOD, 4) + box(10, 236, 780, 4, WOODH, 0);
        for (let i = 0; i < 5; i++) s += box(80 + i * 150, 268, 70, 52, '#202638') + box(88 + i * 150, 258, 54, 14, '#2b3350');
    } else if (kind === 'kelas') {
        s += box(240, 30, 320, 112, '#fbfbfd', 6).replace('/>', ' stroke="#8f98ab" stroke-width="4"/>') + box(260, 50, 150, 5, '#5b6cc9', 2) + box(260, 66, 220, 5, '#8d96b8', 2) + box(260, 82, 180, 5, '#8d96b8', 2) + box(260, 98, 200, 5, '#8d96b8', 2) + box(250, 142, 300, 8, '#9aa3b5', 3);
        s += box(30, 36, 120, 100, '#c9e0f4', 6) + box(650, 36, 120, 100, '#c9e0f4', 6);
        for (let r = 0; r < 3; r++) {
            const y = [190, 226, 270][r], h = [10, 13, 16][r], n = [9, 8, 7][r], g = 800 / n, w = g * .66, ch = [14, 18, 24][r];
            for (let i = 0; i < n; i++) { const x = g * i + (g - w) / 2; s += box(x, y, w, h, WOOD, 2) + box(x + w * .18, y + h + 2, w * .64, ch, '#2b3a66') }
        }
    } else if (kind === 'rapat') {
        s += box(250, 28, 300, 98, '#1c2236', 6) + box(260, 38, 280, 78, c.sc, 3) + box(276, 52, 120, 6, '#fff', 3).replace('fill="#fff"', 'fill="#fff" opacity=".8"') + box(276, 68, 180, 5, '#fff', 2).replace('fill="#fff"', 'fill="#fff" opacity=".5"') + box(276, 82, 150, 5, '#fff', 2).replace('fill="#fff"', 'fill="#fff" opacity=".5"');
        for (const x of [170, 400, 630]) s += `<rect x="${x - 1}" y="0" width="2" height="44" fill="#555"/><ellipse cx="${x}" cy="50" rx="30" ry="12" fill="${c.lamp}"/>`;
        for (let i = 0; i < 5; i++) s += box(150 + i * 100, 142, 56, 30, '#2b3350');
        s += box(110, 166, 580, 60, WOOD, 30) + box(130, 170, 540, 10, WOODH, 5);
        for (let i = 0; i < 5; i++) s += box(150 + i * 100, 232, 56, 36, '#2b3350');
    } else if (kind === 'hall') {
        s += box(0, 0, 140, 214, c.dr, 0) + box(660, 0, 140, 214, c.dr, 0);
        for (let i = 0; i < 6; i++) s += box(i * 24 + 4, 0, 6, 214, '#fff', 0).replace('fill="#fff"', 'fill="#fff" opacity=".12"') + box(664 + i * 24, 0, 6, 214, '#fff', 0).replace('fill="#fff"', 'fill="#fff" opacity=".12"');
        s += box(250, 24, 300, 92, c.ban, 4) + box(278, 44, 160, 8, '#fff', 3).replace('fill="#fff"', 'fill="#fff" opacity=".85"') + box(278, 62, 230, 5, '#fff', 2).replace('fill="#fff"', 'fill="#fff" opacity=".5"') + box(278, 76, 190, 5, '#fff', 2).replace('fill="#fff"', 'fill="#fff" opacity=".5"');
        s += box(120, 124, 560, 10, '#8a6644', 0) + box(120, 134, 560, 34, '#6a4a30', 0) + box(372, 96, 56, 40, '#3b2a1c', 4);
        const R = [[196, 16, 22], [222, 20, 18], [252, 26, 14], [288, 32, 11]];
        for (const [y, sz, n] of R) { const g = 800 / n; for (let i = 0; i < n; i++) s += box(g * i + g * .18, y, g * .64, sz, c.ch) }
    } else { /* studio */
        s += box(240, 24, 320, 172, '#27a05a', 4) + box(240, 24, 320, 172, '#fff', 4).replace('fill="#fff"', 'fill="#fff" opacity=".08"');
        for (const [x, d] of [[70, 1], [650, -1]]) { s += `<rect x="${x + 38}" y="150" width="4" height="110" fill="#555"/>` + box(x, 56, 80, 94, '#f4f1e8', 6) + box(x + 8, 64, 64, 78, '#fff', 4) + `<ellipse cx="${x + 40 + d * 60}" cy="236" rx="90" ry="14" fill="#fff" opacity=".07"/>` }
        s += `<path d="M400 232 360 322M400 232 440 322M400 232V322" stroke="#14161f" stroke-width="4" fill="none"/>` + box(370, 196, 60, 38, '#14161f', 6) + `<circle cx="400" cy="214" r="13" fill="#2a3350"/><circle cx="396" cy="210" r="4" fill="#fff" opacity=".5"/>`;
        s += `<path d="M606 322V240L566 218" stroke="#222" stroke-width="4" fill="none"/>` + box(552, 204, 20, 28, '#222', 10);
    }
    return svgUri(s + '</svg>');
}

const imgCache = {};
export function img(f, size) {
    return imgCache[f.id] || (imgCache[f.id] = scene(f.kind, f.col));
}

export function slotLabel(i, SLOTS) {
    return `${SLOTS[i][0]}\n${SLOTS[i][1]} WIB`;
}

export function slotsHTML(S, SLOTS, slotState, pop) {
    return SLOTS.map((_, i) => {
        const st = slotState(S.fid, S.date, i);
        const cls = { free: 'free', booked: 'booked', clash: 'clash', mine: 'mine', past: 'past' }[st.k];
        const tip = { free: 'Tersedia', booked: 'Sudah dibooking pengguna lain', clash: 'Kamu sudah punya booking di jam ini', mine: 'Booking kamu', past: 'Sesi sudah lewat' }[st.k];
        return `<button class="slot ${cls}${pop === i ? ' pop' : ''}" style="--i:${i}" data-act="slot" data-i="${i}" ${st.k === 'booked' || st.k === 'past' || st.k === 'clash' ? 'aria-disabled="true"' : ''} title="${tip}" aria-label="${slotLabel(i, SLOTS)}, ${tip}">${slotLabel(i, SLOTS)}</button>`;
    }).join('');
}

export function refreshDate(S, SLOTS, slotState, anim = true, pop = -1) {
    $('#dateText').textContent = short(S.date);
    $('#prevDay').disabled = S.date <= S.MIN;
    const el = $('#slots'); 
    el.classList.toggle('still', !anim); 
    el.innerHTML = slotsHTML(S, SLOTS, slotState, pop);
}

export function calHTML(S, TODAY, BULAN) {
    const { y, m } = S.cal, lead = (new Date(y, m, 1).getDay() + 6) % 7, n = new Date(y, m + 1, 0).getDate();
    const atMin = (y * 12 + m) <= (+S.MIN.slice(0, 4) * 12 + +S.MIN.slice(5, 7) - 1);
    let c = ''; for (let i = 0; i < lead; i++) c += '<span></span>';
    for (let d = 1; d <= n; d++) {
        const s = `${y}-${p2(m + 1)}-${p2(d)}`;
        const cls = ['cd', s === S.date ? 'sel' : '', s === TODAY ? 'today' : '', S.bookings.some(b => b.fid === S.fid && b.date === s) ? 'dot' : ''].join(' ');
        c += `<button type="button" class="${cls}" data-act="calday" data-d="${s}" ${s < S.MIN ? 'disabled' : ''}>${d}</button>`;
    }
    return `<div class="cal" role="dialog" aria-label="Pilih tanggal"><div class="cal-h"><button type="button" class="cal-n" data-act="calmonth" data-n="-1" ${atMin ? 'disabled' : ''} aria-label="Bulan sebelumnya">${I.left}</button><b>${BULAN[m]} ${y}</b><button type="button" class="cal-n" data-act="calmonth" data-n="1" aria-label="Bulan berikutnya">${I.right}</button></div><div class="cal-w">${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(x => `<span>${x}</span>`).join('')}</div><div class="cal-g">${c}</div></div>`;
}

export function renderDetail(S, SLOTS, slotState, findB, BULAN, TODAY) {
    const f = FAC(S.fid), b = S.editId ? findB(S.editId) : null;
    $('#view').innerHTML = `<section class="view">
    <div><button class="back" data-act="back">${I.left}<span>Kembali</span></button></div>
    ${b ? `<div class="banner"><b>Mode ubah sesi</b><span>Sesi kamu saat ini: ${long(b.date)} - ${slotLabel(b.slot, SLOTS)}. Pilih sesi baru di bawah.</span></div>` : ''}
    <div class="panel detail">
      <div class="d-img"><img src="${img(f, 'banner')}" alt="${esc(f.name)}"></div>
      <h2>${esc(f.name)}</h2><p class="loc big">${I.pin}<span>${esc(f.loc)}</span></p><p class="desc big">${esc(f.desc)}</p>
      <hr>
      <div class="rows"><div class="row"><span>${I.people}Kapasitas</span><b>${f.cap} Orang</b></div><div class="row"><span>${I.person}Pengelola</span><b>${esc(f.mgr)}</b></div></div>
      <hr>
      <h3>Fasilitas</h3>
      <div class="chips">${f.fas.map((x, i) => `<span class="cp" style="animation-delay:${i * 70}ms"><i>${I.check}</i>${esc(x)}</span>`).join('')}</div>
    </div>
    <div class="panel book">
      <h3>${b ? 'Ubah Sesi Booking' : 'Ajukan Booking'}</h3>
      <div class="datebar">
        <button class="arr" id="prevDay" data-act="day" data-n="-1" aria-label="Hari sebelumnya">${I.left}</button>
        <div class="datewrap"><button class="datepill" data-act="cal" aria-haspopup="dialog" aria-expanded="false" aria-label="Pilih tanggal">${I.calF}<span id="dateText"></span>${I.calO}</button><div id="calHost"></div></div>
        <button class="arr" data-act="day" data-n="1" aria-label="Hari berikutnya">${I.right}</button>
      </div>
      <div class="legend"><span><i class="lg free"></i>Available</span><span><i class="lg booked"></i>Booked</span><span><i class="lg mine"></i>Yours</span></div>
      <div class="slots" id="slots"></div>
    </div></section>`;
    refreshDate(S, SLOTS, slotState);
}