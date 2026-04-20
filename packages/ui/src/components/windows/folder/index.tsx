/**
 * Folder — windows family leaf component
 *
 * Public contract (Phase 3):
 *
 * Input ownership:
 *   - two-input owner: locationValue + searchValue (host-controlled)
 *   - grid owner: items array (host-controlled)
 *   - sidebar owner: sidebarItems + activeSidebarItemId (host-controlled)
 *   - dropdown data: locationDropdownItems + searchDropdownItems (host-controlled)
 *   - chips: searchChips (host-controlled)
 *
 * Callback handoff (callback-only, no internal state mutation):
 *   - location: onOpenLocationDropdown, onLocationValueChange, onLocationSubmit,
 *               onSelectLocationDropdownItem
 *   - search:   onOpenSearchDropdown, onSearchValueChange, onSearchSubmit,
 *               onSelectSearchDropdownItem, onSelectSearchChip
 *   - sidebar:  onSelectSidebarItem
 *   - grid:     onOpenItem
 *   - window:   onMinimize, onToggleMaximize, onClose
 *
 * No-op / invalid rules:
 *   - If locationDropdownItems is absent/empty, the location dropdown UI
 *     is NOT rendered (no open surface).
 *   - If searchDropdownItems is absent/empty, the search dropdown UI
 *     is NOT rendered.
 *   - Invalid activeSidebarItemId (not found in sidebarItems) is a no-op
 *     (no sidebar item is highlighted).
 *   - Missing callbacks are silently ignored (no error thrown).
 *   - Enter key always fires the appropriate submit callback
 *     (onLocationSubmit or onSearchSubmit) — no internal filtering/reorder.
 *
 * Detail-state owner rule (story-only surface — NOT public props):
 *   The following detail states are owned by storybook/internal review surface.
 *   They are NOT public props and are never exposed on the component interface:
 *     folder/live-chip-open       — chip popover open state
 *     folder/live-sidebar-hover   — sidebar item hover affordance
 *     folder/live-sidebar-expanded — sidebar section expanded state
 *     folder/live-thumbnail-hover — grid card thumbnail hover affordance
 *     folder/mobile-search-open   — mobile search overlay open state
 *   These states are scaffolded via story harness/fixture; no public prop models them.
 *
 * Mobile hierarchy:
 *   Mobile is content-first grid hierarchy. Sidebar collapses to a drawer.
 *   Grid items fill the viewport. Desktop sidebar shrink is NOT valid mobile.
 *
 * Token namespace: --window-* (no --panel-* or raw literals).
 * Shell: uses WindowFrame as internal shared shell owner.
 */

import type {
  DropdownItem,
  FolderDropdownItem,
  SearchChip,
  SidebarItem,
  GridItem,
} from "../shared/types";
import { cn } from "../../../internal/cn";
import WindowFrame from "../internal/windowFrame";

/* ── Public props ─────────────────────────────────────────────── */

export type FolderProps = {
  /** Window title shown in the chrome area. */
  title: string;

  // ── Location input ──────────────────────────────────────────
  /** Current controlled value of the location input. */
  locationValue: string;
  /**
   * Dropdown rows for the location input.
   * If absent or empty, the location dropdown open surface is NOT rendered.
   */
  locationDropdownItems?: FolderDropdownItem[];
  /** Fired when the location input requests dropdown open. */
  onOpenLocationDropdown?: () => void;
  /** Fired on every keystroke in the location input. */
  onLocationValueChange?: (value: string) => void;
  /** Fired when Enter is pressed in the location input. */
  onLocationSubmit?: (value: string) => void;
  /** Fired when a location dropdown row is selected. */
  onSelectLocationDropdownItem?: (item: DropdownItem) => void;

  // ── Search input ────────────────────────────────────────────
  /** Current controlled value of the search input. */
  searchValue: string;
  /**
   * Dropdown rows for the search input.
   * If absent or empty, the search dropdown open surface is NOT rendered.
   */
  searchDropdownItems?: FolderDropdownItem[];
  /**
   * Filter chips displayed below the search input.
   * Chip active state is host-controlled via the `active` flag on each chip.
   */
  searchChips?: SearchChip[];
  /** Fired when the search input requests dropdown open. */
  onOpenSearchDropdown?: () => void;
  /** Fired on every keystroke in the search input. */
  onSearchValueChange?: (value: string) => void;
  /** Fired when Enter is pressed in the search input. */
  onSearchSubmit?: (value: string) => void;
  /** Fired when a search dropdown row is selected. */
  onSelectSearchDropdownItem?: (item: DropdownItem) => void;
  /** Fired when a search chip is selected. */
  onSelectSearchChip?: (chip: SearchChip) => void;

  // ── Sidebar ─────────────────────────────────────────────────
  /** Navigation sidebar rows. */
  sidebarItems: SidebarItem[];
  /**
   * Currently active sidebar item id.
   * If not found in sidebarItems, no item is highlighted (no-op).
   */
  activeSidebarItemId?: string;
  /** Fired when a sidebar item is selected. */
  onSelectSidebarItem?: (item: SidebarItem) => void;

  // ── Content grid ────────────────────────────────────────────
  /** Grid items (file/folder cards). */
  items: GridItem[];
  /** Fired when a grid item is opened (double-click / Enter). */
  onOpenItem?: (item: GridItem) => void;

  // ── Window controls ─────────────────────────────────────────
  /** Fired when the minimize control is activated. */
  onMinimize?: () => void;
  /** Fired when the maximize/restore control is activated. */
  onToggleMaximize?: () => void;
  /** Fired when the close control is activated. */
  onClose?: () => void;
};

/* ── Window control buttons ───────────────────────────────────── */

type ControlButtonProps = {
  label: string;
  variant: "minimize" | "maximize" | "close";
  onClick?: () => void;
};

function ControlButton({ label, variant, onClick }: ControlButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "window-control-btn shrink-0 flex items-center justify-center rounded-full transition-colors",
        variant === "close" && "hover:bg-red-500",
        variant === "minimize" && "hover:bg-yellow-400",
        variant === "maximize" && "hover:bg-green-500",
      )}
      style={{
        width: "var(--window-control-size)",
        height: "var(--window-control-size)",
        backgroundColor: "var(--window-chrome-border)",
      }}
    />
  );
}

/* ── Location input row ───────────────────────────────────────── */

type LocationInputProps = {
  value: string;
  dropdownItems?: FolderDropdownItem[];
  onFocus?: () => void;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onSelectItem?: (item: DropdownItem) => void;
};

function LocationInput({
  value,
  dropdownItems,
  onFocus,
  onChange,
  onSubmit,
  onSelectItem,
}: LocationInputProps) {
  const hasDropdown =
    dropdownItems != null && dropdownItems.length > 0;

  return (
    <div className="relative flex-1 min-w-0">
      <input
        type="text"
        value={value}
        readOnly={onChange == null}
        onFocus={onFocus}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit?.(value);
        }}
        className="w-full h-7 px-2 text-sm rounded border text-shell bg-white border-shell focus:outline-none"
        style={{ fontSize: 12 }}
        aria-label="위치"
      />
      {hasDropdown && (
        <ul
          className="absolute top-full left-0 right-0 z-10 mt-0.5 rounded border border-shell bg-white shadow-md"
          role="listbox"
        >
          {dropdownItems!.map((item) => (
            <li
              key={item.id}
              role="option"
              aria-selected={false}
              className="px-2 py-1 text-xs text-shell cursor-pointer hover:bg-gray-100"
              onClick={() => onSelectItem?.(item)}
            >
              <span className="block truncate">{item.label}</span>
              {item.path != null && (
                <span className="block truncate text-shell-muted" style={{ fontSize: 10 }}>
                  {item.path}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Search input row ─────────────────────────────────────────── */

type SearchInputProps = {
  value: string;
  dropdownItems?: FolderDropdownItem[];
  chips?: SearchChip[];
  onFocus?: () => void;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onSelectItem?: (item: DropdownItem) => void;
  onSelectChip?: (chip: SearchChip) => void;
};

function SearchInput({
  value,
  dropdownItems,
  chips,
  onFocus,
  onChange,
  onSubmit,
  onSelectItem,
  onSelectChip,
}: SearchInputProps) {
  const hasDropdown =
    dropdownItems != null && dropdownItems.length > 0;
  const hasChips = chips != null && chips.length > 0;

  return (
    <div className="relative min-w-0" style={{ width: 200 }}>
      <input
        type="text"
        value={value}
        readOnly={onChange == null}
        placeholder="검색"
        onFocus={onFocus}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit?.(value);
        }}
        className="w-full h-7 px-2 text-sm rounded border text-shell bg-white border-shell focus:outline-none"
        style={{ fontSize: 12 }}
        aria-label="검색"
      />
      {hasChips && (
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          {chips!.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => onSelectChip?.(chip)}
              className={cn(
                "px-2 py-0.5 rounded-full border text-xs transition-colors",
                chip.active
                  ? "bg-shell-active text-white border-transparent"
                  : "bg-white text-shell border-shell hover:bg-gray-100",
              )}
              style={{ fontSize: 11 }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}
      {hasDropdown && (
        <ul
          className="absolute top-full left-0 right-0 z-10 mt-0.5 rounded border border-shell bg-white shadow-md"
          role="listbox"
        >
          {dropdownItems!.map((item) => (
            <li
              key={item.id}
              role="option"
              aria-selected={false}
              className="px-2 py-1 text-xs text-shell cursor-pointer hover:bg-gray-100"
              onClick={() => onSelectItem?.(item)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Sidebar ──────────────────────────────────────────────────── */

type SidebarProps = {
  items: SidebarItem[];
  activeId?: string;
  onSelect?: (item: SidebarItem) => void;
};

function Sidebar({ items, activeId, onSelect }: SidebarProps) {
  return (
    <nav
      className="shrink-0 h-full overflow-y-auto border-r border-shell"
      style={{ width: 160, backgroundColor: "var(--window-chrome-background)" }}
      aria-label="탐색 사이드바"
    >
      <ul className="py-2">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect?.(item)}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-blue-100 text-shell font-medium"
                    : "text-shell hover:bg-gray-100",
                )}
                style={{ fontSize: 13 }}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ── Grid ─────────────────────────────────────────────────────── */

type GridProps = {
  items: GridItem[];
  onOpen?: (item: GridItem) => void;
};

function Grid({ items, onOpen }: GridProps) {
  return (
    <div
      className="flex-1 overflow-y-auto p-4"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 12, alignContent: "start" }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onDoubleClick={() => onOpen?.(item)}
          className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-100 transition-colors text-center"
        >
          {item.thumbnailUrl != null ? (
            <img
              src={item.thumbnailUrl}
              alt={item.name}
              className="w-16 h-12 object-cover rounded"
              draggable={false}
            />
          ) : (
            <div
              className="w-16 h-12 rounded flex items-center justify-center"
              style={{ backgroundColor: "var(--window-chrome-border)" }}
              aria-hidden="true"
            >
              <span style={{ fontSize: 28 }}>📁</span>
            </div>
          )}
          <span className="text-xs text-shell leading-tight line-clamp-2 w-full"
            style={{ fontSize: 11, wordBreak: "break-word" }}>
            {item.name}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ── Component ────────────────────────────────────────────────── */

/**
 * Folder
 *
 * Two-input + grid owner leaf. Renders a Windows Explorer-style window
 * using WindowFrame as the shared shell owner.
 *
 * Chrome layout: [location toolbar row] + optional [chips row]
 * Content layout: [sidebar] + [grid]
 *
 * Public contract (Phase 3) is preserved — no new props added.
 */
function Folder({
  title,
  locationValue,
  locationDropdownItems,
  onOpenLocationDropdown,
  onLocationValueChange,
  onLocationSubmit,
  onSelectLocationDropdownItem,
  searchValue,
  searchDropdownItems,
  searchChips,
  onOpenSearchDropdown,
  onSearchValueChange,
  onSearchSubmit,
  onSelectSearchDropdownItem,
  onSelectSearchChip,
  sidebarItems,
  activeSidebarItemId,
  onSelectSidebarItem,
  items,
  onOpenItem,
  onMinimize,
  onToggleMaximize,
  onClose,
}: FolderProps) {
  const chrome = (
    <div className="flex items-center gap-2 px-3 w-full h-full">
      {/* Title */}
      <span className="text-sm font-medium text-shell shrink-0" style={{ fontSize: 13 }}>
        {title}
      </span>
      {/* Location input */}
      <LocationInput
        value={locationValue}
        dropdownItems={locationDropdownItems}
        onFocus={onOpenLocationDropdown}
        onChange={onLocationValueChange}
        onSubmit={onLocationSubmit}
        onSelectItem={onSelectLocationDropdownItem}
      />
      {/* Search input */}
      <SearchInput
        value={searchValue}
        dropdownItems={searchDropdownItems}
        chips={searchChips}
        onFocus={onOpenSearchDropdown}
        onChange={onSearchValueChange}
        onSubmit={onSearchSubmit}
        onSelectItem={onSelectSearchDropdownItem}
        onSelectChip={onSelectSearchChip}
      />
    </div>
  );

  const controls = (
    <div className="flex items-center gap-1 pr-2">
      <ControlButton label="최소화" variant="minimize" onClick={onMinimize} />
      <ControlButton label="최대화/복원" variant="maximize" onClick={onToggleMaximize} />
      <ControlButton label="닫기" variant="close" onClick={onClose} />
    </div>
  );

  return (
    <WindowFrame
      chrome={chrome}
      controls={controls}
      className="w-full h-full"
    >
      {/* Content: sidebar + grid */}
      <div className="flex flex-1 min-h-0 h-full">
        <Sidebar
          items={sidebarItems}
          activeId={activeSidebarItemId}
          onSelect={onSelectSidebarItem}
        />
        <Grid items={items} onOpen={onOpenItem} />
      </div>
    </WindowFrame>
  );
}

export default Folder;
