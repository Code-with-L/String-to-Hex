import fs from 'fs';
import path from 'path';

const symbolsPath = 'js/data/symbols.js';
let src = fs.readFileSync(symbolsPath, 'utf8');
const pic = 'assets/symbols/source-from-folder';
const base = 'assets/symbols';
const pics = fs.existsSync(pic) ? fs.readdirSync(pic) : [];
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const hintsMap = {
  inductorCore: ['inductoriron','inductor core','inductor'],
  pushbuttonNo: ['switch','relayspst'],
  pushbuttonNc: ['switch'],
  relaySpdt: ['relayspdt','relay spdt','relay'],
  ground: ['grounddigital','ground digital','ground'],
  groundEarth: ['groundearth','ground earth'],
  dcSource: ['batterycell','battery'],
  acSource: ['oscillatorcrystal','oscillator'],
  lamp: ['lamp'],
  wire: ['wire'],
  trimmer: ['trimmerresistor','trimmer','potentiometer'],
  thermistor: ['photoresistor','resistor'],
  dipSwitch: ['dipswitch','dip'],
  solderBridge: ['solder','wire'],
  relayCoil: ['relayspst','relay'],
  thyristor: ['zenerdiode','diode'],
  opAmp: ['operationalamplifier','opamp','amplifier'],
  optocoupler: ['photodiode','led'],
  crystal: ['oscillatorcrystal','crystal'],
  transformer: ['transformer'],
  bridgeRectifier: ['diode'],
  ammeter: ['ammeter'],
  voltmeter: ['voltmeter'],
  ohmmeter: ['ohmmeter'],
  wattmeter: ['wattmeter'],
  buzzer: ['buzzer'],
  speaker: ['speaker'],
  microphone: ['microphone'],
  antenna: ['antenna'],
  motor: ['electricmotor','motor'],
  generator: ['motor','electricmotor'],
};

function keyForFile(file){
  const m = src.match(new RegExp(`(\\w+):\\s*\\{[^}]*file:\\s*'${file.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}'`));
  return m ? m[1] : null;
}

// build map of existing keys missing assets
const missing = [];
for (const line of src.split('\n')) {
  const km = line.match(/^\s*(\w+):\s*\{.*file:\s*'([^']+)'/);
  if (!km) continue;
  const k = km[1], f = km[2];
  const p = path.join(base,f);
  if (!fs.existsSync(p) || fs.statSync(p).size < 50) missing.push([k,f]);
}

let filled=0;
for (const [k,f] of missing) {
  const hints = (hintsMap[k]||[k]).map(norm);
  let found=null, score=0;
  for (const p of pics) {
    const np = norm(path.parse(p).name);
    for (const h of hints) {
      if (np.includes(h) || h.includes(np)) { if (h.length>score){score=h.length; found=p;} }
    }
  }
  if (found) {
    const ext = path.extname(found).toLowerCase();
    const destName = path.parse(f).name + ext; // e.g. inductor-core.gif
    fs.copyFileSync(path.join(pic,found), path.join(base,destName));
    // patch symbols.js file field for this key
    const re = new RegExp(`(${k}:\\s*\\{[^}]*file:\\s*')${f.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(')`);
    if (re.test(src)) { src = src.replace(re, `$1${destName}$2`); }
    // append note in source field
    console.log('FALLBACK', k, '->', destName, 'from', found);
    filled++;
  } else {
    console.log('NOFALLBACK', k, f);
  }
}
fs.writeFileSync(symbolsPath, src);
console.log('filled', filled, 'missing was', missing.length);
