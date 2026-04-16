'use client'

/**
 * useTaskbarPlacement
 *
 * Calculates the placement coordinate for a taskbar context panel.
 *
 * Policy:
 *   - Taskbar is assumed to be at the bottom of the screen.
 *   - Panel is placed above the click/pointer origin (clientX, clientY).
 *   - Viewport clamp prevents the panel from going off-screen.
 *
 * This is a pure calculation — no React state/effects required.
 * The hook wrapper allows future reactive extensions (e.g., viewport resize).
 */

export interface TaskbarPlacementInput {
  pointerX: number
  pointerY: number
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
  const { pointerX, pointerY, panelWidth, panelHeight, viewportWidth, viewportHeight } = input

  // Horizontal: center the panel around pointerX, clamp to viewport
  let x = pointerX - panelWidth / 2
  x = Math.max(0, Math.min(x, viewportWidth - panelWidth))

  // Vertical: place panel above the pointer (taskbar is at bottom)
  let y = pointerY - panelHeight
  y = Math.max(0, Math.min(y, viewportHeight - panelHeight))

  return { x, y }
}

/**
 * useTaskbarPlacement
 *
 * Returns the placement coordinate for a taskbar attached panel
 * based on pointer origin and panel dimensions.
 */
export function useTaskbarPlacement(
  input: TaskbarPlacementInput
): TaskbarPlacementOutput {
  return calculateTaskbarPlacement(input)
}
