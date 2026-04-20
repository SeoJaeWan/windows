# Phase 3. Folder/Browser UI-only contract와 storybook/export 검증 잠금

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | `Folder`/`Browser` public props는 그대로 유지하고, exact 15-state storybook/internal review inventory와 positive `@windows/ui` root import proof를 같은 phase에서 잠근다. |
| 선행조건 | Phase 2의 shared shell, exact capture owner, differentiated mobile hierarchy contract가 stable해야 한다. |
| 완료 판단 | `packages/ui/src/components/windows/**`, `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts`, `windowCompareInventory.test.tsx`만 읽어도 exact public props, review-state owner, story ID 15개, root import proof를 다시 추측하지 않아도 된다. |
| 중단 조건 | 15-state UI-only coverage를 위해 `loading/empty/status`, public open/hover/expanded prop, internal navigation/filtering을 새 public contract로 열어야 한다면 blocker다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/shared/types.ts` | 추가 | minimum shared type만 두고 heterogeneous item domain은 leaf-specific type으로 분리한다. | shared dropdown item과 leaf-specific payload가 literal하게 보인다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 추가/조정 | `Folder`는 two-input + grid owner를 유지하고 detail state는 story-only owner로 둔다. | exact prop names와 no-op rule이 source에 드러난다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 추가/조정 | `Browser`는 single-input + `children` owner를 유지하고 control-hover/mobile-open은 story-only owner로 둔다. | exact prop names와 no-op rule이 source에 드러난다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 추가/조정 | 15-state scaffolding owner는 fixture/harness다. `detail-variant` state는 public prop이 아니라 fixed review surface다. | exact 15 state key가 fixture source에서 추적 가능하다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 추가/조정 | exact story ID 15개가 canonical inventory다. support-only story가 있더라도 compare inventory는 늘어나지 않는다. | Phase 4 capture가 exact story ID 15개만 읽으면 된다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 추가/조정 | exact 15 key, exact `[data-window-compare-stage]`, exact nested `[data-visual-root]` relation을 positive signal로 검증한다. | test가 exact inventory 15개를 literal하게 고정한다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 조정 | `folder`, `browser` kind와 metadata carrier contract를 exact inventory에 맞춘다. | compare tooling이 exact `kind/state` key를 literal하게 읽을 수 있다. |
| `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts` | 조정/추가 | root entry는 `Folder`, `Browser` named export를 실제 file path와 맞추고, `@windows/ui` consumer import proof를 positive signal로 제공한다. | review finding `EXPORT-VALIDATION-THIN`이 consumer-side proof로 보강된다. |

## 완료 증거

- `Folder` public props는 two-input + grid owner direction 그대로 잠기고, detail state가 public prop이 아님이 source에 남는다.
- `Browser` public props는 single-input + `children` owner direction 그대로 잠기고, control-hover/mobile-open이 story-only owner임이 source에 남는다.
- exact story ID 15개와 exact `[data-window-compare-stage]` / nested `[data-visual-root]` relation이 test로 고정된다.
- `packages/ui/src/index.test.ts`가 `@windows/ui` root entry에서 `Folder`, `Browser`를 직접 import하는 positive proof가 된다.

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| 목표 | public props는 그대로 두고 15-state review surface와 root entry proof를 같은 contract로 잠근다. |
| 연결 작업 단위 | `Folder leaf UI-only contract`, `Browser leaf UI-only contract`, `Storybook/internal review inventory, compare, export verification` |
| 선행 조건 | Phase 2의 shared shell, exact capture owner, differentiated mobile hierarchy |
| 검증 메모 | exact public props, no-op rule, story ID 15개, root import test, exact capture owner가 같은 language로 드러나야 한다. |
| 로컬 전제 계약 | Phase 4는 여기서 잠근 exact story ID 15개와 exact `[data-window-compare-stage]` / nested `[data-visual-root]` relation만 current capture 대상으로 사용해야 한다. |

## 작업 순서

| 순서 | 작업 단위 | 이번 단계에서 처리하는 내용 | 완료 조건 |
| --- | --- | --- | --- |
| 1 | shared types + Folder | `Folder` two-input/grid contract와 detail-state owner rule을 고정한다. | Folder public contract와 no-op rule이 literal하게 보인다. |
| 2 | Browser | `Browser` single-input/`children` contract와 control-hover/mobile-open owner rule을 고정한다. | Browser public contract와 no-op rule이 literal하게 보인다. |
| 3 | storybook/export/verification | exact 15-state story inventory, compare metadata, root export, root import proof를 고정한다. | review surface와 export verification이 same contract 안에서 닫힌다. |

## 작업 단위 A. Folder contract와 detail-state owner

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | user는 Folder two-input + grid owner를 유지하되, chip-open/sidebar-hover/sidebar-expanded/thumbnail-hover/mobile-search-open detail도 full UI-only coverage 안에 넣길 원했다. |
| 현재 문제 | current plan은 Folder canonical state를 3개 수준으로만 적어 `detail-variant` state owner를 later implementation이 추측하게 둔다. |
| 목표 상태 | `Folder` public props는 그대로 두고, 8개 Folder state가 public prop이 아니라 storybook/internal review surface로 고정된다. |
| 유지 경계 | `children` body, public status/open prop, internal filtering/navigation은 열지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/ui/src/components/windows/shared/types.ts` | 변경 | shared dropdown item과 folder-specific payload가 분리돼야 한다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 변경 | exact prop names와 no-op rule이 source에 보여야 한다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx` | 변경 | Folder 8-state scaffolding과 state role이 fixture source에서 추적돼야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `title`, `locationValue`, `searchValue`, `locationDropdownItems?`, `searchDropdownItems?`, `searchChips?`, `sidebarItems`, `activeSidebarItemId?`, `items`, `onOpenLocationDropdown?`, `onLocationValueChange?`, `onLocationSubmit?`, `onSelectLocationDropdownItem?`, `onOpenSearchDropdown?`, `onSearchValueChange?`, `onSearchSubmit?`, `onSelectSearchDropdownItem?`, `onSelectSearchChip?`, `onSelectSidebarItem?`, `onOpenItem?`, `onMinimize?`, `onToggleMaximize?`, `onClose?` |
| state ownership | `locationValue`, `searchValue`, payload arrays는 host-owned, dropdown open/close와 detail-state scaffolding은 internal/story-owned, body grid는 component-owned |
| callback / handoff | open/change/submit/select/open-item/window-control은 callback handoff만 연다. |
| no-op / invalid rule | dropdown data가 없으면 해당 dropdown UI를 렌더링하지 않는다. invalid id activation과 missing callback path는 no-op이다. `folder/live-chip-open`, `folder/live-sidebar-hover`, `folder/live-sidebar-expanded`, `folder/live-thumbnail-hover`, `folder/mobile-search-open`은 public prop이 아니라 story-only state다. |
| 추가 관찰 포인트 | mobile은 sidebar shrink가 아니라 content-first grid hierarchy다. `Enter`는 항상 submit이고 internal filtering/reorder/body swap은 없다. |

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
| Folder public prop names와 no-op rule | component source inspection |
| Folder 8-state owner rule | fixture/story source inspection |

## 작업 단위 B. Browser contract와 detail-state owner

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | user는 Browser single-input + `children` owner를 유지하되, address-open/control-hover/mobile-address-open까지 full UI-only coverage에 넣길 원했다. |
| 현재 문제 | current plan은 Browser canonical state를 3개 수준으로만 적어 control-hover/mobile-open owner를 public contract와 섞을 여지가 남아 있다. |
| 목표 상태 | `Browser` public props는 그대로 두고, 7개 Browser state가 storybook/internal review surface로 고정된다. |
| 유지 경계 | route/history model, public hover/open prop, article-specific alternate body prop은 열지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/ui/src/components/windows/browser/index.tsx` | 변경 | exact prop names와 `children` owner가 source에 보여야 한다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 변경 | Browser 7-state scaffolding과 state role이 fixture source에서 추적돼야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `title`, `addressValue`, `addressDropdownItems?`, `onOpenAddressDropdown?`, `onAddressValueChange?`, `onAddressSubmit?`, `onSelectAddressDropdownItem?`, `onBack?`, `onForward?`, `onReload?`, `onMinimize?`, `onToggleMaximize?`, `onClose?`, `children` |
| state ownership | `addressValue`와 `children`은 host-owned, dropdown open/close와 control-hover/mobile-open scaffolding은 internal/story-owned |
| callback / handoff | open/change/submit/select/nav/window-control은 callback handoff만 연다. |
| no-op / invalid rule | dropdown data가 없으면 open surface를 렌더링하지 않는다. invalid id는 no-op이고 select 뒤에도 `addressValue`, `children`, route/history meaning은 host prop이 바뀌기 전까지 내부에서 안 바뀐다. control-hover 3종과 `browser/mobile-address-open`은 public prop이 아니라 story-only state다. |
| 추가 관찰 포인트 | mobile은 simplified chrome/content-first reading hierarchy를 유지한다. `Enter`는 항상 `onAddressSubmit(currentAddressValue)`다. |

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
| Browser public prop names와 no-op rule | component source inspection |
| Browser 7-state owner rule | fixture/story source inspection |

## 작업 단위 C. storybook/internal review inventory와 root entry verification

| 항목 | 내용 |
| --- | --- |
| 변경 이유 | review finding `EXPORT-VALIDATION-THIN`을 닫으려면 exact review inventory와 root entry consumer proof를 같은 boundary에서 positive signal로 남겨야 한다. |
| 현재 문제 | current plan은 6-state inventory만 잠그고 있고 export proof도 `build-storybook + source inspection`까지만 적혀 있어 package-root consumer importability가 충분히 드러나지 않는다. |
| 목표 상태 | exact story ID 15개, compare metadata, additive root export, positive `@windows/ui` import proof가 한 phase validation으로 묶인다. |
| 유지 경계 | exhaustive root export inventory freeze, unrelated existing export cleanup, `WindowFrame` public export는 열지 않는다. |

### 관련 파일

| 파일 | 작업 역할 | 검증 메모 |
| --- | --- | --- |
| `packages/ui/src/components/windows/folder/folder.stories.tsx` | 변경 | Folder 8-state story ID가 exact inventory와 맞아야 한다. |
| `packages/ui/src/components/windows/browser/browser.stories.tsx` | 변경 | Browser 7-state story ID가 exact inventory와 맞아야 한다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 변경 | exact 15 key와 stage/root marker relation을 positive signal로 검증해야 한다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 변경 | `folder`, `browser` kind inventory와 metadata carrier contract를 유지해야 한다. |
| `packages/ui/src/index.ts` | 변경 | `Folder`, `Browser` root export를 실제 file path와 맞춰야 한다. |
| `packages/ui/src/index.test.ts` | 추가 | `@windows/ui` root entry consumer import proof를 positive signal로 남겨야 한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | exact story ID 15개, exact `[data-window-compare-stage]`, exact nested `[data-visual-root]`, additive root export availability for `Folder`, `Browser` |
| state ownership | story/harness는 review-state scaffolding을 소유하고, root entry는 package consumer import boundary를 소유한다. |
| callback / handoff | 없음 |
| no-op / invalid rule | support-only review story는 canonical inventory에 포함되지 않는다. exhaustive export inventory freeze나 source inspection only proof는 invalid closure다. |
| 추가 관찰 포인트 | exact story ID는 다음과 같다: `windows-folder--compare-live-blog`, `windows-browser--compare-live-article`, `windows-folder--compare-live-search-open`, `windows-folder--compare-live-chip-open`, `windows-folder--compare-live-sidebar-hover`, `windows-folder--compare-live-sidebar-expanded`, `windows-folder--compare-live-thumbnail-hover`, `windows-browser--compare-live-address-open`, `windows-browser--compare-live-control-hover-minimize`, `windows-browser--compare-live-control-hover-maximize`, `windows-browser--compare-live-control-hover-close`, `windows-folder--compare-mobile-blog`, `windows-folder--compare-mobile-search-open`, `windows-browser--compare-mobile-article`, `windows-browser--compare-mobile-address-open`. |

### 시각 패리티 계약

| 항목 | 내용 |
| --- | --- |
| comparison mode | `none` |
| gating metric | `n/a` |
| non-gating metric | `none` |
| local surface | Storybook recipient, compare metadata, root import proof |
| canonical surface role | `n/a` |
| comparison policy | `n/a` |
| metric treatment | `n/a` |

### 검증 근거

| 항목 | 확인 수단 |
| --- | --- |
| exact story ID 15개와 stage/root marker relation | `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx` |
| positive `@windows/ui` root import proof | `pnpm --filter @windows/ui exec vitest run src/index.test.ts` |

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - public props는 그대로 유지하면서 full 15-state UI-only coverage와 positive root entry proof를 같은 contract로 잠근다.
- boundary:
  - `packages/ui/src/components/windows/**`
  - `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
  - `packages/ui/src/index.ts`
  - `packages/ui/src/index.test.ts`
- input:
  - 시나리오: maintainer가 Folder/Browser public API를 넓히지 않고, Figma 15-state wrapper inventory를 storybook/internal review surface와 root export proof로 닫아야 하는 경우
  - repo-local contract facts:
    - `packages/ui/package.json`은 `test`, `build-storybook`를 package boundary validation command로 가진다.
    - `packages/ui/tsconfig.json`은 `@windows/ui -> ./src/index.ts` path alias를 가진다.
  - exact Folder state inventory:
    - `folder/live-blog`
    - `folder/live-search-open`
    - `folder/live-chip-open`
    - `folder/live-sidebar-hover`
    - `folder/live-sidebar-expanded`
    - `folder/live-thumbnail-hover`
    - `folder/mobile-blog`
    - `folder/mobile-search-open`
  - exact Browser state inventory:
    - `browser/live-article`
    - `browser/live-address-open`
    - `browser/live-control-hover-minimize`
    - `browser/live-control-hover-maximize`
    - `browser/live-control-hover-close`
    - `browser/mobile-article`
    - `browser/mobile-address-open`
  - exact root entry validation direction:
    - `packages/ui/src/index.test.ts`는 `@windows/ui`에서 `Folder`, `Browser`를 직접 import한다.
    - positive proof는 root entry symbol resolution과 minimal consumer usage다.
- output:
  - 공개 계약:
    - `Folder`는 two-input + grid owner leaf다.
    - `Browser`는 single-input + `children` owner leaf다.
    - hover/expanded/chip-open/control-hover/mobile-open detail은 storybook/internal review surface owner다.
    - compare inventory는 exact story ID 15개, exact `[data-window-compare-stage]`, exact nested `[data-visual-root]` relation을 가진다.
    - `packages/ui/src/index.ts`는 unrelated existing export를 유지한 채 `Folder`, `Browser` named export를 add/fix한다.
    - `packages/ui/src/index.test.ts`는 `@windows/ui` root import proof를 positive signal로 제공한다.
  - 내부 기본값:
    - no `loading`, `empty`, `status`, public open prop, public hover prop
    - support-only review story는 존재할 수 있지만 canonical inventory를 늘리지 않는다.
  - 허용하지 않는 대안:
    - `folder/live-chip-open`이나 control-hover state를 새 package public prop으로 승격하는 선택
    - `build-storybook`와 source inspection만으로 root export proof를 닫는 선택
    - exhaustive root export inventory를 durable contract로 승격하는 선택
    - `WindowFrame`를 root export로 올리는 선택
- 작업:
  1. `Folder` public contract와 detail-state owner rule을 정의한다.
  2. `Browser` public contract와 detail-state owner rule을 정의한다.
  3. exact story ID 15개, compare metadata, additive root export, positive root import proof를 고정한다.
- 검증:
  - [ ] source를 읽으면 exact public prop names, callback meaning, no-op rule, detail-state owner rule을 설명할 수 있다.
  - [ ] `pnpm --filter @windows/ui exec vitest run src/index.test.ts src/components/windows/storybook/windowCompareInventory.test.tsx`가 exact root import proof와 exact story inventory 15개를 함께 검증한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 package-local story/build boundary를 통과한다.
  - [ ] `packages/ui/src/index.ts`는 unrelated existing export를 유지한 채 `Folder`, `Browser` named export를 실제 file path와 맞춘다.

## Phase 검증

| 검증 항목 | 확인 수단 | 기대 결과 |
| --- | --- | --- |
| positive root import proof | `pnpm --filter @windows/ui exec vitest run src/index.test.ts` | `@windows/ui`에서 `Folder`, `Browser`를 직접 import하는 consumer-side proof가 남는다. |
| exact 15-state inventory proof | `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx` | exact story ID 15개와 exact stage/root marker relation이 고정된다. |
| package-local story/build boundary | `pnpm --filter @windows/ui build-storybook` | windows storybook surface와 export wiring이 package boundary에서 빌드 가능하다. |
