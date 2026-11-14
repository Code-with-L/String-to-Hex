#!/usr/bin/env node
/**
 * Open Graph / Twitter card image, 1200×630, written as a PNG with the same
 * dependency-free encoder used for the app icons. No canvas, no native deps.
 *
 * Text is drawn from a built-in 5×7 pixel font so the result is deterministic
 * and needs no font files.
 */

import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ── PNG encoder ───────────────────────────────────────────────────────── */

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = c ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
function encodePNG(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ── 5×7 pixel font ────────────────────────────────────────────────────── */

const F = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  0: ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  3: ['11111', '00010', '00100', '00010', '00001', '10001', '01110'],
  4: ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  5: ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  6: ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  9: ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  x: ['00000', '10001', '01010', '00100', '01010', '10001', '00000'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '01100', '01100'],
  ',': ['00000', '00000', '00000', '00000', '01100', '00100', '01000'],
  ':': ['00000', '01100', '01100', '00000', '01100', '01100', '00000'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  '&': ['01100', '10010', '10100', '01000', '10101', '10010', '01101'],
  '—': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  '=': ['00000', '00000', '11111', '00000', '11111', '00000', '00000'],
  '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
  '(': ['00010', '00100', '01000', '01000', '01000', '00100', '00010'],
  ')': ['01000', '00100', '00010', '00010', '00010', '00100', '01000'],
  '|': ['00100', '00100', '00100', '00100', '00100', '00100', '00100'],
  '<': ['00010', '00100', '01000', '10000', '01000', '00100', '00010'],
  '>': ['01000', '00100', '00010', '00001', '00010', '00100', '01000'],
  '→': ['00000', '00100', '00010', '11111', '00010', '00100', '00000'],
  '⇄': ['00000', '01001', '00110', '11111', '00110', '01001', '00000'],
  '°': ['01100', '10010', '01100', '00000', '00000', '00000', '00000'],
  '·': ['00000', '00000', '00000', '01100', '01100', '00000', '00000'],
  '⚡': ['00000', '00100', '01110', '00100', '01110', '01000', '00000'],
};

const missing = new Set();

function drawText(buf, W, H, text, x, y, scale, rgb) {
  let cx = x;
  for (const raw of String(text)) {
    const ch = raw.toUpperCase();
    const glyph = F[ch];
    if (!glyph) { if (raw.trim()) missing.add(raw); cx += 6 * scale; continue; }
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 5; c++) {
        if (glyph[r][c] !== '1') continue;
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            const px = cx + c * scale + dx;
            const py = y + r * scale + dy;
            if (px < 0 || py < 0 || px >= W || py >= H) continue;
            const i = (py * W + px) * 4;
            buf[i] = rgb[0]; buf[i + 1] = rgb[1]; buf[i + 2] = rgb[2]; buf[i + 3] = 255;
          }
        }
      }
    }
    cx += 6 * scale;
  }
  return cx;
}

const textWidth = (t, s) => String(t).length * 6 * s - s;

/* ── compose ───────────────────────────────────────────────────────────── */

const W = 1200, H = 630;
const buf = Buffer.alloc(W * H * 4);

const BG = [0x0a, 0x0b, 0x0c];
const PANEL = [0x14, 0x16, 0x19];
const LINE = [0x26, 0x2b, 0x31];
const SIGNAL = [0xff, 0xb6, 0x48];
const DATA = [0x58, 0xe2, 0xc4];
const INK = [0xed, 0xf0, 0xf3];
const DIM = [0x8a, 0x93, 0xa0];

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    // schematic grid
    const onGrid = x % 40 === 0 || y % 40 === 0;
    let c = onGrid ? LINE : BG;
    // corner glow
    const dx = (x - W * 0.86) / 420, dy = (y - H * 0.1) / 300;
    const glow = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
    const g2 = Math.max(0, 1 - Math.sqrt(((x - W * 0.08) / 380) ** 2 + ((y - H * 0.9) / 300) ** 2));
    for (let k = 0; k < 3; k++) {
      let v = c[k];
      v += (SIGNAL[k] - v) * glow * 0.13;
      v += (DATA[k] - v) * g2 * 0.08;
      buf[i + k] = Math.round(Math.max(0, Math.min(255, v)));
    }
    buf[i + 3] = 255;
  }
}

/* header mark */
{
  const mx = 64, my = 52, ms = 4;
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 5; c++) {
      if (F['0'][r][c] !== '1') continue;
      for (let dy = 0; dy < ms; dy++) {
        for (let dx = 0; dx < ms; dx++) {
          const px = mx + c * ms + dx, py = my + r * ms + dy;
          const i = (py * W + px) * 4;
          buf[i] = SIGNAL[0]; buf[i + 1] = SIGNAL[1]; buf[i + 2] = SIGNAL[2];
        }
      }
    }
  }
  let cx = mx + 5 * ms + 16;
  drawText(buf, W, H, 'x', cx, my, ms, SIGNAL);
  drawText(buf, W, H, 'HEXKIT', cx + 6 * ms + 20, my + 6, 3, INK);
  drawText(buf, W, H, 'CONVERTERS & CALCULATORS', cx + 6 * ms + 20, my + 6 + 26, 2, DIM);
}

/* headline */
drawText(buf, W, H, 'STRING TO HEX,', 64, 168, 9, INK);
drawText(buf, W, H, 'AND EVERY OTHER BASE', 64, 244, 9, SIGNAL);

/* example card */
{
  const px = 64, py = 356, pw = W - 128, ph = 176;
  for (let y = py; y < py + ph; y++) {
    for (let x = px; x < px + pw; x++) {
      const i = (y * W + x) * 4;
      const edge = x < px + 2 || x >= px + pw - 2 || y < py + 2 || y >= py + ph - 2;
      const accent = x >= px && x < px + 3;
      const c = accent ? SIGNAL : edge ? LINE : PANEL;
      buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2];
    }
  }
  drawText(buf, W, H, 'INPUT — TEXT', px + 28, py + 24, 2, DIM);
  drawText(buf, W, H, 'Plant trees', px + 28, py + 48, 4, INK);
  drawText(buf, W, H, 'OUTPUT — HEXADECIMAL', px + 28, py + 100, 2, DIM);
  drawText(buf, W, H, '50 6C 61 6E 74 20 74 72 65 65 73', px + 28, py + 124, 4, DATA);
}

/* footer stats */
{
  const stats = [['60', 'CALCULATORS'], ['24', 'UNIT FAMILIES'], ['42', 'ENCODINGS'], ['36', 'FORMAT PAIRS']];
  let x = 64;
  const y = 566;
  for (const [n, label] of stats) {
    drawText(buf, W, H, n, x, y, 5, SIGNAL);
    drawText(buf, W, H, label, x + textWidth(n, 5) + 14, y + 12, 2, DIM);
    x += textWidth(n, 5) + textWidth(label, 2) + 52;
  }
}

if (missing.size) console.warn('missing glyphs:', [...missing].join(' '));

writeFileSync(join(root, 'icons', 'og.png'), encodePNG(W, H, buf));
console.log('wrote icons/og.png (1200x630)');