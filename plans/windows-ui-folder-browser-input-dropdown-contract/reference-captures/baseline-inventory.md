# Baseline Inventory — Figma 3:2 Live UI References

## Provenance

| 항목 | 값 |
| --- | --- |
| Figma file key | `NrUGKPZUewpuA8XuHI0v5n` |
| Authoritative canvas node | `3:2` |
| Authoritative frame/canvas name | `Live UI References — Folder Browser` |
| Canonical mobile section marker | `__section-mobile` |
| Authoritative source rule | `file key + canvas 3:2 + frame/canvas name + visible wrapper label` |
| Stale legacy (rejected) | `7:* image-node`, `imageScreen` wording, 6-state naming |

## Desktop Section (11 wrappers)

| state key | wrapper label | section | state role | provenance | capture filename |
| --- | --- | --- | --- | --- | --- |
| `folder/live-blog` | `folder/live-blog` | desktop | `contract-bearing` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / wrapper label `folder/live-blog` | `folder-live-blog-reference.png` |
| `browser/live-article` | `browser/live-article` | desktop | `contract-bearing` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / wrapper label `browser/live-article` | `browser-live-article-reference.png` |
| `folder/live-search-open` | `folder/live-search-open` | desktop | `contract-bearing` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / wrapper label `folder/live-search-open` | `folder-live-search-open-reference.png` |
| `folder/live-chip-open` | `folder/live-chip-open` | desktop | `detail-variant` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / wrapper label `folder/live-chip-open` | `folder-live-chip-open-reference.png` |
| `folder/live-sidebar-hover` | `folder/live-sidebar-hover` | desktop | `detail-variant` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / wrapper label `folder/live-sidebar-hover` | `folder-live-sidebar-hover-reference.png` |
| `folder/live-sidebar-expanded` | `folder/live-sidebar-expanded` | desktop | `detail-variant` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / wrapper label `folder/live-sidebar-expanded` | `folder-live-sidebar-expanded-reference.png` |
| `folder/live-thumbnail-hover` | `folder/live-thumbnail-hover` | desktop | `detail-variant` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / wrapper label `folder/live-thumbnail-hover` | `folder-live-thumbnail-hover-reference.png` |
| `browser/live-address-open` | `browser/live-address-open` | desktop | `contract-bearing` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / wrapper label `browser/live-address-open` | `browser-live-address-open-reference.png` |
| `browser/live-control-hover-minimize` | `browser/live-control-hover-minimize` | desktop | `detail-variant` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / wrapper label `browser/live-control-hover-minimize` | `browser-live-control-hover-minimize-reference.png` |
| `browser/live-control-hover-maximize` | `browser/live-control-hover-maximize` | desktop | `detail-variant` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / wrapper label `browser/live-control-hover-maximize` | `browser-live-control-hover-maximize-reference.png` |
| `browser/live-control-hover-close` | `browser/live-control-hover-close` | desktop | `detail-variant` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / wrapper label `browser/live-control-hover-close` | `browser-live-control-hover-close-reference.png` |

## Mobile Section (`__section-mobile`, 4 wrappers)

| state key | wrapper label | section | state role | provenance | capture filename |
| --- | --- | --- | --- | --- | --- |
| `folder/mobile-blog` | `folder/mobile-blog` | `__section-mobile` | `contract-bearing` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / section `__section-mobile` / wrapper label `folder/mobile-blog` | `folder-mobile-blog-reference.png` |
| `folder/mobile-search-open` | `folder/mobile-search-open` | `__section-mobile` | `contract-bearing` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / section `__section-mobile` / wrapper label `folder/mobile-search-open` | `folder-mobile-search-open-reference.png` |
| `browser/mobile-article` | `browser/mobile-article` | `__section-mobile` | `contract-bearing` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / section `__section-mobile` / wrapper label `browser/mobile-article` | `browser-mobile-article-reference.png` |
| `browser/mobile-address-open` | `browser/mobile-address-open` | `__section-mobile` | `contract-bearing` | Figma file `NrUGKPZUewpuA8XuHI0v5n` / canvas `3:2` / frame `Live UI References — Folder Browser` / section `__section-mobile` / wrapper label `browser/mobile-address-open` | `browser-mobile-address-open-reference.png` |

## Summary

| 항목 | 값 |
| --- | --- |
| 총 wrapper 수 | 15 |
| desktop wrapper 수 | 11 |
| mobile wrapper 수 (`__section-mobile`) | 4 |
| `contract-bearing` 수 | 8 |
| `detail-variant` 수 | 7 |

## State Role 정의

| state role | 의미 | 해당 state keys |
| --- | --- | --- |
| `contract-bearing` | public API contract로 표현되는 primary state | `folder/live-blog`, `browser/live-article`, `folder/live-search-open`, `browser/live-address-open`, `folder/mobile-blog`, `folder/mobile-search-open`, `browser/mobile-article`, `browser/mobile-address-open` |
| `detail-variant` | storybook/internal review surface에서만 owner인 detail state. public prop으로 승격하지 않음 | `folder/live-chip-open`, `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover`, `browser/live-control-hover-minimize`, `browser/live-control-hover-maximize`, `browser/live-control-hover-close` |

## Capture Naming Convention

local mirror capture naming은 exact `kind-state` 규칙을 따른다:

- pattern: `{kind}-{state}-reference.png`
- kind: `folder` 또는 `browser`
- state: wrapper label에서 `/`를 `-`로 변환한 것 (`live-blog`, `mobile-blog` 등)
- suffix: Phase 1 Figma reference는 `-reference.png`

예시:
- `folder/live-blog` → `folder-live-blog-reference.png`
- `browser/live-article` → `browser-live-article-reference.png`
- `folder/mobile-blog` → `folder-mobile-blog-reference.png`
- `browser/mobile-address-open` → `browser-mobile-address-open-reference.png`

## Rejection Rule

아래 wording은 이 plan에서 canonical provenance로 재사용하지 않는다:

- `7:* image-node` (stale legacy — old image node reference)
- `imageScreen` (stale legacy — old wording)
- 6-state inventory (incomplete — 15-state가 canonical)

## Capture Status

| capture filename | status | notes |
| --- | --- | --- |
| `folder-live-blog-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `browser-live-article-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `folder-live-search-open-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `folder-live-chip-open-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `folder-live-sidebar-hover-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `folder-live-sidebar-expanded-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `folder-live-thumbnail-hover-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `browser-live-address-open-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `browser-live-control-hover-minimize-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `browser-live-control-hover-maximize-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `browser-live-control-hover-close-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `folder-mobile-blog-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `folder-mobile-search-open-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `browser-mobile-article-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
| `browser-mobile-address-open-reference.png` | pending | Figma MCP `get_screenshot` 필요 |
