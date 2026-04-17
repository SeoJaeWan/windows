import type { Meta, StoryObj } from "@storybook/react";

import Folder from "./index";
import {
  WindowDesktopStage,
  WindowMobileStage,
} from "../storybook/windowReferenceStage";
import {
  FOLDER_DESKTOP_BLOG,
  FOLDER_MOBILE_BLOG,
  FOLDER_SIDEBAR_EXPANDED,
  FOLDER_NO_SELECTION,
} from "../storybook/folderReferenceFixtures";
import CompareRoot from "../../taskbar/storybook/compareRoot";
import {
  CompareWindowDesktopStage,
  CompareWindowMobileStage,
} from "../storybook/compareWindowStage";

const meta = {
  title: "Windows/Folder",
  component: Folder,
  args: {
    ...FOLDER_DESKTOP_BLOG,
  },
} satisfies Meta<typeof Folder>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Canonical compare exports ──────────────────────────────────── */
// machine-capture: IDs windows-folder--compare-desktop-blog, windows-folder--compare-mobile-blog

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

/* ── Review-only exports ────────────────────────────────────────── */
// human-review only — NOT in compare inventory, NOT wrapped in CompareRoot
// IDs: windows-folder--sidebar-expanded-review, windows-folder--no-selection-review

export const SidebarExpandedReview: Story = {
  name: "Sidebar expanded (review)",
  render: () => (
    <WindowDesktopStage>
      <Folder {...FOLDER_SIDEBAR_EXPANDED} />
    </WindowDesktopStage>
  ),
};

export const NoSelectionReview: Story = {
  name: "No selection (review)",
  render: () => (
    <WindowDesktopStage>
      <Folder {...FOLDER_NO_SELECTION} />
    </WindowDesktopStage>
  ),
};
