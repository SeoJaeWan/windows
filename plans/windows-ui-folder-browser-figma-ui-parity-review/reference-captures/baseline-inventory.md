# Baseline Inventory — Figma Live UI References: Folder Browser

## Primary Provenance

| Field | Value |
| --- | --- |
| Figma file key | `NrUGKPZUewpuA8XuHI0v5n` |
| Figma file URL | `https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows` |
| Authoritative frame name | `Live UI References - Folder Browser` |
| Current frame node hint | `7:2` (lookup only — not a stable contract identifier) |
| Phase | 1 — source and state inventory lock |
| Locked date | 2026-04-19 |

> Node IDs listed as "current node hint" are lookup helpers only. If the Figma document is restructured, the frame name and state label are the canonical identifiers — not the node IDs.

---

## Export Size Contract

| Viewport family | Canonical outer geometry |
| --- | --- |
| Desktop | `1282x752` |
| Mobile | `392x796` |

`1282x752` and `392x796` are the single canonical compare-stage contract. Reference PNGs are produced at these exact outer dimensions including the window-frame border. `compareWindowStage.tsx` uses these same dimensions as its capture canvas.

---

## Canonical State Inventory

Six states are locked as the authoritative review baseline. State labels are literal — later story IDs, artifact names, and `data-visual-state` values derive from these exact strings without transformation.

| # | State label | Kind | Viewport | Current text node hint | Current image node hint | Reference PNG |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `folder/desktop-blog` | Folder | Desktop | `7:13` | `7:15` | `folder-desktop-blog.png` |
| 2 | `folder/desktop-search-open` | Folder | Desktop | `7:18` | `7:20` | `folder-desktop-search-open.png` |
| 3 | `browser/desktop-article` | Browser | Desktop | `7:23` | `7:25` | `browser-desktop-article.png` |
| 4 | `browser/desktop-address-open` | Browser | Desktop | `7:28` | `7:30` | `browser-desktop-address-open.png` |
| 5 | `folder/mobile-blog` | Folder | Mobile | `7:33` | `7:35` | `folder-mobile-blog.png` |
| 6 | `browser/mobile-article` | Browser | Mobile | `7:38` | `7:40` | `browser-mobile-article.png` |

Reference PNG naming rule: `{kind}-{state}.png` where `/` in the state label is replaced by `-`.

---

## Per-State Classification Rules

### State 1 — `folder/desktop-blog`

**Blocking focus (must close for Phase 5 completion):**
- Thumbnail slot: presence, dimensions, aspect ratio, position within card
- Title text: visible, correct font size and weight, correct vertical placement under thumbnail
- Grid/card layout: number of columns, card width, card height, gap between cards, grid padding

**Non-blocking differences (visible mismatch, later-pass only):**
- Search bar / search chip overlay presence and exact styling
- Sidebar navigation item exact styling and width
- Window chrome exact pixel detail (title bar font weight, button placement)
- Icon glyph exact shape (folder icon, navigation arrow icons)

**Fixture noise (not a parity winner in this pass):**
- `metaLabel` value (e.g. category badges, dates)
- `summary` / subtitle copy text
- Thumbnail artwork pixel content
- Exact copy of entry titles (text string content, not text metrics)

---

### State 2 — `folder/desktop-search-open`

**Blocking focus:**
- Same as `folder/desktop-blog`: thumbnail + title + grid/card layout

**Non-blocking differences:**
- Search input field: presence and approximate placement within chrome area
- Open search chip affordance visual exactness (chip colors, tag shape, border radius)
- Search dropdown / filter area exact styling
- Exact chip label text values

**Fixture noise:**
- `metaLabel`, `summary`, thumbnail art, exact copy
- Specific chip filter values shown in the open state

> `folder/desktop-search-open` is in canonical compare inventory but out-of-scope leaf mismatch (search input/chip area, chip exactness, filter dropdown styling) must not be promoted to blocker.

---

### State 3 — `browser/desktop-article`

**Blocking focus:**
- WindowFrame outer boundary: correct dimensions at `1282x752` outer geometry
- Toolbar area: presence, height, back/forward buttons, address bar dimensions and placement
- Body area boundary: body starts at correct vertical position below toolbar, no overflow or clipping

**Non-blocking differences:**
- Glyph exactness of toolbar icons (back arrow, forward arrow, etc.)
- Minor chrome copy drift (tab title truncation, address bar text truncation)

**Fixture noise:**
- Article title and body copy content
- Article cover image / artwork pixel content
- Body text length variation (does not affect geometry validation)

---

### State 4 — `browser/desktop-address-open`

**Blocking focus:**
- Same WindowFrame + toolbar blocking focus as `browser/desktop-article`
- Address dropdown: presence, vertical placement below address bar, width matches address bar, visible boundary

**Non-blocking differences:**
- Dropdown item glyph exact shape
- Minor copy drift in dropdown suggestion items

**Fixture noise:**
- Exact dropdown text suggestions / URL copy when geometry is unchanged
- Article body content visible behind dropdown

> `browser/desktop-address-open` is in canonical compare inventory but out-of-scope leaf mismatch (dropdown exact copy, glyph shape) must not be promoted to blocker.

---

### State 5 — `folder/mobile-blog`

**Blocking focus:**
- Thumbnail slot: presence, dimensions, aspect ratio, position within card
- Title text: visible, correct font size and weight
- Grid/card layout at mobile breakpoint: number of columns (2-column grid), card width, card height, gap between cards

**Non-blocking differences:**
- Mobile chrome exactness (window chrome condensed header treatment)
- Detail copy / subtitle visible in mobile cards
- Mobile sidebar / navigation presence

**Fixture noise:**
- `metaLabel`, `summary`, thumbnail art, exact copy
- Specific entry titles text content

---

### State 6 — `browser/mobile-article`

**Blocking focus:**
- WindowFrame outer boundary at mobile dimensions (`392x796` outer)
- Toolbar area at mobile: presence, height, navigation button placement
- Body area boundary: correct start position below toolbar, no overflow

**Non-blocking differences:**
- Glyph exactness of toolbar icons at mobile size
- Minor chrome copy drift

**Fixture noise:**
- Article title and body copy content
- Article cover image pixel content
- Body text length variation

---

## Compare Story ID Mapping

These IDs are derived directly from the state labels. Later phases must use them without alteration.

| State label | Compare story ID |
| --- | --- |
| `folder/desktop-blog` | `windows-compose-folder--compare-desktop-blog` |
| `folder/desktop-search-open` | `windows-compose-folder--compare-desktop-search-open` |
| `browser/desktop-article` | `windows-compose-browser--compare-desktop-article` |
| `browser/desktop-address-open` | `windows-compose-browser--compare-desktop-address-open` |
| `folder/mobile-blog` | `windows-compose-folder--compare-mobile-blog` |
| `browser/mobile-article` | `windows-compose-browser--compare-mobile-article` |

---

## Legacy Key Retirement

The following local keys from prior passes are retired. They must not appear in compare inventory, `data-visual-state` attributes, or artifact file names going forward.

| Legacy local key | Replaced by canonical key |
| --- | --- |
| `folder/desktop-card` | `folder/desktop-blog` |
| `folder/mobile-card` | `folder/mobile-blog` |
| `browser/desktop-chrome` | `browser/desktop-article` |
| `browser/mobile-chrome` | `browser/mobile-article` |

---

## Classification Bucket Summary

| Bucket | Definition | Phase 5 treatment |
| --- | --- | --- |
| `blocking differences` | Layout, geometry, spacing, color, boundary mismatch within user-locked first-pass scope | Must be closed by Phase 5 or explicitly listed as remaining blocker |
| `non-blocking differences` | Visible mismatch outside first-pass blocking scope | Recorded in Phase 4 report; not a Phase 5 completion condition |
| `fixture noise` | Text copy, artwork pixels, icon glyph shape — not parity winners in this pass | Recorded separately; never promoted to blocking bucket |

---

## What This Inventory Does NOT Include

- old live-site screenshot reports as authoritative provenance
- `desktop-card` / `desktop-chrome` / `mobile-card` / `mobile-chrome` as canonical keys
- Any assumption that node `7:2` changing would invalidate the plan contract (frame name and state label are the stable identifiers)
- Figma node IDs as stable contract values (they are lookup hints only)
