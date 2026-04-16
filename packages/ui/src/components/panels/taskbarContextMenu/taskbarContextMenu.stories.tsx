import type { Meta, StoryObj } from "@storybook/react";

import TaskbarContextMenu from "./index";
import TaskbarContextMenuReferenceStage from "./storybook/taskbarContextMenuReferenceStage";
import TaskbarContextMenuHarness from "./storybook/taskbarContextMenuHarness";
import ComparePanelStage from "../windows/storybook/comparePanelStage";
import {
  CONTEXT_PINNED,
  CONTEXT_UNPINNED,
} from "./storybook/taskbarContextMenuFixtures";

const meta = {
  title: "Taskbar/Compose/ContextMenu",
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
        appIdentifier={CONTEXT_PINNED.appIdentifier}
        phase="open"
        onExitComplete={() => {}}
        onSelectAppRow={() => {}}
        onSelectAppIdentifier={() => {}}
        onPinTaskbar={() => {}}
        onCloseAll={() => {}}
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
        appIdentifier={CONTEXT_UNPINNED.appIdentifier}
        phase="open"
        onExitComplete={() => {}}
        onSelectAppRow={() => {}}
        onSelectAppIdentifier={() => {}}
        onPinTaskbar={() => {}}
        onCloseAll={() => {}}
      />
    </TaskbarContextMenuReferenceStage>
  ),
};

export const CompareContextPinned: Story = {
  render: () => (
    <ComparePanelStage kind="taskbar-context-menu" state="context-pinned">
      <TaskbarContextMenu
        appRows={[...CONTEXT_PINNED.appRows]}
        taskbarPinState={CONTEXT_PINNED.taskbarPinState}
        appIdentifier={CONTEXT_PINNED.appIdentifier}
        phase="open"
        onExitComplete={() => {}}
        onSelectAppRow={() => {}}
        onSelectAppIdentifier={() => {}}
        onPinTaskbar={() => {}}
        onCloseAll={() => {}}
      />
    </ComparePanelStage>
  ),
};

export const CompareContextUnpinned: Story = {
  render: () => (
    <ComparePanelStage kind="taskbar-context-menu" state="context-unpinned">
      <TaskbarContextMenu
        appRows={[...CONTEXT_UNPINNED.appRows]}
        taskbarPinState={CONTEXT_UNPINNED.taskbarPinState}
        appIdentifier={CONTEXT_UNPINNED.appIdentifier}
        phase="open"
        onExitComplete={() => {}}
        onSelectAppRow={() => {}}
        onSelectAppIdentifier={() => {}}
        onPinTaskbar={() => {}}
        onCloseAll={() => {}}
      />
    </ComparePanelStage>
  ),
};

export const InteractiveHarness: Story = {
  name: "Interactive Harness",
  render: () => <TaskbarContextMenuHarness />,
};
