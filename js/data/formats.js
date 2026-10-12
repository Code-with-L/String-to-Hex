/**
 * Base/number-format engine — arbitrary precision via BigInt.
 *
 * Reference behaviour preserved from the original site:
 *   text → hex : per code point, `(cp).toString(16).padStart(2,'0')`, UPPER, delimiter
 *   hex  → text: strip everything that is not a hex digit, pair up, parseInt(..,16),
 *                  String.fromCodePoint(.)
 * Extended (new): Binary / Decimal / Octal / Base64, `0x` `0b` prefixes,
 * separators, strict validation, and no silent truncation for huge inputs.
 */

export const FORMATS = [
  { id: 'text',   label: 'Text',        kind: 'text' },
  { id: 'hex',    label: 'Hexadecimal', kind: 'bytes' },
  { id: 'bin',    label: 'Binary',      kind: 'bytes' },
  { id: 'dec',    label: 'Decimal',     kind: 'bytes' },
  { id: 'oct',    label: 'Octal',       kind: 'bytes' },
  { id: 'base64', label: 'Base64',      kind: 'bytes' },
];

const B62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const B62I = (() => { const m = new Map(); for (let i = 0; i < B62.length; i++) m.set(B62[i], i); return m; })();

/* ── charset support ─────────────────────────────────────────────────────── */

/**
 * Support probe.
 *
 * `TextEncoder` only ever encodes UTF-8 — it throws for any other label — so
 * probing it says nothing about legacy-charset support. The API that actually
 * implements them is `TextDecoder`, and a `fatal: true` decoder only
 * constructs for a label the engine really knows. Legacy charsets are encoded
 * here by decoding single code units (see `textToBytes`).
 */
const NATIVE_ENCODINGS = new Set(['utf-8']);
for (const label of ['utf-16le', 'utf-16be', 'ibm866', 'iso-8859-1', 'iso-8859-2', 'iso-8859-3',
  'iso-8859-4', 'iso-8859-5', 'iso-8859-6', 'iso-8859-7', 'iso-8859-8', 'iso-8859-8-i', 'iso-8859-10',
  'iso-8859-13', 'iso-8859-14', 'iso-8859-15', 'iso-8859-16', 'koi8-r', 'koi8-u', 'macintosh',
  'windows-874', 'windows-1250', 'windows-1251', 'windows-1252', 'windows-1253', 'windows-1254',
  'windows-1255', 'windows-1256', 'windows-1257', 'windows-1258', 'x-mac-cyrillic', 'x-user-defined',
  'big5', 'euc-jp', 'euc-kr', 'gb18030', 'gb2312', 'hz-gb-2312', 'iso-2022-jp', 'shift_jis']) {
  try {
    new TextDecoder(label, { fatal: true });
    NATIVE_ENCODINGS.add(label);
  } catch { /* not implemented by this engine */ }
}

/**
 * Every charset the original dropdown offered, plus the three pseudo-modes.
 * `enc` is what gets handed to TextEncoder/TextDecoder; null means
 * "code point / Latin-1 style" handling done by hand.
 */
export const ENCODINGS = [
  { id: 'codepoint', label: 'Unicode code point', enc: null, bytes: 'variable', note: 'One value per character, UTF-32 style. Emoji-safe.' },
  { id: 'latin1',    label: 'Latin-1 / ISO-8859-1', enc: 'iso-8859-1', bytes: '1', note: '1 byte per character, 0–255 only.' },
  { id: 'utf-8',     label: 'UTF-8', enc: 'utf-8', bytes: '1–4', note: 'The web default. Variable length.' },
  { id: 'utf-16le',  label: 'UTF-16 little endian', enc: 'utf-16le', bytes: '2', note: '2 bytes per character.' },
  { id: 'utf-16be',  label: 'UTF-16 big endian', enc: 'utf-16be', bytes: '2', note: '2 bytes per character.' },
  { id: 'ascii',     label: 'ASCII (7-bit)', enc: null, bytes: '1', note: 'High bit stripped — matches the original tool.' },
  { id: 'windows-1252', label: 'Windows-1252 (Western)', enc: 'windows-1252', bytes: '1' },
  { id: 'windows-1251', label: 'Windows-1251 (Cyrillic)', enc: 'windows-1251', bytes: '1' },
  { id: 'windows-1250', label: 'Windows-1250 (East Europe)', enc: 'windows-1250', bytes: '1' },
  { id: 'windows-1253', label: 'Windows-1253 (Greek)', enc: 'windows-1253', bytes: '1' },
  { id: 'windows-1254', label: 'Windows-1254 (Turkish)', enc: 'windows-1254', bytes: '1' },
  { id: 'windows-1255', label: 'Windows-1255 (Hebrew)', enc: 'windows-1255', bytes: '1' },
  { id: 'windows-1256', label: 'Windows-1256 (Arabic)', enc: 'windows-1256', bytes: '1' },
  { id: 'windows-1257', label: 'Windows-1257 (Baltic)', enc: 'windows-1257', bytes: '1' },
  { id: 'windows-1258', label: 'Windows-1258 (Vietnamese)', enc: 'windows-1258', bytes: '1' },
  { id: 'windows-874',  label: 'Windows-874 (Thai)', enc: 'windows-874', bytes: '1' },
  { id: 'iso-8859-2', label: 'ISO-8859-2 (Latin2)', enc: 'iso-8859-2', bytes: '1' },
  { id: 'iso-8859-3', label: 'ISO-8859-3 (Latin3)', enc: 'iso-8859-3', bytes: '1' },
  { id: 'iso-8859-4', label: 'ISO-8859-4 (Latin4)', enc: 'iso-8859-4', bytes: '1' },
  { id: 'iso-8859-5', label: 'ISO-8859-5 (Cyrillic)', enc: 'iso-8859-5', bytes: '1' },
  { id: 'iso-8859-6', label: 'ISO-8859-6 (Arabic)', enc: 'iso-8859-6', bytes: '1' },
  { id: 'iso-8859-7', label: 'ISO-8859-7 (Greek)', enc: 'iso-8859-7', bytes: '1' },
  { id: 'iso-8859-8', label: 'ISO-8859-8 (Hebrew)', enc: 'iso-8859-8', bytes: '1' },
  { id: 'iso-8859-13', label: 'ISO-8859-13 (Latin7)', enc: 'iso-8859-13', bytes: '1' },
  { id: 'iso-8859-14', label: 'ISO-8859-14 (Latin8)', enc: 'iso-8859-14', bytes: '1' },
  { id: 'iso-8859-15', label: 'ISO-8859-15 (Latin9)', enc: 'iso-8859-15', bytes: '1' },
  { id: 'iso-8859-16', label: 'ISO-8859-16 (Latin10)', enc: 'iso-8859-16', bytes: '1' },
  { id: 'big5',    label: 'Big5 (Chinese)', enc: 'big5', bytes: '1–2' },
  { id: 'euc-jp',  label: 'EUC-JP (Japanese)', enc: 'euc-jp', bytes: '1–3' },
  { id: 'euc-kr',  label: 'EUC-KR (Korean)', enc: 'euc-kr', bytes: '1–2' },
  { id: 'gb18030', label: 'GB 18030 (Chinese)', enc: 'gb18030', bytes: '1–4' },
  { id: 'gb2312',  label: 'GB 2312 (Chinese)', enc: 'gb2312', bytes: '1–2' },
  { id: 'hz-gb-2312', label: 'HZ-GB-2312 (Chinese)', enc: 'hz-gb-2312', bytes: '1–2' },
  { id: 'iso-2022-jp', label: 'ISO-2022-JP (Japanese)', enc: 'iso-2022-jp', bytes: '1–4' },
  { id: 'iso-2022-cn', label: 'ISO-2022-CN (Chinese)', enc: 'replacement', bytes: '1–4', note: 'Replaced with � — ISO-2022-CN is not implemented by browsers.' },
  { id: 'shift_jis', label: 'Shift JIS (Japanese)', enc: 'shift_jis', bytes: '1–2' },
  { id: 'cp866',   label: 'CP866 (Russian)', enc: 'ibm866', bytes: '1' },
  { id: 'koi8-r',  label: 'KOI8-R (Russian)', enc: 'koi8-r', bytes: '1' },
  { id: 'koi8-u',  label: 'KOI8-U (Ukrainian)', enc: 'koi8-u', bytes: '1' },
  { id: 'macintosh', label: 'Macintosh (x-mac-roman)', enc: 'macintosh', bytes: '1' },
  { id: 'x-mac-cyrillic', label: 'Mac OS Cyrillic', enc: 'x-mac-cyrillic', bytes: '1' },
  { id: 'x-user-defined', label: 'X-User-Defined', enc: 'x-user-defined', bytes: '1' },
];

export const encodingSupported = (id) => {
  const e = ENCODINGS.find((x) => x.id === id);
  if (!e) return false;
  if (e.enc === null) return true;
  return NATIVE_ENCODINGS.has(e.enc);
};

/* ── text ⇄ bytes ────────────────────────────────────────────────────────── */

/** Encode a string to bytes. `encoding` is an ENCODINGS id. */
export function textToBytes(text, encoding = 'utf-8') {
  const s = String(text ?? '');
  const e = ENCODINGS.find((x) => x.id === encoding) ?? ENCODINGS[2];
  if (e.id === 'codepoint') {
    const out = [];
    for (const ch of s) out.push(...codePointToBytes(ch.codePointAt(0)));
    return Uint8Array.from(out);
  }
  if (e.id === 'latin1') {
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff;
    return out;
  }
  if (e.id === 'ascii') {
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0x7f;
    return out;
  }
  if (e.enc === 'utf-8') return new TextEncoder().encode(s);
  if (encodingSupported(encoding)) {
    if (e.enc === 'utf-16le' || e.enc === 'utf-16be') {
      // UTF-16 needs both bytes of every code unit, so it must be handled
      // before the single-byte legacy path below.
      const out = new Uint8Array(s.length * 2);
      for (let i = 0; i < s.length; i++) {
        const unit = s.charCodeAt(i);
        out[i * 2] = e.enc === 'utf-16le' ? unit & 0xff : (unit >> 8) & 0xff;
        out[i * 2 + 1] = e.enc === 'utf-16le' ? (unit >> 8) & 0xff : unit & 0xff;
      }
      return out;
    }
    // Legacy 8-bit charsets. A single byte only encodes a code unit if
    // decoding it gives that same unit back — which is exactly the identity
    // we need, and it is not true for the Windows-1252 0x80–0x9F block, where
    // those bytes decode to characters such as '€' that have no 1-byte form.
    const out = [];
    let decoder;
    try { decoder = new TextDecoder(e.enc, { fatal: true }); } catch { decoder = null; }
    for (let i = 0; i < s.length; i++) {
      const unit = s.charCodeAt(i);
      if (unit <= 0xff && decoder) {
        let roundTrips = false;
        try {
          const decoded = decoder.decode(new Uint8Array([unit]));
          roundTrips = decoded.length === 1 && decoded.charCodeAt(0) === unit;
        } catch { roundTrips = false; }
        out.push(roundTrips ? unit : 0x3f); // '?' like iconv
        continue;
      }
      out.push(...codePointToBytes(String.fromCharCode(unit).codePointAt(0)));
    }
    return Uint8Array.from(out);
  }
  return new TextEncoder().encode(s);
}

/** Decode bytes to a string. Mirrors the original: lenient (replacement chars). */
export function bytesToText(bytes, encoding = 'utf-8') {
  const b = bytes instanceof Uint8Array ? bytes : Uint8Array.from(bytes || []);
  const e = ENCODINGS.find((x) => x.id === encoding) ?? ENCODINGS[2];
  if (e.id === 'codepoint') {
    let s = '';
    let i = 0;
    const width = s ? 0 : 0; void width;
    while (i < b.length) {
      const len = b[i] <= 0x7f ? 1 : b[i] <= 0xdf ? 2 : b[i] <= 0xef ? 3 : b[i] <= 0xf7 ? 4 : 1;
      let cp = b[i] & (len === 1 ? 0x7f : len === 2 ? 0x1f : len === 3 ? 0x0f : 0x07);
      for (let k = 1; k < len && i + k < b.length; k++) cp = (cp << 6) | (b[i + k] & 0x3f);
      if (cp > 0x10ffff) cp = 0xfffd;
      s += String.fromCodePoint(cp);
      i += len;
    }
    return s;
  }
  if (e.id === 'latin1') return Array.from(b, (x) => String.fromCharCode(x)).join('');
  if (e.id === 'ascii') return Array.from(b, (x) => String.fromCharCode(x & 0x7f)).join('');
  if (encodingSupported(encoding)) {
    try { return new TextDecoder(e.enc, { fatal: false }).decode(b); } catch { /* fall through */ }
  }
  return new TextDecoder().decode(b);
}

export function codePointToBytes(cp) {
  if (cp < 0x80) return [cp];
  if (cp < 0x800) return [0xc0 | (cp >> 6), 0x80 | (cp & 0x3f)];
  if (cp < 0x10000) return [0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f)];
  return [0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f)];
}

/* ── bytes ⇄ formatted strings ───────────────────────────────────────────── */

export const DELIMS = [
  { id: 'space', label: 'Space', value: ' ' },
  { id: 'none',  label: 'None', value: '' },
  { id: 'comma', label: 'Comma', value: ', ' },
  { id: 'colon', label: 'Colon', value: ':' },
  { id: 'dash',  label: 'Dash', value: '-' },
  { id: 'newline', label: 'Line break', value: '\n' },
];

const padHex = (b) => b.toString(16).toUpperCase().padStart(2, '0');

export function bytesToHex(bytes, { delimiter = ' ', prefix = '' } = {}) {
  return Array.from(bytes, (b) => prefix + padHex(b)).join(delimiter);
}

export function bytesToBin(bytes, { delimiter = ' ', prefix = '' } = {}) {
  return Array.from(bytes, (b) => prefix + b.toString(2).padStart(8, '0')).join(delimiter);
}

export function bytesToDec(bytes, { delimiter = ' ' } = {}) {
  return Array.from(bytes, (b) => String(b)).join(delimiter);
}

export function bytesToOct(bytes, { delimiter = ' ' } = {}) {
  return Array.from(bytes, (b) => b.toString(8).padStart(3, '0')).join(delimiter);
}

export function bytesToBase64(bytes) {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i], b1 = bytes[i + 1], b2 = bytes[i + 2];
    out += B62[b0 >> 2];
    out += B62[((b0 & 3) << 4) | ((b1 ?? 0) >> 4)];
    out += b1 === undefined ? '=' : B62[((b1 & 15) << 2) | ((b2 ?? 0) >> 6)];
    out += b2 === undefined ? '=' : B62[b2 & 63];
  }
  return out;
}

export function base64ToBytes(input) {
  const s = String(input ?? '').replace(/\s+/g, '');
  if (!s) return new Uint8Array(0);
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s) || s.length % 4 !== 0) {
    throw new Error('Invalid Base64: use A–Z a–z 0–9 + / with length a multiple of 4 and "=" padding.');
  }
  const out = new Uint8Array((s.length / 4) * 3 - (s.endsWith('==') ? 2 : s.endsWith('=') ? 1 : 0));
  let o = 0;
  for (let i = 0; i < s.length; i += 4) {
    const n = (B62I.get(s[i]) << 18) | (B62I.get(s[i + 1]) << 12) |
      ((s[i + 2] === '=' ? 0 : B62I.get(s[i + 2])) << 6) | (s[i + 3] === '=' ? 0 : B62I.get(s[i + 3]));
    if (o < out.length) out[o++] = (n >> 16) & 0xff;
    if (o < out.length) out[o++] = (n >> 8) & 0xff;
    if (o < out.length) out[o++] = n & 0xff;
  }
  return out;
}

/** Parse hex with any prefix / postfix / delimiter (reference behaviour). */
export function hexToBytes(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return new Uint8Array(0);
  const stripped = raw.replace(/0[xX]/g, '').replace(/\\x/gi, '').replace(/%/g, '');
  const digits = (stripped.match(/[0-9a-fA-F]/g) || []).join('');
  if (!digits) throw new Error('No hex digits (0–9, a–f) found.');
  if (digits.length % 2 !== 0) {
    throw new Error(`Odd number of hex digits (${digits.length}). Bytes come in pairs — e.g. "4" should be "04", or "4 1" should be "41".`);
  }
  const out = new Uint8Array(digits.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(digits.substr(i * 2, 2), 16);
  return out;
}

export function binToBytes(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return new Uint8Array(0);
  const stripped = raw.replace(/0[bB]/g, '');
  const groups = stripped.match(/[01]+/g) || [];
  if (!groups.length) throw new Error('No binary digits (0/1) found.');
  const hasSeparators = /[^01]/.test(stripped);
  const digits = groups.join('');
  const out = [];
  if (hasSeparators && groups.every((g) => g.length === 8)) {
    for (const g of groups) out.push(parseInt(g, 2));
  } else {
    if (digits.length % 8 !== 0) {
      throw new Error(`${digits.length} bits is not a multiple of 8. Group into bytes, or pad with leading zeros.`);
    }
    for (let i = 0; i < digits.length; i += 8) out.push(parseInt(digits.substr(i, 8), 2));
  }
  return Uint8Array.from(out);
}

export function decToBytes(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return new Uint8Array(0);
  const hasSeparators = /[^\d]/.test(raw);
  const parts = hasSeparators ? raw.split(/[^\d]+/).filter(Boolean) : raw.match(/\d{3}|\d{1,3}/g) || [];
  if (!parts.length) throw new Error('No decimal digits found.');
  return Uint8Array.from(parts.map((p, i) => {
    const v = Number(p);
    if (!Number.isInteger(v) || v < 0 || v > 255) throw new Error(`"${p}" (item ${i + 1}) is not a byte — expected 0–255.`);
    return v;
  }));
}

export function octToBytes(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return new Uint8Array(0);
  const hasSeparators = /[^0-7]/.test(raw);
  const parts = hasSeparators ? raw.split(/[^0-7]+/).filter(Boolean) : raw.match(/[0-7]{3}|[0-7]{1,3}/g) || [];
  if (!parts.length) throw new Error('No octal digits (0–7) found.');
  return Uint8Array.from(parts.map((p, i) => {
    const v = parseInt(p, 8);
    if (Number.isNaN(v) || v < 0 || v > 255) throw new Error(`"${p}" (item ${i + 1}) is not an octal byte — expected 000–377.`);
    return v;
  }));
}

/* ── universal matrix ────────────────────────────────────────────────────── */

export function toBytes(format, input, encoding = 'utf-8') {
  switch (format) {
    case 'text': return textToBytes(input, encoding);
    case 'hex': return hexToBytes(input);
    case 'bin': return binToBytes(input);
    case 'dec': return decToBytes(input);
    case 'oct': return octToBytes(input);
    case 'base64': return base64ToBytes(input);
    default: throw new Error(`Unknown format "${format}".`);
  }
}

export function fromBytes(format, bytes, opts = {}) {
  switch (format) {
    case 'text': return bytesToText(bytes, opts.encoding ?? 'utf-8');
    case 'hex': return bytesToHex(bytes, opts);
    case 'bin': return bytesToBin(bytes, opts);
    case 'dec': return bytesToDec(bytes, opts);
    case 'oct': return bytesToOct(bytes, opts);
    case 'base64': return bytesToBase64(bytes);
    default: throw new Error(`Unknown format "${format}".`);
  }
}

export function convertFormat(from, to, input, opts = {}) {
  if (from === to) return String(input ?? '');
  return fromBytes(to, toBytes(from, input, opts.encoding), opts);
}

/* ── arbitrary-precision integer base conversion ─────────────────────────── */

const BASES = { bin: 2, oct: 8, dec: 10, hex: 16 };

export function parseBigInBase(str, base) {
  let s = String(str ?? '').trim().replace(/^\+/, '');
  let neg = false;
  if (s.startsWith('-')) { neg = true; s = s.slice(1); }
  s = s.replace(/^0[xXbBoO]/, '').replace(/[\s,_]/g, '');
  if (!s) return null;
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'.slice(0, base);
  if (!new RegExp(`^[${alphabet}]+$`, 'i').test(s)) return null;
  let v = 0n;
  const B = BigInt(base);
  // Index into the base's own alphabet — parsing as hex would misread g…z.
  for (const ch of s.toLowerCase()) v = v * B + BigInt(alphabet.indexOf(ch));
  return neg ? -v : v;
}

export function bigToBase(value, base) {
  const neg = value < 0n;
  let v = neg ? -value : value;
  if (v === 0n) return '0';
  const B = BigInt(base);
  let out = '';
  while (v > 0n) { out = '0123456789abcdefghijklmnopqrstuvwxyz'[Number(v % B)] + out; v /= B; }
  return neg ? '-' + out : out;
}

/* ── checksums & two's complement (new) ───────────────────────────────────── */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

/** CRC-8/ATM — polynomial 0x07, init 0x00. Check value for "123456789" is 0xF4. */
const CRC8_TABLE = (() => {
  const t = new Uint8Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 0x80 ? ((c << 1) ^ 0x07) & 0xff : (c << 1) & 0xff;
    t[n] = c;
  }
  return t;
})();

export function crc8(bytes) {
  let c = 0;
  for (const b of bytes) c = CRC8_TABLE[(c ^ b) & 0xff];
  return c.toString(16).toUpperCase().padStart(2, '0');
}

export function crc16(bytes) {
  let c = 0xffff;
  for (const b of bytes) {
    c ^= b << 8;
    for (let i = 0; i < 8; i++) c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xffff : (c << 1) & 0xffff;
  }
  return (c & 0xffff).toString(16).toUpperCase().padStart(4, '0');
}

export function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return ((c ^ 0xffffffff) >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

export function sum8(bytes) {
  return bytes.reduce((a, b) => (a + b) & 0xff, 0);
}

export function sum16(bytes) {
  return bytes.reduce((a, b) => (a + b) & 0xffff, 0);
}

export function xorAll(bytes) {
  return bytes.reduce((a, b) => a ^ b, 0);
}

/** Two's complement over a 1/2/4/8-byte width. */
export function twosComplement(bytes, widthBytes = 8) {
  const v = bytesToBigInt(bytes);
  const bits = BigInt(widthBytes) * 8n;
  const mod = 1n << bits;
  return v >= (mod >> 1n) ? v - mod : v;
}

export function bytesToBigInt(bytes) {
  let v = 0n;
  for (const b of bytes) v = (v << 8n) | BigInt(b);
  return v;
}

export function bigIntToBytes(v, widthBytes = null) {
  let x = v < 0n ? (1n << BigInt((widthBytes || 8) * 8)) + v : v;
  if (x < 0n) x = 0n;
  let hex = x.toString(16);
  if (hex.length % 2) hex = '0' + hex;
  const out = hexToBytes(hex);
  if (widthBytes && out.length < widthBytes) {
    const pad = new Uint8Array(widthBytes);
    pad.set(out, widthBytes - out.length);
    return pad;
  }
  return out;
}

export const CHECKSUMS = [
  { id: 'sum8',  label: 'Sum-8',  fn: (b) => sum8(b).toString(16).toUpperCase().padStart(2, '0'), width: 2 },
  { id: 'sum16', label: 'Sum-16', fn: (b) => sum16(b).toString(16).toUpperCase().padStart(4, '0'), width: 4 },
  { id: 'xor',   label: 'XOR',    fn: (b) => xorAll(b).toString(16).toUpperCase().padStart(2, '0'), width: 2 },
  { id: 'crc8',  label: 'CRC-8',  fn: crc8, width: 2 },
  { id: 'crc16', label: 'CRC-16/CCITT', fn: crc16, width: 4 },
  { id: 'crc32', label: 'CRC-32', fn: crc32, width: 8 },
];
