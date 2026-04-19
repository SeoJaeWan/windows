import type { Meta, StoryObj } from "@storybook/react";

import { HoverPreviewHarness } from "./taskbarBehaviorHarnesses";

const meta = {
  title: "Interactive/Taskbar/HoverPreview",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * HoverLifecycle
 *
 * Demonstrates useTaskbarHoverPreview hook contract.
 *
 * Hook-specific contract (hover vs context):
 *   - Dismiss: hover.dismiss() only. No separate close() — dismiss() cancels
 *     timers, activates pointer-reset gate, and begins closing transition.
 *   - NO focus restore on close (hover-specific; context owns focus restore).
 *   - Document whitelist close: Escape keydown + outside pointerdown close
 *     the surface. triggerRef and taskbarRootRef are whitelisted — clicks
 *     inside the taskbar or trigger do NOT close.
 *   - Missing ref no-op: if triggerRef.current or taskbarRootRef.current is
 *     null at open time, emits console.warn and does nothing.
 *   - Resting pointer no-op: after dismiss(), the pointer staying over the
 *     trigger does NOT reopen hover — a fresh leave → enter cycle is required.
 *
 * Shared lifecycle vocabulary (same as useTaskbarContextPanel):
 *   - Placement: trigger-centered x, taskbarRoot.top − 10px attached gap.
 *   - Phase gate: opening → open requires root enter animationend (onEnterComplete).
 *   - Closing: closing phase maintained until onExitComplete (root exit animationend).
 *   - Reduced motion: opening phase skipped (open immediately); closing phase
 *     skipped (finalize immediately, no animation wait).
 *   - Stale onExitComplete after reopen is no-op (latest intent wins).
 *   - Missing ref at open time: console.warn + no-op.
 *
 * Anchor contract:
 *   Surface is positioned above the trigger center (trigger bounding rect),
 *   NOT a fixed left:50% taskbar-center offset. The host reads the trigger
 *   element's getBoundingClientRect() and derives x/y.
 *
 * Motion contract (full, no reduced-motion override):
 *   - opening phase: surface rises from below (animate-task-up)
 *   - open phase: surface at rest, fully interactive
 *   - closing phase: surface falls down (animate-task-down), then unmounts
 */
export const HoverLifecycle: Story = {
  name: "Hover lifecycle (whitelist close, no focus restore, resting pointer no-op)",
  render: () => <HoverPreviewHarness />,
};
