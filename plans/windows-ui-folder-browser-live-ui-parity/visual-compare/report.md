# Visual Compare Report - Phase 3

capture date: 2026-04-17
phase: 03-reference-compare-report
recapture: per-case viewport fix applied (Gap 1 closed); inner owner metadata assertion added (Gap A closed); report provenance updated (Gap B closed)

## Provenance

| side | source | method |
|------|--------|--------|
| baseline (reference) | external-source evidence - live seojaewan.com | Phase 1 baseline captures |
| current | package-local current - worktree Storybook port 6100 | capture-current.mjs via package-owned stage marker + inner owner metadata assertion |

### Full capture contract

**Stage selector (package-owned, non-winning consumer attrs):**

The capture selector is `[data-window-compare-stage="desktop"]` or `[data-window-compare-stage="mobile"]` depending on the case. This attribute is owned by `CompareWindowDesktopStage` / `CompareWindowMobileStage` inside `packages/ui`. Consumer-supplied `data-*` attributes are stripped or are non-winning in spread order; the capture selector reads only the package-owned reserved marker. Consumer host attrs cannot change which element is captured.

**Inner owner metadata (`[data-visual-root][data-visual-kind][data-visual-state]`):**

Inside the stage element, `CompareRoot` (in `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`) renders a single child element with all three attributes:

- `data-visual-root` — marks the package-owned compare identity boundary
- `data-visual-kind` — canonical kind token (e.g. `"folder"`, `"browser"`)
- `data-visual-state` — canonical state token (e.g. `"desktop-blog"`, `"mobile-blog"`, `"desktop-article"`, `"mobile-article"`)

**Assertion performed before every screenshot:**

`capture-current.mjs` uses `agent-browser eval` to query the live DOM immediately after the page loads and before calling `screenshot`. For each case the script:

1. finds `[data-window-compare-stage="<stageAttr>"] [data-visual-root]` inside the stage
2. asserts exactly ONE such element exists — aborts if zero or more than one
3. asserts `data-visual-kind` equals the expected kind for the canonical key
4. asserts `data-visual-state` equals the expected state for the canonical key
5. aborts with a clear error message if any assertion fails, so no mislabeled PNG can be produced

This means the PNG name `{kind}-{state}-current.png` is backed by the inner owner metadata read directly from the package-owned `CompareRoot` element. A mislabeled story or a duplicated `[data-visual-root]` would abort the script before any PNG is written.

**Key to surface binding (reconstructable from this report alone):**

| canonical key | storyId | stageAttr | expected kind | expected state |
|---------------|---------|-----------|---------------|----------------|
| folder/desktop-blog | windows-folder--compare-desktop-blog | desktop | folder | desktop-blog |
| folder/mobile-blog | windows-folder--compare-mobile-blog | mobile | folder | mobile-blog |
| browser/desktop-article | windows-browser--compare-desktop-article | desktop | browser | desktop-article |
| browser/mobile-article | windows-browser--compare-mobile-article | mobile | browser | mobile-article |

Viewport rule (per-case): desktop cases use 1280x800; mobile cases use 390x820 (browser viewport below the md breakpoint, wide enough to hold the 390x794 stage). This ensures Tailwind responsive classes (hidden md:flex, grid-cols-2 lg:grid-cols-3) activate at the correct breakpoint for each case.

Threshold: 0.2 (external vs package-local rendering environment).

---

## Canonical State Results

| state key | ref size | cur size | size match | mismatch | passed |
|-----------|----------|----------|------------|----------|--------|
| folder/desktop-blog | 1280x750 | 1280x750 | yes | 15.65% | FAIL |
| folder/mobile-blog | 390x794 | 390x794 | yes | 18.14% | FAIL |
| browser/desktop-article | 1280x750 | 1280x750 | yes | 15.89% | FAIL |
| browser/mobile-article | 390x794 | 390x794 | yes | 15.74% | FAIL |

All 4 states: FAIL (mismatch 15-18%, threshold 1%)

---

## Artifact Inventory

All artifacts follow {kind}-{state}-{reference|current|diff}.png key naming.

| artifact | path |
|----------|------|
| folder/desktop-blog reference | visual-compare/folder-desktop-blog-reference.png |
| folder/desktop-blog current | visual-compare/folder-desktop-blog-current.png |
| folder/desktop-blog diff | visual-compare/folder-desktop-blog-diff.png |
| folder/mobile-blog reference | visual-compare/folder-mobile-blog-reference.png |
| folder/mobile-blog current | visual-compare/folder-mobile-blog-current.png |
| folder/mobile-blog diff | visual-compare/folder-mobile-blog-diff.png |
| browser/desktop-article reference | visual-compare/browser-desktop-article-reference.png |
| browser/desktop-article current | visual-compare/browser-desktop-article-current.png |
| browser/desktop-article diff | visual-compare/browser-desktop-article-diff.png |
| browser/mobile-article reference | visual-compare/browser-mobile-article-reference.png |
| browser/mobile-article current | visual-compare/browser-mobile-article-current.png |
| browser/mobile-article diff | visual-compare/browser-mobile-article-diff.png |

---

## Drift Classification

### folder/desktop-blog - 15.65% mismatch

Structural blocking drift (FAIL):
- thinner chrome / titlebar geometry: current renders window chrome with three window control buttons (Subtract / SquareMultiple / Dismiss via window-frame-controls) and a folder icon in the titlebar. The buttons ARE present in current; the blocker is that current titlebar height and button visual weight are thinner/smaller than the baseline chrome. This is a thinner chrome / titlebar height blocking mismatch.
- back/forward and address bar geometry: current renders back/forward arrow buttons and an address label in a second bar below the titlebar. The height, padding, and vertical spacing of this address bar area differ from the baseline nav chrome geometry.
- desktop sidebar hierarchy: current renders a sidebar tree panel (hidden md:flex, visible at 1280px) with expand/collapse toggle arrows and pl-7 indented child rows. Sidebar structure is present and correct. The drift is in visual weight, font size, and spacing compared to the baseline sidebar -- not a missing sidebar.
- item tile ratio and tile density: current cards use aspect-video thumbnails with p-3 inner padding and gap-3 between cards. Baseline card thumbnails have a different aspect ratio and card body has different padding geometry. Card height and text clipping differ.
- desktop 3-column structure: both reference and current render 3 columns (lg:grid-cols-3 at 1280px). Column count is aligned; tile ratio and density are the blocking mismatch source.

Documentary-only drift (pass):
- exact blog post titles, summary copy, thumbnail artwork, per-post metadata differ between live baseline and current fixture data. Out of compare scope per baseline-inventory.

---

### folder/mobile-blog - 18.14% mismatch

Note: this state was previously captured with a 1280px browser viewport, causing md: breakpoints to be active and producing an incorrect mobile capture. This recapture uses a 390px browser viewport, correctly placing the render below the md breakpoint.

Structural blocking drift (FAIL):
- item tile ratio and tile density: current cards use aspect-video thumbnails at 2-column width with p-3 inner body padding. Diff shows widespread mismatch across all card regions -- thumbnail aspect ratio, card body height, and text truncation geometry differ from the baseline tile proportions. This is the primary blocking mismatch source.
- thinner chrome / titlebar buttons: window control buttons (Subtract / SquareMultiple / Dismiss) are present in current at mobile viewport. Chrome height and button sizing differ from the baseline compact mobile chrome geometry.

Resolved (no longer blocking after viewport fix):
- mobile sidebar collapse policy: at 390px browser viewport, the hidden md:flex sidebar is correctly hidden. Current shows no sidebar panel -- aligned with baseline. No sidebar collapse blocker.
- mobile 2-column structure: current renders 2 columns (grid-cols-2 at 390px, below lg breakpoint). Baseline also shows 2-column layout. Column count is aligned.

Documentary-only drift (pass):
- exact thumbnail artwork, post titles, summary copy -- fixture vs live data mismatch is out of scope per baseline-inventory.

---

### browser/desktop-article - 15.89% mismatch

Structural blocking drift (FAIL):
- thinner chrome / titlebar height: current renders window control buttons (Subtract / SquareMultiple / Dismiss) in the titlebar. The buttons are present and visible. The overall chrome height -- titlebar row, address bar row, and combined chrome-to-body boundary -- is thinner in current than in the baseline full browser chrome. Blocking mismatch.
- nav/address geometry: current renders back/forward buttons and an address label below the titlebar. The height and padding of this nav bar area differ from the baseline nav bar geometry, which shows a more prominent address bar with greater vertical padding.
- shell-to-body boundary offset: current content begins immediately below the nav bar with minimal offset. Baseline shows a more substantial gap between the bottom chrome boundary and the article body start.

Documentary-only drift (pass):
- article hero image rendering: subpixel and antialiasing differences between seojaewan.com and Storybook localhost. Out of scope per baseline-inventory.
- body typography rendering: font hinting and rendering engine differences. Out of scope.
- article title text and body copy. Out of scope.

---

### browser/mobile-article - 15.74% mismatch

Structural blocking drift (FAIL):
- thinner chrome / titlebar height: current renders window control buttons (Subtract / SquareMultiple / Dismiss) in the titlebar at 390px viewport. The buttons are present. Chrome geometry and titlebar height differ from the baseline compact mobile chrome arrangement. Blocking mismatch.
- responsive shell spacing: overall chrome height and button layout spacing differ from the baseline mobile layout. The baseline presents a more compact vertical chrome stack.
- nav/address geometry: back/forward buttons and address label are present in current. The height and padding of the address bar row at mobile width differ from the baseline compact mobile nav layout.

Documentary-only drift (pass):
- article hero image rendering: subpixel differences. Out of scope per baseline-inventory.
- body copy and typography rendering differences. Out of scope.
- article content length differences between fixture and live article. Out of scope.

---

## Summary

All 4 states FAIL on pixel diff. The mismatch (15-18%) is systematic and concentrated in:

1. Window chrome geometry -- titlebar height, button sizing, and address bar padding differ across all 4 states. Window control buttons (min/max/close) ARE present in the current Folder and Browser shells; the blocker is geometry and visual weight, not missing controls.
2. Item tile ratio and density -- Folder card thumbnail aspect ratio, card body padding, and grid gap differ from baseline in both desktop and mobile cases.
3. Browser nav/address bar geometry -- nav bar height and padding differ from baseline in both desktop and mobile Browser.
4. Shell-to-body boundary offset -- Browser content start position relative to chrome bottom differs.

The folder/mobile-blog sidebar collapse policy and 2-column grid structure are now ALIGNED after the corrected 390px viewport capture. These are no longer blocking items.

Documentary-only drift (thumbnail artwork, post titles, body text content) contributes pixel mismatch but is NOT a blocking failure criterion per baseline-inventory.

Phase 4 fix target keys and categories:

| key | blocking category |
|-----|-------------------|
| folder/desktop-blog | thinner chrome - titlebar height/button geometry - back/forward address bar geometry - item tile ratio - tile density |
| folder/mobile-blog | thinner chrome - titlebar height/button geometry - item tile ratio - tile density |
| browser/desktop-article | thinner chrome - titlebar height - nav/address geometry - shell-to-body boundary offset |
| browser/mobile-article | thinner chrome - titlebar height - nav/address geometry - responsive shell spacing |