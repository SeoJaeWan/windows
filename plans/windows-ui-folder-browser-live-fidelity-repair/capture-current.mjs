/**
 * capture-current.mjs
 *
 * Phase 4 current capture script.
 * Captures the canonical 4-state current Storybook compare stories
 * for the windows-ui-folder-browser-live-fidelity-repair plan.
 *
 * Usage:
 *   node plans/windows-ui-folder-browser-live-fidelity-repair/capture-current.mjs
 *
 * Prerequisites:
 *   1. Start Storybook from the worktree:
 *      cd worktrees/windows-ui-folder-browser-live-fidelity-repair
 *      pnpm --filter @windows/ui storybook --port 6006 --ci
 *   2. Wait for Storybook to be ready at http://localhost:6006
 *   3. Run this script: node capture-current.mjs
 *
 * Note: browser/*-not-found states (browser/desktop-not-found, browser/mobile-not-found)
 * are NOT part of the canonical capture inventory. See Phase 1 missing-slug-observation.md.
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Canonical story IDs
const STORY_IDS = {
  FOLDER_DESKTOP_BLOG: 'windows-folder--compare-desktop-blog',
  FOLDER_MOBILE_BLOG: 'windows-folder--compare-mobile-blog',
  BROWSER_DESKTOP_ARTICLE: 'windows-browser--compare-desktop-article',
  BROWSER_MOBILE_ARTICLE: 'windows-browser--compare-mobile-article',
};

// Viewport definitions
const VIEWPORTS = {
  DESKTOP: { width: 1280, height: 750 },
  MOBILE: { width: 390, height: 794 },
};

// Capture configuration
const STORYBOOK_URL = 'http://localhost:6006';
const SELECTOR = '[data-visual-root]';
const OUTPUT_DIR = path.resolve(__dirname, 'visual-compare');

// Capture cases
const CAPTURES = [
  {
    storyId: STORY_IDS.FOLDER_DESKTOP_BLOG,
    viewport: VIEWPORTS.DESKTOP,
    outputFile: 'folder-desktop-blog-current.png',
  },
  {
    storyId: STORY_IDS.FOLDER_MOBILE_BLOG,
    viewport: VIEWPORTS.MOBILE,
    outputFile: 'folder-mobile-blog-current.png',
  },
  {
    storyId: STORY_IDS.BROWSER_DESKTOP_ARTICLE,
    viewport: VIEWPORTS.DESKTOP,
    outputFile: 'browser-desktop-article-current.png',
  },
  {
    storyId: STORY_IDS.BROWSER_MOBILE_ARTICLE,
    viewport: VIEWPORTS.MOBILE,
    outputFile: 'browser-mobile-article-current.png',
  },
];

async function captureStory(page, { storyId, viewport, outputFile }) {
  const url = `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`;
  const outputPath = path.join(OUTPUT_DIR, outputFile);

  await page.setViewportSize(viewport);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector(SELECTOR);

  const element = await page.$(SELECTOR);
  let box = await element.boundingBox();
  if (!box) throw new Error(`[data-visual-root] has no bounding box in story: ${storyId}`);

  if (box.width === 0 || box.height === 0) {
    const parentBox = await element.evaluate((el) => {
      const parent = el.parentElement;
      if (!parent) return null;
      const rect = parent.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });
    if (!parentBox || parentBox.width === 0 || parentBox.height === 0) {
      throw new Error(`[data-visual-root] and its parentElement both have no bounding box in story: ${storyId}`);
    }
    box = parentBox;
  }

  await page.screenshot({
    path: outputPath,
    clip: {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    },
  });
  console.log(`Captured: ${outputFile} (${box.width}x${box.height})`);
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    for (const capture of CAPTURES) {
      await captureStory(page, capture);
    }
    console.log(`\nAll ${CAPTURES.length} captures complete. Output: ${OUTPUT_DIR}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
