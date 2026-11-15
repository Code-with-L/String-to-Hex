import fs from 'fs';
const path = 'js/data/reference.js';
let src = fs.readFileSync(path, 'utf8');
const insert = `  '800-watts-to-amps': {
    title: '800 Watts to Amps',
    kicker: 'Electrical conversion',
    summary: 'How to find current in amperes for an 800-watt load at common DC and AC voltages.',
    tool: 'current-power',
    blocks: [
      { k: 'definition', t: 'To get amps from watts you must also know voltage (and power factor for AC). For DC, current is power divided by voltage. For AC, current is power divided by voltage times power factor.' },
      { k: 'h3', t: 'DC: 12 V supply' },
      { k: 'formula', eq: 'I = P / V', note: 'DC: amps = watts / volts.' },
      { k: 'formula', eq: 'I = 800 W / 12 V = 66.667 A' },
      { k: 'h3', t: 'AC: 120 V supply' },
      { k: 'formula', eq: 'I = P / (PF × V)', note: 'AC: amps = watts / (power factor × volts).' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 800 W / (1 × 120 V) = 6.667 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 800 W / (0.8 × 120 V) = 8.333 A' },
      { k: 'h3', t: 'AC: 230 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 800 W / (1 × 230 V) = 3.478 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 800 W / (0.8 × 230 V) = 4.348 A' },
      { k: 'callout', icon: 'info', t: 'Use the Current / power calculator for other wattages, voltages, and power factors.' },
    ],
  },
  'cm-to-feet': {
    title: 'Centimeters to Feet',
    kicker: 'Length conversion',
    summary: 'Convert centimeters (cm) to feet (ft) using the exact relationship between metric and imperial length units.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'A centimeter is 1/100 of a meter in SI. A foot is an imperial/US customary length unit equal to 12 inches, exactly 0.3048 meters (30.48 cm).' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: '1 cm = 1 / 30.48 ft ≈ 0.0328084 ft' },
      { k: 'formula', eq: 'd(ft) = d(cm) / 30.48' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '20 cm = 20 / 30.48 ft ≈ 0.656168 ft' },
      { k: 'formula', eq: '50 cm = 50 / 30.48 ft ≈ 1.64042 ft' },
      { k: 'h3', t: 'Quick reference' },
      { k: 'table', head: ['Centimeters (cm)', 'Feet (ft)'], rows: [
        ['1 cm', '0.032808 ft'], ['10 cm', '0.328084 ft'], ['20 cm', '0.656168 ft'], ['30 cm', '0.984252 ft'],
        ['50 cm', '1.640420 ft'], ['100 cm', '3.280840 ft'], ['150 cm', '4.921260 ft'], ['180 cm', '5.905512 ft'],
      ] },
      { k: 'callout', icon: 'info', t: 'Divide centimeters by 30.48 to get feet. Multiply feet by 30.48 to get centimeters.' },
    ],
  },
`;
const slugIdx = src.indexOf('\nexport const ARTICLE_SLUGS = Object.keys(ARTICLES);');
if (slugIdx === -1) throw new Error('ARTICLE_SLUGS not found');
const articlesEnd = src.lastIndexOf('\n};', slugIdx);
if (articlesEnd === -1) throw new Error('articles end not found');
// ensure previous entry has trailing comma: last non-ws before \n}; should be } or }, 
const beforeClose = src.slice(0, articlesEnd);
const trimmed = beforeClose.replace(/\s+$/,'');
let prefix = '';
if (!trimmed.endsWith(',')) prefix = ',';
src = src.slice(0, articlesEnd) + prefix + '\n' + insert + src.slice(articlesEnd);
fs.writeFileSync(path, src);
console.log('inserted before ARTICLES close at', articlesEnd);
