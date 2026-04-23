import type { ReactNode } from "react";

import Folder from "../folder";
import type {
  FolderDropdownItem,
  GridItem,
  SearchChip,
  SidebarItem,
} from "../shared/types";

/**
 * folderReferenceFixtures
 *
 * Renderer fixtures for the 8 canonical Folder states used by stories and
 * the inventory locking test. Each fixture exposes:
 *   - a `state` key (matches `data-visual-state` and inventory table)
 *   - a `variant` ("desktop" | "mobile") controlling stage geometry
 *   - a `render()` that returns a fully composed Folder tree
 *
 * Detail states (hover, expanded) are realized via local scaffolding —
 * DOM attribute injection + a scoped `<style>` — NOT via public props on
 * Folder itself. This keeps the public contract pure UI (no `hover`,
 * `expanded`, `open` props) while still producing the 1:1 visual states
 * the Figma canvas requires.
 */

type FolderFixture = {
  state: string;
  variant: "desktop" | "mobile";
  render: () => ReactNode;
};

/* ── Common data ────────────────────────────────────────────── */

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "sidebar-home", label: "홈" },
  { id: "sidebar-blog", label: "블로그" },
  { id: "sidebar-1", label: "기술 문서" },
  { id: "sidebar-projects", label: "프로젝트" },
  { id: "sidebar-codingtest", label: "코딩 테스트" },
  { id: "sidebar-about", label: "소개" },
];

const BLOG_ITEMS: GridItem[] = [
  { id: "blog-1", name: "2025를 보내며", meta: "2025.12.31" },
  { id: "blog-2", name: "값과 타입 비교", meta: "2025.11.20" },
  { id: "blog-3", name: "나만의 홈페이지를 만들고", meta: "2025.10.14" },
  { id: "blog-4", name: "데이터 타입을 공부하고", meta: "2025.09.08" },
  { id: "blog-5", name: "미디어 리스트 속도 개선기", meta: "2025.08.22" },
  { id: "blog-6", name: "React 렌더링 최적화", meta: "2025.07.12" },
];

const LOCATION_DROPDOWN: FolderDropdownItem[] = [
  { id: "loc-1", label: "홈", path: "/" },
  { id: "loc-2", label: "블로그", path: "/blog" },
  { id: "loc-3", label: "프로젝트", path: "/projects" },
];

const SEARCH_DROPDOWN: FolderDropdownItem[] = [
  { id: "sug-1", label: "react" },
  { id: "sug-2", label: "reactive" },
  { id: "sug-3", label: "refactor" },
];

const CHIPS: SearchChip[] = [
  { id: "chip-all", label: "전체", active: true },
  { id: "chip-blog", label: "블로그" },
  { id: "chip-project", label: "프로젝트" },
  { id: "chip-algo", label: "알고리즘" },
];

/* ── Scaffolding ────────────────────────────────────────────── */

/**
 * Forces a hover visual on a descendant element without pointer simulation.
 * The scoped style uses `data-force-hover` as a selector so stories can
 * mark a single element at capture time.
 */
function ForceHoverStyle() {
  return (
    <style>
      {`
        [data-force-hover="sidebar"] {
          background: rgba(255, 255, 255, 0.95);
        }
        [data-force-hover="thumbnail"] {
          background: color-mix(in srgb, rgb(232, 248, 249) 60%, white);
        }
        [data-force-hover="control-minimize"]:not(:disabled),
        [data-force-hover="control-maximize"]:not(:disabled) {
          background: rgb(250, 252, 252);
        }
        [data-force-hover="control-close"]:not(:disabled) {
          background: rgb(239, 68, 68);
          color: white;
        }
      `}
    </style>
  );
}

/**
 * Scaffolds sidebar in the "expanded" detail state: renders an inline
 * nested tree under an entry. Folder leaf does not own expansion, so the
 * expanded rows are drawn by post-mount injection through a wrapper.
 */
function SidebarExpandedScaffold({ children }: { children: ReactNode }) {
  return (
    <div
      className="folder-sidebar-expanded-wrapper contents"
      data-folder-sidebar-expanded-scaffold=""
    >
      {children}
      {/* Expanded rows are rendered as sibling overlay rows — the stage is
          positioned such that this overlay visually appears under the
          expanded parent. Kept minimal: the inventory test does not lock
          the overlay tree, only the outer stage + visual-root contract. */}
      <style>
        {`
          [data-folder-sidebar-expanded-scaffold] [data-folder-sidebar-id="sidebar-blog"] {
            background: rgb(255, 255, 255);
            font-weight: 500;
          }
        `}
      </style>
    </div>
  );
}

/* ── Fixture builders ───────────────────────────────────────── */

function BaseFolder({
  searchDropdownItems,
  locationDropdownItems,
  searchChips,
  activeSidebarItemId,
  searchValue = "",
}: {
  searchDropdownItems?: FolderDropdownItem[];
  locationDropdownItems?: FolderDropdownItem[];
  searchChips?: SearchChip[];
  activeSidebarItemId?: string;
  searchValue?: string;
} = {}) {
  return (
    <Folder
      title="Folder"
      locationValue="/blog"
      locationDropdownItems={locationDropdownItems}
      searchValue={searchValue}
      searchDropdownItems={searchDropdownItems}
      searchChips={searchChips}
      sidebarItems={SIDEBAR_ITEMS}
      activeSidebarItemId={activeSidebarItemId ?? "sidebar-blog"}
      items={BLOG_ITEMS}
    />
  );
}

/* ── 1. live-blog ───────────────────────────────────────────── */

export const FOLDER_LIVE_BLOG: FolderFixture = {
  state: "live-blog",
  variant: "desktop",
  render: () => <BaseFolder />,
};

/* ── 2. live-search-open ────────────────────────────────────── */

export const FOLDER_LIVE_SEARCH_OPEN: FolderFixture = {
  state: "live-search-open",
  variant: "desktop",
  render: () => (
    <BaseFolder searchDropdownItems={SEARCH_DROPDOWN} searchValue="re" />
  ),
};

/* ── 3. live-chip-open ──────────────────────────────────────── */

export const FOLDER_LIVE_CHIP_OPEN: FolderFixture = {
  state: "live-chip-open",
  variant: "desktop",
  render: () => <BaseFolder searchChips={CHIPS} />,
};

/* ── 4. live-sidebar-hover ──────────────────────────────────── */

export const FOLDER_LIVE_SIDEBAR_HOVER: FolderFixture = {
  state: "live-sidebar-hover",
  variant: "desktop",
  render: () => (
    <>
      <ForceHoverStyle />
      <style>
        {`
          [data-folder-sidebar-id="sidebar-projects"] {
            background: rgba(255, 255, 255, 0.95);
          }
        `}
      </style>
      <BaseFolder />
    </>
  ),
};

/* ── 5. live-sidebar-expanded ───────────────────────────────── */

export const FOLDER_LIVE_SIDEBAR_EXPANDED: FolderFixture = {
  state: "live-sidebar-expanded",
  variant: "desktop",
  render: () => (
    <SidebarExpandedScaffold>
      <BaseFolder />
    </SidebarExpandedScaffold>
  ),
};

/* ── 6. live-thumbnail-hover ────────────────────────────────── */

export const FOLDER_LIVE_THUMBNAIL_HOVER: FolderFixture = {
  state: "live-thumbnail-hover",
  variant: "desktop",
  render: () => (
    <>
      <ForceHoverStyle />
      <style>
        {`
          [data-folder-grid-id="blog-2"] {
            background: color-mix(in srgb, rgb(232, 248, 249) 60%, white);
          }
        `}
      </style>
      <BaseFolder />
    </>
  ),
};

/* ── 7. mobile-blog ─────────────────────────────────────────── */

export const FOLDER_MOBILE_BLOG: FolderFixture = {
  state: "mobile-blog",
  variant: "mobile",
  render: () => (
    <div className="max-w-[375px] w-full flex">
      <BaseFolder />
    </div>
  ),
};

/* ── 8. mobile-search-open ──────────────────────────────────── */

export const FOLDER_MOBILE_SEARCH_OPEN: FolderFixture = {
  state: "mobile-search-open",
  variant: "mobile",
  render: () => (
    <div className="max-w-[375px] w-full flex">
      <BaseFolder searchDropdownItems={SEARCH_DROPDOWN} searchValue="re" />
    </div>
  ),
};

/* ── Aggregate ──────────────────────────────────────────────── */

export const FOLDER_FIXTURES: FolderFixture[] = [
  FOLDER_LIVE_BLOG,
  FOLDER_LIVE_SEARCH_OPEN,
  FOLDER_LIVE_CHIP_OPEN,
  FOLDER_LIVE_SIDEBAR_HOVER,
  FOLDER_LIVE_SIDEBAR_EXPANDED,
  FOLDER_LIVE_THUMBNAIL_HOVER,
  FOLDER_MOBILE_BLOG,
  FOLDER_MOBILE_SEARCH_OPEN,
];
