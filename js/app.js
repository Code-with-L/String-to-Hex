/** Application bootstrap: theme, router wiring, PWA install, shortcuts. */

import { $, mount, toast, loadState, saveState } from './ui/dom.js';
import { startRouter, onRoute, navigate, currentRoute } from './ui/router.js';
import {
  viewConvert, viewTool, viewTools, viewUnits, viewAscii, viewBase, viewAbout, notFound,
} from './ui/views.js';
import {
  viewHome, viewLearn, viewArticle, viewGlossary, viewGlossaryEntry, viewSymbols, viewTables,
} from './ui/content.js';
import { viewNotepad, viewHtmlEditor, viewEntities } from './ui/tools.js';
import { FORMATS } from './data/formats.js';
import { TOOLS, TOOL_BY_ID } from './data/tools.js';
import { FAMILIES, FAMILY_IDS } from './data/units.js';
import { ARTICLES, GLOSSARY } from './data/reference.js';
import { setMeta } from './ui/seo.js';

const state = loadState();
const view = $('#view');

/* ── theme ──────────────────────────────────────────────────────────────── */

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f6f8fc' : '#0a0c12');
}

applyTheme(state.settings.theme);
matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  if (!localStorage.getItem('hexkit.v1')) applyTheme(e.matches ? 'light' : 'dark');
});

const toggleTheme = () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  state.settings.theme = next;
  applyTheme(next);
  saveState(state);
};
$('#themeToggle').addEventListener('click', toggleTheme);

/* ── navigation menu ────────────────────────────────────────────────────── */

const navToggle = $('#navToggle');
const siteNav = $('#siteNav');
const wideEnough = matchMedia('(min-width: 861px)');

// The nav ships hidden so that a narrow viewport does not open with a
// full-screen menu covering the page; wide viewports reveal it immediately.
const applyNavMode = () => {
  if (wideEnough.matches) {
    siteNav.removeAttribute('hidden');
    navToggle.setAttribute('aria-expanded', 'false');
  } else {
    siteNav.setAttribute('hidden', '');
    navToggle.setAttribute('aria-expanded', 'false');
  }
};
applyNavMode();
wideEnough.addEventListener('change', applyNavMode);

navToggle.addEventListener('click', () => {
  const open = siteNav.hasAttribute('hidden');
  if (open) siteNav.removeAttribute('hidden'); else siteNav.setAttribute('hidden', '');
  navToggle.setAttribute('aria-expanded', String(open));
});
siteNav.addEventListener('click', (e) => {
  if (e.target.closest('a') && !wideEnough.matches) {
    siteNav.setAttribute('hidden', '');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ── routing ────────────────────────────────────────────────────────────── */

/** Legacy `foo-to-bar.html` style URLs map onto the unit converter. */
function parseLegacy(path, query) {
  const [raw, ...rest] = path.split('/');
  const m = /^(.+?)-to-(.+)$/.exec(raw ?? '');
  if (!m) return null;
  const [, from, to] = m;
  for (const [fam, F] of Object.entries(FAMILIES)) {
    if (F.units[from] && F.units[to]) {
      return { kind: 'legacy-unit', family: fam, from, to, x: query.get('x') };
    }
  }
  if (FORMATS.some((f) => f.id === from) && FORMATS.some((f) => f.id === to)) {
    return { kind: 'legacy-format', from, to };
  }
  void rest;
  return null;
}

function render(route) {
  const [head] = route.segments;
  let node;

  switch (head) {
    case undefined:
      node = viewHome();
      break;
    case 'convert':
      node = viewConvert(route);
      break;
    case 'tools':
      node = viewTools(route);
      break;
    case 'tool':
      node = viewTool(route);
      break;
    case 'units':
      node = viewUnits(route);
      break;
    case 'ascii':
      node = viewAscii();
      break;
    case 'base':
      node = viewBase();
      break;
    case 'learn':
      node = viewLearn();
      break;
    case 'read':
      node = viewArticle(route.segments[1]);
      break;
    case 'glossary':
      node = route.segments[1] ? viewGlossaryEntry(route.segments[1]) : viewGlossary();
      break;
    case 'symbols':
      node = viewSymbols();
      break;
    case 'tables':
    case 'resistor-colours':
      node = viewTables();
      break;
    case 'notepad':
      node = viewNotepad();
      break;
    case 'html-editor':
      node = viewHtmlEditor();
      break;
    case 'entities':
      node = viewEntities();
      break;
    case 'about':
      node = viewAbout();
      break;
    default: {
      const legacy = parseLegacy(route.segments.join('/'), route.query);
      if (legacy?.kind === 'legacy-format') {
        navigate(`/convert?from=${legacy.from}&to=${legacy.to}`, { replace: true });
        return;
      }
      if (legacy?.kind === 'legacy-unit') {
        navigate(`/convert?from=text&to=hex&family=${legacy.family}&x=${legacy.x ?? ''}`, { replace: true });
        return;
      }
      if (TOOL_BY_ID[head]) { navigate(`/tool/${head}`, { replace: true }); return; }
      node = notFound();
    }
  }

  mount(view, node);
  updateMeta(route, node);
  for (const a of siteNav.querySelectorAll('a')) {
    const href = a.getAttribute('href').slice(1);
    const active = href === route.path || (head && href.startsWith(`#/${head}`));
    if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  }
  if (!route.segments.length) view.scrollIntoView?.();
  else window.scrollTo({ top: 0, behavior: 'instant' });
}

function titleFor(route) {
  const [head, sub] = route.segments;
  const base = 'HexKit';
  if (!head) return 'HexKit — String to Hex, Binary & Every Base Converter';
  if (head === 'convert') return `Text ⇄ Hex & Bases — ${base}`;
  if (head === 'tools') return `All ${TOOLS.length} calculators — ${base}`;
  if (head === 'tool') return `${TOOL_BY_ID[sub]?.title ?? 'Calculator'} — ${base}`;
  if (head === 'units') return `${FAMILIES[sub]?.title ?? 'Units'} converters — ${base}`;
  if (head === 'ascii') return `ASCII table & byte breakdown — ${base}`;
  if (head === 'base') return `Number bases — ${base}`;
  if (head === 'learn') return `Formulas, terms and symbols — ${base}`;
  if (head === 'read') return `${ARTICLES[sub]?.title ?? 'Reference'} — ${base}`;
  if (head === 'glossary') return `Glossary — ${base}`;
  if (head === 'symbols') return `Circuit symbols — ${base}`;
  if (head === 'tables') return `Reference tables — ${base}`;
  if (head === 'notepad') return `Online notepad — ${base}`;
  if (head === 'html-editor') return `HTML editor & viewer — ${base}`;
  if (head === 'entities') return `HTML entities & colour codes — ${base}`;
  if (head === 'about') return `About — ${base}`;
  return base;
}

const updateMeta = (route, node) => setMeta({
  route,
  title: node.pageTitle ?? titleFor(route),
  description: node.pageDescription ?? defaultDescription(route),
});

function defaultDescription(route) {
  const [head, sub] = route.segments;
  if (head === 'tool') return `${TOOL_BY_ID[sub]?.blurb ?? ''} Free offline calculator by HexKit.`;
  if (head === 'units') return `Convert every pair of ${(FAMILIES[sub]?.title ?? 'unit').toLowerCase()} with exact reference factors.`;
  if (head === 'convert') return 'Convert text to hex, binary, decimal, octal or Base64 in your browser. 42 encodings, live conversion, works offline.';
  return `HexKit: string-to-hex and base conversion, ${TOOLS.length} calculators, ${FAMILY_IDS.length} unit families and a reference library. Offline-first, no sign-up, nothing uploaded.`;
}

onRoute(render);
startRouter();

/* ── keyboard shortcuts ─────────────────────────────────────────────────── */

addEventListener('keydown', (e) => {
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key === '/') { e.preventDefault(); toggleTheme(); return; }
  if (mod && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    navigate('/convert');
    setTimeout(() => $('#c-in')?.focus(), 60);
    return;
  }
  if (mod && e.key === 'Enter') {
    const out = $('#c-out');
    if (out?.value) { e.preventDefault(); navigator.clipboard?.writeText(out.value).then(() => toast('Output copied')).catch(() => {}); }
  }
});

/* ── service worker ─────────────────────────────────────────────────────── */

if ('serviceWorker' in navigator) {
  addEventListener('load', () => {
    // Resolved against the module URL, not the document: a prerendered page at
    // /tool/ohms-law/ must still register the worker at the site root.
    const sw = new URL('../sw.js', import.meta.url);
    navigator.serviceWorker.register(sw, { scope: new URL('../', import.meta.url) })
      .catch((err) => console.warn('[sw]', err.message));
  });
}

let deferredPrompt = null;
const installBtn = $('#installBtn');

addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) {
    toast('Use your browser menu → “Install app” / “Add to Home Screen”.', 3600);
    return;
  }
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') { toast('Installing HexKit…'); installBtn.hidden = true; }
  deferredPrompt = null;
});

addEventListener('appinstalled', () => { installBtn.hidden = true; toast('HexKit installed.'); });
