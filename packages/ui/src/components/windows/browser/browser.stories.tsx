import type { Meta, StoryObj } from "@storybook/react";

import Browser from "./index";
import WindowReferenceStage from "../storybook/windowReferenceStage";
import CompareWindowStage from "../storybook/compareWindowStage";
import {
  BROWSER_LIVE_ARTICLE,
  BROWSER_LIVE_ADDRESS_OPEN,
  BROWSER_LIVE_CONTROL_HOVER_MINIMIZE,
  BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE,
  BROWSER_LIVE_CONTROL_HOVER_CLOSE,
  BROWSER_MOBILE_ARTICLE,
  BROWSER_MOBILE_ADDRESS_OPEN,
} from "../storybook/browserReferenceFixtures";

const meta = {
  title: "Windows/Compose/Browser",
  component: Browser,
} satisfies Meta<typeof Browser>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Human review ───────────────────────────────────────────── */

export const Reference: Story = {
  name: "Reference",
  render: () => (
    <WindowReferenceStage label="Browser — live article (desktop)" variant="desktop">
      {BROWSER_LIVE_ARTICLE.render()}
    </WindowReferenceStage>
  ),
};

/* ── Machine capture (7 canonical states) ───────────────────── */

export const CompareLiveArticle: Story = {
  render: () => (
    <CompareWindowStage
      kind="browser"
      state={BROWSER_LIVE_ARTICLE.state}
      variant={BROWSER_LIVE_ARTICLE.variant}
    >
      {BROWSER_LIVE_ARTICLE.render()}
    </CompareWindowStage>
  ),
};

export const CompareLiveAddressOpen: Story = {
  render: () => (
    <CompareWindowStage
      kind="browser"
      state={BROWSER_LIVE_ADDRESS_OPEN.state}
      variant={BROWSER_LIVE_ADDRESS_OPEN.variant}
    >
      {BROWSER_LIVE_ADDRESS_OPEN.render()}
    </CompareWindowStage>
  ),
};

export const CompareLiveControlHoverMinimize: Story = {
  render: () => (
    <CompareWindowStage
      kind="browser"
      state={BROWSER_LIVE_CONTROL_HOVER_MINIMIZE.state}
      variant={BROWSER_LIVE_CONTROL_HOVER_MINIMIZE.variant}
    >
      {BROWSER_LIVE_CONTROL_HOVER_MINIMIZE.render()}
    </CompareWindowStage>
  ),
};

export const CompareLiveControlHoverMaximize: Story = {
  render: () => (
    <CompareWindowStage
      kind="browser"
      state={BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE.state}
      variant={BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE.variant}
    >
      {BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE.render()}
    </CompareWindowStage>
  ),
};

export const CompareLiveControlHoverClose: Story = {
  render: () => (
    <CompareWindowStage
      kind="browser"
      state={BROWSER_LIVE_CONTROL_HOVER_CLOSE.state}
      variant={BROWSER_LIVE_CONTROL_HOVER_CLOSE.variant}
    >
      {BROWSER_LIVE_CONTROL_HOVER_CLOSE.render()}
    </CompareWindowStage>
  ),
};

export const CompareMobileArticle: Story = {
  render: () => (
    <CompareWindowStage
      kind="browser"
      state={BROWSER_MOBILE_ARTICLE.state}
      variant={BROWSER_MOBILE_ARTICLE.variant}
    >
      {BROWSER_MOBILE_ARTICLE.render()}
    </CompareWindowStage>
  ),
};

export const CompareMobileAddressOpen: Story = {
  render: () => (
    <CompareWindowStage
      kind="browser"
      state={BROWSER_MOBILE_ADDRESS_OPEN.state}
      variant={BROWSER_MOBILE_ADDRESS_OPEN.variant}
    >
      {BROWSER_MOBILE_ADDRESS_OPEN.render()}
    </CompareWindowStage>
  ),
};
