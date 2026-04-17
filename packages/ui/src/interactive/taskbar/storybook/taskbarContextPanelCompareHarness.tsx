/**
 * taskbarContextPanelCompareHarness
 *
 * Attached-host compare harness for context panel visual capture.
 *
 * Renders trigger icon + context surface together in a single host composition.
 * The surface is positioned above the trigger center using the same vocabulary
 * as the live behavior harness (calculateTaskbarPlacement) — NOT a fixed
 * approximate panelHeight.
 *
 * Vertical anchor rule (same as ContextPanelHarness in taskbarBehaviorHarnesses):
 *   panelHeight = CONTEXT_MENU_HEIGHT (row-derived constant, matches real render)
 *   triggerTop  = CANVAS_HEIGHT - TASKBAR_HEIGHT (trigger top edge in canvas coords)
 *   y = triggerTop - ATTACHED_GAP - panelHeight
 *   bottom = CANVAS_HEIGHT - y  (absolute bottom positioning in canvas)
 *
 * Width rule:
 *   panelWidth = 300 (TaskbarContextMenu w-[300px])
 *   triggerCenterX = CANVAS_WIDTH / 2
 *   left = triggerCenterX - panelWidth / 2
 *
 * NOT a public package export — storybook compare support file only.
 *
 * Inline style: bounded exception — host-composition overlay absolute placement
 * and fixed capture canvas geometry (token-relative or row-derived geometry).
 */

import TaskbarContextMenu from "../../../components/panels/taskbarContextMenu/index";
import TaskbarIconButton from "../../../components/taskbar/taskbarIconButton/index";
import { folder } from "../../../components/panels/windows/internal/contentIcon/index";
import { CONTEXT_PINNED } from "../../../components/panels/taskbarContextMenu/storybook/taskbarContextMenuFixtures";

/* ── Row-derived height constants ─────────────────────────────── */

/**
 * CONTEXT_MENU_HEIGHT
 *
 * Row-derived estimation of the rendered height of TaskbarContextMenu
 * with 3 appRows + appIdentifier + pin + close-all rows.
 *
 * Row breakdown (text-xs, tailwind spacing):
 *   - py-2 top/bottom container padding:   16px
 *   - section header (pb-1 + text-xs):      18px
 *   - 3 appRows × py-1.5:         3 × 28px = 84px
 *   - divider (my-1 border-t):              10px
 *   - appIdentifier row (py-1.5):           28px
 *   - pin action row (py-1.5):              28px
 *   - close-all row (py-1.5):              28px
 *   Total:                                 212px
 *
 * This same value is used in both the compare harness and the
 * behavior ContextPanelHarness so that compare and runtime
 * derive y from the same row-derived rule — not an arbitrary guess.
 */
export const CONTEXT_MENU_HEIGHT = 212;

/** Gap between panel bottom and trigger top (matches calculateTaskbarPlacement ATTACHED_GAP). */
const ATTACHED_GAP = 10;

/* ── Layout constants ─────────────────────────────────────────── */

/** Fixed canvas width for capture. */
const CANVAS_WIDTH = 480;

/** Fixed canvas height for capture. */
const CANVAS_HEIGHT = 340;

/** Taskbar strip height. */
const TASKBAR_HEIGHT = 48;

/** TaskbarContextMenu fixed width (w-[300px]). */
const PANEL_WIDTH = 300;

/** Trigger icon size (matches TaskbarIconButton h-10 w-10). */
const TRIGGER_SIZE = 40;

/**
 * Trigger center X within the canvas (icon is centered in taskbar strip).
 * The strip uses `justifyContent: center` so the icon center = canvas center.
 */
const TRIGGER_CENTER_X = CANVAS_WIDTH / 2;

/** Surface left: center trigger → surface left edge. */
const SURFACE_LEFT = TRIGGER_CENTER_X - PANEL_WIDTH / 2;

/**
 * Trigger top edge in canvas coordinate space.
 * The trigger icon is vertically centered in the taskbar strip.
 * triggerTop = CANVAS_HEIGHT - TASKBAR_HEIGHT + (TASKBAR_HEIGHT - TRIGGER_SIZE) / 2
 *            = CANVAS_HEIGHT - TASKBAR_HEIGHT + 4
 */
const TRIGGER_TOP = CANVAS_HEIGHT - TASKBAR_HEIGHT + (TASKBAR_HEIGHT - TRIGGER_SIZE) / 2;

/**
 * Surface bottom edge in canvas coordinate space.
 * surface bottom = triggerTop - ATTACHED_GAP
 */
const SURFACE_BOTTOM_EDGE = TRIGGER_TOP - ATTACHED_GAP;

/**
 * Surface top edge in canvas coordinate space.
 * surface top = surface bottom - panelHeight
 */
const SURFACE_TOP = SURFACE_BOTTOM_EDGE - CONTEXT_MENU_HEIGHT;

/* ── Styles ───────────────────────────────────────────────────── */

const CANVAS_STYLE: React.CSSProperties = {
  position: "relative",
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  background: "linear-gradient(135deg, #1e90ff 0%, #87ceeb 50%, #4fc3f7 100%)",
  borderRadius: 12,
  overflow: "hidden",
};

const TASKBAR_STRIP_STYLE: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: TASKBAR_HEIGHT,
  background: "rgba(0,0,0,0.7)",
  borderRadius: "0 0 12px 12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const SURFACE_WRAPPER_STYLE: React.CSSProperties = {
  position: "absolute",
  left: SURFACE_LEFT,
  top: SURFACE_TOP,
  width: PANEL_WIDTH,
};

/* ── Component ───────────────────────────────────────────────── */

/**
 * TaskbarContextPanelCompareHarness
 *
 * Static snapshot harness for visual diff capture.
 * Renders the trigger icon centered in a taskbar strip with the context menu
 * open (phase="open") above it.
 *
 * Vertical anchor is derived from CONTEXT_MENU_HEIGHT (row-derived rule) +
 * ATTACHED_GAP — the same vocabulary as ContextPanelHarness which uses
 * calculateTaskbarPlacement with the same CONTEXT_MENU_HEIGHT constant.
 *
 * This harness is used exclusively by the CompareAttachedPinned story.
 */
export function TaskbarContextPanelCompareHarness() {
  return (
    <div style={CANVAS_STYLE} data-testid="compare-canvas">
      {/* Context surface — attached above trigger center, row-derived top */}
      <div style={SURFACE_WRAPPER_STYLE} data-testid="compare-surface-wrapper">
        <TaskbarContextMenu
          appRows={[...CONTEXT_PINNED.appRows]}
          taskbarPinState={CONTEXT_PINNED.taskbarPinState}
          appIdentifier={CONTEXT_PINNED.appIdentifier}
          phase="open"
          onExitComplete={() => {}}
          onSelectAppRow={() => {}}
          onSelectAppIdentifier={() => {}}
          onPinTaskbar={() => {}}
          onCloseAll={() => {}}
        />
      </div>

      {/* Taskbar strip with centered trigger icon */}
      <div style={TASKBAR_STRIP_STYLE}>
        <TaskbarIconButton
          status="active"
          iconSrc={folder}
          aria-label="블로그"
          style={{ width: TRIGGER_SIZE, height: TRIGGER_SIZE }}
          data-testid="compare-trigger"
        />
      </div>
    </div>
  );
}
