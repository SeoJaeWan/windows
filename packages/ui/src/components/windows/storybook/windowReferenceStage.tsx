import type { ReactNode } from "react";

type WindowStageProps = {
  children: ReactNode;
};

/**
 * WindowDesktopStage
 *
 * Desktop-viewport canvas for Folder/Browser window stories.
 * Provides a decorative Windows desktop backdrop (blue gradient) so reviewers
 * see the window in spatial context without the full app shell.
 *
 * Exception taxonomy:
 * - Decorative desktop backdrop gradient — bounded exception
 *   (screenshot capture geometry, host-composition overlay absolute placement)
 * - Fixed width/height canvas — bounded exception for stable capture geometry
 */
export function WindowDesktopStage({ children }: WindowStageProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        width: 1024,
        height: 720,
        background: "linear-gradient(135deg, #1565c0 0%, #1e88e5 40%, #42a5f5 100%)",
        borderRadius: 12,
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
}

/**
 * WindowMobileStage
 *
 * Mobile-viewport canvas for Folder/Browser window stories.
 * Simulates a narrow phone screen (375px) to verify mobile layout:
 * sidebar collapses, items grid goes full-width.
 *
 * Exception taxonomy:
 * - Fixed capture canvas — bounded exception for stable mobile capture geometry
 */
export function WindowMobileStage({ children }: WindowStageProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        width: 375,
        height: 720,
        background: "linear-gradient(135deg, #37474f 0%, #546e7a 100%)",
        borderRadius: 12,
        padding: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}
