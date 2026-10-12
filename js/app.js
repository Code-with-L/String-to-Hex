/** Application bootstrap: theme, router wiring, PWA install, shortcuts. */

import { $, mount, toast, loadState, saveState } from './ui/dom.js';
import { startRouter, onRoute, navigate, currentRoute } from './ui/router.js';
import {
  viewHome, viewConvert, viewTool, viewTools, viewUnits, viewAscii, viewBase, viewAbout, notFound,
} from './ui/views.js';
import { FORMATS } from './data/formats.js';
import { TOOLS, TOOL_BY_ID } from './data/tools.js';
import { FAMILIES } from './data/units.js';

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
  document.title = titleFor(route);
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
  if (head === 'about') return `About — ${base}`;
  return base;
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
    navigator.serviceWorker.register('sw.js').catch((err) => console.warn('[sw]', err.message));
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
