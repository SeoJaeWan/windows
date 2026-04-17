/**
 * browserReferenceFixtures
 *
 * Frozen reference data source for Browser component stories.
 * Internal-only — NOT exported from package root.
 *
 * Canonical compare states (2):
 * 1. desktop-article — desktop viewport, article content via children
 * 2. mobile-article  — mobile viewport, article content via children
 *
 * Article composition is host concern — passed as children.
 * No article/not-found public prop is opened.
 */

import type { BrowserProps } from "../browser";

const COVER_ARTICLE = new URL("./assets/cover-article.png", import.meta.url).href;

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
  children: <ArticleContent />,
};

/* ── 2. mobile-article (canonical compare) ─────────────────────── */

export const BROWSER_MOBILE_ARTICLE: BrowserProps = {
  title: "2025를 보내며",
  addressLabel: "seojaewan.com/blog/2025를-보내며",
  children: <ArticleContent />,
};
