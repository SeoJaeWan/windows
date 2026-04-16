/**
 * capture-current.mjs
 * Phase 6 캡처 스크립트: Storybook static에서 compare story를 stage 고정 크기로 캡처한다.
 *
 * [data-visual-root] element screenshot 대신 stage container 기준 clip screenshot을 사용한다.
 * CompareRoot 자체가 content-driven height를 갖기 때문에 element screenshot 시
 * natural height만 잡힌다. stage wrapper 좌표계 기준 fixed geometry로 캡처한다.
 */
import { createServer } from 'http';
import { createReadStream, statSync } from 'fs';
import { join, extname, resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// plans/windows-ui-folder-browser-window-family/ -> plans -> project root (windows-ui-folder-browser-window-family worktree)
const projectRoot = resolve(__dirname, '../..');
const sbStaticDir = join(projectRoot, 'packages/ui/storybook-static');
const outputDir = join(__dirname, 'visual-compare');

const playwrightPath = join(projectRoot, 'node_modules/.pnpm/playwright@1.59.1/node_modules/playwright/index.mjs');
const { chromium } = await import(pathToFileURL(playwrightPath).href);

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ico':  'image/x-icon',
};

function serveStatic(dir) {
  return createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    let filePath = join(dir, urlPath === '/' ? '/index.html' : urlPath);
    try {
      statSync(filePath);
    } catch {
      filePath = join(dir, 'index.html');
    }
    const ext = extname(filePath);
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    createReadStream(filePath).pipe(res);
  });
}

// desktop: 1280x750, mobile: 390x794
const CAPTURES = [
  { storyId: 'windows-components-folder--compare-desktop-default',  kind: 'folder',  state: 'desktop-default',   width: 1280, height: 750  },
  { storyId: 'windows-components-folder--compare-mobile-collapsed',  kind: 'folder',  state: 'mobile-collapsed',  width: 390,  height: 794  },
  { storyId: 'windows-components-browser--compare-desktop-article',  kind: 'browser', state: 'desktop-article',   width: 1280, height: 750  },
  { storyId: 'windows-components-browser--compare-desktop-not-found',kind: 'browser', state: 'desktop-not-found', width: 1280, height: 750  },
  { storyId: 'windows-components-browser--compare-mobile-article',   kind: 'browser', state: 'mobile-article',    width: 390,  height: 794  },
  { storyId: 'windows-components-browser--compare-mobile-not-found', kind: 'browser', state: 'mobile-not-found',  width: 390,  height: 794  },
];

async function main() {
  const server = serveStatic(sbStaticDir);
  await new Promise(r => server.listen(6099, r));
  console.log('Storybook static served on http://localhost:6099');

  const browser = await chromium.launch();

  for (const { storyId, kind, state, width, height } of CAPTURES) {
    const url = `http://localhost:6099/iframe.html?id=${storyId}&viewMode=story`;
    const outFile = join(outputDir, `${kind}-${state}-current.png`);

    // viewport를 stage 크기에 맞게 설정하여 overflow hidden이 작동하도록
    const page = await browser.newPage({ viewport: { width, height } });

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      // data-visual-root 요소 대기 (DOM이 렌더링됐음을 확인용)
      await page.waitForSelector('[data-visual-root]', { timeout: 10000 });

      // stage container 좌표 기준으로 고정 크기 clip screenshot
      // stage div는 페이지 최상위 요소이므로 (0,0) 기준 clip 사용
      await page.screenshot({
        path: outFile,
        type: 'png',
        clip: { x: 0, y: 0, width, height },
      });
      console.log(`captured: ${kind}/${state} (${width}x${height}) -> ${outFile}`);
    } catch (err) {
      console.error(`FAIL ${kind}/${state}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log('done');
}

main().catch(e => { console.error(e); process.exit(1); });
