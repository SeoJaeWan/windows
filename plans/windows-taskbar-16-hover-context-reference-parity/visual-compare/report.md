# Visual Compare Report

Phase 5 — Reference Compare Report (Re-dispatched)
Generated: 2026-04-17

---

## Canonical Compare Key Inventory

| compare key | filename-safe stem |
|---|---|
|  |  |
|  |  |

Stem mapping rule: canonical key  to  (single substitution only).
Pseudo-key variants are not used.

---

## Provenance Classification

| artifact | provenance category | role |
|---|---|---|
|  | source-derived evidence (blog) | reference — blog attached-host composition region (taskbar strip + trigger icon + hover panel), captured as 1280x220 rectangular crop from full viewport, letterboxed to 1248x340 |
|  | package-local current — taskbarHoverPreview.compare.stories.tsx#CompareAttachedMulti | current — data-visual-root marker |
|  | source-derived evidence (blog) | reference — blog attached-host composition region (taskbar strip + trigger icon + context panel), captured as 1280x395 rectangular crop from full viewport, letterboxed to 1248x340 |
|  | package-local current — taskbarContextPanel.compare.stories.tsx#CompareAttachedPinned | current — data-visual-root marker |

### Reference Capture Method

Hover panel reference:
- Blog dev server at http://localhost:3333 (viewport 1280x800)
- Blog window opened via taskbar-icon-blog click (1 folder session), then minimized
- hover command on taskbar icon — panel opens after 1s delay
- Panel bounds: x=616, y=589.5, w=200, h=150.5; taskbar: y=750, h=50
- Crop region: x=0, y=580, w=1280, h=220
- Letterboxed to 1248x340 (scaled 1248x215, white padding top/bottom)

Context panel reference:
- Blog window opened (active, allContent loaded from server-side render)
- Low-level mouse right-click at (716, 775) via mouse move + mouse down right + mouse up right
- Panel bounds: x=566, y=415, w=300, h=325; taskbar: y=750, h=50
- Crop region: x=0, y=405, w=1280, h=395
- Letterboxed to 1248x340 (scaled 1102x340, white padding left/right)

---

## Diff Results

Threshold: 0.2 (external source — different rendering environment)

| compare key | ref size | current size | dimensions match | mismatch pixels | mismatch rate | verdict |
|---|---|---|---|---|---|---|
| taskbar-hover-preview/attached-multi | 1248 x 340 | 1248 x 340 | YES | 263,394 / 424,320 | 62.07% | FAIL |
| taskbar-context-menu/attached-pinned | 1248 x 340 | 1248 x 340 | YES | 135,889 / 424,320 | 32.03% | FAIL |

Verdict classification: visual drift (not structural mismatch).

---

## Mismatch Analysis

### taskbar-hover-preview/attached-multi

Mismatch rate 62.07% — visual drift:

| drift factor | reference (blog) | current (harness) |
|---|---|---|
| Background | Windows wallpaper + left-rail icons | Harness gradient, no icons |
| Panel position | x=616 (center of 1280px viewport) | x=70 (left-aligned) |
| Panel size | 200x151px | ~660x270px |
| Content | Real blog folder thumbnails | Fixture placeholder cards |
| Letterbox | White top/bottom padding | White right-side area |

### taskbar-context-menu/attached-pinned

Mismatch rate 32.03% — visual drift:

| drift factor | reference (blog) | current (harness) |
|---|---|---|
| Background | Wallpaper + blog window content behind panel | Harness gradient |
| Panel position | x=566, y=415 (center) | x=80, y=70 (left-aligned) |
| Panel size | 300x325px | ~390x270px |
| Content — items | Real Notion data | Fixture data |
| Footer | blog / remove-from-taskbar / close-all | blog / remove-from-taskbar / close-all |

Footer structure confirmed structurally equivalent.

---

## Supporting Notes

Motion and close acceptance are Phase 2-4 runtime evidence:

| behavior | evidence source |
|---|---|
| hover panel close affordance | Phase 2-4 runtime behavior test |
| context enter/exit motion direction | Phase 2-4 runtime behavior test |

---

## Reproducibility

Current: Storybook iframe stories (CompareAttachedMulti, CompareAttachedPinned), data-visual-root marker capture.

Reference: Blog localhost:3333. Hover: minimize window then hover icon 1s. Context: open window then low-level right-click at (716, 775). Run crop-reference.mjs to produce final PNGs.

---

## Stem Mapping

| canonical slash key | filename-safe stem |
|---|---|
| taskbar-hover-preview/attached-multi | taskbar-hover-preview--attached-multi |
| taskbar-context-menu/attached-pinned | taskbar-context-menu--attached-pinned |

---

## Verdict Summary

Both cases FAIL. Dimensions match (1248x340). Mismatch is visual drift, not structural mismatch. Both sides share the same composition boundary (taskbar strip + trigger icon + panel overlay).

Drift causes: background environment difference, panel anchor position, content data (real vs fixture), panel size.

Phase 6 action items:
- Panel size: Align harness hover panel to 200px width matching blog constraint.
- Fixture data: Replace placeholder cards with representative fixture shape.
- Panel position: Consider centering trigger icon to match blog center-of-taskbar placement.
- Background drift: acceptable as environment difference.
