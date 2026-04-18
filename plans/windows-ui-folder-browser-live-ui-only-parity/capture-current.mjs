/**
 * capture-current.mjs
 *
 * Phase 4 — current capture script.
 * Captures current surface for the 6 canonical compare state keys from Storybook.
 *
 * Story IDs (exact — from Phase 3 compare inventory):
 *   windows-folder--compare-desktop-blog
 *   windows-folder--compare-desktop-search-open
 *   windows-folder--compare-mobile-blog
 *   windows-browser--compare-desktop-article
 *   windows-browser--compare-desktop-address-open
 *   windows-browser--compare-mobile-article
 *
 * Stage selector (exact — package-owned compare contract):
 *   [data-window-compare-stage="desktop"]  — desktop stories
 *   [data-window-compare-stage="mobile"]   — mobile stories
 *
 * Inner owner metadata (exact — package-owned compare contract):
 *   [data-visual-root][data-visual-kind][data-visual-state]
 *
 * Output naming: {kind}-{state}-current.png
 *   kind: "folder" | "browser"
 *   state: "desktop-blog" | "desktop-search-open" | "mobile-blog" |
 *          "desktop-article" | "desktop-address-open" | "mobile-article"
 *
 * Mobile viewport note:
 *   Baseline was captured at DPR=1 (390×794 CSS pixels = 390×794 PNG pixels).
 *   Using "set viewport 390 844" instead of "set device iPhone 12" to match DPR=1
 *   and avoid 3x pixel scaling that would produce 1170×2382 PNGs.
 */

import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "visual-compare");
const STORYBOOK_URL = "http://localhost:6007";

/**
 * Canonical capture inventory — 6 state keys, no review-only edge states.
 */
const CAPTURE_INVENTORY = [
  {
    storyId: "windows-folder--compare-desktop-blog",
    kind: "folder",
    state: "desktop-blog",
    stageSelector: '[data-window-compare-stage="desktop"]',
    viewport: "desktop",
  },
  {
    storyId: "windows-folder--compare-desktop-search-open",
    kind: "folder",
    state: "desktop-search-open",
    stageSelector: '[data-window-compare-stage="desktop"]',
    viewport: "desktop",
    // open state: harness clicks .folder-search-trigger via useEffect in story
    waitMs: 500,
  },
  {
    storyId: "windows-folder--compare-mobile-blog",
    kind: "folder",
    state: "mobile-blog",
    stageSelector: '[data-window-compare-stage="mobile"]',
    // Use viewport 390×844 (not device emulation) to match baseline DPR=1
    viewport: "mobile",
  },
  {
    storyId: "windows-browser--compare-desktop-article",
    kind: "browser",
    state: "desktop-article",
    stageSelector: '[data-window-compare-stage="desktop"]',
    viewport: "desktop",
  },
  {
    storyId: "windows-browser--compare-desktop-address-open",
    kind: "browser",
    state: "desktop-address-open",
    stageSelector: '[data-window-compare-stage="desktop"]',
    viewport: "desktop",
    // open state: harness clicks .browser-address via useEffect in story
    waitMs: 500,
  },
  {
    storyId: "windows-browser--compare-mobile-article",
    kind: "browser",
    state: "mobile-article",
    stageSelector: '[data-window-compare-stage="mobile"]',
    // Use viewport 390×844 (not device emulation) to match baseline DPR=1
    viewport: "mobile",
  },
];

function run(cmd) {
  console.log(`  > ${cmd}`);
  return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
}

function storyUrl(storyId) {
  return `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`;
}

async function captureAll() {
  console.log("=== Phase 4 — capture-current.mjs ===");
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Storybook: ${STORYBOOK_URL}`);
  console.log("");

  for (const item of CAPTURE_INVENTORY) {
    const outputFile = path.join(OUTPUT_DIR, `${item.kind}-${item.state}-current.png`);
    const url = storyUrl(item.storyId);

    console.log(`[${item.kind}/${item.state}]`);
    console.log(`  Story: ${item.storyId}`);
    console.log(`  Selector: ${item.stageSelector}`);
    console.log(`  Output: ${outputFile}`);

    // Set viewport
    // Mobile uses "set viewport 390 844" (not "set device") to avoid DPR=3 scaling.
    // Baseline was captured at DPR=1 so both sides must be DPR=1 for pixel alignment.
    if (item.viewport === "mobile") {
      run(`npx agent-browser set viewport 390 844`);
    } else {
      run(`npx agent-browser set viewport 1280 800`);
    }

    // Navigate to story
    run(`npx agent-browser open "${url}"`);

    // Wait for stage element to be present
    run(`npx agent-browser wait "${item.stageSelector}"`);

    // For open states: wait for harness useEffect to fire and open state to render
    if (item.waitMs) {
      run(`npx agent-browser wait ${item.waitMs}`);
    }

    // Capture stage element
    run(`npx agent-browser screenshot "${item.stageSelector}" "${outputFile}"`);

    console.log(`  Captured: ${outputFile}`);
    console.log("");
  }

  console.log("=== Capture complete ===");
  console.log(`6 current PNGs written to: ${OUTPUT_DIR}`);
}

captureAll().catch((err) => {
  console.error("Capture failed:", err.message);
  process.exit(1);
});
