import type { Meta, StoryObj } from "@storybook/react";

import TaskbarContextMenu from "./index";
import TaskbarContextMenuReferenceStage from "./storybook/taskbarContextMenuReferenceStage";
import {
  CONTEXT_PINNED,
  CONTEXT_UNPINNED,
} from "./storybook/taskbarContextMenuFixtures";

const meta = {
  title: "Taskbar Context Menu/Menu",
  component: TaskbarContextMenu,
} satisfies Meta<typeof TaskbarContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ContextPinned: Story = {
  name: "Context pinned",
  render: () => (
    <TaskbarContextMenuReferenceStage label="Context pinned (taskbarPinState=pinned)">
      <TaskbarContextMenu
        appRows={[...CONTEXT_PINNED.appRows]}
        taskbarPinState={CONTEXT_PINNED.taskbarPinState}
      />
    </TaskbarContextMenuReferenceStage>
  ),
};

export const ContextUnpinned: Story = {
  name: "Context unpinned",
  render: () => (
    <TaskbarContextMenuReferenceStage label="Context unpinned (taskbarPinState=unpinned)">
      <TaskbarContextMenu
        appRows={[...CONTEXT_UNPINNED.appRows]}
        taskbarPinState={CONTEXT_UNPINNED.taskbarPinState}
      />
    </TaskbarContextMenuReferenceStage>
  ),
};
