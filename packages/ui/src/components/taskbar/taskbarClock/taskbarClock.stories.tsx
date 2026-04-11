import type { Meta, StoryObj } from "@storybook/react";
import TaskbarClock from "./index";
import FoundationRegistrationStage from "../storybook/foundationRegistrationStage";
import { FOUNDATION_REGISTRATION } from "../storybook/foundationFigmaRegistration";

const meta = {
  title: FOUNDATION_REGISTRATION.clock.title,
  component: TaskbarClock,
  args: {
    timeLabel: "09:41",
    dateLabel: "2026-04-10",
  },
} satisfies Meta<typeof TaskbarClock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {
  render: () => (
    <FoundationRegistrationStage
      marker={FOUNDATION_REGISTRATION.clock.marker}
      label="Clock"
    >
      <TaskbarClock timeLabel="09:41" dateLabel="2026-04-10" />
    </FoundationRegistrationStage>
  ),
};
