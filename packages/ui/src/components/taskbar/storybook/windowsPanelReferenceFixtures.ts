/**
 * windowsPanelReferenceFixtures
 *
 * Frozen reference data source for Windows panel stories and tests.
 * Internal-only — NOT exported from package root.
 *
 * Five canonical state sets matching the reference captures:
 * 1. Pinned default
 * 2. All list
 * 3. All index chooser
 * 4. Search results
 * 5. Search empty
 */

/* ── Shared item shapes ─────────────────────────────────────── */

type PinnedItem = { id: string; label: string; icon: string };
type AllItem = { id: string; label: string; icon: string };
type AllSection = { id: string; heading: string; indexLabel: string; items: AllItem[] };
type SearchResult = { id: string; label: string; icon: string; metaLabel: string };

/* ── 1. Pinned default ──────────────────────────────────────── */

export const PINNED_DEFAULT = {
  searchPlaceholder: "앱 및 문서 검색",
  searchValue: "",
  title: "고정됨",
  actionLabel: "모든 앱",
  items: [
    { id: "pinned-1", label: "기술 문서", icon: "📝" },
    { id: "pinned-2", label: "프로젝트", icon: "📁" },
    { id: "pinned-3", label: "코딩 테스트", icon: "💻" },
    { id: "pinned-4", label: "소개", icon: "👤" },
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
      id: "section-recent",
      heading: "최근에 추가한 항목",
      indexLabel: "ㅊ",
      items: [
        { id: "all-1", label: "2025년 회고", icon: "📋" },
      ],
    },
    {
      id: "section-tech",
      heading: "기술 문서/블로그",
      indexLabel: "ㄱ",
      items: [
        { id: "all-2", label: "금주의견 보고서", icon: "📄" },
        { id: "all-3", label: "1인개발 포트폴리오 만들기", icon: "📄" },
      ],
    },
    {
      id: "section-project",
      heading: "프로젝트",
      indexLabel: "ㅍ",
      items: [
        { id: "all-4", label: "데이터 기술을 공유하고", icon: "📁" },
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
    { id: "idx-t", heading: "C", indexLabel: "C", items: [] },
    { id: "idx-p", heading: "ㅍ", indexLabel: "ㅍ", items: [] },
    { id: "idx-h", heading: "J", indexLabel: "J", items: [] },
    { id: "idx-num", heading: "N", indexLabel: "N", items: [] },
    { id: "idx-s2", heading: "S", indexLabel: "S", items: [] },
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
  emptyTitle: "관련된 결과 없음",
  emptyDescription: "다른 검색어를 입력하세요.",
} as const;

/* ── Aggregate map for story iteration ──────────────────────── */

export const PANEL_FIXTURES = {
  "pinned-default": PINNED_DEFAULT,
  "all-list": ALL_LIST,
  "all-index": ALL_INDEX,
  "search-results": SEARCH_RESULTS,
  "search-empty": SEARCH_EMPTY,
} as const;
