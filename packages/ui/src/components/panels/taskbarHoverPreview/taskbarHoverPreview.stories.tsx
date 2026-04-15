import type { Meta, StoryObj } from "@storybook/react";

import TaskbarHoverPreview from "./index";
import TaskbarHoverPreviewReferenceStage from "./storybook/taskbarHoverPreviewReferenceStage";
import {
  HOVER_SINGLE,
  HOVER_MULTI,
} from "./storybook/taskbarHoverPreviewFixtures";

const meta = {
  title: "Taskbar Hover Preview/Preview",
  component: TaskbarHoverPreview,
} satisfies Meta<typeof TaskbarHoverPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HoverSingle: Story = {
  name: "Hover single",
  render: () => (
    <TaskbarHoverPreviewReferenceStage label="Hover single (1 item)">
      <TaskbarHoverPreview items={[...HOVER_SINGLE.items]} />
    </TaskbarHoverPreviewReferenceStage>
  ),
};

export const HoverMulti: Story = {
  name: "Hover multi",
  render: () => (
    <TaskbarHoverPreviewReferenceStage label="Hover multi (3 items)">
      <TaskbarHoverPreview items={[...HOVER_MULTI.items]} />
    </TaskbarHoverPreviewReferenceStage>
  ),
};
