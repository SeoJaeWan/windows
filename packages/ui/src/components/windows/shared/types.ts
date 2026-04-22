/**
 * windows/shared/types.ts
 *
 * Domain-local item types for the Folder and Browser window components.
 *
 * ID uniqueness policy (domain-local rule):
 *   Each `id` field is unique ONLY within its own prop array.
 *   `FolderLocationDropdownItem`, `FolderSearchDropdownItem`,
 *   `FolderSearchChip`, `FolderSidebarItem`, `FolderGridItem`,
 *   and `BrowserAddressDropdownItem` are SEPARATE namespaces.
 *   Cross-domain id collisions are allowed and have no meaning.
 *
 * Render-key prefix policy:
 *   When sibling render surfaces combine items from multiple domains,
 *   each item key uses a domain prefix to avoid React key collision:
 *     - location-dropdown:{id}
 *     - search-dropdown:{id}
 *     - search-chip:{id}
 *     - sidebar:{id}
 *     - grid-item:{id}
 *     - address-dropdown:{id}
 *
 * Callback payload policy:
 *   Selection callbacks receive the exact source item object.
 *   No additional payload (index, DOM event) is appended.
 *   Selection in one domain does NOT trigger callbacks of another domain.
 */

/* ── Folder location dropdown ─────────────────────────────────── */

/**
 * A single item in the Folder location input dropdown.
 * IDs are unique within `locationDropdownItems` only.
 * Render key: `location-dropdown:{id}`
 */
export type FolderLocationDropdownItem = {
  /** Unique within `locationDropdownItems`. */
  id: string;
  /** Display label for the dropdown row. */
  label: string;
  /** Optional secondary hint (path, description). */
  hint?: string;
};

/* ── Folder search dropdown ───────────────────────────────────── */

/**
 * A single item in the Folder search input dropdown.
 * IDs are unique within `searchDropdownItems` only.
 * Render key: `search-dropdown:{id}`
 */
export type FolderSearchDropdownItem = {
  /** Unique within `searchDropdownItems`. */
  id: string;
  /** Display label for the dropdown row. */
  label: string;
  /** Optional secondary hint. */
  hint?: string;
};

/* ── Folder search chip ───────────────────────────────────────── */

/**
 * A filter chip displayed below the Folder search input.
 * IDs are unique within `searchChips` only.
 * Render key: `search-chip:{id}`
 */
export type FolderSearchChip = {
  /** Unique within `searchChips`. */
  id: string;
  /** Chip display label. */
  label: string;
};

/* ── Folder sidebar item ──────────────────────────────────────── */

/**
 * A navigation item in the Folder sidebar.
 * IDs are unique within `sidebarItems` only.
 * Render key: `sidebar:{id}`
 */
export type FolderSidebarItem = {
  /** Unique within `sidebarItems`. */
  id: string;
  /** Sidebar row display label. */
  label: string;
};

/* ── Folder grid item ─────────────────────────────────────────── */

/**
 * A file/folder card in the Folder body grid.
 * IDs are unique within `items` only.
 * Render key: `grid-item:{id}`
 */
export type FolderGridItem = {
  /** Unique within `items`. */
  id: string;
  /** Card display name. */
  label: string;
  /** Optional thumbnail URL or src. */
  thumbnailSrc?: string;
};

/* ── Browser address dropdown ─────────────────────────────────── */

/**
 * A single item in the Browser address input dropdown.
 * IDs are unique within `addressDropdownItems` only.
 * Render key: `address-dropdown:{id}`
 */
export type BrowserAddressDropdownItem = {
  /** Unique within `addressDropdownItems`. */
  id: string;
  /** Display label for the dropdown row. */
  label: string;
  /** Optional secondary hint (full URL, path). */
  hint?: string;
};
