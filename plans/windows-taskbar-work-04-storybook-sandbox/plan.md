**Branch:** feat/windows-taskbar-work-04-storybook-sandbox

> Worktree dir: `worktrees/windows-taskbar-work-04-storybook-sandbox` (plan 폴더명과 동일)

# Windows Taskbar Storybook 샌드박스 실행 계획

## 단계별 실행

### Phase 1. Storybook 실행 경로 열기

- 목적: `@windows/ui`가 app/web route를 띄우지 않아도 taskbar 기준 화면을 직접 검토할 수 있는 Storybook 실행 경로를 자기 package 안에 만든다.
- 변경 내용: `packages/ui/package.json`에 Storybook script와 devDependency를 두고, `packages/ui/.storybook/**` config가 `@windows/ui` source를 직접 읽는 실행 경계를 고정한다.
- 이전 상태: taskbar reference를 보려면 app/web route에 기대야 하고, `@windows/ui` package 안에는 자체 Storybook 실행 경로가 없다.
- 이후 상태: `pnpm --filter @windows/ui storybook`과 `pnpm --filter @windows/ui build-storybook`이 taskbar 검토용 Storybook의 공식 진입점이 되고, 설치 흔적은 workspace `pnpm-lock.yaml`에만 추가된다.
- 관련 영향: `packages/ui/package.json`, `packages/ui/.storybook/**`, `packages/ui/tsconfig.json`, `pnpm-lock.yaml`, 후속 reference story와 web sandbox retirement가 사용할 replacement surface
- 시작 조건: `plans/windows-taskbar-work-03-reference-visuals/phases/02-panel-visuals.md`가 package-owned panel/overlay visual grammar와 package-only chrome ownership을 제공한 상태
- 상세: `./phases/01-storybook-contract.md`

### Phase 2. reference scene 올리기

- 목적: Storybook 안에 taskbar 기준 화면, 비교 화면, 단독 surface 전시를 올려 package만으로 검토 가능한 reference scene을 만든다.
- 변경 내용: taskbar stories, package-local fixture helper, stable marker를 source tree 기준으로 추가해 후속 retirement plan이 그대로 참조할 replacement scene을 만든다.
- 이전 상태: Storybook 실행 경로가 있어도 실제 taskbar 기준 장면과 비교 장면이 package 안에 없다.
- 이후 상태: Storybook가 taskbar reference owner surface가 되고, 별도 web sandbox retirement plan이 app/web route를 정리하더라도 같은 검토 surface를 이어서 사용할 수 있다.
- 관련 영향: `packages/ui/src/components/taskbar/**/*.stories.tsx`, `packages/ui/src/components/taskbar/storybook/**`, 후속 web sandbox retirement plan
- 시작 조건: Phase 1이 `packages/ui` 소유 Storybook script/config와 app/web-independent 실행 경로를 제공한 상태
- 상세: `./phases/02-reference-stories.md`
