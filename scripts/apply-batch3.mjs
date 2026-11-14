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
 {key:'relayCoil', asset:'relay-coil.svg', title:'File:IEEE 315 Contacts, Switches, Contactors, and Relays Symbols (42).svg', page:'https://commons.wikimedia.org/wiki/File:IEEE_315_Contacts,_Switches,_Contactors,_and_Relays_Symbols_(42).svg', url:'https://upload.wikimedia.org/wikipedia/commons/5/59/IEEE_315_Contacts%2C_Switches%2C_Contactors%2C_and_Relays_Symbols_%2842%29.svg', author:'Michel Bakni', license:'CC BY-SA 4.0',
  svg:`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="100" height="100" viewBox="0 0 100 100" version="1.1" id="svg8" inkscape:version="0.92.4 (5da689c313, 2019-01-14)" sodipodi:docname="IEEE 315 Contacts, Switches, Contactors, and Relays Symbols (42).svg">
  <defs id="defs2" />
  <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="5.6" inkscape:cx="52.65625" inkscape:cy="48.303571" inkscape:document-units="px" inkscape:current-layer="layer1" showgrid="true" units="px" inkscape:window-width="1920" inkscape:window-height="1017" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1">
    <inkscape:grid type="xygrid" id="grid815" />
  </sodipodi:namedview>
  <metadata id="metadata5">
    <rdf:RDF>
      <cc:Work rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(0,-270.54166)">
    <g id="g823" transform="translate(-5)">
      <path sodipodi:nodetypes="cc" inkscape:connector-curvature="0" id="path817" d="M 25,320.54166 H 5" style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path sodipodi:nodetypes="cc" inkscape:connector-curvature="0" id="path819" d="m 85,320.54166 h 20" style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <circle r="30" cy="320.54166" cx="55" id="path821" style="opacity:1;fill:none;fill-opacity:1;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
    </g>
  </g>
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
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*source:\\s*')[^']*(')`), `$1Wikimedia Commons: ${it.title.replace(/^File:/,'').replace(/'/g,"\\'")}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*author:\\s*')[^']*(')`), `$1${it.author.replace(/'/g,"\\'")}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*license:\\s*')[^']*(')`), `$1${it.license.replace(/'/g,"\\'")}$2`);
  symSrc=symSrc.replace(new RegExp(`(${it.key}:\\s*\\{[^}]*licenseUrl:\\s*')[^']*(')`), `$1${it.page}$2`);
  console.log('APPLIED', it.key, it.title);
}
fs.writeFileSync(INLINE_PATH,'// Generated from Commons-sourced SVG assets\nexport const SYMBOL_INLINE = '+JSON.stringify(inlineData,null,2)+';\n');
fs.writeFileSync(SYMBOLS_PATH,symSrc);
console.log('total inline', Object.keys(inlineData).length);
