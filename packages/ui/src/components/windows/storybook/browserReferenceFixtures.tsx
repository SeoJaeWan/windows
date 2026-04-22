/**
 * browserReferenceFixtures.tsx
 *
 * Browser 7-state scaffolding for storybook/internal review.
 *
 * State inventory owner: storybook/internal review (NOT public props).
 *   browser/live-article             — desktop, article body in children
 *   browser/live-address-open        — desktop, address dropdown visible
 *   browser/live-control-hover-minimize — desktop, minimize hover (not a public prop)
 *   browser/live-control-hover-maximize — desktop, maximize hover (not a public prop)
 *   browser/live-control-hover-close    — desktop, close hover (not a public prop)
 *   browser/mobile-article           — mobile, article body in children
 *   browser/mobile-address-open      — mobile, address open (not a public prop)
 *
 * These fixtures supply host-owned prop values for each state.
 * Detail-state scaffolding (control-hover/mobile-open) is achieved via
 * story-level prop injection — NOT public component props.
 */

import type { ReactNode } from "react";

import type { BrowserAddressDropdownItem } from "../shared/types";
import type { BrowserProps } from "../browser";

/* ── Shared fixture data ──────────────────────────────────────── */

const ADDRESS_DROPDOWN_ITEMS: BrowserAddressDropdownItem[] = [
  { id: "addr-1", label: "seojaewan.com/blog", hint: "Recent" },
  { id: "addr-2", label: "seojaewan.com/projects", hint: "Recent" },
  { id: "addr-3", label: "seojaewan.com/about", hint: "Recent" },
];

/** Article body sample — host-owned content for Browser children slot. */
function ArticleBody(): ReactNode {
  return (
    <article className="p-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Getting Started with Next.js</h1>
      <p className="text-sm text-gray-500 mb-4">April 22, 2026 · 5 min read</p>
      <p className="text-base text-gray-700 leading-relaxed mb-4">
        Next.js is a React framework that gives you building blocks to create web applications.
        By framework, we mean Next.js handles the tooling and configuration needed for React,
        and provides additional structure, features, and optimizations for your application.
      </p>
      <p className="text-base text-gray-700 leading-relaxed mb-4">
        You can use React to build your UI, then incrementally adopt Next.js features to solve
        common application requirements such as routing, data fetching, and caching — all while
        keeping a great developer and end-user experience.
      </p>
      <p className="text-base text-gray-700 leading-relaxed">
        Whether you are an individual developer or part of a larger team, you can leverage
        React and Next.js to build fully interactive, highly dynamic, and performant web
        applications.
      </p>
    </article>
  );
}

/* ── 7-state fixtures ─────────────────────────────────────────── */

/**
 * browser/live-article
 * Desktop, article body rendered in children slot.
 * children: ArticleBody (host-owned — sample article content).
 * Compare storyId: windows-compose-browser--compare-live-article
 * stageAttr: desktop
 */
export const BROWSER_LIVE_ARTICLE: BrowserProps = {
  title: "Blog — seojaewan.com",
  addressValue: "seojaewan.com/blog/getting-started-with-nextjs",
  children: <ArticleBody />,
};

/**
 * browser/live-address-open
 * Desktop, address dropdown visible.
 * Detail-state scaffolding: addressDropdownItems provided (open state via prop array).
 * Compare storyId: windows-compose-browser--compare-live-address-open
 * stageAttr: desktop
 */
export const BROWSER_LIVE_ADDRESS_OPEN: BrowserProps = {
  title: "Blog — seojaewan.com",
  addressValue: "seojaewan",
  addressDropdownItems: ADDRESS_DROPDOWN_ITEMS,
  children: <ArticleBody />,
};

/**
 * browser/live-control-hover-minimize
 * Desktop, minimize button hover state.
 * Detail-state: control-hover — storybook/internal review owner (NOT public prop).
 * Compare storyId: windows-compose-browser--compare-live-control-hover-minimize
 * stageAttr: desktop
 */
export const BROWSER_LIVE_CONTROL_HOVER_MINIMIZE: BrowserProps = {
  title: "Blog — seojaewan.com",
  addressValue: "seojaewan.com/blog/getting-started-with-nextjs",
  children: <ArticleBody />,
};

/**
 * browser/live-control-hover-maximize
 * Desktop, maximize button hover state.
 * Detail-state: control-hover — storybook/internal review owner (NOT public prop).
 * Compare storyId: windows-compose-browser--compare-live-control-hover-maximize
 * stageAttr: desktop
 */
export const BROWSER_LIVE_CONTROL_HOVER_MAXIMIZE: BrowserProps = {
  title: "Blog — seojaewan.com",
  addressValue: "seojaewan.com/blog/getting-started-with-nextjs",
  children: <ArticleBody />,
};

/**
 * browser/live-control-hover-close
 * Desktop, close button hover state.
 * Detail-state: control-hover — storybook/internal review owner (NOT public prop).
 * Compare storyId: windows-compose-browser--compare-live-control-hover-close
 * stageAttr: desktop
 */
export const BROWSER_LIVE_CONTROL_HOVER_CLOSE: BrowserProps = {
  title: "Blog — seojaewan.com",
  addressValue: "seojaewan.com/blog/getting-started-with-nextjs",
  children: <ArticleBody />,
};

/**
 * browser/mobile-article
 * Mobile viewport (375×680), article body in children, simplified chrome.
 * Mobile hierarchy: simplified chrome / content-first reading.
 * Compare storyId: windows-compose-browser--compare-mobile-article
 * stageAttr: mobile
 */
export const BROWSER_MOBILE_ARTICLE: BrowserProps = {
  title: "Blog — seojaewan.com",
  addressValue: "seojaewan.com/blog/getting-started-with-nextjs",
  children: <ArticleBody />,
};

/**
 * browser/mobile-address-open
 * Mobile viewport, address bar open state.
 * Detail-state: mobile-address-open — storybook/internal review owner (NOT public prop).
 * Compare storyId: windows-compose-browser--compare-mobile-address-open
 * stageAttr: mobile
 */
export const BROWSER_MOBILE_ADDRESS_OPEN: BrowserProps = {
  title: "Blog — seojaewan.com",
  addressValue: "seojaewan",
  addressDropdownItems: ADDRESS_DROPDOWN_ITEMS,
  children: <ArticleBody />,
};

/* ── Reference data exports ───────────────────────────────────── */

export { ADDRESS_DROPDOWN_ITEMS };
