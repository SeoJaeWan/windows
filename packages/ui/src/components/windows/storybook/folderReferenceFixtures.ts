/**
 * folderReferenceFixtures
 *
 * Frozen reference data source for Folder component stories.
 * Internal-only — NOT exported from package root.
 *
 * Canonical compare states (2):
 * 1. desktop-blog — sidebar tree + entry grid, desktop viewport
 * 2. mobile-blog  — same data, mobile viewport
 *
 * Review-only support states (not in compare inventory):
 * 3. sidebar-expanded — root item expanded with visible children
 * 4. no-selection     — no activeSidebarId, no row highlighted
 */

import type { FolderProps } from "../folder";

/* ── Repo-local thumbnail asset path ───────────────────────────── */

const THUMBNAIL_BLOG = new URL("./assets/cover-blog-thumbnail.png", import.meta.url).href;

/* ── Shared sidebar items ───────────────────────────────────────── */

const BLOG_SIDEBAR_ITEMS: FolderProps["sidebarItems"] = [
  {
    id: "sidebar-blog",
    label: "블로그",
    children: [
      { id: "sidebar-blog-dev", label: "개발" },
      { id: "sidebar-blog-retrospect", label: "회고" },
    ],
  },
  {
    id: "sidebar-projects",
    label: "프로젝트",
  },
  {
    id: "sidebar-algorithm",
    label: "코딩 테스트",
  },
  {
    id: "sidebar-intro",
    label: "소개",
  },
];

/* ── Shared entries ─────────────────────────────────────────────── */

const BLOG_ENTRIES: FolderProps["entries"] = [
  {
    id: "post-1",
    title: "2025를 보내며",
    thumbnailSrc: THUMBNAIL_BLOG,
    metaLabel: "회고 · 2025-12-31",
    summary: "모노레포 전환, 컴포넌트 설계 원칙 정립, 사이드 프로젝트까지 돌아보는 한 해 회고.",
  },
  {
    id: "post-2",
    title: "쿠키... 네트워킹 처리의 고민!",
    thumbnailSrc: THUMBNAIL_BLOG,
    metaLabel: "인프라 · 2025-11-14",
    summary: "packages/* 분리와 @windows/* 스코프 설계, 빌드 파이프라인 구성 과정을 기록했다.",
  },
  {
    id: "post-3",
    title: "나만의 홈페이지를 만들고",
    thumbnailSrc: THUMBNAIL_BLOG,
    metaLabel: "테스트 · 2025-10-02",
    summary: "CompareRoot 패턴으로 kind/state 기반 baseline capture를 구축한 방법을 공유한다.",
  },
  {
    id: "post-4",
    title: "Component VS CSS 세기의 대결",
    thumbnailSrc: THUMBNAIL_BLOG,
    metaLabel: "개발 · 2025-09-18",
    summary: "스타일링 어디에 두는 게 옳을까? CSS-in-JS와 컴포넌트 스타일링 접근법을 비교한다.",
  },
  {
    id: "post-5",
    title: "Notion API 어떻게 불러올까?",
    thumbnailSrc: THUMBNAIL_BLOG,
    metaLabel: "개발 · 2025-08-05",
    summary: "Notion API를 연동해서 블로그 포스트를 동적으로 불러오는 방법을 정리한다.",
  },
  {
    id: "post-6",
    title: "JavaScript JIT가 뭐야?",
    thumbnailSrc: THUMBNAIL_BLOG,
    metaLabel: "개발 · 2025-07-22",
    summary: "Just-In-Time 컴파일러가 JavaScript 성능에 어떤 영향을 미치는지 알아본다.",
  },
];

/* ── 1. desktop-blog (canonical compare) ───────────────────────── */

export const FOLDER_DESKTOP_BLOG: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
};

/* ── 2. mobile-blog (canonical compare) ────────────────────────── */
// Same data as desktop-blog — layout difference is CSS-only (viewport width).

export const FOLDER_MOBILE_BLOG: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
};

/* ── 3. sidebar-expanded (review-only) ─────────────────────────── */
// Root item expanded with children visible. Not in canonical compare inventory.

export const FOLDER_SIDEBAR_EXPANDED: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog-dev",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
};

/* ── 4. no-selection (review-only) ─────────────────────────────── */
// No activeSidebarId — no row highlighted. Not in canonical compare inventory.

export const FOLDER_NO_SELECTION: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  expandedSidebarIds: [],
  entries: BLOG_ENTRIES,
};
