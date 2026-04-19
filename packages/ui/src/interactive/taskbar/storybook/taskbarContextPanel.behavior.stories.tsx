import type { Meta, StoryObj } from "@storybook/react";

import { ContextPanelHarness } from "./taskbarBehaviorHarnesses";

const meta = {
  title: "Interactive/Taskbar/ContextPanel",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * PointerOriginAndEscapeClose
 *
 * Demonstrates useTaskbarContextPanel hook contract.
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
