**Branch:** feat/windows-ui-folder-browser-input-dropdown-contract

> Worktree dir: `worktrees/windows-ui-folder-browser-input-dropdown-contract` (plan 폴더명과 동일)
> 주의: 이전 revision의 `6-state`, `imageScreen`, `7:* image-node` 기준은 더 이상 유효하지 않다. 이 문서부터 Figma file `NrUGKPZUewpuA8XuHI0v5n`의 canvas `3:2`, frame/canvas `Live UI References — Folder Browser`, live HTML wrapper inventory 15개를 canonical provenance로 사용한다.

# Windows UI Folder/Browser Input Dropdown Contract 실행 계획

| # | Phase | Agent |
| --- | --- | --- |
| 1 | `./phases/01-figma-baseline-and-compare-scope-lock.md` | `visual-comparator` |
| 2 | `./phases/02-window-foundation-and-token-ownership-lock.md` | `frontend-developer` |
| 3 | `./phases/03-folder-browser-input-dropdown-contract-lock.md` | `frontend-developer` |
| 4 | `./phases/04-figma-compare-report.md` | `visual-comparator` |
| 5 | `./phases/05-visual-drift-closure.md` | `frontend-developer` |

## 사전 합의

### 요청 추적

| 사용자 요청 항목 | 이번 plan에서 다루는 방식 | 연결 작업 단위 | 비고 |
| --- | --- | --- | --- |
| Figma file `NrUGKPZUewpuA8XuHI0v5n`, node `3:2` 기준으로 기존 architect plan을 revision한다. | Phase 1에서 canvas `3:2`의 live HTML wrapper inventory 15개를 plan-local baseline inventory와 local capture naming으로 고정하고, 이후 phase가 같은 key를 재사용하게 만든다. | Figma 3:2 wrapper inventory, compare provenance | `7:*` image-node 문구는 stale legacy wording으로 취급한다. |
| old 6-state / old 7:* image-node baseline은 더 이상 authoritative source가 아니다. | `baseline-inventory.md`, compare script, report, phase detail 전부를 `3:2` wrapper provenance 기준으로 다시 쓴다. | Figma 3:2 wrapper inventory, compare/report | old image-node hint는 canonical provenance로 남기지 않는다. |
| mobile은 required이고 이미 locked 되었다. | `folder/mobile-blog`, `folder/mobile-search-open`, `browser/mobile-article`, `browser/mobile-address-open`를 canonical inventory에 포함하고, Folder/Browser 각각의 mobile hierarchy를 별도 규칙으로 잠근다. | Window foundation, Folder contract, Browser contract, compare/report | mobile을 desktop shrink variant로 다루지 않는다. |
| current Figma의 모든 element를 UI-only scope 안에서 포함해야 한다. | desktop 11개 + mobile 4개, 총 15 wrapper state를 compare/review inventory로 고정한다. hover/expanded/open detail도 in-scope지만 runtime behavior contract로 승격하지 않는다. | storybook/internal review inventory, compare/report | visual-only scope를 명시적으로 유지한다. |
| `folder/live-chip-open`은 detailed variant state이지 separate product contract가 아니다. | Phase 1과 Phase 3에서 `folder/live-chip-open`을 `detail-variant`로 분류하고, storybook/internal review owner surface로만 노출한다. | Figma state role classification, storybook/internal review inventory | public prop 추가 근거로 쓰지 않는다. |
| hover / expanded / control-hover / mobile-open state도 이번 slug 범위지만 package public props를 늘리면 안 된다. | 상세 state는 storybook/internal review surface가 고정 owner가 되고, `Folder`/`Browser` public props는 기존 방향 그대로 유지한다. | Folder contract, Browser contract, storybook/internal review inventory | architect가 blocker를 찾지 못한 한 새 public open/hover prop은 금지다. |
| public contract direction은 유지한다: Folder two-input + grid owner, Browser single-input + children owner, callback handoff only, no loading/empty/status public model. | Phase 3이 exact prop names, winner rules, no-op rules, review-state ownership을 하나의 contract로 잠근다. | Folder contract, Browser contract, root entry verification | loading/empty/status는 계속 제외 범위다. |
| EXPORT-VALIDATION-THIN finding을 반영해 package-root consumer importability를 더 구체적으로 증명해야 한다. | Phase 3 validation에 `packages/ui/src/index.test.ts`를 추가하고, `@windows/ui` root entry에서 `Folder`, `Browser`를 직접 import하는 positive proof를 명시한다. | root entry verification | `build-storybook + source inspection`만으로 닫지 않는다. |

### 작업 단위 요약

| 작업 단위 | 관련 파일/경계 | 현재 문제 | 목표 상태 | 검증 메모 |
| --- | --- | --- | --- | --- |
| Figma 3:2 wrapper inventory와 provenance | `plans/windows-ui-folder-browser-input-dropdown-contract/reference-captures/**` | current plan이 state 6개와 `7:*` image-node 기반 wording에 묶여 있어, 3:2 live wrapper 15개와 `__section-mobile` 구조를 담지 못한다. | file key, canvas `3:2`, frame/canvas name, desktop/mobile section, wrapper 15개, state role, local capture naming이 한 inventory로 고정된다. | baseline inventory만 읽어도 15 key, provenance, state role, capture naming을 다시 추측하지 않아야 한다. |
| WindowFrame foundation과 responsive hierarchy | `packages/tailwind-config/src/*`, `packages/ui/src/components/windows/internal/**`, `packages/ui/src/components/windows/storybook/*Stage.tsx` | shared shell과 leaf-specific chrome 분리가 plan에 literal하지 않고, mobile hierarchy가 naive desktop shrink처럼 해석될 여지가 있다. | shared `WindowFrame`는 유지하되 Folder/Browser chrome 차이를 보존하고, Folder mobile은 content-first grid, Browser mobile은 simplified chrome/content-first reading hierarchy를 contract로 잠근다. | foundation source만 읽어도 `panels` reuse 금지, exact compare stage owner, differentiated mobile grammar를 설명할 수 있어야 한다. |
| Folder leaf UI-only contract와 detail states | `packages/ui/src/components/windows/folder/**`, `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx` | two-input/grid owner 계약은 유지돼야 하지만, chip-open/sidebar-hover/sidebar-expanded/thumbnail-hover/mobile-search-open detail이 아직 story-only owner로 정리돼 있지 않다. | `Folder` public props는 그대로 두고, 8개 Folder wrapper state를 exact `kind/state` key와 storybook/internal review surface로 고정한다. | props 이름, winner rule, mobile hierarchy, detail-state ownership이 source/story/test에서 같은 language로 드러나야 한다. |
| Browser leaf UI-only contract와 detail states | `packages/ui/src/components/windows/browser/**`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | single-input + `children` owner 계약은 유지돼야 하지만, control-hover 3종과 mobile-address-open detail이 public API와 섞일 위험이 있다. | `Browser` public props는 그대로 두고, 7개 Browser wrapper state를 exact `kind/state` key와 storybook/internal review surface로 고정한다. | address/dropdown winner rule, simplified mobile hierarchy, control-hover ownership이 source/story/test에서 추적 가능해야 한다. |
| Storybook/internal review inventory, compare, export verification | `packages/ui/src/components/windows/storybook/**`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`, `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts` | current plan은 6-state inventory와 `build-storybook + source inspection`까지만 적어 export proof가 얇고, hover/detail state owner도 불명확하다. | 15-state story inventory, exact `[data-window-compare-stage]`, exact nested `[data-visual-root]`, positive `@windows/ui` root import proof, additive export fix가 같은 boundary에서 닫힌다. | `pnpm --filter @windows/ui exec vitest run src/index.test.ts src/components/windows/storybook/windowCompareInventory.test.tsx`, `pnpm --filter @windows/ui build-storybook`, visual compare report를 한 묶음 acceptance로 사용한다. |

### 공개 계약 요약

| 대상 | public surface | state ownership | callback / handoff | invalid / no-op |
| --- | --- | --- | --- | --- |
| `Folder` | `title`, `locationValue`, `searchValue`, `locationDropdownItems?`, `searchDropdownItems?`, `searchChips?`, `sidebarItems`, `activeSidebarItemId?`, `items`, `onOpenLocationDropdown?`, `onLocationValueChange?`, `onLocationSubmit?`, `onSelectLocationDropdownItem?`, `onOpenSearchDropdown?`, `onSearchValueChange?`, `onSearchSubmit?`, `onSelectSearchDropdownItem?`, `onSelectSearchChip?`, `onSelectSidebarItem?`, `onOpenItem?`, `onMinimize?`, `onToggleMaximize?`, `onClose?` | 입력 value와 payload array는 host-owned, dropdown open/close와 detail-state scaffolding은 internal/story-owned, body grid는 component-owned | open/change/submit/select/open-item/window-control은 callback handoff만 연다. | dropdown data가 없으면 해당 dropdown UI를 렌더링하지 않는다. `folder/live-chip-open`, hover/expanded state는 public prop이 아니라 storybook/internal review state다. |
| `Browser` | `title`, `addressValue`, `addressDropdownItems?`, `onOpenAddressDropdown?`, `onAddressValueChange?`, `onAddressSubmit?`, `onSelectAddressDropdownItem?`, `onBack?`, `onForward?`, `onReload?`, `onMinimize?`, `onToggleMaximize?`, `onClose?`, `children` | `addressValue`와 `children`은 host-owned, dropdown open/close와 control-hover scaffolding은 internal/story-owned | open/change/submit/select/nav/window-control은 callback handoff만 연다. | dropdown data가 없으면 open surface를 렌더링하지 않는다. control-hover 3종과 mobile-address-open은 public prop이 아니라 storybook/internal review state다. |
| storybook/internal review inventory | exact `folder/*`, `browser/*` 15 `kind/state` key와 대응 story/harness surface | visual detail state selection은 storybook fixtures/harness가 owner고 package public props는 owner가 아니다. | 없음 | `detail-variant` state를 새 package prop, status model, public hover prop으로 재해석하지 않는다. |
| `@windows/ui` root entry | `Folder`, `Browser` named export | server-safe root entry는 package root가 owner다. | 없음 | positive consumer import proof는 `@windows/ui` root import만 확인한다. exhaustive export inventory freeze나 unrelated export 삭제를 새 durable contract로 승격하지 않는다. |

### 소유권/상태 규칙

| surface | owner | 규칙 | 검증 수단 |
| --- | --- | --- | --- |
| Figma 3:2 wrapper inventory | Figma source + plan-local inventory | canonical source는 `file key + canvas 3:2 + frame/canvas name + visible wrapper label`이다. desktop 11개와 `__section-mobile` 아래 mobile 4개를 모두 적고, 각 key를 `contract-bearing` 또는 `detail-variant`로 분류한다. | `reference-captures/baseline-inventory.md`, Phase 4 report |
| `WindowFrame` shell vs leaf chrome | shared foundation + leaf owner | `Folder`와 `Browser`는 shared `WindowFrame`를 재사용하지만 chrome variant는 leaf가 소유한다. 둘을 하나의 identical chrome treatment로 강제하지 않는다. | foundation source inspection, compare report |
| `Folder.location` / `Folder.search` / grid hierarchy | host + component + internal story scaffolding | displayed winner는 `locationValue`, `searchValue`다. mobile은 sidebar shrink가 아니라 content-first grid hierarchy다. `Enter`는 항상 submit이고, chip/dropdown/sidebar/item selection은 internal filtering이나 body swap을 만들지 않는다. | component source, stories, later materialize tests, compare report |
| `Browser.address` / `children` hierarchy | host + component + internal story scaffolding | displayed winner는 `addressValue`다. `children`이 body owner이고 mobile은 simplified chrome/content-first reading hierarchy를 유지한다. select 뒤에도 value와 body는 host prop이 바뀌기 전까지 내부에서 바뀌지 않는다. | component source, stories, later materialize tests, compare report |
| hover / expanded / control-hover / mobile-open detail states | storybook/internal review surface | `folder/live-chip-open`, `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover`, `browser/live-control-hover-*`, mobile open states는 exact review surfaces지만 새 package public prop을 열지 않는다. | `windowCompareInventory.test.tsx`, compare stories, Phase 4 report |
| package-root import verification | `packages/ui/src/index.ts` + `packages/ui/src/index.test.ts` | positive proof는 `@windows/ui` consumer import다. `Folder`, `Browser` symbol이 root entry에서 해석되고 최소 consumer usage가 타입/런타임 경계에서 성립해야 한다. | `pnpm --filter @windows/ui exec vitest run src/index.test.ts ...` |

### 시각 패리티 계약

| 비교 상태/범위 | comparison mode | gating metric | non-gating metric | 로컬 surface 메모 |
| --- | --- | --- | --- | --- |
| `folder/live-blog`, `folder/live-search-open`, `folder/live-chip-open` | `structural parity` | `frame-surface`, `navigation-surface`, `control-surface`, `content-surface`, `media-surface`의 boundary, density, input/dropdown/chip anchor, card hierarchy가 blocker다. | exact chip text, dropdown row copy, thumbnail art, glyph/shadow detail은 advisory다. | local noun 매핑: titlebar, location input, search input, search chips, suggestion dropdown, sidebar, card grid, thumbnail. |
| `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover` | `structural parity` | hover fill, expanded sidebar width, thumbnail hover affordance, list/card alignment이 blocker다. | exact row copy, icon glyph, shadow blur는 advisory다. | local noun 매핑: sidebar item hover, sidebar expanded pane, thumbnail hover ornament. |
| `browser/live-article`, `browser/live-address-open` | `structural parity` | `frame-surface`, `control-surface`, `content-surface` boundary와 address dropdown anchor, width, row density가 blocker다. | article copy length, cover art, dropdown row copy는 advisory다. | local noun 매핑: titlebar, nav controls, address input, dropdown rows, article body. |
| `browser/live-control-hover-minimize`, `browser/live-control-hover-maximize`, `browser/live-control-hover-close` | `structural parity` | control hover placement, fill, active affordance, chrome spacing이 blocker다. | exact glyph raster와 minute shadow detail은 advisory다. | local noun 매핑: window control cluster hover surface, control icon ornament. |
| `folder/mobile-blog`, `folder/mobile-search-open` | `structural parity` | mobile content-first grid, title/search hierarchy, open dropdown anchor, no desktop-sidebar shrink rule이 blocker다. | exact copy, thumbnail art, fine icon detail은 advisory다. | local noun 매핑: mobile titlebar, mobile search row, mobile grid cards, mobile dropdown. |
| `browser/mobile-article`, `browser/mobile-address-open` | `structural parity` | simplified chrome, mobile reading hierarchy, address open anchor, content boundary가 blocker다. | article copy, cover art, glyph detail은 advisory다. | local noun 매핑: mobile titlebar, mobile address row, mobile dropdown, article body. |

### 제외 범위

| 제외 항목 | 이번 plan에서 제외한 이유 | 승인 상태 | 사용자 요청과의 관계 |
| --- | --- | --- | --- |
| 실제 navigation / search / filtering / history wiring | 사용자는 callback handoff only를 locked 했고 이번 slug는 UI-only scope다. | 승인됨 | 요청에 있었지만 runtime behavior는 명시적으로 제외됐다. |
| public `loading`, `empty`, `status`, `idle` model | 사용자가 명시적으로 원치 않았고 architect도 blocker를 찾지 못했다. | 승인됨 | 요청 중 직접 제외된 항목이다. |
| parent-controlled dropdown open prop, public hover prop, public expanded prop | hover/open detail state는 storybook/internal review owner로 충분하며 public prop 확장은 locked direction과 충돌한다. | 승인됨 | 요청 중 “public props 확장 금지” 방향에 따른 제외다. |
| `folder/live-chip-open`을 separate product contract로 승격하는 것 | 사용자가 detailed variant라고 잠갔다. | 승인됨 | 요청 중 직접 잠긴 항목이다. |
| Folder와 Browser chrome을 완전히 동일한 treatment로 강제하는 것 | design-discovery에서 leaf-specific chrome 차이 보존이 locked 됐다. | 승인됨 | 요청과 정면으로 충돌하므로 제외한다. |
| `panels` domain 재사용 또는 panel naming을 canonical owner로 쓰는 것 | 현재 scope는 windows family 자체 owner를 닫는 일이고, `WindowsPanel`은 desktop-only 참고 자료다. | 승인됨 | 요청 중 직접 제외된 항목이다. |
| unrelated global `tsc` 적색 해소 | 이번 acceptance는 package-local import proof, storybook build, visual compare evidence로 닫는다. | 승인됨 | 요청에 없었고 현재 repo baseline과 검증 범위에 따른 제한이다. |

## 전체 작업 지도

### 단계 개요

| Phase | 연결 작업 단위 | 이번 단계에서 해결하는 핵심 | 완료 후 보이는 변화 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- | --- |
| Phase 1. Figma 3:2 기준선과 wrapper inventory 고정 | `Figma 3:2 wrapper inventory와 provenance` | 3:2 canvas 기준 live HTML wrapper 15개, state role, local capture naming, provenance rule을 plan-local artifact로 고정한다. | baseline inventory만 읽어도 15-state scope와 HTML-wrapper provenance가 다시 추측 없이 보인다. | exact 15 `kind/state` key, state role classification, capture naming |
| Phase 2. Window foundation과 responsive hierarchy 잠금 | `WindowFrame foundation과 responsive hierarchy` | shared shell, exact compare stage owner, leaf-specific chrome differentiation, mobile hierarchy rule을 먼저 고정한다. | `WindowFrame`는 shared이고 chrome/mobile hierarchy는 leaf가 다르게 가진다는 점이 source 경계로 보인다. | shared shell/token/stage contract, mobile hierarchy rules |
| Phase 3. Folder/Browser UI-only contract와 storybook/export 검증 잠금 | `Folder leaf UI-only contract`, `Browser leaf UI-only contract`, `Storybook/internal review inventory, compare, export verification` | public props는 그대로 두고 15-state review surface, exact story inventory, additive root export, positive package-root import proof를 한 boundary로 잠근다. | 구현자와 reviewer가 props, review-only state owner, root import proof, build boundary를 같은 언어로 읽을 수 있다. | exact props, 15 story IDs, root import test, compare inventory |
| Phase 4. Figma wrapper compare report 생성 | `Figma 3:2 wrapper inventory와 provenance`, `Storybook/internal review inventory, compare, export verification` | 15-state baseline/current/diff/report artifact를 exact key와 provenance로 남긴다. | 어떤 wrapper state가 blocker인지 exact key와 provenance로 추적 가능해진다. | exact mismatch key, blocking/advisory drift taxonomy |
| Phase 5. 시각 드리프트 마감 | 모든 작업 단위 | Phase 4 report가 남긴 blocker만 같은 contract 안에서 닫고 final compare evidence를 남긴다. | final report가 15-state inventory에 대해 pass 또는 explicit blocker를 exact key로 남긴다. | final compare evidence와 implementation handoff |

## 단계별 실행

### Phase 1. Figma 3:2 기준선과 wrapper inventory 고정

| 항목 | 내용 |
| --- | --- |
| 목적 | Figma canvas `3:2`의 live HTML wrapper 15개와 `__section-mobile` 구조를 이번 slug의 유일한 canonical provenance로 고정한다. |
| 변경 내용 | `baseline-inventory.md`에 file key, canvas `3:2`, frame/canvas name, desktop/mobile wrapper 15개, state role(`contract-bearing` / `detail-variant`), local capture filename, provenance 분류를 적고, local mirror capture naming을 같은 key로 pin한다. 이전 `6-state`, `imageScreen`, `7:* image-node` wording은 전부 제거한다. |
| 파일별 작업 |  |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract/reference-captures/baseline-inventory.md` | 교체 | 15-state wrapper inventory, `__section-mobile`, state role, provenance, capture naming이 한 문서에 고정된다. | reviewer가 inventory만 보고 15 key, section, role, provenance를 재현할 수 있다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract/reference-captures/*.png` | 교체 | `folder-live-blog.png`부터 `browser-mobile-address-open.png`까지 15개 local mirror capture naming이 inventory와 1:1로 맞는다. | file naming이 exact `kind-state` 규칙과 일치하고 old 6-state naming이 남지 않는다. |
| 이전 상태 | current plan은 6-state + `7:* image-node` baseline을 전제로 하여 3:2 wrapper inventory와 mobile section 구조를 담지 못한다. |
| 이후 상태 | plan-local baseline artifact가 15-state inventory와 HTML-wrapper provenance를 유일한 기준으로 제공한다. |
| 완료 조건 | baseline inventory만 읽어도 exact 15 key, state role, mobile section, provenance, capture naming, stale wording rejection이 모두 드러나야 한다. |
| 관련 영역 | Figma file `NrUGKPZUewpuA8XuHI0v5n`, canvas `3:2`, frame/canvas `Live UI References — Folder Browser` |
| 상세 | `./phases/01-figma-baseline-and-compare-scope-lock.md` |

### Phase 2. Window foundation과 responsive hierarchy 잠금

| 항목 | 내용 |
| --- | --- |
| 목적 | shared `WindowFrame`와 exact compare stage owner를 유지하면서도 Folder/Browser leaf-specific chrome 차이와 mobile hierarchy를 먼저 잠근다. |
| 변경 내용 | `--window-*` token namespace, internal `WindowFrame`, `windowReferenceStage`, `compareWindowStage`를 정리하고, Folder mobile은 content-first grid, Browser mobile은 simplified chrome/content-first reading hierarchy라는 design rule을 foundation boundary에서 명시한다. |
| 파일별 작업 |  |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/tailwind-config/src/theme.css` | 추가/조정 | shared shell과 leaf chrome slot이 재사용할 `--window-*` token namespace가 생긴다. | raw literal이 아니라 semantic token 이름으로 shell/chrome/input/dropdown surface를 설명할 수 있다. |
| `packages/tailwind-config/src/utilities.css` | 추가/조정 | shared shell utility와 leaf-specific chrome slot을 함께 설명하는 class surface가 생긴다. | later leaf source가 naive desktop shrink나 identical chrome 강제를 하지 않아도 된다. |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 추가/조정 | shared shell owner가 titlebar, control cluster, body boundary를 소유하되 leaf chrome 차이는 slot으로 남긴다. | `WindowFrame`가 public export 없이 shared shell owner임이 분명하다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`, `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 추가/조정 | human review stage와 machine capture stage가 같은 geometry family와 exact `[data-window-compare-stage]` owner를 사용한다. | stage source를 읽으면 desktop/mobile geometry와 capture owner가 literal하게 보인다. |
| 이전 상태 | old plan은 shared shell만 강조하고 leaf-specific chrome preservation, mobile hierarchy, exact stage owner를 충분히 분리해 쓰지 못했다. |
| 이후 상태 | shared foundation과 leaf-specific chrome/mobile hierarchy 경계가 먼저 고정되어 Phase 3가 public props를 다시 열 필요가 없어진다. |
| 완료 조건 | foundation source만 읽어도 `panels` reuse 금지, exact capture owner, differentiated chrome, Folder/Browser mobile hierarchy가 모두 설명돼야 한다. |
| 관련 영역 | `packages/tailwind-config/src/*`, `packages/ui/src/components/windows/internal/**`, `packages/ui/src/components/windows/storybook/*Stage.tsx` |
| 상세 | `./phases/02-window-foundation-and-token-ownership-lock.md` |

### Phase 3. Folder/Browser UI-only contract와 storybook/export 검증 잠금

| 항목 | 내용 |
| --- | --- |
| 목적 | Folder/Browser public contract는 그대로 유지하고, 15-state storybook/internal review surface와 positive package-root consumer import proof를 같은 phase에서 잠근다. |
| 변경 내용 | `Folder`는 two-input + grid owner, `Browser`는 single-input + `children` owner를 유지한다. hover/expanded/chip-open/control-hover/mobile-open detail state는 storybook/internal review surface가 owner가 되고, exact story ID 15개, `windowCompareInventory.test.tsx`, `packages/ui/src/index.test.ts`, additive root export fix를 Phase 3 validation으로 묶는다. |
| 파일별 작업 |  |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/shared/types.ts` | 추가 | shared dropdown/item shape와 review-state fixture typing이 최소 surface로 정리된다. | heterogenous item domain과 leaf-specific payload가 분리된 채 literal하게 보인다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 추가/조정 | `Folder` public props와 no-op rule이 two-input + grid owner contract로 고정된다. | public props는 유지되고 detail states가 public prop이 아님이 source에서 보인다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 추가/조정 | `Browser` public props와 no-op rule이 single-input + `children` owner contract로 고정된다. | public props는 유지되고 control-hover/mobile-open이 story-only state임이 source에서 보인다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 추가/조정 | 15-state inventory의 payload와 detail-state scaffolding owner가 fixture/harness로 정리된다. | state role이 fixture source에서 `contract-bearing` / `detail-variant`로 추적 가능하다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 추가/조정 | exact story ID 15개와 support-only review surface가 같은 canonical inventory로 정리된다. | Phase 4 capture가 exact story ID 15개만 읽으면 된다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 추가/조정 | 15-state key, exact `[data-window-compare-stage]`, exact nested `[data-visual-root]` relation을 positive signal로 검증한다. | test가 exact 15 key를 literal하게 고정한다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 조정 | `folder`, `browser` kind inventory와 metadata carrier contract가 current inventory 15개를 수용한다. | compare capture가 exact `kind/state` key를 literal하게 읽을 수 있다. |
| `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts` | 조정/추가 | `Folder`, `Browser` root export가 실제 file path와 맞게 연결되고, `@windows/ui` root entry import proof가 positive signal로 추가된다. | `build-storybook + source inspection` 대신 consumer import test가 acceptance에 포함된다. |
| 이전 상태 | current plan은 6-state story inventory만 전제로 하고, export proof도 `build-storybook + source inspection` 수준에 머물러 있다. |
| 이후 상태 | public props는 그대로 두면서도 15-state review surface, exact story ID, positive root import proof, additive export fix가 같은 phase에서 닫힌다. |
| 완료 조건 | props 이름, callback 의미, no-op rule, story ID 15개, exact capture owner, positive `@windows/ui` root import proof가 source/test/build 경계에서 같은 언어로 드러나야 한다. 검증은 `pnpm --filter @windows/ui exec vitest run src/index.test.ts src/components/windows/storybook/windowCompareInventory.test.tsx`와 `pnpm --filter @windows/ui build-storybook`를 사용한다. |
| 관련 영역 | `packages/ui/src/components/windows/**`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`, `packages/ui/src/index.ts`, `packages/ui/package.json`, `packages/ui/tsconfig.json` |
| 상세 | `./phases/03-folder-browser-input-dropdown-contract-lock.md` |

### Phase 4. Figma wrapper compare report 생성

| 항목 | 내용 |
| --- | --- |
| 목적 | Figma 3:2 wrapper baseline과 current Storybook surface를 exact 15 `kind/state` key로 캡처하고 blocking/advisory drift를 분리한 report를 남긴다. |
| 변경 내용 | `capture-current.mjs`가 exact story ID 15개와 exact `[data-window-compare-stage]`만 current capture 대상으로 사용하고, `run-diff.mjs`와 `report.md`가 baseline/current/diff/report 전부를 같은 key와 provenance 분류로 묶는다. |
| 파일별 작업 |  |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-input-dropdown-contract/capture-current.mjs` | 교체 | current capture가 exact story ID 15개와 exact capture owner를 literal하게 사용한다. | support-only story나 stale 6-state inventory를 섞지 않는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract/visual-compare/run-diff.mjs` | 교체 | 15-state artifact naming과 provenance labeling이 같은 key를 공유한다. | baseline/current/diff/report 파일명이 exact `kind-state` key를 따른다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract/visual-compare/report.md` | 교체 | 15-state wrapper inventory에 대한 blocking/advisory drift가 provenance와 함께 남는다. | report가 state 15개 모두에 대해 provenance, pass/fail, advisory note를 적는다. |
| 이전 상태 | current plan은 6-state compare report만 상정하고 있어 full wrapper inventory와 HTML-wrapper provenance를 담지 못한다. |
| 이후 상태 | compare artifact가 exact 15 key, exact provenance, blocking/advisory 분리까지 plan-local evidence로 남는다. |
| 완료 조건 | report가 15 key, provenance(`external-source evidence` / `package-local current`), exact capture owner, blocking/advisory 분리를 모두 exact key 기준으로 적어야 한다. |
| 관련 영역 | `plans/windows-ui-folder-browser-input-dropdown-contract/reference-captures/**`, `packages/ui/src/components/windows/storybook/**`, `playwright.storybook.config.ts` |
| 상세 | `./phases/04-figma-compare-report.md` |

### Phase 5. 시각 드리프트 마감

| 항목 | 내용 |
| --- | --- |
| 목적 | Phase 4 report가 남긴 blocker만 같은 contract 안에서 닫고, 같은 15-state inventory로 final compare evidence를 남긴다. |
| 변경 내용 | foundation, Folder, Browser, storybook/internal review surface, compare artifacts를 minimum boundary로 조정하되 public props, state role classification, story ID 15개, positive root import proof는 다시 열지 않는다. |
| 파일별 작업 |  |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/tailwind-config/src/theme.css`, `packages/tailwind-config/src/utilities.css` | 조정 | foundation/token 차원의 blocker만 같은 namespace 안에서 닫힌다. | `window` namespace 밖으로 급패치가 새지 않는다. |
| `packages/ui/src/components/windows/internal/windowFrame/**` | 조정 | shared shell, control cluster, stage geometry blocker가 report 기준으로 줄어든다. | shared/leaf ownership 경계는 유지된다. |
| `packages/ui/src/components/windows/folder/**` | 조정 | Folder desktop/mobile/detail-state blocker가 same contract 안에서 줄어든다. | two-input + grid owner contract는 유지된다. |
| `packages/ui/src/components/windows/browser/**` | 조정 | Browser desktop/mobile/detail-state blocker가 same contract 안에서 줄어든다. | single-input + `children` owner contract는 유지된다. |
| `packages/ui/src/components/windows/storybook/**`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 조정 | review-state scaffolding과 compare recipient blocker가 최소 범위에서 정리된다. | exact story ID 15개와 marker contract는 유지된다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract/visual-compare/**` | 갱신 | final compare report가 rerun 결과를 같은 key로 남긴다. | 15-state report가 pass 또는 explicit blocker를 exact key로 기록한다. |
| 이전 상태 | compare report가 blocker를 드러내지만 final acceptance는 아직 닫히지 않았다. |
| 이후 상태 | 같은 contract와 같은 15-state inventory를 재사용한 final compare evidence가 남는다. |
| 완료 조건 | final report가 15-state inventory를 모두 재평가하고, blocker가 남으면 exact key와 scope reason을 남겨야 한다. |
| 관련 영역 | Phase 2~4 write target 전체 |
| 상세 | `./phases/05-visual-drift-closure.md` |

## 검토 체크리스트

- [ ] 요청 추적 표가 `3:2` 기준 revision, 15-state wrapper inventory, mobile required, UI-only scope, `folder/live-chip-open` 상세 variant, public contract 유지, export 검증 강화를 모두 빠짐없이 보여 준다.
- [ ] 작업 단위 요약 표만 읽어도 어떤 경계가 바뀌고 왜 `6-state / 7:*` wording이 폐기되는지 알 수 있다.
- [ ] 공개 계약 요약과 소유권/상태 규칙이 `Folder` / `Browser` public props는 유지하면서 detail state owner를 storybook/internal review surface로 고정한다는 점을 분명히 보여 준다.
- [ ] 시각 패리티 계약 표가 15-state inventory를 빠짐없이 반영하고 comparison mode, gating metric, non-gating metric, 로컬 surface 메모를 분리해 적는다.
- [ ] 제외 범위가 UI-only scope, public prop 확장 금지, panel-domain 비재사용, unrelated global `tsc` 제외를 row 단위로 설명한다.
- [ ] 단계 개요와 Phase 단계 설명만 읽어도 왜 Phase 3가 `src/index.test.ts`를 포함해 EXPORT-VALIDATION-THIN을 보강하는지 알 수 있다.
- [ ] Phase 4와 Phase 5가 exact 15-state key, exact `[data-window-compare-stage]`, exact provenance language를 그대로 재사용한다.
