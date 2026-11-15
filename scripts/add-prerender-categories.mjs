import fs from 'fs';

const path = 'scripts/prerender.mjs';
let s = fs.readFileSync(path, 'utf8');

if (s.includes('/* category pages */')) {
  console.log('already patched');
  process.exit(0);
}

const marker = `// sitemap.xml and robots.txt`;
if (!s.includes(marker)) throw new Error('marker not found');

const block = `/* category pages */

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

const WEB_TOOLS = [
  { slug: 'alarm-clock', title: 'Alarm Clock' }, { slug: 'bar-graph', title: 'Bar graph maker' }, { slug: 'battery', title: 'Battery charge manager' },
  { slug: 'calendar', title: 'Calendar' }, { slug: 'call-recorder', title: 'Call Recorder' }, { slug: 'camera', title: 'Camera online' },
  { slug: 'chart-maker', title: 'Chart online maker' }, { slug: 'click-counter', title: 'Click counter online' }, { slug: 'cps-test', title: 'CPS test' },
  { slug: 'countdown-timer', title: 'Countdown Timer' }, { slug: 'current-time', title: 'Current Time' }, { slug: 'flashlight', title: 'Flashlight online' },
  { slug: 'line-graph', title: 'Line graph maker' }, { slug: 'grocery-list', title: 'Online grocery list' }, { slug: 'mic-test', title: 'Mic test' },
  { slug: 'clock', title: 'Online clock' }, { slug: 'mirror', title: 'Online Mirror' }, { slug: 'notes', title: 'Online Notes' },
  { slug: 'pie-chart', title: 'Pie chart maker' }, { slug: 'scatter-plot', title: 'XY Scatter plot maker' }, { slug: 'scoreboard', title: 'Scoreboard online' },
  { slug: 'screen-recorder', title: 'Screen recorder online' }, { slug: 'screenshot', title: 'Online screenshot' }, { slug: 'speech-to-text', title: 'Speech to text' },
  { slug: 'stopwatch', title: 'Stopwatch' }, { slug: 'table-chart', title: 'Table chart maker' }, { slug: 'text-to-speech', title: 'Text to speech' },
  { slug: 'todays-date', title: "Today's Date" }, { slug: 'todo-list', title: 'To-Do List' }, { slug: 'tone-generator', title: 'Tone generator' },
  { slug: 'ruler-cm', title: 'Ruler (cm/mm) online' }, { slug: 'ruler-inch', title: 'Ruler (inch) online' }, { slug: 'voice-recorder', title: 'Voice recorder online' },
  { slug: 'webcam-test', title: 'Webcam test' },
];

const WEB_TOOLS_ALL = [
  ...WEB_TOOLS.map(t => ({ title: t.title, href: \`#/web-tools/\${t.slug}\` })),
  { title: 'Online Calculator', href: '#/tool/scientific-calc' },
  { title: 'Online Notepad', href: '#/notepad' },
  { title: 'Password generator', href: '#/tool/password' },
  { title: 'Random number generator', href: '#/tool/random' },
  { title: 'Text editor', href: '#/html-editor' },
];

{
  const body = \`
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><span class="crumb-current">Calculators</span></nav>
    <section class="page-head"><h1>Online Calculators</h1><p>Free online calculators organized by topic.</p></section>
    \${CALC_CATEGORIES.map(cat => {
      const items = TOOLS.filter(t => t.group === cat.id);
      if (!items.length) return '';
      return \`<section class="section"><div class="section-head"><h2>\${esc(cat.title)}</h2><a href="#/calc/\${esc(cat.id)}" style="font-size:14px">Open category →</a></div><ul class="link-list topic-list">\${items.map(t => \`<li><a href="#/tool/\${esc(t.id)}">\${esc(t.title)}</a></li>\`).join('')}</ul></section>\`;
    }).join('')}
  \`;
  PAGES.push({
    path: '/calc/index.html', hash: '/calc',
    title: 'Calculators - HexKit',
    description: 'Math, electrical, financial, health, time and other calculators organized by topic.',
    priority: '0.9',
    ld: graph([crumbsLd('/calc/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Calculators', href: '/calc/index.html' }])]),
    body,
  });
}

for (const cat of CALC_CATEGORIES) {
  const items = TOOLS.filter(t => t.group === cat.id);
  if (!items.length) continue;
  const body = \`
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><a href="#/calc">Calculators</a><span class="crumb-sep">›</span><span class="crumb-current">\${esc(cat.title)}</span></nav>
    <section class="page-head"><h1>\${esc(cat.title)}</h1><p>\${esc(cat.desc)}</p></section>
    <section class="section"><div class="grid grid-2">\${items.map(t => \`<a class="tool-card" href="#/tool/\${esc(t.id)}"><span class="badge">\${esc(cat.title)}</span><h3>\${esc(t.title)}</h3><p>\${esc(t.blurb || '')}</p></a>\`).join('')}</div></section>
  \`;
  PAGES.push({
    path: \`/calc/\${cat.id}/index.html\`, hash: \`/calc/\${cat.id}\`,
    title: \`\${cat.title} - HexKit\`,
    description: cat.desc,
    priority: '0.8',
    ld: graph([crumbsLd(\`/calc/\${cat.id}/index.html\`, [{ name: 'Home', href: '/index.html' }, { name: 'Calculators', href: '/calc/index.html' }, { name: cat.title, href: \`/calc/\${cat.id}/index.html\` }])]),
    body,
  });
}

{
  const body = \`
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><span class="crumb-current">Conversion</span></nav>
    <section class="page-head"><h1>Unit Conversion</h1><p>Online unit converters organized by topic.</p></section>
    <section class="section"><div class="section-head"><h2>Conversion categories</h2></div><ul class="link-list topic-list">\${CONVERSION_CATEGORIES.map(c => \`<li><a href="#/units/\${esc(c.id)}">\${esc(c.title)}</a></li>\`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Number & text conversion</h2></div><ul class="link-list topic-list"><li><a href="#/convert">Text, hex, binary, decimal, octal, Base64 converter</a></li><li><a href="#/ascii">ASCII table</a></li><li><a href="#/base">Number base converter</a></li></ul></section>
  \`;
  PAGES.push({
    path: '/conversion/index.html', hash: '/conversion',
    title: 'Conversion - HexKit',
    description: 'Length, weight, temperature, area, volume, speed, power, energy and more unit converters.',
    priority: '0.9',
    ld: graph([crumbsLd('/conversion/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Conversion', href: '/conversion/index.html' }])]),
    body,
  });
}

{
  const body = \`
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><span class="crumb-current">Tools</span></nav>
    <section class="page-head"><h1>Online Tools</h1><p>Free browser-based online tools.</p></section>
    <section class="section"><ul class="link-list topic-list">\${WEB_TOOLS_ALL.map(t => \`<li><a href="\${esc(t.href)}">\${esc(t.title)}</a></li>\`).join('')}</ul></section>
  \`;
  PAGES.push({
    path: '/web-tools/index.html', hash: '/web-tools',
    title: 'Online Tools - HexKit',
    description: 'Alarm clock, stopwatch, timer, notepad, calculator, password generator, charts and more online tools.',
    priority: '0.9',
    ld: graph([crumbsLd('/web-tools/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Tools', href: '/web-tools/index.html' }])]),
    body,
  });
}

for (const t of WEB_TOOLS) {
  const body = \`
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><a href="#/web-tools">Tools</a><span class="crumb-sep">›</span><span class="crumb-current">\${esc(t.title)}</span></nav>
    <section class="page-head"><h1>\${esc(t.title)}</h1><p>\${esc(t.title)} - online tool. This browser-based tool runs locally in your browser.</p></section>
    <section class="panel"><h2>About this tool</h2><p>Use \${esc(t.title)} in the interactive app. Some features may require browser permissions or device capabilities.</p><p><a class="btn btn-primary" href="#/web-tools/\${esc(t.slug)}">Open \${esc(t.title)}</a></p></section>
  \`;
  PAGES.push({
    path: \`/web-tools/\${t.slug}/index.html\`, hash: \`/web-tools/\${t.slug}\`,
    title: \`\${t.title} - Online Tools - HexKit\`,
    description: \`\${t.title} online tool.\`,
    priority: '0.7',
    ld: graph([crumbsLd(\`/web-tools/\${t.slug}/index.html\`, [{ name: 'Home', href: '/index.html' }, { name: 'Tools', href: '/web-tools/index.html' }, { name: t.title, href: \`/web-tools/\${t.slug}/index.html\` }])]),
    body,
  });
}

{
  const mathTools = TOOLS.filter(t => t.group === 'math' || t.group === 'number');
  const mathArticles = Object.entries(ARTICLES).filter(([s,a]) => /math|algebra|calculus|exponent|log|quadratic|trig|number|fraction|percent|ratio|root|factor|prime|geometry|arithmetic/i.test(s + ' ' + a.title + ' ' + (a.kicker||'')));
  const body = \`
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><span class="crumb-current">Math</span></nav>
    <section class="page-head"><h1>Math</h1><p>Math calculators, formulas, and reference - organized by topic.</p></section>
    <section class="section"><div class="section-head"><h2>Math calculators</h2></div><ul class="link-list topic-list">\${mathTools.map(t => \`<li><a href="#/tool/\${esc(t.id)}">\${esc(t.title)}</a></li>\`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Math reference & formulas</h2></div><ul class="link-list topic-list">\${mathArticles.map(([slug,a]) => \`<li><a href="#/read/\${esc(slug)}">\${esc(a.title)}</a></li>\`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Reference tables</h2></div><ul class="link-list topic-list"><li><a href="#/tables">Math and reference tables</a></li></ul></section>
  \`;
  PAGES.push({
    path: '/math/index.html', hash: '/math',
    title: 'Math - HexKit',
    description: 'Math calculators, formulas and reference.',
    priority: '0.8',
    ld: graph([crumbsLd('/math/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Math', href: '/math/index.html' }])]),
    body,
  });
}

{
  const elecTools = TOOLS.filter(t => t.group === 'electrical' || t.group === 'wire');
  const elecArticles = Object.entries(ARTICLES).filter(([s,a]) => /electric|volt|current|ohm|amp|watt|circuit|resist|capacitor|inductor|power|kirchhoff|coulomb|kva|kwh|joule/i.test(s + ' ' + a.title + ' ' + (a.kicker||'')));
  const elecUnits = ['voltage','current','resistance','power','energy','charge','capacitance','inductance','frequency'];
  const body = \`
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><span class="crumb-current">Electricity</span></nav>
    <section class="page-head"><h1>Electricity & Electronics</h1><p>Electrical calculators, formulas, symbols, and reference - organized by topic.</p></section>
    <section class="section"><div class="section-head"><h2>Electrical calculators</h2></div><ul class="link-list topic-list">\${elecTools.map(t => \`<li><a href="#/tool/\${esc(t.id)}">\${esc(t.title)}</a></li>\`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Electrical unit conversions</h2></div><ul class="link-list topic-list">\${elecUnits.filter(id=>FAMILIES[id]).map(id => \`<li><a href="#/units/\${esc(id)}">\${esc(FAMILIES[id].title)} conversion</a></li>\`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Electrical articles & formulas</h2></div><ul class="link-list topic-list">\${elecArticles.map(([slug,a]) => \`<li><a href="#/read/\${esc(slug)}">\${esc(a.title)}</a></li>\`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Electrical reference</h2></div><ul class="link-list topic-list"><li><a href="#/symbols">Electrical & electronic symbols</a></li><li><a href="#/glossary">Electrical glossary & definitions</a></li><li><a href="#/tables">Reference tables (resistor colors, wire gauge, etc.)</a></li></ul></section>
  \`;
  PAGES.push({
    path: '/electricity/index.html', hash: '/electricity',
    title: 'Electricity - HexKit',
    description: 'Electrical calculators, unit conversions, formulas, symbols and reference.',
    priority: '0.8',
    ld: graph([crumbsLd('/electricity/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Electricity', href: '/electricity/index.html' }])]),
    body,
  });
}

${marker}
`;

s = s.replace(marker, block);
fs.writeFileSync(path, s);
console.log('patched');
