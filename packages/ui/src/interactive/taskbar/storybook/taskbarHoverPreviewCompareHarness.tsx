/**
 * taskbarHoverPreviewCompareHarness
 *
 * Static visual compare harness for hover preview capture.
 *
 * This file owns only frozen capture composition:
 * - one trigger icon
 * - one attached hover surface
 * - one stable canvas layout for visual diffing
 *
 * It does NOT own runtime geometry or motion truth.
 * The numeric placement constants below are capture-only values.
 */

import TaskbarHoverPreview from "../../../components/panels/taskbarHoverPreview/index";
import TaskbarIconButton from "../../../components/taskbar/taskbarIconButton/index";
import { folder } from "../../../components/panels/windows/internal/contentIcon/index";
import { HOVER_MULTI } from "../../../components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewFixtures";

/* ── Layout constants ─────────────────────────────────────────── */

/** Fixed canvas width for capture. */
const CANVAS_WIDTH = 720;

/** Fixed canvas height for capture. */
const CANVAS_HEIGHT = 340;

/** Taskbar strip height. */
const TASKBAR_HEIGHT = 48;

/** Trigger icon size (matches TaskbarIconButton h-10 w-10). */
const TRIGGER_SIZE = 40;

/**
 * Fixed compare width for the frozen capture.
 */
const ITEM_COUNT = HOVER_MULTI.items.length;
const SURFACE_WIDTH = ITEM_COUNT * 200;

/**
 * Trigger center X within the canvas (icon is centered in taskbar strip).
 * The strip uses `justifyContent: center` so the icon center = canvas center.
 */
const TRIGGER_CENTER_X = CANVAS_WIDTH / 2;

/** Surface left: center trigger → surface left edge. */
const SURFACE_LEFT = TRIGGER_CENTER_X - SURFACE_WIDTH / 2;

/** Gap between surface bottom and taskbar top. */
const SURFACE_GAP = 10;

/** Surface bottom = taskbar top - gap. */
const SURFACE_BOTTOM = TASKBAR_HEIGHT + SURFACE_GAP;

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
  bottom: SURFACE_BOTTOM,
  width: SURFACE_WIDTH,
};

/* ── Component ───────────────────────────────────────────────── */

/**
 * TaskbarHoverPreviewCompareHarness
 *
 * Used only by the compare story to keep a stable attached composition.
 */
export function TaskbarHoverPreviewCompareHarness() {
  return (
    <div style={CANVAS_STYLE}>
      {/* Hover surface — attached above trigger center, width-rule derived left */}
      <div style={SURFACE_WRAPPER_STYLE} data-testid="compare-surface-wrapper">
        <TaskbarHoverPreview
          items={[...HOVER_MULTI.items]}
          phase="open"
          onExitComplete={() => {}}
          onSelectItem={() => {}}
          onCloseItem={() => {}}
          surfaceProps={{ style: { width: SURFACE_WIDTH } }}
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
