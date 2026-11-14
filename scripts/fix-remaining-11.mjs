import { execFileSync } from 'node:child_process';
import fs from 'fs';
import path from 'path';
import { SYMBOLS } from '../js/data/symbols.js';

const ROOT = process.cwd();
const ASSETS = path.join(ROOT,'assets/symbols');
const RAW = path.join(ASSETS,'commons-raw');
const INLINE_PATH = path.join(ROOT,'js/data/symbol-inline.generated.js');
const SYMBOLS_PATH = path.join(ROOT,'js/data/symbols.js');
fs.mkdirSync(RAW,{recursive:true});
const sleep=(ms)=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms);

const nameMap = {dipSwitch:'dip-switch.svg',solderBridge:'solder-bridge.svg'};

const queries = {
  dipSwitch: ['DIP switch symbol.svg','Dual in-line package switch symbol.svg','8 switch DIP symbol.svg'],
  solderBridge: ['Solder bridge symbol.svg','Solder jumper symbol.svg','PCB jumper symbol.svg'],
  optocoupler: ['Optocoupler symbol.svg','Optoisolator symbol.svg','Photocoupler schematic symbol.svg'],
  crystal: ['Crystal oscillator symbol.svg','Quartz crystal symbol.svg','Piezoelectric crystal symbol.svg'],
  ammeter: ['Ammeter symbol.svg','Ammeter circuit symbol.svg'],
  ohmmeter: ['Ohmmeter symbol.svg','Ohmmeter circuit symbol.svg'],
  wattmeter: ['Wattmeter symbol.svg','Wattmeter circuit symbol.svg'],
  speaker: ['Loudspeaker symbol.svg','Speaker symbol IEC.svg'],
  microphone: ['Microphone symbol.svg','IEC microphone symbol.svg'],
  motor: ['Electric motor symbol.svg','DC motor symbol.svg','Motor IEC symbol.svg'],
  generator: ['Electric generator symbol.svg','Generator AC symbol.svg','Dynamo symbol.svg'],
};

function api(url){ return execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','25',url],{encoding:'utf8',maxBuffer:10*1024*1024}); }
function searchTitles(query){ const u='https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&format=json&srlimit=10&srsearch='+encodeURIComponent(query); try{ const d=JSON.parse(api(u)); return (d?.query?.search||[]).map(x=>x.title); }catch{ return []; } }
function imageInfo(title){ const u='https://commons.wikimedia.org/w/api.php?action=query&titles='+encodeURIComponent(title)+'&prop=imageinfo&iiprop=url|extmetadata&format=json&redirects=1'; try{ const d=JSON.parse(api(u)); for(const p of Object.values(d?.query?.pages||{})){ const ii=p.imageinfo?.[0]; if(ii?.url) return {url:ii.url.split('?')[0], title:p.title, meta:ii.extmetadata||{}}; } }catch{} return null; }
function download(url,out){ try{ execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','30','-o',out,url],{stdio:'pipe'}); }catch{ return false; } return fs.existsSync(out)&&fs.statSync(out).size>60; }
function normalizeSvg(svg){ let vb=null; const m=svg.match(/viewBox\s*=\s*"([^"]+)"/i); if(m) vb=m[1].trim(); if(!vb){const w=svg.match(/\bwidth\s*=\s*"([0-9.]+)/i); const h=svg.match(/\bheight\s*=\s*"([0-9.]+)/i); if(w&&h) vb=`0 0 ${w[1]} ${h[1]}`;} let inner=svg.replace(/^[\s\S]*?<svg[^>]*>/i,'').replace(/<\/svg>\s*$/i,''); inner=inner.replace(/<metadata[\s\S]*?<\/metadata>/gi,'').replace(/<sodipodi:namedview[\s\S]*?(?:\/>|<\/sodipodi:namedview>)/gi,'').replace(/<defs>\s*<\/defs>/gi,'').replace(/<title[\s\S]*?<\/title>/gi,'').replace(/<desc[\s\S]*?<\/desc>/gi,'').replace(/<text[\s\S]*?<\/text>/gi,'').replace(/<switch[\s\S]*?<\/switch>/gi,''); inner=inner.replace(/<!--[\s\S]*?-->/g,'').replace(/\s+(inkscape|sodipodi|rdf|cc|dc):[a-zA-Z0-9_-]+="[^"]*"/g,''); inner=inner.replace(/stroke\s*:\s*(black|#000000|#000|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))/gi,'stroke:currentColor').replace(/fill\s*:\s*(black|#000000|#000|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))/gi,'fill:currentColor').replace(/stroke="(black|#000000|#000)"/gi,'stroke="currentColor"').replace(/fill="(black|#000000|#000)"/gi,'fill="currentColor"').replace(/<\?xml[\s\S]*?\?>/g,'').replace(/<!DOCTYPE[\s\S]*?>/g,'').replace(/\s+/g,' ').trim(); return {viewBox: vb||'0 0 100 60', inner}; }
function clean(v){ return (v?.value||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim(); }

let inlineData = {};
try { const mod = await import('file:///'+INLINE_PATH.replace(/\\/g,'/')); inlineData = mod.SYMBOL_INLINE || {}; } catch {}
let symSrc = fs.readFileSync(SYMBOLS_PATH,'utf8');
const results = {};

for (const [key, qlist] of Object.entries(queries)){
  if (inlineData[key]) { console.log('skip', key); continue; }
  let ok=false;
  const tried = new Set();
  for (const q of qlist){
    sleep(1600);
    const titles = searchTitles(q);
    for (const t of titles){
      if (tried.has(t)) continue; tried.add(t);
      if (!/\.svg$/i.test(t)) continue;
      // avoid obviously irrelevant results
      if (/flag|coat|logo|icon|map/i.test(t) && !/symbol|schematic|circuit|electr/i.test(t)) continue;
      sleep(900);
      const info = imageInfo(t);
      if(!info || !/\.svg$/i.test(info.url)) continue;
      const raw = path.join(RAW, key+'.svg');
      if(!download(info.url, raw)) continue;
      const svg = fs.readFileSync(raw,'utf8');
      const norm = normalizeSvg(svg);
      if(!norm.inner || norm.inner.length < 20) continue;
      const assetName = nameMap[key] || (key+'.svg');
      fs.copyFileSync(raw, path.join(ASSETS, assetName));
      fs.writeFileSync(path.join(ASSETS, assetName+'.meta.json'), JSON.stringify(info,null,2));
      inlineData[key] = { viewBox: norm.viewBox, inner: norm.inner, source: info.title, sourceUrl: info.url };
      const author = clean(info.meta.Artist) || 'Wikimedia Commons contributors';
      const license = clean(info.meta.LicenseShortName) || 'see source';
      const page = 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(info.title.replace(/ /g,'_'));
      symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*file:\\s*')[^']+(')`), `$1${assetName}$2`);
      symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*source:\\s*')[^']*(')`), `$1Wikimedia Commons: ${info.title.replace(/^File:/,'').replace(/'/g,"\\'")}$2`);
      symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*author:\\s*')[^']*(')`), `$1${author.replace(/'/g,"\\'").slice(0,120)}$2`);
      symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*license:\\s*')[^']*(')`), `$1${license.replace(/'/g,"\\'").slice(0,80)}$2`);
      symSrc = symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*licenseUrl:\\s*')[^']*(')`), `$1${page}$2`);
      results[key]=info.title;
      console.log('OK', key, '<-', info.title);
      ok=true; break;
    }
    if(ok) break;
  }
  if(!ok) console.log('MISS', key);
}

fs.writeFileSync(INLINE_PATH, '// Generated from Commons-sourced SVG assets\nexport const SYMBOL_INLINE = ' + JSON.stringify(inlineData, null, 2) + ';\n');
fs.writeFileSync(SYMBOLS_PATH, symSrc);
console.log('fixed', Object.keys(results).length, 'total inline', Object.keys(inlineData).length);
