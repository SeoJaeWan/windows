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
 * SurfacePhase describes the motion lifecycle of an attached surface.
 *
 * Motion contract (below→up enter / current→down exit):
 *
 * - "opening" — enter animation is in progress.
 *               Root translateY moves from a positive offset (below) to 0 (up),
 *               opacity 0 → 1.
 *               The leaf applies the enter motion class.
 *
 * - "open"    — resting state; fully visible and interactive.
 *               No animation class is applied; the surface is at rest.
 *
 * - "closing" — exit animation is in progress.
 *               Root translateY moves from 0 (current) to a positive offset (down),
 *               opacity 1 → 0.
 *               The leaf applies the exit motion class.
 *               `onExitComplete` MUST be called by the leaf only in this phase,
 *               after the exit animation ends. Calling onExitComplete in
 *               "opening" or "open" is a contract violation.
 *
 * Phase transitions (host-owned, driven by the runtime hook):
 *   opening → open  (after enter animation, or immediately on open)
 *   open    → closing (on close request)
 *   closing → [unmount via finalize()] (after onExitComplete fires)
 *
 * Reduced motion:
 *   The host runtime skips the "closing" phase and calls finalize() immediately.
 *   The leaf does not need to implement a separate reduced-motion code path.
 */
export type SurfacePhase = "opening" | "open" | "closing";
