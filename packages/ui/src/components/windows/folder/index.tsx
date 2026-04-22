import type { KeyboardEvent } from "react";

import WindowFrame from "../internal/windowFrame";
import type {
  FolderLocationDropdownItem,
  FolderSearchDropdownItem,
  FolderSearchChip,
  FolderSidebarItem,
  FolderGridItem,
} from "../shared/types";

/**
 * FolderProps — public contract for the Folder window component.
 *
 * Public surface (two-input + grid owner):
 *   Inputs:    locationValue, searchValue
 *   Arrays:    locationDropdownItems?, searchDropdownItems?, searchChips?,
 *              sidebarItems, activeSidebarItemId?, items
 *   Callbacks: see below
 *
 * Winner rule:
 *   Displayed value is always `locationValue` / `searchValue` (host-owned).
 *   The component does NOT update these values internally after any interaction.
 *
 * Detail-state owner:
 *   `folder/live-chip-open`, `folder/live-sidebar-hover`,
 *   `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover`,
 *   `folder/mobile-search-open` are storybook/internal review owner only.
 *   These are NOT public props.
 *
 * No-op rule:
 *   - Source arrays with different domains have separate id namespaces.
 *   - Hidden dropdown/open affordance without a corresponding callback = no-op.
 *   - Source array items with unknown ids = no-op.
 *   - Selection/nav/window-control callbacks do NOT fall through to each other.
 */
export type FolderProps = {
  /** Window title displayed in the titlebar chrome. */
  title: string;

  /* ── Input values (host-owned) ──────────────────────────────── */

  /** Current displayed value of the location input. Host-owned. */
  locationValue: string;
  /** Current displayed value of the search input. Host-owned. */
  searchValue: string;

  /* ── Item arrays ────────────────────────────────────────────── */

  /**
   * Dropdown rows for the location input.
   * IDs unique within this array only (domain-local).
   * Render key prefix: `location-dropdown:{id}`
   */
  locationDropdownItems?: FolderLocationDropdownItem[];
  /**
   * Dropdown rows for the search input.
   * IDs unique within this array only (domain-local).
   * Render key prefix: `search-dropdown:{id}`
   */
  searchDropdownItems?: FolderSearchDropdownItem[];
  /**
   * Filter chips displayed below the search input.
   * IDs unique within this array only (domain-local).
   * Render key prefix: `search-chip:{id}`
   */
  searchChips?: FolderSearchChip[];
  /**
   * Sidebar navigation items.
   * IDs unique within this array only (domain-local).
   * Render key prefix: `sidebar:{id}`
   */
  sidebarItems: FolderSidebarItem[];
  /** ID of the currently active sidebar item. No-op if not in `sidebarItems`. */
  activeSidebarItemId?: string;
  /**
   * Body grid items.
   * IDs unique within this array only (domain-local).
   * Render key prefix: `grid-item:{id}`
   */
  items: FolderGridItem[];

  /* ── Location input callbacks ───────────────────────────────── */

  /** Notification only — no args. Called when the location input dropdown should open. */
  onOpenLocationDropdown?: () => void;
  /** Raw string handoff. Called on every keystroke in the location input. */
  onLocationValueChange?: (nextValue: string) => void;
  /**
   * Current winner submit. Called on Enter with the current `locationValue`.
   * Does NOT alter `locationValue` internally.
   */
  onLocationSubmit?: (locationValue: string) => void;
  /**
   * Exact source item selection.
   * Called with the exact `FolderLocationDropdownItem` from `locationDropdownItems`.
   * No id/index/DOM event appended. Does NOT fall through to other callbacks.
   */
  onSelectLocationDropdownItem?: (item: FolderLocationDropdownItem) => void;

  /* ── Search input callbacks ─────────────────────────────────── */

  /** Notification only — no args. Called when the search input dropdown should open. */
  onOpenSearchDropdown?: () => void;
  /** Raw string handoff. Called on every keystroke in the search input. */
  onSearchValueChange?: (nextValue: string) => void;
  /**
   * Current winner submit. Called on Enter with the current `searchValue`.
   * Does NOT alter `searchValue` internally.
   */
  onSearchSubmit?: (searchValue: string) => void;
  /**
   * Exact source item selection.
   * Called with the exact `FolderSearchDropdownItem` from `searchDropdownItems`.
   * No id/index/DOM event appended. Does NOT fall through to other callbacks.
   */
  onSelectSearchDropdownItem?: (item: FolderSearchDropdownItem) => void;
  /**
   * Exact source chip selection.
   * Called with the exact `FolderSearchChip` from `searchChips`.
   * No id/index/DOM event appended. Does NOT fall through to other callbacks.
   */
  onSelectSearchChip?: (chip: FolderSearchChip) => void;

  /* ── Sidebar callbacks ──────────────────────────────────────── */

  /**
   * Exact source item selection.
   * Called with the exact `FolderSidebarItem` from `sidebarItems`.
   * No id/index/DOM event appended. Does NOT fall through to other callbacks.
   * Does NOT alter `activeSidebarItemId` internally.
   */
  onSelectSidebarItem?: (sidebarItem: FolderSidebarItem) => void;

  /* ── Grid callbacks ─────────────────────────────────────────── */

  /**
   * Exact source item open.
   * Called with the exact `FolderGridItem` from `items`.
   * No id/index/DOM event appended. Does NOT fall through to other callbacks.
   */
  onOpenItem?: (item: FolderGridItem) => void;

  /* ── Window control callbacks (notification-only, no args) ──── */

  /** Notification only — no args. */
  onMinimize?: () => void;
  /** Notification only — no args. */
  onToggleMaximize?: () => void;
  /** Notification only — no args. */
  onClose?: () => void;
};

/**
 * Folder
 *
 * Two-input + grid owner window leaf component.
 *
 * Owns:
 *   - Window frame shell (via WindowFrame internal)
 *   - Location input row (chrome-level)
 *   - Search input row (chrome-level)
 *   - Search chips row
 *   - Sidebar navigation column
 *   - Body grid layout
 *   - Window control buttons
 *
 * Does NOT own:
 *   - locationValue / searchValue state (host-owned)
 *   - activeSidebarItemId state (host-owned)
 *   - Dropdown open/close state (storybook/internal review owner)
 *   - Sidebar hover / expanded detail state (storybook/internal review owner)
 *   - Thumbnail hover detail state (storybook/internal review owner)
 *   - Mobile search open state (storybook/internal review owner)
 *   - Internal navigation / filtering / history wiring
 *   - Public loading / empty / status model
 *
 * Callback fallthrough rule:
 *   Selection/open/nav/window-control interactions are ONLY delivered to
 *   their own callback family. No cross-callback fallthrough.
 */
function Folder({
  title,
  locationValue,
  searchValue,
  locationDropdownItems = [],
  searchDropdownItems = [],
  searchChips = [],
  sidebarItems,
  activeSidebarItemId,
  items,
  onOpenLocationDropdown,
  onLocationValueChange,
  onLocationSubmit,
  onSelectLocationDropdownItem,
  onOpenSearchDropdown,
  onSearchValueChange,
  onSearchSubmit,
  onSelectSearchDropdownItem,
  onSelectSearchChip,
  onSelectSidebarItem,
  onOpenItem,
  onMinimize,
  onToggleMaximize,
  onClose,
}: FolderProps) {
  function handleLocationKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onLocationSubmit?.(locationValue);
    }
  }

  function handleSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSearchSubmit?.(searchValue);
    }
  }

  const chrome = (
    <div className="flex flex-col w-full">
      {/* Titlebar row: title + window controls */}
      <div className="flex items-center justify-between px-3 h-8 shrink-0">
        <span className="text-sm font-medium text-gray-700 truncate">{title}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="window-control-btn rounded flex items-center justify-center"
            aria-label="Minimize"
            onClick={() => onMinimize?.()}
          >
            <span className="w-2.5 h-0.5 bg-gray-600 block" />
          </button>
          <button
            type="button"
            className="window-control-btn rounded flex items-center justify-center"
            aria-label="Toggle maximize"
            onClick={() => onToggleMaximize?.()}
          >
            <span className="w-2.5 h-2.5 border border-gray-600 block rounded-sm" />
          </button>
          <button
            type="button"
            className="window-control-btn rounded flex items-center justify-center hover:bg-red-400"
            aria-label="Close"
            onClick={() => onClose?.()}
          >
            <span className="text-gray-600 text-xs leading-none">✕</span>
          </button>
        </div>
      </div>

      {/* Location input row */}
      <div className="flex items-center gap-2 px-3 py-1 border-b border-gray-200">
        <input
          type="text"
          className="flex-1 text-sm bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-400"
          value={locationValue}
          placeholder="Location"
          aria-label="Location"
          onChange={(e) => onLocationValueChange?.(e.target.value)}
          onFocus={() => onOpenLocationDropdown?.()}
          onKeyDown={handleLocationKeyDown}
        />
        {/* Location dropdown rows (storybook/internal review: open state scaffolded externally) */}
        {locationDropdownItems.length > 0 && (
          <div className="absolute z-10 top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-md min-w-48">
            {locationDropdownItems.map((item) => (
              <button
                key={`location-dropdown:${item.id}`}
                type="button"
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 flex flex-col"
                onClick={() => onSelectLocationDropdownItem?.(item)}
              >
                <span>{item.label}</span>
                {item.hint && <span className="text-xs text-gray-400">{item.hint}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search input + chips row */}
      <div className="flex flex-col gap-1 px-3 py-1">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 text-sm bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-400"
            value={searchValue}
            placeholder="Search"
            aria-label="Search"
            onChange={(e) => onSearchValueChange?.(e.target.value)}
            onFocus={() => onOpenSearchDropdown?.()}
            onKeyDown={handleSearchKeyDown}
          />
          {/* Search dropdown rows (storybook/internal review: open state scaffolded externally) */}
          {searchDropdownItems.length > 0 && (
            <div className="absolute z-10 top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-md min-w-48">
              {searchDropdownItems.map((item) => (
                <button
                  key={`search-dropdown:${item.id}`}
                  type="button"
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 flex flex-col"
                  onClick={() => onSelectSearchDropdownItem?.(item)}
                >
                  <span>{item.label}</span>
                  {item.hint && <span className="text-xs text-gray-400">{item.hint}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search chips */}
        {searchChips.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {searchChips.map((chip) => (
              <button
                key={`search-chip:${chip.id}`}
                type="button"
                className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                onClick={() => onSelectSearchChip?.(chip)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <WindowFrame chrome={chrome}>
      {/* Body: sidebar + grid */}
      <div className="flex h-full">
        {/* Sidebar column */}
        {sidebarItems.length > 0 && (
          <aside className="w-40 shrink-0 border-r border-gray-200 overflow-y-auto">
            <ul>
              {sidebarItems.map((item) => (
                <li key={`sidebar:${item.id}`}>
                  <button
                    type="button"
                    className={[
                      "w-full text-left px-3 py-2 text-sm truncate",
                      item.id === activeSidebarItemId
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100",
                    ].join(" ")}
                    onClick={() => onSelectSidebarItem?.(item)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Grid area */}
        <main className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-4 gap-3">
            {items.map((item) => (
              <button
                key={`grid-item:${item.id}`}
                type="button"
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-100 text-center"
                onDoubleClick={() => onOpenItem?.(item)}
              >
                {item.thumbnailSrc ? (
                  <img
                    src={item.thumbnailSrc}
                    alt=""
                    className="w-12 h-12 rounded object-cover"
                    aria-hidden="true"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center" aria-hidden="true">
                    <span className="text-2xl">📁</span>
                  </div>
                )}
                <span className="text-xs text-gray-700 truncate w-full">{item.label}</span>
              </button>
            ))}
          </div>
        </main>
      </div>
    </WindowFrame>
  );
}

export default Folder;
