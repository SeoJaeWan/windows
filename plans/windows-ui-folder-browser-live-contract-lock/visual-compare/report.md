# Visual Compare Report

generated: 2026-04-17
phase: Phase 3
threshold: 0.2

## Provenance

| source | description |
|--------|-------------|
| external-source evidence | Phase 1 baseline. 2026-04-17 live capture from seojaewan.com at canonical viewports. |
| package-local current | Phase 3 current. Captured from packages/ui storybook-static via Storybook iframe, selector [data-visual-root]. |

---

## folder/desktop-blog

| field | value |
|-------|-------|
| baseline provenance | external-source evidence |
| current provenance | package-local current |
| baseline size | 1280x750 |
| current size | 1280x488 |
| size mismatch | yes (height 750 vs 488) |
| mismatch rate | 16.44% |
| diff image | folder-desktop-blog-diff.png |

| category | classification | detail |
|----------|---------------|--------|
| geometry window height | blocking | current 488px vs baseline 750px |
| chrome left sidebar | blocking | baseline has left nav sidebar (블로그 etc). Current has no sidebar. |
| chrome taskbar | blocking | baseline has taskbar at bottom. Current has no taskbar. |
| chrome address bar | blocking | breadcrumb position/styling differs |
| spacing tab filter bar | blocking | current shows filter tabs as top bar vs sidebar header area in baseline |
| responsive grid | blocking | both 3-column but only 1 row visible at 488px vs 2 rows at 750px |
| thumbnail ratio | blocking | height truncation changes visible area |
| font rendering | non-blocking | cross-environment antialiasing |

---

## folder/mobile-blog

| field | value |
|-------|-------|
| baseline provenance | external-source evidence |
| current provenance | package-local current |
| baseline size | 390x794 |
| current size | 390x1116 |
| size mismatch | yes (height 794 vs 1116) |
| mismatch rate | 15.08% |
| diff image | folder-mobile-blog-diff.png |

| category | classification | detail |
|----------|---------------|--------|
| geometry window height | blocking | current 1116px overflows 390x794 CompareWindowMobileStage |
| chrome nav controls | blocking | baseline has back/forward buttons. Current has none. |
| chrome address bar | blocking | address row layout/height differs |
| responsive layout | blocking | baseline 2-column vs current 1-column |
| spacing entry row gap | blocking | current has larger vertical spacing |
| thumbnail ratio | blocking | baseline ~180px wide (2-col) vs current ~370px wide (1-col) |
| font rendering | non-blocking | cross-environment antialiasing |

---

## browser/desktop-article

| field | value |
|-------|-------|
| baseline provenance | external-source evidence |
| current provenance | package-local current |
| baseline size | 1280x750 |
| current size | 1280x746 |
| size mismatch | yes (height delta 4px) |
| mismatch rate | 10.40% |
| diff image | browser-desktop-article-diff.png |

| category | classification | detail |
|----------|---------------|--------|
| chrome nav controls | blocking | baseline has back/forward buttons. Current has none. |
| chrome address bar | blocking | baseline: URL bar with nav controls. Current: plain text only. |
| chrome taskbar | blocking | baseline has taskbar. Current has none. |
| geometry content offset | blocking | article starts higher in current due to missing nav row |
| geometry hero image position | blocking | hero image ~40px higher in current |
| spacing article padding | blocking | current has smaller left/right margin |
| font rendering | non-blocking | cross-environment antialiasing |

---

## browser/mobile-article

| field | value |
|-------|-------|
| baseline provenance | external-source evidence |
| current provenance | package-local current |
| baseline size | 390x794 |
| current size | 390x735 |
| size mismatch | yes (height 794 vs 735, delta 59px) |
| mismatch rate | 15.92% |
| diff image | browser-mobile-article-diff.png |

| category | classification | detail |
|----------|---------------|--------|
| chrome nav controls | blocking | baseline has back/forward buttons. Current has none. |
| chrome address bar | blocking | baseline has compact bar with nav. Current plain text only. |
| chrome taskbar | blocking | baseline has taskbar. Current has none. |
| geometry canvas height | blocking | current 59px shorter than baseline |
| geometry article title size | blocking | title appears larger in current |
| spacing content body margin | blocking | current has smaller left/right padding |
| font rendering | non-blocking | cross-environment antialiasing |

---

## Summary

| state key | baseline size | current size | mismatch rate | result |
|-----------|--------------|--------------|--------------|--------|
| folder/desktop-blog | 1280x750 | 1280x488 | 16.44% | BLOCKING |
| folder/mobile-blog | 390x794 | 390x1116 | 15.08% | BLOCKING |
| browser/desktop-article | 1280x750 | 1280x746 | 10.40% | BLOCKING |
| browser/mobile-article | 390x794 | 390x735 | 15.92% | BLOCKING |

All 4 canonical states have blocking drift.

## Blocking categories for Phase 4

Cross-cutting:
- Taskbar absent in current (Storybook renders component only, no taskbar host). If intentionally excluded from compare scope, annotate as explicit exclusion in Phase 4.
- Browser back/forward nav controls absent in browser/desktop-article and browser/mobile-article.
- Window geometry height mismatch in 3 of 4 states.

folder/desktop-blog:
- Left sidebar navigation panel absent
- Only 1 grid row visible at 488px vs 2 rows at 750px

folder/mobile-blog:
- 1-column layout vs 2-column baseline (responsive breakpoint mismatch)
- No back/forward nav controls
- Content overflows CompareWindowMobileStage (1116px vs 794px)

browser/desktop-article:
- Back/forward nav controls absent
- Article content y-offset shifted due to missing chrome rows

browser/mobile-article:
- Back/forward nav controls absent
- Article title scale difference
- Canvas 59px shorter than baseline

## Non-blocking drift

Font rendering and antialiasing differences across all 4 states (cross-environment: Windows Chrome vs local Storybook renderer). Non-blocking per plan visual acceptance rule.
