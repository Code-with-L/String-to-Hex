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
  ['mm','length','mm'],['millimeter','length','mm'],['millimeters','length','mm'],
  ['cm','length','cm'],['centimeter','length','cm'],['centimeters','length','cm'],
  ['m','length','m'],['meter','length','m'],['meters','length','m'],['metre','length','m'],
  ['km','length','km'],['kilometer','length','km'],['kilometers','length','km'],
  ['in','length','in'],['inch','length','in'],['inches','length','in'],
  ['ft','length','ft'],['foot','length','ft'],['feet','length','ft'],
  ['yd','length','yd'],['yard','length','yd'],['yards','length','yd'],
  ['mi','length','mi'],['mile','length','mi'],['miles','length','mi'],
  ['mg','mass','mg'],['g','mass','g'],['gram','mass','g'],['grams','mass','g'],
  ['kg','mass','kg'],['kilogram','mass','kg'],['kilograms','mass','kg'],
  ['oz','mass','oz'],['ounce','mass','oz'],['ounces','mass','oz'],
  ['lb','mass','lb'],['lbs','mass','lb'],['pound','mass','lb'],['pounds','mass','lb'],
  ['st','mass','st'],['stone','mass','st'],['stones','mass','st'],
  ['ton','mass','t'],['tons','mass','t'],
  ['c','temperature','C'],['celsius','temperature','C'],
  ['f','temperature','F'],['fahrenheit','temperature','F'],
  ['k','temperature','K'],['kelvin','temperature','K'],
  ['l','volume','l'],['liter','volume','l'],['liters','volume','l'],['litre','volume','l'],['litres','volume','l'],
  ['ml','volume','ml'],['gallon','volume','gal'],['gallons','volume','gal'],['gal','volume','gal'],
  ['w','power','w'],['watt','power','w'],['watts','power','w'],['kw','power','kw'],['hp','power','hp'],
  ['j','energy','j'],['joule','energy','j'],['joules','energy','j'],['kj','energy','kj'],['cal','energy','cal'],['kcal','energy','kcal'],['kwh','energy','kwh'],['btu','energy','btu'],
  ['hz','frequency','hz'],['khz','frequency','khz'],['mhz','frequency','mhz'],['ghz','frequency','ghz'],
  ['mph','speed','mph'],['kph','speed','kph'],['kmh','speed','kph'],
  ['psi','pressure','psi'],['bar','pressure','bar'],['kpa','pressure','kpa'],['pa','pressure','pa'],['atm','pressure','atm'],
  ['deg','angle','deg'],['degree','angle','deg'],['degrees','angle','deg'],['rad','angle','rad'],['radian','angle','rad'],['radians','angle','rad'],
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

function makeArticle(slug, title, kicker, summary, def, formulas, examples, note) {
  const blocks = [
    { k: 'definition', t: def },
    { k: 'h3', t: 'Conversion formula' },
    ...formulas.map(eq => ({k:'formula', eq})),
    { k: 'h3', t: 'Examples' },
    ...examples.map(eq => ({k:'formula', eq})),
  ];
  if (note) blocks.push({k:'callout', icon:'info', t: note});
  return { title, kicker, summary, tool: null, blocks };
}

const articles = [];
function tryAddConvSlug(slug, a, b, titlePrefix='') {
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
  const art = makeArticle(slug,
    (titlePrefix?titlePrefix+' ':'') + `${fromU.name} to ${toU.name}`,
    `${fam.title} conversion`,
    `Convert ${fromU.name} (${fromU.symbol}) to ${toU.name} (${toU.symbol}).`,
    `${fromU.name} and ${toU.name} are units of ${fam.title.toLowerCase()}.`,
    formulas,
    [`1 ${fromU.symbol} = ${fmt(ex1)} ${toU.symbol}`,`10 ${fromU.symbol} = ${fmt(ex10)} ${toU.symbol}`,`100 ${fromU.symbol} = ${fmt(ex100)} ${toU.symbol}`],
    `Use the ${fam.title.toLowerCase()} converter for other values.`);
  articles.push(`  '${slug}': ${JSON.stringify(art, null, 2).replace(/^/gm,'  ').trimStart()}`);
  return true;
}

for (const slug of files) {
  if (has(slug)) continue;
  // variant: base_N
  let m = slug.match(/^(.+)_\d+$/);
  if (m) {
    const base = m[1];
    // try to copy logic by parsing base
    let mm = base.match(/^(.+)-to-(.+)$/);
    if (mm && tryAddConvSlug(slug, mm[1], mm[2])) continue;
  }
  // how-X-to-Y
  m = slug.match(/^how-(.+)-to-(.+)$/);
  if (m) {
    const a=m[1], b=m[2];
    if (tryAddConvSlug(slug, a, b, 'How to Convert')) continue;
    // how-celsius-to-fahrenheit style already covered by batch4 for specific ones; try generic
  }
  // how-many-X-in-Y (informational)
  m = slug.match(/^how-many-(.+)-in-(?:a-)?(.+)$/);
  if (m && !has(slug)) {
    const a=m[1], b=m[2];
    if (tryAddConvSlug(slug, b, a, 'How Many')) continue;
  }
}

// add a few specific how-many pages manually if missed
const extras = [
  ['how-many-grams-in-ounce','How Many Grams in an Ounce','Weight conversion','How many grams are in one ounce.','An ounce (avoirdupois) equals exactly 28.349523125 grams.',['1 oz = 28.349523125 g'],['2 oz = 56.69904625 g','0.5 oz = 14.1747615625 g','10 oz = 283.49523125 g'],'Multiply ounces by 28.349523125 to get grams.'],
  ['how-many-ounces-in-gram','How Many Ounces in a Gram','Weight conversion','How many ounces are in one gram.','One gram equals approximately 0.03527396195 ounces.',['1 g = 0.03527396195 oz'],['10 g = 0.3527396195 oz','100 g = 3.527396195 oz','28.349523125 g = 1 oz'],'Multiply grams by 0.03527396195 to get ounces.'],
  ['how-many-cm-in-inch','How Many Centimeters in an Inch','Length conversion','How many centimeters are in one inch.','One inch equals exactly 2.54 centimeters.',['1 in = 2.54 cm'],['2 in = 5.08 cm','10 in = 25.4 cm','0.5 in = 1.27 cm'],'Multiply inches by 2.54 to get centimeters.'],
  ['how-many-inches-in-cm','How Many Inches in a Centimeter','Length conversion','How many inches are in one centimeter.','One centimeter equals approximately 0.3937007874 inches.',['1 cm = 0.3937007874 in'],['10 cm = 3.937007874 in','2.54 cm = 1 in','100 cm = 39.37007874 in'],'Divide centimeters by 2.54 to get inches.'],
];
for (const [slug,title,kicker,summary,def,formulas,examples,note] of extras) {
  if (has(slug)) continue;
  const art = { title, kicker, summary, tool: null, blocks: [ {k:'definition',t:def},{k:'h3',t:'Conversion formula'}, ...formulas.map(eq=>({k:'formula',eq})), {k:'h3',t:'Examples'}, ...examples.map(eq=>({k:'formula',eq})), {k:'callout',icon:'info',t:note} ] };
  articles.push(`  '${slug}': ${JSON.stringify(art, null, 2).replace(/^/gm,'  ').trimStart()}`);
}

if (articles.length === 0) { console.log('nothing to add'); process.exit(0); }
const slugIdx = refSrc.indexOf('\nexport const ARTICLE_SLUGS = Object.keys(ARTICLES);');
const articlesEnd = refSrc.lastIndexOf('\n};', slugIdx);
const beforeClose = refSrc.slice(0, articlesEnd).replace(/\s+$/, '');
const prefix = beforeClose.endsWith(',') ? '\n' : ',\n';
refSrc = refSrc.slice(0, articlesEnd) + prefix + articles.join(',\n') + ',\n' + refSrc.slice(articlesEnd);
fs.writeFileSync(refPath, refSrc);
console.log('added', articles.length, 'articles');