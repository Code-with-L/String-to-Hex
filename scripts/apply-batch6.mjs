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
  inner=inner.replace(/<metadata[\s\S]*?<\/metadata>/gi,'').replace(/<sodipodi:namedview[\s\S]*?(?:\/>|<\/sodipodi:namedview>)/gi,'').replace(/<defs>\s*<\/defs>/gi,'').replace(/<title[\s\S]*?<\/title>/gi,'').replace(/<desc[\s\S]*?<\/desc>/gi,'').replace(/<switch[\s\S]*?<\/switch>/gi,'');
  inner=inner.replace(/<!--[\s\S]*?-->/g,'').replace(/\s+(inkscape|sodipodi|rdf|cc|dc):[a-zA-Z0-9_-]+="[^"]*"/g,'');
  inner=inner.replace(/stroke\s*:\s*(black|#000000|#000|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))/gi,'stroke:currentColor')
    .replace(/fill\s*:\s*(black|#000000|#000|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))/gi,'fill:currentColor')
    .replace(/stroke="(black|#000000|#000)"/gi,'stroke="currentColor"').replace(/fill="(black|#000000|#000)"/gi,'fill="currentColor"')
    .replace(/fill="#ffffff"/gi,'fill="none"').replace(/fill="#fff"/gi,'fill="none"').replace(/<\?xml[\s\S]*?\?>/g,'').replace(/<!DOCTYPE[\s\S]*?>/g,'').replace(/\s+/g,' ').trim();
  return {viewBox: vb||'0 0 100 60', inner};
}
const ammeterSvg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="151" height="68" viewBox="0 0 151 68" role="img" aria-labelledby="title desc">
  <title id="title">Ampeerimittarin historiallinen piirrosmerkki (1993)</title>
  <desc id="desc">Vuoden 1993 lähdekuvan vektorijäljennös.</desc>
  <rect width="151" height="68" fill="#fff"/>
  <g fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round">
    <path id="horizontal-meter-leads" d="M 11 34.5 H 53 M 98 34.5 H 136"/><circle id="meter-circle" cx="75.5" cy="34.5" r="22.5" fill="#fff"/><path id="ammeter-letter-A" d="M67.0 43.2 74.06346666666667 23.000000000000004H76.67786666666667L84.2 43.2H81.41742222222223L79.27697777777777 37.08212824010914H71.60195555555556L69.58382222222222 43.2ZM72.30524444444444 34.90504774897681H78.52782222222223L76.61671111111112 29.310777626193726Q75.72995555555556 26.73410641200546 75.31715555555556 25.121964529331517Q74.96551111111111 27.06480218281037 74.32337777777778 28.980081855388818Z" fill="#000" stroke="none"/>
  </g>
</svg>`;
const ohmmeterSvg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="147" height="68" viewBox="0 0 147 68" role="img" aria-labelledby="title desc">
  <title id="title">Ohmimittari</title>
  <desc id="desc">Vuoden 1993 lähdekuvan vektorijäljennös.</desc>
  <rect width="147" height="68" fill="#fff"/>
  <g fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round">
    <path d="M 11 33.57 H 52.46 M 97.38 33.57 H 136.3"/>
    <path d="M 97.38 33.57 A 22.46 22.46 0 1 1 52.46 33.57 A 22.46 22.46 0 1 1 97.38 33.57 Z"/>
    <path d="M 66.8 39.5 V 41.2 H 72.3 V 39.1 C 68.8 36.4 67.8 33.7 68 30.5 C 68.2 26.3 70.8 24.1 75.3 24.1 C 79.8 24.1 82.7 26.5 83 30.5 C 83.3 33.9 81.9 37 78.5 39.1 V 41.2 H 84.1 V 39.5" stroke-width="2.2"/>
  </g>
</svg>`;
const items=[
 {key:'ammeter', asset:'ammeter.svg', title:'File:Lukion taulukot - ammeter symbol (1993).svg', page:'https://commons.wikimedia.org/wiki/File:Lukion_taulukot_-_ammeter_symbol_(1993).svg', url:'https://upload.wikimedia.org/wikipedia/commons/b/be/Lukion_taulukot_-_ammeter_symbol_%281993%29.svg', author:'Esko Ranta & Matti Tiilikainen (original); Fisuaq (SVG vectorization)', license:'CC BY-SA 4.0', svg:ammeterSvg},
 {key:'ohmmeter', asset:'ohmmeter.svg', title:'File:Lukion taulukot - ohmmeter symbol (1993).svg', page:'https://commons.wikimedia.org/wiki/File:Lukion_taulukot_-_ohmmeter_symbol_(1993).svg', url:'https://upload.wikimedia.org/wikipedia/commons/9/91/Lukion_taulukot_-_ohmmeter_symbol_%281993%29.svg', author:'Esko Ranta & Matti Tiilikainen (original); Fisuaq (SVG vectorization)', license:'CC BY-SA 4.0', svg:ohmmeterSvg},
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
