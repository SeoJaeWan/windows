import type { ReactNode } from "react";

import Browser from "../browser";
import type { DropdownItem } from "../shared/types";

/**
 * browserReferenceFixtures
 *
 * Renderer fixtures for the 7 canonical Browser states used by stories
 * and the inventory locking test. Each fixture owns its body (article
 * content) since Browser's body slot is host-owned (`children` prop).
 *
 * Detail states (address-open, control-hover-*) are realized via fixture
 * scaffolding (dropdown items, scoped `<style>` targeting
 * `data-window-control="…"`) rather than public Browser props — matching
 * the public-contract boundary.
 */

type BrowserFixture = {
  state: string;
  variant: "desktop" | "mobile";
  render: () => ReactNode;
};

const ADDRESS_DROPDOWN: DropdownItem[] = [
  { id: "addr-1", label: "https://seojaewan.com/blog" },
  { id: "addr-2", label: "https://seojaewan.com/projects" },
  { id: "addr-3", label: "https://seojaewan.com/coding-test" },
];

/* ── Body content ───────────────────────────────────────────── */

function ArticleBody() {
  return (
    <article className="prose max-w-none text-shell">
      <h1 className="text-xl font-semibold mb-2">
        나만의 홈페이지를 만들고
      </h1>
      <div className="text-sm text-shell-muted mb-4">2025.10.14 · 기술 문서</div>
      <p className="text-sm leading-6">
        이번 글에서는 포트폴리오 사이트를 어떻게 Windows 테마로 재구성했는지
        이야기합니다. 기존 사이트는 단순한 링크 모음이었지만, 새 버전에서는
        Taskbar · Panels · Windows 세 개의 surface family로 UI를 분리하여
        각 컴포넌트가 명확한 책임을 가지도록 설계했습니다.
      </p>
      <p className="text-sm leading-6 mt-3">
        디자인 토큰은 `--shell-*` 과 `--window-*` 두 축으로 나뉘고, 각
        family는 본인의 chrome/content surface만 소유합니다.
      </p>
    </article>
  );
}

/* ── Hover style helper ─────────────────────────────────────── */

function ControlHoverStyle({ kind }: { kind: "minimize" | "maximize" | "close" }) {
  const background = kind === "close" ? "rgb(239, 68, 68)" : "rgb(250, 252, 252)";
  const color = kind === "close" ? "white" : "inherit";
  return (
    <style>
      {`
        [data-window-control="${kind}"] {
          background: ${background};
          color: ${color};
        }
      `}
    </style>
  );
}

/* ── 1. live-article ────────────────────────────────────────── */

export const BROWSER_LIVE_ARTICLE: BrowserFixture = {
  state: "live-article",
  variant: "desktop",
  render: () => (
    <Browser
      title="Browser"
      addressValue="https://seojaewan.com/blog/homepage"
    >
      <ArticleBody />
    </Browser>
  ),
};

/* ── 2. live-address-open ───────────────────────────────────── */

export const BROWSER_LIVE_ADDRESS_OPEN: BrowserFixture = {
  state: "live-address-open",
  variant: "desktop",
  render: () => (
    <Browser
      title="Browser"
      addressValue="https://seojaewan.com"
      addressDropdownItems={ADDRESS_DROPDOWN}
    >
      <ArticleBody />
    </Browser>
  ),
};

/* ── 3-5. live-control-hover-{minimize|maximize|close} ──────── */

export const BROWSER_LIVE_CONTROL_HOVER_MINIMIZE: BrowserFixture = {
  state: "live-control-hover-minimize",
  variant: "desktop",
  render: () => (
    <>
      <ControlHoverStyle kind="minimize" />
      <Browser title="Browser" addressValue="https://seojaewan.com/blog">
        <ArticleBody />
      </Browser>
    </>
  ),
};

export const BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE: BrowserFixture = {
  state: "live-control-hover-maximize",
  variant: "desktop",
  render: () => (
    <>
      <ControlHoverStyle kind="maximize" />
      <Browser title="Browser" addressValue="https://seojaewan.com/blog">
        <ArticleBody />
      </Browser>
    </>
  ),
};

export const BROWSER_LIVE_CONTROL_HOVER_CLOSE: BrowserFixture = {
  state: "live-control-hover-close",
  variant: "desktop",
  render: () => (
    <>
      <ControlHoverStyle kind="close" />
      <Browser title="Browser" addressValue="https://seojaewan.com/blog">
        <ArticleBody />
      </Browser>
    </>
  ),
};

/* ── 6. mobile-article ──────────────────────────────────────── */

export const BROWSER_MOBILE_ARTICLE: BrowserFixture = {
  state: "mobile-article",
  variant: "mobile",
  render: () => (
    <div className="max-w-[375px] w-full flex">
      <Browser title="Browser" addressValue="https://seojaewan.com/blog/homepage">
        <ArticleBody />
      </Browser>
    </div>
  ),
};

/* ── 7. mobile-address-open ─────────────────────────────────── */

export const BROWSER_MOBILE_ADDRESS_OPEN: BrowserFixture = {
  state: "mobile-address-open",
  variant: "mobile",
  render: () => (
    <div className="max-w-[375px] w-full flex">
      <Browser
        title="Browser"
        addressValue="https://seojaewan.com"
        addressDropdownItems={ADDRESS_DROPDOWN}
      >
        <ArticleBody />
      </Browser>
    </div>
  ),
};

/* ── Aggregate ──────────────────────────────────────────────── */

export const BROWSER_FIXTURES: BrowserFixture[] = [
  BROWSER_LIVE_ARTICLE,
  BROWSER_LIVE_ADDRESS_OPEN,
  BROWSER_LIVE_CONTROL_HOVER_MINIMIZE,
  BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE,
  BROWSER_LIVE_CONTROL_HOVER_CLOSE,
  BROWSER_MOBILE_ARTICLE,
  BROWSER_MOBILE_ADDRESS_OPEN,
];
