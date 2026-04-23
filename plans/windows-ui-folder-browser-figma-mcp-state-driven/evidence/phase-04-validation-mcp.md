# Phase 4 — Validation Evidence Note

## 개요

| 항목 | 값 |
| --- | --- |
| phase | 04-repo-local-validation-and-compare-runtime |
| 완료 날짜 | 2026-04-23 |
| 검증 결과 | 테스트 114/114 통과, build-storybook 성공 |

---

## MCP Call Provenance Log

### p04-desktop-stage — get_design_context on node 51:2

| 필드 | 값 |
| --- | --- |
| call_id | p04-desktop-stage |
| tool | get_design_context |
| input | node `51:2`, fileKey `NrUGKPZUewpuA8XuHI0v5n` |
| called_at | 2026-04-23 (Phase 4 execution) |
| response_provenance | MCP server live response |
| inspected_surface_ids | `42:2` (data-name="Live Capture - Blog Window") |
| returned_child_ids | 42:2, 42:3, 42:4, 42:5, 42:11, 42:23, 42:44, ... |
| decision_mapping | desktop stage geometry: width=1282, height=752 from node `42:2` absolute dimensions (`h-[752px]`, `w-[1282px]`) in MCP response |

**MCP response 근거:**
```
<div className="absolute bg-[#f3f4f6] h-[752px] left-[-1px] shadow-[...] top-[-1px] w-[1282px]"
  data-node-id="42:2"
  data-name="Live Capture - Blog Window">
```
- node `42:2`: `w-[1282px]`, `h-[752px]` → desktop stage = **1282×752**

---

### p04-mobile-stage — get_metadata on node 94:6

| 필드 | 값 |
| --- | --- |
| call_id | p04-mobile-stage |
| tool | get_metadata |
| input | node `94:6`, fileKey `NrUGKPZUewpuA8XuHI0v5n` |
| called_at | 2026-04-23 (Phase 4 execution) |
| response_provenance | MCP server live response |
| returned_child_ids | none (leaf frame) |
| decision_mapping | mobile stage geometry: width=390, height=794 from node `94:6` metadata dimensions |

**MCP response 근거:**
```xml
<frame id="94:6" name="Image (folder/mobile-blog)" x="0" y="33" width="390" height="794" />
```
- node `94:6`: `width=390`, `height=794` → mobile stage = **390×794**

---

## Inspected Figma Node Links

| `kind/state` | wrapper node link | primary state root link | stage variant |
| --- | --- | --- | --- |
| `folder/live-blog` | [51:2](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=51-2) | [51:5](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=51-5) | desktop |
| `browser/live-article` | [51:6](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=51-6) | [51:9](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=51-9) | desktop |
| `folder/live-search-open` | [84:2](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=84-2) | [84:5](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=84-5) | desktop |
| `folder/live-chip-open` | [87:2](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-2) | [87:5](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-5) | desktop |
| `folder/live-sidebar-hover` | [87:156](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-156) | [87:159](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-159) | desktop |
| `folder/live-sidebar-expanded` | [87:310](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-310) | [87:313](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-313) | desktop |
| `folder/live-thumbnail-hover` | [87:464](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-464) | [87:467](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-467) | desktop |
| `browser/live-address-open` | [87:618](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-618) | [87:621](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-621) | desktop |
| `browser/live-control-hover-minimize` | [87:772](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-772) | [87:775](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-775) | desktop |
| `browser/live-control-hover-maximize` | [87:926](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-926) | [87:929](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-929) | desktop |
| `browser/live-control-hover-close` | [87:1080](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-1080) | [87:1083](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=87-1083) | desktop |
| `folder/mobile-blog` | [94:3](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=94-3) | [94:6](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=94-6) | mobile |
| `folder/mobile-search-open` | [94:157](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=94-157) | [94:160](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=94-160) | mobile |
| `browser/mobile-article` | [94:311](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=94-311) | [94:314](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=94-314) | mobile |
| `browser/mobile-address-open` | [94:465](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=94-465) | [94:468](https://www.figma.com/design/NrUGKPZUewpuA8XuHI0v5n/Windows?node-id=94-468) | mobile |

---

## Inspected Child Node IDs

| call_id | inspected node | purpose |
| --- | --- | --- |
| p04-desktop-stage | `42:2` (Live Capture - Blog Window) | desktop stage width/height source |
| p04-mobile-stage | `94:6` (Image folder/mobile-blog) | mobile stage width/height source |

---

## Implemented Surface Mapping

| registry key | Storybook story id | data-window-compare-stage | data-visual-root kind | data-visual-root state |
| --- | --- | --- | --- | --- |
| `folder/live-blog` | `windows-compose-folder--compare-live-blog` | `variant=desktop` | `folder` | `live-blog` |
| `folder/live-search-open` | `windows-compose-folder--compare-live-search-open` | `variant=desktop` | `folder` | `live-search-open` |
| `folder/live-chip-open` | `windows-compose-folder--compare-live-chip-open` | `variant=desktop` | `folder` | `live-chip-open` |
| `folder/live-sidebar-hover` | `windows-compose-folder--compare-live-sidebar-hover` | `variant=desktop` | `folder` | `live-sidebar-hover` |
| `folder/live-sidebar-expanded` | `windows-compose-folder--compare-live-sidebar-expanded` | `variant=desktop` | `folder` | `live-sidebar-expanded` |
| `folder/live-thumbnail-hover` | `windows-compose-folder--compare-live-thumbnail-hover` | `variant=desktop` | `folder` | `live-thumbnail-hover` |
| `folder/mobile-blog` | `windows-compose-folder--compare-mobile-blog` | `variant=mobile` | `folder` | `mobile-blog` |
| `folder/mobile-search-open` | `windows-compose-folder--compare-mobile-search-open` | `variant=mobile` | `folder` | `mobile-search-open` |
| `browser/live-article` | `windows-compose-browser--compare-live-article` | `variant=desktop` | `browser` | `live-article` |
| `browser/live-address-open` | `windows-compose-browser--compare-live-address-open` | `variant=desktop` | `browser` | `live-address-open` |
| `browser/live-control-hover-minimize` | `windows-compose-browser--compare-live-control-hover-minimize` | `variant=desktop` | `browser` | `live-control-hover-minimize` |
| `browser/live-control-hover-maximize` | `windows-compose-browser--compare-live-control-hover-maximize` | `variant=desktop` | `browser` | `live-control-hover-maximize` |
| `browser/live-control-hover-close` | `windows-compose-browser--compare-live-control-hover-close` | `variant=desktop` | `browser` | `live-control-hover-close` |
| `browser/mobile-article` | `windows-compose-browser--compare-mobile-article` | `variant=mobile` | `browser` | `mobile-article` |
| `browser/mobile-address-open` | `windows-compose-browser--compare-mobile-address-open` | `variant=mobile` | `browser` | `mobile-address-open` |

---

## Derived Padding/Gap/Layout Decisions

| 결정 항목 | 출처 | 값 | call_id |
| --- | --- | --- | --- |
| desktop stage width | MCP response node `42:2` attribute `w-[1282px]` | 1282px | p04-desktop-stage |
| desktop stage height | MCP response node `42:2` attribute `h-[752px]` | 752px | p04-desktop-stage |
| mobile stage width | MCP metadata node `94:6` `width` field | 390px | p04-mobile-stage |
| mobile stage height | MCP metadata node `94:6` `height` field | 794px | p04-mobile-stage |
| `[data-window-compare-stage]` geometry | bounded exception #2 (storybook.md) — inline style for capture canvas geometry | `style={{ width, height }}` | - |
| `[data-visual-root]` DOM | WindowCompareRoot 소유 — no className/inline style (thin wrapper) | DOM attribute only | - |

---

## Validation Gate Summary

| 검증 항목 | 결과 |
| --- | --- |
| `Folder` named export from `@windows/ui` | PASS |
| `Browser` named export from `@windows/ui` | PASS |
| `WindowFrame` NOT exported from `@windows/ui` | PASS |
| registry 15개 state → compare inventory 1:1 대응 | PASS |
| 각 state `[data-window-compare-stage]` 정확히 1개 | PASS |
| 각 state `[data-visual-root][data-visual-kind][data-visual-state]` 정확히 1개 | PASS |
| `[data-visual-root]`가 `[data-window-compare-stage]` 내부에 중첩 | PASS |
| Folder 8개 Compare stories 추가 (기존 Reference 유지) | PASS |
| Browser 7개 Compare stories 추가 (기존 Reference 유지) | PASS |
| `pnpm --filter @windows/ui exec vitest run` (114 tests) | PASS |
| `pnpm --filter @windows/ui build-storybook` | PASS |
