import fs from 'fs';

const HEX = 'C:\\Users\\leon2\\Documents\\Open Code\\hex';
const refPath = 'js/data/reference.js';
let refSrc = fs.readFileSync(refPath, 'utf8');
const { FAMILIES } = await import('../js/data/units.js');

const files = fs.readdirSync(HEX).filter(f => f.endsWith('.html')).map(f=>f.replace(/\.html$/,''));
const fmt = (x) => { let s = Number(x).toPrecision(10); return parseFloat(s).toString(); };
const has = (slug) => refSrc.includes(`'${slug}': {`);

const aliases = new Map();
const addAlias = (a, familyId, unitKey) => aliases.set(a.toLowerCase(), {familyId, unitKey});
const aliasDefs = [
  ['mm','length','mm'],['cm','length','cm'],['m','length','m'],['meter','length','m'],['meters','length','m'],['km','length','km'],
  ['in','length','in'],['inch','length','in'],['inches','length','in'],['ft','length','ft'],['foot','length','ft'],['feet','length','ft'],
  ['yd','length','yd'],['yard','length','yd'],['yards','length','yd'],['mi','length','mi'],['mile','length','mi'],['miles','length','mi'],
  ['g','mass','g'],['gram','mass','g'],['grams','mass','g'],['kg','mass','kg'],['kilogram','mass','kg'],['oz','mass','oz'],['ounce','mass','oz'],['ounces','mass','oz'],
  ['lb','mass','lb'],['lbs','mass','lb'],['pound','mass','lb'],['pounds','mass','lb'],['st','mass','st'],['stone','mass','st'],['ton','mass','t'],
  ['c','temperature','C'],['celsius','temperature','C'],['f','temperature','F'],['fahrenheit','temperature','F'],['k','temperature','K'],['kelvin','temperature','K'],
  ['l','volume','l'],['liter','volume','l'],['liters','volume','l'],['ml','volume','ml'],['gal','volume','gal'],['gallon','volume','gal'],['gallons','volume','gal'],
  ['w','power','w'],['watt','power','w'],['watts','power','w'],['kw','power','kw'],['kilowatt','power','kw'],['hp','power','hp'],['bhp','power','bhp'],
  ['j','energy','j'],['joule','energy','j'],['joules','energy','j'],['kj','energy','kj'],['cal','energy','cal'],['calorie','energy','cal'],['calories','energy','cal'],
  ['kcal','energy','kcal'],['kwh','energy','kwh'],['btu','energy','btu'],
  ['hz','frequency','hz'],['khz','frequency','khz'],['mhz','frequency','mhz'],['ghz','frequency','ghz'],
  ['deg','angle','deg'],['degree','angle','deg'],['degrees','angle','deg'],['rad','angle','rad'],['radian','angle','rad'],['radians','angle','rad'],
  ['mph','speed','mph'],['kph','speed','kph'],['kmh','speed','kph'],
  ['psi','pressure','psi'],['bar','pressure','bar'],['kpa','pressure','kpa'],['pa','pressure','pa'],['atm','pressure','atm'],
  ['ah','charge','ah'],['mah','charge','mah'],
  ['v','voltage','v'],['volt','voltage','v'],['volts','voltage','v'],['kv','voltage','kv'],
  ['a','current','a'],['amp','current','a'],['amps','current','a'],['ampere','current','a'],['amperes','current','a'],['ma','current','ma'],
  ['ohm','resistance','ohm'],['ohms','resistance','ohm'],['kohm','resistance','kohm'],
];
for (const [a,f,u] of aliasDefs) addAlias(a,f,u);

function convertValue(family, fromKey, toKey, value) {
  const f = FAMILIES[family];
  const fu = f.units[fromKey], tu = f.units[toKey];
  if (family === 'temperature') {
    const baseC = value * fu.f + fu.o;
    return (baseC - tu.o) / tu.f;
  }
  return value * (fu.f / tu.f);
}

const articles = [];

function tryAddConv(slug, a, b, titlePrefix='') {
  if (has(slug)) return false;
  const A = aliases.get(a.toLowerCase()), B = aliases.get(b.toLowerCase());
  if (!A || !B || A.familyId !== B.familyId) return false;
  const fam = FAMILIES[A.familyId];
  const fromU = fam.units[A.unitKey], toU = fam.units[B.unitKey];
  const ex1 = convertValue(A.familyId, A.unitKey, B.unitKey, 1);
  const ex10 = convertValue(A.familyId, A.unitKey, B.unitKey, 10);
  const ex100 = convertValue(A.familyId, A.unitKey, B.unitKey, 100);
  let formulas;
  if (A.familyId === 'temperature') {
    if (A.unitKey==='C' && B.unitKey==='F') formulas = ['°F = °C × 9/5 + 32'];
    else if (A.unitKey==='F' && B.unitKey==='C') formulas = ['°C = (°F − 32) × 5/9'];
    else if (A.unitKey==='C' && B.unitKey==='K') formulas = ['K = °C + 273.15'];
    else if (A.unitKey==='K' && B.unitKey==='C') formulas = ['°C = K − 273.15'];
    else formulas = [`${toU.symbol} = convert(${fromU.symbol})`];
  } else {
    const factor = fromU.f / toU.f;
    formulas = [`${toU.symbol} = ${fromU.symbol} × ${fmt(factor)}`];
  }
  const art = {
    title: (titlePrefix?titlePrefix+' ':'') + `${fromU.name} to ${toU.name}`,
    kicker: `${fam.title} conversion`,
    summary: `Convert ${fromU.name} (${fromU.symbol}) to ${toU.name} (${toU.symbol}).`,
    tool: null,
    blocks: [
      { k: 'definition', t: `${fromU.name} and ${toU.name} are units of ${fam.title.toLowerCase()}.` },
      { k: 'h3', t: 'Conversion formula' },
      ...formulas.map(eq => ({k:'formula', eq})),
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: `1 ${fromU.symbol} = ${fmt(ex1)} ${toU.symbol}` },
      { k: 'formula', eq: `10 ${fromU.symbol} = ${fmt(ex10)} ${toU.symbol}` },
      { k: 'formula', eq: `100 ${fromU.symbol} = ${fmt(ex100)} ${toU.symbol}` },
      { k: 'callout', icon: 'info', t: `Use the ${fam.title.toLowerCase()} converter for other values.` },
    ],
  };
  articles.push(`  '${slug}': ${JSON.stringify(art, null, 2).replace(/^/gm,'  ').trimStart()}`);
  return true;
}

for (const slug of files) {
  if (has(slug)) continue;
  const s = slug;
  // Normalize variants like Amp_to_Watt, Watt_to_Amp_Calculator - try to extract X_to_Y
  let m = s.match(/^(.+)_to_(.+?)(_Calculator)?$/i);
  if (m) {
    const a = m[1].replace(/_/g,'-'), b = m[2].replace(/_/g,'-');
    if (tryAddConv(slug, a, b)) continue;
  }
  // X-to-Y and variants
  m = s.match(/^(.+)-to-(.+)$/);
  if (m) {
    if (tryAddConv(slug, m[1], m[2])) continue;
  }
  // how-X-to-Y
  m = s.match(/^how-(.+)-to-(.+)$/);
  if (m) {
    if (tryAddConv(slug, m[1], m[2], 'How to Convert')) continue;
  }
  // celsius-to-fahrenheit style specific
  m = s.match(/^(.+)-to-fahrenheit$/);
  if (m && tryAddConv(slug, m[1], 'fahrenheit')) continue;
  m = s.match(/^(.+)-to-celsius$/);
  if (m && tryAddConv(slug, m[1], 'celsius')) continue;
  m = s.match(/^fahrenheit-to-(.+)$/);
  if (m && tryAddConv(slug, 'fahrenheit', m[1])) continue;
  m = s.match(/^celsius-to-(.+)$/);
  if (m && tryAddConv(slug, 'celsius', m[1])) continue;
}

if (articles.length === 0) { console.log('nothing to add'); process.exit(0); }
const slugIdx = refSrc.indexOf('\nexport const ARTICLE_SLUGS = Object.keys(ARTICLES);');
const articlesEnd = refSrc.lastIndexOf('\n};', slugIdx);
const beforeClose = refSrc.slice(0, articlesEnd).replace(/\s+$/, '');
const prefix = beforeClose.endsWith(',') ? '\n' : ',\n';
refSrc = refSrc.slice(0, articlesEnd) + prefix + articles.join(',\n') + ',\n' + refSrc.slice(articlesEnd);
fs.writeFileSync(refPath, refSrc);
console.log('added', articles.length, 'articles');
