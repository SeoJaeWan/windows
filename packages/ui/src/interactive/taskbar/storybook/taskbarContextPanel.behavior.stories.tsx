import type { Meta, StoryObj } from "@storybook/react";

import { ContextPanelHarness } from "./taskbarBehaviorHarnesses";

const meta = {
  title: "Interactive/Taskbar/ContextPanel",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * PointerOriginAndEscapeClose — browser acceptance recipient
 *
 * Browser gate target: Interactive/Taskbar/ContextPanel > PointerOriginAndEscapeClose
 * Selector vocabulary (data-testid):
 *   context-trigger        — the trigger button
 *   context-surface-root   — the mounted surface root (present only when isOpen)
 *   context-outside        — explicit outside-click target
 *   context-taskbar        — taskbar strip (whitelisted, does NOT close surface)
 *   context-backdrop       — desktop backdrop container
 *
 * Browser-only acceptance checklist (cannot be closed by compare or jsdom alone):
 *
 *   MUST happen:
 *   [ ] Right-click on context-trigger opens the surface at trigger-centered x/y
 *       (NOT at pointer position). context-surface-root must appear after open().
 *   [ ] Surface is in 'opening' phase until the root enter animationend fires
 *       (onEnterComplete). Phase then advances to 'open'. Requires real CSS animation.
 *   [ ] Phase advances from 'closing' to finalize (unmount) only after the root exit
 *       animationend fires (onExitComplete). Surface disappears after animation, not immediately.
 *   [ ] After close() / onExitComplete, focus returns to context-trigger (focus restore).
 *       This is context-specific — hover does NOT restore focus.
 *   [ ] Escape keydown closes the surface (focus-agnostic, document-level keydown).
 *   [ ] Pointerdown on context-outside closes the surface.
 *   [ ] Pointerdown on context-trigger does NOT close the surface (trigger is whitelisted).
 *   [ ] Pointerdown on context-taskbar does NOT close the surface (taskbar is whitelisted).
 *
 *   MUST NOT happen:
 *   [ ] Calling close() a second time while already in 'closing' phase must be a no-op
 *       (duplicate close guard). No double-finalize, no double focus restore.
 *   [ ] Anchor must NOT move to the pointer position. Surface must stay trigger-centered
 *       regardless of where the right-click occurred on the trigger.
 *   [ ] Stale onExitComplete from an old close cycle must not re-finalize a reopened surface.
 *
 * What compare stories prove (compare is NOT a substitute for browser acceptance):
 *   Compare (Taskbar/Compose/ContextMenu CompareAttachedPinned) proves only the
 *   visual baseline of the rested open state — pixel layout and token rendering.
 *   It does NOT prove: phase timing, animation boundary, focus restore, duplicate close
 *   guard, anchor origin (trigger-centered vs pointer-origin), or whitelist close.
 *   These require a real browser.
 *
 * What @windows/web route proves:
 *   The web app E2E owns its own navigation and routing contract.
 *   It does NOT substitute for hook behavior verification on this story.
 *   If later materialization cannot target this Storybook story with the existing
 *   runner, it must leave an explicit setup blocker rather than falling back to
 *   the web route or compare story.
 *
 * Hook-specific contract (context vs hover):
 *   - Open/close: open(event) + close(). Separate from hover's dismiss() surface.
 *   - Focus restore: triggerRef.current.focus() fires inside finalize() after
 *     onExitComplete (full motion) or immediately on close() (reduced motion).
 *   - Duplicate close no-op: calling close() when already closing is a no-op
 *     (controlled by the shared controller's isClosingRef guard).
 *   - Missing ref no-op: if triggerRef.current or taskbarRootRef.current is
 *     null at open time, emits console.warn and does nothing.
 *   - Stale onExitComplete after reopen is no-op (latest intent wins).
 *
 * Shared lifecycle vocabulary (same as useTaskbarHoverPreview):
 *   - Placement: trigger-centered x, taskbarRoot.top − 10px attached gap.
 *   - Phase gate: opening → open requires root enter animationend (onEnterComplete).
 *   - Closing: closing phase maintained until onExitComplete (root exit animationend).
 *   - Reduced motion: opening phase skipped; closing phase skipped (finalize immediately).
 *   - Document whitelist close: Escape keydown + outside pointerdown.
 *     triggerRef and taskbarRootRef are whitelisted.
 *
 * Anchor contract (trigger-centered, NOT pointer-origin):
 *   Surface x/y is computed from triggerRef.current.getBoundingClientRect()
 *   via calculateTaskbarPlacement. Horizontal: centered on trigger center x.
 *   Vertical: panel bottom edge is ATTACHED_GAP (10px) above taskbarRoot top.
 *   Right-click pointer position is NOT the anchor; the trigger rect is.
 *
 * Dismiss winner rule (explicit):
 *   1. Escape key — document-level keydown, focus-agnostic.
 *   2. Outside pointerdown — composedPath() whitelist (trigger + surface root + taskbar).
 *   3. Programmatic close() — consumer-owned.
 *
 * Motion contract (full, no reduced-motion override):
 *   opening → open → closing → finalize (unmount)
 *   onExitComplete is called by the leaf after the closing animation ends.
 */
export const PointerOriginAndEscapeClose: Story = {
  name: "Anchor / Escape dismiss / focus restore / duplicate close no-op",
  render: () => <ContextPanelHarness />,
};
