import fs from 'fs';

const HEX = 'C:\\Users\\leon2\\Documents\\Open Code\\hex';
const refPath = 'js/data/reference.js';
let src = fs.readFileSync(refPath, 'utf8');
const files = fs.readdirSync(HEX).filter(f => f.endsWith('.html')).map(f=>f.replace(/\.html$/,''));

const fmt = (x, d=6) => {
  let s = Number(x).toFixed(d);
  s = s.replace(/\.?0+$/,'');
  if (s === '-0') s = '0';
  return s || '0';
};

const has = (slug) => src.includes(`'${slug}': {`);

const articles = [];

function addLength(slug, title, from, to, factor, toFactor, note) {
  if (has(slug)) return;
  const ex1 = 1 * factor;
  const ex10 = 10 * factor;
  const ex100 = 100 * factor;
  const back = toFactor ? `      { k: 'formula', eq: '${from} = ${to} × ${fmt(toFactor,10)}' },\n` : '';
  articles.push(`  '${slug}': {
    title: '${title}',
    kicker: 'Length conversion',
    summary: 'Convert ${from} to ${to} with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: '${from} and ${to} are units of length. ${note || ''}' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: '${to} = ${from} × ${fmt(factor,10)}' },
${back}      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 ${from} = ${fmt(ex1)} ${to}' },
      { k: 'formula', eq: '10 ${from} = ${fmt(ex10)} ${to}' },
      { k: 'formula', eq: '100 ${from} = ${fmt(ex100)} ${to}' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in ${from} by ${fmt(factor,10)} to get ${to}.' },
    ],
  }`);
}

function addTempCtoF(slug, c) {
  if (has(slug)) return;
  const f = c * 9/5 + 32;
  articles.push(`  '${slug}': {
    title: '${c}°C to °F',
    kicker: 'Temperature conversion',
    summary: 'Convert ${c} degrees Celsius to Fahrenheit.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Celsius to Fahrenheit, multiply by 9/5 and add 32.' },
      { k: 'formula', eq: '°F = °C × 9/5 + 32' },
      { k: 'formula', eq: '${c}°C × 9/5 + 32 = ${fmt(f,4)}°F' },
      { k: 'callout', icon: 'info', t: '${c} degrees Celsius equals ${fmt(f,4)} degrees Fahrenheit.' },
    ],
  }`);
}
function addTempFtoC(slug, f) {
  if (has(slug)) return;
  const c = (f - 32) * 5/9;
  articles.push(`  '${slug}': {
    title: '${f}°F to °C',
    kicker: 'Temperature conversion',
    summary: 'Convert ${f} degrees Fahrenheit to Celsius.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.' },
      { k: 'formula', eq: '°C = (°F − 32) × 5/9' },
      { k: 'formula', eq: '(${f}°F − 32) × 5/9 = ${fmt(c,4)}°C' },
      { k: 'callout', icon: 'info', t: '${f} degrees Fahrenheit equals ${fmt(c,4)} degrees Celsius.' },
    ],
  }`);
}

const patterns = [
  { re: /^(\d+)-c-to-f$/, fn: (m,slug)=>addTempCtoF(slug, parseFloat(m[1])) },
  { re: /^(\d+)-f-to-c$/, fn: (m,slug)=>addTempFtoC(slug, parseFloat(m[1])) },
  { re: /^(\d+)-fahrenheit-to-celsius$/, fn: (m,slug)=>addTempFtoC(slug, parseFloat(m[1])) },
];

const lengthDefs = [
  ['cm-to-inches','Centimeters to Inches','cm','in',1/2.54,2.54,'1 inch is exactly 2.54 cm.'],
  ['inches-to-cm','Inches to Centimeters','in','cm',2.54,1/2.54,'1 inch is exactly 2.54 cm.'],
  ['mm-to-inches','Millimeters to Inches','mm','in',1/25.4,25.4,'1 inch is exactly 25.4 mm.'],
  ['inches-to-mm','Inches to Millimeters','in','mm',25.4,1/25.4,'1 inch is exactly 25.4 mm.'],
  ['meters-to-feet','Meters to Feet','m','ft',1/0.3048,0.3048,'1 foot is exactly 0.3048 meters.'],
  ['feet-to-meters','Feet to Meters','ft','m',0.3048,1/0.3048,'1 foot is exactly 0.3048 meters.'],
  ['km-to-miles','Kilometers to Miles','km','mi',1/1.609344,1.609344,'1 mile is exactly 1.609344 km.'],
  ['miles-to-km','Miles to Kilometers','mi','km',1.609344,1/1.609344,'1 mile is exactly 1.609344 km.'],
  ['cm-to-mm','Centimeters to Millimeters','cm','mm',10,0.1,'1 cm equals 10 mm.'],
  ['mm-to-cm','Millimeters to Centimeters','mm','cm',0.1,10,'1 cm equals 10 mm.'],
  ['meters-to-cm','Meters to Centimeters','m','cm',100,0.01,'1 m equals 100 cm.'],
  ['cm-to-meters','Centimeters to Meters','cm','m',0.01,100,'1 m equals 100 cm.'],
  ['inch-to-feet','Inches to Feet','in','ft',1/12,12,'1 foot equals 12 inches.'],
  ['feet-to-inches','Feet to Inches','ft','in',12,1/12,'1 foot equals 12 inches.'],
  ['yards-to-feet','Yards to Feet','yd','ft',3,1/3,'1 yard equals 3 feet.'],
  ['feet-to-yards','Feet to Yards','ft','yd',1/3,3,'1 yard equals 3 feet.'],
];
for (const d of lengthDefs) addLength(...d);

for (const slug of files) {
  for (const p of patterns) {
    const m = slug.match(p.re);
    if (m) { p.fn(m, slug); break; }
  }
}

if (articles.length === 0) { console.log('nothing to add'); process.exit(0); }
const slugIdx = src.indexOf('\nexport const ARTICLE_SLUGS = Object.keys(ARTICLES);');
const articlesEnd = src.lastIndexOf('\n};', slugIdx);
const beforeClose = src.slice(0, articlesEnd).replace(/\s+$/, '');
const prefix = beforeClose.endsWith(',') ? '\n' : ',\n';
src = src.slice(0, articlesEnd) + prefix + articles.join(',\n') + ',\n' + src.slice(articlesEnd);
fs.writeFileSync(refPath, src);
console.log('added', articles.length, 'articles');
