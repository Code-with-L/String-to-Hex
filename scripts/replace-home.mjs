import fs from 'fs';

const path = 'js/ui/content.js';
let s = fs.readFileSync(path, 'utf8');

const startMarker = "const HERO_SAMPLE = 'Plant trees';";
const endMarker = "\nexport const toolCard = (tool) =>";
const i = s.indexOf(startMarker);
const j = s.indexOf(endMarker, i);
if (i < 0 || j < 0) throw new Error('markers not found ' + i + ' ' + j);

const replacement = `const HERO_SAMPLE = 'Plant trees';

export function viewHome() {
  const bytes = textToBytes(HERO_SAMPLE, 'utf-8');
  const hex = bytesToHex(bytes, { delimiter: ' ' });

  const nTools = TOOLS.length;
  const nFamilies = FAMILY_IDS.length;
  const nUnits = FAMILY_IDS.reduce((a, f) => a + Object.keys(FAMILIES[f].units).length, 0);
  const nPairs = FORMATS.length ** 2;
  const nEncodings = ENCODINGS.length;

  const topics = [
    { href: '#/calc', title: 'Calculators', desc: \`\${nTools} online calculators organized by topic: math, electrical, wire, financial, health, time, number, color, text and more.\` },
    { href: '#/conversion', title: 'Conversion', desc: \`\${nFamilies} unit families (\${nUnits} units) plus text, hex, binary, decimal, octal and Base64 conversion.\` },
    { href: '#/web-tools', title: 'Web Tools', desc: 'Browser-based tools: alarm clock, stopwatch, timer, notepad, notes, calendar, counters, charts and other utilities.' },
    { href: '#/math', title: 'Math', desc: 'Math calculators, formulas and reference tables organized by topic.' },
    { href: '#/electricity', title: 'Electricity', desc: 'Electrical calculators, unit conversions, formulas, symbols and reference.' },
    { href: '#/learn', title: 'Reference', desc: 'Articles, glossary, symbols, tables and ASCII/encoding reference organized by topic.' },
  ];

  return frag(
    el('section', { class: 'hero' },
      el('div', {},
        el('span', { class: 'hero-eyebrow' }, 'Offline-first · No runtime dependencies'),
        el('h1', {}, 'Calculators, converters & online tools'),
        el('p', {}, \`Text and base conversion (\${nPairs} format pairs, \${nEncodings} encodings), \${nTools} calculators, \${nFamilies} unit families, web tools, and math/electrical/reference content — organized by topic. Everything runs locally in your browser.\`),
        el('div', { class: 'hero-actions' },
          el('a', { class: 'btn btn-primary btn-lg', href: '#/convert?from=text&to=hex' }, 'Text to hex converter'),
          el('a', { class: 'btn btn-lg', href: '#/calc' }, 'Calculators'),
          el('a', { class: 'btn btn-lg', href: '#/web-tools' }, 'Web tools'),
        ),
      ),
      el('div', { class: 'hero-panel' },
        el('div', { class: 'hero-panel-head' },
          el('span', { class: 'dot' }), el('span', { class: 'dot' }), el('span', { class: 'dot' }),
          el('span', { style: 'margin-left:6px' }, 'hexkit · converter'),
        ),
        el('div', { class: 'hero-panel-body' },
          el('div', { class: 'hero-io' },
            el('span', { class: 'hero-io-label' }, 'input - text'),
            el('div', { class: 'hero-io-value' }, HERO_SAMPLE)),
          el('div', { class: 'hero-io' },
            el('span', { class: 'hero-io-label' }, 'output - hexadecimal'),
            el('div', { class: 'hero-io-value out' }, hex)),
          el('div', { class: 'byte-strip' }, ...Array.from(bytes, (b) => el('span', { class: 'byte' },
            el('i', {}, b.toString(16).toUpperCase().padStart(2, '0')),
            el('u', {}, b >= 32 && b < 127 ? String.fromCharCode(b) : '·')))),
        ),
        el('div', { class: 'hero-stats' },
          el('div', { class: 'hero-stat' }, el('b', {}, String(nPairs)), el('span', {}, 'format pairs')),
          el('div', { class: 'hero-stat' }, el('b', {}, String(nTools)), el('span', {}, 'calculators')),
          el('div', { class: 'hero-stat' }, el('b', {}, String(nUnits)), el('span', {}, 'units')),
          el('div', { class: 'hero-stat' }, el('b', {}, String(nEncodings)), el('span', {}, 'encodings')),
        ),
      ),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Topics')),
      el('div', { class: 'grid grid-2' },
        ...topics.map((t) => el('a', { class: 'tool-card', href: t.href },
          el('h3', {}, t.title),
          el('p', {}, t.desc)))),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Quick converters & tools'), el('a', { href: '#/conversion', style: 'font-size:14px' }, 'All conversion →')),
      el('div', { class: 'grid grid-3' },
        el('a', { class: 'tool-card', href: '#/convert?from=text&to=hex' }, el('h3', {}, 'Text to Hex'), el('p', {}, 'Convert text to hexadecimal bytes and back.')),
        el('a', { class: 'tool-card', href: '#/ascii' }, el('h3', {}, 'ASCII table'), el('p', {}, 'Character codes 0-127 with binary and hex.')),
        el('a', { class: 'tool-card', href: '#/base' }, el('h3', {}, 'Number base converter'), el('p', {}, 'Exact arithmetic in bases 2-36.')),
        el('a', { class: 'tool-card', href: '#/notepad' }, el('h3', {}, 'Online Notepad'), el('p', {}, 'Private, autosaving scratchpad.')),
        el('a', { class: 'tool-card', href: '#/tool/scientific-calc' }, el('h3', {}, 'Scientific calculator'), el('p', {}, 'Evaluate expressions with common functions.')),
        el('a', { class: 'tool-card', href: '#/web-tools/stopwatch' }, el('h3', {}, 'Stopwatch'), el('p', {}, 'Measure elapsed time in your browser.')),
      ),
    ),
  );
}
`;

s = s.slice(0, i) + replacement + s.slice(j);
fs.writeFileSync(path, s);
console.log('replaced home');
