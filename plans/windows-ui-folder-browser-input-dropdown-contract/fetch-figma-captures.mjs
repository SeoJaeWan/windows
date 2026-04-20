/**
 * fetch-figma-captures.mjs
 *
 * Downloads Figma 3:2 canvas wrapper captures via the Figma REST API.
 * Run: node fetch-figma-captures.mjs <FIGMA_PERSONAL_ACCESS_TOKEN>
 *
 * Outputs PNG files to ./reference-captures/ with exact kind-state naming.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "reference-captures");

const FILE_KEY = "NrUGKPZUewpuA8XuHI0v5n";

// Canvas 3:2 — Live UI References — Folder Browser
// Image sub-frame node IDs (the actual rendered content frames)
const CAPTURES = [
  // desktop — contract-bearing
  { key: "folder/live-blog",            nodeId: "51:5"    },
  { key: "browser/live-article",        nodeId: "51:9"    },
  { key: "folder/live-search-open",     nodeId: "84:5"    },
  { key: "browser/live-address-open",   nodeId: "87:621"  },
  // desktop — detail-variant
  { key: "folder/live-chip-open",                nodeId: "87:5"    },
  { key: "folder/live-sidebar-hover",            nodeId: "87:159"  },
  { key: "folder/live-sidebar-expanded",         nodeId: "87:313"  },
  { key: "folder/live-thumbnail-hover",          nodeId: "87:467"  },
  { key: "browser/live-control-hover-minimize",  nodeId: "87:775"  },
  { key: "browser/live-control-hover-maximize",  nodeId: "87:929"  },
  { key: "browser/live-control-hover-close",     nodeId: "87:1083" },
  // mobile — contract-bearing
  { key: "folder/mobile-blog",          nodeId: "94:6"    },
  { key: "folder/mobile-search-open",   nodeId: "94:160"  },
  { key: "browser/mobile-article",      nodeId: "94:314"  },
  { key: "browser/mobile-address-open", nodeId: "94:468"  },
];

function stateKeyToFilename(key) {
  // "folder/live-blog" → "folder-live-blog.png"
  return key.replace(/\//g, "-") + ".png";
}

async function exportNodes(token, nodeIds) {
  const ids = nodeIds.join(",");
  const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=2`;
  const res = await fetch(url, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API error ${res.status}: ${body}`);
  }
  const { images, err } = await res.json();
  if (err) throw new Error(`Figma export error: ${err}`);
  return images; // { [nodeId]: imageUrl }
}

async function downloadPng(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download PNG: ${res.status} ${url}`);
  const buf = await res.arrayBuffer();
  writeFileSync(outPath, Buffer.from(buf));
}

async function main() {
  const token = process.argv[2];
  if (!token) {
    console.error("Usage: node fetch-figma-captures.mjs <FIGMA_PERSONAL_ACCESS_TOKEN>");
    console.error("Get your token at: https://www.figma.com/settings → Personal access tokens");
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const nodeIds = CAPTURES.map((c) => c.nodeId);
  console.log(`Requesting export URLs for ${nodeIds.length} nodes...`);
  const images = await exportNodes(token, nodeIds);

  for (const capture of CAPTURES) {
    const imageUrl = images[capture.nodeId];
    if (!imageUrl) {
      console.warn(`  SKIP ${capture.key} — no export URL returned`);
      continue;
    }
    const filename = stateKeyToFilename(capture.key);
    const outPath = join(OUT_DIR, filename);
    process.stdout.write(`  ${capture.key} → ${filename} ... `);
    await downloadPng(imageUrl, outPath);
    console.log("done");
  }

  console.log(`\nAll captures written to: ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
