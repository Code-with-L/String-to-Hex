/**
 * UI icons and circuit symbols.
 *
 * Circuit symbols are sourced from Wikimedia Commons (see js/data/symbols.js
 * and SYMBOLS.md for per-file attribution/licenses). Assets live in
 * assets/symbols/ and are rendered as SVG images (no hand-drawn paths).
 */

import { SYMBOLS as SYMBOL_DATA, SYMBOL_GROUPS, SYMBOL_NAMES, SYMBOL_ASSET_BASE } from '../data/symbols.js';
import { SYMBOL_INLINE } from '../data/symbol-inline.generated.js';

export { SYMBOL_DATA as SYMBOL_META, SYMBOL_GROUPS, SYMBOL_NAMES };

const SYMBOL_NS = 'http://www.w3.org/2000/svg';

function createSymbolNode(k, s) {
  const inl = SYMBOL_INLINE?.[k];
  if (inl && inl.inner) {
    const svg = document.createElementNS(SYMBOL_NS, 'svg');
    svg.setAttribute('viewBox', inl.viewBox || '0 0 100 60');
    svg.setAttribute('class', 'symbol-svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', s.label);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.innerHTML = inl.inner;
    return svg;
  }
  const img = document.createElement('img');
  img.src = SYMBOL_ASSET_BASE + s.file;
  img.alt = s.label;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.className = 'symbol-img';
  img.setAttribute('role', 'img');
  return img;
}

/* ── circuit symbols (inline Commons-sourced SVG geometry preferred) ── */

export const SYMBOLS = Object.fromEntries(Object.entries(SYMBOL_DATA).map(([k, s]) => [k, {
  ...s,
  get svg() { return createSymbolNode(k, s); },
}]));

export function symbolAssetUrl(key, base = '') {
  const s = SYMBOL_DATA[key];
  return s ? `${base}${SYMBOL_ASSET_BASE}${s.file}` : '';
}

export function symbolMarkup(key, base = '') {
  const s = SYMBOL_DATA[key];
  if (!s) return '';
  const inl = SYMBOL_INLINE?.[key];
  if (inl && inl.inner) {
    const vb = inl.viewBox || '0 0 100 60';
    return `<svg class="symbol-svg" viewBox="${vb}" role="img" aria-label="${s.label}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inl.inner}</svg>`;
  }
  return `<img class="symbol-img" src="${base}${SYMBOL_ASSET_BASE}${s.file}" alt="${s.label}" loading="lazy">`;
}

/* ── UI glyphs ────────────────────────────────────────────────────────── */

const ICONS = {
  bolt: 'M13 2 4 14h6l-1 8 9-12h-6l1-8z',
  sigma: 'M18 4H6l6 8-6 8h12M6 4h12',
  hash: 'M4 9h16M4 15h16M10 3 8 21M16 3l-2 18',
  palette: 'M12 3a9 9 0 1 0 0 18h1.5a1.5 1.5 0 0 0 0-3H12a2 2 0 0 1 0-4h3a6 6 0 0 0 0-12z',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6M14 4l-4 16',
  chart: 'M4 20V10m5 10V4m5 16v-7m5 7V7',
  heart: 'M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4v5l3 2',
  cable: 'M4 8h6v8H4zM14 8h6v8h-6zM10 12h4M8 8v8M16 8v8',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  book: 'M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 0-2 2zm15 0h1v16h-1',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm5 12 5 5',
  swap: 'M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4m4 4H7',
  copy: 'M8 8h12v12H8zM4 16V4h12',
  download: 'M12 4v11m-4-4 4 4 4-4M4 19h16',
  upload: 'M12 20V9m-4 4 4-4 4 4M4 5h16',
  check: 'm4 13 5 5L20 7',
  chevron: 'm9 5 7 7-7 7',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 5v.5M12 11v6',
  warn: 'M12 4 2 20h20L12 4zm0 6v5m0 3v.5',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm8 3a8 8 0 0 0-.2-1.8l2-1.5-2-3.4-2.3 1a8 8 0 0 0-3-1.8L14 2h-4l-.5 2.5a8 8 0 0 0-3 1.8l-2.3-1-2 3.4 2 1.5a8 8 0 0 0 0 3.6l-2 1.5 2 3.4 2.3-1a8 8 0 0 0 3 1.8L10 22h4l.5-2.5a8 8 0 0 0 3-1.8l2.3 1 2-3.4-2-1.5c.13-.6.2-1.2.2-1.8z',
  calc: 'M6 3h12v18H6zM9 7h6M9 11h1m4 0h1M9 15h1m4 0h1',
  ruler: 'M3 17 17 3l4 4L7 21zM7 11l2 2m2-6 2 2m2-6 2 2',
  layers: 'm12 3 9 5-9 5-9-5 9-5zm9 9-9 5-9-5m18 5-9 5-9-5',
  wifi: 'M3 9a15 15 0 0 1 18 0M6 13a10 10 0 0 1 12 0M9 16.5a5 5 0 0 1 6 0M12 20v.5',
  mobile: 'M8 3h8v18H8zM11 18h2',
  desktop: 'M3 5h18v11H3zM9 20h6M12 16v4',
  terminal: 'M4 5h16v14H4zM7 9l3 3-3 3m6 0h4',
  sun: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v3m0 16v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M1 12h3m16 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  moon: 'M20 14A9 9 0 0 1 10 4a9 9 0 1 0 10 10z',
};

export function icon(name, { size = 18, cls = '' } = {}) {
  const d = ICONS[name] ?? ICONS.info;
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  node.setAttribute('viewBox', '0 0 24 24');
  node.setAttribute('width', size);
  node.setAttribute('height', size);
  node.setAttribute('fill', 'none');
  node.setAttribute('stroke', 'currentColor');
  node.setAttribute('stroke-width', '1.8');
  node.setAttribute('stroke-linecap', 'round');
  node.setAttribute('stroke-linejoin', 'round');
  node.setAttribute('aria-hidden', 'true');
  if (cls) node.setAttribute('class', cls);
  node.innerHTML = `<path d="${d}"/>`;
  return node;
}

export const ICON_NAMES = Object.keys(ICONS);
