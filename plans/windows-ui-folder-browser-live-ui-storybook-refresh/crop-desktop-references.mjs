#!/usr/bin/env node
/**
 * crop-desktop-references.mjs
 *
 * Crops the OS taskbar strip from desktop reference PNGs and the
 * matching current PNGs to the same height so both sides are isomorphic
 * before pixelmatch comparison.
 *
 * Crop map (determined by pixel brightness transition analysis):
 *   folder/desktop-card           : 1280x750 → 1280x621 (remove 129px desktop-bg + taskbar)
 *   folder/desktop-search-open    : 1280x750 → 1280x621 (same transition point)
 *   browser/desktop-chrome        : 1280x750 → 1280x700 (remove 50px taskbar overlay)
 *   browser/desktop-address-open  : 1280x750 → 1280x700 (same transition point)
 *
 * Mobile PNGs (folder/mobile-card, browser/mobile-chrome) are NOT modified
 * because they were captured via iPhone viewport and do not include the OS taskbar.
 */

import fs from "fs";
import path from "path";
import { PNG } from "pngjs";

const VISUAL_DIR = new URL(
  "./visual-compare/",
  import.meta.url
).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const CROP_MAP = [
  {
    base: "folder-desktop-card",
    newHeight: 621,
  },
  {
    base: "folder-desktop-search-open",
    newHeight: 621,
  },
  {
    base: "browser-desktop-chrome",
    newHeight: 700,
  },
  {
    base: "browser-desktop-address-open",
    newHeight: 700,
  },
];

function cropPng(inputPath, newHeight) {
  const data = fs.readFileSync(inputPath);
  const src = PNG.sync.read(data);

  if (src.height === newHeight) {
    console.log(`  [skip] ${path.basename(inputPath)} already ${src.height}px tall`);
    return { width: src.width, height: src.height, changed: false };
  }

  if (src.height < newHeight) {
    console.error(`  [error] ${path.basename(inputPath)} is ${src.height}px — cannot crop to ${newHeight}px`);
    process.exit(1);
  }

  const dst = new PNG({ width: src.width, height: newHeight });
  PNG.bitblt(src, dst, 0, 0, src.width, newHeight, 0, 0);
  fs.writeFileSync(inputPath, PNG.sync.write(dst));
  console.log(
    `  [crop] ${path.basename(inputPath)}: ${src.width}x${src.height} → ${dst.width}x${dst.height}`
  );
  return { width: dst.width, height: dst.height, changed: true };
}

for (const { base, newHeight } of CROP_MAP) {
  console.log(`\nProcessing ${base} → height=${newHeight}`);
  for (const suffix of ["reference", "current"]) {
    const file = path.join(VISUAL_DIR, `${base}-${suffix}.png`);
    if (!fs.existsSync(file)) {
      console.error(`  [error] file not found: ${file}`);
      process.exit(1);
    }
    cropPng(file, newHeight);
  }
}

console.log("\nDone. Reference and current PNGs cropped to isomorphic heights.");
