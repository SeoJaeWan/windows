/**
 * taskbarAttachedSurface/shared
 *
 * Shared contract types for taskbar attached surfaces
 * (hover preview, context menu, etc.).
 *
 * Merge policy — reserved marker attributes:
 *   `data-state` and `data-phase` are package-owned.
 *   Surface consumers may pass `surfaceProps` to attach host-level
 *   handlers (ref, onKeyDown, aria-*, etc.) but MUST NOT set
 *   `data-state` or `data-phase` via surfaceProps; the leaf component
 *   is the sole authority over those markers.
 *
 * Generic floating placement options are intentionally NOT included.
 * Placement is always the responsibility of the host.
 *
 * server-safe — no 'use client' directive.
 */

/**
 * SurfacePhase describes the animation lifecycle of an attached surface.
 *
 * - "opening" — entrance animation is in progress
 * - "open"    — fully visible and interactive
 * - "closing" — exit animation is in progress; onExitComplete fires when done
 */
export type SurfacePhase = "opening" | "open" | "closing";
