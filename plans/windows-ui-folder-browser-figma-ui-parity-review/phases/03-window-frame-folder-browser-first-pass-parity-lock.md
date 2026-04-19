# Phase 3. WindowFrame, Folder, Browser 1차 blocking parity 고정

> 이 문서는 user가 잠근 first-pass blocking scope만 제품 코드에 반영하는 실행용 상세 계약이다.
> later-pass UI polish나 fixture inflation이 아니라, 이번 pass의 blocker만 닫을 수 있게 경계를 줄여 두는 phase다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | WindowFrame/Browser/Folder를 Figma reference 기준 first-pass blocking surface만 맞추고 out-of-scope mismatch를 reportable state로 남긴다. |
| 선행조건 | Phase 2가 canonical key, compare geometry, source-tree compare inventory를 고정해야 한다. |
| 완료 판단 | current source를 읽으면 어떤 차이가 blocker이고 어떤 차이가 non-blocking/noise인지 컴포넌트 경계에서 바로 설명할 수 있다. |
| 중단 조건 | Browser body copy/content length나 Folder `metaLabel`/`summary`를 맞춰야만 compare가 진행되거나, icon glyph exact swap이 필수라고 판단되면 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 조정 | outer border box, chrome/body split, reserved marker owner는 keep하되 Figma first-pass review에 필요한 geometry와 spacing을 정렬해야 한다. | frame root/chrome/body 경계가 Figma parity blocker 기준으로 읽힌다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 조정 | Browser blocking winner는 toolbar/address dropdown/body boundary다. `children` body slot은 host-owned로 유지한다. | article copy나 cover art를 맞추지 않아도 blocking boundary를 설명할 수 있다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 조정 | Folder blocking winner는 thumbnail/title/grid/card layout이다. `metaLabel`/`summary`는 leaf content로 남는다. | card geometry와 text hierarchy가 blocker 기준으로 읽히고 detail copy는 blocker가 아니다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx` | 조정 | thumbnail/title/grid/card layout을 보여 주는 fixture와 noise source를 분리해 적어야 한다. | `metaLabel`/`summary`가 여전히 존재해도 parity winner로 취급되지 않는다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 조정 | body boundary를 보여 줄 최소 fixture를 유지하되 article copy/content length는 noise로 남겨야 한다. | Browser body boundary와 article content noise가 분리된다. |

### 완료 증거

- `WindowFrame` marker owner와 chrome/body boundary가 유지된다.
- `Browser`는 toolbar/address dropdown/body boundary를 blocking winner로 설명하고 `children` slot을 계속 host-owned로 둔다.
- `Folder`는 thumbnail/title/grid/card layout을 blocking winner로 설명하고 `metaLabel`/`summary`는 leaf content로 남긴다.
- icon glyph shape는 그대로 두더라도 alignment/spacing/color drift만 blocker로 읽히게 된다.

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - user-locked first-pass blocking scope만 source-tree에 반영해 Phase 4 report가 blocker와 later-pass 항목을 섞지 않게 만든다.
- 작업 순서:
  1. `WindowFrame` outer geometry와 Browser toolbar/body boundary를 Figma 기준 blocker surface로 정렬한다.
  2. `Folder` entry card thumbnail/title/grid layout을 Figma 기준 blocker surface로 정렬한다.
  3. fixture source가 leaf content noise와 blocking surface를 분리 설명하도록 보정한다.
- boundary: `packages/ui/src/components/windows/**`와 windows storybook fixture source만 쓴다. taskbar, consumer app, global layout은 건드리지 않는다.
- input:
  - 시나리오: maintainer가 canonical compare states 6개에서 blocking mismatch만 줄이고 later-pass 항목은 report bucket으로 남겨야 하는 경우
  - Browser first-pass blocking scope:
    - `WindowFrame` outer geometry
    - toolbar row geometry
    - address dropdown placement and row layout
    - body boundary / overflow / clip ownership
  - Browser first-pass out-of-scope:
    - article title/body copy length
    - article cover art
    - exact icon glyph shape
    - exact dropdown copy when geometry를 바꾸지 않는 경우
  - Folder first-pass blocking scope:
    - entry thumbnail ratio and placement
    - title hierarchy and spacing
    - grid/card density, width, gap, outer card geometry
  - Folder first-pass out-of-scope:
    - `metaLabel`
    - `summary`
    - thumbnail art 자체
    - exact icon glyph shape
    - search/chip overlay exact visual parity
  - icon policy:
    - glyph exact shape는 out-of-scope다.
    - icon slot의 size, alignment, padding, color 때문에 overall geometry가 달라지면 그 geometry drift는 in-scope다.
- output:
  - 공개 계약:
    - `WindowFrame` reserved marker strip와 root/chrome/body ownership은 유지된다.
    - `Browser`는 `children` body slot을 유지하고 first-pass blocker를 toolbar/dropdown/body boundary로 제한한다.
    - `Folder`는 existing card data surface를 유지하면서 first-pass blocker를 thumbnail/title/grid/card layout로 제한한다.
    - `metaLabel`/`summary`는 rendered leaf content일 수 있지만 parity winner가 아니다.
    - out-of-scope leaf mismatch는 later compare report에서 `non-blocking differences` 또는 `fixture noise`로만 기록한다.
  - 내부 기본값:
    - open search/chip state와 address-open state는 compare inventory에 남기되 first-pass blocker를 다시 넓히지 않는다.
    - exact icon library swap은 요구하지 않는다.
  - 허용하지 않는 대안:
    - Browser 본문 copy를 Figma reference에 맞추기 위해 `children` contract를 깨지 않는다.
    - Folder `metaLabel`/`summary`를 parity 통과를 위해 제거하거나 exact copy 맞춤 대상으로 승격하지 않는다.
    - noise source를 숨기기 위해 fixture를 과도하게 축약하거나 placeholder로 교체하지 않는다.
- 선행조건:
  - Phase 2가 canonical compare surface와 stage geometry를 잠가야 한다.
- 제약:
  - source-tree 수정은 windows package 안에 머물러야 한다.
  - compare states 6개 모두가 later phase에서 계속 캡처 가능한 구조를 유지해야 한다.
  - public component identity와 existing host-owned props는 유지해야 한다.
- side effects:
  - Phase 4 report가 blocker와 leaf noise를 source-tree boundary 기준으로 바로 분리할 수 있다.
  - `plan-materialize`가 inventory tests와 bounded-surface validation을 같은 component/story boundary로 파생할 수 있다.
- failure/validation:
  - `metaLabel`/`summary` 또는 article copy/content length를 blocker로 고치기 시작하면 blocker다.
  - icon glyph exact swap을 prerequisite로 삼으면 blocker다.
  - Browser body boundary 대신 body copy를 맞추는 방향으로 scope가 새면 blocker다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx src/components/windows/storybook/windowReviewInventory.test.tsx`가 성공한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 성공한다.
  - [ ] source inspection으로 Browser blocker와 Folder blocker가 top-level request wording과 동일하게 설명된다.
