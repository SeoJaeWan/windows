# Visual Diff Report — Windows Family (Folder / Browser)

**Blocking threshold**: `scopedBlockingDiffRatio <= 0.05`
**Advisory metric**: `globalDriftRatio` (never blocks by itself)

## Gating surface union rules

| Compare key | Gating surfaces |
| --- | --- |
| `folder/live-blog` | frame-surface, navigation-surface, control-surface, content-surface, media-surface |
| `folder/live-search-open` | frame-surface, navigation-surface, control-surface, content-surface, media-surface |
| `folder/live-chip-open` | frame-surface, navigation-surface, control-surface, content-surface, media-surface |
| `folder/live-sidebar-hover` | navigation-surface, control-surface, content-surface, media-surface |
| `folder/live-sidebar-expanded` | navigation-surface, control-surface, content-surface, media-surface |
| `folder/live-thumbnail-hover` | navigation-surface, control-surface, content-surface, media-surface |
| `folder/mobile-blog` | frame-surface, control-surface, content-surface, media-surface |
| `folder/mobile-search-open` | frame-surface, control-surface, content-surface, media-surface |
| `browser/live-article` | frame-surface, control-surface, content-surface |
| `browser/live-address-open` | frame-surface, control-surface, content-surface |
| `browser/live-control-hover-minimize` | frame-surface, control-surface |
| `browser/live-control-hover-maximize` | frame-surface, control-surface |
| `browser/live-control-hover-close` | frame-surface, control-surface |
| `browser/mobile-article` | frame-surface, control-surface, content-surface |
| `browser/mobile-address-open` | frame-surface, control-surface, content-surface |

## Results

| Compare key | Status | scopedBlockingDiffRatio | globalDriftRatio (advisory) |
| --- | --- | --- | --- |
| `folder/live-blog` | ✗ **EXPLICIT BLOCKER** | 0.4488 | 0.4488 |
| `folder/live-search-open` | ✗ **EXPLICIT BLOCKER** | 0.4488 | 0.4488 |
| `folder/live-chip-open` | ✗ **EXPLICIT BLOCKER** | 0.4501 | 0.4501 |
| `folder/live-sidebar-hover` | ✗ **EXPLICIT BLOCKER** | 0.4488 | 0.4488 |
| `folder/live-sidebar-expanded` | ✗ **EXPLICIT BLOCKER** | 0.4488 | 0.4488 |
| `folder/live-thumbnail-hover` | ✗ **EXPLICIT BLOCKER** | 0.4488 | 0.4488 |
| `folder/mobile-blog` | ✗ **EXPLICIT BLOCKER** | 0.4595 | 0.4595 |
| `folder/mobile-search-open` | ✗ **EXPLICIT BLOCKER** | 0.4595 | 0.4595 |
| `browser/live-article` | ✗ **EXPLICIT BLOCKER** | 0.4474 | 0.4474 |
| `browser/live-address-open` | ✗ **EXPLICIT BLOCKER** | 0.4488 | 0.4488 |
| `browser/live-control-hover-minimize` | ✗ **EXPLICIT BLOCKER** | 0.4474 | 0.4474 |
| `browser/live-control-hover-maximize` | ✗ **EXPLICIT BLOCKER** | 0.4474 | 0.4474 |
| `browser/live-control-hover-close` | ✗ **EXPLICIT BLOCKER** | 0.4474 | 0.4474 |
| `browser/mobile-article` | ✗ **EXPLICIT BLOCKER** | 0.4637 | 0.4637 |
| `browser/mobile-address-open` | ✗ **EXPLICIT BLOCKER** | 0.4648 | 0.4648 |

## Blocking decision rule

Each state passes only when:
1. Every declared gating surface from the exact union inventory is PRESENT.
2. No boundary/anchor/geometry blocker is found in the gating surfaces.
3. `scopedBlockingDiffRatio <= 0.05`

> `globalDriftRatio` is always reported but NEVER blocks by itself.
> Whole-canvas mismatch alone is NOT a blocker.

## Provenance

**Reference**: external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper \"{key}\"
**Current**: package-local current — packages/ui Storybook / [data-window-compare-stage]
