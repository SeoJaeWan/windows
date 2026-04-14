**Branch:** feat/windows-taskbar-08-panel-pin-toggle-actions

> Worktree dir: `worktrees/windows-taskbar-08-panel-pin-toggle-actions` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 먼저 `전체 작업 지도`에서 흐름을 보고, 아래 phase 카드에서 무엇이 바뀌는지와 무엇을 확인해야 하는지 본다.
> 기술적인 입력/출력 계약, 파일 경계, 상세 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows Panel 검색 pin 토글 action 실행 계획

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. 검색 action 상태 계약 정리 | `WindowsPanelSearchBody`가 body 내부 고정 label 대신 `previewPinState`를 읽어 pin/unpin label을 고르도록 public contract와 component test 기준을 다시 정한다. | `pin-start`, `pin-taskbar`가 같은 action id와 순서를 유지한 채 label winner를 props/state에서만 결정하고, fixed-label contract는 더 이상 canonical output이 아니다. | fixture와 story가 그대로 소비할 수 있는 결과 모드 전용 pin-state input, label winner rule, negative output rule |
| Phase 2. Storybook 노출과 정합성 고정 | search fixture와 Storybook이 interactive behavior 없이 pin/unpin label 변화를 드러내고, 기존 plan의 정적 action 가정은 이 task가 supersede한다는 경계를 같은 package regression 기준으로 닫는다. | `search-results` canonical inventory는 유지되면서도 required supporting fixture `SEARCH_RESULTS_UNPIN_ACTIONS`와 story `SearchResultsUnpinActions`가 search preview unpin 결과를 고정하고, shell/root export/package entry는 그대로 둔 채 새 contract만 최신 기준으로 고정된다. | 구현 handoff와 이후 `plan-materialize`가 그대로 사용할 최종 search preview action contract, singular supporting fixture/story inventory, validation 경계 |

## 단계별 실행

### Phase 1. 검색 action 상태 계약 정리

- 목적: `WindowsPanelSearchBody`의 preview action surface에서 `pin-start`, `pin-taskbar` label winner를 fixed string이 아니라 caller-owned state contract로 고정한다.
- 실제 작업: `packages/ui/src/components/panels/windows/windowsPanelSearchBody/index.tsx`와 component test가 `previewPinState.start`, `previewPinState.taskbar`를 읽어 `...에 고정` 또는 `... 고정 해제`를 선택하도록 바뀐다. `open`, `open-folder`, action id 순서, Fluent icon recipient, non-interactive shell 경계는 그대로 유지한다.
- 이전 상태: body 내부 `PREVIEW_ACTIONS` 상수가 네 action의 label을 모두 고정하고, tests도 `시작 화면에 고정`, `작업 표시줄에 고정` 두 문구를 unconditional output처럼 본다.
- 이후 상태: search result preview는 결과 모드에서 required `previewPinState`를 읽고, 두 pin action은 각각 독립적으로 pin/unpin label을 선택한다. empty 모드는 이 input을 해석하지 않는다. body-owned fixed label contract는 더 이상 canonical interpretation이 아니다.
- 확인 포인트: `WindowsPanelSearchBody` public input에 결과 모드용 pin-state surface가 드러나고, `pin-start`/`pin-taskbar`는 state별 positive/negative label rule을 모두 component test로 증명해야 한다.
- 관련 영역: `packages/ui/src/components/panels/windows/windowsPanelSearchBody/index.tsx`, `packages/ui/src/components/panels/windows/windowsPanelSearchBody/windowsPanelSearchBody.test.tsx`
- 시작 조건: `none`
- 상세: `./phases/01-search-action-state-contract.md`

### Phase 2. Storybook 노출과 정합성 고정

- 목적: 새 pin-state contract를 fixture/story에 연결하되 canonical panel state inventory와 non-interactive shell/public export 경계는 다시 열지 않는다.
- 실제 작업: `windowsPanelReferenceFixtures.ts`가 baseline `SEARCH_RESULTS`와 required supporting fixture `SEARCH_RESULTS_UNPIN_ACTIONS`를 함께 드러내고, `windowsPanelSearchBody.stories.tsx`는 `SearchResults`와 `SearchResultsUnpinActions`로 pin/unpin label을 각각 보여준다. `search-results`/`search-empty` canonical inventory, `WindowsPanelShell`, `packages/ui/src/index.ts`, `packages/ui/package.json`, old plan 문서는 read-only verification 대상으로만 남긴다.
- 이전 상태: search fixture는 preview pin state를 전혀 노출하지 않고, Storybook도 fixed-label action만 보여 주며, 기존 plan 02/07 문서에는 정적 4-command 가정이 남아 있다.
- 이후 상태: search results surface는 baseline fixture `SEARCH_RESULTS`와 required supporting fixture `SEARCH_RESULTS_UNPIN_ACTIONS`, 그리고 story `SearchResults`/`SearchResultsUnpinActions`를 통해 interactive callback 없이 pin/unpin label 변화를 드러내고, 이 task가 search preview pin label의 최신 canonical contract라는 점이 구현 handoff 기준으로 명확해진다.
- 확인 포인트: `PANEL_FIXTURES`의 다섯 canonical state key는 그대로 유지되고, supporting surface는 named fixture `SEARCH_RESULTS_UNPIN_ACTIONS`와 story `SearchResultsUnpinActions` 하나로만 고정된다. `WindowsPanelShell`과 package exports는 새 interactive surface 없이 그대로 남아야 한다.
- 관련 영역: `packages/ui/src/components/panels/windows/storybook/windowsPanelReferenceFixtures.ts`, `packages/ui/src/components/panels/windows/windowsPanelSearchBody/windowsPanelSearchBody.stories.tsx`, `packages/ui/src/components/panels/windows/windowsPanelShell/index.tsx`, `packages/ui/src/index.ts`, `packages/ui/package.json`, `plans/windows-taskbar-02-windows-panel/phases/03-search-states-and-public-wiring.md`, `plans/windows-taskbar-07-fluent-icon-adoption/phases/03-fluent-affordance-icons.md`
- 시작 조건: Phase 1의 `previewPinState` input winner와 label winner rule이 이미 고정돼 있어야 한다.
- 상세: `./phases/02-story-fixture-and-legacy-consistency.md`
