/**
 * taskbarContextPanel.compare.stories
 *
 * Machine-capture compare story for context panel attached-host composition.
 *
 * Compare key: taskbar-context-menu / attached-pinned
 *
 * Owns exactly one compare state: the context menu open (rested, pinned state)
 * above the trigger icon. Close animation frames are NOT added as new compare
 * states — Phase 2 close path handles that behavior separately.
 *
 * Taxonomy: Taskbar/Compose/ContextMenu (host composition branch)
 * Title: literal string only.
 */

import type { Meta, StoryObj } from "@storybook/react";

import CompareRoot from "../../../components/taskbar/storybook/compareRoot";
import { TaskbarContextPanelCompareHarness } from "./taskbarContextPanelCompareHarness";

const meta = {
  title: "Taskbar/Compose/ContextMenu",
  component: TaskbarContextPanelCompareHarness,
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
} satisfies Meta<typeof TaskbarContextPanelCompareHarness>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * CompareAttachedPinned
 *
 * Attached-host compare owner for context panel (pinned state).
 * Renders the trigger icon + context surface together.
 *
 * compare key: taskbar-context-menu / attached-pinned
 *
 * DOM contract:
 *   [data-visual-root][data-visual-kind="taskbar-context-menu"][data-visual-state="attached-pinned"]
 */
export const CompareAttachedPinned: Story = {
  render: () => (
    <CompareRoot kind="taskbar-context-menu" state="attached-pinned">
      <TaskbarContextPanelCompareHarness />
    </CompareRoot>
  ),
};
