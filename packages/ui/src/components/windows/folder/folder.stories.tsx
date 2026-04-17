import type { Meta, StoryObj } from "@storybook/react";

import Folder from "./index";
import {
  WindowDesktopStage,
  WindowMobileStage,
} from "../storybook/windowReferenceStage";
import {
  FOLDER_DESKTOP_DEFAULT,
  FOLDER_MOBILE_COLLAPSED,
} from "../storybook/folderReferenceFixtures";
import CompareRoot from "../../taskbar/storybook/compareRoot";
import {
  CompareWindowDesktopStage,
  CompareWindowMobileStage,
} from "../storybook/compareWindowStage";

const meta = {
  title: "Windows/Folder",
  component: Folder,
} satisfies Meta<typeof Folder>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DesktopDefault: Story = {
  name: "Desktop default",
  render: () => (
    <WindowDesktopStage>
      <Folder {...FOLDER_DESKTOP_DEFAULT} />
    </WindowDesktopStage>
  ),
};

export const MobileCollapsed: Story = {
  name: "Mobile collapsed",
  render: () => (
    <WindowMobileStage>
      <Folder {...FOLDER_MOBILE_COLLAPSED} />
    </WindowMobileStage>
  ),
};

export const CompareDesktopBlog: Story = {
  render: () => (
    <CompareWindowDesktopStage>
      <CompareRoot kind="windows-folder" state="desktop-blog">
        <Folder {...FOLDER_DESKTOP_DEFAULT} />
      </CompareRoot>
    </CompareWindowDesktopStage>
  ),
};

export const CompareMobileBlog: Story = {
  render: () => (
    <CompareWindowMobileStage>
      <CompareRoot kind="windows-folder" state="mobile-blog">
        <Folder {...FOLDER_MOBILE_COLLAPSED} />
      </CompareRoot>
    </CompareWindowMobileStage>
  ),
};
