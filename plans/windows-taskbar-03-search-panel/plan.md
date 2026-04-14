**Branch:** feat/windows-taskbar-03-search-panel

> Worktree dir: `worktrees/windows-taskbar-03-search-panel` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 먼저 `전체 작업 지도`에서 흐름을 보고, 아래 phase 카드에서 무엇이 바뀌는지와 무엇을 확인해야 하는지 본다.
> 기술적인 입력/출력 계약, 파일 경계, 상세 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows Taskbar Search Panel 실행 계획

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. 공용 panel foundation 분리 | `WindowsPanel`/`WindowsPanelSearchView` 안에 묶여 있던 카드 표면과 query-present 렌더링을 `PanelSurface`, `PanelSearchResultsView`로 분리하되, task10/task08이 닫아 둔 windows public contract는 그대로 유지하고 shared renderer의 normalized payload를 닫는다. | search row를 강제로 넣지 않는 공용 panel surface와 list/detail 양쪽을 감당하는 internal results view가 생기고, windows family는 여전히 같은 public facade 이름과 의미를 유지한다. | SearchPanel이 그대로 소비할 수 있는 shared foundation, normalized query-present payload, windows facade continuity, `TaskbarSearch` 비포함 규칙 |
| Phase 2. SearchPanel 상태 surface 추가 | live 사이트 기준의 empty-query 기본 화면과 query-present 검색 화면을 `SearchPanelDefaultView`, `SearchPanel`로 만들고, `query` required 규칙과 `results.length` winner rule, 그리고 query-present branch 전용 payload `title`, `results`, `emptyTitle`, `emptyDescription`를 닫은 뒤 canonical state inventory를 `default`, `query-results`, `query-empty` 세 개로 고정한다. | search panel은 taskbar input 바깥에서 required `query`를 받고, `query !== ""` branch에서는 `title`, `results`, `emptyTitle`, `emptyDescription`를 받아 `results.length > 0`면 결과 화면, `results.length === 0`면 empty 화면을 그리는 독립 public surface가 된다. detail/pinned capture는 지원 참고로만 남고 새 canonical state가 되지 않는다. | package/storybook wiring이 바로 쓸 수 있는 SearchPanel public contract, temporary fixture shape, supporting-capture classification |
| Phase 3. 공개 surface와 Storybook 기준 고정 | `SearchPanel`만 package root에 공개하고, query-present public payload를 그대로 쓰는 story/fixture/build 검증으로 repo-local visual acceptance를 닫는다. | `@windows/ui`는 windows family canonical export를 유지한 채 `SearchPanel`을 추가하고, search panel의 세 canonical state와 caller-visible props가 package-owned fixture/story 경계에 고정된다. | 구현 handoff와 이후 `plan-materialize`가 그대로 쓸 public surface, caller-visible payload, fixture inventory, package validation 경계 |

## 단계별 실행

### Phase 1. 공용 panel foundation 분리

- 목적: `task10` 이후 canonical windows naming은 다시 열지 않으면서, search panel이 재사용할 수 있는 panel frame/results foundation만 neutral boundary로 분리한다.
- 변경 내용: `PanelSurface`는 search row를 직접 렌더링하지 않는 카드 표면으로 추출하고, `PanelSearchResultsView`는 `results`/`empty`, `list`/`detail`, 그리고 `title`/`results`/`emptyTitle`/`emptyDescription` payload winner를 internal contract로 가진 shared view로 만든다. `WindowsPanel`과 `WindowsPanelSearchView`는 이 shared foundation을 쓰되 public export, root class, `previewPinState` semantics는 그대로 유지한다.
- 이전 상태: panel frame과 query-present renderer가 windows family 안에 묶여 있어서 search panel이 그대로 재사용하면 panel 내부에 `TaskbarSearch`가 함께 따라오거나 windows-only naming에 직접 의존하게 된다.
- 이후 상태: shared foundation은 생기지만 `WindowsPanelSearchView`는 여전히 windows-family canonical public facade로 남고, search panel은 같은 foundation을 가져오더라도 windows shell을 직접 재사용하지 않는다.
- 확인 포인트: shared boundary 어디에도 `TaskbarSearch`가 직접 들어가지 않아야 하고, `WindowsPanelSearchView`는 task10/task08의 public contract와 action winner rule을 그대로 유지해야 한다.
- 관련 영역: `packages/ui/src/components/panels/shared/**`, `packages/ui/src/components/panels/windows/**`, `packages/ui/src/components/taskbar/taskbarSearch/**`, `plans/windows-taskbar-10-panel-family-rename/**`, `plans/windows-taskbar-08-panel-pin-toggle-actions/**`
- 시작 조건: `windows-taskbar-10-panel-family-rename`의 output인 `@windows/ui` root export canonical 이름 `WindowsPanel`, `WindowsPanelPinnedView`, `WindowsPanelAllView`, `WindowsPanelSearchView`와 root class `windows-panel`, `windows-panel-content`, `windows-panel-*-view`가 이미 stable해야 한다.
- 상세: `./phases/01-shared-panel-foundation.md`

### Phase 2. SearchPanel 상태 surface 추가

- 목적: live 검색 패널 기준 UI를 package-owned state inventory로 닫고, empty-query default와 query-present search surface를 `SearchPanel` 하나로 정리한다.
- 변경 내용: `SearchPanelDefaultView`는 `추천`, `최고의 블로그글`, `최고의 프로젝트` 세 section을 temporary fixture로 재현하고, `SearchPanel`은 required `query`와 query-present branch accepted props `title`, `results`, `emptyTitle`, `emptyDescription`, 그리고 native `div` pass-through를 연다. `query === ""`면 default view를, `query !== ""`이면서 `results.length > 0`면 `PanelSearchResultsView mode="results" layout="list"`를, `results.length === 0`면 `PanelSearchResultsView mode="empty" layout="list"`를 쓰도록 winner rule을 닫는다. `search-panel-query-detail.png`, `search-panel-query-detail-pinned.png`는 shared detail layout continuity를 위한 supporting reference로만 분류한다.
- 이전 상태: repo 안에는 windows family search view만 있고, taskbar 바깥 query를 받아 live 사이트의 search panel 기본 화면과 list-only query 화면을 package 경계에서 표현하는 public surface가 없다.
- 이후 상태: SearchPanel은 taskbar input을 패널 안에서 다시 렌더링하지 않는 별도 surface가 되고, canonical fixture state inventory도 `default`, `query-results`, `query-empty` 세 개로 고정된다.
- 확인 포인트: `search-result-context-menu.png`는 이번 task 범위에 들어오지 않아야 하고, detail/pinned capture를 이유로 canonical state 수가 늘어나면 안 된다. `SearchPanel` query-present surface는 preview/action panel을 기본 출력으로 소유하지 않는다.
- 관련 영역: `packages/ui/src/components/panels/search/**`, `packages/ui/src/components/panels/shared/**`, `plans/windows-taskbar-03-search-panel/reference-captures/**`, `https://seojaewan.com`
- 시작 조건: Phase 1의 shared foundation이 `TaskbarSearch` 없이 panel frame/results view를 제공하고, `WindowsPanelSearchView` facade continuity가 이미 확보돼 있어야 한다.
- 상세: `./phases/02-search-panel-states.md`

### Phase 3. 공개 surface와 Storybook 기준 고정

- 목적: search panel public export를 singular하게 닫고, package-owned story/fixture/build 검증으로 reference-oriented acceptance를 observable하게 만든다.
- 변경 내용: `SearchPanel`만 `@windows/ui` root export에 추가하고, `SearchPanelDefaultView`, `PanelSurface`, `PanelSearchResultsView`는 internal-only로 둔다. search family story/fixture는 `query`, `title`, `results`, `emptyTitle`, `emptyDescription` public payload로 `default`, `query-results`, `query-empty` 세 canonical state만 드러내고, supporting capture 역할은 코드 주석/fixture 설명에서 명시한다. windows family story/import는 shared extraction으로 필요한 부분만 따라 조정한다.
- 이전 상태: search panel은 package root에서 쓸 public component가 없고, local reference state inventory도 capture 폴더 밖에서 code contract로 고정돼 있지 않다.
- 이후 상태: `@windows/ui`는 task10 canonical windows naming을 유지한 채 `SearchPanel` 하나를 추가 공개하고, story/build 검증으로 search panel state inventory와 visual ownership이 package 경계에서 드러난다.
- 확인 포인트: root export에 internal shared leaf가 새 public surface처럼 올라오면 안 되고, story/fixture에서 canonical state key가 세 개를 넘기면 안 된다. `pnpm --filter @windows/ui test`와 `pnpm --filter @windows/ui build-storybook`가 모두 green이어야 한다.
- 관련 영역: `packages/ui/src/components/panels/search/**`, `packages/ui/src/components/panels/shared/**`, `packages/ui/src/components/panels/windows/**`, `packages/ui/src/index.ts`, `packages/ui/package.json`
- 시작 조건: Phase 2의 SearchPanel public contract와 canonical state inventory가 이미 고정돼 있어야 한다.
- 상세: `./phases/03-public-wiring-and-storybook.md`
