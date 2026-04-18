# Phase 5 — Visual Drift Closure Report

**date**: 2026-04-18
**phase**: 05-visual-drift-closure
**diff threshold**: 0.1 (10%)

---

## In-scope Fixes Applied (Phase 5)

| fix | file changed | description |
|-----|-------------|-------------|
| Address dropdown item count | `browserReferenceFixtures.tsx` | Reduced `BROWSER_DESKTOP_ADDRESS_OPEN` from 3 items to 1 item (`"2025를 보내며"`) to match live site single-suggestion. Added `COMPARE_ADDRESS_OPEN_DROPDOWN_ITEMS` constant. `ARTICLE_DROPDOWN_ITEMS` (3-item review anchor) unchanged. |
| Chip labels in search-open state | `folderReferenceFixtures.ts` | Updated `BLOG_CHIPS` to match live site chip taxonomy: Server, 성능, 회고, 바라우저, 이론, React, Tailwind CSS, Next.js, JavaScript, 타입 (10 chips). Removed stale `defaultSelectedChipId` references from canonical compare fixtures. |

---

## Final Compare Evidence

### folder/desktop-blog

| metric | value |
|--------|-------|
| status | FAIL |
| mismatch pixels | 304,794 |
| mismatch ratio | 31.75% |
| dimensions match | yes (1280×750) |

**result**: explicit-blocker — entry thumbnail images are decorative content (out of scope per Phase 1 acceptance boundary). Chrome structure, sidebar, and layout are correctly rendered.

---

### folder/desktop-search-open

| metric | value |
|--------|-------|
| status | FAIL |
| mismatch pixels | 302,787 |
| mismatch ratio | 31.54% |
| dimensions match | yes (1280×750) |

**result**: explicit-blocker — entry thumbnail images (out of scope). Search panel + chip bar overlay correctly triggered. Chip labels updated to match live site (Server, 성능, 회고, 바라우저, 이론, React, Tailwind CSS, Next.js, JavaScript, 타입).

---

### folder/mobile-blog

| metric | value |
|--------|-------|
| status | FAIL |
| mismatch pixels | 102,020 |
| mismatch ratio | 32.95% |
| dimensions match | yes (390×794) |

**result**: explicit-blocker — entry thumbnail images (out of scope). Mobile absence rule enforced (sidebar absent, search trigger absent).

---

### browser/desktop-article

| metric | value |
|--------|-------|
| status | FAIL |
| mismatch pixels | 368,335 |
| mismatch ratio | 38.37% |
| dimensions match | yes (1280×750) |

**result**: explicit-blocker — article cover image and body text are out of scope per Phase 1 acceptance boundary. Chrome (tab titlebar, toolbar, address bar) correctly rendered.

---

### browser/desktop-address-open

| metric | value |
|--------|-------|
| status | FAIL |
| mismatch pixels | 370,990 |
| mismatch ratio | 38.64% |
| dimensions match | yes (1280×750) |

**result**: explicit-blocker — article body image/text (out of scope). Address dropdown item count fixed: 1 item ("2025를 보내며") matching live site single URL suggestion.

---

### browser/mobile-article

| metric | value |
|--------|-------|
| status | FAIL |
| mismatch pixels | 67,640 |
| mismatch ratio | 21.84% |
| dimensions match | yes (390×794) |

**result**: explicit-blocker — article cover image + body text (out of scope per Phase 1 acceptance boundary).

---

## Summary

| state key | final result | blocker |
|-----------|-------------|---------|
| folder/desktop-blog | explicit-blocker | entry thumbnails — decorative content, Phase 1 OOS |
| folder/desktop-search-open | explicit-blocker | entry thumbnails — decorative content, Phase 1 OOS |
| folder/mobile-blog | explicit-blocker | entry thumbnails — decorative content, Phase 1 OOS |
| browser/desktop-article | explicit-blocker | article cover image + body text — Phase 1 OOS |
| browser/desktop-address-open | explicit-blocker | article cover image + body text — Phase 1 OOS |
| browser/mobile-article | explicit-blocker | article cover image + body text — Phase 1 OOS |

All 6 state keys evaluated. All remaining drift is out of scope per Phase 1 acceptance boundary.
In-scope drift closed: address dropdown item count, chip label alignment.
47/47 compare + review inventory tests pass. Storybook build succeeds.
