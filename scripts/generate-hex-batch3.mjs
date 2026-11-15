import fs from 'fs';

const HEX = 'C:\\Users\\leon2\\Documents\\Open Code\\hex';
const refPath = 'js/data/reference.js';
let src = fs.readFileSync(refPath, 'utf8');
const files = fs.readdirSync(HEX).filter(f => f.endsWith('.html')).map(f=>f.replace(/\.html$/,''));

const fmt = (x, d=6) => { let s = Number(x).toFixed(d); s = s.replace(/\.?0+$/,''); if(s==='-0') s='0'; return s||'0'; };
const has = (slug) => src.includes(`'${slug}': {`);
const articles = [];

function addConv(slug, title, kicker, summary, def, formula, examples, note) {
  if (has(slug)) return;
  const blocks = [
    { k: 'definition', t: def },
    { k: 'h3', t: 'Conversion formula' },
    ...formula.map(eq => ({ k: 'formula', eq })),
    { k: 'h3', t: 'Examples' },
    ...examples.map(eq => ({ k: 'formula', eq })),
  ];
  if (note) blocks.push({ k: 'callout', icon: 'info', t: note });
  articles.push(`  '${slug}': ${JSON.stringify({ title, kicker, summary, tool: null, blocks }, null, 2).replace(/^/gm,'  ').trimStart()}`);
}

// Weight/mass
const mass = [
  ['kg-to-lbs','Kilograms to Pounds','kg','lb',2.20462262185,'1 kg ≈ 2.20462 lb.'],
  ['lbs-to-kg','Pounds to Kilograms','lb','kg',0.45359237,'1 lb = 0.45359237 kg.'],
  ['kg-to-pound','Kilograms to Pounds','kg','lb',2.20462262185,'1 kg ≈ 2.20462 lb.'],
  ['pound-to-kg','Pounds to Kilograms','lb','kg',0.45359237,'1 lb = 0.45359237 kg.'],
  ['grams-to-ounces','Grams to Ounces','g','oz',0.03527396195,'1 oz = 28.349523125 g.'],
  ['ounces-to-grams','Ounces to Grams','oz','g',28.349523125,'1 oz = 28.349523125 g.'],
  ['gram-to-ounce','Grams to Ounces','g','oz',0.03527396195,'1 oz = 28.349523125 g.'],
  ['kg-to-grams','Kilograms to Grams','kg','g',1000,'1 kg = 1000 g.'],
  ['grams-to-kg','Grams to Kilograms','g','kg',0.001,'1 kg = 1000 g.'],
  ['lb-to-oz','Pounds to Ounces','lb','oz',16,'1 lb = 16 oz.'],
  ['oz-to-lb','Ounces to Pounds','oz','lb',1/16,'1 lb = 16 oz.'],
  ['kg-to-oz','Kilograms to Ounces','kg','oz',35.27396195,'1 kg ≈ 35.274 oz.'],
  ['oz-to-kg','Ounces to Kilograms','oz','kg',0.028349523125,'1 oz = 28.349523125 g.'],
  ['stones-to-kg','Stones to Kilograms','st','kg',6.35029318,'1 stone = 6.35029318 kg.'],
  ['kg-to-stones','Kilograms to Stones','kg','st',1/6.35029318,'1 stone = 6.35029318 kg.'],
  ['ton-to-kg','Tons to Kilograms','ton','kg',1000,'Using metric ton: 1 t = 1000 kg.'],
  ['kg-to-ton','Kilograms to Tons','kg','ton',0.001,'Using metric ton: 1 t = 1000 kg.'],
];
for (const [slug,title,from,to,f,note] of mass) {
  addConv(slug,title,'Weight conversion',`Convert ${from} to ${to}.`,`${from} and ${to} are units of mass/weight. ${note}`, [`${to} = ${from} × ${fmt(f,12)}`], [`1 ${from} = ${fmt(1*f)} ${to}`,`10 ${from} = ${fmt(10*f)} ${to}`,`100 ${from} = ${fmt(100*f)} ${to}`], `Multiply ${from} by ${fmt(f,12)} to get ${to}.`);
}

// Power
const power = [
  ['kw-to-hp','Kilowatts to Horsepower','kW','hp',1.341022089595,'1 kW ≈ 1.34102 mechanical horsepower.'],
  ['hp-to-kw','Horsepower to Kilowatts','hp','kW',0.745699871582,'1 mechanical hp = 0.745699872 kW.'],
  ['hp-to-watt','Horsepower to Watts','hp','W',745.699871582,'1 mechanical hp = 745.699872 W.'],
  ['watt-to-hp','Watts to Horsepower','W','hp',1/745.699871582,'1 mechanical hp = 745.699872 W.'],
  ['kw-to-watt','Kilowatts to Watts','kW','W',1000,'1 kW = 1000 W.'],
  ['watt-to-kw','Watts to Kilowatts','W','kW',0.001,'1 kW = 1000 W.'],
  ['kw-to-bhp','Kilowatts to Brake Horsepower','kW','bhp',1.341022089595,'1 kW ≈ 1.34102 bhp (mechanical).'],
  ['btuh-to-watt','BTU/h to Watts','BTU/h','W',0.29307107,'1 BTU/h ≈ 0.29307107 W.'],
  ['watt-to-btuh','Watts to BTU/h','W','BTU/h',3.412141633,'1 W ≈ 3.41214 BTU/h.'],
];
for (const [slug,title,from,to,f,note] of power) {
  addConv(slug,title,'Power conversion',`Convert ${from} to ${to}.`,`${from} and ${to} are units of power. ${note}`, [`${to} = ${from} × ${fmt(f,12)}`], [`1 ${from} = ${fmt(1*f)} ${to}`,`10 ${from} = ${fmt(10*f)} ${to}`,`100 ${from} = ${fmt(100*f)} ${to}`], `Multiply ${from} by ${fmt(f,12)} to get ${to}.`);
}

// Length extras
const length = [
  ['cm-to-inch','Centimeters to Inches','cm','in',1/2.54,'1 inch = 2.54 cm.'],
  ['inch-to-cm','Inches to Centimeters','in','cm',2.54,'1 inch = 2.54 cm.'],
  ['mm-to-inch','Millimeters to Inches','mm','in',1/25.4,'1 inch = 25.4 mm.'],
  ['inch-to-mm','Inches to Millimeters','in','mm',25.4,'1 inch = 25.4 mm.'],
  ['km-to-mile','Kilometers to Miles','km','mi',1/1.609344,'1 mile = 1.609344 km.'],
  ['mile-to-km','Miles to Kilometers','mi','km',1.609344,'1 mile = 1.609344 km.'],
  ['m-to-ft','Meters to Feet','m','ft',1/0.3048,'1 ft = 0.3048 m.'],
  ['ft-to-m','Feet to Meters','ft','m',0.3048,'1 ft = 0.3048 m.'],
  ['meter-to-feet','Meters to Feet','m','ft',1/0.3048,'1 ft = 0.3048 m.'],
  ['feet-to-meter','Feet to Meters','ft','m',0.3048,'1 ft = 0.3048 m.'],
  ['yard-to-meter','Yards to Meters','yd','m',0.9144,'1 yd = 0.9144 m.'],
  ['meter-to-yard','Meters to Yards','m','yd',1/0.9144,'1 yd = 0.9144 m.'],
];
for (const [slug,title,from,to,f,note] of length) {
  addConv(slug,title,'Length conversion',`Convert ${from} to ${to}.`,`${from} and ${to} are units of length. ${note}`, [`${to} = ${from} × ${fmt(f,12)}`], [`1 ${from} = ${fmt(1*f)} ${to}`,`10 ${from} = ${fmt(10*f)} ${to}`,`100 ${from} = ${fmt(100*f)} ${to}`], `Multiply ${from} by ${fmt(f,12)} to get ${to}.`);
}

// Energy
const energy = [
  ['kj-to-joule','Kilojoules to Joules','kJ','J',1000,'1 kJ = 1000 J.'],
  ['joule-to-kj','Joules to Kilojoules','J','kJ',0.001,'1 kJ = 1000 J.'],
  ['kcal-to-cal','Kilocalories to Calories','kcal','cal',1000,'1 kcal = 1000 cal.'],
  ['cal-to-kcal','Calories to Kilocalories','cal','kcal',0.001,'1 kcal = 1000 cal.'],
  ['kcal-to-joule','Kilocalories to Joules','kcal','J',4184,'1 kcal = 4184 J (thermochemical).'],
  ['joule-to-kcal','Joules to Kilocalories','J','kcal',1/4184,'1 kcal = 4184 J (thermochemical).'],
  ['wh-to-mah','Watt-hours to Milliamp-hours','Wh','mAh',null,'Requires voltage: mAh = (Wh × 1000) / V.'],
  ['ah-to-mah','Amp-hours to Milliamp-hours','Ah','mAh',1000,'1 Ah = 1000 mAh.'],
  ['mah-to-ah','Milliamp-hours to Amp-hours','mAh','Ah',0.001,'1 Ah = 1000 mAh.'],
];
for (const item of energy) {
  const [slug,title,from,to,f,note] = item;
  if (f===null) {
    addConv(slug,title,'Energy conversion',`Convert ${from} to ${to}.`,`${from} and ${to} relate through voltage. ${note}`, [`mAh = (Wh × 1000) / V`], [`10 Wh at 5 V = 2000 mAh`,`10 Wh at 3.7 V ≈ 2702.7 mAh`,`1 Wh at 12 V ≈ 83.333 mAh`], note);
  } else {
    addConv(slug,title,'Energy conversion',`Convert ${from} to ${to}.`,`${from} and ${to} are units of energy/charge. ${note}`, [`${to} = ${from} × ${fmt(f,12)}`], [`1 ${from} = ${fmt(1*f)} ${to}`,`10 ${from} = ${fmt(10*f)} ${to}`,`100 ${from} = ${fmt(100*f)} ${to}`], `Multiply ${from} by ${fmt(f,12)} to get ${to}.`);
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
