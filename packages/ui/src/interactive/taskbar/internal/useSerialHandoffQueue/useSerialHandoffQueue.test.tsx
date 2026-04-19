import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createElement, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'

// Required for React's act() to work in jsdom
// @ts-expect-error global flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { useSerialHandoffQueue } from '.'
import type { UseSerialHandoffQueueResult } from '.'

/* ── Harness ─────────────────────────────────────────────────── */

function createHarness(isLoserClosingFn: () => boolean) {
  const resultRef: { current: UseSerialHandoffQueueResult | null } = { current: null }

  function Harness() {
    const result = useSerialHandoffQueue({ isLoserClosing: isLoserClosingFn })
    resultRef.current = result
    return null
  }

  return { resultRef, Harness }
}

/* ── Setup ───────────────────────────────────────────────────── */

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.restoreAllMocks()
})

function render(ui: ReactNode) {
  act(() => { root.render(ui) })
}

/* ── Tests ───────────────────────────────────────────────────── */

describe('useSerialHandoffQueue', () => {
  describe('초기 상태', () => {
    it('requestWinner, notifyLoserFinalized, cancelWinner를 함수로 노출한다', () => {
      const { resultRef, Harness } = createHarness(() => false)
      render(createElement(Harness))

      expect(typeof resultRef.current?.requestWinner).toBe('function')
      expect(typeof resultRef.current?.notifyLoserFinalized).toBe('function')
      expect(typeof resultRef.current?.cancelWinner).toBe('function')
    })
  })

  describe('loser가 닫히지 않은 경우 — 즉시 winner open', () => {
    it('isLoserClosing이 false이면 openWinner가 즉시 호출된다', () => {
      const { resultRef, Harness } = createHarness(() => false)
      render(createElement(Harness))

      const openWinner = vi.fn()
      act(() => { resultRef.current!.requestWinner(openWinner) })

      expect(openWinner).toHaveBeenCalledTimes(1)
    })

    it('즉시 open 후 notifyLoserFinalized를 호출해도 winner가 중복 open되지 않는다 (stale no-op)', () => {
      const { resultRef, Harness } = createHarness(() => false)
      render(createElement(Harness))

      const openWinner = vi.fn()
      act(() => { resultRef.current!.requestWinner(openWinner) })
      expect(openWinner).toHaveBeenCalledTimes(1)

      // stale notifyLoserFinalized — no winner queued
      act(() => { resultRef.current!.notifyLoserFinalized() })
      expect(openWinner).toHaveBeenCalledTimes(1)
    })
  })

  describe('loser가 닫히는 중인 경우 — winner가 큐에 대기', () => {
    it('isLoserClosing이 true이면 openWinner가 즉시 호출되지 않는다', () => {
      const { resultRef, Harness } = createHarness(() => true)
      render(createElement(Harness))

      const openWinner = vi.fn()
      act(() => { resultRef.current!.requestWinner(openWinner) })

      expect(openWinner).not.toHaveBeenCalled()
    })

    it('notifyLoserFinalized 호출 후 큐에 있던 winner가 open된다 (loser finalize 뒤 winner open)', () => {
      let loserClosing = true
      const { resultRef, Harness } = createHarness(() => loserClosing)
      render(createElement(Harness))

      const openWinner = vi.fn()
      act(() => { resultRef.current!.requestWinner(openWinner) })
      expect(openWinner).not.toHaveBeenCalled()

      // loser finalize 이벤트
      loserClosing = false
      act(() => { resultRef.current!.notifyLoserFinalized() })
      expect(openWinner).toHaveBeenCalledTimes(1)
    })

    it('notifyLoserFinalized 후 같은 winner가 두 번 open되지 않는다 (한 번만 release)', () => {
      const { resultRef, Harness } = createHarness(() => true)
      render(createElement(Harness))

      const openWinner = vi.fn()
      act(() => { resultRef.current!.requestWinner(openWinner) })

      act(() => { resultRef.current!.notifyLoserFinalized() })
      act(() => { resultRef.current!.notifyLoserFinalized() }) // stale second call

      expect(openWinner).toHaveBeenCalledTimes(1)
    })
  })

  describe('latest intent wins — 새 requestWinner가 이전 큐를 교체한다', () => {
    it('두 번 requestWinner 시 마지막 openWinner만 호출된다', () => {
      const { resultRef, Harness } = createHarness(() => true)
      render(createElement(Harness))

      const openWinner1 = vi.fn()
      const openWinner2 = vi.fn()

      act(() => { resultRef.current!.requestWinner(openWinner1) })
      act(() => { resultRef.current!.requestWinner(openWinner2) }) // latest intent wins

      act(() => { resultRef.current!.notifyLoserFinalized() })

      expect(openWinner1).not.toHaveBeenCalled()
      expect(openWinner2).toHaveBeenCalledTimes(1)
    })
  })

  describe('dismiss-cancels-queued-winner', () => {
    it('cancelWinner 후 notifyLoserFinalized를 호출해도 winner가 open되지 않는다', () => {
      const { resultRef, Harness } = createHarness(() => true)
      render(createElement(Harness))

      const openWinner = vi.fn()
      act(() => { resultRef.current!.requestWinner(openWinner) })

      // dismiss 시나리오 — queued winner 취소
      act(() => { resultRef.current!.cancelWinner() })

      // loser finalize 이후에도 winner가 열리지 않아야 한다
      act(() => { resultRef.current!.notifyLoserFinalized() })
      expect(openWinner).not.toHaveBeenCalled()
    })

    it('cancelWinner는 no-op — 큐에 winner가 없는 경우에도 오류 없이 처리된다', () => {
      const { resultRef, Harness } = createHarness(() => false)
      render(createElement(Harness))

      expect(() => {
        act(() => { resultRef.current!.cancelWinner() })
      }).not.toThrow()
    })

    it('cancelWinner 후 새 requestWinner는 다시 큐에 쌓을 수 있다', () => {
      const { resultRef, Harness } = createHarness(() => true)
      render(createElement(Harness))

      const openWinner1 = vi.fn()
      const openWinner2 = vi.fn()

      act(() => { resultRef.current!.requestWinner(openWinner1) })
      act(() => { resultRef.current!.cancelWinner() })
      // 새 winner request
      act(() => { resultRef.current!.requestWinner(openWinner2) })
      act(() => { resultRef.current!.notifyLoserFinalized() })

      expect(openWinner1).not.toHaveBeenCalled()
      expect(openWinner2).toHaveBeenCalledTimes(1)
    })
  })

  describe('엣지 케이스', () => {
    it('notifyLoserFinalized를 winner 없이 호출해도 오류 없이 처리된다', () => {
      const { resultRef, Harness } = createHarness(() => false)
      render(createElement(Harness))

      expect(() => {
        act(() => { resultRef.current!.notifyLoserFinalized() })
      }).not.toThrow()
    })

    it('isLoserClosing이 변경되어도 이미 큐에 있는 winner는 notifyLoserFinalized까지 대기한다', () => {
      // loserClosing은 큐잉 시점에만 체크된다 — 이후 변경은 영향 없음
      let loserClosing = true
      const { resultRef, Harness } = createHarness(() => loserClosing)
      render(createElement(Harness))

      const openWinner = vi.fn()
      act(() => { resultRef.current!.requestWinner(openWinner) })

      // isLoserClosing이 false로 변경되어도 이미 큐에 있으면 notifyLoserFinalized 대기
      loserClosing = false
      // winner는 아직 열리지 않아야 한다
      expect(openWinner).not.toHaveBeenCalled()

      act(() => { resultRef.current!.notifyLoserFinalized() })
      expect(openWinner).toHaveBeenCalledTimes(1)
    })
  })
})
