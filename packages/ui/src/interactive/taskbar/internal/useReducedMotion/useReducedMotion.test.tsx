import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'

// @ts-expect-error global flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { useReducedMotion, type MotionPreference } from '.'

/* ── Harness ─────────────────────────────────────────────────── */

function createHarness(preference: MotionPreference = 'auto') {
  let result!: boolean

  function Harness({ pref }: { pref: MotionPreference }) {
    result = useReducedMotion(pref)
    return null
  }

  let root!: Root
  const container = document.createElement('div')
  document.body.appendChild(container)

  act(() => {
    root = createRoot(container)
    root.render(createElement(Harness, { pref: preference }))
  })

  return {
    get result() { return result },
    rerender(pref: MotionPreference) {
      act(() => { root.render(createElement(Harness, { pref })) })
    },
    unmount() {
      act(() => { root.unmount() })
      container.remove()
    },
  }
}

/* ── Tests ───────────────────────────────────────────────────── */

describe('useReducedMotion', () => {
  describe('motionPreference="full"', () => {
    it('시스템 설정과 무관하게 항상 false를 반환한다', () => {
      const h = createHarness('full')
      expect(h.result).toBe(false)
      h.unmount()
    })
  })

  describe('motionPreference="reduced"', () => {
    it('시스템 설정과 무관하게 항상 true를 반환한다', () => {
      const h = createHarness('reduced')
      expect(h.result).toBe(true)
      h.unmount()
    })
  })

  describe('motionPreference="auto"', () => {
    let mockMq: {
      matches: boolean
      addEventListener: ReturnType<typeof vi.fn>
      removeEventListener: ReturnType<typeof vi.fn>
      _listeners: Array<(e: MediaQueryListEvent) => void>
    }

    beforeEach(() => {
      mockMq = {
        matches: false,
        addEventListener: vi.fn((_, handler) => { mockMq._listeners.push(handler) }),
        removeEventListener: vi.fn(),
        _listeners: [],
      }
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn(() => mockMq),
      })
    })

    afterEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: undefined,
      })
    })

    it('matchMedia가 reduced motion 없음을 보고하면 false를 반환한다', () => {
      mockMq.matches = false
      const h = createHarness('auto')
      expect(h.result).toBe(false)
      h.unmount()
    })

    it('matchMedia가 reduced motion을 보고하면 true를 반환한다', () => {
      mockMq.matches = true
      const h = createHarness('auto')
      expect(h.result).toBe(true)
      h.unmount()
    })

    it('마운트 시 matchMedia change 이벤트를 구독한다', () => {
      const h = createHarness('auto')
      expect(mockMq.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
      h.unmount()
    })

    it('언마운트 시 matchMedia 구독을 해제한다', () => {
      const h = createHarness('auto')
      h.unmount()
      expect(mockMq.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })

    it('change 이벤트에서 matches=true이면 true로 업데이트된다', () => {
      mockMq.matches = false
      const h = createHarness('auto')
      expect(h.result).toBe(false)
      act(() => {
        mockMq._listeners.forEach(fn => fn({ matches: true } as MediaQueryListEvent))
      })
      expect(h.result).toBe(true)
      h.unmount()
    })

    it('change 이벤트에서 matches=false이면 false로 업데이트된다', () => {
      mockMq.matches = true
      const h = createHarness('auto')
      expect(h.result).toBe(true)
      act(() => {
        mockMq._listeners.forEach(fn => fn({ matches: false } as MediaQueryListEvent))
      })
      expect(h.result).toBe(false)
      h.unmount()
    })

    it('matchMedia가 함수가 아닐 때 false를 반환한다', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: undefined,
      })
      const h = createHarness('auto')
      expect(h.result).toBe(false)
      h.unmount()
    })
  })
})
