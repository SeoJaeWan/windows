/**
 * folderReferenceFixtures
 *
 * Frozen reference data source for Folder component stories.
 * Internal-only — NOT exported from package root.
 *
 * Two canonical state sets:
 * 1. desktop-blog — folder tree navigation + blog-card grid, desktop viewport
 * 2. mobile-blog  — same data used in mobile viewport
 */

import type { FolderProps } from "../folder";

// ── Canonical inventory (2 states) ──────────────────────────────
// desktop-blog, mobile-blog

/* ── Repo-local cover asset path ───────────────────────────────── */

const COVER_BLOG_THUMBNAIL = new URL("./assets/cover-blog-thumbnail.png", import.meta.url).href;

/* ── Windows folder icon data URI (sidebar navigation icon) ────── */

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
    title: "쿠키... 네트워킹 처리의 고민",
    summary: "브라우저 쿠키와 서버 세션 관리에서 생기는 고민들을 정리했다.",
    dateLabel: "2025-11-14",
    coverSrc: COVER_BLOG_THUMBNAIL,
    tagLabel: "개발",
  },
  {
    id: "post-3",
    title: "나만의 홈페이지를 만들고",
    summary: "포트폴리오 사이트를 처음부터 다시 만들며 느낀 점을 기록했다.",
    dateLabel: "2025-10-02",
    coverSrc: COVER_BLOG_THUMBNAIL,
    tagLabel: "회고",
  },
  {
    id: "post-4",
    title: "Component VS CSS 세기의 대결",
    summary: "CSS-in-JS와 Tailwind CSS의 장단점을 비교한 글.",
    dateLabel: "2025-09-15",
    coverSrc: COVER_BLOG_THUMBNAIL,
    tagLabel: "개발",
  },
  {
    id: "post-5",
    title: "Notion API 어떻게 불러와야 할까?",
    summary: "Notion API를 활용해 블로그 콘텐츠를 관리하는 방법을 다뤘다.",
    dateLabel: "2025-08-20",
    coverSrc: COVER_BLOG_THUMBNAIL,
    tagLabel: "개발",
  },
  {
    id: "post-6",
    title: "JavaScript JIT가 뭐야?",
    summary: "자바스크립트 엔진의 JIT 컴파일 원리를 쉽게 풀어봤다.",
    dateLabel: "2025-07-10",
    coverSrc: COVER_BLOG_THUMBNAIL,
    tagLabel: "개발",
  },
];

/* ── Sidebar navigation — mirrors live site top-level categories ── */

const BLOG_NAV: FolderProps["navigationItems"] = [
  { id: "nav-blog", label: "블로그", iconSrc: FOLDER_ICON_URI },
  { id: "nav-project", label: "프로젝트", iconSrc: FOLDER_ICON_URI },
  { id: "nav-coding", label: "코딩 테스트", iconSrc: FOLDER_ICON_URI },
  { id: "nav-about", label: "소개", iconSrc: FOLDER_ICON_URI },
];

/* ── 1. desktop-blog ────────────────────────────────────────────── */

export const FOLDER_DESKTOP_BLOG: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  navigationItems: BLOG_NAV,
  activeNavigationId: "nav-blog",
  items: BLOG_ITEMS,
};

/* ── 2. mobile-blog ─────────────────────────────────────────────── */
// Same data as desktop-blog — layout difference is CSS-only (viewport width).

export const FOLDER_MOBILE_BLOG: FolderProps = {
  title: "블로그",
  addressLabel: "seojaewan.com > 블로그",
  navigationItems: BLOG_NAV,
  activeNavigationId: "nav-blog",
  items: BLOG_ITEMS,
};
