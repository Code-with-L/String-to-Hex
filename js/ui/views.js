/** Views: home, converter, tool runner, unit browser, ASCII table, about. */

import { $, el, frag, mount, fmtNum, fmtBytes, copyText, download, readFile, toast, debounce } from './dom.js';
import { navigate, syncQuery, buildQuery } from './router.js';
import { FAMILIES, FAMILY_IDS, unitName, unitSymbol } from '../data/units.js';
import { TOOLS, TOOL_BY_ID, GROUPS, groupOf } from '../data/tools.js';
import { FORMATS, ENCODINGS, DELIMS, encodingSupported, CHECKSUMS, toBytes, fromBytes, convertFormat, bytesToBigInt, twosComplement } from '../data/formats.js';
import { ASCII_128, ASCII_TABLE, analyse, expandBase } from '../data/ascii.js';
import { convertValue } from '../core/convert.js';

/* ── shared bits ────────────────────────────────────────────────────────── */

const crumbs = (...parts) => el('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' },
  el('a', { href: '#/' }, 'Home'),
  ...parts.flatMap((p) => [el('span', { 'aria-hidden': 'true' }, '/'), p]),
);

const actionBar = (items) => el('div', { class: 'btn-row' }, ...items);

const btn = (label, onclick, opts = {}) => el('button', {
  class: `btn ${opts.variant ?? ''} ${opts.size ?? ''}`.trim(),
  type: 'button', onclick, title: opts.title ?? label, ...(opts.attrs ?? {}),
}, opts.icon ? el('span', { 'aria-hidden': 'true' }, opts.icon) : null, el('span', {}, label));

const alert = (text, kind = 'info') => el('div', { class: `alert alert-${kind}`, role: kind === 'error' ? 'alert' : 'status' }, text);

const encoders = new Map();
function encodeChar(char) {
  let fn = encoders.get(currentEncoding);
  if (!fn) {
    fn = (ch) => toBytes('text', ch, currentEncoding);
    encoders.set(currentEncoding, fn);
  }
  return fn(char);
}
let currentEncoding = 'utf-8';

/* ── home ───────────────────────────────────────────────────────────────── */

export function viewHome() {
  const featured = ['ohms-law', 'quadratic', 'stddev', 'mortgage', 'radix-calc', 'color-convert'];
  return frag(
    el('section', { class: 'page-head' },
      el('h1', {}, 'String to hex, and every other base — instantly'),
      el('p', {}, 'Paste text and read the bytes. Swap to hex, binary, decimal, octal or Base64. '
        + 'Unit converters, physics formulas and statistics calculators run in the same tab, work offline, and install like a native app.'),
    ),
    el('section', { class: 'panel', style: 'margin-bottom:18px' },
      el('h2', { class: 'panel-title' }, 'Quick convert'),
      quickConvertPanel(),
    ),
    el('section', { class: 'grid grid-2' },
      ...featured.map((id) => toolCard(TOOL_BY_ID[id])).filter(Boolean),
      el('a', { class: 'tool-card', href: '#/tools' },
        el('h3', {}, `${TOOLS.length} calculators`),
        el('p', {}, 'Electrical, financial, statistical, colour, text and general tools — all offline.'),
      ),
    ),
    el('section', { class: 'panel', style: 'margin-top:18px' },
      el('h2', { class: 'panel-title' }, 'Unit families'),
      el('div', { class: 'chips' },
        ...FAMILY_IDS.map((id) => el('a', { class: 'chip', href: `#/units/${id}` },
          el('b', {}, FAMILIES[id].title), `${Object.keys(FAMILIES[id].units).length} units`)),
      ),
    ),
  );
}

const toolCard = (tool) => tool && el('a', { class: 'tool-card', href: `#/tool/${tool.id}` },
  el('h3', {}, tool.title),
  el('p', {}, tool.blurb ?? ''),
);

/* ── quick convert widget (used on home) ─────────────────────────────────── */

function quickConvertPanel() {
  const input = el('textarea', { class: 'textarea', placeholder: 'Type or paste anything…', spellcheck: 'false', id: 'qc-in' });
  const output = el('textarea', { class: 'textarea', readonly: '', spellcheck: 'false', id: 'qc-out' });
  const sel = el('select', { class: 'select', id: 'qc-fmt' },
    ...FORMATS.filter((f) => f.id !== 'text').map((f) => el('option', { value: f.id }, f.label)));
  const enc = el('select', { class: 'select', id: 'qc-enc' },
    ...ENCODINGS.slice(0, 6).map((e) => el('option', { value: e.id, selected: e.id === 'utf-8' }, e.label)));

  const run = () => {
    const text = input.value;
    if (!text) { output.value = ''; return; }
    try { output.value = convertFormat('text', sel.value, text, { encoding: enc.value, delimiter: ' ' }); }
    catch (e) { output.value = `⚠ ${e.message}`; }
  };
  [input, sel, enc].forEach((n) => n.addEventListener('input', run));
  sel.addEventListener('change', run);

  return frag(
    el('div', { class: 'panes' },
      el('div', { class: 'pane' },
        el('div', { class: 'pane-head' }, el('span', { class: 'pane-title' }, 'Text input')),
        input),
      el('div', { class: 'swap-col' }, el('span', { style: 'color:var(--faint);font-size:13px' }, '→')),
      el('div', { class: 'pane pane-output' },
        el('div', { class: 'pane-head' },
          el('span', { class: 'pane-title' }, 'Output'),
          btn('Copy', async () => toast(await copyText(output.value) ? 'Copied' : 'Copy failed', { size: 'btn-sm' })),
        ),
        output),
    ),
    el('div', { class: 'inline-fieldset', style: 'margin-top:14px' },
      el('div', { class: 'field' }, el('span', { class: 'field-label' }, 'Output format'), sel),
      el('div', { class: 'field' }, el('span', { class: 'field-label' }, 'Encoding'), enc),
      el('div', { class: 'field' }, el('span', { class: 'field-label' }, ''),
        btn('Open full converter', () => navigate(`/convert?from=text&to=${sel.value}`), { variant: 'btn-primary' })),
    ),
  );
}

/* ── converter ──────────────────────────────────────────────────────────── */

export function viewConvert(route) {
  currentEncoding = route.query.get('enc') ?? 'utf-8';
  const from = FORMATS.some((f) => f.id === route.query.get('from')) ? route.query.get('from') : 'text';
  const to = FORMATS.some((f) => f.id === route.query.get('to')) ? route.query.get('to') : 'hex';

  const inTA = el('textarea', { class: 'textarea', spellcheck: 'false', placeholder: 'Input…', id: 'c-in' });
  const outTA = el('textarea', { class: 'textarea', readonly: '', spellcheck: 'false', placeholder: 'Output…', id: 'c-out' });
  const fromSel = el('select', { class: 'select' }, ...FORMATS.map((f) => el('option', { value: f.id, selected: f.id === from }, f.label)));
  const toSel = el('select', { class: 'select' }, ...FORMATS.map((f) => el('option', { value: f.id, selected: f.id === to }, f.label)));
  const encSel = el('select', { class: 'select' }, ...ENCODINGS.map((e) => el('option', { value: e.id, selected: e.id === currentEncoding }, e.label)));
  const delSel = el('select', { class: 'select' }, ...DELIMS.map((d) => el('option', { value: d.value }, d.label)));
  const delCustom = el('input', { class: 'input mono', placeholder: 'custom', disabled: true });
  const statsBox = el('div', { class: 'stats' });
  const errBox = el('div');
  const inspector = el('div');

  const state = {
    prefix: false, uppercase: true, bytesOut: 'text', width: 8, checksum: '',
  };

  const delimValue = () => {
    const opt = DELIMS.find((d) => d.label === delSel.selectedOptions[0]?.textContent);
    if (delCustom.disabled) return delSel.value;
    return delCustom.value;
  };
  const prefix = () => (state.prefix ? (state.bytesOut === 'bin' ? '0b' : '0x') : '');

  function run() {
    errBox.replaceChildren();
    const raw = inTA.value;
    const f = fromSel.value, t = toSel.value;
    if (!raw) { outTA.value = ''; statsBox.replaceChildren(); inspector.replaceChildren(); return; }
    try {
      const opts = { encoding: encSel.value, delimiter: delimValue(), prefix: prefix(), uppercase: state.uppercase };
      const bytes = toBytes(f, raw, encSel.value);
      outTA.value = t === f ? raw : fromBytes(t, bytes, opts);
      renderStats(bytes, raw, f);
      renderInspector(bytes);
      syncQuery({ from: f, to: t, enc: encSel.value });
    } catch (e) {
      outTA.value = '';
      statsBox.replaceChildren();
      inspector.replaceChildren();
      errBox.replaceChildren(alert(e.message, 'error'));
    }
  }

  const renderStats = (bytes, raw, f) => {
    const chars = f === 'text' ? [...raw].length : null;
    mount(statsBox,
      stat(String(bytes.length), 'Bytes'),
      stat(String(bytes.length * 8), 'Bits'),
      chars !== null ? stat(String(chars), 'Characters') : null,
      stat(fmtBytes(bytes.length), 'Size'),
      stat(`${((bytes.length * 8) / 8).toFixed(0)}`, 'Octets'),
    );
  };

  function renderInspector(bytes) {
    const bits = [];
    for (const b of bytes) bits.push(b.toString(2).padStart(8, '0'));
    const limit = 512;
    const shown = bits.slice(0, limit);
    const body = el('div');
    if (!bytes.length) { mount(inspector); return; }

    const rows = [];
    for (let i = 0; i < shown.length; i += 16) {
      const chunk = bytes.slice(i, i + 16);
      rows.push(el('tr', {},
        el('td', { class: 'mono' }, i.toString(16).padStart(4, '0')),
        el('td', { class: 'mono' }, [...chunk].map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')),
        el('td', { class: 'mono' }, [...chunk].map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : '·')).join('')),
      ));
    }
    // NB: a bare `append(null)` renders the literal string "null" in a browser,
    // so optional children go through frag(), which filters them out.
    body.append(frag(
      el('div', { class: 'table-scroll' }, el('table', {},
        el('thead', {}, el('tr', {},
          el('th', {}, 'Offset'), el('th', {}, 'Hex'), el('th', {}, 'ASCII'))),
        el('tbody', {}, ...rows))),
      bits.length > limit ? el('p', { style: 'color:var(--faint);font-size:13px;margin:8px 0 0' }, `Showing the first ${limit} of ${bits.length} bytes.`) : null,
    ));
    mount(inspector, body);
  }

  const stat = (value, label) => el('div', { class: 'stat' }, el('b', {}, value), el('span', {}, label));

  /* wiring */
  const live = debounce(run, 140);
  inTA.addEventListener('input', live);
  [fromSel, toSel, encSel, delSel].forEach((s) => s.addEventListener('change', () => { syncQuery({ from: fromSel.value, to: toSel.value, enc: encSel.value }); run(); }));
  delSel.addEventListener('change', () => { delCustom.disabled = true; delCustom.value = ''; run(); });
  delCustom.addEventListener('input', run);

  inTA.addEventListener('dragover', (e) => { e.preventDefault(); inTA.classList.add('over'); });
  inTA.addEventListener('dragleave', () => inTA.classList.remove('over'));
  inTA.addEventListener('drop', async (e) => {
    e.preventDefault(); inTA.classList.remove('over');
    const file = e.dataTransfer.files[0];
    if (file) { inTA.value = await readFile(file); run(); }
  });

  const controls = frag(
    el('div', { class: 'conv-controls' },
      el('div', { class: 'field' }, el('label', { for: 'from' }, 'From'), fromSel),
      el('div', { class: 'field' }, el('label', { for: 'to' }, 'To'), toSel),
      el('div', { class: 'field' }, el('label', { for: 'enc' }, 'Encoding'), encSel),
      el('div', { class: 'field' }, el('label', { for: 'del' }, 'Delimiter'), delSel),
      el('div', { class: 'field' }, el('label', { for: 'delc' }, 'Custom delimiter'), delCustom),
    ),
    el('div', { style: 'display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-bottom:12px' },
      el('label', { class: 'check' }, el('input', { type: 'checkbox', id: 'pfx', onchange: (e) => { state.prefix = e.target.checked; run(); } }), 'Add 0x / 0b prefix'),
      el('label', { class: 'check' }, el('input', { type: 'checkbox', id: 'upc', checked: true, onchange: (e) => { state.uppercase = e.target.checked; run(); } }), 'Uppercase hex'),
    ),
  );

  // allow a free-text custom delimiter by choosing the last option
  const customOpt = el('option', { value: '__custom__' }, 'User defined');
  delSel.append(customOpt);
  delSel.addEventListener('change', () => {
    const isCustom = delSel.value === '__custom__';
    delCustom.disabled = !isCustom;
    if (isCustom) delCustom.focus();
    run();
  });
  if (route.query.get('del') === 'custom') { delSel.value = '__custom__'; delCustom.disabled = false; delCustom.value = route.query.get('delv') ?? ''; }

  const setFromQuery = (q, d) => { delSel.value = DELIMS.find((x) => x.value === q)?.value ?? d; };
  setFromQuery(route.query.get('del'), ' ');

  const preset = route.query.get('sample');
  if (preset) { inTA.value = sampleFor(preset); }
  else if (from === 'text' && !inTA.value) inTA.value = 'Plant trees';

  run();

  return frag(
    crumbs(el('a', { href: '#/convert' }, 'Converter'), el('span', {}, `${from.toUpperCase()} to ${to.toUpperCase()}`)),
    el('section', { class: 'page-head' },
      el('h1', {}, `${FORMATS.find((f) => f.id === from).label} → ${FORMATS.find((f) => f.id === to).label}`),
      el('p', {}, 'Every conversion happens in this tab. Nothing is uploaded, and it keeps working with no network.'),
    ),
    el('section', { class: 'panel' },
      controls,
      el('div', { class: 'panes' },
        el('div', { class: 'pane' },
          el('div', { class: 'pane-head' },
            el('span', { class: 'pane-title' }, `${FORMATS.find((f) => f.id === from).label} input`),
            btn('Sample', () => { inTA.value = 'Plant trees'; run(); }, { size: 'btn-sm' }),
          ),
          inTA),
        el('div', { class: 'swap-col' }, el('button', {
          class: 'swap-btn', type: 'button', 'aria-label': 'Swap direction', title: 'Swap direction',
          onclick: () => { const f = fromSel.value; fromSel.value = toSel.value; toSel.value = f; run(); },
        }, '⇅')),
        el('div', { class: 'pane pane-output' },
          el('div', { class: 'pane-head' },
            el('span', { class: 'pane-title' }, `${FORMATS.find((f) => f.id === to).label} output`),
            btn('Copy', async () => toast(await copyText(outTA.value) ? 'Copied to clipboard' : 'Copy failed'), { size: 'btn-sm' }),
          ),
          outTA),
      ),
      errBox,
      statsBox,
      actionBar([
        btn('Open file', () => openFileInto(inTA, run), { icon: '📂' }),
        btn('Save output', () => download(`hexkit-output.${toSel.value === 'text' ? 'txt' : toSel.value}`, outTA.value), { icon: '⬇' }),
        btn('Clear', () => { inTA.value = ''; run(); inTA.focus(); }, { icon: '×' }),
        btn('Sample emoji', () => { inTA.value = 'Hello, 世界! 👋🏽'; run(); }),
        btn('Sample binary', () => { inTA.value = '48 65 6C 6C 6F'; fromSel.value = 'hex'; toSel.value = 'text'; run(); }),
      ]),
    ),
    el('section', { class: 'panel', style: 'margin-top:18px' },
      el('h2', { class: 'panel-title' }, 'Byte inspector'),
      inspector,
    ),
    el('section', { class: 'panel', style: 'margin-top:18px' },
      el('h2', { class: 'panel-title' }, 'How it works'),
      el('div', { class: 'grid grid-2' },
        el('div', {},
          el('h3', {}, 'Text → hex'),
          el('ol', { class: 'mono' },
            el('li', {}, 'Take one character.'),
            el('li', {}, 'Find its code point (Unicode) or byte value (ASCII).'),
            el('li', {}, 'Rewrite that number in base 16 — e.g. 65 = 4·16¹ + 1·16⁰ = 41.'),
            el('li', {}, 'Repeat for every character, then join with the delimiter.')),
          el('p', { style: 'color:var(--muted);font-size:14px' },
            '“Plant trees” → 50 6C 61 6E 74 20 74 72 65 65 73'),
        ),
        el('div', {},
          el('h3', {}, 'Hex → text'),
          el('ol', { class: 'mono' },
            el('li', {}, 'Take one hex byte.'),
            el('li', {}, 'Convert it back to decimal — 6C = 6·16¹ + 12·16⁰ = 108.'),
            el('li', {}, 'Look up the character for that value — 108 is “l”.'),
            el('li', {}, 'Repeat, then decode the whole byte stream.')),
          el('p', { style: 'color:var(--muted);font-size:14px' },
            'Prefixes (0x), quotes and any delimiters are stripped automatically.'),
        ),
      ),
    ),
  );
}

const sampleFor = (kind) => ({
  ascii: 'Plant trees', emoji: 'Hello, 世界! 👋🏽', binary: '01001000 01101001',
  base64: 'SGVsbG8=', hex: '50 6C 61 6E 74', latin: 'Café', utf16: 'Hi ☃',
}[kind] ?? 'Plant trees');

async function openFileInto(ta, after) {
  const picker = $('#filePicker');
  picker.value = '';
  picker.click();
  await new Promise((res) => {
    picker.onchange = async () => {
      const f = picker.files[0];
      if (f) { ta.value = await readFile(f); after?.(); }
      res();
    };
  });
}

/* ── tool runner ────────────────────────────────────────────────────────── */

export function viewTool(route) {
  const tool = TOOL_BY_ID[route.segments[1]];
  if (!tool) return notFound(`No calculator called “${route.segments[1]}”.`);

  const inputs = el('div', { class: 'conv-controls' });
  const results = el('div', { class: 'result-grid' });
  const steps = el('div', { class: 'steps' });
  const errBox = el('div');
  const tableBox = el('div');
  const controls = new Map();

  for (const input of tool.inputs) {
    const id = `f-${tool.id}-${input.id}`;
    let node;
    if (input.type === 'select') {
      node = el('select', { class: 'select', id }, ...input.options.map(([v, l]) => el('option', { value: v }, l)));
    } else if (input.type === 'checkbox') {
      node = el('input', { type: 'checkbox', id });
    } else if (input.type === 'date') {
      node = el('input', { class: 'input', type: 'date', id });
    } else if (input.type === 'textarea') {
      node = el('textarea', { class: 'textarea', id, rows: 4 });
    } else {
      node = el('input', {
        class: input.type === 'text' ? 'input mono' : 'input', type: input.type === 'text' ? 'text' : 'number',
        id, step: input.step ?? 'any', min: input.min, max: input.max,
        placeholder: input.placeholder ?? '', autocomplete: 'off', spellcheck: 'false',
      });
    }
    if (input.type === 'checkbox') {
      inputs.append(el('div', { class: 'field' }, el('label', { class: 'check', for: id }, node, el('span', {}, input.label))));
    } else {
      inputs.append(el('div', { class: 'field' },
        el('label', { for: id }, input.label + (input.unit ? ` (${input.unit})` : '')),
        node));
    }
    controls.set(input.id, node);
    node.addEventListener('input', run);
    node.addEventListener('change', run);
  }

  // sensible defaults from the query string, then first-run examples
  const applyQuery = () => {
    for (const input of tool.inputs) {
      const v = route.query.get(input.id);
      if (v !== null && controls.get(input.id)) controls.get(input.id).value = v;
    }
    const seed = SEEDS[tool.id];
    if (seed && !route.query.get('x')) {
      for (const [k, v] of Object.entries(seed)) if (controls.get(k)) controls.get(k).value = String(v);
    }
  };

  function run() {
    errBox.replaceChildren();
    const v = Object.fromEntries(tool.inputs.map((i) => [i.id, controls.get(i.id).type === 'checkbox' ? controls.get(i.id).checked : controls.get(i.id).value]));
    let r;
    try { r = tool.compute(v); }
    catch (e) { r = { error: e.message ?? String(e) }; }
    if (r.error) {
      mount(results); mount(steps); mount(tableBox);
      errBox.replaceChildren(alert(r.error, 'error'));
      return;
    }
    const outs = r.outputs ?? tool.inputs.map((i) => ({ id: i.id, label: i.label, unit: i.unit }));
    mount(results, ...outs
      .filter((o) => r.values[o.id] !== undefined)
      .map((o) => el('div', { class: 'result' },
        el('span', { class: 'result-label' }, o.label),
        el('span', { class: 'result-value' }, String(r.values[o.id] ?? '')),
        o.unit ? el('span', { class: 'result-unit' }, o.unit) : null)));
    steps.textContent = (r.steps ?? []).join('\n');
    if (r.table) {
      mount(tableBox, el('div', { class: 'table-scroll' }, el('table', {},
        el('thead', {}, el('tr', {}, ...r.table.head.map((h) => el('th', {}, h)))),
        el('tbody', {}, ...r.table.rows.map((row) => el('tr', {}, ...row.map((c) => el('td', { class: 'mono' }, String(c)))))))));
    } else mount(tableBox);
    syncQuery(Object.fromEntries(tool.inputs.map((i) => [i.id, v[i.id]])));
  }

  const SEEDS = {
    'ohms-law': { v: 12, i: 2 }, 'voltage-divider': { vin: 12, r1: 1000, r2: 470 },
    'power-factor': { v: 400, a: 25, kw: 12 }, 'three-phase': { v: 400, i: 10, pf: 0.9 },
    'voltage-drop': { awg: '10', len: 30, i: 20, v: 240 }, 'dbm': { v: 30, from: 'dbm' },
    ev: { v: 12, from: 'j' }, 'energy-bill': { w: 1500, h: 8, rate: 0.15 },
    photometry: { mode: 'cd2lux', x: 500, d: 2 },
    stddev: { data: '2 4 4 4 5 5 7 9', mode: 'pop' },
    'weighted-average': { data: '80:1, 90:2, 70:3' },
    quadratic: { a: 1, b: -3, c: 2 }, root: { x: 16, k: 2 }, factorial: { n: 10, r: 3 },
    percentage: { mode: '1', x: 15, y: 200 }, 'percent-error': { measured: 9.6, accepted: 10 },
    'gcf-lcm': { data: '12 18 24' }, fraction: { n1: 1, d1: 2, n2: 1, d2: 3, op: '+' },
    'decimal-fraction': { x: '0.375' }, ratio: { data: '16:24' }, divmod: { a: 47, b: 5 },
    scientific: { x: 12345, op: 'none' }, pythagorean: { a: 3, b: 4 },
    convolution: { x: '1 2 3 4', h: '1 2 1' }, log: { x: 100, b: 10, dir: 'log' },
    'exponential-growth': { x0: 100, r: 5, t: 10 }, trig: { x: 45, unit: 'deg' },
    'color-convert': { hex: '#3B82F6' }, 'radix-calc': { base: '16', a: 'FF', b: '0F', op: 'add' },
    roman: { v: 2024 }, 'number-words': { v: 1234 },
    'case-convert': { text: 'the quick brown fox', mode: 'camel' },
    url: { text: 'hello world & more', mode: 'enc' },
    counters: { text: 'The quick brown fox jumps over the lazy dog. The dog sleeps.' },
    hash: { text: 'HexKit' },
    mortgage: { p: 400000, rate: 5.5, n: 30, down: 80000 },
    compound: { p: 10000, r: 7, t: 10, n: '12', ap: 100 },
    'simple-interest': { p: 10000, r: 5, t: 3, unit: 'y' },
    vat: { amount: 100, rate: 20, mode: 'add' },
    discount: { price: 200, rate: 25, tax: 8, mode: 'pct' },
    gpa: { courses: 'A:3, B+:4, C:2', scale: 'plus' },
    'final-grade': { total: 420, possible: 500, weight: 30 },
    bmi: { w: 70, h: 175, sys: 'metric', age: 30 },
    duration: { d: 2, h: 6, m: 30, s: 0 },
    'growth-decay': { x0: 100, r: 10, steps: 5 },
    custom: { expr: 'sin(pi/4) * 2^10' },
    'custom-convert': { x: 5, expr: 'x * 2.54' },
    random: { min: 1, max: 100, step: 1, count: 10, crypto: true },
    password: { len: 20, lower: true, upper: true, digits: true, symbols: true, ambiguous: true },
    batch: { values: '1\n2\n3.5\n4', factor: 2.5 },
    'wire-gauge': { n: 14, mode: 'awg' },
    'resistor-color': { d1: '4', d2: '7', m: '1', t: '5' },
    'date-diff': { a: '2020-01-01', b: '2024-06-15' },
    age: { dob: '1990-04-17' },
    'world-clock': { zones: 'UTC,America/New_York,Europe/London,Asia/Tokyo' },
  };

  applyQuery();
  run();

  return frag(
    crumbs(el('a', { href: '#/tools' }, 'Calculators'), el('span', {}, groupOf(tool.group).title), el('span', {}, tool.title)),
    el('section', { class: 'page-head' },
      el('h1', {}, tool.title),
      el('p', {}, tool.blurb ?? ''),
    ),
    el('section', { class: 'panel' },
      inputs,
      errBox,
      el('h3', { class: 'panel-title', style: 'margin-top:18px' }, 'Results'),
      results,
      el('details', { class: 'disclosure' },
        el('summary', {}, 'Show the working'),
        el('div', { class: 'disclosure-body' }, steps)),
      tableBox,
      actionBar([
        btn('Copy results', async () => {
          const txt = [...results.querySelectorAll('.result')].map((r) => `${r.querySelector('.result-label').textContent}: ${r.querySelector('.result-value').textContent}`).join('\n');
          toast(await copyText(txt) ? 'Results copied' : 'Copy failed');
        }),
        btn('Reset', () => { applyQuery(); route.query.forEach((_, k) => {}); run(); }),
      ]),
    ),
    relatedTools(tool),
  );
}

const relatedTools = (tool) => {
  const same = TOOLS.filter((t) => t.group === tool.group && t.id !== tool.id).slice(0, 6);
  if (!same.length) return null;
  return el('section', { class: 'panel', style: 'margin-top:18px' },
    el('h2', { class: 'panel-title' }, `More in ${groupOf(tool.group).title}`),
    el('div', { class: 'grid grid-2' }, ...same.map(toolCard)));
};

/* ── tool index ─────────────────────────────────────────────────────────── */

export function viewTools(route) {
  const q = (route.query.get('q') ?? '').toLowerCase();
  const search = el('input', { class: 'input', type: 'search', placeholder: 'Search calculators…', value: route.query.get('q') ?? '', autocomplete: 'off' });
  const list = el('div', { class: 'grid grid-2' });

  const filter = () => {
    const term = search.value.trim().toLowerCase();
    syncQuery({ q: search.value });
    const hits = TOOLS.filter((t) => !term
      || t.title.toLowerCase().includes(term)
      || (t.keywords ?? '').includes(term)
      || groupOf(t.group).title.toLowerCase().includes(term));
    mount(list, ...(hits.length
      ? hits.map((t) => toolCard(t))
      : [alert(`Nothing matches “${search.value}”.`, 'info')]));
  };

  search.addEventListener('input', debounce(filter, 160));

  const groups = GROUPS.map((g) => el('section', { style: 'margin-bottom:22px' },
    el('h2', { class: 'panel-title' }, g.title),
    el('div', { class: 'grid grid-2' }, ...TOOLS.filter((t) => t.group === g.id).map(toolCard))));

  if (!q) {
    return frag(
      el('section', { class: 'page-head' },
        el('h1', {}, 'All calculators'),
        el('p', {}, `${TOOLS.length} tools across ${GROUPS.length} areas. Each one shows its working, links to its inputs, and works offline.`)),
      el('div', { class: 'search-box' }, search),
      el('div', { id: 'tool-groups' }, ...groups),
    );
  }
  filter();
  return frag(
    el('section', { class: 'page-head' }, el('h1', {}, 'Search'), el('p', {}, `Results for “${route.query.get('q')}”.`)),
    el('div', { class: 'search-box' }, search),
    list,
  );
}

/* ── unit browser ───────────────────────────────────────────────────────── */

export function viewUnits(route) {
  const fam = route.segments[1];
  if (!fam || !FAMILIES[fam]) {
    return frag(
      el('section', { class: 'page-head' }, el('h1', {}, 'Unit families'),
        el('p', {}, 'Pick a family to see every conversion pair and reference factor.')),
      el('div', { class: 'grid grid-2' },
        ...FAMILY_IDS.map((id) => el('a', { class: 'tool-card', href: `#/units/${id}` },
          el('h3', {}, FAMILIES[id].title),
          el('p', {}, `${Object.keys(FAMILIES[id].units).length} units · base unit ${FAMILIES[id].baseName}`)))),
    );
  }

  const F = FAMILIES[fam];
  const keys = Object.keys(F.units);
  const rows = [];
  for (const a of keys) for (const b of keys) {
    if (a === b) continue;
    if (F.units[a].expr || F.units[b].expr) continue;
    rows.push(el('tr', {},
      el('td', {}, el('a', { href: `#/convert/${a}-to-${b}` }, `${unitName(fam, a)} → ${unitName(fam, b)}`)),
      el('td', { class: 'mono' }, `${unitSymbol(fam, a)} → ${unitSymbol(fam, b)}`),
      el('td', { class: 'mono' }, fmtNum(F.units[a].f / F.units[b].f, 10)),
    ));
  }

  return frag(
    crumbs(el('a', { href: '#/units' }, 'Units'), el('span', {}, F.title)),
    el('section', { class: 'page-head' },
      el('h1', {}, `${F.title} converters`),
      el('p', {}, `All ${rows.length} ordered pairs, driven by the exact reference factors. Base unit: ${F.baseName} (${F.base}).`),
      F.note ? el('p', { style: 'color:var(--warn);font-size:14px' }, F.note) : null),
    el('section', { class: 'panel' },
      el('h2', { class: 'panel-title' }, 'Reference factors'),
      el('div', { class: 'table-scroll' }, el('table', {},
        el('thead', {}, el('tr', {},
          el('th', {}, 'Unit'), el('th', {}, 'Symbol'), el('th', {}, `Factor vs ${F.baseName}`), el('th', {}, '1 unit in base'))),
        el('tbody', {}, ...keys.map((k) => el('tr', {},
          el('td', {}, unitName(fam, k)),
          el('td', { class: 'mono' }, unitSymbol(fam, k)),
          el('td', { class: 'mono' }, F.units[k].f === 1 ? '—' : `× ${F.units[k].f}`),
          el('td', { class: 'mono' }, fmtNum(1 / F.units[k].f, 12))))))),
      F.affineNote ? el('p', { style: 'color:var(--muted);font-size:13px' }, F.affineNote) : null,
    ),
    el('section', { class: 'panel', style: 'margin-top:18px' },
      el('h2', { class: 'panel-title' }, `All ${F.title.toLowerCase()} conversions`),
      el('div', { class: 'table-scroll' }, el('table', {},
        el('thead', {}, el('tr', {},
          el('th', {}, 'Conversion'), el('th', {}, 'Symbols'), el('th', {}, 'Multiply input by'))),
        el('tbody', {}, ...rows))),
    ),
  );
}

/* ── ASCII ──────────────────────────────────────────────────────────────── */

export function viewAscii() {
  const filter = el('input', { class: 'input', type: 'search', placeholder: 'Filter by character, hex or decimal…', autocomplete: 'off' });
  const tbody = el('tbody');

  const draw = () => {
    const term = filter.value.trim().toLowerCase();
    const rows = ASCII_128.filter((r) => !term
      || r.hex.toLowerCase().includes(term)
      || String(r.dec).includes(term)
      || (r.printable && r.char.toLowerCase() === term));
    mount(tbody, ...rows.slice(0, 200).map((r) => el('tr', { onclick: () => navigate(`/convert?from=hex&to=text&d=4E${r.hex}`) , style: 'cursor:pointer', title: 'Click to convert' },
      el('td', { class: 'mono' }, String(r.dec).padStart(3, '0')),
      el('td', { class: 'cell-char' }, r.printable ? r.char : el('span', { style: 'color:var(--faint)' }, r.char)),
      el('td', { class: 'mono' }, r.hex),
      el('td', { class: 'mono' }, r.bin),
      el('td', { class: 'mono', style: 'color:var(--faint)' }, expandBase(r.dec, 16)),
    )));
  };
  filter.addEventListener('input', debounce(draw, 140));
  draw();   // render the full table immediately, not only on first keystroke

  const sample = el('textarea', { class: 'textarea', placeholder: 'Type text to see each character broken down…', rows: 3 });
  const tableBox = el('div');

  const analyseNow = debounce(() => {
    if (!sample.value) { mount(tableBox); return; }
    const rows = analyse(sample.value, encodeChar);
    mount(tableBox, el('div', { class: 'table-scroll' }, el('table', {},
      el('thead', {}, el('tr', {},
        el('th', {}, 'Char'), el('th', {}, 'Code point'), el('th', {}, 'Hex bytes'),
        el('th', {}, 'Binary'), el('th', {}, 'Base-16 expansion'))),
      el('tbody', {}, ...rows.slice(0, 300).map((r) => el('tr', {},
        el('td', { class: 'cell-char' }, r.glyph === ' ' ? '␣' : r.glyph),
        el('td', { class: 'mono' }, `U+${r.cp.toString(16).toUpperCase().padStart(4, '0')}`),
        el('td', { class: 'mono' }, r.hex.join(' ')),
        el('td', { class: 'mono' }, r.bin.join(' ')),
        el('td', { class: 'mono', style: 'color:var(--muted)' }, r.hexMath)))))));
  }, 220);
  sample.addEventListener('input', analyseNow);

  return frag(
    crumbs(el('span', {}, 'ASCII')),
    el('section', { class: 'page-head' },
      el('h1', {}, 'ASCII table & byte breakdown'),
      el('p', {}, 'The full 0–127 table with positional expansions, plus a live analyser that shows exactly how each character becomes bytes.')),
    el('section', { class: 'panel' },
      el('h2', { class: 'panel-title' }, 'Character breakdown'),
      sample,
      el('div', { style: 'margin-top:12px' }, tableBox),
    ),
    el('section', { class: 'panel', style: 'margin-top:18px' },
      el('h2', { class: 'panel-title' }, 'ASCII 0–127'),
      el('div', { style: 'margin-bottom:12px' }, filter),
      el('div', { class: 'table-scroll' }, el('table', {},
        el('thead', {}, el('tr', {},
          el('th', {}, 'Dec'), el('th', {}, 'Char'), el('th', {}, 'Hex'),
          el('th', {}, 'Binary'), el('th', {}, '65 = 4·16 + 1 form'))),
        tbody)),
    ),
  );
}

/* ── base calculator landing ────────────────────────────────────────────── */

export function viewBase() {
  return frag(
    crumbs(el('span', {}, 'Bases')),
    el('section', { class: 'page-head' },
      el('h1', {}, 'Number bases'),
      el('p', {}, 'Exact arithmetic in bases 2 through 36, backed by BigInt — no rounding, no floating point surprises.')),
    el('div', { class: 'grid grid-2' },
      toolCard(TOOL_BY_ID['radix-calc']),
      toolCard(TOOL_BY_ID['roman']),
      toolCard(TOOL_BY_ID['number-words']),
    ),
  );
}

/* ── about ──────────────────────────────────────────────────────────────── */

export function viewAbout() {
  return frag(
    crumbs(el('span', {}, 'About')),
    el('section', { class: 'page-head' },
      el('h1', {}, 'HexKit'),
      el('p', {}, 'A fast, private, offline-first set of converters and calculators. Everything runs locally in your browser.')),
    el('section', { class: 'grid grid-2' },
      el('div', { class: 'panel' },
        el('h2', { class: 'panel-title' }, 'Privacy'),
        el('p', {}, 'There is no backend. Input never leaves the tab — you can verify it by going offline mid-conversion. Your theme and recent conversions live in localStorage and never leave the device.'),
      ),
      el('div', { class: 'panel' },
        el('h2', { class: 'panel-title' }, 'Keyboard'),
        el('p', { class: 'mono' }, 'Ctrl/⌘ + K — focus the converter\nCtrl/⌘ + Enter — copy output\nCtrl/⌘ + / — toggle theme\nEsc — close dialogs'),
      ),
      el('div', { class: 'panel', id: 'install' },
        el('h2', { class: 'panel-title' }, 'Install'),
        el('p', {}, 'Use the Install button in the header, or your browser’s “Add to Home Screen” / “Install app” menu. Once installed it launches full-screen and works with no connection.'),
      ),
      el('div', { class: 'panel' },
        el('h2', { class: 'panel-title' }, 'Correctness'),
        el('p', {}, 'Conversion factors and formulas are taken verbatim from the reference calculators, so results match the originals bit for bit. Base arithmetic uses BigInt to avoid floating-point drift.'),
      ),
    ),
  );
}

/* ── 404 ────────────────────────────────────────────────────────────────── */

export function notFound(message = 'That page does not exist.') {
  return frag(
    el('section', { class: 'page-head' },
      el('h1', {}, '404'),
      el('p', {}, message)),
    el('div', { class: 'grid grid-2' },
      el('a', { class: 'tool-card', href: '#/convert' }, el('h3', {}, 'Converter'), el('p', {}, 'Text ⇄ every base.')),
      el('a', { class: 'tool-card', href: '#/tools' }, el('h3', {}, 'Calculators'), el('p', {}, `${TOOLS.length} tools.`)),
    ),
  );
}
