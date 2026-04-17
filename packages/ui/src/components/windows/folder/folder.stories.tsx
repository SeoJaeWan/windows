import type { Meta, StoryObj } from "@storybook/react";

import Folder from "./index";
import {
  WindowDesktopStage,
  WindowMobileStage,
} from "../storybook/windowReferenceStage";
import {
  FOLDER_DESKTOP_BLOG,
  FOLDER_MOBILE_BLOG,
} from "../storybook/folderReferenceFixtures";
import CompareRoot from "../../taskbar/storybook/compareRoot";
import {
  CompareWindowDesktopStage,
  CompareWindowMobileStage,
} from "../storybook/compareWindowStage";

const meta = {
  title: "Windows/Folder",
  component: Folder,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    ...FOLDER_DESKTOP_BLOG,
  },
} satisfies Meta<typeof Folder>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DesktopBlog: Story = {
  name: "Desktop blog",
  render: () => (
    <WindowDesktopStage>
      <Folder {...FOLDER_DESKTOP_BLOG} />
    </WindowDesktopStage>
  ),
};

export const MobileBlog: Story = {
  name: "Mobile blog",
  render: () => (
    <WindowMobileStage>
      <Folder {...FOLDER_MOBILE_BLOG} />
    </WindowMobileStage>
  ),
};

export const CompareDesktopBlog: Story = {
  render: () => (
    <CompareWindowDesktopStage>
      <CompareRoot kind="folder" state="desktop-blog">
        <Folder {...FOLDER_DESKTOP_BLOG} />
      </CompareRoot>
    </CompareWindowDesktopStage>
  ),
};

export const CompareMobileBlog: Story = {
  render: () => (
    <CompareWindowMobileStage>
      <CompareRoot kind="folder" state="mobile-blog">
        <Folder {...FOLDER_MOBILE_BLOG} />
      </CompareRoot>
    </CompareWindowMobileStage>
  ),
};
