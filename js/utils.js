export const $ = (s, r = document) => r.querySelector(s);
export const p2 = n => String(n).padStart(2, '0');
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const sleep = ms => new Promise(r => setTimeout(r, RM ? 0 : ms));
export const svgUri = s => 'data:image/svg+xml;utf8,' + encodeURIComponent(s).replace(/[()']/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());

export const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) };
export const short = s => { const [y, m, d] = s.split('-'); return `${d}/${m}/${y}` };
export const long = s => { const d = parse(s); return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}` };