/**
 * taskbarBehaviorHarnesses
 *
 * Shared harness components for interactive/taskbar behavior stories.
 * Owns: taskbar strip layout, trigger button ref, backdrop, surface root,
 * outside-click target, and consumer-owned mutual exclusion logic.
 *
 * Anchor contract (trigger-centered):
 *   Hover preview placement is derived from the trigger element bounding rect,
 *   NOT from a fixed left:50% offset. The host reads triggerRef.current's
 *   getBoundingClientRect() and positions the surface above the trigger center.
 *
 * Motion contract:
 *   motionPreference defaults to 'auto' (no forced override). Full opening/closing
 *   phase transitions are observable. Tests that need to verify motion phases
 *   should stub matchMedia or use motionPreference: 'auto' and observe phase.
 *
 * NOT a public package export — storybook support file only.
 *
 * Inline style: bounded exception — host-composition overlay absolute
 * placement and decorative desktop backdrop gradient.
 */

import type { ComponentPropsWithRef } from "react";
import { useEffect, useRef, useState } from "react";

import TaskbarHoverPreview from "../../../components/panels/taskbarHoverPreview/index";
import TaskbarContextMenu from "../../../components/panels/taskbarContextMenu/index";
import TaskbarIconButton from "../../../components/taskbar/taskbarIconButton/index";
import { folder } from "../../../components/panels/windows/internal/contentIcon/index";
import { useTaskbarHoverPreview } from "../useTaskbarHoverPreview";
import { useTaskbarContextPanel } from "../useTaskbarContextPanel";
import { HOVER_MULTI, CONTEXT_PINNED } from "./taskbarBehaviorFixtures";

// TaskbarIconButton은 ComponentPropsWithoutRef<"button">을 사용하지만
// React 19에서 ref는 ...rest를 통해 내부 button까지 전달된다.
const TaskbarIconButtonWithRef = TaskbarIconButton as React.ComponentType<
  ComponentPropsWithRef<"button"> & { status: "default" | "active" | "hide"; iconSrc: string }
>;

/* ── Shared layout constants ─────────────────────────────────── */

const BACKDROP_STYLE: React.CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "center",
  width: 720,
  height: 500,
  background: "linear-gradient(135deg, #1e90ff 0%, #87ceeb 50%, #4fc3f7 100%)",
  borderRadius: 12,
  userSelect: "none",
};

const TASKBAR_STRIP_STYLE: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: 48,
  background: "rgba(0,0,0,0.7)",
  borderRadius: "0 0 12px 12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const HINT_TEXT_STYLE: React.CSSProperties = {
  color: "rgba(255,255,255,0.6)",
  fontSize: 11,
  margin: 0,
};

const CONTEXT_SURFACE_STYLE_BASE: React.CSSProperties = {
  position: "fixed",
  zIndex: 50,
};

/**
 * computeHoverSurfaceStyle
 *
 * Derives the surface position from the trigger element's bounding rect.
 * The panel is centered on the trigger's horizontal center and placed above
 * the trigger top with a fixed gap — same policy as useTaskbarContextPanel.
 *
 * Returns a React.CSSProperties object for direct use as style prop.
 */
function computeHoverSurfaceStyle(
  triggerEl: HTMLElement | null,
): React.CSSProperties {
  if (!triggerEl) {
    return { position: "absolute", bottom: 60, left: 0 };
  }
  const rect = triggerEl.getBoundingClientRect();
  const panelWidth = 320; // approximate width for visual centering
  const gap = 10;
  const triggerCenterX = rect.left + rect.width / 2;
  const x = triggerCenterX - panelWidth / 2;
  const y = rect.top - gap;

  return {
    position: "fixed",
    left: x,
    // anchor to trigger top; surface grows upward (translateY handles final offset)
    top: y,
    transform: "translateY(-100%)",
    zIndex: 50,
  };
}

/* ── HoverPreviewHarness ─────────────────────────────────────── */

/**
 * HoverPreviewHarness
 *
 * Wires useTaskbarHoverPreview to TaskbarHoverPreview.
 *
 * Anchor contract: surface is positioned above the trigger center using the
 * trigger element's bounding rect — NOT a fixed left:50% offset.
 *
 * Motion contract: motionPreference is 'auto'. Full opening/closing phase
 * transitions are observable via the phase value passed to TaskbarHoverPreview.
 *
 * Dismiss contract:
 *   - Escape key: document-level keydown handler (installed by the hook)
 *   - Outside pointerdown: document-level handler (installed by the hook)
 *
 * data-testid selectors (runtime-proof test targets):
 *   - data-testid="hover-trigger"       — the trigger button
 *   - data-testid="hover-surface-root"  — the mounted surface root
 *   - data-testid="hover-outside"       — explicit outside-click target
 *   - data-testid="hover-taskbar"       — taskbar strip
 *   - data-testid="hover-backdrop"      — desktop backdrop container
 */
export function HoverPreviewHarness() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [surfaceStyle, setSurfaceStyle] = useState<React.CSSProperties>({});
  const [items, setItems] = useState([...HOVER_MULTI.items]);

  const { phase, isOpen, getTriggerProps, getSurfaceProps, onExitComplete, dismiss } =
    useTaskbarHoverPreview({
      openDelayMs: 400,
      closeDelayMs: 300,
      triggerRef,
    });

  const triggerProps = getTriggerProps();
  const surfaceProps = getSurfaceProps();

  // Recompute trigger-centered surface position when open state changes.
  // Also reset items to full dataset on each new open cycle so that
  // close-affordance filtering in the previous cycle does not carry over.
  useEffect(() => {
    if (isOpen) {
      setSurfaceStyle(computeHoverSurfaceStyle(triggerRef.current));
      setItems([...HOVER_MULTI.items]);
    }
  }, [isOpen]);

  return (
    <div style={BACKDROP_STYLE} data-testid="hover-backdrop">
      {/* Explicit outside-click target for runtime-proof tests */}
      <div
        data-testid="hover-outside"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          padding: "4px 8px",
          background: "rgba(255,255,255,0.15)",
          borderRadius: 4,
          color: "rgba(255,255,255,0.7)",
          fontSize: 11,
        }}
      >
        outside area
      </div>

      {isOpen && (
        <div
          style={surfaceStyle}
          {...surfaceProps}
          data-testid="hover-surface-root"
        >
          <TaskbarHoverPreview
            items={items}
            phase={phase}
            onExitComplete={onExitComplete}
            onSelectItem={(id) => console.log("select item", id)}
            onCloseItem={(id) => {
              setItems((prev) => prev.filter((i) => i.id !== id));
              dismiss();
            }}
          />
        </div>
      )}

      <div style={TASKBAR_STRIP_STYLE} data-testid="hover-taskbar">
        <TaskbarIconButtonWithRef
          ref={triggerRef}
          status="active"
          iconSrc={folder}
          aria-label="블로그 (hover to preview)"
          data-testid="hover-trigger"
          {...triggerProps}
        />
        <p style={HINT_TEXT_STYLE}>Hover the button above</p>
      </div>
    </div>
  );
}

/* ── ContextPanelHarness ─────────────────────────────────────── */

/**
 * ContextPanelHarness
 *
 * Wires useTaskbarContextPanel to TaskbarContextMenu.
 *
 * Anchor contract: surface x/y is computed from triggerRef bounding rect via
 * calculateTaskbarPlacement — trigger-centered, NOT pointer-origin.
 *
 * Dismiss contract:
 *   - Escape key: document-level keydown (hook-owned, focus-agnostic)
 *   - Outside pointerdown: document-level handler with composedPath() whitelist
 *   - Focus restore: triggerRef.current.focus() fires in finalize()
 *
 * Motion contract: motionPreference is 'auto'. opening → open → closing phase
 * progression is observable. onExitComplete fires after the exit animation ends.
 *
 * data-testid selectors (runtime-proof test targets):
 *   - data-testid="context-trigger"      — the trigger button
 *   - data-testid="context-surface-root" — the mounted surface root
 *   - data-testid="context-outside"      — explicit outside-click target
 *   - data-testid="context-taskbar"      — taskbar strip
 *   - data-testid="context-backdrop"     — desktop backdrop container
 */
export function ContextPanelHarness() {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const contextPanel = useTaskbarContextPanel({
    triggerRef,
    panelWidth: 300,
    panelHeight: 280,
  });

  const handleRightClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    contextPanel.open(e);
  };

  return (
    <div style={BACKDROP_STYLE} data-testid="context-backdrop">
      {/* Explicit outside-click target for runtime-proof tests */}
      <div
        data-testid="context-outside"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          padding: "4px 8px",
          background: "rgba(255,255,255,0.15)",
          borderRadius: 4,
          color: "rgba(255,255,255,0.7)",
          fontSize: 11,
        }}
      >
        outside area
      </div>

      {contextPanel.isOpen && (
        <div
          data-testid="context-surface-root"
          style={{
            ...CONTEXT_SURFACE_STYLE_BASE,
            left: contextPanel.placement.x,
            top: contextPanel.placement.y,
          }}
        >
          <TaskbarContextMenu
            appRows={[...CONTEXT_PINNED.appRows]}
            taskbarPinState={CONTEXT_PINNED.taskbarPinState}
            appIdentifier={CONTEXT_PINNED.appIdentifier}
            phase={contextPanel.phase}
            onExitComplete={contextPanel.onExitComplete}
            surfaceProps={contextPanel.surfaceProps}
            onSelectAppRow={(id) => console.log("select app row", id)}
            onSelectAppIdentifier={(id) => console.log("select app identifier", id)}
            onPinTaskbar={() => console.log("pin taskbar")}
            onCloseAll={() => {
              console.log("close all");
              contextPanel.close();
            }}
          />
        </div>
      )}

      <div style={TASKBAR_STRIP_STYLE} data-testid="context-taskbar">
        <TaskbarIconButtonWithRef
          ref={triggerRef}
          status="active"
          iconSrc={folder}
          aria-label="블로그 (right-click for context menu)"
          data-testid="context-trigger"
          onContextMenu={handleRightClick}
        />
        <p style={HINT_TEXT_STYLE}>
          Right-click for context menu · Esc to close · outside click closes
        </p>
      </div>
    </div>
  );
}

/* ── MutualExclusionHarness ──────────────────────────────────── */

/**
 * MutualExclusionHarness
 *
 * Consumer-owned winner rule: hover.dismiss() + context.close() choreography.
 *
 * Winner rules (host-owned, hook-agnostic):
 *   - Context open → hover dismissed via hover.dismiss(). The pointer-reset gate
 *     is activated; hover cannot reopen until a fresh leave → enter cycle.
 *   - Hover winner: if hover opens while context is open, context.close() is called
 *     via useEffect (prevHoverIsOpenRef tracks false→true edge only).
 *   - Resting pointer with no interaction → no-op (neither surface opens).
 *
 * Anchor contract:
 *   - Hover surface: trigger-centered via triggerRef bounding rect (motionPreference: 'auto').
 *   - Context surface: trigger-centered via calculateTaskbarPlacement (motionPreference: 'auto').
 *
 * Motion contract: motionPreference is 'auto' for both surfaces. Full phase
 * lifecycle is observable for both hover and context surfaces.
 *
 * data-testid selectors (runtime-proof test targets):
 *   - data-testid="mutual-trigger"            — the trigger button
 *   - data-testid="mutual-hover-surface-root" — hover surface root
 *   - data-testid="mutual-context-surface-root" — context surface root
 *   - data-testid="mutual-outside"            — explicit outside-click target
 *   - data-testid="mutual-taskbar"            — taskbar strip
 *   - data-testid="mutual-backdrop"           — desktop backdrop container
 */
export function MutualExclusionHarness() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [hoverSurfaceStyle, setHoverSurfaceStyle] = useState<React.CSSProperties>({});
  const [hoverItems, setHoverItems] = useState([...HOVER_MULTI.items]);

  const hoverPreview = useTaskbarHoverPreview({
    openDelayMs: 400,
    closeDelayMs: 300,
    triggerRef,
  });

  const contextPanel = useTaskbarContextPanel({
    triggerRef,
    panelWidth: 300,
    panelHeight: 280,
  });

  const hoverTriggerProps = hoverPreview.getTriggerProps();
  const hoverSurfaceProps = hoverPreview.getSurfaceProps();

  // prevHoverIsOpenRef로 이전 isOpen 값 추적
  const prevHoverIsOpenRef = useRef(false);
  const contextPanelRef = useRef(contextPanel);
  contextPanelRef.current = contextPanel;

  /* ── Winner rule: hover open → close context ────────────────── */
  // Hover winner: hover가 false→true로 열릴 때만 context를 닫는다.
  // dismiss() 이후 context가 열려도 이 effect는 실행되지 않는다.
  useEffect(() => {
    const justOpened = hoverPreview.isOpen && !prevHoverIsOpenRef.current;
    prevHoverIsOpenRef.current = hoverPreview.isOpen;
    if (justOpened && contextPanelRef.current.isOpen) {
      contextPanelRef.current.close();
    }
  }, [hoverPreview.isOpen]);

  // Recompute trigger-centered surface position when hover opens.
  // Also reset hoverItems to full dataset on each new open cycle so that
  // close-affordance filtering in the previous cycle does not carry over.
  useEffect(() => {
    if (hoverPreview.isOpen) {
      setHoverSurfaceStyle(computeHoverSurfaceStyle(triggerRef.current));
      setHoverItems([...HOVER_MULTI.items]);
    }
  }, [hoverPreview.isOpen]);

  /* ── Winner rule: context open → dismiss hover ──────────────── */
  const handleRightClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Context wins: dismiss hover preview (sets pointer-reset gate so hover
    // cannot reopen until the pointer performs a fresh leave → enter cycle).
    hoverPreview.dismiss();
    contextPanel.open(e);
  };

  return (
    <div style={BACKDROP_STYLE} data-testid="mutual-backdrop">
      {/* Explicit outside-click target for runtime-proof tests */}
      <div
        data-testid="mutual-outside"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          padding: "4px 8px",
          background: "rgba(255,255,255,0.15)",
          borderRadius: 4,
          color: "rgba(255,255,255,0.7)",
          fontSize: 11,
        }}
      >
        outside area
      </div>

      {/* Hover preview — only when hover is open and context is closed */}
      {hoverPreview.isOpen && !contextPanel.isOpen && (
        <div
          style={hoverSurfaceStyle}
          {...hoverSurfaceProps}
          data-testid="mutual-hover-surface-root"
        >
          <TaskbarHoverPreview
            items={hoverItems}
            phase={hoverPreview.phase}
            onExitComplete={hoverPreview.onExitComplete}
            onSelectItem={(id) => console.log("hover select item", id)}
            onCloseItem={(id) => {
              setHoverItems((prev) => prev.filter((i) => i.id !== id));
              hoverPreview.dismiss();
            }}
          />
        </div>
      )}

      {/* Context menu — positioned at trigger-centered calculated placement */}
      {contextPanel.isOpen && (
        <div
          data-testid="mutual-context-surface-root"
          style={{
            ...CONTEXT_SURFACE_STYLE_BASE,
            left: contextPanel.placement.x,
            top: contextPanel.placement.y,
          }}
        >
          <TaskbarContextMenu
            appRows={[...CONTEXT_PINNED.appRows]}
            taskbarPinState={CONTEXT_PINNED.taskbarPinState}
            appIdentifier={CONTEXT_PINNED.appIdentifier}
            phase={contextPanel.phase}
            onExitComplete={contextPanel.onExitComplete}
            surfaceProps={contextPanel.surfaceProps}
            onSelectAppRow={(id) => console.log("select app row", id)}
            onSelectAppIdentifier={(id) => console.log("select app identifier", id)}
            onPinTaskbar={() => console.log("pin taskbar")}
            onCloseAll={() => {
              console.log("close all");
              contextPanel.close();
            }}
          />
        </div>
      )}

      <div style={TASKBAR_STRIP_STYLE} data-testid="mutual-taskbar">
        <TaskbarIconButtonWithRef
          ref={triggerRef}
          status="active"
          iconSrc={folder}
          aria-label="블로그 (hover to preview / right-click for context menu)"
          data-testid="mutual-trigger"
          {...hoverTriggerProps}
          onContextMenu={handleRightClick}
        />
        <p style={HINT_TEXT_STYLE}>
          Hover (hover wins, context closes) · Right-click (context wins, hover locked) · Esc to close
        </p>
      </div>
    </div>
  );
}
