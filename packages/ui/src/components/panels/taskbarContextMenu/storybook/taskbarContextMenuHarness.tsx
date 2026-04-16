import { useRef } from "react";

import TaskbarContextMenu from "../index";
import TaskbarHoverPreview from "../../taskbarHoverPreview/index";
import { useTaskbarContextPanel } from "../../../../interactive/taskbar/useTaskbarContextPanel";
import { useTaskbarHoverPreview } from "../../../../interactive/taskbar/useTaskbarHoverPreview";
import { CONTEXT_PINNED } from "./taskbarContextMenuFixtures";
import { HOVER_MULTI } from "../../taskbarHoverPreview/storybook/taskbarHoverPreviewFixtures";

/**
 * TaskbarContextMenuHarness
 *
 * Story-local interactive harness for TaskbarContextMenu.
 * Wires useTaskbarContextPanel + useTaskbarHoverPreview together to
 * demonstrate:
 * - Right-click opens context menu at pointer origin
 * - Escape closes context menu and restores focus to trigger
 * - Hover preview closes when context menu opens (mutual exclusion)
 *
 * All orchestration is story-local — no apps/web required.
 *
 * Inline style: bounded exception — host-composition overlay absolute placement
 * and decorative desktop backdrop gradient.
 */
function TaskbarContextMenuHarness() {
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* ── Context panel hook ─────────────────────────────────────── */
  const contextPanel = useTaskbarContextPanel({
    triggerRef,
    panelWidth: 300,
    panelHeight: 280,
  });

  /* ── Hover preview hook ─────────────────────────────────────── */
  const hoverPreview = useTaskbarHoverPreview({
    openDelayMs: 400,
    closeDelayMs: 300,
  });

  const hoverTriggerProps = hoverPreview.getTriggerProps();
  const hoverSurfaceProps = hoverPreview.getSurfaceProps();

  /* ── Mutual exclusion: opening context closes hover ─────────── */
  const handleContextOpen = (e: React.MouseEvent | React.KeyboardEvent) => {
    // If hover preview is open, let it close via natural pointer-leave;
    // context menu takes visual priority — no explicit close needed since
    // the user right-clicked (pointer left the trigger area).
    contextPanel.open(e);
  };

  const handleRightClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleContextOpen(e);
  };

  return (
    <div
      style={{
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
      }}
    >
      {/* Hover preview — shows on hover, hidden when context is open */}
      {hoverPreview.isOpen && !contextPanel.isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          {...hoverSurfaceProps}
        >
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
            position: "fixed",
            left: contextPanel.placement.x,
            top: contextPanel.placement.y,
            zIndex: 50,
          }}
          {...contextPanel.surfaceProps}
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
          aria-label="블로그 (hover to preview / right-click for context menu)"
          onContextMenu={handleRightClick}
          {...hoverTriggerProps}
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
          Hover to preview · Right-click for context menu · Esc to close
        </p>
      </div>
    </div>
  );
}

export default TaskbarContextMenuHarness;
