import fs from 'fs';
import path from 'path';
import { SYMBOLS } from '../js/data/symbols.js';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'js/data/symbol-inline.generated.js');
function stripNsAttrs(s){return s.replace(/\s+xmlns:[a-z]+="[^"]*"/g,'').replace(/\s+(inkscape|sodipodi|rdf|cc|dc):[a-zA-Z0-9_-]+="[^"]*"/g,'').replace(/<!--[\s\S]*?-->/g,'');}
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
  inner=inner.replace(/stroke\s*:\s*(black|#000000|#000|rgb\(0,\s*0,\s*0\))/gi,'stroke:currentColor')
    .replace(/fill\s*:\s*(black|#000000|#000|rgb\(0,\s*0,\s*0\))/gi,'fill:currentColor')
    .replace(/stroke="(black|#000000|#000)"/gi,'stroke="currentColor"')
    .replace(/fill="(black|#000000|#000)"/gi,'fill="currentColor"')
    .replace(/<\?xml[\s\S]*?\?>/g,'').replace(/<!DOCTYPE[\s\S]*?>/g,'')
    .replace(/\s+/g,' ').trim();
  return {viewBox: vb||'0 0 100 60', inner};
}
const out={};
for(const [key,sym] of Object.entries(SYMBOLS)){
  const local=path.join(ROOT,'assets/symbols',sym.file);
  if(fs.existsSync(local)&&/\.svg$/i.test(local)){
    try{ out[key]=normalizeSvg(fs.readFileSync(local,'utf8')); }catch{}
  }
}
fs.writeFileSync(OUT,'// Generated from available SVG assets in assets/symbols\nexport const SYMBOL_INLINE = '+JSON.stringify(out,null,2)+';\n');
console.log('wrote',Object.keys(out).length);
