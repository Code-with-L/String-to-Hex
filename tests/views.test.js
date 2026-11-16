/**
 * View smoke tests — render every page in a minimal DOM and assert the result
 * is a real, populated tree. Catches render-time errors that unit tests cannot.
 */

import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { installDOM, toTree, walk } from './dom-shim.js';

installDOM();

// Some browser views start a clock interval when rendered. In Node that would
// keep the test process alive forever, so let the shim's timers unwind.
const nativeSetInterval = globalThis.setInterval;
globalThis.setInterval = (...args) => {
  const id = nativeSetInterval(...args);
  id?.unref?.();
  return id;
};

const { TOOLS } = await import('../js/data/tools.js');
const { FAMILIES } = await import('../js/data/units.js');
const VIEWS = await import('../js/ui/views.js');
const CONTENT = await import('../js/ui/content.js');
const TOOLVIEWS = await import('../js/ui/tools.js');
const { ARTICLES, GLOSSARY } = await import('../js/data/reference.js');
const { FORMATS } = await import('../js/data/formats.js');

const route = (path = '/', query = {}) => ({
  path,
  query: new URLSearchParams(query),
  segments: path.split('/').filter(Boolean),
  raw: path,
});

const assertTree = (node, label) => {
  const tree = toTree(node);
  const elements = walk(tree);
  assert.ok(elements.length > 3, `${label}: rendered only ${elements.length} elements`);
  // no element should carry the literal text "undefined"
  for (const el of elements) {
    const txt = el.textContent ?? '';
    assert.ok(!/>\s*undefined\s*</.test(txt), `${label}: leaked "undefined" into <${el.tagName}>`);
    assert.ok(!/\[object Object\]/.test(txt), `${label}: leaked "[object Object]" into <${el.tagName}>`);
  }
  return elements;
};

test('home view renders the hero, featured tools and unit families', () => {
  const els = assertTree(CONTENT.viewHome(), 'home');
  const text = els.map((e) => e.textContent).join(' ');
  assert.match(text, /String to hex/);
  assert.match(text, new RegExp(String(TOOLS.length)), 'home states the calculator count');
  assert.ok(els.some((e) => e.tagName === 'A' && /#\/tool\//.test(e.getAttribute?.('href') ?? '')),
    'home links to calculators');
});

test('every reference page renders', () => {
  assertTree(CONTENT.viewLearn(), 'learn');
  for (const slug of Object.keys(ARTICLES)) {
    const els = assertTree(CONTENT.viewArticle(slug), `read/${slug}`);
    assert.match(els.map((e) => e.textContent).join(' '), /.+/, `read/${slug}: has text`);
  }
  assertTree(CONTENT.viewGlossary(), 'glossary');
  for (const key of Object.keys(GLOSSARY)) {
    assertTree(CONTENT.viewGlossaryEntry(key), `glossary/${key}`);
  }
  assertTree(CONTENT.viewSymbols(), 'symbols');
  assertTree(CONTENT.viewTables(), 'tables');
});

test('a missing article or glossary entry falls back instead of throwing', () => {
  assertTree(CONTENT.viewArticle('no-such-article'), 'missing article');
  assertTree(CONTENT.viewGlossaryEntry('no-such-term'), 'missing glossary entry');
});

test('notepad, HTML editor and entities render', () => {
  assertTree(TOOLVIEWS.viewNotepad(), 'notepad');
  assertTree(TOOLVIEWS.viewHtmlEditor(), 'html-editor');
  assertTree(TOOLVIEWS.viewEntities(), 'entities');
});

test('scientific keypad view renders with digits, functions and equals', () => {
  const els = assertTree(TOOLVIEWS.viewScientific(), 'scientific-calc');
  const buttons = els.filter((e) => e.tagName === 'BUTTON').map((e) => e.textContent);
  for (const label of ['7', '=', 'sin(', 'cos(', 'tan(', 'asin(', '√(', 'π', '⌫', 'C']) {
    assert.ok(buttons.includes(label), `has ${label} key`);
  }
  const display = els.find((e) => e.tagName === 'INPUT');
  assert.equal(display.getAttribute('aria-label'), 'Expression');
});

test('evalExpr honours degree mode and postfix factorial', async () => {
  const { evalExpr } = await import('../js/data/tools.js');
  assert.ok(Math.abs(evalExpr('sin(30)', { trig: 'deg' }) - 0.5) < 1e-12);
  assert.ok(Math.abs(evalExpr('asin(1)', { trig: 'deg' }) - 90) < 1e-9);
  assert.equal(evalExpr('6!'), 720);
  assert.equal(evalExpr('2 + 3!'), 8);
  assert.equal(evalExpr('sin(30)'), Math.sin(30));
});

test('HTML preview blocks scripts and network fetches', () => {
  const els = assertTree(TOOLVIEWS.viewHtmlEditor(), 'html-editor');
  const frame = els.find((e) => e.tagName === 'IFRAME');
  assert.ok(frame, 'preview is an iframe');
  assert.equal(frame.getAttribute('sandbox'), 'allow-same-origin',
    'scripts are disabled in the preview');

  const srcdoc = TOOLVIEWS.previewSrcdoc('<head><title>x</title></head><body>hi</body>');
  assert.match(srcdoc, /Content-Security-Policy/,
    'preview carries a CSP so styles and images cannot be fetched');
  assert.match(srcdoc, /default-src 'none'/);
  // Markup without a <head> must still be hardened rather than passed through.
  assert.match(TOOLVIEWS.previewSrcdoc('<p>bare</p>'), /default-src 'none'/);
});

test('converter renders for every ordered format pair', () => {
  for (const a of FORMATS) {
    for (const b of FORMATS) {
      const els = assertTree(
        VIEWS.viewConvert(route('/convert', { from: a.id, to: b.id })),
        `convert ${a.id}→${b.id}`,
      );
      assert.ok(els.some((e) => e.tagName === 'TEXTAREA'), `${a.id}→${b.id} has no textareas`);
    }
  }
});

test('converter honours prefilled input from the query string', () => {
  // hexToBytes strips non-hex, so "48 69" decodes without throwing
  assertTree(VIEWS.viewConvert(route('/convert', { from: 'hex', to: 'text', d: '48 69' })), 'convert hex→text');
  assertTree(VIEWS.viewConvert(route('/convert', { from: 'text', to: 'bin', sample: 'ascii' })), 'convert sample');
  assertTree(VIEWS.viewConvert(route('/convert', { from: 'text', to: 'dec', del: 'custom', delv: '|' })), 'custom delimiter');
});

test('every calculator page renders with inputs and results', () => {
  for (const tool of TOOLS) {
    const els = assertTree(VIEWS.viewTool(route(`/tool/${tool.id}`)), `tool ${tool.id}`);
    const labels = els.filter((e) => e.tagName === 'LABEL');
    assert.ok(labels.length >= tool.inputs.length,
      `${tool.id}: rendered ${labels.length} labels for ${tool.inputs.length} inputs`);
  }
});

test('a seeded calculator shows at least one result tile', () => {
  // The engine tests guarantee every declared output id exists in `values`;
  // this asserts the other half — that the UI actually puts tiles on screen.
  const SEEDS = {
    'ohms-law': { v: '12', i: '2' }, 'voltage-divider': { vin: '12', r1: '1000', r2: '470' },
    'power-factor': { v: '400', a: '25', kw: '12', phase: '3y' },
    'three-phase': { v: '400', i: '10', pf: '0.9', type: 'star' },
    'voltage-drop': { awg: '10', len: '30', i: '20', v: '240' },
    'wire-gauge': { n: '14', mode: 'awg' }, 'resistor-color': { d1: '4', d2: '7', m: '1', t: '5' },
    dbm: { v: '30', from: 'dbm' }, ev: { v: '12', from: 'j' }, 'energy-bill': { w: '1500', h: '8', rate: '0.15' },
    photometry: { mode: 'cd2lux', x: '500', d: '2' },
    stddev: { data: '2 4 4 4 5 5 7 9', mode: 'pop' }, 'weighted-average': { data: '80:1, 90:2' },
    quadratic: { a: '1', b: '-3', c: '2' }, root: { x: '16', k: '2' }, factorial: { n: '10', r: '3' },
    percentage: { mode: '1', x: '15', y: '200' }, 'percent-error': { measured: '9.6', accepted: '10' },
    'gcf-lcm': { data: '12 18 24' }, fraction: { n1: '1', d1: '2', n2: '1', d2: '3', op: '+' },
    'decimal-fraction': { x: '0.375' }, ratio: { data: '16:24' }, divmod: { a: '47', b: '5' },
    scientific: { x: '12345', op: 'none' }, pythagorean: { a: '3', b: '4' },
    convolution: { x: '1 2 3 4', h: '1 2 1' }, log: { x: '100', b: '10', dir: 'log' },
    'exponential-growth': { x0: '100', r: '5', t: '10' }, trig: { x: '45', unit: 'deg' },
    'color-convert': { hex: '#3B82F6' }, 'radix-calc': { base: '16', a: 'FF', b: '0F', op: 'add' },
    roman: { v: '2024' }, 'number-words': { v: '1234' },
    'case-convert': { text: 'hello world', mode: 'camel' }, url: { text: 'a b', mode: 'enc' },
    counters: { text: 'one two two three' }, hash: { text: 'HexKit' },
    mortgage: { p: '400000', rate: '5.5', n: '30', down: '80000' },
    compound: { p: '10000', r: '7', t: '10', n: '12', ap: '100' },
    'simple-interest': { p: '10000', r: '5', t: '3', unit: 'y' },
    vat: { amount: '100', rate: '20', mode: 'add' }, discount: { price: '200', rate: '25', tax: '0', mode: 'pct' },
    gpa: { courses: 'A:3, B:4', scale: 'us' }, 'final-grade': { total: '420', possible: '500', weight: '30' },
    bmi: { w: '70', h: '175', sys: 'metric', age: '30' }, duration: { d: '1', h: '12' },
    'growth-decay': { x0: '100', r: '10', steps: '5' }, custom: { expr: 'sin(pi/4) * 2^10' },
    'custom-convert': { x: '5', expr: 'x * 2.54' }, random: { min: '1', max: '6', count: '5' },
    password: { len: '16', lower: '1' }, batch: { values: '1 2 4', factor: '2.5' },
    'date-diff': { a: '2020-01-01', b: '2024-06-15' }, age: { dob: '2000-01-01' },
    'world-clock': { zones: 'UTC,Asia/Tokyo' },
  };

  let checked = 0;
  for (const tool of TOOLS) {
    if (!SEEDS[tool.id]) continue;
    const els = walk(toTree(VIEWS.viewTool(route(`/tool/${tool.id}`, SEEDS[tool.id]))));
    const tiles = els.filter((e) => e.classList.contains('result'));
    assert.ok(tiles.length > 0, `${tool.id}: rendered no result tiles`);
    for (const t of tiles) {
      const value = t.querySelector('.result-value')?.textContent ?? '';
      assert.ok(value.length > 0, `${tool.id}: a result tile is blank`);
      assert.ok(!/undefined|NaN/.test(value), `${tool.id}: result tile shows "${value}"`);
    }
    const alerts = els.filter((e) => e.classList.contains('alert-error'));
    assert.equal(alerts.length, 0, `${tool.id}: unexpected error panel`);
    checked++;
  }
  assert.ok(checked >= 45, `expected to exercise most tools, exercised ${checked}`);
});

test('calculator seeds from the query string without throwing', () => {
  assertTree(VIEWS.viewTool(route('/tool/ohms-law', { v: '24', i: '2' })), 'ohms-law seeded');
  assertTree(VIEWS.viewTool(route('/tool/color-convert', { hex: '#ff8800' })), 'colour seeded');
  assertTree(VIEWS.viewTool(route('/tool/gpa', { courses: 'A:4' })), 'gpa seeded');
});

test('tool index renders grouped and filtered', () => {
  const all = assertTree(VIEWS.viewTools(route('/tools')), 'tools index');
  const cards = all.filter((e) => e.attributes.href?.startsWith('#/tool/'));
  assert.ok(cards.length >= TOOLS.length, `expected a card per tool, saw ${cards.length}`);

  const filtered = assertTree(VIEWS.viewTools(route('/tools', { q: 'ohm' })), 'tools search');
  assert.ok(filtered.some((e) => e.attributes.href === '#/tool/ohms-law'), 'search finds ohms-law');
});

test('unit index lists every family, and every family lists its pairs', () => {
  assertTree(VIEWS.viewUnits(route('/units')), 'units index');
  for (const family of Object.keys(FAMILIES)) {
    const els = assertTree(VIEWS.viewUnits(route(`/units/${family}`)), `units/${family}`);
    const rows = els.filter((e) => e.tagName === 'TR');
    assert.ok(rows.length > 10, `${family}: only ${rows.length} rows rendered`);
  }
});

test('ASCII, base and about pages render', () => {
  const ascii = assertTree(VIEWS.viewAscii(), 'ascii');
  // the 0-127 table must be populated on first paint, not only after typing
  const bodyRows = ascii.filter((e) => e.tagName === 'TR' && e.parentNode?.tagName === 'TBODY');
  assert.ok(bodyRows.length >= 100, `ASCII table rendered only ${bodyRows.length} rows`);

  assertTree(VIEWS.viewBase(), 'base');
  assertTree(VIEWS.viewAbout(), 'about');
  const nf = assertTree(VIEWS.notFound(), '404');
  assert.match(nf.map((e) => e.textContent).join(' '), /404/);
});

test('the ASCII analyser feeds the converter byte inspector', () => {
  // the ascii view wires input → analyse(); make sure that path is exercised
  const els = toTree(VIEWS.viewAscii());
  const areas = walk(els).filter((e) => e.tagName === 'TEXTAREA');
  assert.ok(areas.length >= 1, 'ascii view has an analyser textarea');
  areas[0].value = 'Hi!';
  areas[0].dispatch('input', { target: areas[0] });
});

test('every internal link resolves to a route or record that exists', async () => {
  const { GROUPS } = await import('../js/data/tools.js');
  const { SYMBOL_GROUPS } = await import('../js/data/symbols.js');
  const TOOL_IDS = new Set(TOOLS.map((t) => t.id));
  const GROUP_IDS = new Set(GROUPS.map((g) => g.id));
  const SYMBOL_IDS = new Set(SYMBOL_GROUPS.map((g) => g.id));
  const WEB_SLUGS = CONTENT.WEB_TOOLS
    .map((t) => t.href)
    .filter((h) => h.startsWith('#/web-tools/'))
    .map((h) => h.slice('#/web-tools/'.length));

  const HEADS = new Set([
    'convert', 'tools', 'calc', 'conversion', 'web-tools', 'math', 'electricity',
    'tool', 'units', 'ascii', 'base', 'learn', 'read', 'glossary', 'symbols',
    'tables', 'resistor-colours', 'notepad', 'html-editor', 'entities', 'about',
  ]);

  const nodes = [
    ['home', CONTENT.viewHome()],
    ['calc', CONTENT.viewCalc(route('/calc'))],
    ['calc/math', CONTENT.viewCalc(route('/calc/math'))],
    ['conversion', CONTENT.viewConversion()],
    ['web-tools', CONTENT.viewWebTools(route('/web-tools'))],
    ['learn', CONTENT.viewLearn()],
    ['math', CONTENT.viewMathRef()],
    ['electricity', CONTENT.viewElectricityRef()],
    ['glossary', CONTENT.viewGlossary()],
    ['symbols', CONTENT.viewSymbols()],
    ...SYMBOL_GROUPS.map((g) => [`symbols/${g.id}`, CONTENT.viewSymbols(route(`/symbols/${g.id}`))]),
    ['tables', CONTENT.viewTables()],
    ['units', VIEWS.viewUnits(route('/units'))],
    ['units/length', VIEWS.viewUnits(route('/units/length'))],
    ['tools', VIEWS.viewTools(route('/tools'))],
    ['ascii', VIEWS.viewAscii()],
    ['base', VIEWS.viewBase()],
    ['about', VIEWS.viewAbout()],
    ['notepad', TOOLVIEWS.viewNotepad()],
    ['html-editor', TOOLVIEWS.viewHtmlEditor()],
    ['entities', TOOLVIEWS.viewEntities()],
    ...WEB_SLUGS.map((slug) => [`web-tools/${slug}`, CONTENT.viewWebTools(route(`/web-tools/${slug}`))]),
    ...Object.keys(ARTICLES).slice(0, 25).map((slug) => [`read/${slug}`, CONTENT.viewArticle(slug)]),
    ...Object.keys(GLOSSARY).slice(0, 15).map((key) => [`glossary/${key}`, CONTENT.viewGlossaryEntry(key)]),
    ...TOOLS.slice(0, 15).map((t) => [`tool/${t.id}`, VIEWS.viewTool(route(`/tool/${t.id}`))]),
  ];

  const bad = [];
  for (const [label, node] of nodes) {
    for (const el of walk(toTree(node))) {
      const href = el.attributes?.href ?? '';
      if (!href || !href.startsWith('#')) continue;
      if (href === '#' || href === '#main') continue;
      if (!href.startsWith('#/')) {
        bad.push(`${label}: bare hash link ${href}`);
        continue;
      }
      const seg = href.slice(1).split('?')[0].split('/').filter(Boolean);
      if (!seg.length) continue;
      const [head, sub] = seg;
      if (!HEADS.has(head)) { bad.push(`${label}: unknown route ${href}`); continue; }
      if (head === 'tool' && sub && !TOOL_IDS.has(sub)) bad.push(`${label}: unknown tool ${href}`);
      if (head === 'read' && sub && !ARTICLES[sub]) bad.push(`${label}: unknown article ${href}`);
      if (head === 'glossary' && sub && !GLOSSARY[sub]) bad.push(`${label}: unknown glossary term ${href}`);
      if (head === 'units' && sub && !FAMILIES[sub]) bad.push(`${label}: unknown unit family ${href}`);
      if (head === 'web-tools' && sub && !WEB_SLUGS.includes(sub)) bad.push(`${label}: unknown web tool ${href}`);
      if ((head === 'calc' || head === 'tools') && sub && !GROUP_IDS.has(sub)) bad.push(`${label}: unknown calculator group ${href}`);
      if (head === 'symbols' && sub && !SYMBOL_IDS.has(sub)) bad.push(`${label}: unknown symbol group ${href}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('the web tools contents table links and targets line up', async () => {
  const els = walk(toTree(CONTENT.viewWebTools(route('/web-tools'))));
  const table = els.find((e) => e.tagName === 'TABLE');
  assert.ok(table, 'web tools page renders a contents table');
  const links = els.filter((e) => e.tagName === 'A' && e.parentNode?.tagName === 'TD');
  assert.ok(links.length >= 6, `expected a contents link per subtopic, saw ${links.length}`);
  const ids = new Set(els.filter((e) => e.attributes.id).map((e) => e.attributes.id));
  for (const link of links) {
    const href = link.attributes.href ?? '';
    assert.ok(!href.startsWith('#wt-'), `contents link ${href} would change the hash route`);
  }
  const headings = els.filter((e) => e.tagName === 'H2').map((e) => e.textContent);
  assert.ok(headings.includes('Contents'), 'contents heading is present');
  for (const id of ids) assert.ok(id.startsWith('wt-'), `unexpected id ${id}`);
  assert.ok(ids.size === links.length, 'every contents row has a matching section id');
});

test('topic pages split their notes into subtopics with a matching contents table', async () => {
  const { TOPIC_SETS } = await import('../js/data/topics.js');
  const pages = [
    ['math', CONTENT.viewMathRef(), TOPIC_SETS.math],
    ['electricity', CONTENT.viewElectricityRef(), TOPIC_SETS.electricity],
    ['reference', CONTENT.viewLearn(), TOPIC_SETS.reference],
  ];

  for (const [label, node, groups] of pages) {
    const els = walk(toTree(node));
    const ids = new Set(els.filter((e) => e.attributes?.id).map((e) => e.attributes.id));
    const headings = els.filter((e) => e.tagName === 'H2').map((e) => e.textContent);
    const rows = els.filter((e) => e.tagName === 'A' && e.parentNode?.tagName === 'TD');

    assert.ok(headings.includes('Contents'), `${label}: contents heading is present`);
    assert.equal(rows.length, groups.length, `${label}: one contents row per subtopic`);

    for (const g of groups) {
      assert.ok(g.items.length > 0, `${label}: subtopic "${g.title}" has no links`);
      assert.ok(ids.has(g.id), `${label}: section #${g.id} is missing`);
      assert.ok(headings.includes(g.title), `${label}: heading "${g.title}" is missing`);
      for (const item of g.items) {
        assert.ok(item.title && item.href.startsWith('#/'), `${label}: bad link ${JSON.stringify(item)}`);
      }
    }

    for (const row of rows) {
      const href = row.attributes.href ?? '';
      assert.ok(!href.startsWith('#el-') && !href.startsWith('#conv-') && !href.startsWith('#ref-'),
        `${label}: contents link ${href} would change the hash route`);
    }
  }

  // the reference index must account for every article exactly once
  const listed = TOPIC_SETS.reference.flatMap((g) => g.items.map((i) => i.href));
  const { ARTICLES } = await import('../js/data/reference.js');
  for (const slug of Object.keys(ARTICLES)) {
    assert.ok(listed.includes(`#/read/${slug}`), `reference index does not list ${slug}`);
  }
});

test('the calculation notes are filed under Electricity & Electronics', async () => {
  const { TOPIC_SETS, CALCULATION_NOTES, articleTopic, articleSiblings } = await import('../js/data/topics.js');
  const { ARTICLES } = await import('../js/data/reference.js');

  assert.ok(CALCULATION_NOTES.length >= 20, 'expected a full set of calculation notes');

  const group = TOPIC_SETS.electricity.find((g) => g.id === 'el-calc');
  assert.ok(group, 'the electricity topic has a "how to calculate" subtopic');

  for (const slug of CALCULATION_NOTES) {
    const note = ARTICLES[slug];
    assert.ok(note, `note ${slug} exists`);
    assert.ok(note.blocks.length >= 6, `note ${slug} has enough content`);
    assert.ok(note.blocks.some((b) => b.k === 'formula'), `note ${slug} shows a formula`);
    assert.ok(group.items.some((i) => i.href === `#/read/${slug}`), `${slug} is listed in "How to calculate"`);

    const topic = articleTopic(slug);
    assert.equal(topic.topic, 'electricity', `${slug} belongs to the electricity topic`);
    assert.equal(topic.href, '#/electricity', `${slug} breadcrumb points at electricity`);

    const siblings = articleSiblings(slug, 3);
    assert.ok(siblings.length > 0, `${slug} has neighbours in its subtopic`);
    assert.ok(!siblings.includes(slug), `${slug} is not its own neighbour`);
  }
});
