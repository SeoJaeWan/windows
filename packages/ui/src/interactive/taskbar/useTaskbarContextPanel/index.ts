'use client'

/**
 * useTaskbarContextPanel
 *
 * Taskbar-specific hook for context panel open/close orchestration.
 *
 * Runtime responsibilities:
 *   - Trigger-centered anchor: x/y are computed from triggerRef bounding rect
 *   - Global dismiss: document-level Escape keydown + outside pointerdown
 *     (active only while the surface is open; cleaned up on finalize)
 *   - Focus restore: triggerRef.current.focus() on close completion
 *   - Mounted surface root registration: surfaceProps.ref (returned root wiring)
 *   - Observable phase lifecycle: "opening" → "open" → "closing" → finalize
 *   - Duplicate close requests are no-op
 *   - "closing" phase is maintained until onExitComplete fires (leaf exit)
 *   - Reduced motion: skips "closing" phase, finalizes immediately
 */

import { useState, useCallback, useRef, useEffect, type RefObject, type MutableRefObject } from 'react'
import type { SurfacePhase } from '../../../components/panels/taskbarAttachedSurface/shared'
import { useReducedMotion, type MotionPreference } from '../internal/useReducedMotion'
import { calculateTaskbarPlacement } from '../internal/useTaskbarPlacement'

export interface TaskbarContextPanelHookOptions {
  motionPreference?: MotionPreference
  triggerRef: RefObject<HTMLElement | null>
  panelWidth?: number
  panelHeight?: number
}

export interface TaskbarContextPanelHookResult {
  phase: SurfacePhase
  isOpen: boolean
  placement: { x: number; y: number }
  /**
   * Root wiring — attach to the mounted surface root element.
   * Provides:
   *   - ref: canonical path for mounted surface root registration (whitelist)
   */
  surfaceProps: React.HTMLAttributes<HTMLElement> & { ref: MutableRefObject<HTMLElement | null> }
  open: (event: React.MouseEvent | React.KeyboardEvent) => void
  close: () => void
  onExitComplete: () => void
}

export function useTaskbarContextPanel(
  options: TaskbarContextPanelHookOptions
): TaskbarContextPanelHookResult {
  const {
    motionPreference = 'auto',
    triggerRef,
    panelWidth = 200,
    panelHeight = 300,
  } = options

  const isReducedMotion = useReducedMotion(motionPreference)

  const [isOpen, setIsOpen] = useState(false)
  const [phase, setPhase] = useState<SurfacePhase>('opening')
  const [placement, setPlacement] = useState({ x: 0, y: 0 })

  // Track isOpen in a ref for use inside document-level listeners
  const isOpenRef = useRef(false)
  isOpenRef.current = isOpen

  // Track closing-in-progress to prevent duplicate close requests
  const isClosingRef = useRef(false)

  // Store triggerRef in a ref to avoid stale closure
  const triggerRefRef = useRef(triggerRef)
  triggerRefRef.current = triggerRef

  // Mounted surface root — canonical registration via returned ref wiring
  const surfaceRootRef = useRef<HTMLElement | null>(null)

  // AbortController for document-level listeners — one per open session
  const dismissAbortRef = useRef<AbortController | null>(null)

  // ── Finalize (called by both Escape/outside and onExitComplete) ──

  const finalize = useCallback(() => {
    isClosingRef.current = false
    setIsOpen(false)
    setPhase('opening')
    triggerRefRef.current.current?.focus()
  }, [])

  // ── Cleanup document-level listeners ──

  const cancelDismissListeners = useCallback(() => {
    dismissAbortRef.current?.abort()
    dismissAbortRef.current = null
  }, [])

  // ── Close (start exit sequence) ──

  const close = useCallback(() => {
    if (!isOpenRef.current) return
    if (isClosingRef.current) return

    isClosingRef.current = true
    cancelDismissListeners()

    if (isReducedMotion) {
      // Reduced motion: skip closing animation, finalize immediately
      finalize()
    } else {
      setPhase('closing')
      // onExitComplete will call finalize()
    }
  }, [isReducedMotion, cancelDismissListeners, finalize])

  // ── onExitComplete — called by leaf after exit animation ──

  const onExitComplete = useCallback(() => {
    finalize()
  }, [finalize])

  // ── Install document-level global dismiss listeners ──

  const installDismissListeners = useCallback(() => {
    cancelDismissListeners()
    const ctrl = new AbortController()
    dismissAbortRef.current = ctrl
    const { signal } = ctrl

    // Escape — focus-agnostic: always fires while surface is open
    document.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          close()
        }
      },
      { signal }
    )

    // Outside pointerdown — composedPath() whitelist
    document.addEventListener(
      'pointerdown',
      (e: PointerEvent) => {
        const path = e.composedPath()
        const triggerEl = triggerRefRef.current.current
        const surfaceEl = surfaceRootRef.current
        const isInside =
          (triggerEl !== null && path.includes(triggerEl)) ||
          (surfaceEl !== null && path.includes(surfaceEl))
        if (!isInside) {
          close()
        }
      },
      { signal }
    )
  }, [cancelDismissListeners, close])

  // ── Open ──

  const open = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      // Compute rects for measured placement
      const el = triggerRefRef.current.current

      let triggerRect: DOMRect = { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect

      if (el) {
        triggerRect = el.getBoundingClientRect()
      } else if ('clientX' in event) {
        // Fallback: synthesize a zero-size rect at the pointer position
        const cx = event.clientX
        const cy = event.clientY
        triggerRect = { left: cx, top: cy, width: 0, height: 0, right: cx, bottom: cy, x: cx, y: cy, toJSON: () => ({}) } as DOMRect
      }

      const vw = typeof window !== 'undefined' ? window.innerWidth : 1280

      // Phase 2 will introduce taskbarRootRef; until then, synthesize a taskbar
      // root rect from the trigger top so placement matches the legacy formula:
      //   y = triggerRect.top - ATTACHED_GAP - panelHeight
      // which equals:  taskbarRootRect.top - ATTACHED_GAP - surfaceRect.height
      // when taskbarRootRect.top = triggerRect.top and surfaceRect.height = panelHeight.
      const syntheticTaskbarRootRect: DOMRect = {
        left: 0,
        top: triggerRect.top,
        width: vw,
        height: 0,
        right: vw,
        bottom: triggerRect.top,
        x: 0,
        y: triggerRect.top,
        toJSON: () => ({}),
      } as DOMRect

      const syntheticSurfaceRect: DOMRect = {
        left: 0,
        top: 0,
        width: panelWidth,
        height: panelHeight,
        right: panelWidth,
        bottom: panelHeight,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect

      const computed = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect: syntheticSurfaceRect,
        taskbarRootRect: syntheticTaskbarRootRect,
        viewportWidth: vw,
      })

      setPlacement(computed)
      isClosingRef.current = false
      setIsOpen(true)
      setPhase('opening')
      setPhase('open')

      installDismissListeners()
    },
    [panelWidth, panelHeight, installDismissListeners]
  )

  // ── Cleanup on unmount ──

  useEffect(() => {
    return () => {
      cancelDismissListeners()
    }
  }, [cancelDismissListeners])

  const surfaceProps = {
    ref: surfaceRootRef,
  } as React.HTMLAttributes<HTMLElement> & { ref: MutableRefObject<HTMLElement | null> }

  return {
    phase,
    isOpen,
    placement,
    surfaceProps,
    open,
    close,
    onExitComplete,
  }
}
