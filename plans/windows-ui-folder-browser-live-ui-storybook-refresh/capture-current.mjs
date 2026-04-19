/**
 * capture-current.mjs
 *
 * Captures current Storybook story canvases for the 6 canonical Folder/Browser
 * compare states. Opens each exact story by ID, scopes capture to
 * [data-window-compare-stage], and writes *-current.png artifacts.
 *
 * Usage:
 *   node plans/windows-ui-folder-browser-live-ui-storybook-refresh/capture-current.mjs
 *
 * Prerequisites:
 *   - Storybook running on http://localhost:6009
 *   - npx agent-browser available in PATH
 *   - Output directory exists: plans/.../visual-compare/
 *
 * Canonical story IDs (from Phase 3):
 *   - windows-compose-folder--compare-desktop-card
 *   - windows-compose-folder--compare-desktop-search-open
 *   - windows-compose-folder--compare-mobile-card
 *   - windows-compose-browser--compare-desktop-chrome
 *   - windows-compose-browser--compare-desktop-address-open
 *   - windows-compose-browser--compare-mobile-chrome
 *
 * Capture selector: [data-window-compare-stage]
 *   - desktop states: [data-window-compare-stage="desktop"] (1280 × 750 px)
 *   - mobile states:  [data-window-compare-stage="mobile"]  (390 × 794 px)
 *
 * Viewport rules:
 *   - desktop stories: set viewport 1280 800 before opening
 *   - mobile stories:  set device "iPhone 12" before opening
 */

import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "visual-compare");
const SB_BASE = "http://localhost:6009/iframe.html";

const STATES = [
  {
    key: "folder/desktop-card",
    storyId: "windows-compose-folder--compare-desktop-card",
    viewport: "desktop",
    outFile: "folder-desktop-card-current.png",
  },
  {
    key: "folder/desktop-search-open",
    storyId: "windows-compose-folder--compare-desktop-search-open",
    viewport: "desktop",
    outFile: "folder-desktop-search-open-current.png",
  },
  {
    key: "folder/mobile-card",
    storyId: "windows-compose-folder--compare-mobile-card",
    viewport: "mobile",
    outFile: "folder-mobile-card-current.png",
  },
  {
    key: "browser/desktop-chrome",
    storyId: "windows-compose-browser--compare-desktop-chrome",
    viewport: "desktop",
    outFile: "browser-desktop-chrome-current.png",
  },
  {
    key: "browser/desktop-address-open",
    storyId: "windows-compose-browser--compare-desktop-address-open",
    viewport: "desktop",
    outFile: "browser-desktop-address-open-current.png",
  },
  {
    key: "browser/mobile-chrome",
    storyId: "windows-compose-browser--compare-mobile-chrome",
    viewport: "mobile",
    outFile: "browser-mobile-chrome-current.png",
  },
];

function run(cmd) {
  try {
    const result = execSync(cmd, { encoding: "utf8", timeout: 30000 });
    return result.trim();
  } catch (err) {
    throw new Error(`Command failed: ${cmd}\n${err.message}`);
  }
}

async function captureAll() {
  console.log("Starting current capture for 6 canonical Folder/Browser states...\n");

  for (const state of STATES) {
    const url = `${SB_BASE}?id=${state.storyId}&viewMode=story`;
    const outPath = join(OUTPUT_DIR, state.outFile).replace(/\\/g, "/");

    console.log(`Capturing: ${state.key}`);
    console.log(`  Story ID: ${state.storyId}`);
    console.log(`  Viewport: ${state.viewport}`);
    console.log(`  Output:   ${outPath}`);

    // Set viewport
    if (state.viewport === "mobile") {
      run(`npx agent-browser set device "iPhone 12"`);
    } else {
      run(`npx agent-browser set viewport 1280 800`);
    }

    // Open story
    run(`npx agent-browser open "${url}"`);

    // Wait for compare stage marker
    run(`npx agent-browser wait "[data-window-compare-stage]"`);

    // Capture
    run(`npx agent-browser screenshot "[data-window-compare-stage]" "${outPath}"`);

    console.log(`  Done.\n`);
  }

  console.log("All 6 current captures complete.");
}

captureAll().catch((err) => {
  console.error("Capture failed:", err.message);
  process.exit(1);
});
