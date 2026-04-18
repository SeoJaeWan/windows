import type { ComponentPropsWithoutRef, ReactNode } from "react";

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

/* ── Props ──────────────────────────────────────────────────────── */

type FolderProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  title: string;
  icon?: ReactNode;
  addressLabel: string;
  sidebarItems: FolderSidebarItem[];
  activeSidebarId?: string;
  expandedSidebarIds?: string[];
  entries: FolderEntry[];
  onSidebarSelect?: (id: string) => void;
  onSidebarToggle?: (id: string, nextExpanded: boolean) => void;
  onEntryOpen?: (id: string) => void;
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
 * Search trigger is desktop-only (hidden md:flex). It is a closed-state recipient:
 * no open/close logic in this component — that belongs to the host (Phase 3).
 */
function FolderChrome({ title, icon, addressLabel }: { title: string; icon?: ReactNode; addressLabel: string }) {
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

      {/* Row 2: Toolbar */}
      <div className="folder-toolbar flex items-center gap-1 px-2 bg-white border-b border-shell h-[44px]">
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

        {/* Search trigger — desktop only (hidden on mobile) */}
        {/* Closed-state recipient: no open/close logic here — host (Phase 3) adds that */}
        <div className="folder-search-trigger hidden md:flex items-center gap-1 h-8 w-80 bg-gray-50 border border-shell rounded px-2 shrink-0 overflow-hidden">
          <span className="inline-flex items-center justify-center w-4 h-4 shrink-0 text-gray-400" aria-hidden>
            <Search16Regular />
          </span>
          <span className="text-xs text-gray-400 truncate leading-none">검색</span>
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
 * - Mobile:  titlebar (icon + title + close) + toolbar (nav + address, no search trigger)
 *
 * Mobile absence rule:
 * - sidebar is hidden on mobile (< md)
 * - search trigger is hidden on mobile (< md) — desktop-only affordance
 *
 * Sidebar winner rule:
 * - activeSidebarId matches a row id → that row is selected
 * - prop absent or no match → no selection
 *
 * Expand winner rule:
 * - expandedSidebarIds contains a root id → that root is expanded
 * - prop absent or empty → no expanded roots (multi-expand allowed)
 *
 * Root row is selectable even when it has children.
 * onSidebarToggle(id, nextExpanded) fires for root rows only.
 * onEntryOpen(id) is the only entry interaction surface.
 *
 * No first-row auto-select fallback, no internal uncontrolled state,
 * no persistent selected entry state, no route-awareness.
 */
function Folder({
  title,
  icon,
  addressLabel,
  sidebarItems,
  activeSidebarId,
  expandedSidebarIds,
  entries,
  onSidebarSelect,
  onSidebarToggle,
  onEntryOpen,
  className,
  ...rest
}: FolderProps) {
  const expandedSet = new Set(expandedSidebarIds ?? []);

  return (
    <WindowFrame
      chrome={<FolderChrome title={title} icon={icon} addressLabel={addressLabel} />}
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

export type { FolderProps, FolderSidebarItem, FolderSidebarChild, FolderEntry };
export default Folder;
