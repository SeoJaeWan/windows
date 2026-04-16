**Branch:** feat/windows-taskbar-14-interactive-behavior-storybook

> Worktree dir: `worktrees/windows-taskbar-14-interactive-behavior-storybook` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 먼저 `사전 합의`와 `전체 작업 지도`에서 이번 변경의 기준과 흐름을 보고, 아래 phase 카드에서 어떤 파일이 어떻게 바뀌는지와 무엇을 확인해야 하는지를 본다.
> 기술적인 입력/출력 계약, owner_agent, 세부 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows Taskbar interactive behavior Storybook 실행 계획

## 사전 합의

| 항목 | 합의 내용 | 적용 phase | 메모 |
| --- | --- | --- | --- |
| 새 plan 경계 | 이번 작업은 `windows-taskbar-13-interactive-attached-surfaces`를 수정하지 않고, 새 slug `windows-taskbar-14-interactive-behavior-storybook` 아래에서 별도 실행 계획으로 닫는다. | 전체 | 기존 plan들은 read-only 선행 참고다. |
| behavior Storybook 위치 | runtime/기능 검증용 Storybook은 `packages/ui/src/interactive/taskbar/storybook/**` 아래에 두고, component story 폴더로 다시 되돌리지 않는다. | Phase 2 / Phase 3 | Storybook을 카탈로그가 아니라 기능 검증 harness로 해석한다. |
| visual inventory 유지 | `packages/ui/src/components/**` 아래의 visual/reference/compare stories와 compare `kind/state` inventory는 canonical visual surface로 유지하고, behavior stories를 여기에 섞지 않는다. | Phase 2 / Phase 3 | 기존 compare state 추가나 재분류는 이번 slice 범위 밖이다. |
| mutual exclusion owner | `context open -> hover dismissed`, `hover winner -> context closes` 규칙은 consumer/composition이 소유하고, 별도 public coordinator API는 만들지 않는다. | Phase 1 / Phase 2 | Storybook harness도 같은 owner 규칙을 따른다. |
| 최소 hook 계약 | consumer가 위 winner rule을 강제할 수 있도록 `useTaskbarHoverPreview` 쪽에 최소 dismiss/reset 계약만 보강하고, `useTaskbarContextPanel`의 기존 `close()` 소유 범위는 유지한다. | Phase 1 | `@windows/ui/interactive` export를 새 coordinator surface로 넓히지 않는다. |
| hover 재진입 정책 | context가 hover를 내린 뒤 pointer가 trigger 위에 그대로 남아 있어도 hover는 즉시 복귀하지 않고, fresh `leave -> enter` intent가 다시 필요하다. | Phase 1 / Phase 2 | negative output을 테스트와 story에서 같이 고정한다. |
| 범위 고정 | 이번 slice는 현재 `interactive/taskbar`에 이미 존재하는 hover/context hook pair와 해당 behavior Storybook relocation만 다루고, Windows/Search용 새 headless hook이나 story-only state orchestration은 만들지 않는다. | 전체 | Windows/Search compose stories는 read-only reference로 남긴다. |

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. hover dismiss 계약 보강 | consumer-owned mutual exclusion을 실제로 구현할 수 있도록 hover hook과 내부 hover-intent helper에 최소 dismiss/reset contract를 추가한다. | `useTaskbarHoverPreview`만으로 context open 시 hover dismiss와 fresh re-entry 정책을 강제할 수 있는 상태가 된다. | behavior Storybook이 그대로 소비할 hover dismiss API와 unit-covered winner rule |
| Phase 2. behavior Storybook 분리 | `interactive/taskbar/storybook` 아래에 behavior 전용 stories와 harness를 추가하고 Storybook discovery를 그 경계까지 확장한다. | `Interactive/Taskbar/*` branch에서 hook/runtime behavior를 별도 검토할 수 있고, canonical visual inventory는 그대로 참조만 받는 상태가 된다. | component story cleanup이 의존할 새로운 behavior story location과 titles |
| Phase 3. visual inventory 정리 | component story에서 behavior harness를 제거하고, 기존 visual/reference/compare stories를 canonical visual inventory로 다시 고정한다. | `components/**`는 visual catalog만, `interactive/taskbar/storybook/**`는 runtime verification만 맡는 상태가 된다. | 이후 cold review와 user gate가 그대로 검토할 최종 Storybook 경계 |

## 단계별 실행

### Phase 1. hover dismiss 계약 보강

- 목적: consumer/composition이 public coordinator 없이 hover/context winner rule을 강제할 수 있도록 최소 hook contract를 닫는다.
- 변경 내용: `useTaskbarHoverPreview`는 명시적 dismiss path와 pointer-reset gate를 노출하고, 내부 `useHoverIntent`는 dismiss 이후 fresh `leave -> enter` 없이는 다시 열리지 않는 suppression 규칙을 지원한다. `useTaskbarContextPanel`은 기존 `close()` owner를 유지하며 read-only 인접 경계로 남는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/index.ts` | 보강 | hover hook이 consumer 호출용 `dismiss()` 또는 동등한 최소 reset contract를 가진다. | context open 시 hover를 명시적으로 내릴 수 있고, pointer 정지 상태만으로 재오픈되지 않는 규칙이 source에 드러난다. |
| `packages/ui/src/interactive/taskbar/internal/useHoverIntent/index.ts` | 보강 | internal helper가 dismiss 이후 pointer reset이 오기 전까지 open을 막는 suppression state를 지원한다. | hover reopen winner rule이 helper 경계에서 stable하게 재사용된다. |
| `packages/ui/src/interactive/taskbar/internal/useHoverIntent/useHoverIntent.test.tsx` | 보강 | suppression, pending timer cancel, pointer reset 조건이 helper test로 고정된다. | dismiss 후 leave 없이 재open되지 않는 negative output이 test로 확인된다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx` | 보강 | public hook test가 `dismiss()`와 fresh hover intent 재요구 정책을 직접 검증한다. | context open -> hover dismissed, context close 후 pointer resting no-op이 hook test에서 보인다. |

- 이전 상태: hover/context mutual exclusion은 story-local render guard와 natural pointer-leave에 기대고 있어 consumer가 강제할 안정된 public contract가 없다.
- 이후 상태: consumer는 `useTaskbarHoverPreview`의 최소 dismiss contract와 `useTaskbarContextPanel.close()`만으로 winner rule을 구현할 수 있고, hover 재진입 정책도 hook boundary에서 닫힌다.
- 완료 조건: hook source와 unit test만 읽어도 `context open -> hover dismissed`, `hover winner -> context closes`, `context close 후 resting pointer no-op` 규칙이 public coordinator 없이 성립해야 한다.
- 관련 영역: `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/index.ts`, `plans/windows-taskbar-13-interactive-attached-surfaces/phases/02-interactive-runtime-hooks.md`, `plans/windows-taskbar-13-interactive-attached-surfaces/phases/03-storybook-interactive-harness.md`
- 시작 조건: `none`
- 상세: `./phases/01-hover-dismiss-contract.md`

### Phase 2. behavior Storybook 분리

- 목적: `interactive/taskbar/storybook` 아래에 behavior 전용 Storybook branch를 만들고, hook/runtime verification을 canonical visual catalog와 물리적으로 분리한다.
- 변경 내용: Storybook discovery는 `packages/ui/src/interactive/taskbar/storybook/**/*.stories.tsx`를 포함하고, new behavior stories는 `Interactive/Taskbar/HoverPreview`, `Interactive/Taskbar/ContextPanel`, `Interactive/Taskbar/MutualExclusion` 아래에서 hook + taskbar trigger + panel 조합을 보여 준다. canonical fixture data는 read-only로 재사용하되 compare inventory를 늘리지 않는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/.storybook/main.ts` | 보강 | Storybook이 `interactive/taskbar/storybook` 아래 behavior stories를 별도 branch로 인덱싱한다. | component roots를 건드리지 않고도 `Interactive/Taskbar/*` stories가 discovery된다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorFixtures.ts` | 추가 | behavior stories가 canonical hover/context fixture와 trigger asset을 중복 정의하지 않고 read-only로 재사용한다. | visual state inventory를 새로 만들지 않고 existing fixture winner를 그대로 가져온다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 추가 | taskbar strip, trigger ref, pointer origin, focus restore, mutual exclusion owner logic를 공유하는 behavior-only harness 모듈이 생긴다. | story마다 inline orchestration을 복제하지 않고도 consumer-owned rule이 한 경계에서 보인다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx` | 추가 | `TaskbarIconButton + TaskbarHoverPreview` hover lifecycle story가 `Interactive/Taskbar/HoverPreview` 아래에서 동작한다. | open/close intent와 exit lifecycle이 component catalog 밖에서 검토 가능하다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.behavior.stories.tsx` | 추가 | `TaskbarIconButton + TaskbarContextMenu` context open/close/focus restore story가 `Interactive/Taskbar/ContextPanel` 아래에 생긴다. | pointer origin, Escape close, focus restore가 behavior Storybook에서 재현된다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarMutualExclusion.behavior.stories.tsx` | 추가 | hover/context combined story가 consumer-owned mutual exclusion과 fresh re-entry 정책을 보여 준다. | context open 시 hover dismiss, hover winner 시 context close, resting pointer no-op가 한 story에서 확인된다. |

- 이전 상태: behavior harness story가 component story 파일 아래에 섞여 있고, Storybook sidebar에서 visual catalog와 runtime verification 경계를 한눈에 분리할 수 없다.
- 이후 상태: `Interactive/Taskbar/*` branch가 hook/runtime verification만 소유하고, canonical visual state는 기존 component stories에서 read-only source로 남는다.
- 완료 조건: Storybook source와 build 결과만으로 `Interactive/Taskbar/HoverPreview`, `Interactive/Taskbar/ContextPanel`, `Interactive/Taskbar/MutualExclusion`가 별도 branch로 보이고, compare `kind/state` inventory가 늘어나지 않아야 한다.
- 관련 영역: `packages/ui/src/components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewFixtures.ts`, `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuFixtures.ts`, `plans/windows-ui-storybook-taxonomy-governance/phases/02-domain-taxonomy-realignment.md`
- 시작 조건: Phase 1의 hover dismiss contract와 tests가 stable해야 한다.
- 상세: `./phases/02-interactive-behavior-stories.md`

### Phase 3. visual inventory 정리

- 목적: component story를 canonical visual inventory로 다시 닫고, behavior harness 소유를 `interactive/taskbar/storybook`으로 완전히 옮긴다.
- 변경 내용: `taskbarHoverPreview.stories.tsx`, `taskbarContextMenu.stories.tsx`에서는 `InteractiveHarness` export와 behavior-only import를 제거하고, component 폴더에 있던 old harness files는 삭제한다. visual/reference/compare story 이름과 compare kind/state는 그대로 유지한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx` | 정리 | hover preview component story가 visual/reference/compare story만 남긴다. | `InteractiveHarness` export와 behavior harness import가 제거되고 canonical visual states는 유지된다. |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx` | 정리 | context menu component story가 visual/reference/compare story만 남긴다. | `InteractiveHarness` export와 behavior harness import가 제거되고 compare states는 그대로 남는다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewHarness.tsx` | 삭제 | hover preview behavior harness의 old component-local owner가 제거된다. | runtime verification entry가 component folder가 아니라 interactive/storybook 쪽만 남는다. |
| `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuHarness.tsx` | 삭제 | context/mutual exclusion harness의 old component-local owner가 제거된다. | mutual exclusion demo가 component story inventory에서 완전히 빠진다. |

- 이전 상태: component story가 visual/reference/compare와 interactive behavior harness를 동시에 보여 주어 canonical visual inventory가 runtime verification 책임까지 겸하고 있다.
- 이후 상태: component story는 visual catalog만, `interactive/taskbar/storybook`은 기능 검증만 맡아 Storybook taxonomy와 기능 ownership이 일치한다.
- 완료 조건: component story source에서 `InteractiveHarness` 흔적이 사라지고, 기존 visual/reference/compare story와 compare `kind/state` key는 그대로 유지돼야 한다.
- 관련 영역: `packages/ui/src/interactive/taskbar/storybook/**`, `plans/windows-ui-storybook-taxonomy-governance/plan.md`, `plans/windows-taskbar-13-interactive-attached-surfaces/plan.md`
- 시작 조건: Phase 2의 behavior stories가 Storybook에서 정상 discovery되어야 한다.
- 상세: `./phases/03-visual-story-inventory-cleanup.md`
