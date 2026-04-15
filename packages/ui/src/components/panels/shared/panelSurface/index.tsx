import type { ComponentPropsWithoutRef, ReactNode } from "react";

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
 * Border color is read from the neutral `--panel-border` custom property.
 * Each family wrapper sets this variable to its own design token
 * (e.g. Windows maps it to `--taskbar-border`).
 *
 * Internal-only — NOT exported from package root.
 */
function PanelSurface({ children, className, ...rest }: PanelSurfaceProps) {
    return (
        <div
            className={`panel-surface rounded-lg border border-[var(--panel-border,#ccd0d9)] bg-gray-50 backdrop-blur-2xl shadow-sm ${className ?? ""}`.trim()}
            {...rest}
        >
            {children}
        </div>
    );
}

export default PanelSurface;
