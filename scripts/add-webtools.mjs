import fs from 'fs';
const p = 'js/ui/content.js';
let s = fs.readFileSync(p, 'utf8');
const marker = "export function viewMathRef() {";
const i = s.indexOf(marker);
if (i < 0) throw new Error('marker nf');
const helpers = `
function webTTS(title) {
  const ta = el('textarea', { class: 'textarea', style: 'min-height:160px', placeholder: 'Enter text to speak...' }, 'Hello! This is text to speech in your browser.');
  const msg = el('div', { style: 'margin-top:8px;color:var(--ink-dim)' }, '');
  const speak = () => {
    if (!('speechSynthesis' in window)) { msg.textContent = 'Speech synthesis is not supported in this browser.'; return; }
    try { window.speechSynthesis.cancel(); } catch {}
    const u = new SpeechSynthesisUtterance(ta.value || '');
    u.onstart = () => { msg.textContent = 'Speaking...'; };
    u.onend = () => { msg.textContent = 'Done.'; };
    u.onerror = () => { msg.textContent = 'Speech failed or was interrupted.'; };
    try { window.speechSynthesis.speak(u); } catch { msg.textContent = 'Speech synthesis is not available.'; }
  };
  const stop = () => { try { window.speechSynthesis.cancel(); msg.textContent = 'Stopped.'; } catch {} };
  const node = frag(
    crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }),
    el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, "Convert text to speech using your browser's speech synthesis (when available).")),
    el('section', { class: 'panel' }, ta, el('div', { class: 'btn-row', style: 'margin-top:12px' },
      el('button', { class: 'btn btn-primary', type: 'button', onclick: speak }, 'Speak'),
      el('button', { class: 'btn', type: 'button', onclick: stop }, 'Stop')
    ), msg)
  );
  node.pageTitle = title + ' - Online Tools - HexKit'; node.pageDescription = 'Text to speech online tool.'; return node;
}

function webTone(title) {
  let ctx = null, osc = null, gain = null;
  const freq = el('input', { type: 'range', min: '20', max: '2000', value: '440', class: 'input', style: 'width:100%' });
  const out = el('span', { class: 'mono' }, '440 Hz');
  freq.oninput = () => { out.textContent = freq.value + ' Hz'; if (osc) try { osc.frequency.value = +freq.value; } catch {} };
  const msg = el('div', { style: 'margin-top:8px;color:var(--ink-dim)' }, '');
  const start = async () => {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { msg.textContent = 'Web Audio is not available in this browser.'; return; }
      ctx = ctx || new AC();
      if (ctx.resume) await ctx.resume();
      if (osc) return;
      osc = ctx.createOscillator(); gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = +freq.value; gain.gain.value = 0.08;
      osc.connect(gain).connect(ctx.destination); osc.start();
      msg.textContent = 'Playing tone.';
    } catch { msg.textContent = 'Web Audio is not available in this browser.'; }
  };
  const stop = () => { try { if (osc) { osc.stop(); osc.disconnect(); } } catch {} osc = null; try { if (gain) gain.disconnect(); } catch {} gain = null; msg.textContent = 'Stopped.'; };
  const node = frag(
    crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }),
    el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, 'Generate a simple tone in your browser using Web Audio (when available).')),
    el('section', { class: 'panel' },
      el('label', {}, 'Frequency: ', out),
      freq,
      el('div', { class: 'btn-row', style: 'margin-top:12px' },
        el('button', { class: 'btn btn-primary', type: 'button', onclick: start }, 'Play'),
        el('button', { class: 'btn', type: 'button', onclick: stop }, 'Stop')
      ),
      msg,
      el('p', { style: 'margin-top:12px;color:var(--ink-faint);font-size:14px' }, 'Use moderate volume. Actual loudness depends on your device.')
    )
  );
  node.pageTitle = title + ' - Online Tools - HexKit'; node.pageDescription = 'Online tone generator.'; return node;
}

function webRuler(title, unit) {
  const isCm = unit === 'cm';
  const max = isCm ? 20 : 8;
  const marks = [];
  for (let i = 0; i <= max; i++) {
    const tall = (isCm ? (i % 1 === 0) : (i % 1 === 0));
    marks.push(el('div', { style: 'position:absolute;left:' + ((i / max) * 100) + '%;bottom:0;height:' + (tall ? '60%' : '35%') + ';border-left:2px solid var(--ink-faint)' },
      tall ? el('span', { style: 'position:absolute;top:-22px;left:-6px;font-size:12px;color:var(--ink-dim)' }, String(i)) : null
    ));
  }
  const bar = el('div', { style: 'position:relative;height:90px;border:1px solid var(--line);border-radius:8px;background:var(--panel-2);margin-top:12px' }, ...marks);
  const node = frag(
    crumbs({ label: 'Web Tools', href: '#/web-tools' }, { label: title }),
    el('section', { class: 'page-head' }, el('h1', {}, title), el('p', {}, isCm ? 'On-screen centimeter ruler.' : 'On-screen inch ruler.')),
    el('section', { class: 'panel' },
      bar,
      el('p', { style: 'margin-top:12px;color:var(--ink-dim)' }, 'Physical accuracy depends on your screen size, resolution, and scaling. For precise measurement, calibrate against a known object.')
    )
  );
  node.pageTitle = title + ' - Online Tools - HexKit'; node.pageDescription = 'Online ruler tool.'; return node;
}
`;
s = s.slice(0, i) + helpers + '\n' + s.slice(i);
fs.writeFileSync(p, s);
console.log('helpers added');
