import type { Meta, StoryObj } from "@storybook/react";

import TaskbarContextMenu from "./index";
import TaskbarContextMenuReferenceStage from "./storybook/taskbarContextMenuReferenceStage";
import ComparePanelStage from "../windows/storybook/comparePanelStage";
import {
  CONTEXT_PINNED,
  CONTEXT_UNPINNED,
} from "./storybook/taskbarContextMenuFixtures";

const meta = {
  title: "Taskbar/Compose/ContextMenu",
  component: TaskbarContextMenu,
  args: {
    appRows: [...CONTEXT_PINNED.appRows],
    taskbarPinState: CONTEXT_PINNED.taskbarPinState,
    appIdentifier: CONTEXT_PINNED.appIdentifier,
    phase: "open",
    onEnterComplete: () => {},
    onExitComplete: () => {},
    onSelectAppRow: () => {},
    onSelectAppIdentifier: () => {},
    onPinTaskbar: () => {},
    onCloseAll: () => {},
  },
} satisfies Meta<typeof TaskbarContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ContextPinned: Story = {
  name: "Context pinned",
  args: {
    appRows: [...CONTEXT_PINNED.appRows],
    taskbarPinState: CONTEXT_PINNED.taskbarPinState,
    appIdentifier: CONTEXT_PINNED.appIdentifier,
  },
  render: (args) => (
    <TaskbarContextMenuReferenceStage label="Context pinned (taskbarPinState=pinned)">
      <TaskbarContextMenu {...args} />
    </TaskbarContextMenuReferenceStage>
  ),
};

export const ContextUnpinned: Story = {
  name: "Context unpinned",
  args: {
    appRows: [...CONTEXT_UNPINNED.appRows],
    taskbarPinState: CONTEXT_UNPINNED.taskbarPinState,
    appIdentifier: CONTEXT_UNPINNED.appIdentifier,
  },
  render: (args) => (
    <TaskbarContextMenuReferenceStage label="Context unpinned (taskbarPinState=unpinned)">
      <TaskbarContextMenu {...args} />
    </TaskbarContextMenuReferenceStage>
  ),
};

export const CompareContextPinned: Story = {
  args: {
    appRows: [...CONTEXT_PINNED.appRows],
    taskbarPinState: CONTEXT_PINNED.taskbarPinState,
    appIdentifier: CONTEXT_PINNED.appIdentifier,
  },
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: (args) => (
    <ComparePanelStage kind="taskbar-context-menu" state="context-pinned">
      <TaskbarContextMenu {...args} />
    </ComparePanelStage>
  ),
};

export const CompareContextUnpinned: Story = {
  args: {
    appRows: [...CONTEXT_UNPINNED.appRows],
    taskbarPinState: CONTEXT_UNPINNED.taskbarPinState,
    appIdentifier: CONTEXT_UNPINNED.appIdentifier,
  },
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: (args) => (
    <ComparePanelStage kind="taskbar-context-menu" state="context-unpinned">
      <TaskbarContextMenu {...args} />
    </ComparePanelStage>
  ),
};
