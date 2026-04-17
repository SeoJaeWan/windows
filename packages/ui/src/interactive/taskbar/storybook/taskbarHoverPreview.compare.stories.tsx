/**
 * taskbarHoverPreview.compare.stories
 *
 * Machine-capture compare story for hover preview attached-host composition.
 *
 * Compare key: taskbar-hover-preview / attached-multi
 *
 * Owns exactly one compare state: the hover surface open (rested) above the
 * trigger icon, with HOVER_MULTI items. Close animation frames are NOT added
 * as new compare states — Phase 2 close path handles that behavior separately.
 *
 * Taxonomy: Taskbar/Compose/HoverPreview (same branch as leaf stories)
 * Title: literal string only.
 */

import type { Meta, StoryObj } from "@storybook/react";

import CompareRoot from "../../../components/taskbar/storybook/compareRoot";
import { TaskbarHoverPreviewCompareHarness } from "./taskbarHoverPreviewCompareHarness";

const meta = {
  title: "Taskbar/Compose/HoverPreview",
  component: TaskbarHoverPreviewCompareHarness,
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
} satisfies Meta<typeof TaskbarHoverPreviewCompareHarness>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * CompareAttachedMulti
 *
 * Attached-host compare owner for hover preview.
 * Renders the trigger icon + hover surface together.
 *
 * compare key: taskbar-hover-preview / attached-multi
 *
 * DOM contract:
 *   [data-visual-root][data-visual-kind="taskbar-hover-preview"][data-visual-state="attached-multi"]
 */
export const CompareAttachedMulti: Story = {
  render: () => (
    <CompareRoot kind="taskbar-hover-preview" state="attached-multi">
      <TaskbarHoverPreviewCompareHarness />
    </CompareRoot>
  ),
};
