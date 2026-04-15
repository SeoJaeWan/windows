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
 * No callback or interactive orchestration contract is opened.
 *
 * Preview viewport uses aspect-ratio-preserving uniform scale-down via
 * `--preview-scale` CSS custom property. The preview ReactNode is rendered
 * at natural size inside a 500% canvas, then uniformly scaled back down.
 * Aspect ratio distortion (independent scaleX/scaleY) is not permitted.
 * Remaining space is letterboxed.
 */
function PreviewCard({ item }: { item: TaskbarHoverPreviewItem }) {
  return (
    <div className="flex flex-col overflow-hidden" data-preview-card={item.id}>
      {/* Header */}
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <IconImage src={item.iconSrc} alt={item.label} className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-xs text-gray-800">
          {item.label}
        </span>
        <span className="shrink-0 pointer-events-none" data-testid="close-affordance" aria-hidden="true">
          <Dismiss16Regular className="size-3.5 text-gray-500" />
        </span>
      </div>

      {/* Preview viewport */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100" style={{ "--preview-scale": "0.2" } as CSSProperties}>
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
 * Each card renders:
 * - App bitmap icon via `IconImage` (caller-owned `iconSrc`)
 * - Label text (caller-owned `label`)
 * - Close affordance via Fluent icon (visual-only, no callback)
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
      className={`bg-gray-50/95 backdrop-blur-xl shadow-lg rounded-lg border border-gray-200 p-1.5 ${className ?? ""}`.trim()}
      data-state={isSingle ? "hover-single" : "hover-multi"}
      {...rest}
    >
      <div
        className={
          isSingle
            ? "flex flex-col"
            : `grid gap-1.5`
        }
        style={
          isSingle
            ? undefined
            : { gridTemplateColumns: `repeat(${items.length}, 1fr)` }
        }
      >
        {items.map((item) => (
          <PreviewCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default TaskbarHoverPreview;
