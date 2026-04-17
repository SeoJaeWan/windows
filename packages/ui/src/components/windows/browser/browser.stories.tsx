import type { Meta, StoryObj } from "@storybook/react";

import Browser from "./index";
import {
  WindowDesktopStage,
  WindowMobileStage,
} from "../storybook/windowReferenceStage";
import {
  BROWSER_DESKTOP_ARTICLE,
  BROWSER_MOBILE_ARTICLE,
} from "../storybook/browserReferenceFixtures";
import CompareRoot from "../../taskbar/storybook/compareRoot";
import {
  CompareWindowDesktopStage,
  CompareWindowMobileStage,
} from "../storybook/compareWindowStage";

const meta = {
  title: "Windows/Browser",
  component: Browser,
  args: {
    ...BROWSER_DESKTOP_ARTICLE,
  },
} satisfies Meta<typeof Browser>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Canonical compare exports ──────────────────────────────────── */
// machine-capture: IDs windows-browser--compare-desktop-article, windows-browser--compare-mobile-article

export const CompareDesktopArticle: Story = {
  render: () => (
    <CompareWindowDesktopStage>
      <CompareRoot kind="browser" state="desktop-article">
        <Browser {...BROWSER_DESKTOP_ARTICLE} />
      </CompareRoot>
    </CompareWindowDesktopStage>
  ),
};

export const CompareMobileArticle: Story = {
  render: () => (
    <CompareWindowMobileStage>
      <CompareRoot kind="browser" state="mobile-article">
        <Browser {...BROWSER_MOBILE_ARTICLE} />
      </CompareRoot>
    </CompareWindowMobileStage>
  ),
};

/* ── Review-only exports ────────────────────────────────────────── */
// human-review only — NOT in compare inventory, NOT wrapped in CompareRoot

export const DesktopArticleReview: Story = {
  name: "Desktop article (review)",
  render: () => (
    <WindowDesktopStage>
      <Browser {...BROWSER_DESKTOP_ARTICLE} />
    </WindowDesktopStage>
  ),
};

export const MobileArticleReview: Story = {
  name: "Mobile article (review)",
  render: () => (
    <WindowMobileStage>
      <Browser {...BROWSER_MOBILE_ARTICLE} />
    </WindowMobileStage>
  ),
};
