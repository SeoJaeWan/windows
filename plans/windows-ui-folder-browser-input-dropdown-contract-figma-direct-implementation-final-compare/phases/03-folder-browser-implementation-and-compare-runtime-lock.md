# Phase 3. Folder/Browser 구현과 compare runtime 잠금

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Phase 1 spec artifact와 Phase 2 foundation을 직접 사용해 `Folder`/`Browser` UI-only contract를 구현하고, exact 15-state compare runtime과 positive `@windows/ui` root import proof를 같은 phase에서 잠근다. |
| 선행조건 | Phase 1의 exact 15 key, state role, real reference capture naming과 Phase 2의 exact `[data-window-compare-stage]`, exact stage values `desktop` / `mobile`, desktop `1024x700`, mobile `375x680` contract가 stable해야 한다. |
| 완료 판단 | `packages/ui/src/components/windows/**`, `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts`, `windowCompareInventory.test.tsx`, `capture-current.mjs`, `visual-compare/storybook-static-server.cjs`, `run-diff.mjs`만 읽어도 exact public props, review-state owner, actual story ID 15개, capture/runtime contract, root import proof를 다시 추측하지 않아도 된다. |
| 중단 조건 | 15-state UI-only coverage를 위해 `loading/empty/status`, public open/hover/expanded prop, internal navigation/filtering, compare-time runtime invention을 새 public contract로 열어야 한다면 blocker다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/shared/types.ts` | 추가 | minimum shared type만 두고 heterogeneous item domain은 leaf-specific type으로 분리한다. | shared dropdown item과 leaf-specific payload가 literal하게 보인다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 추가/조정 | `Folder`는 two-input + grid owner를 유지하고 detail state는 storybook/internal review owner로 둔다. | exact prop names, winner rule, callback meaning, no-op rule이 source에 드러난다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 추가/조정 | `Browser`는 single-input + `children` owner를 유지하고 control-hover/mobile-open은 storybook/internal review owner로 둔다. | exact prop names, winner rule, callback meaning, no-op rule이 source에 드러난다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 추가/조정 | 15-state scaffolding owner는 fixture/harness다. `detail-variant` state는 public prop이 아니라 fixed review surface다. | exact 15 state key가 fixture source에서 추적 가능하다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 추가/조정 | exact story ID 15개가 canonical inventory다. support-only story가 있더라도 compare inventory는 늘어나지 않는다. | Phase 4 capture가 exact story ID 15개만 읽으면 된다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 추가/조정 | exact 15 key, exact Storybook `storyId`, exact `[data-window-compare-stage]`, exact nested `[data-visual-root]` relation을 positive signal로 검증한다. | test가 exact inventory 15개를 literal하게 고정한다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 조정 | `folder`, `browser` kind와 metadata carrier contract를 exact inventory에 맞춘다. | compare tooling이 exact `kind/state` key를 literal하게 읽을 수 있다. |
| `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts` | 조정/추가 | root entry는 `Folder`, `Browser` named export를 실제 file path와 맞추고, `@windows/ui` consumer import proof를 positive signal로 제공한다. | consumer-side proof가 `EXPORT-VALIDATION-THIN`을 닫는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs` | 생성/조정 | actual story ID 15개, exact stageAttr values `desktop` / `mobile`, per-case stageAttr mapping 15개, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout sentinel `SERVER_READY`, `iframe.html?id={storyId}&viewMode=story`, capture-ready wait selector `[data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]`, `1280x800` viewport, `[data-window-compare-stage]`, `npx agent-browser` command family를 literal하게 잠근다. | Phase 4는 이 script를 실행만 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs` | 생성/조정 | `packages/ui/storybook-static`를 `http://localhost:6007`으로 서빙하고 stdout `SERVER_READY`를 canonical serving-ready signal로 남긴다. | compare-time host/origin을 다시 정하지 않는다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs` | 생성/조정 | reference/current/diff/report artifact family가 same `kind/state` key, provenance wording, diff threshold `0.05`를 공유한다. | final report row와 artifact filename drift가 없다. |

## 완료 증거

- `Folder` public props는 two-input + grid owner direction 그대로 잠기고, detail state가 public prop이 아님이 source에 남는다.
- `Browser` public props는 single-input + `children` owner direction 그대로 잠기고, control-hover/mobile-open이 storybook/internal review owner임이 source에 남는다.
- exact story ID 15개, exact stageAttr values `desktop` / `mobile`, exact `[data-window-compare-stage]` / nested `[data-visual-root]` relation이 test로 고정된다.
- `capture-current.mjs`가 `packages/ui/storybook-static -> http://localhost:6007`, stdout `SERVER_READY`, `iframe.html?id={storyId}&viewMode=story`, capture-ready wait selector, exact single-root assertion, `1280x800` viewport, `npx agent-browser open/wait/eval/screenshot` 흐름을 literal하게 가진다.
- `visual-compare/storybook-static-server.cjs`가 compare host/origin을 `http://localhost:6007`으로 고정하고 `SERVER_READY`를 serving-ready signal로 남긴다.
- `run-diff.mjs`가 exact `kind/state` artifact naming, provenance label, threshold `0.05`를 literal하게 가진다.
- `packages/ui/src/index.test.ts`가 `@windows/ui` root entry에서 `Folder`, `Browser`를 직접 import하는 positive proof가 된다.

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| 목표 | public props는 그대로 두고 15-state review surface, compare runtime, root entry proof를 같은 contract로 잠근다. |
| 연결 작업 단위 | `Folder leaf UI-only contract`, `Browser leaf UI-only contract`, `Storybook compare inventory, compare runtime, root entry proof` |
| 선행 조건 | Phase 1의 exact 15 key와 real reference capture naming, Phase 2의 shared shell, exact capture owner, exact stage geometry |
| 검증 메모 | exact public props, winner/no-op rule, actual story ID 15개, exact capture owner/URL/viewport, root import test가 같은 language로 드러나야 한다. |
| 로컬 전제 계약 | Phase 4는 여기서 잠근 exact story ID 15개, exact stageAttr values `desktop` / `mobile`, per-case stageAttr mapping 15개, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout `SERVER_READY`, capture-ready wait selector, exact `[data-window-compare-stage]`, exact nested `[data-visual-root]`, exact artifact naming, diff threshold `0.05`만 current capture와 report 대상으로 사용해야 한다. |

## 작업 순서

| 순서 | 작업 단위 | 이번 단계에서 처리하는 내용 | 완료 조건 |
| --- | --- | --- | --- |
| 1 | shared types + Folder | `Folder` two-input/grid contract와 detail-state owner rule을 고정한다. | Folder public contract와 no-op rule이 literal하게 보인다. |
| 2 | Browser | `Browser` single-input/`children` contract와 control-hover/mobile-open owner rule을 고정한다. | Browser public contract와 no-op rule이 literal하게 보인다. |
| 3 | storybook/compare runtime/root entry verification | exact 15-state story inventory, actual story ID, compare metadata, capture script, diff pipeline, additive root export, positive root import proof를 고정한다. | final compare가 recipient/runtime invention 없이 실행 가능하다. |

## 작업 단위 A. Folder contract와 detail-state owner

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | user는 Folder two-input + grid owner를 유지하되 chip-open/sidebar-hover/sidebar-expanded/thumbnail-hover/mobile-search-open detail도 full UI-only coverage 안에 넣길 원했다. |
| 현재 문제 | detail-state owner를 명시하지 않으면 later implementation이나 materialize가 public prop을 추측해 contract를 넓힐 위험이 있다. |
| 목표 상태 | `Folder` public props는 그대로 두고, 8개 Folder state가 public prop이 아니라 storybook/internal review surface로 고정된다. |
| 유지 경계 | `children` body prop, public status/open prop, internal filtering/navigation은 열지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/ui/src/components/windows/shared/types.ts` | 변경 | shared dropdown item과 folder-specific payload가 분리돼야 한다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 변경 | exact prop names, winner rule, callback meaning, no-op rule이 source에 보여야 한다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx` | 변경 | Folder 8-state scaffolding과 state role이 fixture source에서 추적돼야 한다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx` | 변경 | compare stories가 exact Folder inventory를 유지해야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `title`, `locationValue`, `searchValue`, `locationDropdownItems?`, `searchDropdownItems?`, `searchChips?`, `sidebarItems`, `activeSidebarItemId?`, `items`, `onOpenLocationDropdown?`, `onLocationValueChange?`, `onLocationSubmit?`, `onSelectLocationDropdownItem?`, `onOpenSearchDropdown?`, `onSearchValueChange?`, `onSearchSubmit?`, `onSelectSearchDropdownItem?`, `onSelectSearchChip?`, `onSelectSidebarItem?`, `onOpenItem?`, `onMinimize?`, `onToggleMaximize?`, `onClose?` |
| state ownership | `locationValue`, `searchValue`, payload arrays는 host-owned, dropdown open/close와 detail-state scaffolding은 internal/story-owned, body grid는 component-owned |
| callback / handoff | open/change/submit/select/open-item/window-control은 callback handoff만 연다. |
| no-op / invalid rule | dropdown data가 없으면 해당 dropdown UI를 렌더링하지 않는다. invalid id activation과 missing callback path는 no-op이다. `folder/live-chip-open`, `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover`, `folder/mobile-search-open`은 public prop이 아니라 story-only state다. |
| 추가 관찰 포인트 | mobile은 sidebar shrink가 아니라 content-first grid hierarchy다. `Enter`는 항상 `onLocationSubmit(locationValue)` 또는 `onSearchSubmit(searchValue)`이고 internal filtering/reorder/body swap은 없다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | location/search row, chips/dropdown anchor, sidebar/list density, grid/card hierarchy, thumbnail hover affordance, mobile search-open hierarchy |
| non-gating metric | exact chip text, dropdown row copy, thumbnail art, icon glyph detail |
| local surface | location input, search input, search chips, dropdown rows, sidebar rows, grid cards, thumbnail hover |
| canonical surface role | `navigation-surface`, `control-surface`, `content-surface`, `media-surface`, `text-detail-surface` |
| comparison policy | geometry와 hierarchy는 `gating`, text/media detail은 `advisory` |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| Folder public prop names와 winner/no-op rule | component source inspection |
| Folder 8-state owner rule | fixture/story source inspection |

## 작업 단위 B. Browser contract와 detail-state owner

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | user는 Browser single-input + `children` owner를 유지하되 address-open/control-hover/mobile-address-open까지 full UI-only coverage에 넣길 원했다. |
| 현재 문제 | control-hover/mobile-open owner를 명시하지 않으면 later implementation이나 materialize가 public `hover/open` prop을 추측해 contract를 넓힐 위험이 있다. |
| 목표 상태 | `Browser` public props는 그대로 두고, 7개 Browser state가 storybook/internal review surface로 고정된다. |
| 유지 경계 | route/history model, public hover/open prop, article-specific alternate body prop은 열지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/ui/src/components/windows/browser/index.tsx` | 변경 | exact prop names, winner rule, callback meaning, no-op rule, `children` owner가 source에 보여야 한다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 변경 | Browser 7-state scaffolding과 state role이 fixture source에서 추적돼야 한다. |
| `packages/ui/src/components/windows/browser/browser.stories.tsx` | 변경 | compare stories가 exact Browser inventory를 유지해야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `title`, `addressValue`, `addressDropdownItems?`, `onOpenAddressDropdown?`, `onAddressValueChange?`, `onAddressSubmit?`, `onSelectAddressDropdownItem?`, `onBack?`, `onForward?`, `onReload?`, `onMinimize?`, `onToggleMaximize?`, `onClose?`, `children` |
| state ownership | `addressValue`와 `children`은 host-owned, dropdown open/close와 control-hover/mobile-open scaffolding은 internal/story-owned |
| callback / handoff | open/change/submit/select/nav/window-control은 callback handoff만 연다. |
| no-op / invalid rule | dropdown data가 없으면 open surface를 렌더링하지 않는다. invalid id는 no-op이고 select 뒤에도 `addressValue`, `children`, route/history meaning은 host prop이 바뀌기 전까지 내부에서 안 바뀐다. control-hover 3종과 `browser/mobile-address-open`은 public prop이 아니라 story-only state다. |
| 추가 관찰 포인트 | mobile은 simplified chrome/content-first reading hierarchy를 유지한다. `Enter`는 항상 `onAddressSubmit(addressValue)`다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `structural parity` |
| gating metric | address row, dropdown anchor/width, control-hover fill/placement, article body boundary, mobile reading hierarchy |
| non-gating metric | article copy, cover art, dropdown row copy, icon glyph detail |
| local surface | nav controls, address input, dropdown rows, control-hover cluster, article body |
| canonical surface role | `control-surface`, `content-surface`, `fixture-payload-surface`, `ornament-surface` |
| comparison policy | chrome/dropdown geometry는 `gating`, body payload와 copy detail은 `advisory` |
| metric treatment | `boundary-and-geometry` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| Browser public prop names와 winner/no-op rule | component source inspection |
| Browser 7-state owner rule | fixture/story source inspection |

## 작업 단위 C. storybook inventory, compare runtime, root entry verification

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | final compare가 recipient/runtime을 새로 발명하지 않으려면 exact compare inventory, actual story ID, capture selector, artifact naming, provenance label, root import proof를 같은 boundary에서 positive signal로 잠가야 한다. |
| 현재 문제 | compare inventory만 잠그고 actual runtime literal을 남기지 않으면 final compare가 script/selector/story ID/host/origin/wait rule을 재해석하게 된다. |
| 목표 상태 | exact story ID 15개, compare metadata, additive root export, positive `@windows/ui` import proof, capture script, static serving helper, diff pipeline이 한 phase validation으로 묶인다. |
| 유지 경계 | exhaustive root export inventory freeze, unrelated export cleanup, `WindowFrame` public export, compare-time story layout 수정은 열지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 변경 | exact 15 key, actual story ID, exact stage/root marker relation을 positive signal로 검증해야 한다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 변경 | `folder`, `browser` kind inventory와 metadata carrier contract를 유지해야 한다. |
| `packages/ui/src/index.ts` | 변경 | `Folder`, `Browser` root export를 실제 file path와 맞춰야 한다. |
| `packages/ui/src/index.test.ts` | 추가 | `@windows/ui` root entry consumer import proof를 positive signal로 남겨야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs` | 변경 | actual story ID 15개, build output root, host/origin, ready rule, URL shape, viewport, selector, output naming이 literal하게 적혀야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs` | 추가/조정 | compare runtime이 `packages/ui/storybook-static`와 `http://localhost:6007`을 mechanical하게 연결해야 한다. |
| `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs` | 변경 | exact artifact naming, provenance label, diff threshold가 literal하게 적혀야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | exact story ID 15개, exact `data-window-compare-stage` values `desktop | mobile`, capture-ready wait selector `[data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]`, exact `[data-window-compare-stage]`, exact nested `[data-visual-root]`, build output `packages/ui/storybook-static`, canonical host `http://localhost:6007`, stdout sentinel `SERVER_READY`, exact `kind/state` artifact naming, additive root export availability for `Folder`, `Browser` |
| state ownership | story/harness는 review-state scaffolding을 소유하고, `compareRoot`는 `data-visual-kind/state` metadata carrier를 소유하며, root entry는 package consumer import boundary를 소유한다. |
| callback / handoff | 없음 |
| no-op / invalid rule | support-only review story는 canonical inventory에 포함되지 않는다. exhaustive export inventory freeze, source inspection only proof, compare-time alias rename, host/origin/readiness 재정의, story layout tweak는 invalid closure다. |
| 추가 관찰 포인트 | actual story ID는 다음 15개다: `windows-compose-folder--compare-live-blog`, `windows-compose-folder--compare-live-search-open`, `windows-compose-folder--compare-live-chip-open`, `windows-compose-folder--compare-live-sidebar-hover`, `windows-compose-folder--compare-live-sidebar-expanded`, `windows-compose-folder--compare-live-thumbnail-hover`, `windows-compose-folder--compare-mobile-blog`, `windows-compose-folder--compare-mobile-search-open`, `windows-compose-browser--compare-live-article`, `windows-compose-browser--compare-live-address-open`, `windows-compose-browser--compare-live-control-hover-minimize`, `windows-compose-browser--compare-live-control-hover-maximize`, `windows-compose-browser--compare-live-control-hover-close`, `windows-compose-browser--compare-mobile-article`, `windows-compose-browser--compare-mobile-address-open`. stageAttr values는 정확히 `desktop`, `mobile` 두 개뿐이고 live cases는 `desktop`, mobile cases는 `mobile`을 쓴다. compare runtime serving owner는 `visual-compare/storybook-static-server.cjs`이고 `capture-current.mjs`는 `packages/ui/storybook-static`를 `http://localhost:6007`에 올린 뒤 stdout `SERVER_READY` 이후에만 story iframe을 연다. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `none` |
| gating metric | `n/a` |
| non-gating metric | `none` |
| local surface | Storybook recipient, compare metadata, capture runtime, diff pipeline, root import proof |
| canonical surface role | `n/a` |
| comparison policy | `n/a` |
| metric treatment | `n/a` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| exact story ID 15개와 stage/root marker relation | `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx` |
| positive `@windows/ui` root import proof | `pnpm --filter @windows/ui exec vitest run src/index.test.ts` |
| package-local story/build boundary | `pnpm --filter @windows/ui build-storybook` |
| exact static host/origin/readiness contract | `capture-current.mjs`, `visual-compare/storybook-static-server.cjs` inspection |

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - public props는 그대로 유지하면서 full 15-state UI-only coverage, exact compare runtime, positive root entry proof를 같은 contract로 잠근다.
- boundary:
  - `packages/ui/src/components/windows/**`
  - `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
  - `packages/ui/src/index.ts`
  - `packages/ui/src/index.test.ts`
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/capture-current.mjs`
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/storybook-static-server.cjs`
  - `plans/windows-ui-folder-browser-input-dropdown-contract-figma-direct-implementation-final-compare/visual-compare/run-diff.mjs`
- input:
  - 시나리오: maintainer가 Folder/Browser public API를 넓히지 않고, Figma 15-state wrapper inventory를 storybook/internal review surface와 final compare runtime으로 닫아야 하는 경우
  - repo-local contract facts:
    - `packages/ui/package.json`은 `test`, `build-storybook`를 package boundary validation command로 가진다.
    - `packages/ui/tsconfig.json`은 `@windows/ui -> ./src/index.ts` path alias를 가진다.
    - compare metadata carrier는 `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`가 소유한다.
    - `pnpm --filter @windows/ui build-storybook`가 만드는 current compare build output은 `packages/ui/storybook-static`이고, compare runtime은 dev host `http://localhost:6006`을 재사용하지 않고 plan-local static host를 별도로 잠근다.
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
    - serving-ready signal: helper stdout exact `SERVER_READY`
    - capture URL shape: `http://localhost:6007/iframe.html?id={storyId}&viewMode=story`
    - stage attribute values: `desktop`, `mobile`
    - capture-ready wait selector: `[data-window-compare-stage="{stageAttr}"] [data-visual-root][data-visual-kind="{kind}"][data-visual-state="{state}"]`
    - pre-screenshot assertion: exact `[data-window-compare-stage="{stageAttr}"]` 안에 matching `[data-visual-root]`가 정확히 1개여야 하며 `data-visual-kind/state`가 key와 일치하지 않으면 abort
    - viewport: `1280x800`
    - capture owner: exact `[data-window-compare-stage]`
    - metadata carrier: nested single `[data-visual-root]`
    - metadata fields: `data-visual-kind = folder | browser`, `data-visual-state = {state}`
    - artifact naming:
      - reference: `{kind}-{state}-reference.png`
      - current: `{kind}-{state}-current.png`
      - diff: `{kind}-{state}-diff.png`
    - provenance labels:
      - reference side: `external-source evidence — Figma NrUGKPZUewpuA8XuHI0v5n / canvas 3:2 / frame "Live UI References — Folder Browser" / wrapper "{key}"`
      - current side: `package-local current — packages/ui Storybook / [data-window-compare-stage]`
    - diff threshold: `0.05`
- output:
  - 공개 계약:
    - `Folder`는 two-input + grid owner leaf다.
    - `Browser`는 single-input + `children` owner leaf다.
    - hover/expanded/chip-open/control-hover/mobile-open detail은 storybook/internal review surface owner다.
    - compare inventory는 exact key 15개, actual story ID 15개, exact stageAttr mapping 15개, exact `[data-window-compare-stage]`, exact nested `[data-visual-root]`, exact artifact naming, exact provenance labels, threshold `0.05`를 가진다.
    - compare runtime은 `packages/ui/storybook-static -> http://localhost:6007`, stdout `SERVER_READY`, stage attribute values `desktop | mobile`, capture-ready wait selector를 exact contract로 가진다.
    - `packages/ui/src/index.ts`는 unrelated existing export를 유지한 채 `Folder`, `Browser` named export를 add/fix한다.
    - `packages/ui/src/index.test.ts`는 `@windows/ui` root import proof를 positive signal로 제공한다.
  - 내부 기본값:
    - no `loading`, `empty`, `status`, public open prop, public hover prop, public expanded prop
    - support-only review story는 존재할 수 있지만 canonical inventory를 늘리지 않는다.
    - Phase 4는 capture script나 diff pipeline 안의 contract를 수정하지 않는다.
  - 허용하지 않는 대안:
    - `folder/live-chip-open`이나 control-hover state를 새 package public prop으로 승격하는 선택
    - `build-storybook`와 source inspection만으로 root export proof를 닫는 선택
    - exhaustive root export inventory를 durable contract로 승격하는 선택
    - compare phase 안에서 story ID, selector, provenance, threshold를 다시 정하는 선택
    - compare phase 안에서 host/origin/readiness를 다시 정하는 선택
- 작업:
  1. `Folder` public contract와 detail-state owner rule을 정의한다.
  2. `Browser` public contract와 detail-state owner rule을 정의한다.
  3. exact story ID 15개, compare metadata, capture runtime, diff pipeline, additive root export, positive root import proof를 고정한다.
- 검증:
  - [ ] source를 읽으면 exact public prop names, winner rule, callback meaning, no-op rule, detail-state owner rule을 설명할 수 있다.
  - [ ] `pnpm --filter @windows/ui exec vitest run src/index.test.ts src/components/windows/storybook/windowCompareInventory.test.tsx`가 exact root import proof와 exact story inventory/runtime contract를 함께 검증한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 package-local story/build boundary를 통과한다.
  - [ ] `capture-current.mjs`와 `visual-compare/storybook-static-server.cjs`가 exact story ID 15개, exact stageAttr mapping 15개, build output `packages/ui/storybook-static`, host `http://localhost:6007`, stdout `SERVER_READY`, capture-ready wait selector, viewport `1280x800`, exact `[data-window-compare-stage]`, `npx agent-browser` command family를 literal하게 적는다.
  - [ ] `run-diff.mjs`가 exact artifact naming, provenance labels, threshold `0.05`를 literal하게 적는다.

## Phase 검증

| 검증 항목 | 확인 수단 | 기대 결과 |
| --- | --- | --- |
| positive root import proof | `pnpm --filter @windows/ui exec vitest run src/index.test.ts` | `@windows/ui`에서 `Folder`, `Browser`를 직접 import하는 consumer-side proof가 남는다. |
| exact 15-state inventory/runtime proof | `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx` | exact story ID 15개, exact stageAttr mapping 15개와 exact stage/root marker relation이 고정된다. |
| package-local story/build boundary | `pnpm --filter @windows/ui build-storybook` | windows storybook surface와 export wiring이 package boundary에서 빌드 가능하다. |
| final compare runtime literal 잠금 | `capture-current.mjs`, `visual-compare/storybook-static-server.cjs`, `run-diff.mjs` inspection | Phase 4가 recipient/runtime, host/origin, readiness, artifact naming, provenance, threshold를 다시 발명할 필요가 없다. |
