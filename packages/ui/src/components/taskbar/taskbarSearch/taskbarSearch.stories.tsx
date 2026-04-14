import type { Meta, StoryObj } from "@storybook/react";
import TaskbarSearch from "./index";
import FoundationRegistrationStage from "../storybook/foundationRegistrationStage";
import CompareLeafStage from "../storybook/compareLeafStage";
import { FOUNDATION_REGISTRATION } from "../storybook/foundationFigmaRegistration";

const meta = {
  title: FOUNDATION_REGISTRATION.search.title,
  component: TaskbarSearch,
} satisfies Meta<typeof TaskbarSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {
  render: () => (
    <FoundationRegistrationStage
      marker={FOUNDATION_REGISTRATION.search.marker}
      label="Search"
    >
      <TaskbarSearch className="w-55" placeholder="검색" />
    </FoundationRegistrationStage>
  ),
};

export const Compare: Story = {
  render: () => (
    <CompareLeafStage kind="taskbar-search" state="default">
      <TaskbarSearch className="w-55" placeholder="검색" />
    </CompareLeafStage>
  ),
};
