import type { Meta, StoryObj } from "@storybook/react";

import WindowsPanel from "../windowsPanel";
import WindowsPanelPinnedView from "./index";
import WindowsPanelReferenceStage from "../storybook/windowsPanelReferenceStage";
import ComparePanelStage from "../storybook/comparePanelStage";
import { PINNED_DEFAULT } from "../storybook/windowsPanelReferenceFixtures";

const meta = {
  title: "Windows/Components/PinnedView",
  component: WindowsPanelPinnedView,
  args: {
    title: PINNED_DEFAULT.title,
    actionLabel: PINNED_DEFAULT.actionLabel,
    items: [...PINNED_DEFAULT.items],
  },
} satisfies Meta<typeof WindowsPanelPinnedView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PinnedDefault: Story = {
  name: "Pinned default",
  args: {
    title: PINNED_DEFAULT.title,
    actionLabel: PINNED_DEFAULT.actionLabel,
    items: [...PINNED_DEFAULT.items],
  },
  render: (args) => (
    <WindowsPanelReferenceStage label="Pinned default">
      <WindowsPanel
        searchPlaceholder={PINNED_DEFAULT.searchPlaceholder}
        searchValue={PINNED_DEFAULT.searchValue}
      >
        <WindowsPanelPinnedView {...args} />
      </WindowsPanel>
    </WindowsPanelReferenceStage>
  ),
};

export const ComparePinnedDefault: Story = {
  args: {
    title: PINNED_DEFAULT.title,
    actionLabel: PINNED_DEFAULT.actionLabel,
    items: [...PINNED_DEFAULT.items],
  },
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: (args) => (
    <ComparePanelStage kind="windows-panel" state="pinned-default">
      <WindowsPanel
        searchPlaceholder={PINNED_DEFAULT.searchPlaceholder}
        searchValue={PINNED_DEFAULT.searchValue}
      >
        <WindowsPanelPinnedView {...args} />
      </WindowsPanel>
    </ComparePanelStage>
  ),
};
