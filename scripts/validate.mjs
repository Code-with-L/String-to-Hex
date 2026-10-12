#!/usr/bin/env node
/**
 * Project validator — the guard rail that keeps the app, the manifest, the
 * service worker and the tests agreeing with each other. Runs in `npm run check`.
 */

import { readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TOOLS, GROUPS } from '../js/data/tools.js';
import { FAMILIES } from '../js/data/units.js';
import { ENCODINGS } from '../js/data/formats.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;

const ok = (msg) => console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
const bad = (msg) => { failures++; console.log(`  \x1b[31m✗\x1b[0m ${msg}`); };
const check = (cond, msg) => (cond ? ok(msg) : bad(msg));

const read = (p) => readFile(join(root, p), 'utf8');
const exists = async (p) => { try { await access(join(root, p)); return true; } catch { return false; } };

console.log('\nHexKit validation\n');

/* ── files ──────────────────────────────────────────────────────────────── */
console.log('Files');
const required = [
  'index.html', 'sw.js', 'manifest.webmanifest', 'css/app.css',
  'js/app.js', 'js/core/convert.js',
  'js/data/units.js', 'js/data/tools.js', 'js/data/formats.js', 'js/data/ascii.js',
  'js/ui/dom.js', 'js/ui/router.js', 'js/ui/views.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/icon-180.png',
  'README.md', 'LICENSE', 'package.json',
];
for (const f of required) check(await exists(f), f);

/* ── manifest ───────────────────────────────────────────────────────────── */
console.log('\nManifest');
const manifest = JSON.parse(await read('manifest.webmanifest'));
check(typeof manifest.name === 'string' && manifest.name.length > 0, `name: ${manifest.name}`);
check(manifest.display === 'standalone', 'display: standalone (installable window)');
check(Boolean(manifest.start_url), `start_url: ${manifest.start_url}`);
check(Boolean(manifest.scope), `scope: ${manifest.scope}`);
check(manifest.icons.length >= 3, `${manifest.icons.length} icons declared`);
check(manifest.icons.some((i) => i.sizes === '192x192'), 'has a 192×192 icon');
check(manifest.icons.some((i) => i.sizes === '512x512'), 'has a 512×512 icon');
check(manifest.icons.some((i) => (i.purpose ?? '').includes('maskable')), 'has a maskable icon');
for (const icon of manifest.icons) {
  check(await exists(icon.src), `icon exists: ${icon.src}`);
}
for (const sc of manifest.shortcuts ?? []) {
  check(sc.url?.includes('#/'), `shortcut URL routes internally: ${sc.short_name}`);
}

/* ── service worker ─────────────────────────────────────────────────────── */
console.log('\nService worker');
const sw = await read('sw.js');
check(sw.includes('addEventListener'), 'registers listeners');
check(/install[\s\S]*addEventListener/.test(sw), 'handles install');
check(/activate[\s\S]*addEventListener/.test(sw), 'handles activate');
check(/fetch[\s\S]*addEventListener/.test(sw), 'handles fetch');
check(sw.includes('VERSION'), 'has a versioned cache name');

// every precached path must exist, or offline boot silently breaks
const precache = [...sw.matchAll(/'(\.\/[^']+)'/g)].map((m) => m[1]).filter((p) => p !== './');
for (const p of new Set(precache)) check(await exists(p.replace(/^\.\//, '')), `precached: ${p}`);

/* ── index.html wiring ──────────────────────────────────────────────────── */
console.log('\nHTML wiring');
const html = await read('index.html');
check(html.includes('<meta name="viewport"'), 'has a viewport meta (mobile)');
check(html.includes('manifest.webmanifest'), 'links the manifest');
check(html.includes('theme-color'), 'sets theme-color');
check(html.includes('apple-mobile-web-app-capable'), 'declared iOS standalone');
check(html.includes('js/app.js'), 'loads the app entry point');
check(/<html[^>]+lang="en"/.test(html), 'declares a language');
check(html.includes('Skip to content'), 'has a skip link (accessibility)');
for (const id of ['view', 'themeToggle', 'installBtn', 'siteNav', 'toastHost', 'filePicker']) {
  check(html.includes(`id="${id}"`), `has #${id}`);
}

/* ── syntax ─────────────────────────────────────────────────────────────── */
console.log('\nSyntax');
const allJs = [
  'js/app.js', 'js/core/convert.js', 'js/data/units.js', 'js/data/tools.js',
  'js/data/formats.js', 'js/data/ascii.js', 'js/ui/dom.js', 'js/ui/router.js', 'js/ui/views.js',
  'sw.js', 'scripts/serve.mjs', 'scripts/validate.mjs', 'scripts/make-icons.mjs',
  'tests/engine.test.js', 'tests/views.test.js', 'tests/dom-shim.js',
];
for (const f of allJs) {
  // Ask Node's own parser. A hand-rolled bracket counter gives false positives
  // on regex literals and would still miss a truncation that leaves them even.
  const result = spawnSync(process.execPath, ['--check', f], { cwd: root, encoding: 'utf8' });
  check(result.status === 0, `${f}: parses as valid ES module`);
  if (result.status !== 0) console.log(`      ${(result.stderr ?? '').split('\n')[5] ?? ''}`);
}

/* ── data integrity ─────────────────────────────────────────────────────── */
console.log('\nData');
check(TOOLS.length >= 50, `${TOOLS.length} calculators registered`);
const toolIds = new Set();
for (const t of TOOLS) {
  if (toolIds.has(t.id)) bad(`duplicate tool id: ${t.id}`);
  toolIds.add(t.id);
  if (!t.inputs?.length) bad(`${t.id} has no inputs`);
  if (!GROUPS.some((g) => g.id === t.group)) bad(`${t.id} has unknown group "${t.group}"`);
}
ok('every tool has a unique id, inputs and a valid group');

check(Object.keys(FAMILIES).length >= 15, `${Object.keys(FAMILIES).length} unit families`);
let unitCount = 0;
for (const [id, F] of Object.entries(FAMILIES)) {
  unitCount += Object.keys(F.units).length;
  if (!F.base) bad(`${id} has no base unit`);
  for (const [k, u] of Object.entries(F.units)) {
    if (u.f === undefined && !u.expr) bad(`${id}.${k} has neither a factor nor an expression`);
  }
}
ok(`${unitCount} units with complete factors`);

const encIds = new Set();
for (const e of ENCODINGS) {
  if (encIds.has(e.id)) bad(`duplicate encoding id: ${e.id}`);
  encIds.add(e.id);
}
ok(`${ENCODINGS.length} encodings, no duplicate ids`);
check(ENCODINGS.length >= 40, 'encoding list covers the reference charset set');

/* ── source hygiene ─────────────────────────────────────────────────────── */
console.log('\nSource hygiene');
// Strip comments and string literals before pattern checks, otherwise prose
// like "no eval()" inside a doc comment trips the very rule it documents.
const stripNoise = (code) => code
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/(^|[^:])\/\/.*$/gm, '$1')
  .replace(/`(?:\\.|[^`\\])*`/g, '``')
  .replace(/'(?:\\.|[^'\\])*'/g, "''")
  .replace(/"(?:\\.|[^"\\])*"/g, '""');

const sources = [
  'js/app.js', 'js/core/convert.js', 'js/data/units.js', 'js/data/tools.js',
  'js/data/formats.js', 'js/data/ascii.js', 'js/ui/dom.js', 'js/ui/router.js', 'js/ui/views.js',
];
for (const src of sources) {
  const code = stripNoise(await read(src));
  check(!/(^|[^.\w])eval\s*\(/.test(code), `${src}: no eval()`);
  check(!/new\s+Function\s*\(/.test(code), `${src}: no new Function()`);
  check(!/document\.write/.test(code), `${src}: no document.write`);
  check(!/(^|[^.\w])var\s+[a-zA-Z_$]/.test(code), `${src}: no legacy var`);
}

/* ── external dependencies ──────────────────────────────────────────────── */
console.log('\nOffline integrity');
check(!/https?:\/\/(?!localhost|code-with-l)/i.test(html.replace(/https?:\/\/(schema|w3|github)\.[^\s"']*/gi, '')),
  'no runtime CDN dependencies in index.html');
for (const src of sources) {
  const code = await read(src);
  const ext = code.match(/from\s+['"]https?:\/\/[^'"]+['"]/g) ?? [];
  check(ext.length === 0, `${src}: no remote imports`);
}

console.log(failures ? `\n\x1b[31m${failures} problem(s) found.\x1b[0m\n` : '\n\x1b[32mAll checks passed.\x1b[0m\n');
process.exit(failures ? 1 : 0);
