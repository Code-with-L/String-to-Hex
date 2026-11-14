import fs from 'fs';
let c = fs.readFileSync('js/ui/icons.js', 'utf8');
const cut = '\nexport const SYMBOL_NAMES = Object.keys(SYMBOLS);';
const i = c.indexOf(cut);
if (i !== -1) {
  c = c.slice(0, i) + '\n';
  fs.writeFileSync('js/ui/icons.js', c);
  console.log('trimmed at', i);
} else {
  console.log('marker not found');
}
