/**
 * folderReferenceFixtures
 *
 * Frozen reference data source for Folder component stories.
 * Internal-only — NOT exported from package root.
 *
 * Canonical compare states (3) — Figma-backed keys from Phase 1 baseline inventory:
 * 1. desktop-blog         — sidebar tree + chip bar + entry grid, desktop viewport
 * 2. desktop-search-open  — same data + search panel open (controlled), desktop viewport
 * 3. mobile-blog          — same data, mobile viewport (no sidebar, no chips, no search)
 *
 * Review-only edge states (not in compare inventory):
 * 4. long-title     — extremely long title string
 * 5. long-address   — extremely long addressLabel string
 * 6. no-chips       — chips=[] (empty chip surface)
 *
 * Phase 3 blocking surface boundary:
 * BLOCKING (parity winners in this pass):
 *   - entry.thumbnailSrc presence and aspect ratio
 *   - entry.title visibility and vertical placement below thumbnail
 *   - grid column count, card width/height, card gap, outer card geometry
 *
 * NON-BLOCKING (visible in compare capture, later-pass only):
 *   - search panel overlay exact placement and chip styling
 *   - sidebar item exact styling and width
 *   - window chrome pixel detail (title font weight, button shapes)
 *   - icon glyph exact shape
 *
 * FIXTURE NOISE (not parity winners — present but do not promote):
 *   - entry.metaLabel value (category badge, date string)
 *   - entry.summary copy text
 *   - entry.thumbnailSrc pixel content (artwork)
 *   - exact entry.title string content
 */

import { FolderOpen16Filled } from "@fluentui/react-icons";

import type { FolderProps, FolderChip } from "../folder";

/* ── Shared folder icon ─────────────────────────────────────────── */

const FOLDER_ICON = <FolderOpen16Filled className="text-yellow-500" />;

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
    thumbnailSrc: "https://picsum.photos/seed/2025/400/267",
    metaLabel: "회고 · 2025-12-31",
    summary: "모노레포 전환, 컴포넌트 설계 원칙 정립, 사이드 프로젝트까지 돌아보는 한 해 회고.",
  },
  {
    id: "post-2",
    title: "쿠키... 네트워킹 처리의 고민!",
    thumbnailSrc: "https://picsum.photos/seed/cookie/400/267",
    metaLabel: "인프라 · 2025-11-14",
    summary: "packages/* 분리와 @windows/* 스코프 설계, 빌드 파이프라인 구성 과정을 기록했다.",
  },
  {
    id: "post-3",
    title: "나만의 홈페이지를 만들고",
    thumbnailSrc: "https://picsum.photos/seed/neu/400/267",
    metaLabel: "테스트 · 2025-10-02",
    summary: "CompareRoot 패턴으로 kind/state 기반 baseline capture를 구축한 방법을 공유한다.",
  },
  {
    id: "post-4",
    title: "Component VS CSS 세기의 대결",
    thumbnailSrc: "https://picsum.photos/seed/cs-vs-component/400/267",
    metaLabel: "개발 · 2025-09-18",
    summary: "스타일링 어디에 두는 게 옳을까? CSS-in-JS와 컴포넌트 스타일링 접근법을 비교한다.",
  },
  {
    id: "post-5",
    title: "Notion API 어떻게 불러올까?",
    thumbnailSrc: "https://picsum.photos/seed/notion-api/400/267",
    metaLabel: "개발 · 2025-08-05",
    summary: "Notion API를 연동해서 블로그 포스트를 동적으로 불러오는 방법을 정리한다.",
  },
  {
    id: "post-6",
    title: "JavaScript JIT가 뭐야?",
    thumbnailSrc: "https://picsum.photos/seed/js-jit/400/267",
    metaLabel: "개발 · 2025-07-22",
    summary: "Just-In-Time 컴파일러가 JavaScript 성능에 어떤 영향을 미치는지 알아본다.",
  },
];

/* ── Shared chips ───────────────────────────────────────────────── */

export const BLOG_CHIPS: FolderChip[] = [
  { id: "chip-server",     label: "Server",       tone: "neutral" },
  { id: "chip-perf",       label: "성능",          tone: "yellow" },
  { id: "chip-retrospect", label: "회고",          tone: "red" },
  { id: "chip-browser",    label: "바라우저",       tone: "blue" },
  { id: "chip-theory",     label: "이론",          tone: "neutral" },
  { id: "chip-react",      label: "React",        tone: "cyan" },
  { id: "chip-tailwind",   label: "Tailwind CSS", tone: "cyan" },
  { id: "chip-nextjs",     label: "Next.js",      tone: "neutral" },
  { id: "chip-js",         label: "JavaScript",   tone: "yellow" },
  { id: "chip-type",       label: "타입",          tone: "purple" },
];

/* ── Long text edge-state constants ─────────────────────────────── */

export const LONG_TITLE_TEXT =
  "이것은 매우 긴 제목입니다 — The Window Title That Just Keeps Going and Going Until It Definitely Overflows Any Reasonable Container Width";

export const LONG_ADDRESS_LABEL_TEXT =
  "seojaewan.com > 블로그 > 개발 > 하위 카테고리 > 더 깊은 카테고리 > 매우 긴 경로 > 절대 끝나지 않는 주소 레이블 예시";

/* ── 1. desktop-blog (canonical compare) ────────────────────────── */

export const FOLDER_DESKTOP_BLOG: FolderProps = {
  title: "블로그",
  icon: FOLDER_ICON,
  addressLabel: "블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
  chips: BLOG_CHIPS,
};

/* ── 2. mobile-blog (canonical compare) ─────────────────────────── */
// Same data as desktop-blog — layout difference is CSS-only (viewport width).
// Mobile: sidebar, search trigger, chip bar are all absent (CSS-only hide).

export const FOLDER_MOBILE_BLOG: FolderProps = {
  title: "블로그",
  icon: FOLDER_ICON,
  addressLabel: "블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
  chips: BLOG_CHIPS,
};

/* ── 3. desktop-search-open (canonical compare) ─────────────────── */
// Same data as desktop-blog with search panel open.
// searchPanelOpen prop drives the open state (controlled surface — no DOM click harness needed).

export const FOLDER_DESKTOP_SEARCH_OPEN: FolderProps = {
  title: "블로그",
  icon: FOLDER_ICON,
  addressLabel: "블로그",
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
  icon: FOLDER_ICON,
  addressLabel: "블로그",
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
  icon: FOLDER_ICON,
  addressLabel: "블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  expandedSidebarIds: [],
  entries: BLOG_ENTRIES,
  chips: BLOG_CHIPS,
};

/* ── 6. long-title (review-only edge state) ─────────────────────── */

export const FOLDER_LONG_TITLE: FolderProps = {
  title: LONG_TITLE_TEXT,
  icon: FOLDER_ICON,
  addressLabel: "블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
  chips: BLOG_CHIPS,
};

/* ── 7. long-address (review-only edge state) ───────────────────── */

export const FOLDER_LONG_ADDRESS: FolderProps = {
  title: "블로그",
  icon: FOLDER_ICON,
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
  icon: FOLDER_ICON,
  addressLabel: "블로그",
  sidebarItems: BLOG_SIDEBAR_ITEMS,
  activeSidebarId: "sidebar-blog",
  expandedSidebarIds: ["sidebar-blog"],
  entries: BLOG_ENTRIES,
  chips: [],
};
