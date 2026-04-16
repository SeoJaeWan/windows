# Phase 1. hover dismiss 계약 보강

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | consumer가 public coordinator 없이 hover/context winner rule을 강제할 수 있도록 hover hook에 dismiss/reset contract를 추가한다. |
| 선행조건 | `none` |
| 완료 판단 | `useTaskbarHoverPreview`에 명시적 dismiss path와 fresh `leave -> enter` re-entry gate가 생기고, 관련 unit test가 canonical/negative output을 모두 닫는다. |
| 중단 조건 | 같은 요구를 만족시키려면 새 public coordinator hook, generic floating state machine, 또는 app-layer owner가 필요해지면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/index.ts` | 보강 | public contract는 최소 dismiss/reset surface만 연다. `useTaskbarContextPanel`이나 새 coordinator API를 직접 알면 안 된다. | hook result만으로 consumer가 hover dismiss와 re-entry gate를 제어할 수 있다. |
| `packages/ui/src/interactive/taskbar/internal/useHoverIntent/index.ts` | 보강 | suppression state는 internal-only다. dismiss 후 trigger `pointerleave`가 오기 전까지 새 open timer를 시작하지 않는 rule을 닫는다. | helper가 pending open/close cancel과 pointer reset gate를 함께 소유한다. |
| `packages/ui/src/interactive/taskbar/internal/useHoverIntent/useHoverIntent.test.tsx` | 보강 | helper test는 timer API가 아니라 winner/loser behavior를 owner로 삼는다. | dismiss 후 resting pointer no-op, pointerleave 후 re-enter만 reopen 가능 규칙이 test로 보인다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx` | 보강 | public hook test는 consumer 관점에서 `dismiss()`와 `getTriggerProps()` 조합 결과를 검증한다. | context open -> hover dismissed, hover close 후 pointer resting no-op, fresh intent reopen이 public contract로 고정된다. |

### 완료 증거

- `useTaskbarHoverPreview`가 explicit dismiss/reset contract를 노출한다.
- dismiss 직후에는 pointer가 trigger 위에 그대로 있어도 preview가 자동 복귀하지 않는다.
- trigger `pointerleave` 이후 새 `pointerenter`가 있을 때만 hover가 다시 열린다.

- owner_agent: `frontend-developer`
- 목적:
  - `useTaskbarHoverPreview`를 consumer-owned mutual exclusion의 stable owner boundary로 만든다.
- boundary:
  - `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/index.ts`
  - `packages/ui/src/interactive/taskbar/internal/useHoverIntent/index.ts`
  - `packages/ui/src/interactive/taskbar/internal/useHoverIntent/useHoverIntent.test.tsx`
  - `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx`
- input:
  - 현재 `useTaskbarHoverPreview`는 open/close timer와 `phase`만 노출하고 dismiss/reset contract가 없다.
  - 현재 `useTaskbarContextPanel`은 existing `close()`로 close-producing path를 이미 가진다.
  - 사용자 합의:
    - mutual exclusion owner는 consumer/composition이다.
    - `context open -> hover dismissed`
    - `hover winner -> context closes`
    - context가 hover를 내린 뒤 pointer resting만으로 hover가 다시 떠서는 안 된다.
- output:
    - 공개 계약:
      - `useTaskbarHoverPreview` result는 consumer가 직접 호출할 최소 dismiss/reset API를 가진다.
      - dismiss 호출은 pending open/close timer를 모두 무효화하고, 이미 열린 hover는 닫는 쪽으로 전환한다.
      - dismiss 이후에는 trigger에서 `pointerleave`가 먼저 와야 suppression이 해제되고, 그 다음 새 `pointerenter`가 와야 reopen 가능하다.
      - consumer는 existing `useTaskbarContextPanel.close()`와 위 dismiss contract를 조합해 winner rule을 구현한다.
    - 내부 기본값:
      - suppression state와 pointer-reset bookkeeping은 `internal/useHoverIntent`에 남는다.
      - 기존 default open/close delay와 reduced motion behavior는 유지한다.
    - 허용하지 않는 대안:
      - `useTaskbarHoverPreview`가 `useTaskbarContextPanel`을 import하거나 직접 close시키는 구조
      - `useTaskbarInteractionCoordinator` 같은 새 public coordinator API
      - dismiss 이후 `onExitComplete`만으로 suppression이 풀려 resting pointer가 즉시 reopen되는 구조
- 제약:
  - `@windows/ui/interactive` export inventory를 새 coordinator 이름으로 넓히지 않는다.
  - winner rule은 consumer-owned로 남고, hook은 자기 boundary의 최소 lifecycle contract만 확장한다.
- side effects:
  - internal hover-intent helper가 trigger reset policy를 더 많이 소유하게 된다.
  - later Storybook harness는 이 contract를 그대로 호출해 mutual exclusion을 보여 줄 수 있다.
- failure/validation:
  - dismiss 이후 resting pointer가 자동 reopen되면 실패다.
  - hover suppression을 구현하려고 context hook이나 app-layer state를 필수 선행조건으로 요구하면 실패다.
  - public contract가 generic overlay coordinator처럼 커지면 실패다.
- 작업:
  - `useTaskbarHoverPreview`에 minimal dismiss/reset API를 추가하고, consumer가 winner rule을 호출하는 boundary를 문서화한다.
  - `internal/useHoverIntent`에 suppression state와 pointer reset gate를 추가해 dismiss 이후 trigger leave 없이 reopen되지 않도록 한다.
  - helper test에서 pending open/close cancel과 suppression 해제 순서를 고정한다.
  - public hook test에서 `dismiss()` 호출, resting pointer no-op, fresh `leave -> enter` reopen path를 직접 검증한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/interactive/taskbar/internal/useHoverIntent/useHoverIntent.test.tsx src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx`
  - [ ] helper test가 dismiss 이후 trigger `pointerleave` 전에는 `onOpen`이 다시 호출되지 않음을 확인한다.
  - [ ] public hook test가 `context open -> hover dismissed`와 resting pointer no-op을 consumer 관점에서 확인한다.
  - [ ] `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/index.ts`를 열어 새 contract가 dismiss/reset 최소 surface에 머무르는지 확인한다.
