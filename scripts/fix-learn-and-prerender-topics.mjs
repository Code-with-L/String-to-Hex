import fs from 'fs';

// 1) Fix viewLearn in content.js (replace old implementation)
try {
  const p = 'js/ui/content.js';
  let s = fs.readFileSync(p, 'utf8');
  // find by function signature
  const start = 'export function viewLearn() {';
  const end = "\n/* ── glossary";
  let i = s.indexOf(start);
  // make sure it's the reference index one (around 200s) not something else
  const idxs = [];
  let pos = 0;
  while ((pos = s.indexOf(start, pos)) !== -1) { idxs.push(pos); pos += start.length; }
  // pick the one followed later by glossary section
  i = idxs.find(x => s.indexOf(end, x) !== -1 && s.indexOf(end, x) - x < 4000) ?? idxs[0];
  const j = s.indexOf(end, i);
  if (i == null || i < 0 || j < 0) throw new Error('viewLearn nf ' + i + ' ' + j);
  // include preceding comment if present
  const comment = '/* ── reference index';
  const c = s.lastIndexOf(comment, i);
  const from = (c >= 0 && i - c < 80) ? c : i;
  const rep = `/* ── reference index ─────────────────────────────────────────────────── */

export function viewLearn() {
  const mathArticles = Object.entries(ARTICLES).filter(([slug, a]) => /math|algebra|calculus|exponent|log|quadratic|trig|number|fraction|percent|ratio|root|factor|prime|geometry|arithmetic/i.test(slug + ' ' + a.title + ' ' + (a.kicker || '')));
  const elecArticles = Object.entries(ARTICLES).filter(([slug, a]) => /electric|volt|current|ohm|amp|watt|circuit|resist|capacitor|inductor|power|kirchhoff|coulomb|kva|kwh|joule/i.test(slug + ' ' + a.title + ' ' + (a.kicker || '')));
  const otherArticles = Object.entries(ARTICLES).filter(([slug]) => !mathArticles.some(([x]) => x === slug) && !elecArticles.some(([x]) => x === slug));

  const node = frag(
    crumbs(el('span', {}, 'Reference')),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Reference'),
      el('h1', {}, 'Reference library'),
      el('p', {}, 'Articles, formulas, glossary, symbols, tables and encoding reference — organized by topic.'),
    ),
    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Reference topics')),
      el('div', { class: 'grid grid-2' },
        el('a', { class: 'tool-card', href: '#/math' }, el('h3', {}, 'Math'), el('p', {}, \`Math calculators, formulas and reference (\${mathArticles.length} articles).\`)),
        el('a', { class: 'tool-card', href: '#/electricity' }, el('h3', {}, 'Electricity'), el('p', {}, \`Electrical calculators, formulas, symbols and reference (\${elecArticles.length} articles).\`)),
        el('a', { class: 'tool-card', href: '#/ascii' }, el('h3', {}, 'ASCII & encoding'), el('p', {}, 'ASCII table, character codes, byte breakdown and text/base conversion.')),
        el('a', { class: 'tool-card', href: '#/glossary' }, el('h3', {}, 'Glossary'), el('p', {}, \`\${Object.keys(GLOSSARY).length} terms across electricity, circuits, units and computing.\`)),
        el('a', { class: 'tool-card', href: '#/symbols' }, el('h3', {}, 'Circuit symbols'), el('p', {}, \`\${Object.keys(SYMBOLS).length} electrical and electronic symbols.\`)),
        el('a', { class: 'tool-card', href: '#/tables' }, el('h3', {}, 'Reference tables'), el('p', {}, 'Math, color, resistor, wire and other reference tables.')),
      ),
    ),
    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Math articles & formulas'), el('a', { href: '#/math', style: 'font-size:14px' }, 'Math topic →')),
      el('ul', { class: 'link-list topic-list' }, ...mathArticles.map(([slug, a]) => el('li', {}, el('a', { href: \`#/read/\${slug}\` }, a.title)))),
    ),
    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Electrical articles & formulas'), el('a', { href: '#/electricity', style: 'font-size:14px' }, 'Electricity topic →')),
      el('ul', { class: 'link-list topic-list' }, ...elecArticles.map(([slug, a]) => el('li', {}, el('a', { href: \`#/read/\${slug}\` }, a.title)))),
    ),
    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'More articles')),
      el('ul', { class: 'link-list topic-list' }, ...otherArticles.map(([slug, a]) => el('li', {}, el('a', { href: \`#/read/\${slug}\` }, a.title)))),
    ),
  );
  node.pageTitle = 'Reference - HexKit';
  node.pageDescription = 'Articles, formulas, glossary, symbols, tables and encoding reference organized by topic.';
  return node;
}
`;
  s = s.slice(0, from) + rep + s.slice(j);
  fs.writeFileSync(p, s);
  console.log('viewLearn fixed');
} catch (e) { console.error('viewLearn err', e.message); }

// 2) Fix glossary entry crumbs in content.js
try {
  const p = 'js/ui/content.js';
  let s = fs.readFileSync(p, 'utf8');
  const start = "  const node = frag(\n    el('nav', { class: 'crumbs' },\n      el('a', { href: '#/' }, 'Home'),";
  const end = "    ),\n    el('article', {},";
  const i = s.indexOf(start);
  const j = s.indexOf(end, i);
  if (i < 0 || j < 0) throw new Error('glossary entry crumbs nf ' + i + ' ' + j);
  const rep = `  const node = frag(
    crumbs(el('a', { href: '#/learn' }, 'Reference'), el('a', { href: '#/glossary' }, 'Glossary'), el('span', {}, g.term)),
`;
  s = s.slice(0, i) + rep + s.slice(j);
  fs.writeFileSync(p, s);
  console.log('glossary entry crumbs fixed');
} catch (e) { console.error('glossary crumbs err', e.message); }

// 3) Prerender topic breadcrumbs for units/glossary/symbols/tables/ascii
try {
  const p = 'scripts/prerender.mjs';
  let s = fs.readFileSync(p, 'utf8');

  // units index
  s = s.replace(
    "  body: (up) => `    ${nav(up, [{ label: 'Units' }])}",
    "  body: (up) => `    ${nav(up, [{ label: 'Conversion', href: `${up}conversion/` }, { label: 'Unit families' }])}"
  );
  s = s.replace(
    "      crumbsLd(cleanPath(path), [{ name: 'Home', href: '/' }, { name: 'Units', href: '/units/' }, { name: F.title, href: cleanPath(path) }]),",
    "      crumbsLd(cleanPath(path), [{ name: 'Home', href: '/' }, { name: 'Conversion', href: '/conversion/' }, { name: 'Units', href: '/units/' }, { name: F.title, href: cleanPath(path) }]),"
  );
  s = s.replace(
    "    body: (up) => `    ${nav(up, [{ label: 'Units', href: `${up}units/` }, { label: F.title }])}",
    "    body: (up) => `    ${nav(up, [{ label: 'Conversion', href: `${up}conversion/` }, { label: 'Units', href: `${up}units/` }, { label: F.title }])}"
  );

  // glossary entry crumbsLd
  s = s.replace(
    "      crumbsLd(cleanPath(path), [{ name: 'Home', href: '/' }, { name: 'Glossary', href: '/glossary/' }, { name: g.term, href: cleanPath(path) }]),",
    "      crumbsLd(cleanPath(path), [{ name: 'Home', href: '/' }, { name: 'Reference', href: '/learn/' }, { name: 'Glossary', href: '/glossary/' }, { name: g.term, href: cleanPath(path) }]),"
  );

  // ascii - move under Conversion topic in nav for consistency with SPA
  s = s.replace(
    "  body: (up) => `    ${nav(up, [{ label: 'Reference', href: `${up}learn/` }, { label: 'ASCII table' }])}",
    "  body: (up) => `    ${nav(up, [{ label: 'Conversion', href: `${up}conversion/` }, { label: 'ASCII table' }])}"
  );

  fs.writeFileSync(p, s);
  console.log('prerender topics fixed');
} catch (e) { console.error('prerender err', e.message); }
