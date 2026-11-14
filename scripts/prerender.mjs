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
    <nav class="site-nav" id="siteNav" aria-label="Primary" hidden>
      <a href="${up}#/convert">Converter</a>
      <a href="${up}#/tools">Calculators</a>
      <a href="${up}#/units">Units</a>
      <a href="${up}#/learn">Reference</a>
      <a href="${up}#/notepad">Notepad</a>
      <button class="btn btn-sm btn-ghost" id="themeToggle" type="button" aria-label="Toggle colour theme">◐ Theme</button>
      <button class="btn btn-sm btn-ghost" id="installBtn" type="button" hidden>⬇ Install</button>
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
  title: `All ${TOOLS.length} free calculators — ${SITE}`,
  description: `${TOOLS.length} calculators across electrical, mathematical, financial, colour, text and general tools. Each shows its working and works offline.`,
  jsonLd: graph([
    { '@type': 'CollectionPage', '@id': `${ORIGIN}/tools#page`, name: `All ${TOOLS.length} calculators`, isPartOf: { '@id': `${ORIGIN}/#website` } },
    {
      '@type': 'ItemList',
      '@id': `${ORIGIN}/tools#list`,
      name: 'Calculators',
      numberOfItems: TOOLS.length,
      itemListElement: TOOLS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.title, url: `${ORIGIN}/tool/${t.id}/` })),
    },
  ]),
  body: (up) => `    ${nav(up, [{ label: 'Calculators' }])}
    <header class="page-head">
      <h1>All ${N_TOOLS} calculators</h1>
      <p>Every one shows its working, keeps its state in the URL, and runs with no network connection.</p>
    </header>
${GROUPS.map((g) => {
    const list = TOOLS.filter((t) => t.group === g.id);
    if (!list.length) return '';
    return `    <section class="section">
      <h2 class="panel-title">${esc(g.title)}</h2>
      <ul>
${list.map((t) => `        <li><a href="${up}tool/${t.id}/">${esc(t.title)}</a> — ${esc(t.blurb)}</li>`).join('\n')}
      </ul>
    </section>`;
  }).join('\n')}`,
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
  title: `Electrical & computing formulas, terms and symbols — ${SITE}`,
  description: 'A reference library: Ohm’s law, Kirchhoff’s laws, Coulomb’s law, power factor, wire gauge, number bases and ASCII — each with a definition, intuition and formula.',
  jsonLd: graph([
    { '@type': 'CollectionPage', '@id': `${ORIGIN}/learn#page`, name: 'Reference library', isPartOf: { '@id': `${ORIGIN}/#website` } },
    { '@type': 'ItemList', '@id': `${ORIGIN}/learn#list`, numberOfItems: Object.keys(ARTICLES).length, itemListElement: Object.entries(ARTICLES).map(([slug, a], i) => ({ '@type': 'ListItem', position: i + 1, name: a.title, url: `${ORIGIN}/read/${slug}/` })) },
  ]),
  body: (up) => `    ${nav(up, [{ label: 'Reference' }])}
    <header class="page-head">
      <h1>Formulas, terms and symbols</h1>
      <p>Every entry gives the definition, the intuition, the formula with each symbol defined,
         and a calculator that solves it.</p>
    </header>
    <section class="panel prose">
      <ul>
${Object.entries(ARTICLES).map(([slug, a]) => `        <li><a href="${up}read/${slug}/">${esc(a.title)}</a> — ${esc(a.summary)}</li>`).join('\n')}
      </ul>
    </section>`,
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
      crumbsLd(cleanPath(path), [{ name: 'Home', href: '/' }, { name: 'Glossary', href: '/glossary/' }, { name: g.term, href: cleanPath(path) }]),
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
  body: (up) => `    ${nav(up, [{ label: 'Units' }])}
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
      crumbsLd(cleanPath(path), [{ name: 'Home', href: '/' }, { name: 'Units', href: '/units/' }, { name: F.title, href: cleanPath(path) }]),
    ]),
    body: (up) => `    ${nav(up, [{ label: 'Units', href: `${up}units/` }, { label: F.title }])}
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
  description: 'Resistor, capacitor, inductor, diode, transistor, ground, switch and more, drawn to the IEC/ANSI convention with each symbol explained.',
  jsonLd: graph([
    { '@type': 'TechArticle', '@id': `${ORIGIN}/symbols#article`, headline: 'Electrical circuit symbols', description: 'A reference of circuit symbols drawn to the IEC/ANSI convention.', inLanguage: 'en', isAccessibleForFree: true, author: { '@id': `${ORIGIN}/#organization` } },
  ]),
  body: (up) => `    ${nav(up, [{ label: 'Reference', href: `${up}learn/` }, { label: 'Circuit symbols' }])}
    <header class="page-head">
      <h1>Circuit symbols</h1>
      <p>Each symbol below is drawn from the IEC/ANSI convention, so it reads the way a schematic on the bench would.</p>
    </header>
    <section class="panel prose">
      <h2>Resistive and control elements</h2>
      <ul>
        <li><strong>Resistor (IEC box):</strong> a rectangle. (ANSI zig-zag) a sawtooth. Both mean the same thing.</li>
        <li><strong>Potentiometer:</strong> a resistor with an arrow meeting it partway along — an adjustable divider.</li>
        <li><strong>DIP switch:</strong> a bank of tiny switches in one dual-in-line package — set once at configuration time, not a daily switch.</li>
        <li><strong>Solder bridge:</strong> a deliberate solder dot across two pads — a zero-cost 0 Ω jumper for board variant selection.</li>
        <li><strong>Fuse:</strong> a straight conductor inside a rectangle. It melts open above its rating.</li>
        <li><strong>Switch:</strong> a hinged blade and a contact dot.</li>
      </ul>
      <h2>Energy storage</h2>
      <ul>
        <li><strong>Capacitor:</strong> two parallel plates. A curved second plate marks a polarised part, which must not be reversed.</li>
        <li><strong>Inductor:</strong> a coil. Parallel bars through it indicate a ferrite or iron core.</li>
      </ul>
      <h2>Semiconductors</h2>
      <ul>
        <li><strong>Diode:</strong> a triangle pointing at a bar. Current flows toward the bar only.</li>
        <li><strong>Zener:</strong> the same, with a bent cathode bar — it conducts in reverse at a defined voltage.</li>
        <li><strong>LED:</strong> a diode with arrows leaving it.</li>
        <li><strong>Transistor:</strong> a base bar with emitter and collector legs; the arrow direction distinguishes NPN from PNP.</li>
      </ul>
      <h2>Sources and returns</h2>
      <ul>
        <li><strong>Battery cell:</strong> one long plate and one short — long is positive.</li>
        <li><strong>Ground:</strong> three bars of decreasing width. A fourth, hatched symbol is protective earth.</li>
      </ul>
    </section>
    <p style="margin-top:22px"><a href="${up}#/symbols">See the interactive symbol browser →</a></p>`,
});

/* reference tables */
PAGES.push({
  path: '/tables/index.html',
  hash: '/tables',
  title: `Multiplication, logs, roman numerals &amp; colours tables | ${SITE}`,
  description: 'Multiplication and addition tables, logarithm tables, roman-numerals chart, °C↔°F reference, the 216-colour web-safe palette, named CSS colours, resistor colour code and wire current capacity.',
  jsonLd: graph([
    { '@type': 'TechArticle', '@id': `${ORIGIN}/tables#article`, headline: 'Reference tables — multiplication, logs, roman numerals, colours, temperature, resistor', description: 'Multiplication, addition, logarithm and roman-numeral tables, °C↔°F chart, named CSS colours and the 216-colour web-safe palette, alongside the resistor colour code, resistivity and wire current capacity.', inLanguage: 'en', isAccessibleForFree: true, author: { '@id': `${ORIGIN}/#organization` } },
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
  body: (up) => `    ${nav(up, [{ label: 'Reference', href: `${up}learn/` }, { label: 'ASCII table' }])}
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
for (const [path, hash, title, description] of [
  ['/notepad/index.html', '/notepad', `Online notepad — private, autosaving | ${SITE}`, 'A scratchpad that autosaves to your browser only. Nothing is uploaded and no account is needed.'],
  ['/html-editor/index.html', '/html-editor', `HTML editor & viewer with live preview | ${SITE}`, 'Write HTML with a live sandboxed preview. Nothing is fetched over the network and scripts are blocked in the preview.'],
  ['/entities/index.html', '/entities', `HTML entities & colour code reference | ${SITE}`, 'A copyable reference of HTML entities and numeric colour code formats.'],
  ['/convert/index.html', '/convert', `Text to hex, binary, decimal, octal & Base64 | ${SITE}`, 'Convert text to any base and back. 42 character encodings, live conversion, works offline.'],
  ['/about/index.html', '/about', `About ${SITE} — offline converters and calculators`, 'What HexKit is, how it works, and what it does with your data: nothing.'],
]) {
  PAGES.push({
    path,
    hash,
    title,
    description,
    jsonLd: graph([{ '@type': 'WebApplication', '@id': `${ORIGIN}${cleanPath(path)}#app`, name: title.split(' — ')[0], applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', url: `${ORIGIN}${cleanPath(path)}`, description, isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }]),
    body: (up) => `    ${nav(up, [{ label: title.split(' — ')[0] }])}
    <header class="page-head">
      <h1>${esc(title.split(' — ')[0])}</h1>
      <p>${esc(description)}</p>
    </header>
    <section class="panel prose">
      <p>Enable JavaScript to use this page, or <a href="${up}#${hash}">open the interactive version</a>.</p>
    </section>`,
  });
}

/* ── write ─────────────────────────────────────────────────────────────── */

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