import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";

import {
  Subtract16Regular,
  SquareMultiple16Regular,
  Dismiss16Regular,
  ArrowLeft16Regular,
  ArrowRight16Regular,
  Search16Regular,
} from "@fluentui/react-icons";

import { cn } from "../../../internal/cn";
import WindowFrame from "../internal/windowFrame";

/* ── Sidebar types ──────────────────────────────────────────────── */

type FolderSidebarChild = {
  id: string;
  label: string;
};

type FolderSidebarItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: FolderSidebarChild[];
};

/* ── Entry types ────────────────────────────────────────────────── */

type FolderEntry = {
  id: string;
  title: string;
  thumbnailSrc: string;
  metaLabel?: string;
  summary?: string;
};

/* ── Chip types ─────────────────────────────────────────────────── */

type FolderChip = {
  id: string;
  label: string;
};

/* ── Props ──────────────────────────────────────────────────────── */

type FolderProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  title: string;
  icon?: ReactNode;
  addressLabel: string;
  sidebarItems: FolderSidebarItem[];
  activeSidebarId?: string;
  expandedSidebarIds?: string[];
  entries: FolderEntry[];
  /** Chip surface. No filtering of entries. */
  chips?: FolderChip[];
  /**
   * Controlled selected chip id.
   * - If it matches a rendered chip id → that chip is the controlled winner.
   * - If it does not match any rendered chip → effective selection is none (no fallback).
   */
  selectedChipId?: string;
  /**
   * Default selected chip id (uncontrolled initial state).
   * Only applies when selectedChipId is absent.
   * - If it matches a rendered chip id on first render → that chip is the initial winner.
   * - If it does not match → initial winner is none.
   */
  defaultSelectedChipId?: string;
  /**
   * Called when valid chip activation occurs (chip id in chips[], differs from effective winner).
   * Uncontrolled: internal state updates. Controlled: callback only, visual winner stays until host updates selectedChipId.
   * Repeated selection and chips=[] are no-op. Repair callbacks never fire.
   */
  onChipSelect?: (chipId: string) => void;
  onSidebarSelect?: (id: string) => void;
  onSidebarToggle?: (id: string, nextExpanded: boolean) => void;
  onEntryOpen?: (id: string) => void;
  /**
   * Controlled search panel open state (desktop-only).
   * When provided, the host owns open/close. When absent, internal state is used.
   */
  searchPanelOpen?: boolean;
  /**
   * Called when the search trigger is clicked and the host controls open state.
   * Only fires when searchPanelOpen prop is present (controlled mode).
   */
  onSearchPanelOpenChange?: (open: boolean) => void;
  /** Controlled search input value. */
  searchValue?: string;
  /** Placeholder text for the search input. Defaults to "검색어를 입력하세요". */
  searchPlaceholder?: string;
  /** Called when the search input value changes. */
  onSearchValueChange?: (value: string) => void;
};

/* ── Folder Chrome ──────────────────────────────────────────────── */

/**
 * FolderChrome
 *
 * Internal chrome for the Folder window. Two-row structure:
 *
 * Row 1 — Titlebar (h-[30px]): folder icon + title text + window controls (−□×)
 * Row 2 — Toolbar  (h-[44px]):
 *   - Desktop: back/forward nav + folder icon + address breadcrumb (flex-1) + search trigger (right, desktop-only)
 *   - Mobile:  back/forward nav + address breadcrumb (flex-1, no search trigger)
 *
 * Search trigger is desktop-only (hidden md:flex).
 * Clicking the search trigger toggles the search panel open state.
 * When searchPanelOpen prop is provided, the host owns open/close (controlled).
 * When absent, FolderChrome receives the resolved value from Folder's internal state (uncontrolled).
 *
 * Search panel + chip bar:
 * - Desktop-only (md+). Mobile absence rule: search panel and chip bar are absent on mobile.
 * - Rendered as an absolutely-positioned overlay anchored below the toolbar row.
 * - Body layout is pixel-identical whether the overlay is visible or not (no chrome row push).
 * - Open state is resolved by the parent Folder and passed down via searchPanelOpen prop.
 */
function FolderChrome({
  title,
  icon,
  addressLabel,
  chips,
  effectiveSelectedChipId,
  onChipActivate,
  searchPanelOpen,
  onSearchTriggerClick,
  searchValue,
  searchPlaceholder = "검색어를 입력하세요",
  onSearchValueChange,
}: {
  title: string;
  icon?: ReactNode;
  addressLabel: string;
  chips: FolderChip[];
  effectiveSelectedChipId: string | undefined;
  onChipActivate: (chipId: string) => void;
  searchPanelOpen: boolean;
  onSearchTriggerClick: () => void;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchValueChange?: (value: string) => void;
}) {
  return (
    <>
      {/* Row 1: Titlebar */}
      <div className="folder-titlebar flex items-center gap-1.5 px-2 bg-gray-100 border-b border-shell select-none h-[30px]">
        {icon && (
          <span className="inline-flex items-center justify-center w-4 h-4 shrink-0" aria-hidden>
            {icon}
          </span>
        )}
        <span className="folder-title flex-1 text-xs font-medium text-gray-800 truncate">
          {title}
        </span>
        {/* Window controls — visual-only, no-op */}
        <div className="flex items-center shrink-0" aria-hidden>
          <button
            type="button"
            className="window-btn w-[46px] h-[30px] inline-flex items-center justify-center hover:bg-gray-200 text-gray-600"
            tabIndex={-1}
          >
            <Subtract16Regular />
          </button>
          <button
            type="button"
            className="window-btn w-[46px] h-[30px] inline-flex items-center justify-center hover:bg-gray-200 text-gray-600"
            tabIndex={-1}
          >
            <SquareMultiple16Regular />
          </button>
          <button
            type="button"
            className="window-btn w-[46px] h-[30px] inline-flex items-center justify-center hover:bg-red-500 hover:text-white text-gray-600"
            tabIndex={-1}
          >
            <Dismiss16Regular />
          </button>
        </div>
      </div>

      {/* Row 2: Toolbar — position: relative so the overlay can anchor here */}
      <div className="folder-toolbar relative flex items-center gap-1 px-2 bg-white border-b border-shell h-[44px]">
        {/* Nav controls */}
        <div className="flex items-center shrink-0" aria-hidden>
          <button
            type="button"
            tabIndex={-1}
            className="w-7 h-7 inline-flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
          >
            <ArrowLeft16Regular />
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="w-7 h-7 inline-flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
          >
            <ArrowRight16Regular />
          </button>
        </div>

        {/* Address breadcrumb area — takes available space on left side */}
        <div className="folder-address flex items-center gap-1 flex-1 h-8 bg-gray-50 border border-shell rounded px-2 overflow-hidden min-w-0">
          {icon && (
            <span className="inline-flex items-center justify-center w-4 h-4 shrink-0" aria-hidden>
              {icon}
            </span>
          )}
          <span className="folder-address-label text-xs text-gray-700 truncate leading-none">{addressLabel}</span>
        </div>

        {/* Search trigger — desktop only (hidden on mobile). Clicking toggles internal search panel.
            position: relative so the overlay can anchor directly below this button. */}
        <div className="hidden md:block relative shrink-0">
          <button
            type="button"
            className="folder-search-trigger flex items-center gap-1 h-8 w-80 bg-gray-50 border border-shell rounded px-2 overflow-hidden cursor-default text-left"
            onClick={onSearchTriggerClick}
          >
            <span className="inline-flex items-center justify-center w-4 h-4 shrink-0 text-gray-400" aria-hidden>
              <Search16Regular />
            </span>
            <span className="text-xs text-gray-400 truncate leading-none">검색</span>
          </button>

          {/* Search panel + chip bar overlay — desktop only, anchored below search trigger (320px).
              Visible iff searchPanelOpen is true. chips present when searchPanelOpen shows chip bar row.
              Absolutely positioned so body layout is unaffected (no push).
              z-10 keeps it above the sidebar + entry grid. */}
          {searchPanelOpen && (
            <div className="folder-search-overlay flex flex-col absolute right-0 top-full w-80 z-10 bg-white border border-t-0 border-shell shadow-sm">
              {/* Search panel row */}
              <div className="folder-search-panel flex items-center gap-2 px-3 py-2 border-b border-shell last:border-b-0">
                <div className="flex-1 flex items-center gap-1.5 h-7 bg-white border border-shell rounded px-2 overflow-hidden">
                  <span className="inline-flex items-center justify-center w-4 h-4 shrink-0 text-gray-400" aria-hidden>
                    <Search16Regular />
                  </span>
                  {onSearchValueChange ? (
                    <input
                      type="text"
                      className="folder-search-input flex-1 text-xs text-gray-700 bg-transparent outline-none leading-none min-w-0"
                      placeholder={searchPlaceholder}
                      value={searchValue ?? ""}
                      onChange={(e) => onSearchValueChange(e.target.value)}
                    />
                  ) : (
                    <span className="text-xs text-gray-400 truncate leading-none">
                      {searchValue !== undefined ? searchValue : searchPlaceholder}
                    </span>
                  )}
                </div>
              </div>
              {/* Chip bar row — shown when chips are present */}
              {chips.length > 0 && (
                <div className="folder-chip-bar flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto">
                  {chips.map((chip) => {
                    const isSelected = effectiveSelectedChipId === chip.id;
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        data-folder-chip={chip.id}
                        className={cn(
                          "folder-chip shrink-0 inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium cursor-default select-none border",
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-shell hover:bg-gray-100"
                        )}
                        onClick={() => onChipActivate(chip.id)}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Folder
 *
 * Public component. Renders a Windows Explorer-style folder window built on WindowFrame.
 *
 * Layout:
 * - Desktop (md+): sidebar tree (left) + thumbnail entry grid (right)
 * - Mobile (< md): entries only — sidebar hidden, search trigger absent
 *
 * Chrome grammar (live shell alignment):
 * - Desktop: titlebar (icon + title + window controls) + toolbar (nav + address + search trigger)
 *            + optional search panel (controlled or uncontrolled open state) + optional chip bar
 * - Mobile:  titlebar (icon + title + close) + toolbar (nav + address, no search trigger, no chip bar)
 *
 * Mobile absence rule:
 * - sidebar is hidden on mobile (< md)
 * - search trigger is hidden on mobile (< md) — desktop-only affordance
 * - search panel is absent on mobile (< md) — desktop-only affordance
 * - chip bar is absent on mobile (< md) — desktop-only affordance
 *
 * Sidebar winner rule:
 * - activeSidebarId matches a row id → that row is selected
 * - prop absent or no match → no selection
 *
 * Expand winner rule:
 * - expandedSidebarIds contains a root id → that root is expanded
 * - prop absent or empty → no expanded roots (multi-expand allowed)
 *
 * Chip winner rule:
 * - selectedChipId present and matches a chip id → that chip is controlled winner
 * - selectedChipId present but no match → effective selection is none (no fallback to default/internal)
 * - selectedChipId absent, defaultSelectedChipId matches a chip id → first-render default winner
 * - selectedChipId absent, defaultSelectedChipId absent or no match → initial winner is none
 *
 * Valid chip activation:
 * - Controlled: callback only (host must update selectedChipId to change visual)
 * - Uncontrolled: internal state updated + callback
 * - Repeated selection (same as current effective winner) → no-op
 * - chips=[] → no activatable chip, no callback
 * - Chip selection NEVER filters, reorders, or hides entries
 *
 * Root row is selectable even when it has children.
 * onSidebarToggle(id, nextExpanded) fires for root rows only.
 * onEntryOpen(id) is the only entry interaction surface.
 *
 * Search open/value prop surface (additive):
 * - searchPanelOpen: when provided, the host owns open/close (controlled).
 *   When absent, internal state manages open/close.
 * - onSearchPanelOpenChange: called when search trigger is clicked (controlled mode only).
 * - searchValue: controlled search input value. When absent, input value is untracked.
 * - searchPlaceholder: placeholder text for search input. Defaults to "검색어를 입력하세요".
 * - onSearchValueChange: called when search input changes. When present, renders an actual input element.
 *
 * No first-row auto-select fallback, no persistent selected entry state, no route-awareness.
 */
function Folder({
  title,
  icon,
  addressLabel,
  sidebarItems,
  activeSidebarId,
  expandedSidebarIds,
  entries,
  chips = [],
  selectedChipId,
  defaultSelectedChipId,
  onChipSelect,
  onSidebarSelect,
  onSidebarToggle,
  onEntryOpen,
  searchPanelOpen: searchPanelOpenProp,
  onSearchPanelOpenChange,
  searchValue,
  searchPlaceholder,
  onSearchValueChange,
  className,
  ...rest
}: FolderProps) {
  const expandedSet = new Set(expandedSidebarIds ?? []);

  // Internal search panel open state — only used when searchPanelOpen prop is absent (uncontrolled)
  const [internalSearchPanelOpen, setInternalSearchPanelOpen] = useState(false);
  const isSearchControlled = searchPanelOpenProp !== undefined;
  const searchPanelOpen = isSearchControlled ? searchPanelOpenProp : internalSearchPanelOpen;

  // Internal uncontrolled chip selection state
  // Only used when selectedChipId prop is absent (uncontrolled surface)
  const [internalSelectedChipId, setInternalSelectedChipId] = useState<string | undefined>(() => {
    if (selectedChipId !== undefined) return undefined; // controlled, ignore internal init
    if (defaultSelectedChipId !== undefined && chips.some((c) => c.id === defaultSelectedChipId)) {
      return defaultSelectedChipId;
    }
    return undefined;
  });

  // Resolve effective selected chip id
  // Controlled: selectedChipId wins (even if invalid — invalid means none, no fallback)
  // Uncontrolled: internal state, but only if the stored id is still present in current chips.
  //   If chips changes and the internal id is no longer present, effective winner is none.
  //   Internal state is NOT reset during render — just not surfaced as the winner.
  const chipIds = new Set(chips.map((c) => c.id));
  const isControlled = selectedChipId !== undefined;
  const effectiveSelectedChipId = isControlled
    ? chipIds.has(selectedChipId) ? selectedChipId : undefined
    : (internalSelectedChipId !== undefined && chipIds.has(internalSelectedChipId) ? internalSelectedChipId : undefined);

  function handleChipActivate(chipId: string) {
    // Must be a rendered chip
    if (!chipIds.has(chipId)) return;
    // Repeated selection is no-op
    if (chipId === effectiveSelectedChipId) return;
    // Update internal state if uncontrolled
    if (!isControlled) {
      setInternalSelectedChipId(chipId);
    }
    // Callback — exactly once
    onChipSelect?.(chipId);
  }

  return (
    <WindowFrame
      chrome={
        <FolderChrome
          title={title}
          icon={icon}
          addressLabel={addressLabel}
          chips={chips}
          effectiveSelectedChipId={effectiveSelectedChipId}
          onChipActivate={handleChipActivate}
          searchPanelOpen={searchPanelOpen}
          onSearchTriggerClick={() => {
            if (isSearchControlled) {
              onSearchPanelOpenChange?.(!searchPanelOpen);
            } else {
              setInternalSearchPanelOpen((prev) => !prev);
            }
          }}
          searchValue={searchValue}
          searchPlaceholder={searchPlaceholder}
          onSearchValueChange={onSearchValueChange}
        />
      }
      className={cn("folder", className)}
      {...rest}
    >
      <div className="folder-body flex h-full overflow-hidden">
        {/* Sidebar — hidden on mobile (< md), visible on md+ */}
        <aside className="folder-sidebar hidden md:flex flex-col w-44 shrink-0 border-r border-shell bg-gray-50 overflow-y-auto py-0.5">
          {sidebarItems.map((item) => {
            const isExpanded = item.children ? expandedSet.has(item.id) : false;
            const isActive = activeSidebarId === item.id;

            return (
              <div key={item.id} className="folder-sidebar-group">
                {/* Root row */}
                <button
                  type="button"
                  className={cn(
                    "folder-sidebar-row w-full flex items-center gap-1 px-2 py-0.5 text-xs text-left cursor-default select-none",
                    isActive
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => {
                    onSidebarSelect?.(item.id);
                  }}
                >
                  {item.children && (
                    <span
                      className="folder-sidebar-toggle inline-flex items-center justify-center w-3 h-3 shrink-0 text-gray-400"
                      aria-hidden
                      onClick={(e) => {
                        e.stopPropagation();
                        onSidebarToggle?.(item.id, !isExpanded);
                      }}
                    >
                      {isExpanded ? "▾" : "▸"}
                    </span>
                  )}
                  {!item.children && (
                    <span className="w-3 shrink-0" aria-hidden />
                  )}
                  {item.icon && (
                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 shrink-0" aria-hidden>
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate">{item.label}</span>
                </button>

                {/* Children rows */}
                {item.children && isExpanded && (
                  <div className="folder-sidebar-children">
                    {item.children.map((child) => {
                      const isChildActive = activeSidebarId === child.id;
                      return (
                        <button
                          key={child.id}
                          type="button"
                          className={cn(
                            "folder-sidebar-row folder-sidebar-child w-full flex items-center gap-1 pl-6 pr-2 py-0.5 text-xs text-left cursor-default select-none",
                            isChildActive
                              ? "bg-blue-100 text-blue-800 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                          onClick={() => {
                            onSidebarSelect?.(child.id);
                          }}
                        >
                          <span className="truncate">{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* Entry grid */}
        <div className="folder-content flex-1 overflow-y-auto p-2">
          <div className="folder-grid grid grid-cols-2 md:grid-cols-3 gap-1.5">
            {entries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="folder-entry flex flex-col rounded border border-shell bg-white overflow-hidden cursor-default select-none hover:shadow-sm text-left"
                onClick={() => onEntryOpen?.(entry.id)}
              >
                {/* Thumbnail */}
                <div className="folder-entry-thumbnail aspect-[3/2] overflow-hidden bg-gray-100 shrink-0 w-full">
                  <img
                    src={entry.thumbnailSrc}
                    alt=""
                    aria-hidden
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Entry body */}
                <div className="folder-entry-body flex flex-col gap-0.5 px-1.5 py-1 flex-1">
                  <p className="folder-entry-title text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
                    {entry.title}
                  </p>
                  {entry.metaLabel && (
                    <span className="folder-entry-meta text-[10px] leading-tight text-gray-500 line-clamp-1">
                      {entry.metaLabel}
                    </span>
                  )}
                  {entry.summary && (
                    <p className="folder-entry-summary text-[10px] leading-tight text-gray-400 line-clamp-2">
                      {entry.summary}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

export type { FolderProps, FolderSidebarItem, FolderSidebarChild, FolderEntry, FolderChip };
export default Folder;
