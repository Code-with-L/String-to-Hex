import fs from 'fs';
let src = fs.readFileSync('js/data/reference.js','utf8');

// 1) Fix the broken namedRgbHsl return
const broken = "  return { name, hex: `#${hex}`, rgb: `${r}, ${g}, ${b}`, hsl: `${h}°, ${s}%, ${l}%` };,";
if (!src.includes(broken)) {
  // try with different degree char
  const idx = src.indexOf('  return { name, hex: `#${hex}`, rgb: `${r}, ${g}, ${b}`, hsl:');
  if (idx === -1) throw new Error('return line not found');
  const lineEnd = src.indexOf('\n', idx);
  const line = src.slice(idx, lineEnd);
  console.log('FOUND LINE:', JSON.stringify(line));
  src = src.slice(0, idx) + "  return { name, hex: `#${hex}`, rgb: `${r}, ${g}, ${b}`, hsl: `${h}°, ${s}%, ${l}%` };"+ src.slice(lineEnd);
} else {
  src = src.replace(broken, "  return { name, hex: `#${hex}`, rgb: `${r}, ${g}, ${b}`, hsl: `${h}°, ${s}%, ${l}%` };");
}

// 2) Remove wrongly inserted articles block (from "  '800-watts-to-amps': {" to just before "export const TABLES" won't work - it's in wrong place. It's after namedRgbHsl and before TABLES?)
// Actually it was inserted after the broken return line, inside namedRgbHsl area. Let's find and extract it.
const insStart = src.indexOf("\n  '800-watts-to-amps': {");
if (insStart === -1) throw new Error('inserted block start not found');
// find its end: it ends with the cm-to-feet article closing "  },\n" followed by "export const TABLES = {" (which comes later at line ~1194 originally, but now shifted)
const tablesIdx = src.indexOf("\nexport const TABLES = {", insStart);
if (tablesIdx === -1) throw new Error('TABLES after insert not found');
const block = src.slice(insStart, tablesIdx); // includes leading newline, ends before \nexport const TABLES
console.log('REMOVING BLOCK LEN', block.length);
src = src.slice(0, insStart) + src.slice(tablesIdx);

// 3) Insert block correctly before ARTICLES end: ARTICLES ends at "\n};\n\nexport const ARTICLE_SLUGS" or before "export const ARTICLE_SLUGS"
const slugIdx = src.indexOf('\nexport const ARTICLE_SLUGS = Object.keys(ARTICLES);');
if (slugIdx === -1) throw new Error('ARTICLE_SLUGS not found');
// ARTICLES object closes just before that (with \n};)
const articlesEnd = src.lastIndexOf('\n};', slugIdx);
if (articlesEnd === -1) throw new Error('articles end not found');
// block currently starts with "\n  '800-watts..." and ends with "\n  }," (no trailing context)
let cleanBlock = block;
if (!cleanBlock.endsWith(',\n')) {
  if (cleanBlock.endsWith('\n')) cleanBlock = cleanBlock.slice(0,-1) + ',\n';
  else cleanBlock = cleanBlock + ',\n';
}
// but we need it as ",\n  '800..." style inserted before closing };
cleanBlock = cleanBlock.replace(/^\n/, ',\n'); // replace leading newline with comma+newline? articles end is "  },\n};" or last entry "  }" 
// Actually easier: insert block content (without leading newline, starting with comma) before "\n};" at articlesEnd
src = src.slice(0, articlesEnd) + '\n' + cleanBlock.trimEnd() + src.slice(articlesEnd);

fs.writeFileSync('js/data/reference.js', src);
console.log('fixed');
