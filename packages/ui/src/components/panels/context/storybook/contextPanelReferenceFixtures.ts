/**
 * contextPanelReferenceFixtures
 *
 * Frozen reference data source for ContextPanel stories and tests.
 * Internal-only — NOT exported from package root.
 *
 * ──────────────────────────────────────────────────────────────
 * Reference Capture Classification
 * ──────────────────────────────────────────────────────────────
 *
 * ### Canonical states — 3 states
 *
 * | Key        | Condition                                  |
 * |------------|--------------------------------------------|
 * | `default`  | All items enabled, icon present             |
 * | `iconless` | All items enabled, no icon                  |
 * | `disabled` | Mix of enabled and disabled items           |
 *
 * ### Supporting samples (not promoted to canonical state)
 *
 * Supporting samples demonstrate secondary variations (e.g. description
 * tooltip presence) but do not define new canonical states. They are
 * available for story composition but excluded from the compare inventory.
 */

import { createElement } from "react";

/* ── Tiny icon helper ────────────────────────────────────────── */

/** Minimal inline SVG icon for fixture use — avoids external icon dependency. */
function fixtureIcon(path: string) {
  return createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      fill: "currentColor",
      width: 16,
      height: 16,
    },
    createElement("path", { d: path }),
  );
}

const editIcon = fixtureIcon("M13.23 1h-1.46L3.52 9.25l-.16.22L1 13.59 2.41 15l4.12-2.36.22-.16L15 4.23V2.77L13.23 1zM2.41 13.59l1.51-3 1.45 1.45-2.96 1.55zm3.83-2.06L4.47 9.76l8-8 1.77 1.77-8 8z");
const copyIcon = fixtureIcon("M4 4V1h11v11h-3v3H1V4h3zm1 0h6v7h3V2H5v2zM2 5v8h8V5H2z");
const trashIcon = fixtureIcon("M6.5 1h3l1 1H14v1H2V2h3.5l1-1zM3 5v9a1 1 0 001 1h8a1 1 0 001-1V5H3zm3 1h1v7H6V6zm3 0h1v7H9V6z");

/* ── Canonical state: default ────────────────────────────────── */

export const CONTEXT_DEFAULT = {
  state: "default" as const,
  items: [
    { id: "edit", label: "편집", icon: editIcon, description: "항목을 편집합니다" },
    { id: "copy", label: "복사", icon: copyIcon, description: "클립보드에 복사합니다" },
    { id: "delete", label: "삭제", icon: trashIcon },
  ],
};

/* ── Canonical state: iconless ───────────────────────────────── */

export const CONTEXT_ICONLESS = {
  state: "iconless" as const,
  items: [
    { id: "open", label: "열기" },
    { id: "rename", label: "이름 바꾸기" },
    { id: "properties", label: "속성" },
  ],
};

/* ── Canonical state: disabled ───────────────────────────────── */

export const CONTEXT_DISABLED = {
  state: "disabled" as const,
  items: [
    { id: "edit", label: "편집", icon: editIcon },
    { id: "copy", label: "복사", icon: copyIcon, disabled: true },
    { id: "delete", label: "삭제", icon: trashIcon, disabled: true },
  ],
};

/* ── Compare inventory ───────────────────────────────────────── */

/**
 * Canonical compare inventory. Only canonical states are included.
 * Supporting samples (e.g. description-only variations) are intentionally
 * excluded from the compare set.
 */
export const COMPARE_INVENTORY = [
  CONTEXT_DEFAULT,
  CONTEXT_ICONLESS,
  CONTEXT_DISABLED,
] as const;
