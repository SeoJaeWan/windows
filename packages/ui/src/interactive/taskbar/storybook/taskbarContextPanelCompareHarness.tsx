/**
 * taskbarContextPanelCompareHarness
 *
 * Static visual compare harness for context panel capture.
 *
 * This file owns only frozen capture composition:
 * - one trigger icon
 * - one attached context surface
 * - one stable canvas layout for visual diffing
 *
 * It does NOT own runtime geometry or motion truth.
 * The numeric placement constants below are capture-only values.
 */

import TaskbarContextMenu from "../../../components/panels/taskbarContextMenu/index";
import TaskbarIconButton from "../../../components/taskbar/taskbarIconButton/index";
import { folder } from "../../../components/panels/windows/internal/contentIcon/index";
import { CONTEXT_PINNED } from "../../../components/panels/taskbarContextMenu/storybook/taskbarContextMenuFixtures";

/* ── Row-derived height constants ─────────────────────────────── */

/**
 * Fixed capture height for the visual baseline.
 */
export const CONTEXT_MENU_HEIGHT = 241;

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
 * Used only by the compare story to keep a stable attached composition.
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
          onEnterComplete={() => {}}
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
