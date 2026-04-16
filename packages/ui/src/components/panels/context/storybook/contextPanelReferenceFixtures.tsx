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

import { Edit16Regular, Copy16Regular, Delete16Regular } from "@fluentui/react-icons";

/* ── Canonical state: default ────────────────────────────────── */

export const CONTEXT_DEFAULT = {
  state: "default" as const,
  items: [
    { id: "edit", label: "편집", icon: <Edit16Regular />, description: "항목을 편집합니다" },
    { id: "copy", label: "복사", icon: <Copy16Regular />, description: "클립보드에 복사합니다" },
    { id: "delete", label: "삭제", icon: <Delete16Regular /> },
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
    { id: "edit", label: "편집", icon: <Edit16Regular /> },
    { id: "copy", label: "복사", icon: <Copy16Regular />, disabled: true },
    { id: "delete", label: "삭제", icon: <Delete16Regular />, disabled: true },
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
