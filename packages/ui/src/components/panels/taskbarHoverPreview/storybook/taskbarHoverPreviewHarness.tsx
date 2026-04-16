import { useRef } from "react";

import TaskbarHoverPreview from "../index";
import { useTaskbarHoverPreview } from "../../../../interactive/taskbar/useTaskbarHoverPreview";
import { HOVER_MULTI } from "./taskbarHoverPreviewFixtures";

/**
 * TaskbarHoverPreviewHarness
 *
 * Story-local interactive harness for TaskbarHoverPreview.
 * Wires useTaskbarHoverPreview to TaskbarHoverPreview so hover
 * open/close timing can be exercised inside Storybook without apps/web.
 *
 * Inline style: bounded exception — host-composition overlay absolute placement
 * and decorative desktop backdrop gradient.
 */
function TaskbarHoverPreviewHarness() {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { phase, isOpen, getTriggerProps, getSurfaceProps, onExitComplete } =
    useTaskbarHoverPreview({
      openDelayMs: 400,
      closeDelayMs: 300,
    });

  const triggerProps = getTriggerProps();
  const surfaceProps = getSurfaceProps();

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        width: 720,
        height: 400,
        background: "linear-gradient(135deg, #1e90ff 0%, #87ceeb 50%, #4fc3f7 100%)",
        borderRadius: 12,
        paddingBottom: 60,
        userSelect: "none",
      }}
    >
      {/* Hover preview — absolutely positioned above the taskbar strip */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          {...surfaceProps}
        >
          <TaskbarHoverPreview
            items={[...HOVER_MULTI.items]}
            phase={phase}
            onExitComplete={onExitComplete}
            onSelectItem={(id) => console.log("select item", id)}
            onCloseItem={(id) => console.log("close item", id)}
          />
        </div>
      )}

      {/* Simulated taskbar strip with trigger button */}
      <div
        style={{
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
        }}
      >
        <button
          ref={triggerRef}
          type="button"
          style={{
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
          }}
          aria-label="블로그 (hover to preview)"
          {...triggerProps}
        >
          📄
        </button>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 11,
            margin: 0,
          }}
        >
          Hover the button above
        </p>
      </div>
    </div>
  );
}

export default TaskbarHoverPreviewHarness;
