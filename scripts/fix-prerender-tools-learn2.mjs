import fs from 'fs';

const path = 'scripts/prerender.mjs';
let s = fs.readFileSync(path, 'utf8');

const toolsStart = "/* tool index */\nPAGES.push({\n  path: '/tools/index.html',";
const toolsEnd = "\n/* one page per tool */";
const ti = s.indexOf(toolsStart);
const tj = s.indexOf(toolsEnd, ti);
if (ti < 0 || tj < 0) throw new Error('tools markers not found ' + ti + ' ' + tj);

const toolsReplacement = `/* tool index */
PAGES.push({
  path: '/tools/index.html',
  hash: '/tools',
  title: 'Calculators - HexKit',
  description: 'Math, electrical, financial, health, time and other calculators organized by topic.',
  priority: '0.9',
  jsonLd: graph([crumbsLd('/tools/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Calculators', href: '/tools/index.html' }])]),
  body: (up) => \`    \${nav(up, [{ label: 'Calculators' }])}
    <header class="page-head"><h1>Online Calculators</h1><p>Free online calculators organized by topic. Each tool runs in your browser and works offline.</p></header>
    \${CALC_CATEGORIES.map(cat => {
      const items = TOOLS.filter(t => t.group === cat.id);
      if (!items.length) return '';
      return \`<section class="section"><div class="section-head"><h2>\${esc(cat.title)}</h2><a href="\${up}calc/\${esc(cat.id)}/" style="font-size:14px">Open category →</a></div><ul class="link-list topic-list">\${items.map(t => \`<li><a href="\${up}tool/\${esc(t.id)}/">\${esc(t.title)}</a> — \${esc(t.blurb || '')}</li>\`).join('')}</ul></section>\`;
    }).join('')}\`,
});
`;

s = s.slice(0, ti) + toolsReplacement + s.slice(tj);

const learnStart = "/* reference index */\nPAGES.push({\n  path: '/learn/index.html',";
const learnEnd = "\n/* one page per article";
const li = s.indexOf(learnStart);
const lj = s.indexOf(learnEnd, li);
if (li < 0 || lj < 0) throw new Error('learn markers not found ' + li + ' ' + lj);

const learnReplacement = `/* reference index */
PAGES.push({
  path: '/learn/index.html',
  hash: '/learn',
  title: 'Reference - HexKit',
  description: 'Articles, formulas, glossary, symbols, tables and encoding reference organized by topic.',
  priority: '0.9',
  jsonLd: graph([crumbsLd('/learn/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Reference', href: '/learn/index.html' }])]),
  body: (up) => {
    const mathArticles = Object.entries(ARTICLES).filter(([slug, a]) => /math|algebra|calculus|exponent|log|quadratic|trig|number|fraction|percent|ratio|root|factor|prime|geometry|arithmetic/i.test(slug + ' ' + a.title + ' ' + (a.kicker || '')));
    const elecArticles = Object.entries(ARTICLES).filter(([slug, a]) => /electric|volt|current|ohm|amp|watt|circuit|resist|capacitor|inductor|power|kirchhoff|coulomb|kva|kwh|joule/i.test(slug + ' ' + a.title + ' ' + (a.kicker || '')));
    const otherArticles = Object.entries(ARTICLES).filter(([slug]) => !mathArticles.some(([x]) => x === slug) && !elecArticles.some(([x]) => x === slug));
    return \`    \${nav(up, [{ label: 'Reference' }])}
    <header class="page-head"><h1>Reference library</h1><p>Articles, formulas, glossary, symbols, tables and encoding reference — organized by topic.</p></header>
    <section class="section"><div class="section-head"><h2>Reference topics</h2></div><div class="grid grid-2">
      <a class="tool-card" href="\${up}math/"><h3>Math</h3><p>Math calculators, formulas and reference.</p></a>
      <a class="tool-card" href="\${up}electricity/"><h3>Electricity</h3><p>Electrical calculators, formulas, symbols and reference.</p></a>
      <a class="tool-card" href="\${up}ascii/"><h3>ASCII &amp; encoding</h3><p>ASCII table, character codes and text/base conversion.</p></a>
      <a class="tool-card" href="\${up}glossary/"><h3>Glossary</h3><p>Definitions across electricity, circuits, units and computing.</p></a>
      <a class="tool-card" href="\${up}symbols/"><h3>Circuit symbols</h3><p>Electrical and electronic symbols.</p></a>
      <a class="tool-card" href="\${up}tables/"><h3>Reference tables</h3><p>Math, color, resistor, wire and other tables.</p></a>
    </div></section>
    <section class="section"><div class="section-head"><h2>Math articles &amp; formulas</h2><a href="\${up}math/" style="font-size:14px">Math topic →</a></div><ul class="link-list topic-list">\${mathArticles.map(([slug,a]) => \`<li><a href="\${up}read/\${esc(slug)}/">\${esc(a.title)}</a></li>\`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Electrical articles &amp; formulas</h2><a href="\${up}electricity/" style="font-size:14px">Electricity topic →</a></div><ul class="link-list topic-list">\${elecArticles.map(([slug,a]) => \`<li><a href="\${up}read/\${esc(slug)}/">\${esc(a.title)}</a></li>\`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>More articles</h2></div><ul class="link-list topic-list">\${otherArticles.map(([slug,a]) => \`<li><a href="\${up}read/\${esc(slug)}/">\${esc(a.title)}</a></li>\`).join('')}</ul></section>\`;
  },
});
`;

s = s.slice(0, li) + learnReplacement + s.slice(lj);

fs.writeFileSync(path, s);
console.log('fixed prerender tools/learn');
