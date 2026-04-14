import type { Meta, StoryObj } from "@storybook/react";

import WindowsPanelShell from "../windowsPanelShell";
import WindowsPanelPinnedBody from "./index";
import WindowsPanelReferenceStage from "../storybook/windowsPanelReferenceStage";
import ComparePanelStage from "../storybook/comparePanelStage";
import { PINNED_DEFAULT } from "../storybook/windowsPanelReferenceFixtures";

const meta = {
  title: "Windows Panel/Pinned",
  component: WindowsPanelPinnedBody,
} satisfies Meta<typeof WindowsPanelPinnedBody>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PinnedDefault: Story = {
  name: "Pinned default",
  render: () => (
    <WindowsPanelReferenceStage label="Pinned default">
      <WindowsPanelShell
        searchPlaceholder={PINNED_DEFAULT.searchPlaceholder}
        searchValue={PINNED_DEFAULT.searchValue}
      >
        <WindowsPanelPinnedBody
          title={PINNED_DEFAULT.title}
          actionLabel={PINNED_DEFAULT.actionLabel}
          items={[...PINNED_DEFAULT.items]}
        />
      </WindowsPanelShell>
    </WindowsPanelReferenceStage>
  ),
};

export const ComparePinnedDefault: Story = {
  render: () => (
    <ComparePanelStage kind="windows-panel-shell" state="pinned-default">
      <WindowsPanelShell
        searchPlaceholder={PINNED_DEFAULT.searchPlaceholder}
        searchValue={PINNED_DEFAULT.searchValue}
      >
        <WindowsPanelPinnedBody
          title={PINNED_DEFAULT.title}
          actionLabel={PINNED_DEFAULT.actionLabel}
          items={[...PINNED_DEFAULT.items]}
        />
      </WindowsPanelShell>
    </ComparePanelStage>
  ),
};
