import type { Meta, StoryObj } from "@storybook/react";

import WindowsPanel from "../windowsPanel";
import WindowsPanelAllView from "./index";
import WindowsPanelReferenceStage from "../storybook/windowsPanelReferenceStage";
import ComparePanelStage from "../storybook/comparePanelStage";
import { ALL_LIST, ALL_INDEX } from "../storybook/windowsPanelReferenceFixtures";

const meta = {
  title: "Windows Panel/All",
  component: WindowsPanelAllView,
} satisfies Meta<typeof WindowsPanelAllView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllList: Story = {
  name: "All list",
  render: () => (
    <WindowsPanelReferenceStage label="All list">
      <WindowsPanel
        searchPlaceholder={ALL_LIST.searchPlaceholder}
        searchValue={ALL_LIST.searchValue}
      >
        <WindowsPanelAllView
          title={ALL_LIST.title}
          backLabel={ALL_LIST.backLabel}
          mode={ALL_LIST.mode}
          sections={[...ALL_LIST.sections]}
        />
      </WindowsPanel>
    </WindowsPanelReferenceStage>
  ),
};

export const AllIndex: Story = {
  name: "All index chooser",
  render: () => (
    <WindowsPanelReferenceStage label="All index chooser">
      <WindowsPanel
        searchPlaceholder={ALL_INDEX.searchPlaceholder}
        searchValue={ALL_INDEX.searchValue}
      >
        <WindowsPanelAllView
          title={ALL_INDEX.title}
          backLabel={ALL_INDEX.backLabel}
          mode={ALL_INDEX.mode}
          sections={[...ALL_INDEX.sections]}
        />
      </WindowsPanel>
    </WindowsPanelReferenceStage>
  ),
};

export const CompareAllList: Story = {
  render: () => (
    <ComparePanelStage kind="windows-panel" state="all-list">
      <WindowsPanel
        searchPlaceholder={ALL_LIST.searchPlaceholder}
        searchValue={ALL_LIST.searchValue}
      >
        <WindowsPanelAllView
          title={ALL_LIST.title}
          backLabel={ALL_LIST.backLabel}
          mode={ALL_LIST.mode}
          sections={[...ALL_LIST.sections]}
        />
      </WindowsPanel>
    </ComparePanelStage>
  ),
};

export const CompareAllIndex: Story = {
  render: () => (
    <ComparePanelStage kind="windows-panel" state="all-index">
      <WindowsPanel
        searchPlaceholder={ALL_INDEX.searchPlaceholder}
        searchValue={ALL_INDEX.searchValue}
      >
        <WindowsPanelAllView
          title={ALL_INDEX.title}
          backLabel={ALL_INDEX.backLabel}
          mode={ALL_INDEX.mode}
          sections={[...ALL_INDEX.sections]}
        />
      </WindowsPanel>
    </ComparePanelStage>
  ),
};
