/**
 * taskbarBehaviorHarnesses
 *
 * Shared harness components for interactive/taskbar behavior stories.
 * Owns: taskbar strip layout, trigger button ref, backdrop, and
 * consumer-owned mutual exclusion logic (dismiss/close choreography).
 *
 * NOT a public package export — storybook support file only.
 *
 * Inline style: bounded exception — host-composition overlay absolute
 * placement and decorative desktop backdrop gradient.
 */

import { useEffect, useRef } from "react";

import TaskbarHoverPreview from "../../../components/panels/taskbarHoverPreview/index";
import TaskbarContextMenu from "../../../components/panels/taskbarContextMenu/index";
import { useTaskbarHoverPreview } from "../useTaskbarHoverPreview";
import { useTaskbarContextPanel } from "../useTaskbarContextPanel";
import { HOVER_MULTI, CONTEXT_PINNED } from "./taskbarBehaviorFixtures";

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
  paddingBottom: 60,
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

const TRIGGER_BUTTON_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: 6,
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  fontSize: 12,
  border: "none",
  cursor: "default",
};

const HINT_TEXT_STYLE: React.CSSProperties = {
  color: "rgba(255,255,255,0.6)",
  fontSize: 11,
  margin: 0,
};

const SURFACE_WRAPPER_STYLE: React.CSSProperties = {
  position: "absolute",
  bottom: 60,
  left: "50%",
  transform: "translateX(-50%)",
};

const CONTEXT_SURFACE_STYLE_BASE: React.CSSProperties = {
  position: "fixed",
  zIndex: 50,
};

/* ── HoverPreviewHarness ─────────────────────────────────────── */

/**
 * HoverPreviewHarness
 *
 * Wires useTaskbarHoverPreview to TaskbarHoverPreview.
 * Demonstrates: hover intent open → delay → open, pointer leave → delay → close.
 */
export function HoverPreviewHarness() {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { phase, isOpen, getTriggerProps, getSurfaceProps, onExitComplete } =
    useTaskbarHoverPreview({
      openDelayMs: 400,
      closeDelayMs: 300,
      motionPreference: 'reduced',
    });

  const triggerProps = getTriggerProps();
  const surfaceProps = getSurfaceProps();

  return (
    <div style={BACKDROP_STYLE}>
      {isOpen && (
        <div style={SURFACE_WRAPPER_STYLE} {...surfaceProps}>
          <TaskbarHoverPreview
            items={[...HOVER_MULTI.items]}
            phase={phase}
            onExitComplete={onExitComplete}
            onSelectItem={(id) => console.log("select item", id)}
            onCloseItem={(id) => console.log("close item", id)}
          />
        </div>
      )}

      <div style={TASKBAR_STRIP_STYLE}>
        <button
          ref={triggerRef}
          type="button"
          style={TRIGGER_BUTTON_STYLE}
          aria-label="블로그 (hover to preview)"
          {...triggerProps}
        >
          📄
        </button>
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
 * Demonstrates: right-click opens at pointer origin, Escape closes and
 * restores focus to trigger.
 */
export function ContextPanelHarness() {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const contextPanel = useTaskbarContextPanel({
    triggerRef,
    panelWidth: 300,
    panelHeight: 280,
    motionPreference: 'reduced',
  });

  const handleRightClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    contextPanel.open(e);
  };

  return (
    <div style={BACKDROP_STYLE}>
      {contextPanel.isOpen && (
        <div
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

      <div style={TASKBAR_STRIP_STYLE}>
        <button
          ref={triggerRef}
          type="button"
          style={TRIGGER_BUTTON_STYLE}
          aria-label="블로그 (right-click for context menu)"
          onContextMenu={handleRightClick}
        >
          📄
        </button>
        <p style={HINT_TEXT_STYLE}>
          Right-click for context menu · Esc to close
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
 * Rules:
 * - Context open → hover dismissed (hover requires fresh leave/enter to reopen)
 * - Hover winner: if hover is open and pointer leaves without right-click,
 *   context stays closed
 * - Resting pointer with no interaction → no-op (neither surface opens)
 *
 * All coordination is host-owned (this harness). Neither hook knows about
 * the other.
 */
export function MutualExclusionHarness() {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const hoverPreview = useTaskbarHoverPreview({
    openDelayMs: 400,
    closeDelayMs: 300,
    motionPreference: 'reduced',
  });

  const contextPanel = useTaskbarContextPanel({
    triggerRef,
    panelWidth: 300,
    panelHeight: 280,
    motionPreference: 'reduced',
  });

  const hoverTriggerProps = hoverPreview.getTriggerProps();
  const hoverSurfaceProps = hoverPreview.getSurfaceProps();

  // prevHoverIsOpenRef로 이전 isOpen 값 추적
  const prevHoverIsOpenRef = useRef(false)
  const contextPanelRef = useRef(contextPanel)
  contextPanelRef.current = contextPanel

  /* ── Winner rule: hover open → close context ────────────────── */
  // Hover winner: hover가 false→true로 열릴 때만 context를 닫는다.
  // dismiss() 이후 context가 열려도 이 effect는 실행되지 않는다.
  useEffect(() => {
    const justOpened = hoverPreview.isOpen && !prevHoverIsOpenRef.current
    prevHoverIsOpenRef.current = hoverPreview.isOpen
    if (justOpened && contextPanelRef.current.isOpen) {
      contextPanelRef.current.close()
    }
  }, [hoverPreview.isOpen])

  /* ── Winner rule: context open → dismiss hover ──────────────── */
  const handleRightClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Context wins: dismiss hover preview (sets pointer-reset gate so hover
    // cannot reopen until the pointer performs a fresh leave → enter cycle).
    hoverPreview.dismiss();
    contextPanel.open(e);
  };

  return (
    <div style={BACKDROP_STYLE}>
      {/* Hover preview — only when hover is open and context is closed */}
      {hoverPreview.isOpen && !contextPanel.isOpen && (
        <div style={SURFACE_WRAPPER_STYLE} {...hoverSurfaceProps}>
          <TaskbarHoverPreview
            items={[...HOVER_MULTI.items]}
            phase={hoverPreview.phase}
            onExitComplete={hoverPreview.onExitComplete}
            onSelectItem={(id) => console.log("hover select item", id)}
            onCloseItem={(id) => console.log("hover close item", id)}
          />
        </div>
      )}

      {/* Context menu — positioned at calculated placement */}
      {contextPanel.isOpen && (
        <div
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

      <div style={TASKBAR_STRIP_STYLE}>
        <button
          ref={triggerRef}
          type="button"
          style={TRIGGER_BUTTON_STYLE}
          aria-label="블로그 (hover to preview / right-click for context menu)"
          {...hoverTriggerProps}
          onContextMenu={handleRightClick}
        >
          📄
        </button>
        <p style={HINT_TEXT_STYLE}>
          Hover (hover wins, context closes) · Right-click (context wins, hover locked) · Esc to close
        </p>
      </div>
    </div>
  );
}
