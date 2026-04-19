/**
 * taskbarAttachedSurface/motion
 *
 * Shared motion constants and helpers for taskbar attached surface leaves
 * (hover preview, context menu).
 *
 * Motion grammar:
 *   Enter  — below→up: translateY(+offset) → translateY(0), opacity 0 → 1
 *   Exit   — current→down: translateY(0) → translateY(+offset), opacity 1 → 0
 *
 * The enter and exit are intentionally asymmetric in direction:
 *   - enter comes from below and rises up
 *   - exit falls down from current position
 * This ensures open !== close (constraint: same direction or scale-only is not allowed).
 *
 * server-safe — no 'use client' directive; CSS class literals only.
 */

import type { SurfacePhase } from "./shared";

/**
 * Tailwind animation class for enter motion (below→up).
 *
 * Matches task-up keyframe:
 *   0%:   opacity 0, translateY(+large offset)
 *   100%: opacity 1, translateY(0)
 *
 * Duration: 220ms, easing: cubic-bezier(0.2, 0.75, 0.25, 1) (spring-like deceleration)
 */
export const MOTION_ENTER_CLASS = "animate-task-up" as const;

/**
 * Tailwind animation class for exit motion (current→down).
 *
 * Matches task-down keyframe:
 *   0%:   opacity 1, translateY(0)
 *   100%: opacity 0, translateY(+large offset)
 *
 * Duration: 200ms, easing: cubic-bezier(0.4, 0, 0.6, 1) (acceleration)
 */
export const MOTION_EXIT_CLASS = "animate-task-down" as const;

/**
 * Returns the root motion class for the given phase.
 *
 * - "opening" → enter class (below→up)
 * - "open"    → "" (resting, no animation)
 * - "closing" → exit class (current→down)
 */
export function getMotionClass(phase: SurfacePhase): string {
  switch (phase) {
    case "opening":
      return MOTION_ENTER_CLASS;
    case "open":
      return "";
    case "closing":
      return MOTION_EXIT_CLASS;
  }
}

/**
 * Attaches a native animationend listener to the given root element,
 * guarded to the "opening" phase only.
 *
 * Same mounted root contract:
 *   The root element that owns the enter animation class is the same element
 *   whose `animationend` event confirms the opening→open transition.
 *   Bubbled events from child elements are ignored via e.target guard.
 *
 * The listener:
 *   - fires onEnterComplete only when phase === "opening"
 *   - ignores bubbled animationend events from child elements
 *     (e.target !== rootEl guard)
 *
 * Returns a cleanup function that removes the listener.
 *
 * Usage (in useEffect):
 *   useEffect(() => {
 *     if (!rootRef.current) return;
 *     return attachEnterListener(rootRef.current, phase, onEnterComplete);
 *   }, [phase, onEnterComplete]);
 */
export function attachEnterListener(
  rootEl: HTMLElement,
  phase: SurfacePhase,
  onEnterComplete: () => void
): () => void {
  const handler = (e: Event) => {
    // Only fire when phase is opening AND the event target is the root itself
    // (not a bubbled child animationend)
    if (phase !== "opening") return;
    if (e.target !== rootEl) return;
    onEnterComplete();
  };

  rootEl.addEventListener("animationend", handler);
  return () => {
    rootEl.removeEventListener("animationend", handler);
  };
}

/**
 * Attaches a native animationend listener to the given root element,
 * guarded to the "closing" phase only.
 *
 * Same mounted root contract:
 *   The root element that owns the exit animation class is the same element
 *   whose `animationend` event confirms the closing→finalize transition.
 *   Bubbled events from child elements are ignored via e.target guard.
 *
 * The listener:
 *   - fires onExitComplete only when phase === "closing"
 *   - ignores bubbled animationend events from child elements
 *     (e.target !== rootEl guard)
 *
 * Returns a cleanup function that removes the listener.
 *
 * Usage (in useEffect):
 *   useEffect(() => {
 *     if (!rootRef.current) return;
 *     return attachExitListener(rootRef.current, phase, onExitComplete);
 *   }, [phase, onExitComplete]);
 */
export function attachExitListener(
  rootEl: HTMLElement,
  phase: SurfacePhase,
  onExitComplete: () => void
): () => void {
  const handler = (e: Event) => {
    // Only fire when phase is closing AND the event target is the root itself
    // (not a bubbled child animationend)
    if (phase !== "closing") return;
    if (e.target !== rootEl) return;
    onExitComplete();
  };

  rootEl.addEventListener("animationend", handler);
  return () => {
    rootEl.removeEventListener("animationend", handler);
  };
}
