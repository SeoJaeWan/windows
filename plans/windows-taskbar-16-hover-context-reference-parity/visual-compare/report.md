# Visual Compare Report

Phase 5 — Reference Compare Report  
Generated: 2026-04-17

---

## Canonical Compare Key Inventory

| compare key | filename-safe stem |
|---|---|
| `taskbar-hover-preview/attached-multi` | `taskbar-hover-preview--attached-multi` |
| `taskbar-context-menu/attached-pinned` | `taskbar-context-menu--attached-pinned` |

Stem mapping rule: canonical key `/` → `--` (single substitution only).  
Pseudo-key variants (e.g., removing `/` without `--`) are not used.

---

## Provenance Classification

| artifact | provenance category | role |
|---|---|---|
| `taskbar-hover-preview--attached-multi-reference.png` | source-derived evidence (`C:/Users/USER/Desktop/dev/blog`) | reference — blog `#search-panel` element at runtime (hover panel open, 2 folder sessions) |
| `taskbar-hover-preview--attached-multi-current.png` | package-local current — `taskbarHoverPreview.compare.stories.tsx#CompareAttachedMulti` | current — `[data-visual-root][data-visual-kind="taskbar-hover-preview"][data-visual-state="attached-multi"]` |
| `taskbar-context-menu--attached-pinned-reference.png` | source-derived evidence (`C:/Users/USER/Desktop/dev/blog`) | reference — blog `#search-panel` element at runtime (context panel open, pinned state) |
| `taskbar-context-menu--attached-pinned-current.png` | package-local current — `taskbarContextPanel.compare.stories.tsx#CompareAttachedPinned` | current — `[data-visual-root][data-visual-kind="taskbar-context-menu"][data-visual-state="attached-pinned"]` |

---

## Diff Results

Threshold: `0.1` (general UI reference)

| compare key | ref size | current size | dimensions match | mismatch pixels | mismatch rate | verdict |
|---|---|---|---|---|---|---|
| `taskbar-hover-preview/attached-multi` | 400 × 148 | 1248 × 340 | NO | 210,108 / 424,320 | 49.52% | FAIL |
| `taskbar-context-menu/attached-pinned` | 300 × 325 | 1248 × 340 | NO | 97,595 / 424,320 | 23.00% | FAIL |

---

## Mismatch Analysis

### taskbar-hover-preview/attached-multi

Root cause: composition unit mismatch.

- reference (400 × 148): blog `#search-panel` element — floating hover panel alone, with actual session thumbnails (folder view scaled, real session titles)
- current (1248 × 340): attached-host canvas — full 720px canvas, taskbar strip, hover surface positioned above trigger

The diff image shows nearly the entire reference area is red (different content and background). The current-only area (right side, bottom) is white (padded background beyond reference bounds). The reference panel region overlaps approximately the panel area in the harness, but content differs: blog shows real session thumbnails while harness shows fixture placeholder cards.

Structural note: reference captures only the floating panel overlay. Current captures the full host composition (canvas + strip + panel). The two do not share the same composition boundary, making pixel parity structurally impossible at the full-canvas level.

### taskbar-context-menu/attached-pinned

Root cause: composition unit mismatch.

- reference (300 × 325): blog `#search-panel` element — floating context panel alone, with real content (6 blog items, 블로그, 작업 표시줄에서 제거, 모든 창 닫기)
- current (1248 × 340): attached-host canvas — full 480px canvas, taskbar strip, context panel positioned above trigger

The diff image shows the blog panel region overlaps loosely with the panel in the harness canvas. Content partially matches (both show file list, identifier row, pin row, close-all row). But background, surrounding canvas, and absolute position differ significantly.

---

## Supporting Notes

Motion and close acceptance are NOT addressed by static pixel diff. These behaviors are Phase 2–4 runtime evidence:

| behavior | evidence source |
|---|---|
| hover panel close affordance (session close + panel close) | Phase 2–4 runtime behavior test (`taskbarHoverPreview.compare.test.tsx`, `supporting-observations.md`) |
| context enter/exit motion direction (animate-task-up / animate-task-down) | Phase 2–4 runtime behavior test, `supporting-observations.md` |

Static compare in this phase covers only open rested state for both surfaces.

---

## Reproducibility

Current captures are reproducible via:

1. Start Storybook dev server from `packages/ui` on any available port
2. Open iframe URL:
   - hover: `/iframe.html?id=taskbar-compose-hoverpreview--compare-attached-multi&viewMode=story`
   - context: `/iframe.html?id=taskbar-compose-contextmenu--compare-attached-pinned&viewMode=story`
3. Wait for `[data-visual-root]` marker to appear
4. Capture: `[data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]`

Reference captures are reproducible via:

1. Start `C:/Users/USER/Desktop/dev/blog` dev server on port 3333
2. Open blog in browser, click blog taskbar icon to create 2 folder sessions (hover), or right-click to open context panel (pinned)
3. Capture `#search-panel` element

---

## Verdict Summary

Both cases FAIL at the pixel diff level due to composition unit mismatch: the reference captures the floating panel overlay from blog live, while the current captures the full attached-host canvas from the Storybook compare harness. The two provenances do not share the same composition boundary.

This mismatch is structural, not a product defect. The compare story is correctly implemented as an attached-host composition (Phase 3–4), while blog's UI renders panels as independent overlays anchored to the taskbar DOM, not as a bounded canvas.

Phase 6 action item: If pixel parity between blog reference and current is required, the reference must be re-captured at the same composition unit — either by cropping the current canvas to panel-only bounds, or by adjusting the compare harness to match blog's panel-isolation capture strategy.
