**Branch:** feat/windows-taskbar-02-windows-panel

> Worktree dir: `worktrees/windows-taskbar-02-windows-panel` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 기술적인 입력/출력 계약, 파일 경계, 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows UI 작업 표시줄 Windows 패널 실행 계획

## 단계별 실행

### Phase 1. Windows 패널 기본 화면 만들기

- 목적: `TaskbarWindowsPanel`을 시작 기본 화면이 아니라 Windows 버튼에서 열리는 정적 panel surface로 다시 정의하고, 관찰된 핵심 mode를 고정한다.
- 변경 내용: `pinned`, `all`, `query-empty` 세 상태와 panel 내부 검색줄, 제목 행, pinned grid, 알파벳 인덱스, 빈 결과 화면을 `TaskbarWindowsPanel` 안에 정리한다.
- 이전 상태: foundation plan으로 공통 이름과 private primitive는 고정돼 있지만, Windows panel의 내부 구조와 mode 경계는 아직 비어 있다.
- 이후 상태: Windows panel은 public surface 하나로 읽히고, secondary surface를 제외한 기본 구조는 캡처 기준으로 확정된다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbarWindowsPanel`, `packages/ui/src/components/taskbar/internal/**`
- 시작 조건: foundation plan Phase 1 계약 완료
- 상세: `./phases/01-panel-modes.md`

### Phase 2. Windows 패널 내부 메뉴 고정

- 목적: Windows panel 내부에서만 쓰이는 secondary surface를 따로 고정해, `all` 목록 항목과 pinned tile의 context 차이를 generic menu로 뭉개지 않게 한다.
- 변경 내용: `all-item` 메뉴와 pinned tile 위치별 메뉴 4종을 `TaskbarWindowsPanel` 내부 secondary surface로 분리해 정리한다.
- 이전 상태: panel 기본 구조는 있지만, 우클릭 시 보이는 내부 action surface와 위치별 move action 차이는 아직 구현 계약으로 충분히 고정되지 않았다.
- 이후 상태: Windows panel은 기본 모드와 item-level secondary surface까지 포함한 완성된 정적 panel family가 된다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbarWindowsPanel`, `packages/ui/src/components/taskbar/internal/**`
- 시작 조건: Phase 1 완료
- 상세: `./phases/02-secondary-surfaces.md`
