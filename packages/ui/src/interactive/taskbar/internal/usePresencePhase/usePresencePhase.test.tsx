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

  describe('초기 상태', () => {
    it('초기 phase가 "opening"이다', () => {
      const h = createHarness()
      expect(h.result.phase).toBe('opening')
      h.unmount()
    })
  })

  describe('startOpen', () => {
    it('phase를 "opening"으로 설정한다', () => {
      const h = createHarness()
      act(() => { h.result.confirmOpen() }) // advance to "open"
      expect(h.result.phase).toBe('open')
      act(() => { h.result.startOpen() })
      expect(h.result.phase).toBe('opening')
      h.unmount()
    })
  })

  describe('confirmOpen', () => {
    it('phase를 "open"으로 설정한다', () => {
      const h = createHarness()
      act(() => { h.result.confirmOpen() })
      expect(h.result.phase).toBe('open')
      h.unmount()
    })
  })

  describe('startClose — 일반 모션', () => {
    it('phase를 "closing"으로 설정한다', () => {
      const h = createHarness({ immediate: false })
      act(() => { h.result.startClose() })
      expect(h.result.phase).toBe('closing')
      h.unmount()
    })

    it('onExitComplete를 동기적으로 호출하지 않는다', () => {
      const onExitComplete = vi.fn()
      const h = createHarness({ immediate: false, onExitComplete })
      act(() => { h.result.startClose() })
      expect(onExitComplete).not.toHaveBeenCalled()
      h.unmount()
    })
  })

  describe('startClose — 즉시 완료 (reduced motion)', () => {
    it('phase를 "closing"으로 설정하지 않는다', () => {
      const h = createHarness({ immediate: true, onExitComplete: vi.fn() })
      act(() => { h.result.confirmOpen() })
      act(() => {
        h.result.startClose()
        vi.runAllTimers()
      })
      expect(h.result.phase).toBe('open') // phase unchanged by startClose in immediate mode
      h.unmount()
    })

    it('setTimeout(0)으로 onExitComplete를 호출한다', () => {
      const onExitComplete = vi.fn()
      const h = createHarness({ immediate: true, onExitComplete })
      act(() => {
        h.result.startClose()
        vi.runAllTimers()
      })
      expect(onExitComplete).toHaveBeenCalledTimes(1)
      h.unmount()
    })

    it('타이머가 실행되기 전에는 onExitComplete를 호출하지 않는다', () => {
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
    it('onExitComplete 콜백을 호출한다', () => {
      const onExitComplete = vi.fn()
      const h = createHarness({ onExitComplete })
      act(() => { h.result.handleExitComplete() })
      expect(onExitComplete).toHaveBeenCalledTimes(1)
      h.unmount()
    })

    it('onExitComplete가 없어도 에러가 발생하지 않는다', () => {
      const h = createHarness()
      expect(() => {
        act(() => { h.result.handleExitComplete() })
      }).not.toThrow()
      h.unmount()
    })
  })
})
