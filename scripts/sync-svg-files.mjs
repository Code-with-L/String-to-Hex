import fs from 'fs';
import path from 'path';
let src = fs.readFileSync('js/data/symbols.js','utf8');
const dir = 'assets/symbols';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg') && !f.startsWith('_') && !f.endsWith('.meta.svg'));
let changed = 0;
for (const f of files) {
  const bn = path.parse(f).name;
  // replace file: 'bn.gif'|'bn.jpg'|'bn.png' with file: 'bn.svg'
  const re = new RegExp("(file:\\s*')" + bn.replace(/[.*+?^${}()|[\\]\\-]/g,'\\$&') + "\\.(gif|jpg|jpeg|png)'", 'g');
  const next = src.replace(re, `$1${f}'`);
  if (next !== src) { src = next; changed++; console.log('switched', bn, '->', f); }
}
fs.writeFileSync('js/data/symbols.js', src);
console.log('changed', changed);
