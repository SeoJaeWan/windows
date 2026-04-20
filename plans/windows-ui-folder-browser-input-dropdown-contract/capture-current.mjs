/**
 * capture-current.mjs
 *
 * Phase 4 — current capture script
 *
 * Captures all 15 exact compare story IDs from Storybook using
 * [data-window-compare-stage] as the canonical capture owner.
 *
 * Story ID mapping:
 *   Phase contract ID                                    → Actual Storybook ID
 *   windows-folder--compare-live-blog                   → windows-compose-folder--compare-live-blog
 *   windows-browser--compare-live-article               → windows-compose-browser--compare-live-article
 *   (etc — Storybook appends "compose-" due to title path)
 *
 * Capture owner: [data-window-compare-stage]
 * Metadata carrier: nested [data-visual-root] (read-only — kind/state metadata)
 * Output dir: plans/windows-ui-folder-browser-input-dropdown-contract/visual-compare/
 * Output naming: {kind}-{state}-current.png
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "visual-compare");
const STORYBOOK_BASE = "http://localhost:6006";

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Exact story inventory — 15 states
 *
 * contract key         : {kind}/{state}
 * storyId              : exact Storybook story ID (verified via Storybook UI)
 * variant              : desktop (1280x800) | mobile (1280x800 with mobile canvas)
 * captureSelector      : canonical capture owner (always [data-window-compare-stage])
 */
const STORY_INVENTORY = [
  // Desktop Folder stories (8)
  { key: "folder/live-blog",            storyId: "windows-compose-folder--compare-live-blog",             variant: "desktop" },
  { key: "folder/live-search-open",     storyId: "windows-compose-folder--compare-live-search-open",      variant: "desktop" },
  { key: "folder/live-chip-open",       storyId: "windows-compose-folder--compare-live-chip-open",        variant: "desktop" },
  { key: "folder/live-sidebar-hover",   storyId: "windows-compose-folder--compare-live-sidebar-hover",    variant: "desktop" },
  { key: "folder/live-sidebar-expanded",storyId: "windows-compose-folder--compare-live-sidebar-expanded", variant: "desktop" },
  { key: "folder/live-thumbnail-hover", storyId: "windows-compose-folder--compare-live-thumbnail-hover",  variant: "desktop" },
  { key: "folder/mobile-blog",          storyId: "windows-compose-folder--compare-mobile-blog",           variant: "mobile"   },
  { key: "folder/mobile-search-open",   storyId: "windows-compose-folder--compare-mobile-search-open",    variant: "mobile"   },
  // Desktop Browser stories (7)
  { key: "browser/live-article",               storyId: "windows-compose-browser--compare-live-article",                variant: "desktop" },
  { key: "browser/live-address-open",          storyId: "windows-compose-browser--compare-live-address-open",           variant: "desktop" },
  { key: "browser/live-control-hover-minimize",storyId: "windows-compose-browser--compare-live-control-hover-minimize", variant: "desktop" },
  { key: "browser/live-control-hover-maximize",storyId: "windows-compose-browser--compare-live-control-hover-maximize", variant: "desktop" },
  { key: "browser/live-control-hover-close",   storyId: "windows-compose-browser--compare-live-control-hover-close",   variant: "desktop" },
  { key: "browser/mobile-article",             storyId: "windows-compose-browser--compare-mobile-article",             variant: "mobile"   },
  { key: "browser/mobile-address-open",        storyId: "windows-compose-browser--compare-mobile-address-open",        variant: "mobile"   },
];

function artifactName(key) {
  // folder/live-blog → folder-live-blog-current.png
  return key.replace("/", "-") + "-current.png";
}

function run(cmd) {
  try {
    const out = execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
    return { ok: true, out };
  } catch (e) {
    return { ok: false, out: e.stdout || "", err: e.stderr || e.message };
  }
}

async function captureStory(entry) {
  const { key, storyId, variant } = entry;
  const outputFile = join(OUTPUT_DIR, artifactName(key));
  const url = `${STORYBOOK_BASE}/iframe.html?id=${storyId}&viewMode=story`;

  console.log(`\n[capture] ${key}`);
  console.log(`  storyId   : ${storyId}`);
  console.log(`  url       : ${url}`);
  console.log(`  variant   : ${variant}`);
  console.log(`  output    : ${outputFile}`);

  // Set viewport — desktop 1280x800 for all (canvas geometry is handled
  // by [data-window-compare-stage] inline style: desktop=1024x700, mobile=375x680)
  run(`npx agent-browser set viewport 1280 800`);

  // Open the story iframe
  const openResult = run(`npx agent-browser open "${url}"`);
  if (!openResult.ok) {
    console.error(`  [FAIL] open failed: ${openResult.err}`);
    return { key, ok: false, error: "open failed" };
  }

  // Wait for network idle
  run(`npx agent-browser wait --load networkidle`);

  // Verify capture owner exists
  const boxResult = run(`npx agent-browser get box "[data-window-compare-stage]"`);
  if (!boxResult.ok) {
    console.error(`  [FAIL] [data-window-compare-stage] not found`);
    return { key, ok: false, error: "capture owner not found" };
  }
  console.log(`  stage box : ${boxResult.out.trim()}`);

  // Capture the exact stage element
  const screenshotResult = run(
    `npx agent-browser screenshot "[data-window-compare-stage]" "${outputFile}"`
  );

  if (!screenshotResult.ok) {
    console.error(`  [FAIL] screenshot failed: ${screenshotResult.err}`);
    return { key, ok: false, error: "screenshot failed" };
  }

  console.log(`  [OK] captured → ${artifactName(key)}`);
  return { key, ok: true, outputFile };
}

async function main() {
  console.log("=== Phase 4 current capture ===");
  console.log(`stories  : ${STORY_INVENTORY.length}`);
  console.log(`output   : ${OUTPUT_DIR}`);
  console.log(`selector : [data-window-compare-stage]`);

  const results = [];
  for (const entry of STORY_INVENTORY) {
    const result = await captureStory(entry);
    results.push(result);
  }

  const passed = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  console.log(`\n=== capture summary ===`);
  console.log(`passed: ${passed.length} / ${STORY_INVENTORY.length}`);

  if (failed.length > 0) {
    console.log(`failed:`);
    failed.forEach((r) => console.log(`  - ${r.key}: ${r.error}`));
    process.exit(1);
  }

  console.log("all captures complete.");
}

main().catch((e) => {
  console.error("unexpected error:", e);
  process.exit(1);
});
