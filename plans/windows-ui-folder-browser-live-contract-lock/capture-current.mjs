#!/usr/bin/env node
/**
 * capture-current.mjs
 *
 * canonical 4 compare story를 Storybook static에서 캡처한다.
 * 출력: plans/.../visual-compare/{kind}-{state}-current.png
 *
 * 실행 전제: packages/ui/storybook-static/ 이 빌드돼 있어야 한다.
 * 이 스크립트는 storybook-static을 python3 http.server로 서빙하고 agent-browser로 캡처한다.
 */

import { execSync, spawn } from "child_process";
import { mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLAN_DIR = __dirname;
const STATIC_DIR = path.resolve(
  PLAN_DIR,
  "../../../../packages/ui/storybook-static"
);
const OUTPUT_DIR = path.join(PLAN_DIR, "visual-compare");
const PORT = 6007;
const BASE_URL = `http://localhost:${PORT}`;

// canonical 4 stories only — support-only review stories are excluded
const STORIES = [
  {
    id: "windows-folder--compare-desktop-blog",
    kind: "folder",
    state: "desktop-blog",
    viewport: { width: 1280, height: 750 },
  },
  {
    id: "windows-folder--compare-mobile-blog",
    kind: "folder",
    state: "mobile-blog",
    viewport: { width: 390, height: 794 },
  },
  {
    id: "windows-browser--compare-desktop-article",
    kind: "browser",
    state: "desktop-article",
    viewport: { width: 1280, height: 750 },
  },
  {
    id: "windows-browser--compare-mobile-article",
    kind: "browser",
    state: "mobile-article",
    viewport: { width: 390, height: 794 },
  },
];

function run(cmd) {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, retries = 30, delayMs = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      execSync(
        `curl -s -o /dev/null -w "%{http_code}" "${url}"`,
        { stdio: "pipe" }
      );
      return;
    } catch {
      await sleep(delayMs);
    }
  }
  throw new Error(`Server at ${url} did not respond after ${retries} retries`);
}

async function main() {
  if (!existsSync(STATIC_DIR)) {
    console.error(`storybook-static not found at: ${STATIC_DIR}`);
    console.error(
      "Run: pnpm --filter @windows/ui build-storybook from the repo root"
    );
    process.exit(1);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Start python3 http server in the storybook-static directory
  console.log(`\nStarting python3 http.server on port ${PORT} ...`);
  const server = spawn(
    "python3",
    ["-m", "http.server", String(PORT)],
    {
      cwd: STATIC_DIR,
      detached: true,
      stdio: "ignore",
    }
  );
  server.unref();

  try {
    await waitForServer(`${BASE_URL}/index.html`);
    console.log("Server ready.\n");

    for (const { id, kind, state, viewport } of STORIES) {
      const url = `${BASE_URL}/iframe.html?id=${id}&viewMode=story`;
      const outFile = path.join(OUTPUT_DIR, `${kind}-${state}-current.png`);

      console.log(`\nCapturing ${kind}/${state}`);
      console.log(`  url: ${url}`);
      console.log(`  viewport: ${viewport.width}x${viewport.height}`);
      console.log(`  selector: [data-visual-root]`);
      console.log(`  output: ${outFile}`);

      run(
        `npx agent-browser set viewport ${viewport.width} ${viewport.height}`
      );
      run(`npx agent-browser open "${url}"`);
      run(`npx agent-browser wait "[data-visual-root]"`);
      await sleep(1500);
      run(`npx agent-browser screenshot "[data-visual-root]" "${outFile}"`);

      console.log(`  -> saved: ${outFile}`);
    }

    console.log("\nAll 4 current captures complete.");
  } finally {
    // Kill server process
    try {
      if (process.platform === "win32") {
        execSync(`taskkill /F /PID ${server.pid} 2>nul`, { stdio: "pipe" });
      } else {
        process.kill(-server.pid, "SIGTERM");
      }
    } catch {
      // ignore cleanup errors
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
