# Visual Compare Report

Phase 6 — Final Closure Report
Generated: 2026-04-17
(Phase 5 original: 2026-04-17)

---

## Canonical Compare Key Inventory

| compare key | filename-safe stem |
|---|---|
| taskbar-hover-preview/attached-multi | taskbar-hover-preview--attached-multi |
| taskbar-context-menu/attached-pinned | taskbar-context-menu--attached-pinned |

Stem mapping rule: canonical key `/` → `--` (single substitution only).
Pseudo-key variants are not used.

---

## Provenance Classification

| artifact | provenance category | role |
|---|---|---|
| taskbar-hover-preview--attached-multi-reference.png | source-derived evidence (blog) | reference — blog attached-host composition region (taskbar strip + trigger icon + hover panel), captured as 1280x220 rectangular crop from full viewport, letterboxed to 1248x340 |
| taskbar-hover-preview--attached-multi-current.png | package-local current — taskbarHoverPreview.compare.stories.tsx#CompareAttachedMulti | current — data-visual-root marker |
| taskbar-context-menu--attached-pinned-reference.png | source-derived evidence (blog) | reference — blog attached-host composition region (taskbar strip + trigger icon + context panel), captured as 1280x395 rectangular crop from full viewport, letterboxed to 1248x340 |
| taskbar-context-menu--attached-pinned-current.png | package-local current — taskbarContextPanel.compare.stories.tsx#CompareAttachedPinned | current — data-visual-root marker |

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

## Phase 5 Diff Results (baseline)

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

| drift factor | reference (blog) | current (harness) | addressable |
|---|---|---|---|
| Background | Windows wallpaper + left-rail icons | Harness gradient, no icons | NO — environment difference |
| Panel anchor — trigger center offset | trigger icon at x=716 (near viewport right-center); panel x=616 — trigger-centered anchor rule | trigger icon at x=360 (bounded canvas center); panel x=60 — trigger-centered anchor rule | NO — canvas framing difference, not alignment rule drift |
| Panel size | 200x151px (1 session captured) | ~660x270px (3-item HOVER_MULTI fixture) | PARTIAL — reference captured 1 open session; harness shows 3-item attached-multi state. Harness correctly represents "attached-multi". Reference baseline limitation: only 1 session was open at capture time. |
| Content | Real blog folder thumbnails | Fixture placeholder cards | NO — environment difference |
| Letterbox | White top/bottom padding | White right-side area | NO — canvas framing difference |

### taskbar-context-menu/attached-pinned

Mismatch rate 32.03% — visual drift:

| drift factor | reference (blog) | current (harness) | addressable |
|---|---|---|---|
| Background | Wallpaper + blog window content behind panel | Harness gradient | NO — environment difference |
| Panel anchor — trigger center offset | trigger icon at x=716 (near viewport right-center); panel x=566 — trigger-centered via calculateTaskbarPlacement | trigger icon at x=360 (bounded canvas center) — trigger-centered via calculateTaskbarPlacement | NO — canvas framing difference, not alignment rule drift |
| Panel size | 300x325px | ~390x241px | PARTIAL — CONTEXT_MENU_HEIGHT corrected 212→241px (Phase 6 accuracy fix). Blog ~325px driven by real Notion data; not achievable without real data. |
| Content — items | Real Notion data | Fixture data | NO — environment difference |
| Footer | blog / remove-from-taskbar / close-all | blog / remove-from-taskbar / close-all | structurally equivalent (confirmed Phase 5) |

Footer structure confirmed structurally equivalent.

---

## Phase 6 Targeted Validation

### Changes applied

| file | change | rationale |
|---|---|---|
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanelCompareHarness.tsx` | `CONTEXT_MENU_HEIGHT` corrected 212px → 241px | Row-derived height re-calculation: py-2(16px) + header(24px) + 3 appRows×32px(96px) + divider(9px) + appIdentifier(32px) + pin(32px) + close-all(32px) = 241px. Prior value underestimated header height and row padding. |

### Changes not applied

| action item | reason |
|---|---|
| Hover panel size: align to ~200px | Reference captured 1 open session; harness correctly shows 3-item "attached-multi" state. Changing to HOVER_SINGLE would conflict with "attached-multi" baseline key semantic. |
| Context panel height: align to ~325px | Blog ~325px driven by real Notion data. Not achievable without fixture row count change. Background drift dominates mismatch regardless. |
| Fixture content: representative shape | Optional per Phase 5 report. Not applied — background drift is the dominant mismatch contributor. |

### Targeted validation result

All 229 unit tests pass after CONTEXT_MENU_HEIGHT correction:
- `src/interactive/taskbar/storybook/taskbarContextPanel.compare.test.tsx` — all pass
- `src/interactive/taskbar/storybook/taskbarHoverPreview.compare.test.tsx` — all pass
- `src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx` — all pass

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

## Phase 6 Final Verdict

**Explicit no-op closure.**

Both compare keys remain FAIL at the pixel level. Dimensions match (1248x340). Mismatch is entirely visual drift — not structural mismatch. Both sides share the same composition boundary (taskbar strip + trigger icon + panel overlay). Both sides use the trigger-centered anchor rule.

### Drift classification

| drift factor | category | resolution |
|---|---|---|
| Background environment | external environment difference | not addressable — acceptable |
| Canvas framing | bounded harness (720px) vs full blog viewport (1280px) | not addressable — composition difference, not alignment rule drift |
| Hover panel size | reference captured 1 open session; harness shows 3-item attached-multi fixture | not addressable without changing "attached-multi" baseline key semantic |
| Context panel height | blog renders ~325px with real Notion data; harness ~241px with 3-row fixture | CONTEXT_MENU_HEIGHT corrected to 241px (accuracy fix applied in Phase 6); remaining gap is data-driven |
| Content data | real vs fixture | not addressable — environment difference |

### Why pixel pass is not achievable

The dominant mismatch contributors — background wallpaper, canvas framing, and content thumbnails — are inherent to the cross-environment comparison (blog full viewport vs isolated Storybook harness). No harness modification within Phase 6 boundary can eliminate these contributors.

### Final status

| compare key | Phase 5 verdict | Phase 6 verdict |
|---|---|---|
| taskbar-hover-preview/attached-multi | FAIL (62.07%) | FAIL — explicit no-op closure; hover harness confirmed correct for "attached-multi" state |
| taskbar-context-menu/attached-pinned | FAIL (32.03%) | FAIL — CONTEXT_MENU_HEIGHT accuracy fix applied (212→241px); pixel mismatch unchanged (background dominant); 229 tests pass |

This report is the final visual status for implementation handoff.
