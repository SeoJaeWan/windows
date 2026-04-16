/**
 * folderReferenceFixtures
 *
 * Frozen reference data source for Folder component stories.
 * Internal-only — NOT exported from package root.
 *
 * Two canonical state sets:
 * 1. desktop-default — sidebar + items grid, activeSidebarId matches a row
 * 2. mobile-collapsed — same data used in mobile viewport (sidebar hidden via CSS)
 */

import type { FolderProps } from "../folder";

/* ── Placeholder image data URI (16×16 grey square) ─────────────── */

const PLACEHOLDER_FOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='4' fill='%23FFC107'/%3E%3Cpath d='M8 14h12l4 4h16v18H8V14z' fill='%23FFF8E1'/%3E%3C/svg%3E";

const PLACEHOLDER_FILE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='4' fill='%232196F3'/%3E%3Crect x='12' y='10' width='24' height='28' rx='2' fill='%23E3F2FD'/%3E%3Cline x1='16' y1='18' x2='32' y2='18' stroke='%2390CAF9' stroke-width='2'/%3E%3Cline x1='16' y1='24' x2='32' y2='24' stroke='%2390CAF9' stroke-width='2'/%3E%3Cline x1='16' y1='30' x2='26' y2='30' stroke='%2390CAF9' stroke-width='2'/%3E%3C/svg%3E";

/* ── 1. desktop-default ─────────────────────────────────────────── */

export const FOLDER_DESKTOP_DEFAULT: FolderProps = {
  title: "프로젝트",
  addressLabel: "내 PC > 문서 > 프로젝트",
  sidebarItems: [
    { id: "sidebar-desktop", label: "바탕 화면" },
    { id: "sidebar-docs", label: "문서" },
    { id: "sidebar-downloads", label: "다운로드" },
    { id: "sidebar-pictures", label: "사진" },
    { id: "sidebar-music", label: "음악" },
  ],
  activeSidebarId: "sidebar-docs",
  items: [
    { id: "item-1", label: "포트폴리오 리메이크", imageSrc: PLACEHOLDER_FOLDER },
    { id: "item-2", label: "블로그 마이그레이션", imageSrc: PLACEHOLDER_FOLDER },
    { id: "item-3", label: "코딩 테스트 아카이브", imageSrc: PLACEHOLDER_FOLDER },
    { id: "item-4", label: "README.md", imageSrc: PLACEHOLDER_FILE },
    { id: "item-5", label: "CHANGELOG.md", imageSrc: PLACEHOLDER_FILE },
    { id: "item-6", label: "package.json", imageSrc: PLACEHOLDER_FILE },
    { id: "item-7", label: "디자인 시스템", imageSrc: PLACEHOLDER_FOLDER },
    { id: "item-8", label: "기술 스택 메모.txt", imageSrc: PLACEHOLDER_FILE },
  ],
};

/* ── 2. mobile-collapsed ────────────────────────────────────────── */
// Same data as desktop-default — sidebar collapse is CSS-only (md breakpoint).
// This fixture is used in WindowMobileStage to verify mobile layout.

export const FOLDER_MOBILE_COLLAPSED: FolderProps = {
  title: "사진",
  addressLabel: "내 PC > 사진",
  sidebarItems: [
    { id: "sidebar-desktop", label: "바탕 화면" },
    { id: "sidebar-docs", label: "문서" },
    { id: "sidebar-downloads", label: "다운로드" },
    { id: "sidebar-pictures", label: "사진" },
    { id: "sidebar-music", label: "음악" },
  ],
  activeSidebarId: "sidebar-pictures",
  items: [
    { id: "photo-1", label: "2024-여름 여행", imageSrc: PLACEHOLDER_FOLDER },
    { id: "photo-2", label: "2024-겨울 여행", imageSrc: PLACEHOLDER_FOLDER },
    { id: "photo-3", label: "스크린샷", imageSrc: PLACEHOLDER_FOLDER },
    { id: "photo-4", label: "프로필 사진.png", imageSrc: PLACEHOLDER_FILE },
    { id: "photo-5", label: "배경화면.jpg", imageSrc: PLACEHOLDER_FILE },
    { id: "photo-6", label: "아바타.png", imageSrc: PLACEHOLDER_FILE },
  ],
};
