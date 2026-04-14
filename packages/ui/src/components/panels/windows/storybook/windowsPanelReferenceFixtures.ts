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

import { file, folder } from "../internal/contentIcon";

/* ── Shared item shapes ─────────────────────────────────────── */

type PinnedItem = { id: string; label: string; iconSrc: string };
type AllItem = { id: string; label: string; iconSrc: string };
type AllSection = { id: string; heading: string; indexLabel: string; items: AllItem[] };
type SearchResult = { id: string; label: string; iconSrc: string; metaLabel: string };

/* ── 1. Pinned default ─────────────────────────────────────── */

export const PINNED_DEFAULT = {
  searchPlaceholder: "앱 및 문서 검색",
  searchValue: "",
  title: "고정됨",
  actionLabel: "모두",
  items: [
    { id: "pinned-1", label: "기술 문서/블로그", iconSrc: file },
    { id: "pinned-2", label: "금주의견 보고서", iconSrc: file },
    { id: "pinned-3", label: "코딩 테스트(풀이)", iconSrc: file },
    { id: "pinned-4", label: "프로젝트", iconSrc: folder },
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
      id: "section-hash",
      heading: "#",
      indexLabel: "#",
      items: [
        { id: "all-0", label: "2025를 보내며", iconSrc: file },
      ],
    },
    {
      id: "section-g",
      heading: "ㄱ",
      indexLabel: "ㄱ",
      items: [
        { id: "all-1", label: "값과 타입 비교", iconSrc: file },
      ],
    },
    {
      id: "section-n",
      heading: "ㄴ",
      indexLabel: "ㄴ",
      items: [
        { id: "all-2", label: "나만의 홈페이지를 만들고", iconSrc: file },
      ],
    },
    {
      id: "section-d",
      heading: "ㄷ",
      indexLabel: "ㄷ",
      items: [
        { id: "all-3", label: "데이터 타입을 공부하고", iconSrc: folder },
      ],
    },
    {
      id: "section-m",
      heading: "ㅁ",
      indexLabel: "ㅁ",
      items: [
        { id: "all-4", label: "미디어 리스트 속도 개선기", iconSrc: folder },
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
    { id: "idx-hash", heading: "#", indexLabel: "#", items: [] },
    { id: "idx-g", heading: "ㄱ", indexLabel: "ㄱ", items: [] },
    { id: "idx-n", heading: "ㄴ", indexLabel: "ㄴ", items: [] },
    { id: "idx-d", heading: "ㄷ", indexLabel: "ㄷ", items: [] },
    { id: "idx-m", heading: "ㅁ", indexLabel: "ㅁ", items: [] },
    { id: "idx-s", heading: "ㅅ", indexLabel: "ㅅ", items: [] },
    { id: "idx-o", heading: "ㅇ", indexLabel: "ㅇ", items: [] },
    { id: "idx-j", heading: "ㅈ", indexLabel: "ㅈ", items: [] },
    { id: "idx-k", heading: "ㅋ", indexLabel: "ㅋ", items: [] },
    { id: "idx-C", heading: "C", indexLabel: "C", items: [] },
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
  title: "최적의 일치",
  selectedResultId: "search-1",
  results: [
    { id: "search-1", label: "블로그", iconSrc: file, metaLabel: "기술 문서" },
    { id: "search-2", label: "블로그 포스트 작성법", iconSrc: file, metaLabel: "기술 문서" },
    { id: "search-3", label: "블로그 마이그레이션", iconSrc: folder, metaLabel: "프로젝트" },
  ] satisfies SearchResult[],
  previewPinState: { start: "pin", taskbar: "pin" } as const,
  emptyTitle: "",
  emptyDescription: "",
} as const;

/* ── 5. Search empty ────────────────────────────────────────── */

export const SEARCH_EMPTY = {
  searchPlaceholder: "앱 및 문서 검색",
  searchValue: "asdfg",
  mode: "empty" as const,
  title: "최적의 일치",
  selectedResultId: undefined,
  results: [] satisfies SearchResult[],
  emptyTitle: "",
  emptyDescription: "",
} as const;

/* ── Supporting fixture: unpin actions (not part of canonical inventory) */

export const SEARCH_RESULTS_UNPIN_ACTIONS = {
  searchPlaceholder: "앱 및 문서 검색",
  searchValue: "블로그",
  mode: "results" as const,
  title: "최적의 일치",
  selectedResultId: "search-1",
  results: [
    { id: "search-1", label: "블로그", iconSrc: file, metaLabel: "기술 문서" },
    { id: "search-2", label: "블로그 포스트 작성법", iconSrc: file, metaLabel: "기술 문서" },
    { id: "search-3", label: "블로그 마이그레이션", iconSrc: folder, metaLabel: "프로젝트" },
  ] satisfies SearchResult[],
  previewPinState: { start: "unpin", taskbar: "unpin" } as const,
  emptyTitle: "",
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
