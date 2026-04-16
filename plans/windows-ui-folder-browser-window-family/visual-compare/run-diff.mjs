import fs from 'fs';
import { createRequire } from 'module';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// visual-compare/ -> windows-ui-folder-browser-window-family (plans subdir) -> plans -> ROOT
const projectRoot = resolve(__dirname, '../../..');
const pnpmStore = join(projectRoot, 'node_modules/.pnpm');

const pixelmatchPath = join(pnpmStore, 'pixelmatch@7.1.0/node_modules/pixelmatch/index.js');
const pngjsMainPath = join(pnpmStore, 'pngjs@7.0.0/node_modules/pngjs/lib/png.js');

const { default: pixelmatch } = await import(pathToFileURL(pixelmatchPath).href);
const requireCJS = createRequire(import.meta.url);
const { PNG } = requireCJS(pngjsMainPath);

const [, , refPath, curPath, diffPath = "diff.png", thresholdStr = "0.2"] = process.argv;

if (!refPath || !curPath) {
  console.error("Usage: node run-diff.mjs <reference> <current> [diff] [threshold]");
  process.exit(1);
}

const ref = PNG.sync.read(fs.readFileSync(refPath));
const cur = PNG.sync.read(fs.readFileSync(curPath));

const width = Math.max(ref.width, cur.width);
const height = Math.max(ref.height, cur.height);

function padImage(img, w, h) {
  if (img.width === w && img.height === h) return img;
  const padded = new PNG({ width: w, height: h, fill: true });
  for (let i = 0; i < padded.data.length; i += 4) {
    padded.data[i] = 255; padded.data[i + 1] = 255;
    padded.data[i + 2] = 255; padded.data[i + 3] = 255;
  }
  PNG.bitblt(img, padded, 0, 0, img.width, img.height, 0, 0);
  return padded;
}

const refPadded = padImage(ref, width, height);
const curPadded = padImage(cur, width, height);
const diff = new PNG({ width, height });

const mismatchedPixels = pixelmatch(
  refPadded.data, curPadded.data, diff.data, width, height,
  { threshold: parseFloat(thresholdStr), includeAA: false }
);

fs.writeFileSync(diffPath, PNG.sync.write(diff));

const totalPixels = width * height;
const mismatchRate = ((mismatchedPixels / totalPixels) * 100).toFixed(2);

console.log(JSON.stringify({
  reference: { width: ref.width, height: ref.height },
  current: { width: cur.width, height: cur.height },
  sizeMismatch: ref.width !== cur.width || ref.height !== cur.height,
  mismatchedPixels,
  totalPixels,
  mismatchRate: `${mismatchRate}%`,
  diffImage: diffPath,
  passed: parseFloat(mismatchRate) < 1,
}, null, 2));
