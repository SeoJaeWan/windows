/**
 * Canonical owner module for panel content icon assets.
 *
 * All panel source that needs file/folder PNG must import from this module,
 * not from root `assets/` or any other raw PNG path.
 */

import filePng from "./assets/file.png";
import folderPng from "./assets/folder.png";

/** Resolve Vite/Next.js asset import to a plain src string. */
function resolveSrc(asset: string | { src: string }): string {
  return typeof asset === "string" ? asset : asset.src;
}

/** Default file content icon src (PNG). */
export const file = resolveSrc(filePng);

/** Default folder content icon src (PNG). */
export const folder = resolveSrc(folderPng);
