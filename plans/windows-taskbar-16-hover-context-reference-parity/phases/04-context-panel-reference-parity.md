# Phase 4. context panel parity 정리

> 이 문서는 context panel attached host가 hover 기준선과 비슷한 높이, reference row order, attached-host compare owner를 가지도록 만드는 phase 상세 계약이다.
> shared motion/close foundation은 Phase 2를 그대로 재사용하고, 여기서는 context 전용 vertical anchor와 row topology parity만 닫는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 핵심 목표 | context pinned open 상태를 hover와 비슷한 y 기준선에 붙인 attached-host compare owner로 고정하고, row order를 blog reference 순서와 일치시킨다. |
| 선행조건 | Phase 3까지의 hover key와 shared motion/close foundation이 고정돼 있어야 한다. |
| 완료 신호 | context compare story/test가 `taskbar-context-menu/attached-pinned` key를 고정하고, behavior host와 compare host가 같은 vertical anchor rule을 쓴다. |
| 중단 조건 | context y를 맞추려면 `useTaskbarContextPanel`의 public API를 다시 설계해야 하거나 Windows/Search context family를 같이 열어야 한다면 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuFixtures.ts` | 교체 | appRows와 appIdentifier order/text는 blog reference 순서를 따라야 하고, leaf canonical state는 계속 `context-pinned`, `context-unpinned` 두 개뿐이다. | fixture source가 reference row order를 그대로 보여 주고 canonical leaf state를 늘리지 않는다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanelCompareHarness.tsx` | 추가 | attached-host compare owner는 trigger icon과 context surface를 함께 그려야 하며, vertical anchor는 actual menu height 또는 같은 row-derived rule에서 파생돼야 한다. | compare harness가 approximate 고정 height 때문에 panel을 위로 띄우지 않는다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.stories.tsx` | 추가 | compare export 이름은 정확히 `CompareAttachedPinned`이고 `taskbar-context-menu/attached-pinned` key 하나만 소유한다. | story render가 정확히 하나의 `[data-visual-root][data-visual-kind="taskbar-context-menu"][data-visual-state="attached-pinned"]`를 노출한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.test.tsx` | 추가 | compare test는 key와 attached-host owner를 source tree test로 고정해야 한다. | test가 `[data-visual-root]`, `data-visual-kind`, `data-visual-state`를 직접 검증한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 조정 | context behavior host도 compare harness와 같은 vertical anchor rule과 close path를 써야 한다. | right-click open 상태가 hover 기준선과 비슷한 높이로 붙는다. |
| `packages/ui/src/components/panels/taskbarContextMenu/index.tsx` | 조정 | fixed row topology와 roving focus는 유지한 채 reference spacing/icon density를 맞춘다. | context leaf가 keyboard/a11y contract를 유지한 채 row/layout parity를 맞춘다. |

### 완료 증거

- context compare story/test가 `taskbar-context-menu/attached-pinned` key를 고정한다.
- compare host와 behavior host의 vertical anchor rule이 동일하다.
- fixture source와 leaf render가 같은 row order를 유지한다.

- owner_agent: `frontend-developer`
- 목적:
  - context pinned open의 세로 위치와 row order를 attached-host 기준으로 레퍼런스에 맞춘다.
- boundary:
  - `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuFixtures.ts`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanelCompareHarness.tsx`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.stories.tsx`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.test.tsx`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx`
  - `packages/ui/src/components/panels/taskbarContextMenu/index.tsx`
  - read-only no-regression context: `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/index.ts`
  - read-only reference: `C:/Users/USER/Desktop/dev/blog/src/hooks/useShowTaskPanel/index.tsx`
  - read-only reference: `C:/Users/USER/Desktop/dev/blog/src/components/molecules/taskLeftClickPanel/index.tsx`
- input:
  - 시나리오 1: active taskbar icon을 right-click하면 pinned context panel이 열린다.
  - 시나리오 2: context surface는 trigger 중심 x를 유지하고, hover와 비슷한 y 기준선에 붙어야 한다.
  - 시나리오 3: row order는 header → appRows → divider → appIdentifier → pin → close-all을 유지하되 fixture source가 reference text/order를 고정해야 한다.
  - 시나리오 4: enter motion은 Phase 2 below→up path를 그대로 재사용한다.
- output:
  - 공개 계약:
    - attached-host compare recipient는 `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.stories.tsx#CompareAttachedPinned`이고 compare key는 `taskbar-context-menu/attached-pinned`다.
    - context host x는 trigger 중심 기준을 유지하고, y는 actual menu height 또는 동일 row-derived rule로 계산된다.
    - context row render order는 fixed topology를 유지하며 fixture source가 reference order를 고정한다.
    - context close-all, Escape, outside dismiss는 Phase 2 visible close path를 그대로 재사용한다.
  - 기본값:
    - leaf canonical state는 계속 `context-pinned`, `context-unpinned`다.
    - static compare는 pinned open rested state만 담당하고 exit frame을 새 compare state로 늘리지 않는다.
  - 중요 negative output:
    - approximate 고정 `panelHeight` 추정만으로 y를 결정하는 host를 남기지 않는다.
    - `useTaskbarContextPanel` public API를 다시 설계하지 않는다.
    - Windows/Search context family key를 이 phase로 끌어오지 않는다.
- 시작조건:
  - Phase 3까지의 hover attached-host key와 shared motion/close foundation이 고정돼 있어야 한다.
- 제약:
  - keyboard roving focus, Escape bridge, fixed row topology는 no-regression으로 유지한다.
  - attached-host compare key와 leaf canonical state를 혼동하지 않는다.
- side effects:
  - Phase 5 compare report가 leaf-only `taskbar-context-menu/context-pinned` story 대신 attached-host owner를 current provenance로 사용할 수 있다.
- failure/validation:
  - compare host와 behavior host가 서로 다른 y rule을 쓰면 later compare와 runtime evidence가 같은 acceptance를 말하지 못하므로 실패다.
  - fixture source가 reference row order를 고정하지 않으면 row order parity를 later compare가 다시 추측해야 하므로 실패다.
- 작업:
  - context fixture source를 reference row order로 정리한다.
  - icon + context surface를 함께 렌더링하는 compare harness/story/test를 추가한다.
  - behavior host의 y rule을 compare harness와 같은 vocabulary로 맞춘다.
  - 필요하면 leaf spacing/icon density를 같은 boundary 안에서 reference로 맞춘다.
- 검증
  - [ ] `pnpm --filter @windows/ui exec vitest run src/interactive/taskbar/storybook/taskbarContextPanel.compare.test.tsx src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx src/components/panels/taskbarContextMenu/taskbarContextMenu.test.tsx`
  - [ ] `pnpm --filter @windows/ui build-storybook`
  - [ ] context compare story가 `[data-visual-root][data-visual-kind="taskbar-context-menu"][data-visual-state="attached-pinned"]`를 정확히 하나만 노출한다.
  - [ ] behavior host와 compare harness가 같은 vertical anchor vocabulary를 쓰고 approximate 고정 height만으로 y를 결정하지 않는다.
