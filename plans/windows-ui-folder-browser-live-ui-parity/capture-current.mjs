/**
 * capture-current.mjs
 *
 * Phase 3 — current surface capture
 *
 * Captures the exact 4 canonical compare story states from the worktree Storybook
 * running on port 6100 (worktrees/windows-ui-folder-browser-live-ui-parity).
 *
 * Capture selector: package-owned reserved marker [data-window-compare-stage="desktop"|"mobile"]
 * Stage ownership: CompareWindowDesktopStage / CompareWindowMobileStage own this marker.
 * Consumer-supplied host attrs are irrelevant — only the package-owned marker is used.
 *
 * Story IDs (exact):
 *   - windows-folder--compare-desktop-blog     → folder/desktop-blog
 *   - windows-folder--compare-mobile-blog      → folder/mobile-blog
 *   - windows-browser--compare-desktop-article → browser/desktop-article
 *   - windows-browser--compare-mobile-article  → browser/mobile-article
 *
 * Output path: plans/windows-ui-folder-browser-live-ui-parity/visual-compare/
 * Naming: {kind}-{state}-current.png
 */

import { execSync } from "child_process";
import { mkdirSync } from "fs";
import path from "path";

// Worktree Storybook — port 6100
const STORYBOOK_URL = "http://localhost:6100";
const OUT_DIR = new URL("./visual-compare/", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const SESSION = "phase3-capture";

mkdirSync(OUT_DIR, { recursive: true });

const CASES = [
  {
    storyId: "windows-folder--compare-desktop-blog",
    stageAttr: "desktop",
    kind: "folder",
    state: "desktop-blog",
  },
  {
    storyId: "windows-folder--compare-mobile-blog",
    stageAttr: "mobile",
    kind: "folder",
    state: "mobile-blog",
  },
  {
    storyId: "windows-browser--compare-desktop-article",
    stageAttr: "desktop",
    kind: "browser",
    state: "desktop-article",
  },
  {
    storyId: "windows-browser--compare-mobile-article",
    stageAttr: "mobile",
    kind: "browser",
    state: "mobile-article",
  },
];

function run(cmd) {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

for (const { storyId, stageAttr, kind, state } of CASES) {
  const url = `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`;
  // Package-owned reserved marker — sole capture selector owner per Phase 2 contract
  const selector = `[data-window-compare-stage="${stageAttr}"]`;
  const outFile = path.join(OUT_DIR, `${kind}-${state}-current.png`);

  console.log(`\n[capture] ${kind}/${state}`);
  console.log(`  story  : ${storyId}`);
  console.log(`  selector: ${selector}  (package-owned reserved marker)`);
  console.log(`  output : ${outFile}`);

  run(`npx agent-browser --session ${SESSION} set viewport 1280 800`);
  run(`npx agent-browser --session ${SESSION} open "${url}"`);
  run(`npx agent-browser --session ${SESSION} wait --load networkidle`);
  run(`npx agent-browser --session ${SESSION} screenshot "${selector}" "${outFile}"`);
}

// Clean up session
try {
  run(`npx agent-browser --session ${SESSION} close`);
} catch (_) {
  // ignore close errors
}

console.log("\n[done] all 4 current captures written to visual-compare/");
