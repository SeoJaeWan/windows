**Branch:** refactor/windows-taskbar-10-panel-family-rename

> Worktree dir: `worktrees/windows-taskbar-10-panel-family-rename` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 먼저 `전체 작업 지도`에서 흐름을 보고, 아래 phase 카드에서 무엇이 바뀌는지와 무엇을 확인해야 하는지 본다.
> 기술적인 입력/출력 계약, 파일 경계, 상세 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows Panel family naming 정리 실행 계획

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. 패널 canonical naming 정리 | `packages/ui` panel family의 본체와 view 이름, root export, compare kind, story/test import, root class selector를 한 번에 교체한다. | package panel family는 `WindowsPanel`, `WindowsPanel*View`, `windows-panel`, `windows-panel-content`, `windows-panel-*-view` canonical naming으로 수렴하고, old name은 package source에서 제거된다. | 이후 구현과 `plan-materializer`가 그대로 따를 수 있는 singular naming contract, package-only validation 경계, old-name removal rule |

## 단계별 실행

### Phase 1. 패널 canonical naming 정리

- 목적: `WindowsPanelShell`과 `*Body` family를 본체와 view naming으로 정리하되, visual behavior와 frozen fixture state inventory는 다시 열지 않는다.
- 변경 내용: panel component 디렉터리/파일/심볼을 `WindowsPanel`, `WindowsPanelPinnedView`, `WindowsPanelAllView`, `WindowsPanelSearchView`로 옮기고, `packages/ui/src/index.ts`, Storybook stories, component tests, compare metadata, root class selector를 같은 phase에서 새 naming으로 동기화한다. old export alias와 dual compare kind는 남기지 않는다.
- 이전 상태: panel 본체는 `WindowsPanelShell`, 상태별 surface는 `WindowsPanel*Body`, compare kind는 `windows-panel-shell`, root slot class는 `windows-panel-body`, 각 view root class는 `windows-panel-*-body`라서 구조명과 상태명이 섞여 있고 package source 전반에서 old naming을 그대로 반복한다.
- 이후 상태: panel family는 본체 하나와 상태별 view surface라는 naming axis를 공유하고, `@windows/ui` root export와 package-owned stories/tests/compare helper도 같은 canonical 이름만 사용한다. canonical fixture state key와 public prop meaning은 그대로 유지된다.
- 확인 포인트: `packages/ui` write target 범위에서 `WindowsPanelShell`, `WindowsPanelPinnedBody`, `WindowsPanelAllBody`, `WindowsPanelSearchBody`, `windows-panel-shell`, `windows-panel-body`, `windows-panel-*-body`가 남지 않고, `pnpm --filter @windows/ui test`와 `pnpm --filter @windows/ui build-storybook`가 모두 green이어야 한다.
- 관련 영역: `packages/ui/src/components/panels/windows/windowsPanelShell/**`, `packages/ui/src/components/panels/windows/windowsPanelPinnedBody/**`, `packages/ui/src/components/panels/windows/windowsPanelAllBody/**`, `packages/ui/src/components/panels/windows/windowsPanelSearchBody/**`, `packages/ui/src/components/panels/windows/storybook/comparePanelStage.tsx`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`, `packages/ui/src/index.ts`, `packages/ui/package.json`, `plans/windows-taskbar-02-windows-panel/plan.md`, `plans/windows-taskbar-06-storybook-compare-contract/plan.md`, `plans/windows-taskbar-08-panel-pin-toggle-actions/plan.md`
- 시작 조건: `windows-taskbar-02-windows-panel`, `windows-taskbar-06-storybook-compare-contract`, `windows-taskbar-08-panel-pin-toggle-actions`가 이미 canonical panel state inventory, compare topology, search preview action contract를 닫아 두었고, 이번 task는 naming만 바꾸는 update pass여야 한다.
- 상세: `./phases/01-panel-canonical-naming.md`
