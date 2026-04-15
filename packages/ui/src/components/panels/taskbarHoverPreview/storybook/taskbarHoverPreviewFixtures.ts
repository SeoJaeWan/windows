/**
 * taskbarHoverPreviewFixtures
 *
 * Frozen reference data source for TaskbarHoverPreview stories and tests.
 * Internal-only — NOT exported from package root.
 *
 * ──────────────────────────────────────────────────────────────
 * Reference Capture Classification
 * ──────────────────────────────────────────────────────────────
 *
 * ### Canonical states — 2 states
 *
 * | Key            | Condition                |
 * |----------------|--------------------------|
 * | `hover-single` | `items.length === 1`     |
 * | `hover-multi`  | `items.length > 1`       |
 */

import { createElement } from "react";

import { file } from "../../windows/internal/contentIcon";

/* ── Placeholder preview elements ─────────────────────────────── */

function previewBox(label: string, bg: string) {
  return createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: 48,
      fontWeight: 600,
    },
  }, label);
}

/* ── 1. Hover single ──────────────────────────────────────────── */

export const HOVER_SINGLE = {
  items: [
    {
      id: "hp-1",
      label: "나만의 홈페이지 만들기",
      iconSrc: file,
      preview: previewBox("블로그 포스트 미리보기", "#3b82f6"),
    },
  ] as const,
};

/* ── 2. Hover multi ───────────────────────────────────────────── */

export const HOVER_MULTI = {
  items: [
    {
      id: "hp-1",
      label: "나만의 홈페이지 만들기",
      iconSrc: file,
      preview: previewBox("블로그 포스트 1", "#3b82f6"),
    },
    {
      id: "hp-2",
      label: "Component의 모든 것을 파헤쳐보자",
      iconSrc: file,
      preview: previewBox("블로그 포스트 2", "#8b5cf6"),
    },
    {
      id: "hp-3",
      label: "JavaScript 스터디 메이트",
      iconSrc: file,
      preview: previewBox("블로그 포스트 3", "#059669"),
    },
  ] as const,
};
