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
    .replace(/stroke="(black|#000000|#000)"/gi,'stroke="currentColor"')
    .replace(/fill="(black|#000000|#000)"/gi,'fill="currentColor"')
    .replace(/fill="#ffffff"/gi,'fill="none"')
    .replace(/<\?xml[\s\S]*?\?>/g,'').replace(/<!DOCTYPE[\s\S]*?>/g,'').replace(/\s+/g,' ').trim();
  return {viewBox: vb||'0 0 100 60', inner};
}

const items=[
 {key:'trimmer', asset:'trimmer.svg', title:'File:Preset Resistor.svg', page:'https://commons.wikimedia.org/wiki/File:Preset_Resistor.svg', url:'https://upload.wikimedia.org/wikipedia/commons/8/86/Preset_Resistor.svg', author:'jjbeard', license:'Public domain',
  svg:`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.0" width="45" height="32" id="svg2">
  <defs id="defs4" />
  <g id="layer1">
    <rect width="28.75" height="11.25" x="8.125" y="10.75" style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:1.25;stroke-linecap:square;stroke-miterlimit:3.66666675;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" id="rect1469" />
    <path d="M 0,16.375 L 7.5,16.375" style="fill:none;fill-opacity:0.75;fill-rule:evenodd;stroke:#000000;stroke-width:1.25;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path2344" />
    <path d="M 37.5,16.375 C 45,16.375 45,16.375 45,16.375" style="fill:none;fill-opacity:0.75;fill-rule:evenodd;stroke:#000000;stroke-width:1.25;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path3219" />
    <path d="M 10.75,25.75 L 32.5,5.25" style="fill:none;fill-opacity:0.75;fill-rule:evenodd;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" id="path4971" />
    <path d="M 29.5,2 L 35.75,8.25" style="fill:none;fill-opacity:0.75;fill-rule:evenodd;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" id="path5850" />
  </g>
</svg>`},
 {key:'crystal', asset:'crystal.svg', title:'File:Crystal-oscillator-IEC-Symbol.svg', page:'https://commons.wikimedia.org/wiki/File:Crystal-oscillator-IEC-Symbol.svg', url:'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crystal-oscillator-IEC-Symbol.svg', author:'J.P.Lon', license:'GFDL / CC BY-SA 3.0, 2.5, 2.0, 1.0',
  svg:`<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="575" height="400">
<path fill="none" stroke="#000" stroke-width="9" d="m207,41v318m23-323v328h115v-328zm138,5v318M38,200h169m161,0h169"/>
</svg>`},
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
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*source:\\s*')[^']*(')`), `$1Wikimedia Commons: ${it.title.replace(/^File:/,'')}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*author:\\s*')[^']*(')`), `$1${it.author.replace(/'/g,"\\'")}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*license:\\s*')[^']*(')`), `$1${it.license.replace(/'/g,"\\'")}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*licenseUrl:\\s*')[^']*(')`), `$1${it.page}$2`);
  console.log('APPLIED', it.key, it.title);
}
fs.writeFileSync(INLINE_PATH,'// Generated from Commons-sourced SVG assets\nexport const SYMBOL_INLINE = '+JSON.stringify(inlineData,null,2)+';\n');
fs.writeFileSync(SYMBOLS_PATH,symSrc);
console.log('total inline', Object.keys(inlineData).length);
