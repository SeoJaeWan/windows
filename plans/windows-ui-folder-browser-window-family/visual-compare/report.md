# Visual Compare Report — Folder & Browser Window Family

**Date**: 2026-04-16
**Baseline provenance**: external-source evidence (Phase 1 captures from live production at seojaewan.com)
**Current provenance**: package-local current (Storybook compare stories, @windows/ui build)
**Threshold**: 0.2 (element-level external reference)
**Pass criterion**: mismatch rate < 1%

---

## Results Summary

| State Key | Baseline Size | Current Size | Size Match | Mismatch Rate | Result |
|---|---|---|---|---|---|
| folder/desktop-default | 1280x750 | 1280x262 | NO | 15.18% | FAIL |
| folder/mobile-collapsed | 390x794 | 390x252 | NO | 16.50% | FAIL |
| browser/desktop-article | 1280x750 | 1280x412 | NO | 6.78% | FAIL |
| browser/desktop-not-found | 1280x750 | 1280x332 | NO | 1.04% | FAIL |
| browser/mobile-article | 390x794 | 390x542 | NO | 11.68% | FAIL |
| browser/mobile-not-found | 390x794 | 390x332 | NO | 2.31% | FAIL |

**Overall**: 0/6 passed

---

## Root Cause 1: Height truncation (affects all 6)

Current captures use [data-visual-root] element capture which returns natural rendered height (262-542px), not the fixed stage canvas height. Baseline reference images are 750px (desktop) / 794px (mobile). Padded whitespace is counted as mismatch pixels.

Fix direction: capture the stage wrapper at the correct fixed height, or crop baselines to match rendered content region.

## Root Cause 2: Content/fixture divergence (expected)

- Folder: baseline shows live blog post thumbnails; current fixture shows file system icon grid. Intentional data model difference.
- Browser article: baseline includes hero image; current fixture omits it. Text body also shorter.
- Browser not-found: baseline shows browser DNS error screen; current correctly implements Next.js 404 page. Semantic difference is intentional.

## Root Cause 3: Window chrome design change (expected)

Baseline shows legacy seojaewan.com chrome (folder-tab / browser-tab style). Current implements Windows 11-style window chrome (titlebar + minimize/maximize/close). This is the new design direction.

---

## Per-State Drift Notes

**folder/desktop-default** (15.18%): Window chrome changed (folder tab -> Win11 titlebar). Title "블로그" -> "프로젝트". Content area shows file icons vs blog thumbnails. Height 750->262px.

**folder/mobile-collapsed** (16.50%): Same chrome/content changes as desktop. No bottom tab bar in current. Height 794->252px.

**browser/desktop-article** (6.78%): Chrome changed (browser tab -> Win11 titlebar). No hero image in current. Body text is shortened fixture. Height 750->412px. Scrollbar visible on right.

**browser/desktop-not-found** (1.04%): Chrome changed. Content fundamentally different: DNS error (reference) vs Next.js 404 page (current). Both show mostly white backgrounds so pixel diff is low. Height 750->332px.

**browser/mobile-article** (11.68%): Same as desktop-article pattern at 390px width. No hero image. Height 794->542px.

**browser/mobile-not-found** (2.31%): DNS error (reference) vs Next.js 404 (current). Height 794->332px.
