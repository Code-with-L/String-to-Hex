import fs from 'fs';

let c = fs.readFileSync('js/ui/content.js', 'utf8');
const marker = '/* == RapidTables-style category pages == */';
const idx = c.indexOf(marker);
if (idx < 0) throw new Error('marker not found');
const head = c.slice(0, idx);
const replacement = String.raw`/* == RapidTables-style category pages == */

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

export function viewCalc(route) {
  const sub = route?.segments?.[1];
  if (sub) {
    const cat = CALC_CATEGORIES.find((x) => x.id === sub);
    const items = byGroup(sub);
    if (!cat) return notFoundRef(\`Calculator category "\${sub}" not found.\`);
    const node = frag(
      crumbs({ label: 'Calculators', href: '#/calc' }, { label: cat.title }),
      el('section', { class: 'page-head' }, el('h1', {}, cat.title), el('p', {}, cat.desc)),
      el('section', { class: 'section' }, el('div', { class: 'grid grid-2' }, ...items.map(toolCard)))
    );
    node.pageTitle = \`\${cat.title} - HexKit\`;
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
        el('div', { class: 'section-head' }, el('h2', {}, cat.title), el('a', { href: \`#/calc/\${cat.id}\`, style: 'font-size:14px' }, 'Open category →')),
        linkList(items.map((t) => ({ href: \`#/tool/\${t.id}\`, title: t.title })))
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
    el('section', { class: 'section' }, el('div', { class: 'section-head' }, el('h2', {}, 'Conversion categories' }), linkList(CONVERSION_CATEGORIES.map((c) => ({ href: \`#/units/\${c.id}\`, title: c.title })))),
    el('section', { class: 'section' }, el('div', { class: 'section-head' }, el('h2', {}, 'Number & text conversion' }), linkList([
      { href: '#/convert', title: 'Text, hex, binary, decimal, octal, Base64 converter' },
      { href: '#/ascii', title: 'ASCII table' },
      { href: '#/base', title: 'Number base converter' },
    ]))
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
  { title: 'Password generator', href: '#/tool/password-generator' },
  { title: 'Pie chart maker', href: '#/web-tools/pie-chart' },
  { title: 'Random number generator', href: '#/tool/random-number' },
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

export function viewWebTools(route) {
  const sub = route?.segments?.[1];
  if (sub) return viewWebToolPage(sub);
  const node = frag(
    crumbs({ label: 'Tools' }),
    el('section', { class: 'page-head' }, el('h1', {}, 'Online Tools'), el('p', {}, 'Free browser-based online tools.')),
    el('section', { class: 'section' }, linkList(WEB_TOOLS))
  );
  node.pageTitle = 'Online Tools - HexKit';
  node.pageDescription = 'Alarm clock, stopwatch, timer, notepad, calculator, password generator, charts and more online tools.';
  return node;
}

function viewWebToolPage(slug) {
  const item = WEB_TOOLS.find((t) => t.href === \`#/web-tools/\${slug}\` || t.href.endsWith('/' + slug));
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
    crumbs({ label: 'Tools', href: '#/web-tools' }, { label: title }),
    el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, req ? \`\${title} is an online tool. Features may require \${req} and browser permissions.\` : \`\${title} - online tool.\`)),
    el('section', { class: 'panel' },
      el('h2', {}, 'About this tool'),
      el('p', {}, \`This page provides the \${title} online tool in the Web Tools topic. Use your browser to access this utility.\`),
      req ? el('p', {}, \`Note: \${req} may be required depending on your device and browser.\`) : null,
      el('div', { class: 'btn-row', style: 'margin-top:14px' },
        el('a', { class: 'btn btn-primary', href: '#/web-tools' }, 'All online tools'),
        el('a', { class: 'btn', href: '#/calc' }, 'Calculators'),
        el('a', { class: 'btn', href: '#/conversion' }, 'Conversion')
      )
    )
  );
  node.pageTitle = \`\${title} - Online Tools - HexKit\`;
  node.pageDescription = \`\${title} online tool.\`;
  return node;
}

function webStopwatch(title) {
  let running = false, start = 0, elapsed = 0, raf = null;
  const disp = el('div', { class: 'big-display mono', style: 'font-size:48px;margin:16px 0' }, '00:00:00.000');
  const fmt = (ms) => { const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60, x = ms % 1000; return \`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}:\${String(s).padStart(2, '0')}.\${String(x).padStart(3, '0')}\`; };
  const tick = () => { disp.textContent = fmt(elapsed + (running ? Date.now() - start : 0)); if (running) raf = requestAnimationFrame(tick); };
  const startBtn = el('button', { class: 'btn btn-primary', type: 'button' }, 'Start');
  const lapBtn = el('button', { class: 'btn', type: 'button' }, 'Lap');
  const resetBtn = el('button', { class: 'btn', type: 'button' }, 'Reset');
  const laps = el('ol', { class: 'list-plain', style: 'margin-top:12px' });
  startBtn.onclick = () => { if (!running) { running = true; start = Date.now(); startBtn.textContent = 'Pause'; tick(); } else { running = false; elapsed += Date.now() - start; startBtn.textContent = 'Start'; if (raf) cancelAnimationFrame(raf); tick(); } };
  resetBtn.onclick = () => { running = false; elapsed = 0; startBtn.textContent = 'Start'; if (raf) cancelAnimationFrame(raf); disp.textContent = '00:00:00.000'; laps.innerHTML = ''; };
  lapBtn.onclick = () => { laps.prepend(el('li', { class: 'mono' }, fmt(elapsed + (running ? Date.now() - start : 0)))); };
  const node = frag(crumbs({ label: 'Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, 'Measure elapsed time in your browser.')), el('section', { class: 'panel' }, disp, el('div', { class: 'btn-row' }, startBtn, lapBtn, resetBtn), laps));
  node.pageTitle = \`\${title} - Online Tools - HexKit\`; node.pageDescription = 'Online stopwatch tool.'; return node;
}

function webCountdown(title) {
  const minI = el('input', { type: 'number', min: '0', value: '5', class: 'input' });
  const secI = el('input', { type: 'number', min: '0', max: '59', value: '0', class: 'input' });
  const disp = el('div', { class: 'big-display mono', style: 'font-size:48px;margin:16px 0' }, '05:00');
  let remain = 300000, timer = null, end = 0;
  const fmt = (ms) => { ms = Math.max(0, ms); const m = Math.floor(ms / 60000), s = Math.floor(ms / 1000) % 60; return \`\${String(m).padStart(2, '0')}:\${String(s).padStart(2, '0')}\`; };
  const render = () => { disp.textContent = fmt(remain); };
  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  const startBtn = el('button', { class: 'btn btn-primary', type: 'button' }, 'Start');
  startBtn.onclick = () => { if (timer) { stop(); startBtn.textContent = 'Start'; return; } remain = ((+minI.value || 0) * 60 + (+secI.value || 0)) * 1000; end = Date.now() + remain; startBtn.textContent = 'Pause'; timer = setInterval(() => { remain = end - Date.now(); if (remain <= 0) { remain = 0; stop(); startBtn.textContent = 'Start'; try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch {} } render(); }, 250); };
  const resetBtn = el('button', { class: 'btn', type: 'button', onclick: () => { stop(); startBtn.textContent = 'Start'; remain = ((+minI.value || 0) * 60 + (+secI.value || 0)) * 1000; render(); } }, 'Reset');
  render();
  const node = frag(crumbs({ label: 'Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, 'Countdown timer in your browser.')), el('section', { class: 'panel' }, el('div', { style: 'display:flex;gap:8px;align-items:center;flex-wrap:wrap' }, el('label', {}, 'Minutes ', minI), el('label', {}, 'Seconds ', secI)), disp, el('div', { class: 'btn-row' }, startBtn, resetBtn)));
  node.pageTitle = \`\${title} - Online Tools - HexKit\`; node.pageDescription = 'Online countdown timer.'; return node;
}

function webClock(title, showDate) {
  const disp = el('div', { class: 'big-display mono', style: 'font-size:48px;margin:16px 0' }, '');
  const sub = el('div', { style: 'color:var(--ink-dim)' }, '');
  const tick = () => { const d = new Date(); disp.textContent = d.toLocaleTimeString(); if (showDate) sub.textContent = d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); };
  tick(); setInterval(tick, 1000);
  const node = frag(crumbs({ label: 'Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, 'Current local time.')), el('section', { class: 'panel' }, disp, sub));
  node.pageTitle = \`\${title} - Online Tools - HexKit\`; node.pageDescription = 'Online clock showing current time.'; return node;
}

function webToday(title) {
  const d = new Date();
  const node = frag(crumbs({ label: 'Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))), el('section', { class: 'panel' }, el('p', {}, 'ISO date: ', el('code', {}, d.toISOString().slice(0, 10))), el('p', {}, 'Unix time (ms): ', el('code', {}, String(d.getTime())))));
  node.pageTitle = \`\${title} - Online Tools - HexKit\`; node.pageDescription = "Today's date."; return node;
}

function viewNotepadLike(title, key, desc) {
  const storeKey = 'hexkit.web.' + key;
  const ta = el('textarea', { class: 'textarea', style: 'min-height:40vh', placeholder: 'Start typing...' });
  try { ta.value = localStorage.getItem(storeKey) || ''; } catch {}
  ta.addEventListener('input', () => { try { localStorage.setItem(storeKey, ta.value); } catch {} });
  const node = frag(crumbs({ label: 'Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, desc)), el('section', { class: 'panel' }, ta));
  node.pageTitle = \`\${title} - Online Tools - HexKit\`; node.pageDescription = desc; return node;
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
  const node = frag(crumbs({ label: 'Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, desc)), el('section', { class: 'panel' }, el('div', { style: 'display:flex;gap:8px' }, input, addBtn), list));
  node.pageTitle = \`\${title} - Online Tools - HexKit\`; node.pageDescription = desc; return node;
}

function webClickCounter(title, cps) {
  let count = 0, running = false, timer = null, left = 5;
  const disp = el('div', { class: 'big-display mono', style: 'font-size:48px;margin:16px 0' }, '0');
  const info = el('div', { style: 'color:var(--ink-dim)' }, cps ? 'Click as fast as you can for 5 seconds.' : 'Click to count.');
  const btn = el('button', { class: 'btn btn-primary', type: 'button', style: 'padding:16px 24px;font-size:18px' }, cps ? 'Click to start' : 'Click');
  const reset = el('button', { class: 'btn', type: 'button' }, 'Reset');
  btn.onclick = () => { if (cps) { if (!running) { running = true; count = 0; left = 5; disp.textContent = '0'; timer = setInterval(() => { left -= 1; info.textContent = \`Time left: \${left}s\`; if (left <= 0) { clearInterval(timer); running = false; info.textContent = \`Result: \${(count / 5).toFixed(2)} CPS (\${count} clicks)\`; btn.textContent = 'Try again'; } }, 1000); btn.textContent = 'Click!'; } count++; disp.textContent = String(count); } else { count++; disp.textContent = String(count); } };
  reset.onclick = () => { count = 0; running = false; if (timer) clearInterval(timer); disp.textContent = '0'; info.textContent = cps ? 'Click as fast as you can for 5 seconds.' : 'Click to count.'; btn.textContent = cps ? 'Click to start' : 'Click'; };
  const node = frag(crumbs({ label: 'Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, info)), el('section', { class: 'panel' }, disp, el('div', { class: 'btn-row' }, btn, reset)));
  node.pageTitle = \`\${title} - Online Tools - HexKit\`; node.pageDescription = title + ' online tool.'; return node;
}

function webCalendar(title) {
  const d = new Date(); const y = d.getFullYear(), m = d.getMonth();
  const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
  const head = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cells = []; for (let i = 0; i < first; i++) cells.push(el('div', { class: 'cal-cell cal-empty' }, ''));
  for (let day = 1; day <= days; day++) cells.push(el('div', { class: 'cal-cell' + (day === d.getDate() ? ' cal-today' : ''), style: day === d.getDate() ? 'font-weight:700' : '' }, String(day)));
  const grid = el('div', { style: 'display:grid;grid-template-columns:repeat(7,1fr);gap:4px;max-width:420px' }, ...head.map((h) => el('div', { style: 'font-weight:600;text-align:center' }, h)), ...cells);
  const node = frag(crumbs({ label: 'Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }))), el('section', { class: 'panel' }, grid));
  node.pageTitle = \`\${title} - Online Tools - HexKit\`; node.pageDescription = 'Online calendar.'; return node;
}

function webScoreboard(title) {
  let a = 0, b = 0; const sa = el('div', { class: 'big-display mono', style: 'font-size:48px' }, '0'); const sb = el('div', { class: 'big-display mono', style: 'font-size:48px' }, '0');
  const mk = (label, get, set, dispEl) => el('div', { class: 'panel', style: 'text-align:center' }, el('h3', {}, label), dispEl, el('div', { class: 'btn-row', style: 'justify-content:center' }, el('button', { class: 'btn', type: 'button', onclick: () => { set(get() - 1); dispEl.textContent = String(get()); } }, '-1'), el('button', { class: 'btn btn-primary', type: 'button', onclick: () => { set(get() + 1); dispEl.textContent = String(get()); } }, '+1')));
  const node = frag(crumbs({ label: 'Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, 'Simple online scoreboard.')), el('div', { class: 'grid grid-2' }, mk('Team A', () => a, (v) => a = Math.max(0, v), sa), mk('Team B', () => b, (v) => b = Math.max(0, v), sb)), el('div', { class: 'btn-row', style: 'margin-top:12px' }, el('button', { class: 'btn', type: 'button', onclick: () => { a = 0; b = 0; sa.textContent = '0'; sb.textContent = '0'; } }, 'Reset')));
  node.pageTitle = \`\${title} - Online Tools - HexKit\`; node.pageDescription = 'Online scoreboard.'; return node;
}

function webAlarm(title) {
  const timeI = el('input', { type: 'time', class: 'input' });
  const msg = el('div', { style: 'margin-top:8px;color:var(--ink-dim)' }, 'Set a time for the alarm.');
  let timer = null;
  const setBtn = el('button', { class: 'btn btn-primary', type: 'button', onclick: () => {
    if (timer) clearInterval(timer);
    const val = timeI.value; if (!val) { msg.textContent = 'Choose a time.'; return; }
    msg.textContent = 'Alarm set for ' + val + '. Keep this tab open.';
    timer = setInterval(() => { const d = new Date(); const now = \`\${String(d.getHours()).padStart(2, '0')}:\${String(d.getMinutes()).padStart(2, '0')}\`; if (now === val) { clearInterval(timer); timer = null; msg.textContent = 'Alarm! ' + val; try { navigator.vibrate && navigator.vibrate([300, 100, 300, 100, 300]); } catch {} alert('Alarm: ' + val); } }, 1000);
  } }, 'Set alarm');
  const clearBtn = el('button', { class: 'btn', type: 'button', onclick: () => { if (timer) clearInterval(timer); timer = null; msg.textContent = 'Alarm cleared.'; } }, 'Clear');
  const node = frag(crumbs({ label: 'Tools', href: '#/web-tools' }, { label: title }), el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, 'Set an alarm in your browser. Keep this tab open for the alarm to trigger.')), el('section', { class: 'panel' }, el('label', {}, 'Alarm time ', timeI), el('div', { class: 'btn-row', style: 'margin-top:12px' }, setBtn, clearBtn), msg));
  node.pageTitle = \`\${title} - Online Tools - HexKit\`; node.pageDescription = 'Online alarm clock.'; return node;
}

export function viewMathRef() {
  const mathTools = TOOLS.filter((t) => t.group === 'math' || t.group === 'number');
  const mathArticles = Object.entries(ARTICLES).filter(([s, a]) => /math|algebra|calculus|exponent|log|quadratic|trig|number|fraction|percent|ratio|root|factor|prime|geometry|arithmetic/i.test(s + ' ' + a.title + ' ' + (a.kicker || '')));
  const node = frag(
    crumbs({ label: 'Math' }),
    el('section', { class: 'page-head' }, el('h1', {}, 'Math'), el('p', {}, 'Math calculators, formulas, and reference - organized by topic.')),
    el('section', { class: 'section' }, el('div', { class: 'section-head' }, el('h2', {}, 'Math calculators' }), linkList(mathTools.map((t) => ({ href: \`#/tool/\${t.id}\`, title: t.title })))),
    el('section', { class: 'section' }, el('div', { class: 'section-head' }, el('h2', {}, 'Math reference & formulas' }), linkList(mathArticles.map(([slug, a]) => ({ href: \`#/read/\${slug}\`, title: a.title })))),
    el('section', { class: 'section' }, el('div', { class: 'section-head' }, el('h2', {}, 'Reference tables' }), linkList([{ href: '#/tables', title: 'Math and reference tables' }]))
  );
  node.pageTitle = 'Math - HexKit'; node.pageDescription = 'Math calculators, formulas and reference.'; return node;
}

export function viewElectricityRef() {
  const elecTools = TOOLS.filter((t) => t.group === 'electrical' || t.group === 'wire');
  const elecArticles = Object.entries(ARTICLES).filter(([s, a]) => /electric|volt|current|ohm|amp|watt|circuit|resist|capacitor|inductor|power|kirchhoff|coulomb|kva|kwh|joule/i.test(s + ' ' + a.title + ' ' + (a.kicker || '')));
  const elecUnits = ['voltage', 'current', 'resistance', 'power', 'energy', 'charge', 'capacitance', 'inductance', 'frequency'];
  const node = frag(
    crumbs({ label: 'Electricity' }),
    el('section', { class: 'page-head' }, el('h1', {}, 'Electricity & Electronics'), el('p', {}, 'Electrical calculators, formulas, symbols, and reference - organized by topic.')),
    el('section', { class: 'section' }, el('div', { class: 'section-head' }, el('h2', {}, 'Electrical calculators' }), linkList(elecTools.map((t) => ({ href: \`#/tool/\${t.id}\`, title: t.title })))),
    el('section', { class: 'section' }, el('div', { class: 'section-head' }, el('h2', {}, 'Electrical unit conversions' }), linkList(elecUnits.filter((id) => FAMILIES[id]).map((id) => ({ href: \`#/units/\${id}\`, title: FAMILIES[id].title + ' conversion' })))),
    el('section', { class: 'section' }, el('div', { class: 'section-head' }, el('h2', {}, 'Electrical articles & formulas' }), linkList(elecArticles.map(([slug, a]) => ({ href: \`#/read/\${slug}\`, title: a.title })))),
    el('section', { class: 'section' }, el('div', { class: 'section-head' }, el('h2', {}, 'Electrical reference' }), linkList([
      { href: '#/symbols', title: 'Electrical & electronic symbols' },
      { href: '#/glossary', title: 'Electrical glossary & definitions' },
      { href: '#/tables', title: 'Reference tables (resistor colors, wire gauge, etc.)' },
    ]))
  );
  node.pageTitle = 'Electricity - HexKit'; node.pageDescription = 'Electrical calculators, unit conversions, formulas, symbols and reference.'; return node;
}
`;
fs.writeFileSync('js/ui/content.js', head + replacement + '\n');
console.log('replaced');