# Phase 3 Visual Compare Report

**Date:** 2026-04-16
**Reference source:** Local blog at `C:\Users\USER\Desktop\dev\blog` running on `http://localhost:3333` (Next.js dev server)
**Current source:** Storybook on `http://localhost:6006` (worktree-local, `@windows/ui`) -- `[data-visual-root]` element captures and `.w-[200px]` context-menu element captures
**Verification method:** Browser automation (agent-browser) with pixelmatch diff for all 8 cases

**Canonical compare note:** `context-panel/*` states are package-local machine regression inventory. They are NOT included in this external acceptance inventory.

---

## Approach

1. The blog was started locally (`pnpm dev` on port 3333) and browser automation (agent-browser + contextmenu event dispatch) was used to trigger and capture context menus for all 8 cases.
2. For cases 1--4 (pinned view), localStorage was seeded with 4 pinned items via `localStorage.setItem('windows', ...)` on the blog origin before page reload, so that `atomWithStorage('windows', [])` hydrated from the seeded array.
3. For case 5, the All view was opened (via the "모두" button) and the already-pinned "2025를 보내며" item was right-clicked.
4. For cases 6--8, existing reference captures from previous Phase 3 work were used.
5. All 8 cases now have a complete reference/current/diff artifact triplet with pixelmatch comparison.

### Provenance evidence

The `reference-captures/blog-provenance/` directory contains:
- `blog-homepage-full.png` -- full page screenshot of blog at localhost:3333 (Windows desktop UI visible)
- `blog-windows-panel-open.png` -- Windows panel opened
- `blog-windows-panel-with-4-pinned.png` -- Windows panel showing all 4 seeded pinned items
- `blog-pinned-2025-context-full.png` -- Full page showing context menu on first pinned item
- `blog-all-view-with-pinned.png` -- All view showing seeded pinned items in the list
- `blog-all-view.png` -- All view with blog posts listed
- `blog-search-2025.png` -- Windows panel search for "2025"
- `blog-search-panel-open.png` -- Separate Search panel opened
- `blog-search-panel-results.png` -- Search panel with query results
- `blog-context-menu-attempt.png` -- Full page showing context menu triggered in Windows panel search view
- `blog-all-view-context-menu-full.png` -- Full page showing context menu in All view
- `blog-search-panel-context-menu-full.png` -- Full page showing context menu in Search panel
- `blog-all-unpinned-context-menu.png` -- Element capture of All-view unpinned context menu (Case 6)
- `blog-windows-panel-context-search-results-reference.png` -- Element capture of search results context menu (Case 7)
- `blog-search-panel-context-menu.png` -- Element capture of Search panel context menu (Case 8)

All screenshots were taken from `http://localhost:3333` via agent-browser. The blog UI (Windows desktop wallpaper, taskbar, panel layout) is visually distinct from Storybook and confirms the captures come from the blog.

### localStorage seeding for cases 1--5

The blog stores pinned items in `localStorage` under key `'windows'` via Jotai's `atomWithStorage`. A fresh browser session has an empty array, so no pinned items are visible. To capture cases 1--4, the following data was seeded:

- `2025를 보내며` (id: `2c9c97ba-fd89-80d3-a0ba-f68739a939e0`, type: blog)
- `값과 타입 비교` (id: `seed-vt-001`, type: blog)
- `나만의 홈페이지를 만들고` (id: `seed-hp-001`, type: project)
- `데이터 타입을 공부하고` (id: `seed-dt-001`, type: blog)

The `taskbar` localStorage defaults to `['blog', 'project', 'about', 'coding']`, so all items show "작업 표시줄에서 제거" (unpin from taskbar) rather than "작업 표시줄에 고정" (pin to taskbar). This matches the Storybook fixtures (`PINNED_2025_ROWS` etc.) which use `PinOff` for the taskbar row.

---

## Blog source files analyzed

| File | Role |
|------|------|
| `blog/src/components/atoms/leftClickPanel/index.tsx` | Context menu container: `fixed p-1 bg-gray-50 rounded-md shadow-lg w-[200px] z-11 h-fit` |
| `blog/src/components/atoms/leftPanelButton/index.tsx` | Context menu row: `w-full flex items-center gap-2 text-sm text-left hover:bg-gray-200/50 rounded-md py-1 px-3` |
| `blog/src/components/molecules/taskWindowsLeftPanel/index.tsx` | Windows panel context menu (pinned/all views) -- conditional move buttons based on contextIndex |
| `blog/src/components/molecules/taskSearchLeftPanel/index.tsx` | Search context menu -- always shows run file + open folder + pin toggle + taskbar toggle |
| `blog/src/components/organisms/windowsPinnedSessions/index.tsx` | Pinned view host -- uses TaskWindowsLeftPanel with contextIndex from position |
| `blog/src/components/organisms/allSessions/index.tsx` | All view host -- uses TaskWindowsLeftPanel with contextIndex=-1 (no move buttons) |
| `blog/src/components/templates/windowsPanel/index.tsx` | Windows panel template -- search mode uses TaskSearchLeftPanel |
| `blog/src/components/organisms/searchPanel/index.tsx` | Search panel -- uses TaskSearchLeftPanel |

---

## CSS property comparison

| Property | Blog (reference) | Storybook (ContextPanel) | Delta |
|----------|-----------------|---------------------------|-------|
| Root background | `bg-gray-50` | `bg-gray-50/95 backdrop-blur-2xl` | Storybook adds 95% opacity + backdrop blur |
| Root border | none | `border border-gray-200` | Storybook adds 1px border |
| Root corners | `rounded-md` (6px) | `rounded-lg` (8px) | 2px larger radius |
| Root padding | `p-1` (4px all) | `py-1` (4px top/bottom only) | Blog has 4px left/right, Storybook has 0 |
| Root shadow | `shadow-lg` | `shadow-lg` | Same |
| Root width | `w-[200px]` | `w-[200px]` | Same |
| Row padding | `py-1 px-3` (4px/12px) | `px-3 py-1.5` (12px/6px) | Storybook rows are 2px taller |
| Row text size | `text-sm` (14px) | `text-xs` (12px) | Blog text is 2px larger |
| Row gap | `gap-2` (8px) | `gap-2` (8px) | Same |
| Row hover | `hover:bg-gray-200/50` | `hover:bg-black/5` | Different hover color |
| Row corners | `rounded-md` | none | Blog rows have rounded corners |
| Icon size | `size=16` | `size=16` (in size-4 container) | Same |
| Icon color | inherited | `text-gray-600` | Storybook constrains icon color |
| Text color | inherited | `text-gray-800` | Storybook constrains text color |

---

## Pixelmatch results (all 8 cases)

| Case | Reference | Size ref | Current | Size cur | Diff | Mismatch | Rate | Threshold | Pass |
|------|-----------|----------|---------|----------|------|----------|------|-----------|------|
| 1 | `blog-...-pinned-2025-reference.png` | 200x120 | `...-pinned-2025-ctx-current.png` | 200x122 | `diff-pinned-2025.png` | 2206 px | 9.04% | 0.2 | FAIL (pixel) |
| 2 | `blog-...-pinned-values-and-types-reference.png` | 200x148 | `...-pinned-values-and-types-ctx-current.png` | 200x150 | `diff-pinned-values-and-types.png` | 2651 px | 8.84% | 0.2 | FAIL (pixel) |
| 3 | `blog-...-pinned-homepage-reference.png` | 200x176 | `...-pinned-homepage-ctx-current.png` | 200x178 | `diff-pinned-homepage.png` | 3009 px | 8.45% | 0.2 | FAIL (pixel) |
| 4 | `blog-...-pinned-data-types-reference.png` | 200x148 | `...-pinned-data-types-ctx-current.png` | 200x150 | `diff-pinned-data-types.png` | 2506 px | 8.35% | 0.2 | FAIL (pixel) |
| 5 | `blog-...-all-pinned-2025-reference.png` | 200x92 | `...-all-pinned-2025-ctx-current.png` | 200x94 | `diff-all-pinned-2025.png` | 1703 px | 9.06% | 0.2 | FAIL (pixel) |
| 6 | `blog-all-unpinned-context-menu.png` | 200x92 | `...-all-unpinned-reference-ctx-current.png` | 200x94 | `diff-all-unpinned-reference.png` | 1637 px | 8.71% | 0.2 | FAIL (pixel) |
| 7 | `blog-...-context-search-results-reference.png` | 200x120 | `...-search-results-reference-ctx-current.png` | 200x122 | `diff-search-results-reference.png` | 2021 px | 8.28% | 0.2 | FAIL (pixel) |
| 8 | `blog-search-panel-context-menu.png` | 200x120 | `search-panel-...-ctx-current.png` | 200x122 | `diff-search-panel-context.png` | 2042 px | 8.37% | 0.2 | FAIL (pixel) |

Root cause of mismatch across all 8 cases: consistent CSS property differences between the blog `LeftClickPanel`/`LeftPanelButton` and the Storybook `ContextPanel`. See CSS property comparison table above.

All cases show +2px height difference (Storybook rows use `py-1.5` vs blog's `py-1`), and text rendering differences from `text-xs` vs `text-sm`.

---

## Row inventory verification (all 8 cases)

### windows-panel-context

| # | State | Blog source logic | Storybook fixture | Row match |
|---|-------|-------------------|-------------------|-----------|
| 1 | pinned-2025 | contextIndex=0, isFirst=true, show right only | PINNED_2025_ROWS (4 rows) | PASS |
| 2 | pinned-values-and-types | contextIndex=1, isSecond=true, show left+right | PINNED_VALUES_AND_TYPES_ROWS (5 rows) | PASS |
| 3 | pinned-homepage | contextIndex=2, middle, show front+left+right | PINNED_HOMEPAGE_ROWS (6 rows) | PASS |
| 4 | pinned-data-types | contextIndex=3, isLast=true, show front+left | PINNED_DATA_TYPES_ROWS (5 rows) | PASS |
| 5 | all-pinned-2025 | contextIndex=-1, pinned, no move buttons | ALL_PINNED_ROWS (3 rows) | PASS |
| 6 | all-unpinned-reference | contextIndex=-1, unpinned, no move buttons | ALL_UNPINNED_ROWS (3 rows) | PASS |
| 7 | search-results-reference | TaskSearchLeftPanel: run+folder+pin+taskbar | SEARCH_RESULT_CONTEXT_ROWS (4 rows) | PASS |

Browser evidence for all 7 cases: context menus captured from blog match expected row inventories.

### search-panel-context

| # | State | Blog source logic | Storybook fixture | Row match |
|---|-------|-------------------|-------------------|-----------|
| 8 | results-reference | TaskSearchLeftPanel: run+folder+pin+taskbar | SEARCH_RESULT_CONTEXT_ROWS (4 rows) | PASS |

Browser evidence: menu items read via eval matched expected rows.

---

## Icon inventory verification

| Blog icon (lucide-react) | Storybook icon (lucide-react) | Match |
|--------------------------|------------------------------|-------|
| MoveUpLeft size=16 | MoveUpLeft size=16 | PASS |
| ArrowLeft size=16 | ArrowLeft size=16 | PASS |
| ArrowRight size=16 | ArrowRight size=16 | PASS |
| FolderOpen size=16 | FolderOpen size=16 | PASS |
| PinOff size=16 | PinOff size=16 | PASS |
| Pin size=16 | Pin size=16 | PASS |
| File size=16 | File size=16 | PASS |
| Pin className="rotate-45" size=16 (taskbar pin) | Pin size=16 (no rotate-45) | NOTE |

Note: Blog applies rotate-45 to the Pin icon for the taskbar pin row. Storybook does not apply this rotation. Not visible in cases 1--5 because all items show "작업 표시줄에서 제거" (PinOff) rather than "작업 표시줄에 고정" (Pin with rotate-45).

---

## Summary

| Case | Kind | State | Row content | CSS visual | Overall |
|------|------|-------|-------------|------------|---------|
| 1 | windows-panel-context | pinned-2025 | PASS | 9.04% mismatch | PASS (content), FAIL (pixel) |
| 2 | windows-panel-context | pinned-values-and-types | PASS | 8.84% mismatch | PASS (content), FAIL (pixel) |
| 3 | windows-panel-context | pinned-homepage | PASS | 8.45% mismatch | PASS (content), FAIL (pixel) |
| 4 | windows-panel-context | pinned-data-types | PASS | 8.35% mismatch | PASS (content), FAIL (pixel) |
| 5 | windows-panel-context | all-pinned-2025 | PASS | 9.06% mismatch | PASS (content), FAIL (pixel) |
| 6 | windows-panel-context | all-unpinned-reference | PASS | 8.71% mismatch | PASS (content), FAIL (pixel) |
| 7 | windows-panel-context | search-results-reference | PASS | 8.28% mismatch | PASS (content), FAIL (pixel) |
| 8 | search-panel-context | results-reference | PASS | 8.37% mismatch | PASS (content), FAIL (pixel) |

Content verdict: All 8 cases PASS -- row text, icon identity, and conditional logic all match between blog and Storybook.

Pixel verdict: All 8 cases show 8--9% mismatch due to CSS differences between the blog LeftClickPanel/LeftPanelButton and the new ContextPanel. See CSS property comparison table for specifics. The mismatch is consistent and systematic (same root cause across all cases).

Phase 4 action items (if pixel-perfect match with blog is required):
- text-xs -> text-sm
- py-1.5 -> py-1
- rounded-lg -> rounded-md
- Remove border border-gray-200
- py-1 root -> p-1 root
- hover:bg-black/5 -> hover:bg-gray-200/50
- Add rounded-md to row buttons
- Add rotate-45 to Pin icon for taskbar pin row
