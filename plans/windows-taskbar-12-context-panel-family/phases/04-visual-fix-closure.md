# Phase 4. compare 결과 반영 closure

> 이 문서는 Phase 3 report가 남긴 mismatch를 same contract 안에서 닫는 마지막 phase다.
> compare report가 이미 전부 pass면 no-op closure로 끝나고, 그렇지 않으면 report가 지목한 write target만 최소 범위로 수정한다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Phase 3 report가 지목한 composition visual drift만 최소 범위로 수정하고 같은 inventory를 다시 pass시킨다. |
| 선행조건 | Phase 3의 compare report가 exact `kind/state` mismatch recipient를 남겨야 한다. |
| 완료 판단 | final rerun report가 composition compare 8개를 모두 pass로 닫거나, initial pass라면 no-op closure가 기록돼 있다. |
| 중단 조건 | mismatch를 고치려면 `ContextPanel` public API, 8개 composition inventory, compare kind/state naming, out-of-scope behavior를 다시 열어야 한다는 사실이 드러나면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/context/**` | 조정 | public prop surface와 canonical story inventory는 고정이다. visual drift만 수정한다. | canonical-adjacent drift가 사라지고 API가 다시 열리지 않는다. |
| `packages/ui/src/components/panels/windows/storybook/**` | 조정 | Windows composition 7-case inventory는 바뀌지 않는다. | same 7 cases가 rerun report에서 pass한다. |
| `packages/ui/src/components/panels/search/storybook/**` | 조정 | Search composition 1-case inventory는 바뀌지 않는다. | same 1 case가 rerun report에서 pass한다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 조정 | kind/state recipient naming은 유지한다. | rerun capture가 같은 inventory key를 계속 찾는다. |
| `plans/windows-taskbar-12-context-panel-family/visual-compare/` | 갱신 | final report는 initial fail/pass와 rerun 결과를 같이 읽을 수 있어야 한다. | final acceptance 상태가 report에 명시된다. |

### 완료 증거

- final report에 Windows 7개와 Search 1개 inventory key가 모두 pass로 표시된다.
- no-op closure라면 source tree write target 무수정과 initial pass가 report에 남아 있다.
- source tree 수정이 있더라도 public API와 story inventory 이름은 Phase 1/2 wording을 그대로 유지한다.

- owner_agent: `frontend-developer`
- 목적: compare mismatch를 source tree에서 실제로 닫되, 이미 고정한 `ContextPanel` API와 composition inventory를 다시 열지 않고 visual closure만 수행한다.
- boundary:
  - primary write target: `packages/ui/src/components/panels/context/**`
  - primary write target: `packages/ui/src/components/panels/windows/storybook/**`
  - primary write target: `packages/ui/src/components/panels/search/storybook/**`
  - primary write target: `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
  - primary write target: `plans/windows-taskbar-12-context-panel-family/visual-compare/`
  - execution contract reference: `packages/ui/package.json`
  - read-only prerequisite: `plans/windows-taskbar-12-context-panel-family/visual-compare/`
- input:
  - 시나리오: compare report가 exact composition case drift를 남긴 상태에서, maintainer가 same contract 안에서 visual mismatch만 닫으려는 경우
  - current state:
    - Phase 3 report가 Windows 7개 또는 Search 1개 case 일부의 mismatch를 지적할 수 있다.
    - report가 이미 모두 pass일 수도 있으며, 그 경우 이 phase는 no-op closure다.
- output:
  - 공개 계약:
    - composition compare inventory는 exact same 8개 key로 rerun된다.
    - `ContextPanel` public props, story owner title, compare kind/state naming은 바뀌지 않는다.
  - 내부 기본값:
    - fix 대상은 spacing, width adherence, row density, icon gap, disabled visual, host-specific row alignment 같은 visual grammar drift다.
    - report가 이미 pass면 source tree 무수정 no-op로 종료할 수 있다.
  - 중요한 negative output:
    - right-click detection, open/close logic, keyboard handling 같은 out-of-scope behavior를 이 phase에서 끌어오지 않는다.
    - 8개 composition case를 줄이거나 합치지 않는다.
    - taskbar-only `taskbarContextMenu`로 되돌아가지 않는다.
- 선행조건:
  - Phase 3 report가 exact `kind/state` recipient를 남겨야 한다.
- 제약:
  - same compare inventory를 유지한 채 mismatch만 줄여야 한다.
  - compare report가 이미 pass인 경우 쓸데없는 source cleanup을 하지 않는다.
- side effects:
  - rerun report가 final acceptance baseline이 된다.
  - source tree 수정이 있으면 영향 범위는 Phase 1/2 write target으로 제한된다.
- failure/validation: mismatch를 줄이려면 `ContextPanel` API, story title taxonomy, compare state inventory, exact row wording, icon recipient mapping을 다시 열어야 한다면 현재 plan boundary로는 닫을 수 없으므로 blocker다.
- 작업:
  - report가 지적한 composition drift를 host story owner와 `ContextPanel` visual grammar에서 고친다.
  - 필요할 때만 `compareRoot` recipient wiring을 최소 범위로 조정한다.
  - same inventory로 compare를 rerun하고 final report를 갱신한다.
- 검증:
  - [ ] final report가 Windows 7개와 Search 1개 inventory key를 모두 pass로 표시해야 한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 통과해 rerun 대상 story owner가 package build 경계에서 green이어야 한다.
  - [ ] `pnpm --filter @windows/ui test`가 통과해 visual drift 수정이 기존 package test 경계를 깨지 않아야 한다.
