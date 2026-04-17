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
 * Inner owner metadata contract (Gap A — asserted before every screenshot):
 *   For each case, after the page loads and before screenshot, this script:
 *   1. finds [data-window-compare-stage="<stageAttr>"] [data-visual-root] inside the stage
 *   2. asserts exactly ONE such element exists
 *   3. asserts data-visual-kind === expected kind (e.g. "folder" / "browser")
 *   4. asserts data-visual-state === expected state (e.g. "desktop-blog" / "mobile-blog" / ...)
 *   If any assertion fails the script aborts with a clear error — no mislabeled PNG is produced.
 *   The inner owner metadata is read from CompareRoot (packages/ui) which owns
 *   [data-visual-root][data-visual-kind][data-visual-state]; consumer attrs are not consulted.
 *
 * Story IDs (exact):
 *   - windows-folder--compare-desktop-blog     → folder/desktop-blog
 *   - windows-folder--compare-mobile-blog      → folder/mobile-blog
 *   - windows-browser--compare-desktop-article → browser/desktop-article
 *   - windows-browser--compare-mobile-article  → browser/mobile-article
 *
 * Viewport rule (per-case):
 *   - desktop cases → browser viewport 1280x800 (md+ breakpoints active)
 *   - mobile cases  → browser viewport 390x820 (below md breakpoint; wide enough to hold 390×794 stage)
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
    viewportW: 1280,
    viewportH: 800,
  },
  {
    storyId: "windows-folder--compare-mobile-blog",
    stageAttr: "mobile",
    kind: "folder",
    state: "mobile-blog",
    viewportW: 390,
    viewportH: 820,
  },
  {
    storyId: "windows-browser--compare-desktop-article",
    stageAttr: "desktop",
    kind: "browser",
    state: "desktop-article",
    viewportW: 1280,
    viewportH: 800,
  },
  {
    storyId: "windows-browser--compare-mobile-article",
    stageAttr: "mobile",
    kind: "browser",
    state: "mobile-article",
    viewportW: 390,
    viewportH: 820,
  },
];

function run(cmd) {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function runCapture(cmd) {
  console.log(`  $ ${cmd}`);
  return execSync(cmd, { encoding: "utf-8" });
}

/**
 * Asserts that inside [data-window-compare-stage="<stageAttr>"] there is exactly one
 * [data-visual-root] element whose data-visual-kind and data-visual-state match the
 * expected values. Aborts the process with a clear error if any assertion fails.
 *
 * Uses `agent-browser eval` with an arrow-function expression (no double-quotes in JS
 * body; uses unquoted attribute selectors and dataset API to avoid shell quoting issues).
 * The inner owner metadata is read from CompareRoot (packages/ui) which owns
 * [data-visual-root][data-visual-kind][data-visual-state]; consumer attrs are not consulted.
 */
function assertInnerOwnerMetadata({ stageAttr, kind, state }) {
  // Arrow function IIFE — avoids trailing `))` that confuses agent-browser CLI parser.
  // Uses unquoted CSS attribute selector (valid CSS; no nested quotes needed in shell cmd).
  // Uses dataset.visualKind / dataset.visualState instead of getAttribute to avoid single-quote
  // nesting inside the double-quoted outer shell argument.
  const jsExpr =
    `(() => { ` +
    `var s = document.querySelector('[data-window-compare-stage=${stageAttr}]'); ` +
    `var r = s ? s.querySelectorAll('[data-visual-root]') : []; ` +
    `return JSON.stringify({ ` +
    `count: r.length, ` +
    `stageFound: !!s, ` +
    `kind: r[0] ? r[0].dataset.visualKind : null, ` +
    `state: r[0] ? r[0].dataset.visualState : null ` +
    `}); ` +
    `})()`;

  const evalCmd = `npx agent-browser --session ${SESSION} eval "${jsExpr}"`;
  console.log(`  [assert] inner owner metadata for stage="${stageAttr}" — expected kind="${kind}" state="${state}"`);

  let rawOutput;
  try {
    rawOutput = runCapture(evalCmd);
  } catch (err) {
    console.error(`\n[ABORT] agent-browser eval failed for ${kind}/${state}:`);
    console.error(err.message);
    process.exit(1);
  }

  // agent-browser eval prints the result to stdout; parse the last JSON-looking line
  const lines = rawOutput.trim().split("\n");
  let parsed = null;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    // JSON result from agent-browser is quoted: "{ ... }" — strip surrounding quotes
    const unquoted = line.startsWith('"') && line.endsWith('"')
      ? line.slice(1, -1).replace(/\\"/g, '"')
      : line;
    if (unquoted.startsWith("{")) {
      try {
        parsed = JSON.parse(unquoted);
        break;
      } catch (_) {
        // not JSON, keep looking
      }
    }
  }

  if (!parsed) {
    console.error(`\n[ABORT] could not parse eval output for ${kind}/${state}. Raw output:`);
    console.error(rawOutput);
    process.exit(1);
  }

  if (!parsed.stageFound) {
    console.error(`\n[ABORT] stage [data-window-compare-stage="${stageAttr}"] not found for ${kind}/${state}`);
    process.exit(1);
  }

  if (parsed.count === 0) {
    console.error(`\n[ABORT] no [data-visual-root] inside stage="${stageAttr}" for ${kind}/${state}`);
    process.exit(1);
  }

  if (parsed.count > 1) {
    console.error(`\n[ABORT] expected exactly 1 [data-visual-root] inside stage="${stageAttr}" for ${kind}/${state}, found ${parsed.count}`);
    process.exit(1);
  }

  if (parsed.kind !== kind) {
    console.error(`\n[ABORT] data-visual-kind mismatch for ${kind}/${state}: expected "${kind}", got "${parsed.kind}"`);
    process.exit(1);
  }

  if (parsed.state !== state) {
    console.error(`\n[ABORT] data-visual-state mismatch for ${kind}/${state}: expected "${state}", got "${parsed.state}"`);
    process.exit(1);
  }

  console.log(`  [assert] PASS — count=1, kind="${parsed.kind}", state="${parsed.state}"`);
}

for (const { storyId, stageAttr, kind, state, viewportW, viewportH } of CASES) {
  const url = `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`;
  // Package-owned reserved marker — sole capture selector owner per Phase 2 contract
  const selector = `[data-window-compare-stage="${stageAttr}"]`;
  const outFile = path.join(OUT_DIR, `${kind}-${state}-current.png`);

  console.log(`\n[capture] ${kind}/${state}`);
  console.log(`  story  : ${storyId}`);
  console.log(`  viewport: ${viewportW}x${viewportH}  (per-case viewport — ${stageAttr} breakpoint)`);
  console.log(`  selector: ${selector}  (package-owned reserved marker)`);
  console.log(`  output : ${outFile}`);

  run(`npx agent-browser --session ${SESSION} set viewport ${viewportW} ${viewportH}`);
  run(`npx agent-browser --session ${SESSION} open "${url}"`);
  run(`npx agent-browser --session ${SESSION} wait --load networkidle`);

  // Assert inner owner metadata before screenshot — Gap A fix
  // Verifies that [data-visual-root][data-visual-kind][data-visual-state] inside the stage
  // matches the expected canonical key for this case. Aborts if mismatch or ambiguity detected.
  // JS expression uses arrow function IIFE + dataset API to avoid shell quoting conflicts.
  assertInnerOwnerMetadata({ stageAttr, kind, state });

  run(`npx agent-browser --session ${SESSION} screenshot "${selector}" "${outFile}"`);
}

// Clean up session
try {
  run(`npx agent-browser --session ${SESSION} close`);
} catch (_) {
  // ignore close errors
}

console.log("\n[done] all 4 current captures written to visual-compare/");
