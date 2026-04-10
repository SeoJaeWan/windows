**Branch:** feat/windows-taskbar-04-attached-surfaces

> Worktree dir: `worktrees/windows-taskbar-04-attached-surfaces` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 기술적인 입력/출력 계약, 파일 경계, 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows UI 작업 표시줄 부착형 surface 실행 계획

## 단계별 실행

### Phase 1. Hover 미리보기 만들기

- 목적: 활성 아이콘 위에 붙는 미리보기 surface를 별도 public owner로 정리해, Windows/Search panel과 다른 종류의 compact preview를 고정한다.
- 변경 내용: `TaskbarHoverPanel`의 app label, preview card strip, compact floating density를 정적 UI로 만든다.
- 이전 상태: foundation plan으로 이름과 primitive는 준비돼 있지만, hover preview 자체의 인상과 card 비율은 아직 비어 있다.
- 이후 상태: `TaskbarHoverPanel`은 동작 없이도 preview surface로 읽히는 public component가 된다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbarHoverPanel`, `packages/ui/src/components/taskbar/internal/**`
- 시작 조건: foundation plan Phase 1 계약 완료
- 상세: `./phases/01-hover-preview.md`

### Phase 2. 작업 아이콘 메뉴 만들기

- 목적: 작업 표시줄 root icon 우클릭 메뉴를 별도 public owner로 고정해 generic `TaskbarContextMenu`를 다시 부활시키지 않게 한다.
- 변경 내용: `TaskbarIconContextMenu`의 제목, recent item 목록, 구분선, 하단 action row 두 개를 정리하고, nested recent-item 2차 메뉴는 범위 밖으로 남긴다.
- 이전 상태: hover preview는 있어도 root icon context menu는 아직 구체 구조가 정리되지 않았다.
- 이후 상태: hover preview와 icon context menu가 각각 독립된 public attached surface가 된다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbarIconContextMenu`, `packages/ui/src/components/taskbar/internal/**`
- 시작 조건: Phase 1 완료
- 상세: `./phases/02-icon-context-menu.md`
