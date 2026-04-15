/**
 * searchPanelReferenceFixtures
 *
 * Frozen reference data source for Search panel stories and tests.
 * Internal-only — NOT exported from package root.
 *
 * Three canonical state sets matching the reference captures:
 * 1. Default       — search-panel-default.png (query === "")
 * 2. Query results — search-panel-query-results.png (query !== "" && results.length > 0)
 * 3. Query empty   — search-panel-query-empty.png (query !== "" && results.length === 0)
 */

import { file, folder } from "../../windows/internal/contentIcon";

/* ── Shared item shapes ─────────────────────────────────────── */

type SearchResult = { id: string; label: string; iconSrc: string; metaLabel: string };

/* ── 1. Default (empty query) ─────────────────────────────── */

export const SEARCH_DEFAULT = {
  query: "",
} as const;

/* ── 2. Query results ─────────────────────────────────────── */

export const SEARCH_QUERY_RESULTS = {
  query: "java",
  title: "최적의 일치",
  results: [
    { id: "sr-1", label: "JavaScript 스터디 메이트", iconSrc: file, metaLabel: "기술 문서" },
    { id: "sr-2", label: "Critical JavaScript 모든 개발자…", iconSrc: file, metaLabel: "기술 문서" },
  ] satisfies SearchResult[],
  emptyTitle: "",
  emptyDescription: "",
} as const;

/* ── 3. Query empty ───────────────────────────────────────── */

export const SEARCH_QUERY_EMPTY = {
  query: "asdfg",
  title: "최적의 일치",
  results: [] satisfies SearchResult[],
  emptyTitle: "",
  emptyDescription: "",
} as const;

/* ── Default view fixture data ────────────────────────────── */

type RecommendItem = { id: string; label: string; iconSrc: string; metaLabel: string };
type BlogCardItem = { id: string; label: string; iconSrc: string };
type ProjectCardItem = { id: string; label: string; iconSrc: string };

export const DEFAULT_VIEW_DATA = {
  recommendations: [
    { id: "rec-1", label: "Component의 모든 것을 파헤…", iconSrc: file, metaLabel: "" },
    { id: "rec-2", label: "Hidden: 다크 모드 반영하기", iconSrc: file, metaLabel: "" },
    { id: "rec-3", label: "블라인드 이벤트 참여하기", iconSrc: file, metaLabel: "" },
    { id: "rec-4", label: "매크로스와 플러그 2023", iconSrc: file, metaLabel: "" },
    { id: "rec-5", label: "공부 — 나를 더 나은 사람으로", iconSrc: file, metaLabel: "" },
    { id: "rec-6", label: "JavaScript 스터디 메이트", iconSrc: file, metaLabel: "" },
    { id: "rec-7", label: "Critical JavaScript 모든 개발자…", iconSrc: file, metaLabel: "" },
    { id: "rec-8", label: "APL: 사랑하는 힘이 되는 방법이…", iconSrc: file, metaLabel: "" },
  ] satisfies RecommendItem[],
  blogPosts: [
    { id: "blog-1", label: "나만의 홈페…", iconSrc: file },
    { id: "blog-2", label: "Components…", iconSrc: file },
    { id: "blog-3", label: "Mason API…", iconSrc: file },
  ] satisfies BlogCardItem[],
  projects: [
    { id: "proj-1", label: "최고의 프로…", iconSrc: folder },
    { id: "proj-2", label: "코드 스니핏…", iconSrc: folder },
    { id: "proj-3", label: "NbU…", iconSrc: folder },
  ] satisfies ProjectCardItem[],
} as const;

/* ── Aggregate map for story iteration ──────────────────────── */

export const SEARCH_PANEL_FIXTURES = {
  "default": SEARCH_DEFAULT,
  "query-results": SEARCH_QUERY_RESULTS,
  "query-empty": SEARCH_QUERY_EMPTY,
} as const;
