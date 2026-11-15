#!/usr/bin/env node
/**
 * Prerenderer.
 *
 * The app is a hash-routed single-page application, and a crawler that does
 * not execute JavaScript sees only index.html for every URL. That is the main
 * SEO weakness of the SPA approach, so this script writes a real static HTML
 * file for every route, straight into the site root:
 *
 *   /learn/index.html              the reference index
 *   /read/ohms-law/index.html      one article, with its full text inline
 *   /glossary/index.html           the glossary index
 *   /tools/index.html              the calculator index
 *   /tool/<id>/index.html          one page per calculator
 *   /units/index.html, /units/<family>/index.html
 *
 * Each file carries a unique <title>, meta description, canonical URL,
 * Open Graph tags and JSON-LD, plus the article or tool text as real HTML so
 * it is indexable. The generated shell is also a working app shell — the
 * static markup sits inside #view, which app.js replaces on boot — so one
 * file serves both a crawler without JavaScript and an interactive visitor.
 * The two never drift apart because both come from the same data modules.
 *
 * The home page is deliberately not generated: index.html is hand-authored
 * so the app shell and the static home copy stay in one reviewable file.
 *
 * Run via `npm run prerender`; CI does it before publishing Pages.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TOOLS, TOOL_BY_ID, GROUPS } from '../js/data/tools.js';
import { FAMILIES, FAMILY_IDS } from '../js/data/units.js';
import { FORMATS, ENCODINGS } from '../js/data/formats.js';
import { ARTICLES, GLOSSARY, GLOSSARY_GROUPS, TABLES, COMPONENTS } from '../js/data/reference.js';
import { SYMBOLS, SYMBOL_GROUPS } from '../js/data/symbols.js';
import { symbolMarkup } from '../js/ui/icons.js';
import { ASCII_128 } from '../js/data/ascii.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// Written straight into the project root so GitHub Pages serves them at real,
// crawlable URLs (/read/ohms-law/, /tool/mortgage/, …) rather than /seo/…
const outRoot = root;
const SITE = 'HexKit';
const ORIGIN = 'https://code-with-l.github.io/String-to-Hex';

const N_TOOLS = TOOLS.length;
const N_FAMILIES = FAMILY_IDS.length;
const N_UNITS = FAMILY_IDS.reduce((a, f) => a + Object.keys(FAMILIES[f].units).length, 0);
const N_PAIRS = FORMATS.length ** 2;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const attr = esc;

/** /tool/ohms-law/index.html → /tool/ohms-law/ */
const cleanPath = (p) => (p === '/index.html' ? '/' : p.replace(/index\.html$/, ''));

/* ── page shell ─────────────────────────────────────────────────────────── */

/**
 * Every generated page is a fully working app shell: the static markup lives
 * inside #view, which app.js replaces on boot, so one file serves both a
 * crawler without JavaScript and an interactive visitor.
 *
 * Assets are referenced relatively because the site is served from a
 * sub-path on GitHub Pages — a root-absolute "/css/app.css" would 404.
 */
function shell({ path, hash, title, description, body, jsonLd, noindex = false }) {
  const urlPath = cleanPath(path);
  const canonical = `${ORIGIN}${urlPath}`;
  // /tool/ohms-law/index.html is two levels deep, so assets climb two levels.
  const depth = path.split('/').filter(Boolean).length - 1;
  const up = depth ? '../'.repeat(depth) : './';
  const seg = hash.replace(/^\//, '');

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${attr(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta name="theme-color" content="#0a0b0c">
<meta name="color-scheme" content="dark light">
<link rel="canonical" href="${attr(canonical)}">
<link rel="manifest" href="${up}manifest.webmanifest">
<link rel="icon" href="${up}icons/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${up}icons/icon-180.png">
<link rel="alternate" hreflang="en" href="${attr(canonical)}">
<link rel="stylesheet" href="${up}css/app.css">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${attr(canonical)}">
<meta property="og:image" content="${ORIGIN}/icons/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(title)}">
<meta name="twitter:description" content="${attr(description)}">
<meta name="twitter:image" content="${ORIGIN}/icons/og.png">
<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2).replace(/</g, '\\u003c')}
</script>
</head>
<body>
<a class="sr-only" href="#main">Skip to content</a>

<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${up}#">
      <span class="brand-mark" aria-hidden="true">0x</span>
      <span class="brand-name">HexKit<small>converters &amp; calculators</small></span>
    </a>
    <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="siteNav" aria-label="Toggle navigation">
      <span></span><span></span><span></span>
    </button>
    <nav class="site-nav" id="siteNav" aria-label="Primary" hidden">
      <a href="${up}#/">Home</a>
      <a href="${up}#/calc">Calculators</a>
      <a href="${up}#/conversion">Conversion</a>
      <a href="${up}#/web-tools">Web Tools</a>
      <a href="${up}#/math">Math</a>
      <a href="${up}#/electricity">Electricity</a>
      <button class="btn btn-sm btn-ghost" id="themeToggle" type="button" aria-label="Toggle colour theme">Theme</button>
      <button class="btn btn-sm btn-ghost" id="installBtn" type="button" hidden>Install</button>
    </nav>
  </div>
</header>

<main id="main" class="wrap" tabindex="-1">
  <div id="view" aria-live="polite">
    <article class="prerendered">
${body}
    </article>
  </div>
</main>

<footer class="site-footer">
  <div class="wrap">
    <div class="footer-bottom">
      <p>${SITE} — every calculation runs in your browser. Nothing is uploaded, nothing is stored on a server. MIT licensed.</p>
    </div>
  </div>
</footer>

<div class="toast-host" id="toastHost" aria-live="polite" aria-atomic="true"></div>
<input type="file" id="filePicker" hidden>
<script>location.hash = "#/${seg}";</script>
<script type="module" src="${up}js/app.js"></script>
</body>
</html>
`;
}

/* ── small HTML builders ───────────────────────────────────────────────── */

const nav = (up, crumbs) => `<nav class="crumbs" aria-label="Breadcrumb">
  <a href="${up}">Home</a>
${crumbs.map((c) => `  <span aria-hidden="true">/</span>
  ${c.href ? `<a href="${attr(c.href)}">${esc(c.label)}</a>` : `<span>${esc(c.label)}</span>`}`).join('\n')}
</nav>`;

const articleBlocks = (blocks) => blocks.map((b) => {
  switch (b.k) {
    case 'definition': return `    <p class="definition">${esc(b.t)}</p>`;
    case 'h3': return `    <h2>${esc(b.t)}</h2>`;
    case 'p': return `    <p>${esc(b.t)}</p>`;
    case 'list': return `    <ul>\n${b.items.map((i) => `      <li>${esc(i)}</li>`).join('\n')}\n    </ul>`;
    case 'formula':
      return `    <div class="formula"><span class="eq">${esc(b.eq)}</span>${b.note ? `\n      <span class="note">${esc(b.note)}</span>` : ''}</div>`;
    case 'callout': return `    <div class="callout"><div><strong>Note</strong> ${esc(b.t)}</div></div>`;
    case 'symbols':
      return `    <ul class="symbols">\n${b.rows.map(([s, d]) => `      <li><b>${esc(s)}</b><span>${esc(d)}</span></li>`).join('\n')}\n    </ul>`;
    case 'table':
      return `    <div class="table-scroll"><table>
      <thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>
${b.rows.map((r) => `        <tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('\n')}
      </tbody>
    </table></div>`;
    default: return '';
  }
}).join('\n');

/* ── structured data ────────────────────────────────────────────────────── */

const orgLd = {
  '@type': 'Organization',
  '@id': `${ORIGIN}/#organization`,
  name: SITE,
  url: ORIGIN,
  logo: `${ORIGIN}/icons/icon-512.png`,
};

const siteLd = {
  '@type': 'WebSite',
  '@id': `${ORIGIN}/#website`,
  name: SITE,
  url: ORIGIN,
  description: `Convert text to hex, binary, decimal, octal and Base64. ${N_TOOLS} calculators, ${N_FAMILIES} unit families and a reference library. Offline-first and free.`,
  inLanguage: 'en',
  publisher: { '@id': `${ORIGIN}/#organization` },
};

const crumbsLd = (path, items) => ({
  '@type': 'BreadcrumbList',
  '@id': `${ORIGIN}${path}#breadcrumb`,
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${ORIGIN}${it.href}` })),
});

const graph = (extra) => ({ '@context': 'https://schema.org', '@graph': [orgLd, siteLd, ...extra] });

/* ── pages ─────────────────────────────────────────────────────────────── */

const PAGES = [];

/** How many levels to climb from a page to reach the site root. */
const upFor = (path) => {
  const depth = path.split('/').filter(Boolean).length - 1;
  return depth ? '../'.repeat(depth) : './';
};

/* home */
PAGES.push({
  path: '/index.html',
  hash: '/',
  title: `${SITE} — String to Hex, Binary & Every Base Converter`,
  description: 'Convert text to hex, binary, decimal, octal and Base64. 61 calculators, 24 unit families, 42 encodings. Works offline, installs as an app, nothing uploaded.',
  jsonLd: graph([
    {
      '@type': 'SoftwareApplication',
      '@id': `${ORIGIN}/#app`,
      name: SITE,
      url: ORIGIN,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript, ES modules and BigInt',
      description: 'String to hex and every other base, plus unit converters and engineering calculators.',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: [
        `${FORMATS.length ** 2} ordered format pairs: text, hex, binary, decimal, octal, Base64`,
        `${TOOLS.length} calculators and engineering formulas`,
        `${FAMILY_IDS.length} unit families, ${FAMILY_IDS.reduce((a, f) => a + Object.keys(FAMILIES[f].units).length, 0)} units`,
        `${ENCODINGS.length} character encodings`,
        'Works fully offline and installs as an app',
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${ORIGIN}/#faq`,
      mainEntity: [
        { q: 'How do I convert text to hex?', a: 'Take each character, find its code point, and rewrite that number in base 16. For example "A" is decimal 65, which is 4 × 16¹ + 1 × 16⁰, so it becomes 41. Join the hex pairs with a delimiter — "Plant trees" becomes 50 6C 61 6E 74 20 74 72 65 65 73.' },
        { q: 'How do I convert hex back to text?', a: 'Strip anything that is not a hex digit, pair the remaining digits into bytes, convert each byte to decimal, then look up the character. The converter accepts 0x prefixes, commas, colons and quoted strings as well as plain spaced bytes.' },
        { q: 'Does the site upload my text?', a: 'No. Every conversion happens inside your browser tab. You can confirm it by switching off your network mid-conversion — the app keeps working.' },
        { q: 'Why does my emoji become four hex bytes?', a: 'UTF-8 encodes astral code points, anything above U+FFFF, in four bytes. Every emoji is an astral character, so each one produces four bytes rather than the two a UTF-16 string view suggests.' },
        { q: 'Can I use it without an internet connection?', a: 'Yes. The whole app is precached by a service worker on first visit, so it loads and runs with no network afterwards. It also installs to your home screen and launches in its own window.' },
      ].map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
    },
  ]),
  body: (up) => `    ${nav(up, [])}
    <header class="page-head">
      <span class="hero-eyebrow">Offline-first · Zero dependencies</span>
      <h1>String to hex, and every other base</h1>
      <p>Paste text and read the bytes. Swap to hex, binary, decimal, octal or Base64 across
         ${N_PAIRS} ordered pairs, with ${ENCODINGS.length} character encodings.
         Then ${N_TOOLS} calculators, ${N_FAMILIES} unit families and a reference library that actually teaches you.</p>
    </header>
    <section class="panel prose">
      <h2>Try the common conversions</h2>
      <ul>
${FORMATS.filter((f) => f.id !== 'text').map((f) => `        <li><a href="${up}#/convert?from=text&amp;to=${f.id}">Text to ${esc(f.label.toLowerCase())}</a></li>`).join('\n')}
      </ul>
      <h2>Worked example</h2>
      <p><code>"Plant trees"</code> becomes <code>50 6C 61 6E 74 20 74 72 65 65 73</code>.</p>
      <p>'P' is decimal 80, and 80 = 5 × 16¹ + 0 × 16⁰, so it is written 50 in base 16.
         'l' is 108 = 6 × 16¹ + 12 × 16⁰, so 6C. The same number, written differently.</p>
    </section>
    <section class="section">
      <h2 class="panel-title">All ${N_TOOLS} calculators</h2>
      <ul>
${GROUPS.map((g) => `        <li><strong>${esc(g.title)}:</strong> ${TOOLS.filter((t) => t.group === g.id).map((t) => `<a href="${up}tool/${t.id}/">${esc(t.title)}</a>`).join(', ')}</li>`).join('\n')}
      </ul>
    </section>`,
});

/* tool index */
PAGES.push({
  path: '/tools/index.html',
  hash: '/tools',
  title: 'Calculators - HexKit',
  description: 'Math, electrical, financial, health, time and other calculators organized by topic.',
  priority: '0.9',
  jsonLd: graph([crumbsLd('/tools/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Calculators', href: '/tools/index.html' }])]),
  body: (up) => `    ${nav(up, [{ label: 'Calculators' }])}
    <header class="page-head"><h1>Online Calculators</h1><p>Free online calculators organized by topic. Each tool runs in your browser and works offline.</p></header>
    ${CALC_CATEGORIES.map(cat => {
      const items = TOOLS.filter(t => t.group === cat.id);
      if (!items.length) return '';
      return `<section class="section"><div class="section-head"><h2>${esc(cat.title)}</h2><a href="${up}calc/${esc(cat.id)}/" style="font-size:14px">Open category →</a></div><ul class="link-list topic-list">${items.map(t => `<li><a href="${up}tool/${esc(t.id)}/">${esc(t.title)}</a> — ${esc(t.blurb || '')}</li>`).join('')}</ul></section>`;
    }).join('')}`,
});

/* one page per tool */
for (const t of TOOLS) {
  const path = `/tool/${t.id}/index.html`;
  PAGES.push({
    path,
    hash: `/tool/${t.id}`,
    title: `${t.title} — free online calculator | ${SITE}`,
    description: `${t.blurb} Shows its working, works offline, and needs no sign-up.`,
    jsonLd: graph([
      { '@type': 'SoftwareApplication', '@id': `${ORIGIN}${cleanPath(path)}#app`, name: t.title, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', url: `${ORIGIN}${cleanPath(path)}`, description: t.blurb, isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
      { '@type': 'HowTo', '@id': `${ORIGIN}${cleanPath(path)}#howto`, name: `How to use the ${t.title}`, description: t.blurb, step: [
        { '@type': 'HowToStep', position: 1, text: 'Open the calculator and enter values in the input fields.' },
        { '@type': 'HowToStep', position: 2, text: 'The result updates as you type, with the working shown beneath it.' },
        { '@type': 'HowToStep', position: 3, text: 'Copy the result, or share the URL — your inputs are stored in it.' },
      ] },
      crumbsLd(cleanPath(path), [{ name: 'Home', href: '/' }, { name: 'Calculators', href: '/tools/' }, { name: t.title, href: cleanPath(path) }]),
    ]),
    body: (up) => `    ${nav(up, [{ label: 'Calculators', href: `${up}tools/` }, { label: t.title }])}
    <header class="page-head">
      <h1>${esc(t.title)}</h1>
      <p>${esc(t.blurb)}</p>
    </header>
    <section class="panel prose">
      <h2>Inputs</h2>
      <ul>
${t.inputs.map((i) => `        <li><strong>${esc(i.label)}</strong>${i.unit ? ` (${esc(i.unit)})` : ''}</li>`).join('\n')}
      </ul>
      <h2>What it calculates</h2>
      <p>${esc(t.blurb)} Results appear instantly as you type, and the “show the working” panel
         lists every step so the answer can be checked by hand.</p>
      <h2>How to use it</h2>
      <ol>
        <li>Open the calculator and fill in the input fields.</li>
        <li>The result updates as you type; the working is shown beneath the results.</li>
        <li>Copy the result, or share the URL — your inputs are stored in it.</li>
      </ol>
    </section>
    <p style="margin-top:22px"><a href="${up}#/tool/${t.id}">Open the interactive calculator →</a></p>`,
  });
}

/* reference index */
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
    return `    ${nav(up, [{ label: 'Reference' }])}
    <header class="page-head"><h1>Reference library</h1><p>Articles, formulas, glossary, symbols, tables and encoding reference — organized by topic.</p></header>
    <section class="section"><div class="section-head"><h2>Reference topics</h2></div><div class="grid grid-2">
      <a class="tool-card" href="${up}math/"><h3>Math</h3><p>Math calculators, formulas and reference.</p></a>
      <a class="tool-card" href="${up}electricity/"><h3>Electricity</h3><p>Electrical calculators, formulas, symbols and reference.</p></a>
      <a class="tool-card" href="${up}ascii/"><h3>ASCII &amp; encoding</h3><p>ASCII table, character codes and text/base conversion.</p></a>
      <a class="tool-card" href="${up}glossary/"><h3>Glossary</h3><p>Definitions across electricity, circuits, units and computing.</p></a>
      <a class="tool-card" href="${up}symbols/"><h3>Circuit symbols</h3><p>Electrical and electronic symbols.</p></a>
      <a class="tool-card" href="${up}tables/"><h3>Reference tables</h3><p>Math, color, resistor, wire and other tables.</p></a>
    </div></section>
    <section class="section"><div class="section-head"><h2>Math articles &amp; formulas</h2><a href="${up}math/" style="font-size:14px">Math topic →</a></div><ul class="link-list topic-list">${mathArticles.map(([slug,a]) => `<li><a href="${up}read/${esc(slug)}/">${esc(a.title)}</a></li>`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Electrical articles &amp; formulas</h2><a href="${up}electricity/" style="font-size:14px">Electricity topic →</a></div><ul class="link-list topic-list">${elecArticles.map(([slug,a]) => `<li><a href="${up}read/${esc(slug)}/">${esc(a.title)}</a></li>`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>More articles</h2></div><ul class="link-list topic-list">${otherArticles.map(([slug,a]) => `<li><a href="${up}read/${esc(slug)}/">${esc(a.title)}</a></li>`).join('')}</ul></section>`;
  },
});

/* one page per article — full text inline so it is indexable */
for (const [slug, a] of Object.entries(ARTICLES)) {
  const path = `/read/${slug}/index.html`;
  PAGES.push({
    path,
    hash: `/read/${slug}`,
    title: `${a.title} — formula, definition & symbols | ${SITE}`,
    description: a.summary,
    jsonLd: graph([
      {
        '@type': 'TechArticle',
        '@id': `${ORIGIN}${cleanPath(path)}#article`,
        headline: a.title,
        description: a.summary,
        articleSection: a.kicker,
        inLanguage: 'en',
        isAccessibleForFree: true,
        author: { '@id': `${ORIGIN}/#organization` },
        publisher: { '@id': `${ORIGIN}/#organization` },
        mainEntityOfPage: `${ORIGIN}${cleanPath(path)}`,
      },
      crumbsLd(cleanPath(path), [{ name: 'Home', href: '/' }, { name: 'Reference', href: '/learn/' }, { name: a.title, href: cleanPath(path) }]),
    ]),
    body: (up) => `    ${nav(up, [{ label: 'Reference', href: `${up}learn/` }, { label: a.title }])}
    <header class="page-head">
      <span class="hero-eyebrow">${esc(a.kicker)}</span>
      <h1>${esc(a.title)}</h1>
      <p>${esc(a.summary)}</p>
    </header>
    <div class="panel prose">
${articleBlocks(a.blocks)}
    </div>
    ${a.tool && TOOL_BY_ID[a.tool] ? `<p style="margin-top:22px"><a href="${up}tool/${a.tool}/">Put it into practice → ${esc(TOOL_BY_ID[a.tool].title)}</a></p>` : ''}`,
  });
}

/* glossary index */
PAGES.push({
  path: '/glossary/index.html',
  hash: '/glossary',
  title: `Electrical, circuit & computing glossary — ${SITE}`,
  description: `Definitions for ${Object.keys(GLOSSARY).length} terms: voltage, current, resistance, power factor, Kirchhoff’s laws, decibels, radix and more.`,
  jsonLd: graph([
    { '@type': 'DefinedTermSet', '@id': `${ORIGIN}/glossary#terms`, name: `${SITE} glossary`, description: `Definitions for ${Object.keys(GLOSSARY).length} electrical, circuit, unit and computing terms.`, hasDefinedTerm: Object.entries(GLOSSARY).map(([k, g]) => ({ '@type': 'DefinedTerm', '@id': `${ORIGIN}/glossary/${k}/#term`, name: g.term, description: g.def })) },
  ]),
  body: (up) => `    ${nav(up, [{ label: 'Reference', href: `${up}learn/` }, { label: 'Glossary' }])}
    <header class="page-head">
      <h1>Glossary</h1>
      <p>${Object.keys(GLOSSARY).length} terms, grouped by area.</p>
    </header>
${GLOSSARY_GROUPS.map((group) => {
    const entries = Object.entries(GLOSSARY).filter(([, g]) => g.group === group);
    if (!entries.length) return '';
    return `    <section class="section">
      <h2 class="panel-title">${esc(group)}</h2>
      <dl>
${entries.map(([k, g]) => `        <dt><a href="${up}glossary/${k}/">${esc(g.term)}</a></dt>
        <dd>${esc(g.def)}</dd>`).join('\n')}
      </dl>
    </section>`;
  }).join('\n')}`,
});

/* one page per glossary entry */
for (const [key, g] of Object.entries(GLOSSARY)) {
  const path = `/glossary/${key}/index.html`;
  PAGES.push({
    path,
    hash: `/glossary/${key}`,
    title: `${g.term}${g.symbol && g.symbol !== '—' ? ` (${g.symbol})` : ''} — definition & formula | ${SITE}`,
    description: `${g.short}${g.formula ? ` ${g.formula}.` : ''}`,
    jsonLd: graph([
      { '@type': 'DefinedTerm', '@id': `${ORIGIN}${cleanPath(path)}#term`, name: g.term, description: g.def, inDefinedTermSet: { '@id': `${ORIGIN}/glossary#terms` }, termCode: g.symbol && g.symbol !== '—' ? g.symbol : undefined },
      crumbsLd(cleanPath(path), [{ name: 'Home', href: '/' }, { name: 'Reference', href: '/learn/' }, { name: 'Glossary', href: '/glossary/' }, { name: g.term, href: cleanPath(path) }]),
    ]),
    body: (up) => `    ${nav(up, [{ label: 'Reference', href: `${up}learn/` }, { label: 'Glossary', href: `${up}glossary/` }, { label: g.term }])}
    <header class="page-head">
      <h1>${esc(g.term)}${g.symbol && g.symbol !== '—' ? ` <span style="color:var(--signal);font-family:var(--mono)">${esc(g.symbol)}</span>` : ''}</h1>
      <p>${esc(g.short)}</p>
    </header>
    <div class="panel prose">
      <p class="definition">${esc(g.def)}</p>
${g.intuition ? `      <h2>Intuition</h2>\n      <p>${esc(g.intuition)}</p>\n` : ''}
${g.formula ? `      <div class="formula"><span class="eq">${esc(g.formula)}</span>${g.unit && g.unit !== '—' ? `\n        <span class="note">measured in ${esc(g.unit)}</span>` : ''}</div>\n` : ''}
    </div>
${(g.seeAlso ?? []).filter((k) => GLOSSARY[k]).length ? `    <p style="margin-top:20px"><strong>See also:</strong> ${g.seeAlso.filter((k) => GLOSSARY[k]).map((k) => `<a href="${up}glossary/${k}/">${esc(GLOSSARY[k].term)}</a>`).join(', ')}</p>\n` : ''}`,
  });
}

/* units index + one per family */
PAGES.push({
  path: '/units/index.html',
  hash: '/units',
  title: `${N_FAMILIES} unit families, ${N_UNITS} units — ${SITE}`,
  description: 'Convert length, mass, temperature, area, volume, speed, pressure, force, torque, time, energy, power, frequency, voltage, current, resistance, capacitance, angle, data and more.',
  jsonLd: graph([
    { '@type': 'CollectionPage', '@id': `${ORIGIN}/units#page`, name: 'Unit converters', isPartOf: { '@id': `${ORIGIN}/#website` } },
    { '@type': 'ItemList', '@id': `${ORIGIN}/units#list`, numberOfItems: N_FAMILIES, itemListElement: FAMILY_IDS.map((f, i) => ({ '@type': 'ListItem', position: i + 1, name: FAMILIES[f].title, url: `${ORIGIN}/units/${f}/` })) },
  ]),
  body: (up) => `    ${nav(up, [{ label: 'Conversion', href: `${up}conversion/` }, { label: 'Unit families' }])}
    <header class="page-head">
      <h1>Unit families</h1>
      <p>Every family is driven by exact reference factors, so results match published conversion tables.</p>
    </header>
    <ul>
${FAMILY_IDS.map((f) => `      <li><a href="${up}units/${f}/">${esc(FAMILIES[f].title)}</a> — ${Object.keys(FAMILIES[f].units).length} units</li>`).join('\n')}
    </ul>`,
});

for (const f of FAMILY_IDS) {
  const F = FAMILIES[f];
  const keys = Object.keys(F.units);
  const pairs = [];
  for (const a of keys) for (const b of keys) if (a !== b && !F.units[a].expr && !F.units[b].expr) pairs.push([a, b]);
  const path = `/units/${f}/index.html`;
  PAGES.push({
    path,
    hash: `/units/${f}`,
    title: `${F.title} converters — every ${F.title.toLowerCase()} pair | ${SITE}`,
    description: `Convert all ${pairs.length} ordered pairs of ${F.title.toLowerCase()}. Base unit ${F.baseName}. Exact reference factors, works offline.`,
    jsonLd: graph([
      { '@type': 'CollectionPage', '@id': `${ORIGIN}${cleanPath(path)}#page`, name: `${F.title} converters`, isPartOf: { '@id': `${ORIGIN}/#website` }, mainEntity: { '@id': `${ORIGIN}${cleanPath(path)}#table` } },
      {
        '@type': 'DefinedTermSet',
        '@id': `${ORIGIN}${cleanPath(path)}#table`,
        name: `${F.title} units`,
        description: `Units of ${F.title.toLowerCase()} relative to the ${F.baseName}.`,
        hasDefinedTerm: keys.map((k) => ({ '@type': 'DefinedTerm', name: F.units[k].name, description: `${F.units[k].name} (${F.units[k].symbol}) = ${F.units[k].f} ${F.baseName}`, alternateName: F.units[k].symbol })),
      },
      crumbsLd(cleanPath(path), [{ name: 'Home', href: '/' }, { name: 'Conversion', href: '/conversion/' }, { name: 'Units', href: '/units/' }, { name: F.title, href: cleanPath(path) }]),
    ]),
    body: (up) => `    ${nav(up, [{ label: 'Conversion', href: `${up}conversion/` }, { label: 'Units', href: `${up}units/` }, { label: F.title }])}
    <header class="page-head">
      <h1>${esc(F.title)} converters</h1>
      <p>All ${pairs.length} ordered pairs, driven by the exact reference factor. Base unit: ${esc(F.baseName)}.</p>
    </header>
    <div class="panel prose">
      <h2>Units in this family</h2>
      <table>
        <thead><tr><th>Unit</th><th>Symbol</th><th>Factor vs ${esc(F.baseName)}</th></tr></thead>
        <tbody>
${keys.map((k) => `          <tr><td>${esc(F.units[k].name)}</td><td class="mono">${esc(F.units[k].symbol)}</td><td class="mono">${F.units[k].f === 1 ? '—' : `× ${F.units[k].f}`}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>`,
  });
}

/* symbols */
PAGES.push({
  path: '/symbols/index.html',
  hash: '/symbols',
  title: `Electrical circuit symbols — SVG reference | ${SITE}`,
  description: `${Object.keys(SYMBOLS).length} electrical circuit symbols sourced from Wikimedia Commons (IEC/ANSI), with per-file attribution and licenses.`,
  jsonLd: graph([
    { '@type': 'TechArticle', '@id': `${ORIGIN}/symbols#article`, headline: 'Electrical circuit symbols', description: 'A reference of circuit symbols sourced from Wikimedia Commons, drawn to IEC/ANSI conventions.', inLanguage: 'en', isAccessibleForFree: true, author: { '@id': `${ORIGIN}/#organization` } },
  ]),
  body: (up) => `    ${nav(up, [{ label: 'Reference', href: `${up}learn/` }, { label: 'Circuit symbols' }])}
    <header class="page-head">
      <h1>Circuit symbols</h1>
      <p>${Object.keys(SYMBOLS).length} circuit symbols sourced as SVG files from Wikimedia Commons (IEC/ANSI conventions). No symbols are hand-drawn in this app.</p>
    </header>
${SYMBOL_GROUPS.map((grp) => `    <section class="section">
      <div class="section-head"><h2>${esc(grp.title)}</h2><span style="color:var(--ink-faint);font-size:14px">${esc(grp.blurb)}</span></div>
      <div class="symbol-grid">
${grp.keys.map((k) => { const s = SYMBOLS[k]; if(!s) return ''; return `        <div class="symbol-card">${symbolMarkup(k, up)}<b>${esc(s.label)}</b><small>${esc(s.note||'')}</small></div>`; }).join('\n')}
      </div>
    </section>`).join('\n')}
    <section class="section symbol-attrib">
      <div class="section-head"><h2>Symbol credits &amp; licenses</h2></div>
      <p>Symbol artwork is downloaded from <a href="https://commons.wikimedia.org/wiki/Category:SVG_electrical_symbols">Wikimedia Commons (SVG electrical symbols)</a>. Each file keeps its original author and license.</p>
      <div class="table-scroll"><table>
        <thead><tr><th>Symbol</th><th>Source file</th><th>Author</th><th>License</th></tr></thead>
        <tbody>
${Object.entries(SYMBOLS).map(([k,s]) => `          <tr><td>${esc(s.label)}</td><td><a href="${attr(s.licenseUrl)}">${esc(s.source)}</a></td><td>${esc(s.author||'—')}</td><td>${esc(s.license||'—')}</td></tr>`).join('\n')}
        </tbody>
      </table></div>
      <p>Full attribution is also provided in <a href="${up}SYMBOLS.md">SYMBOLS.md</a>.</p>
    </section>
    <p style="margin-top:22px"><a href="${up}#/symbols">See the interactive symbol browser →</a></p>`,
});

/* reference tables */
PAGES.push({
  path: '/tables/index.html',
  hash: '/tables',
  title: `Roman numerals, logs, alt codes &amp; colours tables | ${SITE}`,
  description: 'Multiplication, addition, logarithm and roman-numeral tables, Windows ALT codes, °C↔°F chart, named CSS colours, the 216-colour web-safe palette and resistor colour codes.',
  jsonLd: graph([
    { '@type': 'TechArticle', '@id': `${ORIGIN}/tables#article`, headline: 'Reference tables — multiplication, logs, roman numerals, alt codes, z-scores, AWG copper wire, colours, temperature, resistor', description: 'Multiplication, addition, logarithm, roman-numeral, Windows ALT, standard-normal z-table and AWG copper wire tables, plus the named CSS colours, web-safe palette, °C↔°F chart and resistor colour code.', inLanguage: 'en', isAccessibleForFree: true, author: { '@id': `${ORIGIN}/#organization` } },
  ]),
  body: (up) => `    ${nav(up, [{ label: 'Reference', href: `${up}learn/` }, { label: 'Tables' }])}
    <header class="page-head">
      <h1>Reference tables</h1>
      <p>The lookup tables that keep getting scrolled past on other sites.</p>
    </header>
    <div class="panel prose">
      <h2>Resistor colour bands</h2>
      <table>
        <thead><tr><th>Colour</th><th>Digit</th></tr></thead>
        <tbody>
${TABLES.resistors.bands.map((b) => `          <tr><td>${esc(b.code)}</td><td class="mono">${esc(b.value)}</td></tr>`).join('\n')}
        </tbody>
      </table>
      <h2>Multipliers</h2>
      <table>
        <thead><tr><th>Colour</th><th>Value</th></tr></thead>
        <tbody>
${TABLES.resistors.multipliers.map((b) => `          <tr><td>${esc(b.code)}</td><td class="mono">${esc(b.value)}</td></tr>`).join('\n')}
        </tbody>
      </table>
      <h2>Tolerance</h2>
      <table>
        <thead><tr><th>Colour</th><th>Tolerance</th></tr></thead>
        <tbody>
${TABLES.resistors.tolerance.map((b) => `          <tr><td>${esc(b.code)}</td><td class="mono">${esc(b.value)}</td></tr>`).join('\n')}
        </tbody>
      </table>
      <h2>Resistivity of common materials</h2>
      <table>
        <thead><tr><th>Material</th><th>Resistivity (Ω·m)</th><th>Note</th></tr></thead>
        <tbody>
${TABLES.conductivity.rows.map((r) => `          <tr><td>${esc(r[0])}</td><td class="mono">${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('\n')}
        </tbody>
      </table>
      <h2>Indicative wire current capacity</h2>
      <table>
        <thead><tr><th>Cross-section</th><th>AWG</th><th>Capacity</th><th>Typical use</th></tr></thead>
        <tbody>
${TABLES.wireCurrent.rows.map((r) => `          <tr><td class="mono">${esc(r[0])}</td><td class="mono">${esc(r[1])}</td><td class="mono">${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('\n')}
        </tbody>
      </table>
      <h2>Multiplication table (×1 to ×12)</h2>
      <table class="mul-table">
        <thead><tr><th>×</th>${Array.from({ length: TABLES.multiplication.size }, (_, i) => `<th>${i + 1}</th>`).join('')}</tr></thead>
        <tbody>
${TABLES.multiplication.rows.map((row, i) => `          <tr><th>${i + 1}</th>${row.map((v) => `<td class="mono">${v}</td>`).join('')}</tr>`).join('\n')}
        </tbody>
      </table>
      <h2>Addition table (0 to 12)</h2>
      <table class="mul-table">
        <thead><tr><th>+</th>${Array.from({ length: TABLES.addition.size + 1 }, (_, i) => `<th>${i}</th>`).join('')}</tr></thead>
        <tbody>
${TABLES.addition.rows.map((row, i) => `          <tr><th>${i}</th>${row.map((v) => `<td class="mono">${v}</td>`).join('')}</tr>`).join('\n')}
        </tbody>
      </table>
      <h2>Logarithm tables</h2>
      <table>
        <thead><tr><th>x</th><th>log₁₀(x)</th><th>ln(x)</th></tr></thead>
        <tbody>
${TABLES.logarithms.rows.map(([x, l10, le]) => `          <tr><td class="mono">${esc(x)}</td><td class="mono">${esc(l10)}</td><td class="mono">${esc(le)}</td></tr>`).join('\n')}
        </tbody>
      </table>
      <h2>Roman numerals — I V X L C D M</h2>
      <table>
        <thead><tr><th>Symbol</th><th>Value</th><th>Name</th></tr></thead>
        <tbody>
${TABLES.roman.symbols.map(([s, v, name]) => `          <tr><td class="mono" style="font-weight:600">${esc(s)}</td><td class="mono">${esc(v)}</td><td>${esc(name)}</td></tr>`).join('\n')}
        </tbody>
      </table>
      <p>${esc(TABLES.roman.subtractive)}</p>
      <table class="mul-table">
        <thead><tr><th>1–10</th><th>11–20</th><th>21–30</th><th>31–40</th><th>41–50</th><th>51–60</th><th>61–70</th><th>71–80</th><th>81–90</th><th>91–100</th></tr></thead>
        <tbody>
${Array.from({ length: 10 }, (_, r) => `          <tr>${Array.from({ length: 10 }, (_, c) => {
  const i = c * 10 + r;
  const [n, roman] = TABLES.roman.chart[i];
  return `<td class="mono">${esc(n)} <strong>${esc(roman)}</strong></td>`;
}).join('')}</tr>`).join('\n')}
        </tbody>
      </table>
      <h2>Temperature conversion chart</h2>
      <table>
        <thead><tr><th>°C</th><th>°F</th><th>Why it matters</th></tr></thead>
        <tbody>
${TABLES.temperatures.rows.map((r) => `          <tr><td class="mono">${esc(r[0])}</td><td class="mono">${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('\n')}
        </tbody>
      </table>
      <h2>Named colours — hex, RGB and HSL</h2>
      <table>
        <thead><tr><th>Colour</th><th>Hex</th><th>RGB</th><th>HSL</th></tr></thead>
        <tbody>
${TABLES.named.rows.map((r) => `          <tr><td><span style="display:inline-block;width:14px;height:14px;border-radius:3px;vertical-align:-2px;margin-right:7px;border:1px solid var(--line-2);background:${esc(r.hex)}"></span>${esc(r.name)}</td><td class="mono">${esc(r.hex)}</td><td class="mono">${esc(r.rgb)}</td><td class="mono">${esc(r.hsl)}</td></tr>`).join('\n')}
        </tbody>
      </table>
      <h2>Web-safe palette (216 colours)</h2>
      <div class="web-safe-grid">
${TABLES.webSafe.rows.map((hex) => `        <div class="web-safe-cell" style="background:${esc(hex)}" title="${esc(hex)}"><span>${esc(hex.slice(1).toUpperCase())}</span></div>`).join('\n')}
      </div>
      <h2>Alt codes (Windows — ALT + keypad number)</h2>
      <div class="alt-grid">
${TABLES.altCodes.rows.map(([code, char]) => `        <div class="alt-cell" title="ALT ${esc(code)}"><span class="alt-char">${code === '32' ? '·' : esc(char === ' ' ? '·' : char)}</span><span class="alt-code">${esc(code)}</span></div>`).join('\n')}
      </div>
      <h2>Standard normal (z-score) table — z = 0.00 to 3.99</h2>
      <p>Φ(z) is the fraction of the area of a bell curve to the left of z; φ(z) is the density at z. 1.96σ either side covers 95% of outcomes.</p>
      <div class="table-scroll z-table-scroll">
        <table>
          <thead><tr><th>z</th><th>Φ(z)</th><th>φ(z)</th></tr></thead>
          <tbody>
${TABLES.normalDist.rows.map(([z, cdf, pdf]) => {
            const hot = Math.abs(parseFloat(z) - 1.96) < 0.001 || Math.abs(parseFloat(z) - 0.00) < 0.001;
            return `            <tr${hot ? ' class="z-row-highlight"' : ''}><td class="mono">${esc(z)}</td><td class="mono">${esc(cdf)}</td><td class="mono">${esc(pdf)}</td></tr>`;
          }).join('\n')}
          </tbody>
        </table>
      </div>
      <h2>Copper wire — AWG (diameter, area, resistance)</h2>
      <p>Computed with d = 0.127 × 92^((36−n)/39) mm and ρ(Cu, 20 °C) = 1.68×10⁻⁸ Ω·m — matches published AWG tables.</p>
      <table>
        <thead><tr><th>AWG</th><th>Diameter (mm)</th><th>Area (mm²)</th><th>Resistance (Ω/km)</th></tr></thead>
        <tbody>
${TABLES.awgCopper.rows.map(([awg, d, a, r]) => `          <tr><td class="mono" style="font-weight:600">${esc(awg)}</td><td class="mono">${esc(d)}</td><td class="mono">${esc(a)}</td><td class="mono" style="color:var(--data)">${esc(r)}</td></tr>`).join('\n')}
        </tbody>
      </table>
      <h2>Resistor E-series (IEC 60063)</h2>
      <p>Printed code = digits × 10^n Ω with n the count of trailing zeros; e.g. 102 = 1,000 Ω, 47R = 47 Ω.</p>
      <div class="grid grid-5">
${TABLES.eseries.series.map((s) => `        <div class="panel">
          <h3 class="panel-title">${esc(s.label)}</h3>
          <div class="chips">${s.values.map((v) => `<span class="chip mono">${v}</span>`).join('')}</div>
        </div>`).join('\n')}
      </div>
      <h2>Common electronic components</h2>
      <table>
        <thead><tr><th>Component</th><th>Symbol</th><th>Unit</th><th>What it does</th></tr></thead>
        <tbody>
${COMPONENTS.map((c) => `          <tr><td><strong>${esc(c.name)}</strong></td><td class="mono">${esc(c.sym)}</td><td class="mono">${esc(c.unit)}</td><td>${esc(c.does)}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>`,
});

/* ASCII */
PAGES.push({
  path: '/ascii/index.html',
  hash: '/ascii',
  title: `ASCII table 0–127 — decimal, hex and binary | ${SITE}`,
  description: 'The full printable and control ASCII table with decimal, hexadecimal, octal and binary values, plus the positional expansion of each code.',
  jsonLd: graph([
    { '@type': 'TechArticle', '@id': `${ORIGIN}/ascii#article`, headline: 'ASCII table', description: 'ASCII codes 0–127 with decimal, hexadecimal and binary values.', inLanguage: 'en', isAccessibleForFree: true, author: { '@id': `${ORIGIN}/#organization` } },
  ]),
  body: (up) => `    ${nav(up, [{ label: 'Conversion', href: `${up}conversion/` }, { label: 'ASCII table' }])}
    <header class="page-head">
      <h1>ASCII table</h1>
      <p>The complete 0–127 table. Click any row in the interactive version to send that byte to the converter.</p>
    </header>
    <div class="panel">
      <div class="table-scroll">
        <table>
          <thead><tr><th>Dec</th><th>Char</th><th>Hex</th><th>Binary</th><th>Octal</th></tr></thead>
          <tbody>
${ASCII_128.map((r) => `            <tr><td class="mono">${String(r.dec).padStart(3, '0')}</td><td class="cell-char">${r.printable ? esc(r.char) : esc(r.char)}</td><td class="mono">${esc(r.hex)}</td><td class="mono">${esc(r.bin)}</td><td class="mono">${esc(r.oct)}</td></tr>`).join('\n')}
          </tbody>
        </table>
      </div>
    </div>`,
});

/* notepad + editor: thin pages, the value is in the app */
for (const page of [
  { path: '/convert/index.html', hash: '/convert', title: `Text & base converter | ${SITE}`, description: 'Convert text to hex, binary, decimal, octal and Base64 and back. 42 character encodings, live conversion, works offline.', topic: 'Conversion', topicHref: 'conversion/' },
  { path: '/notepad/index.html', hash: '/notepad', title: `Online Notepad | ${SITE}`, description: 'A browser-based notepad that autosaves locally. Nothing is uploaded and no account is needed.', topic: 'Web Tools', topicHref: 'web-tools/' },
  { path: '/html-editor/index.html', hash: '/html-editor', title: `HTML editor & viewer | ${SITE}`, description: 'Write HTML with a live sandboxed preview in your browser. No network fetches and scripts are blocked in the preview.', topic: 'Web Tools', topicHref: 'web-tools/' },
  { path: '/entities/index.html', hash: '/entities', title: `HTML entities reference | ${SITE}`, description: 'A copyable reference of HTML entities and numeric code formats.', topic: 'Web Tools', topicHref: 'web-tools/' },
  { path: '/about/index.html', hash: '/about', title: `About ${SITE}`, description: 'What HexKit is, how it works, and what it does with your data: everything runs locally in your browser.', topic: null, topicHref: null },
]) {
  const { path, hash, title, description, topic, topicHref } = page;
  PAGES.push({
    path,
    hash,
    title,
    description,
    jsonLd: graph([{ '@type': 'WebApplication', '@id': `${ORIGIN}${cleanPath(path)}#app`, name: title.split(' | ')[0], applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', url: `${ORIGIN}${cleanPath(path)}`, description, isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }]),
    body: (up) => `    ${nav(up, topic ? [{ label: topic, href: `${up}${topicHref}` }, { label: title.split(' | ')[0] }] : [{ label: title.split(' | ')[0] }])}
    <header class="page-head">
      <h1>${esc(title.split(' | ')[0])}</h1>
      <p>${esc(description)}</p>
    </header>
    <section class="panel prose">
      <p>This is a browser-based tool that runs locally. Enable JavaScript to use it, or <a href="${up}#${hash}">open the interactive version</a>.</p>
    </section>`,
  });
}

/* ── write ─────────────────────────────────────────────────────────────── */


/* category pages */

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
  ...WEB_TOOLS.map(t => ({ title: t.title, href: `#/web-tools/${t.slug}` })),
  { title: 'Online Calculator', href: '#/tool/scientific-calc' },
  { title: 'Online Notepad', href: '#/notepad' },
  { title: 'Password generator', href: '#/tool/password-generator' },
  { title: 'Random number generator', href: '#/tool/random-number' },
  { title: 'Text editor', href: '#/html-editor' },
];

{
  const body = (up) => `
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><span class="crumb-current">Calculators</span></nav>
    <section class="page-head"><h1>Online Calculators</h1><p>Free online calculators organized by topic.</p></section>
    ${CALC_CATEGORIES.map(cat => {
      const items = TOOLS.filter(t => t.group === cat.id);
      if (!items.length) return '';
      return `<section class="section"><div class="section-head"><h2>${esc(cat.title)}</h2><a href="#/calc/${esc(cat.id)}" style="font-size:14px">Open category →</a></div><ul class="link-list topic-list">${items.map(t => `<li><a href="#/tool/${esc(t.id)}">${esc(t.title)}</a></li>`).join('')}</ul></section>`;
    }).join('')}
  `;
  PAGES.push({
    path: '/calc/index.html', hash: '/calc',
    title: 'Calculators - HexKit',
    description: 'Math, electrical, financial, health, time and other calculators organized by topic.',
    priority: '0.9',
    jsonLd: graph([crumbsLd('/calc/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Calculators', href: '/calc/index.html' }])]),
    body,
  });
}

for (const cat of CALC_CATEGORIES) {
  const items = TOOLS.filter(t => t.group === cat.id);
  if (!items.length) continue;
  const body = (up) => `
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><a href="#/calc">Calculators</a><span class="crumb-sep">›</span><span class="crumb-current">${esc(cat.title)}</span></nav>
    <section class="page-head"><h1>${esc(cat.title)}</h1><p>${esc(cat.desc)}</p></section>
    <section class="section"><div class="grid grid-2">${items.map(t => `<a class="tool-card" href="#/tool/${esc(t.id)}"><span class="badge">${esc(cat.title)}</span><h3>${esc(t.title)}</h3><p>${esc(t.blurb || '')}</p></a>`).join('')}</div></section>
  `;
  PAGES.push({
    path: `/calc/${cat.id}/index.html`, hash: `/calc/${cat.id}`,
    title: `${cat.title} - HexKit`,
    description: cat.desc,
    priority: '0.8',
    jsonLd: graph([crumbsLd(`/calc/${cat.id}/index.html`, [{ name: 'Home', href: '/index.html' }, { name: 'Calculators', href: '/calc/index.html' }, { name: cat.title, href: `/calc/${cat.id}/index.html` }])]),
    body,
  });
}

{
  const body = (up) => `
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><span class="crumb-current">Conversion</span></nav>
    <section class="page-head"><h1>Unit Conversion</h1><p>Online unit converters organized by topic.</p></section>
    <section class="section"><div class="section-head"><h2>Conversion categories</h2></div><ul class="link-list topic-list">${CONVERSION_CATEGORIES.map(c => `<li><a href="#/units/${esc(c.id)}">${esc(c.title)}</a></li>`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Number & text conversion</h2></div><ul class="link-list topic-list"><li><a href="#/convert">Text, hex, binary, decimal, octal, Base64 converter</a></li><li><a href="#/ascii">ASCII table</a></li><li><a href="#/base">Number base converter</a></li></ul></section>
  `;
  PAGES.push({
    path: '/conversion/index.html', hash: '/conversion',
    title: 'Conversion - HexKit',
    description: 'Length, weight, temperature, area, volume, speed, power, energy and more unit converters.',
    priority: '0.9',
    jsonLd: graph([crumbsLd('/conversion/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Conversion', href: '/conversion/index.html' }])]),
    body,
  });
}

{
  const body = (up) => `
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><span class="crumb-current">Tools</span></nav>
    <section class="page-head"><h1>Online Tools</h1><p>Free browser-based online tools.</p></section>
    <section class="section"><ul class="link-list topic-list">${WEB_TOOLS_ALL.map(t => `<li><a href="${esc(t.href)}">${esc(t.title)}</a></li>`).join('')}</ul></section>
  `;
  PAGES.push({
    path: '/web-tools/index.html', hash: '/web-tools',
    title: 'Online Tools - HexKit',
    description: 'Alarm clock, stopwatch, timer, notepad, calculator, password generator, charts and more online tools.',
    priority: '0.9',
    jsonLd: graph([crumbsLd('/web-tools/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Tools', href: '/web-tools/index.html' }])]),
    body,
  });
}

for (const t of WEB_TOOLS) {
  const body = (up) => `
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><a href="#/web-tools">Tools</a><span class="crumb-sep">›</span><span class="crumb-current">${esc(t.title)}</span></nav>
    <section class="page-head"><h1>${esc(t.title)}</h1><p>${esc(t.title)} - online tool. This browser-based tool runs locally in your browser.</p></section>
    <section class="panel"><h2>About this tool</h2><p>Use ${esc(t.title)} in the interactive app. Some features may require browser permissions or device capabilities.</p><p><a class="btn btn-primary" href="#/web-tools/${esc(t.slug)}">Open ${esc(t.title)}</a></p></section>
  `;
  PAGES.push({
    path: `/web-tools/${t.slug}/index.html`, hash: `/web-tools/${t.slug}`,
    title: `${t.title} - Online Tools - HexKit`,
    description: `${t.title} online tool.`,
    priority: '0.7',
    jsonLd: graph([crumbsLd(`/web-tools/${t.slug}/index.html`, [{ name: 'Home', href: '/index.html' }, { name: 'Tools', href: '/web-tools/index.html' }, { name: t.title, href: `/web-tools/${t.slug}/index.html` }])]),
    body,
  });
}

{
  const mathTools = TOOLS.filter(t => t.group === 'math' || t.group === 'number');
  const mathArticles = Object.entries(ARTICLES).filter(([s,a]) => /math|algebra|calculus|exponent|log|quadratic|trig|number|fraction|percent|ratio|root|factor|prime|geometry|arithmetic/i.test(s + ' ' + a.title + ' ' + (a.kicker||'')));
  const body = (up) => `
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><span class="crumb-current">Math</span></nav>
    <section class="page-head"><h1>Math</h1><p>Math calculators, formulas, and reference - organized by topic.</p></section>
    <section class="section"><div class="section-head"><h2>Math calculators</h2></div><ul class="link-list topic-list">${mathTools.map(t => `<li><a href="#/tool/${esc(t.id)}">${esc(t.title)}</a></li>`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Math reference & formulas</h2></div><ul class="link-list topic-list">${mathArticles.map(([slug,a]) => `<li><a href="#/read/${esc(slug)}">${esc(a.title)}</a></li>`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Reference tables</h2></div><ul class="link-list topic-list"><li><a href="#/tables">Math and reference tables</a></li></ul></section>
  `;
  PAGES.push({
    path: '/math/index.html', hash: '/math',
    title: 'Math - HexKit',
    description: 'Math calculators, formulas and reference.',
    priority: '0.8',
    jsonLd: graph([crumbsLd('/math/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Math', href: '/math/index.html' }])]),
    body,
  });
}

{
  const elecTools = TOOLS.filter(t => t.group === 'electrical' || t.group === 'wire');
  const elecArticles = Object.entries(ARTICLES).filter(([s,a]) => /electric|volt|current|ohm|amp|watt|circuit|resist|capacitor|inductor|power|kirchhoff|coulomb|kva|kwh|joule/i.test(s + ' ' + a.title + ' ' + (a.kicker||'')));
  const elecUnits = ['voltage','current','resistance','power','energy','charge','capacitance','inductance','frequency'];
  const body = (up) => `
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span class="crumb-sep">›</span><span class="crumb-current">Electricity</span></nav>
    <section class="page-head"><h1>Electricity & Electronics</h1><p>Electrical calculators, formulas, symbols, and reference - organized by topic.</p></section>
    <section class="section"><div class="section-head"><h2>Electrical calculators</h2></div><ul class="link-list topic-list">${elecTools.map(t => `<li><a href="#/tool/${esc(t.id)}">${esc(t.title)}</a></li>`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Electrical unit conversions</h2></div><ul class="link-list topic-list">${elecUnits.filter(id=>FAMILIES[id]).map(id => `<li><a href="#/units/${esc(id)}">${esc(FAMILIES[id].title)} conversion</a></li>`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Electrical articles & formulas</h2></div><ul class="link-list topic-list">${elecArticles.map(([slug,a]) => `<li><a href="#/read/${esc(slug)}">${esc(a.title)}</a></li>`).join('')}</ul></section>
    <section class="section"><div class="section-head"><h2>Electrical reference</h2></div><ul class="link-list topic-list"><li><a href="#/symbols">Electrical & electronic symbols</a></li><li><a href="#/glossary">Electrical glossary & definitions</a></li><li><a href="#/tables">Reference tables (resistor colors, wire gauge, etc.)</a></li></ul></section>
  `;
  PAGES.push({
    path: '/electricity/index.html', hash: '/electricity',
    title: 'Electricity - HexKit',
    description: 'Electrical calculators, unit conversions, formulas, symbols and reference.',
    priority: '0.8',
    jsonLd: graph([crumbsLd('/electricity/index.html', [{ name: 'Home', href: '/index.html' }, { name: 'Electricity', href: '/electricity/index.html' }])]),
    body,
  });
}


let written = 0;
const sitemap = [];

for (const page of PAGES) {
  // The home page is hand-authored in index.html: it is the only page that
  // needs no rewrite, and keeping it authored means the app shell, the
  // navigation and the static home copy stay in one reviewable file.
  if (page.path === '/index.html') {
    sitemap.push({ loc: `${ORIGIN}/`, priority: '1.0' });
    continue;
  }

  const html = shell({
    path: page.path,
    hash: page.hash,
    title: page.title,
    description: page.description,
    body: page.body(upFor(page.path)),
    jsonLd: page.jsonLd,
  });
  const file = join(outRoot, page.path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, 'utf8');
  written++;
  const urlPath = cleanPath(page.path);
  sitemap.push({
    loc: `${ORIGIN}${urlPath}`,
    priority: urlPath.startsWith('/read/') || urlPath.startsWith('/tool/') ? '0.7' : '0.8',
  });
}

// sitemap.xml and robots.txt

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(outRoot, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`, 'utf8');

writeFileSync(join(outRoot, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /js/
Disallow: /css/

Sitemap: ${ORIGIN}/sitemap.xml
`, 'utf8');

console.log(`Prerendered ${written} pages into the site root`);
console.log(`  ${N_TOOLS} calculator pages`);
console.log(`  ${Object.keys(ARTICLES).length} articles`);
console.log(`  ${Object.keys(GLOSSARY).length} glossary entries`);
console.log(`  ${N_FAMILIES + 1} unit pages`);
console.log('  sitemap.xml + robots.txt');