# Phase 4. Story/compare inventory 동결

> 이 문서는 canonical state taxonomy와 compare capture inventory를 exact key로 고정하는 실행용 상세 계약이다.
> external visual compare가 성공하려면 어떤 상태를 찍는지부터 package source에서 하나로 잠겨 있어야 하고, 각 compare story가 machine-capture recipient를 정확히 하나만 내보낸다는 positive signal도 함께 남아야 한다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | `Folder` 2 state, `Browser` 4 state canonical inventory와 `folder` / `browser` compare kind를 package source에서 동결하고, compare story recipient test를 추가한다. |
| 선행조건 | Phase 1의 baseline inventory와 Phase 3의 public component contract가 stable해야 한다. |
| 완료 판단 | fixture source, story source, compare inventory test를 함께 읽으면 canonical 6 state와 exact one `[data-visual-root]` recipient signal이 보인다. |
| 중단 조건 | supporting reference가 새 canonical state로 해석되거나, compare key naming이 route title/copy에 종속돼 계속 바뀌거나, compare story가 복수의 visual root를 방출하면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 추가 | compare wrapper는 human-review decoration 없이 viewport별 capture geometry만 소유해야 한다. | desktop/mobile compare capture가 stable wrapper를 가진다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 정리 | `data-visual-kind` inventory에 `folder`, `browser`를 추가하되 existing kind naming을 깨면 안 된다. | `folder`, `browser`가 machine-readable compare kind로 잠긴다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts` | 정리 | canonical inventory는 `desktop-default`, `mobile-collapsed` 두 key뿐이고 supporting sample은 별도 주석/구조로 분리한다. | Folder fixture source가 canonical vs supporting boundary를 명시한다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 정리 | canonical inventory는 article/not-found x desktop/mobile 네 key뿐이다. | Browser fixture source가 canonical 4 key와 supporting sample을 분리한다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx` | 정리 | `CompareDesktopDefault`, `CompareMobileCollapsed` export가 exact `folder/desktop-default`, `folder/mobile-collapsed` pair를 한 번씩만 소유해야 한다. | `Folder` stories가 canonical key를 공용으로 쓰고 compare export가 recipient 하나만 만든다. |
| `packages/ui/src/components/windows/browser/browser.stories.tsx` | 정리 | `CompareDesktopArticle`, `CompareDesktopNotFound`, `CompareMobileArticle`, `CompareMobileNotFound` export가 exact `browser/*` canonical 4 pair를 한 번씩만 소유해야 한다. | `Browser` stories가 canonical key를 공용으로 쓰고 compare export가 recipient 하나만 만든다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 추가 | source-tree test가 compare story별 recipient uniqueness와 `kind/state` pair를 positive signal로 검증해야 한다. | compare story마다 exact one `[data-visual-root]`와 promised pair를 test가 확인한다. |

### 완료 증거

- `CompareRoot` 주석과 type inventory에 `folder`, `browser`가 추가된다.
- `Folder` / `Browser` stories에서 canonical key가 stories와 compare entries에 동일하게 쓰인다.
- compare inventory test가 각 compare story의 exact one `[data-visual-root]`와 promised `kind/state` pair를 검증한다.

- owner_agent: `frontend-developer`
- 목적:
  - later visual compare와 materialize가 같은 exact state inventory를 바라보게 하고, machine-capture contract를 source-tree positive signal로 고정한다.
- boundary:
  - primary write target: `packages/ui/src/components/windows/storybook/compareWindowStage.tsx`
  - primary write target: `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts`
  - primary write target: `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx`
  - primary write target: `packages/ui/src/components/windows/folder/folder.stories.tsx`
  - primary write target: `packages/ui/src/components/windows/browser/browser.stories.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`
  - read-only prerequisite: `plans/windows-ui-folder-browser-window-family/reference-captures/baseline-inventory.md`
- input:
  - 시나리오: public component contract가 안정된 뒤, maintainer가 canonical story state와 machine compare capture state를 exact same key로 고정하고 recipient uniqueness를 보장하려는 경우
  - exact canonical inventory:
    - `folder/desktop-default`
    - `folder/mobile-collapsed`
    - `browser/desktop-article`
    - `browser/desktop-not-found`
    - `browser/mobile-article`
    - `browser/mobile-not-found`
  - exact compare story recipient mapping:
    - `folder.stories.tsx`의 `CompareDesktopDefault` export -> `folder/desktop-default`
    - `folder.stories.tsx`의 `CompareMobileCollapsed` export -> `folder/mobile-collapsed`
    - `browser.stories.tsx`의 `CompareDesktopArticle` export -> `browser/desktop-article`
    - `browser.stories.tsx`의 `CompareDesktopNotFound` export -> `browser/desktop-not-found`
    - `browser.stories.tsx`의 `CompareMobileArticle` export -> `browser/mobile-article`
    - `browser.stories.tsx`의 `CompareMobileNotFound` export -> `browser/mobile-not-found`
  - supporting reference examples:
    - Folder dense item count나 long label sample
    - Browser long article scroll or alternate copy sample
- output:
  - 공개 계약:
    - canonical 6 state key가 fixture source, story source, compare capture source에서 같은 naming을 가진다.
    - `CompareRoot`는 `folder`, `browser` kind를 stable capture inventory로 인식한다.
    - source-tree test는 compare story별 exact one `[data-visual-root]`와 promised `kind/state` pair를 positive signal로 제공한다.
  - 내부 기본값:
    - compare wrapper는 viewport capture geometry만 소유하고 human-review decoration은 `windowReferenceStage`가 소유한다.
    - supporting reference는 canonical inventory에 들지 않는 보조 증거다.
  - 중요한 negative output:
    - route path나 article title이 state key를 직접 구성하지 않는다.
    - supporting sample이 새 canonical state로 승격되지 않는다.
    - 하나의 compare story가 두 개 이상의 `[data-visual-root]`를 렌더링하지 않는다.
    - compare helper가 public export로 새지 않는다.
- 제약:
  - state key naming은 kebab-case inventory로 고정한다.
  - story taxonomy는 component canonical state를 설명해야지 live route 자체를 public surface처럼 보이면 안 된다.
  - compare inventory test는 exact one recipient uniqueness와 attribute pair를 positive로 검증해야 한다.
- side effects:
  - Phase 5 visual compare artifact naming이 여기서 잠긴 key를 그대로 쓴다.
  - later materialize는 canonical 6 state와 compare recipient contract를 기반으로 bounded-surface coverage를 고를 수 있다.
- failure/validation: canonical inventory와 compare key naming이 story 제목, route copy, capture 파일명마다 달라지거나 compare story가 exact one recipient를 보장하지 못하면 visual compare와 materialize가 같은 winner surface를 잃으므로 blocker다.
- 작업:
  - compare stage helper를 추가한다.
  - `CompareRoot` kind inventory를 확장한다.
  - fixture source에 canonical vs supporting 분류를 명시한다.
  - standalone/compare stories를 exact same key로 정렬한다.
  - compare inventory recipient test를 추가한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui build-storybook`가 compare stories까지 포함해 성공해야 한다.
  - [ ] `pnpm --filter @windows/ui test -- src/components/windows/storybook/windowCompareInventory.test.tsx`가 성공해야 한다.
  - [ ] compare inventory test가 각 compare story의 exact one `[data-visual-root]`와 promised `kind/state` pair를 확인해야 한다.
