import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createElement, createRef, type ReactNode, type RefObject } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'

// Required for React's act() to work in jsdom
// @ts-expect-error global flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { useTaskbarSurfaceController } from '.'
import type {
  TaskbarSurfaceControllerOptions,
  TaskbarSurfaceControllerResult,
} from '.'

/* ── Harness ─────────────────────────────────────────────────── */

function createHarness(options?: TaskbarSurfaceControllerOptions) {
  const resultRef: { current: TaskbarSurfaceControllerResult | null } = {
    current: null,
  }

  function Harness({ opts }: { opts?: TaskbarSurfaceControllerOptions }) {
    const result = useTaskbarSurfaceController(opts)
    resultRef.current = result
    return null
  }

  return { resultRef, Harness, options }
}

/* ── DOM 픽스처 헬퍼 ─────────────────────────────────────────── */

function makeDomEl(rect: Partial<DOMRect> = {}) {
  const el = document.createElement('div')
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    left: rect.left ?? 0,
    top: rect.top ?? 0,
    width: rect.width ?? 0,
    height: rect.height ?? 0,
    right: (rect.left ?? 0) + (rect.width ?? 0),
    bottom: (rect.top ?? 0) + (rect.height ?? 0),
    x: rect.left ?? 0,
    y: rect.top ?? 0,
    toJSON: () => ({}),
  } as DOMRect)
  document.body.appendChild(el)
  return el
}

function makeTriggerRef(rect: Partial<DOMRect> = {}): RefObject<HTMLElement | null> {
  const el = makeDomEl(rect)
  return { current: el } as RefObject<HTMLElement | null>
}

function makeTaskbarRootRef(rect: Partial<DOMRect> = {}): RefObject<HTMLElement | null> {
  const el = makeDomEl(rect)
  return { current: el } as RefObject<HTMLElement | null>
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
  vi.restoreAllMocks()
  // Remove any stray elements added during tests
  document
    .querySelectorAll('body > div:not(#root)')
    .forEach((el) => el.parentNode?.removeChild(el))
})

function render(ui: ReactNode) {
  act(() => {
    root.render(ui)
  })
}

/* ── Tests ───────────────────────────────────────────────────── */

describe('useTaskbarSurfaceController', () => {
  describe('초기 상태', () => {
    it('마운트 직후 isOpen이 false다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(resultRef.current?.isOpen).toBe(false)
    })

    it('초기 phase가 "opening"이다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(resultRef.current?.phase).toBe('opening')
    })

    it('open, close, onEnterComplete, onExitComplete를 함수로 노출한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(typeof resultRef.current?.open).toBe('function')
      expect(typeof resultRef.current?.close).toBe('function')
      expect(typeof resultRef.current?.onEnterComplete).toBe('function')
      expect(typeof resultRef.current?.onExitComplete).toBe('function')
    })

    it('surfaceRef를 callback ref 함수로 노출한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      expect(typeof resultRef.current?.surfaceRef).toBe('function')
    })
  })

  describe('explicit ref input contract', () => {
    it('triggerRef.current가 null이면 warn + no-op (isOpen 변화 없음)', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const nullTriggerRef = createRef<HTMLElement>()
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(nullTriggerRef, taskbarRootRef)
      })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('triggerRef.current is null')
      )
    })

    it('taskbarRootRef.current가 null이면 warn + no-op (isOpen 변화 없음)', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const nullTaskbarRef = createRef<HTMLElement>()

      act(() => {
        resultRef.current!.open(triggerRef, nullTaskbarRef)
      })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('taskbarRootRef.current is null')
      )
    })
  })

  describe('opening 단계 — measured-open gate', () => {
    it('open() 호출 후 isOpen이 true가 된다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      expect(resultRef.current?.isOpen).toBe(true)
    })

    it('open() 호출 후 phase가 "opening"이다 — 즉시 "open"으로 덮어쓰지 않는다', () => {
      // measured-open gate: opening→open 전환은 root enter animationend(onEnterComplete) 이후에만 일어난다.
      // setPhase('opening')과 setPhase('open')을 같은 call stack에서 호출하지 않는다.
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      expect(resultRef.current?.phase).toBe('opening')
    })

    it('onEnterComplete() 호출 후 phase가 "open"이 된다 — root enter animation boundary 확인', () => {
      // opening→open 전환은 root enter animationend(onEnterComplete) 이후에만 일어난다.
      // 이것이 same mounted root의 enter animation boundary rule이다.
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.phase).toBe('opening')

      act(() => {
        resultRef.current!.onEnterComplete()
      })

      expect(resultRef.current?.phase).toBe('open')
    })

    it('open() 호출 시 measured rect 기반으로 placement를 계산한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      // trigger: left=576, width=48 → centerX=600
      // surface: not mounted → width=0 → x = 600 - 0 = 600, clamped to min(600, 1280-0)=600
      // taskbarRoot: top=758, height=40
      // y = 758 - 10 - 0 = 748 (surfaceRect.height=0 since not mounted)
      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      // With surface not mounted → surfaceRect height = 0
      // y = 758 - 10 - 0 = 748
      expect(resultRef.current?.placement.y).toBe(748)
    })

    it('zero-size 초기 placement는 최종 배치가 아니다 — surfaceRef 연결 후 갱신된다 (provisional no-op)', () => {
      // zero-size provisional placement: surface가 아직 마운트되지 않아 surfaceWidth=0, surfaceHeight=0인
      // 초기 open() placement는 성공적인 최종 배치로 처리하지 않는다.
      // surfaceRef callback이 실제 element와 함께 호출되면 placement가 자동 갱신된다.
      // unit owner: zero-size provisional은 "opening" phase 내 임시값이며 compare/runtime이 이를 성공으로
      // 허용하지 않는다 — 최종 배치는 surfaceRef 연결 후 측정값이다.
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      // provisional: surface not mounted → height=0 → y=748 (placeholder)
      const provisionalY = resultRef.current!.placement.y
      expect(provisionalY).toBe(748)

      // surface가 마운트되면 갱신된 실측값으로 교체된다
      const surfaceEl = makeDomEl({ left: 0, top: 0, width: 200, height: 300 })
      act(() => {
        resultRef.current!.surfaceRef(surfaceEl)
      })

      // final measured placement differs from provisional: y = 758 - 10 - 300 = 448
      const finalY = resultRef.current!.placement.y
      expect(finalY).toBe(448)
      expect(finalY).not.toBe(provisionalY)
    })
  })

  describe('surface callback ref — 자동 placement 재계산', () => {
    it('surface callback ref가 element와 함께 호출되면 primitive가 자동으로 measured rect 기준으로 placement를 갱신한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      // trigger: left=576, width=48 → centerX=600
      // taskbarRoot: top=758, width=1280
      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      // surface not yet mounted — open() uses zero-size placeholder
      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      // With surfaceRef not yet called → surfaceRect height=0
      // Initial y = 758 - 10 - 0 = 748
      expect(resultRef.current?.placement.y).toBe(748)

      // Now simulate surface mounting with actual dimensions (width=200, height=300)
      const surfaceEl = makeDomEl({ left: 0, top: 0, width: 200, height: 300 })
      act(() => {
        // Fire the callback ref with the real element — primitive auto-remeasures
        resultRef.current!.surfaceRef(surfaceEl)
      })

      // After re-measure: x = 600 - 200/2 = 500, y = 758 - 10 - 300 = 448
      expect(resultRef.current?.placement.x).toBe(500)
      expect(resultRef.current?.placement.y).toBe(448)
    })

    it('surface callback ref가 null로 호출되면 stored element를 정리하지만 자동 close는 하지 않는다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)
      expect(resultRef.current?.phase).toBe('opening')

      // Advance to open phase via onEnterComplete
      act(() => {
        resultRef.current!.onEnterComplete()
      })
      expect(resultRef.current?.phase).toBe('open')

      // Assign an element first
      const surfaceEl = makeDomEl({ left: 0, top: 0, width: 200, height: 300 })
      act(() => {
        resultRef.current!.surfaceRef(surfaceEl)
      })

      const phaseBeforeUnmount = resultRef.current?.phase

      // Now unmount: callback ref fires with null
      act(() => {
        resultRef.current!.surfaceRef(null)
      })

      // phase should remain unchanged — no auto-close on unmount
      expect(resultRef.current?.phase).toBe(phaseBeforeUnmount)
      expect(resultRef.current?.isOpen).toBe(true)
    })

    it('open() 전에 callback ref가 호출되면 placement 재계산을 하지 않는다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      // Fire callback ref before open() — no pending measurement
      const surfaceEl = makeDomEl({ left: 0, top: 0, width: 200, height: 300 })
      act(() => {
        resultRef.current!.surfaceRef(surfaceEl)
      })

      // placement should remain at initial value (0, 0) since open() was never called
      expect(resultRef.current?.placement.x).toBe(0)
      expect(resultRef.current?.placement.y).toBe(0)
    })

    it('surface가 이미 mounted된 상태에서 open()을 호출하면 즉시 measured rect를 사용한다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      // Pre-mount the surface (e.g. surface stays in DOM between opens)
      const surfaceEl = makeDomEl({ left: 0, top: 0, width: 200, height: 300 })
      act(() => {
        resultRef.current!.surfaceRef(surfaceEl)
      })

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      // Surface was already mounted when open() was called → no pending measurement
      // x = 600 - 200/2 = 500, y = 758 - 10 - 300 = 448
      expect(resultRef.current?.placement.x).toBe(500)
      expect(resultRef.current?.placement.y).toBe(448)
    })
  })

  describe('open → closing 경로', () => {
    it('close() 호출 후 phase가 "closing"이 된다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      // Confirm opening→open via root enter boundary
      act(() => {
        resultRef.current!.onEnterComplete()
      })

      act(() => {
        resultRef.current!.close()
      })

      expect(resultRef.current?.phase).toBe('closing')
      expect(resultRef.current?.isOpen).toBe(true)
    })

    it('onExitComplete 호출 후 isOpen이 false가 되고 phase가 "opening"으로 리셋된다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      act(() => {
        resultRef.current!.onEnterComplete()
      })
      act(() => {
        resultRef.current!.close()
      })
      act(() => {
        resultRef.current!.onExitComplete()
      })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(resultRef.current?.phase).toBe('opening')
    })

    it('중복 close() 요청은 no-op이다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      act(() => {
        resultRef.current!.onEnterComplete()
      })
      act(() => {
        resultRef.current!.close()
      })
      expect(resultRef.current?.phase).toBe('closing')

      // 두 번째 close는 no-op
      act(() => {
        resultRef.current!.close()
      })
      expect(resultRef.current?.phase).toBe('closing')
    })

    it('opening 단계에서도 close()를 호출하면 closing으로 전환된다', () => {
      // close()가 opening 단계에서도 동작해야 한다 (enter animation 중 닫기 요청).
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.phase).toBe('opening')

      act(() => {
        resultRef.current!.close()
      })

      expect(resultRef.current?.phase).toBe('closing')
    })

    it('closing 중 onEnterComplete 호출은 무시된다 — stale enter no-op', () => {
      // closing 중에는 onEnterComplete가 phase를 "open"으로 바꾸지 않는다.
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      act(() => {
        resultRef.current!.close()
      })
      expect(resultRef.current?.phase).toBe('closing')

      // stale onEnterComplete — closing 중이므로 무시
      act(() => {
        resultRef.current!.onEnterComplete()
      })

      expect(resultRef.current?.phase).toBe('closing')
    })
  })

  describe('reduced motion 즉시 finalize', () => {
    it('reduced motion에서 open() 직후 phase가 "open"이다 — opening 단계를 건너뛴다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { opts: { motionPreference: 'reduced' } }))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      expect(resultRef.current?.isOpen).toBe(true)
      expect(resultRef.current?.phase).toBe('open')
    })

    it('reduced motion에서 close() 직후 isOpen이 false가 된다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { opts: { motionPreference: 'reduced' } }))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        resultRef.current!.close()
      })

      expect(resultRef.current?.isOpen).toBe(false)
      expect(resultRef.current?.phase).toBe('opening')
    })

    it('reduced motion에서 onExitComplete 호출 없이도 finalize가 완료된다', () => {
      const onFinalize = vi.fn()
      const { resultRef, Harness } = createHarness()
      render(
        createElement(Harness, {
          opts: { motionPreference: 'reduced', onFinalize },
        })
      )

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      act(() => {
        resultRef.current!.close()
      })

      // onExitComplete를 호출하지 않아도 onFinalize가 불려야 한다
      expect(onFinalize).toHaveBeenCalledTimes(1)
    })
  })

  describe('session winner — reopen이 stale closing finalize를 덮어쓰지 않는다', () => {
    it('close 후 open을 다시 호출하면 "세션 winner"가 바뀐다 — isOpen이 true를 유지한다', () => {
      // session winner: 같은 세션에서 latest intent(reopen)가 stale finalize를 무효화한다.
      // unit owner: must not happen — stale finalize reopen overwrite는 유효하지 않다.
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => { resultRef.current!.open(triggerRef, taskbarRootRef) })
      act(() => { resultRef.current!.close() })
      // latest intent: reopen before stale finalize
      act(() => { resultRef.current!.open(triggerRef, taskbarRootRef) })
      expect(resultRef.current?.isOpen).toBe(true)

      // stale onExitComplete from previous close — must not close the session
      act(() => { resultRef.current!.onExitComplete() })

      // winner is the reopen session: isOpen must remain true
      expect(resultRef.current?.isOpen).toBe(true)
    })
  })

  describe('stale closing completion은 reopen 이후 무효', () => {
    it('close() 후 open()을 다시 호출하면 이후 onExitComplete는 무시된다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      // 열기
      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)

      // 닫기 시작
      act(() => {
        resultRef.current!.close()
      })
      expect(resultRef.current?.phase).toBe('closing')

      // 애니메이션 완료 전 다시 열기 (latest intent wins)
      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)
      // opening phase로 시작 (full motion)
      expect(resultRef.current?.phase).toBe('opening')

      // stale onExitComplete — 무시되어야 한다
      act(() => {
        resultRef.current!.onExitComplete()
      })

      // 여전히 열려 있어야 한다
      expect(resultRef.current?.isOpen).toBe(true)
      expect(resultRef.current?.phase).toBe('opening')
    })

    it('close() 후 open() 후 onEnterComplete()로 open phase에 진입 가능하다', () => {
      // stale closing 이후 reopen 시 enter animation boundary가 정상 동작함을 검증
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      act(() => {
        resultRef.current!.close()
      })
      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.phase).toBe('opening')

      act(() => {
        resultRef.current!.onEnterComplete()
      })

      expect(resultRef.current?.phase).toBe('open')
    })
  })

  describe('onFinalize 콜백', () => {
    it('full motion에서 onExitComplete 후 onFinalize가 호출된다', () => {
      const onFinalize = vi.fn()
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { opts: { onFinalize } }))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      act(() => {
        resultRef.current!.onEnterComplete()
      })
      act(() => {
        resultRef.current!.close()
      })
      act(() => {
        resultRef.current!.onExitComplete()
      })

      expect(onFinalize).toHaveBeenCalledTimes(1)
    })

    it('열린 상태에서 close() 없이 onExitComplete를 호출해도 onFinalize가 불리지 않는다', () => {
      const onFinalize = vi.fn()
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, { opts: { onFinalize } }))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      // close() 없이 onExitComplete 호출 — no-op
      act(() => {
        resultRef.current!.onExitComplete()
      })

      expect(onFinalize).not.toHaveBeenCalled()
      expect(resultRef.current?.isOpen).toBe(true)
    })
  })

  describe('document dismiss — Escape 키', () => {
    it('패널이 열린 상태에서 Escape를 누르면 닫힌다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      })

      expect(resultRef.current?.phase).toBe('closing')
    })

    it('패널이 닫힌 상태에서 Escape를 눌러도 아무 일도 없다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(false)
    })
  })

  describe('document dismiss — outside pointerdown', () => {
    it('surface 외부 pointerdown 시 닫힌다', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })

      act(() => {
        document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.phase).toBe('closing')
    })

    it('trigger 요소 내부 pointerdown은 닫히지 않는다 (whitelist)', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerEl = makeDomEl({ left: 576, top: 748, width: 48, height: 40 })
      const triggerRef = { current: triggerEl } as RefObject<HTMLElement | null>
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        triggerEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(true)
    })

    it('surfaceRef가 등록된 요소 내부 pointerdown은 닫히지 않는다 (whitelist)', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)

      // callback ref로 surface 요소 등록
      const surfaceEl = document.createElement('div')
      document.body.appendChild(surfaceEl)
      act(() => {
        resultRef.current!.surfaceRef(surfaceEl)
      })

      act(() => {
        surfaceEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(true)
    })

    it('taskbarRoot 요소 내부 pointerdown은 닫히지 않는다 (whitelist)', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootEl = makeDomEl({ top: 758, height: 40, width: 1280 })
      const taskbarRootRef = { current: taskbarRootEl } as RefObject<HTMLElement | null>

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      expect(resultRef.current?.isOpen).toBe(true)

      act(() => {
        taskbarRootEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(true)
    })
  })

  describe('세션 활성 중에만 document listener 유지', () => {
    it('close + onExitComplete 후 Escape를 눌러도 닫히지 않는다 (listener 정리됨)', () => {
      const { resultRef, Harness } = createHarness()
      render(createElement(Harness, {}))

      const triggerRef = makeTriggerRef({ left: 576, top: 748, width: 48, height: 40 })
      const taskbarRootRef = makeTaskbarRootRef({ top: 758, height: 40, width: 1280 })

      act(() => {
        resultRef.current!.open(triggerRef, taskbarRootRef)
      })
      act(() => {
        resultRef.current!.onEnterComplete()
      })
      act(() => {
        resultRef.current!.close()
      })
      act(() => {
        resultRef.current!.onExitComplete()
      })
      expect(resultRef.current?.isOpen).toBe(false)

      // listener가 정리됐으므로 Escape는 no-op
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      })

      expect(resultRef.current?.isOpen).toBe(false)
    })
  })
})
