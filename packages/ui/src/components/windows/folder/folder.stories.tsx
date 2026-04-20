/**
 * Folder stories
 *
 * Taxonomy: Windows/Compose/Folder
 * Title: literal string (convention: no imported const, no helper function)
 *
 * Story inventory:
 *   Reference story  — human review (canonical states)
 *   Compare stories  — machine capture (exact 8 canonical states)
 *
 * Exact compare story ID inventory (8 states):
 *   windows-folder--compare-live-blog
 *   windows-folder--compare-live-search-open
 *   windows-folder--compare-live-chip-open
 *   windows-folder--compare-live-sidebar-hover
 *   windows-folder--compare-live-sidebar-expanded
 *   windows-folder--compare-live-thumbnail-hover
 *   windows-folder--compare-mobile-blog
 *   windows-folder--compare-mobile-search-open
 *
 * Detail-state owner rule:
 *   States chip-open / sidebar-hover / sidebar-expanded / thumbnail-hover /
 *   mobile-search-open are story-only surfaces. No public prop models them.
 *   Stories scaffold them via fixture payloads; the component renders null
 *   for now (Phase 3 contract lock — Phase 4 adds render).
 */

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

/* ── Reference story (human review) ─────────────────────────── */

export const Reference: Story = {
  name: "Reference",
  parameters: {
    docs: { description: { story: "Folder canonical state reference — human review." } },
  },
  render: () => (
    <div className="sb-content-pad" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <WindowReferenceStage label="folder/live-blog">
        <Folder {...FOLDER_LIVE_BLOG} />
      </WindowReferenceStage>
      <WindowReferenceStage label="folder/live-search-open">
        <Folder {...FOLDER_LIVE_SEARCH_OPEN} />
      </WindowReferenceStage>
      <WindowReferenceStage label="folder/mobile-blog" variant="mobile">
        <Folder {...FOLDER_MOBILE_BLOG} />
      </WindowReferenceStage>
    </div>
  ),
};

/* ── Compare stories (machine capture) ───────────────────────── */

/** folder/live-blog — desktop default */
export const CompareLiveBlog: Story = {
  name: "CompareLiveBlog",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="live-blog" variant="desktop">
      <Folder {...FOLDER_LIVE_BLOG} />
    </CompareWindowStage>
  ),
};

/** folder/live-search-open — desktop search dropdown visible */
export const CompareLiveSearchOpen: Story = {
  name: "CompareLiveSearchOpen",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="live-search-open" variant="desktop">
      <Folder {...FOLDER_LIVE_SEARCH_OPEN} />
    </CompareWindowStage>
  ),
};

/** folder/live-chip-open — chip popover open (story-only detail state) */
export const CompareLiveChipOpen: Story = {
  name: "CompareLiveChipOpen",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="live-chip-open" variant="desktop">
      <Folder {...FOLDER_LIVE_CHIP_OPEN} />
    </CompareWindowStage>
  ),
};

/** folder/live-sidebar-hover — sidebar item hover (story-only detail state) */
export const CompareLiveSidebarHover: Story = {
  name: "CompareLiveSidebarHover",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="live-sidebar-hover" variant="desktop">
      <Folder {...FOLDER_LIVE_SIDEBAR_HOVER} />
    </CompareWindowStage>
  ),
};

/** folder/live-sidebar-expanded — sidebar section expanded (story-only detail state) */
export const CompareLiveSidebarExpanded: Story = {
  name: "CompareLiveSidebarExpanded",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="live-sidebar-expanded" variant="desktop">
      <Folder {...FOLDER_LIVE_SIDEBAR_EXPANDED} />
    </CompareWindowStage>
  ),
};

/** folder/live-thumbnail-hover — grid card thumbnail hover (story-only detail state) */
export const CompareLiveThumbnailHover: Story = {
  name: "CompareLiveThumbnailHover",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="live-thumbnail-hover" variant="desktop">
      <Folder {...FOLDER_LIVE_THUMBNAIL_HOVER} />
    </CompareWindowStage>
  ),
};

/** folder/mobile-blog — mobile content-first grid hierarchy */
export const CompareMobileBlog: Story = {
  name: "CompareMobileBlog",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="mobile-blog" variant="mobile">
      <Folder {...FOLDER_MOBILE_BLOG} />
    </CompareWindowStage>
  ),
};

/** folder/mobile-search-open — mobile search overlay open (story-only detail state) */
export const CompareMobileSearchOpen: Story = {
  name: "CompareMobileSearchOpen",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="folder" state="mobile-search-open" variant="mobile">
      <Folder {...FOLDER_MOBILE_SEARCH_OPEN} />
    </CompareWindowStage>
  ),
};
