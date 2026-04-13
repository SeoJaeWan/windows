**Branch:** feat/windows-taskbar-06-storybook-compare-contract

> Worktree dir: `worktrees/windows-taskbar-06-storybook-compare-contract` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 기술적인 입력/출력 계약, 파일 경계, 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows Taskbar Storybook 비교 기준 정리 실행 계획

## 단계별 실행

### Phase 1. 비교용 공통 화면 규칙

- 목적: 사람이 보는 `Reference` 화면과 자동 비교 도구가 읽는 `Compare` 화면의 역할을 나누고, 비교 기준이 되는 최상위 요소 규칙을 먼저 정한다.
- 변경 내용: `packages/ui/src/components/taskbar/storybook/**` 아래 공통 helper를 추가하고, `data-visual-root`(비교 기준 요소를 찾기 위한 표식), 종류·상태 표식, 장식용 감싸기 금지 규칙을 한곳에 모은다.
- 이전 상태: leaf story는 label/backdrop stage에 묶여 있고, full taskbar와 panel story도 자동 비교 도구가 어느 요소를 기준으로 잡아야 하는지 일정하지 않다.
- 이후 상태: 기존 `Reference` story와 panel reference canvas는 사람 검토용으로 남고, 새 `Compare` story는 이 패키지 안 helper가 만든 하나의 기준 요소만 드러낸다.
- 관련 영역: `packages/ui/src/components/taskbar/storybook/**`, `packages/ui/src/components/taskbar/**/*.stories.tsx`
- 시작 조건: `none`
- 상세: `./phases/01-compare-root-helpers.md`

### Phase 2. 개별 요소 비교 화면 나누기

- 목적: Windows/Search/Icon/Clock story가 사람 검토용 화면과 자동 비교용 화면을 함께 제공하고, 상태별 기준을 헷갈리지 않게 나눈다.
- 변경 내용: Windows/Search/Clock에는 `Compare`를 하나씩 추가하고, Icon은 `CompareDefault`, `CompareActive`, `CompareHide`로 나눠 상태별 비교 화면을 분리한다.
- 이전 상태: leaf story는 `Reference`만 있고, Icon은 한 story 안에서 세 상태를 섞어 보여준다. `TaskbarSearch`는 바깥 감싸기 요소에 임의 속성을 그대로 넘기지 않아 story마다 어느 요소를 기준으로 잡는지 분명하지 않다.
- 이후 상태: 각 `Compare` export마다 하나의 기준 요소와 고정된 종류·상태 표식이 생기고, `TaskbarSearch`도 public prop을 늘리지 않은 채 story 쪽 바깥 wrapper가 그 기준을 맡는다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbarWindowsButton/taskbarWindowsButton.stories.tsx`, `packages/ui/src/components/taskbar/taskbarSearch/taskbarSearch.stories.tsx`, `packages/ui/src/components/taskbar/taskbarIconButton/taskbarIconButton.stories.tsx`, `packages/ui/src/components/taskbar/taskbarClock/taskbarClock.stories.tsx`, `packages/ui/src/components/taskbar/storybook/**`
- 시작 조건: Phase 1의 공통 helper 규칙이 준비돼 있어야 한다.
- 상세: `./phases/02-leaf-compare-stories.md`

### Phase 3. 전체 바와 패널 비교 화면

- 목적: full taskbar와 windows panel의 현재 Storybook 화면 전체에 자동 비교용 화면을 더하고, Storybook 검증도 이 새 story 구성에 맞춘다.
- 변경 내용: `Taskbar Foundation/Taskbar`와 `Windows Panel/Shell`의 현재 상태 story들에 `Compare` export를 추가하고, `storybookBootstrap.test.ts`가 이 화면들을 직접 렌더링해 기준 요소와 장식 없는 비교 화면을 확인하도록 갱신한다.
- 이전 상태: full taskbar는 decorative `Reference`만 있고, panel state story는 사람 검토용 canvas만 가진다. bootstrap test도 자동 비교용 story와 기준 표식을 아직 모르고 있다.
- 이후 상태: full taskbar와 panel 각 상태가 사람 검토용 story와 별도의 자동 비교용 story를 같이 가지며, bootstrap test가 저장소 안 Storybook만으로 그 기준 요소와 장식 없는 화면을 직접 확인한다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbar/taskbar.stories.tsx`, `packages/ui/src/components/taskbar/windowsPanelShell/windowsPanelShell.stories.tsx`, `packages/ui/src/components/taskbar/storybook/storybookBootstrap.test.ts`, `packages/ui/.storybook/**`
- 시작 조건: Phase 1의 공통 helper 규칙과 Phase 2의 leaf 종류·상태 이름이 정리돼 있어야 한다.
- 상세: `./phases/03-composite-compare-and-bootstrap.md`
