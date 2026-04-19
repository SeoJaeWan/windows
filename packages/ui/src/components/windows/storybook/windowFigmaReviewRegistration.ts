/**
 * windowFigmaReviewRegistration
 *
 * Single source of truth for the windows Figma review surface.
 * Exports Figma provenance, canonical state inventory, compare story IDs,
 * review story IDs, and compare stage size metadata so that later phases
 * (Phase 4 capture script, Phase 5 report) can read them from one place
 * without assuming or re-deriving key names or sizes.
 *
 * Internal-only — NOT exported from package root.
 */

/* ── Figma provenance ───────────────────────────────────────────── */

export const FIGMA_FILE_KEY = "NrUGKPZUewpuA8XuHI0v5n";
export const FIGMA_FILE_URL = "https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows";
export const FIGMA_FRAME_NAME = "Live UI References - Folder Browser";

/**
 * Current frame node hint — lookup only.
 * Not a stable contract identifier. If the Figma document is restructured,
 * FIGMA_FRAME_NAME is the canonical identifier, not this node ID.
 */
export const FIGMA_FRAME_NODE_HINT = "7:2";

/* ── Compare stage size metadata ────────────────────────────────── */

export const COMPARE_STAGE_SIZE = {
  desktop: { width: 1282, height: 752 },
  mobile: { width: 392, height: 796 },
} as const;

/* ── Canonical state inventory ──────────────────────────────────── */

/**
 * Six canonical compare states locked in Phase 1 baseline inventory.
 * State labels are literal — story IDs, artifact names, and data-visual-state
 * values derive from these exact strings without transformation.
 */
export const CANONICAL_COMPARE_STATES = [
  "folder/desktop-blog",
  "folder/desktop-search-open",
  "browser/desktop-article",
  "browser/desktop-address-open",
  "folder/mobile-blog",
  "browser/mobile-article",
] as const;

export type CanonicalCompareState = (typeof CANONICAL_COMPARE_STATES)[number];

/**
 * Per-kind state suffix types — automatically derived from CANONICAL_COMPARE_STATES.
 * Adding or removing a canonical state only requires editing the array above.
 *
 * These types represent the suffix after the kind prefix (e.g. "desktop-blog" from "folder/desktop-blog").
 * Internal to the storybook registration boundary — not exported from the package root.
 */
export type FolderCompareState =
  Extract<CanonicalCompareState, `folder/${string}`> extends `folder/${infer S}` ? S : never;

export type BrowserCompareState =
  Extract<CanonicalCompareState, `browser/${string}`> extends `browser/${infer S}` ? S : never;

/* ── Compare story ID registry ──────────────────────────────────── */

/**
 * Storybook story IDs for the 6 canonical compare states.
 * Derived directly from state labels — later phases must use without alteration.
 *
 * ID format: {storybook-title-slug}--{export-name-slug}
 * title "Windows/Compose/Folder" → "windows-compose-folder"
 * title "Windows/Compose/Browser" → "windows-compose-browser"
 */
export const COMPARE_STORY_IDS = {
  "folder/desktop-blog": "windows-compose-folder--compare-desktop-blog",
  "folder/desktop-search-open": "windows-compose-folder--compare-desktop-search-open",
  "folder/mobile-blog": "windows-compose-folder--compare-mobile-blog",
  "browser/desktop-article": "windows-compose-browser--compare-desktop-article",
  "browser/desktop-address-open": "windows-compose-browser--compare-desktop-address-open",
  "browser/mobile-article": "windows-compose-browser--compare-mobile-article",
} as const satisfies Record<CanonicalCompareState, string>;

/* ── Review story ID registry ───────────────────────────────────── */

/**
 * Storybook story IDs for review-only edge states.
 * These are NOT in the compare inventory and must not be mixed with compare IDs.
 */
export const REVIEW_STORY_IDS = {
  "folder/long-title": "windows-compose-folder--review-long-title",
  "folder/long-address": "windows-compose-folder--review-long-address",
  "folder/no-chips": "windows-compose-folder--review-no-chips",
  "browser/long-title": "windows-compose-browser--review-long-title",
  "browser/long-address": "windows-compose-browser--review-long-address",
  "browser/empty-dropdown": "windows-compose-browser--review-empty-dropdown",
} as const;

/* ── Legacy key retirement notice ───────────────────────────────── */

/**
 * Legacy local keys retired in Phase 2.
 * Must not appear in compare inventory, data-visual-state attributes,
 * or artifact file names going forward.
 *
 * @deprecated Use canonical keys from CANONICAL_COMPARE_STATES instead.
 */
export const RETIRED_LEGACY_KEYS = {
  "folder/desktop-card": "folder/desktop-blog",
  "folder/mobile-card": "folder/mobile-blog",
  "browser/desktop-chrome": "browser/desktop-article",
  "browser/mobile-chrome": "browser/mobile-article",
} as const;
