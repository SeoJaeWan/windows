import { useRef, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Folder from "./index";
import {
  WindowDesktopStage,
  WindowMobileStage,
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
import CompareRoot from "../../taskbar/storybook/compareRoot";
import {
  CompareWindowDesktopStage,
  CompareWindowMobileStage,
} from "../storybook/compareWindowStage";
import { WindowReviewRoot } from "../storybook/windowReviewRoot";

const meta = {
  title: "Windows/Folder",
  component: Folder,
  args: {
    ...FOLDER_DESKTOP_BLOG,
  },
} satisfies Meta<typeof Folder>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Search-open harness ────────────────────────────────────────── */
// Internal-only search panel open state: simulate search trigger click after mount.

function FolderWithSearchOpen(props: React.ComponentProps<typeof Folder>) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Find and click the search trigger to open the search panel
    const trigger = document.querySelector<HTMLButtonElement>(".folder-search-trigger");
    if (trigger) {
      trigger.click();
    }
  }, []);

  return <Folder {...props} ref={triggerRef as unknown as React.Ref<HTMLDivElement>} />;
}

/* ── Canonical compare exports ──────────────────────────────────── */
// machine-capture: IDs windows-folder--compare-desktop-blog,
//   windows-folder--compare-desktop-search-open, windows-folder--compare-mobile-blog

export const CompareDesktopBlog: Story = {
  render: () => (
    <CompareWindowDesktopStage>
      {/* bounded exception: scoped height rule to fill capture canvas */}
      <style>{`[data-visual-root] { flex: 1; height: 100%; }`}</style>
      <CompareRoot kind="folder" state="desktop-blog">
        <Folder {...FOLDER_DESKTOP_BLOG} className="h-full" />
      </CompareRoot>
    </CompareWindowDesktopStage>
  ),
};

export const CompareDesktopSearchOpen: Story = {
  render: () => (
    <CompareWindowDesktopStage>
      {/* bounded exception: scoped height rule to fill capture canvas */}
      <style>{`[data-visual-root] { flex: 1; height: 100%; }`}</style>
      <CompareRoot kind="folder" state="desktop-search-open">
        <FolderWithSearchOpen {...FOLDER_DESKTOP_SEARCH_OPEN} className="h-full" />
      </CompareRoot>
    </CompareWindowDesktopStage>
  ),
};

export const CompareMobileBlog: Story = {
  render: () => (
    <CompareWindowMobileStage>
      {/* bounded exception: scoped height rule to fill capture canvas */}
      <style>{`[data-visual-root] { flex: 1; height: 100%; }`}</style>
      <CompareRoot kind="folder" state="mobile-blog">
        <Folder {...FOLDER_MOBILE_BLOG} className="h-full" />
      </CompareRoot>
    </CompareWindowMobileStage>
  ),
};

/* ── Review-only exports (structural) ──────────────────────────── */
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

/* ── Review-only edge state exports ─────────────────────────────── */
// IDs: windows-folder--long-title-review, windows-folder--long-address-review,
//      windows-folder--no-chips-review

export const LongTitleReview: Story = {
  name: "Long title (review)",
  render: () => (
    <WindowDesktopStage>
      <WindowReviewRoot kind="folder" state="long-title">
        <Folder {...FOLDER_LONG_TITLE} />
      </WindowReviewRoot>
    </WindowDesktopStage>
  ),
};

export const LongAddressReview: Story = {
  name: "Long address (review)",
  render: () => (
    <WindowDesktopStage>
      <WindowReviewRoot kind="folder" state="long-address">
        <Folder {...FOLDER_LONG_ADDRESS} />
      </WindowReviewRoot>
    </WindowDesktopStage>
  ),
};

export const NoChipsReview: Story = {
  name: "No chips (review)",
  render: () => (
    <WindowDesktopStage>
      <WindowReviewRoot kind="folder" state="no-chips">
        <Folder {...FOLDER_NO_CHIPS} />
      </WindowReviewRoot>
    </WindowDesktopStage>
  ),
};
