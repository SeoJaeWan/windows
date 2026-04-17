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
 * Demonstrates the trigger-centered hover attach and full motion lifecycle:
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
 *
 * Dismiss contract:
 *   - Hover pointer leaves trigger or surface → closeDelayMs → closing phase
 *   - Escape key: document-level keydown (focus-agnostic, hook-owned)
 *   - Outside pointerdown: document-level handler with composedPath() whitelist
 *   - After dismiss(), pointer-reset gate prevents reopen until fresh leave → enter
 */
export const HoverLifecycle: Story = {
  name: "Hover lifecycle (trigger-centered, full motion)",
  render: () => <HoverPreviewHarness />,
};
