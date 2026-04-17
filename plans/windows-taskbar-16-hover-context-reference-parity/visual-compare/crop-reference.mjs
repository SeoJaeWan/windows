/**
 * crop-reference.mjs
 *
 * Crops the blog attached-host composition region (taskbar strip + panel)
 * from a full-viewport screenshot and letterboxes to the target canvas size.
 *
 * Usage: node crop-reference.mjs
 */

import fs from "fs";
import path from "path";
import { PNG } from "pngjs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Target canvas size — matches current Storybook compare harness.
 */
const TARGET_W = 1248;
const TARGET_H = 340;

/**
 * Crop params derived from live measurement:
 *   hover panel: x=616, y=589.5, w=200, h=150.5  taskbar: y=750, h=50
 *   context panel: x=566, y=415, w=300, h=325     taskbar: y=750, h=50
 *   viewport: 1280×800
 */
const CASES = [
  {
    name: "hover",
    src: "C:/Users/USER/AppData/Local/Temp/blog-hover-state.png",
    dest: path.join(__dirname, "taskbar-hover-preview--attached-multi-reference.png"),
    // Composition region: panel top to viewport bottom
    cropY: 580,  // panel top ~589, give 9px headroom
    cropH: 220,  // 800 - 580
    cropX: 0,
    cropW: 1280,
  },
  {
    name: "context",
    src: "C:/Users/USER/AppData/Local/Temp/blog-ctx-success.png",
    dest: path.join(__dirname, "taskbar-context-menu--attached-pinned-reference.png"),
    // Composition region: panel top to viewport bottom
    cropY: 405,  // panel top ~415, give 10px headroom
    cropH: 395,  // 800 - 405
    cropX: 0,
    cropW: 1280,
  },
];

/**
 * Crop a PNG to the specified region.
 */
function crop(img, x, y, w, h) {
  const out = new PNG({ width: w, height: h });
  for (let row = 0; row < h; row++) {
    const srcRow = y + row;
    if (srcRow >= img.height) break;
    for (let col = 0; col < w; col++) {
      const srcCol = x + col;
      if (srcCol >= img.width) break;
      const srcIdx = (srcRow * img.width + srcCol) * 4;
      const dstIdx = (row * w + col) * 4;
      out.data[dstIdx] = img.data[srcIdx];
      out.data[dstIdx + 1] = img.data[srcIdx + 1];
      out.data[dstIdx + 2] = img.data[srcIdx + 2];
      out.data[dstIdx + 3] = img.data[srcIdx + 3];
    }
  }
  return out;
}

/**
 * Scale image to fit target dimensions, center with white letterbox.
 * Preserves aspect ratio.
 */
function letterbox(img, targetW, targetH) {
  const scaleX = targetW / img.width;
  const scaleY = targetH / img.height;
  const scale = Math.min(scaleX, scaleY);

  const scaledW = Math.round(img.width * scale);
  const scaledH = Math.round(img.height * scale);

  // Scale the image using nearest-neighbor
  const scaled = new PNG({ width: scaledW, height: scaledH });
  for (let row = 0; row < scaledH; row++) {
    for (let col = 0; col < scaledW; col++) {
      const srcRow = Math.floor(row / scale);
      const srcCol = Math.floor(col / scale);
      const srcIdx = (Math.min(srcRow, img.height - 1) * img.width + Math.min(srcCol, img.width - 1)) * 4;
      const dstIdx = (row * scaledW + col) * 4;
      scaled.data[dstIdx] = img.data[srcIdx];
      scaled.data[dstIdx + 1] = img.data[srcIdx + 1];
      scaled.data[dstIdx + 2] = img.data[srcIdx + 2];
      scaled.data[dstIdx + 3] = img.data[srcIdx + 3];
    }
  }

  // Place in white canvas
  const out = new PNG({ width: targetW, height: targetH });
  // Fill white
  for (let i = 0; i < out.data.length; i += 4) {
    out.data[i] = 255;
    out.data[i + 1] = 255;
    out.data[i + 2] = 255;
    out.data[i + 3] = 255;
  }

  const offsetX = Math.floor((targetW - scaledW) / 2);
  const offsetY = Math.floor((targetH - scaledH) / 2);

  for (let row = 0; row < scaledH; row++) {
    for (let col = 0; col < scaledW; col++) {
      const srcIdx = (row * scaledW + col) * 4;
      const dstRow = offsetY + row;
      const dstCol = offsetX + col;
      if (dstRow >= targetH || dstCol >= targetW) continue;
      const dstIdx = (dstRow * targetW + dstCol) * 4;
      out.data[dstIdx] = scaled.data[srcIdx];
      out.data[dstIdx + 1] = scaled.data[srcIdx + 1];
      out.data[dstIdx + 2] = scaled.data[srcIdx + 2];
      out.data[dstIdx + 3] = scaled.data[srcIdx + 3];
    }
  }

  return { out, scaledW, scaledH, offsetX, offsetY };
}

for (const c of CASES) {
  console.log(`\n--- Processing: ${c.name} ---`);

  if (!fs.existsSync(c.src)) {
    console.error(`  ERROR: source not found: ${c.src}`);
    continue;
  }

  const img = PNG.sync.read(fs.readFileSync(c.src));
  console.log(`  Source: ${img.width}×${img.height}`);

  // Clamp crop bounds to image
  const cropY = Math.min(c.cropY, img.height - 1);
  const cropH = Math.min(c.cropH, img.height - cropY);
  const cropX = Math.min(c.cropX, img.width - 1);
  const cropW = Math.min(c.cropW, img.width - cropX);

  const cropped = crop(img, cropX, cropY, cropW, cropH);
  console.log(`  Cropped: ${cropped.width}×${cropped.height} (x=${cropX}, y=${cropY})`);

  const { out, scaledW, scaledH, offsetX, offsetY } = letterbox(cropped, TARGET_W, TARGET_H);
  console.log(`  Letterboxed: ${out.width}×${out.height} (scaled=${scaledW}×${scaledH}, offset=${offsetX},${offsetY})`);

  fs.writeFileSync(c.dest, PNG.sync.write(out));
  console.log(`  Written: ${c.dest}`);
}

console.log("\nDone.");
