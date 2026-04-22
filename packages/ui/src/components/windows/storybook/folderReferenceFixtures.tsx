/**
 * folderReferenceFixtures.tsx
 *
 * Folder 8-state scaffolding for storybook/internal review.
 *
 * State inventory owner: storybook/internal review (NOT public props).
 *   folder/live-blog           — desktop, blog content in grid
 *   folder/live-search-open    — desktop, search input focused (dropdown shown)
 *   folder/live-chip-open      — desktop, chip-open (not a public prop)
 *   folder/live-sidebar-hover  — desktop, sidebar hover (not a public prop)
 *   folder/live-sidebar-expanded — desktop, sidebar expanded (not a public prop)
 *   folder/live-thumbnail-hover  — desktop, thumbnail hover (not a public prop)
 *   folder/mobile-blog         — mobile, blog content in grid
 *   folder/mobile-search-open  — mobile, search open (not a public prop)
 *
 * These fixtures supply host-owned prop values for each state.
 * Detail-state scaffolding (hover/open/expanded) is achieved via
 * story-level prop injection — NOT public component props.
 */

import type {
  FolderLocationDropdownItem,
  FolderSearchDropdownItem,
  FolderSearchChip,
  FolderSidebarItem,
  FolderGridItem,
} from "../shared/types";
import type { FolderProps } from "../folder";

/* ── Shared fixture data ──────────────────────────────────────── */

const SIDEBAR_ITEMS: FolderSidebarItem[] = [
  { id: "home", label: "Home" },
  { id: "blog", label: "Blog" },
  { id: "projects", label: "Projects" },
  { id: "algorithm", label: "Algorithm" },
  { id: "about", label: "About" },
];

const BLOG_GRID_ITEMS: FolderGridItem[] = [
  { id: "post-1", label: "Getting Started with Next.js" },
  { id: "post-2", label: "TypeScript Tips & Tricks" },
  { id: "post-3", label: "React Patterns" },
  { id: "post-4", label: "Tailwind CSS Deep Dive" },
  { id: "post-5", label: "Monorepo Architecture" },
  { id: "post-6", label: "Performance Optimization" },
  { id: "post-7", label: "Testing Best Practices" },
  { id: "post-8", label: "State Management Guide" },
];

const LOCATION_DROPDOWN_ITEMS: FolderLocationDropdownItem[] = [
  { id: "loc-1", label: "Home", hint: "/home" },
  { id: "loc-2", label: "Blog", hint: "/blog" },
  { id: "loc-3", label: "Projects", hint: "/projects" },
];

const SEARCH_DROPDOWN_ITEMS: FolderSearchDropdownItem[] = [
  { id: "sd-1", label: "Next.js tutorial", hint: "Recent search" },
  { id: "sd-2", label: "TypeScript guide", hint: "Recent search" },
  { id: "sd-3", label: "React hooks", hint: "Recent search" },
];

const SEARCH_CHIPS: FolderSearchChip[] = [
  { id: "chip-1", label: "Frontend" },
  { id: "chip-2", label: "TypeScript" },
  { id: "chip-3", label: "Next.js" },
  { id: "chip-4", label: "React" },
];

/* ── 8-state fixtures ─────────────────────────────────────────── */

/**
 * folder/live-blog
 * Desktop, blog content grid, no dropdown open.
 * Compare storyId: windows-compose-folder--compare-live-blog
 * stageAttr: desktop
 */
export const FOLDER_LIVE_BLOG: FolderProps = {
  title: "Blog",
  locationValue: "/blog",
  searchValue: "",
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: BLOG_GRID_ITEMS,
};

/**
 * folder/live-search-open
 * Desktop, search input focused, search dropdown visible.
 * Detail-state scaffolding: searchDropdownItems provided (open state is via prop array).
 * Compare storyId: windows-compose-folder--compare-live-search-open
 * stageAttr: desktop
 */
export const FOLDER_LIVE_SEARCH_OPEN: FolderProps = {
  title: "Blog",
  locationValue: "/blog",
  searchValue: "Next",
  searchDropdownItems: SEARCH_DROPDOWN_ITEMS,
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: BLOG_GRID_ITEMS,
};

/**
 * folder/live-chip-open
 * Desktop, chips visible below search input.
 * Detail-state: chip anchor visible — storybook/internal review owner (NOT public prop).
 * Compare storyId: windows-compose-folder--compare-live-chip-open
 * stageAttr: desktop
 */
export const FOLDER_LIVE_CHIP_OPEN: FolderProps = {
  title: "Blog",
  locationValue: "/blog",
  searchValue: "",
  searchChips: SEARCH_CHIPS,
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: BLOG_GRID_ITEMS,
};

/**
 * folder/live-sidebar-hover
 * Desktop, sidebar item hover state.
 * Detail-state: sidebar row hover — storybook/internal review owner (NOT public prop).
 * Compare storyId: windows-compose-folder--compare-live-sidebar-hover
 * stageAttr: desktop
 */
export const FOLDER_LIVE_SIDEBAR_HOVER: FolderProps = {
  title: "Blog",
  locationValue: "/blog",
  searchValue: "",
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: BLOG_GRID_ITEMS,
};

/**
 * folder/live-sidebar-expanded
 * Desktop, sidebar expanded width state.
 * Detail-state: sidebar expansion — storybook/internal review owner (NOT public prop).
 * Compare storyId: windows-compose-folder--compare-live-sidebar-expanded
 * stageAttr: desktop
 */
export const FOLDER_LIVE_SIDEBAR_EXPANDED: FolderProps = {
  title: "Blog",
  locationValue: "/blog",
  searchValue: "",
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: BLOG_GRID_ITEMS,
};

/**
 * folder/live-thumbnail-hover
 * Desktop, grid card thumbnail hover state.
 * Detail-state: thumbnail hover affordance — storybook/internal review owner (NOT public prop).
 * Compare storyId: windows-compose-folder--compare-live-thumbnail-hover
 * stageAttr: desktop
 */
export const FOLDER_LIVE_THUMBNAIL_HOVER: FolderProps = {
  title: "Blog",
  locationValue: "/blog",
  searchValue: "",
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: BLOG_GRID_ITEMS,
};

/**
 * folder/mobile-blog
 * Mobile viewport (375×680), blog content grid.
 * Mobile hierarchy: content-first grid, sidebar collapses to drawer.
 * Compare storyId: windows-compose-folder--compare-mobile-blog
 * stageAttr: mobile
 */
export const FOLDER_MOBILE_BLOG: FolderProps = {
  title: "Blog",
  locationValue: "/blog",
  searchValue: "",
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: BLOG_GRID_ITEMS,
};

/**
 * folder/mobile-search-open
 * Mobile viewport, search open state.
 * Detail-state: mobile search drawer open — storybook/internal review owner (NOT public prop).
 * Compare storyId: windows-compose-folder--compare-mobile-search-open
 * stageAttr: mobile
 */
export const FOLDER_MOBILE_SEARCH_OPEN: FolderProps = {
  title: "Blog",
  locationValue: "/blog",
  searchValue: "Next",
  searchDropdownItems: SEARCH_DROPDOWN_ITEMS,
  sidebarItems: SIDEBAR_ITEMS,
  activeSidebarItemId: "blog",
  items: BLOG_GRID_ITEMS,
};

/* ── Reference data exports ───────────────────────────────────── */

export { SIDEBAR_ITEMS, BLOG_GRID_ITEMS, LOCATION_DROPDOWN_ITEMS, SEARCH_DROPDOWN_ITEMS, SEARCH_CHIPS };
