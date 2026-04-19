# Baseline Inventory — Folder & Browser Visual Compare

## Provenance

All 6 reference captures are taken from the **live production site** `https://seojaewan.com`
using `npx agent-browser` on 2026-04-19. This is an external-source evidence baseline —
independent from the Storybook implementation under test.

Reference captures intentionally differ from Storybook in:
- Thumbnail images (live: real article cover images; Storybook: repo-local `cover-blog-thumbnail.png`)
- Metadata text (live: real published dates/tags; Storybook: fixture strings)
- Taskbar clock/date (live: real time; Storybook: none / frozen)
- Article content (live: full article body; Storybook: fixed `ArticleContent` fixture)

These content differences are expected and do not indicate drift. The comparison goal is chrome
parity (titlebar, address bar, sidebar, entry grid layout, chip bar, search panel, dropdown).

---

## Capture Scope Note

All 6 reference captures were taken from the live site using `main, section, [role='main']`
or `section` selectors, which on `seojaewan.com` include the Windows OS taskbar strip at
the bottom of the screen. The Storybook current captures use `[data-window-compare-stage]`
which scopes to the window component only (no OS taskbar).

This means **every reference PNG has a ~48px taskbar strip at the bottom** (clock, start
button, folder icons) that the current captures do not have. All pixel mismatches in that
strip are capture-scope noise, not component drift. `taskbar-clock-date` in diff-results is
an expected noise source and has been moved to `noiseSources` in diff-results.json.

The component chrome above the taskbar is the valid comparison zone for Phase 5 purposes.

---

## Canonical State Reference Mapping

### `folder/desktop-card`

| Item | Value |
|------|-------|
| Reference URL | `https://seojaewan.com/blog` |
| Capture viewport | 1280 × 750 px |
| Capture selector | `main, section, [role='main']` (includes OS taskbar strip at bottom) |
| Reference file | `visual-compare/folder-desktop-card-reference.png` |
| Live layout | Folder window (full viewport): titlebar "블로그", address bar "블로그", sidebar (left), entry grid 3×col |
| Fixture alignment | `FOLDER_DESKTOP_CARD` — same title/address/sidebar structure |
| Notes | Live sidebar shows expanded "블로그" with 개발/회고 children. Live entry count is ~15 articles; fixture uses 6 entries. Chip bar is inside the search-open overlay on live (not visible in default state). Storybook search trigger shows "검색" label in toolbar. |

### `folder/desktop-search-open`

| Item | Value |
|------|-------|
| Reference URL | `https://seojaewan.com/blog` (click search trigger `header > div:last-child > *:nth-child(2)`) |
| Capture viewport | 1280 × 750 px |
| Capture selector | `main, section, [role='main']` (includes OS taskbar strip at bottom — **not** full page via `[id]`) |
| Reference file | `visual-compare/folder-desktop-search-open-reference.png` |
| Live layout | Folder window with chip overlay visible at top-right (chip pills: Server, 성능, 회고, 바라우저, 이론, React, Tailwind CSS, Next.js, JavaScript, 타입) |
| Fixture alignment | `FOLDER_DESKTOP_SEARCH_OPEN` — `searchPanelOpen: true`, `searchValue: "포트폴리오"`, same chip list |
| Notes | Live site shows chips as overlay on click; Storybook shows search input + chip bar in overlay. The search input with "포트폴리오" value is absent in the live chip overlay. Chip labels match fixture BLOG_CHIPS list. |

### `folder/mobile-card`

| Item | Value |
|------|-------|
| Reference URL | `https://seojaewan.com/blog` |
| Capture viewport | iPhone 12 (390 × 844 CSS px, captured at 3× = 1170 × 2382 px) |
| Capture selector | `section` (390 × 794 CSS element) |
| Reference file | `visual-compare/folder-mobile-card-reference.png` |
| Live layout | Folder mobile: titlebar + address bar (no search trigger, no sidebar, no chip bar), entry grid 2×col |
| Fixture alignment | `FOLDER_MOBILE_CARD` — same data as desktop-card, mobile viewport collapses sidebar/search |
| Notes | Live shows folder with real article thumbnails. Mobile chip bar and search trigger are absent (CSS-only hide). Entry grid shows 2 columns. Matches new component mobile absence rules. |

### `browser/desktop-chrome`

| Item | Value |
|------|-------|
| Reference URL | `https://seojaewan.com/blog/2025를-보내며` |
| Capture viewport | 1280 × 750 px |
| Capture selector | `main, section, [role='main']` (includes OS taskbar strip at bottom) |
| Reference file | `visual-compare/browser-desktop-chrome-reference.png` |
| Live layout | Browser window: titlebar (salmon/pink tab background: "2025를 보내며" + close), address bar ("2025를 보내며" breadcrumb), article body (heading + cover image + paragraph) |
| Fixture alignment | `BROWSER_DESKTOP_CHROME` — title "2025를 보내며", address "seojaewan.com/blog/2025를-보내며", `ArticleContent` children |
| Notes | Live tab bar background color is salmon/pink (#f9d8d8 range); Storybook titlebar uses white/gray (`bg-gray-100` or equivalent). Article cover image matches (`cover-article.png` used in fixture). |

### `browser/desktop-address-open`

| Item | Value |
|------|-------|
| Reference URL | `https://seojaewan.com/blog/2025를-보내며` (click address bar `header > div:last-child > *`) |
| Capture viewport | 1280 × 750 px |
| Capture selector | `main, section, [role='main']` (includes OS taskbar strip at bottom) |
| Reference file | `visual-compare/browser-desktop-address-open-reference.png` |
| Live layout | Browser window with address bar in edit mode + dropdown showing 1 suggestion: "2025를 보내며" |
| Fixture alignment | `BROWSER_DESKTOP_ADDRESS_OPEN` — `addressDropdownOpen: true`, `COMPARE_ADDRESS_OPEN_DROPDOWN_ITEMS` (1 item: "2025를 보내며") |
| Notes | Live shows single-item dropdown matching `COMPARE_ADDRESS_OPEN_DROPDOWN_ITEMS`. Address bar enters edit-mode input on click. Storybook uses controlled `addressValue` + `addressDropdownOpen` props instead of click interaction. Dropdown item label in live matches fixture item label. |

### `browser/mobile-chrome`

| Item | Value |
|------|-------|
| Reference URL | `https://seojaewan.com/blog/2025를-보내며` |
| Capture viewport | iPhone 12 (390 × 844 CSS px, captured at 3× = 1170 × 2382 px) |
| Capture selector | `section` (390 × 794 CSS element) |
| Reference file | `visual-compare/browser-mobile-chrome-reference.png` |
| Live layout | Browser mobile: titlebar (tab + close), address bar, full article scroll (heading + cover + paragraphs) |
| Fixture alignment | `BROWSER_MOBILE_CHROME` — same data as desktop-chrome, mobile viewport |
| Notes | Live renders full scrollable article content. Fixture uses same `ArticleContent` component. Mobile browser shows no navigation arrows in title bar area. Salmon/pink tab background visible as on desktop. |

---

## Comparison Setup

| Parameter | Value |
|-----------|-------|
| Threshold | 0.2 (external reference source — different rendering environment expected) |
| Pixelmatch | v7.1.0 (installed in project root `node_modules`) |
| Comparison script | `visual-compare-run.mjs` (copied from skill references) |
| Diff artifacts | `plans/.../visual-compare/{state-key}-diff.png` |

---

## Known Expected Differences (not drift candidates)

These differences will appear in every diff and should NOT be filed as drift for Phase 5:

1. **Entry thumbnails**: Storybook uses a single repeated repo-local PNG (`cover-blog-thumbnail.png`). Live uses real article cover images per post. Affects all entry grid cells across all Folder states.
2. **Entry metadata text**: Storybook uses fixture dates/tags; live uses real published dates. Minor text rendering differences.
3. **Taskbar clock/date**: All desktop reference captures include the live OS taskbar strip at the bottom (clock, start button, folder icons). Storybook captures have no taskbar — this is a capture scope difference, not component drift. Mobile captures do not show this band.
4. **Article body text**: Storybook `ArticleContent` fixture is shorter than the live article body. Affects Browser states.
5. **Tab background color (Browser)**: Live titlebar tab background is salmon/pink; Storybook uses gray — this IS a drift candidate (see drift classification below).

---

## Drift Classification Summary

Differences in the diffs that are actual chrome parity regressions and should be addressed in Phase 5:

| State key | Drift area | Description |
|-----------|-----------|-------------|
| `browser/desktop-chrome` | Tab bar background | Live: salmon/pink `#f9d0cf` range; Storybook: `bg-gray-100` white/gray — color token mismatch on Browser titlebar |
| `browser/desktop-address-open` | Tab bar background | Same as desktop-chrome |
| `browser/mobile-chrome` | Tab bar background | Same titlebar background mismatch on mobile |
| `folder/desktop-card` | Search trigger label | Storybook renders "검색" text label in search trigger; live shows empty styled input — text label is not present in live |
| `folder/desktop-search-open` | Chip bar layout vs overlay | Storybook renders search input + chips in dropdown overlay; live shows only chip pills in a chip overlay (no search input row visible in the live chip overlay) |
| `folder/desktop-search-open` | Search value display | Storybook shows "포트폴리오" in search input; live chip overlay has no input field |
| All folder states | Sidebar expand indicator | Storybook uses ▸/▾ text expand toggles; live uses a different indicator style |
| All Folder + Browser states | Address bar icon | Storybook address bar shows folder icon + label; live shows just the text label without folder icon |
