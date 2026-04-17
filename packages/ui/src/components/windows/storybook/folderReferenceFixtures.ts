/**
 * folderReferenceFixtures
 *
 * Frozen reference data source for Folder component stories.
 * Internal-only — NOT exported from package root.
 *
 * Two canonical state sets:
 * 1. desktop-blog — folder tab navigation + blog-card grid, desktop viewport
 * 2. mobile-blog  — same data used in mobile viewport
 */

import type { FolderProps } from "../folder";

// ── Canonical inventory (2 states) ──────────────────────────────
// desktop-blog, mobile-blog

/* ── Repo-local cover asset path ───────────────────────────────── */

const COVER_BLOG = new URL("./assets/cover-blog-thumbnail.png", import.meta.url).href;

/* ── Shared blog items ──────────────────────────────────────────── */

const BLOG_ITEMS: FolderProps["items"] = [
  {
    id: "post-1",
    title: "2025를 보내며",
    summary: "모노레포 전환, 컴포넌트 설계 원칙 정립, 사이드 프로젝트까지 돌아보는 한 해 회고.",
    dateLabel: "2025-12-31",
    coverSrc: COVER_BLOG,
    tagLabel: "회고",
  },
  {
    id: "post-2",
    title: "Turborepo + pnpm 모노레포 도입기",
    summary: "packages/* 분리와 @windows/* 스코프 설계, 빌드 파이프라인 구성 과정을 기록했다.",
    dateLabel: "2025-11-14",
    coverSrc: COVER_BLOG,
    tagLabel: "인프라",
  },
  {
    id: "post-3",
    title: "Storybook visual diff 자동화",
    summary: "CompareRoot 패턴으로 kind/state 기반 baseline capture를 구축한 방법을 공유한다.",
    dateLabel: "2025-10-02",
    coverSrc: COVER_BLOG,
    tagLabel: "테스트",
  },
];

/* ── Shared navigation items ────────────────────────────────────── */

const FOLDER_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23f0c419' d='M1 3a1 1 0 0 1 1-1h4l1 1h7a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3z'/%3E%3C/svg%3E";

const BLOG_NAV: FolderProps["navigationItems"] = [
  { id: "nav-all", label: "전체", iconSrc: FOLDER_ICON },
  { id: "nav-dev", label: "개발", iconSrc: FOLDER_ICON },
  { id: "nav-retrospect", label: "회고", iconSrc: FOLDER_ICON },
];

/* ── 1. desktop-blog ────────────────────────────────────────────── */

export const FOLDER_DESKTOP_BLOG: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  navigationItems: BLOG_NAV,
  activeNavigationId: "nav-all",
  items: BLOG_ITEMS,
};

/* ── 2. mobile-blog ─────────────────────────────────────────────── */
// Same data as desktop-blog — layout difference is CSS-only (viewport width).

export const FOLDER_MOBILE_BLOG: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  navigationItems: BLOG_NAV,
  activeNavigationId: "nav-all",
  items: BLOG_ITEMS,
};
