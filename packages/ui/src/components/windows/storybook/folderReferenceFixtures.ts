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

const COVER_BLOG_THUMBNAIL = new URL("./assets/cover-blog-thumbnail.png", import.meta.url).href;

/* ── Windows folder icon data URI (tab navigation icon) ────────── */

const FOLDER_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h3.379a1.5 1.5 0 0 1 1.06.44l.622.621A.5.5 0 0 0 7.914 3H13.5A1.5 1.5 0 0 1 15 4.5v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9z" fill="#E8A117"/><path d="M1 6h14v6.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5V6z" fill="#F5C542"/></svg>`;
const FOLDER_ICON_URI = `data:image/svg+xml,${encodeURIComponent(FOLDER_ICON_SVG)}`;

/* ── Shared blog items ──────────────────────────────────────────── */

const BLOG_ITEMS: FolderProps["items"] = [
  {
    id: "post-1",
    title: "2025를 보내며",
    summary: "모노레포 전환, 컴포넌트 설계 원칙 정립, 사이드 프로젝트까지 돌아보는 한 해 회고.",
    dateLabel: "2025-12-31",
    coverSrc: COVER_BLOG_THUMBNAIL,
    tagLabel: "회고",
  },
  {
    id: "post-2",
    title: "Turborepo + pnpm 모노레포 도입기",
    summary: "packages/* 분리와 @windows/* 스코프 설계, 빌드 파이프라인 구성 과정을 기록했다.",
    dateLabel: "2025-11-14",
    coverSrc: COVER_BLOG_THUMBNAIL,
    tagLabel: "인프라",
  },
  {
    id: "post-3",
    title: "Storybook visual diff 자동화",
    summary: "CompareRoot 패턴으로 kind/state 기반 baseline capture를 구축한 방법을 공유한다.",
    dateLabel: "2025-10-02",
    coverSrc: COVER_BLOG_THUMBNAIL,
    tagLabel: "테스트",
  },
];

/* ── Shared navigation items ────────────────────────────────────── */

const BLOG_NAV: FolderProps["navigationItems"] = [
  { id: "nav-all", label: "전체", iconSrc: FOLDER_ICON_URI },
  { id: "nav-dev", label: "개발", iconSrc: FOLDER_ICON_URI },
  { id: "nav-retrospect", label: "회고", iconSrc: FOLDER_ICON_URI },
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
