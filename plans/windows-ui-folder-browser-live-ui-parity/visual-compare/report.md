# Visual Compare Report - Phase 3

capture date: 2026-04-17
phase: 03-reference-compare-report

## Provenance

| side | source | method |
|------|--------|--------|
| baseline (reference) | external-source evidence - live seojaewan.com | Phase 1 baseline captures |
| current | package-local current - worktree Storybook port 6100 | capture-current.mjs via data-window-compare-stage marker |

Capture selector owner: CompareWindowDesktopStage / CompareWindowMobileStage - package-owned reserved marker data-window-compare-stage. Consumer-supplied host attrs are stripped or non-winning; the capture selector reads only the package-owned marker.

Threshold: 0.2 (external vs package-local rendering environment).

---

## Canonical State Results

| state key | ref size | cur size | size match | mismatch | passed |
|-----------|----------|----------|-----------|----------|--------|
| folder/desktop-blog | 1280x750 | 1280x750 | yes | 15.65% | FAIL |
| folder/mobile-blog | 390x794 | 390x794 | yes | 11.71% | FAIL |
| browser/desktop-article | 1280x750 | 1280x750 | yes | 15.89% | FAIL |
| browser/mobile-article | 390x794 | 390x794 | yes | 13.53% | FAIL |

All 4 states: FAIL (mismatch 11-16%, threshold 1%)

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
- thinner chrome / titlebar buttons: current titlebar is a bare thin bar with no min/max/close buttons; baseline shows full chrome with window control buttons and folder icon.
- desktop sidebar hierarchy: current shows flat list without tree indentation or expand arrows; baseline renders proper tree panel with expand-collapse entries.
- item tile ratio and tile density: current cards are smaller with clipped text; baseline cards larger with full title and 1-2 line summary. Card padding and inner gap are tighter in current.
- desktop 3-column structure: both show 3 columns (aligned). Card height/aspect ratio mismatch contributes to blocking drift.

Documentary-only drift (pass):
- exact blog post titles, summary copy, thumbnail artwork, per-post metadata differ between live baseline and current (fixture data). Out of compare scope per baseline-inventory.

---

### folder/mobile-blog - 11.71% mismatch

Structural blocking drift (FAIL):
- mobile sidebar collapse policy: current renders sidebar as expanded list panel at 390px width; baseline hides sidebar entirely, showing only compact back/forward + breadcrumb chrome. Primary structural blocker.
- mobile 2-column structure: current renders 3 columns at 390px; baseline renders 2 columns. Direct violation of mobile grid structure requirement.
- item tile ratio: current cards ~1/3 width each (3-col) vs ~1/2 width in 2-col baseline. Card text heavily clipped.

Documentary-only drift (pass):
- exact thumbnail artwork, post titles, summary copy - fixture vs live data mismatch is out of scope.

---

### browser/desktop-article - 15.89% mismatch

Structural blocking drift (FAIL):
- thinner chrome / titlebar height: current shows minimal titlebar text with no min/max/close buttons; baseline shows full browser chrome with tab bar, window control buttons, full titlebar height including tab strip.
- nav/address geometry: current shows thin breadcrumb navigation only; baseline shows prominent nav bar with clear back/forward button geometry and address bar padding.
- shell-to-body boundary offset: current content starts immediately below thin nav area; baseline has more substantial chrome gap before content.

Documentary-only drift (pass):
- article hero image rendering subpixel differences between seojaewan.com and Storybook localhost.
- body typography rendering differences (antialiasing, font hinting).

---

### browser/mobile-article - 13.53% mismatch

Structural blocking drift (FAIL):
- thinner chrome / titlebar height: current shows title text with no window control buttons; baseline has compact button layout in top-right. Chrome is structurally thinner in current.
- responsive shell spacing: current mobile chrome has no visible padding between chrome elements; baseline has slight gap/padding arrangement.

Documentary-only drift (pass):
- body copy rendering - more text paragraphs visible in 390x794 canvas; per baseline-inventory, article padding and layout inside children is documentary-only.
- article hero image rendering subpixel differences.

---

## Summary

All 4 states FAIL on pixel diff. The mismatch (11-16%) is systematic and concentrated in:

1. Window chrome / titlebar buttons - missing min/max/close controls in current Folder and Browser shells. Affects all 4 states.
2. Mobile sidebar collapse - sidebar is expanded at mobile width in folder/mobile-blog; should be hidden.
3. Mobile grid column count - current renders 3 columns at 390px instead of 2 columns.
4. Item tile ratio and density - desktop Folder cards are smaller with clipped content compared to baseline.
5. Browser nav/address geometry - nav bar height and padding differ from baseline in desktop Browser.

Documentary-only drift (thumbnail artwork, post titles, body text content) contributes pixel mismatch but is NOT a blocking failure criterion per baseline-inventory.

Phase 4 fix target keys and categories:

| key | blocking category |
|-----|-------------------|
| folder/desktop-blog | thinner chrome - titlebar buttons - item tile ratio - tile density |
| folder/mobile-blog | mobile sidebar collapse - mobile 2-column grid - item tile ratio |
| browser/desktop-article | thinner chrome - titlebar height - nav/address geometry - shell-to-body offset |
| browser/mobile-article | thinner chrome - titlebar buttons - responsive shell spacing |
