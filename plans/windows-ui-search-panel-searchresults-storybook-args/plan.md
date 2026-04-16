**Branch:** refactor/windows-ui-search-panel-searchresults-storybook-args

> Worktree dir: `worktrees/windows-ui-search-panel-searchresults-storybook-args` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 먼저 `사전 합의`와 `전체 작업 지도`에서 이번 변경의 기준과 흐름을 보고, 아래 phase 카드에서 어떤 파일이 어떻게 바뀌는지와 무엇을 확인해야 하는지를 본다.
> 기술적인 입력/출력 계약, owner_agent, 세부 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows UI SearchPanel `searchResults`와 Storybook args 정리 실행 계획

## 사전 합의

| 항목 | 합의 내용 | 적용 phase | 메모 |
| --- | --- | --- | --- |
| SearchPanel public prop | `SearchPanel` public prop은 `results` 대신 `searchResults`를 canonical 이름으로 쓴다. `SearchPanel` symbol/export는 유지하고, legacy `results` alias는 두지 않는다. | Phase 1 | inherited native host prop에서도 `results`를 제거해 old name이 다시 public surface로 보이지 않게 한다. |
| 내부 surface 유지 | 이번 rename은 `SearchPanel` public surface에만 적용한다. `PanelSearchResultsView`, `WindowsPanelSearchView`, compare state key, fixture case key 같은 내부/인접 surface의 `results` naming은 그대로 둔다. | Phase 1 / Phase 2 | `query-results`, `results-reference` 같은 state key는 바꾸지 않는다. |
| Storybook 수리 방향 | `StoryObj<typeof meta>` 경고는 `meta.component`를 유지한 채 required props를 `args`로 드러내는 방식으로 정리한다. wrapper/composition story는 `render(args)`를 쓰고, compare/harness story는 필요하면 baseline `args`를 주되 title/file topology는 바꾸지 않는다. | Phase 1 / Phase 2 | 이번 패스에서 story 파일 분리나 taxonomy 이동은 하지 않는다. |
| 검증 경계 | 현재 `packages/ui`의 전체 `tsc` 출력에는 이번 task 밖의 red가 섞여 있다. 그래서 이 계획은 변경 파일을 겨냥한 filtered `tsc` audit와 `pnpm --filter @windows/ui build-storybook`를 package-level 검증 경계로 쓴다. | 전체 | `taskbarContextMenu.test.tsx`, `windowsPanelSearchView.test.tsx`의 기존 red는 read-only baseline으로만 취급한다. |
| 테스트 생성 정책 | 이번 계획은 구현 scope를 다루지만 `architect`는 source-tree tests를 만들지 않는다. 이후 `plan-materializer`가 `SearchPanel` contract rename에 필요한 test owner를 결정한다. | 전체 | `materialize.md`는 추후 단계에서 생성된다. |

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. SearchPanel contract rename 정리 | `SearchPanel` public prop을 `searchResults`로 바꾸고, search-owned story/fixture/doc comment를 같은 계약으로 맞춘다. | `SearchPanel` public surface에서 `results`가 사라지고, `ComponentPropsWithoutRef<"div">`와의 충돌 없이 search story mount가 새 prop명만 사용한다. | search-owned canonical prop contract, filtered typecheck 대상, unchanged internal `results` surfaces |
| Phase 2. Required-prop Storybook args 정리 | required props가 있는 leaf stories를 `args` 기반으로 정리하고 compare/harness story의 controls/docs 정책까지 고정한다. | Storybook 8의 `StoryObj<typeof meta>` 타입이 요구하는 `args` contract가 affected story files에서 닫히고, 기존 title/kind/state inventory는 그대로 유지된다. | later implementation과 `plan-materializer`가 그대로 따를 story contract, docs/controls policy, package validation checklist |

## 단계별 실행

### Phase 1. SearchPanel contract rename 정리

- 목적: `SearchPanel` public payload에서 `results`를 retire하고 `searchResults`만 canonical input으로 남기면서, search-owned story/fixture/docs도 같은 naming으로 닫는다.
- 변경 내용: `SearchPanelProps`는 native `div` pass-through에서 `results`를 제외한 뒤 `searchResults`를 custom prop으로 연다. `SearchPanel` component JSDoc, winner rule 설명, `searchPanel.stories.tsx`, `searchPanelContext.stories.tsx`, `searchPanelReferenceFixtures.ts`는 모두 `searchResults.length` 기준 문구와 mount shape로 맞춘다. internal `PanelSearchResultsView`와 `WindowsPanelSearchView`의 `results` naming은 건드리지 않는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/search/searchPanel/index.tsx` | 교체/정리 | `SearchPanel` public prop이 `searchResults`로 단일화되고 native host `results` 충돌이 제거된다. | component signature와 JSDoc에 legacy public `results`가 남지 않는다. |
| `packages/ui/src/components/panels/search/searchPanel/searchPanel.stories.tsx` | 교체 | canonical query-present stories가 `searchResults` args로 mount되고 compare stories도 같은 prop명을 따른다. | standalone/compare stories 모두 old prop 없이 `StoryObj` contract를 충족한다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx` | 교체 | Search compose/context story가 `searchResults` prop으로 host surface를 mount한다. | `results-reference` state key는 유지하면서 component mount prop만 새 이름으로 바뀐다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts` | 정리 | canonical fixture payload와 condition 설명이 `searchResults` naming으로 정리된다. | fixture export field와 문서 comment가 SearchPanel public contract와 같은 언어를 쓴다. |

- 이전 상태: `SearchPanel` public prop이 `results`라서 inherited host prop과 충돌하고, search-owned stories/fixtures도 old prop명을 그대로 써서 `number & SearchResult[]` 타입 오류와 Storybook story drift가 동시에 발생한다.
- 이후 상태: `SearchPanel` public input은 `query`, `title`, `searchResults`, `emptyTitle`, `emptyDescription`로만 설명되고, search-owned canonical stories/fixtures는 같은 payload shape를 공유한다. internal shared renderer와 windows search surface는 기존 `results` contract를 계속 쓴다.
- 완료 조건: SearchPanel component 정의 자체가 native host `results`를 `Omit`으로 제거하고 public field/parameter로 legacy `results`를 더 이상 받지 않음을 직접 증명해야 한다. 그 위에서 search-owned stories/fixtures에서도 old prop reference가 제거되고, filtered `tsc` audit에서 SearchPanel 관련 `number & SearchResult[]` 또는 missing `args` 오류가 사라져야 한다. `pnpm --filter @windows/ui build-storybook`도 search branch 기준으로 통과해야 한다.
- 관련 영역: `packages/ui/src/components/panels/shared/panelSearchResultsView/index.tsx`, `packages/ui/src/components/panels/windows/windowsPanelSearchView/index.tsx`, `packages/ui/src/components/panels/search/searchPanelDefaultView/searchPanelDefaultView.stories.tsx`, `packages/ui/src/index.ts`, `plans/windows-taskbar-03-search-panel/**`
- 시작 조건: `none`
- 상세: `./phases/01-search-panel-contract-rename.md`

### Phase 2. Required-prop Storybook args 정리

- 목적: required props가 있는 component story files를 `args`-first contract로 정리해 Storybook 8 타입 경고를 닫되, current taxonomy와 compare state inventory는 다시 열지 않는다.
- 변경 내용: `ContextPanel`, `TaskbarContextMenu`, `TaskbarHoverPreview`, `WindowsPanelAllView`, `WindowsPanelPinnedView`, `WindowsPanelSearchView` story files는 required props를 `meta.args` 또는 per-story `args`로 명시하고, wrapper render는 `render(args)` 형태로 바꾼다. compare/harness story는 baseline `args`를 두더라도 current title, compare kind/state, reference stage topology를 유지하고, args가 fixed capture scaffolding일 뿐인 export는 controls/docs 노출을 제한한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/context/contextPanel/contextPanel.stories.tsx` | 교체 | canonical Context panel stories가 required `items`를 args로 드러낸다. | standalone/compare exports 모두 render-only object가 아니게 된다. |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx` | 교체 | attached surface stories가 required callbacks/state payload를 args로 소유하고 harness story도 typed baseline을 가진다. | missing `args` 경고 없이 current context-pinned/context-unpinned inventory를 유지한다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx` | 교체 | hover preview stories가 required `items`/callbacks를 args로 소유하고 harness story는 fixed scaffold policy를 가진다. | missing `args` 경고 없이 hover-single/hover-multi inventory를 유지한다. |
| `packages/ui/src/components/panels/windows/windowsPanelAllView/windowsPanelAllView.stories.tsx` | 교체 | AllView stories가 required `title/backLabel/mode/sections`를 args로 드러낸다. | wrapper `WindowsPanel`은 유지하되 leaf contract가 args로 고정된다. |
| `packages/ui/src/components/panels/windows/windowsPanelPinnedView/windowsPanelPinnedView.stories.tsx` | 교체 | PinnedView stories가 required `title/actionLabel/items`를 args로 드러낸다. | `pinned-default` visual state와 title branch는 그대로 유지된다. |
| `packages/ui/src/components/panels/windows/windowsPanelSearchView/windowsPanelSearchView.stories.tsx` | 교체 | SearchView stories가 discriminated union required props를 args로 드러낸다. | `search-results` / `search-empty` state inventory와 previewPinState rule을 유지한 채 missing `args` 경고가 사라진다. |

- 이전 상태: affected story files가 `meta.component`를 유지하면서도 story object에는 `render`만 두고 있어서 Storybook 8이 required props를 `args`에서 찾지 못한다. compare/harness story도 typed payload owner가 없어 story contract와 docs/controls 노출 정책이 암묵적이다.
- 이후 상태: affected story files는 component catalog용 props를 `args`로 명시하고, wrapper/composition render는 그 args를 받아 leaf를 mount한다. compare/harness export는 fixed capture scaffolding임을 유지하면서 controls/docs 노출을 의도적으로 관리한다.
- 완료 조건: filtered `tsc` audit에서 Phase 2 대상 story files의 missing `args` 오류가 사라지고, story titles/compare kind/state key가 기존 inventory와 동일해야 한다. `pnpm --filter @windows/ui build-storybook`가 통과하고, new story file split 없이 기존 file topology가 유지돼야 한다.
- 관련 영역: `packages/ui/src/components/panels/search/searchPanel/searchPanel.stories.tsx`, `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx`, `packages/ui/src/components/panels/windows/storybook/comparePanelStage.tsx`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`, `packages/ui/src/components/panels/search/searchPanelDefaultView/searchPanelDefaultView.stories.tsx`, `plans/windows-ui-storybook-taxonomy-governance/**`
- 시작 조건: Phase 1에서 SearchPanel public naming과 search-owned story contract가 먼저 `searchResults` 기준으로 고정돼 있어야 한다.
- 상세: `./phases/02-storybook-required-args-cleanup.md`
