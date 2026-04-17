/**
 * run-diff.mjs
 *
 * Phase 3 — pixel-level diff for canonical 4 states
 *
 * Compares baseline (external-source evidence from seojaewan.com) against
 * current (package-local, captured via [data-window-compare-stage] marker).
 *
 * Key naming contract: all three artifact files share the same {kind}-{state} key.
 *   baseline  : reference-captures/{kind}-{state}.png  (copied to *-reference.png for diff)
 *   current   : visual-compare/{kind}-{state}-current.png
 *   diff      : visual-compare/{kind}-{state}-diff.png
 *
 * Threshold: 0.2 — reference captured from different rendering environment
 * (external seojaewan.com vs package-local Storybook with fixture data).
 */

import { readFileSync, copyFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKTREE = "C:/Users/USER/Desktop/dev/windows/worktrees/windows-ui-folder-browser-live-ui-parity";

// Dynamic import with file:// URL for ESM pixelmatch
const pixelmatchUrl = pathToFileURL(
  path.join(WORKTREE, "node_modules/.pnpm/pixelmatch@7.1.0/node_modules/pixelmatch/index.js")
).href;
const { default: pixelmatch } = await import(pixelmatchUrl);

// CJS pngjs via createRequire
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PNG } = require(path.join(WORKTREE, "node_modules/.pnpm/pngjs@7.0.0/node_modules/pngjs/lib/png.js"));

const PLAN_DIR  = path.resolve(__dirname, "..");
const BASELINE_DIR = path.join(PLAN_DIR, "reference-captures");
const VISUAL_DIR   = __dirname;
const THRESHOLD    = 0.2;

const CASES = [
  { kind: "folder",  state: "desktop-blog"   },
  { kind: "folder",  state: "mobile-blog"    },
  { kind: "browser", state: "desktop-article" },
  { kind: "browser", state: "mobile-article"  },
];

function padImage(img, w, h) {
  if (img.width === w && img.height === h) return img;
  const padded = new PNG({ width: w, height: h, fill: true });
  for (let i = 0; i < padded.data.length; i += 4) {
    padded.data[i] = padded.data[i + 1] = padded.data[i + 2] = padded.data[i + 3] = 255;
  }
  PNG.bitblt(img, padded, 0, 0, img.width, img.height, 0, 0);
  return padded;
}

const results = [];

for (const { kind, state } of CASES) {
  const key          = `${kind}-${state}`;
  const baselineSrc  = path.join(BASELINE_DIR, `${key}.png`);
  const referenceDst = path.join(VISUAL_DIR,   `${key}-reference.png`);
  const current      = path.join(VISUAL_DIR,   `${key}-current.png`);
  const diff         = path.join(VISUAL_DIR,   `${key}-diff.png`);

  copyFileSync(baselineSrc, referenceDst);

  console.log(`\n[diff] ${kind}/${state}`);
  console.log(`  reference : ${referenceDst}`);
  console.log(`  current   : ${current}`);
  console.log(`  diff      : ${diff}`);

  const ref = PNG.sync.read(readFileSync(referenceDst));
  const cur = PNG.sync.read(readFileSync(current));

  const width       = Math.max(ref.width,  cur.width);
  const height      = Math.max(ref.height, cur.height);
  const sizeMismatch = ref.width !== cur.width || ref.height !== cur.height;

  const refP = padImage(ref, width, height);
  const curP = padImage(cur, width, height);
  const diffImg = new PNG({ width, height });

  const mismatchedPixels = pixelmatch(
    refP.data, curP.data, diffImg.data,
    width, height,
    { threshold: THRESHOLD, includeAA: false }
  );

  writeFileSync(diff, PNG.sync.write(diffImg));

  const totalPixels  = width * height;
  const mismatchRate = parseFloat(((mismatchedPixels / totalPixels) * 100).toFixed(2));
  const passed       = mismatchRate < 1;

  const result = {
    key, kind, state,
    reference:  { width: ref.width, height: ref.height },
    current:    { width: cur.width, height: cur.height },
    sizeMismatch,
    mismatchedPixels,
    totalPixels,
    mismatchRate: `${mismatchRate}%`,
    passed,
  };
  results.push(result);

  console.log(`  ref size  : ${ref.width}x${ref.height}`);
  console.log(`  cur size  : ${cur.width}x${cur.height}`);
  console.log(`  size match: ${!sizeMismatch}`);
  console.log(`  mismatch  : ${mismatchRate}% (${mismatchedPixels}/${totalPixels} px)`);
  console.log(`  passed    : ${passed}`);
}

console.log("\n\n=== SUMMARY ===");
for (const r of results) {
  const flag = r.passed ? "PASS" : "FAIL";
  console.log(`  ${r.key}: ${flag}  mismatch=${r.mismatchRate}  sizeMismatch=${r.sizeMismatch}`);
}

writeFileSync(
  path.join(VISUAL_DIR, "diff-results.json"),
  JSON.stringify(results, null, 2)
);
console.log("\n[done] diff-results.json written.");
