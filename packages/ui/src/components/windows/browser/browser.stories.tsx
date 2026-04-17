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

export const DesktopArticle: Story = {
  name: "Desktop article",
  render: () => (
    <WindowDesktopStage>
      <Browser {...BROWSER_DESKTOP_ARTICLE} />
    </WindowDesktopStage>
  ),
};

export const MobileArticle: Story = {
  name: "Mobile article",
  render: () => (
    <WindowMobileStage>
      <Browser {...BROWSER_MOBILE_ARTICLE} />
    </WindowMobileStage>
  ),
};

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
