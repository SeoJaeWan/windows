'use client'

/**
 * useReducedMotion
 *
 * Subscribes to the browser's prefers-reduced-motion media query.
 *
 * motionPreference:
 *   - "auto"    — reads the browser setting at runtime
 *   - "reduced" — always returns true (motion reduced)
 *   - "full"    — always returns false (full motion)
 *
 * Server-safe: returns false when typeof window === 'undefined'.
 */

import { useState, useEffect } from 'react'

export type MotionPreference = 'auto' | 'reduced' | 'full'

export function useReducedMotion(
  motionPreference: MotionPreference = 'auto'
): boolean {
  // "full" — never reduced
  if (motionPreference === 'full') return false
  // "reduced" — always reduced
  if (motionPreference === 'reduced') return true

  // "auto" — read from browser
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isReduced, setIsReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    if (typeof window.matchMedia !== 'function') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof window.matchMedia !== 'function') return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReduced(mq.matches)

    const handler = (e: MediaQueryListEvent) => setIsReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isReduced
}
