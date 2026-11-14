import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { SYMBOLS } from '../js/data/symbols.js';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'js/data/symbol-inline.generated.js');
const RAW = path.join(ROOT, 'assets/symbols/commons-raw');
fs.mkdirSync(RAW,{recursive:true});
const sleep=(ms)=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms);

const PREFERRED = {
  lamp: ['Lamp symbol.svg','AmpouleIncandescenceSymbole.svg'],
  pushbuttonNo: ['Push-to-make switch electronic symbol.svg','IEEE push to make switch symbol.svg'],
  pushbuttonNc: ['Push-to-break switch electronic symbol.svg','IEEE push to break switch symbol.svg'],
  dipSwitch: ['DIP switch symbol.svg'],
  solderBridge: ['Solder bridge symbol.svg'],
  relaySpdt: ['SPDT relay symbol.svg','Changeover relay symbol.svg','Relay SPDT.svg'],
  trimmer: ['Trimmer resistor symbol.svg','Preset potentiometer symbol.svg'],
  resistorPot: ['Potentiometer symbol Europe.svg','Potentiometer symbol.svg'],
  switch: ['SPST switch symbol.svg','Switch symbol.svg'],
  switchSpst: ['Switch normally open symbol.svg','Make contact symbol.svg'],
  inductorCore: ['Inductor with iron core symbol.svg'],
  ground: ['Signal ground symbol.svg','IEC 60417 - Ref-No 5020.svg'],
  groundEarth: ['Earth ground symbol.svg','IEC 60417 - Ref-No 5019.svg'],
  dcSource: ['DC voltage source symbol.svg','Voltage Source (DC).svg'],
  acSource: ['AC voltage source symbol.svg'],
  wire: ['Wire symbol.svg'],
  ammeter: ['Ammeter symbol.svg'],
  voltmeter: ['Voltmeter symbol.svg','Lukion taulukot - voltmeter symbol (1993).svg'],
  ohmmeter: ['Ohmmeter symbol.svg'],
  wattmeter: ['Wattmeter symbol.svg'],
  buzzer: ['Buzzer-IEC-Symbol.svg'],
  speaker: ['Loudspeaker symbol.svg'],
  microphone: ['Microphone symbol IEC.svg','IEC MIC.svg'],
  antenna: ['Antenna schematic symbol.svg'],
  motor: ['Electric motor symbol IEC.svg'],
  generator: ['Electric generator symbol.svg'],
  transformer: ['Transformer symbol.svg'],
  crystal: ['Crystal oscillator symbol.svg'],
  optocoupler: ['Optocoupler symbol.svg'],
  thyristor: ['Thyristor symbol.svg'],
  bridgeRectifier: ['Diode bridge symbol.svg'],
  relayCoil: ['Relay coil symbol.svg'],
  thermistor: ['Thermistor symbol.svg'],
};

function apiImageInfo(title){
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent('File:'+title.replace(/^File:/,'')) + '&prop=imageinfo&iiprop=url|extmetadata&format=json&redirects=1';
  const body = execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','20',api],{encoding:'utf8',maxBuffer:10*1024*1024});
  const data = JSON.parse(body);
  for(const p of Object.values(data?.query?.pages||{})){
    const ii=p.imageinfo?.[0];
    if(ii?.url) return {url:ii.url, title:p.title, meta:ii.extmetadata||{}};
  }
  return null;
}
function download(url,out){
  try{ execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','25','-o',out,url],{stdio:'ignore'}); }catch{}
  return fs.existsSync(out)&&fs.statSync(out).size>50;
}
function stripNsAttrs(s){
  return s.replace(/\s+xmlns:[a-z]+="[^"]*"/g,'')
    .replace(/\s+(inkscape|sodipodi|rdf|cc|dc):[a-zA-Z0-9_-]+="[^"]*"/g,'')
    .replace(/<!--[\s\S]*?-->/g,'');
}
function normalizeSvg(svg){
  let vb=null; const m=svg.match(/viewBox\s*=\s*"([^"]+)"/i); if(m) vb=m[1].trim();
  if(!vb){const w=svg.match(/width\s*=\s*"([0-9.]+)"/i); const h=svg.match(/height\s*=\s*"([0-9.]+)"/i); if(w&&h) vb=`0 0 ${w[1]} ${h[1]}`;}
  let inner=svg.replace(/^[\s\S]*?<svg[^>]*>/i,'').replace(/<\/svg>\s*$/i,'');
  inner=inner.replace(/<metadata[\s\S]*?<\/metadata>/gi,'')
    .replace(/<sodipodi:[^>]*\/?>/gi,'')
    .replace(/<sodipodi:[\s\S]*?<\/sodipodi:[^>]*>/gi,'')
    .replace(/<defs>\s*<\/defs>/gi,'')
    .replace(/<title[\s\S]*?<\/title>/gi,'')
    .replace(/<text[\s\S]*?<\/text>/gi,'')
    .replace(/<switch[\s\S]*?<\/switch>/gi,'');
  inner=stripNsAttrs(inner);
  inner=inner.replace(/stroke\s*:\s*(black|#000000|#000|rgb\(0,\s*0,\s*0\))/gi,'stroke:currentColor');
  inner=inner.replace(/fill\s*:\s*(black|#000000|#000|rgb\(0,\s*0,\s*0\))/gi,'fill:currentColor');
  inner=inner.replace(/stroke="(black|#000000|#000)"/gi,'stroke="currentColor"');
  inner=inner.replace(/fill="(black|#000000|#000)"/gi,'fill="currentColor"');
  inner=inner.replace(/<\?xml[\s\S]*?\?>/g,'').replace(/<!DOCTYPE[\s\S]*?>/g,'');
  inner=inner.replace(/\s+/g,' ').trim();
  return {viewBox: vb||'0 0 100 60', inner};
}

const out={};
// seed from existing raw downloads
const seedMap = { lamp:'lamp.svg', pushbuttonNo:'pushbutton-no2.svg', pushbuttonNc:'pushbutton-nc2.svg', groundEarth:'ground-earth-iec.svg', voltmeter:'voltmeter.svg' };
for(const [k,f] of Object.entries(seedMap)){
  const p=path.join(RAW,f); if(fs.existsSync(p)) { const svg=fs.readFileSync(p,'utf8'); out[k]=normalizeSvg(svg); console.log('seed',k); }
}

for(const [key,sym] of Object.entries(SYMBOLS)){
  if(out[key]) continue;
  // use existing local svg asset if it's a real svg file
  const local = path.join(ROOT,'assets/symbols',sym.file);
  if(fs.existsSync(local) && /\.svg$/i.test(local)){
    try{ out[key]=normalizeSvg(fs.readFileSync(local,'utf8')); console.log('local',key); continue; }catch{}
  }
  // try fetch preferred (limited, with delay)
  const titles = PREFERRED[key]||[];
  let got=false;
  for(const t of titles){
    try{
      sleep(600);
      const info=apiImageInfo(t);
      if(!info||!info.url||!/\.svg(\?|$)/i.test(info.url)) continue;
      const rawPath=path.join(RAW,key+'.fetched.svg');
      if(download(info.url,rawPath)){
        out[key]=normalizeSvg(fs.readFileSync(rawPath,'utf8'));
        out[key].source=info.title; out[key].sourceUrl=info.url.split('?')[0];
        console.log('fetched',key,info.title); got=true; break;
      }
    }catch(e){}
  }
  if(!got && !out[key]) console.log('miss',key);
}
const lines=[];
lines.push('// Generated by scripts/build-inline-quick.mjs — inline SVG geometry (Commons-sourced where available)');
lines.push('export const SYMBOL_INLINE = ' + JSON.stringify(out,null,2) + ';');
fs.writeFileSync(OUT, lines.join('\n'));
console.log('wrote',Object.keys(out).length);
