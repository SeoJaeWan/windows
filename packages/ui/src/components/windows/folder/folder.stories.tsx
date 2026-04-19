import type { Meta, StoryObj } from "@storybook/react";

import Folder from "./index";
import {
  WindowDesktopStage,
} from "../storybook/windowReferenceStage";
import {
  FOLDER_DESKTOP_BLOG,
  FOLDER_MOBILE_BLOG,
  FOLDER_DESKTOP_SEARCH_OPEN,
  FOLDER_SIDEBAR_EXPANDED,
  FOLDER_NO_SELECTION,
  FOLDER_LONG_TITLE,
  FOLDER_LONG_ADDRESS,
  FOLDER_NO_CHIPS,
} from "../storybook/folderReferenceFixtures";
import WindowCompareRoot from "../storybook/windowCompareRoot";
import {
  CompareWindowDesktopStage,
  CompareWindowMobileStage,
} from "../storybook/compareWindowStage";
import { WindowReviewRoot } from "../storybook/windowReviewRoot";

const meta = {
  title: "Windows/Compose/Folder",
  component: Folder,
  args: {
    ...FOLDER_DESKTOP_BLOG,
  },
} satisfies Meta<typeof Folder>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Canonical compare exports ──────────────────────────────────── */
// machine-capture: IDs windows-compose-folder--compare-desktop-blog,
//   windows-compose-folder--compare-desktop-search-open, windows-compose-folder--compare-mobile-blog

export const CompareDesktopBlog: Story = {
  render: () => (
    <CompareWindowDesktopStage>
      {/* bounded exception: scoped height rule to fill capture canvas */}
      <style>{`[data-visual-root] { flex: 1; height: 100%; }`}</style>
      <WindowCompareRoot kind="folder" state="desktop-blog">
        <Folder {...FOLDER_DESKTOP_BLOG} className="h-full" />
      </WindowCompareRoot>
    </CompareWindowDesktopStage>
  ),
};

export const CompareDesktopSearchOpen: Story = {
  render: () => (
    <CompareWindowDesktopStage>
      {/* bounded exception: scoped height rule to fill capture canvas */}
      <style>{`[data-visual-root] { flex: 1; height: 100%; }`}</style>
      <WindowCompareRoot kind="folder" state="desktop-search-open">
        <Folder {...FOLDER_DESKTOP_SEARCH_OPEN} className="h-full" />
      </WindowCompareRoot>
    </CompareWindowDesktopStage>
  ),
};

export const CompareMobileBlog: Story = {
  render: () => (
    <CompareWindowMobileStage>
      {/* bounded exception: scoped height rule to fill capture canvas */}
      <style>{`[data-visual-root] { flex: 1; height: 100%; }`}</style>
      <WindowCompareRoot kind="folder" state="mobile-blog">
        <Folder {...FOLDER_MOBILE_BLOG} className="h-full" />
      </WindowCompareRoot>
    </CompareWindowMobileStage>
  ),
};

/* ── Review-only exports (structural) ──────────────────────────── */
// human-review only — NOT in compare inventory, NOT wrapped in CompareRoot
// IDs: windows-compose-folder--sidebar-expanded-review, windows-compose-folder--no-selection-review

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

/* ── Review-only edge state exports ─────────────────────────────── */
// IDs: windows-compose-folder--review-long-title, windows-compose-folder--review-long-address,
//      windows-compose-folder--review-no-chips

export const ReviewLongTitle: Story = {
  render: () => (
    <WindowDesktopStage>
      <WindowReviewRoot kind="folder" state="long-title">
        <Folder {...FOLDER_LONG_TITLE} />
      </WindowReviewRoot>
    </WindowDesktopStage>
  ),
};

export const ReviewLongAddress: Story = {
  render: () => (
    <WindowDesktopStage>
      <WindowReviewRoot kind="folder" state="long-address">
        <Folder {...FOLDER_LONG_ADDRESS} />
      </WindowReviewRoot>
    </WindowDesktopStage>
  ),
};

export const ReviewNoChips: Story = {
  render: () => (
    <WindowDesktopStage>
      <WindowReviewRoot kind="folder" state="no-chips">
        <Folder {...FOLDER_NO_CHIPS} />
      </WindowReviewRoot>
    </WindowDesktopStage>
  ),
};
