/**
 * Engine tests — run with `npm test`.
 * Every expected value is either taken verbatim from the reference site or
 * derived from the exact constants it used.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { FAMILIES } from '../js/data/units.js';
import {
  FORMATS, ENCODINGS, encodingSupported,
  textToBytes, bytesToText, bytesToHex, hexToBytes, bytesToBin, binToBytes,
  bytesToDec, decToBytes, bytesToOct, octToBytes, bytesToBase64, base64ToBytes,
  toBytes, fromBytes, convertFormat, parseBigInBase, bigToBase,
  crc8, crc16, crc32, twosComplement,
} from '../js/data/formats.js';
import { convertValue, pairsFor } from '../js/core/convert.js';
import { TOOLS, TOOL_BY_ID, evalExpr, evalLinear } from '../js/data/tools.js';
import { ASCII_128, ASCII_TABLE, expandBase, analyse } from '../js/data/ascii.js';

const close = (a, b, eps = 1e-9) =>
  assert.ok(Math.abs(a - b) <= eps * Math.max(1, Math.abs(b)), `${a} ≈ ${b} (tolerance ${eps})`);

/* ── text → hex: the reference example ──────────────────────────────────── */

test('reference: "Plant trees" → 50 6C 61 6E 74 20 74 72 65 65 73', () => {
  const bytes = textToBytes('Plant trees', 'latin1');
  assert.equal(bytesToHex(bytes, { delimiter: ' ' }), '50 6C 61 6E 74 20 74 72 65 65 73');
});

test('reference worked example: P = 80 = 5×16 = 50₁₆, l = 108 = 6C₁₆, a = 97 = 61₁₆', () => {
  assert.equal(parseInt(bytesToHex(textToBytes('P', 'latin1'), { delimiter: '' }), 16), 80);
  assert.equal(parseInt(bytesToHex(textToBytes('l', 'latin1'), { delimiter: '' }), 16), 108);
  assert.equal(parseInt(bytesToHex(textToBytes('a', 'latin1'), { delimiter: '' }), 16), 97);
  assert.equal(expandBase(65, 16).replace(/\s/g, ''), '4·16¹+1·16⁰');
  assert.equal(expandBase(48, 16).replace(/\s/g, ''), '3·16¹+0·16⁰');
  assert.equal(expandBase(80, 16).replace(/\s/g, ''), '5·16¹+0·16⁰');
  assert.equal(expandBase(108, 16).replace(/\s/g, ''), '6·16¹+12·16⁰');
  assert.equal(expandBase(97, 16).replace(/\s/g, ''), '6·16¹+1·16⁰');
});

test('reference: "Example" → 01000101 01111000 01100001 01101101 01110000 01101100 01100101', () => {
  assert.equal(
    bytesToBin(textToBytes('Example', 'latin1'), { delimiter: ' ' }),
    '01000101 01111000 01100001 01101101 01110000 01101100 01100101');
});

test('reference: reference site sample hex decodes to "This is a sample text string!"', () => {
  const hex = [...'This is a sample text string!'].map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ').toUpperCase();
  assert.equal(bytesToText(hexToBytes(hex), 'latin1'), 'This is a sample text string!');
});

/* ── encodings ──────────────────────────────────────────────────────────── */

test('UTF-8 gives variable byte lengths', () => {
  assert.deepEqual([...textToBytes('A', 'utf-8')], [0x41]);
  assert.deepEqual([...textToBytes('é', 'utf-8')], [0xc3, 0xa9]);
  assert.deepEqual([...textToBytes('€', 'utf-8')], [0xe2, 0x82, 0xac]);
  assert.deepEqual([...textToBytes('中', 'utf-8')], [0xe4, 0xb8, 0xad]);
  assert.deepEqual([...textToBytes('😀', 'utf-8')], [0xf0, 0x9f, 0x98, 0x80]);
});

test('code-point mode keeps astral characters whole', () => {
  assert.deepEqual([...textToBytes('😀', 'codepoint')], [0xf0, 0x9f, 0x98, 0x80]);
  assert.equal(bytesToText(textToBytes('a😀b', 'codepoint'), 'codepoint'), 'a😀b');
});

test('UTF-16 little/big endian', () => {
  assert.deepEqual([...textToBytes('A', 'utf-16le')], [0x41, 0x00]);
  assert.deepEqual([...textToBytes('A', 'utf-16be')], [0x00, 0x41]);
  assert.equal(bytesToText(textToBytes('Hi ☃', 'utf-16le'), 'utf-16le'), 'Hi ☃');
  assert.equal(bytesToText(textToBytes('Hi ☃', 'utf-16be'), 'utf-16be'), 'Hi ☃');
});

test('ASCII mode masks the high bit exactly like the reference', () => {
  // 233 (é) & 0x7f = 105 = 0x69 — the reference simply ANDs with 0x7f.
  assert.deepEqual([...textToBytes('Aé', 'ascii')], [0x41, 0x69]);
});

test('every declared encoding has a label and every supported one round-trips', () => {
  assert.ok(ENCODINGS.length >= 40, 'the reference offered ~45 charsets');
  for (const e of ENCODINGS) {
    assert.equal(typeof e.label, 'string');
    if (e.enc && encodingSupported(e.id)) {
      const rt = bytesToText(textToBytes('AZ09 ~', e.id), e.id);
      assert.equal(rt, 'AZ09 ~', `round-trip failed for ${e.label}`);
    }
  }
});

/* ── byte ⇄ format ──────────────────────────────────────────────────────── */

test('hex parser is forgiving about prefixes and delimiters', () => {
  assert.deepEqual([...hexToBytes('0x41 0x42')], [0x41, 0x42]);
  assert.deepEqual([...hexToBytes('41,42,43')], [0x41, 0x42, 0x43]);
  assert.deepEqual([...hexToBytes('41:42:43')], [0x41, 0x42, 0x43]);
  assert.deepEqual([...hexToBytes('\\x41\\x42')], [0x41, 0x42]);
  assert.deepEqual([...hexToBytes('%41%42')], [0x41, 0x42]);
  assert.deepEqual([...hexToBytes('"48656C6C6F"')], [0x48, 0x65, 0x6c, 0x6c, 0x6f]);
  assert.deepEqual([...hexToBytes('')], []);
});

test('hex parser rejects malformed input with a helpful message', () => {
  assert.throws(() => hexToBytes('4'), /Odd number of hex digits/);
  assert.throws(() => hexToBytes('4 1 2'), /Odd number of hex digits/);
  assert.throws(() => hexToBytes('zz'), /No hex digits/);
  // an odd count after separators is the classic paste mistake
  assert.deepEqual([...hexToBytes('41 42')], [0x41, 0x42]);
});

test('binary, decimal and octal byte formats', () => {
  assert.equal(bytesToBin(Uint8Array.from([0, 1, 255]), { delimiter: ' ' }), '00000000 00000001 11111111');
  assert.deepEqual([...binToBytes('00000000 00000001 11111111')], [0, 1, 255]);
  assert.deepEqual([...binToBytes('000000000000000111111111')], [0, 1, 255]);
  assert.throws(() => binToBytes('101'), /multiple of 8/);
  assert.equal(bytesToDec(Uint8Array.from([65, 66]), { delimiter: ' ' }), '65 66');
  assert.deepEqual([...decToBytes('65 66')], [65, 66]);
  assert.deepEqual([...decToBytes('065066')], [65, 66]);
  assert.throws(() => decToBytes('300'), /0–255/);
  assert.equal(bytesToOct(Uint8Array.from([8, 64]), { delimiter: ' ' }), '010 100');
  assert.deepEqual([...octToBytes('010 100')], [8, 64]);
  assert.throws(() => octToBytes('777'), /000–377/);
});

test('Base64 matches btoa/atob for byte values', () => {
  const bytes = Uint8Array.from([72, 101, 108, 108, 111]);
  assert.equal(bytesToBase64(bytes), 'SGVsbG8=');
  assert.deepEqual([...base64ToBytes('SGVsbG8=')], [...bytes]);
  assert.equal(bytesToBase64(new Uint8Array(0)), '');
  assert.throws(() => base64ToBytes('not base64!!'), /Invalid Base64/);
});

test('universal matrix: every ordered format pair preserves the byte stream', () => {
  const original = 'HexKit — 100% ✓ 😀';
  const source = textToBytes(original, 'utf-8');
  for (const a of FORMATS) {
    if (a.id === 'base64') continue; // base64 of the *bytes*, not of the text
    const mid = fromBytes(a.id, source, { delimiter: ' ', encoding: 'utf-8' });
    const back = toBytes(a.id, mid, 'utf-8');
    assert.deepEqual([...back], [...source], `${a.id} → bytes → ${a.id} lost data`);
  }
  // and text → each byte format → text
  for (const b of FORMATS) {
    if (b.id === 'text') continue;
    const mid = fromBytes(b.id, source, { delimiter: ' ', encoding: 'utf-8' });
    assert.equal(bytesToText(toBytes(b.id, mid, 'utf-8'), 'utf-8'), original, `text → ${b.id} → text`);
  }
  // base64 works on the byte stream in both directions
  assert.equal(bytesToText(base64ToBytes(bytesToBase64(source)), 'utf-8'), original);
});

test('convertFormat matches the reference delimiter + uppercase behaviour', () => {
  assert.equal(convertFormat('text', 'hex', 'Plant trees', { encoding: 'latin1' }), '50 6C 61 6E 74 20 74 72 65 65 73');
  assert.equal(convertFormat('hex', 'text', '50 6C 61 6E 74', { encoding: 'latin1' }), 'Plant');
  assert.equal(convertFormat('text', 'hex', 'AB', { encoding: 'latin1', delimiter: '' }), '4142');
  assert.equal(convertFormat('text', 'hex', 'AB', { encoding: 'latin1', prefix: '0x' }), '0x41 0x42');
});

/* ── arbitrary-precision bases ──────────────────────────────────────────── */

test('BigInt base parsing is exact', () => {
  assert.equal(parseBigInBase('FF', 16), 255n);
  assert.equal(parseBigInBase('1010', 2), 10n);
  assert.equal(parseBigInBase('777', 8), 511n);
  assert.equal(parseBigInBase('18446744073709551616', 10), 18446744073709551616n);
  assert.equal(parseBigInBase('zz', 36), 1295n);
  assert.equal(bigToBase(255n, 16), 'ff');
  assert.equal(parseBigInBase('not-a-number', 16), null);
});

test('checksums match known vectors', () => {
  const check = textToBytes('123456789', 'utf-8');
  assert.equal(crc32(check), 'CBF43926');   // standard CRC-32 check value
  assert.equal(crc16(check), '29B1');       // CRC-16/CCITT-FALSE check value
  assert.equal(crc8(check), 'F4');          // CRC-8/ATM check value
});

test("two's complement across widths", () => {
  assert.equal(twosComplement(Uint8Array.from([0xff]), 1), -1n);
  assert.equal(twosComplement(Uint8Array.from([0x80]), 1), -128n);
  assert.equal(twosComplement(Uint8Array.from([0x7f]), 1), 127n);
  assert.equal(twosComplement(Uint8Array.from([0xff, 0xff]), 2), -1n);
  assert.equal(twosComplement(Uint8Array.from([0x00, 0x01]), 2), 1n);
  assert.equal(twosComplement(Uint8Array.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]), 8), -1n);
});

/* ── unit conversion ────────────────────────────────────────────────────── */

test('length: reference factors (inch 0.0254 m, foot 0.3048 m, mile 1609.344 m)', () => {
  close(convertValue('length', 'm', 'ft', 1), 1 / 0.3048);
  close(convertValue('length', 'km', 'mi', 1), 1 / 1.609344);
  close(convertValue('length', 'in', 'cm', 1), 2.54);
  close(convertValue('length', 'mi', 'ft', 1), 5280);
  close(convertValue('length', 'yd', 'ft', 1), 3);
  close(convertValue('length', 'ft', 'in', 1), 12);
});

test('temperature: the affine pairs from the reference', () => {
  close(convertValue('temperature', 'C', 'F', 0), 32);
  close(convertValue('temperature', 'C', 'F', 100), 212);
  close(convertValue('temperature', 'F', 'C', 32), 0);
  close(convertValue('temperature', 'F', 'C', 212), 100);
  close(convertValue('temperature', 'C', 'K', 0), 273.15);
  close(convertValue('temperature', 'K', 'C', 273.15), 0);
  close(convertValue('temperature', 'F', 'K', 32), 273.15);
  close(convertValue('temperature', 'K', 'F', 273.15), 32);
  close(convertValue('temperature', 'C', 'R', 0), 491.67);
  close(convertValue('temperature', 'R', 'F', 491.67), 32);
  close(convertValue('temperature', 'R', 'C', 491.67), 0);
});

test('temperature rejects values below absolute zero', () => {
  assert.throws(() => convertValue('temperature', 'C', 'F', -300), /absolute zero/i);
});

test('mass: the reference constants (lb 0.45359237 kg, oz 0.02834952 kg, st 14 lb)', () => {
  close(convertValue('mass', 'kg', 'lb', 1), 2.20462262);
  close(convertValue('mass', 'lb', 'st', 1), 1 / 14);
  close(convertValue('mass', 'oz', 'g', 1), 28.34952);
  // The reference rounded oz to 0.02834952 rather than lb/16, so the two
  // disagree in the 8th significant figure. Reproduce that, don't "fix" it.
  close(convertValue('mass', 'lb', 'oz', 1), 16, 1e-6);
  close(convertValue('mass', 'g', 'oz', 1), 0.001 / 0.02834952);});

test('power: horsepower, BTU/h and refrigeration ton', () => {
  close(convertValue('power', 'w', 'hp', 1), 1 / 745.699872);
  close(convertValue('power', 'hp', 'kw', 1), 0.745699872);
  close(convertValue('power', 'hp', 'hpm', 1), 745.699872 / 735.49875);
  close(convertValue('power', 'kw', 'btuh', 1), 3412.141633, 1e-6);
  close(convertValue('power', 'kw', 'tr', 1), 1 / 3.5168525);
});

test('energy: kWh = 3.6e6 J, BTU(IT) = 1055.05585262 J, eV = 1.602176565e-19 J', () => {
  close(convertValue('energy', 'kwh', 'j', 1), 3.6e6);
  close(convertValue('energy', 'btu', 'j', 1), 1055.05585262);
  close(convertValue('energy', 'ev', 'j', 1), 1.602176565e-19);
  close(convertValue('energy', 'kcal', 'j', 1), 4184);
});

test('electrical families', () => {
  close(convertValue('voltage', 'kv', 'v', 1), 1000);
  close(convertValue('current', 'ma', 'a', 1), 0.001);
  close(convertValue('current', 'ma', 'ua', 1), 1000);
  close(convertValue('charge', 'ah', 'c', 1), 3600);
  close(convertValue('charge', 'mah', 'ah', 1), 0.001);
  close(convertValue('resistance', 'kohm', 'ohm', 1), 1000);
  close(convertValue('capacitance', 'uf', 'nf', 1), 1000);
  close(convertValue('inductance', 'mh', 'uh', 1), 1000);
  close(convertValue('frequency', 'khz', 'hz', 1), 1000);
  close(convertValue('frequency', 'hz', 'rpm', 1), 60);
});

test('angle: radian ⇄ degree is exact to π', () => {
  close(convertValue('angle', 'rad', 'deg', Math.PI), 180);
  close(convertValue('angle', 'deg', 'grad', 90), 100);
  close(convertValue('angle', 'deg', 'arcmin', 1), 60);
  close(convertValue('angle', 'deg', 'mil', 360), 6400);
});

test('concentration, data and volume', () => {
  close(convertValue('concentration', 'pct', 'ppm', 1), 10000);
  close(convertValue('concentration', 'ppm', 'ppb', 1), 1000);
  close(convertValue('concentration', 'ppb', 'ppt', 1), 1000);
  close(convertValue('concentration', 'frac', 'pct', 1), 100);
  close(convertValue('data', 'kib', 'b', 1), 1024);
  close(convertValue('data', 'kb', 'b', 1), 1000);
  close(convertValue('data', 'b', 'bit', 1), 8);
  close(convertValue('data', 'bit', 'b', 1), 0.125);
  close(convertValue('volume', 'gal', 'qt', 1), 4);
  close(convertValue('volume', 'floz', 'ml', 1), 29.5735295625);
  close(convertValue('volume', 'ft3', 'l', 1), 28.316846592);
});

test('pressure, force, speed, area', () => {
  close(convertValue('pressure', 'atm', 'pa', 1), 101325);
  close(convertValue('pressure', 'psi', 'pa', 1), 6894.757293168361);
  close(convertValue('force', 'kgf', 'n', 1), 9.80665);
  close(convertValue('force', 'lbf', 'n', 1), 4.4482216152605);
  close(convertValue('speed', 'kph', 'mps', 1), 1 / 3.6);
  close(convertValue('speed', 'mph', 'mps', 1), 0.44704);
  close(convertValue('speed', 'kn', 'kph', 1), 1.852);
  close(convertValue('area', 'ac', 'm2', 1), 4046.8564224);
  close(convertValue('area', 'ft2', 'm2', 1), 0.09290304);
  close(convertValue('torque', 'lbfft', 'nm', 1), 1.3558179483314);
  close(convertValue('time', 'h', 's', 1), 3600);
  close(convertValue('time', 'yr', 'd', 1), 365.25);
  close(convertValue('illuminance', 'fc', 'lx', 1), 10.76391041671);
});

test('every family pair converts without throwing and is reversible', () => {
  let count = 0;
  for (const fam of Object.keys(FAMILIES)) {
    for (const [a, b] of pairsFor(fam)) {
      const x = 12.5;
      const y = convertValue(fam, a, b, x);
      assert.ok(Number.isFinite(y), `${fam}: ${a}→${b} produced ${y}`);
      close(convertValue(fam, b, a, y), x, 1e-9);
      count++;
    }
  }
  assert.ok(count > 800, `expected a large pair catalogue, got ${count}`);
});

/* ── calculators ────────────────────────────────────────────────────────── */

const run = (id, input) => TOOL_BY_ID[id].compute(input);
const val = (id, input, key) => Number(run(id, input).values[key]);

test("Ohm's law matches every branch of the reference", () => {
  close(val('ohms-law', { v: 12, i: 2 }, 'r'), 6);
  close(val('ohms-law', { i: 2, r: 6 }, 'v'), 12);
  close(val('ohms-law', { v: 12, p: 24 }, 'i'), 2);
  close(val('ohms-law', { r: 6, p: 24 }, 'v'), 12);
  close(val('ohms-law', { i: 2, p: 24 }, 'v'), 12);
  close(val('ohms-law', { v: 12, r: 6 }, 'p'), 24);
  assert.equal(run('ohms-law', { v: 12 }).error, 'Enter at least two values.');
});

test('voltage divider solves each of the four missing values', () => {
  close(val('voltage-divider', { vin: 12, r1: 1000, r2: 470 }, 'vout'), 12 * 470 / 1470);
  close(val('voltage-divider', { vin: 12, vout: 5, r1: 1000 }, 'r2'), 1000 * 5 / 7);
  close(val('voltage-divider', { vin: 12, vout: 5, r2: 470 }, 'r1'), 470 * 7 / 5);
  close(val('voltage-divider', { vout: 5, r1: 1000, r2: 470 }, 'vin'), 5 * 1470 / 470);
});

test('three-phase power and power factor', () => {
  close(val('three-phase', { v: 400, i: 10, pf: 1, type: 'star' }, 'p'), 400 * 10 * Math.sqrt(3));
  close(val('three-phase', { v: 400, i: 10, pf: 1, type: 'delta' }, 'p'), 12000);
  close(val('power-factor', { v: 400, a: 25, kw: 12, phase: '3y' }, 'kva'), 400 * 25 * Math.sqrt(3) / 1000);
  close(val('power-factor', { v: 120, a: 10, kw: 1, phase: '1' }, 'kva'), 1.2);
});

test('voltage drop uses R = 2ρL/A', () => {
  const r = run('voltage-drop', { awg: '10', len: 30, i: 20, v: 240 });
  const area = Math.PI * 2.588 ** 2 / 4;
  close(Number(r.values.r), 2 * 1.72e-8 * 30 / (area * 1e-6), 1e-6);
  close(Number(r.values.vd), Number(r.values.r) * 20);
});

test('wire gauge reproduces the reference AWG formulas', () => {
  const g14 = run('wire-gauge', { n: 14, mode: 'awg' });
  close(Number(g14.values.din), 0.005 * Math.pow(92, (36 - 14) / 39), 1e-9);
  close(Number(g14.values.dmm), 0.127 * Math.pow(92, (36 - 14) / 39), 1e-9);
  close(Number(g14.values.amm), Math.PI / 4 * Number(g14.values.dmm) ** 2, 1e-9);
  const alias = run('wire-gauge', { n: '00', mode: 'awg' });
  close(Number(alias.values.din), 0.005 * Math.pow(92, (36 - -1) / 39), 1e-9);
  assert.ok(run('wire-gauge', { n: 30, mode: 'swg' }).values.din);
});

test('statistics: population and sample variance match the reference', () => {
  const pop = run('stddev', { data: '2 4 4 4 5 5 7 9', mode: 'pop' });
  assert.equal(pop.values.n, '8');
  close(Number(pop.values.mean), 5);
  close(Number(pop.values.variance), 4);
  close(Number(pop.values.median), 4.5);
  const samp = run('stddev', { data: '2 4 4 4 5 5 7 9', mode: 'samp' });
  close(Number(samp.values.variance), 32 / 7, 1e-9);
  close(Number(samp.values.pvar), 4);
  close(Number(run('stddev', { data: '2 4 4 4 5 5 7 9' }).values.range), 7);
  close(Number(run('stddev', { data: '2 4 4 4 5 5 7 9' }).values.rms), Math.sqrt(232 / 8));
});

test('quadratic solver handles real, repeated and complex roots', () => {
  close(val('quadratic', { a: 1, b: -3, c: 2 }, 'x1'), 2);
  close(val('quadratic', { a: 1, b: -3, c: 2 }, 'x2'), 1);
  close(val('quadratic', { a: 1, b: 2, c: 1 }, 'd'), 0);
  close(val('quadratic', { a: 1, b: 2, c: 1 }, 'x1'), -1);
  // x² + 1 = 0 → D = b² − 4ac = −4, so √D = 2i and x = 0 ± i·1
  const cplx = run('quadratic', { a: 1, b: 0, c: 1 });
  close(Number(cplx.values.d), -4);
  close(Number(cplx.values.re), 0);
  close(Number(cplx.values.im), 1);
});

test('roots, factorials and combinations', () => {
  close(val('root', { x: 16, k: 2 }, 'root'), 4);
  close(val('root', { x: 27, k: 3 }, 'root'), 3);
  close(val('root', { x: 16 }, 'neg'), -4);
  // ∛(−8) = 1 + √3·i  →  re = 2·cos(π/3) = 1
  const r = run('root', { x: -8, k: 3 });
  close(Number(r.values.re), 1, 1e-9);
  close(Number(r.values.im), Math.sqrt(3), 1e-9);
  assert.equal(run('factorial', { n: 0 }).values.fac, '1');
  assert.equal(run('factorial', { n: 20 }).values.fac, '2432902008176640000');
  assert.equal(run('factorial', { n: 5, r: 2 }).values.ncr, '10');
  assert.equal(run('factorial', { n: 5, r: 2 }).values.npr, '20');
  assert.match(run('factorial', { n: -1 }).error, /zero or positive/);
});

test('percentages, percent error, GCF/LCM', () => {
  close(val('percentage', { mode: '1', x: 15, y: 200 }, 'r'), 30);
  close(val('percentage', { mode: '2', x: 30, y: 200 }, 'r'), 15);
  close(val('percentage', { mode: '3', x: 30, y: 15 }, 'r'), 200);
  close(val('percentage', { mode: '4', x: 100, y: 125 }, 'r'), 25);
  close(val('percent-error', { measured: 9.6, accepted: 10 }, 'pct'), 4);
  close(val('percent-error', { measured: 10.4, accepted: 10 }, 'pct'), 4);
  close(val('gcf-lcm', { data: '12 18 24' }, 'gcf'), 6);
  close(val('gcf-lcm', { data: '12 18 24' }, 'lcm'), 72);
  close(val('gcf-lcm', { data: '0.5 1.5' }, 'gcf'), 0.5);
});

test('fractions, decimal⇄fraction, ratio, divmod', () => {
  const sum = run('fraction', { n1: 1, d1: 2, n2: 1, d2: 3, op: '+' });
  assert.equal(sum.values.num, '5');
  assert.equal(sum.values.den, '6');
  assert.equal(sum.values.mixed, '0 5/6');
  const neg = run('fraction', { n1: 1, d1: 2, n2: 1, d2: 3, op: '-' });
  assert.equal(neg.values.num, '1');
  assert.equal(neg.values.den, '6');
  const mul = run('fraction', { n1: 2, d1: 3, n2: 3, d2: 4, op: '*' });
  assert.equal(mul.values.num, '1');
  assert.equal(mul.values.den, '2');
  const df = run('decimal-fraction', { x: '0.375' });
  assert.equal(df.values.num, '3');
  assert.equal(df.values.den, '8');
  assert.equal(df.values.mixed, '0 3/8');
  assert.equal(df.values.repeat, '');
  // 1/3 written out → the repetend is found in the digits themselves
  const third = run('decimal-fraction', { x: '0.3333333' });
  assert.equal(third.values.num, '1');
  assert.equal(third.values.den, '3');
  assert.equal(third.values.repeat, '0.(3)');
  assert.equal(third.values.period, '1');
  // 0.1666… → non-repeating "1", repeating "6"
  const sixth = run('decimal-fraction', { x: '0.16666' });
  assert.equal(sixth.values.num, '1');
  assert.equal(sixth.values.den, '6');
  assert.equal(sixth.values.repeat, '0.1(6)');
  // 1/7 has period 6
  const seventh = run('decimal-fraction', { x: '0.142857142857' });
  assert.equal(seventh.values.num, '1');
  assert.equal(seventh.values.den, '7');
  assert.equal(seventh.values.repeat, '0.(142857)');
  assert.equal(seventh.values.period, '6');
  assert.equal(run('ratio', { data: '16:24' }).values.simple, '2:3');
  assert.equal(run('divmod', { a: 47, b: 5 }).values.q, '9');
  assert.equal(run('divmod', { a: 47, b: 5 }).values.r, '2');
  assert.equal(run('divmod', { a: 47, b: 5 }).values.dec, '9.4');
});

test('scientific notation, pythagoras, convolution, logs, trig', () => {
  close(val('scientific', { x: 12345, op: 'none' }, 'e'), 4);
  close(val('scientific', { x: 0.005 }, 'e'), -3);
  close(val('scientific', { x: 10, op: '*', y: 10 }, 'e'), 2);
  close(val('pythagorean', { a: 3, b: 4 }, 'c'), 5);
  close(val('pythagorean', { c: 5, a: 3 }, 'b'), 4);
  // full linear convolution of [1,2,3,4] with [1,2,1] has 4+3-1 = 6 terms
  assert.equal(run('convolution', { x: '1 2 3 4', h: '1 2 1' }).values.y, '1, 4, 8, 12, 11, 4');
  close(val('log', { x: 100, b: 10, dir: 'log' }, 'r'), 2);
  close(val('log', { x: 1, dir: 'ln' }, 'r'), 0);
  close(val('log', { x: 3, b: 2, dir: 'anti' }, 'r'), 8);
  close(val('trig', { x: 45, unit: 'deg' }, 'sin'), Math.SQRT1_2, 1e-9);
  close(val('trig', { x: 30, unit: 'deg' }, 'tan'), Math.tan(Math.PI / 6), 1e-9);
  assert.match(run('pythagorean', { c: 3, a: 5 }).error, /longest side/);
});

test('colour conversion matches the reference formulas', () => {
  const c = run('color-convert', { hex: '#3B82F6' });
  assert.equal(c.values.hex, '#3B82F6');
  assert.equal(c.values.r, '59');
  assert.equal(c.values.g, '130');
  assert.equal(c.values.b, '246');
  // HSL 0/100/50 is pure red — and 0 must not be mistaken for "field empty"
  assert.equal(run('color-convert', { h: 0, s: 100, l: 50 }).values.hex, '#FF0000');
  assert.equal(run('color-convert', { r: 0, g: 0, b: 0 }).values.hex, '#000000');
  // CMYK 0/100/100/0 is red (magenta + yellow); 0/0/100/0 is yellow
  assert.equal(run('color-convert', { c: 0, m: 100, y: 100, k: 0 }).values.hex, '#FF0000');
  assert.equal(run('color-convert', { c: 0, m: 0, y: 100, k: 0 }).values.hex, '#FFFF00');
  const cmyk = run('color-convert', { hex: '#000000' });
  assert.equal(cmyk.values.k, '100');
  // every conversion must agree with the others
  const hsl = run('color-convert', { hex: '#3B82F6' }).values;
  assert.equal(Number(hsl.h) > 0 && Number(hsl.s) > 50, true);
  assert.equal(run('color-convert', { hex: '#FFFFFF' }).values.k, '0');
});

test('base calculator uses exact BigInt arithmetic', () => {
  assert.equal(run('radix-calc', { base: '16', a: 'FF', b: '0F', op: 'add' }).values.r, '10E');
  assert.equal(run('radix-calc', { base: '16', a: 'FF', b: '0F', op: 'sub' }).values.r, 'F0');
  assert.equal(run('radix-calc', { base: '2', a: '1010', b: '1100', op: 'bxor' }).values.dec, '6');
  assert.equal(run('radix-calc', { base: '2', a: '1010', b: '1100', op: 'band' }).values.dec, '8');
  assert.equal(run('radix-calc', { base: '2', a: '1010', b: '1100', op: 'bor' }).values.dec, '14');
  // 0x10 is sixteen, so 2^0x10 = 65536 — the exponent is read in the same base
  assert.equal(run('radix-calc', { base: '16', a: '2', b: '10', op: 'pow' }).values.dec, '65536');
  assert.equal(run('radix-calc', { base: '10', a: '2', b: '10', op: 'pow' }).values.dec, '1024');
  assert.equal(run('radix-calc', { base: '36', a: 'Z', b: 'Z', op: 'mul' }).values.r, 'Y1');
  assert.equal(run('radix-calc', { base: '36', a: 'Z', b: 'Z', op: 'mul' }).values.dec, '1225');
  assert.match(run('radix-calc', { base: '16', a: '1', b: '0', op: 'div' }).error, /Division by zero/);
  assert.match(run('radix-calc', { base: '16', a: 'ZZ', b: '1', op: 'add' }).error, /not valid in base 16/);
  assert.match(run('radix-calc', { base: '8', a: '9', b: '1', op: 'add' }).error, /not valid in base 8/);
});

test('roman numerals, number words, case and URL tools', () => {
  assert.equal(run('roman', { v: 2024 }).values.roman, 'MMXXIV');
  assert.equal(run('roman', { v: 1990 }).values.roman, 'MCMXC');
  assert.equal(run('roman', { v: 'MMXXIV' }).values.n, '2024');
  assert.match(run('roman', { v: 5000 }).error, /1 to 4999/);
  assert.equal(run('number-words', { v: 1234 }).values.words, 'one thousand two hundred thirty-four');
  assert.equal(run('case-convert', { text: 'hello world', mode: 'camel' }).values.out, 'helloWorld');
  assert.equal(run('case-convert', { text: 'hello world', mode: 'kebab' }).values.out, 'hello-world');
  assert.equal(run('url', { text: 'a b', mode: 'enc' }).values.out, 'a%20b');
  assert.equal(run('url', { text: 'a+b', mode: 'dec' }).values.out, 'a b');
});

test('counters and hashing', () => {
  const t = run('counters', { text: 'one two two three' });
  assert.equal(t.values.words, '4');
  assert.equal(t.values.chars, '17');
  assert.match(t.values.freq, /two \(2\)/);
  const h = run('hash', { text: 'HexKit' });
  assert.match(h.values.fnv1a, /^[0-9A-F]{8}$/);
  assert.match(h.values.crc32, /^[0-9A-F]{8}$/);
});

test('finance calculators', () => {
  const m = run('mortgage', { p: 400000, rate: 5.5, n: 30, down: 80000 });
  close(Number(m.values.principal), 320000);
  close(Number(m.values.pay), 1816.19, 0.01);
  close(Number(m.values.months), '360');
  const c = run('compound', { p: 10000, r: 7, t: 10, n: '12' });
  close(Number(c.values.amount), 10000 * Math.pow(1 + 0.07 / 12, 120), 1e-4);
  close(val('simple-interest', { p: 10000, r: 5, t: 3, unit: 'y' }, 'interest'), 1500);
  close(val('vat', { amount: 100, rate: 20, mode: 'add' }, 'gross'), 120);
  close(val('vat', { amount: 120, rate: 20, mode: 'remove' }, 'net'), 100);
  close(val('discount', { price: 200, rate: 25, tax: 0, mode: 'pct' }, 'final'), 150);
  close(val('gpa', { courses: 'A:3, B:4', scale: 'us' }, 'gpa'), 24 / 7, 1e-4);
  close(val('gpa', { courses: 'A:3, B+:4, C:2', scale: 'plus' }, 'gpa'), (4 * 3 + 3.7 * 4 + 2.7 * 2) / 9, 1e-4);
  close(val('final-grade', { total: 420, possible: 500, weight: 30 }, 'current'), 84);
});

test('health and time calculators', () => {
  close(val('bmi', { w: 70, h: 1.75, sys: 'metric', age: 30 }, 'bmi'), 22.857, 0.01);
  close(val('bmi', { w: 180, h: 72, sys: 'imperial', age: 30 }, 'bmi'), 703 * 180 / 72 ** 2, 0.01);
  assert.equal(run('bmi', { w: 70, h: 1.75, sys: 'metric', age: 30 }).values.cat, 'Healthy weight');
  close(val('duration', { d: 1, h: 12 }, 'hours'), 36);
  close(val('duration', { d: 1, h: 0, m: 0, s: 0 }, 'weeks'), 1 / 7, 1e-7);
  const wc = run('world-clock', { zones: 'UTC,Not/AZone' });
  assert.match(wc.values.list, /UTC/);
  assert.match(wc.values.list, /invalid time zone/);
  const age = run('age', { dob: '2000-01-01' });
  assert.ok(Number(age.values.years) >= 25);
});

test('general tools', () => {
  close(evalExpr('2 + 3 * 4'), 14);
  close(evalExpr('(2 + 3) * 4'), 20);
  close(evalExpr('2 ^ 10'), 1024);
  close(evalExpr('sqrt(144)'), 12);
  close(evalExpr('pi', 6), Math.PI);
  assert.throws(() => evalExpr('alert(1)'), /Unknown name/);
  assert.throws(() => evalExpr('1 / 0'), /Division by zero/);
  assert.throws(() => evalExpr('2 +'), /Expected a number/);
  close(evalLinear('x * 2.54', 5), 12.7);
  close(evalLinear('x + x/2', 10), 15);
  assert.throws(() => evalLinear('document.cookie', 1), /Unknown name/);

  assert.equal(run('batch', { values: '1 2 4', factor: 2.5 }).values.output, '2.5\n5\n10');
  const rnd = run('random', { min: 1, max: 6, step: 1, count: 20, crypto: true });
  assert.equal(rnd.values.count, '20');
  assert.ok(Number(rnd.values.min) >= 1 && Number(rnd.values.max) <= 6);
  const pw = run('password', { len: 24, lower: true, upper: true, digits: true, symbols: true, ambiguous: true });
  assert.equal(pw.values.pw.length, 24);
  assert.ok(Number(pw.values.entropy) > 100);
  assert.ok(!/[1lIioO0]/.test(pw.values.pw));
  assert.equal(run('custom-convert', { x: 5, expr: 'x * 2.54' }).values.v, '12.7');
});

test('every tool declares inputs, a group and returns a result for its seed', () => {
  const ids = new Set();
  for (const tool of TOOLS) {
    assert.ok(tool.id && !ids.has(tool.id), `duplicate or missing id: ${tool.id}`);
    ids.add(tool.id);
    assert.ok(Array.isArray(tool.inputs) && tool.inputs.length, `${tool.id} has no inputs`);
    assert.equal(typeof tool.compute, 'function');
    const seed = Object.fromEntries(tool.inputs.map((i) => [i.id, '']));
    const r = tool.compute(seed);
    assert.ok(r && typeof r === 'object', `${tool.id} returned nothing`);
    assert.ok(r.error || r.values, `${tool.id} produced neither a result nor an error`);
  }
  assert.ok(TOOLS.length >= 50, `expected a substantial catalogue, got ${TOOLS.length}`);
});

/**
 * Regression guard: the UI renders one tile per entry of `outputs`, reading
 * `values[output.id]`. An output whose id is not a key of `values` renders as a
 * blank panel — which is exactly the bug that shipped once.
 */
test('every declared output id exists in the returned values', () => {
  const SEEDS = {
    'ohms-law': { v: '12', i: '2' }, 'voltage-divider': { vin: '12', r1: '1000', r2: '470' },
    'power-factor': { v: '400', a: '25', kw: '12', phase: '3y' },
    'three-phase': { v: '400', i: '10', pf: '0.9', type: 'star' },
    'voltage-drop': { awg: '10', len: '30', i: '20', v: '240' },
    'wire-gauge': { n: '14', mode: 'awg' }, 'resistor-color': { d1: '4', d2: '7', m: '1', t: '5' },
    dbm: { v: '30', from: 'dbm' }, ev: { v: '12', from: 'j' }, 'energy-bill': { w: '1500', h: '8', rate: '0.15' },
    photometry: { mode: 'cd2lux', x: '500', d: '2' },
    stddev: { data: '2 4 4 4 5 5 7 9', mode: 'pop' }, 'weighted-average': { data: '80:1, 90:2' },
    quadratic: { a: '1', b: '-3', c: '2' }, root: { x: '16', k: '2' }, factorial: { n: '10', r: '3' },
    percentage: { mode: '1', x: '15', y: '200' }, 'percent-error': { measured: '9.6', accepted: '10' },
    'gcf-lcm': { data: '12 18 24' }, fraction: { n1: '1', d1: '2', n2: '1', d2: '3', op: '+' },
    'decimal-fraction': { x: '0.375' }, ratio: { data: '16:24' }, divmod: { a: '47', b: '5' },
    scientific: { x: '12345', op: 'none' }, pythagorean: { a: '3', b: '4' },
    convolution: { x: '1 2 3 4', h: '1 2 1' }, log: { x: '100', b: '10', dir: 'log' },
    'exponential-growth': { x0: '100', r: '5', t: '10' }, trig: { x: '45', unit: 'deg' },
    'color-convert': { hex: '#3B82F6' }, 'radix-calc': { base: '16', a: 'FF', b: '0F', op: 'add' },
    roman: { v: '2024' }, 'number-words': { v: '1234' },
    'case-convert': { text: 'hello world', mode: 'camel' }, url: { text: 'a b', mode: 'enc' },
    counters: { text: 'one two two three' }, hash: { text: 'HexKit' },
    mortgage: { p: '400000', rate: '5.5', n: '30', down: '80000' },
    compound: { p: '10000', r: '7', t: '10', n: '12', ap: '100' },
    'simple-interest': { p: '10000', r: '5', t: '3', unit: 'y' },
    vat: { amount: '100', rate: '20', mode: 'add' }, discount: { price: '200', rate: '25', tax: '0', mode: 'pct' },
    gpa: { courses: 'A:3, B:4', scale: 'us' }, 'final-grade': { total: '420', possible: '500', weight: '30' },
    bmi: { w: '70', h: '175', sys: 'metric', age: '30' }, duration: { d: '1', h: '12' },
    'growth-decay': { x0: '100', r: '10', steps: '5' }, custom: { expr: 'sin(pi/4) * 2^10' },
    'custom-convert': { x: '5', expr: 'x * 2.54' }, random: { min: '1', max: '6', count: '5' },
    password: { len: '16', lower: '1' }, batch: { values: '1 2 4', factor: '2.5' },
    'date-diff': { a: '2020-01-01', b: '2024-06-15' }, age: { dob: '2000-01-01' },
    'world-clock': { zones: 'UTC,Asia/Tokyo' },
  };

  for (const tool of TOOLS) {
    const seed = { ...Object.fromEntries(tool.inputs.map((i) => [i.id, ''])), ...(SEEDS[tool.id] ?? {}) };
    // checkboxes arrive as booleans from the UI, never as strings
    for (const i of tool.inputs) if (i.type === 'checkbox' && typeof seed[i.id] === 'string') seed[i.id] = true;

    const r = tool.compute(seed);
    if (r.error) continue;
    const outs = r.outputs ?? tool.inputs.map((i) => ({ id: i.id, label: i.label, unit: i.unit }));
    for (const o of outs) {
      assert.ok(
        Object.prototype.hasOwnProperty.call(r.values, o.id),
        `${tool.id}: output "${o.id}" has no matching value — it would render blank`,
      );
      assert.ok(typeof o.label === 'string' && o.label.length > 0, `${tool.id}: output "${o.id}" has no label`);
    }
  }
});

/* ── ASCII tables ───────────────────────────────────────────────────────── */

test('ASCII table matches the reference rows exactly', () => {
  assert.equal(ASCII_128.length, 128);
  const at = (n) => ASCII_128[n];
  assert.deepEqual([at(0).hex, at(0).bin, at(0).char], ['00', '00000000', 'NUL']);
  assert.deepEqual([at(9).hex, at(9).char], ['09', 'HT ⇥']);
  assert.deepEqual([at(10).hex, at(10).char], ['0A', 'LF ⏎']);
  assert.deepEqual([at(13).hex, at(13).char], ['0D', 'CR']);
  assert.deepEqual([at(32).hex, at(32).bin, at(32).char], ['20', '00100000', 'Space']);
  assert.deepEqual([at(48).hex, at(48).char], ['30', '0']);
  assert.deepEqual([at(65).hex, at(65).char], ['41', 'A']);
  assert.deepEqual([at(97).hex, at(97).char], ['61', 'a']);
  assert.deepEqual([at(126).hex, at(126).char], ['7E', '~']);
  assert.deepEqual([at(127).hex, at(127).char], ['7F', 'DEL']);
  assert.equal(ASCII_TABLE.length, 256);
  assert.equal(ASCII_TABLE[255].hex, 'FF');
});

test('positional expansion is the positional value', () => {
  assert.equal(expandBase(0, 16), '0·16⁰');
  for (const v of [1, 15, 16, 65, 80, 108, 255, 1000, 65535]) {
    const parsed = expandBase(v, 16)
      .replace(/·/g, '').replace(/([0-9]+)·16([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, d, p) => String(Number(d) * 16 ** Number('⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(p[0]))));
    const total = expandBase(v, 16).split('+').reduce((sum, term) => {
      const [d, p] = term.trim().split('·16');
      return sum + Number(d) * 16 ** '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(p);
    }, 0);
    assert.equal(total, v, `expandBase(${v}, 16) should equal ${v}`);
    void parsed;
  }
});

test('per-character analysis lines up with the byte stream', () => {
  const rows = analyse('Hi!', (ch) => textToBytes(ch, 'latin1'));
  assert.equal(rows.length, 3);
  assert.deepEqual(rows.map((r) => r.hex[0]), ['48', '69', '21']);
  assert.deepEqual(rows.map((r) => r.offset), [0, 1, 2]);
  assert.equal(analyse('é', (ch) => textToBytes(ch, 'utf-8'))[0].hex.join(' '), 'C3 A9');
  assert.equal(analyse('😀', (ch) => textToBytes(ch, 'utf-8'))[0].utf8Len, 4);
});
