/**
 * Topic groupings shared by the interactive views (`js/ui/content.js`) and the
 * prerenderer (`scripts/prerender.mjs`).
 *
 * RapidTables-style topic pages are not one long list of every note: they
 * split the notes into named subtopics (basic terms, units, components,
 * symbols, laws, how-to, calculators, conversion) and show a Contents table
 * at the top. Keeping the grouping here means the app and the static pages
 * cannot drift apart, and adding a note to a subtopic happens in one place.
 *
 * Every `href` is a hash route, so the same item works in the SPA and in the
 * prerendered HTML.
 */

import { ARTICLES } from './reference.js';
import { TOOLS, TOOL_BY_ID } from './tools.js';
import { FAMILIES } from './units.js';
import { SYMBOL_GROUPS } from './symbols.js';

/** Resolve one cross-reference into a link item, or null if it does not exist. */
const lookup = {
  read: (slug) => (ARTICLES[slug] ? { title: ARTICLES[slug].title, href: `#/read/${slug}` } : null),
  tool: (id) => (TOOL_BY_ID[id] ? { title: TOOL_BY_ID[id].title, href: `#/tool/${id}` } : null),
  unit: (id) => (FAMILIES[id] ? { title: `${FAMILIES[id].title} converter`, href: `#/units/${id}` } : null),
  symbol: (id) => {
    const group = SYMBOL_GROUPS.find((g) => g.id === id);
    return group ? { title: `${group.title} symbols`, href: `#/symbols/${id}` } : null;
  },
};

/** `pick(['read','ohms-law'], ['tool','ohms-law'])` -> link items, missing ones dropped. */
const pick = (...refs) => refs.map(([kind, id]) => lookup[kind]?.(id)).filter(Boolean);

const topic = (id, title, items, blurb = '') => ({ id, title, blurb, items });

/** Calculators in a tool group, in catalogue order. */
const toolsIn = (...groups) =>
  TOOLS.filter((t) => groups.includes(t.group)).map((t) => ({ title: t.title, href: `#/tool/${t.id}` }));

/* ── electricity ───────────────────────────────────────────────────────── */

export const ELECTRICITY_TOPICS = [
  topic('el-terms', 'Basic electrical terms', pick(
    ['read', 'electrical-voltage'],
    ['read', 'electrical-current'],
    ['read', 'electrical-resistance'],
    ['read', 'dc-circuit-rules'],
    ['read', 'power-factor'],
    ['read', 'electrical-units'],
  ), 'Definitions and the relationships that follow from them.'),

  topic('el-units', 'Electrical & electronic units', pick(
    ['unit', 'voltage'],
    ['unit', 'current'],
    ['unit', 'resistance'],
    ['unit', 'power'],
    ['unit', 'energy'],
    ['unit', 'charge'],
    ['unit', 'capacitance'],
    ['unit', 'inductance'],
    ['unit', 'frequency'],
    ['read', 'electrical-units'],
  ), 'Volt, ampere, ohm, watt, joule, farad, hertz and the rest.'),

  topic('el-components', 'Electronic components', [
    ...pick(
      ['read', 'capacitor'],
      ['read', 'inductor'],
      ['read', 'electronic-components'],
      ['read', 'wire-gauge-awg'],
    ),
    ...pick(
      ['tool', 'capacitor'],
      ['tool', 'inductor'],
      ['tool', 'capacitor-code'],
      ['tool', 'resistor-color'],
      ['tool', 'led-resistor'],
      ['tool', 'battery'],
    ),
  ], 'What each part does, and calculators for choosing one.'),

  topic('el-symbols', 'Electrical & electronic symbols', [
    ...SYMBOL_GROUPS.map((g) => ({ title: `${g.title} symbols`, href: `#/symbols/${g.id}` })),
    { title: 'All circuit symbols', href: '#/symbols' },
  ], 'IEC/ANSI symbol artwork with per-file attribution.'),

  topic('el-laws', 'Electronic circuit laws', [
    ...pick(
      ['read', 'ohms-law'],
      ['read', 'kirchhoff-laws'],
      ['read', 'coulombs-law'],
    ),
    ...pick(
      ['tool', 'ohms-law'],
      ['tool', 'kirchhoff'],
      ['tool', 'coulomb'],
      ['tool', 'voltage-divider'],
      ['tool', 'three-phase'],
      ['tool', 'power-factor'],
      ['tool', 'voltage-drop'],
    ),
  ], 'The formulas, plus a solver for each one.'),

  topic('el-howto', 'How to', pick(
    ['read', 'save-electricity'],
    ['read', 'save-energy'],
    ['read', 'kilowatt-hour'],
    ['read', 'wire-gauge-awg'],
  ), 'Practical guides rather than formulas.'),

  topic('el-calcs', 'Electrical calculations', toolsIn('electrical', 'wire'),
    'Every electrical calculator on the site, one list.'),

  topic('el-conv', 'Electrical & energy conversion', [
    ...pick(
      ['unit', 'power'],
      ['unit', 'energy'],
      ['unit', 'voltage'],
      ['unit', 'current'],
      ['unit', 'charge'],
      ['unit', 'frequency'],
    ),
    { title: 'All electrical conversion notes', href: '#/learn' },
  ], 'Convert watts, kilowatt-hours, volts, amps and hertz.'),

  topic('el-ref', 'Reference', [
    { title: 'Electrical glossary & definitions', href: '#/glossary' },
    { title: 'Reference tables (resistor colours, wire gauge)', href: '#/tables' },
    { title: 'All conversion notes', href: '#/learn' },
  ], ''),
];

/* ── math ──────────────────────────────────────────────────────────────── */

export const MATH_TOPICS = [
  topic('math-calc', 'Math calculators', toolsIn('math', 'number'),
    'Solvers and converters, one list.'),

  topic('math-algebra', 'Algebra & functions', [
    ...pick(['read', 'algebra'], ['read', 'exponent-rules'], ['read', 'logarithms']),
    ...pick(['tool', 'quadratic'], ['tool', 'scientific'], ['tool', 'log'], ['tool', 'antilog'],
      ['tool', 'exponential-growth']),
  ]),

  topic('math-geometry', 'Geometry & trigonometry', [
    ...pick(['read', 'trigonometry']),
    ...pick(['tool', 'right-triangle'], ['tool', 'pythagorean'], ['tool', 'trig']),
  ]),

  topic('math-calculus', 'Calculus', [
    ...pick(['read', 'calculus']),
    ...pick(['tool', 'convolution']),
  ]),

  topic('math-stats', 'Statistics & probability', [
    ...pick(['read', 'probability-distributions']),
    ...pick(['tool', 'stddev'], ['tool', 'weighted-average'], ['tool', 'ppm']),
  ]),

  topic('math-numbers', 'Numbers & bases', [
    ...pick(['read', 'number-bases']),
    ...pick(['tool', 'radix-calc'], ['tool', 'roman'], ['tool', 'number-words'], ['tool', 'fraction'],
      ['tool', 'decimal-fraction'], ['tool', 'percentage'], ['tool', 'ratio'], ['tool', 'gcf-lcm'],
      ['tool', 'factorial'], ['tool', 'root'], ['tool', 'divmod'], ['tool', 'percent-error'],
      ['tool', 'complex']),
  ]),

  topic('math-angle', 'Angle conversion', angleNotes(), 'Degrees and radians, both directions.'),

  topic('math-ref', 'Reference', [
    { title: 'Math and reference tables', href: '#/tables' },
    { title: 'Math glossary terms', href: '#/glossary' },
    { title: 'All articles & formulas', href: '#/learn' },
  ]),
];

/** Conversion notes for one kicker, e.g. "Angle conversion". */
function notesFor(kicker) {
  return Object.entries(ARTICLES)
    .filter(([, a]) => a.kicker === kicker)
    .map(([slug, a]) => ({ title: a.title, href: `#/read/${slug}` }));
}

function angleNotes() {
  return notesFor('Angle conversion');
}

/* ── reference ─────────────────────────────────────────────────────────── */

/** Ordering for the conversion-note subtopics, so the page reads sensibly. */
const CONVERSION_ORDER = [
  'Length', 'Weight', 'Temperature', 'Area', 'Volume', 'Speed', 'Pressure', 'Force', 'Torque',
  'Time', 'Energy', 'Power', 'Voltage', 'Current', 'Charge', 'Resistance', 'Capacitance',
  'Inductance', 'Frequency', 'Angle', 'Data', 'Light', 'Illuminance', 'Number', 'Concentration',
];

/** Every "… conversion" kicker turned into a subtopic, in CONVERSION_ORDER. */
export const CONVERSION_TOPICS = (() => {
  const byKicker = new Map();
  for (const [slug, a] of Object.entries(ARTICLES)) {
    const kicker = a.kicker || '';
    if (!/conversion$/i.test(kicker)) continue;
    if (!byKicker.has(kicker)) byKicker.set(kicker, []);
    byKicker.get(kicker).push({ title: a.title, href: `#/read/${slug}` });
  }
  const rank = (kicker) => {
    const base = kicker.replace(/\s*conversion$/i, '');
    const i = CONVERSION_ORDER.indexOf(base);
    return i === -1 ? CONVERSION_ORDER.length : i;
  };
  return [...byKicker.keys()]
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
    .map((kicker) => topic(
      `conv-${kicker.replace(/\s*conversion$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      kicker,
      byKicker.get(kicker),
      'Worked conversion notes for this family of units.',
    ));
})();

export const REFERENCE_TOPICS = [
  topic('ref-math', 'Math & numbers', pick(
    ['read', 'algebra'],
    ['read', 'exponent-rules'],
    ['read', 'logarithms'],
    ['read', 'trigonometry'],
    ['read', 'calculus'],
    ['read', 'probability-distributions'],
    ['read', 'number-bases'],
  ), 'Formulas and cheat sheets.'),

  topic('ref-electricity', 'Electricity & electronics', pick(
    ['read', 'electrical-voltage'],
    ['read', 'electrical-current'],
    ['read', 'electrical-resistance'],
    ['read', 'electrical-units'],
    ['read', 'dc-circuit-rules'],
    ['read', 'ohms-law'],
    ['read', 'kirchhoff-laws'],
    ['read', 'coulombs-law'],
    ['read', 'power-factor'],
    ['read', 'capacitor'],
    ['read', 'inductor'],
    ['read', 'electronic-components'],
    ['read', 'wire-gauge-awg'],
  ), 'Definitions, laws and component guides.'),

  topic('ref-howto', 'Everyday energy & how-to', pick(
    ['read', 'kilowatt-hour'],
    ['read', 'save-electricity'],
    ['read', 'save-energy'],
    ['read', 'parts-per-million'],
    ['read', 'ascii-encoding'],
  ), 'Practical guides and day-to-day reference.'),

  ...CONVERSION_TOPICS,
];

export const TOPIC_SETS = {
  electricity: ELECTRICITY_TOPICS,
  math: MATH_TOPICS,
  reference: REFERENCE_TOPICS,
};
