import { execFileSync } from 'node:child_process';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ASSETS = path.join(ROOT,'assets/symbols');
const RAW = path.join(ASSETS,'commons-raw');
const INLINE_PATH = path.join(ROOT,'js/data/symbol-inline.generated.js');
const SYMBOLS_PATH = path.join(ROOT,'js/data/symbols.js');
fs.mkdirSync(RAW,{recursive:true});
const sleep=(ms)=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms);

const CANDIDATES = {
  trimmer: ['Trimmer resistor symbol.svg','Preset resistor symbol.svg','Potentiometer trimmer symbol.svg','Variable resistor preset.svg','Trimmer potentiometer.svg'],
  dipSwitch: ['DIP switch symbol.svg','Switch DIP.svg','DIP-switch.svg'],
  solderBridge: ['Solder bridge symbol.svg','Solder jumper symbol.svg','Solder bridge.svg','Net tie symbol.svg'],
  switchSpst: ['Switch normally open symbol.svg','Make contact symbol.svg','SPST-NO symbol.svg','IEEE 315 Contacts, Switches, Contactors, and Relays Symbols (104).svg','Symbol Threshold switch (Normally open contact).svg'],
  inductorCore: ['Inductor with iron core symbol.svg','Iron core inductor.svg','Choke symbol.svg'],
  ground: ['Signal ground symbol.svg','IEC 60417 - Ref-No 5020.svg','Earth ground symbol.svg'],
  acSource: ['AC voltage source.svg','Voltage Source (AC).svg'],
  wire: ['Conductor symbol.svg','Wire symbol.svg'],
  crystal: ['Crystal oscillator symbol.svg','Crystal.svg'],
  optocoupler: ['Optocoupler symbol.svg','Opto-isolator.svg'],
  relayCoil: ['Relay coil symbol.svg','Electromagnet coil symbol.svg'],
  ammeter: ['Ammeter symbol.svg'],
  ohmmeter: ['Ohmmeter symbol.svg'],
  wattmeter: ['Wattmeter symbol.svg'],
  speaker: ['Loudspeaker symbol.svg','Speaker symbol.svg'],
  microphone: ['Microphone symbol.svg','IEC MIC.svg'],
  antenna: ['Antenna symbol.svg','Antenna schematic symbol.svg'],
  motor: ['Motor symbol.svg','Electric motor symbol.svg'],
  generator: ['Generator symbol.svg','Electric generator symbol.svg'],
};

function apiInfo(title){
  const u='https://commons.wikimedia.org/w/api.php?action=query&titles='+encodeURIComponent('File:'+title.replace(/^File:/,''))+'&prop=imageinfo&iiprop=url|extmetadata&format=json&redirects=1';
  const b=execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','20',u],{encoding:'utf8',maxBuffer:10*1024*1024});
  const d=JSON.parse(b);
  for(const p of Object.values(d?.query?.pages||{})){
    const ii=p.imageinfo?.[0];
    if(ii?.url) return {url:ii.url.split('?')[0], title:p.title, meta:ii.extmetadata||{}, pageid:p.pageid};
  }
  return null;
}
function download(url,out){
  try{ execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','30','-o',out,url],{stdio:'pipe'}); }catch(e){ return false; }
  return fs.existsSync(out)&&fs.statSync(out).size>60;
}
function stripNsAttrs(s){
  return s.replace(/\s+xmlns:[a-z0-9]+="[^"]*"/gi,'')
    .replace(/\s+(inkscape|sodipodi|rdf|cc|dc):[a-zA-Z0-9_-]+="[^"]*"/g,'')
    .replace(/<!--[\s\S]*?-->/g,'');
}
function normalizeSvg(svg){
  let vb=null; const m=svg.match(/viewBox\s*=\s*"([^"]+)"/i); if(m) vb=m[1].trim();
  if(!vb){const w=svg.match(/\bwidth\s*=\s*"([0-9.]+)/i); const h=svg.match(/\bheight\s*=\s*"([0-9.]+)/i); if(w&&h) vb=`0 0 ${w[1]} ${h[1]}`;}
  let inner=svg.replace(/^[\s\S]*?<svg[^>]*>/i,'').replace(/<\/svg>\s*$/i,'');
  inner=inner.replace(/<metadata[\s\S]*?<\/metadata>/gi,'')
    .replace(/<sodipodi:namedview[\s\S]*?(?:\/>|<\/sodipodi:namedview>)/gi,'')
    .replace(/<defs>\s*<\/defs>/gi,'')
    .replace(/<title[\s\S]*?<\/title>/gi,'')
    .replace(/<desc[\s\S]*?<\/desc>/gi,'')
    .replace(/<text[\s\S]*?<\/text>/gi,'')
    .replace(/<switch[\s\S]*?<\/switch>/gi,'');
  inner=stripNsAttrs(inner);
  inner=inner.replace(/stroke\s*:\s*(black|#000000|#000|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))/gi,'stroke:currentColor')
    .replace(/fill\s*:\s*(black|#000000|#000|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))/gi,'fill:currentColor')
    .replace(/stroke="(black|#000000|#000)"/gi,'stroke="currentColor"')
    .replace(/fill="(black|#000000|#000)"/gi,'fill="currentColor"')
    .replace(/<\?xml[\s\S]*?\?>/g,'').replace(/<!DOCTYPE[\s\S]*?>/g,'')
    .replace(/\s+/g,' ').trim();
  return {viewBox: vb||'0 0 100 60', inner};
}
function cleanMetaText(v){ return (v?.value||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim(); }

let inlineData = {};
try { const mod = await import('file:///'+INLINE_PATH.replace(/\\/g,'/')); inlineData = mod.SYMBOL_INLINE || {}; } catch { inlineData = {}; }

const nameMap = {resistorPot:'potentiometer.svg', fet:'fet-n.svg', switchSpst:'switch-spst.svg', switchSpdt:'switch-spdt.svg', capacitorPol:'capacitor-polarized.svg', inductorCore:'inductor-core.svg', groundEarth:'ground-earth.svg', dcSource:'dc-source.svg', acSource:'ac-source.svg', pushbuttonNo:'pushbutton-no.svg', pushbuttonNc:'pushbutton-nc.svg', relaySpdt:'relay-spdt.svg', resistorUs:'resistor-ansi.svg', dipSwitch:'dip-switch.svg', solderBridge:'solder-bridge.svg', relayCoil:'relay-coil.svg', bridgeRectifier:'bridge-rectifier.svg', opAmp:'opamp.svg'};
const results = {};
for (const [key, titles] of Object.entries(CANDIDATES)){
  let ok=false;
  for (const t of titles){
    try{
      sleep(1200);
      const info = apiInfo(t);
      if(!info || !/\.svg$/i.test(info.url)) continue;
      const raw = path.join(RAW, key+'.svg');
      if(!download(info.url, raw)) continue;
      const svg = fs.readFileSync(raw,'utf8');
      const norm = normalizeSvg(svg);
      if(!norm.inner) continue;
      const assetName = nameMap[key] || (key + '.svg');
      fs.copyFileSync(raw, path.join(ASSETS, assetName));
      fs.writeFileSync(path.join(ASSETS, assetName+'.meta.json'), JSON.stringify(info,null,2));
      inlineData[key] = { viewBox: norm.viewBox, inner: norm.inner, source: info.title, sourceUrl: info.url };
      results[key] = { asset: assetName, title: info.title, url: info.url, author: cleanMetaText(info.meta.Artist) || 'Wikimedia Commons contributors', license: cleanMetaText(info.meta.LicenseShortName) || 'see source' };
      console.log('OK', key, '->', info.title);
      ok=true; break;
    }catch(e){}
  }
  if(!ok) console.log('MISS', key);
}
fs.writeFileSync(INLINE_PATH, '// Generated from Commons-sourced SVG assets\nexport const SYMBOL_INLINE = ' + JSON.stringify(inlineData, null, 2) + ';\n');
let symSrc = fs.readFileSync(SYMBOLS_PATH,'utf8');
for(const [key,res] of Object.entries(results)){
  symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*file:\\s*')[^']+(')`), `$1${res.asset}$2`);
  symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*source:\\s*')[^']*(')`), `$1Wikimedia Commons: ${res.title.replace(/^File:/,'')}$2`);
  symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*author:\\s*')[^']*(')`), `$1${(res.author||'Wikimedia Commons contributors').replace(/'/g,"\\'").slice(0,120)}$2`);
  symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*license:\\s*')[^']*(')`), `$1${(res.license||'see source').replace(/'/g,"\\'").slice(0,80)}$2`);
  const pageUrl = 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(res.title.replace(/ /g,'_'));
  symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*licenseUrl:\\s*')[^']*(')`), `$1${pageUrl}$2`);
}
fs.writeFileSync(SYMBOLS_PATH, symSrc);
console.log('updated inline:', Object.keys(inlineData).length, 'fixed:', Object.keys(results).length);
