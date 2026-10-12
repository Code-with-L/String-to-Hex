#!/usr/bin/env node
/**
 * Zero-dependency static server for local development.
 * A real HTTP server is required — service workers do not register from
 * file:// URLs, so `npm start` is the way to test install/offline behaviour.
 *
 *   npm start            → http://localhost:5173
 *   PORT=8080 npm start
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, sep } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT) || 5173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith('/')) rel += 'index.html';

    // Contain every request inside the project root.
    const target = normalize(join(root, rel));
    if (!target.startsWith(root + sep) && target !== root) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    let info;
    try {
      info = await stat(target);
    } catch {
      // Unknown path with no extension → let the SPA handle it.
      if (!extname(target)) {
        res.writeHead(200, { 'Content-Type': TYPES['.html'] });
        res.end(await readFile(join(root, 'index.html')));
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
      return;
    }
    if (info.isDirectory()) {
      res.writeHead(302, { Location: `${rel.replace(/\/?$/, '')}/index.html` }).end();
      return;
    }

    const body = await readFile(target);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(target).toLowerCase()] ?? 'application/octet-stream',
      'Content-Length': body.length,
      // Never cache during development, or the service worker hides edits.
      'Cache-Control': 'no-store',
      'Service-Worker-Allowed': '/',
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' }).end(String(err));
  }
});

server.listen(port, () => {
  console.log(`HexKit dev server → http://localhost:${port}`);
  console.log('Press Ctrl+C to stop.');
});
