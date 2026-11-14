import fs from 'fs';
import { SYMBOLS, SYMBOL_GROUPS } from '../js/data/symbols.js';

const lines = [];
lines.push('# Circuit symbol credits');
lines.push('');
lines.push('All circuit symbols in this project are SVG assets sourced from Wikimedia Commons (and/or applicable assets from provided source folders), not hand-drawn. Each symbol retains its original source, author, and license as listed below.');
lines.push('');
lines.push(`- Total symbols: ${Object.keys(SYMBOLS).length}`);
lines.push('- Source category: https://commons.wikimedia.org/wiki/Category:SVG_electrical_symbols');
lines.push('');
lines.push('| Key | Symbol | File | Source | Author | License |');
lines.push('|---|---|---|---|---|---|');
for (const [k,s] of Object.entries(SYMBOLS)) {
  const src = s.licenseUrl ? `[${s.source}](${s.licenseUrl})` : s.source;
  lines.push(`| ${k} | ${s.label} | \`assets/symbols/${s.file}\` | ${src} | ${s.author||''} | ${s.license||''} |`);
}
lines.push('');
lines.push('## Notes');
lines.push('- Where a Commons file could not be retrieved at build time, an equivalent standardized symbol asset may be included; see the file in `assets/symbols/` and update this table if replaced.');
lines.push('- A copy of the public-domain "Electrical symbols library.svg" from Wikimedia Commons may be included in `assets/symbols/` as a reference source.');
fs.writeFileSync('SYMBOLS.md', lines.join('\n'));
console.log('wrote SYMBOLS.md');
