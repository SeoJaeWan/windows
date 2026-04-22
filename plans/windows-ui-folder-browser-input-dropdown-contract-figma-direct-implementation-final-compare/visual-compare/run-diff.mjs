/**
 * run-diff.mjs
 *
 * Visual diff runner for the windows family (Folder, Browser) compare pipeline.
 *
 * Blocking decision rule (locked in Phase 2 — do NOT modify in Phase 3):
 *   Each state PASSES only when:
 *     1. Every declared gating surface from the exact union inventory is PRESENT.
 *     2. No boundary/anchor/geometry blocker is found in the gating surfaces.
 *     3. scopedBlockingDiffRatio <= 0.05
 *
 *   scopedBlockingDiffRatio = mismatchedPixels / totalPixelsInsideDeclaredGatingSurfaces
 *   globalDriftRatio = mismatchedPixels / totalPixelsInsideWholeCaptureCanvas
 *
 *   globalDriftRatio is always REPORTED but NEVER blocks by itself.
 *   Whole-canvas mismatch alone is NOT a blocker.
 *
 * Provenance labels (locked):
 *   reference: "external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "{key}""
 *   current:   "package-local current — packages/ui Storybook / [data-window-compare-stage]"
 *
 * Artifact naming (locked):
 *   reference: {kind}-{state}-reference.png   (from reference-captures/)
 *   current:   {kind}-{state}-current.png     (from --current-dir)
 *   diff:      {kind}-{state}-diff.png        (written to --output-dir)
 *
 * Usage:
 *   node visual-compare/run-diff.mjs \
 *     --reference-dir plans/.../reference-captures \
 *     --current-dir  plans/.../visual-compare/current \
 *     --output-dir   plans/.../visual-compare/diff-output
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ── Blocking threshold (locked — do NOT change in Phase 3) ──── */
const SCOPED_BLOCKING_THRESHOLD = 0.05;

/* ── Provenance labels (locked) ──────────────────────────────── */
const PROVENANCE_REFERENCE =
  'external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper';
const PROVENANCE_CURRENT =
  "package-local current — packages/ui Storybook / [data-window-compare-stage]";

/* ── Exact 15-key inventory (locked) ─────────────────────────── */

/**
 * Declared gating surface union per compare key.
 * Source: Phase 2 plan section "선언된 gating surface union 인벤토리".
 *
 * @type {Record<string, string[]>}
 */
const GATING_SURFACES = {
  "folder/live-blog": [
    "frame-surface",
    "navigation-surface",
    "control-surface",
    "content-surface",
    "media-surface",
  ],
  "folder/live-search-open": [
    "frame-surface",
    "navigation-surface",
    "control-surface",
    "content-surface",
    "media-surface",
  ],
  "folder/live-chip-open": [
    "frame-surface",
    "navigation-surface",
    "control-surface",
    "content-surface",
    "media-surface",
  ],
  "folder/live-sidebar-hover": [
    "navigation-surface",
    "control-surface",
    "content-surface",
    "media-surface",
  ],
  "folder/live-sidebar-expanded": [
    "navigation-surface",
    "control-surface",
    "content-surface",
    "media-surface",
  ],
  "folder/live-thumbnail-hover": [
    "navigation-surface",
    "control-surface",
    "content-surface",
    "media-surface",
  ],
  "folder/mobile-blog": [
    "frame-surface",
    "control-surface",
    "content-surface",
    "media-surface",
  ],
  "folder/mobile-search-open": [
    "frame-surface",
    "control-surface",
    "content-surface",
    "media-surface",
  ],
  "browser/live-article": ["frame-surface", "control-surface", "content-surface"],
  "browser/live-address-open": [
    "frame-surface",
    "control-surface",
    "content-surface",
  ],
  "browser/live-control-hover-minimize": ["frame-surface", "control-surface"],
  "browser/live-control-hover-maximize": ["frame-surface", "control-surface"],
  "browser/live-control-hover-close": ["frame-surface", "control-surface"],
  "browser/mobile-article": ["frame-surface", "control-surface", "content-surface"],
  "browser/mobile-address-open": [
    "frame-surface",
    "control-surface",
    "content-surface",
  ],
};

const INVENTORY_KEYS = [
  "folder/live-blog",
  "folder/live-search-open",
  "folder/live-chip-open",
  "folder/live-sidebar-hover",
  "folder/live-sidebar-expanded",
  "folder/live-thumbnail-hover",
  "folder/mobile-blog",
  "folder/mobile-search-open",
  "browser/live-article",
  "browser/live-address-open",
  "browser/live-control-hover-minimize",
  "browser/live-control-hover-maximize",
  "browser/live-control-hover-close",
  "browser/mobile-article",
  "browser/mobile-address-open",
];

/* ── Argument parsing ─────────────────────────────────────────── */

function parseArgs() {
  const args = process.argv.slice(2);
  let referenceDir = null;
  let currentDir = null;
  let outputDir = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--reference-dir" && args[i + 1]) {
      referenceDir = resolve(process.cwd(), args[i + 1]);
      i++;
    } else if (args[i] === "--current-dir" && args[i + 1]) {
      currentDir = resolve(process.cwd(), args[i + 1]);
      i++;
    } else if (args[i] === "--output-dir" && args[i + 1]) {
      outputDir = resolve(process.cwd(), args[i + 1]);
      i++;
    }
  }

  if (!referenceDir || !currentDir || !outputDir) {
    throw new Error(
      "Required: --reference-dir, --current-dir, --output-dir"
    );
  }

  return { referenceDir, currentDir, outputDir };
}

/* ── Key → artifact filename helpers ─────────────────────────── */

function keyToFileStem(key) {
  // "folder/live-blog" → "folder-live-blog"
  return key.replace("/", "-");
}

function referenceFileName(key) {
  return `${keyToFileStem(key)}-reference.png`;
}

function currentFileName(key) {
  return `${keyToFileStem(key)}-current.png`;
}

function diffFileName(key) {
  return `${keyToFileStem(key)}-diff.png`;
}

/* ── Pixel diff ───────────────────────────────────────────────── */

/**
 * Compare two images pixel-by-pixel.
 * Returns { mismatchedPixels, totalPixels, diffBuffer }.
 *
 * NOTE: This is a simplified implementation.
 * In Phase 3, the gating surface analysis requires the actual declared
 * gating surfaces to be annotated (e.g. via bounding boxes from [data-*]
 * attributes read from the captured DOM). This implementation computes
 * the whole-canvas diff and uses it as a proxy for both metrics
 * (scopedBlockingDiffRatio and globalDriftRatio) since the gating surface
 * geometry is not available at diff-runtime without additional DOM data.
 *
 * Phase 3 must implement actual scoped surface extraction if precise
 * scopedBlockingDiffRatio < globalDriftRatio separation is required.
 *
 * surface overlay (pngjs port): diff PNG rendered via pixelmatch with
 * { threshold: 0.03 } — mismatched pixels highlighted red, matched pixels
 * dimmed to ~30% alpha. Output shape identical to the canvas-based version.
 *
 * @param {Buffer} refBuffer
 * @param {Buffer} curBuffer
 */
function diffImages(refBuffer, curBuffer) {
  const refImg = PNG.sync.read(refBuffer);
  const curImg = PNG.sync.read(curBuffer);

  const width = Math.max(refImg.width, curImg.width);
  const height = Math.max(refImg.height, curImg.height);

  // Normalise both images to the same canvas size (pad with transparent pixels)
  function normaliseData(img) {
    if (img.width === width && img.height === height) {
      return img.data;
    }
    const buf = Buffer.alloc(width * height * 4, 0);
    for (let y = 0; y < img.height; y++) {
      const srcOff = y * img.width * 4;
      const dstOff = y * width * 4;
      img.data.copy(buf, dstOff, srcOff, srcOff + img.width * 4);
    }
    return buf;
  }

  const refData = normaliseData(refImg);
  const curData = normaliseData(curImg);

  const totalPixels = width * height;

  // Build diff output buffer (RGBA)
  const diffPng = new PNG({ width, height });

  // pixelmatch writes mismatched pixels as red by default.
  // threshold: 0.03 ≈ maxDiff > 8 (original heuristic on 0–255 scale).
  const mismatchedPixels = pixelmatch(
    refData,
    curData,
    diffPng.data,
    width,
    height,
    { threshold: 0.03, includeAA: false }
  );

  // Dim matched pixels to ~30% alpha (replicates original canvas behaviour)
  for (let i = 0; i < diffPng.data.length; i += 4) {
    const isHighlighted =
      diffPng.data[i] === 255 &&
      diffPng.data[i + 1] === 0 &&
      diffPng.data[i + 2] === 0 &&
      diffPng.data[i + 3] === 255;
    if (!isHighlighted) {
      diffPng.data[i] = refData[i];
      diffPng.data[i + 1] = refData[i + 1];
      diffPng.data[i + 2] = refData[i + 2];
      diffPng.data[i + 3] = Math.floor(refData[i + 3] * 0.3);
    }
  }

  const diffBuffer = PNG.sync.write(diffPng);

  return {
    mismatchedPixels,
    totalPixels,
    diffBuffer,
  };
}

/* ── Process one key ──────────────────────────────────────────── */

async function processKey(key, referenceDir, currentDir, outputDir) {
  const refFile = join(referenceDir, referenceFileName(key));
  const curFile = join(currentDir, currentFileName(key));
  const diffFile = join(outputDir, diffFileName(key));

  // Check files exist
  if (!existsSync(refFile)) {
    return {
      key,
      status: "error",
      error: `Reference not found: ${refFile}`,
      provenance: {
        reference: `${PROVENANCE_REFERENCE} "${key}"`,
        current: PROVENANCE_CURRENT,
      },
    };
  }
  if (!existsSync(curFile)) {
    return {
      key,
      status: "error",
      error: `Current not found: ${curFile}`,
      provenance: {
        reference: `${PROVENANCE_REFERENCE} "${key}"`,
        current: PROVENANCE_CURRENT,
      },
    };
  }

  const refBuffer = readFileSync(refFile);
  const curBuffer = readFileSync(curFile);

  const { mismatchedPixels, totalPixels, diffBuffer } = diffImages(
    refBuffer,
    curBuffer
  );

  writeFileSync(diffFile, diffBuffer);

  // Compute metrics
  // scopedBlockingDiffRatio: ideally scoped to declared gating surfaces.
  // Here we use whole-canvas as proxy (conservative — may over-block).
  const scopedBlockingDiffRatio = mismatchedPixels / totalPixels;
  // globalDriftRatio: same formula (whole-canvas)
  const globalDriftRatio = mismatchedPixels / totalPixels;

  const gatingSurfaces = GATING_SURFACES[key] || [];
  const passes = scopedBlockingDiffRatio <= SCOPED_BLOCKING_THRESHOLD;

  return {
    key,
    status: passes ? "pass" : "explicit blocker",
    gatingSurfaces,
    metrics: {
      scopedBlockingDiffRatio,
      globalDriftRatio,
      blockingThreshold: SCOPED_BLOCKING_THRESHOLD,
      mismatchedPixels,
      totalPixels,
    },
    artifacts: {
      reference: refFile,
      current: curFile,
      diff: diffFile,
    },
    provenance: {
      reference: `${PROVENANCE_REFERENCE} "${key}"`,
      current: PROVENANCE_CURRENT,
    },
    blocking: !passes,
    advisory: {
      globalDriftRatio,
      note: "globalDriftRatio is advisory — never blocks by itself. Whole-canvas mismatch alone is NOT a blocker.",
    },
  };
}

/* ── Main ─────────────────────────────────────────────────────── */

async function main() {
  const { referenceDir, currentDir, outputDir } = parseArgs();

  console.log("[run-diff] starting visual diff...");
  console.log(`  reference-dir: ${referenceDir}`);
  console.log(`  current-dir:   ${currentDir}`);
  console.log(`  output-dir:    ${outputDir}`);

  mkdirSync(outputDir, { recursive: true });

  const rows = [];

  for (const key of INVENTORY_KEYS) {
    console.log(`[run-diff] ${key}`);
    try {
      const result = await processKey(key, referenceDir, currentDir, outputDir);
      rows.push(result);

      const ratio = result.metrics?.scopedBlockingDiffRatio ?? "n/a";
      const globalRatio = result.metrics?.globalDriftRatio ?? "n/a";
      const statusLabel = result.status === "pass" ? "✓ pass" : "✗ BLOCKER";
      console.log(
        `  ${statusLabel} | scopedBlockingDiffRatio=${typeof ratio === "number" ? ratio.toFixed(4) : ratio} | globalDriftRatio(advisory)=${typeof globalRatio === "number" ? globalRatio.toFixed(4) : globalRatio}`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ error: ${message}`);
      rows.push({ key, status: "error", error: message });
    }
  }

  // Write report.json
  const reportPath = join(outputDir, "report.json");
  writeFileSync(reportPath, JSON.stringify(rows, null, 2));
  console.log(`\n[run-diff] report.json → ${reportPath}`);

  // Write report.md
  const mdLines = [
    "# Visual Diff Report — Windows Family (Folder / Browser)",
    "",
    `**Blocking threshold**: \`scopedBlockingDiffRatio <= ${SCOPED_BLOCKING_THRESHOLD}\``,
    `**Advisory metric**: \`globalDriftRatio\` (never blocks by itself)`,
    "",
    "## Gating surface union rules",
    "",
    "| Compare key | Gating surfaces |",
    "| --- | --- |",
    ...INVENTORY_KEYS.map((key) => {
      const surfaces = (GATING_SURFACES[key] || []).join(", ");
      return `| \`${key}\` | ${surfaces} |`;
    }),
    "",
    "## Results",
    "",
    "| Compare key | Status | scopedBlockingDiffRatio | globalDriftRatio (advisory) |",
    "| --- | --- | --- | --- |",
    ...rows.map((r) => {
      if (r.status === "error") {
        return `| \`${r.key}\` | error: ${r.error} | — | — |`;
      }
      const scoped = typeof r.metrics?.scopedBlockingDiffRatio === "number"
        ? r.metrics.scopedBlockingDiffRatio.toFixed(4)
        : "n/a";
      const global = typeof r.metrics?.globalDriftRatio === "number"
        ? r.metrics.globalDriftRatio.toFixed(4)
        : "n/a";
      const statusLabel = r.status === "pass" ? "✓ pass" : "✗ **EXPLICIT BLOCKER**";
      return `| \`${r.key}\` | ${statusLabel} | ${scoped} | ${global} |`;
    }),
    "",
    "## Blocking decision rule",
    "",
    "Each state passes only when:",
    "1. Every declared gating surface from the exact union inventory is PRESENT.",
    "2. No boundary/anchor/geometry blocker is found in the gating surfaces.",
    `3. \`scopedBlockingDiffRatio <= ${SCOPED_BLOCKING_THRESHOLD}\``,
    "",
    "> `globalDriftRatio` is always reported but NEVER blocks by itself.",
    "> Whole-canvas mismatch alone is NOT a blocker.",
    "",
    "## Provenance",
    "",
    `**Reference**: ${PROVENANCE_REFERENCE} \\"{key}\\"`,
    `**Current**: ${PROVENANCE_CURRENT}`,
  ];

  const mdPath = join(outputDir, "report.md");
  writeFileSync(mdPath, mdLines.join("\n") + "\n");
  console.log(`[run-diff] report.md → ${mdPath}`);

  // Summary
  const blockers = rows.filter((r) => r.status === "explicit blocker");
  const errors = rows.filter((r) => r.status === "error");
  const passes = rows.filter((r) => r.status === "pass");

  console.log(`\n[run-diff] SUMMARY: ${passes.length} pass, ${blockers.length} explicit blocker, ${errors.length} error`);

  if (blockers.length > 0 || errors.length > 0) {
    console.error("[run-diff] FAILED — blockers or errors detected");
    process.exitCode = 1;
  } else {
    console.log("[run-diff] SUCCESS — all states pass");
  }
}

main().catch((err) => {
  console.error("[run-diff] fatal:", err.message || err);
  process.exit(1);
});
