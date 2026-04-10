**Branch:** feat/windows-taskbar-03-search-panel

> Worktree dir: `worktrees/windows-taskbar-03-search-panel` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 기술적인 입력/출력 계약, 파일 경계, 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows UI 작업 표시줄 Search 패널 실행 계획

## 단계별 실행

### Phase 1. Search 패널 결과 구조 만들기

- 목적: `TaskbarSearchPanel`의 기본 화면, 결과 목록, 상세 pane, 빈 결과 화면을 분리해 Search surface 자체의 구조를 먼저 확정한다.
- 변경 내용: `default`, `query-results`, `query-detail`, `query-empty` 상태와 추천 목록, featured 카드, 결과 행, `>` 상세 pane, pin/unpin 라벨 반전까지 `TaskbarSearchPanel` 안에서 정리한다.
- 이전 상태: foundation plan으로 이름과 private primitive는 고정돼 있지만, Search panel은 어떤 결과 구조를 기준으로 구현해야 하는지 아직 모호하다.
- 이후 상태: Search panel은 panel 내부 검색 input 없이도 명확한 primary state를 갖는 public surface가 된다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbarSearchPanel`, `packages/ui/src/components/taskbar/internal/**`
- 시작 조건: foundation plan Phase 1 계약 완료
- 상세: `./phases/01-results-and-detail.md`

### Phase 2. Search 패널 내부 메뉴 고정

- 목적: 검색 결과 행에서만 쓰이는 secondary surface를 Search panel owner 안에 남겨, taskbar icon menu와 다른 종류의 compact action surface로 고정한다.
- 변경 내용: 결과 행 우클릭 메뉴를 `TaskbarSearchPanel` 내부 secondary surface로 정리하고, result row action icon 경계도 함께 확정한다.
- 이전 상태: 결과 구조와 상세 pane은 있어도, 결과 행 context menu와 detail action glyph의 정리는 아직 부족하다.
- 이후 상태: Search panel은 primary state와 row-level secondary surface까지 포함한 완성된 정적 panel family가 된다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbarSearchPanel`, `packages/ui/src/components/taskbar/internal/**`
- 시작 조건: Phase 1 완료
- 상세: `./phases/02-secondary-surfaces.md`
