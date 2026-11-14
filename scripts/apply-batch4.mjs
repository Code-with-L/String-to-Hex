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
const speakerSvg = fs.readFileSync(path.join(ASSETS,'_p4_File_IEC_60417___Ref_No_5080_svg.svg'),'utf8');
const items=[
 {key:'speaker', asset:'speaker.svg', title:'File:IEC 60417 - Ref-No 5080.svg', page:'https://commons.wikimedia.org/wiki/File:IEC_60417_-_Ref-No_5080.svg', url:'https://upload.wikimedia.org/wikipedia/commons/3/31/IEC_60417_-_Ref-No_5080.svg', author:'IEC / Wikimedia Commons contributors', license:'Public domain', svg:speakerSvg},
];
let inlineData={}; try{const mod=await import('file:///'+INLINE_PATH.replace(/\\/g,'/')); inlineData=mod.SYMBOL_INLINE||{};}catch{}
let symSrc=fs.readFileSync(SYMBOLS_PATH,'utf8');
for(const it of items){
  fs.writeFileSync(path.join(ASSETS,it.asset), it.svg);
  fs.writeFileSync(path.join(RAW,it.key+'.svg'), it.svg);
  fs.writeFileSync(path.join(ASSETS,it.asset+'.meta.json'), JSON.stringify({title:it.title,url:it.url,page:it.page,author:it.author,license:it.license},null,2));
  const norm=normalizeSvg(it.svg);
  inlineData[it.key]={viewBox:norm.viewBox, inner:norm.inner, source:it.title, sourceUrl:it.url};
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*file:\\s*')[^']+(')`), `$1${it.asset}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*source:\\s*')[^']*(')`), `$1Wikimedia Commons: ${it.title.replace(/^File:/,'').replace(/'/g,"\\'")}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*author:\\s*')[^']*(')`), `$1${it.author.replace(/'/g,"\\'")}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*license:\\s*')[^']*(')`), `$1${it.license.replace(/'/g,"\\'")}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*licenseUrl:\\s*')[^']*(')`), `$1${it.page}$2`);
  console.log('APPLIED', it.key, it.title);
}
fs.writeFileSync(INLINE_PATH,'// Generated from Commons-sourced SVG assets\nexport const SYMBOL_INLINE = '+JSON.stringify(inlineData,null,2)+';\n');
fs.writeFileSync(SYMBOLS_PATH,symSrc);
console.log('total inline', Object.keys(inlineData).length);
