**Branch:** feat/windows-taskbar-01-5-foundation-storybook-figma

> Worktree dir: `worktrees/windows-taskbar-01-5-foundation-storybook-figma` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 기술적인 입력/출력 계약, 파일 경계, 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows Taskbar 공통 기반 Storybook Figma 등록 실행 계획

## 단계별 실행

### Phase 1. Storybook 실행 경로 열기

- 목적: foundation leaf 등록 작업이 app/web route 없이도 시작될 수 있도록 `@windows/ui` 안에 Storybook bootstrap과 실행 소유권을 먼저 고정한다.
- 변경 내용: `packages/ui/package.json`에 Storybook script와 devDependency를 두고, `packages/ui/.storybook/**`와 `packages/ui/tsconfig.json`이 package-local Storybook 실행 경계와 story discovery path를 닫는다.
- 이전 상태: `@windows/ui`에는 Storybook 실행 경로가 없고, foundation leaf story가 나중에 들어오더라도 package-owned bootstrap이 아직 없다.
- 이후 상태: `pnpm --filter @windows/ui storybook`과 `pnpm --filter @windows/ui build-storybook`이 foundation 등록용 Storybook의 공식 진입점이 되고, Storybook config는 `packages/ui` 안에서만 닫힌다. 이 단계는 아직 exact story title, story id, marker, Figma recipient contract를 열지 않는다.
- 관련 영역: `packages/ui/package.json`, `packages/ui/.storybook/**`, `packages/ui/tsconfig.json`, `pnpm-lock.yaml`
- 시작 조건: `none`
- 상세: `./phases/01-storybook-bootstrap.md`

### Phase 2. foundation leaf 등록 화면 올리기

- 목적: Phase 1 Storybook bootstrap 위에 Windows/Search/Icon/Clock leaf 등록 화면과 exact Figma handoff contract를 올려, downstream 등록이 title, story id, marker, recipient를 다시 추측하지 않게 만든다.
- 변경 내용: Windows/Search/Icon/Clock 각각의 `Reference` story, 공통 registration helper, 고정 marker, exact story id, Figma 대상 파일 문구를 source tree 기준으로 추가한다.
- 이전 상태: Storybook bootstrap은 열려 있지만 foundation leaf story와 exact 등록 계약은 아직 없고, Storybook이 Figma 등록의 실제 기준 화면으로 닫혀 있지 않다.
- 이후 상태: `Taskbar Foundation/Windows`, `Search`, `Icon`, `Clock` story가 exact marker와 emitted story id proof surface를 갖춘 Figma 등록 기준면이 된다. combined `Taskbar` composition story와 panel story는 이번 단계에 추가하지 않는다.
- 관련 영역: `packages/ui/src/components/taskbar/*/*.stories.tsx`, `packages/ui/src/components/taskbar/storybook/**`
- 시작 조건: Phase 1 완료, `windows-taskbar-01-foundation-shell` Phase 2가 Windows/Search/Icon/Clock source-tree entry와 `TaskbarIconButton`의 `default | active | hide` 상태 계약, targeted foundation test + `tsc` 검증을 제공한 상태
- 상세: `./phases/02-foundation-leaf-registration.md`
