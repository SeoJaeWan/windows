#!/usr/bin/env node
/**
 * capture-current.mjs
 *
 * Phase 4 capture script for the windows Figma review.
 *
 * Reads canonical compare story IDs and compare stage sizes from
 * windowFigmaReviewRegistration.ts (via lightweight regex extraction)
 * so no string literals are duplicated here.
 *
 * For each of the 6 canonical compare states:
 *   - Opens the story in the Storybook iframe (port 6008 custom static server)
 *   - Targets [data-window-compare-stage="desktop"|"mobile"] (owned by compareWindowStage.tsx)
 *   - Saves current-state PNG to visual-compare/{kind}-{state}-current.png
 *
 * Stage selector owner: compareWindowStage.tsx
 * Reference: windowFigmaReviewRegistration.ts (COMPARE_STORY_IDS, CANONICAL_COMPARE_STATES, COMPARE_STAGE_SIZE)
 *
 * Prerequisites:
 *   - The Phase 3 storybook-static build must be running on port 6008 via
 *     the custom static server (node /tmp/storybook-server-6008.mjs).
 *   - The custom server preserves query strings (no redirect for .html?id=...).
 */

import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Read canonical values from registration file ─────────────────────
// Extracted from the TS source using regex to avoid duplicating literals.

const REGISTRATION_PATH = path.resolve(
  __dirname,
  "../../packages/ui/src/components/windows/storybook/windowFigmaReviewRegistration.ts"
);

const registrationSource = fs.readFileSync(REGISTRATION_PATH, "utf8");

function extractStringArrayExport(src, exportName) {
  const m = src.match(
    new RegExp(`export const ${exportName}\\s*=\\s*\\[([^\\]]+)\\]`, "s")
  );
  if (!m) throw new Error(`Could not extract ${exportName} from registration`);
  return m[1]
    .split(/,\s*/)
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function extractObjectExport(src, exportName) {
  const m = src.match(
    new RegExp(
      `export const ${exportName}\\s*=\\s*\\{([^}]+)\\}`,
      "s"
    )
  );
  if (!m) throw new Error(`Could not extract ${exportName} from registration`);
  const result = {};
  const pairs = m[1].matchAll(/"([^"]+)":\s*"([^"]+)"/g);
  for (const [, k, v] of pairs) {
    result[k] = v;
  }
  return result;
}

function extractStageSize(src) {
  const desktopM = src.match(/desktop:\s*\{\s*width:\s*(\d+),\s*height:\s*(\d+)/);
  const mobileM = src.match(/mobile:\s*\{\s*width:\s*(\d+),\s*height:\s*(\d+)/);
  if (!desktopM || !mobileM)
    throw new Error("Could not extract COMPARE_STAGE_SIZE from registration");
  return {
    desktop: {
      width: parseInt(desktopM[1], 10),
      height: parseInt(desktopM[2], 10),
    },
    mobile: {
      width: parseInt(mobileM[1], 10),
      height: parseInt(mobileM[2], 10),
    },
  };
}

const CANONICAL_COMPARE_STATES = extractStringArrayExport(
  registrationSource,
  "CANONICAL_COMPARE_STATES"
);
const COMPARE_STORY_IDS = extractObjectExport(registrationSource, "COMPARE_STORY_IDS");
const COMPARE_STAGE_SIZE = extractStageSize(registrationSource);

console.log("Canonical compare states:", CANONICAL_COMPARE_STATES);
console.log("Stage sizes:", JSON.stringify(COMPARE_STAGE_SIZE));

// ── Output directory ─────────────────────────────────────────────────

const OUT_DIR = path.resolve(__dirname, "visual-compare");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Storybook base URL ───────────────────────────────────────────────
// Uses Phase 3 storybook-static build served on port 6008 via custom Node.js server.
// Port 6008 preserves query strings (unlike serve/http-server which redirect iframe.html -> iframe).

const STORYBOOK_BASE = "http://localhost:6008";

// ── Helpers ──────────────────────────────────────────────────────────

function stateToViewport(stateKey) {
  return stateKey.includes("/mobile") ? "mobile" : "desktop";
}

function artifactKey(stateKey) {
  // "folder/desktop-blog" -> "folder-desktop-blog"
  return stateKey.replace("/", "-");
}

function stageSelector(viewport) {
  // Stage selector owned exclusively by compareWindowStage.tsx
  return `[data-window-compare-stage="${viewport}"]`;
}

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: "inherit", timeout: 60000, ...opts });
}

function runCapture(stateKey) {
  const storyId = COMPARE_STORY_IDS[stateKey];
  if (!storyId) throw new Error(`No story ID for state: ${stateKey}`);

  const viewport = stateToViewport(stateKey);
  const selector = stageSelector(viewport);
  const key = artifactKey(stateKey);
  const outFile = path.join(OUT_DIR, `${key}-current.png`);

  const url = `${STORYBOOK_BASE}/iframe.html?id=${storyId}&viewMode=story`;

  console.log(`\nCapturing: ${stateKey}`);
  console.log(`  Story ID: ${storyId}`);
  console.log(`  Viewport: ${viewport} (${COMPARE_STAGE_SIZE[viewport].width}x${COMPARE_STAGE_SIZE[viewport].height})`);
  console.log(`  Selector: ${selector}`);
  console.log(`  Output:   ${outFile}`);

  const size = COMPARE_STAGE_SIZE[viewport];

  // Set viewport to match stage size
  run(`npx agent-browser set viewport ${size.width} ${size.height}`);

  // Open the iframe URL directly — custom server on port 6008 preserves query strings
  run(`npx agent-browser open "${url}"`);

  // Wait for story to fully render (React hydration + image load)
  run(`npx agent-browser wait 5000`);

  // Capture the stage element (owned by compareWindowStage.tsx)
  run(`npx agent-browser screenshot "${selector}" "${outFile}"`);

  console.log(`  Saved: ${outFile}`);
  return outFile;
}

// ── Main ─────────────────────────────────────────────────────────────

const results = [];

for (const stateKey of CANONICAL_COMPARE_STATES) {
  try {
    const outFile = runCapture(stateKey);
    results.push({ stateKey, status: "ok", file: outFile });
  } catch (err) {
    console.error(`FAILED: ${stateKey}`, err.message);
    results.push({ stateKey, status: "failed", error: err.message });
  }
}

console.log("\n── Capture summary ─────────────────────────────────────");
for (const r of results) {
  console.log(`  ${r.status === "ok" ? "OK" : "FAIL"} ${r.stateKey}`);
  if (r.error) console.log(`       ${r.error}`);
}

const failed = results.filter((r) => r.status === "failed");
if (failed.length > 0) {
  console.error(`\n${failed.length} capture(s) failed.`);
  process.exit(1);
}

console.log("\nAll captures complete.");
