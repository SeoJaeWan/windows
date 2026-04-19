import type { Meta, StoryObj } from "@storybook/react";

import { HoverPreviewHarness } from "./taskbarBehaviorHarnesses";

const meta = {
  title: "Interactive/Taskbar/HoverPreview",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * HoverLifecycle — browser acceptance recipient
 *
 * Browser gate target: Interactive/Taskbar/HoverPreview > HoverLifecycle
 * Selector vocabulary (data-testid):
 *   hover-trigger        — the trigger button
 *   hover-surface-root   — the mounted surface root (present only when isOpen)
 *   hover-outside        — explicit outside-click target
 *   hover-taskbar        — taskbar strip (whitelisted, does NOT close surface)
 *   hover-backdrop       — desktop backdrop container
 *
 * Browser-only acceptance checklist (cannot be closed by compare or jsdom alone):
 *
 *   MUST happen:
 *   [ ] Pointer enters trigger → surface mounts after openDelayMs (measured-open,
 *       NOT provisional snap); hover-surface-root must be absent before delay elapses.
 *   [ ] Surface is in 'opening' phase until the root enter animationend fires
 *       (onEnterComplete). Phase then advances to 'open'. Only real CSS animations
 *       produce animationend — not assertable in jsdom.
 *   [ ] Phase advances from 'closing' to finalize (unmount) only after the root exit
 *       animationend fires (onExitComplete). Surface disappears after animation ends,
 *       NOT immediately on dismiss().
 *   [ ] Escape keydown closes the surface (whitelist-document close).
 *   [ ] Pointerdown on hover-outside closes the surface.
 *   [ ] Pointerdown on hover-trigger does NOT close the surface (trigger is whitelisted).
 *   [ ] Pointerdown on hover-taskbar does NOT close the surface (taskbar is whitelisted).
 *
 *   MUST NOT happen:
 *   [ ] Surface must NOT mount before openDelayMs has elapsed (no zero-size
 *       provisional snap at pointer-enter time).
 *   [ ] After dismiss(), the pointer resting over the trigger must NOT reopen hover.
 *       Only a fresh pointerleave → pointerenter cycle can reopen.
 *   [ ] NO focus restore after close (hover-specific; context owns focus restore).
 *
 * What compare stories prove (compare is NOT a substitute for browser acceptance):
 *   Compare (Taskbar/Compose/HoverPreview CompareAttachedMulti) proves only the
 *   visual baseline of the rested open state — pixel layout and token rendering.
 *   It does NOT prove: phase timing, animation boundary, whitelist close behaviour,
 *   resting pointer no-op, or measured-open delay. These require a real browser.
 *
 * What @windows/web route proves:
 *   The web app E2E owns its own navigation and routing contract.
 *   It does NOT substitute for hook behavior verification on this story.
 *   If later materialization cannot target this Storybook story with the existing
 *   runner, it must leave an explicit setup blocker rather than falling back to
 *   the web route or compare story.
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
