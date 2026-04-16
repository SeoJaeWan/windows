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
 * Demonstrates the full hover intent open/close/exit lifecycle:
 * - Pointer enters trigger → delay → preview opens
 * - Pointer leaves trigger (or preview) → delay → preview closes
 * - Pointer re-enters within closeDelay → close cancelled, preview stays open
 */
export const HoverLifecycle: Story = {
  name: "Hover lifecycle",
  render: () => <HoverPreviewHarness />,
};
