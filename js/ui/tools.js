/**
 * Standalone tools that need their own surface rather than the generic
 * input/results form: a notepad, an HTML editor with live preview, and an
 * HTML/CSS colour-code browser. All state stays in localStorage.
 */

import { el, frag, mount, download, toast, debounce, loadState, saveState } from './dom.js';
import { icon } from './icons.js';
import { evalExpr } from '../data/tools.js';

const KEY = 'hexkit.tools.v1';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY) ?? '{}'); } catch { return {}; } };
const write = (patch) => { try { localStorage.setItem(KEY, JSON.stringify({ ...read(), ...patch })); } catch { /* quota */ } };

/* ── notepad ────────────────────────────────────────────────────────────── */

export function viewNotepad() {
  const saved = read();
  const ta = el('textarea', {
    class: 'textarea', spellcheck: 'false',
    placeholder: 'Start typing…  (autosaved locally, never sent anywhere)',
    style: 'min-height:52vh;font-size:15px;line-height:1.75',
  });
  ta.value = saved.notepad ?? '';

  const status = el('span', { style: 'color:var(--ink-faint);font-family:var(--mono);font-size:12px' }, 'saved');

  const stats = el('div', { class: 'stats' });
  const update = () => {
    const s = ta.value;
    const bytes = new TextEncoder().encode(s).length;
    mount(stats,
      stat(String([...s].length), 'Characters'),
      stat(String(s.trim() ? s.trim().split(/\s+/).length : 0), 'Words'),
      stat(String(s ? s.split('\n').length : 0), 'Lines'),
      stat(String(bytes), 'UTF-8 bytes'),
      stat(String(bytes * 8), 'Bits'),
    );
  };
  const stat = (v, l) => el('div', { class: 'stat' }, el('b', {}, v), el('span', {}, l));

  const autosave = debounce(() => {
    write({ notepad: ta.value });
    status.textContent = `saved ${new Date().toLocaleTimeString()}`;
  }, 400);

  ta.addEventListener('input', () => { update(); autosave(); });
  update();

  const node = frag(
    el('nav', { class: 'crumbs' }, el('a', { href: '#/' }, 'Home'), el('span', { 'aria-hidden': 'true' }, '/'), el('span', {}, 'Notepad')),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Tool'),
      el('h1', {}, 'Online notepad'),
      el('p', {}, 'A scratchpad that autosaves to this browser only. Nothing is uploaded; clearing site data wipes it.'),
    ),
    el('section', { class: 'panel' },
      el('div', { class: 'pane-head', style: 'margin-bottom:10px' },
        el('span', { class: 'pane-title' }, 'Notes'), status),
      ta,
      stats,
      el('div', { class: 'btn-row' },
        el('button', { class: 'btn btn-primary', type: 'button', onclick: () => download('notes.txt', ta.value) }, icon('download', { size: 16 }), el('span', {}, 'Download .txt')),
        el('button', {
          class: 'btn', type: 'button', onclick: async () => {
            const f = el('input', { type: 'file', accept: '.txt,text/*' });
            f.onchange = async () => {
              if (!f.files[0]) return;
              ta.value = await f.files[0].text();
              update(); autosave();
              toast('File loaded');
            };
            f.click();
          },
        }, icon('upload', { size: 16 }), el('span', {}, 'Open file')),
        el('button', {
          class: 'btn', type: 'button', onclick: async () => {
            try {
              await navigator.clipboard.writeText(ta.value);
              toast('Copied to clipboard');
            } catch { toast('Clipboard unavailable', 3000); }
          },
        }, icon('copy', { size: 16 }), el('span', {}, 'Copy all')),
        el('button', {
          class: 'btn', type: 'button', onclick: () => {
            if (confirm('Clear the notepad? This cannot be undone.')) { ta.value = ''; update(); autosave(); }
          },
        }, el('span', {}, 'Clear')),
      ),
    ),
  );
  node.pageTitle = 'Online notepad — HexKit';
  node.pageDescription = 'A private scratchpad that autosaves in your browser. Nothing is uploaded.';
  return node;
}

/* ── HTML editor with live preview ──────────────────────────────────────── */

const SNIPPET = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My page</title>
  <style>
    body { font: 16px/1.6 system-ui, sans-serif; margin: 3rem auto; max-width: 42rem; }
    h1 { color: #2563eb; }
  </style>
</head>
<body>
  <h1>Hello, world</h1>
  <p>Edit the code on the left. The preview updates as you type.</p>
</body>
</html>`;

/**
 * The sandbox attribute alone stops scripts but still lets a <link> or <img>
 * in the pasted markup reach the network. Injecting a restrictive CSP makes
 * the "nothing is fetched" promise actually true: inline styling and data-URI
 * images still render, everything remote is refused.
 */
const PREVIEW_CSP = "default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; form-action 'none'; base-uri 'none'";

const cspTag = `<meta http-equiv="Content-Security-Policy" content="${PREVIEW_CSP}">`;

// A fragment with no <head> gets an implicit one when the iframe parses it, so
// prepending the tag still lands it in the head and still takes effect.
export const previewSrcdoc = (html) => {
  const src = String(html);
  return /<head(\s[^>]*)?>/i.test(src)
    ? src.replace(/<head(\s[^>]*)?>/i, (m) => `${m}${cspTag}`)
    : cspTag + src;
};

export function viewHtmlEditor() {
  const saved = read();
  const code = el('textarea', {
    class: 'textarea mono', spellcheck: 'false',
    style: 'min-height:60vh;font-size:13px;tab-size:2',
  });
  code.value = saved.html ?? SNIPPET;

  const frame = el('iframe', {
    title: 'Live preview',
    sandbox: 'allow-same-origin',            // scripts blocked; styling and layout allowed
    style: 'width:100%;height:60vh;border:1px solid var(--line);border-radius:var(--radius-sm);background:#fff',
  });

  const status = el('span', { style: 'color:var(--ink-faint);font-family:var(--mono);font-size:12px' }, '');

  const refresh = debounce(() => {
    const html = code.value;
    // write through srcdoc so no network request is ever made
    frame.srcdoc = previewSrcdoc(html);
    write({ html });
    const open = (html.match(/<([a-z][a-z0-9]*)\b/gi) ?? []).length;
    const close = (html.match(/<\/[a-z][a-z0-9]*>/gi) ?? []).length;
    status.textContent = open === close
      ? `${html.length} chars · tags balanced`
      : `${html.length} chars · ${open} open / ${close} closed — unbalanced`;
    status.style.color = open === close ? 'var(--ink-faint)' : 'var(--warn)';
  }, 300);

  code.addEventListener('input', refresh);
  code.addEventListener('keydown', (e) => {
    // Tab inserts two spaces instead of leaving the field
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = code.selectionStart, t = code.selectionEnd;
      code.value = `${code.value.slice(0, s)}  ${code.value.slice(t)}`;
      code.selectionStart = code.selectionEnd = s + 2;
      refresh();
    }
  });
  refresh();

  const node = frag(
    el('nav', { class: 'crumbs' }, el('a', { href: '#/' }, 'Home'), el('span', { 'aria-hidden': 'true' }, '/'), el('span', {}, 'HTML editor')),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Tool'),
      el('h1', {}, 'HTML editor & viewer'),
      el('p', {}, 'Write markup on the left and see it render on the right. The preview runs sandboxed with scripts disabled, and nothing is ever fetched over the network.'),
    ),
    el('section', { class: 'panel' },
      el('div', { class: 'split' },
        el('div', {},
          el('div', { class: 'pane-head', style: 'margin-bottom:8px' },
            el('span', { class: 'pane-title' }, 'Source'), status),
          code),
        el('div', {},
          el('div', { class: 'pane-head', style: 'margin-bottom:8px' },
            el('span', { class: 'pane-title' }, 'Preview')),
          frame),
      ),
      el('div', { class: 'btn-row' },
        el('button', { class: 'btn btn-primary', type: 'button', onclick: () => download('page.html', code.value) }, icon('download', { size: 16 }), el('span', {}, 'Download .html')),
        el('button', {
          class: 'btn', type: 'button', onclick: () => {
            const blob = new Blob([code.value], { type: 'text/html' });
            window.open(URL.createObjectURL(blob), '_blank', 'noopener');
          },
        }, icon('terminal', { size: 16 }), el('span', {}, 'Open in new tab')),
        el('button', { class: 'btn', type: 'button', onclick: () => { code.value = SNIPPET; refresh(); toast('Example loaded'); } }, el('span', {}, 'Load example')),
        el('button', { class: 'btn', type: 'button', onclick: () => navigateView('/convert?from=text&to=hex') }, icon('hash', { size: 16 }), el('span', {}, 'Escape entities →')),
      ),
    ),
  );
  node.pageTitle = 'HTML editor & viewer — HexKit';
  node.pageDescription = 'Write HTML with a live sandboxed preview. Nothing leaves your browser.';
  return node;
}

/* navigate without importing the router here (avoids a cycle) */
/* ── scientific calculator ──────────────────────────────────────────────── */

/**
 * The scientific calculator is a real keypad, not a typed expression with a
 * purse of extras. The keypad builds an expression string and hands it to the
 * same BigInt-free recursive-descent parser the rest of the site uses, so
 * there is a single definition of what an expression means.
 */
export function viewScientific() {
  let expr = '';
  let justEvaluated = false;
  let memory = 0;
  let trig = 'deg';
  const history = [];

  const display = el('input', {
    class: 'input mono sci-display', type: 'text', spellcheck: 'false',
    autocomplete: 'off', 'aria-label': 'Expression', placeholder: '0',
  });
  const memoryLive = () => (memory ? `M ${formatNumber(memory)}` : '');
  const memoryEl = el('span', { class: 'sci-memory' }, memoryLive());
  const modeEl = el('span', { class: 'sci-mode' }, 'DEG');
  const histBox = el('div', { class: 'sci-history', 'aria-label': 'History' });

  const render = () => {
    display.value = expr;
    memoryEl.textContent = memoryLive();
    modeEl.textContent = trig.toUpperCase();
    // Highlight the active DEG/RAD key instead of overwriting the labels.
    for (const btn of keyGrid?.querySelectorAll('.key-mode') ?? []) {
      btn.classList.toggle('key-mode-active', btn.textContent === trig.toUpperCase());
    }
  };
  const renderHistory = () => {
    mount(histBox, ...history.slice(0, 6).map((h) => {
      const item = el('button', { type: 'button', class: 'sci-history-item', title: h.expr }, h.result);
      item.append(el('span', { class: 'sci-history-expr' }, h.expr));
      item.addEventListener('click', () => { expr = h.result; justEvaluated = true; render(); });
      return item;
    }));
  };

  const append = (frag) => {
    // After an evaluation, a digit starts a fresh expression but an operator
    // carries the result forward, which is how physical keypads behave.
    if (justEvaluated) {
      expr = /^[0-9.(]/.test(frag) ? '' : display.value;
      justEvaluated = false;
    }
    expr += frag;
    render();
  };
  const backspace = () => { if (!justEvaluated) { expr = expr.slice(0, -1); render(); } };
  const clear = () => { expr = ''; justEvaluated = false; render(); };

  const evaluate = () => {
    if (!expr.trim()) return;
    try {
      const value = evalExpr(expr, { trig });
      const shown = formatNumber(value);
      history.unshift({ expr: expr.trim(), result: shown });
      expr = shown;
      justEvaluated = true;
      render();
      renderHistory();
      toast(`= ${shown}`, 1400);
    } catch (e) {
      toast(`⚠ ${e.message ?? String(e)}`, 3200);
    }
  };

  // Every row is exactly five keys so the grid never packs a key from one
  // authored row into the cell of the next.
  const KEY_ROWS = [
    [{ t: 'sin(', ins: 'sin(', k: 'fn' }, { t: 'cos(', ins: 'cos(', k: 'fn' }, { t: 'tan(', ins: 'tan(', k: 'fn' },
      { t: 'asin(', ins: 'asin(', k: 'fn' }, { t: 'acos(', ins: 'acos(', k: 'fn' }],
    [{ t: 'atan(', ins: 'atan(', k: 'fn' }, { t: 'ln(', ins: 'ln(', k: 'fn' }, { t: 'log(', ins: 'log(', k: 'fn' },
      { t: '√(', ins: 'sqrt(', k: 'fn' }, { t: '∛(', ins: 'cbrt(', k: 'fn' }],
    [{ t: 'x²', ins: '^2', k: 'fn' }, { t: 'x³', ins: '^3', k: 'fn' }, { t: '1/', ins: '1/', k: 'fn' },
      { t: 'e^x', ins: 'exp(', k: 'fn' }, { t: '10^x', ins: 'pow(10,', k: 'fn' }],
    [{ t: 'π', ins: 'pi', k: 'fn' }, { t: 'e', ins: 'e', k: 'fn' }, { t: 'x!', ins: '!', k: 'fn' },
      { t: 'MC', mem: 'clear', k: 'mem' }, { t: 'MR', mem: 'recall', k: 'mem' }],
    [{ t: 'M+', mem: 'add', k: 'mem' }, { t: 'M−', mem: 'sub', k: 'mem' }, { t: 'MS', mem: 'store', k: 'mem' },
      { t: 'DEG', mode: 'deg', k: 'mode' }, { t: 'RAD', mode: 'rad', k: 'mode' }],
    [{ t: '7', k: 'digit' }, { t: '8', k: 'digit' }, { t: '9', k: 'digit' }, { t: '÷', ins: '/', k: 'op' },
      { t: 'C', clear: true, k: 'op' }],
    [{ t: '4', k: 'digit' }, { t: '5', k: 'digit' }, { t: '6', k: 'digit' }, { t: '×', ins: '*', k: 'op' },
      { t: '⌫', backspace: true, k: 'op' }],
    [{ t: '1', k: 'digit' }, { t: '2', k: 'digit' }, { t: '3', k: 'digit' }, { t: '−', ins: '-', k: 'op' },
      { t: '^', ins: '^', k: 'op' }],
    [{ t: '0', k: 'digit' }, { t: '.', k: 'digit' }, { t: '(', ins: '(', k: 'op' }, { t: '+', ins: '+', k: 'op' },
      { t: ')', ins: ')', k: 'op' }],
    [{ t: '=', equals: true, k: 'eq', span: 5 }],
  ];

  const keyGrid = el('div', { class: 'keypad' });
  for (const row of KEY_ROWS) {
    for (const key of row) {
      const btn = el('button', {
        type: 'button',
        class: `key key-${key.k ?? 'digit'}`,
        style: key.span ? `grid-column: span ${key.span}` : '',
      }, key.t);
      btn.addEventListener('click', () => {
        if (key.equals) return evaluate();
        if (key.clear) return clear();
        if (key.backspace) return backspace();
        if (key.span) return;
        if (key.mem === 'clear') { memory = 0; render(); return; }
        if (key.mem === 'recall') { append(String(memory)); return; }
        if (key.mem === 'add') { memory += currentValue(); render(); toast(`M = ${formatNumber(memory)}`, 1200); return; }
        if (key.mem === 'sub') { memory -= currentValue(); render(); toast(`M = ${formatNumber(memory)}`, 1200); return; }
        if (key.mem === 'store') { memory = currentValue(); render(); toast('Stored to memory', 1200); return; }
        if (key.mode) { trig = key.mode; render(); toast(`Trigonometric mode: ${trig.toUpperCase()}`); return; }
        append(key.ins ?? key.t);
      });
      keyGrid.append(btn);
    }
  }

  const currentValue = () => {
    try { return evalExpr(display.value || '0', { trig }); } catch { return 0; }
  };

  display.addEventListener('input', () => {
    if (display.value === '' || display.value === '0') { expr = ''; } else { expr = display.value; }
    justEvaluated = false;
  });
  display.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); evaluate(); }
    else if (e.key === 'Escape') { e.preventDefault(); clear(); }
  });

  const node = frag(
    el('nav', { class: 'crumbs' },
      el('a', { href: '#/' }, 'Home'), el('span', { 'aria-hidden': 'true' }, '/'),
      el('a', { href: '#/tools' }, 'Calculators'), el('span', { 'aria-hidden': 'true' }, '/'),
      el('span', {}, 'Scientific calculator')),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Math'),
      el('h1', {}, 'Scientific calculator'),
      el('p', {}, 'Full keypad with precedence, functions, memory and history. Trigonometric mode defaults to degrees; toggle to radians with DEG/RAD.'),
    ),
    el('div', { class: 'panel sci-panel' },
      el('div', { class: 'sci-top' }, memoryEl, modeEl),
      display,
      keyGrid,
      el('p', { style: 'margin:12px 0 0;color:var(--ink-faint);font-size:13px' },
        'Precedence: parentheses → power → × ÷ % → + −. Functions take one or two parenthesised arguments. History is kept for this session only.'),
    ),
    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'History')),
      histBox,
    ),
  );
  node.pageTitle = 'Scientific calculator — HexKit';
  node.pageDescription = 'Free scientific calculator with a full keypad, precedence, functions, memory and history. Runs in your browser and works offline.';
  return node;
}

function formatNumber(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return 'Invalid';
  if (v !== 0 && (Math.abs(v) >= 1e12 || Math.abs(v) < 1e-8)) return v.toExponential(10);
  return String(Number(v.toPrecision(13)));
}

function navigateView(path) { location.hash = path; }

/* ── HTML entity / colour-code browser ──────────────────────────────────── */

const ENTITIES = [
  ['&amp;', '&'], ['&lt;', '<'], ['&gt;', '>'], ['&quot;', '"'], ['&#39;', "'"],
  ['&nbsp;', 'non-breaking space'], ['&copy;', '©'], ['&reg;', '®'], ['&trade;', '™'],
  ['&hellip;', '…'], ['&mdash;', '—'], ['&ndash;', '–'], ['&laquo;', '«'],
  ['&deg;', '°'], ['&plusmn;', '±'], ['&times;', '×'], ['&divide;', '÷'],
  ['&micro;', 'µ'], ['&para;', '¶'], ['&sect;', '§'], ['&middot;', '·'],
  ['&bull;', '•'], ['&dagger;', '†'], ['&prime;', '′'], ['&larr;', '←'],
  ['&uarr;', '↑'], ['&rarr;', '→'], ['&darr;', '↓'], ['&infin;', '∞'],
  ['&ne;', '≠'], ['&le;', '≤'], ['&ge;', '≥'], ['&asymp;', '≈'],
  ['&sum;', '∑'], ['&radic;', '√'], ['&int;', '∫'], ['&Omega;', 'Ω'],
  ['&alpha;', 'α'], ['&beta;', 'β'], ['&pi;', 'π'], ['&sigma;', 'σ'],
  ['&larr;', '←'], ['&check;', '✓'], ['&cross;', '✗'], ['&star;', '★'],
];

export function viewEntities() {
  const search = el('input', { class: 'input', type: 'search', placeholder: 'Search entity or character…', autocomplete: 'off' });
  const list = el('div', { class: 'grid grid-3' });

  const draw = () => {
    const term = search.value.trim().toLowerCase();
    const hits = ENTITIES.filter(([e, c]) => !term
      || e.toLowerCase().includes(term) || c.toLowerCase().includes(term));
    mount(list, ...(hits.length ? hits.map(([e, c]) => {
      const card = el('button', { class: 'tool-card', type: 'button', style: 'cursor:pointer;text-align:left' });
      card.append(
        el('h3', { style: 'font-size:26px;font-family:var(--mono);color:var(--signal)' }, c),
        el('p', { class: 'mono' }, e),
      );
      card.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(e); toast(`Copied ${e}`); }
        catch { toast('Clipboard unavailable', 2500); }
      });
      return card;
    }) : [el('p', { style: 'color:var(--ink-faint)' }, 'Nothing matches that search.')]));
  };
  search.addEventListener('input', debounce(draw, 140));
  draw();

  const node = frag(
    el('nav', { class: 'crumbs' }, el('a', { href: '#/' }, 'Home'), el('span', { 'aria-hidden': 'true' }, '/'), el('span', {}, 'HTML entities')),
    el('section', { class: 'page-head' },
      el('span', { class: 'hero-eyebrow' }, 'Tool'),
      el('h1', {}, 'HTML entities & colour codes'),
      el('p', {}, 'Click any entity to copy it. For the full RGB / HEX / HSL / HSV / CMYK conversions use the colour tool.'),
    ),
    el('section', { class: 'panel' },
      el('div', { style: 'margin-bottom:16px' }, search),
      list,
    ),
    el('section', { class: 'section' },
      el('div', { class: 'section-head' }, el('h2', {}, 'Colour codes')),
      el('div', { class: 'grid grid-2' },
        el('a', { class: 'tool-card', href: '#/tool/color-convert' }, el('h3', {}, 'Colour converter'), el('p', {}, 'RGB ⇄ HEX ⇄ HSL ⇄ HSV ⇄ CMYK in one field group.')),
        el('a', { class: 'tool-card', href: '#/ascii' }, el('h3', {}, 'ASCII table'), el('p', {}, 'Character codes 0–127 with binary and hex.')),
      ),
    ),
  );
  node.pageTitle = 'HTML entities & colour codes — HexKit';
  node.pageDescription = 'A copyable reference of HTML entities and numeric colour code formats.';
  return node;
}