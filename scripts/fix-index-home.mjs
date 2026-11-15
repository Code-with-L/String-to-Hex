import fs from 'fs';

const path = 'index.html';
let s = fs.readFileSync(path, 'utf8');

// Fix nav hidden attribute typo if present
s = s.replace('aria-label="Primary" hidden"', 'aria-label="Primary" hidden');

// Replace hero and main view content block
const mainStart = '<main id="main" class="wrap" tabindex="-1">\n  <div id="view" aria-live="polite">';
const mainEnd = '\n    <noscript>';
const i = s.indexOf(mainStart);
const j = s.indexOf(mainEnd, i);
if (i < 0 || j < 0) throw new Error('main markers not found ' + i + ' ' + j);

const newMain = `<main id="main" class="wrap" tabindex="-1">
  <div id="view" aria-live="polite">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a></nav>
    <section class="hero">
      <div>
        <span class="hero-eyebrow">Offline-first · No runtime dependencies</span>
        <h1>Calculators, converters &amp; online tools</h1>
        <p>Text and base conversion (36 format pairs, 42 encodings), 76 calculators, 24 unit families, web tools, and math/electrical/reference content — organized by topic. Everything runs locally in your browser.</p>
        <div class="hero-actions">
          <a class="btn btn-primary btn-lg" href="#/convert?from=text&amp;to=hex">Text to hex converter</a>
          <a class="btn btn-lg" href="#/calc">Calculators</a>
          <a class="btn btn-lg" href="#/web-tools">Web tools</a>
        </div>
      </div>
      <div class="hero-panel">
        <div class="hero-panel-head">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          <span style="margin-left:6px">hexkit · converter</span>
        </div>
        <div class="hero-panel-body">
          <div class="hero-io">
            <span class="hero-io-label">input — text</span>
            <div class="hero-io-value">Plant trees</div>
          </div>
          <div class="hero-io">
            <span class="hero-io-label">output — hexadecimal</span>
            <div class="hero-io-value out">50 6C 61 6E 74 20 74 72 65 65 73</div>
          </div>
          <div class="byte-strip">
            <span class="byte"><i>50</i><u>P</u></span><span class="byte"><i>6C</i><u>l</u></span><span class="byte"><i>61</i><u>a</u></span><span class="byte"><i>6E</i><u>n</u></span><span class="byte"><i>74</i><u>t</u></span><span class="byte"><i>20</i><u>·</u></span><span class="byte"><i>74</i><u>t</u></span><span class="byte"><i>72</i><u>r</u></span><span class="byte"><i>65</i><u>e</u></span><span class="byte"><i>65</i><u>e</u></span><span class="byte"><i>73</i><u>s</u></span>
          </div>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><b>36</b><span>format pairs</span></div>
          <div class="hero-stat"><b>76</b><span>calculators</span></div>
          <div class="hero-stat"><b>202</b><span>units</span></div>
          <div class="hero-stat"><b>42</b><span>encodings</span></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><h2>Topics</h2></div>
      <div class="grid grid-2">
        <a class="tool-card" href="#/calc"><h3>Calculators</h3><p>76 online calculators organized by topic: math, electrical, wire, financial, health, time, number, color, text and more.</p></a>
        <a class="tool-card" href="#/conversion"><h3>Conversion</h3><p>24 unit families (202 units) plus text, hex, binary, decimal, octal and Base64 conversion.</p></a>
        <a class="tool-card" href="#/web-tools"><h3>Web Tools</h3><p>Browser-based tools: alarm clock, stopwatch, timer, notepad, notes, calendar, counters, charts and other utilities.</p></a>
        <a class="tool-card" href="#/math"><h3>Math</h3><p>Math calculators, formulas and reference tables organized by topic.</p></a>
        <a class="tool-card" href="#/electricity"><h3>Electricity</h3><p>Electrical calculators, unit conversions, formulas, symbols and reference.</p></a>
        <a class="tool-card" href="#/learn"><h3>Reference</h3><p>Articles, glossary, symbols, tables and ASCII/encoding reference organized by topic.</p></a>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><h2>Quick converters &amp; tools</h2><a href="#/conversion" style="font-size:14px">All conversion →</a></div>
      <div class="grid grid-3">
        <a class="tool-card" href="#/convert?from=text&amp;to=hex"><h3>Text to Hex</h3><p>Convert text to hexadecimal bytes and back.</p></a>
        <a class="tool-card" href="#/ascii"><h3>ASCII table</h3><p>Character codes 0-127 with binary and hex.</p></a>
        <a class="tool-card" href="#/base"><h3>Number base converter</h3><p>Exact arithmetic in bases 2-36.</p></a>
        <a class="tool-card" href="#/notepad"><h3>Online Notepad</h3><p>Private, autosaving scratchpad.</p></a>
        <a class="tool-card" href="#/tool/scientific-calc"><h3>Scientific calculator</h3><p>Evaluate expressions with common functions.</p></a>
        <a class="tool-card" href="#/web-tools/stopwatch"><h3>Stopwatch</h3><p>Measure elapsed time in your browser.</p></a>
      </div>
    </section>
`;

s = s.slice(0, i) + newMain + s.slice(j);

// Update noscript links to be topic-oriented
s = s.replace(
  `        <div class="panel prose">
          <h2>JavaScript is switched off</h2>
          <p>HexKit converts and calculates entirely in your browser, so it needs JavaScript enabled.
             The reference pages below are plain HTML and read fine without it:</p>
          <ul>
            <li><a href="learn/">Formulas, terms and symbols</a></li>
            <li><a href="ascii/">The full ASCII table, 0–127</a></li>
            <li><a href="tables/">Resistor colour code and wire gauge tables</a></li>
            <li><a href="units/">Every unit family</a></li>
            <li><a href="glossary/">Electrical and computing glossary</a></li>
          </ul>
        </div>`,
  `        <div class="panel prose">
          <h2>JavaScript is switched off</h2>
          <p>HexKit converts and calculates entirely in your browser, so it needs JavaScript enabled. The topic pages below are plain HTML and read fine without it:</p>
          <ul>
            <li><a href="calc/">Calculators</a></li>
            <li><a href="conversion/">Conversion</a></li>
            <li><a href="web-tools/">Web tools</a></li>
            <li><a href="math/">Math reference</a></li>
            <li><a href="electricity/">Electricity reference</a></li>
            <li><a href="learn/">Full reference library</a></li>
          </ul>
        </div>`
);

// Update footer
s = s.replace(
  `      <div>
        <h4>Calculators</h4>
        <ul>
          <li><a href="#/tool/ohms-law">Ohm's law</a></li>
          <li><a href="#/tool/kirchhoff">Kirchhoff's laws</a></li>
          <li><a href="#/tool/quadratic">Quadratic roots</a></li>
          <li><a href="#/tool/stddev">Standard deviation</a></li>
          <li><a href="tools/">All 70 tools</a></li>
        </ul>
      </div>`,
  `      <div>
        <h4>Topics</h4>
        <ul>
          <li><a href="#/calc">Calculators</a></li>
          <li><a href="#/conversion">Conversion</a></li>
          <li><a href="#/web-tools">Web tools</a></li>
          <li><a href="#/math">Math</a></li>
          <li><a href="#/electricity">Electricity</a></li>
        </ul>
      </div>`
);
s = s.replace(
  `      <div>
        <h4>Tools</h4>
        <ul>
          <li><a href="#/notepad">Online notepad</a></li>
          <li><a href="#/html-editor">HTML editor &amp; viewer</a></li>
          <li><a href="#/entities">HTML entities</a></li>
          <li><a href="#/base">Number base calculator</a></li>
          <li><a href="about/">About this site</a></li>
        </ul>
      </div>`,
  `      <div>
        <h4>Web tools</h4>
        <ul>
          <li><a href="#/notepad">Online notepad</a></li>
          <li><a href="#/web-tools/stopwatch">Stopwatch</a></li>
          <li><a href="#/web-tools/countdown-timer">Countdown timer</a></li>
          <li><a href="#/tool/scientific-calc">Online calculator</a></li>
          <li><a href="about/">About this site</a></li>
        </ul>
      </div>`
);
s = s.replace(
  `          <li><a href="#/units">Unit families</a></li>
          <li><a href="ascii/">ASCII table</a></li>
          <li><a href="#/symbols">Circuit symbols</a></li>`,
  `          <li><a href="#/units">Unit families</a></li>
          <li><a href="#/ascii">ASCII table</a></li>
          <li><a href="#/symbols">Circuit symbols</a></li>`
);

// Update title/description/meta to be topic-oriented and counts
s = s.replace('<title>HexKit — Calculators, Converters &amp; Formula Reference</title>', '<title>HexKit — Calculators, Converters &amp; Online Tools</title>');
s = s.replace('<meta name="description" content="Convert text to hex, binary, decimal, octal and Base64 in one place, plus 70 calculators, 24 unit families, an ASCII table and an electrical formula reference. Offline-first and free.">', '<meta name="description" content="Calculators, converters and browser-based web tools organized by topic: text/hex/base conversion, 76 calculators, 24 unit families, math and electricity reference. Offline-first and free.">');
s = s.replace('<meta property="og:title" content="HexKit — Calculators, Converters &amp; Formula Reference">', '<meta property="og:title" content="HexKit — Calculators, Converters &amp; Online Tools">');
s = s.replace('<meta name="twitter:title" content="HexKit — Calculators, Converters &amp; Formula Reference">', '<meta name="twitter:title" content="HexKit — Calculators, Converters &amp; Online Tools">');
s = s.replace('<meta property="og:description" content="Text ⇄ Hex ⇄ Binary ⇄ Decimal ⇄ Octal ⇄ Base64, plus every unit converter and engineering calculator. Works offline.">', '<meta property="og:description" content="Calculators, converters, web tools, and math/electrical reference organized by topic. Works offline.">');
s = s.replace('<meta name="twitter:description" content="Text ⇄ Hex ⇄ Binary ⇄ Decimal ⇄ Octal ⇄ Base64, plus every unit converter and engineering calculator. Works offline.">', '<meta name="twitter:description" content="Calculators, converters, web tools, and math/electrical reference organized by topic. Works offline.">');
s = s.replace(/70 calculators/g, '76 calculators');

fs.writeFileSync(path, s);
console.log('fixed index.html');
