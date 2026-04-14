import type { Meta, StoryObj } from "@storybook/react";

import WindowsPanelShell from "../windowsPanelShell";
import WindowsPanelAllBody from "./index";
import WindowsPanelReferenceStage from "../storybook/windowsPanelReferenceStage";
import ComparePanelStage from "../storybook/comparePanelStage";
import { ALL_LIST, ALL_INDEX } from "../storybook/windowsPanelReferenceFixtures";

const meta = {
  title: "Windows Panel/All",
  component: WindowsPanelAllBody,
} satisfies Meta<typeof WindowsPanelAllBody>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllList: Story = {
  name: "All list",
  render: () => (
    <WindowsPanelReferenceStage label="All list">
      <WindowsPanelShell
        searchPlaceholder={ALL_LIST.searchPlaceholder}
        searchValue={ALL_LIST.searchValue}
      >
        <WindowsPanelAllBody
          title={ALL_LIST.title}
          backLabel={ALL_LIST.backLabel}
          mode={ALL_LIST.mode}
          sections={[...ALL_LIST.sections]}
        />
      </WindowsPanelShell>
    </WindowsPanelReferenceStage>
  ),
};

export const AllIndex: Story = {
  name: "All index chooser",
  render: () => (
    <WindowsPanelReferenceStage label="All index chooser">
      <WindowsPanelShell
        searchPlaceholder={ALL_INDEX.searchPlaceholder}
        searchValue={ALL_INDEX.searchValue}
      >
        <WindowsPanelAllBody
          title={ALL_INDEX.title}
          backLabel={ALL_INDEX.backLabel}
          mode={ALL_INDEX.mode}
          sections={[...ALL_INDEX.sections]}
        />
      </WindowsPanelShell>
    </WindowsPanelReferenceStage>
  ),
};

export const CompareAllList: Story = {
  render: () => (
    <ComparePanelStage kind="windows-panel-shell" state="all-list">
      <WindowsPanelShell
        searchPlaceholder={ALL_LIST.searchPlaceholder}
        searchValue={ALL_LIST.searchValue}
      >
        <WindowsPanelAllBody
          title={ALL_LIST.title}
          backLabel={ALL_LIST.backLabel}
          mode={ALL_LIST.mode}
          sections={[...ALL_LIST.sections]}
        />
      </WindowsPanelShell>
    </ComparePanelStage>
  ),
};

export const CompareAllIndex: Story = {
  render: () => (
    <ComparePanelStage kind="windows-panel-shell" state="all-index">
      <WindowsPanelShell
        searchPlaceholder={ALL_INDEX.searchPlaceholder}
        searchValue={ALL_INDEX.searchValue}
      >
        <WindowsPanelAllBody
          title={ALL_INDEX.title}
          backLabel={ALL_INDEX.backLabel}
          mode={ALL_INDEX.mode}
          sections={[...ALL_INDEX.sections]}
        />
      </WindowsPanelShell>
    </ComparePanelStage>
  ),
};
