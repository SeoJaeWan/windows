/**
 * taskbarContextMenuFixtures
 *
 * Frozen reference data source for TaskbarContextMenu stories and tests.
 * Internal-only — NOT exported from package root.
 *
 * ──────────────────────────────────────────────────────────────
 * Reference Capture Classification
 * ──────────────────────────────────────────────────────────────
 *
 * ### Canonical states — 2 states
 *
 * | Key                | Condition                         |
 * |--------------------|-----------------------------------|
 * | `context-pinned`   | `taskbarPinState === "pinned"`    |
 * | `context-unpinned` | `taskbarPinState === "unpinned"`  |
 */

import { file, folder } from "../../windows/internal/contentIcon";

/* ── 1. Context pinned ───────────────────────────────────────── */

export const CONTEXT_PINNED = {
  state: "context-pinned" as const,
  appRows: [
    { id: "cm-1", label: "나만의 홈페이지 만들기", iconSrc: file },
    { id: "cm-2", label: "Component의 모든 것", iconSrc: file },
    { id: "cm-3", label: "JavaScript 스터디 메이트", iconSrc: file },
  ] as const,
  taskbarPinState: "pinned" as const,
  appIdentifier: { label: "블로그", iconSrc: folder },
};

/* ── 2. Context unpinned ─────────────────────────────────────── */

export const CONTEXT_UNPINNED = {
  state: "context-unpinned" as const,
  appRows: [
    { id: "cm-1", label: "나만의 홈페이지 만들기", iconSrc: file },
    { id: "cm-2", label: "Component의 모든 것", iconSrc: file },
    { id: "cm-3", label: "JavaScript 스터디 메이트", iconSrc: file },
  ] as const,
  taskbarPinState: "unpinned" as const,
  appIdentifier: { label: "블로그", iconSrc: folder },
};
