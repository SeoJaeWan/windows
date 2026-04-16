import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createElement, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'

// Required for React's act() to work in jsdom
// @ts-expect-error global flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { useTaskbarHoverPreview } from '.'
import type { TaskbarHoverPreviewHookOptions, TaskbarHoverPreviewHookResult } from '.'

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
  describe('초기값', () => {
    it('초기 상태에서 닫혀 있다 (isOpen: false)', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(resultRef.current?.isOpen).toBe(false)
    })

    it('초기 phase가 "opening"이다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(resultRef.current?.phase).toBe('opening')
    })

    it('getTriggerProps를 함수로 노출한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(typeof resultRef.current?.getTriggerProps).toBe('function')
    })

    it('getSurfaceProps를 함수로 노출한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(typeof resultRef.current?.getSurfaceProps).toBe('function')
    })

    it('getTriggerProps가 onPointerEnter와 onPointerLeave 핸들러를 반환한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const props = resultRef.current!.getTriggerProps()
      expect(typeof props.onPointerEnter).toBe('function')
      expect(typeof props.onPointerLeave).toBe('function')
    })

    it('getSurfaceProps가 onPointerEnter와 onPointerLeave 핸들러를 반환한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const props = resultRef.current!.getSurfaceProps()
      expect(typeof props.onPointerEnter).toBe('function')
      expect(typeof props.onPointerLeave).toBe('function')
    })
  })

  describe('기본 openDelayMs (1000ms)', () => {
    it('1000ms 이전에는 열리지 않는다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })

      act(() => { vi.advanceTimersByTime(999) })
      expect(resultRef.current?.isOpen).toBe(false)
    })

    it('기본값으로 1000ms 후 열린다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerProps = resultRef.current!.getTriggerProps()
      act(() => { triggerProps.onPointerEnter?.(new PointerEvent('pointerenter') as unknown as React.PointerEvent<HTMLElement>) })

      act(() => { vi.advanceTimersByTime(1000) })
      expect(resultRef.current?.isOpen).toBe(true)
    })
  })

  describe('openDelayMs 커스텀', () => {
    it('커스텀 지연 후 열린다', () => {
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

  describe('closeDelayMs 커스텀', () => {
    it('커스텀 지연 후 닫힌다', () => {
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

  describe('hover intent 열기 → 닫기 경로', () => {
    it('enter 지연 후 열리고, leave 지연 + onExitComplete 후 닫힌다', () => {
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

  describe('대기 타이머 취소', () => {
    it('open 완료 전 leave가 발생하면 대기 중인 open 타이머를 취소한다', () => {
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

    it('close 대기 중 enter가 발생하면 대기 중인 close 타이머를 취소한다', () => {
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

  describe('reduced motion 즉시 종료', () => {
    it('closing phase 없이 즉시 isOpen을 false로 설정한다', () => {
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
