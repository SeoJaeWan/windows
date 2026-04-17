/**
 * taskbarHoverPreviewCompareHarness
 *
 * Attached-host compare harness for hover preview visual capture.
 *
 * Renders trigger icon + hover surface together in a single host composition.
 * The surface is positioned above the trigger center using width-derived geometry —
 * NOT a fixed left:50% offset.
 *
 * Width rule (mirrors TaskbarHoverPreview surface width formula):
 *   surfaceWidth = items.length * 200   (matches min(80vw, N*200) in a fixed 720px canvas)
 *   triggerCenterX = taskbar center = canvas width / 2 = 360px (icon centered in strip)
 *   left = triggerCenterX - surfaceWidth / 2
 *
 * This is the same width-rule that the live behavior harness uses via
 * computeHoverSurfaceStyle (getBoundingClientRect-based). In the static
 * compare context there is no live DOM measurement, so we derive left
 * directly from the surface width formula.
 *
 * NOT a public package export — storybook compare support file only.
 *
 * Inline style: bounded exception — host-composition overlay absolute placement
 * and fixed capture canvas geometry (token-relative or width-rule derived).
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
 * Derived surface width using the same formula as TaskbarHoverPreview:
 *   min(80vw, items.length * 200)
 * In this 720px canvas: min(576, 600) = 576.
 * We use the full formula result so the host left is consistent with runtime.
 */
const ITEM_COUNT = HOVER_MULTI.items.length;
const SURFACE_WIDTH = Math.min(CANVAS_WIDTH * 0.8, ITEM_COUNT * 200);

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
 * Static snapshot harness for visual diff capture.
 * Renders the trigger icon centered in a taskbar strip with the hover surface
 * open (phase="open") above it.
 *
 * Surface left is derived from SURFACE_WIDTH and TRIGGER_CENTER_X —
 * no left:50% taskbar-center correction.
 *
 * This harness is used exclusively by the CompareAttachedMulti story.
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
