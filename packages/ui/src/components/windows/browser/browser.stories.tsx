import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Browser from "./index";
import {
  WindowDesktopStage,
  WindowMobileStage,
} from "../storybook/windowReferenceStage";
import {
  BROWSER_DESKTOP_ARTICLE,
  BROWSER_MOBILE_ARTICLE,
  BROWSER_DESKTOP_ADDRESS_OPEN,
  BROWSER_LONG_TITLE,
  BROWSER_LONG_ADDRESS,
  BROWSER_EMPTY_DROPDOWN_ITEMS,
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

/* ── Address-open harness ───────────────────────────────────────── */
// Internal-only address dropdown open state: simulate address bar click after mount.

function BrowserWithAddressOpen(props: React.ComponentProps<typeof Browser>) {
  useEffect(() => {
    // Find and click the address bar to open the dropdown
    const addressBar = document.querySelector<HTMLButtonElement>(".browser-address");
    if (addressBar) {
      addressBar.click();
    }
  }, []);

  return <Browser {...props} />;
}

/* ── Canonical compare exports ──────────────────────────────────── */
// machine-capture: IDs windows-browser--compare-desktop-article,
//   windows-browser--compare-desktop-address-open, windows-browser--compare-mobile-article

export const CompareDesktopArticle: Story = {
  render: () => (
    <CompareWindowDesktopStage>
      {/* bounded exception: scoped height rule to fill capture canvas */}
      <style>{`[data-visual-root] { flex: 1; height: 100%; }`}</style>
      <WindowCompareRoot kind="browser" state="desktop-article">
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
      <WindowCompareRoot kind="browser" state="desktop-address-open">
        <BrowserWithAddressOpen {...BROWSER_DESKTOP_ADDRESS_OPEN} className="h-full" />
      </WindowCompareRoot>
    </CompareWindowDesktopStage>
  ),
};

export const CompareMobileArticle: Story = {
  render: () => (
    <CompareWindowMobileStage>
      {/* bounded exception: scoped height rule to fill capture canvas */}
      <style>{`[data-visual-root] { flex: 1; height: 100%; }`}</style>
      <WindowCompareRoot kind="browser" state="mobile-article">
        <Browser {...BROWSER_MOBILE_ARTICLE} className="h-full" />
      </WindowCompareRoot>
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

/* ── Review-only edge state exports ─────────────────────────────── */
// IDs: windows-browser--long-title-review, windows-browser--long-address-review,
//      windows-browser--empty-dropdown-items-review

export const LongTitleReview: Story = {
  name: "Long title (review)",
  render: () => (
    <WindowDesktopStage>
      <WindowReviewRoot kind="browser" state="long-title">
        <Browser {...BROWSER_LONG_TITLE} />
      </WindowReviewRoot>
    </WindowDesktopStage>
  ),
};

export const LongAddressReview: Story = {
  name: "Long address (review)",
  render: () => (
    <WindowDesktopStage>
      <WindowReviewRoot kind="browser" state="long-address">
        <Browser {...BROWSER_LONG_ADDRESS} />
      </WindowReviewRoot>
    </WindowDesktopStage>
  ),
};

export const EmptyDropdownItemsReview: Story = {
  name: "Empty dropdown items (review)",
  render: () => (
    <WindowDesktopStage>
      <WindowReviewRoot kind="browser" state="empty-dropdown-items">
        <Browser {...BROWSER_EMPTY_DROPDOWN_ITEMS} />
      </WindowReviewRoot>
    </WindowDesktopStage>
  ),
};
