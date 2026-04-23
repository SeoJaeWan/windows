import type { KeyboardEvent, ReactNode } from "react";
import {
  Dismiss12Regular,
  Search16Regular,
  Square12Regular,
  Subtract12Regular,
} from "@fluentui/react-icons";

import { cn } from "../../../internal/cn";
import WindowFrame from "../internal/windowFrame";
import type {
  FolderDropdownItem,
  GridItem,
  SearchChip,
  SidebarItem,
} from "../shared/types";

type FolderProps = {
  title: string;

  /* ── Location input (address-like field) ───────────────────── */
  locationValue: string;
  locationDropdownItems?: FolderDropdownItem[];
  onOpenLocationDropdown?: () => void;
  onLocationValueChange?: (value: string) => void;
  onLocationSubmit?: (value: string) => void;
  onSelectLocationDropdownItem?: (item: FolderDropdownItem) => void;

  /* ── Search input + chips ─────────────────────────────────── */
  searchValue: string;
  searchDropdownItems?: FolderDropdownItem[];
  searchChips?: SearchChip[];
  onOpenSearchDropdown?: () => void;
  onSearchValueChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onSelectSearchDropdownItem?: (item: FolderDropdownItem) => void;
  onSelectSearchChip?: (chip: SearchChip) => void;

  /* ── Sidebar ──────────────────────────────────────────────── */
  sidebarItems: SidebarItem[];
  activeSidebarItemId?: string;
  onSelectSidebarItem?: (item: SidebarItem) => void;

  /* ── Grid ─────────────────────────────────────────────────── */
  items: GridItem[];
  onOpenItem?: (item: GridItem) => void;

  /* ── Window controls ──────────────────────────────────────── */
  onMinimize?: () => void;
  onToggleMaximize?: () => void;
  onClose?: () => void;
};

/**
 * Folder
 *
 * Public windows-family leaf for a file-browser-style window. Pure UI:
 * does not own route, history, or filtering. Callbacks are pass-through;
 * the host decides what Enter, chip clicks, or item activation mean.
 *
 * Public contract boundary:
 *   - Enter submits the current controlled value verbatim (no internal filter).
 *   - Empty or absent dropdown items → dropdown surface NOT rendered.
 *   - Invalid `activeSidebarItemId` → no row highlighted (silent no-op).
 *   - Missing callback → silent no-op.
 *   - Detail states (hover / expanded / open) are storybook-owned via
 *     fixture scaffolding, NOT public props.
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
  const chipRow =
    searchChips && searchChips.length > 0 ? (
      <div
        className="folder-chip-row flex items-center gap-2 px-3 py-1.5 border-b border-shell overflow-x-auto"
        data-folder-chip-row=""
      >
        {searchChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => onSelectSearchChip?.(chip)}
            data-folder-chip-id={chip.id}
            data-folder-chip-active={chip.active ? "" : undefined}
            className={cn(
              "folder-chip inline-flex items-center h-6 px-2 rounded-full text-xs border border-shell",
              chip.active
                ? "bg-shell-active text-white border-transparent"
                : "bg-white text-shell hover:bg-shell-surface"
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <div className="folder flex flex-col h-full">
      <WindowFrame
        className="flex-1 min-h-0"
        chrome={
          <>
            <div className="folder-title text-sm text-shell font-medium truncate px-2 shrink-0">
              {title}
            </div>
            <LocationInput
              value={locationValue}
              items={locationDropdownItems}
              onOpen={onOpenLocationDropdown}
              onChange={onLocationValueChange}
              onSubmit={onLocationSubmit}
              onSelectItem={onSelectLocationDropdownItem}
            />
            <SearchInput
              value={searchValue}
              items={searchDropdownItems}
              onOpen={onOpenSearchDropdown}
              onChange={onSearchValueChange}
              onSubmit={onSearchSubmit}
              onSelectItem={onSelectSearchDropdownItem}
            />
          </>
        }
        controls={
          <WindowControls
            onMinimize={onMinimize}
            onToggleMaximize={onToggleMaximize}
            onClose={onClose}
          />
        }
      >
        <div className="flex flex-col flex-1 min-h-0">
          {chipRow}
          <div className="flex flex-1 min-h-0">
            <Sidebar
              items={sidebarItems}
              activeId={activeSidebarItemId}
              onSelect={onSelectSidebarItem}
            />
            <Grid items={items} onOpen={onOpenItem} />
          </div>
        </div>
      </WindowFrame>
    </div>
  );
}

/* ── LocationInput ──────────────────────────────────────────── */

function LocationInput({
  value,
  items,
  onOpen,
  onChange,
  onSubmit,
  onSelectItem,
}: {
  value: string;
  items?: FolderDropdownItem[];
  onOpen?: () => void;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onSelectItem?: (item: FolderDropdownItem) => void;
}) {
  const hasDropdown = !!items && items.length > 0;
  return (
    <div
      className="folder-location relative flex-1 min-w-0"
      data-folder-location-open={hasDropdown ? "" : undefined}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => onOpen?.()}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit?.(value);
          }
        }}
        className="folder-location-input w-full h-7 px-2 text-sm text-shell bg-white border border-shell rounded-md outline-none focus:taskbar-focus-ring"
        aria-label="location"
      />
      {hasDropdown ? (
        <ul
          className="folder-location-dropdown absolute left-0 top-full mt-1 w-full bg-white border border-shell rounded-md shadow-sm z-10"
          role="listbox"
          data-folder-location-dropdown=""
        >
          {items!.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectItem?.(item)}
                className="folder-location-dropdown-item w-full text-left px-2 h-7 text-sm text-shell hover:bg-shell-surface flex items-center gap-2"
              >
                <span className="truncate">{item.label}</span>
                {item.path ? (
                  <span className="text-shell-muted text-xs truncate">{item.path}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ── SearchInput ────────────────────────────────────────────── */

function SearchInput({
  value,
  items,
  onOpen,
  onChange,
  onSubmit,
  onSelectItem,
}: {
  value: string;
  items?: FolderDropdownItem[];
  onOpen?: () => void;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onSelectItem?: (item: FolderDropdownItem) => void;
}) {
  const hasDropdown = !!items && items.length > 0;
  return (
    <div
      className="folder-search relative w-52 shrink-0"
      data-folder-search-open={hasDropdown ? "" : undefined}
    >
      <div className="relative flex items-center">
        <Search16Regular
          aria-hidden="true"
          className="absolute left-2 text-shell-muted pointer-events-none"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => onOpen?.()}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit?.(value);
            }
          }}
          className="folder-search-input w-full h-7 pl-7 pr-2 text-sm text-shell bg-white border border-shell rounded-md outline-none focus:taskbar-focus-ring"
          placeholder="search"
          aria-label="search"
        />
      </div>
      {hasDropdown ? (
        <ul
          className="folder-search-dropdown absolute right-0 top-full mt-1 w-full bg-white border border-shell rounded-md shadow-sm z-10"
          role="listbox"
          data-folder-search-dropdown=""
        >
          {items!.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectItem?.(item)}
                className="folder-search-dropdown-item w-full text-left px-2 h-7 text-sm text-shell hover:bg-shell-surface"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────────── */

function Sidebar({
  items,
  activeId,
  onSelect,
}: {
  items: SidebarItem[];
  activeId?: string;
  onSelect?: (item: SidebarItem) => void;
}) {
  return (
    <nav
      className="folder-sidebar w-40 shrink-0 border-r border-shell hidden md:flex flex-col py-2 bg-shell-surface/50 overflow-y-auto"
      data-folder-sidebar=""
      aria-label="sidebar"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            data-folder-sidebar-id={item.id}
            data-folder-sidebar-active={isActive ? "" : undefined}
            onClick={() => onSelect?.(item)}
            className={cn(
              "folder-sidebar-item flex items-center gap-2 h-8 px-3 text-sm text-left text-shell hover:bg-white/60",
              isActive && "bg-white text-shell font-medium"
            )}
          >
            {item.iconUrl ? (
              <img
                src={item.iconUrl}
                alt=""
                aria-hidden="true"
                className="w-4 h-4 shrink-0"
              />
            ) : null}
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ── Grid ───────────────────────────────────────────────────── */

function Grid({
  items,
  onOpen,
}: {
  items: GridItem[];
  onOpen?: (item: GridItem) => void;
}) {
  return (
    <div
      className="folder-grid flex-1 min-w-0 overflow-y-auto p-3 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] auto-rows-min gap-3 bg-white"
      data-folder-grid=""
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onOpen?.(item)}
          data-folder-grid-id={item.id}
          className="folder-grid-item flex flex-col items-stretch gap-1 p-2 rounded-md text-left hover:bg-shell-surface"
        >
          <div className="folder-grid-thumb aspect-[4/3] w-full bg-shell-surface rounded-sm overflow-hidden flex items-center justify-center">
            {item.thumbnailUrl ? (
              <img
                src={item.thumbnailUrl}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            ) : item.iconUrl ? (
              <img
                src={item.iconUrl}
                alt=""
                aria-hidden="true"
                className="w-10 h-10"
              />
            ) : null}
          </div>
          <div className="text-sm text-shell truncate">{item.name}</div>
          {item.meta ? (
            <div className="text-xs text-shell-muted truncate">{item.meta}</div>
          ) : null}
        </button>
      ))}
    </div>
  );
}

/* ── Window controls ────────────────────────────────────────── */

function WindowControls({
  onMinimize,
  onToggleMaximize,
  onClose,
}: {
  onMinimize?: () => void;
  onToggleMaximize?: () => void;
  onClose?: () => void;
}) {
  return (
    <>
      <ControlButton
        kind="minimize"
        onClick={onMinimize}
        aria-label="minimize"
        icon={<Subtract12Regular aria-hidden="true" />}
      />
      <ControlButton
        kind="maximize"
        onClick={onToggleMaximize}
        aria-label="maximize"
        icon={<Square12Regular aria-hidden="true" />}
      />
      <ControlButton
        kind="close"
        onClick={onClose}
        aria-label="close"
        icon={<Dismiss12Regular aria-hidden="true" />}
      />
    </>
  );
}

function ControlButton({
  kind,
  onClick,
  icon,
  ...rest
}: {
  kind: "minimize" | "maximize" | "close";
  onClick?: () => void;
  icon: ReactNode;
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-window-control={kind}
      className={cn(
        "window-control-btn inline-flex items-center justify-center rounded-sm text-shell transition-colors",
        kind === "close"
          ? "hover:bg-red-500 hover:text-white"
          : "hover:bg-shell-surface-hover"
      )}
      {...rest}
    >
      {icon}
    </button>
  );
}

export type { FolderProps };
export default Folder;
