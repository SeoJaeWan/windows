import type {ComponentPropsWithoutRef, CSSProperties, ReactNode} from "react";

import TaskbarSearch from "../../../taskbar/taskbarSearch";
import PanelSurface from "../../shared/panelSurface";

type WindowsPanelProps = ComponentPropsWithoutRef<"div"> & {
    searchPlaceholder?: string;
    searchValue?: string;
    children?: ReactNode;
};

/**
 * WindowsPanel
 *
 * Desktop-only panel card that provides the rounded container, bright background,
 * and top search row. Geometry mirrors the blog reference implementation:
 *
 * - Container: h-150, rounded-lg, border border-[--panel-border], bg-gray-50,
 *   backdrop-blur-2xl, shadow-sm
 * - Inner layout: px-5 pt-5, text-sm
 * - Search input: full-width rounded-full with left icon (panel-specific geometry)
 * - Content region: flex-1 overflow-hidden (content provides its own pt-7 spacing)
 *
 * State orchestration (open/close, anchor, render-target, key-dismiss,
 * click-away) is intentionally excluded — those concerns belong to a future
 * interactive layer.
 */
function WindowsPanel({searchPlaceholder, searchValue, children, className, style, ...rest}: WindowsPanelProps) {
    return (
        <PanelSurface
            className={`windows-panel ${className ?? ""}`.trim()}
            style={{ "--panel-border": "var(--taskbar-border)", ...style } as CSSProperties}
            {...rest}
        >
            <form className="windows-panel-search-row shrink-0">
                <TaskbarSearch className="w-full" placeholder={searchPlaceholder} value={searchValue} />
            </form>
            <div className="windows-panel-content flex-1 min-h-0 overflow-hidden">{children}</div>
        </PanelSurface>
    );
}

export default WindowsPanel;
