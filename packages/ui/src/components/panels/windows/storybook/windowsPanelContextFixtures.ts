/**
 * windowsPanelContextFixtures
 *
 * Frozen reference data for Windows Panel context-menu use cases.
 * Internal-only — NOT exported from package root.
 *
 * 7 use cases covering all Windows-host context-panel variations:
 *
 * | Key                        | Case | Item                                                              |
 * |----------------------------|------|-------------------------------------------------------------------|
 * | pinned-2025                |  1   | `2025를 보내며` (시작 고정, first position)                       |
 * | pinned-values-and-types    |  2   | `값과 타입 비교` (시작 고정, middle position)                     |
 * | pinned-homepage            |  3   | `나만의 홈페이지를 만들고` (시작 고정, middle position with front)|
 * | pinned-data-types          |  4   | `데이터 타입을 공부하고` (시작 고정, last position)               |
 * | all-pinned-2025            |  5   | `2025를 보내며` (All view, already pinned)                        |
 * | all-unpinned-reference     |  6   | `미디어 리스트 속도 개선기` / `NEU - Windows 테마 개인 홈페이지`  |
 * | search-results-reference   |  7   | `Component VS CSS 세기의 대결` / `NEU - Windows 테마 개인 홈페이지` |
 */

import {
  PINNED_2025_ROWS,
  PINNED_VALUES_AND_TYPES_ROWS,
  PINNED_HOMEPAGE_ROWS,
  PINNED_DATA_TYPES_ROWS,
  ALL_PINNED_ROWS,
  ALL_UNPINNED_ROWS,
  SEARCH_RESULT_CONTEXT_ROWS,
  type ContextRow,
} from "../../context/storybook/contextPanelHostRowInventories";

/* ── Fixture shape ─────────────────────────────────────────── */

export type WindowsContextFixture = {
  caseKey: string;
  itemLabel: string;
  rows: ContextRow[];
};

/* ── case 1: 시작 고정 > `2025를 보내며` ──────────────────── */

export const WPC_PINNED_2025: WindowsContextFixture = {
  caseKey: "pinned-2025",
  itemLabel: "2025를 보내며",
  rows: PINNED_2025_ROWS,
};

/* ── case 2: 시작 고정 > `값과 타입 비교` ─────────────────── */

export const WPC_PINNED_VALUES_AND_TYPES: WindowsContextFixture = {
  caseKey: "pinned-values-and-types",
  itemLabel: "값과 타입 비교",
  rows: PINNED_VALUES_AND_TYPES_ROWS,
};

/* ── case 3: 시작 고정 > `나만의 홈페이지를 만들고` ───────── */

export const WPC_PINNED_HOMEPAGE: WindowsContextFixture = {
  caseKey: "pinned-homepage",
  itemLabel: "나만의 홈페이지를 만들고",
  rows: PINNED_HOMEPAGE_ROWS,
};

/* ── case 4: 시작 고정 > `데이터 타입을 공부하고` ──────────── */

export const WPC_PINNED_DATA_TYPES: WindowsContextFixture = {
  caseKey: "pinned-data-types",
  itemLabel: "데이터 타입을 공부하고",
  rows: PINNED_DATA_TYPES_ROWS,
};

/* ── case 5: All > 이미 시작에 고정된 항목 (`2025를 보내며`) ── */

export const WPC_ALL_PINNED_2025: WindowsContextFixture = {
  caseKey: "all-pinned-2025",
  itemLabel: "2025를 보내며",
  rows: ALL_PINNED_ROWS,
};

/* ── case 6: All > 시작에 안 고정된 항목 ──────────────────── */
/* Representative items: `미디어 리스트 속도 개선기`, `NEU - Windows 테마 개인 홈페이지`
   Both share the exact same 3-row inventory. */

export const WPC_ALL_UNPINNED_REFERENCE: WindowsContextFixture = {
  caseKey: "all-unpinned-reference",
  itemLabel: "미디어 리스트 속도 개선기",
  rows: ALL_UNPINNED_ROWS,
};

/* ── case 7: 검색 결과 ────────────────────────────────────── */
/* Representative items: `Component VS CSS 세기의 대결`, `NEU - Windows 테마 개인 홈페이지`
   Uses shared SEARCH_RESULT_CONTEXT_ROWS (same as Search panel case 8). */

export const WPC_SEARCH_RESULTS_REFERENCE: WindowsContextFixture = {
  caseKey: "search-results-reference",
  itemLabel: "Component VS CSS 세기의 대결",
  rows: SEARCH_RESULT_CONTEXT_ROWS,
};

/* ── Aggregate inventory for story iteration ──────────────── */

export const WINDOWS_CONTEXT_FIXTURES = [
  WPC_PINNED_2025,
  WPC_PINNED_VALUES_AND_TYPES,
  WPC_PINNED_HOMEPAGE,
  WPC_PINNED_DATA_TYPES,
  WPC_ALL_PINNED_2025,
  WPC_ALL_UNPINNED_REFERENCE,
  WPC_SEARCH_RESULTS_REFERENCE,
] as const;
