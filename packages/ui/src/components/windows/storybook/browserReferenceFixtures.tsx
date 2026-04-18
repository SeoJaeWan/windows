/**
 * browserReferenceFixtures
 *
 * Frozen reference data source for Browser component stories.
 * Internal-only — NOT exported from package root.
 *
 * Canonical compare states (3):
 * 1. desktop-article       — desktop viewport, article content via children
 * 2. desktop-address-open  — same data + address dropdown open, desktop viewport
 * 3. mobile-article        — mobile viewport, article content via children
 *
 * Review-only edge states (not in compare inventory):
 * 4. long-title           — extremely long title string
 * 5. long-address         — extremely long addressLabel string
 * 6. empty-dropdown-items — addressDropdownItems=[] (empty dropdown surface)
 *
 * Article composition is host concern — passed as children.
 * No article/not-found public prop is opened.
 */

import type { BrowserProps, BrowserAddressDropdownItem } from "../browser";

const COVER_ARTICLE = new URL("./assets/cover-article.png", import.meta.url).href;

/* ── Long text edge-state constants ─────────────────────────────── */

export const LONG_TITLE_TEXT =
  "이것은 매우 긴 탭 제목입니다 — The Browser Tab Title That Overflows Because It Has So Much Content That No Reasonable Width Can Contain It";

export const LONG_ADDRESS_LABEL_TEXT =
  "seojaewan.com/blog/2025를-보내며/하위-경로/더-깊은-경로/절대-끝나지-않는-주소-레이블-예시-문자열";

/* ── Shared dropdown items ──────────────────────────────────────── */

export const ARTICLE_DROPDOWN_ITEMS: BrowserAddressDropdownItem[] = [
  { id: "drop-blog", label: "seojaewan.com/blog" },
  { id: "drop-2025", label: "seojaewan.com/blog/2025를-보내며" },
  { id: "drop-projects", label: "seojaewan.com/projects" },
];

/**
 * Dropdown items for the desktop-address-open compare state.
 * Live site shows a single suggestion matching the current article URL.
 * Kept separate from ARTICLE_DROPDOWN_ITEMS (3-item anchor) to avoid
 * breaking the windowReviewInventory.test.tsx "3 items" assertion.
 */
export const COMPARE_ADDRESS_OPEN_DROPDOWN_ITEMS: BrowserAddressDropdownItem[] = [
  { id: "drop-current", label: "2025를 보내며" },
];

/* ── Article content fragment (host-composed via children) ─────── */

function ArticleContent() {
  return (
    <article className="px-4 py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">2025를 보내며</h1>

      {/* Cover image */}
      <div className="article-cover overflow-hidden rounded mb-4 bg-gray-100">
        <img
          src={COVER_ARTICLE}
          alt=""
          aria-hidden
          className="w-full h-auto object-cover"
        />
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        2025년이 끝나가고 있습니다. 올해는 개발자로서 유난히 변화가 많았던 한 해였습니다. 기술적으로도, 태도적으로도 스스로가 많이 흔들리고 또 많이 자랐습니다. 특히 "준비가 끝나면 시작하는 게 아니라, 시작하면서 준비가 된다는 것"을 몸으로 배웠습니다.
      </p>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        올해는 좋은 분들과 함께할 수 있었고, 그 경험이 많은 것을 가르쳐 주었습니다. 새로운 기술을 배우고 프로젝트를 완성해 가는 과정에서 성장의 의미를 다시금 느꼈습니다.
      </p>
    </article>
  );
}

/* ── 1. desktop-article (canonical compare) ────────────────────── */

export const BROWSER_DESKTOP_ARTICLE: BrowserProps = {
  title: "2025를 보내며",
  addressLabel: "seojaewan.com/blog/2025를-보내며",
  addressDropdownItems: ARTICLE_DROPDOWN_ITEMS,
  children: <ArticleContent />,
};

/* ── 2. mobile-article (canonical compare) ─────────────────────── */

export const BROWSER_MOBILE_ARTICLE: BrowserProps = {
  title: "2025를 보내며",
  addressLabel: "seojaewan.com/blog/2025를-보내며",
  addressDropdownItems: ARTICLE_DROPDOWN_ITEMS,
  children: <ArticleContent />,
};

/* ── 3. desktop-address-open (canonical compare) ────────────────── */
// Same data as desktop-article with address dropdown open.
// The story harness must click the address bar to open the dropdown
// since open state is internal-only (no public prop).
// Uses COMPARE_ADDRESS_OPEN_DROPDOWN_ITEMS (1-item: live site shows single
// URL suggestion matching the current article) rather than ARTICLE_DROPDOWN_ITEMS
// (3-item anchor used only in review fixtures and review inventory test).

export const BROWSER_DESKTOP_ADDRESS_OPEN: BrowserProps = {
  title: "2025를 보내며",
  addressLabel: "seojaewan.com/blog/2025를-보내며",
  addressDropdownItems: COMPARE_ADDRESS_OPEN_DROPDOWN_ITEMS,
  children: <ArticleContent />,
};

/* ── Review-only edge states (not in compare inventory) ─────────── */

/* ── 4. long-title (review-only edge state) ─────────────────────── */

export const BROWSER_LONG_TITLE: BrowserProps = {
  title: LONG_TITLE_TEXT,
  addressLabel: "seojaewan.com/blog/2025를-보내며",
  addressDropdownItems: ARTICLE_DROPDOWN_ITEMS,
  children: <ArticleContent />,
};

/* ── 5. long-address (review-only edge state) ───────────────────── */

export const BROWSER_LONG_ADDRESS: BrowserProps = {
  title: "2025를 보내며",
  addressLabel: LONG_ADDRESS_LABEL_TEXT,
  addressDropdownItems: ARTICLE_DROPDOWN_ITEMS,
  children: <ArticleContent />,
};

/* ── 6. empty-dropdown-items (review-only edge state) ───────────── */

export const BROWSER_EMPTY_DROPDOWN_ITEMS: BrowserProps = {
  title: "2025를 보내며",
  addressLabel: "seojaewan.com/blog/2025를-보내며",
  addressDropdownItems: [],
  children: <ArticleContent />,
};
