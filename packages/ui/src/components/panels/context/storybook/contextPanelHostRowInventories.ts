/**
 * contextPanelHostRowInventories
 *
 * Literal row text/icon inventory for all 8 real-world context-panel use cases.
 * Internal-only — NOT exported from package root.
 *
 * ──────────────────────────────────────────────────────────────
 * Winner Rule for Shared Rows
 * ──────────────────────────────────────────────────────────────
 *
 * case 7 (Windows panel > 검색 결과) and case 8 (Search panel > 기본 추천/검색 결과)
 * share the exact same 4-row inventory. A single shared constant
 * `SEARCH_RESULT_CONTEXT_ROWS` is defined here and referenced by both
 * host fixture files. Story/compare ownership remains split:
 *   - case 7 → `Windows Panel/Context` story owner
 *   - case 8 → `Search Panel/Context` story owner
 *
 * ──────────────────────────────────────────────────────────────
 * 8 Use Cases
 * ──────────────────────────────────────────────────────────────
 *
 * | #   | Host                           | Case key                    | Item example                                        |
 * |-----|--------------------------------|-----------------------------|-----------------------------------------------------|
 * |  1  | Windows > 시작 고정            | pinned-2025                 | `2025를 보내며`                                     |
 * |  2  | Windows > 시작 고정            | pinned-values-and-types     | `값과 타입 비교`                                    |
 * |  3  | Windows > 시작 고정            | pinned-homepage             | `나만의 홈페이지를 만들고`                          |
 * |  4  | Windows > 시작 고정            | pinned-data-types           | `데이터 타입을 공부하고`                            |
 * |  5  | Windows > All > pinned         | all-pinned-2025             | `2025를 보내며`                                     |
 * |  6  | Windows > All > unpinned       | all-unpinned-reference      | `미디어 리스트 속도 개선기`, `NEU - Windows 테마 개인 홈페이지` |
 * |  7  | Windows > 검색 결과            | search-results-reference    | `Component VS CSS 세기의 대결`, `NEU - Windows 테마 개인 홈페이지` |
 * |  8  | Search > 기본 추천/검색 결과   | results-reference           | `Component VS CSS 세기의 대결`, `NEU - Windows 테마 개인 홈페이지` |
 */

import { createElement, type ReactNode } from "react";
import {
  ArrowRight16Regular,
  ArrowLeft16Regular,
  FolderOpen16Regular,
  PinOff16Regular,
  Pin16Regular,
  Document16Regular,
  ArrowUpLeft16Regular,
} from "@fluentui/react-icons";

/* ── Icon helper — render FluentUI icon as ReactNode for fixture use ── */

function icon(Icon: typeof ArrowRight16Regular, label: string): ReactNode {
  return createElement(Icon, { "aria-label": label });
}

/* ── Row shape ──────────────────────────────────────────────── */

export type ContextRow = {
  id: string;
  label: string;
  icon: ReactNode;
};

/* ── case 1: Windows panel > 시작 고정 > `2025를 보내며` ──── */

export const PINNED_2025_ROWS: ContextRow[] = [
  { id: "move-right", label: "오른쪽으로 이동", icon: icon(ArrowRight16Regular, "ArrowRight") },
  { id: "open-folder", label: "파일 위치 열기", icon: icon(FolderOpen16Regular, "FolderOpen") },
  { id: "unpin-start", label: "시작 화면에서 제거", icon: icon(PinOff16Regular, "PinOff") },
  { id: "unpin-taskbar", label: "작업 표시줄에서 제거", icon: icon(PinOff16Regular, "PinOff") },
];

/* ── case 2: Windows panel > 시작 고정 > `값과 타입 비교` ── */

export const PINNED_VALUES_AND_TYPES_ROWS: ContextRow[] = [
  { id: "move-left", label: "왼쪽으로 이동", icon: icon(ArrowLeft16Regular, "ArrowLeft") },
  { id: "move-right", label: "오른쪽으로 이동", icon: icon(ArrowRight16Regular, "ArrowRight") },
  { id: "open-folder", label: "파일 위치 열기", icon: icon(FolderOpen16Regular, "FolderOpen") },
  { id: "unpin-start", label: "시작 화면에서 제거", icon: icon(PinOff16Regular, "PinOff") },
  { id: "unpin-taskbar", label: "작업 표시줄에서 제거", icon: icon(PinOff16Regular, "PinOff") },
];

/* ── case 3: Windows panel > 시작 고정 > `나만의 홈페이지를 만들고` ── */

export const PINNED_HOMEPAGE_ROWS: ContextRow[] = [
  { id: "move-front", label: "앞으로 이동", icon: icon(ArrowUpLeft16Regular, "ArrowUpLeft") },
  { id: "move-left", label: "왼쪽으로 이동", icon: icon(ArrowLeft16Regular, "ArrowLeft") },
  { id: "move-right", label: "오른쪽으로 이동", icon: icon(ArrowRight16Regular, "ArrowRight") },
  { id: "open-folder", label: "파일 위치 열기", icon: icon(FolderOpen16Regular, "FolderOpen") },
  { id: "unpin-start", label: "시작 화면에서 제거", icon: icon(PinOff16Regular, "PinOff") },
  { id: "unpin-taskbar", label: "작업 표시줄에서 제거", icon: icon(PinOff16Regular, "PinOff") },
];

/* ── case 4: Windows panel > 시작 고정 > `데이터 타입을 공부하고` ── */

export const PINNED_DATA_TYPES_ROWS: ContextRow[] = [
  { id: "move-front", label: "앞으로 이동", icon: icon(ArrowUpLeft16Regular, "ArrowUpLeft") },
  { id: "move-left", label: "왼쪽으로 이동", icon: icon(ArrowLeft16Regular, "ArrowLeft") },
  { id: "open-folder", label: "파일 위치 열기", icon: icon(FolderOpen16Regular, "FolderOpen") },
  { id: "unpin-start", label: "시작 화면에서 제거", icon: icon(PinOff16Regular, "PinOff") },
  { id: "unpin-taskbar", label: "작업 표시줄에서 제거", icon: icon(PinOff16Regular, "PinOff") },
];

/* ── case 5: Windows panel > All > 이미 시작에 고정된 항목 (`2025를 보내며`) ── */

export const ALL_PINNED_ROWS: ContextRow[] = [
  { id: "open-folder", label: "파일 위치 열기", icon: icon(FolderOpen16Regular, "FolderOpen") },
  { id: "unpin-start", label: "시작 화면에서 제거", icon: icon(PinOff16Regular, "PinOff") },
  { id: "unpin-taskbar", label: "작업 표시줄에서 제거", icon: icon(PinOff16Regular, "PinOff") },
];

/* ── case 6: Windows panel > All > 시작에 안 고정된 항목 ──── */
/* Two items (`미디어 리스트 속도 개선기`, `NEU - Windows 테마 개인 홈페이지`) share
   the exact same 3-row inventory → single `all-unpinned-reference` constant. */

export const ALL_UNPINNED_ROWS: ContextRow[] = [
  { id: "open-folder", label: "파일 위치 열기", icon: icon(FolderOpen16Regular, "FolderOpen") },
  { id: "pin-start", label: "시작 화면에 고정", icon: icon(Pin16Regular, "Pin") },
  { id: "unpin-taskbar", label: "작업 표시줄에서 제거", icon: icon(PinOff16Regular, "PinOff") },
];

/* ── case 7 & 8: Shared search-result context rows ─────────── */
/* Winner rule: case 7 (Windows panel > 검색 결과) and case 8 (Search panel > 기본 추천/검색 결과)
   share the exact same 4-row inventory. This shared constant is the single source.
   Story/compare ownership is split — see windowsPanelContext.stories.tsx (case 7)
   and searchPanelContext.stories.tsx (case 8). */

export const SEARCH_RESULT_CONTEXT_ROWS: ContextRow[] = [
  { id: "run-file", label: "파일 실행", icon: icon(Document16Regular, "Document") },
  { id: "open-folder", label: "파일 위치 열기", icon: icon(FolderOpen16Regular, "FolderOpen") },
  { id: "pin-start", label: "시작 화면에 고정", icon: icon(Pin16Regular, "Pin") },
  { id: "unpin-taskbar", label: "작업 표시줄에서 제거", icon: icon(PinOff16Regular, "PinOff") },
];
