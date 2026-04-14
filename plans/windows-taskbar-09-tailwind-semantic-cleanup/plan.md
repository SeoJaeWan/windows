**Branch:** style/windows-taskbar-09-tailwind-semantic-cleanup

> Worktree dir: `worktrees/windows-taskbar-09-tailwind-semantic-cleanup` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 먼저 `전체 작업 지도`에서 흐름을 보고, 아래 phase 카드에서 무엇이 바뀌는지와 무엇을 확인해야 하는지 본다.
> 기술적인 입력/출력 계약, 파일 경계, 상세 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows Taskbar Tailwind semantic 정리 실행 계획

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. 공용 semantic class 표면 정리 | `packages/tailwind-config`에 taskbar height, text, border, icon color, active/inactive indicator, inset shadow를 위한 canonical semantic utility와 token alias를 추가한다. | taskbar 값은 더 이상 consumer가 raw `var(...)`나 arbitrary shadow로 직접 읽지 않아도 되는 공용 class surface를 갖는다. | taskbar/panel consumer가 그대로 채택할 수 있는 canonical utility 이름과 금지 패턴 목록 |
| Phase 2. Taskbar 소비처 정리 | taskbar runtime leaf와 full-taskbar 관련 story `className`에서 raw var와 px arbitrary를 semantic utility/numeric utility로 치환한다. | taskbar root/search/clock/icon/windows button과 taskbar story width class가 같은 semantic 규칙을 쓰고, inline raw var styling은 indicator state를 포함해 사라진다. | panel 쪽이 그대로 따를 수 있는 height/border/text/shadow/icon sizing 규칙과 repo-local 검증 기준 |
| Phase 3. Panel 소비처와 최종 검증 정리 | windows panel runtime에서 남은 raw var와 px arbitrary를 같은 규칙으로 정리하고, package-level grep/test/build 증거로 cleanup handoff를 닫는다. | `packages/ui`의 runtime + story className 범위에서 raw var 소비와 변환 가능한 px arbitrary가 정리되고, neutral palette와 decorative story inline style은 read-only로 남는다. | 이후 구현/`plan-materialize`가 그대로 사용할 최종 semantic cleanup boundary와 validation surface |

## 단계별 실행

### Phase 1. 공용 semantic class 표면 정리

- 목적: taskbar token 원본은 유지하되 consumer가 읽는 canonical Tailwind semantic API를 `@windows/tailwind-config` 경계에서 먼저 닫는다.
- 변경 내용: `packages/tailwind-config/src/theme.css`, `packages/tailwind-config/src/utilities.css`에 `h-taskbar`, `border-taskbar`, `text-taskbar`, `text-taskbar-muted`, `text-taskbar-search-icon`, active/inactive indicator utility, search inset shadow token/utility처럼 property-specific semantic surface를 추가한다.
- 이전 상태: taskbar 값은 대부분 `:root` 변수와 `taskbar-glass` recipe 안에만 있고, consumer는 `border-[var(--taskbar-border)]`, `text-[var(--taskbar-foreground)]`, `shadow-[...]`, `h-[var(--taskbar-height)]` 같은 raw class를 직접 작성해야 한다.
- 이후 상태: shared config가 raw var consumer를 대체할 canonical semantic utility 이름을 제공하고, 이후 phase는 그 이름을 채택하는 일만 남는다.
- 확인 포인트: shared config source 안에 taskbar semantic utility와 shadow alias가 명시적으로 존재하고, consumer phase가 `border-taskbar-border` 같은 중복 naming을 새 canonical contract로 채택하지 않는다는 점이 plan level에서 닫혀 있어야 한다.
- 관련 영역: `packages/tailwind-config/src/theme.css`, `packages/tailwind-config/src/utilities.css`, `packages/tailwind-config/src/base.css`, `packages/ui/.storybook/storybook.css`, `packages/ui/src/components/taskbar/**`, `packages/ui/src/components/panels/windows/**`
- 시작 조건: `plans/windows-taskbar-01-foundation-shell/phases/03-immediate-token-consumers.md`가 `taskbar-glass`, current taskbar consumer wiring, import boundary를 이미 canonical source로 고정하고 있어야 한다.
- 상세: `./phases/01-shared-semantic-class-surface.md`

### Phase 2. Taskbar 소비처 정리

- 목적: taskbar runtime leaf와 full-taskbar 관련 story `className`가 shared semantic API와 numeric Tailwind utility만 쓰도록 정리한다.
- 변경 내용: `Taskbar`, `TaskbarSearch`, `TaskbarClock`, `TaskbarWindowsButton`, `TaskbarIconButton`, `compareLeafStage`, `taskbar.stories.tsx`, `taskbarSearch.stories.tsx`에서 raw var class와 px arbitrary class를 치우고 `h-taskbar`, `border-taskbar`, `text-taskbar`, `pl-9.5`, `left-2.5`, `size-7.5`, `w-55`, `min-w-15` 같은 canonical utility로 바꾼다. indicator state는 inline style 대신 class winner rule로 닫는다.
- 이전 상태: taskbar root/search/clock/icon/story width는 `h-[var(--taskbar-height)]`, `border-[var(--taskbar-border)]`, `text-[var(--taskbar-foreground)]`, `shadow-[...]`, `w-[220px]`, `size-[30px]`, `min-w-[5em]`에 기대고, icon indicator는 raw var inline style로 상태를 표현한다.
- 이후 상태: taskbar consumer는 shared utility와 numeric utility만으로 같은 layout/visual grammar를 표현하고, story `className`도 동일한 규칙을 따른다. decorative story inline style과 neutral palette class는 이번 범위 밖으로 남는다.
- 확인 포인트: taskbar consumer와 taskbar story source에 raw var class, raw var inline style, `w-[220px]` 같은 repeated px arbitrary가 남지 않고, public props/label/state contract는 이전과 동일해야 한다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbar/index.tsx`, `packages/ui/src/components/taskbar/taskbarSearch/index.tsx`, `packages/ui/src/components/taskbar/taskbarClock/index.tsx`, `packages/ui/src/components/taskbar/taskbarWindowsButton/index.tsx`, `packages/ui/src/components/taskbar/taskbarIconButton/index.tsx`, `packages/ui/src/components/taskbar/storybook/compareLeafStage.tsx`, `packages/ui/src/components/taskbar/taskbar/taskbar.stories.tsx`, `packages/ui/src/components/taskbar/taskbarSearch/taskbarSearch.stories.tsx`
- 시작 조건: Phase 1의 semantic utility 이름과 search inset shadow contract가 먼저 고정돼 있어야 한다.
- 상세: `./phases/02-taskbar-consumer-cleanup.md`

### Phase 3. Panel 소비처와 최종 검증 정리

- 목적: windows panel runtime에서 남은 raw var와 px arbitrary를 같은 규칙으로 정리하고, package-level validation evidence로 cleanup 종료 조건을 닫는다.
- 변경 내용: `WindowsPanelShell`, `WindowsPanelPinnedBody`, `WindowsPanelAllBody`, `WindowsPanelSearchBody`의 border/text/icon sizing/preview sizing/class comments를 정리해 `border-taskbar`, `text-taskbar`, `h-150`, `w-192`, `size-6.25`, `size-8.5`, `size-20` 같은 canonical utility만 남긴다. 이 phase의 검증은 `packages/ui` runtime + story className 범위에서 raw var와 변환 가능한 px arbitrary 부재를 grep으로 증명하고, `@windows/ui` test/build-storybook으로 package 경계를 닫는다.
- 이전 상태: panel shell과 body는 `border-[var(--taskbar-border)]`, `text-[var(--taskbar-foreground)]`, `border-[var(--taskbar-border,#e0e0e0)]`, `size-[25px]`, `size-[34px]`, `size-[80px]`, `h-[600px]`, `w-[768px]`를 그대로 들고 있고, comment 일부도 `border-taskbar-border` 같은 drift를 남긴다.
- 이후 상태: panel runtime까지 taskbar semantic cleanup 규칙을 공유하고, read-only로 남겨두기로 한 neutral palette와 decorative inline style을 제외하면 `packages/ui` 범위의 target class contract가 하나로 정리된다.
- 확인 포인트: panel runtime source에 raw var class와 target px arbitrary가 남지 않고, `pnpm --filter @windows/ui test`와 `pnpm --filter @windows/ui build-storybook`가 함께 green이며, `apps/web`와 decorative story inline style은 수정 대상에 포함되지 않아야 한다.
- 관련 영역: `packages/ui/src/components/panels/windows/windowsPanelShell/index.tsx`, `packages/ui/src/components/panels/windows/windowsPanelPinnedBody/index.tsx`, `packages/ui/src/components/panels/windows/windowsPanelAllBody/index.tsx`, `packages/ui/src/components/panels/windows/windowsPanelSearchBody/index.tsx`, `packages/ui/src/components/taskbar/**`, `packages/ui/package.json`, `packages/ui/vitest.config.ts`
- 시작 조건: Phase 2에서 taskbar consumer cleanup과 story width cleanup이 이미 green 상태여야 한다.
- 상세: `./phases/03-panel-consumer-and-validation-closure.md`
