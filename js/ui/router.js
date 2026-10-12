/** Hash router — `#/path?query`, history-aware, no server needed. */

const listeners = new Set();
let current = null;

function parse() {
  const raw = location.hash.slice(1) || '/';
  const [path, query = ''] = raw.split('?');
  return {
    path: path.startsWith('/') ? path : `/${path}`,
    query: new URLSearchParams(query),
    segments: path.split('/').filter(Boolean),
    raw,
  };
}

export function currentRoute() { return current ?? parse(); }

export function navigate(to, { replace = false } = {}) {
  const target = to.startsWith('#') ? to : `#${to.startsWith('/') ? to : `/${to}`}`;
  if (replace) history.replaceState(null, '', target);
  else location.hash = target;
}

export function onRoute(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  current = parse();
  for (const fn of listeners) {
    try { fn(current); }
    catch (err) { console.error('[router]', err); }
  }
}

export function startRouter() {
  addEventListener('hashchange', emit);
  if (!location.hash) history.replaceState(null, '', '#/');
  emit();
}

export function buildQuery(params) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

/** Keep the address bar in sync without spamming the history stack. */
export function syncQuery(params) {
  const { path, query } = currentRoute();
  const next = { ...Object.fromEntries(query), ...params };
  for (const [k, v] of Object.entries(next)) if (v === undefined || v === null || v === '') delete next[k];
  const url = `#${path}${buildQuery(next)}`;
  if (url !== location.hash) history.replaceState(null, '', url);
  return next;
}
