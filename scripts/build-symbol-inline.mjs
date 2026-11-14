import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { SYMBOLS } from '../js/data/symbols.js';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'js/data/symbol-inline.generated.js');
const RAW = path.join(ROOT, 'assets/symbols/commons-raw');
fs.mkdirSync(RAW, { recursive: true });
const sleep = (ms)=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms);

// Preferred Commons file titles per symbol key (verified/targeted where possible)
const PREFERRED = {
  lamp: ['Lamp symbol.svg','AmpouleIncandescenceSymbole.svg','Lamp symbol, old.svg'],
  pushbuttonNo: ['Push-to-make switch electronic symbol.svg','IEEE push to make switch symbol.svg','Switch (push-to-make).svg'],
  pushbuttonNc: ['Push-to-break switch electronic symbol.svg','IEEE push to break switch symbol.svg','Switch (push-to-break).svg'],
  dipSwitch: ['DIP switch symbol.svg','DIP switch 01.svg'],
  solderBridge: ['Solder bridge symbol.svg','Solder jumper.svg'],
  relaySpdt: ['SPDT relay symbol.svg','Relay SPDT symbol.svg','Changeover relay symbol.svg'],
  trimmer: ['Trimmer resistor symbol.svg','Preset potentiometer symbol.svg','Variable resistor preset symbol.svg'],
  resistorPot: ['Potentiometer symbol Europe.svg','Potentiometer symbol IEC.svg'],
  inductorCore: ['Inductor with iron core symbol.svg','Iron core inductor symbol.svg'],
  ground: ['Signal ground symbol.svg','IEC 60417 - Ref-No 5020.svg'],
  groundEarth: ['Earth ground symbol.svg','IEC 60417 - Ref-No 5019.svg','IEC 60417 - Ref-No 5017.svg'],
  dcSource: ['Voltage source DC symbol.svg','Battery symbol 2.svg'],
  acSource: ['AC voltage source symbol.svg'],
  wire: ['Wire symbol.svg','Conductor symbol.svg'],
  ammeter: ['Ammeter symbol.svg','Lukion taulukot - ammeter symbol (1993).svg'],
  voltmeter: ['Voltmeter symbol.svg','Lukion taulukot - voltmeter symbol (1993).svg'],
  ohmmeter: ['Ohmmeter symbol.svg','Lukion taulukot - ohmmeter symbol (1993).svg'],
  wattmeter: ['Wattmeter symbol.svg'],
  buzzer: ['Buzzer-IEC-Symbol.svg','Buzzer symbol.svg'],
  speaker: ['Loudspeaker symbol.svg','Lukion taulukot - loudspeaker symbol (1993).svg'],
  microphone: ['Microphone symbol IEC.svg','IEC MIC.svg'],
  antenna: ['Antenna schematic symbol.svg','Antenna symbol.svg'],
  motor: ['Electric motor symbol IEC.svg','Motor symbol.svg'],
  generator: ['Electric generator symbol.svg','Generator symbol.svg'],
  transformer: ['Transformer symbol.svg','Transformer 2.svg'],
  crystal: ['Crystal oscillator symbol.svg','Crystal symbol.svg'],
  optocoupler: ['Optocoupler symbol.svg','Opto-isolator symbol.svg'],
  thyristor: ['Thyristor symbol.svg','SCR symbol.svg'],
  bridgeRectifier: ['Diode bridge symbol.svg','Bridge rectifier symbol.svg'],
  relayCoil: ['Relay coil symbol.svg','Electromagnetic coil symbol.svg'],
  thermistor: ['Thermistor symbol.svg','Thermistor NTC symbol.svg'],
  // fix duplicates: switch (SPST generic) vs switchSpst (normally open)
  switch: ['SPST switch symbol.svg','Switch symbol.svg','Switch open symbol.svg'],
  switchSpst: ['Switch normally open symbol.svg','NO contact symbol.svg','Switch make contact symbol.svg'],
  switchSpdt: ['SPDT switch symbol.svg','Changeover switch symbol.svg'],
};

function apiImageInfo(title){
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent('File:'+title.replace(/^File:/,'')) + '&prop=imageinfo&iiprop=url|extmetadata&format=json&redirects=1';
  const body = execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0',api],{encoding:'utf8',maxBuffer:10*1024*1024});
  const data = JSON.parse(body);
  for(const p of Object.values(data?.query?.pages||{})){
    const ii=p.imageinfo?.[0];
    if(ii?.url) return {url:ii.url, title:p.title, meta:ii.extmetadata||{}};
  }
  return null;
}

function download(url,out){
  execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','30','-o',out,url],{stdio:'ignore'});
  return fs.existsSync(out) && fs.statSync(out).size>50;
}

function stripNsAttrs(s){
  return s
    .replace(/\s+xmlns:[a-z]+="[^"]*"/g,'')
    .replace(/\s+(inkscape|sodipodi|rdf|cc|dc):[a-zA-Z0-9_-]+="[^"]*"/g,'')
    .replace(/\s+id="[^"]*"/g,'')
    .replace(/<!--[\s\S]*?-->/g,'');
}

function normalizeSvg(svg){
  // get viewBox
  let vb = null;
  const m = svg.match(/viewBox\s*=\s*"([^"]+)"/i);
  if (m) vb = m[1].trim();
  if(!vb){
    const w = svg.match(/width\s*=\s*"([0-9.]+)([^"]*)"/i);
    const h = svg.match(/height\s*=\s*"([0-9.]+)([^"]*)"/i);
    if(w&&h) vb = `0 0 ${w[1]} ${h[1]}`;
  }
  // extract inner of svg
  let inner = svg.replace(/^[\s\S]*?<svg[^>]*>/i,'').replace(/<\/svg>\s*$/i,'');
  inner = inner.replace(/<metadata[\s\S]*?<\/metadata>/gi,'');
  inner = inner.replace(/<sodipodi:[^>]*\/>/gi,'');
  inner = inner.replace(/<sodipodi:[\s\S]*?<\/sodipodi:[^>]*>/gi,'');
  inner = inner.replace(/<defs>\s*<\/defs>/gi,'');
  inner = inner.replace(/<title[\s\S]*?<\/title>/gi,'');
  inner = inner.replace(/<text[\s\S]*?<\/text>/gi,''); // remove labels for clean schematic
  inner = inner.replace(/<switch[\s\S]*?<\/switch>/gi,'');
  inner = stripNsAttrs(inner);
  // color normalization
  inner = inner.replace(/stroke\s*:\s*(black|#000000|#000|rgb\(0,\s*0,\s*0\))/gi,'stroke:currentColor');
  inner = inner.replace(/fill\s*:\s*(black|#000000|#000|rgb\(0,\s*0,\s*0\))/gi,'fill:currentColor');
  inner = inner.replace(/stroke="(black|#000000|#000)"/gi,'stroke="currentColor"');
  inner = inner.replace(/fill="(black|#000000|#000)"/gi,'fill="currentColor"');
  inner = inner.replace(/stroke="none"/gi,'stroke="none"');
  // remove xml declarations remnants
  inner = inner.replace(/<\?xml[\s\S]*?\?>/g,'');
  inner = inner.replace(/<!DOCTYPE[\s\S]*?>/g,'');
  inner = inner.replace(/\s+/g,' ').trim();
  return { viewBox: vb || '0 0 100 60', inner };
}

async function main(){
  const out = {};
  for(const [key, sym] of Object.entries(SYMBOLS)){
    const titles = PREFERRED[key] || [];
    let svgText = null; let usedTitle = null; let usedUrl = null; let meta = {};
    // try preferred commons files
    for(const t of titles){
      try{
        sleep(700);
        const info = apiImageInfo(t);
        if(!info || !info.url || !/\.svg(\?|$)/i.test(info.url)) continue;
        const rawPath = path.join(RAW, key + '.svg');
        if(download(info.url, rawPath)){
          svgText = fs.readFileSync(rawPath,'utf8');
          usedTitle = info.title; usedUrl = info.url.split('?')[0]; meta = info.meta || {};
          break;
        }
      }catch(e){}
    }
    // fallback: existing local svg file if any
    if(!svgText){
      const local = path.join(ROOT,'assets/symbols', sym.file);
      if(fs.existsSync(local) && /\.svg$/i.test(local)){
        try{ svgText = fs.readFileSync(local,'utf8'); usedTitle = sym.source; usedUrl = sym.licenseUrl; }catch{}
      }
    }
    if(svgText){
      const norm = normalizeSvg(svgText);
      out[key] = {
        viewBox: norm.viewBox,
        inner: norm.inner,
        source: usedTitle || sym.source,
        sourceUrl: usedUrl || sym.licenseUrl,
        author: (meta.Artist?.value||'').replace(/<[^>]+>/g,'').trim() || sym.author || '',
        license: (meta.LicenseShortName?.value||'').replace(/<[^>]+>/g,'').trim() || sym.license || '',
      };
      console.log('inline', key, 'ok');
    } else {
      console.log('inline', key, 'MISS');
    }
  }
  const lines = [];
  lines.push('// Generated by scripts/build-symbol-inline.mjs — Commons-sourced inline SVG geometry');
  lines.push('export const SYMBOL_INLINE = ' + JSON.stringify(out, null, 2) + ';');
  fs.writeFileSync(OUT, lines.join('\n'));
  console.log('wrote', OUT, Object.keys(out).length);
}
main().catch(e=>{console.error(e); process.exit(1);});
