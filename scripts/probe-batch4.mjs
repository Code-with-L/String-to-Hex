import {info,download,clean} from './search-commons.mjs';
import fs from 'fs';
const titles=[
 'File:IEC 60417 - Ref-No 5081.svg',
 'File:IEC 60417 - Ref-No 5080.svg',
 'File:IEC 60417 - Ref-No 5010.svg',
 'File:IEC 60417 - Ref-No 5011.svg',
 'File:IEC 60417 - Ref-No 5261.svg',
 'File:IEC 60417 - Ref-No 5262.svg',
 'File:IEC 60417 - Ref-No 5263.svg',
 'File:IEC 60417 - Ref-No 5264.svg',
 'File:Optoisolator Pinout.svg',
 'File:IEEE 315 Contacts, Switches, Contactors, and Relays Symbols (182).svg',
 'File:IEEE 315 Contacts, Switches, Contactors, and Relays Symbols (181).svg',
];
for(const t of titles){
 const i=info(t); if(!i){console.log('NO',t); continue;}
 console.log('OK',t,'|',i.url,'|',i.width+'x'+i.height,'|',clean(i.meta.LicenseShortName));
 const p='assets/symbols/_p4_'+t.replace(/[^a-z0-9]/gi,'_')+'.svg';
 if(download(i.url,p)){const s=fs.readFileSync(p,'utf8'); console.log('SVG',s.slice(0,320).replace(/\s+/g,' '));}
 else console.log('DLFAIL');
}
