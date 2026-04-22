# Phase 2. Folder/Browser 구현과 compare runtime 잠금

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Phase 1 foundation을 바탕으로 `Folder`/`Browser` UI-only contract를 구현하고, callback family별 emitted arg shape와 domain-local id 정책까지 닫은 뒤 exact 15-state story inventory, compare runtime literal, exact declared gating surface union inventory, current-side harness smoke, positive `@windows/ui` root import proof를 한 번에 잠근다. |
| 선행조건 | Phase 1이 local baseline asset과 exact stage owner/geometry를 이미 제공해야 한다. |
| 완료 판단 | `packages/ui/src/components/windows/**`, `windowCompareInventory.test.tsx`, `compareRoot.tsx`, `capture-current.mjs`, `storybook-static-server.cjs`, `run-diff.mjs`, `visual-compare/current-smoke/**`, `src/index.ts`, `src/index.test.ts`만 읽어도 public contract, callback recipient/payload, domain-local id namespace, final compare runtime literal, exact declared gating surface union inventory, current-side smoke validation path, pass/fail semantics를 다시 추정하지 않아도 된다. |
| 중단 조건 | public `loading/empty/status`, public hover/open/expanded prop, ambiguous `onSelect*` payload, cross-domain id reuse를 전역 namespace로 해석하는 설계, internal navigation/filtering/history wiring, compare-time runtime invention이 필요해지면 blocker다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/shared/types.ts` | 추가 | `FolderLocationDropdownItem`, `FolderSearchDropdownItem`, `FolderSearchChip`, `FolderSidebarItem`, `FolderGridItem`, `BrowserAddressDropdownItem`와 domain-local id/render-key policy를 분리한다. | heterogeneous domain이 ambiguous callback 하나로 합쳐지지 않고, selection payload source를 callback name과 type name으로 바로 식별할 수 있다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 추가 | `Folder`는 two-input + grid owner다. | exact prop names, winner rule, callback emitted arg shape, no-op recipient rule이 source에 남는다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 추가 | `Browser`는 single-input + `children` owner다. | exact prop names, winner rule, callback emitted arg shape, no-op recipient rule이 source에 남는다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx` | 추가 | Folder detail state는 storybook/internal review owner다. | Folder 8-state scaffolding이 추적 가능하다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 추가 | Browser detail state는 storybook/internal review owner다. | Browser 7-state scaffolding이 추적 가능하다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx` | 추가 | exact Folder compare stories를 정의한다. | canonical inventory 밖의 alias를 만들지 않는다. |
| `packages/ui/src/components/windows/browser/browser.stories.tsx` | 추가 | exact Browser compare stories를 정의한다. | canonical inventory 밖의 alias를 만들지 않는다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 추가 | exact storyId, stageAttr, compare root metadata relation을 검증한다. | Phase 3가 runtime literal을 재정의할 필요가 없다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 조정 | `folder`/`browser` compare metadata carrier를 canonical inventory에 맞춘다. | kind/state drift가 없다. |
| `packages/ui/src/index.ts` | 조정 | `Folder`, `Browser` named export를 root entry에 연결한다. | consumer import path가 stable하다. |
| `packages/ui/src/index.test.ts` | 유지/검증 | positive consumer import proof owner를 유지한다. | `Folder`, `Browser` import proof와 `WindowFrame` non-export proof가 남는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs` | 생성 | current capture runtime literal을 정확히 기록한다. | Phase 3가 실행만 하면 된다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs` | 생성 | static host/origin과 readiness signal을 고정한다. | compare-time host/origin invention이 없다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs` | 생성 | exact artifact naming, provenance, `scopedBlockingDiffRatio`, `globalDriftRatio`, blocking decision rule을 고정한다. | report row와 artifact filename drift가 없고 compare semantics drift도 없다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/current-smoke/**` | 생성/갱신 | current-side harness smoke가 current-only capture artifact를 남긴다. | Phase 3 이전에 host/origin/readiness/selector/viewport wiring이 실제로 검증된다. |

## 완료 증거

- `Folder` public contract가 two-input + grid owner로 구현되고 detail state는 public prop이 아니다.
- `Browser` public contract가 single-input + `children` owner로 구현되고 detail state는 public prop이 아니다.
- `Folder`/`Browser` callback family가 무인자 통지, raw string handoff, current winner submit, exact source object selection으로 나뉘고 서로 fallthrough하지 않는다.
- `shared/types.ts`가 selection domain별 id namespace와 render-key prefix policy를 source contract로 남긴다.
- exact 15 `storyId`, exact 15 `stageAttr` mapping, exact `[data-window-compare-stage]` / nested `[data-visual-root]` relation이 test와 scripts에 함께 고정된다.
- `capture-current.mjs`가 `packages/ui/storybook-static -> http://localhost:6007`, stdout `SERVER_READY`, exact URL shape, selector, viewport, artifact naming과 `--mode smoke` current-only validation path를 literal하게 가진다.
- `run-diff.mjs`가 exact provenance label, `scopedBlockingDiffRatio`, blocking threshold `0.05`, `globalDriftRatio`, explicit blocker rule을 literal하게 가진다.
- `visual-compare/current-smoke/**`가 same inventory와 same selector/viewport contract로 생성되고, reference baseline이나 diff/report 없이 current-side harness만 검증한다.
- `src/index.test.ts`가 positive root import proof를 유지하고 `WindowFrame` non-export boundary를 검증한다.

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| 목표 | leaf public contract와 compare runtime literal 및 pass/fail semantics를 같은 phase에서 닫아 final compare가 read-only 실행 단계가 되게 만들고, current-side harness를 Phase 3 이전에 실제 실행해 later materialization이 callback payload와 runtime wiring을 추측하지 않게 한다. |
| 연결 작업 단위 | `Folder leaf contract`, `Browser leaf contract`, `compare runtime, root entry proof, final evidence` |
| 선행 조건 | Phase 1의 local baseline asset, exact `[data-window-compare-stage]`, exact `desktop`/`mobile`, stage geometry |
| 검증 메모 | exact prop names, callback family별 emitted arg shape, domain-local id rule, exact story inventory, exact runtime literal, exact declared gating surface union inventory, `scopedBlockingDiffRatio <= 0.05` blocking semantics, current-side smoke, positive root import proof가 같은 경계에서 보여야 한다. |
| 로컬 전제 계약 | Phase 3은 여기서 잠근 exact 15 key, exact `storyId`, exact `stageAttr`, host/origin/readiness, artifact naming, provenance, exact declared gating surface union inventory, `scopedBlockingDiffRatio`, `globalDriftRatio`, blocking threshold를 수정하지 않고 소비만 한다. |

## 작업 순서

| 순서 | 작업 단위 | 이번 단계에서 처리하는 내용 | 완료 조건 |
| --- | --- | --- | --- |
| 1 | shared item domains + Folder leaf contract | `shared/types.ts` domain 분리와 `Folder` public props, winner rule, callback payload, detail-state owner를 함께 구현한다. | Folder 8-state inventory와 selection domain contract가 source에 보인다. |
| 2 | Browser leaf contract | `Browser` public props, winner rule, callback payload, detail-state owner를 구현한다. | Browser 7-state inventory와 address/nav/window-control contract가 source에 보인다. |
| 3 | inventory, runtime, root proof | exact story inventory, exact runtime scripts, exact declared gating surface union inventory, current-side harness smoke, positive root import proof를 고정한다. | Phase 3가 read-only compare/report만 수행할 수 있다. |

## 작업 단위 A. `Folder` leaf contract와 detail-state owner

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | `Folder`는 two-input + grid owner를 유지해야 하고, compare에 필요한 detail state는 public API가 아니라 storybook/internal review owner여야 한다. |
| 현재 문제 | detail state owner를 명시하지 않으면 implementation이나 materialize가 public `open`/`hover`/`expanded` prop을 추측하게 된다. |
| 목표 상태 | `Folder` exact prop names, winner rule, callback family별 emitted arg shape, recipient 고정 규칙, no-op rule, 8-state inventory ownership이 모두 source와 stories에 남는다. |
| 유지 경계 | public status model, internal filtering/navigation, alternate body owner는 열지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/ui/src/components/windows/shared/types.ts` | 변경 | `FolderLocationDropdownItem`, `FolderSearchDropdownItem`, `FolderSearchChip`, `FolderSidebarItem`, `FolderGridItem`의 domain-local id와 render-key prefix policy가 보여야 한다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 변경 | exact prop names, winner rule, callback emitted arg shape, no-op recipient rule이 보여야 한다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx` | 변경 | Folder 8-state scaffolding과 owner가 드러나야 한다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx` | 변경 | exact story inventory만 canonical compare set으로 남아야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `title`, `locationValue`, `searchValue`, `locationDropdownItems?`, `searchDropdownItems?`, `searchChips?`, `sidebarItems`, `activeSidebarItemId?`, `items`, `onOpenLocationDropdown?`, `onLocationValueChange?`, `onLocationSubmit?`, `onSelectLocationDropdownItem?`, `onOpenSearchDropdown?`, `onSearchValueChange?`, `onSearchSubmit?`, `onSelectSearchDropdownItem?`, `onSelectSearchChip?`, `onSelectSidebarItem?`, `onOpenItem?`, `onMinimize?`, `onToggleMaximize?`, `onClose?` |
| state ownership | `locationValue`, `searchValue`, payload arrays는 host-owned, dropdown open/close와 detail-state scaffolding은 storybook/internal review owner, body grid는 component-owned |
| callback / handoff | `onOpenLocationDropdown()`, `onOpenSearchDropdown()`, `onMinimize()`, `onToggleMaximize()`, `onClose()`는 무인자 통지다. `onLocationValueChange(nextValue: string)`, `onSearchValueChange(nextValue: string)`는 raw string만 보낸다. `onLocationSubmit(locationValue: string)`, `onSearchSubmit(searchValue: string)`는 현재 표시 winner 값만 보낸다. `onSelectLocationDropdownItem(locationItem: FolderLocationDropdownItem)`, `onSelectSearchDropdownItem(searchItem: FolderSearchDropdownItem)`, `onSelectSearchChip(chip: FolderSearchChip)`, `onSelectSidebarItem(sidebarItem: FolderSidebarItem)`, `onOpenItem(item: FolderGridItem)`은 각 source array에서 읽은 exact item object만 보내며 id/index/DOM event를 추가 payload로 보내지 않는다. |
| no-op / invalid rule | `locationDropdownItems`, `searchDropdownItems`, `searchChips`, `sidebarItems`, `items`는 서로 다른 id namespace다. source array에 없는 id, hidden dropdown/open affordance, missing callback path는 no-op이고, 같은 interaction이 다른 callback family로 fallthrough하지 않는다. selection 이후에도 내부에서 `locationValue`, `searchValue`, `activeSidebarItemId`를 바꾸지 않는다. `folder/live-chip-open`, `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover`, `folder/mobile-search-open`은 public prop이 아니다. |
| 추가 관찰 포인트 | displayed winner는 항상 `locationValue`, `searchValue`다. `Enter`는 현재 값으로 submit callback을 호출한다. sibling render key가 여러 domain을 합치면 `location-dropdown:{id}`, `search-dropdown:{id}`, `search-chip:{id}`, `sidebar:{id}`, `grid-item:{id}`처럼 domain prefix를 붙인다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `none` |
| gating metric | `n/a` |
| non-gating metric | `none` |
| local surface | leaf public contract source다. blocking surface union과 metric arithmetic은 작업 단위 C의 canonical inventory를 그대로 사용한다. |
| canonical surface role | `n/a` |
| comparison policy | `n/a` |
| metric treatment | `n/a` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| Folder public prop names와 winner/no-op rule | component source inspection |
| Folder callback payload와 domain-local id rule | component source inspection |
| Folder 8-state owner rule | fixture/story source inspection |

## 작업 단위 B. `Browser` leaf contract와 detail-state owner

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | `Browser`는 single-input + `children` owner를 유지해야 하고, control-hover/mobile-address-open은 public API가 아니라 storybook/internal review owner여야 한다. |
| 현재 문제 | control-hover/mobile-open owner를 명시하지 않으면 later work가 public `hover`/`open` prop을 추측해 contract를 넓힐 수 있다. |
| 목표 상태 | `Browser` exact prop names, winner rule, callback family별 emitted arg shape, recipient 고정 규칙, no-op rule, 7-state inventory ownership이 source와 stories에 남는다. |
| 유지 경계 | route/history model, public hover/open prop, article-specific alternate body prop은 열지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/ui/src/components/windows/shared/types.ts` | 변경 | `BrowserAddressDropdownItem`의 domain-local id와 render-key prefix policy가 보여야 한다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 변경 | exact prop names, winner rule, callback emitted arg shape, no-op recipient rule, `children` owner가 보여야 한다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 변경 | Browser 7-state scaffolding과 owner가 드러나야 한다. |
| `packages/ui/src/components/windows/browser/browser.stories.tsx` | 변경 | exact story inventory만 canonical compare set으로 남아야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `title`, `addressValue`, `addressDropdownItems?`, `onOpenAddressDropdown?`, `onAddressValueChange?`, `onAddressSubmit?`, `onSelectAddressDropdownItem?`, `onBack?`, `onForward?`, `onReload?`, `onMinimize?`, `onToggleMaximize?`, `onClose?`, `children` |
| state ownership | `addressValue`와 `children`은 host-owned, dropdown open/close와 control-hover/mobile-open scaffolding은 storybook/internal review owner |
| callback / handoff | `onOpenAddressDropdown()`, `onBack()`, `onForward()`, `onReload()`, `onMinimize()`, `onToggleMaximize()`, `onClose()`는 무인자 통지다. `onAddressValueChange(nextValue: string)`는 raw string만 보낸다. `onAddressSubmit(addressValue: string)`는 현재 표시 winner 값만 보낸다. `onSelectAddressDropdownItem(item: BrowserAddressDropdownItem)`은 `addressDropdownItems` source array의 exact item object만 보내며 id/index/DOM event를 추가 payload로 보내지 않는다. |
| no-op / invalid rule | `addressDropdownItems` id는 Browser address domain 안에서만 유일하다. hidden dropdown affordance, source array에 없는 id, missing callback path는 no-op이고, address selection이 `onAddressValueChange`, `onAddressSubmit`, nav callback, window-control callback으로 fallthrough하지 않는다. select 이후에도 내부에서 `addressValue`와 `children`을 바꾸지 않는다. control-hover 3종과 `browser/mobile-address-open`은 public prop이 아니다. |
| 추가 관찰 포인트 | displayed winner는 항상 `addressValue`다. `Enter`는 항상 `onAddressSubmit(addressValue)`다. address dropdown render key는 `address-dropdown:{id}` prefix를 사용한다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `none` |
| gating metric | `n/a` |
| non-gating metric | `none` |
| local surface | leaf public contract source다. blocking surface union과 metric arithmetic은 작업 단위 C의 canonical inventory를 그대로 사용한다. |
| canonical surface role | `n/a` |
| comparison policy | `n/a` |
| metric treatment | `n/a` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| Browser public prop names와 winner/no-op rule | component source inspection |
| Browser callback payload와 domain-local id rule | component source inspection |
| Browser 7-state owner rule | fixture/story source inspection |

## 작업 단위 C. exact story inventory, compare runtime, root entry proof

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | final compare가 recipient/runtime을 새로 발명하지 않으려면 exact inventory, exact storyId, exact stageAttr, exact host/origin, exact selector, exact artifact naming, exact provenance를 같은 phase에서 잠가야 한다. |
| 현재 문제 | compare inventory만 잠그고 runtime literal을 남기지 않으면 Phase 3이 script/selector/storyId/host/provenance를 재해석하게 된다. |
| 목표 상태 | exact story inventory 15개, exact runtime scripts, exact declared gating surface union inventory, current-side harness smoke, blocking/advisory compare semantics, positive root import proof가 함께 고정된다. |
| 유지 경계 | exhaustive root export inventory, compare-time story layout tweak, source-tree UI fix는 이 작업 단위 밖이다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 변경 | exact 15 key, storyId, stageAttr, stage/root metadata relation을 positive signal로 검증해야 한다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 변경 | `folder`/`browser` kind inventory와 metadata carrier contract를 유지해야 한다. |
| `packages/ui/src/index.ts` | 변경 | `Folder`, `Browser` root export를 연결해야 한다. |
| `packages/ui/src/index.test.ts` | 유지 | positive consumer import proof를 제공해야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs` | 변경 | storyId, stageAttr, host/origin, ready rule, selector, viewport, artifact naming을 literal하게 적어야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs` | 변경 | `packages/ui/storybook-static -> http://localhost:6007`와 `SERVER_READY`를 고정해야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs` | 변경 | exact artifact naming, provenance label, `scopedBlockingDiffRatio`, threshold `0.05`, `globalDriftRatio`, blocking decision rule을 공유해야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/current-smoke/**` | 생성/갱신 | current-side smoke artifact가 same inventory/same selector/same viewport로 남아야 한다. | Phase 3 이전에 harness wiring이 실제로 검증된다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | exact story inventory 15개, exact `storyId` mapping 15개, exact `stageAttr` mapping 15개, exact `desktop`/`mobile`, exact `[data-window-compare-stage]`, exact nested `[data-visual-root]`, `packages/ui/storybook-static`, `http://localhost:6007`, stdout `SERVER_READY`, `1280x800`, exact artifact naming, exact provenance label, `scopedBlockingDiffRatio`, blocking threshold `0.05`, `globalDriftRatio`, `Folder`/`Browser` root export |
| state ownership | story/harness는 review-state scaffolding을, `compareRoot`는 metadata carrier를, capture/diff scripts는 runtime literal을, `src/index.ts`와 `src/index.test.ts`는 consumer import proof를 소유한다. |
| callback / handoff | 없음 |
| no-op / invalid rule | support-only story, alias storyId, compare-time host/origin/readiness invention, selector rewrite, viewport crop, story layout tweak, proxy provenance label, whole-canvas mismatch를 단독 blocker로 승격하는 해석은 invalid다. |
| 추가 관찰 포인트 | exact mapping과 `scopedBlockingDiffRatio <= 0.05` rule은 execution contract에 고정하고 `windowCompareInventory.test.tsx`와 scripts가 같은 language를 사용한다. `capture-current.mjs --mode smoke`는 same inventory와 same runtime literal을 current-only로 실행한다. |

### 선언된 gating surface union 인벤토리

| 비교 상태/범위 | comparison mode | gating metric | non-gating metric | 로컬 surface 메모 |
| --- | --- | --- | --- | --- |
| `folder/live-blog`, `folder/live-search-open`, `folder/live-chip-open` | `structural parity` | declared gating surface union(`frame-surface`, `navigation-surface`, `control-surface`, `content-surface`, `media-surface`)에 대해 input/dropdown/chip anchor, card hierarchy blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 chip text, dropdown row copy, thumbnail art, icon glyph detail | titlebar, location input, search input, chips, dropdown, sidebar, card grid |
| `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover` | `structural parity` | declared gating surface union(`navigation-surface`, `control-surface`, `content-surface`, `media-surface`)에 대해 sidebar hover fill, expanded width, thumbnail hover affordance, list/card alignment blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 exact row copy, icon glyph, shadow blur | sidebar hover/expanded pane, thumbnail hover ornament |
| `browser/live-article`, `browser/live-address-open` | `structural parity` | declared gating surface union(`frame-surface`, `control-surface`, `content-surface`)에 대해 address dropdown anchor/width/row density blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 article copy, cover art, dropdown row copy | nav controls, address input, dropdown, article body |
| `browser/live-control-hover-minimize`, `browser/live-control-hover-maximize`, `browser/live-control-hover-close` | `structural parity` | declared gating surface union(`frame-surface`, `control-surface`)에 대해 control hover placement, fill, active affordance, chrome spacing blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 glyph raster, minute shadow detail | window control cluster hover surface |
| `folder/mobile-blog`, `folder/mobile-search-open` | `structural parity` | declared gating surface union(`frame-surface`, `control-surface`, `content-surface`, `media-surface`)에 대해 mobile content-first grid, title/search hierarchy, open dropdown anchor blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 exact copy, thumbnail art, fine icon detail | mobile titlebar, search row, grid cards, dropdown |
| `browser/mobile-article`, `browser/mobile-address-open` | `structural parity` | declared gating surface union(`frame-surface`, `control-surface`, `content-surface`)에 대해 simplified chrome, mobile reading hierarchy, address-open anchor blocker가 없고 `scopedBlockingDiffRatio <= 0.05` | `globalDriftRatio`와 article copy, cover art, glyph detail | mobile titlebar, address row, dropdown, article body |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | 위 `선언된 gating surface union 인벤토리` 6개 row를 exact literal로 사용하고, `scopedBlockingDiffRatio`는 그 union만 분모로 삼는다. |
| non-gating metric | `globalDriftRatio` |
| local surface | story inventory, runtime scripts, current-side smoke artifact, root entry proof |
| canonical surface role | `frame-surface`, `navigation-surface`, `control-surface`, `content-surface`, `media-surface` |
| comparison policy | declared gating surface union은 `gating`, whole-canvas drift는 `advisory` |
| metric treatment | gating surface는 `boundary-and-geometry`, advisory global drift는 `full-compare` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| exact story inventory/runtime proof | `vitest` |
| current-side harness smoke | `capture-current.mjs --mode smoke` |
| positive root import proof | `vitest` |
| package-local story/build boundary | `build-storybook` |

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - Folder/Browser public contract를 넓히지 않으면서 exact 15-state compare runtime과 positive root import proof를 구현한다.
- boundary:
  - `packages/ui/src/components/windows/**`
  - `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
  - `packages/ui/src/index.ts`
  - `packages/ui/src/index.test.ts`
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs`
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs`
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs`
- input:
  - 시나리오: maintainer가 windows family leaf를 구현하고 final compare runtime을 read-only 실행 단계로 닫아야 하는 경우
  - exact prerequisites from Phase 1:
    - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/baseline-inventory.md`
    - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/reference-captures/*.png`
    - exact compare stage owner: `[data-window-compare-stage]`
    - exact stage values: `desktop`, `mobile`
    - stage geometry: desktop `1024x700`, mobile `375x680`
  - repo-local execution contract:
    - package validation command: `pnpm --filter @windows/ui build-storybook`
    - targeted proof command: `pnpm --filter @windows/ui exec vitest run src/index.test.ts src/components/windows/storybook/windowCompareInventory.test.tsx`
    - current-side harness smoke command: `node plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs --mode smoke --output-dir plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/current-smoke`
    - root entry alias: `@windows/ui -> ./src/index.ts`
  - exact compare key inventory:
    - `folder/live-blog`
    - `folder/live-search-open`
    - `folder/live-chip-open`
    - `folder/live-sidebar-hover`
    - `folder/live-sidebar-expanded`
    - `folder/live-thumbnail-hover`
    - `folder/mobile-blog`
    - `folder/mobile-search-open`
    - `browser/live-article`
    - `browser/live-address-open`
    - `browser/live-control-hover-minimize`
    - `browser/live-control-hover-maximize`
    - `browser/live-control-hover-close`
    - `browser/mobile-article`
    - `browser/mobile-address-open`
  - exact story ID mapping:
    - `folder/live-blog -> windows-compose-folder--compare-live-blog`
    - `folder/live-search-open -> windows-compose-folder--compare-live-search-open`
    - `folder/live-chip-open -> windows-compose-folder--compare-live-chip-open`
    - `folder/live-sidebar-hover -> windows-compose-folder--compare-live-sidebar-hover`
    - `folder/live-sidebar-expanded -> windows-compose-folder--compare-live-sidebar-expanded`
    - `folder/live-thumbnail-hover -> windows-compose-folder--compare-live-thumbnail-hover`
    - `folder/mobile-blog -> windows-compose-folder--compare-mobile-blog`
    - `folder/mobile-search-open -> windows-compose-folder--compare-mobile-search-open`
    - `browser/live-article -> windows-compose-browser--compare-live-article`
    - `browser/live-address-open -> windows-compose-browser--compare-live-address-open`
    - `browser/live-control-hover-minimize -> windows-compose-browser--compare-live-control-hover-minimize`
    - `browser/live-control-hover-maximize -> windows-compose-browser--compare-live-control-hover-maximize`
    - `browser/live-control-hover-close -> windows-compose-browser--compare-live-control-hover-close`
    - `browser/mobile-article -> windows-compose-browser--compare-mobile-article`
    - `browser/mobile-address-open -> windows-compose-browser--compare-mobile-address-open`
  - exact stageAttr mapping:
    - `folder/live-blog -> desktop`
    - `folder/live-search-open -> desktop`
    - `folder/live-chip-open -> desktop`
    - `folder/live-sidebar-hover -> desktop`
    - `folder/live-sidebar-expanded -> desktop`
    - `folder/live-thumbnail-hover -> desktop`
    - `folder/mobile-blog -> mobile`
    - `folder/mobile-search-open -> mobile`
    - `browser/live-article -> desktop`
    - `browser/live-address-open -> desktop`
    - `browser/live-control-hover-minimize -> desktop`
    - `browser/live-control-hover-maximize -> desktop`
    - `browser/live-control-hover-close -> desktop`
    - `browser/mobile-article -> mobile`
    - `browser/mobile-address-open -> mobile`
  - exact compare runtime:
    - build output root: `packages/ui/storybook-static`
    - static serving helper: `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs`
    - canonical current origin: `http://localhost:6007`
    - serving-ready signal: stdout exact `SERVER_READY`
    - capture URL shape: `http://localhost:6007/iframe.html?id={storyId}&viewMode=story`
    - capture-ready wait selector: `[data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]`
    - pre-screenshot assertion: exact `[data-window-compare-stage="{stageAttr}"]` 안에 matching `[data-visual-root]`가 정확히 1개여야 하며 kind/state mismatch면 abort
    - viewport: `1280x800`
    - capture owner: `[data-window-compare-stage]`
    - metadata carrier: nested single `[data-visual-root]`
    - provenance labels:
      - reference side: `external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "{key}"`
      - current side: `package-local current — packages/ui Storybook / [data-window-compare-stage]`
    - blocking scoped diff metric: `scopedBlockingDiffRatio = mismatchedPixels / totalPixelsInsideDeclaredGatingSurfaces`
    - blocking threshold: `0.05`
    - advisory global drift metric: `globalDriftRatio = mismatchedPixels / totalPixelsInsideWholeCaptureCanvas`
    - blocking decision rule:
      - each state passes only when every declared gating surface from the exact union inventory below is present, boundary/anchor/geometry blocker is absent, and `scopedBlockingDiffRatio <= 0.05`
      - otherwise the state result is `explicit blocker`
      - `globalDriftRatio` is always reported but never blocks by itself
    - current-side smoke rule:
      - `--mode smoke`는 exact story inventory, exact story URL shape, exact host/origin, exact readiness signal, exact selector, exact viewport를 그대로 사용해 current-only capture만 생성한다.
      - smoke path는 `reference-captures/*.png`, `run-diff.mjs`, `report.json`, `report.md`를 읽거나 쓰지 않는다.
      - smoke output root는 `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/current-smoke`다.
  - exact declared gating surface unions:
    - `folder/live-blog`, `folder/live-search-open`, `folder/live-chip-open` -> `frame-surface`, `navigation-surface`, `control-surface`, `content-surface`, `media-surface`
    - `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover` -> `navigation-surface`, `control-surface`, `content-surface`, `media-surface`
    - `browser/live-article`, `browser/live-address-open` -> `frame-surface`, `control-surface`, `content-surface`
    - `browser/live-control-hover-minimize`, `browser/live-control-hover-maximize`, `browser/live-control-hover-close` -> `frame-surface`, `control-surface`
    - `folder/mobile-blog`, `folder/mobile-search-open` -> `frame-surface`, `control-surface`, `content-surface`, `media-surface`
    - `browser/mobile-article`, `browser/mobile-address-open` -> `frame-surface`, `control-surface`, `content-surface`
- output:
  - 공개 계약:
    - `Folder`는 two-input + grid owner leaf다.
    - `Browser`는 single-input + `children` owner leaf다.
    - `shared/types.ts`는 `FolderLocationDropdownItem`, `FolderSearchDropdownItem`, `FolderSearchChip`, `FolderSidebarItem`, `FolderGridItem`, `BrowserAddressDropdownItem`를 별도 domain type으로 열고, id uniqueness를 각 prop array local rule로 잠근다.
    - sibling render surface가 여러 item domain을 함께 그리면 key는 `location-dropdown:{id}`, `search-dropdown:{id}`, `search-chip:{id}`, `sidebar:{id}`, `grid-item:{id}`, `address-dropdown:{id}`처럼 domain prefix를 붙인다.
    - `onOpenLocationDropdown()`, `onOpenSearchDropdown()`, `onOpenAddressDropdown()`, `onBack()`, `onForward()`, `onReload()`, `onMinimize()`, `onToggleMaximize()`, `onClose()`는 무인자 통지다.
    - `onLocationValueChange(nextValue: string)`, `onSearchValueChange(nextValue: string)`, `onAddressValueChange(nextValue: string)`는 raw string만 보낸다.
    - `onLocationSubmit(locationValue: string)`, `onSearchSubmit(searchValue: string)`, `onAddressSubmit(addressValue: string)`는 현재 표시 winner 값만 보낸다.
    - `onSelectLocationDropdownItem(locationItem: FolderLocationDropdownItem)`, `onSelectSearchDropdownItem(searchItem: FolderSearchDropdownItem)`, `onSelectSearchChip(chip: FolderSearchChip)`, `onSelectSidebarItem(sidebarItem: FolderSidebarItem)`, `onOpenItem(item: FolderGridItem)`, `onSelectAddressDropdownItem(item: BrowserAddressDropdownItem)`은 각 source array의 exact item object만 보낸다.
    - selection/open/nav/window-control interaction은 자기 callback family만 recipient이며 다른 callback family로 fallthrough하지 않는다.
    - detail state는 storybook/internal review surface owner다.
    - compare runtime은 exact 15 key, exact storyId 15개, exact stageAttr mapping 15개, exact host/origin/readiness, exact selector, exact artifact naming, exact provenance, exact declared gating surface union inventory, `scopedBlockingDiffRatio`, threshold `0.05`, `globalDriftRatio`, explicit blocker rule을 가진다.
    - current-side smoke는 same inventory와 same runtime literal을 current-only로 실행하고 `visual-compare/current-smoke/**`만 생성한다.
    - `@windows/ui` root entry는 `Folder`, `Browser` named export를 제공하고 `WindowFrame`는 export하지 않는다.
  - 내부 기본값:
    - no public `loading`, `empty`, `status`, `hover`, `open`, `expanded`
    - source array에 없는 id, hidden affordance, missing callback path는 no-op이며 값을 변경하거나 다른 callback family를 호출하지 않는다.
    - support-only story가 있더라도 canonical inventory는 exact 15 key 그대로다.
    - Phase 3은 runtime script와 diff pipeline 안의 literal을 수정하지 않는다.
  - 허용하지 않는 대안:
    - detail state를 새 public prop으로 승격하는 선택
    - compare phase 안에서 storyId, selector, provenance, threshold, pass/fail semantics를 다시 정하는 선택
    - source inspection만으로 root entry proof를 닫는 선택
- 작업:
  1. `Folder` public contract와 detail-state owner rule을 구현한다.
  2. `Browser` public contract와 detail-state owner rule을 구현한다.
  3. exact story inventory, runtime scripts, positive root import proof를 고정한다.
  4. current-side harness smoke를 실행해 Phase 3 전에 runtime wiring을 실제로 검증한다.
- 검증:
  - [ ] source를 읽으면 exact public prop names, winner rule, callback family별 emitted arg shape, domain-local id rule, no-op recipient rule, detail-state owner rule을 설명할 수 있다.
  - [ ] `pnpm --filter @windows/ui exec vitest run src/index.test.ts src/components/windows/storybook/windowCompareInventory.test.tsx`가 exact runtime contract와 root import proof를 함께 검증한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 green이다.
  - [ ] `node plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs --mode smoke --output-dir plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/current-smoke`가 green이고, current-only capture 15개가 same key naming으로 생성된다.
  - [ ] `capture-current.mjs`, `storybook-static-server.cjs`, `run-diff.mjs`가 exact runtime literal과 `scopedBlockingDiffRatio <= 0.05` / `globalDriftRatio` semantics를 그대로 적는다.
  - [ ] exact declared gating surface union inventory 6개 row가 `plan.md`, 이 detail, Phase 3 detail에서 같은 surface set으로 반복된다.

## Phase 검증

| 검증 항목 | 확인 수단 | 기대 결과 |
| --- | --- | --- |
| Folder contract 고정 | source inspection | exact prop names, winner rule, callback payload, domain-local id rule, no-op recipient rule, detail-state owner가 보인다. |
| Browser contract 고정 | source inspection | exact prop names, winner rule, callback payload, domain-local id rule, no-op recipient rule, detail-state owner가 보인다. |
| exact runtime inventory proof | `pnpm --filter @windows/ui exec vitest run src/index.test.ts src/components/windows/storybook/windowCompareInventory.test.tsx` | exact storyId/stageAttr/runtime recipient contract가 고정된다. |
| package-local build boundary | `pnpm --filter @windows/ui build-storybook` | story/build surface가 package boundary에서 green이다. |
| current-side harness smoke | `node plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs --mode smoke --output-dir plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/current-smoke` | same inventory, same host/origin/readiness, same selector, same viewport로 current-only capture가 생성되고 Phase 3 전에 runtime wiring이 검증된다. |
