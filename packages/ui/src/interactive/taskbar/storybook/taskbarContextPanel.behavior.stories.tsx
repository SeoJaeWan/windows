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
 * Demonstrates context panel behavior:
 * - Right-click opens context menu at pointer origin
 * - Escape key closes the context menu
 * - Focus is restored to the trigger button on close
 */
export const PointerOriginAndEscapeClose: Story = {
  name: "Pointer origin / Escape close / Focus restore",
  render: () => <ContextPanelHarness />,
};
