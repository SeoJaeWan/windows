# Phase 3 Visual Compare Report

**Date:** 2026-04-15
**Reference source:** Local blog at `C:\Users\USER\Desktop\dev\blog` running on `http://localhost:3333` (Next.js dev server) + blog source code analysis
**Current source:** Storybook on `http://localhost:6006` (worktree-local, `@windows/ui`) -- `[data-visual-root]` element captures and `.w-[200px]` context-menu element captures
**Verification method:** Hybrid -- browser interaction with local blog (3 cases with live screenshot evidence) + deterministic source code analysis (all 8 cases)

**Canonical compare note:** `context-panel/*` states are package-local machine regression inventory. They are NOT included in this external acceptance inventory.

---

## Approach

This report uses a **hybrid method** because:

1. The blog was started locally (`pnpm dev` on port 3333) and browser automation (agent-browser + contextmenu event dispatch) was used to trigger and capture context menus
2. The blog pinned items are stored in localStorage (`atomWithStorage`) and start empty in a fresh browser session, making pinned-view cases (1-4) impossible to capture without seeding state
3. For the All view and search views, items load from Notion API (server-side) and are available, so context menus could be triggered via programmatic contextmenu event dispatch
4. For cases that could not be captured via browser, the blog source code provides a deterministic reference (same lucide-react icons, same Tailwind classes, same conditional logic)

### Provenance evidence

The `reference-captures/blog-provenance/` directory contains:
- `blog-homepage-full.png` -- full page screenshot of blog at localhost:3333 (Windows desktop UI visible)
- `blog-windows-panel-open.png` -- Windows panel opened
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

## Pixelmatch results (browser-captured cases only)

| Case | Reference | Current | Size match | Mismatch | Rate | Threshold |
|------|-----------|---------|------------|----------|------|-----------|
| 6 | `blog-all-unpinned-context-menu.png` (200x92) | `...-ctx-current.png` (200x94) | No (+2px height) | 1637 px | 8.71% | 0.2 |
| 7 | `blog-windows-panel-context-search-results-reference.png` (200x120) | `...-ctx-current.png` (200x122) | No (+2px height) | 2021 px | 8.28% | 0.2 |
| 8 | `blog-search-panel-context-menu.png` (200x120) | `...-ctx-current.png` (200x122) | No (+2px height) | 2042 px | 8.37% | 0.2 |

Root cause of mismatch: see CSS property comparison table above.

Diff images: `diff-all-unpinned-reference.png`, `diff-search-results-reference.png`, `diff-search-panel-context.png`.

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

Browser evidence for cases 5, 6, 7: menu items read via eval matched expected rows exactly.

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

Note: Blog applies rotate-45 to the Pin icon for the taskbar pin row. Storybook does not apply this rotation.

---

## Summary

| Case | Kind | State | Row content | CSS visual | Overall |
|------|------|-------|-------------|------------|---------|
| 1 | windows-panel-context | pinned-2025 | PASS | Source analysis only | PASS (content) |
| 2 | windows-panel-context | pinned-values-and-types | PASS | Source analysis only | PASS (content) |
| 3 | windows-panel-context | pinned-homepage | PASS | Source analysis only | PASS (content) |
| 4 | windows-panel-context | pinned-data-types | PASS | Source analysis only | PASS (content) |
| 5 | windows-panel-context | all-pinned-2025 | PASS | Source analysis only | PASS (content) |
| 6 | windows-panel-context | all-unpinned-reference | PASS | 8.71% mismatch | PASS (content), FAIL (pixel) |
| 7 | windows-panel-context | search-results-reference | PASS | 8.28% mismatch | PASS (content), FAIL (pixel) |
| 8 | search-panel-context | results-reference | PASS | 8.37% mismatch | PASS (content), FAIL (pixel) |

Content verdict: All 8 cases PASS.

Pixel verdict: Cases 6, 7, 8 show 8-9% mismatch due to CSS differences between the blog LeftClickPanel/LeftPanelButton and the new ContextPanel. See CSS property comparison table for specifics.

Phase 4 action items (if pixel-perfect match with blog is required):
- text-xs -> text-sm
- py-1.5 -> py-1
- rounded-lg -> rounded-md
- Remove border border-gray-200
- py-1 root -> p-1 root
- hover:bg-black/5 -> hover:bg-gray-200/50
- Add rounded-md to row buttons
- Add rotate-45 to Pin icon for taskbar pin row
