import fs from 'fs';
const path = 'scripts/prerender.mjs';
let c = fs.readFileSync(path,'utf8');
const start = c.indexOf('/* symbols */');
const end = c.indexOf('/* reference tables */');
if (start<0 || end<0) { console.error('markers not found', start,end); process.exit(1); }
const repl = `/* symbols */
PAGES.push({
  path: '/symbols/index.html',
  hash: '/symbols',
  title: \`Electrical circuit symbols — SVG reference | \${SITE}\`,
  description: \`\${Object.keys(SYMBOLS).length} electrical circuit symbols sourced from Wikimedia Commons (IEC/ANSI), with per-file attribution and licenses.\`,
  jsonLd: graph([
    { '@type': 'TechArticle', '@id': \`\${ORIGIN}/symbols#article\`, headline: 'Electrical circuit symbols', description: 'A reference of circuit symbols sourced from Wikimedia Commons, drawn to IEC/ANSI conventions.', inLanguage: 'en', isAccessibleForFree: true, author: { '@id': \`\${ORIGIN}/#organization\` } },
  ]),
  body: (up) => \`    \${nav(up, [{ label: 'Reference', href: \`\${up}learn/\` }, { label: 'Circuit symbols' }])}
    <header class="page-head">
      <h1>Circuit symbols</h1>
      <p>\${Object.keys(SYMBOLS).length} circuit symbols sourced as SVG files from Wikimedia Commons (IEC/ANSI conventions). No symbols are hand-drawn in this app.</p>
    </header>
\${SYMBOL_GROUPS.map((grp) => \`    <section class="section">
      <div class="section-head"><h2>\${esc(grp.title)}</h2><span style="color:var(--ink-faint);font-size:14px">\${esc(grp.blurb)}</span></div>
      <div class="symbol-grid">
\${grp.keys.map((k) => { const s = SYMBOLS[k]; if(!s) return ''; return \`        <div class="symbol-card"><img class="symbol-img" src="\${up}assets/symbols/\${esc(s.file)}" alt="\${esc(s.label)}" loading="lazy"><b>\${esc(s.label)}</b><small>\${esc(s.note||'')}</small></div>\`; }).join('\\n')}
      </div>
    </section>\`).join('\\n')}
    <section class="section symbol-attrib">
      <div class="section-head"><h2>Symbol credits &amp; licenses</h2></div>
      <p>Symbol artwork is downloaded from <a href="https://commons.wikimedia.org/wiki/Category:SVG_electrical_symbols">Wikimedia Commons (SVG electrical symbols)</a>. Each file keeps its original author and license.</p>
      <div class="table-scroll"><table>
        <thead><tr><th>Symbol</th><th>Source file</th><th>Author</th><th>License</th></tr></thead>
        <tbody>
\${Object.entries(SYMBOLS).map(([k,s]) => \`          <tr><td>\${esc(s.label)}</td><td><a href="\${attr(s.licenseUrl)}">\${esc(s.source)}</a></td><td>\${esc(s.author||'—')}</td><td>\${esc(s.license||'—')}</td></tr>\`).join('\\n')}
        </tbody>
      </table></div>
      <p>Full attribution is also provided in <a href="\${up}SYMBOLS.md">SYMBOLS.md</a>.</p>
    </section>
    <p style="margin-top:22px"><a href="\${up}#/symbols">See the interactive symbol browser →</a></p>\`,
});

`;
c = c.slice(0,start) + repl + c.slice(end);
fs.writeFileSync(path,c);
console.log('patched', start, end);
