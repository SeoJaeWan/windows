#!/usr/bin/env node
/**
 * run-diff.mjs
 *
 * canonical 4 state의 baseline vs current를 pixelmatch로 비교하고
 * diff PNG를 생성한다. 결과를 console에 요약 출력한다.
 *
 * baseline 경로: ../reference-captures/{kind}-{state}.png
 * current 경로:  ./{kind}-{state}-current.png
 * diff 출력:    ./{kind}-{state}-diff.png
 *
 * threshold: 0.2 (external vs package-local cross-environment diff tolerance)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASELINE_DIR = path.resolve(__dirname, "../reference-captures");
const CURRENT_DIR = __dirname;
const DIFF_DIR = __dirname;

// threshold 0.2: reference(external live) vs current(Storybook package-local) 크로스 환경 허용 오차
const THRESHOLD = 0.2;

// canonical 4 state keys only
const KEYS = [
  { kind: "folder", state: "desktop-blog" },
  { kind: "folder", state: "mobile-blog" },
  { kind: "browser", state: "desktop-article" },
  { kind: "browser", state: "mobile-article" },
];

function padImage(img, w, h) {
  if (img.width === w && img.height === h) return img;
  const padded = new PNG({ width: w, height: h, fill: true });
  // White background
  for (let i = 0; i < padded.data.length; i += 4) {
    padded.data[i] = 255;
    padded.data[i + 1] = 255;
    padded.data[i + 2] = 255;
    padded.data[i + 3] = 255;
  }
  PNG.bitblt(img, padded, 0, 0, img.width, img.height, 0, 0);
  return padded;
}

const results = [];

for (const { kind, state } of KEYS) {
  const key = `${kind}-${state}`;
  const baselinePath = path.join(BASELINE_DIR, `${key}.png`);
  const currentPath = path.join(CURRENT_DIR, `${key}-current.png`);
  const diffPath = path.join(DIFF_DIR, `${key}-diff.png`);

  if (!fs.existsSync(baselinePath)) {
    console.error(`[MISSING] baseline: ${baselinePath}`);
    results.push({ key, error: "missing baseline" });
    continue;
  }
  if (!fs.existsSync(currentPath)) {
    console.error(`[MISSING] current: ${currentPath}`);
    results.push({ key, error: "missing current" });
    continue;
  }

  const ref = PNG.sync.read(fs.readFileSync(baselinePath));
  const cur = PNG.sync.read(fs.readFileSync(currentPath));

  const width = Math.max(ref.width, cur.width);
  const height = Math.max(ref.height, cur.height);
  const sizeMismatch = ref.width !== cur.width || ref.height !== cur.height;

  const refPadded = padImage(ref, width, height);
  const curPadded = padImage(cur, width, height);
  const diff = new PNG({ width, height });

  const mismatchedPixels = pixelmatch(
    refPadded.data,
    curPadded.data,
    diff.data,
    width,
    height,
    { threshold: THRESHOLD, includeAA: false }
  );

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const totalPixels = width * height;
  const mismatchRate = ((mismatchedPixels / totalPixels) * 100).toFixed(2);
  const passed = parseFloat(mismatchRate) < 5;

  results.push({
    key,
    kind,
    state,
    baseline: { width: ref.width, height: ref.height },
    current: { width: cur.width, height: cur.height },
    sizeMismatch,
    mismatchedPixels,
    totalPixels,
    mismatchRate: `${mismatchRate}%`,
    diffImage: diffPath,
    passed,
  });
}

// Summary output
console.log("\n=== Diff Summary ===\n");
for (const r of results) {
  if (r.error) {
    console.log(`[ERROR] ${r.key}: ${r.error}`);
    continue;
  }
  const status = r.passed ? "PASS" : "FAIL";
  const sizeNote = r.sizeMismatch
    ? ` [size mismatch: baseline ${r.baseline.width}x${r.baseline.height} vs current ${r.current.width}x${r.current.height}]`
    : "";
  console.log(
    `[${status}] ${r.key}: ${r.mismatchRate} mismatch (${r.mismatchedPixels}/${r.totalPixels} px)${sizeNote}`
  );
}

console.log("\n=== Full Results (JSON) ===\n");
console.log(JSON.stringify(results, null, 2));
