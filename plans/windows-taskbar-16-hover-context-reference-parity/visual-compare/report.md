# Visual Compare Report

Phase 6 — Final Closure Report (Rerun)
Generated: 2026-04-17 (Phase 6 rerun after CONTEXT_MENU_HEIGHT fix)
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
| taskbar-hover-preview--attached-multi-current.png | package-local current — taskbarHoverPreview.compare.stories.tsx#CompareAttachedMulti | current — data-visual-root marker (port 6014 Storybook, worktree build) |
| taskbar-context-menu--attached-pinned-reference.png | source-derived evidence (blog) | reference — blog attached-host composition region (taskbar strip + trigger icon + context panel), captured as 1280x395 rectangular crop from full viewport, letterboxed to 1248x340 |
| taskbar-context-menu--attached-pinned-current.png | package-local current — taskbarContextPanel.compare.stories.tsx#CompareAttachedPinned | current — data-visual-root marker (port 6014 Storybook, worktree build) |

### Reference Capture Method

Hover panel reference (Phase 5 original, not re-captured in Phase 6 -- Fix 2 BLOCKED):
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

## Phase 6 Diff Results (rerun)

Threshold: 0.2 (external source — different rendering environment)
Capture date: 2026-04-17 Phase 6 rerun
Storybook: http://localhost:6014 (worktree build, includes .compare.stories.tsx)

| compare key | ref size | current size | dimensions match | mismatch pixels | mismatch rate | verdict |
|---|---|---|---|---|---|---|
| taskbar-hover-preview/attached-multi | 1248 x 340 | 1248 x 340 | YES | 263,394 / 424,320 | 62.07% | FAIL |
| taskbar-context-menu/attached-pinned | 1248 x 340 | 1248 x 340 | YES | 134,010 / 424,320 | 31.58% | FAIL |

Verdict classification: visual drift (not structural mismatch).

### Before / After comparison

| compare key | Phase 5 mismatch rate | Phase 6 mismatch rate | delta |
|---|---|---|---|
| taskbar-hover-preview/attached-multi | 62.07% | 62.07% | 0.00% (reference not re-captured -- Fix 2 BLOCKED) |
| taskbar-context-menu/attached-pinned | 32.03% | 31.58% | -0.45% (CONTEXT_MENU_HEIGHT 212->241px reduced mismatch) |

---

## Mismatch Analysis

### taskbar-hover-preview/attached-multi

Mismatch rate 62.07% — visual drift:

| drift factor | reference (blog) | current (harness) | addressable |
|---|---|---|---|
| Background | Windows wallpaper + left-rail icons | Harness gradient, no icons | NO — environment difference |
| Panel anchor — trigger center offset | trigger icon at x=716 (near viewport right-center); panel x=616 — trigger-centered anchor rule | trigger icon at x=360 (bounded canvas center); panel x=60 — trigger-centered anchor rule | NO — canvas framing difference, not alignment rule drift |
| Panel size | 200x151px (1 folder session at reference time) | ~660x270px (3-item HOVER_MULTI fixture) | PARTIAL — reference captured 1 open session; harness correctly shows 3-item attached-multi state |
| Content | Real blog folder thumbnails | Fixture placeholder cards | NO — environment difference |
| Letterbox | White top/bottom padding | White right-side area | NO — canvas framing difference |
Fix 2 re-capture attempt: blog localhost revisited to capture multi-session hover state.
Two folder sessions opened (blog window x2 via taskbar-icon-blog click + file-item dblclick). Result:
1. file-item dblclick triggered Notion API runtime error (NotionContent.tsx: Cannot read properties of undefined). Session created but content failed to render.
2. Hover panel with 2 sessions: 200x150px bounds, 2 child elements (1 thumbnail + 1 placeholder div). Panel did not expand to multi-grid format.
3. Hover panel in isolation was blocked -- active folder window covered the panel region. Minimizing the folder window dropped session count to 0 (sessions removed from DOM on minimize).
4. Conclusion: multi-session hover reference re-capture not achievable in blog runtime without interactive session management outside automation boundary.

Fix 2 status: BLOCKED -- hover reference remains Phase 5 single-session capture.

### taskbar-context-menu/attached-pinned

Mismatch rate 31.58% (improved from 32.03%) — visual drift:

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

### Changes attempted but blocked

| action item | attempt | result |
|---|---|---|
| Hover reference re-capture at multi-session | Opened 2 folder sessions via blog taskbar + file-item dblclick | BLOCKED: Notion API error on content load; hover panel stayed 200x150px; panel obscured by folder window; minimize removed sessions from DOM |
| Context panel height align to ~325px | Not attempted | Blog ~325px driven by real Notion data; not achievable without fixture row count change; background drift dominates |

### Rerun compare: before vs after

| compare key | Phase 5 rate | Phase 6 rate | change |
|---|---|---|---|
| taskbar-hover-preview/attached-multi | 62.07% | 62.07% | no change (Fix 2 blocked) |
| taskbar-context-menu/attached-pinned | 32.03% | 31.58% | -0.45% (height fix applied) |

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

Current: Storybook iframe stories (CompareAttachedMulti, CompareAttachedPinned) at http://localhost:6014 (worktree Storybook, includes interactive/taskbar/storybook/.compare.stories.tsx). data-visual-root marker capture.

Note: port 6006 Storybook (main branch instance) does not include .compare.stories.tsx -- use port 6014 or a fresh Storybook build from the worktree.

Reference: Blog localhost:3333. Hover: minimize window then hover icon 1s. Context: open window then low-level right-click at (716, 775). Run crop-reference.mjs to produce final PNGs.

---

## Stem Mapping

| canonical slash key | filename-safe stem |
|---|---|
| taskbar-hover-preview/attached-multi | taskbar-hover-preview--attached-multi |
| taskbar-context-menu/attached-pinned | taskbar-context-menu--attached-pinned |

---

## Phase 6 Final Verdict

Both compare keys remain FAIL at the pixel level. Dimensions match (1248x340). Mismatch is entirely visual drift — not structural mismatch. Both sides share the same composition boundary (taskbar strip + trigger icon + panel overlay). Both sides use the trigger-centered anchor rule.

### Drift classification

| drift factor | category | resolution |
|---|---|---|
| Background environment | external environment difference | not addressable — acceptable |
| Canvas framing | bounded harness (720px) vs full blog viewport (1280px) | not addressable — composition difference, not alignment rule drift |
| Hover panel size | reference captured 1 open session; harness shows 3-item attached-multi fixture | not addressable — Fix 2 BLOCKED; hover key marked blocker: baseline re-capture pending |
| Context panel height | blog renders ~325px with real Notion data; harness ~241px with 3-row fixture | CONTEXT_MENU_HEIGHT corrected to 241px (accuracy fix applied in Phase 6); remaining gap is data-driven |
| Content data | real vs fixture | not addressable — environment difference |

### Why pixel pass is not achievable

The dominant mismatch contributors — background wallpaper, canvas framing, and content thumbnails — are inherent to the cross-environment comparison (blog full viewport vs isolated Storybook harness). No harness modification within Phase 6 boundary can eliminate these contributors.

### Final status

| compare key | Phase 5 verdict | Phase 6 verdict | Phase 6 rate |
|---|---|---|---|
| taskbar-hover-preview/attached-multi | FAIL (62.07%) | FAIL — Fix 2 BLOCKED; hover harness confirmed correct for attached-multi state; baseline re-capture pending | 62.07% |
| taskbar-context-menu/attached-pinned | FAIL (32.03%) | FAIL — CONTEXT_MENU_HEIGHT accuracy fix applied (212→241px); pixel mismatch improved (background dominant); 229 tests pass | 31.58% |

This report is the final visual status for implementation handoff.
