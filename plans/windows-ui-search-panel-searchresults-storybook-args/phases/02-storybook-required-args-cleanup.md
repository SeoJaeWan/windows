# Phase 2. Required-prop Storybook args 정리

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | required props가 있는 affected story files를 `args`-first contract로 정리해 Storybook 8 missing `args` 경고를 닫는다. |
| 선행조건 | Phase 1에서 `SearchPanel` public naming과 search-owned story contract가 이미 `searchResults` 기준으로 고정돼 있어야 한다. |
| 완료 판단 | affected story files가 모두 required props를 `args`로 드러내고, current title/compare kind/state inventory는 바꾸지 않은 채 typecheck 경고가 사라진다. |
| 중단 조건 | args 정리만으로 끝내려던 범위가 story file split, taxonomy 변경, compare inventory 변경까지 요구하게 되면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/context/contextPanel/contextPanel.stories.tsx` | 교체 | leaf component stories는 required `items`를 public story args로 드러내고 wrapper render는 `render(args)`를 쓴다. | standalone/compare stories 모두 render-only object가 아니게 된다. |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx` | 교체 | attached surface stories는 required callbacks/state payload를 args owner로 가진다. harness export는 baseline args가 필요해도 current runtime mount와 title을 유지한다. | `ContextPinned`, `ContextUnpinned`, compare stories, `InteractiveHarness` 모두 missing `args` 없이 남는다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx` | 교체 | hover preview stories는 required `items`/callbacks를 args owner로 가진다. fixed-capture compare/harness export는 controls/docs 노출을 제한할 수 있다. | hover-single/hover-multi inventory는 그대로 두고 missing `args` 경고만 없어진다. |
| `packages/ui/src/components/panels/windows/windowsPanelAllView/windowsPanelAllView.stories.tsx` | 교체 | wrapper `WindowsPanel`은 유지하되 leaf `WindowsPanelAllView` required props를 args로 드러낸다. | `all-list`, `all-index` stories가 args-backed leaf contract를 가진다. |
| `packages/ui/src/components/panels/windows/windowsPanelPinnedView/windowsPanelPinnedView.stories.tsx` | 교체 | `WindowsPanelPinnedView` required props를 args로 고정하고 current wrapper/layout은 유지한다. | `pinned-default` stories에서 missing `args` 경고가 사라진다. |
| `packages/ui/src/components/panels/windows/windowsPanelSearchView/windowsPanelSearchView.stories.tsx` | 교체 | discriminated union props는 story별 args에서 winner를 명시한다. `previewPinState`가 필요한 results mode와 empty mode를 story contract에서 구분한다. | `search-results` / `search-empty` stories가 union branch를 args로 정확히 표현한다. |

### 완료 증거

- affected story files가 모두 `StoryObj<typeof meta>`가 요구하는 `args` surface를 가지고, wrapper render는 그 args를 leaf component mount에 사용한다.
- compare kind, state key, title taxonomy, reference stage layout은 바뀌지 않는다.
- filtered `tsc` audit에서 Phase 2 story files의 missing `args` 경고가 사라진다.

- owner_agent: `frontend-developer`
- 목적: current Storybook file topology를 유지한 채 required-prop component stories를 `args` owner contract로 명시하고, fixed capture/harness exports의 controls/docs policy도 명시적으로 닫는다.
- boundary:
  - primary write target: `packages/ui/src/components/panels/context/contextPanel/contextPanel.stories.tsx`
  - primary write target: `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx`
  - primary write target: `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx`
  - primary write target: `packages/ui/src/components/panels/windows/windowsPanelAllView/windowsPanelAllView.stories.tsx`
  - primary write target: `packages/ui/src/components/panels/windows/windowsPanelPinnedView/windowsPanelPinnedView.stories.tsx`
  - primary write target: `packages/ui/src/components/panels/windows/windowsPanelSearchView/windowsPanelSearchView.stories.tsx`
  - read-only validation context: `packages/ui/src/components/panels/search/searchPanel/searchPanel.stories.tsx`
  - read-only validation context: `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx`
  - read-only validation context: `packages/ui/src/components/panels/search/searchPanelDefaultView/searchPanelDefaultView.stories.tsx`
  - read-only validation context: `packages/ui/src/components/panels/windows/storybook/comparePanelStage.tsx`
  - read-only validation context: `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
  - execution contract reference: `packages/ui/package.json`
  - execution contract reference: `packages/ui/tsconfig.json`
  - read-only provenance: `plans/windows-ui-storybook-taxonomy-governance/**`
- input:
  - 시나리오: maintainer가 current Storybook titles와 compare inventory를 유지한 채 Storybook 8 `StoryObj<typeof meta>` missing `args` 경고만 닫고 싶은 경우
  - 선행 상태:
    - Phase 1이 SearchPanel 관련 rename과 search-owned story contract를 이미 정리해 두었다.
    - current taxonomy와 compare state inventory는 `windows-ui-storybook-taxonomy-governance` 이후 canonical review surface로 쓰이고 있다.
  - 현재 상태:
    - affected story files는 `meta.component`를 유지하지만 각 story object에는 `render`만 있고 required props를 `args`에 노출하지 않는다.
    - attached surface harness stories는 fixed scaffold를 렌더링하지만 typed baseline args owner가 없어 Storybook 8 typing을 만족하지 못한다.
    - full package `tsc` 출력에는 이번 phase 밖의 test-file red도 섞여 있어 file-scoped audit가 필요하다.
- output:
  - 공개 계약:
    - affected story files는 required leaf props를 `meta.args` 또는 per-story `args`로 명시한다.
    - wrapper/composition stories는 `render(args)`를 사용해 args를 leaf component mount에 전달한다.
    - compare/harness export가 baseline args를 써도 current title, compare kind, state key, reference stage topology는 유지한다.
    - args가 fixed capture scaffold일 뿐인 compare/harness story는 controls/docs 노출을 제한해 component catalog owner와 구분한다.
  - 내부 기본값:
    - `searchPanelDefaultView.stories.tsx`처럼 `meta.component`에 required props가 없는 story file은 이번 phase의 write target이 아니다.
    - story file split, new title branch, compare inventory rename은 이번 phase에서 하지 않는다.
  - 허용하지 않는 대안:
    - missing `args`를 피하려고 `meta.component`를 걷어내고 component catalog metadata를 잃는 선택
    - compare state key나 title taxonomy를 바꿔서 type 문제를 우회하는 선택
    - harness story를 별도 파일로 분리해 taxonomy를 다시 여는 선택
  - 중요한 negative output:
    - component public props는 이번 phase에서 바뀌지 않는다.
    - `compareRoot.tsx`와 `comparePanelStage.tsx`의 kind/state contract는 바뀌지 않는다.
    - source-tree tests는 이번 phase에서 추가/수정하지 않는다.
- 제약:
  - args 정리와 controls/docs policy는 같은 file 안에서 self-consistent해야 한다.
  - current file topology를 유지해야 하므로 baseline args가 필요한 harness story도 same file에서 해결한다.
  - full package `tsc`는 unrelated red가 있으므로 phase gate는 filtered audit로 닫는다.
- side effects:
  - attached surface story files는 callbacks와 phase 같은 fixed scaffold props를 `meta.args`로 올릴지 story-local args로 둘지 한 번에 정리해야 duplication이 줄어든다.
  - `WindowsPanelSearchView` stories는 discriminated union branch를 args에서 잘못 표현하면 `previewPinState` winner rule이 흐려질 수 있다.
- failure/validation: affected story files 중 하나라도 missing `args` 경고를 남기거나, args를 추가하는 과정에서 title/kind/state inventory가 drift하면 later implementation과 materialize가 stable story owner를 추측해야 하므로 blocker다.
- 작업:
  - `ContextPanel` stories를 args-backed leaf contract로 바꾸고 compare stories는 fixed capture policy를 명시한다.
  - `TaskbarContextMenu`와 `TaskbarHoverPreview` stories에서 callbacks/phase/items payload를 args owner로 옮기고 harness exports의 typed baseline/controls policy를 정리한다.
  - windows subview stories에서 required leaf props를 args로 올리고 wrapper `WindowsPanel` mount는 render 안에서 유지한다.
  - results-mode/empty-mode discriminated union을 `WindowsPanelSearchView` story args에 명시해 wrong branch inference를 막는다.
- 검증:
  - [ ] `pnpm exec tsc --noEmit -p packages/ui/tsconfig.json 2>&1 | rg "packages/ui/src/components/panels/context/contextPanel/contextPanel.stories.tsx|packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx|packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx|packages/ui/src/components/panels/windows/windowsPanelAllView/windowsPanelAllView.stories.tsx|packages/ui/src/components/panels/windows/windowsPanelPinnedView/windowsPanelPinnedView.stories.tsx|packages/ui/src/components/panels/windows/windowsPanelSearchView/windowsPanelSearchView.stories.tsx"` 결과가 비어 있어야 한다.
  - [ ] `rg -n "args:" ".\\packages\\ui\\src\\components\\panels\\context\\contextPanel\\contextPanel.stories.tsx" ".\\packages\\ui\\src\\components\\panels\\taskbarContextMenu\\taskbarContextMenu.stories.tsx" ".\\packages\\ui\\src\\components\\panels\\taskbarHoverPreview\\taskbarHoverPreview.stories.tsx" ".\\packages\\ui\\src\\components\\panels\\windows\\windowsPanelAllView\\windowsPanelAllView.stories.tsx" ".\\packages\\ui\\src\\components\\panels\\windows\\windowsPanelPinnedView\\windowsPanelPinnedView.stories.tsx" ".\\packages\\ui\\src\\components\\panels\\windows\\windowsPanelSearchView\\windowsPanelSearchView.stories.tsx"` 결과가 각 story file의 new args owner를 보여 줘야 한다.
  - [ ] `rg -n "title: \"Context/Components/Panel\"|title: \"Taskbar/Compose/ContextMenu\"|title: \"Taskbar/Compose/HoverPreview\"|title: \"Windows/Components/AllView\"|title: \"Windows/Components/PinnedView\"|title: \"Windows/Components/SearchView\"" ".\\packages\\ui\\src\\components\\panels"` 결과가 기존 taxonomy가 유지됨을 보여 줘야 한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 통과해 args-backed stories가 package Storybook build 경계에서 여전히 렌더링 가능해야 한다.
