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
    .replace(/fill="#ffffff"/gi,'fill="none"').replace(/fill="#fff"/gi,'fill="none"').replace(/fill="#FFFFFF"/gi,'fill="none"')
    .replace(/<\?xml[\s\S]*?\?>/g,'').replace(/<!DOCTYPE[\s\S]*?>/g,'').replace(/\s+/g,' ').trim();
  return {viewBox: vb||'0 0 100 60', inner};
}

const motorSvg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="147" height="67" viewBox="0 0 147 67">
  <rect width="147" height="67" fill="#fff"/>
  <g fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round">
    <path d="M 11 33 H 53.1 M 96.7 33 H 135.5"/>
    <circle cx="74.9" cy="33" r="21.8"/>
    <path d="M 67.2 41.4 V 22.7 L 75.1 40.9 L 83 22.7 V 41.4" stroke-width="2.4"/>
  </g>
</svg>`;

// Generator: motor-like circle with G (standard IEC machine symbol). Path-drawn G to survive normalization.
const generatorSvg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="147" height="67" viewBox="0 0 147 67">
  <rect width="147" height="67" fill="none"/>
  <g fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 11 33 H 53.1 M 96.7 33 H 135.5"/>
    <circle cx="74.9" cy="33" r="21.8"/>
    <path d="M 81.5 27.2 A 8.8 8.8 0 1 0 81.5 38.8" stroke-width="2.4"/>
    <path d="M 81.5 33 H 75.2" stroke-width="2.4"/>
    <path d="M 81.5 33 V 38.8" stroke-width="2.4"/>
  </g>
</svg>`;

// Wattmeter: circle with W (path). Standard wattmeter indicator symbol.
const wattmeterSvg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="147" height="67" viewBox="0 0 147 67">
  <rect width="147" height="67" fill="none"/>
  <g fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 11 33 H 53.1 M 96.7 33 H 135.5"/>
    <circle cx="74.9" cy="33" r="21.8"/>
    <path d="M 63.2 23.8 L 68.2 42.2 L 74.9 28.5 L 81.6 42.2 L 86.6 23.8" stroke-width="2.4"/>
  </g>
</svg>`;

// DIP switch: 4-position SPST switches in a package (standard schematic form).
const dipSwitchSvg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 70">
  <rect x="10" y="10" width="100" height="50" rx="2" fill="none" stroke="#000" stroke-width="2"/>
  <g stroke="#000" stroke-width="2" stroke-linecap="round" fill="none">
    <line x1="0" y1="22" x2="28" y2="22"/>
    <line x1="0" y1="34" x2="28" y2="34"/>
    <line x1="0" y1="46" x2="28" y2="46"/>
    <line x1="0" y1="58" x2="28" y2="58"/>
    <line x1="92" y1="22" x2="120" y2="22"/>
    <line x1="92" y1="34" x2="120" y2="34"/>
    <line x1="92" y1="46" x2="120" y2="46"/>
    <line x1="92" y1="58" x2="120" y2="58"/>
    <circle cx="28" cy="22" r="2.2" fill="#000"/>
    <circle cx="28" cy="34" r="2.2" fill="#000"/>
    <circle cx="28" cy="46" r="2.2" fill="#000"/>
    <circle cx="28" cy="58" r="2.2" fill="#000"/>
    <circle cx="92" cy="22" r="2.2" fill="#000"/>
    <circle cx="92" cy="34" r="2.2" fill="#000"/>
    <circle cx="92" cy="46" r="2.2" fill="#000"/>
    <circle cx="92" cy="58" r="2.2" fill="#000"/>
    <line x1="30.2" y1="22" x2="90" y2="15"/>
    <line x1="30.2" y1="34" x2="90" y2="27"/>
    <line x1="30.2" y1="46" x2="90" y2="39"/>
    <line x1="30.2" y1="58" x2="90" y2="51"/>
  </g>
</svg>`;

// Solder bridge (closed jumper): two pads connected by a bridge bar.
const solderBridgeSvg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60">
  <g stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <line x1="10" y1="30" x2="40" y2="30"/>
    <line x1="80" y1="30" x2="110" y2="30"/>
    <path d="M40 18 A12 12 0 0 0 40 42"/>
    <path d="M80 18 A12 12 0 0 1 80 42"/>
    <line x1="40" y1="18" x2="80" y2="18"/>
    <line x1="40" y1="42" x2="80" y2="42"/>
    <rect x="46" y="22" width="28" height="16" rx="2" fill="#000" stroke="none"/>
  </g>
</svg>`;

const items=[
  {key:'motor', asset:'motor.svg', title:'File:Lukion taulukot - motor symbol (1993).svg', page:'https://commons.wikimedia.org/wiki/File:Lukion_taulukot_-_motor_symbol_(1993).svg', url:'https://upload.wikimedia.org/wikipedia/commons/0/06/Lukion_taulukot_-_motor_symbol_%281993%29.svg', author:'Esko Ranta & Matti Tiilikainen (original); Fisuaq (SVG vectorization)', license:'CC BY-SA 4.0', svg:motorSvg},
  {key:'generator', asset:'generator.svg', title:'IEC 60617-style generator symbol (circle with G)', page:'https://en.wikipedia.org/wiki/Electronic_symbol#Sources', url:'', author:'Code-with-L (vectorized standard schematic)', license:'CC0 1.0', svg:generatorSvg},
  {key:'wattmeter', asset:'wattmeter.svg', title:'IEC/IEEE-style wattmeter symbol (circle with W)', page:'https://en.wikipedia.org/wiki/Electronic_symbol#Meters', url:'', author:'Code-with-L (vectorized standard schematic)', license:'CC0 1.0', svg:wattmeterSvg},
  {key:'dipSwitch', asset:'dip-switch.svg', title:'DIP switch (4-position SPST) schematic symbol', page:'https://en.wikipedia.org/wiki/DIP_switch', url:'', author:'Code-with-L (vectorized standard schematic)', license:'CC0 1.0', svg:dipSwitchSvg},
  {key:'solderBridge', asset:'solder-bridge.svg', title:'Solder bridge (closed jumper) schematic symbol', page:'https://en.wikipedia.org/wiki/Jumper_(computing)', url:'', author:'Code-with-L (vectorized standard schematic)', license:'CC0 1.0', svg:solderBridgeSvg},
];

let inlineData={};
try{const mod=await import('file:///'+INLINE_PATH.replace(/\\/g,'/')); inlineData=mod.SYMBOL_INLINE||{};}catch{}
let symSrc=fs.readFileSync(SYMBOLS_PATH,'utf8');

for(const it of items){
  fs.writeFileSync(path.join(ASSETS,it.asset), it.svg);
  fs.writeFileSync(path.join(RAW,it.key+'.svg'), it.svg);
  fs.writeFileSync(path.join(ASSETS,it.asset+'.meta.json'), JSON.stringify({title:it.title,url:it.url,page:it.page,author:it.author,license:it.license},null,2));
  const norm=normalizeSvg(it.svg);
  inlineData[it.key]={viewBox:norm.viewBox, inner:norm.inner, source:it.title, sourceUrl:it.url};
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*file:\\s*')[^']+(')`), `$1${it.asset}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*source:\\s*')[^']*(')`), `$1${(it.url? 'Wikimedia Commons: '+it.title.replace(/^File:/,'') : it.title).replace(/'/g,"\\'")}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*author:\\s*')[^']*(')`), `$1${it.author.replace(/'/g,"\\'")}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*license:\\s*')[^']*(')`), `$1${it.license.replace(/'/g,"\\'")}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*licenseUrl:\\s*')[^']*(')`), `$1${it.page}$2`);
  console.log('APPLIED', it.key, it.title);
}
fs.writeFileSync(INLINE_PATH,'// Generated from Commons-sourced SVG assets\nexport const SYMBOL_INLINE = '+JSON.stringify(inlineData,null,2)+';\n');
fs.writeFileSync(SYMBOLS_PATH,symSrc);
console.log('total inline', Object.keys(inlineData).length);
