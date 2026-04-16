import type { ReactNode } from "react";

import { cn } from "../../../internal/cn";
import IconImage from "../../common/iconImage";
import WindowFrame from "../internal/windowFrame";

type FolderSidebarItem = {
  id: string;
  label: string;
  icon?: ReactNode;
};

type FolderItem = {
  id: string;
  label: string;
  imageSrc: string;
};

type FolderProps = {
  title: string;
  icon?: ReactNode;
  addressLabel: string;
  sidebarItems: FolderSidebarItem[];
  items: FolderItem[];
  activeSidebarId?: string;
  className?: string;
};

/**
 * Folder
 *
 * Public component. Renders a Windows-style folder window built on WindowFrame.
 *
 * Layout:
 * - Desktop (md+): sidebar (fixed width, left) + items grid (right)
 * - Mobile (< md): sidebar hidden, items grid full-width
 *
 * Sidebar winner rule:
 * - Matches activeSidebarId → that row is selected
 * - No match or prop absent → sidebarItems[0] is selected
 *
 * No route-awareness, no drag/resize/minimize state,
 * no JS open/close orchestration — those are host concerns.
 */
function Folder({
  title,
  icon,
  addressLabel,
  sidebarItems,
  items,
  activeSidebarId,
  className,
}: FolderProps) {
  const resolvedActiveId =
    activeSidebarId !== undefined &&
    sidebarItems.some((s) => s.id === activeSidebarId)
      ? activeSidebarId
      : sidebarItems[0]?.id;

  return (
    <WindowFrame
      title={title}
      icon={icon}
      addressLabel={addressLabel}
      className={cn("folder", className)}
    >
      <div className="folder-body flex h-full overflow-hidden">
        {/* Sidebar — hidden on mobile */}
        <aside className="folder-sidebar hidden md:flex flex-col w-48 shrink-0 border-r border-shell bg-gray-50 overflow-y-auto py-2">
          {sidebarItems.map((item) => {
            const isSelected = item.id === resolvedActiveId;
            return (
              <div
                key={item.id}
                className={cn(
                  "folder-sidebar-item flex items-center gap-2 px-3 py-1.5 text-sm cursor-default select-none",
                  isSelected
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.icon && (
                  <span className="inline-flex items-center justify-center w-5 h-5 shrink-0" aria-hidden>
                    {item.icon}
                  </span>
                )}
                <span className="truncate">{item.label}</span>
              </div>
            );
          })}
        </aside>

        {/* Items grid */}
        <div className="folder-content flex-1 overflow-y-auto p-4">
          <div className="folder-grid grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="folder-item flex flex-col items-center gap-1.5 cursor-default select-none group"
              >
                <IconImage
                  src={item.imageSrc}
                  alt={item.label}
                  className="w-12 h-12 group-hover:opacity-80"
                />
                <span className="folder-item-label text-xs text-gray-700 text-center line-clamp-2 leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

export { type FolderProps, type FolderSidebarItem, type FolderItem };
export default Folder;
