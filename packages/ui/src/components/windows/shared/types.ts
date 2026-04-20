/**
 * windows/shared/types — minimum shared types for the windows family
 *
 * Scope contract:
 *   - Only types that are shared verbatim between Folder and Browser live here.
 *   - Heterogeneous item domain (folder grid items, sidebar items, etc.) uses
 *     leaf-specific types defined in each component's own file.
 *   - No UI primitives, no React imports — pure data shape types only.
 */

/* ── Shared dropdown item ─────────────────────────────────────── */

/**
 * DropdownItem — shared input dropdown row shape
 *
 * Used by both Folder (location/search dropdowns) and Browser (address dropdown).
 * Each item carries an opaque `id` for callback identification and a `label`
 * for display. Optional `iconUrl` for favicon-style decoration.
 *
 * Leaf-specific payload (e.g. folder path metadata, browser visit count) is
 * NOT carried here — leaves define their own extended types when needed.
 */
export type DropdownItem = {
  /** Unique opaque identifier — passed back in onSelect* callbacks. */
  id: string;
  /** Display label shown in the dropdown row. */
  label: string;
  /** Optional icon URL (e.g. favicon, folder icon). */
  iconUrl?: string;
};

/* ── Folder-specific payload extension ──────────────────────────── */

/**
 * FolderDropdownItem — folder-specific dropdown row shape
 *
 * Extends the shared DropdownItem with folder-specific path metadata.
 * Used by Folder's locationDropdownItems and searchDropdownItems.
 */
export type FolderDropdownItem = DropdownItem & {
  /** Optional full path for display in a secondary label. */
  path?: string;
};

/* ── Search chip ─────────────────────────────────────────────── */

/**
 * SearchChip — a filter chip displayed below the Folder search input.
 *
 * Chips are host-owned: the host supplies the array and responds to
 * onSelectSearchChip callbacks. The component does not manage chip
 * active state internally.
 */
export type SearchChip = {
  /** Unique opaque identifier — passed back in onSelectSearchChip. */
  id: string;
  /** Display label shown on the chip surface. */
  label: string;
  /** Whether this chip is currently active (visual affordance only). */
  active?: boolean;
};

/* ── Sidebar item ─────────────────────────────────────────────── */

/**
 * SidebarItem — a navigation row in the Folder sidebar.
 *
 * Host supplies the array and responds to onSelectSidebarItem.
 * The component renders the active state based on activeSidebarItemId.
 */
export type SidebarItem = {
  /** Unique opaque identifier. */
  id: string;
  /** Display label for the sidebar row. */
  label: string;
  /** Optional icon URL. */
  iconUrl?: string;
};

/* ── Grid item ────────────────────────────────────────────────── */

/**
 * GridItem — a file/folder card in the Folder content grid.
 *
 * Host supplies the array and responds to onOpenItem.
 * Thumbnail is optional — items without thumbnails render a fallback icon.
 */
export type GridItem = {
  /** Unique opaque identifier — passed back in onOpenItem. */
  id: string;
  /** Display name shown below the card. */
  name: string;
  /** Optional thumbnail URL for media-surface affordance. */
  thumbnailUrl?: string;
  /** Optional icon URL (fallback when no thumbnail). */
  iconUrl?: string;
};
