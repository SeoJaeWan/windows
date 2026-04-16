import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'

// @ts-expect-error global flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { usePresencePhase, type UsePresencePhaseOptions, type UsePresencePhaseResult } from '.'

/* ── Harness ─────────────────────────────────────────────────── */

function createHarness(options: UsePresencePhaseOptions = {}) {
  let result!: UsePresencePhaseResult

  function Harness({ opts }: { opts: UsePresencePhaseOptions }) {
    result = usePresencePhase(opts)
    return null
  }

  let root!: Root
  const container = document.createElement('div')
  document.body.appendChild(container)

  act(() => {
    root = createRoot(container)
    root.render(createElement(Harness, { opts: options }))
  })

  return {
    get result() { return result },
    rerender(opts: UsePresencePhaseOptions) {
      act(() => { root.render(createElement(Harness, { opts })) })
    },
    unmount() {
      act(() => { root.unmount() })
      container.remove()
    },
  }
}

/* ── Tests ───────────────────────────────────────────────────── */

describe('usePresencePhase', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  describe('initial state', () => {
    it('starts with phase "opening"', () => {
      const h = createHarness()
      expect(h.result.phase).toBe('opening')
      h.unmount()
    })
  })

  describe('startOpen', () => {
    it('sets phase to "opening"', () => {
      const h = createHarness()
      act(() => { h.result.confirmOpen() }) // advance to "open"
      expect(h.result.phase).toBe('open')
      act(() => { h.result.startOpen() })
      expect(h.result.phase).toBe('opening')
      h.unmount()
    })
  })

  describe('confirmOpen', () => {
    it('sets phase to "open"', () => {
      const h = createHarness()
      act(() => { h.result.confirmOpen() })
      expect(h.result.phase).toBe('open')
      h.unmount()
    })
  })

  describe('startClose — normal motion', () => {
    it('sets phase to "closing"', () => {
      const h = createHarness({ immediate: false })
      act(() => { h.result.startClose() })
      expect(h.result.phase).toBe('closing')
      h.unmount()
    })

    it('does not call onExitComplete synchronously', () => {
      const onExitComplete = vi.fn()
      const h = createHarness({ immediate: false, onExitComplete })
      act(() => { h.result.startClose() })
      expect(onExitComplete).not.toHaveBeenCalled()
      h.unmount()
    })
  })

  describe('startClose — immediate (reduced motion)', () => {
    it('does not set phase to "closing"', () => {
      const h = createHarness({ immediate: true, onExitComplete: vi.fn() })
      act(() => { h.result.confirmOpen() })
      act(() => {
        h.result.startClose()
        vi.runAllTimers()
      })
      expect(h.result.phase).toBe('open') // phase unchanged by startClose in immediate mode
      h.unmount()
    })

    it('calls onExitComplete via setTimeout(0)', () => {
      const onExitComplete = vi.fn()
      const h = createHarness({ immediate: true, onExitComplete })
      act(() => {
        h.result.startClose()
        vi.runAllTimers()
      })
      expect(onExitComplete).toHaveBeenCalledTimes(1)
      h.unmount()
    })

    it('does not call onExitComplete before timer fires', () => {
      const onExitComplete = vi.fn()
      const h = createHarness({ immediate: true, onExitComplete })
      act(() => { h.result.startClose() })
      // timer not yet fired
      expect(onExitComplete).not.toHaveBeenCalled()
      act(() => { vi.runAllTimers() })
      expect(onExitComplete).toHaveBeenCalledTimes(1)
      h.unmount()
    })
  })

  describe('handleExitComplete', () => {
    it('calls onExitComplete callback', () => {
      const onExitComplete = vi.fn()
      const h = createHarness({ onExitComplete })
      act(() => { h.result.handleExitComplete() })
      expect(onExitComplete).toHaveBeenCalledTimes(1)
      h.unmount()
    })

    it('does not throw if onExitComplete is undefined', () => {
      const h = createHarness()
      expect(() => {
        act(() => { h.result.handleExitComplete() })
      }).not.toThrow()
      h.unmount()
    })
  })
})
