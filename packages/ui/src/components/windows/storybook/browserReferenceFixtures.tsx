/**
 * browserReferenceFixtures
 *
 * Frozen reference data source for Browser component stories.
 * Internal-only — NOT exported from package root.
 *
 * Two canonical state sets:
 * 1. desktop-article — desktop viewport, article content
 * 2. mobile-article  — mobile viewport, article content
 *
 * support-only/deferred:
 * - not-found example — excluded from canonical compare inventory
 */

import type { BrowserProps } from "../browser";

const COVER_ARTICLE = new URL("./assets/cover-article.png", import.meta.url).href;

/* ── Article content fragment ───────────────────────────────────── */

function ArticleContent() {
  return (
    <article className="px-8 py-6 max-w-xl">
      <h1 className="text-xl font-bold text-gray-900 mb-4">2025를 보내며</h1>

      {/* Cover image */}
      <div className="article-cover overflow-hidden rounded mb-6 bg-gray-100">
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
        또 하나 크게 남는 건, 좋은 멘토분들을 현업에서 많이 찾을 수 있었습니다. 짧은 기간이지만 사인인을 했었던 회사에서 말 한마디 한마디가 이익이었고 나중에 여러모로 관철을 참정하게 됩니다. 내가 인연이었던 사람 중 더이상 연결을 원하지 않았던 것에 이 많은 것들을 내가 방관하는 하지 않았을 것 같습니다.
      </p>
    </article>
  );
}

/* ── 1. desktop-article ─────────────────────────────────────────── */

export const BROWSER_DESKTOP_ARTICLE: BrowserProps = {
  title: "2025를 보내며",
  addressLabel: "seojaewan.com/blog/2025를-보내며",
  children: <ArticleContent />,
};

/* ── 2. mobile-article ──────────────────────────────────────────── */

export const BROWSER_MOBILE_ARTICLE: BrowserProps = {
  title: "2025를 보내며",
  addressLabel: "seojaewan.com/blog/2025를-보내며",
  children: <ArticleContent />,
};
