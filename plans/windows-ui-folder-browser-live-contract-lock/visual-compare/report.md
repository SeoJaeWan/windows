# Visual Compare Report

generated: 2026-04-17
phase: Phase 4 (final rerun)
threshold: 0.2

## Provenance

| source | description |
|--------|-------------|
| external-source evidence | Phase 1 baseline. 2026-04-17 live capture from seojaewan.com at canonical viewports. |
| package-local current | Phase 4 rerun current. Captured from packages/ui storybook-static via Playwright, selector [data-visual-root]. |

---

## folder/desktop-blog

| field | value |
|-------|-------|
| baseline provenance | external-source evidence |
| current provenance | package-local current (Phase 4 rerun) |
| baseline size | 1280x750 |
| current size | 1280x750 |
| size mismatch | no |
| mismatch rate | 15.56% |
| diff image | folder-desktop-blog-diff.png |

| category | Phase 3 status | Phase 4 status |
|----------|----------------|----------------|
| geometry window height | 488px vs 750px | PASS (closed) |
| chrome left sidebar | sidebar absent | PASS (closed) |
| chrome back/forward nav | absent | PASS (closed) |
| chrome taskbar | absent | OUT OF SCOPE |
| chrome address bar styling | breadcrumb mismatch | BLOCKING REMAINS (font/color diff) |
| responsive grid | only 1 row | PASS (closed) |
| thumbnail content | placeholder fixture | BLOCKING REMAINS (scope blocker) |
| font rendering | cross-environment | non-blocking |

Phase 4 result: BLOCKING REMAINS (scope blocker: thumbnail content)

---

## folder/mobile-blog

| field | value |
|-------|-------|
| baseline provenance | external-source evidence |
| current provenance | package-local current (Phase 4 rerun) |
| baseline size | 390x794 |
| current size | 390x794 |
| size mismatch | no |
| mismatch rate | 15.75% |
| diff image | folder-mobile-blog-diff.png |

| category | Phase 3 status | Phase 4 status |
|----------|----------------|----------------|
| geometry window height | 1116px overflow | PASS (closed) |
| chrome back/forward nav | absent | PASS (closed) |
| chrome taskbar | absent | OUT OF SCOPE |
| responsive layout | 1-column | PASS (closed) |
| thumbnail content | placeholder fixture | BLOCKING REMAINS (scope blocker) |
| font rendering | cross-environment | non-blocking |

Phase 4 result: BLOCKING REMAINS (scope blocker: thumbnail content)

---

## browser/desktop-article

| field | value |
|-------|-------|
| baseline provenance | external-source evidence |
| current provenance | package-local current (Phase 4 rerun) |
| baseline size | 1280x750 |
| current size | 1280x750 |
| size mismatch | no |
| mismatch rate | 16.13% |
| diff image | browser-desktop-article-diff.png |

| category | Phase 3 status | Phase 4 status |
|----------|----------------|----------------|
| geometry canvas height | 4px delta | PASS (closed) |
| chrome nav controls | absent | PASS (closed) |
| chrome taskbar | absent | OUT OF SCOPE |
| geometry content offset | article y-offset | BLOCKING REMAINS (scope blocker) |
| geometry hero image position | image higher | BLOCKING REMAINS (scope blocker) |
| spacing article padding | smaller margin | BLOCKING REMAINS (scope blocker) |
| font rendering | cross-environment | non-blocking |

Phase 4 result: BLOCKING REMAINS (scope blocker: article layout is children/consumer concern)

---

## browser/mobile-article

| field | value |
|-------|-------|
| baseline provenance | external-source evidence |
| current provenance | package-local current (Phase 4 rerun) |
| baseline size | 390x794 |
| current size | 390x794 |
| size mismatch | no |
| mismatch rate | 13.25% |
| diff image | browser-mobile-article-diff.png |

| category | Phase 3 status | Phase 4 status |
|----------|----------------|----------------|
| geometry canvas height | 59px shorter | PASS (closed) |
| chrome nav controls | absent | PASS (closed) |
| chrome taskbar | absent | OUT OF SCOPE |
| geometry article title size | title larger | non-blocking (font-only) |
| spacing content body margin | smaller padding | BLOCKING REMAINS (scope blocker) |
| font rendering | cross-environment | non-blocking |

Phase 4 result: BLOCKING REMAINS (scope blocker: article padding is children/consumer concern)

---

## Summary

| state key | baseline size | current size | size match | mismatch rate | Phase 4 result |
|-----------|--------------|--------------|------------|--------------|----------------|
| folder/desktop-blog | 1280x750 | 1280x750 | YES | 15.56% | BLOCKING REMAINS (scope blocker) |
| folder/mobile-blog | 390x794 | 390x794 | YES | 15.75% | BLOCKING REMAINS (scope blocker) |
| browser/desktop-article | 1280x750 | 1280x750 | YES | 16.13% | BLOCKING REMAINS (scope blocker) |
| browser/mobile-article | 390x794 | 390x794 | YES | 13.25% | BLOCKING REMAINS (scope blocker) |

---

## Closed blocking drift (Phase 4 closures)

| item | fix applied |
|------|-------------|
| Window geometry height mismatch (all 4 states) | CompareWindowStage flex-column + scoped `[data-visual-root]` height rule fills canvas |
| Browser back/forward nav controls absent | showNavControls prop added to WindowFrame; Browser passes showNavControls |
| Folder back/forward nav controls absent | Folder passes showNavControls to WindowFrame |
| Folder left sidebar absent on desktop | Sidebar: hidden md:flex |
| folder/mobile-blog 1-column layout | Grid: grid-cols-2 lg:grid-cols-3 |
| folder/desktop-blog only 1 grid row | Fixture entries expanded from 3 to 6 |
| Sidebar missing sidebar-intro item | Added sidebar-intro to BLOG_SIDEBAR_ITEMS fixture |

---

## Scope boundary annotations

### Taskbar - OUT OF SCOPE

Baseline captures include taskbar at bottom. Compare stories render only Folder/Browser without a host shell. Intentional exclusion from all 4 canonical compare states.

### Article content layout - SCOPE BLOCKER

Browser exposes children as the only body contract. Article layout (padding, max-width, hero image placement) is consumer/host concern. Closing remaining article layout drift requires consumer changes, not packages/ui Browser changes.

### Thumbnail content - SCOPE BLOCKER

Baseline shows live per-post thumbnails. Fixture uses a single placeholder asset. Actual thumbnails require consumer runtime integration (passed via FolderEntry.thumbnailSrc).

---

## Non-blocking drift

Font rendering and antialiasing differences across all 4 states (cross-environment). Non-blocking per plan visual acceptance rule.
