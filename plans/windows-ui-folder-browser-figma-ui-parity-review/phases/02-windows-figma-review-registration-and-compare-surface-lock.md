# Phase 2. windows Figma review registration과 compare surface 고정

> 이 문서는 source-tree가 Figma baseline과 같은 key, 같은 geometry, 같은 compare/review recipient registry를 쓰도록 정렬하는 실행용 상세 계약이다.
> compare key drift와 stage-size drift를 여기서 먼저 닫아 Phase 3 이후 compare evidence가 literal contract를 갖게 만든다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | windows storybook surface가 canonical Figma state key 6개, compare/review recipient registry, singular stage owner, `1282x752` / `392x796` geometry를 그대로 쓰게 만든다. |
| 선행조건 | Phase 1이 Figma state inventory와 size contract를 고정해야 한다. |
| 완료 판단 | source-tree 한 곳에서 recipient URL, frame name, compare/review story ID, compare stage size metadata를 읽고, `[data-window-compare-stage]` owner는 `compareWindowStage.tsx` 하나로 설명된다. |
| 중단 조건 | compare story가 legacy `desktop-card/chrome` alias를 계속 써야 하거나 stage owner가 `WindowFrame`과 compare-stage helper 사이에서 계속 겹쳐야만 한다면 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/storybook/windowFigmaReviewRegistration.ts` | 추가 | Figma recipient URL, frame name, current node hint, canonical state inventory, compare story ID, review story ID, compare stage size metadata를 export하는 단일 registry file이다. | source-tree가 compare/review recipient ownership과 Figma provenance를 한 파일에서 읽는다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.tsx` | 조정 | `FOLDER_DESKTOP_CARD`, `FOLDER_MOBILE_CARD` 같은 legacy constant를 canonical Figma key 기준으로 정리한다. | Folder fixture naming이 `desktop-blog` / `mobile-blog`를 쓴다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 조정 | `BROWSER_DESKTOP_CHROME`, `BROWSER_MOBILE_CHROME` 같은 legacy constant를 canonical Figma key 기준으로 정리한다. | Browser fixture naming이 `desktop-article` / `mobile-article`를 쓴다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx` | 조정 | compare story export, story ID, `WindowCompareRoot` state가 canonical Figma key를 literal하게 반영해야 한다. | `windows-compose-folder--compare-desktop-blog`, `--compare-desktop-search-open`, `--compare-mobile-blog`가 source-tree에서 그대로 읽힌다. |
| `packages/ui/src/components/windows/browser/browser.stories.tsx` | 조정 | compare story export, story ID, `WindowCompareRoot` state가 canonical Figma key를 literal하게 반영해야 한다. | `windows-compose-browser--compare-desktop-article`, `--compare-desktop-address-open`, `--compare-mobile-article`가 source-tree에서 그대로 읽힌다. |
| `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 조정 | desktop stage는 `1282x752`, mobile stage는 `392x796` outer capture box를 owner로 가지고 `[data-window-compare-stage]`의 유일한 DOM owner가 돼야 한다. | current capture가 Figma export와 같은 outer pixels를 가지며 stage owner ambiguity가 없다. |
| `packages/ui/src/components/windows/storybook/windowCompareRoot.tsx` | 조정 | compare root comment/typing/metadata가 canonical key naming을 설명한다. | compare root가 Figma-backed key naming을 owner contract로 설명한다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`, `packages/ui/src/components/windows/storybook/windowReviewInventory.test.tsx` | 조정 | inventory tests가 canonical state key, compare story ID, stage owner contract drift를 잡는다. | vitest가 key drift와 compare/review recipient drift를 차단한다. |

### 완료 증거

- source-tree에 `windowFigmaReviewRegistration.ts`가 생겨 Figma provenance, compare story ID, review story ID, stage size metadata를 한 곳에 모은다.
- compare story ID가 `desktop-blog`, `desktop-article` naming으로 바뀌고 legacy `desktop-card/chrome` alias가 compare inventory에서 사라진다.
- compare stage size가 desktop `1282x752`, mobile `392x796`로 바뀐다.
- `[data-window-compare-stage]` owner가 `compareWindowStage.tsx`로 단일화되고 `WindowFrame`는 inner frame/body marker만 설명한다.
- inventory tests가 Figma-backed compare/review recipient를 다시 잠근다.

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - current windows Storybook compare surface가 Figma inventory와 같은 key와 같은 capture geometry를 쓰게 만들어 later compare/report가 state alias나 resize 보정을 추측하지 않도록 한다.
- 작업 순서:
  1. `windowFigmaReviewRegistration.ts`에 Figma provenance와 canonical state inventory를 모은다.
  2. Folder/Browser fixture constant, compare story export, review story recipient, `data-visual-state`, compare story ID를 canonical Figma key로 바꾼다.
  3. `compareWindowStage.tsx` stage owner, compare stage size, inventory tests를 Figma export size 기준으로 다시 잠근다.
- boundary: `packages/ui/src/components/windows/storybook/**`, `folder/folder.stories.tsx`, `browser/browser.stories.tsx`만 움직인다. product UI geometry는 다음 phase에서 닫는다.
- input:
  - 시나리오: maintainer가 source-tree compare surface를 Figma baseline과 literal하게 맞춰 Phase 4 report가 key alias와 viewport mismatch를 다시 해석하지 않게 해야 하는 경우
  - exact legacy-to-canonical mapping:
    - `folder/desktop-card` -> `folder/desktop-blog`
    - `folder/mobile-card` -> `folder/mobile-blog`
    - `browser/desktop-chrome` -> `browser/desktop-article`
    - `browser/mobile-chrome` -> `browser/mobile-article`
    - `folder/desktop-search-open` -> unchanged
    - `browser/desktop-address-open` -> unchanged
  - exact compare story recipient:
    - `windows-compose-folder--compare-desktop-blog`
    - `windows-compose-folder--compare-desktop-search-open`
    - `windows-compose-folder--compare-mobile-blog`
    - `windows-compose-browser--compare-desktop-article`
    - `windows-compose-browser--compare-desktop-address-open`
    - `windows-compose-browser--compare-mobile-article`
  - exact review story recipient:
    - `windows-compose-folder--review-long-title`
    - `windows-compose-folder--review-long-address`
    - `windows-compose-folder--review-no-chips`
    - `windows-compose-browser--review-long-title`
    - `windows-compose-browser--review-long-address`
    - `windows-compose-browser--review-empty-dropdown`
  - compare geometry contract:
    - desktop stage -> `1282x752`
    - mobile stage -> `392x796`
  - singular stage-owner contract:
    - `[data-window-compare-stage="desktop"|"mobile"]` owner -> `compareWindowStage.tsx`
    - `WindowFrame` owner -> `data-window-frame-root`, `data-window-frame-chrome`, `data-window-frame-body`
    - `WindowCompareRoot` owner -> `data-visual-root`, `data-visual-kind`, `data-visual-state`
    - `WindowReviewRoot` owner -> `data-window-review-root`, `data-window-review-kind`, `data-window-review-state`
  - review-only edge stories:
    - long title
    - long address
    - no chips
    - empty dropdown
- output:
  - 공개 계약:
    - `windowFigmaReviewRegistration.ts`는 Figma recipient URL, frame name, current node hint, canonical state inventory, compare story ID, review story ID, compare stage size metadata를 export한다.
    - compare story export와 `data-visual-state`는 canonical Figma key를 literal하게 쓴다.
    - inventory tests는 compare state 6개와 review-only state를 exact literal로 검증한다.
    - compare stage DOM owner는 `compareWindowStage.tsx` 하나다.
    - `WindowFrame`는 stage marker를 소유하지 않고 frame/body marker만 소유한다.
    - `WindowCompareRoot`와 `WindowReviewRoot`는 kind/state metadata owner를 각자 유지한다.
  - 내부 기본값:
    - review-only edge story naming은 유지할 수 있지만 compare inventory에 섞이지 않는다.
    - current node hint는 registration file 안에서도 documentary hint로만 남는다.
  - 허용하지 않는 대안:
    - compare story와 artifact에서 `desktop-card`, `desktop-chrome`, `mobile-card`, `mobile-chrome` alias를 병행 유지하지 않는다.
    - compare stage size를 old `1280x750` / `390x794`로 남기지 않는다.
    - Figma provenance string과 review story recipient ownership을 story/fixture/test 여러 파일에 분산시켜 두지 않는다.
    - stage owner를 `WindowFrame`와 `compareWindowStage.tsx`가 같이 가진다고 적지 않는다.
- 선행조건:
  - Phase 1의 baseline inventory가 canonical state key와 export size를 고정해야 한다.
- 제약:
  - compare story ID, `data-visual-state`, capture artifact key, report row key는 같은 canonical string을 써야 한다.
  - `WindowReviewRoot`와 review-only edge inventory는 compare inventory와 계속 분리돼야 한다.
  - review story ID literal도 same registry file과 inventory test에서 재사용 가능해야 한다.
  - source-tree boundary는 windows package 안에 머물러야 한다.
- side effects:
  - Phase 3가 blocking scope 구현을 canonical state vocabulary 위에서 진행할 수 있다.
  - Phase 4가 Figma key와 same-size stage를 바로 캡처할 수 있다.
- failure/validation:
  - legacy key alias가 compare inventory 어디든 남으면 blocker다.
  - `[data-window-compare-stage]` owner가 `WindowFrame`와 `compareWindowStage.tsx` 사이에서 다시 겹치면 blocker다.
  - compare stage size가 Figma export size와 다르면 current capture와 reference export가 outer box부터 어긋나므로 blocker다.
  - review story recipient ownership이 registry file에 없고 story 주석/test import에만 흩어지면 blocker다.
  - inventory tests가 exact compare/review recipient를 검증하지 못하면 later compare contract가 다시 느슨해지므로 blocker다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx src/components/windows/storybook/windowReviewInventory.test.tsx`가 성공한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 성공한다.
  - [ ] source-tree에서 compare story ID, review story ID, Figma recipient metadata를 한 곳에서 읽을 수 있다.
  - [ ] `compareWindowStage.tsx`가 `[data-window-compare-stage]`의 유일한 owner로 설명된다.
