const fs = require('fs');
const path = require('path');

const dir = path.join('public', 'frames', 'packs');
fs.mkdirSync(dir, { recursive: true });

function donut(color, outer = 118, inner = 78, second = null) {
  const mid = ((outer + inner) / 2).toFixed(1);
  const secondRing = second
    ? `<circle cx="128" cy="128" r="${mid}" fill="none" stroke="${second}" stroke-width="8" opacity="0.9"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 256 256">
  <defs><mask id="m"><rect width="256" height="256" fill="white"/><circle cx="128" cy="128" r="${inner}" fill="black"/></mask></defs>
  <circle cx="128" cy="128" r="${outer}" fill="${color}" mask="url(#m)"/>
  ${secondRing}
</svg>`;
}

const files = {
  'br-verde.svg': donut('#009C3B', 118, 78, '#FFDF00'),
  'br-azul.svg': donut('#01BEF6'),
  'br-coral.svg': donut('#FF5C39'),
  'br-ink.svg': donut('#06141F'),
  'br-rosa.svg': donut('#E91E8C'),
  'br-ouro.svg': donut('#D4A017'),
  'br-duplo.svg': donut('#01BEF6', 120, 70, '#06141F'),
  'br-fino.svg': donut('#01BEF6', 112, 92),
  'id-merah.svg': donut('#CE1126', 118, 78, '#FFFFFF'),
  'id-hijau.svg': donut('#1B7A4E'),
  'id-biru.svg': donut('#01BEF6'),
  'id-emas.svg': donut('#D4A017'),
  'id-ungu.svg': donut('#6D28D9'),
  'id-hitam.svg': donut('#06141F'),
  'id-tebal.svg': donut('#CE1126', 122, 68),
  'id-tipis.svg': donut('#01BEF6', 112, 92),
  'ph-asul.svg': donut('#0038A8'),
  'ph-pula.svg': donut('#CE1126'),
  'ph-dilaw.svg': donut('#FCD116'),
  'ph-berde.svg': donut('#1B7A4E'),
  'ph-rosas.svg': donut('#E91E8C'),
  'ph-itim.svg': donut('#06141F'),
  'ph-doble.svg': donut('#0038A8', 120, 70, '#FCD116'),
  'ph-manipis.svg': donut('#01BEF6', 112, 92),
  'mx-verde.svg': donut('#006847'),
  'mx-rojo.svg': donut('#CE1126'),
  'mx-oro.svg': donut('#D4A017'),
  'mx-azul.svg': donut('#01BEF6'),
  'mx-rosa.svg': donut('#E91E8C'),
  'mx-negro.svg': donut('#06141F'),
  'mx-doble.svg': donut('#006847', 120, 70, '#CE1126'),
  'mx-fino.svg': donut('#01BEF6', 112, 92),
  'ng-green.svg': donut('#008751'),
  'ng-white.svg': donut('#F7F4EE', 118, 78),
  'ng-gold.svg': donut('#D4A017'),
  'ng-blue.svg': donut('#01BEF6'),
  'ng-coral.svg': donut('#FF5C39'),
  'ng-ink.svg': donut('#06141F'),
  'ng-bold.svg': donut('#008751', 122, 68),
  'ng-thin.svg': donut('#01BEF6', 112, 92),
};

for (const [name, svg] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name), svg);
}
console.log('wrote', Object.keys(files).length, 'svgs');
