import fs from 'fs';
import { SYMBOLS } from '../js/data/symbols.js';
const missing=[];
for (const [k,s] of Object.entries(SYMBOLS)) {
  const p = `assets/symbols/${s.file}`;
  if (!fs.existsSync(p) || fs.statSync(p).size < 40) missing.push([k,s.file]);
}
console.log('MISSING', missing.length);
for (const [k,f] of missing) console.log(k,f);
