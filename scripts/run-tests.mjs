#!/usr/bin/env node
/**
 * Cross-platform test entry point.
 *
 * `node --test "tests/*.test.js"` only started globbing the pattern in Node 22;
 * on 18 and 20 the string is treated as a literal module path and the run dies
 * with "Could not find". Rather than pin a Node version, discover the files
 * here and pass them through explicitly.
 */

import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'tests');

const files = readdirSync(dir)
  .filter((f) => f.endsWith('.test.js'))
  .sort()
  .map((f) => join('tests', f));

if (!files.length) {
  console.error('No test files found in tests/');
  process.exit(1);
}

console.log(`Running ${files.length} test file(s):\n  ${files.join('\n  ')}\n`);

const result = spawnSync(process.execPath, ['--test', ...files], {
  cwd: root,
  stdio: 'inherit',
  // Let the runner decide colours; CI strips them anyway.
  env: { ...process.env, FORCE_COLOR: process.env.CI ? '0' : '1' },
});

process.exit(result.status ?? 1);
