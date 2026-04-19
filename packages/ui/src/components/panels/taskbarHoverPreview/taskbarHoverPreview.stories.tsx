import type { Meta, StoryObj } from "@storybook/react";

import TaskbarHoverPreview from "./index";
import TaskbarHoverPreviewReferenceStage from "./storybook/taskbarHoverPreviewReferenceStage";
import ComparePanelStage from "../windows/storybook/comparePanelStage";
import {
  HOVER_SINGLE,
  HOVER_MULTI,
} from "./storybook/taskbarHoverPreviewFixtures";

const meta = {
  title: "Taskbar/Compose/HoverPreview",
  component: TaskbarHoverPreview,
  args: {
    items: [...HOVER_SINGLE.items],
    phase: "open",
    onEnterComplete: () => {},
    onExitComplete: () => {},
    onSelectItem: () => {},
    onCloseItem: () => {},
  },
} satisfies Meta<typeof TaskbarHoverPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HoverSingle: Story = {
  name: "Hover single",
  args: {
    items: [...HOVER_SINGLE.items],
  },
  render: (args) => (
    <TaskbarHoverPreviewReferenceStage label="Hover single (1 item)">
      <TaskbarHoverPreview {...args} />
    </TaskbarHoverPreviewReferenceStage>
  ),
};

export const HoverMulti: Story = {
  name: "Hover multi",
  args: {
    items: [...HOVER_MULTI.items],
  },
  render: (args) => (
    <TaskbarHoverPreviewReferenceStage label="Hover multi (3 items)">
      <TaskbarHoverPreview {...args} />
    </TaskbarHoverPreviewReferenceStage>
  ),
};

export const CompareHoverSingle: Story = {
  args: {
    items: [...HOVER_SINGLE.items],
  },
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: (args) => (
    <ComparePanelStage kind="taskbar-hover-preview" state="hover-single">
      <TaskbarHoverPreview {...args} />
    </ComparePanelStage>
  ),
};

export const CompareHoverMulti: Story = {
  args: {
    items: [...HOVER_MULTI.items],
  },
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: (args) => (
    <ComparePanelStage kind="taskbar-hover-preview" state="hover-multi">
      <TaskbarHoverPreview {...args} />
    </ComparePanelStage>
  ),
};
