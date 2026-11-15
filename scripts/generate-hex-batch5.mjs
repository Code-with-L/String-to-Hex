import fs from 'fs';

const HEX = 'C:\\Users\\leon2\\Documents\\Open Code\\hex';
const refPath = 'js/data/reference.js';
let refSrc = fs.readFileSync(refPath, 'utf8');
const { FAMILIES } = await import('../js/data/units.js');

const files = fs.readdirSync(HEX).filter(f => f.endsWith('.html')).map(f=>f.replace(/\.html$/,''));
const fmt = (x, d=6) => { let s = Number(x).toPrecision(10); s = parseFloat(s).toString(); return s; };
const has = (slug) => refSrc.includes(`'${slug}': {`);

// Build alias map: alias -> {familyId, unitKey}
const aliases = new Map();
const addAlias = (a, familyId, unitKey) => aliases.set(a.toLowerCase(), {familyId, unitKey});

// Common aliases
const aliasDefs = [
  // length
  ['mm','length','mm'],['millimeter','length','mm'],['millimeters','length','mm'],
  ['cm','length','cm'],['centimeter','length','cm'],['centimeters','length','cm'],
  ['m','length','m'],['meter','length','m'],['meters','length','m'],['metre','length','m'],['metres','length','m'],
  ['km','length','km'],['kilometer','length','km'],['kilometers','length','km'],['kilometre','length','km'],
  ['in','length','in'],['inch','length','in'],['inches','length','in'],
  ['ft','length','ft'],['foot','length','ft'],['feet','length','ft'],
  ['yd','length','yd'],['yard','length','yd'],['yards','length','yd'],
  ['mi','length','mi'],['mile','length','mi'],['miles','length','mi'],
  // mass
  ['mg','mass','mg'],['milligram','mass','mg'],['milligrams','mass','mg'],
  ['g','mass','g'],['gram','mass','g'],['grams','mass','g'],
  ['kg','mass','kg'],['kilogram','mass','kg'],['kilograms','mass','kg'],
  ['oz','mass','oz'],['ounce','mass','oz'],['ounces','mass','oz'],
  ['lb','mass','lb'],['lbs','mass','lb'],['pound','mass','lb'],['pounds','mass','lb'],
  ['st','mass','st'],['stone','mass','st'],['stones','mass','st'],
  ['ton','mass','t'],['tons','mass','t'],['tonne','mass','t'],['tonnes','mass','t'],
  // temp
  ['c','temperature','C'],['celsius','temperature','C'],
  ['f','temperature','F'],['fahrenheit','temperature','F'],
  ['k','temperature','K'],['kelvin','temperature','K'],
  // area
  ['sqm','area','m2'],['sq-m','area','m2'],['m2','area','m2'],['square-meter','area','m2'],['square-meters','area','m2'],
  ['sqft','area','ft2'],['sq-ft','area','ft2'],['ft2','area','ft2'],['square-foot','area','ft2'],['square-feet','area','ft2'],
  ['sqin','area','in2'],['in2','area','in2'],['square-inch','area','in2'],['square-inches','area','in2'],
  ['sqyd','area','yd2'],['yd2','area','yd2'],['square-yard','area','yd2'],
  ['acre','area','ac'],['acres','area','ac'],
  ['hectare','area','ha'],['hectares','area','ha'],
  ['sqkm','area','km2'],['km2','area','km2'],['square-kilometer','area','km2'],['square-kilometers','area','km2'],
  ['sqmi','area','mi2'],['mi2','area','mi2'],['square-mile','area','mi2'],['square-miles','area','mi2'],
  // volume
  ['ml','volume','ml'],['milliliter','volume','ml'],['milliliters','volume','ml'],
  ['l','volume','l'],['liter','volume','l'],['liters','volume','l'],['litre','volume','l'],['litres','volume','l'],
  ['gal','volume','gal'],['gallon','volume','gal'],['gallons','volume','gal'],
  ['cup','volume','cup'],['cups','volume','cup'],
  ['floz','volume','floz'],['fl-oz','volume','floz'],['fluid-ounce','volume','floz'],['fluid-ounces','volume','floz'],
  ['tsp','volume','tsp'],['teaspoon','volume','tsp'],['teaspoons','volume','tsp'],
  ['tbsp','volume','tbsp'],['tablespoon','volume','tbsp'],['tablespoons','volume','tbsp'],
  ['pt','volume','pt'],['pint','volume','pt'],['pints','volume','pt'],
  ['qt','volume','qt'],['quart','volume','qt'],['quarts','volume','qt'],
  ['m3','volume','m3'],['cubic-meter','volume','m3'],['cubic-meters','volume','m3'],
  ['ft3','volume','ft3'],['cubic-foot','volume','ft3'],['cubic-feet','volume','ft3'],
  ['in3','volume','in3'],['cubic-inch','volume','in3'],['cubic-inches','volume','in3'],
  // speed
  ['mph','speed','mph'],['kph','speed','kph'],['kmh','speed','kph'],['km-h','speed','kph'],
  ['mps','speed','mps'],['m-s','speed','mps'],
  ['knot','speed','kn'],['knots','speed','kn'],
  // pressure
  ['pa','pressure','pa'],['pascal','pressure','pa'],
  ['kpa','pressure','kpa'],['kilopascal','pressure','kpa'],
  ['bar','pressure','bar'],['mbar','pressure','mbar'],
  ['psi','pressure','psi'],['atm','pressure','atm'],['torr','pressure','torr'],
  ['mmhg','pressure','mmhg'],['inhg','pressure','inhg'],
  // energy
  ['j','energy','j'],['joule','energy','j'],['joules','energy','j'],
  ['kj','energy','kj'],['kilojoule','energy','kj'],['kilojoules','energy','kj'],
  ['cal','energy','cal'],['calorie','energy','cal'],['calories','energy','cal'],
  ['kcal','energy','kcal'],['kilocalorie','energy','kcal'],['kilocalories','energy','kcal'],
  ['wh','energy','wh'],['kwh','energy','kwh'],['kilowatt-hour','energy','kwh'],
  ['btu','energy','btu'],
  ['ev','energy','ev'],
  // power
  ['w','power','w'],['watt','power','w'],['watts','power','w'],
  ['kw','power','kw'],['kilowatt','power','kw'],['kilowatts','power','kw'],
  ['mw','power','mw2'],['megawatt','power','mw2'],['megawatts','power','mw2'],
  ['hp','power','hp'],['horsepower','power','hp'],
  // time
  ['s','time','s'],['sec','time','s'],['second','time','s'],['seconds','time','s'],
  ['ms','time','ms'],['millisecond','time','ms'],['milliseconds','time','ms'],
  ['min','time','min'],['minute','time','min'],['minutes','time','min'],
  ['h','time','h'],['hr','time','h'],['hour','time','h'],['hours','time','h'],
  ['day','time','d'],['days','time','d'],
  ['week','time','wk'],['weeks','time','wk'],
  ['month','time','mo'],['months','time','mo'],
  ['year','time','yr'],['years','time','yr'],
  // frequency
  ['hz','frequency','hz'],['hertz','frequency','hz'],
  ['khz','frequency','khz'],['kilohertz','frequency','khz'],
  ['mhz','frequency','mhz'],['megahertz','frequency','mhz'],
  ['ghz','frequency','ghz'],['gigahertz','frequency','ghz'],
  // data
  ['bit','data','bit'],['bits','data','bit'],
  ['byte','data','b'],['bytes','data','b'],
  ['kb','data','kb'],['mb','data','mb'],['gb','data','gb'],['tb','data','tb'],
  ['kib','data','kib'],['mib','data','mib'],['gib','data','gib'],['tib','data','tib'],
  // angle
  ['deg','angle','deg'],['degree','angle','deg'],['degrees','angle','deg'],
  ['rad','angle','rad'],['radian','angle','rad'],['radians','angle','rad'],
  // force
  ['n','force','n'],['newton','force','n'],['newtons','force','n'],
  ['kn','force','kn'],['kilonewton','force','kn'],
  ['lbf','force','lbf'],['pound-force','force','lbf'],
];
for (const [a,f,u] of aliasDefs) addAlias(a,f,u);

function convertValue(family, fromKey, toKey, value) {
  const f = FAMILIES[family];
  const fu = f.units[fromKey], tu = f.units[toKey];
  if (family === 'temperature') {
    const baseC = value * fu.f + fu.o; // to Celsius base? wait: units.js comment says "base = x*f + o" where base is Celsius for temp units
    // to convert from unit X to unit Y: x_in_base = value*fu.f + fu.o; value_in_Y = (x_in_base - tu.o)/tu.f
    return (baseC - tu.o) / tu.f;
  }
  return value * (fu.f / tu.f);
}

const articles = [];
let added = 0;
for (const slug of files) {
  // skip variants with _N for now except base? handle base only
  if (/_\d+$/.test(slug)) continue;
  if (has(slug)) continue;
  // parse X-to-Y
  const m = slug.match(/^(.+)-to-(.+)$/);
  if (!m) continue;
  const a = m[1].toLowerCase(), b = m[2].toLowerCase();
  const A = aliases.get(a), B = aliases.get(b);
  if (!A || !B || A.familyId !== B.familyId) continue;
  const fam = FAMILIES[A.familyId];
  const fromU = fam.units[A.unitKey], toU = fam.units[B.unitKey];
  if (!fromU || !toU) continue;
  const ex1 = convertValue(A.familyId, A.unitKey, B.unitKey, 1);
  const ex10 = convertValue(A.familyId, A.unitKey, B.unitKey, 10);
  const ex100 = convertValue(A.familyId, A.unitKey, B.unitKey, 100);
  const title = `${fromU.name} to ${toU.name}`;
  const summary = `Convert ${fromU.name} (${fromU.symbol}) to ${toU.name} (${toU.symbol}).`;
  const def = `${fromU.name} and ${toU.name} are units of ${fam.title.toLowerCase()}.`;
  let formulaLines;
  if (A.familyId === 'temperature') {
    // show specific formula
    if (A.unitKey==='C' && B.unitKey==='F') formulaLines = ['°F = °C × 9/5 + 32'];
    else if (A.unitKey==='F' && B.unitKey==='C') formulaLines = ['°C = (°F − 32) × 5/9'];
    else if (A.unitKey==='C' && B.unitKey==='K') formulaLines = ['K = °C + 273.15'];
    else if (A.unitKey==='K' && B.unitKey==='C') formulaLines = ['°C = K − 273.15'];
    else formulaLines = [`${toU.symbol} = convert(${fromU.symbol})`];
  } else {
    const factor = fromU.f / toU.f;
    formulaLines = [`${toU.symbol} = ${fromU.symbol} × ${fmt(factor,10)}`];
  }
  const blocks = [
    { k: 'definition', t: def },
    { k: 'h3', t: 'Conversion formula' },
    ...formulaLines.map(eq => ({k:'formula', eq})),
    { k: 'h3', t: 'Examples' },
    { k: 'formula', eq: `1 ${fromU.symbol} = ${fmt(ex1)} ${toU.symbol}` },
    { k: 'formula', eq: `10 ${fromU.symbol} = ${fmt(ex10)} ${toU.symbol}` },
    { k: 'formula', eq: `100 ${fromU.symbol} = ${fmt(ex100)} ${toU.symbol}` },
    { k: 'callout', icon: 'info', t: `Use the ${fam.title.toLowerCase()} converter for other values.` },
  ];
  articles.push(`  '${slug}': ${JSON.stringify({ title, kicker: `${fam.title} conversion`, summary, tool: null, blocks }, null, 2).replace(/^/gm,'  ').trimStart()}`);
  added++;
}

if (articles.length === 0) { console.log('nothing to add'); process.exit(0); }
const slugIdx = refSrc.indexOf('\nexport const ARTICLE_SLUGS = Object.keys(ARTICLES);');
const articlesEnd = refSrc.lastIndexOf('\n};', slugIdx);
const beforeClose = refSrc.slice(0, articlesEnd).replace(/\s+$/, '');
const prefix = beforeClose.endsWith(',') ? '\n' : ',\n';
refSrc = refSrc.slice(0, articlesEnd) + prefix + articles.join(',\n') + ',\n' + refSrc.slice(articlesEnd);
fs.writeFileSync(refPath, refSrc);
console.log('added', added, 'articles');
