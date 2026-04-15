import type { ComponentPropsWithoutRef, ReactNode } from "react";

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

function PreviewCard({ item }: { item: TaskbarHoverPreviewItem }) {
  return (
    <div className="flex flex-col overflow-hidden" data-preview-card={item.id}>
      {/* Header */}
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <IconImage src={item.iconSrc} alt={item.label} className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-xs text-gray-800">
          {item.label}
        </span>
        <span className="shrink-0" data-testid="close-affordance">
          <Dismiss16Regular className="size-3.5 text-gray-500" />
        </span>
      </div>

      {/* Preview viewport */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        <div
          className="origin-top-left"
          data-testid="preview-scale-wrapper"
          style={{ transform: "scale(0.2)", width: "500%", height: "500%" }}
        >
          {item.preview}
        </div>
      </div>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────── */

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
