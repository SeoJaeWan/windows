import type { Meta, StoryObj } from "@storybook/react";
import TaskbarWindowsButton from "./index";
import FoundationRegistrationStage from "../storybook/foundationRegistrationStage";
import { FOUNDATION_REGISTRATION } from "../storybook/foundationFigmaRegistration";

const meta = {
  title: FOUNDATION_REGISTRATION.windows.title,
  component: TaskbarWindowsButton,
} satisfies Meta<typeof TaskbarWindowsButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {
  render: () => (
    <FoundationRegistrationStage
      marker={FOUNDATION_REGISTRATION.windows.marker}
      label="Windows"
    >
      <TaskbarWindowsButton aria-label="Windows" />
    </FoundationRegistrationStage>
  ),
};
