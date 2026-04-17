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
    <article className="p-6 max-w-2xl mx-auto">
      {/* Cover image */}
      <div className="article-cover aspect-video overflow-hidden rounded-lg mb-6 bg-gray-100">
        <img
          src={COVER_ARTICLE}
          alt=""
          aria-hidden
          className="w-full h-full object-cover"
        />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
          회고
        </span>
        <span className="text-xs text-gray-400">2025-12-31</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">2025를 보내며</h1>
      <p className="text-sm text-gray-500 mb-6">
        모노레포 전환, 컴포넌트 설계 원칙 정립, 사이드 프로젝트까지 돌아보는 한 해 회고.
      </p>

      <p className="text-gray-700 leading-relaxed mb-4">
        2025년은 개인적으로도 기술적으로도 많은 변화가 있었던 해였다. 모노레포 구조로의 전환,
        컴포넌트 설계 원칙의 정립, 그리고 꾸준한 사이드 프로젝트 진행까지. 돌아보면 생각보다
        많은 것들을 이뤄냈다.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        특히 이번 포트폴리오 리메이크 작업을 통해 UI와 요소를 명확히 분리하는 아키텍처를
        적용해볼 수 있었다. Turborepo와 pnpm을 활용한 모노레포는 처음에는 낯설었지만,
        작업이 진행될수록 그 장점이 분명하게 느껴졌다.
      </p>
      <p className="text-gray-700 leading-relaxed">
        2026년에는 이 기반 위에서 더 많은 컨텐츠와 기능을 채워나갈 계획이다. 꾸준히,
        그리고 즐겁게.
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
