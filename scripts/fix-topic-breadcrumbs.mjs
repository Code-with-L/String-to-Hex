import fs from 'fs';

// views.js units/ascii/base
let p = 'js/ui/views.js';
let s = fs.readFileSync(p, 'utf8');

// units
const uStart = 'export function viewUnits(route) {';
const uEnd = '\n\n/* ── ASCII';
let i = s.indexOf(uStart), j = s.indexOf(uEnd, i);
if (i < 0 || j < 0) throw new Error('units nf ' + i + ' ' + j);
const uRep = `export function viewUnits(route) {
  const fam = route.segments[1];
  if (!fam || !FAMILIES[fam]) {
    return frag(
      crumbs(el('a', { href: '#/conversion' }, 'Conversion'), el('span', {}, 'Unit families')),
      el('section', { class: 'page-head' },
        el('span', { class: 'hero-eyebrow' }, 'Conversion'),
        el('h1', {}, 'Unit families'),
        el('p', {}, 'Pick a family to see every conversion pair and reference factor.')),
      el('div', { class: 'grid grid-2' },
        ...FAMILY_IDS.map((id) => el('a', { class: 'tool-card', href: \`#/units/\${id}\` },
          el('h3', {}, FAMILIES[id].title),
          el('p', {}, \`\${Object.keys(FAMILIES[id].units).length} units — base unit \${FAMILIES[id].baseName}\`)))),
    );
  }

  const F = FAMILIES[fam];
  const keys = Object.keys(F.units);
  const rows = [];
  for (const a of keys) for (const b of keys) {
    if (a === b) continue;
    if (F.units[a].expr || F.units[b].expr) continue;
    rows.push(el('tr', {},
      el('td', {}, el('a', { href: \`#/convert/\${a}-to-\${b}\` }, \`\${unitName(fam, a)} → \${unitName(fam, b)}\`)),
      el('td', { class: 'mono' }, \`\${unitSymbol(fam, a)} → \${unitSymbol(fam, b)}\`),
      el('td', { class: 'mono' }, fmtNum(F.units[a].f / F.units[b].f, 10)),
    ));
  }

  return frag(
    crumbs(el('a', { href: '#/conversion' }, 'Conversion'), el('a', { href: '#/units' }, 'Unit families'), el('span', {}, F.title)),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Conversion'),
      el('h1', {}, \`\${F.title} converters\`),
      el('p', {}, \`All \${rows.length} ordered pairs, driven by the exact reference factors. Base unit: \${F.baseName} (\${F.base}).\`),
      F.note ? el('p', { style: 'color:var(--warn);font-size:14px' }, F.note) : null),
    el('section', { class: 'panel' },
      el('h2', { class: 'panel-title' }, 'Reference factors'),
      el('div', { class: 'table-scroll' }, el('table', {},
        el('thead', {}, el('tr', {},
          el('th', {}, 'Unit'), el('th', {}, 'Symbol'), el('th', {}, \`Factor vs \${F.baseName}\`), el('th', {}, '1 unit in base'))),
        el('tbody', {}, ...keys.map((k) => el('tr', {},
          el('td', {}, unitName(fam, k)),
          el('td', { class: 'mono' }, unitSymbol(fam, k)),
          el('td', { class: 'mono' }, F.units[k].f === 1 ? '-' : \`× \${F.units[k].f}\`),
          el('td', { class: 'mono' }, fmtNum(1 / F.units[k].f, 12))))))),
      F.affineNote ? el('p', { style: 'color:var(--muted);font-size:13px' }, F.affineNote) : null,
    ),
    el('section', { class: 'panel', style: 'margin-top:18px' },
      el('h2', { class: 'panel-title' }, \`All \${F.title.toLowerCase()} conversions\`),
      el('div', { class: 'table-scroll' }, el('table', {},
        el('thead', {}, el('tr', {},
          el('th', {}, 'Conversion'), el('th', {}, 'Symbols'), el('th', {}, 'Multiply input by'))),
        el('tbody', {}, ...rows))),
    ),
  );
}
`;
s = s.slice(0, i) + uRep + s.slice(j);

// ascii crumbs
s = s.replace(
  "  return frag(\n    crumbs(el('span', {}, 'ASCII')),",
  "  return frag(\n    crumbs(el('a', { href: '#/conversion' }, 'Conversion'), el('span', {}, 'ASCII table')),")
;
// base crumbs
s = s.replace(
  "  return frag(\n    crumbs(el('span', {}, 'Bases')),",
  "  return frag(\n    crumbs(el('a', { href: '#/conversion' }, 'Conversion'), el('span', {}, 'Number bases')),")
;

fs.writeFileSync(p, s);
console.log('views breadcrumbs ok');

// content.js glossary/symbols/tables breadcrumbs
p = 'js/ui/content.js';
s = fs.readFileSync(p, 'utf8');

function repBlock(startMarker, endMarker, replacement) {
  const i = s.indexOf(startMarker);
  const j = s.indexOf(endMarker, i);
  if (i < 0 || j < 0) throw new Error('nf ' + startMarker.slice(0,30));
  s = s.slice(0,i) + replacement + s.slice(j);
}

// glossary
repBlock(
  "export function viewGlossary() {\n  const node = frag(",
  "\nexport function viewGlossaryEntry(key) {",
  `export function viewGlossary() {
  const node = frag(
    crumbs(el('a', { href: '#/learn' }, 'Reference'), el('span', {}, 'Glossary')),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Reference'),
      el('h1', {}, 'Glossary'),
      el('p', {}, \`\${Object.keys(GLOSSARY).length} terms, grouped by area. Each links to the calculator that works with it.\`),
    ),
    ...GLOSSARY_GROUPS.map((group) => {
      const entries = Object.entries(GLOSSARY).filter(([, g]) => g.group === group);
      if (!entries.length) return null;
      return el('section', { class: 'section' },
        el('div', { class: 'section-head' }, el('h2', {}, group)),
        el('div', { class: 'grid grid-2' },
          ...entries.map(([key, g]) => el('a', { class: 'tool-card', href: \`#/glossary/\${key}\` },
            el('h3', {}, g.symbol && g.symbol !== '-' ? \`\${g.term}  \${g.symbol}\` : g.term),
            el('p', {}, g.short),
            g.tool ? el('span', { class: 'card-tag' }, 'solver →') : null))),
      );
    }),
  );
  node.pageTitle = 'Glossary - HexKit Reference';
  node.pageDescription = \`Definitions for \${Object.keys(GLOSSARY).length} electrical, circuit, unit and computing terms.\`;
  return node;
}

`
);

// symbols
repBlock(
  "export function viewSymbols() {\n  const node = frag(",
  "\n/* ── reference tables",
  `export function viewSymbols() {
  const node = frag(
    crumbs(el('a', { href: '#/learn' }, 'Reference'), el('span', {}, 'Circuit symbols')),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Reference'),
      el('h1', {}, 'Circuit symbols'),
      el('p', {}, \`\${Object.keys(SYMBOLS).length} circuit symbols sourced as SVG files from Wikimedia Commons (IEC/ANSI conventions). No symbols are hand-drawn in this app.\`),
    ),
    symbolGrid(SYMBOL_GROUPS),
    el('section', { class: 'section symbol-attrib' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Symbol credits & licenses')),
      el('p', {}, 'Symbol artwork is downloaded from Wikimedia Commons. Each symbol retains its original author and license; see ', el('a', { href: 'SYMBOLS.md' }, 'SYMBOLS.md'), ' for the full per-file attribution list.'),
    ),
    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Components')),
      el('div', { class: 'table-scroll' }, el('table', {},
        el('thead', {}, el('tr', {},
          el('th', {}, 'Component'), el('th', {}, 'Symbol'), el('th', {}, 'Unit'), el('th', {}, 'What it does'))),
        el('tbody', {}, ...COMPONENTS.map((c) => el('tr', {},
          el('td', {}, el('strong', {}, c.name)),
          el('td', { class: 'mono' }, c.sym),
          el('td', { class: 'mono' }, c.unit),
          el('td', { style: 'white-space:normal' }, c.does)))))),
    ),
    el('p', { style: 'margin-top:20px' }, el('a', { href: '#/learn' }, '← Back to reference')),
  );
  node.pageTitle = 'Circuit symbols - HexKit Reference';
  node.pageDescription = \`\${Object.keys(SYMBOLS).length} electrical circuit symbols drawn as SVG, grouped by function.\`;
  return node;
}

`
);

// tables crumbs in viewTables
s = s.replace(
  "  const node = frag(\n    el('nav', { class: 'crumbs' }, el('a', { href: '#/' }, 'Home'), el('span', { 'aria-hidden': 'true' }, '/'), el('a', { href: '#/learn' }, 'Reference'), el('span', { 'aria-hidden': 'true' }, '/'), el('span', {}, 'Tables')),",
  "  const node = frag(\n    crumbs(el('a', { href: '#/learn' }, 'Reference'), el('span', {}, 'Tables')),"
);

fs.writeFileSync(p, s);
console.log('content breadcrumbs ok');
