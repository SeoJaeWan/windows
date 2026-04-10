**Branch:** feat/windows-taskbar-01-foundation-shell

> Worktree dir: `worktrees/windows-taskbar-01-foundation-shell` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 기술적인 입력/출력 계약, 파일 경계, 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows UI 작업 표시줄 공통 이름과 하단 바 실행 계획

## 단계별 실행

### Phase 1. 공통 이름과 기본 틀 정리

- 목적: `packages/ui`에서 작업 표시줄 각 조각을 부르는 공식 이름과 기본 파일 자리를 먼저 정리하고, 패키지 안에서 직접 관리하는 Windows mark 이미지와 내부 `Icon` 자리를 고정해 이후 하단 바 작업이 같은 기준에서 출발하게 만든다.
- 변경 내용: server-safe 루트 entry에 foundation leaf 공개 이름을 연결하고, `Windows` 기준 이름과 작업 표시줄 각 조각이 쓸 내부 `Icon` 및 Windows mark 이미지 경계를 먼저 정리한다.
- 이전 상태: `packages/ui/src/index.ts`는 server-safe 주석만 있는 entry라 taskbar 공개 이름을 아직 내보내지 않고, `packages/ui/src/components/taskbar/**`는 테스트와 asset 자리만 있는 scaffold 상태라 공식 이름과 내부 기본형을 구현자가 추측해야 한다.
- 이후 상태: 패키지 밖에서 쓰는 foundation leaf 이름과 내부 `Icon`/Windows mark 이미지 경계가 루트 entry 기준으로 먼저 고정되고, 이 연결은 package-level typecheck로 검증된다. 실제 하단 바 rail과 버튼 모양 검증은 다음 단계로 넘긴다.
- 관련 영역: `packages/tailwind-config`, `packages/ui/src/index.ts`, `packages/ui/src/components/taskbar/**`
- 시작 조건: `none`
- 상세: `./phases/01-public-contract-and-primitives.md`

### Phase 2. 하단 바와 기본 버튼 모양 만들기

- 목적: 패널을 붙이기 전에도 화면 아래 작업 표시줄과 기본 버튼 묶음이 먼저 읽히도록 정적 UI를 만들고, 각 조각이 받는 최소 입력과 패키지 안에서 직접 관리하는 아이콘 이미지 사용 방식을 함께 정한다.
- 변경 내용: 빈 작업 표시줄 바, Windows 버튼, 검색 상자, 앱 아이콘 버튼, 시계 블록을 각각 독립된 모양으로 만들고, `Taskbar`를 포함한 foundation 공개 entry를 실제 구현에 연결한다.
- 이전 상태: Phase 1 이후 루트 entry에는 foundation leaf 이름과 내부 `Icon`/asset 경계만 정리돼 있고, rail/leaf DOM과 `Taskbar` 공개 연결은 아직 비어 있다.
- 이후 상태: 작업 표시줄 바는 아래쪽 유리 바 형태로 보이고, Windows/Search/Icon/Clock은 나중에 어떤 패널이 붙어도 다시 쓸 수 있는 독립 조각이 되며, `WindowsButton`과 `IconButton`은 같은 내부 `Icon` 위에 서로 다른 책임만 올리는 구조로 고정된다. 이 단계의 검증은 작업 표시줄 바와 기본 버튼의 source-tree 계약과 package-level typecheck까지 green으로 만들고, 아직 이 단계가 직접 소유하지 않는 패널 정리까지는 완료 조건에 넣지 않는다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbar`, `taskbarWindowsButton`, `taskbarSearch`, `taskbarIconButton`, `taskbarClock`
- 시작 조건: Phase 1 완료
- 상세: `./phases/02-bar-shell-and-leaf-controls.md`
