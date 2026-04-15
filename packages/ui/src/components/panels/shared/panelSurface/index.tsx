import type { ComponentPropsWithoutRef, ReactNode } from "react";

type PanelSurfaceProps = ComponentPropsWithoutRef<"div"> & {
    children?: ReactNode;
};

/**
 * PanelSurface
 *
 * Search-row-free card frame shared by all panel families.
 * Provides the rounded container, bright background, and backdrop blur.
 *
 * Does NOT render a search input or own any public root class
 * (e.g. `windows-panel`, `search-panel`). The wrapper component
 * is responsible for those concerns.
 *
 * Internal-only — NOT exported from package root.
 */
function PanelSurface({ children, className, ...rest }: PanelSurfaceProps) {
    return (
        <div
            className={`h-150 w-192 rounded-lg border border-taskbar bg-gray-50 backdrop-blur-2xl shadow-sm text-sm hidden md:flex flex-col px-5 pt-5 ${className ?? ""}`.trim()}
            {...rest}
        >
            {children}
        </div>
    );
}

export default PanelSurface;
