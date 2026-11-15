import fs from 'fs';

let s = fs.readFileSync('index.html', 'utf8');
const re = /    <nav class="site-nav" id="siteNav" aria-label="Primary" hidden>[\s\S]*?    <\/nav>/;
const nav = `    <nav class="site-nav" id="siteNav" aria-label="Primary" hidden">
      <a href="#/">Home</a>
      <a href="#/calc">Calculators</a>
      <a href="#/conversion">Conversion</a>
      <a href="#/web-tools">Web Tools</a>
      <a href="#/math">Math</a>
      <a href="#/electricity">Electricity</a>
      <button class="btn btn-sm btn-ghost" id="themeToggle" type="button" aria-label="Toggle colour theme">Theme</button>
      <button class="btn btn-sm btn-ghost" id="installBtn" type="button" hidden>Install</button>
    </nav>`;
if (!re.test(s)) throw new Error('index nav not found');
fs.writeFileSync('index.html', s.replace(re, nav));

let p = fs.readFileSync('scripts/prerender.mjs', 'utf8');
const nav2 = `    <nav class="site-nav" id="siteNav" aria-label="Primary" hidden">
      <a href="\${up}#/">Home</a>
      <a href="\${up}#/calc">Calculators</a>
      <a href="\${up}#/conversion">Conversion</a>
      <a href="\${up}#/web-tools">Web Tools</a>
      <a href="\${up}#/math">Math</a>
      <a href="\${up}#/electricity">Electricity</a>
      <button class="btn btn-sm btn-ghost" id="themeToggle" type="button" aria-label="Toggle colour theme">Theme</button>
      <button class="btn btn-sm btn-ghost" id="installBtn" type="button" hidden>Install</button>
    </nav>`;
if (!re.test(p)) throw new Error('prerender nav not found');
fs.writeFileSync('scripts/prerender.mjs', p.replace(re, nav2));
console.log('updated');
