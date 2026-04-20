/**
 * Browser — windows family leaf component (stub)
 *
 * Public export declared in packages/ui/src/index.ts.
 * Concrete implementation is Phase 3+ work.
 *
 * Foundation contract (Phase 2):
 *   - Uses WindowFrame as shared shell owner (internal).
 *   - Chrome variant: address bar + navigation controls (leaf-specific, not shared).
 *   - Mobile hierarchy: simplified chrome / content-first reading.
 *     Address bar and control cluster simplify on mobile;
 *     content fills viewport.
 *     Desktop chrome density copy is NOT a valid mobile implementation.
 *   - Token namespace: --window-* (no --panel-* or raw literals).
 */
function Browser() {
  return null;
}

export default Browser;
