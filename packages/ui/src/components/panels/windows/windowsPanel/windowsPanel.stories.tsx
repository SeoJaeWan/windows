import type { Meta, StoryObj } from "@storybook/react";

import WindowsPanel from "./index";
import WindowsPanelReferenceStage from "../storybook/windowsPanelReferenceStage";
import { PINNED_DEFAULT } from "../storybook/windowsPanelReferenceFixtures";

const meta = {
  title: "Windows/Components/Panel",
  component: WindowsPanel,
} satisfies Meta<typeof WindowsPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  name: "Empty panel",
  render: () => (
    <WindowsPanelReferenceStage label="Empty panel">
      <WindowsPanel
        searchPlaceholder={PINNED_DEFAULT.searchPlaceholder}
        searchValue={PINNED_DEFAULT.searchValue}
      />
    </WindowsPanelReferenceStage>
  ),
};
