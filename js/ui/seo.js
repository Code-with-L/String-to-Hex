/**
 * Runtime SEO: per-route metadata and JSON-LD structured data.
 *
 * The hash router means crawlers only ever see index.html, so the prerenderer
 * (scripts/prerender.mjs) bakes the same markup into real files. This module
 * keeps the live DOM in sync for humans and for any crawler that does render
 * JavaScript.
 */

import { TOOLS, TOOL_BY_ID } from '../data/tools.js';
import { FAMILIES, FAMILY_IDS } from '../data/units.js';
import { FORMATS, ENCODINGS } from '../data/formats.js';
import { ARTICLES, GLOSSARY } from '../data/reference.js';

const N_TOOLS = TOOLS.length;
const N_FAMILIES = FAMILY_IDS.length;
const N_UNITS = FAMILY_IDS.reduce((a, f) => a + Object.keys(FAMILIES[f].units).length, 0);
const N_ENCODINGS = ENCODINGS.length;

export const SITE = {
  name: 'HexKit',
  tagline: 'String to hex, and every other base',
  description: `Convert text to hex, binary, decimal, octal and Base64. ${N_TOOLS} calculators, ${N_FAMILIES} unit families and a reference library. Offline-first and free.`,
  repo: 'https://github.com/Code-with-L/String-to-Hex',
};

// GitHub Pages serves this project from a sub-path, so the site root is one
// level above js/ui/ — deriving it from the module URL works on any host,
// including a plain file server or a project fork.
const ROOT = new URL('../../', import.meta.url).href.replace(/\/$/, '');
const origin = () => ROOT;

/** Deep link for a hash route — what a human shares or bookmarks. */
export const routeUrl = (route) => {
  const [head, sub] = route.segments;
  const seg = head ? (sub ? `${head}/${sub}` : head) : '';
  return `${origin()}/#/${seg}`;
};

/**
 * Search-engine-facing path (no hash), matching what prerender.mjs writes as
 * real files: /tools/, /tool/ohms-law/, /read/ohms-law/, and / for the home.
 */
export const pathFor = (route) => {
  const [head, sub] = route.segments;
  if (!head) return '/';
  return `/${sub ? `${head}/${sub}` : head}/`;
};

const META_IDS = ['seo:description', 'seo:canonical', 'seo:og:title', 'seo:og:description',
  'seo:og:url', 'seo:twitter:title', 'seo:twitter:description', 'seo:jsonld'];

/**
 * Open Graph and Twitter tags are read by `property`, not `name`, by most
 * crawlers — a name-only og:title is simply ignored.
 */
function upsertMeta(name, attrs, attribute = 'name') {
  let node = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attribute, name);
    document.head.append(node);
  }
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

const og = (name, attrs) => upsertMeta(`og:${name}`, attrs, 'property');
const tw = (name, attrs) => upsertMeta(`twitter:${name}`, attrs);

function upsertLink(rel, href) {
  let node = document.querySelector(`link[rel="${rel}"]`);
  if (!node) {
    node = document.createElement('link');
    node.setAttribute('rel', rel);
    document.head.append(node);
  }
  node.setAttribute('href', href);
  return node;
}

/* ── JSON-LD graph ──────────────────────────────────────────────────────── */

export function buildJsonLd(route, title, description) {
  const url = routeUrl(route);
  // Structured data should describe the indexable page, not the hash view.
  const canonical = `${origin()}${pathFor(route)}`;
  const [head, sub] = route.segments;
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${origin()}/#organization`,
      name: SITE.name,
      url: origin(),
      logo: `${origin()}/icons/icon-512.png`,
    },
    {
      '@type': 'WebSite',
      '@id': `${origin()}/#website`,
      name: SITE.name,
      url: origin(),
      description: SITE.description,
      inLanguage: 'en',
      publisher: { '@id': `${origin()}/#organization` },
    },
  ];

  const crumbs = [{ name: 'Home', item: `${origin()}/` }];
  const label = (seg) => (seg === 'tools' ? 'Calculators'
    : seg === 'convert' ? 'Converter'
      : seg === 'units' ? 'Unit converters'
        : seg === 'read' ? 'Reference'
          : seg === 'glossary' ? 'Glossary'
            : seg[0].toUpperCase() + seg.slice(1));

  if (head) {
    // Breadcrumbs point at the static, indexable paths rather than hash URLs.
    crumbs.push({ name: label(head), item: `${origin()}/${head}/` });
    if (sub) crumbs.push({ name: sub, item: `${origin()}/${head}/${sub}/` });
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item })),
    });
  }

  if (!head) {
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${origin()}/#app`,
      name: SITE.name,
      url: origin(),
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript, ES modules and BigInt',
      description: SITE.description,
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      softwareVersion: '1.0.0',
      author: { '@id': `${origin()}/#organization` },
      featureList: [
        `Text, hex, binary, decimal, octal and Base64 — ${FORMATS.length ** 2} ordered format pairs`,
        `${TOOLS.length} calculators and engineering formulas`,
        `${FAMILY_IDS.length} unit families with ${FAMILY_IDS.reduce((a, f) => a + Object.keys(FAMILIES[f].units).length, 0)} units`,
        `${N_ENCODINGS} character encodings`,
        'Works fully offline and installs as an app',
        'No account, no upload, no tracking',
      ],
    });
    graph.push({
      '@type': 'ItemList',
      '@id': `${origin()}/#tools`,
      name: 'Calculators',
      numberOfItems: TOOLS.length,
      itemListElement: TOOLS.map((t, i) => ({
        '@type': 'ListItem', position: i + 1, name: t.title, url: `${origin()}/tool/${t.id}/`,
      })),
    });
  }

  if (head === 'tool' && TOOL_BY_ID[sub]) {
    const t = TOOL_BY_ID[sub];
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${canonical}#app`,
      name: `${t.title} — ${SITE.name}`,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      url: canonical,
      description: t.blurb,
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: [t.blurb, 'Runs entirely in your browser', 'Works offline'],
    });
    graph.push({
      '@type': 'HowTo',
      '@id': `${canonical}#howto`,
      name: `How to use the ${t.title}`,
      description: t.blurb,
      step: [
        { '@type': 'HowToStep', position: 1, text: 'Open the calculator and fill in the input fields.' },
        { '@type': 'HowToStep', position: 2, text: 'Results update as you type; the working is shown beneath.' },
        { '@type': 'HowToStep', position: 3, text: 'Copy the result or share the permalink in the address bar.' },
      ],
    });
  }

  if (head === 'read' && ARTICLES[sub]) {
    const a = ARTICLES[sub];
    graph.push({
      '@type': 'TechArticle',
      '@id': `${canonical}#article`,
      headline: a.title,
      description: a.summary,
      articleSection: a.kicker,
      inLanguage: 'en',
      isAccessibleForFree: true,
      author: { '@id': `${origin()}/#organization` },
      publisher: { '@id': `${origin()}/#organization` },
      mainEntityOfPage: canonical,
    });
    const faq = (a.blocks ?? []).filter((b) => b.k === 'definition' || b.k === 'h3').slice(0, 5);
    if (faq.length) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: faq.map((b) => ({
          '@type': 'Question',
          name: b.k === 'h3' ? b.t : `${a.title} definition`,
          acceptedAnswer: { '@type': 'Answer', text: b.k === 'h3' ? b.t : b.t },
        })),
      });
    }
  }

  if (head === 'glossary' && !sub) {
    graph.push({
      '@type': 'DefinedTermSet',
      '@id': `${canonical}#terms`,
      name: `${SITE.name} glossary`,
      description: `Definitions for ${Object.keys(GLOSSARY).length} electrical, circuit, unit and computing terms.`,
      hasDefinedTerm: Object.entries(GLOSSARY).map(([k, g]) => ({
        '@type': 'DefinedTerm',
        '@id': `${origin()}/glossary/${k}/#term`,
        name: g.term,
        description: g.def,
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/* ── public entry point ─────────────────────────────────────────────────── */

export function setMeta({ route, title, description }) {
  const url = routeUrl(route);
  const full = title.includes(SITE.name) ? title : `${title} — ${SITE.name}`;

  document.title = full;
  upsertMeta('description', { content: description });
  upsertMeta('keywords', {
    content: 'hex converter, string to hex, binary to hex, ascii, base64, unit converter, calculator, offline, pwa',
  });

  upsertLink('canonical', `${origin()}${pathFor(route)}`);

  og('type', { content: 'website' });
  og('site_name', { content: SITE.name });
  og('title', { content: full });
  og('description', { content: description });
  og('url', { content: url });
  og('image', { content: `${origin()}/icons/og.png` });
  og('image:width', { content: '1200' });
  og('image:height', { content: '630' });

  tw('card', { content: 'summary_large_image' });
  tw('title', { content: full });
  tw('description', { content: description });
  tw('image', { content: `${origin()}/icons/og.png` });

  const ld = buildJsonLd(route, full, description);
  let node = document.getElementById('seo:jsonld');
  if (!node) {
    node = document.createElement('script');
    node.type = 'application/ld+json';
    node.id = 'seo:jsonld';
    document.head.append(node);
  }
  node.textContent = JSON.stringify(ld);
}