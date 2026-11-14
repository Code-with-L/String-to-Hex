import {info,download,clean} from './search-commons.mjs';
import fs from 'fs';

const titles = [
  'File:Relay coil, general symbol.svg',
  'File:Relay coil symbol.svg',
  'File:DIP switch symbol.svg',
  'File:Solder bridge symbol.svg',
  'File:Solder jumper symbol.svg',
  'File:Optocoupler symbol.svg',
  'File:Crystal oscillator symbol.svg',
  'File:Crystal symbol.svg',
  'File:Ammeter symbol.svg',
  'File:Voltmeter symbol.svg',
  'File:Ohmmeter symbol.svg',
  'File:Wattmeter symbol.svg',
  'File:Loudspeaker symbol.svg',
  'File:Microphone symbol.svg',
  'File:Motor symbol.svg',
  'File:Generator symbol.svg',
  'File:Preset resistor symbol too.svg',
];
for (const t of titles) {
  const i = info(t);
  if (!i) { console.log('NO', t); continue; }
  console.log('OK', t, '|', i.url, '|', i.width+'x'+i.height, '|', clean(i.meta.LicenseShortName));
  const p = 'assets/symbols/_probe_' + t.replace(/[^a-z0-9]/gi,'_') + '.svg';
  if (download(i.url, p)) {
    const s = fs.readFileSync(p,'utf8');
    console.log('  SVG:', s.slice(0,260).replace(/\s+/g,' '));
    fs.unlinkSync(p);
  } else console.log('  DLFAIL');
}
