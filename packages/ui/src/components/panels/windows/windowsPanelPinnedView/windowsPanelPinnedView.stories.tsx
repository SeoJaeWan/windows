import type { Meta, StoryObj } from "@storybook/react";

import WindowsPanel from "../windowsPanel";
import WindowsPanelPinnedView from "./index";
import WindowsPanelReferenceStage from "../storybook/windowsPanelReferenceStage";
import ComparePanelStage from "../storybook/comparePanelStage";
import { PINNED_DEFAULT } from "../storybook/windowsPanelReferenceFixtures";

const meta = {
  title: "Windows Panel/Pinned",
  component: WindowsPanelPinnedView,
} satisfies Meta<typeof WindowsPanelPinnedView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PinnedDefault: Story = {
  name: "Pinned default",
  render: () => (
    <WindowsPanelReferenceStage label="Pinned default">
      <WindowsPanel
        searchPlaceholder={PINNED_DEFAULT.searchPlaceholder}
        searchValue={PINNED_DEFAULT.searchValue}
      >
        <WindowsPanelPinnedView
          title={PINNED_DEFAULT.title}
          actionLabel={PINNED_DEFAULT.actionLabel}
          items={[...PINNED_DEFAULT.items]}
        />
      </WindowsPanel>
    </WindowsPanelReferenceStage>
  ),
};

export const ComparePinnedDefault: Story = {
  render: () => (
    <ComparePanelStage kind="windows-panel" state="pinned-default">
      <WindowsPanel
        searchPlaceholder={PINNED_DEFAULT.searchPlaceholder}
        searchValue={PINNED_DEFAULT.searchValue}
      >
        <WindowsPanelPinnedView
          title={PINNED_DEFAULT.title}
          actionLabel={PINNED_DEFAULT.actionLabel}
          items={[...PINNED_DEFAULT.items]}
        />
      </WindowsPanel>
    </ComparePanelStage>
  ),
};
