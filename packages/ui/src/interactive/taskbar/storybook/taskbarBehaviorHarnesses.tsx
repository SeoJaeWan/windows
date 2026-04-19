/**
 * taskbarBehaviorHarnesses
 *
 * Shared harness components for interactive/taskbar behavior stories.
 * Owns: taskbar strip layout, trigger button ref, taskbar root ref, backdrop,
 * surface root, outside-click target, and consumer-owned mutual exclusion logic.
 *
 * Browser acceptance surface — canonical story recipients:
 *   - Interactive/Taskbar/HoverPreview     > HoverLifecycle
 *   - Interactive/Taskbar/ContextPanel     > PointerOriginAndEscapeClose
 *   - Interactive/Taskbar/MutualExclusion  > ConsumerOwnedWinnerRule
 *
 * Stable selector vocabulary (data-testid):
 *   Each harness owns a stable testid namespace. Later materialization and
 *   browser gate specs must use these exact testids — do not add story-local
 *   hidden shortcuts or redefine these selectors in individual stories.
 *
 *   HoverPreviewHarness:
 *     hover-trigger        — trigger button (pointerenter/leave target)
 *     hover-surface-root   — mounted surface root (present only while isOpen)
 *     hover-outside        — explicit outside-click / outside-pointerdown target
 *     hover-taskbar        — taskbar strip (whitelisted — does NOT close surface)
 *     hover-backdrop       — desktop backdrop container
 *
 *   ContextPanelHarness:
 *     context-trigger        — trigger button (right-click / contextmenu target)
 *     context-surface-root   — mounted surface root (present only while isOpen)
 *     context-outside        — explicit outside-click / outside-pointerdown target
 *     context-taskbar        — taskbar strip (whitelisted — does NOT close surface)
 *     context-backdrop       — desktop backdrop container
 *
 *   MutualExclusionHarness:
 *     mutual-trigger              — shared trigger button (hover + context combined)
 *     mutual-hover-surface-root   — hover surface root (present only when isOpen && !context.isOpen)
 *     mutual-context-surface-root — context surface root (present only when isOpen && !hover.isOpen)
 *     mutual-outside              — explicit outside-click / outside-pointerdown target
 *     mutual-taskbar              — taskbar strip
 *     mutual-backdrop             — desktop backdrop container
 *
 * Browser-only proof surface boundary:
 *   The following can only be verified in a real browser (not jsdom, not compare):
 *   - measured-open delay (surface absent before openDelayMs elapses)
 *   - animationend boundary (opening → open, closing → finalize)
 *   - focus restore (context only — triggerRef.current.focus() after finalize)
 *   - serial handoff timing (winner absent during loser closing animation)
 *   - mutual exclusion invariant (both surfaces never in DOM simultaneously)
 *   Compare stories prove only visual baseline of the rested open state.
 *   @windows/web route owns its own navigation E2E scope.
 *   If later materialization cannot target these Storybook stories using the
 *   existing runner, it must leave an explicit setup blocker — do NOT fall back
 *   to compare stories or the web route as acceptance substitutes.
 *
 * Anchor contract (trigger-centered, measured):
 *   Hover preview and context panel placement is derived from the trigger element
 *   bounding rect and the taskbar root rect via useTaskbarSurfaceController inside
 *   each hook. The host provides explicit triggerRef and taskbarRootRef so the
 *   hooks can measure real DOMRects — no approximate width/height geometry.
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
import { useCallback, useEffect, useRef, useState } from "react";

import TaskbarHoverPreview from "../../../components/panels/taskbarHoverPreview/index";
import TaskbarContextMenu from "../../../components/panels/taskbarContextMenu/index";
import TaskbarIconButton from "../../../components/taskbar/taskbarIconButton/index";
import { folder } from "../../../components/panels/windows/internal/contentIcon/index";
import { useTaskbarHoverPreview } from "../useTaskbarHoverPreview";
import { useTaskbarContextPanel } from "../useTaskbarContextPanel";
import { useSerialHandoffQueue } from "../internal/useSerialHandoffQueue";
import { HOVER_MULTI, CONTEXT_PINNED } from "./taskbarBehaviorFixtures";
import { CONTEXT_MENU_HEIGHT } from "./taskbarContextPanelCompareHarness";

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

const SURFACE_STYLE_BASE: React.CSSProperties = {
  position: "fixed",
  zIndex: 50,
};

/* ── HoverPreviewHarness ─────────────────────────────────────── */

/**
 * HoverPreviewHarness
 *
 * Wires useTaskbarHoverPreview to TaskbarHoverPreview.
 *
 * Anchor contract: surface placement is derived from measured DOMRects via
 * useTaskbarSurfaceController (triggerRef + taskbarRootRef). No ad-hoc
 * width/height geometry or ancestor lookup.
 *
 * Motion contract: motionPreference is 'auto'. Full opening/closing phase
 * transitions are observable via the phase value passed to TaskbarHoverPreview.
 *
 * Dismiss contract:
 *   - Escape key: document-level keydown handler (installed by the controller)
 *   - Outside pointerdown: document-level handler (installed by the controller)
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
  const taskbarRootRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState([...HOVER_MULTI.items]);

  const { phase, isOpen, placement, getTriggerProps, getSurfaceProps, onEnterComplete, onExitComplete, dismiss } =
    useTaskbarHoverPreview({
      openDelayMs: 400,
      closeDelayMs: 300,
      triggerRef,
      taskbarRootRef,
    });

  const triggerProps = getTriggerProps();
  const surfaceProps = getSurfaceProps();

  // Reset items to full dataset on each new open cycle so that
  // close-affordance filtering in the previous cycle does not carry over.
  useEffect(() => {
    if (isOpen) {
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
          style={{
            ...SURFACE_STYLE_BASE,
            left: placement.x,
            top: placement.y,
          }}
          {...surfaceProps}
          data-testid="hover-surface-root"
        >
          <TaskbarHoverPreview
            items={items}
            phase={phase}
            onEnterComplete={onEnterComplete}
            onExitComplete={onExitComplete}
            onSelectItem={(id) => console.log("select item", id)}
            onCloseItem={(id) => {
              setItems((prev) => prev.filter((i) => i.id !== id));
              dismiss();
            }}
          />
        </div>
      )}

      <div style={TASKBAR_STRIP_STYLE} data-testid="hover-taskbar" ref={taskbarRootRef}>
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
 * Anchor contract: surface x/y is computed from measured DOMRects via
 * useTaskbarSurfaceController (triggerRef + taskbarRootRef) — trigger-centered,
 * NOT pointer-origin, NOT ancestor lookup.
 *
 * Dismiss contract:
 *   - Escape key: document-level keydown (controller-owned, focus-agnostic)
 *   - Outside pointerdown: document-level handler with composedPath() whitelist
 *   - Focus restore: triggerRef.current.focus() fires in onFinalize()
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
  const taskbarRootRef = useRef<HTMLDivElement>(null);

  const contextPanel = useTaskbarContextPanel({
    triggerRef,
    taskbarRootRef,
    panelWidth: 300,
    panelHeight: CONTEXT_MENU_HEIGHT,
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
            ...SURFACE_STYLE_BASE,
            left: contextPanel.placement.x,
            top: contextPanel.placement.y,
          }}
        >
          <TaskbarContextMenu
            appRows={[...CONTEXT_PINNED.appRows]}
            taskbarPinState={CONTEXT_PINNED.taskbarPinState}
            appIdentifier={CONTEXT_PINNED.appIdentifier}
            phase={contextPanel.phase}
            onEnterComplete={contextPanel.onEnterComplete}
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

      <div style={TASKBAR_STRIP_STYLE} data-testid="context-taskbar" ref={taskbarRootRef}>
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
 * Consumer-owned serial handoff queue.
 *
 * Serial handoff deviation from live immediate handoff:
 *   Live (closeGroupPanels-style): loser.close() and winner.open() happen in
 *   the same call stack — both surfaces transition simultaneously.
 *
 *   Serial handoff (this harness): winner.open() is deferred until the loser's
 *   onExitComplete fires and notifyLoserFinalized() is called. The winner does
 *   NOT mount until the loser has fully unmounted.
 *
 * Winner rules (host-owned, hook-agnostic):
 *
 *   Context wins (right-click):
 *     1. hoverPreview.dismiss() — starts hover closing and activates pointer-reset gate.
 *     2. requestWinner(contextHoverQueue, openContext) — if hover is still in its
 *        closing animation, queues context open. If already finalized, opens immediately.
 *     3. Hover's onExitComplete calls notifyLoserFinalized on contextHoverQueue,
 *        which releases the queued context open.
 *
 *   Hover wins (hover opens while context is open):
 *     1. contextPanel.close() — starts context closing.
 *     2. requestWinner(hoverContextQueue, () => { re-run hover open }) — queued.
 *     3. Context's onExitComplete calls notifyLoserFinalized on hoverContextQueue.
 *     NOTE: hover winner is tracked via useEffect (false→true isOpen edge). Since
 *     hover opens via timer (pointer intent), the queue bridges hover open timing
 *     with context finalize timing.
 *
 *   Latest intent wins:
 *     A new requestWinner call replaces any previously queued winner.
 *
 *   Dismiss-cancels-queued-winner:
 *     If Escape or outside click dismisses the queued winner's hook before the
 *     loser finalizes, cancelWinner() is called and the queued open is dropped.
 *
 *   Resting pointer with no interaction → no-op (neither surface opens).
 *
 * Anchor contract:
 *   Both surfaces: trigger-centered via measured DOMRects (triggerRef + taskbarRootRef).
 *   Explicit taskbarRootRef injection; no ancestor lookup.
 *
 * Motion contract: motionPreference is 'auto' for both surfaces. Full phase
 * lifecycle is observable for both hover and context surfaces.
 *
 * data-testid selectors (runtime-proof test targets):
 *   - data-testid="mutual-trigger"              — the trigger button
 *   - data-testid="mutual-hover-surface-root"   — hover surface root
 *   - data-testid="mutual-context-surface-root" — context surface root
 *   - data-testid="mutual-outside"              — explicit outside-click target
 *   - data-testid="mutual-taskbar"              — taskbar strip
 *   - data-testid="mutual-backdrop"             — desktop backdrop container
 */
export function MutualExclusionHarness() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const taskbarRootRef = useRef<HTMLDivElement>(null);
  const [hoverItems, setHoverItems] = useState([...HOVER_MULTI.items]);

  const hoverPreview = useTaskbarHoverPreview({
    openDelayMs: 400,
    closeDelayMs: 300,
    triggerRef,
    taskbarRootRef,
  });

  const contextPanel = useTaskbarContextPanel({
    triggerRef,
    taskbarRootRef,
    panelWidth: 300,
    panelHeight: CONTEXT_MENU_HEIGHT,
  });

  const hoverTriggerProps = hoverPreview.getTriggerProps();
  const hoverSurfaceProps = hoverPreview.getSurfaceProps();

  // Keep stable refs for both hooks so queue callbacks close over current values
  const hoverPreviewRef = useRef(hoverPreview);
  hoverPreviewRef.current = hoverPreview;
  const contextPanelRef = useRef(contextPanel);
  contextPanelRef.current = contextPanel;

  /* ── Serial handoff queue: context wins path ─────────────────
   *
   * Used when context wants to open and hover is the loser.
   * isLoserClosing() checks if hover is in its closing animation.
   * notifyLoserFinalized() is called from hover's onExitComplete wrapper.
   * cancelWinner() is called if context is dismissed before hover finalizes.
   */
  const contextHoverQueue = useSerialHandoffQueue({
    isLoserClosing: useCallback(
      () => hoverPreviewRef.current.isOpen && hoverPreviewRef.current.phase === "closing",
      []
    ),
  });

  /* ── Serial handoff queue: hover wins path ───────────────────
   *
   * Used when hover wants to open and context is the loser.
   * isLoserClosing() checks if context is in its closing animation.
   * notifyLoserFinalized() is called from context's onExitComplete wrapper.
   */
  const hoverContextQueue = useSerialHandoffQueue({
    isLoserClosing: useCallback(
      () => contextPanelRef.current.isOpen && contextPanelRef.current.phase === "closing",
      []
    ),
  });

  /* ── Wrapped onExitComplete — notifies queues after finalize ─
   *
   * Serial handoff contract: the loser's onExitComplete is the signal that
   * the loser has fully unmounted. We wrap it here so notifyLoserFinalized
   * is always called at the right moment — after the hook finalizes.
   */
  const hoverOnExitComplete = useCallback(() => {
    hoverPreviewRef.current.onExitComplete();
    // Notify the context-wins queue: hover has finalized, release context open
    contextHoverQueue.notifyLoserFinalized();
  }, [contextHoverQueue]);

  const contextOnExitComplete = useCallback(() => {
    contextPanelRef.current.onExitComplete();
    // Notify the hover-wins queue: context has finalized, release hover reopen
    hoverContextQueue.notifyLoserFinalized();
  }, [hoverContextQueue]);

  /* ── Winner rule: hover open → serial close context ─────────
   *
   * Hover winner: hover goes false→true. We close context as the loser,
   * then via hoverContextQueue the winner (hover staying open) is confirmed
   * after context finalizes. Since hover is already open at this point,
   * the queue only needs to signal that context is the loser.
   *
   * Implementation note: hover is already open when this effect fires.
   * We just need to close context as the loser. No winner open needed —
   * hover is already open. The queue pattern here primarily guards against
   * immediate parallel handoff: context.close() starts the exit animation,
   * and the hover surface will only render once context.isOpen becomes false
   * (which happens after onExitComplete / finalize).
   */
  const prevHoverIsOpenRef = useRef(false);
  useEffect(() => {
    const justOpened = hoverPreview.isOpen && !prevHoverIsOpenRef.current;
    prevHoverIsOpenRef.current = hoverPreview.isOpen;
    if (justOpened && contextPanelRef.current.isOpen) {
      // Hover wins: close context as loser. The render gate
      // (hoverPreview.isOpen && !contextPanel.isOpen) prevents the hover
      // surface from mounting until context.isOpen becomes false after finalize.
      contextPanelRef.current.close();
    }
  }, [hoverPreview.isOpen]);

  // Reset hoverItems to full dataset on each new open cycle so that
  // close-affordance filtering in the previous cycle does not carry over.
  useEffect(() => {
    if (hoverPreview.isOpen) {
      setHoverItems([...HOVER_MULTI.items]);
    }
  }, [hoverPreview.isOpen]);

  /* ── Winner rule: context open → serial handoff from hover ──
   *
   * Context wins (right-click):
   *   1. hoverPreview.dismiss() — starts hover closing + pointer-reset gate.
   *   2. contextHoverQueue.requestWinner(() => contextPanel.open(e)) — queues
   *      context open. If hover is already finalized (reduced motion or very fast),
   *      opens immediately. Otherwise defers until hover's onExitComplete fires.
   *   3. If context is dismissed (Escape/outside) before hover finalizes,
   *      cancelWinner() clears the queued open.
   *
   * Winner placement: context.open() is called at actual open release time
   * (notifyLoserFinalized → queued callback), NOT at the time of right-click.
   * This means context placement is measured from actual DOMRects at winner
   * open time, not from a stale pre-measure snapshot.
   */
  const handleRightClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Step 1: dismiss hover (loser) — starts closing + pointer-reset gate
    hoverPreviewRef.current.dismiss();

    // Step 2: capture the mouse event for deferred use in openContext
    // (React SyntheticEvent cannot be used after the event handler returns,
    // but we only need clientX/clientY for placement — capture them now)
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Step 3: request winner via serial queue.
    // openContext is called either immediately (if hover already finalized)
    // or after notifyLoserFinalized fires (loser finalize → winner release).
    contextHoverQueue.requestWinner(() => {
      // Actual winner open: measurement happens at this moment, not at right-click time.
      contextPanelRef.current.open({
        clientX,
        clientY,
      } as React.MouseEvent);
    });
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

      {/* Hover preview — only when hover is open and context is closed.
          Serial handoff render gate: hover surface does not mount until
          context.isOpen is false (context has fully unmounted/finalized). */}
      {hoverPreview.isOpen && !contextPanel.isOpen && (
        <div
          style={{
            ...SURFACE_STYLE_BASE,
            left: hoverPreview.placement.x,
            top: hoverPreview.placement.y,
          }}
          {...hoverSurfaceProps}
          data-testid="mutual-hover-surface-root"
        >
          <TaskbarHoverPreview
            items={hoverItems}
            phase={hoverPreview.phase}
            onEnterComplete={hoverPreview.onEnterComplete}
            onExitComplete={hoverOnExitComplete}
            onSelectItem={(id) => console.log("hover select item", id)}
            onCloseItem={(id) => {
              setHoverItems((prev) => prev.filter((i) => i.id !== id));
              // dismiss() + cancel queued context winner (dismiss-cancels-queued-winner)
              contextHoverQueue.cancelWinner();
              hoverPreviewRef.current.dismiss();
            }}
          />
        </div>
      )}

      {/* Context menu — positioned at trigger-centered calculated placement.
          Serial handoff render gate: context surface does not mount until
          hoverPreview.isOpen is false (hover has fully unmounted/finalized). */}
      {contextPanel.isOpen && !hoverPreview.isOpen && (
        <div
          data-testid="mutual-context-surface-root"
          style={{
            ...SURFACE_STYLE_BASE,
            left: contextPanel.placement.x,
            top: contextPanel.placement.y,
          }}
        >
          <TaskbarContextMenu
            appRows={[...CONTEXT_PINNED.appRows]}
            taskbarPinState={CONTEXT_PINNED.taskbarPinState}
            appIdentifier={CONTEXT_PINNED.appIdentifier}
            phase={contextPanel.phase}
            onEnterComplete={contextPanel.onEnterComplete}
            onExitComplete={contextOnExitComplete}
            surfaceProps={contextPanel.surfaceProps}
            onSelectAppRow={(id) => console.log("select app row", id)}
            onSelectAppIdentifier={(id) => console.log("select app identifier", id)}
            onPinTaskbar={() => console.log("pin taskbar")}
            onCloseAll={() => {
              console.log("close all");
              // cancel any queued hover winner (dismiss-cancels-queued-winner)
              hoverContextQueue.cancelWinner();
              contextPanelRef.current.close();
            }}
          />
        </div>
      )}

      <div style={TASKBAR_STRIP_STYLE} data-testid="mutual-taskbar" ref={taskbarRootRef}>
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
          Hover (hover wins, context closes serially) · Right-click (context wins after hover finalizes) · Esc to close
        </p>
      </div>
    </div>
  );
}
