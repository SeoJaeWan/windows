# Phase 4 Parity Report — Folder Browser Figma UI

## Provenance

### Figma (reference source)

| Field | Value |
| --- | --- |
| Figma file URL | `https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows` |
| Figma file key | `NrUGKPZUewpuA8XuHI0v5n` |
| Authoritative frame name | `Live UI References - Folder Browser` |
| Frame node hint | `7:2` (lookup only — not a stable contract ID) |
| Baseline locked | 2026-04-19 (Phase 1) |

### Current surface (implementation source)

| Field | Value |
| --- | --- |
| Component source path | `packages/ui/src/components/windows/**` |
| Compare stage owner | `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` |
| Stage selector (desktop) | `[data-window-compare-stage="desktop"]` |
| Stage selector (mobile) | `[data-window-compare-stage="mobile"]` |
| Compare story root | `Windows/Compose/Folder`, `Windows/Compose/Browser` |

---

## Summary Table

| State key | Canvas match | Mismatch pixels | Total pixels | Mismatch % | Threshold | Passed |
| --- | --- | --- | --- | --- | --- | --- |
| `folder/desktop-blog` | yes (1282x752) | 493,243 | 964,064 | 51.16% | 0.05 | no |
| `folder/desktop-search-open` | yes (1282x752) | 478,865 | 964,064 | 49.67% | 0.05 | no |
| `browser/desktop-article` | yes (1282x752) | 628,442 | 964,064 | 65.19% | 0.05 | no |
| `browser/desktop-address-open` | yes (1282x752) | 635,692 | 964,064 | 65.94% | 0.05 | no |
| `folder/mobile-blog` | yes (392x796) | 152,871 | 312,032 | 48.99% | 0.05 | no |
| `browser/mobile-article` | yes (392x796) | 117,166 | 312,032 | 37.55% | 0.05 | no |

All six states share identical canvas geometry between reference and current — no dimension mismatch. All six states fail the 0.05 pixel-perfect threshold. The high mismatch percentages (37–66%) indicate broad surface-level color, background, and content rendering differences rather than isolated layout point failures.

---

## Per-State 3-Bucket Report

---

### State 1 — `folder/desktop-blog`

**Diff artifact:** `visual-compare/folder-desktop-blog-diff.png`
**Raw metrics:** 493,243 mismatched px / 964,064 total px / 51.16%

#### Blocking differences

- B1: Card thumbnail area — Figma shows a styled image thumbnail filling the upper portion of each card. Current renders a placeholder or differently styled element causing full-card-area pixel mismatch across all 6 visible grid positions.
- B2: Card grid layout — diff shows full-width red coverage across the entire card grid body, indicating card height, gap, or grid column width diverges significantly from Figma at desktop breakpoint.
- B3: Window chrome title bar — top title bar area shows pixel mismatch across the full horizontal strip; title font weight or background color deviates from Figma reference.
- B4: Sidebar navigation area — left sidebar strip shows consistent mismatch; background color or item spacing does not match Figma.

#### Non-blocking differences

- Window chrome button placement pixel exactness (close/minimize/maximize icon positions).
- Navigation arrow icon glyph shape (back/forward arrows in breadcrumb bar).
- Search bar visual styling — presence and exact chip/tag border radius not a Phase 5 target.

#### Fixture noise

- Thumbnail artwork pixel content (blog post cover images differ between Figma export and fixture).
- Entry title text string content.
- `metaLabel` / category badge text values.
- `summary` / subtitle body copy text.

---

### State 2 — `folder/desktop-search-open`

**Diff artifact:** `visual-compare/folder-desktop-search-open-diff.png`
**Raw metrics:** 478,865 mismatched px / 964,064 total px / 49.67%

#### Blocking differences

- B1 (shared with state 1): Card thumbnail area — same full-card-area mismatch as `folder/desktop-blog`; thumbnail rendering diverges from Figma across all visible grid positions.
- B2 (shared with state 1): Card grid layout — card height, gap, and column width differ from Figma at desktop breakpoint, producing full-grid-body mismatch.
- B3 (shared with state 1): Window chrome title bar — title bar strip shows full-horizontal mismatch.
- B4 (shared with state 1): Sidebar navigation area — left sidebar strip mismatch.

#### Non-blocking differences

- Search input field placement within the chrome area — Figma shows open search bar in the top-right chrome region; current diff shows additional mismatch pixels in that zone but this is out-of-scope for the Phase 5 blocker fix.
- Open search chip affordance visual exactness (chip colors, tag shape, border radius, chip label text).
- Search filter area or dropdown exact styling visible in the open state.

#### Fixture noise

- Thumbnail artwork pixel content.
- Entry title and `metaLabel` text string content.
- Specific chip filter values shown in the open-state overlay.
- `summary` / subtitle body copy text.

---

### State 3 — `browser/desktop-article`

**Diff artifact:** `visual-compare/browser-desktop-article-diff.png`
**Raw metrics:** 628,442 mismatched px / 964,064 total px / 65.19%

#### Blocking differences

- B5: Browser window frame outer boundary — diff covers the entire frame border and chrome strip with dense red/yellow mismatch, indicating the window frame color, border width, or corner treatment deviates substantially from Figma at `1282x752`.
- B6: Browser toolbar area — toolbar region (back/forward, address bar) shows continuous horizontal mismatch strip; toolbar height or background color diverges from Figma.
- B7: Article body background — the large body area shows systematic pixel-level noise across the full content zone, indicating a background color or opacity mismatch rather than purely content divergence.

#### Non-blocking differences

- Toolbar icon glyph exactness (back arrow, forward arrow, reload button shape).
- Tab title truncation point relative to Figma reference.
- Address bar text truncation point.

#### Fixture noise

- Article title and body copy content.
- Article cover image / artwork pixel content.
- Body text length variation that does not affect geometry validation.

---

### State 4 — `browser/desktop-address-open`

**Diff artifact:** `visual-compare/browser-desktop-address-open-diff.png`
**Raw metrics:** 635,692 mismatched px / 964,064 total px / 65.94%

#### Blocking differences

- B5 (shared with state 3): Browser window frame outer boundary — same full-frame-border mismatch as `browser/desktop-article`.
- B6 (shared with state 3): Browser toolbar area — toolbar region shows same horizontal mismatch strip.
- B7 (shared with state 3): Article body background — same systematic background mismatch in body zone.
- B8: Address dropdown — Figma shows an address suggestion dropdown appearing below the address bar in this open state. Diff shows additional mismatch pixels in the upper-right chrome zone; the dropdown boundary, width alignment to address bar, and visible extent must match Figma. This is blocker scope for this state only.

#### Non-blocking differences

- Dropdown item icon/glyph exact shape.
- Minor copy drift in dropdown suggestion items (text truncation at right edge).

#### Fixture noise

- Exact dropdown text suggestions / URL copy when geometry is validated.
- Article body content visible behind the open dropdown.

---

### State 5 — `folder/mobile-blog`

**Diff artifact:** `visual-compare/folder-mobile-blog-diff.png`
**Raw metrics:** 152,871 mismatched px / 312,032 total px / 48.99%

#### Blocking differences

- B1 (mobile variant): Card thumbnail area — diff shows full-card-area mismatch for all visible cards at mobile breakpoint; thumbnail rendering diverges from Figma in the 2-column grid layout.
- B9: Mobile 2-column card grid — diff shows coverage across the entire grid body at the mobile 2-column layout; card width, card height, and gap between cards at mobile breakpoint differ from Figma.
- B3 (mobile variant): Window chrome strip at mobile — top title-bar / chrome strip shows full-width mismatch.

#### Non-blocking differences

- Mobile chrome condensed header treatment exactness.
- Detail copy / subtitle text visible in mobile cards.
- Mobile sidebar / navigation presence or absence at mobile breakpoint.

#### Fixture noise

- Thumbnail artwork pixel content.
- Entry title text string content at mobile card size.
- `metaLabel` and `summary` text copy.

---

### State 6 — `browser/mobile-article`

**Diff artifact:** `visual-compare/browser-mobile-article-diff.png`
**Raw metrics:** 117,166 mismatched px / 312,032 total px / 37.55%

#### Blocking differences

- B5 (mobile variant): Browser window frame outer boundary at mobile dimensions (`392x796`) — diff shows frame border and chrome strip mismatch, indicating window frame color or border treatment deviates from Figma at mobile size.
- B6 (mobile variant): Browser toolbar area at mobile — toolbar strip shows horizontal mismatch; toolbar height or background color at mobile breakpoint diverges from Figma.
- B7 (mobile variant): Article body background at mobile — body area shows background color or opacity mismatch across the full content zone.

#### Non-blocking differences

- Toolbar icon glyph exactness at mobile size.
- Minor chrome copy drift at mobile breakpoint.

#### Fixture noise

- Article title and body copy content.
- Article cover image pixel content.
- Body text length variation.

---

## Phase 5 Blocking Fix Targets

The following items constitute the authoritative punch list for Phase 5. Each item is identified by its blocker ID and the states it affects. Phase 5 must close all B1-B9 items or explicitly carry them forward as documented remaining blockers.

| ID | Description | Affected states |
| --- | --- | --- |
| B1 | Card thumbnail rendering — thumbnail slot presence, dimensions, aspect ratio, and position within card do not match Figma | `folder/desktop-blog`, `folder/desktop-search-open`, `folder/mobile-blog` |
| B2 | Desktop card grid layout — card height, inter-card gap, and column width at desktop breakpoint do not match Figma | `folder/desktop-blog`, `folder/desktop-search-open` |
| B3 | Window chrome title bar — title bar background color or font weight diverges from Figma across folder and browser variants | `folder/desktop-blog`, `folder/desktop-search-open`, `folder/mobile-blog` |
| B4 | Sidebar navigation area — sidebar background color or item spacing does not match Figma | `folder/desktop-blog`, `folder/desktop-search-open` |
| B5 | Browser window frame outer boundary — frame color, border width, or corner treatment at both desktop (`1282x752`) and mobile (`392x796`) diverges from Figma | `browser/desktop-article`, `browser/desktop-address-open`, `browser/mobile-article` |
| B6 | Browser toolbar area — toolbar height or background color at desktop and mobile breakpoints diverges from Figma | `browser/desktop-article`, `browser/desktop-address-open`, `browser/mobile-article` |
| B7 | Article body background — background color or opacity in the browser body zone does not match Figma | `browser/desktop-article`, `browser/desktop-address-open`, `browser/mobile-article` |
| B8 | Address dropdown — dropdown boundary, width alignment to address bar, and visible extent in the open state do not match Figma | `browser/desktop-address-open` |
| B9 | Mobile 2-column card grid — card width, card height, and gap in the 2-column mobile grid do not match Figma | `folder/mobile-blog` |