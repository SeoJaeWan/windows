/**
 * capture-current.mjs
 *
 * Current-side capture harness for the windows family (Folder, Browser) visual diff.
 *
 * Modes:
 *   --mode smoke   — current-only capture (smoke validation, no diff).
 *                    Reads/writes ONLY to --output-dir.
 *                    Does NOT read reference-captures/*.png.
 *                    Does NOT run run-diff.mjs.
 *                    Does NOT write report.json or report.md.
 *   --mode full    — current-only capture for Phase 3 full compare.
 *                    Writes current-side artifacts; diff is run separately.
 *
 * Runtime contract (locked in Phase 2 — do NOT modify in Phase 3):
 *   build output root:   packages/ui/storybook-static
 *   static server:       plans/.../visual-compare/storybook-static-server.cjs
 *   canonical origin:    http://localhost:6007
 *   ready signal:        stdout exact "SERVER_READY"
 *   capture URL shape:   http://localhost:6007/iframe.html?id={storyId}&viewMode=story
 *   capture-ready wait:  [data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]
 *   pre-screenshot:      exact [data-window-compare-stage="{stageAttr}"] contains exactly 1 matching [data-visual-root]; kind/state mismatch → abort
 *   viewport:            1280x800
 *   capture owner:       [data-window-compare-stage]
 *   metadata carrier:    nested single [data-visual-root]
 *   artifact naming:     {kind}-{state}-current.png (e.g. folder-live-blog-current.png)
 *
 * Exact 15 compare key inventory:
 *   folder/live-blog, folder/live-search-open, folder/live-chip-open,
 *   folder/live-sidebar-hover, folder/live-sidebar-expanded, folder/live-thumbnail-hover,
 *   folder/mobile-blog, folder/mobile-search-open,
 *   browser/live-article, browser/live-address-open,
 *   browser/live-control-hover-minimize, browser/live-control-hover-maximize,
 *   browser/live-control-hover-close,
 *   browser/mobile-article, browser/mobile-address-open
 *
 * Usage:
 *   node capture-current.mjs --mode smoke --output-dir visual-compare/current-smoke
 *   node capture-current.mjs --mode full  --output-dir visual-compare/current
 */

import { spawn } from "child_process";
import { chromium } from "@playwright/test";
import { mkdirSync, existsSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ── Runtime constants (locked — do NOT change in Phase 3) ───── */

const ORIGIN = "http://localhost:6007";
const READY_SIGNAL = "SERVER_READY";
const VIEWPORT = { width: 1280, height: 800 };
const SERVER_SCRIPT = resolve(
  __dirname,
  "visual-compare",
  "storybook-static-server.cjs"
);

/* ── Exact 15-key inventory (locked) ─────────────────────────── */

/**
 * @type {Array<{
 *   key: string,
 *   storyId: string,
 *   stageAttr: "desktop" | "mobile",
 *   kind: string,
 *   state: string,
 * }>}
 */
const INVENTORY = [
  {
    key: "folder/live-blog",
    storyId: "windows-compose-folder--compare-live-blog",
    stageAttr: "desktop",
    kind: "folder",
    state: "live-blog",
  },
  {
    key: "folder/live-search-open",
    storyId: "windows-compose-folder--compare-live-search-open",
    stageAttr: "desktop",
    kind: "folder",
    state: "live-search-open",
  },
  {
    key: "folder/live-chip-open",
    storyId: "windows-compose-folder--compare-live-chip-open",
    stageAttr: "desktop",
    kind: "folder",
    state: "live-chip-open",
  },
  {
    key: "folder/live-sidebar-hover",
    storyId: "windows-compose-folder--compare-live-sidebar-hover",
    stageAttr: "desktop",
    kind: "folder",
    state: "live-sidebar-hover",
  },
  {
    key: "folder/live-sidebar-expanded",
    storyId: "windows-compose-folder--compare-live-sidebar-expanded",
    stageAttr: "desktop",
    kind: "folder",
    state: "live-sidebar-expanded",
  },
  {
    key: "folder/live-thumbnail-hover",
    storyId: "windows-compose-folder--compare-live-thumbnail-hover",
    stageAttr: "desktop",
    kind: "folder",
    state: "live-thumbnail-hover",
  },
  {
    key: "folder/mobile-blog",
    storyId: "windows-compose-folder--compare-mobile-blog",
    stageAttr: "mobile",
    kind: "folder",
    state: "mobile-blog",
  },
  {
    key: "folder/mobile-search-open",
    storyId: "windows-compose-folder--compare-mobile-search-open",
    stageAttr: "mobile",
    kind: "folder",
    state: "mobile-search-open",
  },
  {
    key: "browser/live-article",
    storyId: "windows-compose-browser--compare-live-article",
    stageAttr: "desktop",
    kind: "browser",
    state: "live-article",
  },
  {
    key: "browser/live-address-open",
    storyId: "windows-compose-browser--compare-live-address-open",
    stageAttr: "desktop",
    kind: "browser",
    state: "live-address-open",
  },
  {
    key: "browser/live-control-hover-minimize",
    storyId: "windows-compose-browser--compare-live-control-hover-minimize",
    stageAttr: "desktop",
    kind: "browser",
    state: "live-control-hover-minimize",
  },
  {
    key: "browser/live-control-hover-maximize",
    storyId: "windows-compose-browser--compare-live-control-hover-maximize",
    stageAttr: "desktop",
    kind: "browser",
    state: "live-control-hover-maximize",
  },
  {
    key: "browser/live-control-hover-close",
    storyId: "windows-compose-browser--compare-live-control-hover-close",
    stageAttr: "desktop",
    kind: "browser",
    state: "live-control-hover-close",
  },
  {
    key: "browser/mobile-article",
    storyId: "windows-compose-browser--compare-mobile-article",
    stageAttr: "mobile",
    kind: "browser",
    state: "mobile-article",
  },
  {
    key: "browser/mobile-address-open",
    storyId: "windows-compose-browser--compare-mobile-address-open",
    stageAttr: "mobile",
    kind: "browser",
    state: "mobile-address-open",
  },
];

/* ── Argument parsing ─────────────────────────────────────────── */

function parseArgs() {
  const args = process.argv.slice(2);
  let mode = "full";
  let outputDir = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--mode" && args[i + 1]) {
      mode = args[i + 1];
      i++;
    } else if (args[i] === "--output-dir" && args[i + 1]) {
      outputDir = args[i + 1];
      i++;
    }
  }

  if (!outputDir) {
    throw new Error("--output-dir is required");
  }

  if (mode !== "smoke" && mode !== "full") {
    throw new Error(`Unknown --mode: ${mode}. Use "smoke" or "full".`);
  }

  return { mode, outputDir: resolve(process.cwd(), outputDir) };
}

/* ── Server management ────────────────────────────────────────── */

function startServer() {
  return new Promise((resolve, reject) => {
    const server = spawn(process.execPath, [SERVER_SCRIPT], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let resolved = false;

    server.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      if (!resolved && text.includes(READY_SIGNAL)) {
        resolved = true;
        resolve(server);
      }
    });

    server.stderr.on("data", (chunk) => {
      process.stderr.write("[server] " + chunk.toString());
    });

    server.on("error", (err) => {
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    });

    server.on("exit", (code) => {
      if (!resolved) {
        resolved = true;
        reject(new Error(`Server exited with code ${code} before ready`));
      }
    });

    // Timeout after 15 seconds
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        server.kill();
        reject(new Error("Server did not emit SERVER_READY within 15 seconds"));
      }
    }, 15000);
  });
}

/* ── Capture one story ────────────────────────────────────────── */

async function captureStory(page, entry, outputDir) {
  const { key, storyId, stageAttr, kind, state } = entry;
  const url = `${ORIGIN}/iframe.html?id=${storyId}&viewMode=story`;

  console.log(`[capture] ${key} → ${url}`);

  await page.goto(url, { waitUntil: "load", timeout: 60000 });

  // Wait for Storybook story to render. Storybook signals readiness via
  // the .sb-show-main class on body (added when the story is fully rendered).
  await page.waitForFunction(() => {
    return document.body.classList.contains("sb-show-main");
  }, { timeout: 30000 });

  // Wait for capture-ready: [data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]
  const waitSelector = `[data-window-compare-stage="${stageAttr}"] [data-visual-root][data-visual-kind="${kind}"][data-visual-state="${state}"]`;

  await page.waitForSelector(waitSelector, { timeout: 20000 });

  // Pre-screenshot assertion: exactly 1 matching [data-visual-root] inside [data-window-compare-stage="{stageAttr}"]
  const matchCount = await page.locator(waitSelector).count();
  if (matchCount !== 1) {
    throw new Error(
      `[abort] ${key}: expected exactly 1 [data-visual-root] matching kind="${kind}" state="${state}" inside [data-window-compare-stage="${stageAttr}"], found ${matchCount}`
    );
  }

  // Capture owner: [data-window-compare-stage]
  const stageLocator = page.locator(`[data-window-compare-stage="${stageAttr}"]`);

  // Artifact naming: {kind}-{state}-current.png (e.g. folder-live-blog-current.png)
  const artifactName = `${kind}-${state}-current.png`;
  const artifactPath = join(outputDir, artifactName);

  await stageLocator.screenshot({ path: artifactPath });

  console.log(`[capture] ✓ ${key} → ${artifactName}`);
  return artifactPath;
}

/* ── Main ─────────────────────────────────────────────────────── */

async function main() {
  const { mode, outputDir } = parseArgs();

  console.log(`[capture-current] mode=${mode} output-dir=${outputDir}`);

  // Ensure output directory exists
  mkdirSync(outputDir, { recursive: true });

  // Verify storybook-static exists
  const REPO_ROOT = resolve(__dirname, "..", "..", "..", "..");
  const staticRoot = join(REPO_ROOT, "packages", "ui", "storybook-static");
  if (!existsSync(staticRoot)) {
    throw new Error(
      `storybook-static not found at ${staticRoot}. Run pnpm --filter @windows/ui build-storybook first.`
    );
  }

  // smoke mode: same inventory, same runtime literal, current-only capture
  // Does NOT read reference-captures, does NOT run run-diff, does NOT write report.
  if (mode === "smoke") {
    console.log("[capture-current] smoke mode: current-only capture, no diff");
  }

  let server = null;
  let browser = null;

  try {
    console.log("[capture-current] starting static server...");
    server = await startServer();
    console.log(`[capture-current] server ready at ${ORIGIN}`);

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: VIEWPORT, // 1280x800
    });
    const page = await context.newPage();

    const results = [];

    for (const entry of INVENTORY) {
      try {
        const artifactPath = await captureStory(page, entry, outputDir);
        results.push({ key: entry.key, status: "ok", artifact: artifactPath });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[capture-current] ✗ ${entry.key}: ${message}`);
        results.push({ key: entry.key, status: "error", error: message });
      }
    }

    // Summary
    const ok = results.filter((r) => r.status === "ok").length;
    const errors = results.filter((r) => r.status === "error").length;

    console.log(`\n[capture-current] done: ${ok} captured, ${errors} errors`);

    if (errors > 0) {
      console.error("[capture-current] FAILED — some stories could not be captured");
      process.exitCode = 1;
    } else {
      console.log("[capture-current] SUCCESS — all 15 current-side captures complete");
    }
  } finally {
    if (browser) await browser.close();
    if (server) server.kill();
  }
}

main().catch((err) => {
  console.error("[capture-current] fatal:", err.message || err);
  process.exit(1);
});
