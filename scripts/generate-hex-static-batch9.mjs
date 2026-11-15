import fs from 'fs';
import path from 'path';

const HEX = 'C:\\Users\\leon2\\Documents\\Open Code\\hex';
const root = process.cwd();
const hexFiles = fs.readdirSync(HEX).filter(f => f.endsWith('.html'));

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function titleFromSlug(slug){
  return slug.replace(/\.html$/,'').replace(/[_-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase()).replace(/\b(Cm|Mm|Km|Kg|Kw|Kwh|Kva|Hz|Khz|Mhz|Ghz|Btu|Hp|Mph|Kph|Psi|Lbs|Db|Rgb|Pdf|Png|Jpg|Url|Html|Css|Js|Ac|Dc|Va|Ma|Ah|Mah|Mv|Uv|Ev|Fps)\b/gi, m=>m.toUpperCase());
}

function pageHtml(file, title){
  const slug = file.replace(/\.html$/,'');
  const canonical = `https://code-with-l.github.io/String-to-Hex/${encodeURIComponent(file)}`;
  const desc = `${title} - calculator, converter, or reference page.`;
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)} | HexKit</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#0a0b0c">
<link rel="canonical" href="${esc(canonical)}">
<link rel="stylesheet" href="css/app.css">
</head>
<body>
<a class="sr-only" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap header-inner"><a class="brand" href="./#"><span class="brand-mark" aria-hidden="true">0x</span><span class="brand-text"><span class="brand-title">HexKit</span></span></a><nav class="site-nav"><a href="./#">Home</a><a href="./tools/">Calculators</a><a href="./units/">Units</a><a href="./learn/">Learn</a></nav></div></header>
<main id="main" class="site-main"><div class="wrap">
  <section class="section">
    <div class="section-head"><h1>${esc(title)}</h1></div>
    <p>This page provides ${esc(title.toLowerCase())} functionality and reference information, similar to common online converter/calculator tools.</p>
    <p>Use the tools and converters available on this site to perform calculations and conversions.</p>
    <div class="hero-actions" style="margin-top:16px">
      <a class="btn btn-primary" href="./tools/">Open calculators</a>
      <a class="btn" href="./units/">Open unit converters</a>
      <a class="btn" href="./convert/">Open text converter</a>
    </div>
  </section>
  <section class="section">
    <h2>Related tools</h2>
    <ul>
      <li><a href="./tool/current-power/">Current / Power calculator (amps, watts, volts, VA)</a></li>
      <li><a href="./tool/ohms-law/">Ohm's law solver</a></li>
      <li><a href="./units/length/">Length converter</a></li>
      <li><a href="./units/mass/">Weight converter</a></li>
      <li><a href="./units/temperature/">Temperature converter</a></li>
    </ul>
  </section>
</div></main>
<footer class="site-footer"><div class="wrap footer-inner"><div>HexKit — offline-first calculators, converters, and reference.</div></div></footer>
<script type="module" src="js/app.js"></script>
</body>
</html>`;
}

let created = 0;
for (const file of hexFiles) {
  const slug = file.replace(/\.html$/,'');
  const outPath = path.join(root, file);
  // don't overwrite existing important files or if read page exists? create if not present
  if (fs.existsSync(outPath)) continue;
  // also skip if it's a directory index case handled differently? unlikely
  const title = titleFromSlug(slug);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, pageHtml(file, title));
  created++;
}
console.log('created', created, 'static html files');
