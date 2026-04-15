# Phase 2. 실사용 composition과 공개 wiring 정리

> 이 문서는 `ContextPanel` canonical leaf를 package-owned host composition에 접고, story ownership과 compare inventory를 실사용 8개 case 기준으로 다시 닫는다.
> synthetic pin bucket이 아니라 literal host case와 exact row inventory를 source에 남기는 것이 이 phase의 핵심이다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | `Context Panel/Panel`, `Windows Panel/Context`, `Search Panel/Context`의 story owner와 compare inventory를 실사용 8개 case 기준으로 고정한다. |
| 선행조건 | Phase 1의 `ContextPanel` public contract가 stable해야 한다. |
| 완료 판단 | root export, host composition story 8개, compare kind/state inventory, case별 literal row text/icon recipient가 모두 package source에 남는다. |
| 중단 조건 | 실사용 8개 case를 다시 synthetic 4+4 state로 축약해야 한다거나, Search host wording을 Windows action id/label에서 암묵 상속해야 한다는 요구가 생기면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/context/storybook/contextPanelHostRowInventories.ts` | 추가 | 실사용 8개 case의 exact row text/icon recipient를 literal하게 적는다. 공유 row inventory를 쓰는 경우도 어떤 case들이 왜 같은 row set을 쓰는지 winner rule을 source에 남긴다. | case 1~8의 row inventory, icon recipient, shared-row winner note가 source에 드러난다. |
| `packages/ui/src/components/panels/windows/windowsPanelSearchView/windowsPanelSearchView.stories.tsx` | 정리 | panel canonical state story는 panel 상태만 owner로 남는다. context-menu row variation은 이 파일의 owner가 아니다. | 이 파일은 `search-results`, `search-empty` canonical state만 설명한다. |
| `packages/ui/src/components/panels/windows/storybook/windowsPanelContextFixtures.ts` | 추가 | Windows host 7개 use case fixture를 literal case names로 고정한다. | `pinned-2025`, `pinned-values-and-types`, `pinned-homepage`, `pinned-data-types`, `all-pinned-2025`, `all-unpinned-reference`, `search-results-reference`가 exact row inventory와 함께 source에 드러난다. |
| `packages/ui/src/components/panels/windows/storybook/windowsPanelContext.stories.tsx` | 추가 | title은 `Windows Panel/Context`다. 7개 use case 모두 individual story/compare owner를 가진다. | 7개 Windows composition story와 7개 compare entry가 literal case names로 분리돼 있다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts` | 정리 | SearchPanel canonical state는 여전히 `default`, `query-results`, `query-empty` 3개뿐이다. | context-menu capture가 `Search Panel/Context` owner를 가진다는 note가 남고 SearchPanel canonical inventory는 늘어나지 않는다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelContextFixtures.ts` | 추가 | Search host 1개 use case fixture를 literal row inventory로 고정한다. | `results-reference`가 `파일 실행`, `파일 위치 열기`, 시작/taskbar pin-or-remove winner와 exact icon recipient를 함께 가진다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx` | 추가 | title은 `Search Panel/Context`다. 1개 use case와 compare owner를 가진다. | Search composition story와 compare entry가 same case name으로 노출된다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 정리 | compare inventory는 `context-panel`, `windows-panel-context`, `search-panel-context` kind를 해석한다. | canonical/composition owner가 kind level에서 분리된다. |
| `packages/ui/src/index.ts` | 추가 | `ContextPanel` public export가 root entry에 연결된다. | root entry에서 `ContextPanel` import path가 stable하다. |

### 완료 증거

- `Windows Panel/Context`는 7개, `Search Panel/Context`는 1개 실사용 case를 각각 literal story/compare owner로 가진다.
- Search host row text/icon recipient가 `taskSearchLeftPanel` 기준으로 source에 직접 적혀 있다.
- compare root는 `context-panel`, `windows-panel-context`, `search-panel-context` owner를 분리한다.

- owner_agent: `frontend-developer`
- 목적: 새 leaf owner를 실제 package-owned host story/compare topology에 연결하되, 기존 panel canonical state inventory와 old taskbar overlap을 다시 열지 않고 실사용 8개 case를 literal source-of-truth로 남긴다.
- boundary:
  - primary write target: `packages/ui/src/components/panels/context/storybook/contextPanelHostRowInventories.ts`
  - primary write target: `packages/ui/src/components/panels/windows/windowsPanelSearchView/windowsPanelSearchView.stories.tsx`
  - primary write target: `packages/ui/src/components/panels/windows/storybook/windowsPanelContextFixtures.ts`
  - primary write target: `packages/ui/src/components/panels/windows/storybook/windowsPanelContext.stories.tsx`
  - primary write target: `packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts`
  - primary write target: `packages/ui/src/components/panels/search/storybook/searchPanelContextFixtures.ts`
  - primary write target: `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx`
  - primary write target: `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
  - primary write target: `packages/ui/src/index.ts`
  - execution contract reference: `packages/ui/package.json`
  - read-only overlap reference: `plans/windows-taskbar-04-attached-surfaces/plan.md`
  - read-only reference: `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskSearchLeftPanel\index.tsx`
  - read-only reference: `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskWindowsLeftPanel\index.tsx`
- input:
  - 시나리오: maintainer가 `ContextPanel` leaf를 host composition stories에 연결하되, row wording과 icon recipient를 live/blog reference 기준으로 literal하게 고정하려는 경우
  - exact composition inventory:
    - case 1: Windows panel > 시작 고정 > `2025를 보내며`
    - case 2: Windows panel > 시작 고정 > `값과 타입 비교`
    - case 3: Windows panel > 시작 고정 > `나만의 홈페이지를 만들고`
    - case 4: Windows panel > 시작 고정 > `데이터 타입을 공부하고`
    - case 5: Windows panel > All > 이미 시작에 고정된 항목 (`2025를 보내며`)
    - case 6: Windows panel > All > 시작에 안 고정된 항목 (`미디어 리스트 속도 개선기`, `NEU - Windows 테마 개인 홈페이지`)
    - case 7: Windows panel > 검색 결과 > `Component VS CSS 세기의 대결`, `NEU - Windows 테마 개인 홈페이지`
    - case 8: Search panel > 기본 추천/검색 결과 > `Component VS CSS 세기의 대결`, `NEU - Windows 테마 개인 홈페이지`
  - exact row inventories:
    - case 1 rows:
      - `오른쪽으로 이동` + `ArrowRight`
      - `파일 위치 열기` + `FolderOpen`
      - `시작 화면에서 제거` + `PinOff`
      - `작업 표시줄에서 제거` + `PinOff`
    - case 2 rows:
      - `왼쪽으로 이동` + `ArrowLeft`
      - `오른쪽으로 이동` + `ArrowRight`
      - `파일 위치 열기` + `FolderOpen`
      - `시작 화면에서 제거` + `PinOff`
      - `작업 표시줄에서 제거` + `PinOff`
    - case 3 rows:
      - `앞으로 이동` + `MoveUpLeft`
      - `왼쪽으로 이동` + `ArrowLeft`
      - `오른쪽으로 이동` + `ArrowRight`
      - `파일 위치 열기` + `FolderOpen`
      - `시작 화면에서 제거` + `PinOff`
      - `작업 표시줄에서 제거` + `PinOff`
    - case 4 rows:
      - `앞으로 이동` + `MoveUpLeft`
      - `왼쪽으로 이동` + `ArrowLeft`
      - `파일 위치 열기` + `FolderOpen`
      - `시작 화면에서 제거` + `PinOff`
      - `작업 표시줄에서 제거` + `PinOff`
    - case 5 rows:
      - `파일 위치 열기` + `FolderOpen`
      - `시작 화면에서 제거` + `PinOff`
      - `작업 표시줄에서 제거` + `PinOff`
    - case 6 rows:
      - `파일 위치 열기` + `FolderOpen`
      - `시작 화면에 고정` + `Pin`
      - `작업 표시줄에서 제거` + `PinOff`
    - case 7 rows:
      - `파일 실행` + `File`
      - `파일 위치 열기` + `FolderOpen`
      - `시작 화면에 고정` + `Pin`
      - `작업 표시줄에서 제거` + `PinOff`
    - case 8 rows:
      - `파일 실행` + `File`
      - `파일 위치 열기` + `FolderOpen`
      - `시작 화면에 고정` + `Pin`
      - `작업 표시줄에서 제거` + `PinOff`
  - shared-row winner rule:
    - case 6은 `미디어 리스트 속도 개선기`와 `NEU - Windows 테마 개인 홈페이지`가 exact same 3-row inventory를 공유하므로 하나의 `all-unpinned-reference` fixture로 닫아도 된다.
    - case 7과 case 8은 host는 다르지만 합의된 실사용 reference에서 exact same 4-row inventory를 공유한다. 공유 row inventory 상수는 허용되지만 story/compare owner는 각각 `windows-panel-context/search-results-reference`와 `search-panel-context/results-reference`로 분리해 유지한다.
    - 위 공유는 user-approved case 자체에 두 example item이 함께 적혀 있고, row text/icon recipient가 source에 literal하게 적혀 있을 때만 허용된다.
- output:
  - 공개 계약:
    - `@windows/ui` root entry는 `ContextPanel` component를 새 public surface로 공개한다.
    - story ownership은 exact title `Context Panel/Panel`, `Windows Panel/Context`, `Search Panel/Context`로 분리된다.
    - compare kind inventory는 exact recipient `context-panel`, `windows-panel-context`, `search-panel-context`를 가진다.
    - Windows/Search composition state inventory는 exact 8개 use case를 literal case names로 가진다.
  - 내부 기본값:
    - case names는 kebab-case state strings로 둘 수 있지만, 각 state가 어떤 live case와 row inventory를 뜻하는지 source comment/fixture name으로 바로 읽혀야 한다.
    - Search host row wording은 `taskSearchLeftPanel` source를 따른다. Windows search result case도 same row inventory를 쓰는 경우 source comment로 그 parity를 명시한다.
  - 중요한 negative output:
    - Search host가 Windows preview action ids `open`, `open-folder`, `pin-start`, `pin-taskbar`를 암묵 상속하면 안 된다.
    - 실사용 8개 case를 다시 `pinned`, `start-unpinned`, `taskbar-unpinned`, `all-unpinned` synthetic bucket으로 줄이면 안 된다.
    - 기존 `Search Panel/Panel` canonical 3-state inventory를 context-menu composition 때문에 확장하지 않는다.
    - old `taskbarContextMenu`를 `ContextPanel` alias나 legacy sibling export로 소개하지 않는다.
- 선행조건:
  - Phase 1 output인 `ContextPanel` public prop surface와 canonical compare owner가 stable해야 한다.
- 제약:
  - package-only boundary를 유지한다. `apps/web`나 다른 consumer worktree 수정으로 contract ambiguity를 덮지 않는다.
  - Windows/Search composition story는 host example owner이지 새 public component owner가 아니다.
- side effects:
  - 기존 story titles와 capture classification note가 옮겨진다.
  - compare root kind inventory가 확장되므로 taskbar storybook helper 주석도 새 recipient를 설명할 수 있다.
- failure/validation: Search host row wording/icon recipient가 source에 literal하게 없거나, 8개 use case가 synthetic state로 다시 줄어들거나, shared-row reuse가 exact winner rule 없이 암묵 상속으로 남으면 later review/materialize/visual-comparator가 모두 추측해야 하므로 blocker다.
- 작업:
  - 실사용 8개 case의 exact row text/icon recipient를 host row inventory source에 기록한다.
  - Windows fixtures와 stories에 7개 case owner를 literal하게 만든다.
  - Search fixture와 story에 1개 case owner를 literal하게 만든다.
  - `WindowsPanelSearchView` canonical story에서 action-only variation owner를 분리한다.
  - SearchPanel fixture 문서의 excluded context-menu note를 separate composition owner와 연결한다.
  - `compareRoot` kind inventory와 root export를 최소 범위로 정리한다.
- 검증:
  - [ ] `rg -n "2025를 보내며|값과 타입 비교|나만의 홈페이지를 만들고|데이터 타입을 공부하고|미디어 리스트 속도 개선기|NEU - Windows 테마 개인 홈페이지|Component VS CSS 세기의 대결" ".\\packages\\ui\\src\\components\\panels"` 결과로 8개 use case의 selected item literals가 source에 드러나야 한다.
  - [ ] `rg -n "파일 실행|파일 위치 열기|시작 화면에 고정|시작 화면에서 제거|작업 표시줄에서 제거|오른쪽으로 이동|왼쪽으로 이동|앞으로 이동" ".\\packages\\ui\\src\\components\\panels"` 결과로 exact row wording이 fixture/story source에 드러나야 한다.
  - [ ] `rg -n "context-panel|windows-panel-context|search-panel-context" ".\\packages\\ui\\src\\components\\taskbar\\storybook\\compareRoot.tsx"` 결과로 compare recipient inventory가 source에 드러나야 한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 통과해 new composition stories와 updated canonical stories가 package Storybook 경계에서 green이어야 한다.
  - [ ] `pnpm --filter @windows/ui test`가 통과해 export wiring과 story ownership 정리가 기존 package test 경계를 깨지 않아야 한다.
