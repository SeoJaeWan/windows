# Phase 1. leaf 계약 정리

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | hover preview와 taskbar context menu visual leaf를 interactive hook이 붙을 수 있는 stable public contract로 다시 닫는다. |
| 선행조건 | `none` |
| 완료 판단 | `SurfacePhase`, `onExitComplete`, top-level callback split, root-only `surfaceProps`, fixed row order, reserved marker winner rule이 source와 leaf test에 모두 드러난다. |
| 중단 조건 | root entry를 client-only로 오염시켜야 하거나, context menu가 row-level public prop getter 없이는 keyboard semantics를 유지할 수 없으면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarAttachedSurface/shared.ts` | 추가 | `SurfacePhase = "opening" | "open" | "closing"`와 taskbar attached surface reserved marker policy만 둔다. generic floating placement option은 열지 않는다. | hover/context leaf와 interactive hook이 같은 shared type을 import하고, taskbar-specific scope가 유지된다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/index.tsx` | 교체 | root `div` pass-through는 유지하되 package-owned `data-state`/`data-phase`가 우선한다. close affordance는 real button으로 바꾸고 `onSelectItem(id)`, `onCloseItem(id)`, `onExitComplete`를 연다. | leaf source에서 hover item select/close contract, `phase` marker, exit-complete bridge가 확인된다. |
| `packages/ui/src/components/panels/taskbarContextMenu/index.tsx` | 교체 | `appRows`와 fixed action domain을 분리한다. `appIdentifier`는 `id`를 갖고, top-level callback split과 root-only `surfaceProps`만 연다. canonical row order와 internal roving focus는 leaf가 소유한다. | generic `ContextPanel` wrapping 없이도 fixed menu leaf contract, keyboard semantics, reserved `data-*` marker owner가 source에 보인다. |
| `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuFixtures.ts` | 정리 | fixture는 `appIdentifier.id`와 taskbar fixed row topology를 literal하게 유지한다. harness-only state를 canonical compare inventory에 섞지 않는다. | pinned/unpinned fixture가 새 identifier shape와 same canonical state inventory를 따른다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.test.tsx` | 정리 | test는 visual-only rendering이 아니라 new controlled leaf contract를 owner로 삼는다. | `phase`, `onExitComplete`, select/close wiring과 real button affordance가 test로 고정된다. |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.test.tsx` | 정리 | test는 fixed row order, callback routing, internal keyboard semantics를 leaf owner 경계에서 닫는다. | `Esc`, `ArrowUp/Down`, `Home/End`, `Enter/Space`, fixed action routing, focus target 이동이 test로 보장된다. |

### 완료 증거

- hover preview source에 `onExitComplete`, `onSelectItem`, `onCloseItem`, `data-phase`가 같이 존재한다.
- context menu source에 `surfaceProps`, top-level select callback split, fixed row order, internal keyboard semantics가 공존한다.
- leaf unit test가 reserved marker와 callback/keyboard contract를 직접 확인한다.

- owner_agent: `frontend-developer`
- 목적: visual leaf 계약을 먼저 닫아 두고 이후 interactive runtime과 Storybook harness가 prop 이름이나 winner rule을 추측하지 않게 한다.
- boundary: `packages/ui/src/components/panels/taskbarHoverPreview/**`, `packages/ui/src/components/panels/taskbarContextMenu/**`, `packages/ui/src/components/panels/taskbarAttachedSurface/**`만 이번 phase write target이다. `packages/ui/src/components/panels/context/contextPanel/**`는 read-only reference로만 본다.
- input:
    - 현재 `TaskbarHoverPreview`, `TaskbarContextMenu` visual-only leaf source
    - `plans/windows-taskbar-04-attached-surfaces/**`의 original attached surface visual contract
    - `plans/windows-taskbar-12-context-panel-family/**`의 generic `ContextPanel` family 경계
    - 사용자 합의: `SurfacePhase`, `onExitComplete`, top-level callback split, fixed row order, root-only `surfaceProps`
- output:
    - 공개 계약:
        - `packages/ui/src/components/panels/taskbarAttachedSurface/shared.ts`에 `SurfacePhase`가 정의된다.
        - `TaskbarHoverPreview`는 `items`, root pass-through, `phase`, `onExitComplete`, `onSelectItem(id)`, `onCloseItem(id)`를 연다.
        - `TaskbarContextMenu`는 `appRows`, `taskbarPinState`, optional `appIdentifier { id, label, iconSrc }`, `phase`, `onExitComplete`, root-only `surfaceProps`, `onSelectAppRow(id)`, `onSelectAppIdentifier(id)`, `onPinTaskbar`, `onCloseAll`를 연다.
        - context menu row order는 `section header -> appRows -> divider -> optional appIdentifier -> pin action -> close all`로 고정된다.
    - 내부 기본값:
        - `data-state`, `data-phase`, `data-app-row`, `data-app-identifier`, `data-action-id`는 package-owned marker다.
        - root pass-through와 `surfaceProps`는 `className`/`style`/`ref`/`role`/`aria`/root handlers를 합성할 수 있지만 reserved marker owner를 바꾸지 못한다.
        - context menu는 internal roving focus와 button activation semantics를 자기 leaf 안에서 처리한다.
        - `Esc` 같은 close-producing key는 leaf가 해석하고, 실제 dismiss/focus restore finalize는 root `surfaceProps` handler와 interactive hook 쪽 close path가 이어받는다.
    - 허용하지 않는 대안:
        - public `onAnimationEnd`
        - generic `onAction(id)` 하나로 entry row와 fixed action을 합치는 형태
        - row-level prop getter 또는 render-row customisation
        - taskbar fixed menu를 `ContextPanel` canonical contract로 다시 접는 방향
- 선행조건: `none`
- 제약:
    - `@windows/ui` root entry는 server-safe visual-first 상태를 유지해야 한다.
    - `packages/ui/src/index.ts`에 `./interactive` import/re-export를 추가하지 않는다.
    - `TaskbarHoverPreview`는 여전히 placement/timer/store를 소유하지 않는다.
    - `TaskbarContextMenu`는 generic menu primitive가 아니라 taskbar-domain fixed leaf여야 한다.
- side effects:
    - 기존 story fixture와 component test가 새 prop shape와 reserved marker policy에 맞게 같이 정리된다.
- failure/validation:
    - `surfaceProps` 또는 root pass-through가 package-owned `data-state`/`data-phase`를 덮어쓸 수 있으면 이 phase는 실패다.
    - context menu keyboard semantics가 top-level public prop getter 없이는 성립하지 않으면 이 phase는 실패다.
    - `appRows`/`appIdentifier`와 fixed action domain이 하나의 ambiguous callback으로 다시 합쳐지면 이 phase는 실패다.
- 작업:
    - `shared.ts`에 taskbar attached surface 전용 공용 타입과 root marker ownership note를 만든다. 이 파일은 server-safe하며 interactive runtime과 visual leaf가 같이 쓴다.
    - `taskbarHoverPreview/index.tsx`에서 ghost close affordance를 actual button/handler로 바꾸고, caller-owned select/close callback과 `phase`/`onExitComplete`를 root marker와 함께 붙인다.
    - `taskbarContextMenu/index.tsx`에서 `appIdentifier.id`를 도입하고, app row/identifier/fixed action callback을 각각 top-level에서 받도록 나눈다.
    - 같은 파일에서 fixed row order를 literal DOM order로 유지하면서 internal roving focus, arrow/home/end 이동, enter/space activation, escape key 해석과 root close bridge를 leaf 내부에 둔다.
    - hover/context component test를 새 leaf contract 기준으로 다시 써서 reserved marker, row order, callback routing, keyboard semantics를 packages/ui unit 수준에서 고정한다.
- 검증:
    - [ ] `pnpm --filter @windows/ui exec vitest run src/components/panels/taskbarHoverPreview/taskbarHoverPreview.test.tsx src/components/panels/taskbarContextMenu/taskbarContextMenu.test.tsx`
    - [ ] hover preview test가 real close button, `phase`, `onExitComplete`, item callback routing을 직접 확인한다.
    - [ ] context menu test가 fixed row order, `appIdentifier.id`, `Esc`, `ArrowUp/Down`, `Home/End`, `Enter/Space`, fixed action callback routing을 직접 확인한다.
    - [ ] `packages/ui/src/index.ts`가 여전히 visual leaf export만 유지하고 `./interactive`를 root에 다시 노출하지 않는지 코드로 확인한다.
