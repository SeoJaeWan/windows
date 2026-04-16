# Phase 3. visual inventory 정리

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | component story에서 behavior harness를 제거하고 canonical visual/reference/compare inventory만 남긴다. |
| 선행조건 | Phase 2의 `Interactive/Taskbar/*` stories가 정상 discovery되어야 한다. |
| 완료 판단 | `taskbarHoverPreview.stories.tsx`, `taskbarContextMenu.stories.tsx`는 visual stories만 남고, old component-local harness files는 삭제된다. |
| 중단 조건 | behavior harness 제거 후에도 동일 검토 surface를 유지하려면 component story taxonomy나 compare kind/state를 다시 바꿔야 하면 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx` | 정리 | canonical owner는 visual/reference/compare story다. behavior export를 남기면 안 된다. | `InteractiveHarness` export와 관련 import가 사라지고 `HoverSingle`, `HoverMulti`, compare stories만 남는다. |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx` | 정리 | canonical owner는 visual/reference/compare story다. behavior export를 남기면 안 된다. | `InteractiveHarness` export와 관련 import가 사라지고 pinned/unpinned reference/compare stories만 남는다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewHarness.tsx` | 삭제 | behavior harness owner는 Phase 2의 `interactive/taskbar/storybook`이다. component folder에 duplicate owner를 남기면 안 된다. | old hover harness file이 삭제되거나 더 이상 referenced되지 않는다. |
| `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuHarness.tsx` | 삭제 | context/mutual exclusion harness owner는 Phase 2의 behavior story files다. component folder에 duplicate owner를 남기면 안 된다. | old context harness file이 삭제되거나 더 이상 referenced되지 않는다. |

### 완료 증거

- component story source에서 behavior-only import/export가 사라진다.
- `Interactive/Taskbar/*` stories는 살아 있고, `Taskbar/Compose/HoverPreview`와 `Taskbar/Compose/ContextMenu`는 visual stories만 남는다.
- compare kind/state inventory는 이전과 같은 이름을 유지한다.

- owner_agent: `frontend-developer`
- 목적:
  - Storybook taxonomy와 파일 경계를 사용자 합의대로 정리해 component catalog와 runtime verification가 다시 섞이지 않게 만든다.
- boundary:
  - `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx`
  - `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx`
  - `packages/ui/src/components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewHarness.tsx`
  - `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuHarness.tsx`
- input:
  - Phase 2에서 `Interactive/Taskbar/*` behavior stories가 이미 존재한다.
  - 현재 component story 파일은 interactive harness import/export를 포함한다.
  - 사용자 합의:
    - component stories는 canonical visual/reference/compare inventory로 남긴다.
    - behavior stories는 `interactive/taskbar/storybook`으로 분리한다.
- output:
    - 공개 계약:
      - `Taskbar/Compose/HoverPreview`는 visual/reference/compare story만 가진다.
      - `Taskbar/Compose/ContextMenu`는 visual/reference/compare story만 가진다.
      - `hover-single`, `hover-multi`, `context-pinned`, `context-unpinned` compare inventory는 그대로 유지된다.
    - 내부 기본값:
      - component-local harness files는 삭제하고, behavior verification는 Phase 2 story files만 owner가 된다.
      - fixture modules는 canonical visual state owner로 남고 삭제 대상이 아니다.
    - 허용하지 않는 대안:
      - `InteractiveHarness` export를 component story에 유지한 채 titles만 바꾸는 방식
      - old harness file을 dead file로 남겨 두는 방식
      - compare kind/state rename이나 visual state 축소를 cleanup 명목으로 같이 처리하는 방식
- 제약:
  - visual/reference/compare story names와 compare kind/state는 바꾸지 않는다.
  - component folders는 behavior verification owner를 더 이상 가지지 않는다.
- side effects:
  - component story import graph가 단순화되고, behavior verification dependency는 interactive/taskbar/storybook 쪽으로 이동한다.
- failure/validation:
  - component story source에 `InteractiveHarness`가 남아 있으면 실패다.
  - cleanup 때문에 compare inventory나 canonical visual state가 줄어들면 실패다.
  - old harness file이 삭제되지 않고 reachable reference로 남아 있으면 실패다.
- 작업:
  - hover/context component story 파일에서 behavior harness import와 `InteractiveHarness` export를 제거한다.
  - old component-local harness files를 삭제하고, behavior verification owner가 Phase 2 files임을 코드 구조로 고정한다.
  - visual/reference/compare story는 기존 fixture data와 compare state를 그대로 유지하는지 확인한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui build-storybook`
  - [ ] `rg -n 'InteractiveHarness|taskbarHoverPreviewHarness|taskbarContextMenuHarness' packages/ui/src/components/panels/taskbarHoverPreview packages/ui/src/components/panels/taskbarContextMenu` 결과가 component story cleanup 이후 비어 있거나 삭제된 file path만 가리킨다.
  - [ ] `rg -n 'hover-single|hover-multi|context-pinned|context-unpinned' packages/ui/src/components/panels/taskbarHoverPreview packages/ui/src/components/panels/taskbarContextMenu` 결과가 기존 compare inventory를 그대로 보여 준다.
  - [ ] `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx`와 `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx`를 열어 visual/reference/compare stories만 남았는지 확인한다.
