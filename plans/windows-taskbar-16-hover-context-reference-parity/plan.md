**Branch:** fix/windows-taskbar-16-hover-context-reference-parity

> Worktree dir: `worktrees/windows-taskbar-16-hover-context-reference-parity` (plan 폴더명과 동일)
> 이 문서는 `@windows/ui`의 taskbar hover preview와 context panel만 대상으로, `C:/Users/USER/Desktop/dev/blog` 레퍼런스와 현재 interactive Storybook surface 사이의 위치, motion, close, content parity를 닫는 실행 계획이다. 기존 `windows-taskbar-15` 이하 slug는 read-only 참고로만 사용하고, 새 baseline inventory와 compare evidence는 이 slug 안에서만 만든다.
> 기술적인 입력/출력 계약, `owner_agent`, compare artifact, 상세 검증 명령은 각 phase 상세 문서에서 닫는다.

# Windows Taskbar hover/context reference parity 실행 계획

## 사전 합의

| 항목 | 합의 내용 | 적용 phase | 메모 |
| --- | --- | --- | --- |
| plan 경계 | 새 executable plan은 `windows-taskbar-16-hover-context-reference-parity` 아래에서만 작성하고, `windows-taskbar-15` 이하 slug는 read-only 참고로만 본다. | 전체 | 이전 slug의 plan artifact를 갱신하거나 재사용하지 않는다. |
| in-scope surface | 이번 범위는 taskbar `hover preview`와 `context panel` 두 surface만 포함한다. | 전체 | Windows panel, Search panel, generic ContextPanel family parity는 이번 phase 밖이다. |
| 핵심 acceptance | hover는 아이콘 중심 정렬, 느린 motion, 보이는 close/exit, 작동하는 close를 맞춘다. context는 아이콘 기준 x 유지, hover와 비슷한 y, 아래에서 위로 오는 motion, 작동하는 close/exit를 맞춘다. | Phase 2 / Phase 3 / Phase 4 / Phase 5 / Phase 6 | 사용자 확인 mismatch 7개가 그대로 core acceptance target이다. |
| parity 범위 | hover/context content parity와 state parity는 위 mismatch를 실제로 닫는 데 필요한 만큼만 포함한다. | Phase 1 / Phase 3 / Phase 4 / Phase 5 | 불필요한 family 확장이나 새 public state 추가를 열지 않는다. |
| no-regression | `useTaskbarHoverPreview`, `useTaskbarContextPanel`의 keyboard/a11y behavior는 no-regression 경계로만 다룬다. | Phase 2 / Phase 6 | hook API를 다시 여는 generic placement 작업은 금지한다. |
| out-of-scope | Windows/Search panel parity, 다른 taskbar family, unrelated export cleanup은 포함하지 않는다. | 전체 | compare drift가 있어도 이 범위를 넘어가는 fix는 blocker로 남긴다. |
| order 규칙 | hover card 순서와 context row 순서는 blog reference 순서를 그대로 따른다. | Phase 3 / Phase 4 | fixture source와 compare owner가 같은 순서를 공유해야 한다. |
| reference provenance | canonical baseline은 `C:/Users/USER/Desktop/dev/blog` source-derived evidence와 이 slug의 local capture로 고정하고, 기존 slug capture는 documentary support로만 분류한다. | Phase 1 / Phase 5 | old capture를 새 pass/fail baseline으로 승격하지 않는다. |

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. 레퍼런스 기준 고정 | hover/context acceptance를 두 개의 canonical compare key와 supporting observation으로 다시 고정하고, baseline provenance를 새 slug 안에 정리한다. | `taskbar-hover-preview/attached-multi`, `taskbar-context-menu/attached-pinned` 두 key만 canonical baseline으로 굳어지고, motion/close 관련 참고 근거는 supporting observation으로 분리된다. | plan-local baseline inventory, supporting observation, compare artifact naming rule |
| Phase 2. 공통 motion/close foundation 정리 | 실제 CSS motion source, root animation 종료 경로, interactive story host close wiring을 하나의 visible close path로 묶고 runtime-proof test로 증명한다. | hover/context가 `closing`을 실제로 볼 수 있는 repo-local motion source를 가지며, explicit close·Escape·outside dismiss가 같은 종료 경로로 모인다. | 공통 motion token, story host close contract, runtime-proof evidence |
| Phase 3. hover preview parity 정리 | hover attached host의 아이콘 중심 정렬, fixture order, compare owner surface를 레퍼런스 기준으로 맞춘다. | hover multi open 상태가 trigger 중심에 붙고, compare story/test가 `taskbar-hover-preview/attached-multi` key를 소유한다. | hover compare owner, hover fixture order, hover parity validation |
| Phase 4. context panel parity 정리 | context attached host의 세로 기준선, row order, compare owner surface를 레퍼런스 기준으로 맞춘다. | context pinned open 상태가 hover와 비슷한 높이로 붙고, compare story/test가 `taskbar-context-menu/attached-pinned` key를 소유한다. | context compare owner, context fixture order, context parity validation |
| Phase 5. 레퍼런스 compare 보고 | Phase 1 baseline과 Phase 3~4 current compare story를 같은 key로 캡처·diff·report해서 pass/fail을 남긴다. | 두 compare key에 대해 reference/current/diff/report artifact가 같은 naming으로 남고, provenance가 분리된 inspectable report가 생긴다. | exact mismatch recipient, diff artifact, pass/fail report |
| Phase 6. compare drift closure | Phase 5 report가 지목한 hover/context drift만 최소 범위로 수정하고 같은 key로 rerun해 closure를 닫는다. | report가 같은 두 key로 최종 pass 또는 explicit no-op closure를 남기고, 범위 밖 drift는 blocker로 분리된다. | 최종 compare report, targeted fix validation, implementation handoff-ready state |

## 단계별 실행

### Phase 1. 레퍼런스 기준 고정

- 목적: hover/context acceptance가 blog source, old slug capture, local compare story 사이에서 흔들리지 않도록 새 slug 안에 canonical baseline과 supporting evidence를 다시 고정한다.
- 변경 내용: `taskbar-hover-preview/attached-multi`, `taskbar-context-menu/attached-pinned` 두 key만 canonical compare inventory로 기록하고, motion speed, close visibility, exit 확인처럼 정적 screenshot 하나로 닫을 수 없는 근거는 supporting observation으로 분리한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-taskbar-16-hover-context-reference-parity/reference-captures/baseline-inventory.md` | 추가 | 두 canonical compare key의 source path, capture filename, provenance, state role이 한 문서에 고정된다. | inventory만 읽어도 canonical key 2개와 각 artifact recipient를 재현할 수 있다. |
| `plans/windows-taskbar-16-hover-context-reference-parity/reference-captures/supporting-observations.md` | 추가 | motion/close 근거, old slug capture, source-code note가 supporting observation으로만 분리된다. | supporting note가 compare state를 늘리지 않고 documentary support 역할만 설명한다. |
| `plans/windows-taskbar-16-hover-context-reference-parity/reference-captures/` | 추가/정리 | later compare가 바로 읽을 수 있는 plan-local baseline image naming이 정해진다. | 두 canonical key의 baseline filename이 plan-local artifact로 고정돼 있다. |

- 이전 상태: blog source file, old slug capture, 현재 Storybook 관찰이 섞여 있어서 어떤 이미지와 어떤 source note가 pass/fail baseline인지 plan-local 기준이 없다.
- 이후 상태: compare와 구현이 둘 다 같은 key와 provenance vocabulary를 보고 움직일 수 있고, supporting observation이 canonical state를 다시 열지 못한다.
- 완료 조건: 새 slug 아래 baseline inventory가 canonical key를 정확히 2개만 선언하고, supporting observation이 motion/close reference를 documentary support로만 분류한다.
- 관련 영역: `C:/Users/USER/Desktop/dev/blog/src/components/molecules/taskHoverPanel/index.tsx`, `C:/Users/USER/Desktop/dev/blog/src/components/molecules/taskLeftClickPanel/index.tsx`, `C:/Users/USER/Desktop/dev/blog/src/hooks/useShowTaskPanel/index.tsx`, `plans/windows-taskbar-04-attached-surfaces/reference-captures/**`
- 시작 조건: `none`
- 상세: `./phases/01-reference-baseline-freeze.md`

### Phase 2. 공통 motion/close foundation 정리

- 목적: hover/context attached surface가 실제 animation 종료를 가지는 repo-local motion source와 visible close path를 공유하게 만든다.
- 변경 내용: shared motion token/keyframe source를 repo 안으로 끌어오고, interactive story host에서 hover close affordance와 context close action이 `closing`을 보인 뒤 finalize되는 같은 경로를 타도록 정리한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/tailwind-config/src/theme.css` | 교체 | `animate-task-up`, `animate-task-down`, `@keyframes task-up`, `@keyframes task-down`가 repo-local owner로 고정된다. | Storybook과 package runtime이 같은 motion token을 읽고 root animationend를 발생시킬 수 있다. |
| `packages/ui/src/components/panels/taskbarAttachedSurface/motion.ts` | 교체 | helper class name, direction, 종료 규칙이 `theme.css`와 1:1로 맞는다. | class literal과 comment가 실제 CSS source와 드리프트하지 않는다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 교체 | hover close affordance, context close-all, Escape, outside dismiss가 같은 visible close path를 탄다. | story host에 no-op close callback이 남지 않고 `closing` phase가 관찰된다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx` | 교체 | explicit close, Escape, outside dismiss, visible closing을 runtime-proof로 검증한다. | repo-local story render만으로 close path와 motion observability를 증명할 수 있다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.test.tsx` | 정리 | leaf가 root animationend를 closing finalize signal로 유지하는지 다시 고정한다. | hover leaf test가 motion helper와 visible close contract를 따라간다. |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.test.tsx` | 정리 | context leaf도 root animationend와 fixed row topology를 유지한 채 visible close contract를 따른다. | context leaf test가 motion helper와 close path를 함께 검증한다. |

- 이전 상태: Storybook host close wiring이 surface별로 갈라져 있고, repo-local CSS motion source가 비어 있어 close/exit를 실제로 확인하기 어렵다.
- 이후 상태: hover/context 모두 actual CSS motion을 가진다. explicit close·Escape·outside dismiss가 같은 종료 경로를 타며, runtime-proof test가 그 사실을 repo 안에서 다시 확인한다.
- 완료 조건: `theme.css`가 motion keyframe/token을 정의하고, runtime-proof test가 hover close affordance와 context close-all을 눌렀을 때 `closing` 또는 unmount를 직접 증명한다.
- 관련 영역: `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/index.ts`, `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/index.ts`, `C:/Users/USER/Desktop/dev/blog/src/app/globals.css`
- 시작 조건: Phase 1의 baseline key와 supporting observation 분류가 고정돼 있어야 한다.
- 상세: `./phases/02-shared-motion-close-foundation.md`

### Phase 3. hover preview parity 정리

- 목적: hover preview가 실제 icon 중심선에 붙고, reference 순서와 같은 content owner를 가진 compare surface를 갖게 만든다.
- 변경 내용: hover fixture order를 reference 순서로 다시 고정하고, attached host compare harness/story/test를 추가해 leaf-only compare와 분리된 `taskbar-hover-preview/attached-multi` owner를 만든다. 필요하면 leaf width/layout rule도 같은 boundary 안에서 조정한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewFixtures.ts` | 교체 | `HOVER_MULTI` item 순서와 label이 blog reference 순서를 그대로 따른다. | fixture source만 읽어도 hover card order가 reference와 일치한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreviewCompareHarness.tsx` | 추가 | trigger icon과 hover surface를 함께 렌더링하는 attached-host compare owner가 생긴다. | wrapper left가 고정 `50%`가 아니라 trigger 중심과 실제 open width에서 파생된다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.stories.tsx` | 추가 | `CompareAttachedMulti` export가 `taskbar-hover-preview/attached-multi` compare recipient를 소유한다. | compare story가 정확히 하나의 `[data-visual-root][data-visual-kind="taskbar-hover-preview"][data-visual-state="attached-multi"]`를 노출한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.test.tsx` | 추가 | compare root kind/state와 attached-host owner를 test로 고정한다. | test가 `taskbar-hover-preview/attached-multi` key를 직접 검증한다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/index.tsx` | 조정 | leaf는 caller-owned `items` order와 `onCloseItem` contract를 유지한 채 reference density/layout에 맞춘다. | hover leaf가 새 public prop을 열지 않고 reference order/layout만 따른다. |

- 이전 상태: hover attached host는 실제 open width보다 작은 기준으로 x를 잡아 아이콘 중심에서 밀리고, leaf-only state와 attached host state를 구분하는 compare owner도 없다.
- 이후 상태: hover multi open은 아이콘 중심에 붙은 attached-host compare surface로 재현되고, compare artifact와 fixture order가 같은 key와 같은 순서를 공유한다.
- 완료 조건: hover compare story/test가 `taskbar-hover-preview/attached-multi` key를 고정하고, runtime host나 compare harness 어디에서도 `left: 50%` 같은 taskbar-center 보정이 남지 않는다.
- 관련 영역: `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx`, `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx`, `C:/Users/USER/Desktop/dev/blog/src/components/atoms/taskIconButton/hooks/usePanel/index.tsx`, `C:/Users/USER/Desktop/dev/blog/src/components/molecules/taskHoverPanel/index.tsx`
- 시작 조건: Phase 2의 shared motion/close foundation이 살아 있어야 hover close와 exit visibility를 attached host에서 그대로 재사용할 수 있다.
- 상세: `./phases/03-hover-preview-reference-parity.md`

### Phase 4. context panel parity 정리

- 목적: context panel이 hover 기준선과 비슷한 높이에 붙고, reference row order를 가진 attached-host compare owner를 갖게 만든다.
- 변경 내용: context fixture order를 reference 순서로 고정하고, attached host compare harness/story/test를 추가한다. behavior host는 approximate `panelHeight` 대신 실제 menu height 기준 세로 규칙을 써서 너무 높은 y를 제거한다. leaf row topology와 motion direction은 유지한 채 density/layout만 reference로 맞춘다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuFixtures.ts` | 교체 | app row, app identifier, pin, close-all 순서에 쓰이는 fixture text와 row inventory가 reference 순서를 따른다. | fixture source와 compare owner가 같은 row order를 공유한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanelCompareHarness.tsx` | 추가 | trigger icon과 context surface를 함께 렌더링하는 attached-host compare owner가 생긴다. | vertical anchor가 approximate 280px 추정이 아니라 actual menu height 기준으로 계산된다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.stories.tsx` | 추가 | `CompareAttachedPinned` export가 `taskbar-context-menu/attached-pinned` compare recipient를 소유한다. | compare story가 정확히 하나의 `[data-visual-root][data-visual-kind="taskbar-context-menu"][data-visual-state="attached-pinned"]`를 노출한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.test.tsx` | 추가 | compare root kind/state와 attached-host owner를 test로 고정한다. | test가 `taskbar-context-menu/attached-pinned` key를 직접 검증한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 조정 | context behavior host도 compare harness와 같은 vertical anchor rule을 사용한다. | right-click open 상태가 hover panel과 비슷한 높이로 붙는다. |
| `packages/ui/src/components/panels/taskbarContextMenu/index.tsx` | 조정 | fixed row topology와 roving focus는 유지하면서 reference spacing, icon density, row ordering을 따른다. | context leaf가 keyboard/a11y contract를 유지한 채 row/layout parity를 맞춘다. |

- 이전 상태: context attached host는 approximate panel height에 묶여 위로 너무 높게 뜨고, attached host compare owner가 없어 leaf-only context state와 host alignment를 같은 증거로 검증할 수 없다.
- 이후 상태: context pinned open은 trigger 중심 x와 hover 근처 y를 가진 attached-host surface로 재현되고, compare artifact와 row order가 같은 key를 공유한다.
- 완료 조건: context compare story/test가 `taskbar-context-menu/attached-pinned` key를 고정하고, behavior host와 compare host 모두 같은 vertical anchor rule을 쓴다.
- 관련 영역: `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/index.ts`, `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.behavior.stories.tsx`, `C:/Users/USER/Desktop/dev/blog/src/hooks/useShowTaskPanel/index.tsx`, `C:/Users/USER/Desktop/dev/blog/src/components/molecules/taskLeftClickPanel/index.tsx`
- 시작 조건: Phase 3까지의 hover attached host key와 shared close/motion contract가 고정돼 있어야 context y를 hover 기준선과 같은 acceptance vocabulary로 비교할 수 있다.
- 상세: `./phases/04-context-panel-reference-parity.md`

### Phase 5. 레퍼런스 compare 보고

- 목적: blog-derived baseline과 current compare story를 같은 key로 캡처·diff·report해서 inspectable mismatch recipient를 남긴다.
- 변경 내용: plan-local `visual-compare` helper script와 report를 추가하고, current 쪽 Storybook recipient를 `taskbarHoverPreview.compare.stories.tsx#CompareAttachedMulti`, `taskbarContextPanel.compare.stories.tsx#CompareAttachedPinned`로 고정한다. 문서와 report의 canonical compare key는 항상 `taskbar-hover-preview/attached-multi`, `taskbar-context-menu/attached-pinned` literal을 쓰고, 파일명 stem만 `/`를 `--`로 치환한 `taskbar-hover-preview--attached-multi`, `taskbar-context-menu--attached-pinned`를 사용한다. static compare가 증명하지 못하는 motion/close acceptance는 Phase 2~4 runtime evidence로 분리 표기한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-taskbar-16-hover-context-reference-parity/visual-compare/run-diff.mjs` | 추가 | 두 canonical compare key를 literal slash form으로 유지하고, 파일명은 `/ -> --` stem 매핑만으로 current/diff artifact를 만든다. current 캡처는 두 Storybook recipient export에서만 읽는다. | script만 읽어도 어떤 key를 비교하는지, 어떤 Storybook recipient를 current로 캡처하는지, artifact 이름이 어떻게 파생되는지까지 기계적으로 추적된다. |
| `plans/windows-taskbar-16-hover-context-reference-parity/visual-compare/report.md` | 추가/갱신 | provenance, size match, diff result, verdict, supporting note가 key별로 기록된다. | report가 두 key 모두의 pass/fail과 provenance를 한 표에서 보여 준다. |
| `plans/windows-taskbar-16-hover-context-reference-parity/visual-compare/` | 추가/정리 | current capture, diff artifact, report가 같은 key naming을 공유한다. | 파일명만 읽어도 reference/current/diff/report가 같은 case를 가리킨다. |

- 이전 상태: hover/context attached host는 compare key, current capture recipient, diff report가 plan-local evidence로 묶여 있지 않다.
- 이후 상태: 두 compare key에 대해 provenance가 분리된 repo-local diff evidence가 남고, Phase 6이 받아야 하는 exact mismatch recipient와 `/ -> --` stem 매핑이 문서화된다.
- 완료 조건: `visual-compare/report.md`가 두 key를 모두 literal slash form으로 기록하고, current 캡처가 두 Storybook recipient export에서만 생성되며, reference/current/diff/report artifact naming이 같은 compare key에서 `/ -> --` 매핑으로만 파생된다는 점이 파일명과 표에 동시에 드러난다.
- 관련 영역: `plans/windows-taskbar-16-hover-context-reference-parity/reference-captures/**`, `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.stories.tsx`, `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.stories.tsx`
- 시작 조건: Phase 4까지의 compare owner story와 baseline inventory가 모두 고정돼 있어야 한다.
- 상세: `./phases/05-reference-compare-report.md`

### Phase 6. compare drift closure

- 목적: Phase 5 report가 지목한 hover/context drift만 최소 범위로 수정하고 같은 key로 rerun해 closure를 닫는다.
- 변경 내용: report가 pass면 no-op closure로 끝내고, mismatch가 남아 있으면 Phase 2~4 boundary 안의 file만 다시 열어 exact drift만 수정한다. Phase 5가 고정한 canonical compare key literal과 `/ -> --` filename stem 매핑을 그대로 재사용하고, no-regression hook boundary와 out-of-scope surface는 다시 열지 않는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/tailwind-config/src/` | 조정 | motion timing이나 keyframe drift가 report와 직접 연결될 때만 최소 수정한다. | compare report가 같은 key로 다시 green이거나 no-op closure note를 남긴다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/**` | 조정 | hover visual drift만 줄이고 attached-host key와 item order는 유지한다. | hover fix가 compare key를 바꾸지 않고 mismatch만 줄인다. |
| `packages/ui/src/components/panels/taskbarContextMenu/**` | 조정 | context visual drift만 줄이고 row order와 keyboard contract는 유지한다. | context fix가 compare key를 바꾸지 않고 mismatch만 줄인다. |
| `packages/ui/src/interactive/taskbar/storybook/**` | 조정 | compare/behavior host drift만 줄이고 baseline vocabulary는 유지한다. | story owner와 key naming이 Phase 3~5 wording과 동일하다. |
| `plans/windows-taskbar-16-hover-context-reference-parity/visual-compare/report.md` | 갱신 | rerun verdict 또는 no-op closure reason이 같은 canonical key literal과 filename stem 매핑을 유지한 채 남는다. | final report가 같은 두 key에 대한 마지막 상태를 slash key와 stem mapping 규칙까지 흔들림 없이 명시한다. |

- 이전 상태: mismatch가 있더라도 어느 파일 경계가 drift를 소유하는지 Phase 5 report 없이는 모호하다.
- 이후 상태: final report가 같은 두 key와 같은 stem mapping으로 pass 또는 explicit no-op closure를 남기고, scope 밖 drift는 blocker로 분리된다.
- 완료 조건: final report가 같은 compare key literal을 유지한 채 최종 상태를 적고, 수정이 있었다면 targeted validation과 rerun compare가 같은 stem mapping 규칙 아래 같이 기록된다.
- 관련 영역: Phase 2~5 write target 전체, `C:/Users/USER/Desktop/dev/blog` read-only reference
- 시작 조건: Phase 5 report가 exact mismatch recipient를 남겨야 한다.
- 상세: `./phases/06-visual-drift-closure.md`
