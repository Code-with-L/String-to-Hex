/**
 * Standalone tools that need their own surface rather than the generic
 * input/results form: a notepad, an HTML editor with live preview, and an
 * HTML/CSS colour-code browser. All state stays in localStorage.
 */

import { el, frag, mount, download, toast, debounce, loadState, saveState } from './dom.js';
import { icon } from './icons.js';

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