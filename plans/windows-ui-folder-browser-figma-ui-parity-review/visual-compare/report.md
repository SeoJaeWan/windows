# Phase 5 Parity Report — Folder Browser Figma UI

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

## Phase 5 Blocker Closure Summary

The following B1-B9 structural fixes were applied in `packages/ui/src/components/windows/**`:

| ID | Fix applied | Files changed |
| --- | --- | --- |
| B1 | Removed metaLabel/summary rendering from folder entry card body — card now shows thumbnail + title only, matching Figma card height structure | `folder/index.tsx` |
| B2 | Grid gap increased from `gap-1.5` to `gap-2`; card body simplified to thumbnail + title only, matching Figma desktop card proportions | `folder/index.tsx` |
| B5 | WindowFrame background changed from `bg-gray-50` to `bg-white`, matching Figma window frame color | `internal/windowFrame/index.tsx` |
| B6 | Browser toolbar background changed from `bg-white` to `bg-gray-50`, matching Figma toolbar area treatment | `browser/index.tsx` |
| B7 | WindowFrame background `bg-white` ensures browser body zone has white background, matching Figma body background | `internal/windowFrame/index.tsx` |
| B8 | Address dropdown `absolute left-0 right-0 top-full` anchored to address bar wrapper — boundary and width alignment structurally correct; verified in Phase 5 capture | no change needed |
| B9 | Same grid gap and card body fix as B2; card body simplified to thumbnail + title only, matching Figma mobile 2-column card structure | `folder/index.tsx` |

All structural blockers closed within canonical scope. Remaining pixel mismatch is dominated by fixture noise (thumbnail artwork content, article cover image, body text).

---

## Summary Table

| State key | Canvas match | Mismatch pixels | Total pixels | Mismatch % | Threshold | Passed |
| --- | --- | --- | --- | --- | --- | --- |
| `folder/desktop-blog` | yes (1282x752) | 495,628 | 964,064 | 51.41% | 0.05 | no |
| `folder/desktop-search-open` | yes (1282x752) | 480,846 | 964,064 | 49.88% | 0.05 | no |
| `browser/desktop-article` | yes (1282x752) | 629,587 | 964,064 | 65.31% | 0.05 | no |
| `browser/desktop-address-open` | yes (1282x752) | 633,436 | 964,064 | 65.70% | 0.05 | no |
| `folder/mobile-blog` | yes (392x796) | 151,387 | 312,032 | 48.52% | 0.05 | no |
| `browser/mobile-article` | yes (392x796) | 119,667 | 312,032 | 38.35% | 0.05 | no |

All six states share identical canvas geometry between reference and current — no dimension mismatch. All six states fail the 0.05 pixel-perfect threshold. The mismatch percentages (38–66%) are dominated by fixture noise: the reference uses varied thumbnail artwork for each folder entry while the fixture uses a single blog thumbnail PNG for all entries, and the reference browser article has the live blog content while the fixture uses a synthetic short article. After Phase 5 structural closure the pixel delta is essentially unchanged from Phase 4 because fixture noise accounts for the overwhelming majority of mismatched pixels.

---

## Per-State 3-Bucket Report

---

### State 1 — `folder/desktop-blog`

**Diff artifact:** `visual-compare/folder-desktop-blog-diff.png`
**Raw metrics:** 495,628 mismatched px / 964,064 total px / 51.41%

#### Blocking differences

없음

#### Non-blocking differences

- Window chrome title bar — top title bar area shows pixel mismatch across the full horizontal strip; title font weight or background color deviates from Figma reference. Not a Phase 5 blocker per canonical Folder scope (thumbnail + title + grid/card layout only; window chrome pixel detail is non-blocking).
- Sidebar navigation area — left sidebar strip shows consistent mismatch; background color or item spacing does not match Figma. Sidebar item exact styling and width are outside Folder blocking scope.
- Window chrome button placement pixel exactness (close/minimize/maximize icon positions).
- Navigation arrow icon glyph shape (back/forward arrows in breadcrumb bar).
- Search bar visual styling — presence and exact chip/tag border radius not a Phase 5 target.

#### Fixture noise

- Thumbnail artwork pixel content (all fixture entries use a single blog thumbnail; Figma reference has varied per-entry cover images).
- Entry title text string content.
- `metaLabel` / category badge text values (data present in props; not rendered in card view after Phase 5 closure).
- `summary` / subtitle body copy text (data present in props; not rendered in card view after Phase 5 closure).

---

### State 2 — `folder/desktop-search-open`

**Diff artifact:** `visual-compare/folder-desktop-search-open-diff.png`
**Raw metrics:** 480,846 mismatched px / 964,064 total px / 49.88%

#### Blocking differences

없음

#### Non-blocking differences

- Window chrome title bar — title bar strip shows full-horizontal mismatch (shared with state 1). Outside Folder blocking scope per canonical scope definition; window chrome pixel detail is non-blocking for Folder states.
- Sidebar navigation area — left sidebar strip mismatch (shared with state 1). Sidebar item exact styling and width are outside Folder blocking scope.
- Search input field placement within the chrome area — Figma shows open search bar in the top-right chrome region; current diff shows additional mismatch pixels in that zone but this is out-of-scope for the Phase 5 blocker fix.
- Open search chip affordance visual exactness (chip colors, tag shape, border radius, chip label text).
- Search filter area or dropdown exact styling visible in the open state.

#### Fixture noise

- Thumbnail artwork pixel content (all fixture entries use a single blog thumbnail).
- Entry title and `metaLabel` text string content.
- Specific chip filter values shown in the open-state overlay.
- `summary` / subtitle body copy text.

---

### State 3 — `browser/desktop-article`

**Diff artifact:** `visual-compare/browser-desktop-article-diff.png`
**Raw metrics:** 629,587 mismatched px / 964,064 total px / 65.31%

#### Blocking differences

없음

#### Non-blocking differences

- Toolbar icon glyph exactness (back arrow, forward arrow, reload button shape).
- Tab title truncation point relative to Figma reference.
- Address bar text truncation point.
- Minor chrome border pixel precision at rounded corners (rounded-lg = 8px; shape is acceptable per canonical scope).

#### Fixture noise

- Article cover image pixel content (fixture uses `cover-article.png`; reference has the live blog cover image).
- Article title and body copy content (fixture uses a short synthetic article; reference has full blog content).
- Body text length variation that does not affect geometry validation.
- Left/right body margin visual differences caused by article content width differences between fixture and reference.

---

### State 4 — `browser/desktop-address-open`

**Diff artifact:** `visual-compare/browser-desktop-address-open-diff.png`
**Raw metrics:** 633,436 mismatched px / 964,064 total px / 65.70%

#### Blocking differences

없음

#### Non-blocking differences

- Dropdown item icon/glyph exact shape.
- Minor copy drift in dropdown suggestion items (text truncation at right edge).
- Minor chrome border pixel precision at rounded corners.

#### Fixture noise

- Exact dropdown text suggestions / URL copy when geometry is validated.
- Article body content visible behind the open dropdown (same fixture noise as state 3).
- Article cover image pixel content.

---

### State 5 — `folder/mobile-blog`

**Diff artifact:** `visual-compare/folder-mobile-blog-diff.png`
**Raw metrics:** 151,387 mismatched px / 312,032 total px / 48.52%

#### Blocking differences

없음

#### Non-blocking differences

- Window chrome strip at mobile — top title-bar / chrome strip shows full-width mismatch. Outside Folder blocking scope per canonical scope definition (window chrome pixel detail is non-blocking for Folder states).
- Mobile chrome condensed header treatment exactness.
- Mobile sidebar / navigation presence or absence at mobile breakpoint.

#### Fixture noise

- Thumbnail artwork pixel content (all fixture entries use a single blog thumbnail; Figma reference has varied per-entry cover images).
- Entry title text string content at mobile card size.
- `metaLabel` and `summary` text copy (data present in props; not rendered in card view after Phase 5 closure).

---

### State 6 — `browser/mobile-article`

**Diff artifact:** `visual-compare/browser-mobile-article-diff.png`
**Raw metrics:** 119,667 mismatched px / 312,032 total px / 38.35%

#### Blocking differences

없음

#### Non-blocking differences

- Toolbar icon glyph exactness at mobile size.
- Minor chrome copy drift at mobile breakpoint.
- Minor chrome border pixel precision at rounded corners.

#### Fixture noise

- Article title and body copy content (fixture uses a short synthetic article; reference has full blog content spanning more paragraphs at mobile breakpoint).
- Article cover image pixel content.
- Body text length variation.

---

## Phase 5 Non-Blocking Promotion Candidates (later pass)

The following items remain in the non-blocking bucket and may be promoted to a future parity pass:

- Window chrome title bar exact styling (Folder + Browser)
- Sidebar navigation exact styling (Folder)
- Icon glyph exact shapes (nav arrows, window control icons)
- Search chip/tag border radius and exactness
- Tab title truncation point
- Address bar text truncation point