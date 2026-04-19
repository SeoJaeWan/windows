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
 *               The same mounted root element that owns the enter animation class
 *               MUST be the source of the `animationend` event that confirms
 *               the transition to "open". Bubbled events from child elements
 *               are ignored. `onEnterComplete` MUST be called by the leaf only
 *               in this phase, after the enter animation ends.
 *
 * - "open"    — resting state; fully visible and interactive.
 *               No animation class is applied; the surface is at rest.
 *
 * - "closing" — exit animation is in progress.
 *               Root translateY moves from 0 (current) to a positive offset (down),
 *               opacity 1 → 0.
 *               The leaf applies the exit motion class.
 *               The same mounted root element that owns the exit animation class
 *               MUST be the source of the `animationend` event that confirms
 *               finalize. `onExitComplete` MUST be called by the leaf only in
 *               this phase, after the exit animation ends. Calling onExitComplete
 *               in "opening" or "open" is a contract violation.
 *
 * Phase transitions (host-owned, driven by the runtime hook):
 *   opening → open      (after root enter animationend — same mounted root)
 *   open    → closing   (on close request)
 *   closing → [finalize] (after root exit animationend — same mounted root)
 *
 * Root animation boundary contract:
 *   Both enter and exit boundaries are owned by the same mounted root element.
 *   The leaf attaches `animationend` listeners to the root only — child-bubbled
 *   events and events from stale sessions are ignored via e.target guard and
 *   session ID checks in the runtime hook.
 *
 * Reduced motion:
 *   The host runtime skips the "closing" phase and calls finalize() immediately.
 *   The "opening" phase is also skipped — the surface is visible immediately
 *   after placement is measured. The leaf does not need a separate reduced-motion
 *   code path; the runtime hook handles both enter and exit bypass.
 *
 * Invalid inputs (host runtime rejects these):
 *   - Zero-size visible placement: open() must not produce a visible surface
 *     until actual DOM measurement is ready (surface element must be mounted).
 *   - Immediate opening→open overwrite: open() must not call setPhase('open')
 *     in the same call stack as setPhase('opening').
 *   - Stale enter/exit completion: animationend from a prior session is ignored.
 */
export type SurfacePhase = "opening" | "open" | "closing";
