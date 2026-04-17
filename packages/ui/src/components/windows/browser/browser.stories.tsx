import type { Meta, StoryObj } from "@storybook/react";

import Browser from "./index";
import {
  WindowDesktopStage,
  WindowMobileStage,
} from "../storybook/windowReferenceStage";
import {
  BROWSER_DESKTOP_ARTICLE,
  BROWSER_DESKTOP_NOT_FOUND,
  BROWSER_MOBILE_ARTICLE,
  BROWSER_MOBILE_NOT_FOUND,
} from "../storybook/browserReferenceFixtures";
import CompareRoot from "../../taskbar/storybook/compareRoot";
import {
  CompareWindowDesktopStage,
  CompareWindowMobileStage,
} from "../storybook/compareWindowStage";

const meta = {
  title: "Windows/Browser",
  component: Browser,
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

export const DesktopNotFound: Story = {
  name: "Desktop not found",
  render: () => (
    <WindowDesktopStage>
      <Browser {...BROWSER_DESKTOP_NOT_FOUND} />
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

export const MobileNotFound: Story = {
  name: "Mobile not found",
  render: () => (
    <WindowMobileStage>
      <Browser {...BROWSER_MOBILE_NOT_FOUND} />
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

export const CompareDesktopNotFound: Story = {
  render: () => (
    <CompareWindowDesktopStage>
      <CompareRoot kind="browser" state="desktop-not-found">
        <Browser {...BROWSER_DESKTOP_NOT_FOUND} />
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

export const CompareMobileNotFound: Story = {
  render: () => (
    <CompareWindowMobileStage>
      <CompareRoot kind="browser" state="mobile-not-found">
        <Browser {...BROWSER_MOBILE_NOT_FOUND} />
      </CompareRoot>
    </CompareWindowMobileStage>
  ),
};
