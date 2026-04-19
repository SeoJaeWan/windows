import type { Meta, StoryObj } from "@storybook/react";

import Browser from "./index";
import {
  WindowDesktopStage,
} from "../storybook/windowReferenceStage";
import {
  BROWSER_DESKTOP_ARTICLE,
  BROWSER_MOBILE_ARTICLE,
  BROWSER_DESKTOP_ADDRESS_OPEN,
  BROWSER_LONG_TITLE,
  BROWSER_LONG_ADDRESS,
  BROWSER_EMPTY_DROPDOWN,
} from "../storybook/browserReferenceFixtures";
import WindowCompareRoot from "../storybook/windowCompareRoot";
import {
  CompareWindowDesktopStage,
  CompareWindowMobileStage,
} from "../storybook/compareWindowStage";
import { WindowReviewRoot } from "../storybook/windowReviewRoot";

const meta = {
  title: "Windows/Compose/Browser",
  component: Browser,
  args: {
    ...BROWSER_DESKTOP_ARTICLE,
  },
} satisfies Meta<typeof Browser>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Canonical compare exports ──────────────────────────────────── */
// machine-capture: IDs windows-compose-browser--compare-desktop-article,
//   windows-compose-browser--compare-desktop-address-open,
//   windows-compose-browser--compare-mobile-article
//
// desktop-address-open uses controlled addressDropdownOpen + addressValue props
// so the address bar value and open state are immediately visible from props
// (no DOM manipulation or useEffect harness required).

export const CompareDesktopArticle: Story = {
  render: () => (
    <CompareWindowDesktopStage>
      {/* bounded exception: scoped height rule to fill capture canvas */}
      <style>{`[data-visual-root] { flex: 1; height: 100%; }`}</style>
      <WindowCompareRoot state="browser/desktop-article">
        <Browser {...BROWSER_DESKTOP_ARTICLE} className="h-full" />
      </WindowCompareRoot>
    </CompareWindowDesktopStage>
  ),
};

export const CompareDesktopAddressOpen: Story = {
  render: () => (
    <CompareWindowDesktopStage>
      {/* bounded exception: scoped height rule to fill capture canvas */}
      <style>{`[data-visual-root] { flex: 1; height: 100%; }`}</style>
      <WindowCompareRoot state="browser/desktop-address-open">
        <Browser {...BROWSER_DESKTOP_ADDRESS_OPEN} className="h-full" />
      </WindowCompareRoot>
    </CompareWindowDesktopStage>
  ),
};

export const CompareMobileArticle: Story = {
  render: () => (
    <CompareWindowMobileStage>
      {/* bounded exception: scoped height rule to fill capture canvas */}
      <style>{`[data-visual-root] { flex: 1; height: 100%; }`}</style>
      <WindowCompareRoot state="browser/mobile-article">
        <Browser {...BROWSER_MOBILE_ARTICLE} className="h-full" />
      </WindowCompareRoot>
    </CompareWindowMobileStage>
  ),
};

/* ── Review-only edge state exports ─────────────────────────────── */
// IDs: windows-compose-browser--review-long-title,
//      windows-compose-browser--review-long-address,
//      windows-compose-browser--review-empty-dropdown

export const ReviewLongTitle: Story = {
  render: () => (
    <WindowDesktopStage>
      <WindowReviewRoot kind="browser" state="long-title">
        <Browser {...BROWSER_LONG_TITLE} />
      </WindowReviewRoot>
    </WindowDesktopStage>
  ),
};

export const ReviewLongAddress: Story = {
  render: () => (
    <WindowDesktopStage>
      <WindowReviewRoot kind="browser" state="long-address">
        <Browser {...BROWSER_LONG_ADDRESS} />
      </WindowReviewRoot>
    </WindowDesktopStage>
  ),
};

export const ReviewEmptyDropdown: Story = {
  render: () => (
    <WindowDesktopStage>
      <WindowReviewRoot kind="browser" state="empty-dropdown">
        <Browser {...BROWSER_EMPTY_DROPDOWN} />
      </WindowReviewRoot>
    </WindowDesktopStage>
  ),
};
