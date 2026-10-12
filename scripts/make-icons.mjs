#!/usr/bin/env node
/**
 * Generates the PNG icon set from icons/icon.svg using pure Node (no deps).
 * Rasterises a simplified version of the mark directly into a pixel buffer,
 * so the repo has no build tooling requirement for `npm run icons`.
 *
 * Usage: node scripts/make-icons.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'icons');
mkdirSync(outDir, { recursive: true });

/* ── minimal PNG encoder (RGBA, 8-bit, filter 0) ────────────────────────── */

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = c ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePNG(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ── the mark ───────────────────────────────────────────────────────────── */

const BG = [0x0a, 0x0c, 0x12];
const GRAD = [[0x4f, 0x8c, 0xff], [0x6d, 0x5c, 0xff], [0x00, 0xd4, 0xa0]];
const WHITE = [255, 255, 255];

const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

// 5×7 block font for the glyphs we draw ("0", "x", "2", "B")
const GLYPHS = {
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  x: ['00000', '10001', '01010', '00100', '01010', '10001', '00000'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
};

function roundedRectInside(x, y, size, inset, radius) {
  const lo = inset, hi = size - inset;
  if (x < lo || x > hi || y < lo || y > hi) return false;
  const cx = Math.min(Math.max(x, lo + radius), hi - radius);
  const cy = Math.min(Math.max(y, lo + radius), hi - radius);
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius * radius;
}

function render(size, { maskable = false } = {}) {
  const rgba = Buffer.alloc(size * size * 4);
  const inset = maskable ? size * 0.18 : 0;
  const radius = maskable ? size * 0.5 : size * 0.22;
  const text = '0x';
  const GLYPH_COLS = 5, ROWS = 7;

  // Square cells sized so the block always fits the canvas with margin.
  const usable = size - inset * 2;
  const blockCols = text.length * GLYPH_COLS;
  const cell = Math.floor(Math.min(usable * 0.86 / blockCols, (usable * 0.72) / ROWS));
  const blockW = blockCols * cell;
  const blockH = ROWS * cell;
  const originX = Math.round((size - blockW) / 2);
  const originY = Math.round((size - blockH) / 2);

  const glyphMask = new Uint8Array(size * size);
  for (let ci = 0; ci < text.length; ci++) {
    const glyph = GLYPHS[text[ci]];
    if (!glyph) continue;
    for (let gc = 0; gc < GLYPH_COLS; gc++) {
      for (let gy = 0; gy < ROWS; gy++) {
        if (glyph[gy][gc] !== '1') continue;
        for (let dy = 0; dy < cell; dy++) {
          const y = originY + gy * cell + dy;
          if (y < 0 || y >= size) continue;
          for (let dx = 0; dx < cell; dx++) {
            const x = originX + (ci * GLYPH_COLS + gc) * cell + dx;
            if (x < 0 || x >= size) continue;
            glyphMask[y * size + x] = 1;
          }
        }
      }
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const t = (x / size) * 0.5 + (y / size) * 0.5;
      const grad = t < 0.5 ? mix(GRAD[0], GRAD[1], t * 2) : mix(GRAD[1], GRAD[2], (t - 0.5) * 2);
      let [r, g, b] = BG;
      let a = maskable ? 255 : 0;

      if (roundedRectInside(x, y, size, inset, radius)) {
        [r, g, b] = grad;
        a = 255;
        if (glyphMask[y * size + x]) [r, g, b] = WHITE;
      } else if (maskable) {
        [r, g, b] = grad;
      }

      rgba[i] = r; rgba[i + 1] = g; rgba[i + 2] = b; rgba[i + 3] = a;
    }
  }
  return encodePNG(size, size, rgba);
}

const targets = [
  ['icon-192.png', 192, {}],
  ['icon-512.png', 512, {}],
  ['icon-180.png', 180, {}],
  ['icon-maskable-512.png', 512, { maskable: true }],
];

for (const [name, size, opts] of targets) {
  writeFileSync(join(outDir, name), render(size, opts));
  console.log(`wrote icons/${name} (${size}×${size}${opts.maskable ? ', maskable' : ''})`);
}
