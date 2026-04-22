import type { Meta, StoryObj } from "@storybook/react";

import Folder from "./index";
import CompareWindowStage from "../storybook/compareWindowStage";
import WindowReferenceStage from "../storybook/windowReferenceStage";
import {
  FOLDER_LIVE_BLOG,
  FOLDER_LIVE_SEARCH_OPEN,
  FOLDER_LIVE_CHIP_OPEN,
  FOLDER_LIVE_SIDEBAR_HOVER,
  FOLDER_LIVE_SIDEBAR_EXPANDED,
  FOLDER_LIVE_THUMBNAIL_HOVER,
  FOLDER_MOBILE_BLOG,
  FOLDER_MOBILE_SEARCH_OPEN,
} from "../storybook/folderReferenceFixtures";

const meta = {
  title: "Windows/Compose/Folder",
  component: Folder,
} satisfies Meta<typeof Folder>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Reference stories (human review) ───────────────────────────── */

export const Reference: Story = {
  name: "Reference",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", padding: "2rem" }}>
      <WindowReferenceStage label="folder/live-blog — desktop" stageAttr="desktop">
        <Folder {...FOLDER_LIVE_BLOG} />
      </WindowReferenceStage>
      <WindowReferenceStage label="folder/live-search-open — desktop" stageAttr="desktop">
        <Folder {...FOLDER_LIVE_SEARCH_OPEN} />
      </WindowReferenceStage>
      <WindowReferenceStage label="folder/live-chip-open — desktop" stageAttr="desktop">
        <Folder {...FOLDER_LIVE_CHIP_OPEN} />
      </WindowReferenceStage>
      <WindowReferenceStage label="folder/mobile-blog — mobile" stageAttr="mobile">
        <Folder {...FOLDER_MOBILE_BLOG} />
      </WindowReferenceStage>
      <WindowReferenceStage label="folder/mobile-search-open — mobile" stageAttr="mobile">
        <Folder {...FOLDER_MOBILE_SEARCH_OPEN} />
      </WindowReferenceStage>
    </div>
  ),
};

/* ── Compare stories (machine capture) ──────────────────────────── */

/**
 * compare key: folder/live-blog
 * storyId:     windows-compose-folder--compare-live-blog
 * stageAttr:   desktop
 */
export const CompareLiveBlog: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="live-blog" stageAttr="desktop">
      <Folder {...FOLDER_LIVE_BLOG} />
    </CompareWindowStage>
  ),
};

/**
 * compare key: folder/live-search-open
 * storyId:     windows-compose-folder--compare-live-search-open
 * stageAttr:   desktop
 */
export const CompareLiveSearchOpen: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="live-search-open" stageAttr="desktop">
      <Folder {...FOLDER_LIVE_SEARCH_OPEN} />
    </CompareWindowStage>
  ),
};

/**
 * compare key: folder/live-chip-open
 * storyId:     windows-compose-folder--compare-live-chip-open
 * stageAttr:   desktop
 * Detail-state owner: storybook/internal review (chip anchor visible via prop array)
 */
export const CompareLiveChipOpen: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="live-chip-open" stageAttr="desktop">
      <Folder {...FOLDER_LIVE_CHIP_OPEN} />
    </CompareWindowStage>
  ),
};

/**
 * compare key: folder/live-sidebar-hover
 * storyId:     windows-compose-folder--compare-live-sidebar-hover
 * stageAttr:   desktop
 * Detail-state owner: storybook/internal review (sidebar hover — NOT public prop)
 */
export const CompareLiveSidebarHover: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="live-sidebar-hover" stageAttr="desktop">
      <Folder {...FOLDER_LIVE_SIDEBAR_HOVER} />
    </CompareWindowStage>
  ),
};

/**
 * compare key: folder/live-sidebar-expanded
 * storyId:     windows-compose-folder--compare-live-sidebar-expanded
 * stageAttr:   desktop
 * Detail-state owner: storybook/internal review (sidebar expanded — NOT public prop)
 */
export const CompareLiveSidebarExpanded: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="live-sidebar-expanded" stageAttr="desktop">
      <Folder {...FOLDER_LIVE_SIDEBAR_EXPANDED} />
    </CompareWindowStage>
  ),
};

/**
 * compare key: folder/live-thumbnail-hover
 * storyId:     windows-compose-folder--compare-live-thumbnail-hover
 * stageAttr:   desktop
 * Detail-state owner: storybook/internal review (thumbnail hover — NOT public prop)
 */
export const CompareLiveThumbnailHover: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="live-thumbnail-hover" stageAttr="desktop">
      <Folder {...FOLDER_LIVE_THUMBNAIL_HOVER} />
    </CompareWindowStage>
  ),
};

/**
 * compare key: folder/mobile-blog
 * storyId:     windows-compose-folder--compare-mobile-blog
 * stageAttr:   mobile
 */
export const CompareMobileBlog: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="mobile-blog" stageAttr="mobile">
      <Folder {...FOLDER_MOBILE_BLOG} />
    </CompareWindowStage>
  ),
};

/**
 * compare key: folder/mobile-search-open
 * storyId:     windows-compose-folder--compare-mobile-search-open
 * stageAttr:   mobile
 * Detail-state owner: storybook/internal review (mobile search open — NOT public prop)
 */
export const CompareMobileSearchOpen: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="mobile-search-open" stageAttr="mobile">
      <Folder {...FOLDER_MOBILE_SEARCH_OPEN} />
    </CompareWindowStage>
  ),
};
