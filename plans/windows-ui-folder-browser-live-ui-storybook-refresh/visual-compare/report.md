# Visual Compare Report

Phase 4 output artifact.
Reference: https://seojaewan.com (live production, external source).
Current: http://localhost:6009 (Storybook @windows/ui).
Threshold: 0.2.

---

## Capture Scope

| Side | Selector | Includes OS taskbar? |
|------|----------|----------------------|
| Reference (live) | `main, section, [role=main]` or `section` | Yes -- desktop captures include ~48px OS taskbar strip at bottom |
| Current (Storybook) | `[data-window-compare-stage]` | No -- window component surface only |

Desktop reference captures all include the live Windows OS taskbar at the bottom (clock,
start button, folder icons). The Storybook current captures do not render a taskbar.
All pixel mismatches in that bottom strip are capture-scope noise, not component drift.

---

## Summary

| State key | Mismatch px | Mismatch % | Result | Actionable drift categories |
|-----------|-------------|------------|--------|----------------------------|
| folder/desktop-card | 154,395 / 960,000 | 16.08% | FAIL | address-bar-icon, search-trigger-label, sidebar-expand-indicator |
| folder/desktop-search-open | 153,758 / 960,000 | 16.02% | FAIL | address-bar-icon, search-overlay-layout, chip-bar-layout, sidebar-expand-indicator |
| folder/mobile-card | 517,514 / 2,786,940 | 18.57% | FAIL | address-bar-icon, titlebar-icon |
| browser/desktop-chrome | 152,629 / 960,000 | 15.90% | FAIL | titlebar-tab-background-color, address-bar-icon, article-cover-image-crop |
| browser/desktop-address-open | 156,627 / 960,000 | 16.32% | FAIL | titlebar-tab-background-color, address-bar-edit-mode-style, address-bar-dropdown-layout |
| browser/mobile-chrome | 340,865 / 2,786,940 | 12.23% | FAIL | titlebar-tab-background-color, address-bar-icon |

All 6 states fail. High mismatch rates (~12-18%) are inflated by noise sources
(thumbnail images, OS taskbar strip, article content length). Component-level drift
is concentrated in a small set of actionable categories.

---

## State-by-State Details

### folder/desktop-card

| Type | File |
|------|------|
| Reference | folder-desktop-card-reference.png |
| Current | folder-desktop-card-current.png |
| Diff | folder-desktop-card-diff.png |

Dimensions: 1280x750 px (both sides match). Mismatch: 154,395 px -- 16.08%. FAIL.

Actionable drift:

| Category | Description | Priority |
|----------|-------------|----------|
| address-bar-icon | Storybook address bar shows a folder icon before the breadcrumb text. Live shows text label only, no icon. | High |
| search-trigger-label | Storybook search trigger renders a text label. Live trigger is an empty styled element with no visible text. | Medium |
| sidebar-expand-indicator | Storybook sidebar uses unicode arrow text as expand toggle. Live uses a different visual indicator. | Low |

Noise sources (not Phase 5 work):

| Category | Reason |
|----------|--------|
| thumbnail-images | Live uses real article cover images; Storybook uses a single repeated fixture PNG. |
| entry-metadata-text | Live shows real published dates/tags; Storybook uses fixture strings. |
| taskbar-clock-date | Desktop reference PNG includes OS taskbar strip at bottom. Storybook has no taskbar. Capture-scope noise. |

---

### folder/desktop-search-open

| Type | File |
|------|------|
| Reference | folder-desktop-search-open-reference.png |
| Current | folder-desktop-search-open-current.png |
| Diff | folder-desktop-search-open-diff.png |

Dimensions: 1280x750 px (both sides match). Mismatch: 153,758 px -- 16.02%. FAIL.

Actionable drift:

| Category | Description | Priority |
|----------|-------------|----------|
| address-bar-icon | Same folder icon drift as desktop-card. | High |
| search-overlay-layout | Live chip overlay shows chip pills only (no search input row). Storybook overlay has search input above chips. Structures do not match. | Medium |
| chip-bar-layout | Live: floating chip pill overlay. Storybook: search dropdown panel with input above chips. | Medium |
| sidebar-expand-indicator | Same unicode arrow indicator drift as desktop-card. | Low |

Noise sources (not Phase 5 work):

| Category | Reason |
|----------|--------|
| thumbnail-images | Same as desktop-card. |
| taskbar-clock-date | Same OS taskbar capture-scope noise as desktop-card. |

---

### folder/mobile-card

| Type | File |
|------|------|
| Reference | folder-mobile-card-reference.png |
| Current | folder-mobile-card-current.png |
| Diff | folder-mobile-card-diff.png |

Dimensions: 1170x2382 px (3x DPR of 390x794 CSS px, both sides match). Mismatch: 517,514 px -- 18.57%. FAIL.

High mismatch rate is almost entirely thumbnail noise. Fixture uses the same image for all
cards while live shows diverse real covers.

Actionable drift:

| Category | Description | Priority |
|----------|-------------|----------|
| address-bar-icon | Same folder icon present in Storybook address bar, absent in live. | High |
| titlebar-icon | Titlebar icon rendering differs between live and Storybook at mobile viewport. | Medium |

Noise sources (not Phase 5 work):

| Category | Reason |
|----------|--------|
| thumbnail-images | 6 entry cards with different cover images = large pixel area of noise. |
| entry-metadata-text | Live real dates vs fixture strings. |

No OS taskbar noise for mobile (mobile viewport does not capture the taskbar strip).

---

### browser/desktop-chrome

| Type | File |
|------|------|
| Reference | browser-desktop-chrome-reference.png |
| Current | browser-desktop-chrome-current.png |
| Diff | browser-desktop-chrome-diff.png |

Dimensions: 1280x750 px (both sides match). Mismatch: 152,629 px -- 15.90%. FAIL.

Actionable drift:

| Category | Description | Priority |
|----------|-------------|----------|
| titlebar-tab-background-color | Live Browser titlebar tab has salmon/pink background (#f9d0cf range). Storybook renders white/gray (bg-gray-100). Color token mismatch on Browser titlebar. | High |
| address-bar-icon | Storybook address bar renders folder icon + breadcrumb label. Live shows breadcrumb text only, no icon. | High |
| article-cover-image-crop | Article cover image renders at a different crop/scale between live and Storybook fixture. | Low |

Noise sources (not Phase 5 work):

| Category | Reason |
|----------|--------|
| article-body-text | Storybook ArticleContent fixture is shorter than full live article. Content below the fold. |
| taskbar-clock-date | Desktop reference PNG includes OS taskbar strip. Capture-scope noise. |

---

### browser/desktop-address-open

| Type | File |
|------|------|
| Reference | browser-desktop-address-open-reference.png |
| Current | browser-desktop-address-open-current.png |
| Diff | browser-desktop-address-open-diff.png |

Dimensions: 1280x750 px (both sides match). Mismatch: 156,627 px -- 16.32%. FAIL.

Actionable drift:

| Category | Description | Priority |
|----------|-------------|----------|
| titlebar-tab-background-color | Same salmon/pink vs gray/white mismatch as browser/desktop-chrome. | High |
| address-bar-edit-mode-style | Live address bar transitions to edit-mode input with highlighted border and text cursor. Storybook renders via controlled addressValue prop without focus ring styling. | Medium |
| address-bar-dropdown-layout | Live dropdown appears anchored below the edit-mode input. Dropdown item label matches fixture (1 item). Layout/positioning may differ. | Medium |

Noise sources (not Phase 5 work):

| Category | Reason |
|----------|--------|
| article-body-text | Same fixture vs full article difference as desktop-chrome. |
| taskbar-clock-date | OS taskbar strip capture-scope noise. |

---

### browser/mobile-chrome

| Type | File |
|------|------|
| Reference | browser-mobile-chrome-reference.png |
| Current | browser-mobile-chrome-current.png |
| Diff | browser-mobile-chrome-diff.png |

Dimensions: 1170x2382 px (3x DPR, both sides match). Mismatch: 340,865 px -- 12.23%. FAIL.

Actionable drift:

| Category | Description | Priority |
|----------|-------------|----------|
| titlebar-tab-background-color | Live mobile Browser titlebar tab has same salmon/pink background as desktop. Storybook renders gray/white. | High |
| address-bar-icon | Same folder icon in address bar, absent in live. | High |

Noise sources (not Phase 5 work):

| Category | Reason |
|----------|--------|
| article-content-length | Live article scrolls significantly further than the Storybook fixture. Lower half of capture is content-length noise. |

---

## Phase 5 Action Items

| Priority | Category | Affected states | Action |
|----------|----------|-----------------|--------|
| High | titlebar-tab-background-color | browser/desktop-chrome, browser/desktop-address-open, browser/mobile-chrome | Change Browser titlebar tab from white/gray to salmon/pink (#f9d0cf range). Update the color token on the Browser titlebar component. |
| High | address-bar-icon | all 6 states | Remove or conditionalize the folder icon in the address bar. Live site shows breadcrumb text label only with no icon prefix. |
| Medium | search-trigger-label | folder/desktop-card | Remove text label from Folder search trigger. Live trigger is an empty styled element. |
| Medium | search-overlay-layout | folder/desktop-search-open | Remove search input row from the folder search overlay. Live shows chip pills only. |
| Medium | address-bar-edit-mode-style | browser/desktop-address-open | Apply focus ring / highlighted border to edit-mode address bar input to match live. |
| Low | sidebar-expand-indicator | folder/desktop-card, folder/desktop-search-open | Align expand toggle indicator with live site indicator style. |
| Low | address-bar-dropdown-layout | browser/desktop-address-open | Verify dropdown panel anchor and position match live edit-mode behavior. |

---

## Noise Sources Reference

| Category | Affected states | Reason |
|----------|-----------------|--------|
| thumbnail-images | folder/desktop-card, folder/desktop-search-open, folder/mobile-card | Fixture uses single repeated PNG; live uses real per-article cover images. |
| entry-metadata-text | folder/desktop-card, folder/mobile-card | Fixture dates vs live published dates. |
| taskbar-clock-date | folder/desktop-card, folder/desktop-search-open, browser/desktop-chrome, browser/desktop-address-open | Reference PNGs include the OS Windows taskbar strip at bottom. Storybook captures have no taskbar. Pure capture-scope mismatch. |
| article-body-text | browser/desktop-chrome, browser/desktop-address-open | Fixture ArticleContent is shorter than full live article. |
| article-content-length | browser/mobile-chrome | Same as article-body-text, mobile viewport. |