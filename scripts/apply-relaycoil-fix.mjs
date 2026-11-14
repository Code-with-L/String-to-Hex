import fs from 'fs';
import path from 'path';
const ROOT=process.cwd();
const ASSETS=path.join(ROOT,'assets/symbols');
const RAW=path.join(ASSETS,'commons-raw');
const INLINE_PATH=path.join(ROOT,'js/data/symbol-inline.generated.js');
const SYMBOLS_PATH=path.join(ROOT,'js/data/symbols.js');
function normalizeSvg(svg){
  let vb=null; const m=svg.match(/viewBox\s*=\s*"([^"]+)"/i); if(m) vb=m[1].trim();
  if(!vb){const w=svg.match(/\bwidth\s*=\s*"([0-9.]+)/i); const h=svg.match(/\bheight\s*=\s*"([0-9.]+)/i); if(w&&h) vb=`0 0 ${w[1]} ${h[1]}`;}
  let inner=svg.replace(/^[\s\S]*?<svg[^>]*>/i,'').replace(/<\/svg>\s*$/i,'');
  inner=inner.replace(/<metadata[\s\S]*?<\/metadata>/gi,'').replace(/<sodipodi:namedview[\s\S]*?(?:\/>|<\/sodipodi:namedview>)/gi,'').replace(/<defs>\s*<\/defs>/gi,'').replace(/<title[\s\S]*?<\/title>/gi,'').replace(/<desc[\s\S]*?<\/desc>/gi,'').replace(/<text[\s\S]*?<\/text>/gi,'').replace(/<switch[\s\S]*?<\/switch>/gi,'');
  inner=inner.replace(/<!--[\s\S]*?-->/g,'').replace(/\s+(inkscape|sodipodi|rdf|cc|dc):[a-zA-Z0-9_-]+="[^"]*"/g,'');
  inner=inner.replace(/stroke\s*:\s*(black|#000000|#000|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))/gi,'stroke:currentColor')
    .replace(/fill\s*:\s*(black|#000000|#000|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))/gi,'fill:currentColor')
    .replace(/stroke="(black|#000000|#000)"/gi,'stroke="currentColor"').replace(/fill="(black|#000000|#000)"/gi,'fill="currentColor"')
    .replace(/fill="#ffffff"/gi,'fill="none"').replace(/<\?xml[\s\S]*?\?>/g,'').replace(/<!DOCTYPE[\s\S]*?>/g,'').replace(/\s+/g,' ').trim();
  return {viewBox: vb||'0 0 100 60', inner};
}
const key='relayCoil', asset='relay-coil.svg';
const title='File:IEEE 315 Contacts, Switches, Contactors, and Relays Symbols (42).svg';
const page='https://commons.wikimedia.org/wiki/File:IEEE_315_Contacts,_Switches,_Contactors,_and_Relays_Symbols_(42).svg';
const url='https://upload.wikimedia.org/wikipedia/commons/5/59/IEEE_315_Contacts%2C_Switches%2C_Contactors%2C_and_Relays_Symbols_%2842%29.svg';
const author='Michel Bakni';
const license='CC BY-SA 4.0';
const svg = fs.readFileSync(path.join(ASSETS,'_relaycoil_real.svg'),'utf8');
fs.writeFileSync(path.join(ASSETS,asset), svg);
fs.writeFileSync(path.join(RAW,key+'.svg'), svg);
fs.writeFileSync(path.join(ASSETS,asset+'.meta.json'), JSON.stringify({title,url,page,author,license},null,2));
let inlineData={}; try{const mod=await import('file:///'+INLINE_PATH.replace(/\\/g,'/')); inlineData=mod.SYMBOL_INLINE||{};}catch{}
let symSrc=fs.readFileSync(SYMBOLS_PATH,'utf8');
const norm=normalizeSvg(svg);
inlineData[key]={viewBox:norm.viewBox, inner:norm.inner, source:title, sourceUrl:url};
symSrc=symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*file:\\s*')[^']+(')`), `$1${asset}$2`);
symSrc=symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*source:\\s*')[^']*(')`), `$1Wikimedia Commons: ${title.replace(/^File:/,'').replace(/'/g,"\\'")}$2`);
symSrc=symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*author:\\s*')[^']*(')`), `$1${author}$2`);
symSrc=symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*license:\\s*')[^']*(')`), `$1${license}$2`);
symSrc=symSrc.replace(new RegExp(`(${key}:\\s*\\{[^}]*licenseUrl:\\s*')[^']*(')`), `$1${page}$2`);
fs.writeFileSync(INLINE_PATH,'// Generated from Commons-sourced SVG assets\nexport const SYMBOL_INLINE = '+JSON.stringify(inlineData,null,2)+';\n');
fs.writeFileSync(SYMBOLS_PATH,symSrc);
console.log('APPLIED', key);
fs.unlinkSync(path.join(ASSETS,'_relaycoil_real.svg'));
