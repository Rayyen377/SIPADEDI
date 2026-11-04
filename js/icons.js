import { svgUri } from './utils.js';

export function sv(cls, body) { 
    return `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`; 
}

let dots = ''; 
for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
        dots += `<circle cx="${6.5 + c * 2.75}" cy="${11 + r * 3.3}" r=".85"/>`;
    }
}

export const I = {
    home: sv('o', '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h4.5v-5.5h4v5.5h4.5V10"/>'),
    homeF: sv('f', '<path d="M12 3.2 1.8 11.7a.8.8 0 0 0 .5 1.4H4.5V20a1 1 0 0 0 1 1H10v-6h4v6h4.5a1 1 0 0 0 1-1v-6.9h2.2a.8.8 0 0 0 .5-1.4z"/>'),
    mark: sv('o', '<path d="M6.5 3.5h11v17L12 16.6l-5.5 3.9z"/>'),
    markF: sv('f', '<path d="M6 3h12a.5.5 0 0 1 .5.5v17.6a.4.4 0 0 1-.65.3L12 17l-5.85 4.4a.4.4 0 0 1-.65-.3V3.5A.5.5 0 0 1 6 3z"/>'),
    down: sv('o', '<path d="M5 9l7 7 7-7"/>'),
    right: sv('o', '<path d="M9 5l7 7-7 7"/>'),
    left: sv('o', '<path d="M15 5l-7 7 7 7"/>'),
    search: sv('o', '<circle cx="10.5" cy="10.5" r="7"/><path d="M16 16l5 5"/>'),
    pin: sv('o', '<path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'),
    people: sv('f', '<circle cx="9" cy="8" r="3.7"/><path d="M2.3 19.8c0-3.7 3-6 6.7-6s6.7 2.3 6.7 6z"/><circle cx="17.2" cy="8.8" r="2.9"/><path d="M16.9 13.7c3 .1 5.4 2 5.4 5.4v.7h-4.6c0-2.2-.3-4.2-.8-6.1z"/>'),
    person: sv('f', '<circle cx="12" cy="7.5" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z"/>'),
    calF: sv('f', `<rect x="2.5" y="4" width="19" height="17.5" rx="3.5"/><rect x="6.5" y="1.8" width="2.2" height="4.6" rx="1.1"/><rect x="15.3" y="1.8" width="2.2" height="4.6" rx="1.1"/><g fill="var(--panel)">${dots}</g>`),
    calO: sv('o', '<rect x="3" y="4.5" width="18" height="16.5" rx="3.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>'),
    check: sv('o', '<path d="M5.5 12.5l4.2 4.2L18.5 8"/>'),
    q: sv('o', '<path d="M8.6 9.2a3.5 3.5 0 1 1 5.6 2.8c-1.3.9-2.2 1.6-2.2 3.2"/><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none"/>'),
    trash: sv('f', '<path d="M9.2 2.5h5.6l.8 1.8H20a.9.9 0 0 1 0 1.8H4a.9.9 0 0 1 0-1.8h4.4z"/><path fill-rule="evenodd" d="M5.5 8h13l-.9 12.2a1.9 1.9 0 0 1-1.9 1.8H8.3a1.9 1.9 0 0 1-1.9-1.8zM9.4 10.5v8.2h1.5v-8.2zm3.7 0v8.2h1.5v-8.2z"/>'),
    x: sv('o', '<path d="M6 6l12 12M18 6L6 18"/>'),
    reset: sv('o', '<path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4.5h4.5"/>')
};

export function heroSVG() {
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 330" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb0d8"/><stop offset="1" stop-color="#dfe6ef"/></linearGradient></defs><rect width="1200" height="330" fill="url(#s)"/><rect y="62" width="1200" height="268" fill="#cdc6b8"/><rect y="46" width="1200" height="20" fill="#e8e2d6"/><rect y="36" width="1200" height="10" fill="#b9b1a1"/>`;
    
    for (let i = 0; i < 16; i++) { 
        const x = 20 + i * 76; 
        s += `<rect x="${x}" y="82" width="34" height="248" fill="#e9e4d9"/><rect x="${x - 4}" y="82" width="42" height="8" fill="#d6cfc0"/><path d="M${x + 42} 280v-120a13 13 0 0 1 26 0v120z" fill="#3a4258"/>`;
    }
    
    for (let j = 0; j < 60; j++) {
        s += `<rect x="${j * 20}" y="214" width="20" height="10" fill="${j % 2 ? '#fff' : '#c9302c'}" opacity=".92"/>`;
    }

    return svgUri(s + '<rect y="296" width="1200" height="34" fill="#b3ab9c"/></svg>');
}