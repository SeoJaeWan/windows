import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

import { Dismiss16Regular } from "@fluentui/react-icons";
import IconImage from "../../common/iconImage";

/* ── Types ───────────────────────────────────────────────────── */

type TaskbarHoverPreviewItem = {
  id: string;
  label: string;
  iconSrc: string;
  preview: ReactNode;
};

type TaskbarHoverPreviewProps = ComponentPropsWithoutRef<"div"> & {
  items: [TaskbarHoverPreviewItem, ...TaskbarHoverPreviewItem[]];
};

/* ── Internal ────────────────────────────────────────────────── */

/**
 * PreviewCard — internal preview card surface.
 *
 * Close affordance is visual-only: `pointer-events-none` + `aria-hidden`.
 * Hidden by default, shown via CSS `group-hover/card` on the card container.
 * On hover the X button background turns red (`group-hover/close` CSS).
 * No callback or interactive orchestration contract is opened.
 *
 * Preview viewport uses `aspect-[4/3]` and uniform scale-down controlled
 * by the `--preview-scale` CSS custom property. Content is placed at
 * `origin-top-left` and scaled with a single `scale()` value (uniform —
 * no independent scaleX/scaleY). Callers should set `--preview-scale` to
 * fit their actual viewport dimensions.
 */
function PreviewCard({ item }: { item: TaskbarHoverPreviewItem }) {
  return (
    <div
      className="relative flex flex-col overflow-hidden group/card hover:bg-gray-200/30 transition-colors cursor-pointer"
      data-preview-card={item.id}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <IconImage src={item.iconSrc} alt={item.label} className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-xs text-gray-800">
          {item.label}
        </span>
      </div>

      {/* Close affordance — shown on card hover, red bg on own hover */}
      <span
        className="hidden group-hover/card:flex items-center justify-center absolute top-1 right-1 rounded-md w-[30px] h-[30px] cursor-default hover:bg-red-700 transition-colors group/close"
        data-testid="close-affordance"
        aria-hidden="true"
      >
        <Dismiss16Regular className="size-3.5 text-gray-500 group-hover/close:text-white" />
      </span>

      {/* Preview viewport */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100" style={{ "--preview-scale": "0.2" } as CSSProperties}>
        <div
          className="origin-top-left"
          data-testid="preview-scale-wrapper"
          style={{ transform: "scale(var(--preview-scale, 0.2))", width: "500%", height: "500%" }}
        >
          {item.preview}
        </div>
      </div>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────── */

/**
 * TaskbarHoverPreview
 *
 * Visual-only hover preview surface for taskbar icon buttons.
 * Receives a non-empty `items` array and renders scaled-down preview
 * cards for each item.
 *
 * Canonical states (exactly 2, selected by `items.length`):
 * - `hover-single` — `items.length === 1`
 * - `hover-multi`  — `items.length > 1`
 *
 * Multi layout matches the original site: horizontal grid with each
 * card taking equal width (`repeat(n, 1fr)`), overall container width
 * scales with `n * 200px`.
 *
 * Each card renders:
 * - App bitmap icon via `IconImage` (caller-owned `iconSrc`)
 * - Label text (caller-owned `label`)
 * - Close affordance via Fluent icon (visual-only, no callback)
 *   with red hover background via CSS `group/close`
 * - Preview viewport with aspect-ratio-preserving uniform scale-down
 *   (`preview: ReactNode`, not `previewSrc` — actual subtree, not image)
 *
 * Does NOT own: hover timing, open/close orchestration, anchor
 * positioning, selected-window state, close callback, state store.
 *
 * Exported from package root as `TaskbarHoverPreview` (Phase 3).
 */
function TaskbarHoverPreview({ items, className, ...rest }: TaskbarHoverPreviewProps) {
  const isSingle = items.length === 1;

  return (
    <div
      {...rest}
      className={`bg-gray-50/95 backdrop-blur-2xl shadow-lg rounded-lg border border-gray-200 ${className ?? ""}`.trim()}
      style={{ width: `min(80vw, ${items.length * 200}px)` }}
      data-state={isSingle ? "hover-single" : "hover-multi"}
    >
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map((item) => (
          <PreviewCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default TaskbarHoverPreview;
