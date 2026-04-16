import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createElement, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'

// Required for React's act() to work in jsdom
// @ts-expect-error global flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { useTaskbarHoverPreview } from './useTaskbarHoverPreview'
import type { TaskbarHoverPreviewHookOptions, TaskbarHoverPreviewHookResult } from './useTaskbarHoverPreview'

/* ── Harness ─────────────────────────────────────────────────── */

/**
 * Simple hook harness: renders a component that calls the hook and
 * exposes the result via a mutable ref so tests can inspect it.
 */
function createHarness() {
  const resultRef: { current: TaskbarHoverPreviewHookResult | null } = { current: null }

  function Harness({ options }: { options?: TaskbarHoverPreviewHookOptions }) {
    const result = useTaskbarHoverPreview(options)
    resultRef.current = result
    return null
  }

  return { resultRef, Harness }
}

/* ── Setup ───────────────────────────────────────────────────── */

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  vi.useFakeTimers()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.useRealTimers()
})

function render(ui: ReactNode) {
  act(() => { root.render(ui) })
}

/* ── Tests ───────────────────────────────────────────────────── */

describe('useTaskbarHoverPreview', () => {
  describe('default values', () => {
    it('starts closed (isOpen: false)', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(resultRef.current?.isOpen).toBe(false)
    })

    it('starts with phase "opening"', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(resultRef.current?.phase).toBe('opening')
    })

    it('exposes getTriggerProps as a function', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(typeof resultRef.current?.getTriggerProps).toBe('function')
    })

    it('exposes getSurfaceProps as a function', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(typeof resultRef.current?.getSurfaceProps).toBe('function')
    })

    it('getTriggerProps returns onPointerEnter and onPointerLeave handlers', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const props = resultRef.current!.getTriggerProps()
      expect(typeof props.onPointerEnter).toBe('function')
      expect(typeof props.onPointerLeave).toBe('function')
    })

    it('getSurfaceProps returns onPointerEnter and onPointerLeave handlers', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const props = resultRef.current!.getSurfaceProps()
      expect(typeof props.onPointerEnter).toBe('function')
      expect(typeof props.onPointerLeave).toBe('function')
    })
  })

  describe('default openDelayMs (1000ms)', () => {
    it('does not open before 1000ms', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })

      act(() => { vi.advanceTimersByTime(999) })
      expect(resultRef.current?.isOpen).toBe(false)
    })

    it('opens after 1000ms by default', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })

      act(() => { vi.advanceTimersByTime(1000) })
      expect(resultRef.current?.isOpen).toBe(true)
    })
  })

  describe('openDelayMs override', () => {
    it('opens after custom delay', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 200 } }))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })

      act(() => { vi.advanceTimersByTime(199) })
      expect(resultRef.current?.isOpen).toBe(false)

      act(() => { vi.advanceTimersByTime(1) })
      expect(resultRef.current?.isOpen).toBe(true)
    })
  })

  describe('closeDelayMs override', () => {
    it('closes after custom delay', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 0, closeDelayMs: 300 } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // Open
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(0) })
      expect(resultRef.current?.isOpen).toBe(true)

      // Leave — should not close yet
      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(299) })
      expect(resultRef.current?.isOpen).toBe(true)

      // Now it should close
      act(() => { vi.advanceTimersByTime(1) })
      act(() => { resultRef.current?.onExitComplete() })
      expect(resultRef.current?.isOpen).toBe(false)
    })
  })

  describe('hover intent open → close path', () => {
    it('opens after enter delay and closes after leave delay + onExitComplete', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 200 } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // Hover enter
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      expect(resultRef.current?.isOpen).toBe(true)
      expect(resultRef.current?.phase).toBe('open')

      // Hover leave → closing phase
      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(200) })
      expect(resultRef.current?.phase).toBe('closing')

      // Animation done
      act(() => { resultRef.current?.onExitComplete() })
      expect(resultRef.current?.isOpen).toBe(false)
    })
  })

  describe('pending timer cancel', () => {
    it('cancels pending open timer when leave fires before open completes', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 500 } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // Enter → partial wait → leave
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(300) })
      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })

      // Advance past original openDelay — should NOT open
      act(() => { vi.advanceTimersByTime(300) })
      expect(resultRef.current?.isOpen).toBe(false)
    })

    it('cancels pending close timer when enter fires during close window', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 500 } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // Open
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      expect(resultRef.current?.isOpen).toBe(true)

      // Leave → start close timer
      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })

      // Re-enter before close fires → cancels close
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(600) })

      // Should still be open (close was cancelled, new open timer fired)
      expect(resultRef.current?.isOpen).toBe(true)
    })
  })

  describe('reduced motion immediate exit finalize', () => {
    it('does not enter closing phase — immediately sets isOpen to false', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { options: { openDelayMs: 100, closeDelayMs: 100, motionPreference: 'reduced' } }))

      const triggerProps = resultRef.current!.getTriggerProps()

      // Open
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })
      expect(resultRef.current?.isOpen).toBe(true)

      // Leave → with reduced motion, isOpen becomes false immediately (no closing phase)
      act(() => { triggerProps.onPointerLeave?.(new PointerEvent('pointerleave') as unknown as React.PointerEvent<HTMLElement>) })
      act(() => { vi.advanceTimersByTime(100) })

      // Should be closed without going through closing phase
      expect(resultRef.current?.isOpen).toBe(false)
    })
  })
})
