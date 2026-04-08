**Branch:** feat/windows-taskbar-work-03-reference-visuals

> Worktree dir: `worktrees/windows-taskbar-work-03-reference-visuals` (plan 폴더명과 동일)

# Windows Taskbar 참조 디자인 실행 계획

## 단계별 실행

### Phase 1. 바와 기본 조작 화면 옮기기

- 목적: 하단 bar, 검색창, 아이콘 버튼, 시계 블록의 분위기와 밀도를 작업 시점 참조 화면 기준으로 `@windows/ui`와 `@windows/tailwind-config` 안에 옮긴다.
- 변경 내용: 유리감, 테두리, 그림자, 글자 톤, 검색창 모양, 아이콘 간격을 `@windows/tailwind-config`와 각 컴포넌트 기본 스타일로 정리한다.
- 이전 상태: 기본 골격은 있지만 화면 인상이 generic하고, 참조 화면의 핵심 스타일 책임이 공용 UI 코드 안에 명확히 모여 있지 않다.
- 이후 상태: app/web 쪽 보조 wrapper나 route CSS 없이도 `Taskbar` 계열 기본 스타일만으로 bar/search/icon/clock의 분위기가 잡힌다.
- 관련 영역: `packages/tailwind-config`, `Taskbar`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`
- 시작 조건: `plans/windows-taskbar-work-02-composite-assembly/phases/03-web-sandbox-alignment.md` 완료
- 상세: `./phases/01-bar-visuals.md`

### Phase 2. 패널과 보조 메뉴 화면 옮기기

- 목적: windows/search panel과 hover/context menu도 같은 계열의 모양과 간격을 갖게 해 taskbar 전체가 한 묶음으로 보이게 한다.
- 변경 내용: 패널 배경, 구역 구분, 행 간격, 썸네일/설명/동작 배치, 메뉴 행 스타일을 컴포넌트 기본 스타일로 옮긴다.
- 이전 상태: bar와 leaf보다 패널 쪽 화면은 참조 방향과 거리가 있고, app/web 쪽 장식에 기대는 여지가 남아 있다.
- 이후 상태: 후속 Storybook 샌드박스는 app/web 전용 wrapper 없이도 `@windows/ui` 기본 스타일만으로 패널과 보조 메뉴 화면을 보여줄 수 있다.
- 관련 영역: `TaskbarSearchPanel`, `taskbarWindowsPanel`, `TaskbarHoverPanel`, `TaskbarContextMenu`, 패널 내부 row/tile helper
- 시작 조건: Phase 1 완료
- 상세: `./phases/02-panel-visuals.md`
