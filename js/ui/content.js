/** Content and reference views: hero, articles, glossary, symbols, tables. */

import { el, frag, mount } from './dom.js';
import { icon, SYMBOLS, SYMBOL_GROUPS } from './icons.js';
import { GLOSSARY, GLOSSARY_GROUPS, ARTICLES, TABLES, COMPONENTS } from '../data/reference.js';
import { TOOLS, TOOL_BY_ID, toolsInGroup } from '../data/tools.js';
import { FAMILIES, FAMILY_IDS } from '../data/units.js';
import { TOPIC_SETS, articleTopic, articleSiblings } from '../data/topics.js';
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
        return symbolGrid(b.groups); // groups should be SYMBOL_GROUPS with keys referencing SYMBOLS
      case 'symbols-credits':
        return el('p', { class: 'symbol-attrib' }, 'Symbol artwork sourced from Wikimedia Commons; see SYMBOLS.md for per-file attribution and licenses.');
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
  const nArticles = Object.keys(ARTICLES).length;

  // The topic index: every section of the site, in the order a visitor
  // meets it. Clicking one lands on a page with its own Contents table.
  const contentTopics = [
    { icon: 'calc', label: 'Calculators', href: '#/calc', desc: `${nTools} calculators` },
    { icon: 'swap', label: 'Conversion', href: '#/conversion', desc: `${nFamilies} unit families` },
    { icon: 'grid', label: 'Web Tools', href: '#/web-tools', desc: 'browser-based tools' },
    { icon: 'bolt', label: 'Electricity & Electronics', href: '#/electricity', desc: 'formulas, notes & calculators' },
    { icon: 'sigma', label: 'Mathematics', href: '#/math', desc: 'calculators & formulas' },
    { icon: 'hash', label: 'Text & Encoding', href: '#/ascii', desc: 'ASCII, radix, Base64' },
    { icon: 'book', label: 'Reference', href: '#/learn', desc: `${nArticles} notes` },
  ];

  // A short, hand-picked set of notes. The full library lives under
  // Reference - listing all of it here would bury the rest of the page.
  const startNotes = [
    'resistor-value', 'led-resistor', 'transistor-biasing', 'diode-calculation',
    'voltage-divider', 'capacitor-time-constant', 'ohms-law', 'kirchhoff-laws',
    'three-phase-power', 'energy-cost', 'exponent-rules', 'probability-distributions',
  ].map((slug) => [slug, ARTICLES[slug]]).filter(([, a]) => a);

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

    /* ── content: the topic index ── */
    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Content')),
      el('ul', { class: 'content-list' },
        ...contentTopics.map((t) => el('li', {}, el('a', { href: t.href },
          el('span', { class: 'content-icon' }, icon(t.icon, { size: 17 })),
          el('span', { class: 'content-label' }, t.label),
          el('span', { class: 'content-desc' }, t.desc))))),
    ),

    /* ── learn ── */
    el('section', { class: 'section' },
      el('div', { class: 'section-head' },
        el('h2', {}, 'Reference notes'),
        el('a', { href: '#/learn', style: 'font-size:14px' }, `All ${nArticles} notes →`)),
      el('div', { class: 'rail-list' },
        ...startNotes.map(([slug, a], i) => el('a', { class: 'rail-row', href: `#/read/${slug}` },
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

  // Breadcrumb and neighbours follow the topic the note is filed under, so
  // every note points at the subtopic it belongs to instead of a flat list.
  const topic = articleTopic(slug);
  const related = articleSiblings(slug, 3).map((s) => [s, ARTICLES[s]]).filter(([, r]) => r);

  const node = frag(
    el('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' },
      el('a', { href: '#/' }, 'Home'),
      el('span', { 'aria-hidden': 'true' }, '/'),
      el('a', { href: topic.href }, topic.label),
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

/* ── reference index ─────────────────────────────────────────────────── */

export function viewLearn() {
  const groups = TOPIC_SETS.reference;
  const node = frag(
    crumbs(el('span', {}, 'Reference')),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Reference'),
      el('h1', {}, 'Reference library'),
      el('p', {}, 'Articles, formulas, glossary, symbols, tables and encoding reference, arranged by subtopic.'),
    ),
    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Reference topics')),
      el('div', { class: 'grid grid-2' },
        el('a', { class: 'tool-card', href: '#/math' }, el('h3', {}, 'Math'), el('p', {}, 'Math calculators, formulas and reference.')),
        el('a', { class: 'tool-card', href: '#/electricity' }, el('h3', {}, 'Electricity'), el('p', {}, 'Electrical calculators, formulas, symbols and reference.')),
        el('a', { class: 'tool-card', href: '#/ascii' }, el('h3', {}, 'ASCII & encoding'), el('p', {}, 'ASCII table, character codes, byte breakdown and text/base conversion.')),
        el('a', { class: 'tool-card', href: '#/glossary' }, el('h3', {}, 'Glossary'), el('p', {}, `${Object.keys(GLOSSARY).length} terms across electricity, circuits, units and computing.`)),
        el('a', { class: 'tool-card', href: '#/symbols' }, el('h3', {}, 'Circuit symbols'), el('p', {}, `${Object.keys(SYMBOLS).length} electrical and electronic symbols.`)),
        el('a', { class: 'tool-card', href: '#/tables' }, el('h3', {}, 'Reference tables'), el('p', {}, 'Math, color, resistor, wire and other reference tables.')),
      ),
    ),
    topicContents(groups, '#/learn'),
    ...groups.map(topicSection),
  );
  node.pageTitle = 'Reference - HexKit';
  node.pageDescription = 'Articles, formulas, glossary, symbols, tables and encoding reference, arranged by subtopic.';
  return node;
}

/* ── glossary ───────────────────────────────────────────────────────────── */

export function viewGlossary() {
  const node = frag(
    crumbs(el('a', { href: '#/learn' }, 'Reference'), el('span', {}, 'Glossary')),
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
            el('h3', {}, g.symbol && g.symbol !== '-' ? `${g.term}  ${g.symbol}` : g.term),
            el('p', {}, g.short),
            g.tool ? el('span', { class: 'card-tag' }, 'solver →') : null))),
      );
    }),
  );
  node.pageTitle = 'Glossary - HexKit Reference';
  node.pageDescription = `Definitions for ${Object.keys(GLOSSARY).length} electrical, circuit, unit and computing terms.`;
  return node;
}


export function viewGlossaryEntry(key) {
  const g = GLOSSARY[key];
  if (!g) return notFoundRef(`No glossary entry called “${key}”.`);
  const seeAlso = (g.seeAlso ?? []).map((k) => GLOSSARY[k]).filter(Boolean);
  const node = frag(
    crumbs(el('a', { href: '#/learn' }, 'Reference'), el('a', { href: '#/glossary' }, 'Glossary'), el('span', {}, g.term)),
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

export function viewSymbols(route) {
  const sub = route?.segments?.[1];
  const only = sub ? SYMBOL_GROUPS.find((g) => g.id === sub) : null;
  if (sub && !only) return notFoundRef(`Symbol group "${sub}" not found.`);

  if (only) {
    const node = frag(
      crumbs(
        el('a', { href: '#/learn' }, 'Reference'),
        el('a', { href: '#/symbols' }, 'Circuit symbols'),
        el('span', {}, only.title),
      ),
      el('section', { class: 'page-head' },
        el('h1', {}, `${only.title} symbols`),
        el('p', {}, `${only.blurb} ${only.keys.length} symbols, sourced as SVG files from Wikimedia Commons.`),
      ),
      symbolGrid([only]),
      el('p', { style: 'margin-top:20px' }, el('a', { href: '#/symbols' }, '← All circuit symbols')),
    );
    node.pageTitle = `${only.title} symbols - HexKit Reference`;
    node.pageDescription = `${only.title} circuit symbols drawn as SVG, with per-file attribution.`;
    return node;
  }

  const node = frag(
    crumbs(el('a', { href: '#/learn' }, 'Reference'), el('span', {}, 'Circuit symbols')),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Reference'),
      el('h1', {}, 'Circuit symbols'),
      el('p', {}, `${Object.keys(SYMBOLS).length} circuit symbols sourced as SVG files from Wikimedia Commons (IEC/ANSI conventions). No symbols are hand-drawn in this app.`),
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
  const eSeriesPanels = TABLES.eseries.series.map((s) =>
    el('div', { class: 'panel' },
      el('h3', { class: 'panel-title' }, s.label),
      el('div', { class: 'chips' }, ...s.values.map((v) =>
        el('span', { class: 'chip mono' }, String(v))))));
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
    crumbs(el('a', { href: '#/learn' }, 'Reference'), el('span', {}, 'Tables')),
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
      el('div', { class: 'section-head' }, el('h2', {}, TABLES.awgCopper.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, TABLES.awgCopper.blurb)),
      el('div', { class: 'table-scroll' }, tableEl(TABLES.awgCopper.columns,
        TABLES.awgCopper.rows.map((r) => el('tr', {}, el('td', { class: 'mono', style: 'font-weight:600' }, r[0]), el('td', { class: 'mono' }, r[1]), el('td', { class: 'mono' }, r[2]), el('td', { class: 'mono', style: 'color:var(--data)' }, r[3]))))),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, temps.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, temps.blurb)),
      el('div', { class: 'table-scroll' }, tableEl(['°C', '°F', 'Why it matters'], tempRows)),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, TABLES.eseries.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, TABLES.eseries.blurb)),
      el('div', { class: 'grid grid-5' }, ...eSeriesPanels),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, TABLES.wireCurrent.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, TABLES.wireCurrent.blurb)),
      el('div', { class: 'table-scroll' }, tableEl(['Cross-section', 'AWG', 'Capacity', 'Typical use'],
        TABLES.wireCurrent.rows.map((r) => el('tr', {}, el('td', { class: 'mono' }, r[0]), el('td', { class: 'mono' }, r[1]), el('td', { class: 'mono', style: 'color:var(--data)' }, r[2]), el('td', { style: 'color:var(--ink-faint)' }, r[3]))))),
    ),

    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, TABLES.normalDist.title), el('span', { style: 'color:var(--ink-faint);font-size:14px' }, TABLES.normalDist.blurb)),
      el('p', { style: 'margin:0 0 14px;color:var(--ink-dim);font-size:14px' },
        'Φ(z) is the fraction of a bell curve to the left of z (0.5 = the median); φ(z) is the height of the curve at z. The interval 1.96σ on each side covers ', el('b', {}, '95%'), ' of outcomes — the usual rule of thumb.'),
      el('div', { class: 'table-scroll z-table-scroll' }, tableEl(['z', 'Φ(z)', 'φ(z)'],
        TABLES.normalDist.rows.map((r) => {
          const z = parseFloat(r[0]);
          const hot = Math.abs(z - 1.96) < 0.001 || Math.abs(z - 0.00) < 0.001;
          return el('tr', { class: hot ? 'z-row-highlight' : '' }, el('td', { class: 'mono' }, r[0]), el('td', { class: 'mono' }, r[1]), el('td', { class: 'mono' }, r[2]));
        }))),
    ),
  );

  node.pageTitle = 'Reference tables — HexKit';
  node.pageDescription = 'Multiplication, addition, logarithm, roman-numeral, temperature, resistor colour code, named CSS colours, the 216-colour web-safe palette, the Windows ALT codes, the standard-normal z-table and the AWG copper wire chart.';
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

/* == RapidTables-style category pages == */

const byGroup = (id) => TOOLS.filter((t) => t.group === id);

const CALC_CATEGORIES = [
  { id: 'math', title: 'Math calculators', desc: 'Online math calculators and solvers.' },
  { id: 'electrical', title: 'Electrical calculators', desc: 'Electrical and electronics calculators.' },
  { id: 'wire', title: 'Wire calculators', desc: 'Wire gauge and electrical sizing calculators.' },
  { id: 'finance', title: 'Financial calculators', desc: 'Financial and money calculators.' },
  { id: 'health', title: 'Health calculators', desc: 'Fitness and health calculators.' },
  { id: 'time', title: 'Time & date calculators', desc: 'Time and date calculators.' },
  { id: 'number', title: 'Number calculators', desc: 'Number and base conversion calculators.' },
  { id: 'color', title: 'Color calculators', desc: 'Color conversion and code calculators.' },
  { id: 'text', title: 'Text calculators', desc: 'Text and encoding calculators.' },
  { id: 'general', title: 'Other calculators', desc: 'General purpose calculators and tools.' },
];

function crumbs(...items) {
  const parts = [el('a', { href: '#/' }, 'Home')];
  for (const it of items) {
    parts.push(el('span', { class: 'crumb-sep', 'aria-hidden': 'true' }, '›'));
    if (it.href) parts.push(el('a', { href: it.href }, it.label));
    else parts.push(el('span', { class: 'crumb-current' }, it.label));
  }
  return el('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' }, ...parts);
}

function linkList(items) {
  return el('ul', { class: 'link-list topic-list' }, ...items.map((it) => el('li', {}, el('a', { href: it.href }, it.title))));
}

/* ── topic layout: contents table + one section per subtopic ───────────── */

/**
 * Scroll to a subtopic without touching location.hash: a bare "#el-terms"
 * fragment would be parsed by the hash router as a route and render 404.
 * Smooth scrolling is ignored by some browsers (reduced motion, embedded
 * shells) and two-argument scrollTo() inherits scroll-behavior: smooth, so
 * verify the movement and force an instant jump if nothing happened.
 */
export function jumpToSection(id) {
  return (event) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 72);
    const from = window.scrollY;
    if (Math.abs(top - from) < 4) return;
    window.scrollTo({ top, behavior: 'smooth' });
    setTimeout(() => {
      if (Math.abs(window.scrollY - from) < 2) window.scrollTo({ top, behavior: 'instant' });
    }, 180);
  };
}

/** The Contents table that sits above a grouped topic page. */
function topicContents(groups, routeHref) {
  return el('section', { class: 'section' },
    el('div', { class: 'section-head' }, el('h2', {}, 'Contents')),
    el('div', { class: 'table-scroll' }, el('table', { class: 'toc-table' },
      el('thead', {}, el('tr', {}, el('th', {}, 'Subtopic'), el('th', {}, 'Links'))),
      el('tbody', {}, ...groups.map((g) => el('tr', {},
        el('td', {}, el('a', { href: routeHref, onclick: jumpToSection(g.id) }, g.title)),
        el('td', { class: 'mono' }, String(g.items.length))))))),
  );
}

/** One subtopic section, matching the id used by the Contents table. */
function topicSection(g) {
  return el('section', { class: 'section', id: g.id },
    el('div', { class: 'section-head' },
      el('h2', {}, g.title),
      g.blurb ? el('span', { style: 'color:var(--ink-faint);font-size:14px' }, g.blurb) : null),
    linkList(g.items));
}

export function viewCalc(route) {
  const sub = route?.segments?.[1];
  if (sub) {
    const cat = CALC_CATEGORIES.find((x) => x.id === sub);
    const items = byGroup(sub);
    if (!cat) return notFoundRef(`Calculator category "${sub}" not found.`);
    const node = frag(
      crumbs({ label: 'Calculators', href: '#/calc' }, { label: cat.title }),
      el('section', { class: 'page-head' }, el('h1', {}, cat.title), el('p', {}, cat.desc)),
      el('section', { class: 'section' }, el('div', { class: 'grid grid-2' }, ...items.map(toolCard)))
    );
    node.pageTitle = `${cat.title} - HexKit`;
    node.pageDescription = cat.desc;
    return node;
  }
  const node = frag(
    crumbs({ label: 'Calculators' }),
    el('section', { class: 'page-head' }, el('h1', {}, 'Online Calculators'), el('p', {}, 'Free online calculators organized by topic.')),
    ...CALC_CATEGORIES.map((cat) => {
      const items = byGroup(cat.id);
      if (!items.length) return null;
      return el('section', { class: 'section' },
        el('div', { class: 'section-head' }, el('h2', {}, cat.title), el('a', { href: `#/calc/${cat.id}`, style: 'font-size:14px' }, 'Open category →')),
        linkList(items.map((t) => ({ href: `#/tool/${t.id}`, title: t.title })))
      );
    })
  );
  node.pageTitle = 'Calculators - HexKit';
  node.pageDescription = 'Math, electrical, financial, health, time and other calculators organized by topic.';
  return node;
}

const CONVERSION_CATEGORIES = [
  { id: 'length', title: 'Length conversion' }, { id: 'mass', title: 'Weight conversion' }, { id: 'temperature', title: 'Temperature conversion' },
  { id: 'area', title: 'Area conversion' }, { id: 'volume', title: 'Volume conversion' }, { id: 'speed', title: 'Speed conversion' },
  { id: 'time', title: 'Time conversion' }, { id: 'pressure', title: 'Pressure conversion' }, { id: 'energy', title: 'Energy conversion' },
  { id: 'power', title: 'Power conversion' }, { id: 'frequency', title: 'Frequency conversion' }, { id: 'force', title: 'Force conversion' },
  { id: 'angle', title: 'Angle conversion' }, { id: 'data', title: 'Data storage conversion' }, { id: 'voltage', title: 'Voltage conversion' },
  { id: 'current', title: 'Current conversion' }, { id: 'resistance', title: 'Resistance conversion' }, { id: 'charge', title: 'Electric charge conversion' },
  { id: 'capacitance', title: 'Capacitance conversion' }, { id: 'inductance', title: 'Inductance conversion' }, { id: 'concentration', title: 'Concentration conversion' },
  { id: 'light', title: 'Light conversion' }, { id: 'illuminance', title: 'Illuminance conversion' }, { id: 'torque', title: 'Torque conversion' },
];

export function viewConversion() {
  const node = frag(
    crumbs({ label: 'Conversion' }),
    el('section', { class: 'page-head' }, el('h1', {}, 'Unit Conversion'), el('p', {}, 'Online unit converters organized by topic.')),
    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Conversion categories')),
      linkList(CONVERSION_CATEGORIES.map((c) => ({ href: `#/units/${c.id}`, title: c.title })))
    ),
    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Number & text conversion')),
      linkList([
        { href: '#/convert', title: 'Text, hex, binary, decimal, octal, Base64 converter' },
        { href: '#/ascii', title: 'ASCII table' },
        { href: '#/base', title: 'Number base converter' },
      ])
    )
  );
  node.pageTitle = 'Conversion - HexKit';
  node.pageDescription = 'Length, weight, temperature, area, volume, speed, power, energy and more unit converters.';
  return node;
}

export const WEB_TOOLS = [
  { title: 'Alarm Clock', href: '#/web-tools/alarm-clock' },
  { title: 'Bar graph maker', href: '#/web-tools/bar-graph' },
  { title: 'Battery charge manager', href: '#/web-tools/battery' },
  { title: 'Calendar', href: '#/web-tools/calendar' },
  { title: 'Call Recorder', href: '#/web-tools/call-recorder' },
  { title: 'Camera online', href: '#/web-tools/camera' },
  { title: 'Chart online maker', href: '#/web-tools/chart-maker' },
  { title: 'Click counter online', href: '#/web-tools/click-counter' },
  { title: 'CPS test', href: '#/web-tools/cps-test' },
  { title: 'Countdown Timer', href: '#/web-tools/countdown-timer' },
  { title: 'Current Time', href: '#/web-tools/current-time' },
  { title: 'Flashlight online', href: '#/web-tools/flashlight' },
  { title: 'Line graph maker', href: '#/web-tools/line-graph' },
  { title: 'Online Calculator', href: '#/tool/scientific-calc' },
  { title: 'Online grocery list', href: '#/web-tools/grocery-list' },
  { title: 'Mic test', href: '#/web-tools/mic-test' },
  { title: 'Online clock', href: '#/web-tools/clock' },
  { title: 'Online Mirror', href: '#/web-tools/mirror' },
  { title: 'Online Notepad', href: '#/notepad' },
  { title: 'Online Notes', href: '#/web-tools/notes' },
  { title: 'Password generator', href: '#/tool/password' },
  { title: 'Pie chart maker', href: '#/web-tools/pie-chart' },
  { title: 'Random number generator', href: '#/tool/random' },
  { title: 'XY Scatter plot maker', href: '#/web-tools/scatter-plot' },
  { title: 'Scoreboard online', href: '#/web-tools/scoreboard' },
  { title: 'Screen recorder online', href: '#/web-tools/screen-recorder' },
  { title: 'Online screenshot', href: '#/web-tools/screenshot' },
  { title: 'Speech to text', href: '#/web-tools/speech-to-text' },
  { title: 'Stopwatch', href: '#/web-tools/stopwatch' },
  { title: 'Text editor', href: '#/html-editor' },
  { title: 'Table chart maker', href: '#/web-tools/table-chart' },
  { title: 'Text to speech', href: '#/web-tools/text-to-speech' },
  { title: "Today's Date", href: '#/web-tools/todays-date' },
  { title: 'To-Do List', href: '#/web-tools/todo-list' },
  { title: 'Tone generator', href: '#/web-tools/tone-generator' },
  { title: 'Ruler (cm/mm) online', href: '#/web-tools/ruler-cm' },
  { title: 'Ruler (inch) online', href: '#/web-tools/ruler-inch' },
  { title: 'Voice recorder online', href: '#/web-tools/voice-recorder' },
  { title: 'Webcam test', href: '#/web-tools/webcam-test' },
];

export const WEB_TOOL_GROUPS = [
  { id: 'time', title: 'Time & date', items: ['Alarm Clock','Countdown Timer','Current Time','Online clock','Stopwatch',"Today's Date"] },
  { id: 'text', title: 'Notes & text', items: ['Online Notepad','Online Notes','Online grocery list','To-Do List','Text editor'] },
  { id: 'charts', title: 'Charts & graphs', items: ['Bar graph maker','Line graph maker','Pie chart maker','XY Scatter plot maker','Table chart maker','Chart online maker'] },
  { id: 'counters', title: 'Counters & tests', items: ['Click counter online','CPS test','Scoreboard online'] },
  { id: 'numbers', title: 'Calculators & generators', items: ['Online Calculator','Password generator','Random number generator'] },
  { id: 'media', title: 'Camera, mic & recording', items: ['Camera online','Online Mirror','Webcam test','Mic test','Voice recorder online','Call Recorder','Screen recorder online','Online screenshot'] },
  { id: 'audio', title: 'Audio & speech', items: ['Speech to text','Text to speech','Tone generator'] },
  { id: 'device', title: 'Device & measurement', items: ['Battery charge manager','Flashlight online','Ruler (cm/mm) online','Ruler (inch) online','Calendar'] },
];

function webToolItem(title) { return WEB_TOOLS.find(t => t.title === title); }

export function viewWebTools(route) {
  const sub = route?.segments?.[1];
  if (sub) return viewWebToolPage(sub);
  const groups = WEB_TOOL_GROUPS.map(g => ({ ...g, tools: g.items.map(webToolItem).filter(Boolean) })).filter(g => g.tools.length);
  const node = frag(
    crumbs({ label: 'Web Tools' }),
    el('section', { class: 'page-head' }, el('h1', {}, 'Online Tools'), el('p', {}, 'Free browser-based online tools, organized by topic.')),
    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Contents')),
      el('div', { class: 'table-scroll' }, el('table', { class: 'toc-table' },
        el('thead', {}, el('tr', {}, el('th', {}, 'Subtopic'), el('th', {}, 'Tools'))),
        el('tbody', {}, ...groups.map((g) => el('tr', {},
          el('td', {}, el('a', { href: '#/web-tools', onclick: jumpToSection('wt-' + g.id) }, g.title)),
          el('td', { class: 'mono' }, String(g.tools.length))))))),
    ),
    ...groups.map(g => el('section', { class: 'section', id: 'wt-' + g.id },
      el('div', { class: 'section-head' }, el('h2', {}, g.title)),
      linkList(g.tools)
    )),
  );
  node.pageTitle = 'Online Tools - HexKit';
  node.pageDescription = 'Alarm clock, stopwatch, timer, notepad, calculator, password generator, charts and more online tools organized by topic.';
  return node;
}

function viewWebToolPage(slug) {
  const item = WEB_TOOLS.find((t) => t.href === `#/web-tools/${slug}` || t.href.endsWith('/' + slug));
  const title = item ? item.title : slug.replace(/[-_]+/g, ' ').replace(/\\b\\w/g, (c) => c.toUpperCase());
  if (slug === 'stopwatch') return webStopwatch(title);
  if (slug === 'countdown-timer' || slug === 'timer') return webCountdown(title);
  if (slug === 'clock' || slug === 'current-time') return webClock(title, slug === 'current-time');
  if (slug === 'todays-date') return webToday(title);
  if (slug === 'notes') return viewNotepadLike(title, 'notes', 'Write notes in your browser. Saved locally.');
  if (slug === 'todo-list') return webTodo(title);
  if (slug === 'grocery-list') return webTodo(title, 'grocery', 'Add grocery items. Saved locally in your browser.');
  if (slug === 'click-counter' || slug === 'cps-test') return webClickCounter(title, slug === 'cps-test');
  if (slug === 'calendar') return webCalendar(title);
  if (slug === 'scoreboard') return webScoreboard(title);
  if (slug === 'alarm-clock') return webAlarm(title);
  if (slug === 'text-to-speech') return webTTS(title);
  if (slug === 'tone-generator') return webTone(title);
  if (slug === 'ruler-cm') return webRuler(title, 'cm');
  if (slug === 'ruler-inch') return webRuler(title, 'in');

  const needs = {
    camera: 'camera access', 'webcam-test': 'camera access', 'mic-test': 'microphone access',
    'voice-recorder': 'microphone access', 'call-recorder': 'audio access', 'screen-recorder': 'screen capture',
    screenshot: 'screen capture', flashlight: 'device torch support', mirror: 'camera access',
    'speech-to-text': 'speech recognition support', 'text-to-speech': 'speech synthesis support', 'tone-generator': 'Web Audio support',
    'bar-graph': 'chart controls', 'line-graph': 'chart controls', 'pie-chart': 'chart controls', 'scatter-plot': 'chart controls', 'table-chart': 'table/chart controls', 'chart-maker': 'chart controls',
    'ruler-cm': 'screen calibration', 'ruler-inch': 'screen calibration', battery: 'battery status support',
  };
  const req = needs[slug];
  const node = frag(
    crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }),
    el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, req ? `${title} is an online tool. Features may require ${req} and browser permissions.` : `${title} - online tool.`)),
    el('section', { class: 'panel' },
      el('h2', {}, 'About this tool'),
      el('p', {}, `This page provides the ${title} online tool in the Web Tools topic. Use your browser to access this utility.`),
      req ? el('p', {}, `Note: ${req} may be required depending on your device and browser.`) : null,
      el('div', { class: 'btn-row', style: 'margin-top:14px' },
        el('a', { class: 'btn btn-primary', href: '#/web-tools' }, 'All online tools'),
        el('a', { class: 'btn', href: '#/calc' }, 'Calculators'),
        el('a', { class: 'btn', href: '#/conversion' }, 'Conversion')
      )
    )
  );
  node.pageTitle = `${title} - Online Tools - HexKit`;
  node.pageDescription = `${title} online tool.`;
  return node;
}

function webStopwatch(title) {
  let running = false, start = 0, elapsed = 0, raf = null;
  const disp = el('div', { class: 'big-display mono', style: 'font-size:48px;margin:16px 0' }, '00:00:00.000');
  const fmt = (ms) => { const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60, x = ms % 1000; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(x).padStart(3, '0')}`; };
  const tick = () => { disp.textContent = fmt(elapsed + (running ? Date.now() - start : 0)); if (running) raf = requestAnimationFrame(tick); };
  const startBtn = el('button', { class: 'btn btn-primary', type: 'button' }, 'Start');
  const lapBtn = el('button', { class: 'btn', type: 'button' }, 'Lap');
  const resetBtn = el('button', { class: 'btn', type: 'button' }, 'Reset');
  const laps = el('ol', { class: 'list-plain', style: 'margin-top:12px' });
  startBtn.onclick = () => { if (!running) { running = true; start = Date.now(); startBtn.textContent = 'Pause'; tick(); } else { running = false; elapsed += Date.now() - start; startBtn.textContent = 'Start'; if (raf) cancelAnimationFrame(raf); tick(); } };
  resetBtn.onclick = () => { running = false; elapsed = 0; startBtn.textContent = 'Start'; if (raf) cancelAnimationFrame(raf); disp.textContent = '00:00:00.000'; laps.innerHTML = ''; };
  lapBtn.onclick = () => { laps.prepend(el('li', { class: 'mono' }, fmt(elapsed + (running ? Date.now() - start : 0)))); };
  const node = frag(crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, 'Measure elapsed time in your browser.')), el('section', { class: 'panel' }, disp, el('div', { class: 'btn-row' }, startBtn, lapBtn, resetBtn), laps));
  node.pageTitle = `${title} - Online Tools - HexKit`; node.pageDescription = 'Online stopwatch tool.'; return node;
}

function webCountdown(title) {
  const minI = el('input', { type: 'number', min: '0', value: '5', class: 'input' });
  const secI = el('input', { type: 'number', min: '0', max: '59', value: '0', class: 'input' });
  const disp = el('div', { class: 'big-display mono', style: 'font-size:48px;margin:16px 0' }, '05:00');
  let remain = 300000, timer = null, end = 0;
  const fmt = (ms) => { ms = Math.max(0, ms); const m = Math.floor(ms / 60000), s = Math.floor(ms / 1000) % 60; return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; };
  const render = () => { disp.textContent = fmt(remain); };
  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  const startBtn = el('button', { class: 'btn btn-primary', type: 'button' }, 'Start');
  startBtn.onclick = () => { if (timer) { stop(); startBtn.textContent = 'Start'; return; } remain = ((+minI.value || 0) * 60 + (+secI.value || 0)) * 1000; end = Date.now() + remain; startBtn.textContent = 'Pause'; timer = setInterval(() => { remain = end - Date.now(); if (remain <= 0) { remain = 0; stop(); startBtn.textContent = 'Start'; try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch {} } render(); }, 250); };
  const resetBtn = el('button', { class: 'btn', type: 'button', onclick: () => { stop(); startBtn.textContent = 'Start'; remain = ((+minI.value || 0) * 60 + (+secI.value || 0)) * 1000; render(); } }, 'Reset');
  render();
  const node = frag(crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, 'Countdown timer in your browser.')), el('section', { class: 'panel' }, el('div', { style: 'display:flex;gap:8px;align-items:center;flex-wrap:wrap' }, el('label', {}, 'Minutes ', minI), el('label', {}, 'Seconds ', secI)), disp, el('div', { class: 'btn-row' }, startBtn, resetBtn)));
  node.pageTitle = `${title} - Online Tools - HexKit`; node.pageDescription = 'Online countdown timer.'; return node;
}

function webClock(title, showDate) {
  const disp = el('div', { class: 'big-display mono', style: 'font-size:48px;margin:16px 0' }, '');
  const sub = el('div', { style: 'color:var(--ink-dim)' }, '');
  const tick = () => { const d = new Date(); disp.textContent = d.toLocaleTimeString(); if (showDate) sub.textContent = d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); };
  tick(); setInterval(tick, 1000);
  const node = frag(crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, 'Current local time.')), el('section', { class: 'panel' }, disp, sub));
  node.pageTitle = `${title} - Online Tools - HexKit`; node.pageDescription = 'Online clock showing current time.'; return node;
}

function webToday(title) {
  const d = new Date();
  const node = frag(crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))), el('section', { class: 'panel' }, el('p', {}, 'ISO date: ', el('code', {}, d.toISOString().slice(0, 10))), el('p', {}, 'Unix time (ms): ', el('code', {}, String(d.getTime())))));
  node.pageTitle = `${title} - Online Tools - HexKit`; node.pageDescription = "Today's date."; return node;
}

function viewNotepadLike(title, key, desc) {
  const storeKey = 'hexkit.web.' + key;
  const ta = el('textarea', { class: 'textarea', style: 'min-height:40vh', placeholder: 'Start typing...' });
  try { ta.value = localStorage.getItem(storeKey) || ''; } catch {}
  ta.addEventListener('input', () => { try { localStorage.setItem(storeKey, ta.value); } catch {} });
  const node = frag(crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, desc)), el('section', { class: 'panel' }, ta));
  node.pageTitle = `${title} - Online Tools - HexKit`; node.pageDescription = desc; return node;
}

function webTodo(title, key = 'todo', desc = 'Manage your tasks. Saved locally in your browser.') {
  const storeKey = 'hexkit.web.' + key;
  let items = []; try { items = JSON.parse(localStorage.getItem(storeKey) || '[]'); } catch {}
  const input = el('input', { class: 'input', placeholder: 'Add item...', style: 'flex:1' });
  const list = el('ul', { class: 'list-plain', style: 'margin-top:12px' });
  const save = () => { try { localStorage.setItem(storeKey, JSON.stringify(items)); } catch {} };
  const render = () => { mount(list, ...items.map((it, i) => el('li', { style: 'display:flex;gap:8px;align-items:center;margin:6px 0' }, el('input', { type: 'checkbox', checked: !!it.done, onchange: (e) => { items[i].done = e.target.checked; save(); render(); } }), el('span', { style: it.done ? 'text-decoration:line-through;color:var(--ink-faint);flex:1' : 'flex:1' }, it.text), el('button', { class: 'btn btn-sm', type: 'button', onclick: () => { items.splice(i, 1); save(); render(); } }, 'Remove')))); };
  const add = () => { const v = input.value.trim(); if (!v) return; items.push({ text: v, done: false }); input.value = ''; save(); render(); };
  const addBtn = el('button', { class: 'btn btn-primary', type: 'button', onclick: add }, 'Add');
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') add(); });
  render();
  const node = frag(crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, desc)), el('section', { class: 'panel' }, el('div', { style: 'display:flex;gap:8px' }, input, addBtn), list));
  node.pageTitle = `${title} - Online Tools - HexKit`; node.pageDescription = desc; return node;
}

function webClickCounter(title, cps) {
  let count = 0, running = false, timer = null, left = 5;
  const disp = el('div', { class: 'big-display mono', style: 'font-size:48px;margin:16px 0' }, '0');
  const info = el('div', { style: 'color:var(--ink-dim)' }, cps ? 'Click as fast as you can for 5 seconds.' : 'Click to count.');
  const btn = el('button', { class: 'btn btn-primary', type: 'button', style: 'padding:16px 24px;font-size:18px' }, cps ? 'Click to start' : 'Click');
  const reset = el('button', { class: 'btn', type: 'button' }, 'Reset');
  btn.onclick = () => { if (cps) { if (!running) { running = true; count = 0; left = 5; disp.textContent = '0'; timer = setInterval(() => { left -= 1; info.textContent = `Time left: ${left}s`; if (left <= 0) { clearInterval(timer); running = false; info.textContent = `Result: ${(count / 5).toFixed(2)} CPS (${count} clicks)`; btn.textContent = 'Try again'; } }, 1000); btn.textContent = 'Click!'; } count++; disp.textContent = String(count); } else { count++; disp.textContent = String(count); } };
  reset.onclick = () => { count = 0; running = false; if (timer) clearInterval(timer); disp.textContent = '0'; info.textContent = cps ? 'Click as fast as you can for 5 seconds.' : 'Click to count.'; btn.textContent = cps ? 'Click to start' : 'Click'; };
  const node = frag(crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, info)), el('section', { class: 'panel' }, disp, el('div', { class: 'btn-row' }, btn, reset)));
  node.pageTitle = `${title} - Online Tools - HexKit`; node.pageDescription = title + ' online tool.'; return node;
}

function webCalendar(title) {
  const d = new Date(); const y = d.getFullYear(), m = d.getMonth();
  const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
  const head = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cells = []; for (let i = 0; i < first; i++) cells.push(el('div', { class: 'cal-cell cal-empty' }, ''));
  for (let day = 1; day <= days; day++) cells.push(el('div', { class: 'cal-cell' + (day === d.getDate() ? ' cal-today' : ''), style: day === d.getDate() ? 'font-weight:700' : '' }, String(day)));
  const grid = el('div', { style: 'display:grid;grid-template-columns:repeat(7,1fr);gap:4px;max-width:420px' }, ...head.map((h) => el('div', { style: 'font-weight:600;text-align:center' }, h)), ...cells);
  const node = frag(crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }))), el('section', { class: 'panel' }, grid));
  node.pageTitle = `${title} - Online Tools - HexKit`; node.pageDescription = 'Online calendar.'; return node;
}

function webScoreboard(title) {
  let a = 0, b = 0; const sa = el('div', { class: 'big-display mono', style: 'font-size:48px' }, '0'); const sb = el('div', { class: 'big-display mono', style: 'font-size:48px' }, '0');
  const mk = (label, get, set, dispEl) => el('div', { class: 'panel', style: 'text-align:center' }, el('h3', {}, label), dispEl, el('div', { class: 'btn-row', style: 'justify-content:center' }, el('button', { class: 'btn', type: 'button', onclick: () => { set(get() - 1); dispEl.textContent = String(get()); } }, '-1'), el('button', { class: 'btn btn-primary', type: 'button', onclick: () => { set(get() + 1); dispEl.textContent = String(get()); } }, '+1')));
  const node = frag(crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, 'Simple online scoreboard.')), el('div', { class: 'grid grid-2' }, mk('Team A', () => a, (v) => a = Math.max(0, v), sa), mk('Team B', () => b, (v) => b = Math.max(0, v), sb)), el('div', { class: 'btn-row', style: 'margin-top:12px' }, el('button', { class: 'btn', type: 'button', onclick: () => { a = 0; b = 0; sa.textContent = '0'; sb.textContent = '0'; } }, 'Reset')));
  node.pageTitle = `${title} - Online Tools - HexKit`; node.pageDescription = 'Online scoreboard.'; return node;
}

function webAlarm(title) {
  const timeI = el('input', { type: 'time', class: 'input' });
  const msg = el('div', { style: 'margin-top:8px;color:var(--ink-dim)' }, 'Set a time for the alarm.');
  let timer = null;
  const setBtn = el('button', { class: 'btn btn-primary', type: 'button', onclick: () => {
    if (timer) clearInterval(timer);
    const val = timeI.value; if (!val) { msg.textContent = 'Choose a time.'; return; }
    msg.textContent = 'Alarm set for ' + val + '. Keep this tab open.';
    timer = setInterval(() => { const d = new Date(); const now = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; if (now === val) { clearInterval(timer); timer = null; msg.textContent = 'Alarm! ' + val; try { navigator.vibrate && navigator.vibrate([300, 100, 300, 100, 300]); } catch {} alert('Alarm: ' + val); } }, 1000);
  } }, 'Set alarm');
  const clearBtn = el('button', { class: 'btn', type: 'button', onclick: () => { if (timer) clearInterval(timer); timer = null; msg.textContent = 'Alarm cleared.'; } }, 'Clear');
  const node = frag(crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, 'Set an alarm in your browser. Keep this tab open for the alarm to trigger.')), el('section', { class: 'panel' }, el('label', {}, 'Alarm time ', timeI), el('div', { class: 'btn-row', style: 'margin-top:12px' }, setBtn, clearBtn), msg));
  node.pageTitle = `${title} - Online Tools - HexKit`; node.pageDescription = 'Online alarm clock.'; return node;
}


function webTTS(title) {
  const ta = el('textarea', { class: 'textarea', style: 'min-height:160px', placeholder: 'Enter text to speak...' }, 'Hello! This is text to speech in your browser.');
  const msg = el('div', { style: 'margin-top:8px;color:var(--ink-dim)' }, '');
  const speak = () => {
    if (!('speechSynthesis' in window)) { msg.textContent = 'Speech synthesis is not supported in this browser.'; return; }
    try { window.speechSynthesis.cancel(); } catch {}
    const u = new SpeechSynthesisUtterance(ta.value || '');
    u.onstart = () => { msg.textContent = 'Speaking...'; };
    u.onend = () => { msg.textContent = 'Done.'; };
    u.onerror = () => { msg.textContent = 'Speech failed or was interrupted.'; };
    try { window.speechSynthesis.speak(u); } catch { msg.textContent = 'Speech synthesis is not available.'; }
  };
  const stop = () => { try { window.speechSynthesis.cancel(); msg.textContent = 'Stopped.'; } catch {} };
  const node = frag(
    crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }),
    el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, "Convert text to speech using your browser's speech synthesis (when available).")),
    el('section', { class: 'panel' }, ta, el('div', { class: 'btn-row', style: 'margin-top:12px' },
      el('button', { class: 'btn btn-primary', type: 'button', onclick: speak }, 'Speak'),
      el('button', { class: 'btn', type: 'button', onclick: stop }, 'Stop')
    ), msg)
  );
  node.pageTitle = title + ' - Online Tools - HexKit'; node.pageDescription = 'Text to speech online tool.'; return node;
}

function webTone(title) {
  let ctx = null, osc = null, gain = null;
  const freq = el('input', { type: 'range', min: '20', max: '2000', value: '440', class: 'input', style: 'width:100%' });
  const out = el('span', { class: 'mono' }, '440 Hz');
  freq.oninput = () => { out.textContent = freq.value + ' Hz'; if (osc) try { osc.frequency.value = +freq.value; } catch {} };
  const msg = el('div', { style: 'margin-top:8px;color:var(--ink-dim)' }, '');
  const start = async () => {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { msg.textContent = 'Web Audio is not available in this browser.'; return; }
      ctx = ctx || new AC();
      if (ctx.resume) await ctx.resume();
      if (osc) return;
      osc = ctx.createOscillator(); gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = +freq.value; gain.gain.value = 0.08;
      osc.connect(gain).connect(ctx.destination); osc.start();
      msg.textContent = 'Playing tone.';
    } catch { msg.textContent = 'Web Audio is not available in this browser.'; }
  };
  const stop = () => { try { if (osc) { osc.stop(); osc.disconnect(); } } catch {} osc = null; try { if (gain) gain.disconnect(); } catch {} gain = null; msg.textContent = 'Stopped.'; };
  const node = frag(
    crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }),
    el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, 'Generate a simple tone in your browser using Web Audio (when available).')),
    el('section', { class: 'panel' },
      el('label', {}, 'Frequency: ', out),
      freq,
      el('div', { class: 'btn-row', style: 'margin-top:12px' },
        el('button', { class: 'btn btn-primary', type: 'button', onclick: start }, 'Play'),
        el('button', { class: 'btn', type: 'button', onclick: stop }, 'Stop')
      ),
      msg,
      el('p', { style: 'margin-top:12px;color:var(--ink-faint);font-size:14px' }, 'Use moderate volume. Actual loudness depends on your device.')
    )
  );
  node.pageTitle = title + ' - Online Tools - HexKit'; node.pageDescription = 'Online tone generator.'; return node;
}

function webRuler(title, unit) {
  const isCm = unit === 'cm';
  const max = isCm ? 20 : 8;
  const marks = [];
  for (let i = 0; i <= max; i++) {
    const tall = (isCm ? (i % 1 === 0) : (i % 1 === 0));
    marks.push(el('div', { style: 'position:absolute;left:' + ((i / max) * 100) + '%;bottom:0;height:' + (tall ? '60%' : '35%') + ';border-left:2px solid var(--ink-faint)' },
      tall ? el('span', { style: 'position:absolute;top:-22px;left:-6px;font-size:12px;color:var(--ink-dim)' }, String(i)) : null
    ));
  }
  const bar = el('div', { style: 'position:relative;height:90px;border:1px solid var(--line);border-radius:8px;background:var(--panel-2);margin-top:12px' }, ...marks);
  const node = frag(
    crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }),
    el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, isCm ? 'On-screen centimeter ruler.' : 'On-screen inch ruler.')),
    el('section', { class: 'panel' },
      bar,
      el('p', { style: 'margin-top:12px;color:var(--ink-dim)' }, 'Physical accuracy depends on your screen size, resolution, and scaling. For precise measurement, calibrate against a known object.')
    )
  );
  node.pageTitle = title + ' - Online Tools - HexKit'; node.pageDescription = 'Online ruler tool.'; return node;
}

export function viewMathRef() {
  const groups = TOPIC_SETS.math;
  const node = frag(
    crumbs({ label: 'Math' }),
    el('section', { class: 'page-head' },
      el('h1', {}, 'Math'),
      el('p', {}, 'Math calculators, formulas and reference, arranged by subtopic.')),
    topicContents(groups, '#/math'),
    ...groups.map(topicSection),
  );
  node.pageTitle = 'Math - HexKit';
  node.pageDescription = 'Math calculators, formulas and reference, grouped into algebra, geometry, calculus, statistics and numbers.';
  return node;
}

export function viewElectricityRef() {
  const groups = TOPIC_SETS.electricity;
  const node = frag(
    crumbs({ label: 'Electricity' }),
    el('section', { class: 'page-head' },
      el('h1', {}, 'Electricity & Electronics'),
      el('p', {}, 'Electrical calculators, formulas, symbols and reference, arranged by subtopic.')),
    topicContents(groups, '#/electricity'),
    ...groups.map(topicSection),
  );
  node.pageTitle = 'Electricity - HexKit';
  node.pageDescription = 'Electrical calculators, unit conversions, circuit laws, components, symbols and reference, arranged by subtopic.';
  return node;
}

