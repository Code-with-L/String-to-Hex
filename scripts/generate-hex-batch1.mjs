import fs from 'fs';
import path from 'path';

const HEX = 'C:\\Users\\leon2\\Documents\\Open Code\\hex';
const refPath = 'js/data/reference.js';
let src = fs.readFileSync(refPath, 'utf8');

// Collect watt-to-amp specific pages like 800-watt-to-amp.html
const files = fs.readdirSync(HEX).filter(f => f.endsWith('.html'));
const wattPages = [];
for (const f of files) {
  const m = f.match(/^(\d+)-watt(?:s)?-to-amp\.html$/i);
  if (m) wattPages.push({ watts: parseInt(m[1],10), slug: f.replace(/\.html$/,'') });
}
wattPages.sort((a,b)=>a.watts-b.watts);

function wattArticle(w) {
  const dc12 = (w/12);
  const ac120_1 = (w/120);
  const ac120_08 = (w/(0.8*120));
  const ac230_1 = (w/230);
  const ac230_08 = (w/(0.8*230));
  const fmt = (x) => {
    const s = (Math.round(x*1000)/1000).toString();
    return s.includes('.') ? s.replace(/\.?0+$/,'') : s;
  };
  return `  '${w}-watts-to-amps': {
    title: '${w} Watts to Amps',
    kicker: 'Electrical conversion',
    summary: 'How to calculate current in amperes for a ${w}-watt load at common DC and AC voltages.',
    tool: 'current-power',
    blocks: [
      { k: 'definition', t: 'Current (amps) depends on power (watts), voltage, and for AC circuits the power factor. Use I = P / V for DC and I = P / (PF × V) for AC.' },
      { k: 'h3', t: 'DC: 12 V supply' },
      { k: 'formula', eq: 'I = ${w} W / 12 V = ${fmt(dc12)} A' },
      { k: 'h3', t: 'AC: 120 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = ${w} W / (1 × 120 V) = ${fmt(ac120_1)} A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = ${w} W / (0.8 × 120 V) = ${fmt(ac120_08)} A' },
      { k: 'h3', t: 'AC: 230 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = ${w} W / (1 × 230 V) = ${fmt(ac230_1)} A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = ${w} W / (0.8 × 230 V) = ${fmt(ac230_08)} A' },
      { k: 'callout', icon: 'info', t: 'Results vary with actual supply voltage and load power factor. Use the Current / power calculator for custom values.' },
    ],
  }`;
}

// cm-to-feet main page already added as 'cm-to-feet'. add variant slugs if useful? hex has cm-to-feet.html which we covered.
// Also add feet-to-cm
const extras = [];
extras.push(`  'feet-to-cm': {
    title: 'Feet to Centimeters',
    kicker: 'Length conversion',
    summary: 'Convert feet (ft) to centimeters (cm) using the exact relationship 1 ft = 30.48 cm.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'One foot equals exactly 30.48 centimeters (0.3048 meters). To convert feet to centimeters, multiply by 30.48.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'd(cm) = d(ft) × 30.48' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '2 ft = 2 × 30.48 cm = 60.96 cm' },
      { k: 'formula', eq: '5 ft = 5 × 30.48 cm = 152.4 cm' },
      { k: 'h3', t: 'Quick reference' },
      { k: 'table', head: ['Feet (ft)', 'Centimeters (cm)'], rows: [
        ['1 ft','30.48 cm'],['2 ft','60.96 cm'],['3 ft','91.44 cm'],['5 ft','152.4 cm'],['6 ft','182.88 cm'],['10 ft','304.8 cm']
      ] },
      { k: 'callout', icon: 'info', t: 'Multiply feet by 30.48 to get centimeters. Divide centimeters by 30.48 to get feet.' },
    ],
  }`);

const toAdd = [];
for (const p of wattPages) {
  if (src.includes(`'${p.watts}-watts-to-amps'`)) continue; // 800 already added
  toAdd.push(wattArticle(p.watts));
}
for (const e of extras) {
  const slug = e.match(/'([^']+)':/)[1];
  if (!src.includes(`'${slug}'`)) toAdd.push(e);
}

if (toAdd.length === 0) {
  console.log('nothing to add');
  process.exit(0);
}

const slugIdx = src.indexOf('\nexport const ARTICLE_SLUGS = Object.keys(ARTICLES);');
const articlesEnd = src.lastIndexOf('\n};', slugIdx);
let insert = toAdd.join(',\n') + ',\n';
src = src.slice(0, articlesEnd) + ',\n' + insert + src.slice(articlesEnd);
fs.writeFileSync(refPath, src);
console.log('added', toAdd.length, 'articles:', wattPages.map(p=>p.watts).join(','));