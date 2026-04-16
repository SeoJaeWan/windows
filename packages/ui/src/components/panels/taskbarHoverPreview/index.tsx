import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

import { Dismiss16Regular } from "@fluentui/react-icons";
import { cn } from "../../../internal/cn";
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
 * Close affordance is visual-only: `aria-hidden`.
 * Hidden by default, shown via CSS `group-hover/card` on the card container.
 * On hover the X button background turns red (`group-hover/close` CSS).
 * No callback or interactive orchestration contract is opened.
 *
 * Preview viewport uses `aspect-[4/3]` and uniform scale-down controlled
 * by the `--preview-scale` CSS custom property. Content is placed at
 * `origin-top-left` and scaled with a single `scale()` value (uniform —
 * no independent scaleX/scaleY). Callers should set `--preview-scale` to
 * fit their actual viewport dimensions.
 *
 * Preview content is marked `inert` so it is excluded from the a11y tree
 * and does not receive interaction events, without relying on pointer-events-none.
 */
function PreviewCard({ item }: { item: TaskbarHoverPreviewItem }) {
  return (
    <div
      className="relative aspect-4/3 overflow-hidden p-1 group hover:bg-gray-200/30 cursor-pointer"
      data-preview-card={item.id}
    >
      {/* Header */}
      <div className="flex gap-1.5 text-gray-600 min-w-0 h-[30px] items-center">
        <IconImage src={item.iconSrc} alt={item.label} className="size-[18px] shrink-0" />
        <span className="inline-block flex-1 min-w-0 truncate text-xs">
          {item.label}
        </span>

        {/* Ghost spacer — reserves header space for the X button on hover */}
        <div className="hidden group-hover:flex w-[30px] h-[30px]" />
      </div>

      {/* Close affordance — shown on card hover, red bg on own hover */}
      <span
        className="absolute top-1 right-1 z-[2] hidden group-hover:flex items-center justify-center rounded-md text-gray-400 w-[30px] h-[30px] cursor-default hover:bg-red-700 hover:text-white"
        data-testid="close-affordance"
        aria-hidden="true"
      >
        <Dismiss16Regular className="size-4" />
      </span>

      {/* Preview viewport — inert keeps content out of a11y tree and interaction */}
      <div className="w-full h-[calc(100%-30px)]" style={{ "--preview-scale": "0.2" } as CSSProperties}>
        <div
          className="origin-top-left"
          data-testid="preview-scale-wrapper"
          style={{ transform: "scale(var(--preview-scale, 0.2))", width: "500%", height: "500%" }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ inert: "" } as any)}
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
      className={cn(
        "bg-gray-50/95 backdrop-blur-2xl shadow-lg rounded-lg border border-gray-200",
        className
      )}
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
