**Branch:** feat/windows-taskbar-work-01-data-helper-foundation

> Worktree dir: `worktrees/windows-taskbar-work-01-data-helper-foundation` (plan 폴더명과 동일)
> 참고: 기존 `windows-taskbar-*`와 `windows-taskbar-seq-*` plan은 유지하고, 이번 묶음은 실무형 독립 일감 기준으로 다시 나눈 artifact다.

# Windows Taskbar 데이터와 헬퍼 기초 실행 계획

## 단계별 실행

### Phase 1. 공식 입력 고정

- 목적: `Taskbar`가 받을 공식 입력과 기본 해석 규칙을 한 묶음으로 고정해 이후 일감이 같은 계약을 쓰게 한다.
- 변경 내용: `entries`, `icons`, `windows`, `search`, `clock` 중심의 공식 입력, `entry.category`와 reserved `windows` category 해석 규칙, `search` 아래 외부 제어 results payload 위치를 닫는다.
- 이전 상태: raw slot과 data props 기대가 섞여 있고, 검색 결과 payload도 어디에 둘지 불분명하다.
- 이후 상태: 공식 입력은 `Taskbar` data props 하나로 수렴하고, search results는 `search` prop 아래 외부에서 넘기는 payload로 고정된다.
- 관련 영향: `packages/ui` taskbar public type, 후속 helper와 composite assembly의 입력 기준
- 시작 조건: `none`
- 상세: `./phases/01-data-contract.md`

### Phase 2. 화면별 목록 계산 묶기

- 목적: 같은 `entries/icons/search` 입력을 start/search 화면이 같은 계산 규칙으로 쓰게 한다.
- 변경 내용: package 안의 helper가 아이콘 줄, 시작 메뉴의 고정/전체 목록, 검색 기본 화면 목록을 계산하고, 검색 결과 화면은 외부에서 받은 payload를 그대로 넘기는 경계를 고정한다.
- 이전 상태: 같은 registry를 어디서 어떤 목록 형식으로 계산할지 불분명하고, helper가 화면마다 다시 생길 위험이 있다.
- 이후 상태: start/search panel은 패키지 안에서만 쓰는 helper가 만든 같은 목록 형식을 쓰고, 검색 결과의 목록과 detail은 외부 제어 입력만 따른다.
- 관련 영향: `packages/ui/src/utils/taskbar/**`, `taskbarStartPanel`, `taskbarSearchPanel`, 후속 composite assembly
- 시작 조건: Phase 1 완료
- 상세: `./phases/02-helper-projection.md`
