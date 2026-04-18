'use client'

/**
 * useTaskbarSurfaceController
 *
 * Internal primitive for taskbar attached surface lifecycle.
 *
 * Responsibilities (shared between hover preview and context panel):
 *   - Accepts explicit ref inputs: triggerRef, taskbarRootRef, surfaceRootRef
 *   - Measures placement from actual DOM rects at open time (trigger + taskbar root + surface)
 *   - Re-measures placement after surface mounts (first paintable frame after open)
 *     so that the first open always uses the actual measured surface rect.
 *   - Manages opening/open/closing phase lifecycle
 *   - Reduced motion: immediate finalize (skip closing phase)
 *   - Latest intent wins: new open/close cancels any in-progress stale transition
 *   - Missing ref: console.warn + no-op (no ancestor lookup, no coordinate fallback)
 *   - Session guard: document dismiss listeners active only while surface is open
 *   - Stale closing completion is ignored after a reopen (latest intent wins)
 *
 * Does NOT own:
 *   - Sibling arbitration (winner/loser between hover and context)
 *   - Pointer-reset gate (hover-specific; owned by useHoverIntent)
 *   - Focus restore (context-specific; owned by useTaskbarContextPanel)
 *   - Hover timing (openDelayMs/closeDelayMs; owned by useHoverIntent)
 */

import { useState, useCallback, useRef, useEffect, type RefObject, type MutableRefObject } from 'react'
import type { SurfacePhase } from '../../../../components/panels/taskbarAttachedSurface/shared'
import { calculateTaskbarPlacement } from '../useTaskbarPlacement'
import type { MotionPreference } from '../useReducedMotion'
import { useReducedMotion } from '../useReducedMotion'

export type { MotionPreference }

export interface TaskbarSurfaceControllerOptions {
  /** Motion preference override. Default: 'auto'. */
  motionPreference?: MotionPreference
  /**
   * Called when finalize completes (after exit animation or immediately on
   * reduced motion close). Use for focus restore or consumer-level cleanup.
   */
  onFinalize?: () => void
}

export interface TaskbarSurfaceControllerResult {
  phase: SurfacePhase
  isOpen: boolean
  placement: { x: number; y: number }
  /**
   * Wire the surface root element to this ref.
   * When the surface mounts after open(), the primitive will automatically
   * re-measure placement using the actual surface rect.
   */
  surfaceRootRef: MutableRefObject<HTMLElement | null>
  /**
   * Notify the primitive that the surface has mounted and its ref is populated.
   * Call this immediately after assigning surfaceRootRef.current in the host.
   * This triggers a re-measure using the actual surface rect.
   */
  onSurfaceMounted: () => void
  /** Open the surface. Measures placement from DOM rects at call time. */
  open: (
    triggerRef: RefObject<HTMLElement | null>,
    taskbarRootRef: RefObject<HTMLElement | null>
  ) => void
  /** Begin close sequence (or finalize immediately on reduced motion). */
  close: () => void
  /**
   * Wire to the leaf surface's onExitComplete prop.
   * Finalizes the surface after the exit animation completes.
   * Stale calls (after a reopen) are no-op.
   */
  onExitComplete: () => void
}

export function useTaskbarSurfaceController(
  options: TaskbarSurfaceControllerOptions = {}
): TaskbarSurfaceControllerResult {
  const { motionPreference = 'auto', onFinalize } = options

  const isReducedMotion = useReducedMotion(motionPreference)

  const [isOpen, setIsOpen] = useState(false)
  const [phase, setPhase] = useState<SurfacePhase>('opening')
  const [placement, setPlacement] = useState({ x: 0, y: 0 })

  // Track isOpen in a ref so document-level listeners read the latest value
  const isOpenRef = useRef(false)
  isOpenRef.current = isOpen

  // Session counter — incremented on every open call.
  // Stale closing completion checks this to detect reopens.
  const sessionRef = useRef(0)

  // Track closing-in-progress to prevent duplicate close requests
  const isClosingRef = useRef(false)

  // Surface root for whitelist and rect measurement
  const surfaceRootRef = useRef<HTMLElement | null>(null)

  // Store the last trigger and taskbarRoot refs used in open() so the re-measure
  // effect can read them when the surface mounts after open().
  const lastTriggerRefRef = useRef<RefObject<HTMLElement | null> | null>(null)
  const lastTaskbarRootRefRef = useRef<RefObject<HTMLElement | null> | null>(null)

  // onFinalize ref — keeps the latest callback without recreating close/open
  const onFinalizeRef = useRef(onFinalize)
  onFinalizeRef.current = onFinalize

  // AbortController for document-level dismiss listeners — one per open session
  const dismissAbortRef = useRef<AbortController | null>(null)

  // ── Cleanup document-level listeners ──

  const cancelDismissListeners = useCallback(() => {
    dismissAbortRef.current?.abort()
    dismissAbortRef.current = null
  }, [])

  // ── Finalize ──

  const finalize = useCallback(() => {
    isClosingRef.current = false
    setIsOpen(false)
    setPhase('opening')
    onFinalizeRef.current?.()
  }, [])

  // ── Close ──

  const close = useCallback(() => {
    if (!isOpenRef.current) return
    if (isClosingRef.current) return

    isClosingRef.current = true
    cancelDismissListeners()

    if (isReducedMotion) {
      finalize()
    } else {
      setPhase('closing')
    }
  }, [isReducedMotion, cancelDismissListeners, finalize])

  // ── onExitComplete — called by leaf after exit animation ──

  const onExitComplete = useCallback(() => {
    // Only finalize if we are still in the closing session that started this exit.
    // If open() was called since close() (new session), this is a stale event.
    if (!isClosingRef.current) return
    finalize()
  }, [finalize])

  // ── Install document-level dismiss listeners ──

  const installDismissListeners = useCallback(
    (
      triggerRef: RefObject<HTMLElement | null>,
      taskbarRootRef: RefObject<HTMLElement | null>
    ) => {
      cancelDismissListeners()
      const ctrl = new AbortController()
      dismissAbortRef.current = ctrl
      const { signal } = ctrl

      // Escape — focus-agnostic: always fires while surface is open
      document.addEventListener(
        'keydown',
        (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
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
          const triggerEl = triggerRef.current
          const taskbarEl = taskbarRootRef.current
          const surfaceEl = surfaceRootRef.current
          const isInside =
            (triggerEl !== null && path.includes(triggerEl)) ||
            (taskbarEl !== null && path.includes(taskbarEl)) ||
            (surfaceEl !== null && path.includes(surfaceEl))
          if (!isInside) {
            close()
          }
        },
        { signal }
      )
    },
    [cancelDismissListeners, close]
  )

  // ── Re-measure helper ──

  const remeasurePlacement = useCallback(
    (
      triggerRef: RefObject<HTMLElement | null>,
      taskbarRootRef: RefObject<HTMLElement | null>
    ) => {
      const triggerEl = triggerRef.current
      const taskbarRootEl = taskbarRootRef.current
      const surfaceEl = surfaceRootRef.current

      if (!triggerEl || !taskbarRootEl || !surfaceEl) return

      const triggerRect = triggerEl.getBoundingClientRect()
      const taskbarRootRect = taskbarRootEl.getBoundingClientRect()
      const surfaceRect = surfaceEl.getBoundingClientRect()
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280

      const computed = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect,
        taskbarRootRect,
        viewportWidth,
      })

      setPlacement(computed)
    },
    []
  )

  // ── Open ──

  const open = useCallback(
    (
      triggerRef: RefObject<HTMLElement | null>,
      taskbarRootRef: RefObject<HTMLElement | null>
    ) => {
      const triggerEl = triggerRef.current
      const taskbarRootEl = taskbarRootRef.current
      const surfaceEl = surfaceRootRef.current

      // Validate required refs
      if (!triggerEl) {
        console.warn(
          '[useTaskbarSurfaceController] open: triggerRef.current is null — no-op'
        )
        return
      }
      if (!taskbarRootEl) {
        console.warn(
          '[useTaskbarSurfaceController] open: taskbarRootRef.current is null — no-op'
        )
        return
      }

      // Measure rects
      const triggerRect = triggerEl.getBoundingClientRect()
      const taskbarRootRect = taskbarRootEl.getBoundingClientRect()

      // Surface rect: use measured rect if mounted, otherwise zero-size placeholder.
      // When the surface is not yet mounted (first open), placement will be
      // re-measured via onSurfaceMounted() once the surface DOM element is assigned.
      const surfaceRect = surfaceEl
        ? surfaceEl.getBoundingClientRect()
        : ({ left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect)

      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280

      const computed = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect,
        taskbarRootRect,
        viewportWidth,
      })

      // Store refs for re-measure after surface mount
      lastTriggerRefRef.current = triggerRef
      lastTaskbarRootRefRef.current = taskbarRootRef

      // Latest intent wins: cancel stale close, bump session counter
      cancelDismissListeners()
      isClosingRef.current = false
      sessionRef.current += 1

      setPlacement(computed)
      setIsOpen(true)
      setPhase('opening')
      setPhase('open')

      installDismissListeners(triggerRef, taskbarRootRef)
    },
    [cancelDismissListeners, installDismissListeners]
  )

  // ── onSurfaceMounted — called by host when surface DOM element is assigned ──

  const onSurfaceMounted = useCallback(() => {
    const triggerRef = lastTriggerRefRef.current
    const taskbarRootRef = lastTaskbarRootRefRef.current
    if (!triggerRef || !taskbarRootRef) return
    remeasurePlacement(triggerRef, taskbarRootRef)
  }, [remeasurePlacement])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelDismissListeners()
    }
  }, [cancelDismissListeners])

  return {
    phase,
    isOpen,
    placement,
    surfaceRootRef,
    onSurfaceMounted,
    open,
    close,
    onExitComplete,
  }
}
