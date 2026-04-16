import { describe, it, expect } from 'vitest'
import { calculateTaskbarPlacement } from '.'

/* ── Tests ───────────────────────────────────────────────────── */

describe('calculateTaskbarPlacement', () => {
  const BASE = {
    panelWidth: 200,
    panelHeight: 300,
    viewportWidth: 1280,
    viewportHeight: 800,
  }

  describe('horizontal placement', () => {
    it('centers the panel around pointerX', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 600, pointerY: 750 })
      // x = pointerX - panelWidth / 2 = 600 - 100 = 500
      expect(result.x).toBe(500)
    })

    it('clamps x to 0 when panel would overflow left edge', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 50, pointerY: 750 })
      // x = 50 - 100 = -50 → clamped to 0
      expect(result.x).toBe(0)
    })

    it('clamps x to viewportWidth - panelWidth when panel would overflow right edge', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 1250, pointerY: 750 })
      // x = 1250 - 100 = 1150, max = 1280 - 200 = 1080 → clamped to 1080
      expect(result.x).toBe(1080)
    })

    it('places exactly at x=0 when pointerX is at left edge', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 0, pointerY: 750 })
      expect(result.x).toBe(0)
    })

    it('places at max x when pointerX is at right edge', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 1280, pointerY: 750 })
      expect(result.x).toBe(1080) // 1280 - 200
    })
  })

  describe('vertical placement', () => {
    it('places panel above the pointer origin', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 600, pointerY: 750 })
      // y = pointerY - panelHeight = 750 - 300 = 450
      expect(result.y).toBe(450)
    })

    it('clamps y to 0 when panel would overflow top edge', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 600, pointerY: 100 })
      // y = 100 - 300 = -200 → clamped to 0
      expect(result.y).toBe(0)
    })

    it('clamps y to viewportHeight - panelHeight when panel overflows bottom', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 600, pointerY: 900 })
      // y = 900 - 300 = 600, max = 800 - 300 = 500 → clamped to 500
      expect(result.y).toBe(500)
    })
  })

  describe('combined clamp', () => {
    it('clamps both x and y independently', () => {
      const result = calculateTaskbarPlacement({ ...BASE, pointerX: 10, pointerY: 10 })
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
    })
  })

  describe('edge cases', () => {
    it('handles panel exactly fitting the viewport width', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        panelWidth: 1280,
        pointerX: 640,
        pointerY: 750,
      })
      expect(result.x).toBe(0)
    })

    it('handles panel exactly fitting the viewport height', () => {
      const result = calculateTaskbarPlacement({
        ...BASE,
        panelHeight: 800,
        pointerX: 600,
        pointerY: 750,
      })
      expect(result.y).toBe(0)
    })
  })
})
