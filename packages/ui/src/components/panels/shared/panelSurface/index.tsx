import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "../../../../internal/cn";

type PanelSurfaceProps = ComponentPropsWithoutRef<"div"> & {
    children?: ReactNode;
};

/**
 * PanelSurface
 *
 * Minimal card frame shared by all panel families.
 * Provides only the visual card appearance: rounded corners, border,
 * background, backdrop blur, and shadow.
 *
 * Does NOT impose any wrapper geometry (sizing, padding, display,
 * flex direction, responsive visibility, text size). Those concerns
 * belong to the wrapper component.
 *
 * Does NOT render a search input or own any public root class
 * (e.g. `windows-panel`, `search-panel`). The wrapper component
 * is responsible for those concerns.
 *
 * Border color reads from the shell canonical `--shell-border` token
 * via the `border-shell` utility. No bridge alias needed.
 *
 * Internal-only — NOT exported from package root.
 */
function PanelSurface({ children, className, ...rest }: PanelSurfaceProps) {
    return (
        <div
            className={cn(
                "panel-surface rounded-lg border border-shell bg-gray-50 backdrop-blur-2xl shadow-sm",
                className
            )}
            {...rest}
        >
            {children}
        </div>
    );
}

export default PanelSurface;
