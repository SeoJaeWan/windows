#!/usr/bin/env node
/**
 * run-diff.mjs
 *
 * Phase 4 diff runner for the windows Figma review.
 *
 * For each of the 6 canonical compare states:
 *   - Reads Phase 1 reference PNG from reference-captures/{kind}-{state}.png
 *   - Reads current PNG from visual-compare/{kind}-{state}-current.png
 *   - Runs pixelmatch diff and writes visual-compare/{kind}-{state}-diff.png
 *   - Outputs diff-results.json with size/pixel/ratio metrics per state
 *
 * Threshold: 0.05 (Figma pixel-perfect spec threshold per skill guide)
 *
 * All canonical keys are read from windowFigmaReviewRegistration.ts —
 * no string literals are duplicated here.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Read canonical states from registration file ──────────────────────

const REGISTRATION_PATH = path.resolve(
  __dirname,
  "../../../packages/ui/src/components/windows/storybook/windowFigmaReviewRegistration.ts"
);

const registrationSource = fs.readFileSync(REGISTRATION_PATH, "utf8");

function extractStringArrayExport(src, exportName) {
  const m = src.match(
    new RegExp(`export const ${exportName}\\s*=\\s*\\[([^\\]]+)\\]`, "s")
  );
  if (!m) throw new Error(`Could not extract ${exportName} from registration`);
  return m[1]
    .split(/,\s*/)
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

const CANONICAL_COMPARE_STATES = extractStringArrayExport(
  registrationSource,
  "CANONICAL_COMPARE_STATES"
);

// ── Paths ─────────────────────────────────────────────────────────────

const VISUAL_COMPARE_DIR = path.resolve(__dirname);
const REFERENCE_DIR = path.resolve(__dirname, "../reference-captures");

function artifactKey(stateKey) {
  return stateKey.replace("/", "-");
}

// ── Padding helper ────────────────────────────────────────────────────

function padImage(img, w, h) {
  if (img.width === w && img.height === h) return img;
  const padded = new PNG({ width: w, height: h, fill: true });
  for (let i = 0; i < padded.data.length; i += 4) {
    padded.data[i] = 255;
    padded.data[i + 1] = 255;
    padded.data[i + 2] = 255;
    padded.data[i + 3] = 255;
  }
  PNG.bitblt(img, padded, 0, 0, img.width, img.height, 0, 0);
  return padded;
}

// ── Diff runner ───────────────────────────────────────────────────────

const THRESHOLD = 0.05; // Figma pixel-perfect spec threshold

const results = [];

for (const stateKey of CANONICAL_COMPARE_STATES) {
  const key = artifactKey(stateKey);
  const refPath = path.join(REFERENCE_DIR, `${key}.png`);
  const curPath = path.join(VISUAL_COMPARE_DIR, `${key}-current.png`);
  const diffPath = path.join(VISUAL_COMPARE_DIR, `${key}-diff.png`);

  console.log(`\nDiffing: ${stateKey}`);
  console.log(`  Reference: ${refPath}`);
  console.log(`  Current:   ${curPath}`);
  console.log(`  Diff:      ${diffPath}`);

  if (!fs.existsSync(refPath)) {
    console.error(`  ERROR: Reference not found: ${refPath}`);
    results.push({ stateKey, key, error: "reference not found" });
    continue;
  }

  if (!fs.existsSync(curPath)) {
    console.error(`  ERROR: Current not found: ${curPath}`);
    results.push({ stateKey, key, error: "current not found" });
    continue;
  }

  const ref = PNG.sync.read(fs.readFileSync(refPath));
  const cur = PNG.sync.read(fs.readFileSync(curPath));

  const sizeMismatch = ref.width !== cur.width || ref.height !== cur.height;
  const width = Math.max(ref.width, cur.width);
  const height = Math.max(ref.height, cur.height);

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
  const passed = parseFloat(mismatchRate) < 1;

  const result = {
    stateKey,
    key,
    reference: { width: ref.width, height: ref.height },
    current: { width: cur.width, height: cur.height },
    sizeMismatch,
    mismatchedPixels,
    totalPixels,
    mismatchRate: `${mismatchRate}%`,
    threshold: THRESHOLD,
    passed,
    diffImage: diffPath,
  };

  results.push(result);

  console.log(`  Size match: ${!sizeMismatch ? "YES" : "NO"} (ref ${ref.width}x${ref.height} vs cur ${cur.width}x${cur.height})`);
  console.log(`  Mismatch: ${mismatchedPixels} px (${mismatchRate}%)`);
  console.log(`  Passed (<1%): ${passed}`);
}

// ── Write diff-results.json ───────────────────────────────────────────

const diffResultsPath = path.join(VISUAL_COMPARE_DIR, "diff-results.json");
fs.writeFileSync(diffResultsPath, JSON.stringify({ threshold: THRESHOLD, results }, null, 2));

console.log(`\n── Diff summary ─────────────────────────────────────`);
for (const r of results) {
  if (r.error) {
    console.log(`  ERROR ${r.stateKey}: ${r.error}`);
  } else {
    const status = r.passed ? "PASS" : "FAIL";
    const sizeFlag = r.sizeMismatch ? " [SIZE MISMATCH]" : "";
    console.log(`  ${status} ${r.stateKey}: ${r.mismatchRate}${sizeFlag}`);
  }
}

console.log(`\ndiff-results.json written to: ${diffResultsPath}`);

const errors = results.filter((r) => r.error);
if (errors.length > 0) {
  console.error(`\n${errors.length} diff(s) failed due to missing files.`);
  process.exit(1);
}
