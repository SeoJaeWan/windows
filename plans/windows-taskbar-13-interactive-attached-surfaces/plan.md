**Branch:** feat/windows-taskbar-13-interactive-attached-surfaces

> Worktree dir: `worktrees/windows-taskbar-13-interactive-attached-surfaces` (plan 폴더명과 동일)
> 이 문서는 controller가 `@windows/ui` 안에서 taskbar attached surface interactive runtime을 어디까지 닫는지, 어떤 파일이 바뀌는지, 무엇을 확인하면 되는지를 한 번에 볼 수 있도록 만든 실행 계획이다.
> 기술적인 입력/출력 계약, owner_agent, 세부 작업, 검증 체크리스트는 각 phase 상세 문서에서 닫는다.

# Windows Taskbar interactive attached surfaces 실행 계획

## 사전 합의

| 항목 | 합의 내용 | 적용 phase | 메모 |
| --- | --- | --- | --- |
| 범위 고정 | 이번 slice는 `packages/ui`까지만 닫고 `apps/web` 작업은 선행조건으로 열지 않는다. | 전체 | Storybook harness로 host 조합을 대신 검증한다. |
| 공개 경계 | `@windows/ui` root entry는 server-safe, visual-first entry로 유지하고 interactive runtime은 `@windows/ui/interactive` 서브패스에서만 연다. | Phase 1 / Phase 2 | `packages/ui/package.json`의 기존 `./interactive` export 예약을 실제 파일로 채운다. |
| lifecycle 상태 | public phase는 `SurfacePhase = "opening" | "open" | "closing"` 하나로 통일한다. | Phase 1 / Phase 2 | visual leaf와 hook이 같은 phase vocabulary를 쓴다. |
| lifecycle callback 이름 | public lifecycle completion callback은 `onAnimationEnd`가 아니라 의미 중심의 `onExitComplete`로 통일한다. | Phase 1 / Phase 2 | 내부 구현은 animation/transition whichever여도 public 이름은 유지한다. |
| motion 정책 | reduced motion은 브라우저 설정에서 internal로 읽고, override는 interactive hook option에만 둔다. visual public props에는 열지 않는다. | Phase 2 | Storybook/unit test만 hook option override를 쓴다. |
| placement 정책 | public placement API는 taskbar-specific first로 유지하고 generic clamp/helper는 internal only로 둔다. | Phase 2 | `side/align/flip` 같은 generic floating API는 열지 않는다. |
| HoverPreview contract | `TaskbarHoverPreview`는 controlled interactive surface가 되며 `onSelectItem(id)`, `onCloseItem(id)`, `phase`, `onExitComplete`를 연다. | Phase 1 / Phase 2 | hover timing, placement, open/close orchestration은 leaf가 아니라 hook이 소유한다. |
| ContextMenu contract | `TaskbarContextMenu`는 generic menu primitive가 아니라 taskbar 전용 fixed menu leaf로 두고, 내부에서 keyboard semantics를 소유한다. | Phase 1 | `ContextPanel` generic leaf ownership으로 접지 않는다. |
| ContextMenu keyboard 범위 | `Esc`, `ArrowUp/Down`, `Home/End`, `Enter/Space`, focus restore를 taskbar context menu leaf semantics로 닫는다. | Phase 1 / Phase 3 | focus restore는 story-local trigger ref까지 포함해 harness에서 확인한다. |
| ContextMenu topology | canonical order는 `section header -> appRows -> divider -> optional appIdentifier -> pin action -> close all`로 고정한다. | Phase 1 | fixed row order를 caller가 재배열하지 못하게 한다. |
| root wiring 정책 | `surfaceProps`는 root `div` 전용 wiring slot으로만 열고, row-level prop getter API는 public에서 다시 열지 않는다. | Phase 1 / Phase 2 | ref/style/role/aria/root handlers/data attrs만 root에서 받는다. |
| data/action ownership | `appRows`와 optional `appIdentifier`는 caller-owned data로 두고, `onSelectAppRow(id)` / `onSelectAppIdentifier(id)`는 top-level callback으로 분리한다. `appIdentifier`도 `id`를 가진다. | Phase 1 | item domain과 fixed-action domain을 분리한다. |
| fixed action ownership | `onPinTaskbar`와 `onCloseAll`은 taskbar fixed action callback으로 top-level에 유지한다. | Phase 1 | generic `onAction`으로 합치지 않는다. |
| validation 경계 | 이번 계획의 validation은 `packages/ui` unit test와 Storybook interactive harness story에 집중한다. | Phase 2 / Phase 3 | `plan-materialize`가 이후 source-tree test를 이 경계에서 파생할 수 있어야 한다. |

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. leaf 계약 정리 | hover preview와 taskbar context menu leaf의 public input, fixed topology, reserved marker winner rule을 interactive-ready contract로 다시 닫는다. | visual leaf만 읽어도 어떤 callback/phase/root wiring이 열리고 무엇이 여전히 leaf 밖인지 알 수 있는 상태가 된다. | `SurfacePhase`, `onExitComplete`, root-only wiring, fixed row order가 안정된 visual contract |
| Phase 2. interactive 훅 추가 | `@windows/ui/interactive`에 taskbar-specific hook과 private helper를 추가하고, hover/context runtime 동작을 `packages/ui` unit test로 고정한다. | `./interactive` export가 실제 hook entry가 되고 reduced motion, presence, hover intent, taskbar-specific placement가 package 내부에서 닫힌다. | Storybook이 바로 소비할 수 있는 hook return contract와 unit-covered runtime behavior |
| Phase 3. Storybook harness 검증 | hook과 visual leaf를 함께 쓰는 Storybook interactive harness를 추가해 hover/context 조합과 mutual exclusion demo를 `packages/ui` 안에서 검토 가능하게 만든다. | `apps/web` 없이도 packages/ui Storybook에서 pointer/keyboard 동작과 leaf composition을 확인할 수 있는 상태가 된다. | 이후 구현 handoff와 `plan-materialize`가 그대로 쓸 package-local review surface |

## 단계별 실행

### Phase 1. leaf 계약 정리

- 목적: taskbar attached surface visual leaf 두 개를 interactive runtime이 붙을 수 있는 최소 public contract로 다시 닫는다.
- 변경 내용: `TaskbarHoverPreview`는 real close/select callback과 `phase`/`onExitComplete`를 받는 controlled surface로 바뀐다. `TaskbarContextMenu`는 `appIdentifier.id`, top-level select callbacks, fixed action callbacks, root-only `surfaceProps`, internal keyboard semantics를 가진 taskbar fixed leaf로 닫힌다. 두 leaf는 공용 `SurfacePhase`와 reserved `data-*` marker winner rule을 공유한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarAttachedSurface/shared.ts` | 추가 | taskbar attached surface 공용 `SurfacePhase`와 reserved marker merge policy를 담는 server-safe shared contract가 생긴다. | visual leaf와 interactive hook이 같은 phase type을 import할 수 있고 generic floating surface type이 같이 열리지 않는다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/index.tsx` | 교체 | hover preview root pass-through는 유지하되 `phase`, `onExitComplete`, `onSelectItem`, `onCloseItem`를 여는 controlled surface로 바뀐다. | close affordance가 real button이 되고 `data-state`/`data-phase` winner rule이 source에 드러난다. |
| `packages/ui/src/components/panels/taskbarContextMenu/index.tsx` | 교체 | taskbar fixed menu leaf가 `surfaceProps`, top-level select callbacks, fixed action callbacks, internal keyboard/focus semantics를 가진 형태로 정리된다. | canonical row order와 `appIdentifier.id`, `data-app-row`/`data-action-id` marker owner가 source에서 확인된다. |
| `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuFixtures.ts` | 정리 | fixture가 새 `appIdentifier.id`와 fixed leaf callback shape를 설명할 수 있게 정리된다. | pinned/unpinned fixture가 새 prop contract와 같은 item domain 분리를 따른다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.test.tsx` | 정리 | hover preview leaf test가 new callback/phase/lifecycle contract와 button affordance를 고정한다. | phase marker와 item selection/close wiring이 test owner 안에 닫힌다. |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.test.tsx` | 정리 | context menu leaf test가 fixed topology, callback routing, internal keyboard semantics를 고정한다. | row order, `Esc`/arrow/home/end/enter/space, fixed action routing이 packages/ui unit test에서 확인된다. |

- 이전 상태: attached surface는 visual-only leaf이지만 실제 interactive runtime이 붙을 prop contract와 reserved marker policy가 닫혀 있지 않고, context menu keyboard semantics도 public API와 분리돼 있지 않다.
- 이후 상태: hover preview와 taskbar context menu는 visual leaf이면서도 interactive runtime이 붙을 수 있는 stable contract를 가지며, generic `ContextPanel`이나 row-prop getter를 다시 열지 않는다.
- 완료 조건: 두 leaf source와 test만 읽어도 `SurfacePhase`, `onExitComplete`, fixed action ownership, root-only wiring, internal keyboard semantics가 명시돼 있어야 한다.
- 관련 영역: `plans/windows-taskbar-04-attached-surfaces/**`, `plans/windows-taskbar-12-context-panel-family/**`, `packages/ui/src/components/panels/context/contextPanel/index.tsx`, `packages/ui/src/index.ts`
- 시작 조건: `none`
- 상세: `./phases/01-taskbar-leaf-contracts.md`

### Phase 2. interactive 훅 추가

- 목적: `@windows/ui/interactive`에 taskbar attached surface runtime을 실제 public hook entry로 만들고, packages/ui 단위에서 behavior를 검증 가능한 상태로 고정한다.
- 변경 내용: `src/interactive/index.ts`에 client-side hook entry를 만들고 `useTaskbarHoverPreview`, `useTaskbarContextPanel`을 추가한다. hover intent timer, taskbar-specific placement/clamp, reduced-motion-aware presence, root surface wiring merge는 internal helper로 유지하고 public export에서는 숨긴다. 관련 unit test는 hook 경계에서 timer, placement, lifecycle, dismissal behavior를 고정한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/index.ts` | 추가 | `@windows/ui/interactive` public entry가 생기고 taskbar-specific hook만 공개된다. | `package.json`의 기존 `./interactive` export가 실제 파일을 가리키고 root entry에는 client-only hook이 새지 않는다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview.ts` | 추가 | hover preview용 taskbar-specific hook이 enter/leave intent, phase, root props, lifecycle callback bridge를 소유한다. | default delay, motion override, `onExitComplete` bridge, trigger/surface wiring이 hook source에 드러난다. |
| `packages/ui/src/interactive/taskbar/useTaskbarContextPanel.ts` | 추가 | context panel용 taskbar-specific hook이 pointer-origin placement, root `surfaceProps`, dismiss/focus restore bridge를 소유한다. | taskbar-specific placement output과 root wiring contract가 generic floating API 없이 source에 드러난다. |
| `packages/ui/src/interactive/taskbar/internal/**` | 추가 | reduced motion, presence, hover intent, placement clamp 같은 genericizable helper가 internal private layer로 생긴다. | helper 파일이 `./interactive` public export에 나오지 않고 taskbar hook만 소비한다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview.test.tsx` | 추가 | hover hook test owner가 timer, reduced motion, phase finalize, dismiss path를 고정한다. | 1000ms open / 500ms leave 기본값, override, immediate finalize path가 test로 확인된다. |
| `packages/ui/src/interactive/taskbar/useTaskbarContextPanel.test.tsx` | 추가 | context hook test owner가 pointer placement, viewport clamp, close/focus restore path를 고정한다. | pointer-origin winner rule, reduced motion finalize, root wiring output이 unit test로 보인다. |

- 이전 상태: `packages/ui/package.json`은 `./interactive` export만 예약돼 있고, interactive runtime·presence·reduced motion·placement contract는 package source에 없다.
- 이후 상태: `@windows/ui/interactive`는 taskbar-specific hook entry를 실제로 제공하고, generic helper는 internal-only로 유지하면서 packages/ui unit test가 runtime behavior를 직접 닫는다.
- 완료 조건: `src/interactive/index.ts`와 hook test만 읽어도 public hook surface, internal helper 경계, reduced motion policy, taskbar-specific placement rule을 이해할 수 있어야 한다.
- 관련 영역: `packages/ui/package.json`, `packages/ui/vitest.config.ts`, `C:\Users\USER\Desktop\dev\blog`, `https://seojaewan.com`
- 시작 조건: Phase 1의 visual leaf contract와 `SurfacePhase`가 stable해야 한다.
- 상세: `./phases/02-interactive-runtime-hooks.md`

### Phase 3. Storybook harness 검증

- 목적: packages/ui Storybook 안에서 hook과 visual leaf를 함께 붙여 검토할 수 있는 interactive harness를 추가하고, app/web 없이도 현재 slice의 동작을 보이게 만든다.
- 변경 내용: hover preview와 context menu story에 interactive harness story를 추가하고, 필요한 story-local host/harness helper를 붙인다. 이 harness는 local trigger ref와 pointer origin을 써서 hover open/close, context open/keyboard close, hover/context mutual exclusion을 시연하되, compare inventory와 generic public API는 바꾸지 않는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx` | 정리 | 기존 canonical story는 유지하면서 hook composition을 보여 주는 interactive harness story가 추가된다. | hover preview interactive story가 packages/ui hook만으로 open/close/exit lifecycle을 보여 준다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewHarness.tsx` | 추가 | hover story-local host가 trigger ref, hover timing, local desktop stage를 한 곳에서 관리한다. | app/web 파일 없이 hover harness story가 재사용 가능하고 compare root는 건드리지 않는다. |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx` | 정리 | 기존 pinned/unpinned canonical story는 유지하면서 context keyboard harness story가 추가된다. | context menu interactive story가 root `surfaceProps`, keyboard close, fixed action routing을 보여 준다. |
| `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuHarness.tsx` | 추가 | context story-local host가 pointer origin, trigger ref, focus restore, mutual exclusion demo를 packages/ui 안에서 재현한다. | hover/context winner rule을 storybook에서 확인할 수 있고 public coordinator API를 새로 만들지 않는다. |
| `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuFixtures.ts` | 정리 | canonical fixture와 harness input이 같은 identifier/app row contract를 공유한다. | story source가 새 callback/id contract를 반복 정의하지 않는다. |

- 이전 상태: Storybook은 visual reference/compare state만 보여 주고, hook과 leaf의 실제 조합이나 mutual exclusion/focus restore는 app/web 없이 확인할 수 없다.
- 이후 상태: `packages/ui` Storybook에서 hover/context interactive harness story를 직접 열어 현재 slice의 runtime contract를 확인할 수 있고, compare inventory는 기존 canonical visual state만 유지한다.
- 완료 조건: Storybook source와 build 결과만으로 packages/ui 단에서 interactive harness가 열리고, canonical compare state는 `hover-single`, `hover-multi`, `context-pinned`, `context-unpinned` 그대로 유지된다는 점이 보인다.
- 관련 영역: `packages/ui/.storybook/main.ts`, `packages/ui/.storybook/preview.ts`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
- 시작 조건: Phase 2의 hook return contract와 unit test가 stable해야 한다.
- 상세: `./phases/03-storybook-interactive-harness.md`
