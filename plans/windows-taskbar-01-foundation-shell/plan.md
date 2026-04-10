**Branch:** feat/windows-taskbar-01-foundation-shell

> Worktree dir: `worktrees/windows-taskbar-01-foundation-shell` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 기술적인 입력/출력 계약, 파일 경계, 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows UI 작업 표시줄 공통 기반과 하단 바 실행 계획

## 단계별 실행

### Phase 1. 공통 이름과 기본형 고정

- 목적: 초기화된 `packages/ui`에 작업 표시줄 전용 public 이름, 내부 기본형, 최소 파일 뼈대를 다시 세워 이후 surface plan의 기준 계약을 만든다.
- 변경 내용: `Start` 계열 public 이름을 `Windows` 계열로 바꾸고, generic `TaskbarContextMenu`를 `TaskbarIconContextMenu`로 좁힌 뒤, 공통 primitive와 renamed scaffold를 먼저 고정한다.
- 이전 상태: root export는 아직 예전 `Start` 이름을 가리키고 있고, 패널별 secondary surface가 어느 public owner 아래에 속해야 하는지도 정리돼 있지 않다.
- 이후 상태: downstream plan이 같은 public 이름과 private primitive를 공유하면서 독립적으로 panel surface를 구현할 수 있는 공통 계약이 생긴다.
- 관련 영역: `packages/tailwind-config`, `packages/ui/src/index.ts`, `packages/ui/src/components/taskbar/**`
- 시작 조건: `none`
- 상세: `./phases/01-public-contract-and-primitives.md`

### Phase 2. 하단 바와 leaf control 만들기

- 목적: 작업 표시줄 자체와 그 위에 놓이는 기본 조각들을 정적 UI로 완성해, 이후 panel과 조합하기 전에도 하단 바 인상이 먼저 읽히게 만든다.
- 변경 내용: `Taskbar`는 내용 없는 glass rail로 만들고, `TaskbarWindowsButton`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`를 서로 다른 역할의 독립 leaf control로 만든다.
- 이전 상태: renamed scaffold와 private primitive는 준비돼 있어도, 하단 바와 버튼 조각이 실제 reference density로 읽히는 수준은 아니다.
- 이후 상태: `Taskbar`는 조합을 강제하지 않는 shell이 되고, button/search/icon/clock은 나중에 어떤 surface plan이 붙어도 재사용 가능한 정적 UI가 된다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbar`, `taskbarWindowsButton`, `taskbarSearch`, `taskbarIconButton`, `taskbarClock`
- 시작 조건: Phase 1 완료
- 상세: `./phases/02-bar-shell-and-leaf-controls.md`
