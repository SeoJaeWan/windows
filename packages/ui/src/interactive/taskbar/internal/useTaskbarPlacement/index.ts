'use client'

/**
 * useTaskbarPlacement
 *
 * Calculates the placement coordinate for a taskbar attached surface.
 *
 * Policy:
 *   - Taskbar is assumed to be at the bottom of the screen.
 *   - Panel is placed above the taskbar root (taskbarRoot.height + ATTACHED_GAP),
 *     not above the trigger top edge.
 *   - Horizontal: panel is centered on the trigger center x.
 *   - Vertical: panel bottom edge sits (taskbarRoot.height + ATTACHED_GAP) pixels
 *     from the bottom of the viewport (i.e. y = viewportHeight - taskbarRootHeight - ATTACHED_GAP - surfaceHeight).
 *   - Horizontal clamp prevents the panel from going off-screen.
 *   - No vertical clamp — taskbar is always at the bottom.
 *
 * This is a pure calculation — no React state/effects required.
 * The hook wrapper allows future reactive extensions (e.g., viewport resize).
 */

/** Gap between the bottom of the surface and the top of the taskbar root. */
export const ATTACHED_GAP = 10

export interface TaskbarPlacementInput {
  /** Measured bounding rect of the trigger element. */
  triggerRect: DOMRect
  /** Measured bounding rect of the rendered surface element. */
  surfaceRect: DOMRect
  /** Measured bounding rect of the taskbar root element. */
  taskbarRootRect: DOMRect
  /** Viewport width for horizontal clamp. */
  viewportWidth: number
}

export interface TaskbarPlacementOutput {
  x: number
  y: number
}

/**
 * Pure placement calculation.
 * Exported for direct testing without React.
 */
export function calculateTaskbarPlacement(
  input: TaskbarPlacementInput
): TaskbarPlacementOutput {
  const { triggerRect, surfaceRect, taskbarRootRect, viewportWidth } = input

  // Horizontal: center the surface on the trigger center x, clamp to viewport
  const triggerCenterX = triggerRect.left + triggerRect.width / 2
  let x = triggerCenterX - surfaceRect.width / 2
  x = Math.max(0, Math.min(x, viewportWidth - surfaceRect.width))

  // Vertical: surface bottom edge sits ATTACHED_GAP above the taskbar root top edge
  // y = taskbarRootRect.top - ATTACHED_GAP - surfaceRect.height
  const y = taskbarRootRect.top - ATTACHED_GAP - surfaceRect.height

  return { x, y }
}

/**
 * useTaskbarPlacement
 *
 * Returns the placement coordinate for a taskbar attached panel
 * based on measured trigger rect, surface rect, taskbar root rect, and viewport width.
 */
export function useTaskbarPlacement(
  input: TaskbarPlacementInput
): TaskbarPlacementOutput {
  return calculateTaskbarPlacement(input)
}
