/**
 * capture-phase5.mjs
 *
 * Phase 5 current capture script.
 * Uses @playwright/test (already in devDependencies).
 *
 * Clips from x=0, y=0 using the stage dimensions to match baseline dimensions.
 */

import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STORYBOOK_URL = 'http://localhost:6008';
const SELECTOR = '[data-visual-root]';
const OUTPUT_DIR = path.resolve(__dirname, 'visual-compare');

const CAPTURES = [
  {
    storyId: 'windows-folder--compare-desktop-blog',
    viewport: { width: 1280, height: 750 },
    outputFile: 'folder-desktop-blog-current.png',
  },
  {
    storyId: 'windows-folder--compare-mobile-blog',
    viewport: { width: 390, height: 794 },
    outputFile: 'folder-mobile-blog-current.png',
  },
  {
    storyId: 'windows-browser--compare-desktop-article',
    viewport: { width: 1280, height: 750 },
    outputFile: 'browser-desktop-article-current.png',
  },
  {
    storyId: 'windows-browser--compare-mobile-article',
    viewport: { width: 390, height: 794 },
    outputFile: 'browser-mobile-article-current.png',
  },
];

async function captureStory(page, { storyId, viewport, outputFile }) {
  const url = `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`;
  const outputPath = path.join(OUTPUT_DIR, outputFile);

  await page.setViewportSize(viewport);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector(SELECTOR);

  const stageDims = await page.evaluate(() => {
    const root = document.querySelector('[data-visual-root]');
    if (!root) return null;
    const stage = root.parentElement;
    if (!stage) return null;
    const rect = stage.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });

  if (!stageDims || stageDims.width === 0 || stageDims.height === 0) {
    throw new Error(`Stage element has no valid dimensions for story: ${storyId}`);
  }

  // Clip from origin (0,0) using stage dimensions to match baseline
  await page.screenshot({
    path: outputPath,
    clip: {
      x: 0,
      y: 0,
      width: stageDims.width,
      height: stageDims.height,
    },
  });
  console.log(`Captured: ${outputFile} (${stageDims.width}x${stageDims.height})`);
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    for (const capture of CAPTURES) {
      await captureStory(page, capture);
    }
    console.log(`\nAll ${CAPTURES.length} captures complete.`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
