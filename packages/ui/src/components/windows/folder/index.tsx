import type { ComponentPropsWithoutRef, ReactNode } from "react";

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

/**
 * Folder
 *
 * Public component. Renders a Windows Explorer-style folder window built on WindowFrame.
 *
 * Layout:
 * - Desktop (md+): sidebar tree (left) + thumbnail entry grid (right)
 * - Mobile (< md): stacked — sidebar collapses, entries below
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
      title={title}
      icon={icon}
      addressLabel={addressLabel}
      className={cn("folder", className)}
      {...rest}
    >
      <div className="folder-body flex h-full overflow-hidden">
        {/* Sidebar */}
        <aside className="folder-sidebar flex flex-col w-48 shrink-0 border-r border-shell bg-gray-50 overflow-y-auto py-1">
          {sidebarItems.map((item) => {
            const isExpanded = item.children ? expandedSet.has(item.id) : false;
            const isActive = activeSidebarId === item.id;

            return (
              <div key={item.id} className="folder-sidebar-group">
                {/* Root row */}
                <button
                  type="button"
                  className={cn(
                    "folder-sidebar-row w-full flex items-center gap-1.5 px-3 py-1 text-sm text-left cursor-default select-none",
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
                    <span className="inline-flex items-center justify-center w-4 h-4 shrink-0" aria-hidden>
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
                            "folder-sidebar-row folder-sidebar-child w-full flex items-center gap-1.5 pl-7 pr-3 py-1 text-sm text-left cursor-default select-none",
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
        <div className="folder-content flex-1 overflow-y-auto p-4">
          <div className="folder-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="folder-entry flex flex-col rounded border border-shell bg-white overflow-hidden cursor-default select-none hover:shadow-sm text-left"
                onClick={() => onEntryOpen?.(entry.id)}
              >
                {/* Thumbnail */}
                <div className="folder-entry-thumbnail aspect-video overflow-hidden bg-gray-100 shrink-0 w-full">
                  <img
                    src={entry.thumbnailSrc}
                    alt=""
                    aria-hidden
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Entry body */}
                <div className="folder-entry-body flex flex-col gap-1 p-3 flex-1">
                  {entry.metaLabel && (
                    <span className="folder-entry-meta text-xs text-gray-400 truncate">
                      {entry.metaLabel}
                    </span>
                  )}
                  <p className="folder-entry-title text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
                    {entry.title}
                  </p>
                  {entry.summary && (
                    <p className="folder-entry-summary text-xs text-gray-500 line-clamp-2 leading-relaxed">
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
