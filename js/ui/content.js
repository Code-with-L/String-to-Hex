/** Content and reference views: hero, articles, glossary, symbols, tables. */

import { el, frag, mount } from './dom.js';
import { icon, SYMBOLS, SYMBOL_GROUPS } from './icons.js';
import { GLOSSARY, GLOSSARY_GROUPS, ARTICLES, TABLES, COMPONENTS } from '../data/reference.js';
import { TOOLS, TOOL_BY_ID, toolsInGroup } from '../data/tools.js';
import { FAMILIES, FAMILY_IDS } from '../data/units.js';
import { bytesToHex, textToBytes, FORMATS, ENCODINGS } from '../data/formats.js';

/* ── block renderer — one function turns data into nodes ───────────────── */

export function renderBlocks(blocks) {
  return blocks.map((b) => {
    switch (b.k) {
      case 'definition':
        return el('p', { class: 'definition' }, b.t);
      case 'h3':
        return el('h3', {}, b.t);
      case 'p':
        return el('p', {}, b.t);
      case 'list':
        return el('ul', {}, ...b.items.map((i) => el('li', {}, i)));
      case 'formula':
        return el('div', { class: 'formula' },
          el('span', { class: 'eq' }, b.eq),
          b.note ? el('span', { class: 'note' }, b.note) : null);
      case 'callout':
        return el('div', { class: 'callout' },
          el('span', { class: 'callout-icon' }, icon(b.icon ?? 'info', { size: 17 })),
          el('div', {}, el('strong', {}, b.title ?? 'Note'), b.t));
      case 'symbols':
        return el('ul', { class: 'symbols' }, ...b.rows.map(([s, d]) =>
          el('li', {}, el('b', {}, s), el('span', {}, d))));
      case 'table':
        return el('div', { class: 'table-scroll', style: 'margin:16px 0' },
          el('table', {},
            el('thead', {}, el('tr', {}, ...b.head.map((h) => el('th', {}, h)))),
            el('tbody', {}, ...b.rows.map((r) => el('tr', {}, ...r.map((c) => el('td', {}, String(c))))))));
      case 'symbols-grid':
        return symbolGrid(b.groups);
      default:
        return null;
    }
  });
}

export const symbolGrid = (groups) => frag(...groups.map((grp) => el('section', { class: 'section' },
  el('div', { class: 'section-head' },
    el('h2', {}, grp.title),
    el('span', { style: 'color:var(--ink-faint);font-size:14px' }, grp.blurb)),
  el('div', { class: 'symbol-grid' }, ...grp.keys.map((k) => {
    const s = SYMBOLS[k];
    if (!s) return null;
    const card = el('div', { class: 'symbol-card' });
    card.append(s.svg, el('b', {}, s.label), el('small', {}, s.note));
    return card;
  })),
)));

/* ── hero ───────────────────────────────────────────────────────────────── */

const HERO_SAMPLE = 'Plant trees';

export function viewHome() {
  const bytes = textToBytes(HERO_SAMPLE, 'utf-8');
  const hex = bytesToHex(bytes, { delimiter: ' ' });

  const featured = ['ohms-law', 'kirchhoff', 'quadratic', 'stddev', 'wire-gauge', 'color-convert'];

  // Counted, never typed: these numbers appear in marketing copy and would
  // silently go stale the moment a tool is added.
  const nTools = TOOLS.length;
  const nFamilies = FAMILY_IDS.length;
  const nUnits = FAMILY_IDS.reduce((a, f) => a + Object.keys(FAMILIES[f].units).length, 0);
  const nPairs = FORMATS.length ** 2;
  const nEncodings = ENCODINGS.length;

  return frag(
    /* ── hero ── */
    el('section', { class: 'hero' },
      el('div', {},
        el('span', { class: 'hero-eyebrow' }, 'Offline-first · Zero dependencies'),
        el('h1', {}, 'String to hex, ', el('em', {}, 'and every other base'), ' — instantly'),
        el('p', {}, `Paste text and read the bytes. Swap to hex, binary, decimal, octal or Base64 across all ${nPairs} ordered pairs, with ${nEncodings} character encodings. Then ${nTools} calculators, ${nFamilies} unit families and a reference library that actually teaches you.`),
        el('div', { class: 'hero-actions' },
          el('a', { class: 'btn btn-primary btn-lg', href: '#/convert?from=text&to=hex' }, 'Open the converter'),
          el('a', { class: 'btn btn-lg', href: '#/tools' }, 'Browse calculators'),
          el('a', { class: 'btn btn-lg', href: '#/learn' }, 'Read the formulas'),
        ),
      ),
      el('div', { class: 'hero-panel' },
        el('div', { class: 'hero-panel-head' },
          el('span', { class: 'dot' }), el('span', { class: 'dot' }), el('span', { class: 'dot' }),
          el('span', { style: 'margin-left:6px' }, 'hexkit · converter'),
        ),
        el('div', { class: 'hero-panel-body' },
          el('div', { class: 'hero-io' },
            el('span', { class: 'hero-io-label' }, 'input — text'),
            el('div', { class: 'hero-io-value' }, HERO_SAMPLE)),
          el('div', { class: 'hero-io' },
            el('span', { class: 'hero-io-label' }, 'output — hexadecimal'),
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

    /* ── featured tools ── */
    el('section', { class: 'section' },
      el('div', { class: 'section-head' },
        el('h2', {}, 'Start here'),
        el('a', { href: '#/tools', style: 'font-size:14px' }, `All ${nTools} calculators →`)),
      el('div', { class: 'grid grid-2' },
        ...featured.map((id) => toolCard(TOOL_BY_ID[id])).filter(Boolean)),
    ),

    /* ── learn ── */
    el('section', { class: 'section' },
      el('div', { class: 'section-head' },
        el('h2', {}, 'Reference library'),
        el('a', { href: '#/learn', style: 'font-size:14px' }, 'Everything →')),
      el('div', { class: 'rail-list' },
        ...Object.entries(ARTICLES).map(([slug, a], i) => el('a', { class: 'rail-row', href: `#/read/${slug}` },
          el('span', { class: 'n' }, String(i + 1).padStart(2, '0')),
          el('span', {}, el('b', {}, a.title), el('small', {}, a.summary)),
          el('span', { class: 'arrow' }, '→'))),
      ),
    ),

    /* ── units ── */
    el('section', { class: 'section' },
      el('div', { class: 'section-head' },
        el('h2', {}, 'Unit families'),
        el('a', { href: '#/units', style: 'font-size:14px' }, `All ${nFamilies} families →`)),
      el('div', { class: 'chips' },
        ...FAMILY_IDS.map((id) => el('a', { class: 'chip', href: `#/units/${id}` },
          el('b', {}, FAMILIES[id].title),
          el('span', { class: 'chip-count' }, `${Object.keys(FAMILIES[id].units).length}`)))),
    ),
  );
}

export const toolCard = (tool) => (tool ? el('a', { class: 'tool-card', href: `#/tool/${tool.id}` },
  el('h3', {}, tool.title),
  el('p', {}, tool.blurb ?? ''),
) : null);

/* ── article page ───────────────────────────────────────────────────────── */

export function viewArticle(slug) {
  const a = ARTICLES[slug];
  if (!a) return notFoundRef(`No article called “${slug}”.`);

  const related = Object.entries(ARTICLES)
    .filter(([s]) => s !== slug)
    .slice(0, 3);

  const node = frag(
    el('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' },
      el('a', { href: '#/' }, 'Home'),
      el('span', { 'aria-hidden': 'true' }, '/'),
      el('a', { href: '#/learn' }, 'Reference'),
      el('span', { 'aria-hidden': 'true' }, '/'),
      el('span', {}, a.title),
    ),
    el('article', {},
      el('header', { class: 'page-head' },
        el('span', { class: 'hero-eyebrow' }, a.kicker),
        el('h1', {}, a.title),
        el('p', {}, a.summary),
      ),
      el('div', { class: 'panel prose' }, ...renderBlocks(a.blocks)),
      a.tool && TOOL_BY_ID[a.tool] ? el('section', { class: 'section' },
        el('div', { class: 'section-head' }, el('h2', {}, 'Put it into practice')),
        el('div', { class: 'grid grid-2' }, toolCard(TOOL_BY_ID[a.tool])),
      ) : null,
      el('section', { class: 'section' },
        el('div', { class: 'section-head' }, el('h2', {}, 'Keep reading')),
        el('div', { class: 'grid grid-3' }, ...related.map(([s, r]) =>
          el('a', { class: 'tool-card', href: `#/read/${s}` },
            el('h3', {}, r.title),
            el('p', {}, r.summary)))),
      ),
      el('p', { style: 'margin-top:26px' },
        el('a', { href: '#/learn' }, '← Back to the reference library')),
    ),
  );

  node.pageTitle = `${a.title} — HexKit Reference`;
  node.pageDescription = a.summary;
  return node;
}

/* ── reference index ────────────────────────────────────────────────────── */

export function viewLearn() {
  return frag(
    el('nav', { class: 'crumbs' }, el('a', { href: '#/' }, 'Home'), el('span', { 'aria-hidden': 'true' }, '/'), el('span', {}, 'Reference')),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Reference library'),
      el('h1', {}, 'Formulas, terms and symbols'),
      el('p', {}, 'Every entry gives the definition, the intuition, the formula with each symbol defined, and a calculator that solves it. Written to be read, not skimmed.'),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Articles')),
      el('div', { class: 'rail-list' },
        ...Object.entries(ARTICLES).map(([slug, a], i) => el('a', { class: 'rail-row', href: `#/read/${slug}` },
          el('span', { class: 'n' }, String(i + 1).padStart(2, '0')),
          el('span', {}, el('b', {}, a.title), el('small', {}, a.summary)),
          el('span', { class: 'arrow' }, '→')))),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Quick reference')),
      el('div', { class: 'grid grid-2' },
        el('a', { class: 'tool-card', href: '#/glossary' }, el('h3', {}, 'Glossary'), el('p', {}, `${Object.keys(GLOSSARY).length} terms across electricity, circuits, units and computing.`)),
        el('a', { class: 'tool-card', href: '#/symbols' }, el('h3', {}, 'Circuit symbols'), el('p', {}, `${Object.keys(SYMBOLS).length} symbols drawn as clean SVG instead of bitmap files.`)),
        el('a', { class: 'tool-card', href: '#/tables' }, el('h3', {}, 'Reference tables'), el('p', {}, 'Resistor colours, material resistivity and wire current capacity.')),
        el('a', { class: 'tool-card', href: '#/ascii' }, el('h3', {}, 'ASCII table'), el('p', {}, '0–127 with binary and the positional expansion of each code.')),
      ),
    ),
  );
}

/* ── glossary ───────────────────────────────────────────────────────────── */

export function viewGlossary() {
  const node = frag(
    el('nav', { class: 'crumbs' }, el('a', { href: '#/' }, 'Home'), el('span', { 'aria-hidden': 'true' }, '/'), el('a', { href: '#/learn' }, 'Reference'), el('span', { 'aria-hidden': 'true' }, '/'), el('span', {}, 'Glossary')),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Reference'),
      el('h1', {}, 'Glossary'),
      el('p', {}, `${Object.keys(GLOSSARY).length} terms, grouped by area. Each links to the calculator that works with it.`),
    ),
    ...GLOSSARY_GROUPS.map((group) => {
      const entries = Object.entries(GLOSSARY).filter(([, g]) => g.group === group);
      if (!entries.length) return null;
      return el('section', { class: 'section' },
        el('div', { class: 'section-head' }, el('h2', {}, group)),
        el('div', { class: 'grid grid-2' },
          ...entries.map(([key, g]) => el('a', { class: 'tool-card', href: `#/glossary/${key}` },
            el('h3', {}, g.symbol && g.symbol !== '—' ? `${g.term}  ${g.symbol}` : g.term),
            el('p', {}, g.short),
            g.tool ? el('span', { class: 'card-tag' }, 'solver →') : null))),
      );
    }),
  );
  node.pageTitle = 'Glossary — HexKit Reference';
  node.pageDescription = `Definitions for ${Object.keys(GLOSSARY).length} electrical, circuit, unit and computing terms.`;
  return node;
}

export function viewGlossaryEntry(key) {
  const g = GLOSSARY[key];
  if (!g) return notFoundRef(`No glossary entry called “${key}”.`);
  const seeAlso = (g.seeAlso ?? []).map((k) => GLOSSARY[k]).filter(Boolean);
  const node = frag(
    el('nav', { class: 'crumbs' },
      el('a', { href: '#/' }, 'Home'),
      el('span', { 'aria-hidden': 'true' }, '/'),
      el('a', { href: '#/learn' }, 'Reference'),
      el('span', { 'aria-hidden': 'true' }, '/'),
      el('a', { href: '#/glossary' }, 'Glossary'),
      el('span', { 'aria-hidden': 'true' }, '/'),
      el('span', {}, g.term),
    ),
    el('article', {},
      el('header', { class: 'page-head' },
        el('span', { class: 'hero-eyebrow' }, g.group),
        el('h1', {}, g.term),
        el('p', {}, g.short),
      ),
      el('div', { class: 'panel prose' },
        el('p', { class: 'definition' }, g.def),
        g.intuition ? frag(
          el('h3', {}, 'Intuition'),
          el('p', {}, g.intuition)) : null,
        g.formula ? el('div', { class: 'formula' },
          el('span', { class: 'eq' }, g.formula),
          g.unit && g.unit !== '—' ? el('span', { class: 'note' }, `measured in ${g.unit}`) : null) : null,
        g.symbol && g.symbol !== '—' ? el('p', {}, 'Symbol: ', el('strong', {}, g.symbol), g.unit && g.unit !== '—' ? ` · unit: ${g.unit}` : '') : null,
        g.tool && TOOL_BY_ID[g.tool] ? el('p', {}, 'Solve it: ', el('a', { href: `#/tool/${g.tool}` }, TOOL_BY_ID[g.tool].title)) : null,
        seeAlso.length ? frag(
          el('h3', {}, 'See also'),
          el('ul', {}, ...seeAlso.map((s) => el('li', {},
            el('a', { href: `#/glossary/${Object.keys(GLOSSARY).find((k) => GLOSSARY[k] === s)}` }, s.term),
            ' — ', s.short)))) : null,
      ),
      el('p', { style: 'margin-top:22px' }, el('a', { href: '#/glossary' }, '← Back to the glossary')),
    ),
  );
  node.pageTitle = `${g.term} — HexKit Glossary`;
  node.pageDescription = g.short;
  return node;
}

/* ── symbols ────────────────────────────────────────────────────────────── */

export function viewSymbols() {
  const node = frag(
    el('nav', { class: 'crumbs' }, el('a', { href: '#/' }, 'Home'), el('span', { 'aria-hidden': 'true' }, '/'), el('a', { href: '#/learn' }, 'Reference'), el('span', { 'aria-hidden': 'true' }, '/'), el('span', {}, 'Circuit symbols')),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Reference'),
      el('h1', {}, 'Circuit symbols'),
      el('p', {}, `${Object.keys(SYMBOLS).length} symbols as scalable vector graphics. Every one is drawn from the IEC/ANSI convention so it reads the way a schematic on the bench would.`),
    ),
    symbolGrid(SYMBOL_GROUPS),
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
    el('p', { style: 'margin-top:20px' }, el('a', { href: '#/resistor-colours' }, 'Read a resistor’s colour bands →')),
  );
  node.pageTitle = 'Circuit symbols — HexKit Reference';
  node.pageDescription = `${Object.keys(SYMBOLS).length} electrical circuit symbols drawn as SVG, grouped by function.`;
  return node;
}

/* ── reference tables ───────────────────────────────────────────────────── */

/** Build tables from precomputed bindings — layout stays shallow and easy to read. */
export function viewTables() {
  const R = TABLES.resistors;
  const mul = TABLES.multiplication;
  const add = TABLES.addition;
  const logs = TABLES.logarithms;
  const temps = TABLES.temperatures;
  const rom = TABLES.roman;
  const romSymbolRows = rom.symbols.map(([s, v, name]) =>
    el('tr', {}, el('td', { class: 'mono', style: 'font-weight:600' }, s), el('td', { class: 'mono' }, v), el('td', { style: 'color:var(--ink-faint)' }, name)));
  const romCells = rom.chart.map(([n, roman]) =>
    el('td', { class: 'mono rom-cell' }, el('b', {}, n), ' ', roman));
  const romRows = Array.from({ length: 20 }, (_, r) =>
    el('tr', {}, ...romCells.slice(r * 5, r * 5 + 5)));

  const mulHead = Array.from({ length: mul.size }, (_, i) => el('th', { class: 'mono' }, String(i + 1)));
  const mulRows = mul.rows.map((row, i) =>
    el('tr', {}, el('th', { class: 'mono' }, String(i + 1)),
      ...row.map((v) => el('td', { class: 'mono' }, String(v)))));
  const addHead = Array.from({ length: add.size + 1 }, (_, i) => el('th', { class: 'mono' }, String(i)));
  const addRows = add.rows.map((row, i) =>
    el('tr', {}, el('th', { class: 'mono' }, String(i)),
      ...row.map((v) => el('td', { class: 'mono' }, String(v)))));
  const logRows = logs.rows.map(([x, l10, le]) =>
    el('tr', {}, el('td', { class: 'mono' }, x), el('td', { class: 'mono' }, l10), el('td', { class: 'mono' }, le)));
  const tempRows = temps.rows.map((r) =>
    el('tr', {}, el('td', { class: 'mono' }, r[0]), el('td', { class: 'mono', style: 'color:var(--data)' }, r[1]), el('td', { style: 'color:var(--ink-faint)' }, r[2])));
  const namedRows = TABLES.named.rows.map((r) =>
    el('tr', {},
      el('td', {}, el('span', { class: 'swatch-inline', style: 'background:' + r.hex }), ' ', r.name),
      el('td', { class: 'mono' }, r.hex),
      el('td', { class: 'mono' }, r.rgb),
      el('td', { class: 'mono' }, r.hsl)));
  const webSafeCells = TABLES.webSafe.rows.map((hex) =>
    el('div', { class: 'web-safe-cell', style: 'background:' + hex, title: hex },
      el('span', {}, hex.slice(1).toUpperCase())));
  const altCells = TABLES.altCodes.rows.map(([code, char]) =>
    el('div', { class: 'alt-cell', title: 'ALT ' + code },
      el('span', { class: 'alt-char' }, char === ' ' ? '·' : char),
      el('span', { class: 'alt-code' }, code)));

  const swatch = (hex) => el('span', {
    style: `display:inline-block;width:14px;height:14px;border-radius:3px;vertical-align:-2px;margin-right:7px;border:1px solid var(--line-2);background:${hex || 'var(--panel-3)'}`,
  });

  const node = frag(
    el('nav', { class: 'crumbs' }, el('a', { href: '#/' }, 'Home'), el('span', { 'aria-hidden': 'true' }, '/'), el('a', { href: '#/learn' }, 'Reference'), el('span', { 'aria-hidden': 'true' }, '/'), el('span', {}, 'Tables')),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Reference'),
      el('h1', {}, 'Reference tables'),
      el('p', {}, 'The lookup tables that keep getting scrolled past on other sites.'),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, R.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, R.blurb)),
      el('div', { class: 'grid grid-3' },
        bandTable('Digits', R.bands, swatch),
        bandTable('Multipliers', R.multipliers, swatch),
        bandTable('Tolerance', R.tolerance, swatch),
      ),
      el('div', { style: 'margin-top:14px' },
        el('a', { class: 'btn btn-primary', href: '#/tool/resistor-color' }, 'Decode a resistor →')),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, TABLES.conductivity.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, TABLES.conductivity.blurb)),
      el('div', { class: 'table-scroll' }, tableEl(['Material', 'Resistivity (Ω·m)', 'Note'],
        TABLES.conductivity.rows.map((r) => el('tr', {}, el('td', { style: 'font-weight:600' }, r[0]), el('td', { class: 'mono' }, r[1]), el('td', { style: 'color:var(--ink-faint)' }, r[2]))))),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, mul.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, mul.blurb)),
      el('div', { class: 'table-scroll' }, el('table', { class: 'mul-table' },
        el('thead', {}, el('tr', {}, el('th', {}, '×'), ...mulHead)),
        el('tbody', {}, ...mulRows))),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, add.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, add.blurb)),
      el('div', { class: 'table-scroll' }, el('table', { class: 'mul-table' },
        el('thead', {}, el('tr', {}, el('th', {}, '+'), ...addHead)),
        el('tbody', {}, ...addRows))),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, rom.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, rom.blurb)),
      el('div', { class: 'grid grid-2' },
        el('div', { class: 'panel' },
          el('h3', { class: 'panel-title' }, 'Symbols'),
          el('table', {}, el('tbody', {}, ...romSymbolRows))),
        el('div', { class: 'panel' },
          el('h3', { class: 'panel-title' }, 'The subtractive rules'),
          el('p', {}, rom.subtractive))),
      el('div', { class: 'table-scroll', style: 'margin-top:16px' }, el('table', { class: 'mul-table' },
        el('tbody', {}, ...romRows))),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, logs.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, logs.blurb)),
      el('div', { class: 'table-scroll' }, tableEl(['x', 'log₁₀(x)', 'ln(x)'], logRows)),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, TABLES.named.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, TABLES.named.blurb)),
      el('div', { class: 'table-scroll' }, tableEl(['Colour', 'Hex', 'RGB', 'HSL'], namedRows)),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, TABLES.webSafe.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, TABLES.webSafe.blurb)),
      el('div', { class: 'web-safe-grid' }, ...webSafeCells),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, TABLES.altCodes.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, TABLES.altCodes.blurb)),
      el('div', { class: 'alt-grid' }, ...altCells),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, temps.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, temps.blurb)),
      el('div', { class: 'table-scroll' }, tableEl(['°C', '°F', 'Why it matters'], tempRows)),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, TABLES.wireCurrent.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, TABLES.wireCurrent.blurb)),
      el('div', { class: 'table-scroll' }, tableEl(['Cross-section', 'AWG', 'Capacity', 'Typical use'],
        TABLES.wireCurrent.rows.map((r) => el('tr', {}, el('td', { class: 'mono' }, r[0]), el('td', { class: 'mono' }, r[1]), el('td', { class: 'mono', style: 'color:var(--data)' }, r[2]), el('td', { style: 'color:var(--ink-faint)' }, r[3]))))),
    ),
  );

  node.pageTitle = 'Reference tables — HexKit';
  node.pageDescription = 'Multiplication, addition, logarithm, roman-numeral, temperature, resistor colour code, named CSS colours, the 216-colour web-safe palette and the Windows ALT codes.';
  return node;
}

/** Shared table shell used by every table section in the view. */
function tableEl(headers, rows) {
  return el('table', {},
    el('thead', {}, el('tr', {}, ...headers.map((h) => el('th', {}, h)))),
    el('tbody', {}, ...rows));
}

function bandTable(title, rows, swatch) {
  return el('div', { class: 'panel' },
    el('h3', { class: 'panel-title' }, title),
    el('table', {},
      el('thead', {}, el('tr', {}, el('th', {}, 'Band'), el('th', {}, 'Value'))),
      el('tbody', {}, ...rows.map((r) => el('tr', {},
        el('td', {}, swatch(r.hex), r.code),
        el('td', { class: 'mono' }, r.value))))));
}

/* ── fallback ───────────────────────────────────────────────────────────── */

function notFoundRef(message) {
  const node = frag(
    el('section', { class: 'page-head' }, el('h1', {}, 'Not found'), el('p', {}, message)),
    el('div', { class: 'grid grid-2' },
      el('a', { class: 'tool-card', href: '#/learn' }, el('h3', {}, 'Reference library'), el('p', {}, 'Formulas, glossary and symbols.')),
      el('a', { class: 'tool-card', href: '#/tools' }, el('h3', {}, 'Calculators'), el('p', {}, `${TOOLS.length} tools.`)),
    ),
  );
  node.pageTitle = 'Not found — HexKit';
  return node;
}