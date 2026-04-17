/**
 * run-diff.mjs
 *
 * Pixel-level visual diff for the two canonical compare keys.
 *
 * Canonical compare key inventory (source of truth):
 *   - taskbar-hover-preview/attached-multi
 *   - taskbar-context-menu/attached-pinned
 *
 * Filename-safe stem mapping rule:
 *   canonical key "/" → "--"  (single substitution, no other transformations)
 *   taskbar-hover-preview/attached-multi  → taskbar-hover-preview--attached-multi
 *   taskbar-context-menu/attached-pinned  → taskbar-context-menu--attached-pinned
 *
 * Artifact naming: {stem}-{reference|current|diff}.png
 *
 * Current Storybook recipients:
 *   - taskbar-compose-hoverpreview--compare-attached-multi
 *     (packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.stories.tsx#CompareAttachedMulti)
 *   - taskbar-compose-contextmenu--compare-attached-pinned
 *     (packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.stories.tsx#CompareAttachedPinned)
 *
 * Capture marker contract:
 *   hover: [data-visual-root][data-visual-kind="taskbar-hover-preview"][data-visual-state="attached-multi"]
 *   context: [data-visual-root][data-visual-kind="taskbar-context-menu"][data-visual-state="attached-pinned"]
 *
 * Usage: node run-diff.mjs [threshold]
 *   threshold default: 0.1
 */

import fs from "fs";
import path from "path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const THRESHOLD = parseFloat(process.argv[2] ?? "0.1");

/**
 * Canonical compare key inventory.
 * All artifact filenames are derived from these keys via "/ -> --" substitution only.
 */
const CANONICAL_KEYS = [
  "taskbar-hover-preview/attached-multi",
  "taskbar-context-menu/attached-pinned",
];

/**
 * Convert canonical slash key to filename-safe stem.
 * Rule: replace "/" with "--" — only this substitution is allowed.
 */
function toStem(canonicalKey) {
  return canonicalKey.replace("/", "--");
}

/**
 * Pad image to target dimensions with white background.
 */
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

function runDiff(canonicalKey) {
  const stem = toStem(canonicalKey);

  const refPath = path.join(__dirname, `${stem}-reference.png`);
  const curPath = path.join(__dirname, `${stem}-current.png`);
  const diffPath = path.join(__dirname, `${stem}-diff.png`);

  if (!fs.existsSync(refPath)) {
    return { canonicalKey, stem, error: `reference not found: ${refPath}`, passed: false };
  }
  if (!fs.existsSync(curPath)) {
    return { canonicalKey, stem, error: `current not found: ${curPath}`, passed: false };
  }

  const ref = PNG.sync.read(fs.readFileSync(refPath));
  const cur = PNG.sync.read(fs.readFileSync(curPath));

  const dimensionsMatch = ref.width === cur.width && ref.height === cur.height;

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
  const mismatchRatio = (mismatchedPixels / totalPixels) * 100;
  const passed = mismatchRatio < 1.0;

  return {
    canonicalKey,
    stem,
    reference: { width: ref.width, height: ref.height },
    current: { width: cur.width, height: cur.height },
    dimensionsMatch,
    mismatchedPixels,
    totalPixels,
    mismatchRate: `${mismatchRatio.toFixed(2)}%`,
    diffImage: diffPath,
    passed,
  };
}

const results = CANONICAL_KEYS.map(runDiff);

console.log(JSON.stringify({ threshold: THRESHOLD, results }, null, 2));
