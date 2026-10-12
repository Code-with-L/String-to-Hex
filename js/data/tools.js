/**
 * Multi-input calculators — every formula transcribed from the reference site.
 * A tool is: { id, title, group, blurb, inputs[], compute(v) -> {values, steps, outputs} }
 * `v` is an object keyed by input id.
 */

const n = (x, d = 0) => {
  const v = Number(x);
  return Number.isFinite(v) ? v : (d || 0);
};
const g = (x, p = 6) => {
  if (!Number.isFinite(x)) return '—';
  return String(Number(x.toFixed(p)));
};
const SQRT3 = Math.sqrt(3);

/** Cryptographically-seeded words where available, Math.random otherwise. */
function randomWords(count, secure) {
  const buf = new Uint32Array(count);
  if (secure && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(buf);
    return buf;
  }
  for (let i = 0; i < count; i++) buf[i] = Math.floor(Math.random() * 4294967296);
  return buf;
}
const sup = (x) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(String(x).charAt(0))] === undefined
  ? String(x).split('').map((c) => ({ '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' }[c] ?? c)).join('')
  : String(x).split('').map((c) => ({ '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' }[c] ?? c)).join('');

export const GROUPS = [
  { id: 'electrical', title: 'Electrical & Electronics' },
  { id: 'math', title: 'Math & Statistics' },
  { id: 'number', title: 'Number & Radix' },
  { id: 'color', title: 'Colour' },
  { id: 'text', title: 'Text & Encoding' },
  { id: 'finance', title: 'Finance & Grades' },
  { id: 'health', title: 'Health' },
  { id: 'time', title: 'Time & Date' },
  { id: 'wire', title: 'Wire & AWG' },
  { id: 'general', title: 'General Tools' },
];

const COLOR_DIGITS = [['0', 'Black'], ['1', 'Brown'], ['2', 'Red'], ['3', 'Orange'], ['4', 'Yellow'],
  ['5', 'Green'], ['6', 'Blue'], ['7', 'Violet'], ['8', 'Gray'], ['9', 'White']];
const COLOR_MULT = [['-2', 'Silver ×0.01'], ['-1', 'Gold ×0.1'], ['0', 'Black ×1'], ['1', 'Brown ×10'],
  ['2', 'Red ×100'], ['3', 'Orange ×1k'], ['4', 'Yellow ×10k'], ['5', 'Green ×100k'], ['6', 'Blue ×1M']];
const COLOR_MULT_VAL = { '-2': 0.01, '-1': 0.1, 0: 1, 1: 10, 2: 100, 3: 1000, 4: 10000, 5: 100000, 6: 1e6 };
const COLOR_TOL = [['5', 'Gold ±5%'], ['10', 'Silver ±10%'], ['20', 'None ±20%'], ['1', 'Brown ±1%'],
  ['2', 'Red ±2%'], ['0.5', 'Blue ±0.25%'], ['0.1', 'Violet ±0.1%']];
const COLOR_TOL_VAL = { 5: 5, 10: 10, 20: 20, 1: 1, 2: 2, 0.5: 0.25, 0.1: 0.1 };

/* ── electrical ──────────────────────────────────────────────────────────── */

const OHMS = {
  id: 'ohms-law',
  title: "Ohm's law solver",
  group: 'electrical',
  blurb: 'Enter any two of V, I, R or P — the other two are solved at once.',
  keywords: 'ohm voltage current resistance power v i r',
  inputs: [
    { id: 'v', label: 'Voltage', symbol: 'V', unit: 'V', step: 'any' },
    { id: 'i', label: 'Current', symbol: 'I', unit: 'A', step: 'any' },
    { id: 'r', label: 'Resistance', symbol: 'R', unit: 'Ω', step: 'any' },
    { id: 'p', label: 'Power', symbol: 'P', unit: 'W', step: 'any' },
  ],
  compute: ({ v, i, r, p }) => {
    const has = (x) => x !== '' && x !== null && x !== undefined && Number.isFinite(Number(x));
    const V = has(v) ? n(v) : null, I = has(i) ? n(i) : null, R = has(r) ? n(r) : null, P = has(p) ? n(p) : null;
    if ([V, I, R, P].filter((x) => x !== null).length < 2) return { error: 'Enter at least two values.' };
    const out = { v: V, i: I, r: R, p: P };
    const steps = [];
    if (V !== null && R !== null && R !== 0) {
      out.i = V / R; out.p = V * out.i;
      steps.push(`I = V / R = ${g(V)} / ${g(R)} = ${g(out.i)} A`, `P = V × I = ${g(V)} × ${g(out.i)} = ${g(out.p)} W`);
    } else if (V !== null && I !== null && I !== 0) {
      out.r = V / I; out.p = V * I;
      steps.push(`R = V / I = ${g(V)} / ${g(I)} = ${g(out.r)} Ω`, `P = V × I = ${g(V)} × ${g(I)} = ${g(out.p)} W`);
    } else if (V !== null && P !== null && P !== 0) {
      out.i = P / V; out.r = V * V / P;
      steps.push(`I = P / V = ${g(P)} / ${g(V)} = ${g(out.i)} A`, `R = V² / P = ${g(V)}² / ${g(P)} = ${g(out.r)} Ω`);
    } else if (I !== null && R !== null && R !== 0) {
      out.v = I * R; out.p = out.v * I;
      steps.push(`V = I × R = ${g(I)} × ${g(R)} = ${g(out.v)} V`, `P = V × I = ${g(out.v)} × ${g(I)} = ${g(out.p)} W`);
    } else if (I !== null && P !== null && I !== 0) {
      out.v = P / I; out.r = out.v / I;
      steps.push(`V = P / I = ${g(P)} / ${g(I)} = ${g(out.v)} V`, `R = V / I = ${g(out.v)} / ${g(I)} = ${g(out.r)} Ω`);
    } else if (R !== null && P !== null && P !== 0) {
      out.i = Math.sqrt(P / R); out.v = out.i * R;
      steps.push(`I = √(P / R) = √(${g(P)} ÷ ${g(R)}) = ${g(out.i)} A`, `V = I × R = ${g(out.i)} × ${g(R)} = ${g(out.v)} V`);
    } else return { error: 'Cannot solve — check for division by zero.' };
    // No explicit `outputs`: the four inputs are also the four results, so the
    // default (input id → label/unit) mapping is exactly right.
    return { values: out, steps };
  },
};
const LABELS = { v: 'Voltage', i: 'Current', r: 'Resistance', p: 'Power' };
const UNITS = { v: 'V', i: 'A', r: 'Ω', p: 'W' };

const DIVIDER = {
  id: 'voltage-divider',
  title: 'Voltage divider',
  group: 'electrical',
  blurb: 'Leave one field empty — the solver computes it from the other three.',
  keywords: 'divider resistor voltage r1 r2',
  inputs: [
    { id: 'vin', label: 'Input voltage', unit: 'V', step: 'any' },
    { id: 'vout', label: 'Output voltage', unit: 'V', step: 'any' },
    { id: 'r1', label: 'R₁', unit: 'Ω', step: 'any' },
    { id: 'r2', label: 'R₂', unit: 'Ω', step: 'any' },
  ],
  compute: ({ vin, vout, r1, r2 }) => {
    const has = (x) => x !== '' && x !== null && x !== undefined;
    const V1 = has(vin) ? n(vin) : null, Vo = has(vout) ? n(vout) : null,
      R1 = has(r1) ? n(r1) : null, R2 = has(r2) ? n(r2) : null;
    if ([V1, Vo, R1, R2].filter((x) => x !== null).length < 3) return { error: 'Enter three of the four values.' };
    const out = { vin: V1, vout: Vo, r1: R1, r2: R2 }, steps = [];
    if (V1 !== null && Vo === null && R1 !== null && R2 !== null && R1 + R2 !== 0) {
      out.vout = V1 * R2 / (R1 + R2);
      steps.push('Vout = Vin · R₂ ÷ (R₁ + R₂)', `= ${g(V1)} × ${g(R2)} ÷ (${g(R1)} + ${g(R2)}) = ${g(out.vout)} V`);
    } else if (V1 !== null && Vo !== null && R1 !== null && R2 === null && V1 !== Vo) {
      out.r2 = R1 * Vo / (V1 - Vo);
      steps.push('R₂ = R₁ · Vout ÷ (Vin − Vout)', `= ${g(R1)} × ${g(Vo)} ÷ (${g(V1)} − ${g(Vo)}) = ${g(out.r2)} Ω`);
    } else if (V1 !== null && Vo !== null && R1 === null && R2 !== null && Vo !== 0) {
      out.r1 = R2 * (V1 - Vo) / Vo;
      steps.push('R₁ = R₂ · (Vin − Vout) ÷ Vout', `= ${g(R2)} × (${g(V1)} − ${g(Vo)}) ÷ ${g(Vo)} = ${g(out.r1)} Ω`);
    } else if (V1 === null && Vo !== null && R1 !== null && R2 !== null && R2 !== 0) {
      out.vin = Vo * (R1 + R2) / R2;
      steps.push('Vin = Vout · (R₁ + R₂) ÷ R₂', `= ${g(Vo)} × (${g(R1)} + ${g(R2)}) ÷ ${g(R2)} = ${g(out.vin)} V`);
    } else return { error: 'Those four values cannot be solved as a divider.' };
    return { values: out, steps, outputs: [
      { id: 'vin', label: 'Input voltage', unit: 'V' }, { id: 'vout', label: 'Output voltage', unit: 'V' },
      { id: 'r1', label: 'R₁', unit: 'Ω' }, { id: 'r2', label: 'R₂', unit: 'Ω' },
    ] };
  },
};

const POWER_FACTOR = {
  id: 'power-factor',
  title: 'Power factor & three-phase kVA',
  group: 'electrical',
  blurb: 'kVA = V × A × phase ÷ 1000, PF = kW ÷ kVA, kvar = √(kVA² − kW²).',
  keywords: 'power factor kva three phase reactive',
  inputs: [
    { id: 'v', label: 'Line voltage', unit: 'V', step: 'any' },
    { id: 'a', label: 'Current', unit: 'A', step: 'any' },
    { id: 'kw', label: 'Real power', unit: 'kW', step: 'any' },
    { id: 'phase', label: 'System', type: 'select', options: [['1', 'Single phase'], ['3y', 'Three-phase Y (×√3)'], ['3d', 'Three-phase Δ (×3)']] },
  ],
  compute: ({ v, a, kw, phase }) => {
    const V = n(v), A = n(a), KW = n(kw);
    if (!V || !A) return { error: 'Voltage and current are required.' };
    const factor = phase === '3y' ? SQRT3 : phase === '3d' ? 3 : 1;
    const kva = V * A * factor / 1000;
    const pf = KW && kva > 0 ? KW / kva : 0;
    const kvar = KW ? Math.sqrt(Math.max(0, kva * kva - KW * KW)) : 0;
    const steps = [
      `kVA = V × A × ${g(factor, 4)} ÷ 1000`,
      `= ${g(V)} × ${g(A)} × ${g(factor, 4)} ÷ 1000 = ${g(kva)} kVA`,
      pf ? `PF = kW ÷ kVA = ${g(KW)} ÷ ${g(kva)} = ${g(pf, 4)}` : '',
      kvar ? `kvar = √(kVA² − kW²) = ${g(kvar, 4)}` : '',
    ].filter(Boolean);
    return { values: { kva, pf, kvar }, steps, outputs: [
      { id: 'kva', label: 'Apparent power', unit: 'kVA' },
      { id: 'pf', label: 'Power factor', unit: '' },
      { id: 'kvar', label: 'Reactive power', unit: 'kvar' },
    ] };
  },
};

const THREEPHASE = {
  id: 'three-phase',
  title: 'Three-phase power',
  group: 'electrical',
  blurb: 'P = √3 · V · I · PF for star, 3 · V · I · PF for delta.',
  keywords: 'three phase star delta power',
  inputs: [
    { id: 'v', label: 'Line voltage', unit: 'V', step: 'any' },
    { id: 'i', label: 'Current', unit: 'A', step: 'any' },
    { id: 'pf', label: 'Power factor', unit: '', step: '0.01' },
    { id: 'type', label: 'Connection', type: 'select', options: [['star', 'Star (Y) — √3 · V · I'], ['delta', 'Delta (Δ) — 3 · V · I']] },
  ],
  compute: ({ v, i, pf, type }) => {
    const V = n(v), I = n(i), PF = pf === '' ? 1 : n(pf);
    if (!V || !I) return { error: 'Voltage and current are required.' };
    const k = type === 'delta' ? 3 : SQRT3;
    const s = k * V * I;
    const p = s * PF;
    return {
      values: { p, s, kva: s / 1000, pf: s ? p / s : 0 },
      steps: [
        type === 'delta' ? 'P = 3 · V · I · PF' : 'P = √3 · V · I · PF',
        `= ${g(k, 4)} × ${g(V)} × ${g(I)} × ${g(PF, 4)} = ${g(p, 4)} W = ${g(p / 1000, 4)} kW`,
      ],
      outputs: [
        { id: 'p', label: 'Real power', unit: 'W' }, { id: 's', label: 'Apparent power', unit: 'VA' },
        { id: 'kva', label: 'Apparent power', unit: 'kVA' }, { id: 'pf', label: 'Power factor', unit: '' },
      ],
    };
  },
};

const AWG_DIAMETER = { 14: 1.6286, 12: 2.0523, 10: 2.588, 8: 3.2639, 6: 4.1148, 4: 5.1672, 2: 6.4802, '1/0': 8.2303, '2/0': 10.3588, '4/0': 13.0535 };

const VOLTAGE_DROP = {
  id: 'voltage-drop',
  title: 'Voltage drop',
  group: 'electrical',
  blurb: 'R = 2ρL ÷ A and Vd = I·R, with √3/2 for three-phase.',
  keywords: 'voltage drop wire resistance length conductor',
  inputs: [
    { id: 'awg', label: 'Conductor', type: 'select', options: [...Object.keys(AWG_DIAMETER).map((k) => [k, `${k} AWG`]), ['custom', 'Custom diameter (mm)']] },
    { id: 'd', label: 'Diameter', unit: 'mm', step: 'any' },
    { id: 'len', label: 'One-way length', unit: 'm', step: 'any' },
    { id: 'i', label: 'Current', unit: 'A', step: 'any' },
    { id: 'v', label: 'Supply voltage', unit: 'V', step: 'any' },
    { id: 'rho', label: 'Resistivity ρ', unit: 'Ω·m', step: 'any' },
    { id: 'phase', label: 'System', type: 'select', options: [['1', 'Single phase'], ['3', 'Three phase']] },
  ],
  compute: ({ awg, d, len, i, v, rho, phase }) => {
    const D = awg === 'custom' ? n(d) : (AWG_DIAMETER[awg] ?? 0);
    const L = n(len), I = n(i), V = n(v), RHO = rho === '' || rho === undefined ? 1.72e-8 : n(rho);
    if (!D || !L || !V) return { error: 'Conductor, length and supply voltage are required.' };
    const area = Math.PI * D * D / 4;
    const R = 2 * RHO * L / (area * 1e-6);
    const factor = phase === '3' ? SQRT3 / 2 : 1;
    const vd = I * R * factor;
    return {
      values: { area, r: R, vd, vdpc: (vd / V) * 100 },
      steps: [
        `A = πd²/4 = π × ${g(D, 4)}² ÷ 4 = ${g(area, 4)} mm²`,
        `R = 2ρL ÷ A = 2 × ${RHO} × ${g(L)} ÷ ${g(area, 4)}×10⁻⁶ = ${g(R, 4)} Ω`,
        `Vd = I × R${phase === '3' ? ' × 0.866' : ''} = ${g(I)} × ${g(R, 4)}${phase === '3' ? ' × 0.866' : ''} = ${g(vd, 4)} V`,
        `Vd% = Vd ÷ V × 100 = ${g(vd, 4)} ÷ ${g(V)} × 100 = ${g((vd / V) * 100, 3)} %`,
      ],
      outputs: [
        { id: 'area', label: 'Cross-section', unit: 'mm²' }, { id: 'r', label: 'Loop resistance', unit: 'Ω' },
        { id: 'vd', label: 'Voltage drop', unit: 'V' }, { id: 'vdpc', label: 'Voltage drop', unit: '%' },
      ],
    };
  },
};

const WIRE_GAUGE = {
  id: 'wire-gauge',
  title: 'Wire gauge (AWG / SWG)',
  group: 'wire',
  blurb: 'd(in) = 0.005 · 92^((36 − n)/39) — the logarithmic AWG scale.',
  keywords: 'awg swg wire gauge thickness diameter',
  inputs: [
    { id: 'n', label: 'Gauge number', type: 'number', step: 'any' },
    { id: 'mode', label: 'Standard', type: 'select', options: [['awg', 'AWG (American)'], ['swg', 'SWG (British)']] },
  ],
  compute: ({ n: raw, mode }) => {
    const ALIAS = { '00': -1, '000': -2, '0000': -3, '00000': -4, '000000': -5 };
    const key = String(raw ?? '').trim();
    const gauge = ALIAS[key] !== undefined ? ALIAS[key] : Number(key);
    if (mode === 'swg') {
      const SWG = [0.5, 0.464, 0.432, 0.4, 0.372, 0.348, 0.324, 0.3, 0.276, 0.252, 0.232, 0.212, 0.192, 0.176, 0.16, 0.144, 0.128, 0.116, 0.104, 0.092, 0.08, 0.072, 0.064, 0.056, 0.048, 0.04, 0.036, 0.032, 0.028, 0.024, 0.022, 0.02, 0.018, 0.0164, 0.0148, 0.0136, 0.0124, 0.0116, 0.0108, 0.01, 0.0092, 0.0084, 0.0076, 0.0068, 0.006, 0.0052, 0.0048, 0.0044, 0.004, 0.0036, 0.0032, 0.0028, 0.0024, 0.002, 0.0016, 0.0012, 0.001];
      const idx = Math.round(gauge) - 1;
      if (!Number.isFinite(idx) || idx < 0 || idx >= SWG.length) return { error: 'SWG numbers run from 1 to 60.' };
      const din = SWG[idx];
      const dmm = din * 25.4;
      const amm = Math.PI / 4 * dmm * dmm;
      return {
        values: { din, dmm, amm },
        steps: [`SWG ${idx + 1} → table diameter ${din} in`, `d(mm) = ${din} × 25.4 = ${g(dmm, 4)} mm`, `A = π/4 d² = ${g(amm, 4)} mm²`],
        outputs: [{ id: 'din', label: 'Diameter', unit: 'in' }, { id: 'dmm', label: 'Diameter', unit: 'mm' }, { id: 'amm', label: 'Area', unit: 'mm²' }],
      };
    }
    if (!Number.isFinite(gauge)) return { error: 'Enter an AWG number — 14, or "00" for 2/0 gauge.' };
    const din = 0.005 * Math.pow(92, (36 - gauge) / 39);
    const dmm = 0.127 * Math.pow(92, (36 - gauge) / 39);
    const ain = Math.PI / 4 * din * din;
    const amm = Math.PI / 4 * dmm * dmm;
    const amil = 1000 * din * din;
    return {
      values: { din, dmm, ain, amm, amil },
      steps: [
        `d(in) = 0.005 × 92^((36 − ${gauge})/39) = ${g(din, 6)} in`,
        `d(mm) = 0.127 × 92^((36 − ${gauge})/39) = ${g(dmm, 6)} mm`,
        `A(in²) = π/4 d² = ${g(ain, 6)}`,
        `A(mm²) = π/4 d² = ${g(amm, 5)}`,
      ],
      outputs: [
        { id: 'din', label: 'Diameter', unit: 'in' }, { id: 'dmm', label: 'Diameter', unit: 'mm' },
        { id: 'amm', label: 'Area', unit: 'mm²' }, { id: 'ain', label: 'Area', unit: 'in²' }, { id: 'amil', label: 'Area', unit: 'mil²' },
      ],
    };
  },
};

const RESISTOR_BAND = {
  id: 'resistor-color',
  title: 'Resistor colour code',
  group: 'electrical',
  blurb: 'Digit · digit · multiplier · tolerance, read straight off the bands.',
  keywords: 'resistor color code bands tolerance',
  inputs: [
    { id: 'd1', label: 'Digit 1', type: 'select', options: COLOR_DIGITS },
    { id: 'd2', label: 'Digit 2', type: 'select', options: COLOR_DIGITS },
    { id: 'm', label: 'Multiplier', type: 'select', options: COLOR_MULT },
    { id: 't', label: 'Tolerance', type: 'select', options: COLOR_TOL },
  ],
  compute: ({ d1, d2, m, t }) => {
    const mult = COLOR_MULT_VAL[m] ?? 1;
    const tol = COLOR_TOL_VAL[t] ?? 5;
    const base = Number(d1) * 10 + Number(d2);
    const r = base * mult;
    return {
      values: { r, tol, lo: r * (1 - tol / 100), hi: r * (1 + tol / 100) },
      steps: [`R = (${d1}${d2}) × ${mult} = ${g(r)} Ω`, `tolerance ±${tol}% → ${g(r * (1 - tol / 100), 4)} … ${g(r * (1 + tol / 100), 4)} Ω`],
      outputs: [
        { id: 'r', label: 'Resistance', unit: 'Ω' }, { id: 'tol', label: 'Tolerance', unit: '%' },
        { id: 'lo', label: 'Minimum', unit: 'Ω' }, { id: 'hi', label: 'Maximum', unit: 'Ω' },
      ],
    };
  },
};

const DBM = {
  id: 'dbm',
  title: 'dBm ⇄ dBW ⇄ watts',
  group: 'electrical',
  blurb: 'P(W) = 10^((dBm − 30)/10) — logarithmic power.',
  keywords: 'dbm dbw decibel watts rf',
  inputs: [
    { id: 'v', label: 'Value', step: 'any' },
    { id: 'from', label: 'From', type: 'select', options: [['dbm', 'dBm'], ['dbw', 'dBW'], ['w', 'Watts'], ['mw', 'Milliwatts'], ['kw', 'Kilowatts']] },
  ],
  compute: ({ v, from }) => {
    const x = n(v);
    const w = from === 'dbm' ? Math.pow(10, (x - 30) / 10) : from === 'dbw' ? Math.pow(10, x / 10) : from === 'mw' ? x / 1000 : from === 'kw' ? x * 1000 : x;
    const dbm = w > 0 ? 10 * Math.log10(w * 1000) : -Infinity;
    return {
      values: { w, dbm: dbm === -Infinity ? '−∞' : g(dbm, 4), dbw: dbm === -Infinity ? '−∞' : g(dbm - 30, 4) },
      steps: from === 'dbm' ? [`W = 10^((dBm − 30)/10) = 10^((${g(x)} − 30)/10) = ${g(w)}`] : [`dBm = 10 · log₁₀(W × 1000) = ${g(dbm, 4)}`],
      outputs: [
        { id: 'dbm', label: 'Power', unit: 'dBm' }, { id: 'dbw', label: 'Power', unit: 'dBW' },
        { id: 'w', label: 'Power', unit: 'W' },
      ],
    };
  },
};

const EV = {
  id: 'ev',
  title: 'Electronvolt ⇄ joule',
  group: 'electrical',
  blurb: '1 eV = 1.602176565 × 10⁻¹⁹ J = 1 volt per elementary charge.',
  keywords: 'electronvolt ev joule voltage',
  inputs: [
    { id: 'v', label: 'Value', step: 'any' },
    { id: 'from', label: 'From', type: 'select', options: [['ev', 'Electronvolt (eV)'], ['mev', 'MeV'], ['gev', 'GeV'], ['j', 'Joule']] },
  ],
  compute: ({ v, from }) => {
    const Q = 1.602176565e-19;
    const x = n(v);
    const j = from === 'ev' ? x * Q : from === 'mev' ? x * 1e6 * Q : from === 'gev' ? x * 1e9 * Q : x;
    const ev = j / Q;
    return {
      values: { j: j.toExponential(8), ev, v: ev, kev: ev / 1e3, mev: ev / 1e6, gev: ev / 1e9 },
      steps: [`J = ${g(x)} × 1.602176565×10⁻¹⁹ = ${j.toExponential(8)}`, `eV = J ÷ 1.602176565×10⁻¹⁹ = ${g(ev, 8)}`],
      outputs: [
        { id: 'j', label: 'Energy', unit: 'J' }, { id: 'ev', label: 'Energy', unit: 'eV' },
        { id: 'kev', label: 'Energy', unit: 'keV' }, { id: 'mev', label: 'Energy', unit: 'MeV' }, { id: 'gev', label: 'Energy', unit: 'GeV' },
      ],
    };
  },
};

const ENERGY_BILL = {
  id: 'energy-bill',
  title: 'Electricity bill & consumption',
  group: 'electrical',
  blurb: 'kWh = kW × hours, cost = kWh × tariff.',
  keywords: 'electricity bill energy cost kwh tariff',
  inputs: [
    { id: 'w', label: 'Appliance power', unit: 'W', step: 'any' },
    { id: 'h', label: 'Hours per day', unit: 'h', step: 'any' },
    { id: 'n', label: 'Count', step: 'any' },
    { id: 'rate', label: 'Tariff', unit: '$/kWh', step: 'any' },
  ],
  compute: ({ w, h, n: cnt, rate }) => {
    const W = n(w), H = n(h), N = cnt === '' ? 1 : n(cnt), R = n(rate);
    if (!W || !H) return { error: 'Power and hours are required.' };
    const kwhDay = W / 1000 * H * N;
    const day = kwhDay * R;
    const steps = [`kWh/day = ${g(W)} ÷ 1000 × ${g(H)} h × ${g(N)} = ${g(kwhDay, 4)} kWh`];
    if (R) steps.push(`cost/day = ${g(kwhDay, 4)} × ${g(R)} = ${g(day, 2)}`, `cost/year (365.25 d) = ${g(day * 365.25, 2)}`);
    return {
      values: { kwhDay, kwhMonth: kwhDay * 30.4375, kwhYear: kwhDay * 365.25, day, month: day * 30.4375, year: day * 365.25 },
      steps,
      outputs: [
        { id: 'kwhDay', label: 'Daily use', unit: 'kWh' }, { id: 'kwhMonth', label: 'Monthly use', unit: 'kWh' },
        { id: 'kwhYear', label: 'Yearly use', unit: 'kWh' }, { id: 'day', label: 'Daily cost', unit: '' },
        { id: 'month', label: 'Monthly cost', unit: '' }, { id: 'year', label: 'Yearly cost', unit: '' },
      ],
    };
  },
};

const PHOTOMETRY = {
  id: 'photometry',
  title: 'Photometry (lux / lumen / candela)',
  group: 'electrical',
  blurb: 'E = I / d², Φ = 2πI(1 − cos(θ/2)), E = Φ / A.',
  keywords: 'lux lumen candela illuminance light footcandle',
  inputs: [
    { id: 'mode', label: 'Question', type: 'select', options: [['lux2cd', 'lux → candela (given distance)'], ['cd2lux', 'candela → lux (given distance)'], ['lm2cd', 'lumen → candela (given beam angle)'], ['cd2lm', 'candela → lumen (given beam angle)'], ['lm2lux', 'lumen → lux (given area)']] },
    { id: 'x', label: 'Value', step: 'any' },
    { id: 'd', label: 'Distance (m) or area (m²)', step: 'any' },
    { id: 'theta', label: 'Beam angle (degrees)', step: 'any' },
  ],
  compute: ({ mode, x, d, theta }) => {
    const X = n(x), D = n(d), TH = n(theta);
    const area = Math.PI * D * D / 4;
    if (mode === 'lux2cd') {
      if (!D) return { error: 'Distance is required.' };
      const cd = X * D * D;
      return { values: { cd, lumens: cd * 4 * Math.PI, e: X, dist: D }, steps: [`E = I ÷ d² → I = E × d² = ${g(X)} × ${g(D)}² = ${g(cd)} cd`, `area = πd²/4 = ${g(area, 4)} m²`], outputs: [{ id: 'cd', label: 'Luminous intensity', unit: 'cd' }, { id: 'lumens', label: 'Total flux', unit: 'lm' }] };
    }
    if (mode === 'cd2lux') {
      if (!D) return { error: 'Distance is required.' };
      return { values: { lux: X / (D * D), cd: X, area }, steps: [`E = I ÷ d² = ${g(X)} ÷ ${g(D)}² = ${g(X / (D * D))} lx`, `area = πd²/4 = ${g(area, 4)} m²`], outputs: [{ id: 'lux', label: 'Illuminance', unit: 'lx' }] };
    }
    const rad = TH * Math.PI / 180;
    const factor = 2 * Math.PI * (1 - Math.cos(rad / 2));
    if (mode === 'lm2cd') {
      if (!TH) return { error: 'Beam angle is required.' };
      return { values: { cd: X / factor, lm: X, theta: TH }, steps: [`Φ = 2πI(1 − cos(θ/2)) → I = Φ ÷ 2π(1 − cos(θ/2))`, `θ = ${g(TH)}° → 2π(1 − cos ${g(TH / 2)}°) = ${g(factor, 8)}`, `I = ${g(X)} ÷ ${g(factor, 8)} = ${g(X / factor)} cd`], outputs: [{ id: 'cd', label: 'Luminous intensity', unit: 'cd' }] };
    }
    if (mode === 'cd2lm') {
      if (!TH) return { error: 'Beam angle is required.' };
      return { values: { lm: X * factor, cd: X }, steps: [`Φ = 2πI(1 − cos(θ/2)) = 2π × ${g(X)} × ${g(factor, 8)} = ${g(X * factor)} lm`], outputs: [{ id: 'lm', label: 'Luminous flux', unit: 'lm' }] };
    }
    if (!D) return { error: 'Area is required.' };
    return { values: { lux: X / D, lm: X, area: D }, steps: [`E = Φ ÷ A = ${g(X)} ÷ ${g(D)} = ${g(X / D)} lx`], outputs: [{ id: 'lux', label: 'Illuminance', unit: 'lx' }] };
  },
};

/* ── math & statistics ───────────────────────────────────────────────────── */

const parseList = (s) => String(s || '').split(/[\s,;]+/).map(Number).filter((x) => Number.isFinite(x));

const STDDEV = {
  id: 'stddev',
  title: 'Mean, variance & standard deviation',
  group: 'math',
  blurb: 'Population divides by n, sample by n − 1. Numbers may be separated by spaces or commas.',
  keywords: 'statistics mean variance standard deviation median rms',
  inputs: [
    { id: 'data', label: 'Data set', type: 'text', placeholder: '1, 3, 5 7 11' },
    { id: 'mode', label: 'Divisor', type: 'select', options: [['pop', 'Population (n)'], ['samp', 'Sample (n − 1)']] },
    { id: 'weights', label: 'Weighted pairs value:weight', type: 'text', placeholder: 'optional: 5:2, 9:3' },
  ],
  compute: ({ data, mode, weights }) => {
    const xs = parseList(data);
    if (!xs.length) return { error: 'Enter at least one number.' };
    const sum = xs.reduce((a, b) => a + b, 0);
    const m = sum / xs.length;
    const ss = xs.reduce((a, b) => a + (b - m) * (b - m), 0);
    const pvar = ss / xs.length, svar = xs.length > 1 ? ss / (xs.length - 1) : 0;
    const sorted = [...xs].sort((a, b) => a - b);
    const half = sorted.length >> 1;
    const out = {
      n: String(xs.length), mean: m, sum, pvar, svar, pstd: Math.sqrt(pvar), sstd: Math.sqrt(svar),
      min: sorted[0], max: sorted[sorted.length - 1], range: sorted[sorted.length - 1] - sorted[0],
      median: sorted.length % 2 ? sorted[half] : (sorted[half - 1] + sorted[half]) / 2,
      gmean: Math.pow(xs.reduce((a, b) => a * b, 1), 1 / xs.length),
      rms: Math.sqrt(xs.reduce((a, b) => a + b * b, 0) / xs.length),
      variance: mode === 'samp' ? svar : pvar,
      std: mode === 'samp' ? Math.sqrt(svar) : Math.sqrt(pvar),
    };
    const steps = [
      `n = ${xs.length}`, `mean μ = Σx ÷ n = ${g(sum)} ÷ ${xs.length} = ${g(m)}`,
      `Σ(x − μ)² = ${g(ss)}`,
      `population variance = ${g(ss)} ÷ ${xs.length} = ${g(pvar)}`,
      `sample variance = ${xs.length > 1 ? `${g(ss)} ÷ ${xs.length - 1} = ${g(svar)}` : 'n/a (need n ≥ 2)'}`,
      `σ = √variance → population ${g(out.pstd)}, sample ${g(out.sstd)}`,
    ];
    const outputs = [
      { id: 'n', label: 'Count', unit: '' }, { id: 'mean', label: 'Arithmetic mean', unit: '' },
      { id: 'median', label: 'Median', unit: '' }, { id: 'gmean', label: 'Geometric mean', unit: '' },
      { id: 'rms', label: 'RMS', unit: '' }, { id: 'variance', label: 'Variance', unit: '' },
      { id: 'std', label: 'Standard deviation', unit: '' }, { id: 'range', label: 'Range', unit: '' },
      { id: 'min', label: 'Minimum', unit: '' }, { id: 'max', label: 'Maximum', unit: '' },
    ];
    const wrows = String(weights || '').split(/[\s,;]+/).filter(Boolean)
      .map((p) => p.split(/[:=]/)).map(([v, w]) => [Number(v), Number(w)]).filter(([v, w]) => Number.isFinite(v) && Number.isFinite(w));
    if (wrows.length) {
      const sw = wrows.reduce((a, [, w]) => a + w, 0);
      const wm = wrows.reduce((a, [v, w]) => a + v * w, 0) / sw;
      const wvar = wrows.reduce((a, [v, w]) => a + w * (v - wm) ** 2, 0) / sw;
      out.wmean = wm; out.wstd = Math.sqrt(wvar);
      steps.push(`weighted μ = Σwx ÷ Σw = ${g(wm)}`, `weighted σ = ${g(out.wstd)}`);
      outputs.push({ id: 'wmean', label: 'Weighted mean', unit: '' }, { id: 'wstd', label: 'Weighted std dev', unit: '' });
    }
    return { values: out, steps, outputs };
  },
};

const WEIGHTED_AVG = {
  id: 'weighted-average',
  title: 'Weighted average',
  group: 'math',
  blurb: 'x̄ = Σ(wᵢxᵢ) ÷ Σwᵢ',
  keywords: 'weighted average mean',
  inputs: [{ id: 'data', label: 'value:weight pairs', type: 'text', placeholder: '80:1, 90:2, 70:3' }],
  compute: ({ data }) => {
    const rows = String(data || '').split(/[\s,;]+/).filter(Boolean)
      .map((p) => p.split(/[:=]/)).map(([v, w]) => [Number(v), w === undefined ? 1 : Number(w)])
      .filter(([v, w]) => Number.isFinite(v) && Number.isFinite(w));
    if (!rows.length) return { error: 'Enter pairs like 80:1, 90:2.' };
    const sw = rows.reduce((a, [, w]) => a + w, 0);
    const sxw = rows.reduce((a, [v, w]) => a + v * w, 0);
    return {
      values: { avg: sw ? sxw / sw : 0, sw, sxw },
      steps: [`Σw = ${g(sw)}`, `Σwx = ${g(sxw)}`, `x̄ = ${g(sxw)} ÷ ${g(sw)} = ${g(sw ? sxw / sw : 0)}`],
      outputs: [{ id: 'avg', label: 'Weighted average', unit: '' }],
    };
  },
};

const QUADRATIC = {
  id: 'quadratic',
  title: 'Quadratic equation solver',
  group: 'math',
  blurb: 'ax² + bx + c = 0 → x = (−b ± √(b² − 4ac)) ÷ 2a',
  keywords: 'quadratic roots discriminant complex',
  inputs: [
    { id: 'a', label: 'a', step: 'any' }, { id: 'b', label: 'b', step: 'any' }, { id: 'c', label: 'c', step: 'any' },
  ],
  compute: ({ a, b, c }) => {
    const A = n(a), B = n(b), C = n(c);
    if (A === 0) return { error: 'a must be non-zero for a quadratic.' };
    const D = B * B - 4 * A * C;
    const steps = [`D = b² − 4ac = ${g(B)}² − 4·${g(A)}·${g(C)} = ${g(D)}`];
    if (D >= 0) {
      const r1 = (-B + Math.sqrt(D)) / (2 * A), r2 = (-B - Math.sqrt(D)) / (2 * A);
      steps.push(`√D = ${g(Math.sqrt(D))}`, `x₁ = (−b + √D) ÷ 2a = ${g(r1)}`, `x₂ = (−b − √D) ÷ 2a = ${g(r2)}`);
      return { values: { d: D, x1: r1, x2: r2, sum: -B / A, product: C / A }, steps, outputs: [
        { id: 'd', label: 'Discriminant', unit: '' }, { id: 'x1', label: 'Root x₁', unit: '' },
        { id: 'x2', label: 'Root x₂', unit: '' }, { id: 'sum', label: 'Sum of roots', unit: '' }, { id: 'product', label: 'Product of roots', unit: '' },
      ] };
    }
    const re = -B / (2 * A), im = Math.sqrt(-D) / (2 * A);
    steps.push('√D is imaginary → complex conjugate roots', `x = ${g(re)} ± i·${g(im)}`);
    return { values: { d: D, re, im }, steps, outputs: [
      { id: 'd', label: 'Discriminant', unit: '' }, { id: 're', label: 'Real part', unit: '' },
      { id: 'im', label: 'Imaginary part (|i|)', unit: '' },
    ] };
  },
};

const ROOTS = {
  id: 'root',
  title: 'Square & nth roots',
  group: 'math',
  blurb: 'ⁿ√x = x^(1/n), including complex results for negative inputs.',
  keywords: 'square root nth root complex',
  inputs: [
    { id: 'x', label: 'Value', step: 'any' },
    { id: 'k', label: 'Root degree (blank = 2)', step: 'any' },
  ],
  compute: ({ x, k }) => {
    const X = n(x), K = k === '' || k === undefined || k === null ? 2 : n(k);
    if (K === 0) return { error: 'Root degree cannot be zero.' };
    if (X === 0) return { values: { root: 0 }, steps: ['ⁿ√0 = 0'], outputs: [{ id: 'root', label: `Principal ${K}√x`, unit: '' }] };
    if (X > 0) {
      const r = Math.pow(X, 1 / K);
      const steps = [`${K}√${g(X)} = ${g(X)}^(1/${K}) = ${g(r, 10)}`];
      if (K % 2 === 0) steps.push(`even degree → both roots: ±${g(r, 10)}`);
      return { values: { root: r, neg: -r }, steps, outputs: K % 2 === 0
        ? [{ id: 'root', label: `+${K}√x`, unit: '' }, { id: 'neg', label: `−${K}√x`, unit: '' }]
        : [{ id: 'root', label: `${K}√x`, unit: '' }] };
    }
    const m = Math.pow(-X, 1 / K);
    const re = K % 4 === 0 ? 0 : m * Math.cos(Math.PI / K);
    const im = m * Math.sin(Math.PI / K);
    return { values: { re, im }, steps: [`${K}√(${g(X)}) is not real`, `= ${g(re, 8)} ± i·${g(Math.abs(im), 8)}`], outputs: [
      { id: 're', label: 'Real part', unit: '' }, { id: 'im', label: 'Imaginary part (|i|)', unit: '' },
    ] };
  },
};

const FACTORIAL = {
  id: 'factorial',
  title: 'Factorial & combinations',
  group: 'math',
  blurb: 'n!, nCr and nPr with exact integer arithmetic.',
  keywords: 'factorial permutation combination ncr npr',
  inputs: [
    { id: 'n', label: 'n', step: '1' },
    { id: 'r', label: 'r (for nCr / nPr)', step: '1' },
  ],
  compute: ({ n: rawN, r }) => {
    const v = Math.trunc(n(rawN));
    if (v < 0) return { error: 'n must be zero or positive.' };
    if (v > 20000) return { error: 'n! is limited to 20000 here.' };
    let f = 1n;
    for (let i = 2n; i <= BigInt(v); i++) f *= i;
    const fac = f.toString();
    const out = { n: v, fac, digits: fac.length };
    const outputs = [{ id: 'fac', label: `${v}!`, unit: '' }, { id: 'digits', label: 'Digits', unit: '' }];
    const R = Math.trunc(n(r));
    if (r !== '' && r !== undefined && r !== null && Number.isFinite(R) && R >= 0 && R <= v) {
      let comb = 1n;
      const kk = BigInt(Math.min(R, v - R));
      for (let i = 1n; i <= kk; i++) comb = (comb * (BigInt(v) - kk + i)) / i;
      let perm = 1n;
      for (let i = 0n; i < BigInt(R); i++) perm *= BigInt(v) - i;
      out.ncr = comb.toString(); out.npr = perm.toString();
      outputs.push({ id: 'ncr', label: `${v}C${R}`, unit: '' }, { id: 'npr', label: `${v}P${R}`, unit: '' });
    }
    return { values: out, steps: [`${v}! = ${fac.length > 48 ? fac.slice(0, 48) + '…' : fac}`], outputs };
  },
};

const PERCENT = {
  id: 'percentage',
  title: 'Percentage suite',
  group: 'math',
  blurb: 'Four questions in one tool: x% of y · x is ?% of y · x is y% of ? · percent change.',
  keywords: 'percentage percent change increase decrease',
  inputs: [
    { id: 'mode', label: 'Question', type: 'select', options: [['1', 'What is x% of y?'], ['2', 'x is what % of y?'], ['3', 'x is y% of what?'], ['4', 'Percent change from x to y?']] },
    { id: 'x', label: 'x', step: 'any' }, { id: 'y', label: 'y', step: 'any' },
  ],
  compute: ({ mode, x, y }) => {
    const X = n(x), Y = n(y);
    if (mode === '1') return { values: { r: X * Y / 100 }, steps: [`x% of y = ${g(X)} × ${g(Y)} ÷ 100 = ${g(X * Y / 100)}`], outputs: [{ id: 'r', label: 'Result', unit: '' }] };
    if (mode === '2') {
      if (!Y) return { error: 'y cannot be zero.' };
      return { values: { r: X / Y * 100 }, steps: [`x is ${g(X)} ÷ ${g(Y)} × 100 = ${g(X / Y * 100, 6)}% of y`], outputs: [{ id: 'r', label: 'Percent', unit: '%' }] };
    }
    if (mode === '3') {
      if (!Y) return { error: 'y (the percent) cannot be zero.' };
      return { values: { r: X / Y * 100 }, steps: [`x is ${g(Y)}% of z → z = ${g(X)} ÷ ${g(Y)} × 100 = ${g(X / Y * 100)}`], outputs: [{ id: 'r', label: 'Result', unit: '' }] };
    }
    if (!X) return { error: 'x cannot be zero.' };
    return { values: { r: (Y - X) / X * 100 }, steps: [`Δ% = (${g(Y)} − ${g(X)}) ÷ ${g(X)} × 100 = ${g((Y - X) / X * 100, 6)}%`], outputs: [{ id: 'r', label: 'Change', unit: '%' }] };
  },
};

const PERCENT_ERROR = {
  id: 'percent-error',
  title: 'Percent error',
  group: 'math',
  blurb: '|measured − accepted| ÷ |accepted| × 100',
  keywords: 'percent error accuracy relative',
  inputs: [
    { id: 'measured', label: 'Measured', step: 'any' },
    { id: 'accepted', label: 'Accepted (true)', step: 'any' },
  ],
  compute: ({ measured, accepted }) => {
    const M = n(measured), A = n(accepted);
    if (A === 0) return { error: 'The accepted value cannot be zero.' };
    const abs = Math.abs(M - A);
    const signed = (M - A) / A * 100;
    return {
      values: { abs, signed: g(signed, 8), pct: g(Math.abs(signed), 8) },
      steps: [`absolute error = |${g(M)} − ${g(A)}| = ${g(abs)}`, `percent error = ${g(abs)} ÷ ${g(Math.abs(A))} × 100 = ${g(Math.abs(signed), 6)}%`, `${signed < 0 ? 'under' : 'over'} by ${g(Math.abs(signed), 4)}%`],
      outputs: [
        { id: 'abs', label: 'Absolute error', unit: '' },
        { id: 'pct', label: 'Percent error', unit: '%' },
        { id: 'signed', label: 'Signed error', unit: '%' },
      ],
    };
  },
};

const GCF_LCM = {
  id: 'gcf-lcm',
  title: 'GCF / LCM',
  group: 'math',
  blurb: "Euclid's algorithm, exact for decimals by scaling to integers first.",
  keywords: 'gcf gcd lcm greatest common divisor lcm',
  inputs: [{ id: 'data', label: 'Numbers', type: 'text', placeholder: '12 18 24' }],
  compute: ({ data }) => {
    const parts = String(data || '').trim().split(/[\s,;]+/).filter(Boolean).map(Number).filter(Number.isFinite);
    if (parts.length < 2) return { error: 'Enter at least two numbers.' };
    let maxDec = 0;
    for (const p of parts) { const s = String(p); const i = s.indexOf('.'); if (i >= 0) maxDec = Math.max(maxDec, s.length - i - 1); }
    const f = Math.pow(10, maxDec);
    const scaled = parts.map((p) => Math.round(Math.abs(p) * f));
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    let g = scaled[0], l = scaled[0];
    for (let i = 1; i < scaled.length; i++) { g = gcd(g, scaled[i]); l = (l * scaled[i]) / gcd(l, scaled[i]); }
    return {
      values: { gcf: g / f, lcm: l / f, n: parts.length },
      steps: [`scale by 10^${maxDec} → ${scaled.join(' ')}`, `GCF = ${g} → ${g / f}`, `LCM = ${l} → ${l / f}`],
      outputs: [{ id: 'gcf', label: 'Greatest common factor', unit: '' }, { id: 'lcm', label: 'Least common multiple', unit: '' }],
    };
  },
};

const FRACTION = {
  id: 'fraction',
  title: 'Fraction arithmetic',
  group: 'math',
  blurb: 'Add, subtract, multiply or divide two fractions, reduced by GCD.',
  keywords: 'fraction add subtract multiply divide',
  inputs: [
    { id: 'n1', label: 'Numerator 1' }, { id: 'd1', label: 'Denominator 1' },
    { id: 'n2', label: 'Numerator 2' }, { id: 'd2', label: 'Denominator 2' },
    { id: 'op', label: 'Operation', type: 'select', options: [['+', 'Add'], ['-', 'Subtract'], ['*', 'Multiply'], ['/', 'Divide']] },
  ],
  compute: ({ n1, d1, n2, d2, op }) => {
    const A = Math.trunc(n(n1)), B = Math.trunc(n(d1)), C = Math.trunc(n(n2)), D = Math.trunc(n(d2));
    if (!B || !D) return { error: 'Denominators cannot be zero.' };
    const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t; } return a || 1; };
    let num, den;
    if (op === '+') { num = A * D + C * B; den = B * D; }
    else if (op === '-') { num = A * D - C * B; den = B * D; }
    else if (op === '*') { num = A * C; den = B * D; }
    else { if (C === 0) return { error: 'Cannot divide by zero.' }; num = A * D; den = B * C; }
    if (den < 0) { num = -num; den = -den; }
    const k = gcd(num, den);
    const rn = num / k, rd = den / k;
    const whole = Math.trunc(rn / rd), rem = rn - whole * rd;
    const sign = (x) => (x < 0 ? '−' : '');
    return {
      values: {
        num: String(rn), den: String(rd), whole: String(whole), rem: String(Math.abs(rem)),
        dec: g(num / den, 10), pct: g((num / den) * 100, 6),
        mixed: rd === 1 ? `${sign(rn)}${Math.abs(rn)}` : `${sign(rn)}${whole} ${Math.abs(rem)}/${rd}`,
      },
      steps: [
        `common denominator → ${num}/${den}`,
        `gcd(${Math.abs(num)}, ${den}) = ${k}`,
        `reduced = ${rn}/${rd}`,
        `mixed number = ${whole} ${rem}/${rd}`,
        `decimal = ${g(num / den, 9)}`,
      ],
      outputs: [
        { id: 'mixed', label: 'Mixed number', unit: '' },
        { id: 'num', label: 'Numerator', unit: '' },
        { id: 'den', label: 'Denominator', unit: '' },
        { id: 'dec', label: 'Decimal', unit: '' },
        { id: 'pct', label: 'Percent', unit: '%' },
      ],
    };
  },
};

const DECIMAL_FRACTION = {
  id: 'decimal-fraction',
  title: 'Decimal ⇄ fraction',
  group: 'math',
  blurb: 'Exact conversion, including the repeating part of the expansion.',
  keywords: 'decimal fraction repeating recurring',
  inputs: [{ id: 'x', label: 'Decimal', step: 'any' }],
  compute: ({ x }) => {
    const s = String(x ?? '').trim();
    if (!s || !/^[-+]?\d*\.?\d+$/.test(s)) return { error: 'Enter a decimal number.' };
    const neg = s.startsWith('-');
    const body = s.replace(/^[-+]/, '');
    const [ipRaw = '0', fp = ''] = body.split('.');
    const intPart = BigInt(ipRaw || '0');
    const gcd = (a, b) => { a = a < 0n ? -a : a; while (b) { const t = b; b = a % b; a = t; } return a || 1n; };

    /*
     * Repetend detection follows the reference site's approach: inspect the
     * digits as written and find the shortest block that repeats at the end.
     * Long division cannot be used here — the typed value is by definition a
     * terminating decimal, so its reduced denominator is always 2ᵃ·5ᵇ and it
     * would always "terminate".
     *
     *   0.3333333 → non-repeating ""  + repeating "3"
     *   0.16666   → non-repeating "1" + repeating "6"
     */
    const m = /^(\d*?)(\d+?)\2+$/.exec(fp);
    const nonRepeating = m ? m[1] : fp;
    const repeat = m ? m[2] : '';

    // exact value = intPart + prefix/10^p + repetend/(10^p·(10^r − 1))
    let num, den;
    if (m) {
      const p = BigInt(nonRepeating.length);
      const r = BigInt(repeat.length);
      const nine = 10n ** r - 1n;
      den = 10n ** p * nine;
      const head = BigInt(nonRepeating + repeat) - BigInt(nonRepeating || '0');
      num = intPart * den + head;
      const g = gcd(num, den);
      num /= g; den /= g;
    } else {
      const num0 = BigInt(ipRaw + fp || '0');
      const den0 = 10n ** BigInt(fp.length);
      const k = gcd(num0, den0);
      num = num0 / k; den = den0 / k;
    }
    if (neg) num = -num;
    const whole = den === 1n ? num : num / den;
    const rem = num - whole * den;

    return {
      values: {
        num: num.toString(), den: den.toString(), dec: s,
        mixed: den === 1n ? num.toString() : `${whole} ${rem}/${den}`,
        pct: g(Number(num) / Number(den) * 100, 6),
        repeat: repeat ? `0.${nonRepeating}(${repeat})` : '',
        period: String(repeat.length),
      },
      steps: [
        repeat ? `digits split: non-repeating “${nonRepeating}”, repeating “${repeat}”` : 'no repeating block — terminating decimal',
        `num/den = ${num}/${den}`,
        den === 1n ? 'integer' : `gcd-reduced from ${num * 1n}/${den * 1n}`,
      ],
      outputs: [
        { id: 'mixed', label: 'Reduced form', unit: '' },
        { id: 'num', label: 'Numerator', unit: '' },
        { id: 'den', label: 'Denominator', unit: '' },
        { id: 'pct', label: 'Percent', unit: '%' },
        ...(repeat ? [{ id: 'repeat', label: 'Repeating form', unit: '' }, { id: 'period', label: 'Period length', unit: 'digits' }] : []),
      ],
    };
  },
};

const RATIO = {
  id: 'ratio',
  title: 'Ratio simplifier',
  group: 'math',
  blurb: 'a:b → simplest integer ratio, plus a : 1 and 1 : b forms.',
  keywords: 'ratio proportion simplify',
  inputs: [{ id: 'data', label: 'Ratio', type: 'text', placeholder: '16:24' }],
  compute: ({ data }) => {
    const parts = String(data || '').split(/[:\s/]+/).map(Number).filter(Number.isFinite);
    if (parts.length < 2) return { error: 'Enter two numbers separated by a colon.' };
    const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t; } return a || 1; };
    let k = parts[0];
    for (const p of parts) k = gcd(k, p);
    const simple = parts.map((p) => p / k);
    const [a, b] = parts;
    return {
      values: { a: simple[0], b: simple[1], simple: simple.join(':'), to1: g(b / a, 8), from1: g(a / b, 8), sum: a + b },
      steps: [`gcd = ${k}`, `${parts.join(':')} → ${simple.join(':')}`, `a : 1 → 1 : ${g(a, b)}`, `1 : b → 1 : ${g(b, a)}`],
      outputs: [
        { id: 'simple', label: 'Simplest ratio', unit: '' },
        { id: 'to1', label: 'a : 1', unit: '' },
        { id: 'from1', label: '1 : b', unit: '' },
      ],
    };
  },
};

const DIVMOD = {
  id: 'divmod',
  title: 'Divide with quotient & remainder',
  group: 'math',
  blurb: 'a = q·b + r, verified exactly.',
  keywords: 'division quotient remainder modulo',
  inputs: [
    { id: 'a', label: 'Dividend', step: 'any' }, { id: 'b', label: 'Divisor', step: 'any' },
  ],
  compute: ({ a, b }) => {
    const A = Math.trunc(n(a)), B = Math.trunc(n(b));
    if (!B) return { error: 'Divisor cannot be zero.' };
    const q = Math.trunc(A / B), r = A % B;
    return {
      values: { q: String(q), r: String(r), dec: g(A / B, 12), frac: g(Math.abs(r) / Math.abs(B), 8) },
      steps: [`${A} ÷ ${B}`, `quotient q = ${q}`, `remainder r = ${r}`, `check: ${q} × ${B} + ${r} = ${q * B + r}`],
      outputs: [
        { id: 'q', label: 'Quotient', unit: '' },
        { id: 'r', label: 'Remainder', unit: '' },
        { id: 'dec', label: 'Decimal', unit: '' },
        { id: 'frac', label: 'Remainder fraction', unit: '' },
      ],
    };
  },
};

const SCI_NOTATION = {
  id: 'scientific',
  title: 'Scientific notation',
  group: 'math',
  blurb: 'x = m × 10ⁿ with 1 ≤ |m| < 10, plus engineering notation.',
  keywords: 'scientific notation exponent engineering mantissa',
  inputs: [
    { id: 'x', label: 'Value', step: 'any' },
    { id: 'op', label: 'Arithmetic', type: 'select', options: [['none', 'None — convert only'], ['*', 'Multiply by…'], ['/', 'Divide by…'], ['+', 'Add…'], ['-', 'Subtract…']] },
    { id: 'y', label: 'Second value', step: 'any' },
  ],
  compute: ({ x, op, y }) => {
    let v = n(x);
    if (op !== 'none' && y !== '' && y !== undefined && y !== null && Number.isFinite(Number(y))) {
      const Y = n(y);
      v = op === '*' ? v * Y : op === '/' ? v / Y : op === '+' ? v + Y : v - Y;
    }
    if (!Number.isFinite(v)) return { error: 'Result is not a finite number.' };
    if (v === 0) return { values: { x: 0, m: 0, e: 0, sci: '0 × 10⁰', eng: '0' }, steps: ['zero'], outputs: [{ id: 'sci', label: 'Scientific', unit: '' }, { id: 'eng', label: 'Engineering', unit: '' }] };
    const e = Math.floor(Math.log10(Math.abs(v)));
    const m = v / Math.pow(10, e);
    const e3 = Math.floor(e / 3) * 3;
    const eng = `${g(v / Math.pow(10, e3), 8)} × 10${sup(e3)}`;
    return {
      values: { x: g(v, 12), m: g(m, 10), e: String(e), sci: `${g(m, 10)} × 10${sup(e)}`, eng },
      steps: [
        `e = ⌊log₁₀|${g(v)}|⌋ = ${e}`,
        `m = ${g(v)} ÷ 10${sup(e)} = ${g(m, 10)}`,
        `scientific: ${g(m, 10)} × 10${sup(e)}`,
        `engineering: ${eng}`,
      ],
      outputs: [
        { id: 'sci', label: 'Scientific', unit: '' },
        { id: 'eng', label: 'Engineering', unit: '' },
        { id: 'm', label: 'Mantissa', unit: '' },
        { id: 'e', label: 'Exponent', unit: '' },
      ],
    };
  },
};

const PYTHAGOREAN = {
  id: 'pythagorean',
  title: 'Pythagorean theorem',
  group: 'math',
  blurb: 'c = √(a² + b²) — leave the side you want blank.',
  keywords: 'pythagoras hypotenuse triangle right angle',
  inputs: [
    { id: 'a', label: 'a', step: 'any' }, { id: 'b', label: 'b', step: 'any' }, { id: 'c', label: 'c', step: 'any' },
  ],
  compute: ({ a, b, c }) => {
    const A = n(a), B = n(b), C = n(c);
    // Test the *raw* inputs, not the coerced numbers — an empty field arrives
    // as '' or undefined and must read as "not supplied", while a real 0 must.
    const given = (x) => x !== '' && x !== null && x !== undefined;
    if (given(a) && given(b) && !given(c)) {
      const cc = Math.sqrt(A * A + B * B);
      return { values: { c: g(cc, 10) }, steps: [`c = √(${g(A)}² + ${g(B)}²) = √${g(A * A + B * B, 10)} = ${g(cc, 10)}`], outputs: [{ id: 'c', label: 'Hypotenuse', unit: '' }] };
    }
    if (given(a) && given(c) && !given(b)) {
      if (C < A) return { error: 'The hypotenuse must be the longest side.' };
      const bb = Math.sqrt(C * C - A * A);
      return { values: { b: g(bb, 10) }, steps: [`b = √(${g(C)}² − ${g(A)}²) = ${g(bb, 10)}`], outputs: [{ id: 'b', label: 'Side b', unit: '' }] };
    }
    if (given(b) && given(c) && !given(a)) {
      if (C < B) return { error: 'The hypotenuse must be the longest side.' };
      const aa = Math.sqrt(C * C - B * B);
      return { values: { a: g(aa, 10) }, steps: [`a = √(${g(C)}² − ${g(B)}²) = ${g(aa, 10)}`], outputs: [{ id: 'a', label: 'Side a', unit: '' }] };
    }
    return { error: 'Enter two sides and leave the third blank.' };
  },
};

const CONVOLUTION = {
  id: 'convolution',
  title: 'Discrete convolution',
  group: 'math',
  blurb: 'y[k] = Σⱼ h[j]·x[k−j] — a moving-average kernel.',
  keywords: 'convolution signal filter kernel moving average',
  inputs: [
    { id: 'x', label: 'Signal x', type: 'text', placeholder: '1 2 3 4' },
    { id: 'h', label: 'Kernel h', type: 'text', placeholder: '1 2 1' },
  ],
  compute: ({ x, h }) => {
    const X = parseList(x), H = parseList(h);
    if (!X.length || !H.length) return { error: 'Enter both sequences.' };
    const y = [];
    for (let k = 0; k < X.length + H.length - 1; k++) {
      let s = 0;
      for (let j = 0; j < H.length; j++) if (k - j >= 0 && k - j < X.length) s += H[j] * X[k - j];
      y.push(g(s, 8));
    }
    return {
      values: { y: y.join(', '), ny: String(y.length) },
      steps: [`Nx = ${X.length}, Nh = ${H.length}`, `Ny = Nx + Nh − 1 = ${y.length}`, `y = [${y.join(', ')}]`],
      outputs: [{ id: 'y', label: 'y[k]', unit: '' }, { id: 'ny', label: 'Output length', unit: '' }],
    };
  },
};

const LOG_CALC = {
  id: 'log',
  title: 'Logarithm & antilogarithm',
  group: 'math',
  blurb: 'log_b(x) = ln x ÷ ln b, plus b^x.',
  keywords: 'logarithm antilog ln base',
  inputs: [
    { id: 'x', label: 'x', step: 'any' },
    { id: 'b', label: 'base', step: 'any' },
    { id: 'dir', label: 'Mode', type: 'select', options: [['log', 'log_b(x)'], ['ln', 'ln(x)'], ['anti', 'antilog: b^x']] },
  ],
  compute: ({ x, b, dir }) => {
    const X = n(x), B = b === '' || b === undefined || b === null ? 10 : n(b);
    if (dir === 'anti') {
      const v = Math.pow(B, X);
      return { values: { r: g(v, 12) }, steps: [`${g(B)}${sup(X)} = ${g(v, 12)}`], outputs: [{ id: 'r', label: 'antilog', unit: '' }] };
    }
    if (X <= 0) return { error: 'A logarithm needs x > 0.' };
    if (B <= 0 || B === 1) return { error: 'The base must be positive and not equal to 1.' };
    const r = dir === 'ln' ? Math.log(X) : Math.log(X) / Math.log(B);
    return {
      values: { r: g(r, 12), ln: g(Math.log(X), 12), anti: g(Math.exp(r), 12) },
      steps: dir === 'ln' ? [`ln(${g(X)}) = ${g(r, 12)}`] : [`log${sup(B)}(${g(X)}) = ln(${g(X)}) ÷ ln(${g(B)}) = ${g(Math.log(X), 10)} ÷ ${g(Math.log(B), 10)} = ${g(r, 12)}`],
      outputs: [
        { id: 'r', label: dir === 'ln' ? 'ln x' : 'log_b x', unit: '' },
        { id: 'anti', label: 'antilog', unit: '' },
      ],
    };
  },
};

const EXP_GROWTH = {
  id: 'exponential-growth',
  title: 'Exponential growth & decay',
  group: 'math',
  blurb: 'y = x₀ (1 + r/100)^t',
  keywords: 'exponential growth decay compound doubling halving',
  inputs: [
    { id: 'x0', label: 'Initial value', step: 'any' },
    { id: 'r', label: 'Rate %', step: 'any' },
    { id: 't', label: 'Periods', step: 'any' },
  ],
  compute: ({ x0, r, t }) => {
    const X = n(x0), R = n(r), T = n(t);
    const k = Math.pow(1 + R / 100, T);
    const y = X * k;
    const outputs = [{ id: 'y', label: 'Future value', unit: '' }, { id: 'k', label: 'Growth factor', unit: '' }, { id: 'delta', label: 'Change', unit: '' }];
    const steps = [`y = ${g(X)} × (1 + ${g(R)}/100)^${g(T)} = ${g(y, 10)}`];
    if (R > 0) {
      const d = Math.log(2) / Math.log(1 + R / 100);
      steps.push(`doubling time = ln 2 ÷ ln(1 + r) = ${g(d, 8)} periods`);
      outputs.push({ id: 'double', label: 'Doubling time', unit: 'periods' });
      return { values: { y: g(y, 10), k: g(k, 10), delta: g(y - X, 10), double: g(d, 8) }, steps, outputs };
    }
    if (R < 0) {
      const h = Math.log(0.5) / Math.log(1 + R / 100);
      steps.push(`halving time = ln 0.5 ÷ ln(1 + r) = ${g(h, 8)} periods`);
      outputs.push({ id: 'half', label: 'Halving time', unit: 'periods' });
      return { values: { y: g(y, 10), k: g(k, 10), delta: g(y - X, 10), half: g(h, 8) }, steps, outputs };
    }
    return { values: { y: g(y, 10), k: g(k, 10), delta: g(y - X, 10) }, steps, outputs };
  },
};

const TRIG = {
  id: 'trig',
  title: 'Trigonometry',
  group: 'math',
  blurb: 'sin, cos, tan and inverses, with degree or radian input.',
  keywords: 'trigonometry sin cos tan arcsin arctan radians degrees',
  inputs: [
    { id: 'x', label: 'Angle', step: 'any' },
    { id: 'unit', label: 'Unit', type: 'select', options: [['deg', 'Degrees'], ['rad', 'Radians']] },
  ],
  compute: ({ x, unit }) => {
    const X = n(x);
    const rad = unit === 'deg' ? X * Math.PI / 180 : X;
    const s = Math.sin(rad), c = Math.cos(rad), t = Math.tan(rad);
    return {
      values: {
        sin: g(s, 12), cos: g(c, 12), tan: g(t, 12),
        asin: g(Math.asin(Math.max(-1, Math.min(1, s))) * 180 / Math.PI, 8),
        acos: g(Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI, 8),
        atan: g(Math.atan2(s, c) * 180 / Math.PI, 8),
        csc: s ? g(1 / s, 12) : 'undefined', sec: c ? g(1 / c, 12) : 'undefined', cot: s ? g(c / s, 12) : 'undefined',
      },
      steps: [`x = ${g(X)}${unit === 'deg' ? '°' : ' rad'} = ${g(rad, 12)} rad`, `sin = ${g(s, 12)}`, `cos = ${g(c, 12)}`, `tan = ${g(t, 12)}`],
      outputs: [
        { id: 'sin', label: 'sin x', unit: '' }, { id: 'cos', label: 'cos x', unit: '' }, { id: 'tan', label: 'tan x', unit: '' },
        { id: 'asin', label: 'asin(sin x)', unit: '°' }, { id: 'acos', label: 'acos(cos x)', unit: '°' }, { id: 'atan', label: 'atan(tan x)', unit: '°' },
        { id: 'csc', label: 'csc x', unit: '' }, { id: 'sec', label: 'sec x', unit: '' }, { id: 'cot', label: 'cot x', unit: '' },
      ],
    };
  },
};

/* ── colour ──────────────────────────────────────────────────────────────── */

function rgbToHsv(r, g, b) {
  const R = r / 255, G = g / 255, B = b / 255;
  const M = Math.max(R, G, B), m = Math.min(R, G, B), C = M - m;
  let h = 0;
  if (C !== 0) { if (M === R) h = ((G - B) / C) % 6; else if (M === G) h = (B - R) / C + 2; else h = (R - G) / C + 4; }
  h *= 60; if (h < 0) h += 360;
  return { h, s: C === 0 ? 0 : (C / M) * 100, v: M * 100 };
}
function rgbToHsl(r, g, b) {
  const R = r / 255, G = g / 255, B = b / 255;
  const M = Math.max(R, G, B), m = Math.min(R, G, B), d = M - m;
  let h = 0;
  if (d !== 0) { if (M === R) h = ((G - B) / d) % 6; else if (M === G) h = (B - R) / d + 2; else h = (R - G) / d + 4; }
  h *= 60; if (h < 0) h += 360;
  const l = (M + m) / 2;
  return { h, s: (d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))) * 100, l: l * 100 };
}
function rgbToCmyk(r, g, b) {
  const R = r / 255, G = g / 255, B = b / 255;
  const k = 1 - Math.max(R, G, B);
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
  return { c: (1 - R - k) / (1 - k) * 100, m: (1 - G - k) / (1 - k) * 100, y: (1 - B - k) / (1 - k) * 100, k: k * 100 };
}
function hslToRgb(h, s, l) {  const S = s / 100, L = l / 100;
  const C = (1 - Math.abs(2 * L - 1)) * S;
  const hh = ((h % 360) + 360) % 360 / 60;
  const X = C * (1 - Math.abs((hh % 2) - 1));
  let r = 0, gg = 0, b = 0;
  if (hh < 1) { r = C; gg = X; } else if (hh < 2) { r = X; gg = C; }
  else if (hh < 3) { gg = C; b = X; } else if (hh < 4) { gg = X; b = C; }
  else if (hh < 5) { r = X; b = C; } else { r = C; b = X; }
  const m = L - C / 2;
  return [Math.round((r + m) * 255), Math.round((gg + m) * 255), Math.round((b + m) * 255)];
}

/** CMYK (percent) → RGB, the exact inverse of rgbToCmyk. */
function cmykToRgb(c, m, y, k) {
  const C = c / 100, M = m / 100, Y = y / 100, K = k / 100;
  return [
    Math.round(255 * (1 - C) * (1 - K)),
    Math.round(255 * (1 - M) * (1 - K)),
    Math.round(255 * (1 - Y) * (1 - K)),
  ];
}

const COLOR = {
  id: 'color-convert',  title: 'Colour converter',
  group: 'color',
  blurb: 'RGB ⇄ HEX ⇄ HSL ⇄ HSV ⇄ CMYK — type into any field.',
  keywords: 'color colour rgb hex hsl hsv cmyk picker',
  inputs: [
    { id: 'hex', label: 'HEX', type: 'text', placeholder: '#3B82F6' },
    { id: 'r', label: 'R', type: 'number', min: 0, max: 255 },
    { id: 'g', label: 'G', type: 'number', min: 0, max: 255 },
    { id: 'b', label: 'B', type: 'number', min: 0, max: 255 },
    { id: 'h', label: 'H', type: 'number', min: 0, max: 360 },
    { id: 's', label: 'S', type: 'number', min: 0, max: 100 },
    { id: 'l', label: 'L / V', type: 'number', min: 0, max: 100 },
    { id: 'c', label: 'C', type: 'number', min: 0, max: 100 },
    { id: 'm', label: 'M', type: 'number', min: 0, max: 100 },
    { id: 'y', label: 'Y', type: 'number', min: 0, max: 100 },
    { id: 'k', label: 'K', type: 'number', min: 0, max: 100 },
  ],
  compute: (v) => {
    let r = null, gg = null, b = null;
    // A field counts as "typed" only when it is neither '' nor undefined —
    // checking with `!== ''` alone would treat an absent key as a zero channel.
    const typed = (x) => x !== '' && x !== null && x !== undefined;
    const hexv = typed(v.hex) ? String(v.hex).trim() : '';
    if (hexv) {
      let h = hexv.replace(/^#/, '');
      if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
      if (/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h)) { r = parseInt(h.slice(0, 2), 16); gg = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16); }
      else return { error: 'HEX must be 3, 4 or 6 hex digits.' };
    }
    if (r === null && (typed(v.r) || typed(v.g) || typed(v.b))) { r = n(v.r); gg = n(v.g); b = n(v.b); }
    if (r === null && (typed(v.h) || typed(v.s) || typed(v.l))) [r, gg, b] = hslToRgb(n(v.h), n(v.s), n(v.l));
    if (r === null && (typed(v.c) || typed(v.m) || typed(v.y) || typed(v.k))) [r, gg, b] = cmykToRgb(n(v.c), n(v.m), n(v.y), n(v.k));
    if (r === null) return { error: 'Enter a HEX value, RGB, HSL or CMYK values.' };
    const cl = (x) => Math.max(0, Math.min(255, Math.round(x)));
    r = cl(r); gg = cl(gg); b = cl(b);
    const hex = `#${[r, gg, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
    const hsv = rgbToHsv(r, gg, b), hsl = rgbToHsl(r, gg, b), cmyk = rgbToCmyk(r, gg, b);
    return {
      values: {
        hex, r: String(r), g: String(gg), b: String(b),
        h: g(hsl.h, 2), s: g(hsv.s, 2), v: g(hsv.v, 2), l: g(hsl.l, 2), hslS: g(hsl.s, 2),
        c: g(cmyk.c, 2), m: g(cmyk.m, 2), y: g(cmyk.y, 2), k: g(cmyk.k, 2),
        rgba: `rgba(${r}, ${gg}, ${b}, 1)`,
        luminance: g((0.2126 * r + 0.7152 * gg + 0.0722 * b) / 255, 4),
        css: `rgb(${r} ${gg} ${b})`,
      },
      steps: [`hex = ${hex}`, `hsl(${g(hsl.h, 2)}, ${g(hsl.s, 2)}%, ${g(hsl.l, 2)}%)`, `hsv(${g(hsv.h, 2)}, ${g(hsv.s, 2)}%, ${g(hsv.v, 2)}%)`, `cmyk(${g(cmyk.c, 2)}%, ${g(cmyk.m, 2)}%, ${g(cmyk.y, 2)}%, ${g(cmyk.k, 2)}%)`],
      outputs: [
        { id: 'hex', label: 'HEX', unit: '' }, { id: 'rgba', label: 'RGBA', unit: '' }, { id: 'css', label: 'CSS', unit: '' },
        { id: 'r', label: 'Red', unit: '' }, { id: 'g', label: 'Green', unit: '' }, { id: 'b', label: 'Blue', unit: '' },
        { id: 'h', label: 'Hue', unit: '°' }, { id: 's', label: 'Saturation (HSV)', unit: '%' }, { id: 'v', label: 'Value', unit: '%' },
        { id: 'hslS', label: 'Saturation (HSL)', unit: '%' }, { id: 'l', label: 'Lightness', unit: '%' },
        { id: 'c', label: 'Cyan', unit: '%' }, { id: 'm', label: 'Magenta', unit: '%' },
        { id: 'y', label: 'Yellow', unit: '%' }, { id: 'k', label: 'Key', unit: '%' },
        { id: 'luminance', label: 'Relative luminance', unit: '' },
      ],
    };
  },
};

/* ── number & radix ──────────────────────────────────────────────────────── */

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';
function parseInBase(str, base) {
  const s = String(str ?? '').trim();
  if (!s) return null;
  const neg = s.startsWith('-');
  const body = (neg ? s.slice(1) : s).replace(/^0[xXbBoO]/, '');
  if (!body) return null;
  if (!new RegExp(`^[${DIGITS.slice(0, base)}]+$`, 'i').test(body)) return null;
  let v = 0n;
  const B = BigInt(base);
  for (const ch of body.toLowerCase()) v = v * B + BigInt(parseInt(ch, 36));
  return neg ? -v : v;
}
const show = (v, base) => (v < 0n ? '−' : '') + (v < 0n ? -v : v).toString(base).toUpperCase();

const RADIX_CALC = {
  id: 'radix-calc',
  title: 'Base calculator',
  group: 'number',
  blurb: 'Exact arithmetic in any base from 2 to 36, powered by BigInt.',
  keywords: 'base calculator binary hex octal arithmetic bitwise',
  inputs: [
    { id: 'base', label: 'Base', type: 'select', options: Array.from({ length: 35 }, (_, i) => [String(i + 2), `Base ${i + 2}`]) },
    { id: 'a', label: 'First operand', type: 'text' },
    { id: 'b', label: 'Second operand', type: 'text' },
    { id: 'op', label: 'Operation', type: 'select', options: [['add', '+  add'], ['sub', '−  subtract'], ['mul', '×  multiply'], ['div', '÷  divide'], ['mod', 'mod'], ['pow', '^  power'], ['band', '&  bitwise AND'], ['bor', '|  bitwise OR'], ['bxor', '⊕  bitwise XOR'], ['shl', '<<  shift left'], ['shr', '>>  shift right'], ['not', 'NOT (first operand only)']] },
  ],
  compute: ({ base, a, b, op }) => {
    const B = Number(base) || 2;
    const A = parseInBase(a, B);
    if (A === null) return { error: `The first operand is not valid in base ${B}.` };
    if (op === 'not') {
      const r = ~A;
      return { values: { r: show(r, B), dec: r.toString(10), bin: r.toString(2), hex: (r < 0n ? (1n << 64n) + r : r).toString(16).toUpperCase() }, steps: [`NOT ${a} in base ${B}`, `= ${show(r, B)}₁${B}`], outputs: OUTR(B) };
    }
    const Bn = parseInBase(b, B);
    if (Bn === null) return { error: `The second operand is not valid in base ${B}.` };
    let r;
    switch (op) {
      case 'add': r = A + Bn; break;
      case 'sub': r = A - Bn; break;
      case 'mul': r = A * Bn; break;
      case 'div': if (Bn === 0n) return { error: 'Division by zero.' }; r = A / Bn; break;
      case 'mod': if (Bn === 0n) return { error: 'Modulo by zero.' }; r = A % Bn; break;
      case 'pow': if (Bn < 0n) return { error: 'Negative exponents are not supported in integer base arithmetic.' }; r = A ** Bn; break;
      case 'band': r = A & Bn; break;
      case 'bor': r = A | Bn; break;
      case 'bxor': r = A ^ Bn; break;
      case 'shl': if (Bn > 4096n) return { error: 'Shift amount too large.' }; r = A << Bn; break;
      case 'shr': r = A >> Bn; break;
      default: r = 0n;
    }
    return {
      values: { r: show(r, B), dec: r.toString(10), hex: (r < 0n ? (1n << 64n) + r : r).toString(16).toUpperCase(), bin: (r < 0n ? -r : r).toString(2), oct: (r < 0n ? -r : r).toString(8), neg: r < 0n ? 'yes' : 'no' },
      steps: [`${a} ${op} ${b} (base ${B})`, `= ${show(r, B)} in base ${B}`, `= ${r.toString(10)} in base 10`],
      outputs: OUTR(B),
    };
  },
};
const OUTR = (B) => [
  { id: 'r', label: `Result (base ${B})`, unit: '' },
  { id: 'dec', label: 'Decimal', unit: '' },
  { id: 'hex', label: 'Hexadecimal', unit: '' },
  { id: 'bin', label: 'Binary', unit: '' },
  { id: 'oct', label: 'Octal', unit: '' },
];

const ROMAN = {
  id: 'roman',
  title: 'Roman numerals',
  group: 'number',
  blurb: 'Standard subtractive notation from I to MMMCMXCIX (1–4999).',
  keywords: 'roman numerals convert',
  inputs: [{ id: 'v', label: 'Number or numeral', type: 'text', placeholder: '2024 or MMXXIV' }],
  compute: ({ v }) => {
    const s = String(v ?? '').trim();
    if (!s) return { error: 'Enter a number or a numeral.' };
    if (/^\d+$/.test(s)) {
      let num = Number(s);
      if (num < 1 || num > 4999) return { error: 'Roman numerals run from 1 to 4999.' };
      const T = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
      let out = '';
      for (const [val, sym] of T) while (num >= val) { out += sym; num -= val; }
      return { values: { roman: out, n: s }, steps: [`${s} → ${out}`], outputs: [{ id: 'roman', label: 'Roman numeral', unit: '' }] };
    }
    const MAP = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    const up = s.toUpperCase();
    if (!/^[IVXLCDM]+$/.test(up)) return { error: 'That is not a valid Roman numeral.' };
    let total = 0;
    for (let i = 0; i < up.length; i++) total += MAP[up[i + 1]] && MAP[up[i]] < MAP[up[i + 1]] ? -MAP[up[i]] : MAP[up[i]];
    return { values: { roman: up, n: String(total) }, steps: [`${up} → ${total}`], outputs: [{ id: 'n', label: 'Decimal', unit: '' }] };
  },
};

const WORDING = {
  id: 'number-words',
  title: 'Number to words',
  group: 'number',
  blurb: 'Spelled-out integers, plus binary and hexadecimal side by side.',
  keywords: 'number to words spell out english',
  inputs: [{ id: 'v', label: 'Number', step: 'any' }],
  compute: ({ v }) => {
    const X = n(v);
    if (!Number.isFinite(X)) return { error: 'Enter a finite number.' };
    const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = [[1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand'], [1, '']];

    /** 0–999, handling hundreds, tens and units. */
    const under1000 = (num) => {
      if (num === 0) return '';
      const parts = [];
      const h = Math.floor(num / 100);
      const rest = num % 100;
      if (h) parts.push(`${ones[h]} hundred`);
      if (rest > 0) {
        if (rest < 20) parts.push(ones[rest]);
        else {
          const t = tens[Math.floor(rest / 10)];
          const u = rest % 10;
          parts.push(u ? `${t}-${ones[u]}` : t);
        }
      }
      return parts.join(' ');
    };

    const intWords = (num) => {
      if (num === 0) return 'zero';
      const parts = [];
      let rest = num;
      for (const [scale, name] of scales) {
        const q = Math.floor(rest / scale);
        if (!q) continue;
        rest %= scale;
        const chunk = under1000(q);
        parts.push(name ? `${chunk} ${name}` : chunk);
      }
      return parts.join(' ');
    };
    const abs = Math.abs(X);
    const intPart = Math.floor(abs);
    const frac = Math.round((abs - intPart) * 100) / 100;
    const words = `${X < 0 ? 'minus ' : ''}${intWords(intPart)}${frac ? ' point ' + frac.toFixed(2).slice(2).split('').map((d) => ones[Number(d)]).join(' ') : ''}`;
    return {
      values: { words, digits: String(intPart).length, bin: intPart.toString(2), hex: intPart.toString(16).toUpperCase(), oct: intPart.toString(8) },
      steps: [`${X} → ${words}`],
      outputs: [
        { id: 'words', label: 'In words', unit: '' },
        { id: 'bin', label: 'Binary', unit: '' },
        { id: 'hex', label: 'Hexadecimal', unit: '' },
        { id: 'oct', label: 'Octal', unit: '' },
      ],
    };
  },
};

/* ── text & encoding ─────────────────────────────────────────────────────── */

const CASE_CONV = {
  id: 'case-convert',
  title: 'Case converter',
  group: 'text',
  blurb: 'upper, lower, title, camel, Pascal, snake, kebab, constant and more.',
  keywords: 'case converter upper lower camel snake kebab title',
  inputs: [
    { id: 'text', label: 'Text', type: 'text', placeholder: 'hello world' },
    { id: 'mode', label: 'Transform', type: 'select', options: [['upper', 'UPPERCASE'], ['lower', 'lowercase'], ['title', 'Title Case'], ['sentence', 'Sentence case'], ['camel', 'camelCase'], ['pascal', 'PascalCase'], ['snake', 'snake_case'], ['kebab', 'kebab-case'], ['constant', 'CONSTANT_CASE'], ['alt', 'aLtErNaTiNg'], ['reverse', 'Reversed characters'], ['initials', 'Initials']] },
  ],
  compute: ({ text, mode }) => {
    const s = String(text ?? '');
    if (!s) return { error: 'Enter some text.' };
    const words = s.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_\-\s]+/g, ' ').trim().split(/\s+/);
    const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    const map = {
      upper: s.toUpperCase(), lower: s.toLowerCase(),
      title: words.map(cap).join(' '),
      sentence: s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
      camel: words.map((w, i) => (i ? cap(w) : w.toLowerCase())).join(''),
      pascal: words.map(cap).join(''),
      snake: words.map((w) => w.toLowerCase()).join('_'),
      kebab: words.map((w) => w.toLowerCase()).join('-'),
      constant: words.map((w) => w.toUpperCase()).join('_'),
      alt: [...s].map((c, i) => (i % 2 ? c.toLowerCase() : c.toUpperCase())).join(''),
      reverse: [...s].reverse().join(''),
      initials: words.map((w) => w[0] ?? '').join('').toUpperCase(),
    };
    const out = map[mode] ?? s;
    return { values: { out, chars: String([...s].length), words: String(words.length) }, steps: [`${[...s].length} characters in ${words.length} words`], outputs: [{ id: 'out', label: 'Result', unit: '' }] };
  },
};

const URL_TOOL = {
  id: 'url',
  title: 'URL encoder / decoder',
  group: 'text',
  blurb: 'Percent-encoding, with optional “+ for space” query behaviour.',
  keywords: 'url encode decode percent uri',
  inputs: [
    { id: 'text', label: 'Text', type: 'text' },
    { id: 'mode', label: 'Mode', type: 'select', options: [['enc', 'Encode'], ['dec', 'Decode']] },
    { id: 'plus', label: 'Use + for spaces', type: 'checkbox' },
  ],
  compute: ({ text, mode, plus }) => {
    const s = String(text ?? '');
    if (!s) return { error: 'Enter something to process.' };
    try {
      const out = mode === 'enc' ? encodeURIComponent(s).replace(/%20/g, plus ? '+' : '%20') : decodeURIComponent(s.replace(/\+/g, ' '));
      return { values: { out, len: String(out.length) }, steps: [`${mode === 'enc' ? 'encodeURIComponent' : 'decodeURIComponent'} → ${out.length} characters`], outputs: [{ id: 'out', label: 'Result', unit: '' }] };
    } catch {
      return { error: 'That string is not valid percent-encoded text.' };
    }
  },
};

const COUNTERS = {
  id: 'counters',
  title: 'Text counters',
  group: 'text',
  blurb: 'Characters, words, sentences, lines, reading time and the most common words.',
  keywords: 'word counter character line counter statistics',
  inputs: [{ id: 'text', label: 'Text', type: 'text' }],
  compute: ({ text }) => {
    const s = String(text ?? '');
    const chars = [...s].length;
    const noSpace = [...s].filter((c) => !/\s/.test(c)).length;
    const words = s.trim() ? s.trim().split(/\s+/).length : 0;
    const sentences = (s.match(/[^.!?…]+[.!?…]+[\s]*/g) || []).length || (s.trim() ? 1 : 0);
    const paragraphs = s.trim() ? s.trim().split(/\n\s*\n/).length : 0;
    const lines = s ? s.split(/\n/).length : 0;
    const bytes = new TextEncoder().encode(s).length;
    const minutes = words / 200;
    const freq = {};
    for (const w of s.toLowerCase().match(/[\p{L}\p{N}'’-]+/gu) || []) freq[w] = (freq[w] || 0) + 1;
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8).map(([w, c]) => `${w} (${c})`).join(', ');
    return {
      values: {
        chars: String(chars), noSpace: String(noSpace), words: String(words),
        sentences: String(sentences), paragraphs: String(paragraphs), lines: String(lines),
        bytes: String(bytes), bits: String(bytes * 8), unique: String(Object.keys(freq).length),
        read: minutes < 1 ? `${Math.ceil(minutes * 60)} sec` : `${minutes.toFixed(1)} min`,
        freq: top || '—',
      },
      steps: [`${chars} characters (${noSpace} without spaces)`, `${words} words`, `${sentences} sentences`, `${lines} lines`, `${bytes} UTF-8 bytes`],
      outputs: [
        { id: 'chars', label: 'Characters', unit: '' }, { id: 'noSpace', label: 'Without spaces', unit: '' },
        { id: 'words', label: 'Words', unit: '' }, { id: 'sentences', label: 'Sentences', unit: '' },
        { id: 'paragraphs', label: 'Paragraphs', unit: '' }, { id: 'lines', label: 'Lines', unit: '' },
        { id: 'unique', label: 'Unique words', unit: '' },
        { id: 'bytes', label: 'UTF-8 bytes', unit: '' }, { id: 'bits', label: 'UTF-8 bits', unit: '' },
        { id: 'read', label: 'Read time', unit: '' },
      ],
    };
  },
};

const HASH_TOOL = {
  id: 'hash',
  title: 'Hash & checksum',
  group: 'text',
  blurb: 'FNV-1a and djb2 digests of the UTF-8 bytes, plus CRC-32.',
  keywords: 'hash checksum crc fnv djb2 digest',
  inputs: [{ id: 'text', label: 'Text', type: 'text' }],
  compute: ({ text }) => {
    const bytes = new TextEncoder().encode(String(text ?? ''));
    let fnv = 0x811c9dc5, djb = 5381;
    for (const b of bytes) { fnv = Math.imul(fnv ^ b, 0x01000193) >>> 0; djb = (Math.imul(djb, 33) ^ b) >>> 0; }
    let c32 = 0xffffffff;
    for (const b of bytes) {
      c32 ^= b;
      for (let k = 0; k < 8; k++) c32 = c32 & 1 ? (c32 >>> 1) ^ 0xedb88320 : c32 >>> 1;
    }
    c32 = (c32 ^ 0xffffffff) >>> 0;
    return {
      values: { fnv1a: fnv.toString(16).toUpperCase().padStart(8, '0'), djb2: djb.toString(16).toUpperCase().padStart(8, '0'), crc32: c32.toString(16).toUpperCase().padStart(8, '0'), len: String(bytes.length) },
      steps: [`${bytes.length} UTF-8 bytes hashed`],
      outputs: [{ id: 'fnv1a', label: 'FNV-1a 32', unit: '' }, { id: 'djb2', label: 'djb2 32', unit: '' }, { id: 'crc32', label: 'CRC-32', unit: '' }],
    };
  },
};

/* ── finance & grades ────────────────────────────────────────────────────── */

const MORTGAGE = {
  id: 'mortgage',
  title: 'Mortgage payment',
  group: 'finance',
  blurb: 'M = P·r(1+r)ⁿ ÷ ((1+r)ⁿ − 1), compounded monthly.',
  keywords: 'mortgage loan payment interest amortisation',
  inputs: [
    { id: 'p', label: 'Price', step: 'any' },
    { id: 'rate', label: 'Annual rate %', step: 'any' },
    { id: 'n', label: 'Term (years)', step: 'any' },
    { id: 'down', label: 'Down payment', step: 'any' },
  ],
  compute: ({ p, rate, n: yrs, down }) => {
    const P0 = n(p), r = n(rate) / 1200, Y = n(yrs), D = n(down);
    if (!P0 || !Y) return { error: 'Price and term are required.' };
    const principal = Math.max(0, P0 - D);
    const months = Math.round(Y * 12);
    const pay = r > 0 ? principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1) : principal / months;
    const total = pay * months, interest = total - principal;
    return {
      values: { pay: g(pay, 4), principal: g(principal, 4), months: String(months), total: g(total, 2), interest: g(interest, 2), ltv: g(P0 ? D / P0 * 100 : 0, 3) },
      steps: [
        `principal = ${g(P0)} − ${g(D)} = ${g(principal)}`,
        `monthly rate r = ${g(r, 10)}`,
        `n = ${months} payments`,
        `M = P·r(1+r)ⁿ ÷ ((1+r)ⁿ − 1) = ${g(pay, 4)}`,
        `total paid = ${g(total, 2)}, interest = ${g(interest, 2)}`,
      ],
      outputs: [
        { id: 'pay', label: 'Monthly payment', unit: '' }, { id: 'principal', label: 'Loan amount', unit: '' },
        { id: 'interest', label: 'Total interest', unit: '' }, { id: 'total', label: 'Total paid', unit: '' },
        { id: 'ltv', label: 'Loan-to-value', unit: '%' },
      ],
    };
  },
};

const COMPOUND = {
  id: 'compound',
  title: 'Compound interest',
  group: 'finance',
  blurb: 'A = P(1 + r/n)^(nt), with optional recurring deposits.',
  keywords: 'compound interest investment deposit',
  inputs: [
    { id: 'p', label: 'Principal', step: 'any' },
    { id: 'r', label: 'Rate % per year', step: 'any' },
    { id: 't', label: 'Years', step: 'any' },
    { id: 'n', label: 'Compounds per year', type: 'select', options: [['1', 'Annually'], ['2', 'Semi-annually'], ['4', 'Quarterly'], ['12', 'Monthly'], ['365', 'Daily']] },
    { id: 'ap', label: 'Recurring deposit', step: 'any' },
  ],
  compute: ({ p, r, t, n: N, ap }) => {
    const P = n(p), R = n(r), T = n(t), k = n(N) || 1, AP = n(ap);
    if (!P && !AP) return { error: 'Enter a principal or a recurring deposit.' };
    const per = R / 100 / k, periods = T * k;
    let amount = P;
    for (let i = 0; i < periods; i++) amount = amount * (1 + per) + AP;
    const deposited = P + AP * periods;
    return {
      values: { amount: g(amount, 4), deposited: g(deposited, 4), interest: g(amount - deposited, 4), gain: g(deposited ? amount / deposited * 100 - 100 : 0, 4), per: g(per, 10) },
      steps: [`rate per period = ${g(per, 10)}`, `periods = ${g(periods)}`, `A = ${g(amount, 4)}`, `deposited = ${g(deposited, 4)}`, `interest = ${g(amount - deposited, 4)}`],
      outputs: [
        { id: 'amount', label: 'Final value', unit: '' }, { id: 'deposited', label: 'Total deposited', unit: '' },
        { id: 'interest', label: 'Interest earned', unit: '' }, { id: 'gain', label: 'Growth', unit: '%' },
      ],
    };
  },
};

const SIMPLE_INT = {
  id: 'simple-interest',
  title: 'Simple interest',
  group: 'finance',
  blurb: 'I = P·r·t, with t normalised to years.',
  keywords: 'simple interest principal rate time',
  inputs: [
    { id: 'p', label: 'Principal', step: 'any' },
    { id: 'r', label: 'Rate % per year', step: 'any' },
    { id: 't', label: 'Time', step: 'any' },
    { id: 'unit', label: 'Time unit', type: 'select', options: [['y', 'Years'], ['d', 'Days (÷365)'], ['mo', 'Months (÷12)']] },
  ],
  compute: ({ p, r, t, unit }) => {
    const P = n(p), R = n(r), T = n(t);
    const yrs = unit === 'd' ? T / 365 : unit === 'mo' ? T / 12 : T;
    const interest = P * R * yrs / 100;
    return {
      values: { interest: g(interest, 4), total: g(P + interest, 4), yrs: g(yrs, 8) },
      steps: [`t = ${g(T)} → ${g(yrs, 8)} years`, `I = P·r·t = ${g(P)} × ${g(R)} × ${g(yrs, 8)} ÷ 100 = ${g(interest, 4)}`],
      outputs: [{ id: 'interest', label: 'Interest', unit: '' }, { id: 'total', label: 'Final amount', unit: '' }],
    };
  },
};

const VAT = {
  id: 'vat',
  title: 'VAT / GST calculator',
  group: 'finance',
  blurb: 'Add tax to a net price, or strip it back out of a gross price.',
  keywords: 'vat gst sales tax reverse charge',
  inputs: [
    { id: 'amount', label: 'Amount', step: 'any' },
    { id: 'rate', label: 'Tax rate %', step: 'any' },
    { id: 'mode', label: 'Direction', type: 'select', options: [['add', 'Add tax to a net price'], ['remove', 'Remove tax from a gross price']] },
  ],
  compute: ({ amount, rate, mode }) => {
    const A = n(amount), R = n(rate);
    if (mode === 'add') {
      const tax = A * R / 100;
      return { values: { net: g(A, 4), tax: g(tax, 4), gross: g(A + tax, 4) }, steps: [`tax = ${g(A)} × ${g(R)} ÷ 100 = ${g(tax, 4)}`, `gross = ${g(A + tax, 4)}`], outputs: [{ id: 'net', label: 'Net', unit: '' }, { id: 'tax', label: 'Tax', unit: '' }, { id: 'gross', label: 'Gross', unit: '' }] };
    }
    const net = A * 100 / (100 + R), tax = A - net;
    return { values: { net: g(net, 4), tax: g(tax, 4), gross: g(A, 4) }, steps: [`net = ${g(A)} × 100 ÷ (100 + ${g(R)}) = ${g(net, 4)}`, `tax = ${g(tax, 4)}`], outputs: [{ id: 'net', label: 'Net', unit: '' }, { id: 'tax', label: 'Tax', unit: '' }, { id: 'gross', label: 'Gross', unit: '' }] };
  },
};

const DISCOUNT = {
  id: 'discount',
  title: 'Discount & markup',
  group: 'finance',
  blurb: 'Discount by percentage or by final price, with optional sales tax.',
  keywords: 'discount sale markup price percent off',
  inputs: [
    { id: 'price', label: 'Original price', step: 'any' },
    { id: 'rate', label: 'Discount % or final price', step: 'any' },
    { id: 'tax', label: 'Sales tax %', step: 'any' },
    { id: 'mode', label: 'Mode', type: 'select', options: [['pct', 'I know the discount %'], ['amt', 'I know the final price']] },
  ],
  compute: ({ price, rate, tax, mode }) => {
    const P = n(price), T = n(tax);
    let final, disc;
    if (mode === 'pct') { disc = P * n(rate) / 100; final = P - disc; }
    else { final = n(rate); disc = P - final; }
    const taxAmt = final * T / 100;
    return {
      values: { disc: g(disc, 4), final: g(final, 4), taxAmt: g(taxAmt, 4), total: g(final + taxAmt, 4), ratePct: g(P ? disc / P * 100 : 0, 4) },
      steps: [`discount = ${g(disc, 4)} (${g(P ? disc / P * 100 : 0, 4)}%)`, `final price = ${g(final, 4)}`, T ? `tax ${g(T)}% = ${g(taxAmt, 4)} → total ${g(final + taxAmt, 4)}` : 'no sales tax applied'].filter(Boolean),
      outputs: [
        { id: 'disc', label: 'You save', unit: '' }, { id: 'final', label: 'Final price', unit: '' },
        ...(T ? [{ id: 'total', label: 'With tax', unit: '' }] : []),
      ],
    };
  },
};

const GPA = {
  id: 'gpa',
  title: 'GPA calculator',
  group: 'finance',
  blurb: 'Credit-weighted mean with US, US +/−, and international scales.',
  keywords: 'gpa grade point average school college',
  inputs: [
    { id: 'courses', label: 'grade:credit rows', type: 'text', placeholder: 'A:3, B+:4, C:2' },
    { id: 'scale', label: 'Scale', type: 'select', options: [['us', 'US (A = 4.0)'], ['plus', 'US with ± (A+ = 4.0, A− = 3.7)'], ['intl', 'International (A = 4.33)']] },
  ],
  compute: ({ courses, scale }) => {
    const TABLE = scale === 'intl'
      ? { A: 4.33, 'A+': 4.33, 'A-': 4.0, 'B+': 3.67, B: 3.5, 'B-': 3.33, 'C+': 3.0, C: 2.67, 'C-': 2.33, 'D+': 2.33, D: 2.0, F: 0 }
      : scale === 'plus'
        ? { A: 4, 'A+': 4, 'A-': 3.7, 'B+': 3.7, B: 3.3, 'B-': 3.0, 'C+': 3.0, C: 2.7, 'C-': 2.3, 'D+': 2.3, D: 2, F: 0 }
        : { A: 4, 'A+': 4, 'A-': 4, B: 3, C: 2, D: 1, F: 0 };
    const rows = String(courses || '').split(/[,;\n]+/).map((r) => r.trim()).filter(Boolean)
      .map((r) => { const m = r.match(/^([A-Za-z][+-]?)\s*[:=\s]\s*([\d.]+)$/); return m ? [m[1].toUpperCase(), Number(m[2])] : null; }).filter(Boolean);
    if (!rows.length) return { error: 'Enter rows like A:3, B+:4.' };
    let pts = 0, cr = 0;
    const bad = [];
    for (const [grade, credits] of rows) {
      if (TABLE[grade] === undefined) { bad.push(grade); continue; }
      pts += TABLE[grade] * credits; cr += credits;
    }
    if (!cr) return { error: bad.length ? `Unknown grade letter(s): ${bad.join(', ')}` : 'Total credits must be above zero.' };
    const gpa = pts / cr;
    return {
      values: { gpa: g(gpa, 4), credits: g(cr, 4), pts: g(pts, 4), pct: g((gpa - 1) / 3 * 100, 3) },
      steps: rows.map(([gr, c]) => `${gr} = ${TABLE[gr] ?? '?'} × ${c} credits`).concat([`Σ points×credits = ${g(pts, 4)}`, `GPA = ${g(pts, 4)} ÷ ${g(cr, 4)} = ${g(gpa, 4)}`]),
      outputs: [{ id: 'gpa', label: 'GPA', unit: '' }, { id: 'credits', label: 'Total credits', unit: '' }, { id: 'pct', label: 'Equivalent percent', unit: '%' }],
    };
  },
};

const GRADE_CALC = {
  id: 'final-grade',
  title: 'Final grade calculator',
  group: 'finance',
  blurb: 'final = (total − current × weight) ÷ remaining weight.',
  keywords: 'grade final exam weighted score',
  inputs: [
    { id: 'total', label: 'Points earned so far', step: 'any' },
    { id: 'possible', label: 'Points possible so far', step: 'any' },
    { id: 'weight', label: 'Final exam weight %', step: 'any' },
  ],
  compute: ({ total, possible, weight }) => {
    const T = n(total), P = n(possible), W = n(weight);
    if (!P) return { error: 'Points possible is required.' };
    const cur = T / P * 100;
    const need = ((100 - cur) * P / 100) / (W / 100);
    return {
      values: { current: g(cur, 4), needed: g(need, 4), maxPossible: g(P + need, 4), weight: g(W, 4) },
      steps: [`current average = ${g(T)} ÷ ${g(P)} × 100 = ${g(cur, 4)}%`, `final counts for ${g(W, 4)}% of the grade`, `points still needed on the final = ${g(need, 4)} of ${g(P, 4)}`],
      outputs: [{ id: 'current', label: 'Current average', unit: '%' }, { id: 'needed', label: 'Points needed on the final', unit: '' }, { id: 'maxPossible', label: 'Final worth', unit: '' }],
    };
  },
};

/* ── health ──────────────────────────────────────────────────────────────── */

const BMI = {
  id: 'bmi',
  title: 'BMI calculator',
  group: 'health',
  blurb: 'BMI = kg ÷ m², or 703·lb ÷ in², with age-adjusted categories.',
  keywords: 'bmi body mass index weight height',
  inputs: [
    { id: 'w', label: 'Weight', step: 'any' },
    { id: 'h', label: 'Height', step: 'any' },
    { id: 'sys', label: 'System', type: 'select', options: [['metric', 'Metric (kg, m or cm)'], ['imperial', 'Imperial (lb, in or ft)']] },
    { id: 'age', label: 'Age', step: '1' },
  ],
  compute: ({ w, h, sys, age }) => {
    const W = n(w), H = n(h), A = n(age);
    if (!W || !H) return { error: 'Weight and height are required.' };
    if (sys === 'imperial') {
      const inches = H <= 12 ? H * 12 : H;
      const bmi = 703 * W / (inches * inches);
      const cut = A && A < 65 ? [18.5, 25, 30] : [22, 27, 30];
      return bmiOut(bmi, cut, `703 × ${g(W)} ÷ ${g(inches)}² = ${g(bmi, 4)}`, `weight ${g(W)} lb at ${g(inches)} in`);
    }
    const m = H > 3 ? H / 100 : H;
    const bmi = W / (m * m);
    const cut = A && A < 65 ? [18.5, 25, 30] : A && A < 75 ? [24, 26, 29] : [24, 27, 30];
    return bmiOut(bmi, cut, `${g(W)} ÷ ${g(m)}² = ${g(bmi, 4)}`, `weight ${g(W)} kg at ${g(m)} m`);
  },
};
function bmiOut(bmi, [u, o, ob], formula, input) {
  const cat = bmi < u ? 'Underweight' : bmi < o ? 'Healthy weight' : bmi < ob ? 'Overweight' : 'Obese';
  return {
    values: {
      bmi: g(bmi, 3), cat, u: g(u, 1), o: g(o, 1), ob: g(ob, 1),
      lo: g(18.5 * 1, 2), hi: g(24.9, 2),
    },
    steps: [`BMI = ${formula}`, `category thresholds: < ${u} underweight, < ${o} healthy, < ${ob} overweight`, `result: ${cat}`],
    outputs: [
      { id: 'bmi', label: 'BMI', unit: '' }, { id: 'cat', label: 'Category', unit: '' },
    ],
  };
}

/* ── time ────────────────────────────────────────────────────────────────── */

const DURATION = {
  id: 'duration',
  title: 'Time & duration',
  group: 'time',
  blurb: 'Total duration expressed in every unit, plus a working-day estimate.',
  keywords: 'duration days hours minutes seconds',
  inputs: [
    { id: 'd', label: 'Days', step: 'any' }, { id: 'h', label: 'Hours', step: 'any' },
    { id: 'm', label: 'Minutes', step: 'any' }, { id: 's', label: 'Seconds', step: 'any' },
  ],
  compute: ({ d, h, m, s }) => {
    const total = n(d) * 86400 + n(h) * 3600 + n(m) * 60 + n(s);
    return {
      values: {
        weeks: g(total / 604800, 8), days: g(total / 86400, 8), hours: g(total / 3600, 8),
        minutes: g(total / 60, 8), seconds: g(total, 4), ms: g(total * 1000, 2),
        workdays: g(total / 28800, 6), workweeks: g(total / 144000, 6),
      },
      steps: [`total = ${g(n(d))}·86400 + ${g(n(h))}·3600 + ${g(n(m))}·60 + ${g(n(s))} = ${g(total)} seconds`],
      outputs: [
        { id: 'weeks', label: 'Weeks', unit: '' }, { id: 'days', label: 'Days', unit: '' },
        { id: 'hours', label: 'Hours', unit: '' }, { id: 'minutes', label: 'Minutes', unit: '' },
        { id: 'seconds', label: 'Seconds', unit: '' }, { id: 'ms', label: 'Milliseconds', unit: '' },
        { id: 'workdays', label: 'Working days (8 h)', unit: '' }, { id: 'workweeks', label: 'Working weeks (40 h)', unit: '' },
      ],
    };
  },
};

const DATE_DIFF = {
  id: 'date-diff',
  title: 'Date difference',
  group: 'time',
  blurb: 'Exact day, week and year breakdown between two calendar dates.',
  keywords: 'date difference days between calculator',
  inputs: [
    { id: 'a', label: 'From', type: 'date' }, { id: 'b', label: 'To', type: 'date' },
  ],
  compute: ({ a, b }) => {
    const t1 = new Date(a + 'T00:00:00'), t2 = new Date(b + 'T00:00:00');
    if (isNaN(t1) || isNaN(t2)) return { error: 'Pick two dates.' };
    const ms = Math.abs(t2 - t1);
    const days = ms / 86400000;
    const years = Math.floor(days / 365.25);
    const rem = days - years * 365.25;
    const months = Math.floor(rem / 30.4375);
    return {
      values: { days: g(days, 4), weeks: g(days / 7, 4), hours: g(ms / 3600000, 2), minutes: g(ms / 60000, 2), years: String(years), months: String(months), leftover: g(rem - months * 30.4375, 2) },
      steps: [`${a} → ${b}`, `${g(days, 4)} days = ${g(days / 7, 4)} weeks`, `${years} years, ${months} months, ${g(rem - months * 30.4375, 2)} days`],
      outputs: [
        { id: 'days', label: 'Days', unit: '' }, { id: 'weeks', label: 'Weeks', unit: '' },
        { id: 'hours', label: 'Hours', unit: '' }, { id: 'years', label: 'Whole years', unit: '' },
        { id: 'months', label: 'Whole months', unit: '' },
      ],
    };
  },
};

const AGE = {
  id: 'age',
  title: 'Age calculator',
  group: 'time',
  blurb: 'Exact age in years, months and days from a birth date.',
  keywords: 'age birthday date of birth years old',
  inputs: [{ id: 'dob', label: 'Date of birth', type: 'date' }],
  compute: ({ dob }) => {
    const b = new Date(dob + 'T00:00:00'), now = new Date();
    if (isNaN(b) || b > now) return { error: 'Pick a date of birth in the past.' };
    let years = now.getFullYear() - b.getFullYear();
    let months = now.getMonth() - b.getMonth();
    let days = now.getDate() - b.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now - b) / 86400000);
    let nb = new Date(now.getFullYear(), b.getMonth(), b.getDate());
    if (nb < now) nb = new Date(now.getFullYear() + 1, b.getMonth(), b.getDate());
    return {
      values: {
        years: String(years), months: String(months), days: String(days),
        totalDays: String(totalDays), totalWeeks: String(Math.floor(totalDays / 7)),
        totalMonths: String(years * 12 + months), totalHours: String(totalDays * 24),
        nextBirthday: String(Math.ceil((nb - now) / 86400000)),
      },
      steps: [`born ${dob}`, `${years} years, ${months} months, ${days} days`, `${totalDays} days, ${Math.floor(totalDays / 7)} weeks, ${totalDays * 24} hours`],
      outputs: [
        { id: 'years', label: 'Years', unit: '' }, { id: 'months', label: 'Months', unit: '' },
        { id: 'days', label: 'Days', unit: '' }, { id: 'totalDays', label: 'Total days', unit: '' },
        { id: 'totalWeeks', label: 'Total weeks', unit: '' }, { id: 'totalMonths', label: 'Total months', unit: '' },
        { id: 'totalHours', label: 'Total hours', unit: '' }, { id: 'nextBirthday', label: 'Days to next birthday', unit: '' },
      ],
    };
  },
};

const WORLD_CLOCK = {
  id: 'world-clock',
  title: 'World clock',
  group: 'time',
  blurb: 'Live times across a configurable list of IANA zones.',
  keywords: 'world clock timezone time gmt utc',
  inputs: [{ id: 'zones', label: 'IANA zones, comma separated', type: 'text', placeholder: 'America/New_York,Europe/London,Asia/Tokyo' }],
  compute: ({ zones }) => {
    const list = String(zones || 'UTC,America/New_York,Europe/London,Europe/Berlin,Asia/Dubai,Asia/Kolkata,Asia/Shanghai,Asia/Tokyo,Australia/Sydney,America/Los_Angeles')
      .split(',').map((z) => z.trim()).filter(Boolean);
    const now = new Date();
    const rows = list.map((z) => {
      try {
        const time = new Intl.DateTimeFormat('en-GB', { timeZone: z, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short' }).format(now);
        const date = new Intl.DateTimeFormat('en-GB', { timeZone: z, weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(now);
        return { zone: z, when: `${date} ${time}`, ok: true };
      } catch { return { zone: z, when: 'invalid time zone', ok: false }; }
    });
    const values = { list: rows.map((r) => `${r.zone} — ${r.when}`).join('\n'), count: String(rows.length), epoch: String(Math.floor(now.getTime() / 1000)), iso: now.toISOString() };
    const outputs = [];
    rows.slice(0, 12).forEach((r, i) => {
      values[`z${i}`] = r.when;
      outputs.push({ id: `z${i}`, label: r.zone, unit: '' });
    });
    return {
      values,
      outputs,
      steps: [`read at ${now.toISOString()}`, `${rows.length} zone(s) resolved`],
    };
  },
};

const TIMESERIES = {
  id: 'growth-decay',
  title: 'Growth & decay table',
  group: 'time',
  blurb: 'Value at every period for exponential growth or decay.',
  keywords: 'growth decay table periods compound',
  inputs: [
    { id: 'x0', label: 'Start', step: 'any' }, { id: 'r', label: 'Rate %', step: 'any' },
    { id: 'steps', label: 'Periods', step: '1' },
  ],
  compute: ({ x0, r, steps }) => {
    const X = n(x0), R = n(r), S = Math.min(40, Math.max(1, Math.trunc(n(steps, 10))));
    const rows = [];
    let v = X;
    for (let i = 0; i <= S; i++) { rows.push([i, g(v, 8)]); v = v * (1 + R / 100); }
    const values = { final: g(v, 8), periods: String(S) };
    const outputs = [];
    rows.slice(0, 10).forEach(([t, val]) => {
      values[`p${t}`] = val;
      outputs.push({ id: `p${t}`, label: `Period ${t}`, unit: '' });
    });
    return {
      values,
      outputs,
      steps: [`${S} periods at ${g(R)}%`, `final value = ${g(v, 8)}`],
      table: { head: ['Period', 'Value'], rows },
    };
  },
};

/* ── general ─────────────────────────────────────────────────────────────── */

/**
 * Tokenised recursive-descent parser. No eval(), no Function(), no DOM access —
 * pasted input can never reach page globals.
 */
export function evalExpr(src) {
  let i = 0;
  const s = String(src).replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/π/g, 'pi');
  const CONST = { pi: Math.PI, PI: Math.PI, e: Math.E, tau: Math.PI * 2, inf: Infinity };
  const FN = {
    sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, sin: Math.sin, cos: Math.cos, tan: Math.tan,
    asin: Math.asin, acos: Math.acos, atan: Math.atan, atan2: Math.atan2,
    ln: Math.log, log: Math.log10, log10: Math.log10, log2: Math.log2, log1p: Math.log1p,
    exp: Math.exp, floor: Math.floor, ceil: Math.ceil, round: Math.round, sign: Math.sign,
    min: Math.min, max: Math.max, pow: Math.pow, hypot: Math.hypot, trunc: Math.trunc,
  };
  const eat = (t) => (s.startsWith(t, i) ? (i += t.length, true) : false);
  const num = () => {
    const m = /^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i.exec(s.slice(i));
    if (!m) throw new Error(`Expected a number at position ${i + 1}.`);
    i += m[0].length;
    return parseFloat(m[0]);
  };
  function primary() {
    if (eat('(')) { const v = expr(); if (!eat(')')) throw new Error('Missing a closing bracket.'); return v; }
    const fname = /^[a-zA-Z][a-zA-Z0-9_]*/.exec(s.slice(i));
    if (fname) {
      const key = fname[0].toLowerCase();
      i += fname[0].length;
      if (key in CONST) return CONST[key];
      if (!(key in FN)) throw new Error(`Unknown name "${fname[0]}".`);
      const args = [];
      if (eat('(')) {
        do { args.push(expr()); } while (eat(','));
        if (!eat(')')) throw new Error('Missing a closing bracket.');
      }
      return FN[key](...args);
    }
    if (eat('-')) return -primary();
    return num();
  }
  function power() {
    const base = primary();
    return eat('^') ? Math.pow(base, power()) : base;
  }
  function term() {
    let v = power();
    for (;;) {
      if (eat('*')) v *= power();
      else if (eat('/')) { const d = power(); if (d === 0) throw new Error('Division by zero.'); v /= d; }
      else if (eat('%')) { const d = power(); if (d === 0) throw new Error('Modulo by zero.'); v %= d; }
      else return v;
    }
  }
  function expr() {
    let v = term();
    for (;;) {
      if (eat('+')) v += term();
      else if (eat('-')) v -= term();
      else return v;
    }
  }
  const out = expr();
  if (i < s.length) throw new Error(`Unexpected "${s.slice(i, i + 8)}".`);
  return out;
}

/** Linear form: the same parser, with `x` bound to the input value. */
export function evalLinear(src, x) {
  let i = 0;
  const s = String(src).replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\^/g, '**').replace(/π/g, 'pi');
  const FN = { sqrt: Math.sqrt, abs: Math.abs, ln: Math.log, log: Math.log10, log10: Math.log10, sin: Math.sin, cos: Math.cos, tan: Math.tan, exp: Math.exp, floor: Math.floor, ceil: Math.ceil, round: Math.round, min: Math.min, max: Math.max };
  const CONST = { pi: Math.PI, e: Math.E };
  const eat = (t) => (s.startsWith(t, i) ? (i += t.length, true) : false);
  const num = () => {
    const m = /^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i.exec(s.slice(i));
    if (!m) throw new Error(`Expected a number at position ${i + 1}.`);
    i += m[0].length;
    return parseFloat(m[0]);
  };
  function primary() {
    if (eat('(')) { const v = expr(); if (!eat(')')) throw new Error('Missing a bracket.'); return v; }
    if (eat('x')) return x;
    const fname = /^[a-zA-Z][a-zA-Z0-9]*/.exec(s.slice(i));
    if (fname) {
      const key = fname[0].toLowerCase();
      i += fname[0].length;
      if (key in CONST) return CONST[key];
      if (!(key in FN)) throw new Error(`Unknown name "${fname[0]}".`);
      if (!eat('(')) throw new Error(`${fname[0]} needs brackets.`);
      const a = expr();
      if (!eat(')')) throw new Error('Missing a bracket.');
      return FN[key](a);
    }
    if (eat('-')) return -primary();
    return num();
  }
  function pow() { const b = primary(); return eat('**') ? Math.pow(b, pow()) : b; }
  function term() {
    let v = pow();
    for (;;) {
      if (eat('*')) v *= pow();
      else if (eat('/')) { const d = pow(); if (!d) throw new Error('Division by zero.'); v /= d; }
      else return v;
    }
  }
  function expr() {
    let v = term();
    for (;;) {
      if (eat('+')) v += term();
      else if (eat('-')) v -= term();
      else return v;
    }
  }
  const out = expr();
  if (i < s.length) throw new Error(`Unexpected "${s.slice(i, i + 8)}".`);
  return out;
}

const floatToHex = (x) => {
  const buf = new ArrayBuffer(8);
  new DataView(buf).setFloat64(0, x);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
};

const CUSTOM = {
  id: 'custom',
  title: 'Expression evaluator',
  group: 'general',
  blurb: 'Sandboxed arithmetic — operators, parentheses, functions and constants.',
  keywords: 'expression evaluator mathjs calculate formula',
  inputs: [{ id: 'expr', label: 'Expression', type: 'text', placeholder: 'sin(pi/4) * 2^10' }],
  compute: ({ expr }) => {
    const s = String(expr || '').trim();
    if (!s) return { error: 'Enter an expression.' };
    try {
      const value = evalExpr(s);
      if (!Number.isFinite(value)) return { error: 'The result is not a finite number.' };
      return {
        values: { value: g(value, 14), hex: floatToHex(value) },
        steps: [`${s}`, `= ${g(value, 14)}`, `IEEE-754 double = ${floatToHex(value)}`],
        outputs: [{ id: 'value', label: 'Result', unit: '' }, { id: 'hex', label: 'IEEE-754 bits', unit: '' }],
      };
    } catch (e) { return { error: e.message }; }
  },
};

const CUSTOM_EXPR = {
  id: 'custom-convert',
  title: 'Custom linear converter',
  group: 'general',
  blurb: 'Write your own conversion factor as a small expression in x.',
  keywords: 'custom converter formula factor expression',
  inputs: [
    { id: 'x', label: 'Input value', step: 'any' },
    { id: 'expr', label: 'Expression in x', type: 'text', placeholder: 'x * 2.54' },
  ],
  compute: ({ x, expr }) => {
    const X = n(x);
    const s = String(expr || '').trim();
    if (!s) return { error: 'Enter an expression such as x * 2.54.' };
    try {
      const v = evalLinear(s, X);
      return { values: { v: g(v, 14), inverse: v !== 0 ? g(X / v, 10) : '—' }, steps: [`${s} with x = ${g(X)}`, `= ${g(v, 14)}`], outputs: [{ id: 'v', label: 'Result', unit: '' }, { id: 'inverse', label: 'Inverse factor', unit: '' }] };
    } catch (e) { return { error: e.message }; }
  },
};

const RANDOM = {
  id: 'random',
  title: 'Random number generator',
  group: 'general',
  blurb: 'Crypto-seeded, with an optional step and draw count.',
  keywords: 'random number generator rng dice integer',
  inputs: [
    { id: 'min', label: 'Minimum', step: 'any' }, { id: 'max', label: 'Maximum', step: 'any' },
    { id: 'step', label: 'Step', step: 'any' }, { id: 'count', label: 'How many', step: '1' },
    { id: 'crypto', label: 'Use crypto-grade randomness', type: 'checkbox' },
  ],
  compute: ({ min, max, step, count, crypto: useCrypto }) => {
    const lo = n(min), hi = n(max, 100), st = step === '' || step === undefined ? 1 : n(step, 1);
    const cnt = Math.min(500, Math.max(1, Math.trunc(n(count, 1))));
    if (hi < lo) return { error: 'Maximum must be at least the minimum.' };
    if (st <= 0) return { error: 'Step must be greater than zero.' };
    const options = Math.floor((hi - lo) / st) + 1;
    const buf = randomWords(cnt, useCrypto);
    const vals = Array.from(buf, (r) => lo + Math.floor((r / 4294967296) * options) * st);
    const sum = vals.reduce((a, b) => a + b, 0);
    return {
      values: { list: vals.join(', '), count: String(cnt), sum: g(sum, 10), mean: g(sum / cnt, 10), min: String(Math.min(...vals)), max: String(Math.max(...vals)) },
      steps: [`options = ⌊(${hi} − ${lo}) ÷ ${st}⌋ + 1 = ${options}`, `${cnt} draw(s) using ${useCrypto ? 'crypto.getRandomValues' : 'Math.random'}`],
      outputs: [
        { id: 'list', label: 'Values', unit: '' }, { id: 'mean', label: 'Mean', unit: '' },
        { id: 'sum', label: 'Sum', unit: '' }, { id: 'min', label: 'Minimum', unit: '' }, { id: 'max', label: 'Maximum', unit: '' },
      ],
    };
  },
};

const PASSWORD = {
  id: 'password',
  title: 'Password generator',
  group: 'general',
  blurb: 'Character-class aware, with an entropy estimate.',
  keywords: 'password generator random secure entropy',
  inputs: [
    { id: 'len', label: 'Length', step: '1' },
    { id: 'lower', label: 'a–z', type: 'checkbox' },
    { id: 'upper', label: 'A–Z', type: 'checkbox' },
    { id: 'digits', label: '0–9', type: 'checkbox' },
    { id: 'symbols', label: '!@#$%^&*', type: 'checkbox' },
    { id: 'ambiguous', label: 'Exclude look-alikes (1lIioO0)', type: 'checkbox' },
  ],
  compute: (v) => {
    const len = Math.min(256, Math.max(4, Math.trunc(n(v.len, 16))));
    const sets = [];
    if (v.lower) sets.push('abcdefghijklmnopqrstuvwxyz');
    if (v.upper) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (v.digits) sets.push('0123456789');
    if (v.symbols) sets.push('!@#$%^&*');
    if (!sets.length) sets.push('abcdefghijklmnopqrstuvwxyz');
    let pool = sets.join('');
    if (v.ambiguous) pool = [...pool].filter((c) => !/[1lIioO0]/.test(c)).join('');
    if (!pool.length) return { error: 'Every character was excluded — relax the look-alike filter.' };
    const buf = randomWords(len, true);
    const pw = Array.from(buf, (r) => pool[r % pool.length]).join('');
    const entropy = len * Math.log2(pool.length);
    return {
      values: { pw, len: String(len), poolSize: String(pool.length), entropy: g(entropy, 2), strength: entropy < 60 ? 'weak' : entropy < 80 ? 'fair' : entropy < 100 ? 'strong' : 'excellent' },
      steps: [`pool = ${pool.length} symbols`, `entropy = ${len} × log₂(${pool.length}) = ${g(entropy, 2)} bits`],
      outputs: [
        { id: 'pw', label: 'Password', unit: '' }, { id: 'entropy', label: 'Entropy', unit: 'bits' },
        { id: 'strength', label: 'Strength', unit: '' },
      ],
    };
  },
};

const BATCH = {
  id: 'batch',
  title: 'Batch converter',
  group: 'general',
  blurb: 'Scale a whole list at once — one value per line or space.',
  keywords: 'batch bulk list scale convert multiple',
  inputs: [
    { id: 'values', label: 'Values', type: 'text', placeholder: '1\n2\n3.5' },
    { id: 'factor', label: 'Multiply by', step: 'any' },
  ],
  compute: ({ values, factor }) => {
    const F = n(factor, 1);
    const xs = parseList(values);
    if (!xs.length) return { error: 'Enter at least one number.' };
    const ys = xs.map((x) => x * F);
    const fmt = (x) => String(Number(x.toPrecision(12)));
    return {
      values: { output: ys.map(fmt).join('\n'), count: String(xs.length), sum: g(ys.reduce((a, b) => a + b, 0), 10) },
      steps: [`${xs.length} value(s) × ${F}`],
      outputs: [{ id: 'output', label: 'Results (one per line)', unit: '' }, { id: 'sum', label: 'Sum', unit: '' }],
    };
  },
};

export const TOOLS = [
  OHMS, DIVIDER, POWER_FACTOR, THREEPHASE, VOLTAGE_DROP, DBM, EV, ENERGY_BILL, PHOTOMETRY,
  STDDEV, WEIGHTED_AVG, QUADRATIC, ROOTS, FACTORIAL, PERCENT, PERCENT_ERROR, GCF_LCM, FRACTION,
  DECIMAL_FRACTION, RATIO, DIVMOD, SCI_NOTATION, PYTHAGOREAN, CONVOLUTION, LOG_CALC, EXP_GROWTH, TRIG,
  COLOR, RADIX_CALC, ROMAN, WORDING,
  CASE_CONV, URL_TOOL, COUNTERS, HASH_TOOL,
  MORTGAGE, COMPOUND, SIMPLE_INT, VAT, DISCOUNT, GPA, GRADE_CALC,
  BMI, DURATION, DATE_DIFF, AGE, WORLD_CLOCK, TIMESERIES,
  CUSTOM, RANDOM, PASSWORD, BATCH, CUSTOM_EXPR,
  WIRE_GAUGE, RESISTOR_BAND,
];

export const TOOL_BY_ID = Object.fromEntries(TOOLS.map((t) => [t.id, t]));
export const groupOf = (id) => GROUPS.find((x) => x.id === id) ?? GROUPS[GROUPS.length - 1];
export const toolsInGroup = (id) => TOOLS.filter((t) => t.group === id);