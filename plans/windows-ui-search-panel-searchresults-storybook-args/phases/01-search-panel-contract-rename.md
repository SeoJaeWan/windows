# Phase 1. SearchPanel contract rename 정리

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | `SearchPanel` public prop을 `searchResults`로 단일화하고 search-owned stories/fixtures도 같은 naming으로 닫는다. |
| 선행조건 | `none` |
| 완료 판단 | SearchPanel public surface에서 legacy `results` prop이 사라졌음이 component 정의 자체에서 증명되고, search-owned story/fixture/typecheck 경계도 새 prop명만 사용한다. |
| 중단 조건 | `SearchPanel` rename을 internal `PanelSearchResultsView`나 `WindowsPanelSearchView`까지 같이 바꿔야 한다는 새 요구가 생기면 재계획한다. search-owned story files 밖의 consumer package 수정이 필요해지면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/search/searchPanel/index.tsx` | 교체/정리 | `SearchPanelProps`는 `Omit<ComponentPropsWithoutRef<"div">, "results">` 위에 `query`, `title`, `searchResults`, `emptyTitle`, `emptyDescription`만 public custom prop으로 올린다. old public `results` alias는 허용하지 않는다. | component signature, destructuring, winner-rule JSDoc이 모두 `searchResults` 기준이 된다. |
| `packages/ui/src/components/panels/search/searchPanel/searchPanel.stories.tsx` | 교체 | canonical query-present component stories는 `SearchPanel` public args를 직접 보여 주고, compare export는 same payload를 fixed capture scaffold로만 쓴다. | standalone/compare exports가 `searchResults` args를 가지고 `StoryObj` typing을 충족한다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx` | 교체 | compose/context story는 `results-reference` state key를 유지하되 host `SearchPanel` mount prop만 `searchResults`로 바꾼다. | Search compose story가 old prop 없이 새 public contract를 반영한다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts` | 정리 | SearchPanel canonical fixture payload와 condition 설명은 public prop winner를 그대로 반영해야 한다. state key `query-results` / `query-empty`는 유지한다. | fixture export field와 documentation comment가 `searchResults.length` 기준으로 정리된다. |

### 완료 증거

- `SearchPanel` public contract는 `query`, `title`, `searchResults`, `emptyTitle`, `emptyDescription`로만 설명되고, component 정의의 props type과 parameter destructuring 어디에도 legacy `results` prop alias가 남지 않는다.
- search-owned stories와 fixture exports가 새 prop명을 공유해 docs/comment drift 없이 같은 mount shape를 보여 준다.
- filtered `tsc` audit에서 SearchPanel 관련 `number & SearchResult[]`와 missing `args` 오류가 사라진다.

- owner_agent: `frontend-developer`
- 목적: `SearchPanel` public surface를 native host attr 충돌 없이 singular naming으로 다시 고정하고, search-owned story/fixture mount shape를 같은 phase에서 함께 정리한다.
- boundary:
  - primary write target: `packages/ui/src/components/panels/search/searchPanel/index.tsx`
  - primary write target: `packages/ui/src/components/panels/search/searchPanel/searchPanel.stories.tsx`
  - primary write target: `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx`
  - primary write target: `packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts`
  - read-only validation context: `packages/ui/src/components/panels/shared/panelSearchResultsView/index.tsx`
  - read-only validation context: `packages/ui/src/components/panels/windows/windowsPanelSearchView/index.tsx`
  - read-only validation context: `packages/ui/src/components/panels/search/searchPanelDefaultView/searchPanelDefaultView.stories.tsx`
  - read-only validation context: `packages/ui/src/index.ts`
  - execution contract reference: `packages/ui/package.json`
  - execution contract reference: `packages/ui/tsconfig.json`
  - read-only provenance: `plans/windows-taskbar-03-search-panel/**`
- input:
  - 시나리오: maintainer가 `SearchPanel` public prop 이름을 `results`에서 `searchResults`로 바꾸고, same package-owned stories/fixtures/docs가 그 새 contract를 그대로 따라가게 하려는 경우
  - 선행 상태:
    - `SearchPanel` symbol과 package root export는 이미 `@windows/ui` public surface로 고정돼 있다.
    - search canonical state inventory `default`, `query-results`, `query-empty`와 compare state key `results-reference`는 이미 review surface로 쓰이고 있다.
  - 현재 상태:
    - `SearchPanelProps`는 `ComponentPropsWithoutRef<"div">` 위에 `results?: SearchResult[]`를 얹어 host attr와 충돌한다.
    - `searchPanel.stories.tsx`와 `searchPanelContext.stories.tsx`는 old prop `results`를 그대로 쓰고, story object에는 `args`가 없어 SearchPanel 관련 type errors가 함께 난다.
    - `searchPanelReferenceFixtures.ts`의 condition/comment와 fixture payload도 public prop winner를 old naming으로 기록하고 있다.
- output:
  - 공개 계약:
    - `SearchPanel` public custom prop은 `query`, `title`, `searchResults`, `emptyTitle`, `emptyDescription`다.
    - native host pass-through는 유지하되 `results`는 inherited surface에서 제거한다. old `results` prop alias는 허용하지 않는다.
    - `query === ""`이면 default view, `query !== "" && searchResults.length > 0`이면 query-results, `query !== "" && searchResults.length === 0`이면 query-empty가 canonical winner다.
    - search-owned stories/fixtures는 `searchResults` naming으로만 SearchPanel을 mount한다.
  - 내부 기본값:
    - `PanelSearchResultsView`와 `WindowsPanelSearchView`는 internal/adjacent surface로서 기존 `results` naming을 유지한다.
    - compare state key `query-results`, `query-empty`, `results-reference`와 title taxonomy는 그대로 유지한다.
  - 허용하지 않는 대안:
    - `results`와 `searchResults`를 동시에 받는 dual public prop
    - `PanelSearchResultsView`, `WindowsPanelSearchView`, frozen compare state key까지 같은 rename stream으로 끌어오는 선택
    - historical plan artifacts를 live migration target처럼 수정해 현재 implementation scope와 섞는 선택
  - 중요한 negative output:
    - package root export 이름 `SearchPanel`은 바뀌지 않는다.
    - `SearchPanelDefaultView`는 여전히 internal-only다.
    - `searchPanelDefaultView.stories.tsx`는 `query=""` mount만 유지하고 이번 phase의 write target이 아니다.
- 제약:
  - search-owned public contract rename과 immediate package-owned usages 정리는 같은 phase에서 끝나야 한다.
  - full package `tsc`는 unrelated red가 있으므로 이 phase의 gate는 filtered audit로 닫는다.
  - source-tree tests는 이번 phase에서 추가/수정하지 않는다.
- side effects:
  - `searchPanelReferenceFixtures.ts`의 comment grammar가 `searchResults.length` 기준으로 바뀌면 story docs와 JSDoc도 같은 언어를 써야 한다.
  - compose/context story는 case key `results-reference`를 유지해야 하므로 prop rename과 state inventory rename을 분리해 다뤄야 한다.
- failure/validation: SearchPanel public boundary에 legacy `results` prop이 남거나, component 정의 파일에서 그 부재를 직접 증명하지 못하거나, filtered `tsc` audit에 `number & SearchResult[]` 또는 SearchPanel story missing `args`가 남으면 later implementation과 materialize가 canonical prop winner를 추측해야 하므로 blocker다.
- 작업:
  - `SearchPanelProps`를 `searchResults` 중심 contract로 바꾸고, native host `results` surface는 제거한다.
  - component destructuring, branch winner rule, JSDoc을 `searchResults.length` 기준으로 다시 적는다.
  - `searchPanel.stories.tsx`와 `searchPanelContext.stories.tsx`를 새 prop명 + `args`-backed story shape로 바꾼다.
  - `searchPanelReferenceFixtures.ts`의 payload field와 condition/comment를 public contract와 같은 naming으로 맞춘다.
- 검증:
  - [ ] `pnpm exec tsc --noEmit -p packages/ui/tsconfig.json 2>&1 | rg "packages/ui/src/components/panels/search/searchPanel/index.tsx|packages/ui/src/components/panels/search/searchPanel/searchPanel.stories.tsx|packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx"` 결과가 비어 있어야 한다.
  - [ ] `rg -n "Omit<ComponentPropsWithoutRef<\"div\">, \"results\">|searchResults\\?: SearchResult\\[\\]" ".\\packages\\ui\\src\\components\\panels\\search\\searchPanel\\index.tsx"` 결과가 host `results` 제거와 새 canonical public field를 같이 보여 줘야 한다.
  - [ ] `rg -n "^\\s*results\\?: SearchResult\\[\\]" ".\\packages\\ui\\src\\components\\panels\\search\\searchPanel\\index.tsx"` 결과가 비어 있어야 하고, `rg -n -U "function SearchPanel\\(\\{[\\s\\S]*\\bresults\\b[\\s\\S]*\\}: SearchPanelProps\\)" ".\\packages\\ui\\src\\components\\panels\\search\\searchPanel\\index.tsx"` 결과도 비어 있어야 한다.
  - [ ] `rg -n "searchResults" ".\\packages\\ui\\src\\components\\panels\\search\\searchPanel" ".\\packages\\ui\\src\\components\\panels\\search\\storybook\\searchPanelContext.stories.tsx" ".\\packages\\ui\\src\\components\\panels\\search\\storybook\\searchPanelReferenceFixtures.ts"` 결과가 새 public prop naming을 보여 줘야 한다.
  - [ ] `rg -n "results\\s*=" ".\\packages\\ui\\src\\components\\panels\\search\\searchPanel\\searchPanel.stories.tsx" ".\\packages\\ui\\src\\components\\panels\\search\\storybook\\searchPanelContext.stories.tsx"` 결과가 비어 있어야 한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 통과해 SearchPanel stories가 package Storybook build 경계에서 여전히 렌더링 가능해야 한다.
