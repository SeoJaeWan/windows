'use client'

/**
 * useTaskbarPlacement
 *
 * Calculates the placement coordinate for a taskbar attached surface.
 *
 * Policy:
 *   - Taskbar is assumed to be at the bottom of the screen.
 *   - Panel is placed above the trigger element (trigger-top anchor), not above the pointer.
 *   - Horizontal: panel is centered on the trigger center (x).
 *   - Vertical: panel bottom edge sits ATTACHED_GAP pixels above the trigger top.
 *   - Viewport clamp prevents the panel from going off-screen.
 *
 * This is a pure calculation — no React state/effects required.
 * The hook wrapper allows future reactive extensions (e.g., viewport resize).
 */

/** Gap between the bottom of the panel and the top of the trigger element. */
const ATTACHED_GAP = 10

export interface TriggerAnchor {
  /** Horizontal center of the trigger element (trigger.left + trigger.width / 2) */
  triggerCenterX: number
  /** Top edge of the trigger element */
  triggerTop: number
}

export interface TaskbarPlacementInput {
  triggerAnchor: TriggerAnchor
  panelWidth: number
  panelHeight: number
  viewportWidth: number
  viewportHeight: number
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
  const { triggerAnchor, panelWidth, panelHeight, viewportWidth, viewportHeight } = input
  const { triggerCenterX, triggerTop } = triggerAnchor

  // Horizontal: center the panel on the trigger center, clamp to viewport
  let x = triggerCenterX - panelWidth / 2
  x = Math.max(0, Math.min(x, viewportWidth - panelWidth))

  // Vertical: place panel above the trigger with ATTACHED_GAP
  // Panel bottom edge = triggerTop - ATTACHED_GAP
  // Panel top edge   = triggerTop - ATTACHED_GAP - panelHeight
  let y = triggerTop - ATTACHED_GAP - panelHeight
  y = Math.max(0, Math.min(y, viewportHeight - panelHeight))

  return { x, y }
}

/**
 * useTaskbarPlacement
 *
 * Returns the placement coordinate for a taskbar attached panel
 * based on trigger anchor and panel dimensions.
 */
export function useTaskbarPlacement(
  input: TaskbarPlacementInput
): TaskbarPlacementOutput {
  return calculateTaskbarPlacement(input)
}
