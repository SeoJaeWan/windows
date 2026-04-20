/**
 * folderReferenceFixtures — Folder 8-state storybook/internal review scaffolding
 *
 * State ownership contract:
 *   Each fixture entry provides the minimum prop payload to scaffold a specific
 *   review state. Detail states are story-only owners — NOT public props.
 *
 * Folder state inventory (8 states):
 *   1. folder/live-blog           — desktop default (location + grid, no dropdown)
 *   2. folder/live-search-open    — desktop search input focused, dropdown visible
 *   3. folder/live-chip-open      — chip popover open (story-only detail state)
 *   4. folder/live-sidebar-hover  — sidebar item hover affordance (story-only)
 *   5. folder/live-sidebar-expanded — sidebar section expanded (story-only)
 *   6. folder/live-thumbnail-hover — grid card thumbnail hover (story-only)
 *   7. folder/mobile-blog         — mobile content-first grid hierarchy
 *   8. folder/mobile-search-open  — mobile search overlay open (story-only)
 *
 * Detail-state owner rule:
 *   States 3–6, 8 are story-only surfaces. They are NOT exposed as public props
 *   on Folder. Stories scaffold them via controlled fixture payloads and
 *   story-level render wrappers.
 *
 * This file is JSX (.tsx) because fixtures may contain ReactNode icon payloads
 * in the future. Keep it .tsx even if current entries are pure data.
 */

import type { FolderProps } from "../folder";

/* ── Shared fixture data ─────────────────────────────────────── */

const SIDEBAR_ITEMS: FolderProps["sidebarItems"] = [
  { id: "blog", label: "블로그" },
  { id: "projects", label: "프로젝트" },
  { id: "coding-test", label: "코딩 테스트" },
  { id: "about", label: "소개" },
];

const GRID_ITEMS: FolderProps["items"] = [
  { id: "item-1", name: "기술 회고록" },
  { id: "item-2", name: "Next.js 마이그레이션" },
  { id: "item-3", name: "타입스크립트 정리" },
  { id: "item-4", name: "알고리즘 노트" },
  { id: "item-5", name: "프로젝트 NEU", thumbnailUrl: undefined },
  { id: "item-6", name: "React 18 정리" },
];

const LOCATION_DROPDOWN_ITEMS: FolderProps["locationDropdownItems"] = [
  { id: "loc-blog", label: "블로그", path: "/blog" },
  { id: "loc-projects", label: "프로젝트", path: "/projects" },
  { id: "loc-about", label: "소개", path: "/about" },
];

const SEARCH_DROPDOWN_ITEMS: FolderProps["searchDropdownItems"] = [
  { id: "s-1", label: "Next.js" },
  { id: "s-2", label: "TypeScript" },
  { id: "s-3", label: "React 18" },
];

const SEARCH_CHIPS: FolderProps["searchChips"] = [
  { id: "chip-all", label: "전체", active: true },
  { id: "chip-blog", label: "블로그" },
  { id: "chip-projects", label: "프로젝트" },
];

/* ── State 1: folder/live-blog ───────────────────────────────── */

/**
 * FOLDER_LIVE_BLOG
 * State: folder/live-blog
 * Role: desktop default — location filled, grid populated, no dropdown open.
 * Ownership: public props, host-controlled.
 */
export const FOLDER_LIVE_BLOG: FolderProps = {
  title: "블로그",
  locationValue: "/blog",
  searchValue: "",
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: GRID_ITEMS,
};

/* ── State 2: folder/live-search-open ────────────────────────── */

/**
 * FOLDER_LIVE_SEARCH_OPEN
 * State: folder/live-search-open
 * Role: desktop — search input focused with dropdown visible.
 * Ownership: public props. searchDropdownItems presence triggers the open surface.
 * Note: actual dropdown open/close is internal/story-owned; the fixture supplies
 * the data that enables the open surface to be rendered.
 */
export const FOLDER_LIVE_SEARCH_OPEN: FolderProps = {
  title: "블로그",
  locationValue: "/blog",
  searchValue: "Next",
  searchDropdownItems: SEARCH_DROPDOWN_ITEMS,
  searchChips: SEARCH_CHIPS,
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: GRID_ITEMS,
};

/* ── State 3: folder/live-chip-open (story-only detail) ──────── */

/**
 * FOLDER_LIVE_CHIP_OPEN
 * State: folder/live-chip-open
 * Role: chip popover open affordance — story-only detail state.
 * Ownership: story harness controls the open detail; this fixture supplies
 *   the surrounding props that make the chip surface visible.
 * NOT a public prop — no public open/chip-open flag exists on Folder.
 */
export const FOLDER_LIVE_CHIP_OPEN: FolderProps = {
  title: "블로그",
  locationValue: "/blog",
  searchValue: "",
  searchChips: SEARCH_CHIPS,
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: GRID_ITEMS,
};

/* ── State 4: folder/live-sidebar-hover (story-only detail) ───── */

/**
 * FOLDER_LIVE_SIDEBAR_HOVER
 * State: folder/live-sidebar-hover
 * Role: sidebar item hover affordance — story-only detail state.
 * Ownership: story harness injects hover class/state; this fixture supplies
 *   the sidebar props so the hovered row is visible.
 * NOT a public prop — no public hover prop exists on Folder.
 */
export const FOLDER_LIVE_SIDEBAR_HOVER: FolderProps = {
  title: "블로그",
  locationValue: "/blog",
  searchValue: "",
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: GRID_ITEMS,
};

/* ── State 5: folder/live-sidebar-expanded (story-only detail) ── */

/**
 * FOLDER_LIVE_SIDEBAR_EXPANDED
 * State: folder/live-sidebar-expanded
 * Role: sidebar section expanded affordance — story-only detail state.
 * Ownership: story harness scaffolds the expanded detail; fixture supplies base props.
 * NOT a public prop — no public expanded prop exists on Folder.
 */
export const FOLDER_LIVE_SIDEBAR_EXPANDED: FolderProps = {
  title: "블로그",
  locationValue: "/blog",
  searchValue: "",
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: GRID_ITEMS,
};

/* ── State 6: folder/live-thumbnail-hover (story-only detail) ─── */

/**
 * FOLDER_LIVE_THUMBNAIL_HOVER
 * State: folder/live-thumbnail-hover
 * Role: grid card thumbnail hover affordance — story-only detail state.
 * Ownership: story harness injects hover class/state; fixture supplies grid items.
 * NOT a public prop — no public thumbnail-hover prop exists on Folder.
 */
export const FOLDER_LIVE_THUMBNAIL_HOVER: FolderProps = {
  title: "블로그",
  locationValue: "/blog",
  searchValue: "",
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: [
    {
      id: "item-thumb-1",
      name: "프로젝트 NEU",
      thumbnailUrl: "https://picsum.photos/seed/folder-thumb/240/160",
    },
    { id: "item-thumb-2", name: "기술 회고록" },
    { id: "item-thumb-3", name: "알고리즘 노트" },
  ],
};

/* ── State 7: folder/mobile-blog ─────────────────────────────── */

/**
 * FOLDER_MOBILE_BLOG
 * State: folder/mobile-blog
 * Role: mobile content-first grid hierarchy.
 *   Sidebar collapses to drawer; grid fills viewport.
 * Ownership: public props, host-controlled.
 *   Mobile hierarchy is enforced by the component at the appropriate breakpoint.
 */
export const FOLDER_MOBILE_BLOG: FolderProps = {
  title: "블로그",
  locationValue: "/blog",
  searchValue: "",
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: GRID_ITEMS,
};

/* ── State 8: folder/mobile-search-open (story-only detail) ────── */

/**
 * FOLDER_MOBILE_SEARCH_OPEN
 * State: folder/mobile-search-open
 * Role: mobile search overlay open — story-only detail state.
 * Ownership: story harness scaffolds the overlay open detail; fixture supplies base props.
 * NOT a public prop — no public mobile-search-open prop exists on Folder.
 */
export const FOLDER_MOBILE_SEARCH_OPEN: FolderProps = {
  title: "블로그",
  locationValue: "/blog",
  searchValue: "Next",
  searchDropdownItems: SEARCH_DROPDOWN_ITEMS,
  searchChips: SEARCH_CHIPS,
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: GRID_ITEMS,
};

/* ── Convenience map ──────────────────────────────────────────── */

/**
 * FOLDER_FIXTURES — keyed map of all 8 Folder review states.
 *
 * Canonical key format: "folder/{state-slug}"
 * Matches the exact state inventory defined in Phase 3 contract.
 */
export const FOLDER_FIXTURES = {
  "folder/live-blog": FOLDER_LIVE_BLOG,
  "folder/live-search-open": FOLDER_LIVE_SEARCH_OPEN,
  "folder/live-chip-open": FOLDER_LIVE_CHIP_OPEN,
  "folder/live-sidebar-hover": FOLDER_LIVE_SIDEBAR_HOVER,
  "folder/live-sidebar-expanded": FOLDER_LIVE_SIDEBAR_EXPANDED,
  "folder/live-thumbnail-hover": FOLDER_LIVE_THUMBNAIL_HOVER,
  "folder/mobile-blog": FOLDER_MOBILE_BLOG,
  "folder/mobile-search-open": FOLDER_MOBILE_SEARCH_OPEN,
} as const satisfies Record<string, FolderProps>;

export type FolderFixtureKey = keyof typeof FOLDER_FIXTURES;
