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
    it('always returns false regardless of system setting', () => {
      const h = createHarness('full')
      expect(h.result).toBe(false)
      h.unmount()
    })
  })

  describe('motionPreference="reduced"', () => {
    it('always returns true regardless of system setting', () => {
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

    it('returns false when matchMedia reports no reduced motion', () => {
      mockMq.matches = false
      const h = createHarness('auto')
      expect(h.result).toBe(false)
      h.unmount()
    })

    it('returns true when matchMedia reports reduced motion', () => {
      mockMq.matches = true
      const h = createHarness('auto')
      expect(h.result).toBe(true)
      h.unmount()
    })

    it('subscribes to matchMedia change events on mount', () => {
      const h = createHarness('auto')
      expect(mockMq.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
      h.unmount()
    })

    it('unsubscribes from matchMedia on unmount', () => {
      const h = createHarness('auto')
      h.unmount()
      expect(mockMq.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })

    it('updates to true when change event fires with matches=true', () => {
      mockMq.matches = false
      const h = createHarness('auto')
      expect(h.result).toBe(false)
      act(() => {
        mockMq._listeners.forEach(fn => fn({ matches: true } as MediaQueryListEvent))
      })
      expect(h.result).toBe(true)
      h.unmount()
    })

    it('updates to false when change event fires with matches=false', () => {
      mockMq.matches = true
      const h = createHarness('auto')
      expect(h.result).toBe(true)
      act(() => {
        mockMq._listeners.forEach(fn => fn({ matches: false } as MediaQueryListEvent))
      })
      expect(h.result).toBe(false)
      h.unmount()
    })

    it('returns false when matchMedia is not a function', () => {
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
