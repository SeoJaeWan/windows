/**
 * Browser stories
 *
 * Taxonomy: Windows/Compose/Browser
 * Title: literal string (convention: no imported const, no helper function)
 *
 * Story inventory:
 *   Reference story  — human review (canonical states)
 *   Compare stories  — machine capture (exact 7 canonical states)
 *
 * Exact compare story ID inventory (7 states):
 *   windows-browser--compare-live-article
 *   windows-browser--compare-live-address-open
 *   windows-browser--compare-live-control-hover-minimize
 *   windows-browser--compare-live-control-hover-maximize
 *   windows-browser--compare-live-control-hover-close
 *   windows-browser--compare-mobile-article
 *   windows-browser--compare-mobile-address-open
 *
 * Detail-state owner rule:
 *   States control-hover-minimize / control-hover-maximize / control-hover-close /
 *   mobile-address-open are story-only surfaces. No public prop models them.
 *   Stories scaffold them via fixture payloads; the component renders null
 *   for now (Phase 3 contract lock — Phase 4 adds render).
 */

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

/* ── Reference story (human review) ─────────────────────────── */

export const Reference: Story = {
  name: "Reference",
  parameters: {
    docs: { description: { story: "Browser canonical state reference — human review." } },
  },
  render: () => (
    <div className="sb-content-pad" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <WindowReferenceStage label="browser/live-article">
        <Browser {...BROWSER_LIVE_ARTICLE} />
      </WindowReferenceStage>
      <WindowReferenceStage label="browser/live-address-open">
        <Browser {...BROWSER_LIVE_ADDRESS_OPEN} />
      </WindowReferenceStage>
      <WindowReferenceStage label="browser/mobile-article" variant="mobile">
        <Browser {...BROWSER_MOBILE_ARTICLE} />
      </WindowReferenceStage>
    </div>
  ),
};

/* ── Compare stories (machine capture) ───────────────────────── */

/** browser/live-article — desktop default */
export const CompareLiveArticle: Story = {
  name: "CompareLiveArticle",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="live-article" variant="desktop">
      <Browser {...BROWSER_LIVE_ARTICLE} />
    </CompareWindowStage>
  ),
};

/** browser/live-address-open — desktop address dropdown visible */
export const CompareLiveAddressOpen: Story = {
  name: "CompareLiveAddressOpen",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="live-address-open" variant="desktop">
      <Browser {...BROWSER_LIVE_ADDRESS_OPEN} />
    </CompareWindowStage>
  ),
};

/** browser/live-control-hover-minimize — minimize button hover (story-only detail state) */
export const CompareLiveControlHoverMinimize: Story = {
  name: "CompareLiveControlHoverMinimize",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="live-control-hover-minimize" variant="desktop">
      <Browser {...BROWSER_LIVE_CONTROL_HOVER_MINIMIZE} />
    </CompareWindowStage>
  ),
};

/** browser/live-control-hover-maximize — maximize button hover (story-only detail state) */
export const CompareLiveControlHoverMaximize: Story = {
  name: "CompareLiveControlHoverMaximize",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="live-control-hover-maximize" variant="desktop">
      <Browser {...BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE} />
    </CompareWindowStage>
  ),
};

/** browser/live-control-hover-close — close button hover (story-only detail state) */
export const CompareLiveControlHoverClose: Story = {
  name: "CompareLiveControlHoverClose",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="live-control-hover-close" variant="desktop">
      <Browser {...BROWSER_LIVE_CONTROL_HOVER_CLOSE} />
    </CompareWindowStage>
  ),
};

/** browser/mobile-article — mobile simplified chrome / content-first */
export const CompareMobileArticle: Story = {
  name: "CompareMobileArticle",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="mobile-article" variant="mobile">
      <Browser {...BROWSER_MOBILE_ARTICLE} />
    </CompareWindowStage>
  ),
};

/** browser/mobile-address-open — mobile address overlay open (story-only detail state) */
export const CompareMobileAddressOpen: Story = {
  name: "CompareMobileAddressOpen",
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => (
    <CompareWindowStage kind="browser" state="mobile-address-open" variant="mobile">
      <Browser {...BROWSER_MOBILE_ADDRESS_OPEN} />
    </CompareWindowStage>
  ),
};
