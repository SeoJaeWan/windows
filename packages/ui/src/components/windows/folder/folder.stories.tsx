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

const meta: Meta<typeof Folder> = {
  title: "Windows/Components/Folder",
  component: Folder,
};

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
