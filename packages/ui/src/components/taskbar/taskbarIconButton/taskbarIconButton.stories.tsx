import type { Meta, StoryObj } from "@storybook/react";
import TaskbarIconButton from "./index";
import FoundationRegistrationStage from "../storybook/foundationRegistrationStage";
import CompareLeafStage from "../storybook/compareLeafStage";
import { FOUNDATION_REGISTRATION } from "../storybook/foundationFigmaRegistration";
import iconFixture from "../storybook/assets/taskbar-foundation-icon.png";

const iconSrc = typeof iconFixture === "string" ? iconFixture : iconFixture.src;

const meta = {
  title: FOUNDATION_REGISTRATION.icon.title,
  component: TaskbarIconButton,
  args: {
    status: "default",
    iconSrc: iconSrc,
  },
} satisfies Meta<typeof TaskbarIconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <FoundationRegistrationStage
        marker={FOUNDATION_REGISTRATION.icon.markers.default}
        label="default"
      >
        <TaskbarIconButton status="default" iconSrc={iconSrc} />
      </FoundationRegistrationStage>
      <FoundationRegistrationStage
        marker={FOUNDATION_REGISTRATION.icon.markers.active}
        label="active"
      >
        <TaskbarIconButton status="active" iconSrc={iconSrc} />
      </FoundationRegistrationStage>
      <FoundationRegistrationStage
        marker={FOUNDATION_REGISTRATION.icon.markers.hide}
        label="hide"
      >
        <TaskbarIconButton status="hide" iconSrc={iconSrc} />
      </FoundationRegistrationStage>
    </div>
  ),
};

export const CompareDefault: Story = {
  render: () => (
    <CompareLeafStage kind="taskbar-icon-button" state="default">
      <TaskbarIconButton status="default" iconSrc={iconSrc} />
    </CompareLeafStage>
  ),
};

export const CompareActive: Story = {
  render: () => (
    <CompareLeafStage kind="taskbar-icon-button" state="active">
      <TaskbarIconButton status="active" iconSrc={iconSrc} />
    </CompareLeafStage>
  ),
};

export const CompareHide: Story = {
  render: () => (
    <CompareLeafStage kind="taskbar-icon-button" state="hide">
      <TaskbarIconButton status="hide" iconSrc={iconSrc} />
    </CompareLeafStage>
  ),
};
