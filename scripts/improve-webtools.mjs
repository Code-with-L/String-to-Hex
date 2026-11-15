import fs from 'fs';

function escRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}

// SPA content.js
{
  const p = 'js/ui/content.js';
  let s = fs.readFileSync(p, 'utf8');
  const old = `export const WEB_TOOLS = [
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

export function viewWebTools(route) {
  const sub = route?.segments?.[1];
  if (sub) return viewWebToolPage(sub);
  const node = frag(
    crumbs({ label: 'Web Tools' }),
    el('section', { class: 'page-head' }, el('h1', {}, 'Online Tools'), el('p', {}, 'Free browser-based online tools.')),
    el('section', { class: 'section' }, linkList(WEB_TOOLS))
  );
  node.pageTitle = 'Online Tools - HexKit';
  node.pageDescription = 'Alarm clock, stopwatch, timer, notepad, calculator, password generator, charts and more online tools.';
  return node;
}`;

  const rep = `export const WEB_TOOLS = [
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
      el('ul', { class: 'link-list topic-list' }, ...groups.map(g => el('li', {}, el('a', { href: '#wt-' + g.id }, g.title), \` (\${g.tools.length})\`))),
    ),
    ...groups.map(g => el('section', { class: 'section', id: 'wt-' + g.id },
      el('div', { class: 'section-head' }, el('h2', {}, g.title)),
      linkList(g.tools)
    )),
  );
  node.pageTitle = 'Online Tools - HexKit';
  node.pageDescription = 'Alarm clock, stopwatch, timer, notepad, calculator, password generator, charts and more online tools organized by topic.';
  return node;
}`;

  if (!s.includes(old)) throw new Error('SPA webtools block nf');
  s = s.replace(old, rep);
  fs.writeFileSync(p, s);
  console.log('SPA webtools updated');
}

// prerender
{
  const p = 'scripts/prerender.mjs';
  let s = fs.readFileSync(p, 'utf8');

  // replace WEB_TOOLS_ALL and web-tools index/per-tool generation
  const start = "const WEB_TOOLS_ALL = [";
  const end = "\nfor (const t of WEB_TOOLS) {";
  const i = s.indexOf(start);
  const j = s.indexOf(end, i);
  if (i < 0 || j < 0) throw new Error('prerender webtools nf ' + i + ' ' + j);

  const rep = `const WEB_TOOLS_ALL = [
  ...WEB_TOOLS.map(t => ({ title: t.title, href: \`#/web-tools/\${t.slug}\` })),
  { title: 'Online Calculator', href: '#/tool/scientific-calc' },
  { title: 'Online Notepad', href: '#/notepad' },
  { title: 'Password generator', href: '#/tool/password' },
  { title: 'Random number generator', href: '#/tool/random' },
  { title: 'Text editor', href: '#/html-editor' },
];
const WEB_TOOL_GROUPS = [
  { id: 'time', title: 'Time & date', items: ['Alarm Clock','Countdown Timer','Current Time','Online clock','Stopwatch',"Today's Date"] },
  { id: 'text', title: 'Notes & text', items: ['Online Notepad','Online Notes','Online grocery list','To-Do List','Text editor'] },
  { id: 'charts', title: 'Charts & graphs', items: ['Bar graph maker','Line graph maker','Pie chart maker','XY Scatter plot maker','Table chart maker','Chart online maker'] },
  { id: 'counters', title: 'Counters & tests', items: ['Click counter online','CPS test','Scoreboard online'] },
  { id: 'numbers', title: 'Calculators & generators', items: ['Online Calculator','Password generator','Random number generator'] },
  { id: 'media', title: 'Camera, mic & recording', items: ['Camera online','Online Mirror','Webcam test','Mic test','Voice recorder online','Call Recorder','Screen recorder online','Online screenshot'] },
  { id: 'audio', title: 'Audio & speech', items: ['Speech to text','Text to speech','Tone generator'] },
  { id: 'device', title: 'Device & measurement', items: ['Battery charge manager','Flashlight online','Ruler (cm/mm) online','Ruler (inch) online','Calendar'] },
];
function webToolItem(title){ return WEB_TOOLS_ALL.find(t => t.title === title); }

{
  const groups = WEB_TOOL_GROUPS.map(g => ({ ...g, tools: g.items.map(webToolItem).filter(Boolean) })).filter(g => g.tools.length);
  const body = (up) => \`
    <nav class="crumbs" aria-label="Breadcrumb"><a href="\${up}#/">Home</a><span class="crumb-sep">›</span><span class="crumb-current">Web Tools</span></nav>
    <section class="page-head"><h1>Online Tools</h1><p>Free browser-based online tools, organized by topic.</p></section>
    <section class="section"><div class="section-head"><h2>Contents</h2></div><ul class="link-list topic-list">\${groups.map(g => \`<li><a href="#wt-\${esc(g.id)}">\${esc(g.title)}</a> (\${g.tools.length})</li>\`).join('')}</ul></section>
    \${groups.map(g => \`<section class="section" id="wt-\${esc(g.id)}"><div class="section-head"><h2>\${esc(g.title)}</h2></div><ul class="link-list topic-list">\${g.tools.map(t => \`<li><a href="\${esc(t.href)}">\${esc(t.title)}</a></li>\`).join('')}</ul></section>\`).join('')}
  \`;
  PAGES.push({
    path: '/web-tools/index.html', hash: '/web-tools',
    title: 'Online Tools - HexKit',
    description: 'Alarm clock, stopwatch, timer, notepad, calculator, password generator, charts and more online tools organized by topic.',
    priority: '0.9',
    jsonLd: graph([crumbsLd('/web-tools/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Web Tools', href: '/web-tools/index.html' }])]),
    body,
  });
}
`;

  s = s.slice(0, i) + rep + s.slice(j);

  // per-tool crumbs
  s = s.replace(
    "    <nav class=\"crumbs\" aria-label=\"Breadcrumb\"><a href=\"#/\">Home</a><span class=\"crumb-sep\">></span><a href=\"#/web-tools\">Tools</a><span class=\"crumb-sep\">></span><span class=\"crumb-current\">${esc(t.title)}</span></nav>",
    "    <nav class=\"crumbs\" aria-label=\"Breadcrumb\"><a href=\"${up}#/\">Home</a><span class=\"crumb-sep\">›</span><a href=\"${up}#/web-tools\">Web Tools</a><span class=\"crumb-sep\">›</span><span class=\"crumb-current\">${esc(t.title)}</span></nav>"
  );
  s = s.replace(
    "    jsonLd: graph([crumbsLd(`/web-tools/${t.slug}/index.html`, [{ name: 'Home', href: '/index.html' }, { name: 'Tools', href: '/web-tools/index.html' }, { name: t.title, href: `/web-tools/${t.slug}/index.html` }])]),",
    "    jsonLd: graph([crumbsLd(`/web-tools/${t.slug}/index.html`, [{ name: 'Home', href: '/index.html' }, { name: 'Web Tools', href: '/web-tools/index.html' }, { name: t.title, href: `/web-tools/${t.slug}/index.html` }])]),"
  );

  fs.writeFileSync(p, s);
  console.log('prerender webtools updated');
}
