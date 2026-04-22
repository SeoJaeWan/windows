import type { Meta, StoryObj } from "@storybook/react";

import Browser from "./index";
import CompareWindowStage from "../storybook/compareWindowStage";
import WindowReferenceStage from "../storybook/windowReferenceStage";
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

/* ── Reference stories (human review) ───────────────────────────── */

export const Reference: Story = {
  name: "Reference",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", padding: "2rem" }}>
      <WindowReferenceStage label="browser/live-article — desktop" stageAttr="desktop">
        <Browser {...BROWSER_LIVE_ARTICLE} />
      </WindowReferenceStage>
      <WindowReferenceStage label="browser/live-address-open — desktop" stageAttr="desktop">
        <Browser {...BROWSER_LIVE_ADDRESS_OPEN} />
      </WindowReferenceStage>
      <WindowReferenceStage label="browser/mobile-article — mobile" stageAttr="mobile">
        <Browser {...BROWSER_MOBILE_ARTICLE} />
      </WindowReferenceStage>
      <WindowReferenceStage label="browser/mobile-address-open — mobile" stageAttr="mobile">
        <Browser {...BROWSER_MOBILE_ADDRESS_OPEN} />
      </WindowReferenceStage>
    </div>
  ),
};

/* ── Compare stories (machine capture) ──────────────────────────── */

/**
 * compare key: browser/live-article
 * storyId:     windows-compose-browser--compare-live-article
 * stageAttr:   desktop
 */
export const CompareLiveArticle: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="live-article" stageAttr="desktop">
      <Browser {...BROWSER_LIVE_ARTICLE} />
    </CompareWindowStage>
  ),
};

/**
 * compare key: browser/live-address-open
 * storyId:     windows-compose-browser--compare-live-address-open
 * stageAttr:   desktop
 */
export const CompareLiveAddressOpen: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="live-address-open" stageAttr="desktop">
      <Browser {...BROWSER_LIVE_ADDRESS_OPEN} />
    </CompareWindowStage>
  ),
};

/**
 * compare key: browser/live-control-hover-minimize
 * storyId:     windows-compose-browser--compare-live-control-hover-minimize
 * stageAttr:   desktop
 * Detail-state owner: storybook/internal review (minimize hover — NOT public prop)
 */
export const CompareLiveControlHoverMinimize: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="live-control-hover-minimize" stageAttr="desktop">
      <Browser {...BROWSER_LIVE_CONTROL_HOVER_MINIMIZE} />
    </CompareWindowStage>
  ),
};

/**
 * compare key: browser/live-control-hover-maximize
 * storyId:     windows-compose-browser--compare-live-control-hover-maximize
 * stageAttr:   desktop
 * Detail-state owner: storybook/internal review (maximize hover — NOT public prop)
 */
export const CompareLiveControlHoverMaximize: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="live-control-hover-maximize" stageAttr="desktop">
      <Browser {...BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE} />
    </CompareWindowStage>
  ),
};

/**
 * compare key: browser/live-control-hover-close
 * storyId:     windows-compose-browser--compare-live-control-hover-close
 * stageAttr:   desktop
 * Detail-state owner: storybook/internal review (close hover — NOT public prop)
 */
export const CompareLiveControlHoverClose: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="live-control-hover-close" stageAttr="desktop">
      <Browser {...BROWSER_LIVE_CONTROL_HOVER_CLOSE} />
    </CompareWindowStage>
  ),
};

/**
 * compare key: browser/mobile-article
 * storyId:     windows-compose-browser--compare-mobile-article
 * stageAttr:   mobile
 */
export const CompareMobileArticle: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="mobile-article" stageAttr="mobile">
      <Browser {...BROWSER_MOBILE_ARTICLE} />
    </CompareWindowStage>
  ),
};

/**
 * compare key: browser/mobile-address-open
 * storyId:     windows-compose-browser--compare-mobile-address-open
 * stageAttr:   mobile
 * Detail-state owner: storybook/internal review (mobile address open — NOT public prop)
 */
export const CompareMobileAddressOpen: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="mobile-address-open" stageAttr="mobile">
      <Browser {...BROWSER_MOBILE_ADDRESS_OPEN} />
    </CompareWindowStage>
  ),
};
