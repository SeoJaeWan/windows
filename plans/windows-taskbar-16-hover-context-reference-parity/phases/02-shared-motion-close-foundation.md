# Phase 2. 공통 motion/close foundation 정리

> 이 문서는 hover/context attached surface가 실제 CSS motion source와 visible close path를 공유하게 만드는 phase 상세 계약이다.
> hook-level keyboard/a11y contract는 read-only no-regression으로 두고, close가 안 보이던 원인을 repo-local motion source와 story host wiring에서 닫는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 핵심 목표 | `animate-task-up/down`의 실제 CSS owner를 repo 안에 두고, hover close affordance와 context close action이 `closing`을 보인 뒤 finalize되는 같은 경로를 타게 만든다. |
| 선행조건 | Phase 1에서 canonical baseline key와 supporting observation 분류가 고정돼 있어야 한다. |
| 완료 신호 | `theme.css`가 motion token/keyframe을 정의하고, runtime-proof test가 explicit close·Escape·outside dismiss에서 `closing` 또는 unmount를 직접 증명한다. |
| 중단 조건 | close를 살리려면 hook keyboard/focus restore contract를 다시 열거나 generic placement API를 추가해야 한다는 결론이 나오면 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/tailwind-config/src/theme.css` | 교체 | `animate-task-up`, `animate-task-down`, `@keyframes task-up`, `@keyframes task-down`는 repo-local owner여야 하고 blog reference 방향/tempo를 따른다. | source만 읽어도 open/close motion token과 keyframe이 존재한다. |
| `packages/ui/src/components/panels/taskbarAttachedSurface/motion.ts` | 교체 | helper class name과 closing root animationend guard는 `theme.css`와 1:1로 맞아야 한다. | class literal, direction comment, closing guard가 CSS source와 드리프트하지 않는다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 교체 | hover close affordance는 host-owned `onCloseItem` side effect 다음 `dismiss()`를 호출해야 하고, context close-all/Escape/outside dismiss는 같은 `close()` path를 써야 한다. | story host에 no-op close callback이 남지 않고 visible close path가 하나로 수렴한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx` | 교체 | runtime-proof는 explicit close, Escape, outside dismiss, visible closing을 rendered story 기준으로 검증해야 한다. | source inspection이 아니라 actual story render로 close path를 증명한다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.test.tsx` | 정리 | hover leaf는 root `animationend`에서만 `onExitComplete`를 호출하고 새 public prop을 열지 않는다. | hover leaf test가 motion helper와 closing guard를 계속 고정한다. |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.test.tsx` | 정리 | context leaf도 root `animationend`와 기존 keyboard row topology를 유지한 채 same motion helper를 쓴다. | context leaf test가 closing guard와 row contract를 함께 고정한다. |

### 완료 증거

- `theme.css`에 attached-surface motion token과 keyframe이 정의돼 있다.
- runtime-proof test가 hover close affordance, context close-all, Escape, outside dismiss를 눌렀을 때 `closing` 또는 unmount를 직접 검증한다.
- leaf tests가 root animationend guard를 유지해 close path가 child event에 흔들리지 않음을 보여 준다.

- owner_agent: `frontend-developer`
- 목적:
  - close가 안 보이고 exit를 확인하기 어려운 상태를 shared motion source와 story host wiring에서 닫는다.
- boundary:
  - `packages/tailwind-config/src/theme.css`
  - `packages/ui/src/components/panels/taskbarAttachedSurface/motion.ts`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx`
  - `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.test.tsx`
  - `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.test.tsx`
  - read-only no-regression context: `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/index.ts`
  - read-only no-regression context: `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/index.ts`
  - read-only reference: `C:/Users/USER/Desktop/dev/blog/src/app/globals.css`
- input:
  - 시나리오 1: hover preview가 열린 상태에서 close affordance를 누르면 item side effect와 surface dismiss가 같은 visible close path를 타야 한다.
  - 시나리오 2: context panel이 열린 상태에서 close-all, Escape, outside dismiss가 모두 같은 visible close path를 타야 한다.
  - 시나리오 3: `phase="opening"`과 `phase="closing"`은 실제 CSS animation과 root `animationend`를 가져야 한다.
- output:
  - 공개 계약:
    - `phase="opening"`은 실제 `animate-task-up`으로, `phase="closing"`은 실제 `animate-task-down`으로 연결된다.
    - hover close affordance click은 host-owned item callback 이후 `dismiss()`를 호출해 `closing`을 보이게 한다.
    - context close-all, Escape, outside dismiss는 동일한 `close()`→`closing`→finalize path를 공유한다.
    - reduced motion은 immediate finalize fallback으로만 남고 full motion 경로를 대체하지 않는다.
  - 기본값:
    - hook keyboard/focus restore contract는 이 phase에서 다시 설계하지 않는다.
    - Storybook host는 close path를 보이기 위해 reduced motion override를 쓰지 않는다.
  - 중요 negative output:
    - generic placement API를 새로 열지 않는다.
    - hover/context close를 story-only no-op callback으로 두지 않는다.
    - Windows/Search panel parity를 이 phase로 끌어오지 않는다.
- 시작조건:
  - Phase 1의 canonical key와 supporting observation 분류가 고정돼 있어야 한다.
- 제약:
  - hook-level keyboard/a11y behavior는 no-regression 경계로만 둔다.
  - close visibility fix를 위해 leaf public prop shape를 늘리지 않는다.
- side effects:
  - Phase 3~4 compare owner와 Phase 5 diff report가 실제 CSS motion이 존재하는 상태를 전제로 움직일 수 있다.
- failure/validation:
  - class name만 있고 `theme.css`에 실제 keyframe/token이 없으면 실패다.
  - hover close affordance가 item callback만 호출하고 surface dismiss를 시작하지 않으면 실패다.
  - context close-all, Escape, outside dismiss가 서로 다른 finalize path를 가지면 실패다.
- 작업:
  - `theme.css`에 attached-surface motion token/keyframe을 추가하거나 정리한다.
  - `motion.ts`를 CSS source와 동일한 class/direction/closing guard로 맞춘다.
  - behavior harness에서 hover/context explicit close action을 같은 visible close path로 정리한다.
  - runtime-proof test와 leaf tests를 close visibility 기준으로 갱신한다.
- 검증
  - [ ] `pnpm --filter @windows/ui exec vitest run src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx src/components/panels/taskbarHoverPreview/taskbarHoverPreview.test.tsx src/components/panels/taskbarContextMenu/taskbarContextMenu.test.tsx`
  - [ ] `pnpm --filter @windows/ui build-storybook`
  - [ ] `theme.css`에 `animate-task-up`, `animate-task-down`, `@keyframes task-up`, `@keyframes task-down`가 모두 존재한다.
  - [ ] runtime-proof test가 hover close affordance와 context close-all을 눌렀을 때 `closing` 또는 unmount를 직접 검증한다.
