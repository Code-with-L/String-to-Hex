import { execFileSync } from 'node:child_process';
import fs from 'fs';
import path from 'path';

const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

function curlJson(url) {
  for (let i = 0; i < 4; i++) {
    try {
      const b = execFileSync('curl.exe', ['-fsSL', '-A', 'HexKitSymbolBot/1.0 (contact: local)', '--max-time', '25', url], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
      return JSON.parse(b);
    } catch (e) {
      const msg = String(e.stderr || e.message || '');
      if (/429/.test(msg)) { sleep(2500 * (i + 1)); continue; }
      return null;
    }
  }
  return null;
}

export function search(query, limit = 8) {
  sleep(1200);
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&format=json&srlimit=' + limit + '&srsearch=' + encodeURIComponent(query);
  const d = curlJson(u);
  return (d?.query?.search || []).map(x => x.title);
}

export function info(title) {
  sleep(1200);
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent(title) + '&prop=imageinfo&iiprop=url|extmetadata|size|mime&format=json&redirects=1';
  const d = curlJson(u);
  for (const p of Object.values(d?.query?.pages || {})) {
    const ii = p.imageinfo?.[0];
    if (ii?.url) return { title: p.title, pageid: p.pageid, url: ii.url.split('?')[0], mime: ii.mime, width: ii.width, height: ii.height, meta: ii.extmetadata || {} };
  }
  return null;
}

export function download(url, out) {
  for (let i = 0; i < 4; i++) {
    try {
      execFileSync('curl.exe', ['-fsSL', '-A', 'HexKitSymbolBot/1.0', '--max-time', '30', '-o', out, url], { stdio: 'pipe' });
      if (fs.existsSync(out) && fs.statSync(out).size > 40) return true;
    } catch (e) {
      const msg = String(e.stderr || e.message || '');
      if (/429/.test(msg)) { sleep(2500 * (i + 1)); continue; }
    }
  }
  return false;
}

export function clean(v){ return (v?.value||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim(); }

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'))) {
  const q = process.argv.slice(2).join(' ');
  if (q) {
    for (const t of search(q)) console.log(t);
  }
}
