**Branch:** feat/windows-taskbar-12-context-panel-family

> Worktree dir: `worktrees/windows-taskbar-12-context-panel-family` (plan 폴더명과 동일)
> 이 문서는 controller가 새 `ContextPanel` family의 범위, phase 순서, 파일 경계, 검토 포인트를 한 번에 확인하는 실행형 계획서다.
> 기술적인 입력/출력 계약, owner_agent, 세부 작업, 검증 체크리스트는 각 phase 상세 문서에서 닫는다.

# Windows Taskbar ContextPanel family 실행 계획

## 사전 합의

| 항목 | 합의 내용 | 적용 phase | 메모 |
| --- | --- | --- | --- |
| 새 family 위치 | 새 reusable family는 `packages/ui/src/components/panels/context` 아래에 둔다. | Phase 1 / Phase 2 | `ContextPanel` canonical owner만 이 경계를 쓴다. |
| 공개 surface | package public surface는 `packages/ui/src/index.ts`에서 `ContextPanel`로 공개한다. | Phase 2 | 전체 export inventory를 새 product contract로 고정하지는 않는다. |
| UI only 범위 | right-click detection, positioning, anchor logic, provider/store, open/close, click-away, keyboard handling은 전부 범위 밖이다. | 전체 | visual leaf + host composition까지만 닫는다. |
| surface 축소 | v1 surface는 action-list only이며 title, header, footer, arrow는 넣지 않는다. | Phase 1 / Phase 2 | menu shell grammar만 소유한다. |
| 폭 고정 | menu width는 200px로 고정한다. | Phase 1 / Phase 4 | caller가 폭을 다시 정하지 않는다. |
| 기본 props | public props는 `items[]`와 optional `onAction(id)` 패턴을 기준으로 잡는다. | Phase 1 | native `div` pass-through는 기존 panel 관례에 맞춰 허용한다. |
| item contract | 각 item은 `id`, `label`, optional `description`, optional `icon: ReactNode`, optional `disabled`를 가진다. | Phase 1 / Phase 2 | v1에서 `danger`, `dividerBefore`는 열지 않는다. |
| description 의미 | `description`은 visible second line이 아니라 tooltip/assistive metadata다. | Phase 1 | row 높이나 text layout을 늘리면 안 된다. |
| icon optionality | `icon`이 없으면 reserved slot 없이 label이 바로 정렬돼야 한다. | Phase 1 / Phase 4 | blank spacer나 ghost icon 금지 |
| disabled 지원 | disabled row는 API와 story에 포함한다. | Phase 1 | later materialize가 no-op path를 추측하지 않게 한다. |
| story taxonomy | `Context Panel/Panel` canonical story와 `Windows Panel/Context`, `Search Panel/Context` composition story를 분리한다. | Phase 2 | host 예시는 canonical contract owner가 아니다. |
| 실사용 composition inventory | composition/compare inventory는 live site에서 합의된 8개 실사용 case를 그대로 owner로 가진다. | Phase 2 / Phase 3 / Phase 4 | synthetic 4+4 bucket으로 다시 축약하지 않는다. |
| literal row inventory | host composition은 case별 row text와 icon recipient를 literal하게 적는다. Search host는 `taskSearchLeftPanel`의 `파일 실행`, `파일 위치 열기`, 시작/taskbar pin-or-remove winner를 직접 source-of-truth로 쓴다. | Phase 2 | hidden inheritance 금지 |
| compare coverage | canonical compare와 composition compare를 둘 다 만든다. 외부 reference compare는 실사용 composition 8개만 대상으로 하고, canonical compare는 package-local machine surface로 유지한다. | Phase 2 / Phase 3 / Phase 4 | role 분리 |
| 기존 task04 처리 | `plans/windows-taskbar-04-attached-surfaces`의 taskbar-only `taskbarContextMenu`는 overlap reference일 뿐 target architecture가 아니다. | 전체 | taskbar fixed-row topology를 새 public contract로 가져오지 않는다. |
| visual source | visual/reference source of truth는 `https://seojaewan.com`과 `C:\Users\USER\Desktop\dev\blog` 원본 구현이다. | Phase 1 / Phase 3 / Phase 4 | repo-local compare artifact로 다시 고정한다. |

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 남는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. ContextPanel canonical contract 정리 | `packages/ui/src/components/panels/context/**` 아래에 standalone `ContextPanel` leaf와 canonical fixture/story owner를 만든다. | `ContextPanel` 자체의 public input, 200px shell, icon/description/disabled rule, canonical story inventory가 package source에서 singular contract로 닫힌다. | host가 그대로 소비할 수 있는 `items[]`/`onAction` contract와 canonical story state inventory |
| Phase 2. 실사용 composition과 공개 wiring 정리 | Windows/Search host composition story를 합의된 8개 실사용 case로 literal하게 분리하고, root export와 compare kind inventory를 맞춘다. | `ContextPanel`은 public export가 되고, 기존 panel canonical state는 그대로 두되 context-menu ownership은 `Windows Panel/Context` 7개 + `Search Panel/Context` 1개 실사용 case로 이동한다. | canonical compare inventory, 실사용 composition 8개 compare inventory, root export, host story ownership |
| Phase 3. reference 기반 composition compare 보고 | live/blog reference와 repo compare story를 짝지어 실사용 composition 8개 state의 capture/diff/report를 남긴다. canonical compare는 package-local machine surface로 유지한다. | 새 family에 대한 repo-local visual evidence가 생기고, 어떤 composition case가 통과했는지 또는 어디가 어긋났는지 inspectable report가 남는다. | failing composition case 목록 또는 pass 결과 |
| Phase 4. compare 결과 반영 closure | compare report가 지적한 composition visual mismatch만 source tree에서 바로 고치고 같은 inventory를 다시 통과시킨다. | `ContextPanel` family와 Windows/Search composition story가 reference와 local compare 양쪽에서 같은 계약으로 닫힌다. | 구현 handoff와 이후 `plan-materialize`가 그대로 쓸 수 있는 최종 visual contract |

## 단계별 실행

### Phase 1. ContextPanel canonical contract 정리

- 목적: reusable `ContextPanel` leaf의 public input과 기본 visual grammar를 package source 안에서 singular contract로 먼저 닫는다.
- 변경 내용: `ContextPanel`는 `items[]` + optional `onAction(id)`만 여는 200px action-list leaf가 된다. 각 row는 `id`, `label`, optional `description`, optional `icon`, optional `disabled`만 해석하고, `description`은 tooltip metadata로만 쓰며 second line을 만들지 않는다. icon이 없으면 빈 slot을 남기지 않고, disabled row는 visible style과 click no-op 규칙을 같이 가진다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/context/contextPanel/index.tsx` | 추가 | `ContextPanel` public props, 200px shell, row render winner rule이 한 곳에서 닫힌다. | `items`, `onAction`, `description`, `icon`, `disabled`, `200px` contract가 source에 드러난다. |
| `packages/ui/src/components/panels/context/contextPanel/contextPanel.stories.tsx` | 추가 | canonical story owner가 `ContextPanel` design/contract만 보여 준다. | default, iconless, disabled canonical story와 canonical compare entry가 분리돼 있다. |
| `packages/ui/src/components/panels/context/storybook/contextPanelReferenceFixtures.ts` | 추가 | story/compare가 같은 canonical fixture inventory를 공유한다. | canonical story state와 compare state의 역할이 fixture source에 분리돼 있다. |
| `packages/ui/src/components/panels/context/storybook/compareContextPanelStage.tsx` | 추가 | context family 전용 minimal compare wrapper가 생긴다. | canonical compare story가 host decoration 없이 `[data-visual-root]` surface로 닫힌다. |

- 이전 상태: `packages/ui/src/components/panels/**` 아래에 reusable context panel family가 없고, action-list visual grammar는 `PanelSearchResultsView` 내부 preview action group과 blog의 여러 left panel source에 흩어져 있다.
- 이후 상태: `ContextPanel` 자체만으로 icon/no-icon/disabled/description metadata rule을 설명할 수 있고, host composition이 이 leaf contract를 그대로 가져다 쓸 수 있다.
- 완료 조건: `ContextPanel` canonical source와 standalone story만 읽어도 public props, 200px width, non-visible description, no-icon no-slot, disabled no-op rule을 이해할 수 있어야 한다.
- 관련 영역: `packages/ui/src/components/panels/shared/panelSearchResultsView/index.tsx`, `plans/windows-taskbar-04-attached-surfaces/**`, `C:\Users\USER\Desktop\dev\blog\src\components\atoms\leftClickPanel/index.tsx`, `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskSearchLeftPanel/index.tsx`, `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskWindowsLeftPanel/index.tsx`
- 시작 조건: `none`
- 상세: `./phases/01-context-panel-canonical-contract.md`

### Phase 2. 실사용 composition과 공개 wiring 정리

- 목적: 새 canonical leaf를 실제 package-owned host composition에 접고, Windows/Search 실사용 8개 case의 row inventory와 compare ownership을 literal하게 닫는다.
- 변경 내용: composition stories는 synthetic pin buckets가 아니라 합의된 8개 실사용 case를 그대로 owner로 가진다. Story owner는 `Context Panel/Panel`(canonical), `Windows Panel/Context`(7개), `Search Panel/Context`(1개)로 분리한다. host fixture는 case별 row text와 icon recipient를 literal하게 적고, Search host는 `taskSearchLeftPanel`의 `파일 실행`, `파일 위치 열기`, 시작/taskbar pin-or-remove winner를 직접 source-of-truth로 쓴다. `@windows/ui` root export는 `ContextPanel`만 새로 공개한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/context/storybook/contextPanelHostRowInventories.ts` | 추가 | 실사용 8개 composition case의 exact row text/icon recipient와 case-to-row winner rule이 한 곳에 정리된다. | case 1~8이 literal row inventory와 함께 source에 드러나고, 공유 row inventory를 쓰는 경우도 winner rule이 명시된다. |
| `packages/ui/src/components/panels/windows/windowsPanelSearchView/windowsPanelSearchView.stories.tsx` | 정리 | panel canonical state story는 panel 상태만 owner로 남는다. | action variation을 위한 별도 owner가 생기고 이 파일은 `search-results`, `search-empty` canonical state만 설명한다. |
| `packages/ui/src/components/panels/windows/storybook/windowsPanelContextFixtures.ts` | 추가 | Windows host 7개 use case fixture가 고정된다. | `pinned-2025`, `pinned-values-and-types`, `pinned-homepage`, `pinned-data-types`, `all-pinned-2025`, `all-unpinned-reference`, `search-results-reference`가 literal row inventory와 함께 닫힌다. |
| `packages/ui/src/components/panels/windows/storybook/windowsPanelContext.stories.tsx` | 추가 | Windows host composition story owner가 생긴다. | 7개 Windows composition story와 7개 compare entry가 분리돼 있다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts` | 정리 | SearchPanel canonical state는 여전히 `default`, `query-results`, `query-empty` 3개뿐이다. | context-menu capture가 separate composition owner를 가진다는 note가 남고, SearchPanel canonical inventory는 늘어나지 않는다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelContextFixtures.ts` | 추가 | Search host 1개 use case fixture가 고정된다. | `results-reference`가 exact row text/icon recipient와 함께 닫힌다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx` | 추가 | Search host composition story owner가 생긴다. | 1개 Search composition story와 1개 compare entry가 분리돼 있다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 정리 | compare inventory는 `context-panel`, `windows-panel-context`, `search-panel-context` kind를 해석한다. | new kind/state recipient가 기존 panel/taskbar kind와 같이 capture 가능하다. |
| `packages/ui/src/index.ts` | 추가 | `ContextPanel` public export가 root entry에 연결된다. | root entry에서 `ContextPanel` import path가 stable하다. |

- 이전 상태: `Windows Panel/Search` story가 action label variant까지 같이 소유하고, SearchPanel canonical fixture 문서는 context-menu capture를 excluded note로만 남긴다. compare inventory에도 context host case를 식별할 kind/state가 없다.
- 이후 상태: `ContextPanel`는 public export로 고정되고, host-specific action menus는 `Windows Panel/Context` 7개 + `Search Panel/Context` 1개 실사용 case owner가 관리한다. 기존 panel canonical stories는 panel state만 설명하고 context-menu ownership을 다시 열지 않는다.
- 완료 조건: story source만 읽어도 canonical owner와 host composition owner가 분리돼 있고, compare inventory가 `context-panel/*`, `windows-panel-context/*`, `search-panel-context/*`를 stable recipient로 가진다는 점이 드러나야 한다. Search host row text/icon recipient가 `taskSearchLeftPanel` 기준으로 literal하게 닫혀 있어야 한다.
- 관련 영역: `plans/windows-taskbar-08-panel-pin-toggle-actions/**`, `plans/windows-taskbar-03-search-panel/**`, `plans/windows-taskbar-04-attached-surfaces/**`, `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskSearchLeftPanel/index.tsx`, `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskWindowsLeftPanel/index.tsx`
- 시작 조건: Phase 1의 `ContextPanel` public contract가 stable해야 하고, 실사용 8개 case와 row inventory mapping은 blog/live reference에서 literal하게 복원돼 있어야 한다.
- 상세: `./phases/02-host-composition-and-compare-topology.md`

### Phase 3. reference 기반 composition compare 보고

- 목적: 새 family의 host composition acceptance를 subjective direction이 아니라 repo-local capture/diff/report로 고정한다.
- 변경 내용: `visual-comparator`가 실사용 composition compare 8개(`windows-panel-context/*` 7개 + `search-panel-context/results-reference`)를 external reference와 나란히 캡처하고, pair별 diff와 pass/fail report를 `plans/windows-taskbar-12-context-panel-family` 아래에 남긴다. canonical compare inventory는 package-local machine surface로 유지하고 external acceptance inventory에는 포함하지 않는다. 기존 task04 capture는 overlap 참고만 하고 acceptance baseline으로 승격하지 않는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-taskbar-12-context-panel-family/reference-captures/` | 추가/정리 | live site/blog 기준 reference side capture가 composition 8개 pair별로 남는다. | composition 8개의 reference capture 목록이 inspectable하다. |
| `plans/windows-taskbar-12-context-panel-family/visual-compare/` | 추가/정리 | current story capture, diff artifact, pair별 판정 report가 남는다. | 각 kind/state마다 reference/current/diff/report recipient가 연결된다. |

- 이전 상태: 새 `ContextPanel` family에 대한 repo-local composition compare artifact가 없고, external direction은 live site와 blog source에만 흩어져 있다.
- 이후 상태: 구현 handoff나 review가 `kind/state -> capture -> diff -> 판정` 경로로 바로 확인할 수 있는 composition compare evidence가 plan folder에 남는다.
- 완료 조건: composition compare 8개가 모두 report에 등장하고, mismatch가 있으면 정확한 kind/state/file pair가 표시돼야 한다.
- 관련 영역: `https://seojaewan.com`, `C:\Users\USER\Desktop\dev\blog`, `packages/ui/src/components/panels/context/contextPanel/contextPanel.stories.tsx`, `packages/ui/src/components/panels/windows/storybook/windowsPanelContext.stories.tsx`, `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx`
- 시작 조건: Phase 2의 compare kind/state inventory와 story ownership이 stable해야 한다.
- 상세: `./phases/03-reference-compare-report.md`

### Phase 4. compare 결과 반영 closure

- 목적: compare report가 남긴 composition visual mismatch만 source tree에서 바로 닫고 최종 계약을 다시 통과시킨다.
- 변경 내용: Phase 3 report가 지적한 spacing, row density, icon gap, disabled styling, host composition label alignment 같은 visual drift만 Phase 1/2 write target 안에서 수정한다. 이 phase는 contract를 다시 열지 않고 same composition compare inventory를 재실행해 closure만 담당한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/context/**` | 조정 | canonical leaf visual mismatch를 report 기준으로 줄인다. | report가 지적한 canonical-adjacent drift가 사라지고 API가 다시 열리지 않는다. |
| `packages/ui/src/components/panels/windows/storybook/**` | 조정 | Windows composition story/capture drift를 정리한다. | Windows composition 7개 state가 report 재실행에서 pass한다. |
| `packages/ui/src/components/panels/search/storybook/**` | 조정 | Search composition story/capture drift를 정리한다. | Search composition 1개 state가 report 재실행에서 pass한다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 조정 | compare recipient drift가 있으면 최소 범위에서 바로잡는다. | compare rerun이 같은 inventory key를 계속 찾는다. |
| `plans/windows-taskbar-12-context-panel-family/visual-compare/` | 갱신 | rerun report가 final decision을 남긴다. | final report가 pass 또는 no-op closure를 명시한다. |

- 이전 상태: compare report가 존재하지만 일부 composition kind/state가 reference와 어긋날 수 있다.
- 이후 상태: same composition compare inventory 재실행 결과가 모두 pass하고, no-op이면 그 사실 자체가 final report에 남는다.
- 완료 조건: final compare report가 composition compare 8개를 모두 pass로 닫거나, 수정 불필요 no-op를 명시해야 한다.
- 관련 영역: Phase 1/2 write target 전체, `plans/windows-taskbar-12-context-panel-family/visual-compare/**`
- 시작 조건: Phase 3의 compare report가 정확한 failing kind/state recipient를 남겨야 한다.
- 상세: `./phases/04-visual-fix-closure.md`
