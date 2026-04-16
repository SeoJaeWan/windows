# Phase 2. leaf motion lifecycle 정리

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | hover/context leaf가 동일한 below→up / current→down motion grammar와 closing-only finalize 규칙으로 `SurfacePhase`를 소비한다. |
| 선행조건 | Phase 1의 runtime lifecycle과 dismiss contract가 stable해야 한다. |
| 완료 판단 | `phase`와 `onExitComplete`가 실제 motion/finalize owner로 동작하고, 두 leaf의 enter/exit 방향이 같은 helper와 tests로 고정된다. |
| 중단 조건 | motion을 구현하기 위해 새로운 public visual props나 generic animation surface를 다시 열어야 하면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarAttachedSurface/shared.ts` | 정리 | `data-state`/`data-phase` reserved marker 정책은 유지하되, `opening/open/closing`의 의미를 motion lifecycle 기준으로 다시 적는다. | shared contract만 읽어도 `onExitComplete`가 언제 호출되는지 이해할 수 있다. |
| `packages/ui/src/components/panels/taskbarAttachedSurface/motion.ts` | 추가 | hover/context가 공유하는 offset, duration, easing, root animation guard를 한 owner에 둔다. | duplicate class literal 없이 두 leaf가 같은 motion source를 import한다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/index.tsx` | 교체 | hover leaf는 root phase에 따라 enter/exit motion을 적용하고 closing root motion 종료 시에만 `onExitComplete`를 호출한다. | `opening`과 `closing`이 서로 다른 방향으로 보이고, child interaction이 finalize를 잘못 호출하지 않는다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.test.tsx` | 정리 | hover leaf test는 phase별 motion marker/class와 closing-only finalize를 owner로 삼는다. | opening/open/closing state와 finalize guard가 test에 드러난다. |
| `packages/ui/src/components/panels/taskbarContextMenu/index.tsx` | 교체 | context leaf는 roving focus와 fixed row topology를 유지하면서 같은 motion/finalize helper를 소비한다. | menu root가 hover와 같은 방향성으로 뜨고 닫히며, `onExitComplete`가 closing에서만 호출된다. |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.test.tsx` | 정리 | context leaf test는 phase motion과 nested row interaction no-op를 함께 고정한다. | keydown/row click과 root exit finalize가 섞이지 않는다는 점이 test에서 확인된다. |

### 완료 증거

- hover/context leaf가 같은 motion helper를 import한다.
- component tests가 `opening`과 `closing`을 서로 다른 방향성으로 검증한다.
- `onExitComplete`가 root closing motion에서만 호출되고 opening/open/nested event에서는 no-op임이 test로 보인다.

- owner_agent: `frontend-developer`
- 목적:
  - runtime이 제공한 lifecycle을 hover/context leaf가 실제 attached-surface motion과 종료 콜백으로 해석하게 만든다.
- boundary:
  - `packages/ui/src/components/panels/taskbarAttachedSurface/shared.ts`
  - `packages/ui/src/components/panels/taskbarAttachedSurface/motion.ts`
  - `packages/ui/src/components/panels/taskbarHoverPreview/index.tsx`
  - `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.test.tsx`
  - `packages/ui/src/components/panels/taskbarContextMenu/index.tsx`
  - `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.test.tsx`
- input:
  - Phase 1의 observable `SurfacePhase` lifecycle
  - 현재 `TaskbarHoverPreview`, `TaskbarContextMenu` leaf contract
  - read-only reference:
    - `C:\Users\USER\Desktop\dev\blog\src\app\globals.css`
    - `C:\Users\USER\Desktop\dev\blog\src\components\atoms\taskPanel\index.tsx`
  - 사용자 합의:
    - open은 taskbar 아래에서 위로 올라온다.
    - close는 현재 위치에서 taskbar 쪽 아래로 내려간다.
    - `onExitComplete`는 실제 closing 종료 시점에만 의미가 있다.
- output:
    - 공개 계약:
      - `TaskbarHoverPreview`와 `TaskbarContextMenu` root는 `phase="opening"`에서 below→up enter motion을, `phase="open"`에서 resting state를, `phase="closing"`에서 current→down exit motion을 가진다.
      - 두 leaf 모두 root exit motion이 끝났을 때만 `onExitComplete`를 호출한다.
      - `surfaceProps`와 package-owned `data-state`/`data-phase` merge policy는 유지한다.
    - 내부 기본값:
      - enter/exit duration과 easing은 blog reference의 `task-up` / `task-down` 의도와 같은 방향성으로 맞춘다.
      - motion helper는 root transform/opacity만 소유하고, row hover/focus transition은 기존 leaf 로컬 스타일에 남긴다.
      - reduced motion immediate finalize는 Phase 1 runtime이 소유하고, leaf는 그 경로를 다시 우회 구현하지 않는다.
    - 허용하지 않는 대안:
      - `data-phase`만 바꾸고 실제 motion/finalize는 여전히 no-op로 두는 방식
      - hover/context가 서로 다른 enter/exit 방향이나 종료 규칙을 갖는 방식
      - nested child animation/transition end가 root finalize를 대신 트리거하는 방식
- 선행조건:
  - Phase 1의 runtime lifecycle과 dismiss contract가 고정돼 있어야 한다.
- 제약:
  - 새 public prop은 열지 않는다.
  - roving focus, fixed row topology, hover card interaction은 기존 leaf owner를 유지한다.
- side effects:
  - Storybook behavior stories가 full motion으로 contract를 직접 볼 수 있게 된다.
  - component tests는 phase별 root 상태와 finalize guard를 canonical evidence로 삼는다.
- failure/validation:
  - open과 close가 같은 방향성이거나 scale/opacity-only motion으로 축소되면 실패다.
  - `onExitComplete`가 opening/open/nested event에서도 호출되면 실패다.
  - hover/context 중 하나라도 shared motion source를 우회하면 실패다.
- 작업:
  - shared motion helper를 추가해 attached-surface enter/exit grammar를 한 owner에 둔다.
  - hover/context leaf root에 phase별 motion과 closing-only finalize guard를 연결한다.
  - leaf tests를 phase-driven motion evidence와 finalize guard 중심으로 다시 쓴다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/panels/taskbarHoverPreview/taskbarHoverPreview.test.tsx src/components/panels/taskbarContextMenu/taskbarContextMenu.test.tsx`
  - [ ] hover/context component tests가 `opening`과 `closing`에서 서로 다른 root 상태를 검증한다.
  - [ ] component tests가 closing root event에서만 `onExitComplete`가 호출됨을 검증한다.
  - [ ] shared motion helper가 hover/context 둘 다에서 소비되는지 source import를 확인한다.

