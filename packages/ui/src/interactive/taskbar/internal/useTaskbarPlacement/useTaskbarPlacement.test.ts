import { describe, it, expect } from 'vitest'
import { calculateTaskbarPlacement, ATTACHED_GAP } from '.'

/* ── 테스트용 헬퍼 ──────────────────────────────────────────────── */

function makeRect(
  left: number,
  top: number,
  width: number,
  height: number
): DOMRect {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect
}

/* ── Tests ───────────────────────────────────────────────────── */

describe('calculateTaskbarPlacement', () => {
  // 기본 픽스처
  // - trigger: left=576, top=748, width=48, height=40  → center x = 600
  // - surface: width=200, height=300
  // - taskbarRoot: top=758, height=40
  // - viewportWidth: 1280

  const triggerRect = makeRect(576, 748, 48, 40)
  const surfaceRect = makeRect(0, 0, 200, 300)
  const taskbarRootRect = makeRect(0, 758, 1280, 40)
  const viewportWidth = 1280

  describe('수평 배치 — trigger 중심 기준', () => {
    it('패널을 trigger 중심 x 기준으로 가로 중앙에 배치한다', () => {
      // triggerCenterX = 576 + 48/2 = 600
      // x = 600 - 200/2 = 500
      const result = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect,
        taskbarRootRect,
        viewportWidth,
      })
      expect(result.x).toBe(500)
    })

    it('패널이 왼쪽 경계를 벗어나면 x를 0으로 클램프한다', () => {
      // triggerCenterX = 10 + 48/2 = 34 → x = 34 - 100 = -66 → clamped to 0
      const result = calculateTaskbarPlacement({
        triggerRect: makeRect(10, 748, 48, 40),
        surfaceRect,
        taskbarRootRect,
        viewportWidth,
      })
      expect(result.x).toBe(0)
    })

    it('패널이 오른쪽 경계를 벗어나면 x를 viewportWidth - surfaceWidth로 클램프한다', () => {
      // triggerCenterX = 1252 + 24 = 1276 → x = 1276 - 100 = 1176, max = 1280-200 = 1080 → 1080
      const result = calculateTaskbarPlacement({
        triggerRect: makeRect(1252, 748, 48, 40),
        surfaceRect,
        taskbarRootRect,
        viewportWidth,
      })
      expect(result.x).toBe(1080)
    })

    it('trigger 중심이 왼쪽 끝에 있으면 x를 0에 배치한다', () => {
      // triggerCenterX = 0 → x = 0 - 100 = -100 → clamped to 0
      const result = calculateTaskbarPlacement({
        triggerRect: makeRect(-24, 748, 48, 40),
        surfaceRect,
        taskbarRootRect,
        viewportWidth,
      })
      expect(result.x).toBe(0)
    })

    it('surface 너비가 뷰포트와 정확히 일치할 때 x를 0으로 배치한다', () => {
      const result = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect: makeRect(0, 0, 1280, 300),
        taskbarRootRect,
        viewportWidth: 1280,
      })
      expect(result.x).toBe(0)
    })
  })

  describe('수직 배치 — taskbarRoot.top + ATTACHED_GAP 기준 부착', () => {
    it('surface 하단이 taskbarRoot.top에서 ATTACHED_GAP만큼 위에 위치한다', () => {
      // y = taskbarRootRect.top - ATTACHED_GAP - surfaceRect.height
      //   = 758 - 10 - 300 = 448
      const result = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect,
        taskbarRootRect,
        viewportWidth,
      })
      expect(result.y).toBe(taskbarRootRect.top - ATTACHED_GAP - surfaceRect.height)
    })

    it('taskbarRoot.top이 달라지면 y도 따라 바뀐다', () => {
      const tallTaskbar = makeRect(0, 800, 1280, 48)
      // y = 800 - 10 - 300 = 490
      const result = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect,
        taskbarRootRect: tallTaskbar,
        viewportWidth,
      })
      expect(result.y).toBe(800 - ATTACHED_GAP - 300)
    })

    it('surface 높이가 달라져도 y 계산에 반영된다', () => {
      const tallSurface = makeRect(0, 0, 200, 500)
      // y = 758 - 10 - 500 = 248
      const result = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect: tallSurface,
        taskbarRootRect,
        viewportWidth,
      })
      expect(result.y).toBe(taskbarRootRect.top - ATTACHED_GAP - 500)
    })

    it('surface 높이가 taskbarRoot.top보다 커도 y >= 0으로 클램프한다', () => {
      // 매우 큰 surface 높이 → 원래 y 음수지만 0으로 클램프
      // y_raw = 758 - 10 - 1000 = -252 → clamped to 0
      const hugeSurface = makeRect(0, 0, 200, 1000)
      const result = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect: hugeSurface,
        taskbarRootRect,
        viewportWidth,
      })
      expect(result.y).toBe(0)
    })

    it('y가 정확히 0이 되는 경우 0을 반환한다', () => {
      // y_raw = taskbarRootRect.top - ATTACHED_GAP - surfaceRect.height = 758 - 10 - 748 = 0
      const exactSurface = makeRect(0, 0, 200, 748)
      const result = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect: exactSurface,
        taskbarRootRect,
        viewportWidth,
      })
      expect(result.y).toBe(0)
    })
  })

  describe('x, y 동시 계산', () => {
    it('x와 y를 독립적으로 계산한다', () => {
      const result = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect,
        taskbarRootRect,
        viewportWidth,
      })
      // x = 600 - 100 = 500, y = 758 - 10 - 300 = 448
      expect(result.x).toBe(500)
      expect(result.y).toBe(448)
    })
  })

  describe('placement winner — zero-size provisional은 성공으로 허용하지 않는다 (helper owner boundary)', () => {
    it('surfaceRect.height = 0인 provisional placement는 실제 surface 측정값과 다르다', () => {
      // placement winner: zero-size provisional snap은 "opening" phase 내 임시값이다.
      // surfaceRect.height = 0 (surface 미마운트 시)로 계산한 y와 실제 height로 계산한 y는 다르다.
      // helper owner는 이 차이를 직접 증명한다 — compare/runtime이 provisional을 final로 처리하지 않는다.
      const provisionalSurface = makeRect(0, 0, 200, 0) // surface not yet mounted
      const provisionalResult = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect: provisionalSurface,
        taskbarRootRect,
        viewportWidth,
      })

      const finalResult = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect, // height=300
        taskbarRootRect,
        viewportWidth,
      })

      // provisional y = 758 - 10 - 0 = 748
      expect(provisionalResult.y).toBe(748)
      // final y = 758 - 10 - 300 = 448
      expect(finalResult.y).toBe(448)
      // must not be the same — provisional is NOT final
      expect(provisionalResult.y).not.toBe(finalResult.y)
    })

    it('surfaceRect.width = 0인 provisional x와 실제 x가 다르다', () => {
      const provisionalSurface = makeRect(0, 0, 0, 0)
      const provisionalResult = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect: provisionalSurface,
        taskbarRootRect,
        viewportWidth,
      })
      // provisional x = 600 - 0 = 600
      expect(provisionalResult.x).toBe(600)

      // final x = 600 - 100 = 500
      const finalResult = calculateTaskbarPlacement({
        triggerRect,
        surfaceRect,
        taskbarRootRect,
        viewportWidth,
      })
      expect(finalResult.x).toBe(500)
      expect(provisionalResult.x).not.toBe(finalResult.x)
    })
  })
})
