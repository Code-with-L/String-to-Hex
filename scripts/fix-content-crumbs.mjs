import fs from 'fs';
const p = 'js/ui/content.js';
let s = fs.readFileSync(p, 'utf8');

const pairs = [
  ["    crumbs({ label: 'Tools' }),\n    el('section', { class: 'page-head' }, el('h1', {}, 'Online Tools')",
   "    crumbs({ label: 'Web Tools' }),\n    el('section', { class: 'page-head' }, el('h1', {}, 'Online Tools')"],
];
for (const [a, b] of pairs) {
  if (!s.includes(a)) console.error('miss pair');
  s = s.split(a).join(b);
}
s = s.replace(/crumbs\(\{ label: 'Tools', href: '#\/web-tools' \}, \{ label: title \}\)/g,
  "crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title })");

fs.writeFileSync(p, s);
console.log('fixed crumbs labels');
