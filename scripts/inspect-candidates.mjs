import {info,download} from './search-commons.mjs';
import fs from 'fs';
const items=[
  ['wire15','File:IEEE 315 Transmission Path Symbols (15).svg'],
  ['wire1','File:IEEE 315 Transmission Path Symbols (1).svg'],
  ['iec5012','File:IEC 60417 - Ref-No 5012.svg'],
  ['iec5182','File:IEC 60417 - Ref-No 5182.svg'],
  ['iec5162','File:IEC 60417 - Ref-No 5162.svg'],
  ['gostTrim','File:Trimmer resistor as rheostat symbol GOST.svg'],
];
for(const [n,t] of items){
  const i=info(t); if(!i){console.log('NO',n,t); continue;}
  const p=`assets/symbols/_probe_${n}.svg`;
  if(download(i.url,p)) console.log('SAVED',n,i.url); else console.log('DLFAIL',n);
}
