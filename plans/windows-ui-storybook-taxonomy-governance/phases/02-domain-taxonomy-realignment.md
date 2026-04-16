# Phase 2. domain taxonomy 재배치

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | 17개 story 파일이 `Taskbar`, `Windows`, `Search`, `Context` root 아래의 `Components` 또는 `Compose`로만 배치되고, supporting fixture/comment vocabulary까지 같은 owner 규칙을 따른다. |
| 선행조건 | Phase 1에서 literal title source와 taskbar domain title contract가 먼저 고정돼 있어야 한다. |
| 완료 판단 | legacy root title이 사라지고, `Components` story는 canonical component owner를, `Compose` story는 host owner 또는 inventory-only compose owner를 명확히 드러낸다. |
| 중단 조건 | 한 파일이 동시에 canonical component contract와 host-composed capture surface를 같이 소유해야 해서 `Components`/`Compose` winner rule을 정할 수 없거나, compare `kind/state` key까지 바꾸지 않으면 taxonomy migration이 성립하지 않으면 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx` | 교체 | final title은 `Taskbar/Compose/ContextMenu`다. taskbar attached surface는 compose owner다. | taskbar context menu가 별도 legacy root 없이 taskbar compose branch에 놓인다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx` | 교체 | final title은 `Taskbar/Compose/HoverPreview`다. hover preview는 compose owner다. | taskbar hover preview가 별도 legacy root 없이 taskbar compose branch에 놓인다. |
| `packages/ui/src/components/panels/windows/windowsPanel/windowsPanel.stories.tsx` | 교체 | final title은 `Windows/Components/Panel`이다. `meta.component`는 `WindowsPanel`을 유지한다. | canonical windows panel owner가 compose stories와 분리된다. |
| `packages/ui/src/components/panels/windows/windowsPanelPinnedView/windowsPanelPinnedView.stories.tsx` | 교체 | final title은 `Windows/Components/PinnedView`다. | pinned subview catalog가 component branch에 고정된다. |
| `packages/ui/src/components/panels/windows/windowsPanelAllView/windowsPanelAllView.stories.tsx` | 교체 | final title은 `Windows/Components/AllView`다. | all-view catalog가 component branch에 고정된다. |
| `packages/ui/src/components/panels/windows/windowsPanelSearchView/windowsPanelSearchView.stories.tsx` | 교체 | final title은 `Windows/Components/SearchView`다. | search-view catalog가 component branch에 고정된다. |
| `packages/ui/src/components/panels/windows/storybook/windowsPanelContext.stories.tsx` | 교체 | final title은 `Windows/Compose/Context`다. `meta.component`는 host owner인 `WindowsPanel`을 쓰거나, host abstraction이 불분명하면 omit으로 정리한다. `ContextPanel`을 canonical owner로 다시 쓰지 않는다. | windows context overlay stories가 compose owner로만 보인다. |
| `packages/ui/src/components/panels/search/searchPanel/searchPanel.stories.tsx` | 교체 | final title은 `Search/Components/Panel`이다. `meta.component`는 `SearchPanel`을 유지한다. | canonical search panel owner가 compose stories와 분리된다. |
| `packages/ui/src/components/panels/search/searchPanelDefaultView/searchPanelDefaultView.stories.tsx` | 교체 | final title은 `Search/Components/DefaultView`다. | default view catalog가 component branch에 고정된다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx` | 교체 | final title은 `Search/Compose/Context`다. `meta.component`는 host owner인 `SearchPanel`을 쓰거나 omit으로 정리한다. `ContextPanel`을 canonical owner로 다시 쓰지 않는다. | search host overlay story가 compose owner로만 보인다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelContextFixtures.ts` | 정리 | fixture comment는 case 7/8 owner를 `Windows/Compose/Context`, `Search/Compose/Context`로 적는다. | supporting fixture comment가 story taxonomy와 같은 vocabulary를 쓴다. |
| `packages/ui/src/components/panels/context/contextPanel/contextPanel.stories.tsx` | 교체 | final title은 `Context/Components/Panel`이다. `meta.component`는 `ContextPanel`을 유지한다. | context panel canonical contract가 component branch에 고정된다. |
| `packages/ui/src/components/panels/context/contextPanel/contextPanelUseCases.stories.tsx` | 교체 | final title은 `Context/Compose/UseCases`다. 이 파일은 host row inventory showcase라 `meta.component`를 omit하거나 inventory-only compose role로 분명히 적는다. | use-case inventory가 canonical component story와 분리된다. |
| `packages/ui/src/components/panels/context/storybook/contextPanelHostRowInventories.tsx` | 정리 | source note는 `Context/Compose/UseCases`, `Windows/Compose/Context`, `Search/Compose/Context` ownership을 그대로 설명해야 한다. | supporting inventory 문서가 새 taxonomy와 동일한 용어를 쓴다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts` | 정리 | canonical search panel state와 compose-excluded capture를 새 taxonomy 언어로 분리한다. | fixture 문서가 component owner와 compose owner를 혼동하지 않는다. |

### 완료 증거

- Storybook root가 `Taskbar`, `Windows`, `Search`, `Context` 네 도메인만 남긴다.
- `Components` stories와 `Compose` stories의 `meta.component` rule이 file role과 맞는다.
- `searchPanelContextFixtures.ts`와 related supporting comment가 `Windows/Compose/Context`, `Search/Compose/Context` vocabulary를 쓴다.
- `Reference`와 `Compare*`가 같은 title branch 안에서 review/capture 역할만 나눠 가진다.

- owner_agent: `frontend-developer`
- 목적:
  - 기존 `packages/ui` Storybook을 domain-first `Components`/`Compose` taxonomy 아래로 재배치하고, canonical component owner와 host-composed capture owner를 source tree 수준에서 분리한다.
- boundary:
  - `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx`
  - `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx`
  - `packages/ui/src/components/panels/windows/windowsPanel/windowsPanel.stories.tsx`
  - `packages/ui/src/components/panels/windows/windowsPanelPinnedView/windowsPanelPinnedView.stories.tsx`
  - `packages/ui/src/components/panels/windows/windowsPanelAllView/windowsPanelAllView.stories.tsx`
  - `packages/ui/src/components/panels/windows/windowsPanelSearchView/windowsPanelSearchView.stories.tsx`
  - `packages/ui/src/components/panels/windows/storybook/windowsPanelContext.stories.tsx`
  - `packages/ui/src/components/panels/search/searchPanel/searchPanel.stories.tsx`
  - `packages/ui/src/components/panels/search/searchPanelDefaultView/searchPanelDefaultView.stories.tsx`
  - `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx`
  - `packages/ui/src/components/panels/search/storybook/searchPanelContextFixtures.ts`
  - `packages/ui/src/components/panels/context/contextPanel/contextPanel.stories.tsx`
  - `packages/ui/src/components/panels/context/contextPanel/contextPanelUseCases.stories.tsx`
  - `packages/ui/src/components/panels/context/storybook/contextPanelHostRowInventories.tsx`
  - `packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts`
- input:
  - Phase 1에서 Storybook title source가 literal `meta.title`로 단일화되어 있다.
  - 현재 panel/context/taskbar attached surface stories는 legacy root와 mixed owner naming을 사용한다.
  - 사용자 합의는 top-level root를 domain 기준으로 잡고, `Compose` stories도 같은 사이드바 안에 남기는 것이다.
- output:
    - 공개 계약:
      - final title mapping은 아래 inventory를 canonical source로 사용한다.
      - `Taskbar/Compose/ContextMenu`
      - `Taskbar/Compose/HoverPreview`
      - `Windows/Components/Panel`
      - `Windows/Components/PinnedView`
      - `Windows/Components/AllView`
      - `Windows/Components/SearchView`
      - `Windows/Compose/Context`
      - `Search/Components/Panel`
      - `Search/Components/DefaultView`
      - `Search/Compose/Context`
      - `Context/Components/Panel`
      - `Context/Compose/UseCases`
      - `Components` story는 canonical component contract만 소유하고 `meta.component`가 그 component와 일치한다.
      - `Compose` story는 host-composed surface나 capture-hub scenario만 소유한다. 단일 host surface가 있으면 `meta.component`는 그 host owner를 쓰고, inventory-only showcase는 `meta.component`를 생략한다.
      - `Reference`와 `Compare*`는 같은 title branch 안에 남고, existing compare `kind/state` key는 바꾸지 않는다.
    - 내부 기본값:
      - story file path는 꼭 옮기지 않아도 되지만, title과 meta는 최종 taxonomy와 owner rule을 우선한다.
      - supporting fixture/comment 파일은 새 taxonomy 용어에 맞춰 owner 설명을 같이 고친다.
      - `searchPanelContextFixtures.ts`의 case owner comment는 case 7을 `Windows/Compose/Context`, case 8을 `Search/Compose/Context`로 적는다.
    - 허용하지 않는 대안:
      - `Windows Panel/*`, `Search Panel/*`, `Context Panel/*`, `Taskbar Context Menu/*`, `Taskbar Hover Preview/*` 같은 legacy roots를 유지하는 방식
      - host-composed story에 `component: ContextPanel`을 남겨 canonical component owner처럼 보이게 하는 방식
      - `Compare*`를 별도 top-level root로 떼어내는 방식
- 선행조건:
  - Phase 1 output인 literal title rule과 taskbar helper 축소가 먼저 확보돼 있어야 한다.
- 제약:
  - 이 phase는 compare `kind/state` inventory와 capture marker를 다시 설계하지 않는다.
  - Story export 이름은 role 오해를 막는 범위에서만 조정하고, title/meta 정렬을 우선한다.
  - supporting fixture는 canonical state inventory와 compose-only inventory를 혼동하지 않는 설명만 바꾼다.
- side effects:
  - story titles가 바뀌면 Storybook-generated story IDs도 달라진다. in-repo에서 실제 소비하는 recipient가 있다면 같은 phase에서 새 recipient를 명시하거나 dependent surface를 같이 옮겨야 한다.
- failure/validation:
  - 한 story file이 canonical component contract와 host-composed capture contract를 동시에 canonical owner로 가져야 한다면 winner rule이 닫히지 않으므로 blocker다.
  - compose owner를 정리하려고 compare `kind/state` key까지 바꿔야 한다면 이 phase 범위를 넘는다. 키 변경 recipient가 따로 합의되기 전에는 blocker다.
- 작업:
  - windows/search/context/taskbar attached surface story titles를 final inventory로 바꾼다.
  - `windowsPanelContext.stories.tsx`와 `searchPanelContext.stories.tsx`의 `meta.component`를 host owner rule에 맞게 정리해 `ContextPanel` canonical owner 오해를 제거한다.
  - `searchPanelContextFixtures.ts`의 fixture comment를 story taxonomy와 같은 owner vocabulary로 고쳐 supporting source drift를 제거한다.
  - `contextPanelUseCases.stories.tsx`를 `Context/Compose/UseCases` role로 확정하고, inventory-only compose surface라는 점이 드러나게 문서와 meta를 같이 정리한다.
  - supporting fixture/comment 파일에서 canonical component owner와 compose owner 설명을 같은 vocabulary로 맞춘다.
  - `Reference` stories는 사람 검토용 review surface로, `Compare*`는 machine capture surface로 남기되 title branch는 동일하게 유지한다.
- 검증:
    - [ ] `pnpm --filter @windows/ui build-storybook`가 통과한다.
    - [ ] `rg -n 'title: "(Taskbar Foundation/|Windows Panel/|Search Panel/|Context Panel/|Taskbar Context Menu/|Taskbar Hover Preview/)' packages/ui/src/components -g "*.stories.tsx"` 결과가 비어 있다.
    - [ ] `rg -n 'title: "(Taskbar|Windows|Search|Context)/(Components|Compose)/' packages/ui/src/components -g "*.stories.tsx"` 결과가 모든 active story titles를 approved root 아래로 보여 준다.
    - [ ] `rg -n 'Windows Panel/Context|Search Panel/Context' packages/ui/src/components/panels/search/storybook/searchPanelContextFixtures.ts packages/ui/src/components/panels/context/storybook/contextPanelHostRowInventories.tsx packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts` 결과가 비어 있거나, historical note가 아니라면 새 taxonomy vocabulary로 교체돼 있다.
    - [ ] `packages/ui/src/components/panels/windows/storybook/windowsPanelContext.stories.tsx`, `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx`, `packages/ui/src/components/panels/context/contextPanel/contextPanelUseCases.stories.tsx`를 열어 compose owner/meta rule이 문서와 같은 방식으로 적용됐는지 확인한다.
