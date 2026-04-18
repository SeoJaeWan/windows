# Phase 3. UI 상태와 edge contract 고정

> 이 문서는 host-driven chip/dropdown surface, internal-only open state, compare story inventory, review-only edge state를 같은 계약으로 정렬하는 실행용 상세 계약이다.
> Phase 2의 closed-state 셸 위에 필요한 UI 상태 전환만 올리고 runtime/app behavior는 계속 닫는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | controlled/default winner rule, callback-only host handoff, internal-open affordance, compare state 6개, exact edge-state review surface를 모두 고정한다. |
| 선행조건 | Phase 2의 closed-state shell과 responsive grammar가 고정돼 있어야 한다. |
| 완료 판단 | prop shape, callback/no-op behavior, compare story ID, exact review story ID, edge-state validation surface를 이 문서만 읽고 다시 추측하지 않아도 된다. |
| 중단 조건 | desktop open state를 재현하려면 public open prop을 만들어야 하거나, chip/dropdown 선택이 내부 data mutation을 동반해야 한다면 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/folder/index.tsx` | 조정 | current sidebar/entry surface 위에 chip UI surface를 추가하되 host-driven selection contract와 no-filtering rule을 따라야 한다. | `Folder`가 chip props와 internal-open affordance를 동시에 설명할 수 있다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 조정 | `addressLabel`은 계속 host-controlled display value이고 dropdown items는 prop-driven surface로 받는다. | `Browser`가 internal dropdown affordance와 prop-driven item surface를 설명할 수 있다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts` | 조정 | compare state와 review-only edge state에 필요한 chip/title/address fixture를 모두 소유한다. | Folder live state 3개와 edge state가 fixture source에서 명확히 분리된다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 조정 | compare state와 review-only edge state에 필요한 dropdown item/title/address fixture를 모두 소유한다. | Browser live state 3개와 edge state가 fixture source에서 명확히 분리된다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 조정 | compare story는 exact state key 6개만 canonical inventory로 유지하고 edge state는 review-only로 분리한다. | Phase 4 capture가 literal story ID 6개만 사용해도 된다. |
| `packages/ui/src/components/windows/storybook/windowReviewRoot.tsx` | 추가 | review-only edge state는 exact review marker를 가져야 later validation이 story ID와 state key를 추측하지 않는다. | edge review story가 `[data-window-review-root][data-window-review-kind][data-window-review-state]`를 정확히 하나씩 가진다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`, `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 조정 | story-local harness가 internal-only open state를 재현할 수 있어야 하되 public prop을 새로 만들면 안 된다. | desktop open state compare story가 canonical stage 위에서 재현된다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 조정 | compare inventory positive signal은 state key 6개와 canonical stage marker를 literal하게 검증해야 한다. | compare inventory test가 6개 state의 exact key/kind/stage를 보증한다. |
| `packages/ui/src/components/windows/storybook/windowReviewInventory.test.tsx` | 추가 | edge-state review surface는 dedicated inventory test로 잠가야 silent drift가 없다. | long title, long address, no chips, empty dropdown items review story와 edge invariant가 exact key로 검증된다. |

### 완료 증거

- `Folder` prop contract에 chip 목록/선택 surface가 추가되지만 selection이 `entries` filtering을 내부에서 일으키지 않는다.
- `Browser` prop contract에 address dropdown items surface가 추가되지만 open/focus visual state는 public prop으로 열리지 않는다.
- valid chip activation과 valid dropdown item activation에서 callback이 유일한 host handoff로 명시되고, invalid/repeated/empty-item path는 no-op으로 닫힌다.
- compare inventory가 `folder/desktop-blog`, `folder/desktop-search-open`, `folder/mobile-blog`, `browser/desktop-article`, `browser/desktop-address-open`, `browser/mobile-article` 6개 exact key를 가진다.
- 긴 title/address, no chips, empty dropdown items는 exact review story recipient와 dedicated review inventory test로 남는다.

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - live UI 상태 전환에 필요한 surface만 열고, host-driven selection contract와 internal-only open state를 later compare/test가 추측 없이 사용할 수 있게 만든다.
- 작업 순서:
  1. `Folder`와 `Browser`의 stateful UI prop shape와 winner rule을 정의하고 component source에 반영한다.
  2. story-local harness를 이용해 desktop open state compare story와 review-only edge-state story를 exact recipient로 추가/정리한다.
  3. compare inventory positive signal과 review inventory validation surface를 exact key 기준으로 갱신한다.
- boundary: package windows component state surface와 windows Storybook fixture/story/stage/inventory signal만 움직인다. 라이브 baseline inventory는 read-only prerequisite다.
- input:
  - 시나리오: maintainer가 desktop open state를 compare 가능하게 만들면서도 runtime behavior나 public open prop은 열지 않아야 하는 경우
  - `Folder` 추가 surface:
    - `chips: FolderChip[]`
    - `selectedChipId?: string`
    - `defaultSelectedChipId?: string`
    - `onChipSelect?: (chipId: string) => void`
  - `Folder` chip winner rule:
    - effective selected chip resolution:
      - `selectedChipId`가 렌더된 chip id와 일치하면 controlled winner는 그 chip이다.
      - `selectedChipId`가 주어졌지만 어떤 chip id와도 일치하지 않으면 controlled winner는 `none`이고 `defaultSelectedChipId`나 internal state로 fallback하지 않는다.
      - `selectedChipId`가 없고 `defaultSelectedChipId`가 렌더된 chip id와 일치하면 첫 렌더 기본 선택은 그 chip이다.
      - `selectedChipId`가 없고 `defaultSelectedChipId`가 없거나 invalid면 첫 렌더 winner는 `none`이다.
    - valid chip activation contract:
      - 활성화한 chip id가 렌더된 `chips` 안에 있고 현재 effective selected chip과 다르면 `onChipSelect(chipId)`가 존재할 때 정확히 한 번 호출된다.
      - uncontrolled surface에서는 위 경우 internal selected chip이 활성화한 id로 갱신된다.
      - controlled surface에서는 위 경우 callback만 host에 전달되고 visual winner는 host가 `selectedChipId`를 갱신하기 전까지 기존 controlled resolution을 유지한다.
      - 활성화한 chip id가 현재 effective selected chip과 같으면 repeated selection no-op이며 internal visual state와 callback 모두 변하지 않는다.
      - `chips = []`이면 activatable chip이 없고 internal selected chip도 `none`이며 callback은 호출되지 않는다.
      - invalid `selectedChipId` 또는 invalid `defaultSelectedChipId` 자체를 고치기 위한 mount-time/open-time repair callback은 발생하지 않는다.
    - 어떤 경우에도 chip 선택이 `entries`를 내부에서 filtering, reordering, hiding하지 않는다.
  - `Browser` 추가 surface:
    - `addressDropdownItems: BrowserAddressDropdownItem[]`
    - `onAddressDropdownItemSelect?: (itemId: string) => void`
  - `Browser` display rule:
    - displayed address text는 계속 `addressLabel`이 소유한다.
    - dropdown items는 prop-driven list이며 실제 navigation은 만들지 않는다.
    - 별도 selected/default dropdown item pair는 열지 않고 `addressLabel`을 canonical controlled display value로 유지한다.
    - valid dropdown item activation contract:
      - 렌더된 dropdown item을 활성화하면 `onAddressDropdownItemSelect(itemId)`가 존재할 때 정확히 한 번 호출된다.
      - valid activation 뒤 내부 dropdown visual state는 default closed state로 복귀한다.
      - `addressLabel`, `children`, route-like meaning은 host가 prop을 바꾸기 전까지 내부에서 바뀌지 않는다.
      - Browser는 selected/default dropdown item pair가 없으므로 repeated activation no-op rule을 두지 않고, 같은 rendered item을 다시 열어 다시 활성화하면 그때마다 독립적인 callback handoff가 발생할 수 있다.
      - `addressDropdownItems = []`이면 activatable item이 없고 callback은 호출되지 않는다.
  - internal-only open state:
    - `Folder` search panel open state는 desktop search trigger interaction으로만 재현한다.
    - `Browser` address dropdown open/focus state는 address area interaction으로만 재현한다.
    - compare/review story는 story-local harness로 이 interaction 결과를 만든다.
  - exact compare story recipient:
    - `windows-folder--compare-desktop-blog`
    - `windows-folder--compare-desktop-search-open`
    - `windows-folder--compare-mobile-blog`
    - `windows-browser--compare-desktop-article`
    - `windows-browser--compare-desktop-address-open`
    - `windows-browser--compare-mobile-article`
  - review-only edge state:
    - long `title`
    - long `addressLabel`
    - `Folder` with `chips = []`
    - `Browser` with `addressDropdownItems = []`
  - exact review story recipient:
    - `windows-folder--long-title-review`
    - `windows-folder--long-address-review`
    - `windows-folder--no-chips-review`
    - `windows-browser--long-title-review`
    - `windows-browser--long-address-review`
    - `windows-browser--empty-dropdown-items-review`
  - exact review validation surface:
    - `windowReviewRoot.tsx`는 review story marker `[data-window-review-root][data-window-review-kind][data-window-review-state]`를 소유한다.
    - `windowReviewInventory.test.tsx`는 exact review story recipient를 import해 marker mapping과 edge invariant를 검증한다.
    - expected edge invariant:
      - long-title review story는 exact long-title fixture text를 렌더한다.
      - long-address review story는 exact long-address fixture text를 렌더한다.
      - `windows-folder--no-chips-review`는 chip activator count `0`을 검증한다.
      - `windows-browser--empty-dropdown-items-review`는 open review harness 안의 dropdown item count `0`을 검증한다.
- output:
  - 공개 계약:
    - `Folder`는 chip surface를 host-driven selection contract로 소유한다.
    - `Browser`는 address dropdown items surface를 prop-driven list contract로 소유한다.
    - callback은 UI-only 범위에서 유일한 host handoff다.
    - `Folder` effective selected chip resolution은 `selectedChipId(valid) -> selectedChipId(invalid => none, no fallback) -> defaultSelectedChipId(valid on first render) -> none` 순서를 따른다.
    - `Folder`에서 valid chip activation은 current effective winner와 다를 때만 callback을 최대 한 번 일으키는 canonical handoff다.
    - `Folder` uncontrolled surface의 valid chip activation은 internal selected chip을 활성화한 id로 갱신하고, controlled surface의 valid chip activation은 callback만 host에 전달하며 visual winner는 host prop 갱신 전까지 바뀌지 않는다.
    - invalid `selectedChipId`, invalid `defaultSelectedChipId`, repeated chip activation, `chips = []`는 모두 no-op 경로이며 repair callback이나 implicit fallback selection을 만들지 않는다.
    - `Browser` valid dropdown item activation은 callback 정확히 한 번 + internal dropdown closed-state 복귀가 canonical handoff다.
    - `Browser` valid dropdown item activation 뒤에도 `addressLabel`, `children`, route-like meaning은 host prop 갱신 전까지 내부에서 바뀌지 않는다.
    - `Browser`는 selected/default dropdown item pair를 열지 않으며 `addressDropdownItems = []`이면 activatable item과 callback이 모두 없다.
    - internal open/focus visual state는 public controlled prop 없이 component-owned state로 유지된다.
    - compare inventory는 exact story ID 6개와 exact `kind/state` metadata를 가진다.
    - review inventory는 exact review story ID 6개와 exact `kind/state` metadata를 가진다.
    - review inventory exact recipient:
      - `windows-folder--long-title-review`
      - `windows-folder--long-address-review`
      - `windows-folder--no-chips-review`
      - `windows-browser--long-title-review`
      - `windows-browser--long-address-review`
      - `windows-browser--empty-dropdown-items-review`
    - `windowReviewInventory.test.tsx`는 위 review recipient 6개와 marker contract, exact long text fixture, zero-item invariant를 canonical validation surface로 소유한다.
  - 내부 기본값:
    - mobile `Folder`는 `chips`가 있어도 separate search trigger와 panel UI를 렌더링하지 않는다.
    - no chips와 empty dropdown items는 empty visual surface나 empty state를 가질 수 있지만 exact copy는 계약으로 고정하지 않는다.
  - 허용하지 않는 대안:
    - `searchPanelOpen`, `defaultSearchPanelOpen`, `addressDropdownOpen`, `focusedAddressDropdownItemId` 같은 public prop을 추가하지 않는다.
    - `selectedAddressDropdownItemId`, `defaultSelectedAddressDropdownItemId` 같은 별도 selection pair를 추가하지 않는다.
    - chip 선택으로 `entries`를 내부 filtering하지 않는다.
    - address dropdown item 선택으로 URL navigation이나 body replacement를 내부 수행하지 않는다.
    - compare inventory에 synthetic edge state를 추가하지 않는다.
    - callback 외의 event emitter, route handoff, data mutation handoff를 추가하지 않는다.
- 선행조건:
  - Phase 2가 default closed-state shell을 고정해야 한다.
- 제약:
  - controlled prop은 항상 default/internal state보다 우선한다.
  - compare story key, `data-visual-kind`, `data-visual-state`, `data-window-compare-stage`는 Phase 4 capture가 literal하게 읽을 수 있어야 한다.
  - review story key, `data-window-review-kind`, `data-window-review-state`는 review inventory test가 literal하게 읽을 수 있어야 한다.
  - `Folder`와 `Browser`의 기존 root export identity는 유지한다.
- side effects:
  - Phase 4가 desktop open state까지 포함해 canonical capture 6개를 수행할 수 있다.
  - `plan-materialize`가 selection winner rule, valid callback handoff, loser/no-op path, edge-state coverage를 그대로 unit/E2E 경계로 내릴 수 있다.
- failure/validation:
  - chip selection이 내부 filtering을 요구하면 blocker다.
  - dropdown open state를 public prop으로 열어야 한다면 blocker다.
  - valid chip/dropdown activation의 callback/no-op contract가 exact하게 닫히지 않으면 blocker다.
  - compare story ID 6개가 exact key와 1:1 대응하지 못하면 Phase 4 handoff가 깨지므로 blocker다.
  - review story ID 6개나 `windowReviewInventory.test.tsx`가 없으면 긴 text/no-items regression을 later test가 추측해야 하므로 blocker다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx src/components/windows/storybook/windowReviewInventory.test.tsx`가 성공한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 성공한다.
  - [ ] `Folder`와 `Browser` source를 읽으면 controlled/default winner rule, callback-only host handoff, loser/no-op path를 설명할 수 있다.
