/**
 * storybook-static-server.cjs
 *
 * Static server for packages/ui/storybook-static.
 *
 * Contract (locked in Phase 2 — do NOT modify in Phase 3):
 *   - Serves: packages/ui/storybook-static (relative to repo root)
 *   - Origin: http://localhost:6007
 *   - Ready signal: stdout exact "SERVER_READY" (single line, no prefix)
 *
 * Usage:
 *   node visual-compare/storybook-static-server.cjs
 *
 * The parent process (capture-current.mjs) spawns this server and waits
 * for the SERVER_READY stdout line before dispatching capture requests.
 * Do not change the ready signal format — the capture script matches it literally.
 */

"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

/* ── Config (locked — do NOT change) ─────────────────────────── */
const PORT = 6007;
const ORIGIN = "http://localhost:6007";
const READY_SIGNAL = "SERVER_READY";

/* ── Static root: packages/ui/storybook-static ────────────────── */
// Resolve from repo root. This script is at:
//   plans/{plan-name}/visual-compare/storybook-static-server.cjs
// Directory chain:
//   __dirname          = plans/{plan-name}/visual-compare/
//   ..                 = plans/{plan-name}/
//   ../..              = plans/
//   ../../..           = repo-root
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const STATIC_ROOT = path.join(REPO_ROOT, "packages", "ui", "storybook-static");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

const server = http.createServer((req, res) => {
  // Strip query string
  let urlPath = req.url.split("?")[0];

  // Default to index.html for /
  if (urlPath === "/") {
    urlPath = "/index.html";
  }

  const filePath = path.join(STATIC_ROOT, urlPath);

  // Security: prevent path traversal
  if (!filePath.startsWith(STATIC_ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Fallback to iframe.html for SPA routing
        fs.readFile(path.join(STATIC_ROOT, "iframe.html"), (err2, data2) => {
          if (err2) {
            res.writeHead(404);
            res.end("Not found");
          } else {
            res.writeHead(200, {
              "Content-Type": "text/html; charset=utf-8",
              "Cache-Control": "no-cache",
            });
            res.end(data2);
          }
        });
      } else {
        res.writeHead(500);
        res.end("Internal server error");
      }
      return;
    }

    res.writeHead(200, {
      "Content-Type": getMimeType(filePath),
      "Cache-Control": "no-cache",
    });
    res.end(data);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  // Exact ready signal — capture-current.mjs matches this literally.
  // Do NOT add prefix, suffix, or ANSI codes.
  process.stdout.write(READY_SIGNAL + "\n");
});

// Surface configuration for external verification
void ORIGIN; // suppress unused warning — consumed by parent process contract comment
