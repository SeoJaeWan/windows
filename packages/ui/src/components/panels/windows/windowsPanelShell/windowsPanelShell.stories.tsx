import type { Meta, StoryObj } from "@storybook/react";

import WindowsPanelShell from "./index";
import WindowsPanelReferenceStage from "../storybook/windowsPanelReferenceStage";
import { PINNED_DEFAULT } from "../storybook/windowsPanelReferenceFixtures";

const meta = {
  title: "Windows Panel/Shell",
  component: WindowsPanelShell,
} satisfies Meta<typeof WindowsPanelShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  name: "Empty shell",
  render: () => (
    <WindowsPanelReferenceStage label="Empty shell">
      <WindowsPanelShell
        searchPlaceholder={PINNED_DEFAULT.searchPlaceholder}
        searchValue={PINNED_DEFAULT.searchValue}
      />
    </WindowsPanelReferenceStage>
  ),
};
