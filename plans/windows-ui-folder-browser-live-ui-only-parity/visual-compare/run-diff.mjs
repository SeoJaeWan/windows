/**
 * run-diff.mjs
 *
 * Phase 4 — diff runner script.
 * Runs pixelmatch on baseline/current pairs for the 6 canonical state keys.
 *
 * Naming contract:
 *   baseline:  plans/.../reference-captures/{kind}-{state-underscored}.png
 *   current:   plans/.../visual-compare/{kind}-{state}-current.png
 *   diff:      plans/.../visual-compare/{kind}-{state}-diff.png
 *
 * Threshold: 0.1 (general UI reference — reference PNGs are from live seojaewan.com,
 * current PNGs are from Storybook; same rendering engine, different data, font
 * rendering may differ slightly).
 */

import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLAN_DIR = path.join(__dirname, "..");
const BASELINE_DIR = path.join(PLAN_DIR, "reference-captures");
const CURRENT_DIR = __dirname; // visual-compare/
const DIFF_DIR = __dirname; // visual-compare/

const THRESHOLD = 0.1;

/**
 * Canonical diff inventory — 6 state keys.
 * baseline artifact naming uses underscored state (as Phase 1 produced).
 * current/diff naming uses hyphenated state.
 */
const DIFF_INVENTORY = [
  {
    kind: "folder",
    state: "desktop-blog",
    baselineFile: "folder-desktop-blog.png",
  },
  {
    kind: "folder",
    state: "desktop-search-open",
    baselineFile: "folder-desktop-search-open.png",
  },
  {
    kind: "folder",
    state: "mobile-blog",
    baselineFile: "folder-mobile-blog.png",
  },
  {
    kind: "browser",
    state: "desktop-article",
    baselineFile: "browser-desktop-article.png",
  },
  {
    kind: "browser",
    state: "desktop-address-open",
    baselineFile: "browser-desktop-address-open.png",
  },
  {
    kind: "browser",
    state: "mobile-article",
    baselineFile: "browser-mobile-article.png",
  },
];

function loadPNG(filePath) {
  const data = readFileSync(filePath);
  return PNG.sync.read(data);
}

function runDiff(baselinePath, currentPath, diffPath, threshold) {
  const baseline = loadPNG(baselinePath);
  const current = loadPNG(currentPath);

  const dimensionsMatch =
    baseline.width === current.width && baseline.height === current.height;

  let mismatchPixels = 0;
  let mismatchRatio = 0;
  let diffPNG = null;
  let errorMsg = null;

  if (!dimensionsMatch) {
    errorMsg = `Dimension mismatch: baseline ${baseline.width}×${baseline.height} vs current ${current.width}×${current.height}`;
    // Still produce a diff if sizes differ by creating a canvas at max size
    const w = Math.max(baseline.width, current.width);
    const h = Math.max(baseline.height, current.height);
    diffPNG = new PNG({ width: w, height: h });
    // Fill diff with red to signal mismatch
    for (let i = 0; i < w * h * 4; i += 4) {
      diffPNG.data[i] = 255;     // R
      diffPNG.data[i + 1] = 0;   // G
      diffPNG.data[i + 2] = 0;   // B
      diffPNG.data[i + 3] = 255; // A
    }
    mismatchPixels = w * h;
    mismatchRatio = 1.0;
  } else {
    const { width, height } = baseline;
    diffPNG = new PNG({ width, height });
    mismatchPixels = pixelmatch(
      baseline.data,
      current.data,
      diffPNG.data,
      width,
      height,
      { threshold }
    );
    mismatchRatio = mismatchPixels / (width * height);
  }

  writeFileSync(diffPath, PNG.sync.write(diffPNG));

  return {
    dimensionsMatch,
    mismatchPixels,
    mismatchRatio,
    passed: dimensionsMatch && mismatchRatio < threshold,
    errorMsg,
    baselineDimensions: { width: loadPNG(baselinePath).width, height: loadPNG(baselinePath).height },
    currentDimensions: { width: loadPNG(currentPath).width, height: loadPNG(currentPath).height },
  };
}

async function runAllDiffs() {
  console.log("=== Phase 4 — run-diff.mjs ===");
  console.log(`Threshold: ${THRESHOLD}`);
  console.log(`Baseline dir: ${BASELINE_DIR}`);
  console.log(`Current dir: ${CURRENT_DIR}`);
  console.log(`Diff dir: ${DIFF_DIR}`);
  console.log("");

  const results = [];

  for (const item of DIFF_INVENTORY) {
    const key = `${item.kind}/${item.state}`;
    const baselinePath = path.join(BASELINE_DIR, item.baselineFile);
    const currentPath = path.join(CURRENT_DIR, `${item.kind}-${item.state}-current.png`);
    const diffPath = path.join(DIFF_DIR, `${item.kind}-${item.state}-diff.png`);

    console.log(`[${key}]`);

    try {
      const result = runDiff(baselinePath, currentPath, diffPath, THRESHOLD);
      results.push({ key, ...result, diffPath });

      const status = result.passed ? "PASS" : "FAIL";
      console.log(`  Status: ${status}`);
      console.log(`  Baseline: ${result.baselineDimensions.width}×${result.baselineDimensions.height}`);
      console.log(`  Current:  ${result.currentDimensions.width}×${result.currentDimensions.height}`);
      console.log(`  Dimensions match: ${result.dimensionsMatch}`);
      console.log(`  Mismatch pixels: ${result.mismatchPixels}`);
      console.log(`  Mismatch ratio: ${(result.mismatchRatio * 100).toFixed(2)}%`);
      if (result.errorMsg) console.log(`  Error: ${result.errorMsg}`);
    } catch (err) {
      console.log(`  ERROR: ${err.message}`);
      results.push({ key, passed: false, error: err.message });
    }

    console.log("");
  }

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`=== Summary: ${passed} passed, ${failed} failed ===`);

  // Write results JSON for report consumption
  const resultsPath = path.join(DIFF_DIR, "diff-results.json");
  writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`Results written to: ${resultsPath}`);

  return results;
}

runAllDiffs().catch((err) => {
  console.error("Diff run failed:", err.message);
  process.exit(1);
});
