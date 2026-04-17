#!/usr/bin/env node
/**
 * Phase 4 capture script — Playwright-based
 */
import { exec } from "child_process";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKTREE = path.resolve(__dirname, "../..");
const STATIC_DIR = path.join(WORKTREE, "packages/ui/storybook-static");
const OUTPUT_DIR = path.join(__dirname, "visual-compare");
const SERVER_SCRIPT = path.join(__dirname, "static-server.cjs");
const PORT = 6030;
const BASE_URL = `http://localhost:${PORT}`;

const STORIES = [
  { id: "windows-folder--compare-desktop-blog", kind: "folder", state: "desktop-blog", width: 1280, height: 750 },
  { id: "windows-folder--compare-mobile-blog", kind: "folder", state: "mobile-blog", width: 390, height: 794 },
  { id: "windows-browser--compare-desktop-article", kind: "browser", state: "desktop-article", width: 1280, height: 750 },
  { id: "windows-browser--compare-mobile-article", kind: "browser", state: "mobile-article", width: 390, height: 794 },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode);
    }).on("error", reject);
  });
}

async function waitForServer(url, retries = 40, delayMs = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      await httpGet(url);
      return;
    } catch { await sleep(delayMs); }
  }
  throw new Error(`Server did not respond at ${url}`);
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Start static server as background process
  const serverProc = exec(`node "${SERVER_SCRIPT}" "${STATIC_DIR}" ${PORT}`);
  serverProc.stdout.on("data", d => process.stdout.write(d));
  serverProc.stderr.on("data", d => process.stderr.write(d));

  await sleep(1500);
  await waitForServer(`${BASE_URL}/index.html`);
  console.log("Server ready\n");

  // Import playwright via pnpm virtual store
  const playwrightPath = path.join(WORKTREE, "node_modules/.pnpm/playwright@1.59.1/node_modules/playwright/index.mjs");
  const playwrightIndexPath = new URL("file:///" + playwrightPath.replace(/\\/g, "/")).href;
  const { chromium } = await import(playwrightIndexPath);

  try {
    const browser = await chromium.launch();

    for (const { id, kind, state, width, height } of STORIES) {
      const url = `${BASE_URL}/iframe.html?id=${id}&viewMode=story`;
      const outFile = path.join(OUTPUT_DIR, `${kind}-${state}-current.png`);
      console.log(`Capturing ${kind}/${state} at ${width}x${height}...`);

      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForSelector("[data-visual-root]", { timeout: 15000 });
      await sleep(1500);

      const el = await page.$("[data-visual-root]");
      await el.screenshot({ path: outFile });
      console.log(`  -> ${outFile}`);
      await context.close();
    }

    await browser.close();
    console.log("\nAll 4 captures done.");
  } finally {
    serverProc.kill();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
