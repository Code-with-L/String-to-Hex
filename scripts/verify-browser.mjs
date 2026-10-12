#!/usr/bin/env node
/**
 * Headless verification harness. Drives Chrome over the DevTools Protocol
 * (Node's built-in WebSocket, no dependencies) to prove that:
 *   1. the page boots with no console errors,
 *   2. the service worker registers and precaches the whole shell,
 *   3. the app still boots with the network switched off,
 *   4. no layout overflows horizontally at several viewport widths.
 *
 *   node scripts/verify-browser.mjs [--url http://localhost:5173/]
 */

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
};

const URL_BASE = arg('--url', 'http://localhost:5173/');
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
const CHROME = CHROME_CANDIDATES.find((p) => existsSync(p));

if (!CHROME) {
  console.log('Chrome not found — set CHROME_PATH to run the browser checks.');
  process.exit(0);
}

const profile = mkdtempSync(join(tmpdir(), 'hexkit-verify-'));
const PORT = 9333;
let failures = 0;
const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => { failures++; console.log(`  \x1b[31m✗\x1b[0m ${m}`); };
const check = (c, m) => (c ? ok(m) : bad(m));

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--window-size=1280,900', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function targetWs() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(250);
  }
  throw new Error('Chrome DevTools endpoint never came up');
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const pending = new Map();
    const events = [];
    let id = 0;
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve: res, reject: rej } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
      } else if (msg.method) events.push(msg);
    });
    ws.addEventListener('error', reject);
    ws.addEventListener('open', () => resolve({
      events,
      send: (method, params = {}) => new Promise((res, rej) => {
        const msgId = ++id;
        pending.set(msgId, { resolve: res, reject: rej });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      }),
      close: () => ws.close(),
    }));
  });
}

async function evaluate(cdp, expression) {
  const r = await cdp.send('Runtime.evaluate', {
    expression, awaitPromise: true, returnByValue: true,
  });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? 'evaluation failed');
  return r.result.value;
}

async function goto(cdp, url) {
  await cdp.send('Page.navigate', { url });
  await sleep(1200);
}

try {
  const cdp = await connect(await targetWs());
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');
  await cdp.send('Network.enable');

  console.log('\nBrowser verification\n');

  /* 1 ── boot cleanly ---------------------------------------------------- */
  await goto(cdp, URL_BASE);
  await sleep(2500);

  const consoleErrors = cdp.events
    .filter((e) => e.method === 'Runtime.exceptionThrown'
      || (e.method === 'Log.entryAdded' && e.params.entry.level === 'error'))
    .map((e) => e.params.entry?.text ?? e.params.exceptionDetails?.exception?.description ?? 'error');
  check(consoleErrors.length === 0, `boots with no console errors${consoleErrors.length ? `: ${consoleErrors[0]}` : ''}`);

  const heading = await evaluate(cdp, "document.querySelector('#view h1')?.textContent ?? ''");
  check(heading.length > 0, `home view rendered: "${heading.slice(0, 40)}"`);

  /* 2 ── the converter actually converts --------------------------------- */
  const converted = await evaluate(cdp, `(async () => {
    location.hash = '#/convert?from=text&to=hex';
    await new Promise(r => setTimeout(r, 500));
    const i = document.querySelector('#c-in');
    const o = document.querySelector('#c-out');
    i.value = 'Plant trees';
    i.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(r => setTimeout(r, 400));
    return o.value;
  })()`);
  check(converted === '50 6C 61 6E 74 20 74 72 65 65 73',
    `text → hex matches the reference value (got "${converted}")`);

  const roundTrip = await evaluate(cdp, `(async () => {
    location.hash = '#/convert?from=hex&to=text';
    await new Promise(r => setTimeout(r, 500));
    const i = document.querySelector('#c-in');
    const o = document.querySelector('#c-out');
    i.value = '50 6C 61 6E 74';
    i.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(r => setTimeout(r, 400));
    return o.value;
  })()`);
  check(roundTrip === 'Plant', `hex → text round-trips (got "${roundTrip}")`);

  /* 3 ── service worker + precache --------------------------------------- */
  const sw = await evaluate(cdp, `(async () => {
    const reg = await navigator.serviceWorker.ready;
    const keys = await caches.keys();
    const shellKey = keys.find(k => k.includes('shell'));
    const shell = await caches.open(shellKey);
    const base = new URL('.', location.href).pathname.replace(/\\/$/, '');
    // Report paths relative to the deployment root, so a site served from a
    // sub-path (GitHub Pages project sites) compares the same as one at "/".
    const urls = (await shell.keys())
      .map(r => new URL(r.url).pathname)
      .map(p => (p.startsWith(base) ? p.slice(base.length) : p) || '/')
      .sort();
    return { scope: reg.scope, active: !!reg.active, caches: keys, count: urls.length, urls };
  })()`);
  check(sw.active, `service worker active, scope ${sw.scope}`);
  check(sw.caches.some((c) => c.includes('shell')), `precache created: ${sw.caches.join(', ')}`);
  const required = ['/index.html', '/css/app.css', '/js/app.js', '/js/ui/views.js',
    '/js/data/tools.js', '/manifest.webmanifest', '/icons/icon-192.png'];
  const missing = required.filter((p) => !sw.urls.includes(p));
  check(missing.length === 0, `shell precached (${sw.count} entries)${missing.length ? ` — missing ${missing.join(', ')}` : ''}`);

  /* 4 ── offline --------------------------------------------------------- */
  await cdp.send('Network.emulateNetworkConditions', {
    offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0,
  });
  await goto(cdp, URL_BASE);
  await sleep(2500);
  const offlineHeading = await evaluate(cdp, "document.querySelector('#view h1')?.textContent ?? ''");
  const offlineConvert = await evaluate(cdp, `(async () => {
    location.hash = '#/convert?from=text&to=hex';
    await new Promise(r => setTimeout(r, 500));
    const i = document.querySelector('#c-in');
    const o = document.querySelector('#c-out');
    i.value = 'Plant trees';
    i.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(r => setTimeout(r, 400));
    return o.value;
  })()`);
  check(offlineHeading.length > 0, `boots offline: "${offlineHeading.slice(0, 40)}"`);
  check(offlineConvert === '50 6C 61 6E 74 20 74 72 65 65 73', 'converts offline');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
  });

  /* 5 ── responsive: no horizontal overflow ------------------------------ */
  console.log('\nLayout');
  for (const [w, h] of [[320, 720], [390, 844], [768, 1024], [1024, 768], [1440, 900], [2560, 1440]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: w, height: h, deviceScaleFactor: 1, mobile: w < 700,
    });
    for (const route of ['#/convert?from=text&to=hex', '#/tools', '#/tool/ohms-law', '#/ascii', '#/units/length']) {
      await evaluate(cdp, `location.hash = ${JSON.stringify(route)}`);
      await sleep(320);
      const overflow = await evaluate(cdp, `document.documentElement.scrollWidth - window.innerWidth`);
      check(overflow <= 1, `${w}×${h} ${route}: no horizontal overflow (${overflow}px)`);
    }
  }
  await cdp.send('Emulation.clearDeviceMetricsOverride');

  cdp.close();
} catch (err) {
  bad(`harness error: ${err.message}`);
} finally {
  chrome.kill();
  // Chrome keeps file handles open for a moment after SIGKILL; give it time
  // and retry rather than crashing the harness on a cleanup race.
  await sleep(800);
  for (let i = 0; i < 5; i++) {
    try { rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 300 }); break; }
    catch { await sleep(400); }
  }
}

console.log(failures ? `\n\x1b[31m${failures} browser check(s) failed.\x1b[0m\n` : '\n\x1b[32mAll browser checks passed.\x1b[0m\n');
process.exit(failures ? 1 : 0);
