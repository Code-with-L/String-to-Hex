import { info, download, clean } from './search-commons.mjs';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ASSETS = path.join(ROOT, 'assets/symbols');
const RAW = path.join(ASSETS, 'commons-raw');
const INLINE_PATH = path.join(ROOT, 'js/data/symbol-inline.generated.js');
const SYMBOLS_PATH = path.join(ROOT, 'js/data/symbols.js');
fs.mkdirSync(RAW, { recursive: true });

const nameMap = {
  inductorCore:'inductor-core.svg', dipSwitch:'dip-switch.svg', solderBridge:'solder-bridge.svg',
  relayCoil:'relay-coil.svg', trimmer:'trimmer.svg', opAmp:'opamp.svg', bridgeRectifier:'bridge-rectifier.svg',
  resistorPot:'potentiometer.svg', fet:'fet-n.svg', switchSpst:'switch-spst.svg', switchSpdt:'switch-spdt.svg',
  capacitorPol:'capacitor-polarized.svg', groundEarth:'ground-earth.svg', dcSource:'dc-source.svg', acSource:'ac-source.svg',
  pushbuttonNo:'pushbutton-no.svg', pushbuttonNc:'pushbutton-nc.svg', relaySpdt:'relay-spdt.svg', resistorUs:'resistor-ansi.svg',
};

function normalizeSvg(svg){
  let vb=null; const m=svg.match(/viewBox\s*=\s*"([^"]+)"/i); if(m) vb=m[1].trim();
  if(!vb){const w=svg.match(/\bwidth\s*=\s*"([0-9.]+)/i); const h=svg.match(/\bheight\s*=\s*"([0-9.]+)/i); if(w&&h) vb=`0 0 ${w[1]} ${h[1]}`;}
  let inner=svg.replace(/^[\s\S]*?<svg[^>]*>/i,'').replace(/<\/svg>\s*$/i,'');
  inner=inner.replace(/<metadata[\s\S]*?<\/metadata>/gi,'').replace(/<sodipodi:namedview[\s\S]*?(?:\/>|<\/sodipodi:namedview>)/gi,'').replace(/<defs>\s*<\/defs>/gi,'').replace(/<title[\s\S]*?<\/title>/gi,'').replace(/<desc[\s\S]*?<\/desc>/gi,'').replace(/<text[\s\S]*?<\/text>/gi,'').replace(/<switch[\s\S]*?<\/switch>/gi,'');
  inner=inner.replace(/<!--[\s\S]*?-->/g,'').replace(/\s+(inkscape|sodipodi|rdf|cc|dc):[a-zA-Z0-9_-]+="[^"]*"/g,'');
  inner=inner.replace(/stroke\s*:\s*(black|#000000|#000|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))/gi,'stroke:currentColor')
    .replace(/fill\s*:\s*(black|#000000|#000|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))/gi,'fill:currentColor')
    .replace(/stroke="(black|#000000|#000)"/gi,'stroke="currentColor"')
    .replace(/fill="(black|#000000|#000)"/gi,'fill="currentColor"')
    .replace(/stroke\s*:\s*#[0-3][0-3][0-3](?![0-9a-fA-F])/gi,'stroke:currentColor')
    .replace(/<\?xml[\s\S]*?\?>/g,'').replace(/<!DOCTYPE[\s\S]*?>/g,'').replace(/\s+/g,' ').trim();
  return {viewBox: vb||'0 0 100 60', inner};
}

function isPlausibleSvg(svg, key) {
  if (!/<svg/i.test(svg)) return false;
  if (/<image[\s>]/i.test(svg)) return false; // raster embed
  // must have some drawing primitives
  if (!/<(path|line|rect|circle|ellipse|polyline|polygon|g)\b/i.test(svg)) return false;
  return true;
}

// Curated candidates (ordered). Only applied after fetch+verify.
const CANDIDATES = {
  wire: [
    'File:IEEE 315 Transmission Path Symbols (1).svg',
    'File:Conductor line symbol.svg',
  ],
  trimmer: [
    'File:Preset resistor symbol too.svg',
    'File:Variable resistor preset.svg',
    'File:IEC 60417 - Ref-No 5162.svg', // adjustability (last resort?) no - avoid
  ],
  relayCoil: [
    'File:Relay coil, general symbol.svg',
    'File:IEC Relay Coil.svg',
    'File:Relais-spule.svg',
  ],
  dipSwitch: [
    'File:DIP switch symbol.svg',
    'File:DIP-switch.svg',
  ],
  solderBridge: [
    'File:Solder bridge symbol.svg',
    'File:Solder jumper symbol.svg',
  ],
  optocoupler: [
    'File:Optocoupler symbol.svg',
    'File:Opto-isolator.svg',
    'File:Optoisolator.svg',
  ],
  crystal: [
    'File:Crystal symbol.svg',
    'File:Crystal-oscillator.svg',
    'File:IEEE 315 Fundamental Items Symbols (79).svg',
  ],
  ammeter: [
    'File:Ammeter symbol.svg',
    'File:Ammeter.svg',
  ],
  ohmmeter: [
    'File:Ohmmeter symbol.svg',
    'File:Ohmmeter.svg',
  ],
  wattmeter: [
    'File:Wattmeter symbol.svg',
    'File:Wattmeter.svg',
  ],
  speaker: [
    'File:Loudspeaker symbol.svg',
    'File:Speaker symbol.svg',
    'File:Loudspeaker.svg',
  ],
  microphone: [
    'File:Microphone symbol.svg',
    'File:Mic-IEC-Symbol.svg',
  ],
  motor: [
    'File:Motor symbol.svg',
    'File:Electric motor symbol.svg',
  ],
  generator: [
    'File:Generator symbol.svg',
    'File:Electric generator symbol.svg',
  ],
};

let inlineData = {};
try { const mod = await import('file:///'+INLINE_PATH.replace(/\\/g,'/')); inlineData = mod.SYMBOL_INLINE || {}; } catch {}
let symSrc = fs.readFileSync(SYMBOLS_PATH, 'utf8');
const results = {};

const keys = process.argv.slice(2);
const todo = keys.length ? keys : Object.keys(CANDIDATES);

for (const key of todo) {
  const titles = CANDIDATES[key];
  if (!titles) { console.log('NOCANDS', key); continue; }
  let ok = false;
  for (const t of titles) {
    const i = info(t);
    if (!i) { console.log('NOINFO', key, t); continue; }
    if (!/\.svg$/i.test(i.url)) { console.log('NOSVG', key, t, i.url); continue; }
    const raw = path.join(RAW, key + '.svg');
    if (!download(i.url, raw)) { console.log('DLFAIL', key, t); continue; }
    const svg = fs.readFileSync(raw, 'utf8');
    if (!isPlausibleSvg(svg, key)) { console.log('IMPLAUSIBLE', key, t); continue; }
    const norm = normalizeSvg(svg);
    if (!norm.inner || norm.inner.length < 15) { console.log('EMPTY', key, t); continue; }
    const assetName = nameMap[key] || (key + '.svg');
    fs.copyFileSync(raw, path.join(ASSETS, assetName));
    fs.writeFileSync(path.join(ASSETS, assetName + '.meta.json'), JSON.stringify(i, null, 2));
    inlineData[key] = { viewBox: norm.viewBox, inner: norm.inner, source: i.title, sourceUrl: i.url };
    const author = clean(i.meta.Artist) || 'Wikimedia Commons contributors';
    const license = clean(i.meta.LicenseShortName) || 'see source';
    const page = 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(i.title.replace(/ /g,'_'));
    symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*file:\\s*')[^']+(')`), `$1${assetName}$2`);
    symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*source:\\s*')[^']*(')`), `$1Wikimedia Commons: ${i.title.replace(/^File:/,'').replace(/'/g,"\\'")}$2`);
    symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*author:\\s*')[^']*(')`), `$1${author.replace(/'/g,"\\'").slice(0,120)}$2`);
    symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*license:\\s*')[^']*(')`), `$1${license.replace(/'/g,"\\'").slice(0,80)}$2`);
    symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*licenseUrl:\\s*')[^']*(')`), `$1${page}$2`);
    results[key] = i.title;
    console.log('APPLIED', key, '<-', i.title, '|', i.url);
    ok = true; break;
  }
  if (!ok) console.log('MISS', key);
}

fs.writeFileSync(INLINE_PATH, '// Generated from Commons-sourced SVG assets\nexport const SYMBOL_INLINE = ' + JSON.stringify(inlineData, null, 2) + ';\n');
fs.writeFileSync(SYMBOLS_PATH, symSrc);
console.log('fixed', Object.keys(results).length, 'total inline', Object.keys(inlineData).length);
