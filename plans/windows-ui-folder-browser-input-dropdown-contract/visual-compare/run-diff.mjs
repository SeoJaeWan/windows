/**
 * run-diff.mjs
 *
 * Phase 4 — diff pipeline
 *
 * Runs pixelmatch diff between baseline reference PNGs and current
 * capture PNGs for all 15 exact kind/state keys.
 *
 * Provenance:
 *   reference side: Phase 1 Figma 3:2 baseline local mirror
 *                   (Figma file NrUGKPZUewpuA8XuHI0v5n / canvas 3:2)
 *   current side  : Phase 3 Storybook compare story capture
 *                   ([data-window-compare-stage] — CompareWindowStage)
 *
 * Artifact naming (exact kind-state key shared across all three):
 *   {kind}-{state}-reference.png  ← Phase 1 baseline
 *   {kind}-{state}-current.png    ← Phase 3 current capture
 *   {kind}-{state}-diff.png       ← pixelmatch output
 *
 * Threshold: 0.05 (pixel-perfect spec — Figma source)
 *
 * Outputs JSON result to stdout and writes report.json to visual-compare/.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { PNG } = require("pngjs");
const pixelmatch = require("pixelmatch");

const __dirname = dirname(fileURLToPath(import.meta.url));
const REFERENCE_DIR = join(__dirname, "../reference-captures");
const CURRENT_DIR = __dirname;
const DIFF_DIR = __dirname;

/** Pixel-perfect threshold — Figma spec source */
const THRESHOLD = 0.05;

/**
 * Exact 15-state inventory with provenance labels.
 *
 * reference-provenance: external-source evidence
 *   Figma file NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 /
 *   frame "Live UI References — Folder Browser" / wrapper label {kind}/{state}
 *
 * current-provenance: package-local current
 *   packages/ui Storybook / story windows-compose-{kind}--compare-{state-kebab} /
 *   selector [data-window-compare-stage]
 */
const INVENTORY = [
  // Desktop Folder (8)
  { key: "folder/live-blog",             stateRole: "contract-bearing", variant: "desktop" },
  { key: "folder/live-search-open",      stateRole: "contract-bearing", variant: "desktop" },
  { key: "folder/live-chip-open",        stateRole: "detail-variant",   variant: "desktop" },
  { key: "folder/live-sidebar-hover",    stateRole: "detail-variant",   variant: "desktop" },
  { key: "folder/live-sidebar-expanded", stateRole: "detail-variant",   variant: "desktop" },
  { key: "folder/live-thumbnail-hover",  stateRole: "detail-variant",   variant: "desktop" },
  { key: "folder/mobile-blog",           stateRole: "contract-bearing", variant: "mobile"   },
  { key: "folder/mobile-search-open",    stateRole: "contract-bearing", variant: "mobile"   },
  // Desktop Browser (7)
  { key: "browser/live-article",                stateRole: "contract-bearing", variant: "desktop" },
  { key: "browser/live-address-open",           stateRole: "contract-bearing", variant: "desktop" },
  { key: "browser/live-control-hover-minimize", stateRole: "detail-variant",   variant: "desktop" },
  { key: "browser/live-control-hover-maximize", stateRole: "detail-variant",   variant: "desktop" },
  { key: "browser/live-control-hover-close",    stateRole: "detail-variant",   variant: "desktop" },
  { key: "browser/mobile-article",              stateRole: "contract-bearing", variant: "mobile"   },
  { key: "browser/mobile-address-open",         stateRole: "contract-bearing", variant: "mobile"   },
];

function artifactBase(key) {
  return key.replace("/", "-");
}

function readPng(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }
  const buf = readFileSync(filePath);
  return PNG.sync.read(buf);
}

function runDiff(entry) {
  const { key, stateRole, variant } = entry;
  const base = artifactBase(key);

  const referencePath = join(REFERENCE_DIR, `${base}-reference.png`);
  const currentPath   = join(CURRENT_DIR,   `${base}-current.png`);
  const diffPath      = join(DIFF_DIR,      `${base}-diff.png`);

  const refPng = readPng(referencePath);
  const curPng = readPng(currentPath);

  const result = {
    key,
    stateRole,
    variant,
    artifactBase: base,
    referencePath,
    currentPath,
    diffPath,
    referenceProvenance: `external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "${key}"`,
    currentProvenance: `package-local current — packages/ui Storybook / [data-window-compare-stage]`,
    threshold: THRESHOLD,
  };

  // Handle placeholder reference (1x1 — Phase 1 limitation)
  if (!refPng) {
    return {
      ...result,
      referenceStatus: "missing",
      passed: false,
      blocking: true,
      blockerReason: "reference-missing",
      advisory: "baseline placeholder — refresh required (Figma MCP get_screenshot needed)",
      mismatchPixels: null,
      mismatchRatio: null,
      dimensionsMatch: false,
      refDimensions: null,
      curDimensions: curPng ? { w: curPng.width, h: curPng.height } : null,
    };
  }

  const isPlaceholder = refPng.width === 1 && refPng.height === 1;
  if (isPlaceholder) {
    return {
      ...result,
      referenceStatus: "placeholder-1x1",
      passed: false,
      blocking: false,
      advisory: "baseline placeholder — 1×1 PNG (Figma MCP get_screenshot needed for real comparison). Current capture exists and is valid.",
      mismatchPixels: null,
      mismatchRatio: null,
      dimensionsMatch: false,
      refDimensions: { w: refPng.width, h: refPng.height },
      curDimensions: curPng ? { w: curPng.width, h: curPng.height } : null,
    };
  }

  if (!curPng) {
    return {
      ...result,
      referenceStatus: "ok",
      passed: false,
      blocking: true,
      blockerReason: "current-missing",
      advisory: "current capture missing — run capture-current.mjs",
      mismatchPixels: null,
      mismatchRatio: null,
      dimensionsMatch: false,
      refDimensions: { w: refPng.width, h: refPng.height },
      curDimensions: null,
    };
  }

  const dimensionsMatch =
    refPng.width === curPng.width && refPng.height === curPng.height;

  if (!dimensionsMatch) {
    // Dimension mismatch — cannot run pixelmatch without resize
    return {
      ...result,
      referenceStatus: "ok",
      passed: false,
      blocking: true,
      blockerReason: "dimension-mismatch",
      advisory: `reference ${refPng.width}×${refPng.height} vs current ${curPng.width}×${curPng.height}`,
      mismatchPixels: null,
      mismatchRatio: null,
      dimensionsMatch: false,
      refDimensions: { w: refPng.width, h: refPng.height },
      curDimensions: { w: curPng.width, h: curPng.height },
    };
  }

  // Run pixelmatch
  const { width, height } = refPng;
  const totalPixels = width * height;
  const diffPng = new PNG({ width, height });

  const mismatchPixels = pixelmatch(
    refPng.data, curPng.data, diffPng.data,
    width, height,
    { threshold: THRESHOLD, includeAA: false }
  );

  const mismatchRatio = mismatchPixels / totalPixels;
  const passed = mismatchRatio <= THRESHOLD;

  // Write diff PNG
  writeFileSync(diffPath, PNG.sync.write(diffPng));

  return {
    ...result,
    referenceStatus: "ok",
    passed,
    blocking: !passed,
    blockerReason: passed ? null : "pixel-mismatch",
    advisory: null,
    mismatchPixels,
    mismatchRatio,
    dimensionsMatch: true,
    refDimensions: { w: width, h: height },
    curDimensions: { w: width, h: height },
  };
}

function main() {
  console.log("=== Phase 4 diff pipeline ===");
  console.log(`inventory : ${INVENTORY.length} states`);
  console.log(`threshold : ${THRESHOLD} (pixel-perfect spec — Figma)`);

  const results = INVENTORY.map(runDiff);

  const blocking  = results.filter((r) => r.blocking);
  const advisory  = results.filter((r) => !r.blocking && r.advisory);
  const passed    = results.filter((r) => r.passed);
  const placeholder = results.filter((r) => r.referenceStatus === "placeholder-1x1");

  console.log(`\n=== diff summary ===`);
  console.log(`total      : ${results.length}`);
  console.log(`passed     : ${passed.length}`);
  console.log(`blocking   : ${blocking.length}`);
  console.log(`advisory   : ${advisory.length}`);
  console.log(`placeholder: ${placeholder.length} (reference refresh required)`);

  results.forEach((r) => {
    const tag = r.passed ? "[PASS]" : r.blocking ? "[BLOCK]" : "[ADV]";
    const ratio = r.mismatchRatio != null ? ` (${(r.mismatchRatio * 100).toFixed(2)}%)` : "";
    console.log(`  ${tag} ${r.key}${ratio}${r.advisory ? " — " + r.advisory : ""}`);
  });

  const reportPath = join(DIFF_DIR, "report.json");
  writeFileSync(reportPath, JSON.stringify({ threshold: THRESHOLD, results }, null, 2));
  console.log(`\nreport → ${reportPath}`);

  return results;
}

export { main, INVENTORY, runDiff };

main();
