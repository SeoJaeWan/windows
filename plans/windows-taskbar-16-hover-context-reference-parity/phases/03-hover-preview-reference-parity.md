# Phase 3. hover preview parity 정리

> 이 문서는 hover preview attached host가 아이콘 중심선과 reference order를 정확히 소유하도록 만드는 phase 상세 계약이다.
> motion/close foundation은 Phase 2를 그대로 재사용하고, 여기서는 hover 전용 host geometry와 compare owner만 닫는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 핵심 목표 | hover multi open 상태를 trigger icon 중심에 붙인 attached-host compare owner로 고정하고, fixture order를 blog reference 순서와 일치시킨다. |
| 선행조건 | Phase 2의 shared motion/close foundation이 살아 있어야 한다. |
| 완료 신호 | hover compare story/test가 `taskbar-hover-preview/attached-multi` key를 고정하고, host left가 `50%`가 아니라 trigger 중심과 실제 open width에서 파생된다. |
| 중단 조건 | hover centering을 맞추려면 `useTaskbarHoverPreview`에 generic placement API를 추가해야 한다는 결론이 나오면 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewFixtures.ts` | 교체 | `HOVER_MULTI` item 순서와 label은 blog reference order를 그대로 따라야 한다. leaf canonical state는 여전히 `hover-single`, `hover-multi` 두 개뿐이다. | fixture source가 reference order를 그대로 보여 주고 canonical leaf state를 늘리지 않는다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreviewCompareHarness.tsx` | 추가 | attached-host compare owner는 trigger icon과 hover surface를 함께 그려야 하며, wrapper left는 actual open width 또는 같은 width rule에서 파생돼야 한다. | compare harness에 taskbar-center `left: 50%` 보정이 남지 않는다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.stories.tsx` | 추가 | compare export 이름은 정확히 `CompareAttachedMulti`이고 `taskbar-hover-preview/attached-multi` key 하나만 소유한다. label/backdrop 장식은 compare root 밖에 두지 않는다. | story render가 정확히 하나의 `[data-visual-root][data-visual-kind="taskbar-hover-preview"][data-visual-state="attached-multi"]`를 노출한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.test.tsx` | 추가 | compare test는 key와 attached-host owner를 source tree test로 고정해야 한다. | test가 `[data-visual-root]`, `data-visual-kind`, `data-visual-state`를 직접 검증한다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/index.tsx` | 조정 | leaf는 caller-owned `items` order와 `onCloseItem` contract를 유지한 채 reference density/layout을 맞춘다. | 새 public prop 없이 reference density/layout만 조정된다. |

### 완료 증거

- hover compare story/test가 `taskbar-hover-preview/attached-multi` key를 고정한다.
- compare harness와 behavior host에서 `left: 50%` taskbar-center 보정이 사라진다.
- fixture source와 leaf render가 같은 item order를 유지한다.

- owner_agent: `frontend-developer`
- 목적:
  - hover multi open의 위치와 content order를 attached-host 기준으로 레퍼런스에 맞춘다.
- boundary:
  - `packages/ui/src/components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewFixtures.ts`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreviewCompareHarness.tsx`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.stories.tsx`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.test.tsx`
  - `packages/ui/src/components/panels/taskbarHoverPreview/index.tsx`
  - read-only host context: `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx`
  - read-only reference: `C:/Users/USER/Desktop/dev/blog/src/components/atoms/taskIconButton/hooks/usePanel/index.tsx`
  - read-only reference: `C:/Users/USER/Desktop/dev/blog/src/components/molecules/taskHoverPanel/index.tsx`
- input:
  - 시나리오 1: active taskbar icon 위에서 multi hover preview가 열린다.
  - 시나리오 2: hover surface는 trigger icon 중심 x를 따라야 하고, item card 순서는 reference fixture order를 그대로 따라야 한다.
  - 시나리오 3: hover close visibility는 Phase 2 close path를 재사용하되 static compare state는 open rested state 하나만 쓴다.
- output:
  - 공개 계약:
    - attached-host compare recipient는 `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.stories.tsx#CompareAttachedMulti`이고 compare key는 `taskbar-hover-preview/attached-multi`다.
    - hover host left는 trigger center와 actual open width 또는 동일 width rule에서 파생된다.
    - hover card render order는 caller-owned `items` order 그대로이며, compare fixture source가 그 순서를 고정한다.
    - hover close affordance behavior는 Phase 2 host close path를 그대로 재사용한다.
  - 기본값:
    - leaf canonical state는 계속 `hover-single`, `hover-multi`다.
    - static compare는 open rested state만 담당하고 close animation frame을 새 compare state로 늘리지 않는다.
  - 중요 negative output:
    - `left: 50%` taskbar-center 보정을 다시 도입하지 않는다.
    - `useTaskbarHoverPreview`에 generic placement API를 추가하지 않는다.
    - close visibility를 위해 compare key를 새로 늘리지 않는다.
- 시작조건:
  - Phase 2의 shared motion/close foundation이 구현 가능한 상태여야 한다.
- 제약:
  - hook keyboard/a11y contract는 reopen하지 않는다.
  - attached-host compare key와 leaf canonical state를 혼동하지 않는다.
- side effects:
  - Phase 5 compare report가 hover leaf-only story 대신 attached-host owner를 current provenance로 사용할 수 있다.
- failure/validation:
  - hover compare owner가 trigger icon을 포함하지 않거나 actual width와 무관한 x를 쓰면 실패다.
  - fixture source가 reference order를 고정하지 않으면 later compare와 materialize가 sibling order를 다시 추측해야 하므로 실패다.
- 작업:
  - hover fixture source를 reference order로 정리한다.
  - icon + hover surface를 함께 렌더링하는 compare harness/story/test를 추가한다.
  - 필요하면 hover leaf density/layout을 same boundary 안에서 reference에 맞춘다.
- 검증
  - [ ] `pnpm --filter @windows/ui exec vitest run src/interactive/taskbar/storybook/taskbarHoverPreview.compare.test.tsx src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx src/components/panels/taskbarHoverPreview/taskbarHoverPreview.test.tsx`
  - [ ] `pnpm --filter @windows/ui build-storybook`
  - [ ] hover compare story가 `[data-visual-root][data-visual-kind="taskbar-hover-preview"][data-visual-state="attached-multi"]`를 정확히 하나만 노출한다.
  - [ ] hover compare harness와 behavior host 어디에도 `left: 50%` 보정이 남지 않는다.
