import type { Meta, StoryObj } from "@storybook/react";

import Folder from "./index";
import WindowReferenceStage from "../storybook/windowReferenceStage";
import CompareWindowStage from "../storybook/compareWindowStage";
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

/* ── Human review ───────────────────────────────────────────── */

export const Reference: Story = {
  name: "Reference",
  render: () => (
    <WindowReferenceStage label="Folder — live blog (desktop)" variant="desktop">
      {FOLDER_LIVE_BLOG.render()}
    </WindowReferenceStage>
  ),
};

/* ── Machine capture (8 canonical states) ───────────────────── */

export const CompareLiveBlog: Story = {
  render: () => (
    <CompareWindowStage kind="folder" state={FOLDER_LIVE_BLOG.state} variant={FOLDER_LIVE_BLOG.variant}>
      {FOLDER_LIVE_BLOG.render()}
    </CompareWindowStage>
  ),
};

export const CompareLiveSearchOpen: Story = {
  render: () => (
    <CompareWindowStage
      kind="folder"
      state={FOLDER_LIVE_SEARCH_OPEN.state}
      variant={FOLDER_LIVE_SEARCH_OPEN.variant}
    >
      {FOLDER_LIVE_SEARCH_OPEN.render()}
    </CompareWindowStage>
  ),
};

export const CompareLiveChipOpen: Story = {
  render: () => (
    <CompareWindowStage
      kind="folder"
      state={FOLDER_LIVE_CHIP_OPEN.state}
      variant={FOLDER_LIVE_CHIP_OPEN.variant}
    >
      {FOLDER_LIVE_CHIP_OPEN.render()}
    </CompareWindowStage>
  ),
};

export const CompareLiveSidebarHover: Story = {
  render: () => (
    <CompareWindowStage
      kind="folder"
      state={FOLDER_LIVE_SIDEBAR_HOVER.state}
      variant={FOLDER_LIVE_SIDEBAR_HOVER.variant}
    >
      {FOLDER_LIVE_SIDEBAR_HOVER.render()}
    </CompareWindowStage>
  ),
};

export const CompareLiveSidebarExpanded: Story = {
  render: () => (
    <CompareWindowStage
      kind="folder"
      state={FOLDER_LIVE_SIDEBAR_EXPANDED.state}
      variant={FOLDER_LIVE_SIDEBAR_EXPANDED.variant}
    >
      {FOLDER_LIVE_SIDEBAR_EXPANDED.render()}
    </CompareWindowStage>
  ),
};

export const CompareLiveThumbnailHover: Story = {
  render: () => (
    <CompareWindowStage
      kind="folder"
      state={FOLDER_LIVE_THUMBNAIL_HOVER.state}
      variant={FOLDER_LIVE_THUMBNAIL_HOVER.variant}
    >
      {FOLDER_LIVE_THUMBNAIL_HOVER.render()}
    </CompareWindowStage>
  ),
};

export const CompareMobileBlog: Story = {
  render: () => (
    <CompareWindowStage
      kind="folder"
      state={FOLDER_MOBILE_BLOG.state}
      variant={FOLDER_MOBILE_BLOG.variant}
    >
      {FOLDER_MOBILE_BLOG.render()}
    </CompareWindowStage>
  ),
};

export const CompareMobileSearchOpen: Story = {
  render: () => (
    <CompareWindowStage
      kind="folder"
      state={FOLDER_MOBILE_SEARCH_OPEN.state}
      variant={FOLDER_MOBILE_SEARCH_OPEN.variant}
    >
      {FOLDER_MOBILE_SEARCH_OPEN.render()}
    </CompareWindowStage>
  ),
};
