const fs = require('fs');
// 1024 birimlik tuvalde merkezde duran "daire içinde EW" sembolü.
// Harfler yazı tipiyle değil geometrik şekillerle çizilir; her boyutta keskin kalır.
const symbol = ({ ring, letters, scale }) => `
  <g transform="translate(512 512) scale(${scale}) translate(-512 -512)">
    <circle cx="512" cy="512" r="330" fill="none" stroke="${ring}" stroke-width="46"/>
    <g fill="${letters}">
      <!-- E -->
      <rect x="284" y="362" width="52" height="300"/>
      <rect x="284" y="362" width="172" height="50"/>
      <rect x="284" y="487" width="152" height="48"/>
      <rect x="284" y="612" width="172" height="50"/>
    </g>
    <!-- W: kalın kırık çizgi; üst ve alt uçlar düz olsun diye harf kutusuna kırpılır -->
    <clipPath id="wclip"><rect x="470" y="362" width="300" height="300"/></clipPath>
    <polyline clip-path="url(#wclip)" points="484,300 552,680 618,452 684,680 752,300"
      fill="none" stroke="${letters}" stroke-width="52" stroke-linejoin="miter" stroke-miterlimit="10"/>
  </g>`;

const defs = `
  <defs>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8B5CFF"/><stop offset="1" stop-color="#FF5CAA"/>
    </linearGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B0B26"/><stop offset="1" stop-color="#1B0E36"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.45" r="0.6">
      <stop offset="0" stop-color="#8B5CFF" stop-opacity="0.35"/><stop offset="1" stop-color="#8B5CFF" stop-opacity="0"/>
    </radialGradient>
  </defs>`;

const background = `<rect width="1024" height="1024" fill="url(#bg)"/><rect width="1024" height="1024" fill="url(#glow)"/>`;
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${defs}${body}</svg>`;

const variants = {
  // Genel simge: tam dolu kare (iOS ve eski Android başlatıcıları kendisi yuvarlar).
  icon: svg(background + symbol({ ring: 'url(#ring)', letters: '#FFFFFF', scale: 1 })),
  // Uyarlanabilir simge ön katmanı: maske güvenli alanına (merkezdeki ~%61) sığacak kadar küçük.
  foreground: svg(symbol({ ring: 'url(#ring)', letters: '#FFFFFF', scale: 0.82 })),
  background: svg(background),
  // Android 13+ temalı simgeler: sistem tek renge boyar, sadece şekil önemlidir.
  monochrome: svg(symbol({ ring: '#FFFFFF', letters: '#FFFFFF', scale: 0.82 })),
  // Açılış ekranı logosu: şeffaf zemin, tam boy sembol (zemin rengini splash ayarı verir).
  splash: svg(symbol({ ring: 'url(#ring)', letters: '#FFFFFF', scale: 1 })),
};

for (const [name, content] of Object.entries(variants)) {
  fs.writeFileSync(`${name}.svg`, content);
  fs.writeFileSync(`${name}.html`, `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}svg{display:block}</style></head><body>${content}</body></html>`);
}
console.log('svg/html hazır:', Object.keys(variants).join(', '));
