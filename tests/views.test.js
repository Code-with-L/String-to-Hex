/**
 * View smoke tests — render every page in a minimal DOM and assert the result
 * is a real, populated tree. Catches render-time errors that unit tests cannot.
 */

import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { installDOM, toTree, walk } from './dom-shim.js';

installDOM();

const { TOOLS } = await import('../js/data/tools.js');
const { FAMILIES } = await import('../js/data/units.js');
const VIEWS = await import('../js/ui/views.js');
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

test('home view renders with featured tools', () => {
  const els = assertTree(VIEWS.viewHome(), 'home');
  const text = els.map((e) => e.textContent).join(' ');
  assert.match(text, /String to hex/);
  assert.ok(els.some((e) => e.tagName === 'TEXTAREA'), 'home has a quick-convert textarea');
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
