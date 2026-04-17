/**
 * searchPanelContextFixtures
 *
 * Frozen reference data for Search Panel context-menu use cases.
 * Internal-only — NOT exported from package root.
 *
 * 1 use case covering the Search-host context-panel variation:
 *
 * | Key                 | Case | Item                                                              |
 * |---------------------|------|-------------------------------------------------------------------|
 * | results-reference   |  8   | `Component VS CSS 세기의 대결`, `NEU - Windows 테마 개인 홈페이지` |
 *
 * Exact rows:
 * - `파일 실행`          + icon: File
 * - `파일 위치 열기`      + icon: FolderOpen
 * - `시작 화면에 고정`    + icon: Pin
 * - `작업 표시줄에서 제거` + icon: PinOff
 *
 * This case shares the exact same 4-row inventory as Windows Panel case 7
 * (search-results-reference). The shared constant `SEARCH_RESULT_CONTEXT_ROWS`
 * lives in contextPanelHostRowInventories.tsx. Story/compare owner is split:
 * case 7 → `Panels/Windows/Context`, case 8 → `Panels/Search/Context`.
 */

import {
  SEARCH_RESULT_CONTEXT_ROWS,
  type ContextRow,
} from "../../context/storybook/contextPanelHostRowInventories";

/* ── Fixture shape ─────────────────────────────────────────── */

export type SearchContextFixture = {
  caseKey: string;
  itemLabel: string;
  rows: ContextRow[];
};

/* ── case 8: Search panel > 기본 추천/검색 결과 ────────────── */
/* Representative items: `Component VS CSS 세기의 대결`, `NEU - Windows 테마 개인 홈페이지` */

export const SPC_RESULTS_REFERENCE: SearchContextFixture = {
  caseKey: "results-reference",
  itemLabel: "Component VS CSS 세기의 대결",
  rows: SEARCH_RESULT_CONTEXT_ROWS,
};

/* ── Aggregate inventory for story iteration ──────────────── */

export const SEARCH_CONTEXT_FIXTURES = [
  SPC_RESULTS_REFERENCE,
] as const;
