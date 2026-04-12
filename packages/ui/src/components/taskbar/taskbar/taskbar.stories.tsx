import type { Meta, StoryObj } from "@storybook/react";
import Taskbar from "./index";
import TaskbarWindowsButton from "../taskbarWindowsButton/index";
import TaskbarSearch from "../taskbarSearch/index";
import TaskbarIconButton from "../taskbarIconButton/index";
import TaskbarClock from "../taskbarClock/index";
import iconFixture from "../storybook/assets/taskbar-foundation-icon.png";

const iconSrc = typeof iconFixture === "string" ? iconFixture : iconFixture.src;

const meta = {
  title: "Taskbar Foundation/Taskbar",
  component: Taskbar,
} satisfies Meta<typeof Taskbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {
  render: () => (
    <div
      data-marker="taskbar-foundation-taskbar-reference"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 1024,
        margin: "0 auto",
      }}
    >
      {/* Bright desktop backdrop — decorative storybook context only */}
      <div
        style={{
          width: "100%",
          height: "calc(var(--taskbar-height) * 4)",
          background:
            "linear-gradient(135deg, #1e90ff 0%, #87ceeb 50%, #4fc3f7 100%)",
          borderRadius: "8px 8px 0 0",
        }}
      />
      <Taskbar aria-label="작업 표시줄" role="navigation">
        <TaskbarWindowsButton aria-label="Windows" />
        <TaskbarSearch placeholder="검색" />
        <TaskbarIconButton status="default" iconSrc={iconSrc} />
        <TaskbarIconButton status="active" iconSrc={iconSrc} />
        <TaskbarIconButton status="hide" iconSrc={iconSrc} />
        <div style={{ flex: 1 }} />
        <TaskbarClock timeLabel="오전 10:18" dateLabel="2026-04-10" />
      </Taskbar>
    </div>
  ),
};
