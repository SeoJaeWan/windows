import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useCallback } from "react";

import { Dismiss16Regular } from "@fluentui/react-icons";
import { cn } from "../../../internal/cn";
import IconImage from "../../common/iconImage";
import type { SurfacePhase } from "../taskbarAttachedSurface/shared";
import { getMotionClass, attachEnterListener, attachExitListener } from "../taskbarAttachedSurface/motion";

/* ── Types ───────────────────────────────────────────────────── */

type TaskbarHoverPreviewItem = {
  id: string;
  label: string;
  iconSrc: string;
  preview: ReactNode;
};

type TaskbarHoverPreviewProps = {
  items: [TaskbarHoverPreviewItem, ...TaskbarHoverPreviewItem[]];
  /** Animation lifecycle phase. Controls data-phase marker. */
  phase: SurfacePhase;
  /**
   * Called when the enter animation completes on the root element (opening→open).
   * Must be wired to the host controller's onEnterComplete.
   * The same mounted root element that owns the enter motion class fires this.
   */
  onEnterComplete: () => void;
  /** Called when the closing animation completes. */
  onExitComplete: () => void;
  /** Called when the user clicks a preview card (selects a window). */
  onSelectItem: (id: string) => void;
  /** Called when the user clicks the close button on a preview card. */
  onCloseItem: (id: string) => void;
  /**
   * Host-level props merged onto the root element.
   * Package-owned data-state and data-phase cannot be overridden via surfaceProps.
   */
  surfaceProps?: React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };
  className?: string;
};

/* ── Internal ────────────────────────────────────────────────── */

/**
 * PreviewCard — internal preview card surface.
 *
 * Close affordance is a real <button> connected to onCloseItem.
 * Hidden by default, shown via CSS `group-hover/card` on the card container.
 * On hover the X button background turns red.
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
function PreviewCard({
  item,
  onSelectItem,
  onCloseItem,
}: {
  item: TaskbarHoverPreviewItem;
  onSelectItem: (id: string) => void;
  onCloseItem: (id: string) => void;
}) {
  return (
    <div
      className="relative aspect-4/3 overflow-hidden p-1 group hover:bg-gray-200/30 cursor-pointer"
      data-preview-card={item.id}
      onClick={() => onSelectItem(item.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectItem(item.id);
        }
      }}
      aria-label={item.label}
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

      {/* Close affordance — real button connected to onCloseItem */}
      <button
        type="button"
        className="absolute top-1 right-1 z-[2] hidden group-hover:flex items-center justify-center rounded-md text-gray-400 w-[30px] h-[30px] cursor-default hover:bg-red-700 hover:text-white"
        data-testid="close-affordance"
        aria-label={`${item.label} 닫기`}
        onClick={(e) => {
          e.stopPropagation();
          onCloseItem(item.id);
        }}
      >
        <Dismiss16Regular className="size-4" />
      </button>

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
 * Interactive hover preview surface for taskbar icon buttons.
 * Receives a non-empty `items` array and renders scaled-down preview
 * cards for each item.
 *
 * Canonical states (exactly 2, selected by `items.length`):
 * - `hover-single` — `items.length === 1`
 * - `hover-multi`  — `items.length > 1`
 *
 * Package-owned DOM markers:
 * - `data-state` — "hover-single" | "hover-multi" (derived from items.length)
 * - `data-phase` — mirrors the `phase` prop; surfaceProps cannot override
 *
 * Does NOT own: hover timing, open/close orchestration, anchor
 * positioning, selected-window state, state store.
 */
function TaskbarHoverPreview({
  items,
  phase,
  onEnterComplete,
  onExitComplete,
  onSelectItem,
  onCloseItem,
  surfaceProps,
  className,
}: TaskbarHoverPreviewProps) {
  const isSingle = items.length === 1;

  // Destructure surfaceProps to extract ref and prevent data-* override
  const { ref: surfaceRef, ...restSurfaceProps } = surfaceProps ?? {};

  // Internal ref for the root element — used for native animationend listener
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Stable refs for callbacks to avoid re-attaching listeners on every render
  const onEnterCompleteRef = useRef(onEnterComplete);
  onEnterCompleteRef.current = onEnterComplete;
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;

  // Assign refs: merge internal rootRef with surfaceRef from host
  const assignRef = useCallback(
    (el: HTMLDivElement | null) => {
      rootRef.current = el;
      if (typeof surfaceRef === "function") {
        (surfaceRef as (el: HTMLDivElement | null) => void)(el);
      } else if (surfaceRef && typeof surfaceRef === "object") {
        (surfaceRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }
    },
    // surfaceRef is stable from the host hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [surfaceRef],
  );

  // opening-only guard: attach native animationend listener to root element.
  // Same mounted root contract: the root that owns the enter class fires onEnterComplete.
  // Fires onEnterComplete only when phase === "opening" and event target is root.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    return attachEnterListener(el, phase, () => onEnterCompleteRef.current());
  }, [phase]);

  // closing-only guard: attach native animationend listener to root element.
  // Same mounted root contract: the root that owns the exit class fires onExitComplete.
  // Fires onExitComplete only when phase === "closing" and event target is root.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    return attachExitListener(el, phase, () => onExitCompleteRef.current());
  }, [phase]);

  return (
    <div
      {...restSurfaceProps}
      ref={assignRef}
      className={cn(
        "bg-gray-50/95 backdrop-blur-2xl shadow-lg rounded-lg border border-gray-200",
        getMotionClass(phase),
        restSurfaceProps.className,
        className
      )}
      style={{ width: `min(80vw, ${items.length * 200}px)`, ...restSurfaceProps.style }}
      // Package-owned markers — always win over surfaceProps
      data-state={isSingle ? "hover-single" : "hover-multi"}
      data-phase={phase}
    >
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map((item) => (
          <PreviewCard
            key={item.id}
            item={item}
            onSelectItem={onSelectItem}
            onCloseItem={onCloseItem}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskbarHoverPreview;
