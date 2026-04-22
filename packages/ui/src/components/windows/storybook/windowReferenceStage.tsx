import type { ReactNode } from "react";

type WindowReferenceStageProps = {
  /** Human-readable label rendered above the capture canvas. */
  label: string;
  /**
   * Stage geometry variant.
   * "desktop" — 1024×700 capture canvas (live/desktop states)
   * "mobile"  — 375×680 capture canvas (mobile states)
   *
   * Matches the same geometry family as CompareWindowStage.
   * Folder mobile: content-first grid (sidebar collapses to drawer)
   * Browser mobile: simplified chrome / content-first reading hierarchy
   */
  stageAttr: "desktop" | "mobile";
  children: ReactNode;
};

/* Geometry constants shared with CompareWindowStage exact contract */
const DESKTOP_WIDTH = 1024;
const DESKTOP_HEIGHT = 700;
const MOBILE_WIDTH = 375;
const MOBILE_HEIGHT = 680;

/**
 * WindowReferenceStage
 *
 * Human-review stage for windows family (Folder, Browser) Storybook stories.
 * Provides a desktop backdrop and fixed canvas so reviewers see the window
 * in spatial context without the full taskbar rail composition.
 *
 * Both desktop and mobile geometry variants are exposed here so the
 * differentiated mobile hierarchy (Folder content-first grid / Browser
 * simplified chrome) is visible in the same stage component.
 *
 * Exception taxonomy:
 * - Inline style canvas: fixed capture geometry — bounded exception
 *   (screenshot capture requires stable width/height)
 * - Decorative backdrop gradient — bounded exception (decorative desktop backdrop)
 * - position:relative — bounded exception (host-composition overlay placement)
 *
 * Do NOT add className/style to child components from inside this stage.
 */
function WindowReferenceStage({ label, stageAttr, children }: WindowReferenceStageProps) {
  const isDesktop = stageAttr === "desktop";
  const width = isDesktop ? DESKTOP_WIDTH : MOBILE_WIDTH;
  const height = isDesktop ? DESKTOP_HEIGHT : MOBILE_HEIGHT;

  return (
    <div className="sb-stage-outer sb-stage-outer--window">
      <div className="sb-stage-label">{label}</div>
      {/* Decorative desktop backdrop — bounded exception.
          Fixed canvas geometry: screenshot capture requires stable dimensions.
          position:relative: host-composition overlay absolute placement. */}
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: isDesktop ? "center" : "flex-start",
          width: isDesktop ? DESKTOP_WIDTH + 80 : MOBILE_WIDTH + 40,
          height: isDesktop ? DESKTOP_HEIGHT + 60 : MOBILE_HEIGHT + 40,
          background: "linear-gradient(135deg, #1e90ff 0%, #87ceeb 50%, #4fc3f7 100%)",
          borderRadius: 12,
          padding: 20,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width,
            height,
            flexShrink: 0,
            overflow: "hidden",
            borderRadius: 8,
            boxShadow: "0 8px 32px -8px rgba(15, 23, 42, 0.2)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default WindowReferenceStage;
