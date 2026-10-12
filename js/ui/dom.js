/** Tiny DOM helpers — no framework, no build step. */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) node.setAttribute(k, '');
    else node.setAttribute(k, v);
  }
  for (const c of children.flat(4)) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

export const frag = (...children) => {
  const f = document.createDocumentFragment();
  for (const c of children.flat(4)) if (c) f.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return f;
};

export const clear = (node) => { while (node.firstChild) node.firstChild.remove(); return node; };
export const mount = (node, ...children) => { clear(node); node.append(frag(...children)); return node; };

/* ── formatting ─────────────────────────────────────────────────────────── */

const NUM = new Intl.NumberFormat(undefined, { maximumFractionDigits: 12 });

/** Locale-grouped, but without exploding tiny values into exponent soup. */
export const fmtNum = (x, digits = 10) => {
  if (x === null || x === undefined || x === '') return '';
  const v = Number(x);
  if (!Number.isFinite(v)) return String(x);
  if (Number.isInteger(v) && Math.abs(v) < 1e15) return NUM.format(v);
  if (v !== 0 && (Math.abs(v) < 1e-6 || Math.abs(v) >= 1e15)) return v.toExponential(6).replace(/e([+-])(\d)$/, 'e$10$2');
  return String(Number(v.toFixed(digits)));
};

export const fmtBytes = (b) => {
  if (b === 0) return '0 B';
  const u = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.min(u.length - 1, Math.floor(Math.log(b) / Math.log(1024)));
  return `${Number((b / 1024 ** i).toFixed(2))} ${u[i]}`;
};

export const debounce = (fn, ms = 180) => {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};

/* ── clipboard & files ──────────────────────────────────────────────────── */

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = el('textarea', { style: 'position:fixed;opacity:0' });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

export function download(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function readFile(file, as = 'text') {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error ?? new Error('Could not read that file.'));
    if (as === 'buffer') r.readAsArrayBuffer(file); else r.readAsText(file);
  });
}

export function toast(message, ms = 2200) {
  const host = $('#toastHost');
  if (!host) return;
  const t = el('div', { class: 'toast', text: message });
  host.append(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .25s'; }, ms - 250);
  setTimeout(() => t.remove(), ms);
}

/* ── storage (never throws, even in private mode) ────────────────────────── */

const KEY = 'hexkit.v1';

const blank = { history: [], favourites: [], recent: [], settings: { theme: 'dark', encoding: 'utf-8', delimiter: ' ', live: true } };

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(blank);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(blank), ...parsed, settings: { ...blank.settings, ...(parsed.settings ?? {}) } };
  } catch {
    return structuredClone(blank);
  }
}

export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota or private mode — not fatal */ }
}
