**Branch:** feat/windows-ui-taskbar-static-surfaces

> Worktree dir: `worktrees/windows-ui-taskbar-static-surfaces` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 기술적인 입력/출력 계약, 파일 경계, 작업, 검증은 각 phase의 상세 문서에서 다룬다.
> 기존 `windows-taskbar-work-*`, `windows-ui-taskbar-shell`, `windows-ui-taskbar-styles`, `windows-web-taskbar-sandbox-preview` 문서는 보존하되, 이번 목표의 기준 문서는 이 plan 하나로 본다.

# Windows UI 작업 표시줄 정적 화면 실행 계획

## 단계별 실행

### Phase 1. 토큰과 내부 기본형 정리

- 목적: 작업 표시줄 전체가 같은 인상으로 보이도록 공통 색, 그림자, 흐림, 기본 모양을 먼저 맞춘다.
- 변경 내용: `packages/ui` 안쪽에서만 쓰는 기본 UI 조각과 공통 스타일 값을 정리해, 이후 하단 바와 패널이 같은 기준을 쓰게 만든다.
- 이전 상태: 하단 바와 패널에 쓰일 기본 스타일 값과 내부 조각의 모양 규칙이 임시 상태에 가깝고, 화면별로 인상이 흔들릴 수 있다.
- 이후 상태: 내부 조각과 공통 스타일 값이 정리되어, 이후 단계가 같은 기준으로 하단 바와 패널을 꾸밀 수 있다.
- 관련 영역: `packages/tailwind-config`, `packages/ui/src/components/taskbar/internal`
- 상세: `./phases/01-taskbar-tokens-and-primitives.md`

### Phase 2. 하단 바 모양 만들기

- 목적: 시작 버튼, 검색, 아이콘, 시계를 포함한 하단 바 자체의 정적인 모양을 `packages/ui` 안에서 완성한다.
- 변경 내용: 하단 바와 각 버튼류 컴포넌트의 기본 모양, 간격, 상태별 표시 차이를 다듬는다.
- 이전 상태: 하단 바와 버튼류가 렌더링은 되지만, 기준 화면처럼 읽히는 완성형 모양으로는 아직 덜 다듬어져 있다.
- 이후 상태: 별도 동작 없이도 하단 바만 놓고 보았을 때 기준 화면과 같은 계열의 작업 표시줄로 읽힌다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbar`, `taskbarStartButton`, `taskbarSearch`, `taskbarIconButton`, `taskbarClock`
- 시작 조건: Phase 1 완료
- 상세: `./phases/02-taskbar-bar-shell.md`

### Phase 3. 패널 모양 만들기

- 목적: 시작 패널, 검색 패널, 미리보기 패널, 메뉴 패널의 정적인 모양을 `packages/ui` 안에서 마무리한다.
- 변경 내용: 각 패널의 기본 크기, 여백, 줄 간격, 카드와 메뉴 항목의 상태 차이를 다듬어 독립된 정적 UI로 읽히게 만든다.
- 이전 상태: 패널 컴포넌트는 구조는 있지만, 기준 화면과 같은 계열의 완성형 패널로 보기에는 시각 규칙이 덜 정리돼 있다.
- 이후 상태: 패널이 실제로 열리고 닫히지 않더라도, 각각의 패널 UI만 따로 보아도 완성된 작업 표시줄 패널로 읽힌다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbarStartPanel`, `taskbarSearchPanel`, `taskbarHoverPanel`, `taskbarContextMenu`
- 시작 조건: Phase 2 완료
- 상세: `./phases/03-taskbar-panels.md`
