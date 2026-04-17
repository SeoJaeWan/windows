import type { Meta, StoryObj } from "@storybook/react";

import WindowsPanel from "../windowsPanel";
import WindowsPanelAllView from "./index";
import WindowsPanelReferenceStage from "../storybook/windowsPanelReferenceStage";
import ComparePanelStage from "../storybook/comparePanelStage";
import { ALL_LIST, ALL_INDEX } from "../storybook/windowsPanelReferenceFixtures";

const meta = {
  title: "Panels/Windows/AllView",
  component: WindowsPanelAllView,
  args: {
    title: ALL_LIST.title,
    backLabel: ALL_LIST.backLabel,
    mode: ALL_LIST.mode,
    sections: [...ALL_LIST.sections],
  },
} satisfies Meta<typeof WindowsPanelAllView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllList: Story = {
  name: "All list",
  args: {
    title: ALL_LIST.title,
    backLabel: ALL_LIST.backLabel,
    mode: ALL_LIST.mode,
    sections: [...ALL_LIST.sections],
  },
  render: (args) => (
    <WindowsPanelReferenceStage label="All list">
      <WindowsPanel
        searchPlaceholder={ALL_LIST.searchPlaceholder}
        searchValue={ALL_LIST.searchValue}
      >
        <WindowsPanelAllView {...args} />
      </WindowsPanel>
    </WindowsPanelReferenceStage>
  ),
};

export const AllIndex: Story = {
  name: "All index chooser",
  args: {
    title: ALL_INDEX.title,
    backLabel: ALL_INDEX.backLabel,
    mode: ALL_INDEX.mode,
    sections: [...ALL_INDEX.sections],
  },
  render: (args) => (
    <WindowsPanelReferenceStage label="All index chooser">
      <WindowsPanel
        searchPlaceholder={ALL_INDEX.searchPlaceholder}
        searchValue={ALL_INDEX.searchValue}
      >
        <WindowsPanelAllView {...args} />
      </WindowsPanel>
    </WindowsPanelReferenceStage>
  ),
};

export const CompareAllList: Story = {
  args: {
    title: ALL_LIST.title,
    backLabel: ALL_LIST.backLabel,
    mode: ALL_LIST.mode,
    sections: [...ALL_LIST.sections],
  },
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: (args) => (
    <ComparePanelStage kind="windows-panel" state="all-list">
      <WindowsPanel
        searchPlaceholder={ALL_LIST.searchPlaceholder}
        searchValue={ALL_LIST.searchValue}
      >
        <WindowsPanelAllView {...args} />
      </WindowsPanel>
    </ComparePanelStage>
  ),
};

export const CompareAllIndex: Story = {
  args: {
    title: ALL_INDEX.title,
    backLabel: ALL_INDEX.backLabel,
    mode: ALL_INDEX.mode,
    sections: [...ALL_INDEX.sections],
  },
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: (args) => (
    <ComparePanelStage kind="windows-panel" state="all-index">
      <WindowsPanel
        searchPlaceholder={ALL_INDEX.searchPlaceholder}
        searchValue={ALL_INDEX.searchValue}
      >
        <WindowsPanelAllView {...args} />
      </WindowsPanel>
    </ComparePanelStage>
  ),
};
