/**
 * searchPanelReferenceFixtures
 *
 * Frozen reference data source for Search panel stories and tests.
 * Internal-only — NOT exported from package root.
 *
 * ──────────────────────────────────────────────────────────────
 * Reference Capture Classification
 * ──────────────────────────────────────────────────────────────
 *
 * The state inventory is **frozen at 3 canonical states**.
 * Expanding the canonical set requires a re-planning phase.
 *
 * ### 1. Canonical (state-defining) — 3 states
 *
 * These define the SearchPanel canonical states and are represented
 * as fixture exports + Storybook stories:
 *
 * | Key              | Capture file                        | Condition                                 |
 * |------------------|-------------------------------------|-------------------------------------------|
 * | `default`        | `search-panel-default.png`          | `query === ""`                            |
 * | `query-results`  | `search-panel-query-results.png`    | `query !== "" && results.length > 0`      |
 * | `query-empty`    | `search-panel-query-empty.png`      | `query !== "" && results.length === 0`    |
 *
 * ### 2. Supporting (reference-only) — NOT canonical states
 *
 * These captures exist as shared layout continuity references.
 * They show PanelSearchResultsView `layout="detail"` rendering
 * and are **NOT** SearchPanel states. Do NOT promote these to
 * canonical state keys or add fixture exports / stories for them.
 *
 * | Capture file                           | Purpose                                                              |
 * |----------------------------------------|----------------------------------------------------------------------|
 * | `search-panel-query-detail.png`        | Shows PanelSearchResultsView layout="detail" continuity reference.   |
 * | `search-panel-query-detail-pinned.png` | Shows pinned variant of detail layout (windows facade visual support).|
 *
 * ### 3. Excluded (out of scope)
 *
 * These captures are entirely out of scope for SearchPanel work.
 *
 * | Capture file                     | Reason            |
 * |----------------------------------|-------------------|
 * | `search-result-context-menu.png` | Context menu interaction — out of scope for this task. |
 *
 * ──────────────────────────────────────────────────────────────
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
