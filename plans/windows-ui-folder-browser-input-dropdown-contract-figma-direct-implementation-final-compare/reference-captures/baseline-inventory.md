# Baseline Inventory

> Provenance: external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser"
>
> Acquisition rule: Phase 1에서 locked Figma source의 각 wrapper 이미지 노드에서 Figma MCP `get_design_context`로 asset URL을 추출하고, Node.js HTTPS로 current slug의 `reference-captures/{kind}-{state}-reference.png`로 직접 export한다. sibling repo-local bundle은 authority가 아니다.

| 키 | state role | Storybook `storyId` | `stageAttr` | reference 파일 | provenance |
| --- | --- | --- | --- | --- | --- |
| `folder/live-blog` | `contract-bearing` | `windows-compose-folder--compare-live-blog` | `desktop` | `folder-live-blog-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "folder/live-blog" |
| `folder/live-search-open` | `contract-bearing` | `windows-compose-folder--compare-live-search-open` | `desktop` | `folder-live-search-open-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "folder/live-search-open" |
| `folder/live-chip-open` | `detail-variant` | `windows-compose-folder--compare-live-chip-open` | `desktop` | `folder-live-chip-open-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "folder/live-chip-open" |
| `folder/live-sidebar-hover` | `detail-variant` | `windows-compose-folder--compare-live-sidebar-hover` | `desktop` | `folder-live-sidebar-hover-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "folder/live-sidebar-hover" |
| `folder/live-sidebar-expanded` | `detail-variant` | `windows-compose-folder--compare-live-sidebar-expanded` | `desktop` | `folder-live-sidebar-expanded-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "folder/live-sidebar-expanded" |
| `folder/live-thumbnail-hover` | `detail-variant` | `windows-compose-folder--compare-live-thumbnail-hover` | `desktop` | `folder-live-thumbnail-hover-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "folder/live-thumbnail-hover" |
| `folder/mobile-blog` | `contract-bearing` | `windows-compose-folder--compare-mobile-blog` | `mobile` | `folder-mobile-blog-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / __section-mobile / wrapper "folder/mobile-blog" |
| `folder/mobile-search-open` | `contract-bearing` | `windows-compose-folder--compare-mobile-search-open` | `mobile` | `folder-mobile-search-open-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / __section-mobile / wrapper "folder/mobile-search-open" |
| `browser/live-article` | `contract-bearing` | `windows-compose-browser--compare-live-article` | `desktop` | `browser-live-article-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "browser/live-article" |
| `browser/live-address-open` | `contract-bearing` | `windows-compose-browser--compare-live-address-open` | `desktop` | `browser-live-address-open-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "browser/live-address-open" |
| `browser/live-control-hover-minimize` | `detail-variant` | `windows-compose-browser--compare-live-control-hover-minimize` | `desktop` | `browser-live-control-hover-minimize-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "browser/live-control-hover-minimize" |
| `browser/live-control-hover-maximize` | `detail-variant` | `windows-compose-browser--compare-live-control-hover-maximize` | `desktop` | `browser-live-control-hover-maximize-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "browser/live-control-hover-maximize" |
| `browser/live-control-hover-close` | `detail-variant` | `windows-compose-browser--compare-live-control-hover-close` | `desktop` | `browser-live-control-hover-close-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "browser/live-control-hover-close" |
| `browser/mobile-article` | `contract-bearing` | `windows-compose-browser--compare-mobile-article` | `mobile` | `browser-mobile-article-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / __section-mobile / wrapper "browser/mobile-article" |
| `browser/mobile-address-open` | `contract-bearing` | `windows-compose-browser--compare-mobile-address-open` | `mobile` | `browser-mobile-address-open-reference.png` | external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / __section-mobile / wrapper "browser/mobile-address-open" |

## Acquisition Note

- 획득 경로: Figma MCP `get_design_context` → 각 wrapper image 노드에서 배경 이미지 asset URL 추출 → Node.js `https.get()`으로 current slug `reference-captures/` 디렉터리로 직접 export
- source: file key `NrUGKPZUewpuA8XuHI0v5n`, canvas `3:2`, frame `Live UI References — Folder Browser`
- mobile 4개 row (`folder/mobile-blog`, `folder/mobile-search-open`, `browser/mobile-article`, `browser/mobile-address-open`)는 `__section-mobile` source section marker와 연결됨
- sibling repo-local baseline bundle은 completeness cross-check 용도만 허용, authority 또는 copy-forward source 금지
- proxy baseline, placeholder baseline은 acceptance source 아님
