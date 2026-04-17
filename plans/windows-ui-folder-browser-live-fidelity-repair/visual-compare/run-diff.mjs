/**
 * run-diff.mjs
 *
 * Phase 4 pixelmatch diff script.
 * Compares baseline reference images against current Storybook captures
 * for the 4 canonical states in the windows-ui-folder-browser-live-fidelity-repair plan.
 *
 * Usage:
 *   node plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/run-diff.mjs
 *
 * Requirements:
 *   - pixelmatch and pngjs must be available in the project root node_modules
 *   - Run from the monorepo root (C:/Users/USER/Desktop/dev/windows/...)
 *
 * Output:
 *   - Diff PNG files in the same visual-compare directory
 *   - JSON summary printed to stdout
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pixelmatchMod = require('pixelmatch');
const pixelmatch = pixelmatchMod.default ?? pixelmatchMod;
const { PNG } = require('pngjs');

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASELINE_DIR = resolve(__dirname, '../reference-captures');
const CURRENT_DIR = __dirname;
const DIFF_DIR = __dirname;

const THRESHOLD = 0.2; // External reference vs Storybook: allow rendering env differences

const CASES = [
  { key: 'folder-desktop-blog',   baseline: 'folder-desktop-blog.png',   current: 'folder-desktop-blog-current.png',   diff: 'folder-desktop-blog-diff.png' },
  { key: 'folder-mobile-blog',    baseline: 'folder-mobile-blog.png',    current: 'folder-mobile-blog-current.png',    diff: 'folder-mobile-blog-diff.png' },
  { key: 'browser-desktop-article', baseline: 'browser-desktop-article.png', current: 'browser-desktop-article-current.png', diff: 'browser-desktop-article-diff.png' },
  { key: 'browser-mobile-article',  baseline: 'browser-mobile-article.png',  current: 'browser-mobile-article-current.png',  diff: 'browser-mobile-article-diff.png' },
];

function readPng(filePath) {
  const buf = readFileSync(filePath);
  return PNG.sync.read(buf);
}

const results = [];

for (const c of CASES) {
  const baselinePath = resolve(BASELINE_DIR, c.baseline);
  const currentPath = resolve(CURRENT_DIR, c.current);
  const diffPath = resolve(DIFF_DIR, c.diff);

  let ref, cur;
  try {
    ref = readPng(baselinePath);
    cur = readPng(currentPath);
  } catch (e) {
    results.push({ key: c.key, error: e.message });
    continue;
  }

  const sizeMatch = ref.width === cur.width && ref.height === cur.height;
  const totalPixels = ref.width * ref.height;

  if (!sizeMatch) {
    results.push({
      key: c.key,
      sizeMatch: false,
      refSize: `${ref.width}x${ref.height}`,
      curSize: `${cur.width}x${cur.height}`,
      mismatchPixels: null,
      mismatchPct: null,
      passed: false,
    });
    continue;
  }

  const diff = new PNG({ width: ref.width, height: ref.height });
  const mismatchPixels = pixelmatch(
    ref.data, cur.data, diff.data,
    ref.width, ref.height,
    { threshold: THRESHOLD }
  );

  writeFileSync(diffPath, PNG.sync.write(diff));

  const mismatchPct = ((mismatchPixels / totalPixels) * 100).toFixed(2);
  const passed = mismatchPixels === 0;

  results.push({
    key: c.key,
    sizeMatch: true,
    refSize: `${ref.width}x${ref.height}`,
    curSize: `${cur.width}x${cur.height}`,
    totalPixels,
    mismatchPixels,
    mismatchPct: `${mismatchPct}%`,
    passed,
  });
}

console.log(JSON.stringify(results, null, 2));
