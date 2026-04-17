import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "../../../internal/cn";
import WindowFrame from "../internal/windowFrame";

type FolderNavigationItem = {
  id: string;
  label: string;
  iconSrc: string;
};

type FolderItem = {
  id: string;
  title: string;
  summary: string;
  dateLabel: string;
  coverSrc: string;
  tagLabel: string;
};

type FolderProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  title: string;
  icon?: ReactNode;
  addressLabel: string;
  navigationItems: FolderNavigationItem[];
  activeNavigationId?: string;
  items: FolderItem[];
};

/**
 * Folder
 *
 * Public component. Renders a Windows-style folder window built on WindowFrame.
 *
 * Layout:
 * - Desktop (md+): left tree navigation sidebar + right thumbnail grid (3 columns)
 * - Mobile (< md): no sidebar + 2-column thumbnail grid
 *
 * Navigation winner rule:
 * - Matches activeNavigationId → that item is selected
 * - No match or prop absent → navigationItems[0] is selected
 *
 * Card style: thumbnail image + title only (compact Windows Explorer style).
 *
 * No route-awareness, no drag/resize/minimize state,
 * no JS open/close orchestration — those are host concerns.
 */
function Folder({
  title,
  icon,
  addressLabel,
  navigationItems,
  activeNavigationId,
  items,
  className,
  ...rest
}: FolderProps) {
  const resolvedActiveId =
    activeNavigationId !== undefined &&
    navigationItems.some((n) => n.id === activeNavigationId)
      ? activeNavigationId
      : navigationItems[0]?.id;

  return (
    <WindowFrame
      title={title}
      icon={icon}
      addressLabel={addressLabel}
      className={cn("folder", className)}
      {...rest}
    >
      <div className="folder-body flex flex-row h-full overflow-hidden">
        {/* Left tree navigation sidebar — desktop only */}
        <nav className="folder-sidebar hidden md:flex flex-col shrink-0 w-36 border-r border-shell bg-white py-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = item.id === resolvedActiveId;
            return (
              <div
                key={item.id}
                className={cn(
                  "folder-nav-item flex items-center gap-1.5 px-3 py-1 text-xs cursor-default select-none",
                  isActive
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <img
                  src={item.iconSrc}
                  alt=""
                  aria-hidden
                  className="w-3.5 h-3.5 object-contain shrink-0"
                />
                <span className="truncate">{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Thumbnail grid */}
        <div className="folder-content flex-1 overflow-y-auto p-3 bg-white">
          <div className="folder-grid grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="folder-card flex flex-col items-center cursor-default select-none"
              >
                {/* Thumbnail image */}
                <div className="folder-card-thumb w-full aspect-[4/3] overflow-hidden bg-gray-50 rounded-sm">
                  <img
                    src={item.coverSrc}
                    alt=""
                    aria-hidden
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Title only */}
                <p className="folder-card-title text-xs text-gray-800 mt-1 text-center leading-tight line-clamp-2 w-full px-0.5">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

export { type FolderProps, type FolderNavigationItem, type FolderItem };
export default Folder;
