/**
 * ASCII / code-point reference data — generated, not hand-typed.
 * The control-character names match the reference site's ASCII table exactly.
 */

const CTRL_NAMES = ['NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL', 'BS', 'HT', 'LF', 'VT',
  'FF', 'CR', 'SO', 'SI', 'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB', 'CAN',
  'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US'];

const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export const sup = (k) => String(k).split('').map((c) => SUP[c] ?? c).join('');

/** Positional expansion: 65 = 4·16¹ + 1·16⁰ */
export function expandBase(value, base) {
  if (value === 0) return `0·${base}⁰`;
  const parts = [];
  let v = value, p = 0;
  while (v > 0) { parts.push(`${v % base}·${base}${sup(p)}`); v = Math.floor(v / base); p++; }
  return parts.reverse().join(' + ');
}

export function charLabel(cp) {
  if (cp === 0) return 'NUL';
  if (cp === 32) return 'Space';
  if (cp === 127) return 'DEL';
  if (cp === 10) return 'LF ⏎';
  if (cp === 9) return 'HT ⇥';
  if (cp === 13) return 'CR';
  if (cp < 32) return CTRL_NAMES[cp];
  if (cp > 126 && cp < 160) return `C1 ${cp - 128}`;
  return String.fromCodePoint(cp);
}

/** Full 0–255 table used by the ASCII reference page. */
export const ASCII_TABLE = Array.from({ length: 256 }, (_, cp) => ({
  cp,
  char: charLabel(cp),
  printable: cp >= 32 && cp < 127,
  dec: cp,
  hex: cp.toString(16).toUpperCase().padStart(2, '0'),
  bin: cp.toString(2).padStart(8, '0'),
  oct: cp.toString(8).padStart(3, '0'),
}));

/** 128-row ASCII block, matching the reference site's table exactly. */
export const ASCII_128 = ASCII_TABLE.slice(0, 128);

/** Per-character analysis for the breakdown panel. */
export function analyse(text, encode) {
  const rows = [];
  const s = String(text ?? '');
  let offset = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    const bytes = Array.from(encode(ch));
    const dec = bytes.map((b) => b.toString(16).toUpperCase().padStart(2, '0'));
    const shown = cp <= 0xff ? cp : cp % 256;
    rows.push({
      char: charLabel(cp),
      glyph: ch,
      cp,
      bytes,
      hex: dec,
      bin: bytes.map((b) => b.toString(2).padStart(8, '0')),
      decList: bytes.join(' '),
      offset,
      hexMath: expandBase(shown, 16),
      binMath: expandBase(shown, 2),
      utf8Len: bytes.length,
    });
    offset += bytes.length;
  }
  return rows;
}

export const UTF8_EXAMPLES = [
  { text: 'A', bytes: 1 }, { text: 'Hello', bytes: 5 },
  { text: 'é', bytes: 2 }, { text: 'ü', bytes: 2 },
  { text: '€', bytes: 3 }, { text: '→', bytes: 3 },
  { text: '中', bytes: 3 }, { text: '😀', bytes: 4 },
];
