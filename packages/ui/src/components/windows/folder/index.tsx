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
 * - Desktop (md+): tab navigation (top) + blog-card grid
 * - Mobile (< md): same, single-column or 2-column grid
 *
 * Navigation winner rule:
 * - Matches activeNavigationId → that tab is selected
 * - No match or prop absent → navigationItems[0] is selected
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
      <div className="folder-body flex flex-col h-full overflow-hidden">
        {/* Tab navigation */}
        <nav className="folder-tabs flex items-end gap-0 px-4 pt-2 shrink-0 border-b border-shell bg-gray-50">
          {navigationItems.map((item) => {
            const isActive = item.id === resolvedActiveId;
            return (
              <div
                key={item.id}
                className={cn(
                  "folder-tab flex items-center gap-1.5 px-4 py-1.5 text-sm cursor-default select-none border-t border-l border-r rounded-t",
                  isActive
                    ? "bg-white border-shell text-gray-800 font-medium -mb-px z-10 relative"
                    : "bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200"
                )}
              >
                <img
                    src={item.iconSrc}
                    alt=""
                    aria-hidden
                    className="w-4 h-4 object-contain shrink-0"
                  />
                <span className="truncate">{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Blog card grid */}
        <div className="folder-content flex-1 overflow-y-auto p-4">
          <div className="folder-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="folder-card flex flex-col rounded border border-shell bg-white overflow-hidden cursor-default select-none hover:shadow-sm"
              >
                {/* Cover image */}
                <div className="folder-card-cover aspect-video overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={item.coverSrc}
                    alt=""
                    aria-hidden
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Card body */}
                <div className="folder-card-body flex flex-col gap-1 p-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="folder-card-tag text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium shrink-0">
                      {item.tagLabel}
                    </span>
                    <span className="folder-card-date text-xs text-gray-400 truncate">
                      {item.dateLabel}
                    </span>
                  </div>
                  <p className="folder-card-title text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
                    {item.title}
                  </p>
                  <p className="folder-card-summary text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
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
