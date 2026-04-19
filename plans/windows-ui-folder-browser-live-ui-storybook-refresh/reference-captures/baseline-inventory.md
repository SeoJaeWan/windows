# Baseline Inventory --- Folder & Browser Visual Compare

## Provenance

All 6 reference captures are taken from the **live production site** `https://seojaewan.com`
using `npx agent-browser` on 2026-04-19. This is an external-source evidence baseline ---
independent from the Storybook implementation under test.

Reference captures intentionally differ from Storybook in:
- Thumbnail images (live: real article cover images; Storybook: repo-local `cover-blog-thumbnail.png`)
- Metadata text (live: real published dates/tags; Storybook: fixture strings)
- Article content (live: full article body; Storybook: fixed `ArticleContent` fixture)

These content differences are expected and do not indicate drift. The comparison goal is chrome
parity (titlebar, address bar, sidebar, entry grid layout, chip bar, search panel, dropdown).

---

## Capture Scope Note

All 6 reference captures were originally taken from the live site using `main, section, [role='main']`
or `section` selectors. Desktop captures included a Windows OS taskbar strip at the bottom.

**This has been corrected.** Before running pixelmatch, the bottom taskbar rows were cropped from
all 4 desktop PNG pairs (both reference and current) to produce isomorphic comparison surfaces:

- Folder desktop (folder-desktop-card, folder-desktop-search-open): 1280x750 -> 1280x621
  (removed 129px: dark desktop background + taskbar overlay at rows 621-749)
- Browser desktop (browser-desktop-chrome, browser-desktop-address-open): 1280x750 -> 1280x700
  (removed 50px: taskbar overlay at rows 700-749)

Mobile PNGs remain unchanged at 1170x2382 (no OS taskbar in mobile captures).

The crop was applied by `crop-desktop-references.mjs` and diff artifacts were regenerated.
The OS taskbar is no longer a noise source in any diff result.

---

## Canonical State Reference Mapping

### `folder/desktop-card`

| Item | Value |
|------|-------|
| Reference URL | `https://seojaewan.com/blog` |
| Original capture viewport | 1280 x 750 px |
| Final comparison dimensions | 1280 x 621 px (after taskbar crop) |
| Capture selector | `main, section, [role='main']` |
| Reference file | `visual-compare/folder-desktop-card-reference.png` |
| Live layout | Folder window: titlebar, address bar, sidebar (left), entry grid 3col |
| Fixture alignment | `FOLDER_DESKTOP_CARD` --- same title/address/sidebar structure |
| Notes | Live sidebar shows expanded entries. Storybook search trigger shows text label absent in live. |

### `folder/desktop-search-open`

| Item | Value |
|------|-------|
| Reference URL | `https://seojaewan.com/blog` (click search trigger) |
| Original capture viewport | 1280 x 750 px |
| Final comparison dimensions | 1280 x 621 px (after taskbar crop) |
| Capture selector | `main, section, [role='main']` |
| Reference file | `visual-compare/folder-desktop-search-open-reference.png` |
| Live layout | Folder window with chip overlay visible at top-right (chip pills only, no search input) |
| Fixture alignment | `FOLDER_DESKTOP_SEARCH_OPEN` --- `searchPanelOpen: true`, same chip list |
| Notes | Live chip overlay has no input row. Storybook shows search input + chips in overlay. |

### `folder/mobile-card`

| Item | Value |
|------|-------|
| Reference URL | `https://seojaewan.com/blog` |
| Capture viewport | iPhone 12 (390 x 844 CSS px, captured at 3x = 1170 x 2382 px) |
| Final comparison dimensions | 1170 x 2382 px (unchanged) |
| Capture selector | `section` (390 x 794 CSS element) |
| Reference file | `visual-compare/folder-mobile-card-reference.png` |
| Live layout | Folder mobile: titlebar + address bar, entry grid 2col (no sidebar, no chip bar) |
| Fixture alignment | `FOLDER_MOBILE_CARD` --- same data as desktop-card, mobile viewport |
| Notes | No OS taskbar noise. High mismatch is thumbnail noise. |

### `browser/desktop-chrome`

| Item | Value |
|------|-------|
| Reference URL | `https://seojaewan.com/blog/2025를-보내며` |
| Original capture viewport | 1280 x 750 px |
| Final comparison dimensions | 1280 x 700 px (after taskbar crop) |
| Capture selector | `main, section, [role='main']` |
| Reference file | `visual-compare/browser-desktop-chrome-reference.png` |
| Live layout | Browser window: titlebar (salmon/pink tab), address bar (breadcrumb), article body |
| Fixture alignment | `BROWSER_DESKTOP_CHROME` --- title, address, `ArticleContent` children |
| Notes | Live tab bar background is salmon/pink (#f9d0cf range); Storybook uses white/gray. |

### `browser/desktop-address-open`

| Item | Value |
|------|-------|
| Reference URL | `https://seojaewan.com/blog/2025를-보내며` (click address bar) |
| Original capture viewport | 1280 x 750 px |
| Final comparison dimensions | 1280 x 700 px (after taskbar crop) |
| Capture selector | `main, section, [role='main']` |
| Reference file | `visual-compare/browser-desktop-address-open-reference.png` |
| Live layout | Browser window with address bar in edit mode + dropdown (1 item) |
| Fixture alignment | `BROWSER_DESKTOP_ADDRESS_OPEN` --- `addressDropdownOpen: true`, `COMPARE_ADDRESS_OPEN_DROPDOWN_ITEMS` |
| Notes | No address-bar-icon drift in this state. Drift is edit-mode-style + dropdown-layout. |

### `browser/mobile-chrome`

| Item | Value |
|------|-------|
| Reference URL | `https://seojaewan.com/blog/2025를-보내며` |
| Capture viewport | iPhone 12 (390 x 844 CSS px, captured at 3x = 1170 x 2382 px) |
| Final comparison dimensions | 1170 x 2382 px (unchanged) |
| Capture selector | `section` (390 x 794 CSS element) |
| Reference file | `visual-compare/browser-mobile-chrome-reference.png` |
| Live layout | Browser mobile: titlebar (salmon/pink tab), address bar, full article scroll |
| Fixture alignment | `BROWSER_MOBILE_CHROME` --- same data as desktop-chrome, mobile viewport |
| Notes | No OS taskbar noise. Salmon/pink tab drift same as desktop. |

---

## Comparison Setup

| Parameter | Value |
|-----------|-------|
| Threshold | 0.2 (external reference source --- different rendering environment expected) |
| Pixelmatch | v7.1.0 (installed in project root node_modules) |
| Comparison script | visual-compare-run.mjs |
| Crop script | crop-desktop-references.mjs |
| Diff artifacts | plans/.../visual-compare/{state-key}-diff.png |

---

## Known Expected Differences (not drift candidates)

1. **Entry thumbnails**: Storybook uses a single repeated repo-local PNG. Live uses real article cover images. Affects all Folder states.
2. **Entry metadata text**: Storybook uses fixture dates/tags; live uses real published dates.
3. **Article body text**: Storybook ArticleContent fixture is shorter than the live article body. Affects Browser states.

---

## Drift Classification Summary

| State key | Drift area | Description |
|-----------|-----------|-------------|
| browser/desktop-chrome | Tab bar background | Live: salmon/pink #f9d0cf; Storybook: white/gray --- color token mismatch |
| browser/desktop-address-open | Tab bar background | Same as desktop-chrome |
| browser/mobile-chrome | Tab bar background | Same titlebar background mismatch on mobile |
| folder/desktop-card | Search trigger label | Storybook renders text label in search trigger; live shows empty styled element |
| folder/desktop-search-open | Chip bar layout vs overlay | Storybook: search input + chips; live: chip pills only (no search input row) |
| folder/desktop-card, folder/desktop-search-open | Sidebar expand indicator | Storybook uses unicode arrow toggles; live uses a different indicator style |
| folder/desktop-card, folder/desktop-search-open, folder/mobile-card, browser/desktop-chrome, browser/mobile-chrome | Address bar icon | Storybook shows folder icon + label; live shows text label only |
| browser/desktop-address-open | Edit-mode style | Storybook address bar lacks focus ring/border of live edit-mode input |
| browser/desktop-address-open | Dropdown layout | Dropdown panel positioning may differ from live |
| folder/mobile-card | Titlebar icon | Titlebar icon rendering differs on mobile viewport |
