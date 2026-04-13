/**
 * windowsPanelReferenceFixtures
 *
 * Frozen reference data source for Windows panel stories and tests.
 * Internal-only — NOT exported from package root.
 *
 * Five canonical state sets matching the reference captures:
 * 1. Pinned default   — start-panel-default.png / start-panel-pinned-4items.png
 * 2. All list         — start-panel-all.png
 * 3. All index chooser — start-panel-all-index.png
 * 4. Search results   — realistic Windows search results
 * 5. Search empty     — start-panel-query-empty.png
 */

/* ── Shared item shapes ─────────────────────────────────────── */

type PinnedItem = { id: string; label: string; icon: string };
type AllItem = { id: string; label: string; icon: string };
type AllSection = { id: string; heading: string; indexLabel: string; items: AllItem[] };
type SearchResult = { id: string; label: string; icon: string; metaLabel: string };

/* ── 1. Pinned default ─────────────────────────────────────── */

export const PINNED_DEFAULT = {
  searchPlaceholder: "앱 및 문서 검색",
  searchValue: "",
  title: "고정됨",
  actionLabel: "모든 앱",
  items: [
    { id: "pinned-1", label: "기술 문서/블로그", icon: "📝" },
    { id: "pinned-2", label: "금주의견 보고서", icon: "📄" },
    { id: "pinned-3", label: "코딩 테스트(풀이)", icon: "💻" },
    { id: "pinned-4", label: "프로젝트", icon: "📁" },
  ] satisfies PinnedItem[],
} as const;

/* ── 2. All list ────────────────────────────────────────────── */

export const ALL_LIST = {
  searchPlaceholder: "앱 및 문서 검색",
  searchValue: "",
  title: "모두",
  backLabel: "뒤로",
  mode: "list" as const,
  sections: [
    {
      id: "section-g",
      heading: "ㄱ",
      indexLabel: "ㄱ",
      items: [
        { id: "all-1", label: "2025년 회고", icon: "📋" },
      ],
    },
    {
      id: "section-g2",
      heading: "ㄱ",
      indexLabel: "ㄱ",
      items: [
        { id: "all-2", label: "금주의견 보고서", icon: "📄" },
      ],
    },
    {
      id: "section-n",
      heading: "ㄴ",
      indexLabel: "ㄴ",
      items: [
        { id: "all-3", label: "1인개발 포트폴리오를 만들고", icon: "📄" },
      ],
    },
    {
      id: "section-d",
      heading: "ㄷ",
      indexLabel: "ㄷ",
      items: [
        { id: "all-4", label: "데이터 기술을 공유하고", icon: "📁" },
      ],
    },
    {
      id: "section-m",
      heading: "ㅁ",
      indexLabel: "ㅁ",
      items: [
        { id: "all-5", label: "모바일 라이프 체크 리스트", icon: "📁" },
      ],
    },
  ] satisfies AllSection[],
} as const;

/* ── 3. All index chooser ───────────────────────────────────── */

export const ALL_INDEX = {
  searchPlaceholder: "앱 및 문서 검색",
  searchValue: "",
  title: "모두",
  backLabel: "뒤로",
  mode: "index" as const,
  sections: [
    { id: "idx-g", heading: "ㄱ", indexLabel: "ㄱ", items: [] },
    { id: "idx-n", heading: "ㄴ", indexLabel: "ㄴ", items: [] },
    { id: "idx-d", heading: "ㄷ", indexLabel: "ㄷ", items: [] },
    { id: "idx-r", heading: "ㄹ", indexLabel: "ㄹ", items: [] },
    { id: "idx-m", heading: "ㅁ", indexLabel: "ㅁ", items: [] },
    { id: "idx-b", heading: "ㅂ", indexLabel: "ㅂ", items: [] },
    { id: "idx-s", heading: "ㅅ", indexLabel: "ㅅ", items: [] },
    { id: "idx-o", heading: "ㅇ", indexLabel: "ㅇ", items: [] },
    { id: "idx-j", heading: "ㅈ", indexLabel: "ㅈ", items: [] },
    { id: "idx-ch", heading: "ㅊ", indexLabel: "ㅊ", items: [] },
    { id: "idx-k", heading: "ㅋ", indexLabel: "ㅋ", items: [] },
    { id: "idx-C", heading: "C", indexLabel: "C", items: [] },
    { id: "idx-p", heading: "ㅍ", indexLabel: "ㅍ", items: [] },
    { id: "idx-J", heading: "J", indexLabel: "J", items: [] },
    { id: "idx-N", heading: "N", indexLabel: "N", items: [] },
    { id: "idx-S", heading: "S", indexLabel: "S", items: [] },
  ] satisfies AllSection[],
} as const;

/* ── 4. Search results ──────────────────────────────────────── */

export const SEARCH_RESULTS = {
  searchPlaceholder: "앱 및 문서 검색",
  searchValue: "블로그",
  mode: "results" as const,
  title: "추천",
  selectedResultId: "search-1",
  results: [
    { id: "search-1", label: "블로그", icon: "📝", metaLabel: "기술 문서" },
    { id: "search-2", label: "블로그 포스트 작성법", icon: "📄", metaLabel: "기술 문서" },
    { id: "search-3", label: "블로그 마이그레이션", icon: "📋", metaLabel: "프로젝트" },
  ] satisfies SearchResult[],
  emptyTitle: "",
  emptyDescription: "",
} as const;

/* ── 5. Search empty ────────────────────────────────────────── */

export const SEARCH_EMPTY = {
  searchPlaceholder: "앱 및 문서 검색",
  searchValue: "asdfg",
  mode: "empty" as const,
  title: "추천",
  selectedResultId: undefined,
  results: [] satisfies SearchResult[],
  emptyTitle: "관련 결과 없음",
  emptyDescription: "",
} as const;

/* ── Aggregate map for story iteration ──────────────────────── */

export const PANEL_FIXTURES = {
  "pinned-default": PINNED_DEFAULT,
  "all-list": ALL_LIST,
  "all-index": ALL_INDEX,
  "search-results": SEARCH_RESULTS,
  "search-empty": SEARCH_EMPTY,
} as const;
