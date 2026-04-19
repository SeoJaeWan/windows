/**
 * folderReferenceFixtures
 *
 * Frozen reference data source for Folder component stories.
 * Internal-only — NOT exported from package root.
 *
 * Canonical compare states (3):
 * 1. desktop-card         — sidebar tree + chip bar + entry grid, desktop viewport
 * 2. desktop-search-open  — same data + search panel open (controlled), desktop viewport
 * 3. mobile-card          — same data, mobile viewport (no sidebar, no chips, no search)
 *
 * Review-only edge states (not in compare inventory):
 * 4. long-title     — extremely long title string
 * 5. long-address   — extremely long addressLabel string
 * 6. no-chips       — chips=[] (empty chip surface)
 */

import type { FolderProps, FolderChip } from "../folder";

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

/* ── Shared chips ───────────────────────────────────────────────── */

export const BLOG_CHIPS: FolderChip[] = [
  { id: "chip-server", label: "Server" },
  { id: "chip-perf", label: "성능" },
  { id: "chip-retrospect", label: "회고" },
  { id: "chip-browser", label: "바라우저" },
  { id: "chip-theory", label: "이론" },
  { id: "chip-react", label: "React" },
  { id: "chip-tailwind", label: "Tailwind CSS" },
  { id: "chip-nextjs", label: "Next.js" },
  { id: "chip-js", label: "JavaScript" },
  { id: "chip-type", label: "타입" },
];

/* ── Long text edge-state constants ─────────────────────────────── */

export const LONG_TITLE_TEXT =
  "이것은 매우 긴 제목입니다 — The Window Title That Just Keeps Going and Going Until It Definitely Overflows Any Reasonable Container Width";

export const LONG_ADDRESS_LABEL_TEXT =
  "seojaewan.com > 블로그 > 개발 > 하위 카테고리 > 더 깊은 카테고리 > 매우 긴 경로 > 절대 끝나지 않는 주소 레이블 예시";

/* ── 1. desktop-card (canonical compare) ────────────────────────── */

export const FOLDER_DESKTOP_CARD: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
  chips: BLOG_CHIPS,
};

/* ── 2. mobile-card (canonical compare) ─────────────────────────── */
// Same data as desktop-card — layout difference is CSS-only (viewport width).
// Mobile: sidebar, search trigger, chip bar are all absent (CSS-only hide).

export const FOLDER_MOBILE_CARD: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
  chips: BLOG_CHIPS,
};

/* ── 3. desktop-search-open (canonical compare) ─────────────────── */
// Same data as desktop-card with search panel open.
// searchPanelOpen prop drives the open state (controlled surface — no DOM click harness needed).

export const FOLDER_DESKTOP_SEARCH_OPEN: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
  chips: BLOG_CHIPS,
  searchPanelOpen: true,
};

/* ── Review-only support states (not in compare inventory) ──────── */

/* ── 4. sidebar-expanded (review-only) ─────────────────────────── */
// Root item expanded with children visible. Not in canonical compare inventory.

export const FOLDER_SIDEBAR_EXPANDED: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog-dev",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
  chips: BLOG_CHIPS,
};

/* ── 5. no-selection (review-only) ─────────────────────────────── */
// No activeSidebarId — no row highlighted. Not in canonical compare inventory.

export const FOLDER_NO_SELECTION: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  expandedSidebarIds: [],
  entries: BLOG_ENTRIES,
  chips: BLOG_CHIPS,
};

/* ── 6. long-title (review-only edge state) ─────────────────────── */

export const FOLDER_LONG_TITLE: FolderProps = {
  title: LONG_TITLE_TEXT,
  addressLabel: "seojaewan.com > 블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
  chips: BLOG_CHIPS,
};

/* ── 7. long-address (review-only edge state) ───────────────────── */

export const FOLDER_LONG_ADDRESS: FolderProps = {
  title: "블로그",
  addressLabel: LONG_ADDRESS_LABEL_TEXT,
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
  chips: BLOG_CHIPS,
};

/* ── 8. no-chips (review-only edge state) ───────────────────────── */

export const FOLDER_NO_CHIPS: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
  chips: [],
};
