/**
 * browserReferenceFixtures
 *
 * Frozen reference data source for Browser component stories.
 * Internal-only — NOT exported from package root.
 *
 * Four canonical state sets:
 * 1. desktop-article    — desktop viewport, article content
 * 2. desktop-not-found  — desktop viewport, 404 not-found content
 * 3. mobile-article     — mobile viewport, article content
 * 4. mobile-not-found   — mobile viewport, 404 not-found content
 */

import type { BrowserProps } from "../browser";

/* ── Child fragments ─────────────────────────────────────────────── */

function ArticleContent() {
  return (
    <article className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">2025를 보내며</h1>
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

function NotFoundContent() {
  return (
    <div className="p-6 flex flex-col items-center justify-center h-full min-h-64 text-center">
      <p className="text-6xl font-bold text-gray-300 mb-4">404</p>
      <p className="text-xl font-semibold text-gray-700 mb-2">페이지를 찾을 수 없습니다</p>
      <p className="text-sm text-gray-500">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        <br />
        주소를 다시 확인하거나 홈으로 돌아가세요.
      </p>
    </div>
  );
}

/* ── 1. desktop-article ─────────────────────────────────────────── */

export const BROWSER_DESKTOP_ARTICLE: BrowserProps = {
  title: "2025를 보내며",
  addressLabel: "seojaewan.com/blog/2025를-보내며",
  children: <ArticleContent />,
};

/* ── 2. desktop-not-found ───────────────────────────────────────── */

export const BROWSER_DESKTOP_NOT_FOUND: BrowserProps = {
  title: "페이지를 찾을 수 없음",
  addressLabel: "seojaewan.com/blog/존재하지-않는-글",
  children: <NotFoundContent />,
};

/* ── 3. mobile-article ──────────────────────────────────────────── */

export const BROWSER_MOBILE_ARTICLE: BrowserProps = {
  title: "2025를 보내며",
  addressLabel: "seojaewan.com/blog/2025를-보내며",
  children: <ArticleContent />,
};

/* ── 4. mobile-not-found ────────────────────────────────────────── */

export const BROWSER_MOBILE_NOT_FOUND: BrowserProps = {
  title: "페이지를 찾을 수 없음",
  addressLabel: "seojaewan.com/blog/존재하지-않는-글",
  children: <NotFoundContent />,
};
