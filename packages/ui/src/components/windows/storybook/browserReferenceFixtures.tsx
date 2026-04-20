/**
 * browserReferenceFixtures — Browser 7-state storybook/internal review scaffolding
 *
 * State ownership contract:
 *   Each fixture entry provides the minimum prop payload to scaffold a specific
 *   review state. Detail states are story-only owners — NOT public props.
 *
 * Browser state inventory (7 states):
 *   1. browser/live-article              — desktop default (address + children body)
 *   2. browser/live-address-open         — desktop address input focused, dropdown visible
 *   3. browser/live-control-hover-minimize — minimize button hover (story-only)
 *   4. browser/live-control-hover-maximize — maximize button hover (story-only)
 *   5. browser/live-control-hover-close    — close button hover (story-only)
 *   6. browser/mobile-article            — mobile simplified chrome / content-first
 *   7. browser/mobile-address-open       — mobile address overlay open (story-only)
 *
 * Detail-state owner rule:
 *   States 3–5, 7 are story-only surfaces. They are NOT exposed as public props
 *   on Browser. Stories scaffold them via controlled fixture payloads and
 *   story-level render wrappers.
 *
 * This file is JSX (.tsx) because fixtures supply ReactNode children payloads.
 */

import type { ReactNode } from "react";

import type { BrowserProps } from "../browser";

/* ── Shared fixture data ─────────────────────────────────────── */

const ADDRESS_DROPDOWN_ITEMS: BrowserProps["addressDropdownItems"] = [
  { id: "addr-1", label: "seojaewan.com/blog" },
  { id: "addr-2", label: "seojaewan.com/projects" },
  { id: "addr-3", label: "seojaewan.com/about" },
];

/**
 * Minimal article body for the browser content slot.
 * Pure fixture payload — not part of any public contract.
 */
function ArticleBody(): ReactNode {
  return (
    <article
      style={{ padding: "24px 32px", maxWidth: 720, margin: "0 auto" }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        기술 회고록
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: "inherit" }}>
        Next.js 마이그레이션을 진행하면서 겪은 경험을 기록합니다.
        App Router로의 전환, 서버 컴포넌트 활용, 그리고 성능 최적화 여정을
        담았습니다.
      </p>
      <p style={{ fontSize: 16, lineHeight: 1.7, marginTop: 12 }}>
        Tailwind CSS와 TypeScript를 함께 사용하면서 얻은 인사이트도 포함합니다.
      </p>
    </article>
  );
}

/* ── State 1: browser/live-article ───────────────────────────── */

/**
 * BROWSER_LIVE_ARTICLE
 * State: browser/live-article
 * Role: desktop default — address filled, article body rendered, no dropdown open.
 * Ownership: public props, host-controlled.
 */
export const BROWSER_LIVE_ARTICLE: BrowserProps = {
  title: "기술 회고록",
  addressValue: "seojaewan.com/blog/retrospective",
  children: <ArticleBody />,
};

/* ── State 2: browser/live-address-open ──────────────────────── */

/**
 * BROWSER_LIVE_ADDRESS_OPEN
 * State: browser/live-address-open
 * Role: desktop — address input focused with dropdown visible.
 * Ownership: public props. addressDropdownItems presence triggers the open surface.
 * Note: actual dropdown open/close is internal/story-owned; the fixture supplies
 * the data that enables the open surface to be rendered.
 */
export const BROWSER_LIVE_ADDRESS_OPEN: BrowserProps = {
  title: "기술 회고록",
  addressValue: "seojaewan.com",
  addressDropdownItems: ADDRESS_DROPDOWN_ITEMS,
  children: <ArticleBody />,
};

/* ── State 3: browser/live-control-hover-minimize (story-only) ─── */

/**
 * BROWSER_LIVE_CONTROL_HOVER_MINIMIZE
 * State: browser/live-control-hover-minimize
 * Role: minimize button hover affordance — story-only detail state.
 * Ownership: story harness injects hover state; this fixture supplies surrounding props.
 * NOT a public prop — no public control-hover prop exists on Browser.
 */
export const BROWSER_LIVE_CONTROL_HOVER_MINIMIZE: BrowserProps = {
  title: "기술 회고록",
  addressValue: "seojaewan.com/blog/retrospective",
  children: <ArticleBody />,
};

/* ── State 4: browser/live-control-hover-maximize (story-only) ─── */

/**
 * BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE
 * State: browser/live-control-hover-maximize
 * Role: maximize button hover affordance — story-only detail state.
 * Ownership: story harness injects hover state; this fixture supplies surrounding props.
 * NOT a public prop — no public control-hover prop exists on Browser.
 */
export const BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE: BrowserProps = {
  title: "기술 회고록",
  addressValue: "seojaewan.com/blog/retrospective",
  children: <ArticleBody />,
};

/* ── State 5: browser/live-control-hover-close (story-only) ──────── */

/**
 * BROWSER_LIVE_CONTROL_HOVER_CLOSE
 * State: browser/live-control-hover-close
 * Role: close button hover affordance — story-only detail state.
 * Ownership: story harness injects hover state; this fixture supplies surrounding props.
 * NOT a public prop — no public control-hover prop exists on Browser.
 */
export const BROWSER_LIVE_CONTROL_HOVER_CLOSE: BrowserProps = {
  title: "기술 회고록",
  addressValue: "seojaewan.com/blog/retrospective",
  children: <ArticleBody />,
};

/* ── State 6: browser/mobile-article ─────────────────────────── */

/**
 * BROWSER_MOBILE_ARTICLE
 * State: browser/mobile-article
 * Role: mobile simplified chrome / content-first reading hierarchy.
 *   Address bar and control cluster simplify; content fills viewport.
 * Ownership: public props, host-controlled.
 *   Mobile hierarchy is enforced by the component at the appropriate breakpoint.
 */
export const BROWSER_MOBILE_ARTICLE: BrowserProps = {
  title: "기술 회고록",
  addressValue: "seojaewan.com/blog/retrospective",
  children: <ArticleBody />,
};

/* ── State 7: browser/mobile-address-open (story-only) ─────────── */

/**
 * BROWSER_MOBILE_ADDRESS_OPEN
 * State: browser/mobile-address-open
 * Role: mobile address overlay open — story-only detail state.
 * Ownership: story harness scaffolds the overlay open detail; fixture supplies base props.
 * NOT a public prop — no public mobile-address-open prop exists on Browser.
 */
export const BROWSER_MOBILE_ADDRESS_OPEN: BrowserProps = {
  title: "기술 회고록",
  addressValue: "seojaewan.com",
  addressDropdownItems: ADDRESS_DROPDOWN_ITEMS,
  children: <ArticleBody />,
};

/* ── Convenience map ──────────────────────────────────────────── */

/**
 * BROWSER_FIXTURES — keyed map of all 7 Browser review states.
 *
 * Canonical key format: "browser/{state-slug}"
 * Matches the exact state inventory defined in Phase 3 contract.
 */
export const BROWSER_FIXTURES = {
  "browser/live-article": BROWSER_LIVE_ARTICLE,
  "browser/live-address-open": BROWSER_LIVE_ADDRESS_OPEN,
  "browser/live-control-hover-minimize": BROWSER_LIVE_CONTROL_HOVER_MINIMIZE,
  "browser/live-control-hover-maximize": BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE,
  "browser/live-control-hover-close": BROWSER_LIVE_CONTROL_HOVER_CLOSE,
  "browser/mobile-article": BROWSER_MOBILE_ARTICLE,
  "browser/mobile-address-open": BROWSER_MOBILE_ADDRESS_OPEN,
} as const satisfies Record<string, BrowserProps>;

export type BrowserFixtureKey = keyof typeof BROWSER_FIXTURES;
