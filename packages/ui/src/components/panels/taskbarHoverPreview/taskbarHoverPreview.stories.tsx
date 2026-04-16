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
} satisfies Meta<typeof TaskbarHoverPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HoverSingle: Story = {
  name: "Hover single",
  render: () => (
    <TaskbarHoverPreviewReferenceStage label="Hover single (1 item)">
      <TaskbarHoverPreview
        items={[...HOVER_SINGLE.items]}
        phase="open"
        onExitComplete={() => {}}
        onSelectItem={() => {}}
        onCloseItem={() => {}}
      />
    </TaskbarHoverPreviewReferenceStage>
  ),
};

export const HoverMulti: Story = {
  name: "Hover multi",
  render: () => (
    <TaskbarHoverPreviewReferenceStage label="Hover multi (3 items)">
      <TaskbarHoverPreview
        items={[...HOVER_MULTI.items]}
        phase="open"
        onExitComplete={() => {}}
        onSelectItem={() => {}}
        onCloseItem={() => {}}
      />
    </TaskbarHoverPreviewReferenceStage>
  ),
};

export const CompareHoverSingle: Story = {
  render: () => (
    <ComparePanelStage kind="taskbar-hover-preview" state="hover-single">
      <TaskbarHoverPreview
        items={[...HOVER_SINGLE.items]}
        phase="open"
        onExitComplete={() => {}}
        onSelectItem={() => {}}
        onCloseItem={() => {}}
      />
    </ComparePanelStage>
  ),
};

export const CompareHoverMulti: Story = {
  render: () => (
    <ComparePanelStage kind="taskbar-hover-preview" state="hover-multi">
      <TaskbarHoverPreview
        items={[...HOVER_MULTI.items]}
        phase="open"
        onExitComplete={() => {}}
        onSelectItem={() => {}}
        onCloseItem={() => {}}
      />
    </ComparePanelStage>
  ),
};

