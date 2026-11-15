import fs from 'fs';

const HEX = 'C:\\Users\\leon2\\Documents\\Open Code\\hex';
const refPath = 'js/data/reference.js';
let refSrc = fs.readFileSync(refPath, 'utf8');
const { FAMILIES } = await import('../js/data/units.js');

const hexFiles = fs.readdirSync(HEX).filter(f => f.endsWith('.html')).map(f=>f.replace(/\.html$/,''));
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

function makeConvArticle(slug, a, b) {
  const A = aliases.get(a.toLowerCase()), B = aliases.get(b.toLowerCase());
  if (!A || !B || A.familyId !== B.familyId) return null;
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
    title: `${fromU.name} to ${toU.name}`,
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
  return art;
}

function trySlug(slug) {
  if (has(slug)) return null;
  if (fs.existsSync('read/'+slug+'/index.html') || fs.existsSync(slug+'/index.html')) return null;
  const s = slug;
  let m;
  // handle "1-watt-to-amp" "800-watt-to-amp" etc
  m = s.match(/^(\d+(?:\.\d+)?)-(.+)-to-(.+)$/);
  if (m) {
    const val = parseFloat(m[1]), a=m[2], b=m[3];
    // special for watts-to-amps like pages? treat as unit conversion if mappable
    const art = makeConvArticle(slug, a, b);
    if (art) {
      // customize examples to include the specific value
      const A = aliases.get(a.toLowerCase()), B = aliases.get(b.toLowerCase());
      if (A && B && A.familyId===B.familyId) {
        const fam = FAMILIES[A.familyId];
        const fromU = fam.units[A.unitKey], toU = fam.units[B.unitKey];
        const exv = convertValue(A.familyId, A.unitKey, B.unitKey, val);
        art.title = `${m[1]} ${fromU.symbol} to ${toU.symbol}`;
        art.summary = `Convert ${m[1]} ${fromU.name} to ${toU.name}.`;
        art.blocks.splice(3, art.blocks.length-3, // replace examples+callout
          { k: 'h3', t: 'Result' },
          { k: 'formula', eq: `${m[1]} ${fromU.symbol} = ${fmt(exv)} ${toU.symbol}` },
          { k: 'h3', t: 'Other examples' },
          { k: 'formula', eq: `1 ${fromU.symbol} = ${fmt(convertValue(A.familyId,A.unitKey,B.unitKey,1))} ${toU.symbol}` },
          { k: 'formula', eq: `10 ${fromU.symbol} = ${fmt(convertValue(A.familyId,A.unitKey,B.unitKey,10))} ${toU.symbol}` },
          { k: 'callout', icon: 'info', t: `Use the ${fam.title.toLowerCase()} converter for other values.` }
        );
      }
      return art;
    }
    // electrical power-to-current specific? "800-watt-to-amp" -> watts to amps needs voltage context, but we can make general page
    if ((a==='watt'||a==='watts') && (b==='amp'||b==='amps')) {
      const w = val;
      const fmtN = (x)=>{let s=(Math.round(x*1000)/1000).toString(); return s;};
      return {
        title: `${m[1]} Watts to Amps`,
        kicker: 'Electrical conversion',
        summary: `How to calculate current in amperes for a ${m[1]}-watt load at common voltages.`,
        tool: 'current-power',
        blocks: [
          { k: 'definition', t: 'Current (amps) depends on power (watts), voltage, and for AC circuits the power factor. Use I = P / V for DC and I = P / (PF × V) for AC.' },
          { k: 'h3', t: 'DC: 12 V supply' }, { k: 'formula', eq: `I = ${w} W / 12 V = ${fmtN(w/12)} A` },
          { k: 'h3', t: 'AC: 120 V supply' },
          { k: 'p', t: 'Resistive load (PF = 1):' }, { k: 'formula', eq: `I = ${w} W / (1 × 120 V) = ${fmtN(w/120)} A` },
          { k: 'p', t: 'Inductive load (example PF = 0.8):' }, { k: 'formula', eq: `I = ${w} W / (0.8 × 120 V) = ${fmtN(w/(0.8*120))} A` },
          { k: 'h3', t: 'AC: 230 V supply' },
          { k: 'p', t: 'Resistive load (PF = 1):' }, { k: 'formula', eq: `I = ${w} W / (1 × 230 V) = ${fmtN(w/230)} A` },
          { k: 'p', t: 'Inductive load (example PF = 0.8):' }, { k: 'formula', eq: `I = ${w} W / (0.8 × 230 V) = ${fmtN(w/(0.8*230))} A` },
          { k: 'callout', icon: 'info', t: 'Use the Current / power calculator for other values.' },
        ]
      };
    }
    if ((a==='amp'||a==='amps') && (b==='watt'||b==='watts')) {
      const i = val;
      return {
        title: `${m[1]} Amps to Watts`,
        kicker: 'Electrical conversion',
        summary: `How to calculate power in watts for ${m[1]} amps at common voltages.`,
        tool: 'current-power',
        blocks: [
          { k: 'definition', t: 'Power (watts) depends on current (amps), voltage, and for AC circuits the power factor. Use P = I × V for DC and P = PF × I × V for AC.' },
          { k: 'h3', t: 'DC / Resistive examples' },
          { k: 'formula', eq: `P = ${i} A × 12 V = ${fmt(i*12)} W` },
          { k: 'formula', eq: `P = ${i} A × 120 V = ${fmt(i*120)} W` },
          { k: 'formula', eq: `P = ${i} A × 230 V = ${fmt(i*230)} W` },
          { k: 'h3', t: 'AC with power factor 0.8' },
          { k: 'formula', eq: `P = 0.8 × ${i} A × 120 V = ${fmt(0.8*i*120)} W` },
          { k: 'formula', eq: `P = 0.8 × ${i} A × 230 V = ${fmt(0.8*i*230)} W` },
          { k: 'callout', icon: 'info', t: 'Use the Current / power calculator for other values.' },
        ]
      };
    }
  }
  m = s.match(/^(.+)-to-(.+)$/);
  if (m) {
    const art = makeConvArticle(slug, m[1], m[2]);
    if (art) return art;
  }
  m = s.match(/^(.+)_to_(.+?)(_Calculator)?$/i);
  if (m) {
    const art = makeConvArticle(slug, m[1].replace(/_/g,'-'), m[2].replace(/_/g,'-'));
    if (art) { art.summary = art.summary + ' (Calculator)'; return art; }
  }
  return null;
}

const articles = [];
for (const slug of hexFiles) {
  const art = trySlug(slug);
  if (art) articles.push(`  '${slug}': ${JSON.stringify(art, null, 2).replace(/^/gm,'  ').trimStart()}`);
}

if (articles.length === 0) { console.log('nothing to add'); process.exit(0); }
const slugIdx = refSrc.indexOf('\nexport const ARTICLE_SLUGS = Object.keys(ARTICLES);');
const articlesEnd = refSrc.lastIndexOf('\n};', slugIdx);
const beforeClose = refSrc.slice(0, articlesEnd).replace(/\s+$/, '');
const prefix = beforeClose.endsWith(',') ? '\n' : ',\n';
refSrc = refSrc.slice(0, articlesEnd) + prefix + articles.join(',\n') + ',\n' + refSrc.slice(articlesEnd);
fs.writeFileSync(refPath, refSrc);
console.log('added', articles.length, 'articles');
