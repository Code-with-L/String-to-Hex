import fs from 'fs';
import path from 'path';

const root = process.cwd();
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
}
walk(root);

const missing = new Map();
const rootAbsolute = new Map();
const hashRoutes = new Set();

const attrRe = /(?:href|src)\s*=\s*"([^"]+)"/g;

for (const f of files) {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  const dirRel = path.posix.dirname(rel);
  const s = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = attrRe.exec(s))) {
    let url = m[1].trim();
    if (!url) continue;
    if (url.startsWith('#')) { hashRoutes.add(url); continue; }
    if (/^(https?:|mailto:|data:|tel:|javascript:)/i.test(url)) continue;
    url = url.split('#')[0];
    if (!url) continue;
    if (url.startsWith('/')) {
      rootAbsolute.set(url, rel);
      continue;
    }
    let target = path.posix.normalize(path.posix.join(dirRel, url));
    if (target.endsWith('/')) target += 'index.html';
    if (target.startsWith('../')) { missing.set(target, rel); continue; }
    if (!fs.existsSync(path.join(root, target.split('?')[0]))) {
      missing.set(target.split('?')[0], rel);
    }
  }
}

console.log('HTML files:', files.length);
console.log('\n--- root-absolute URLs (break GitHub Pages base) ---');
if (!rootAbsolute.size) console.log('none');
for (const [u, from] of [...rootAbsolute].slice(0, 60)) console.log(u, '  <-', from);

console.log('\n--- relative links pointing to missing files ---');
if (!missing.size) console.log('none');
for (const [t, from] of [...missing].slice(0, 200)) console.log(t, '  <-', from);
console.log('total missing:', missing.size);

const staticHash = new Set();
for (const h of hashRoutes) {
  const clean = h.slice(1).split('?')[0];
  const first = clean.split('/').filter(Boolean);
  staticHash.add(first[0] ?? '');
}
console.log('\nhash route roots seen:', [...staticHash].sort().join(', '));
