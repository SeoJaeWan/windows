**Branch:** refactor/windows-ui-storybook-taxonomy-governance

> Worktree dir: `worktrees/windows-ui-storybook-taxonomy-governance` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 먼저 `사전 합의`와 `전체 작업 지도`에서 이번 변경의 기준과 흐름을 보고, 아래 phase 카드에서 어떤 파일이 어떻게 바뀌는지와 무엇을 확인해야 하는지를 본다.
> 기술적인 입력/출력 계약, owner_agent, 세부 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows UI Storybook 분류 체계와 거버넌스 실행 계획

## 사전 합의

| 항목 | 합의 내용 | 적용 phase | 메모 |
| --- | --- | --- | --- |
| 단일 Storybook 유지 | Storybook 앱은 하나로 유지하고, 카탈로그와 캡처 허브 역할을 같은 사이드바 안에서 함께 다룬다. | 전체 | 별도 capture 전용 앱으로 분리하지 않는다. |
| 역할 분리 방향 | 이번 정리는 Option B를 기준으로 하며, 같은 도메인 안에서 `Components`와 `Compose` 역할을 분리한다. | Phase 1 / Phase 2 / Phase 3 | taxonomy와 문서 규칙이 같은 기준을 써야 한다. |
| Storybook 역할 | Storybook은 `컴포넌트 카탈로그`와 `캡처 허브`를 둘 다 맡는다. | 전체 | `Compose`가 capture-hub 역할을 맡는다. |
| Compose 배치 | `Compose` stories는 같은 Storybook 사이드바에 남겨 두고, 별도 앱이나 숨은 카테고리로 분리하지 않는다. | Phase 2 / Phase 3 | 탐색 루트는 유지하되 역할만 분리한다. |
| 탐색 기준 | 최상위 navigation은 도메인 기준으로 잡고, 각 도메인 아래에 `Components`와 `Compose`를 둔다. | Phase 1 / Phase 2 / Phase 3 | `Taskbar`, `Windows`, `Search`, `Context`를 canonical root로 사용한다. |
| 거버넌스 반영 | 최종 운영 규칙은 source refactor에 그치지 않고 `.claude/rules/storybook.md`와 `.claude/CLAUDE.md`에 함께 고정한다. | Phase 3 | `.claude/CLAUDE.md` 끝쪽 규칙 안내에도 같은 방향을 남긴다. |

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. title source 단일화 | `taskbar`의 동적 title 경로를 걷어내고 Storybook sidebar title을 literal source 하나로 고정한다. | Taskbar stories가 이미 목표 taxonomy 아래로 들어가고, `.storybook/main.ts`가 registration-aware title parsing 없이도 Storybook을 인덱싱할 수 있다. | 나머지 story 파일이 따라야 하는 literal title rule과 registration helper의 축소된 책임 |
| Phase 2. domain taxonomy 재배치 | `packages/ui`의 story 파일을 `Domain/Components/*`와 `Domain/Compose/*`로 재분류하고, supporting fixture/comment vocabulary까지 같은 owner 규칙으로 맞춘다. | 17개 story 파일과 supporting fixture/comment 파일이 도메인-first taxonomy 아래에 정렬되고, component catalog와 host-composed capture surface의 owner가 명확해진다. | `.claude` 문서에 그대로 옮길 최종 taxonomy inventory, meta rule, compare/reference 분류 |
| Phase 3. CLAUDE 거버넌스 고정 | `.claude` 문서를 source tree와 같은 규칙으로 갱신해 이후 Storybook 변경도 같은 taxonomy를 따르게 만든다. | `.claude/rules/storybook.md`와 `.claude/CLAUDE.md`만 읽어도 titles, taxonomy, meta ownership, `Reference`/`Compare*` 규칙을 재현할 수 있다. | future planning/review/implementation이 재사용할 repo-local 운영 규칙 |

## 단계별 실행

### Phase 1. title source 단일화

- 목적: `taskbar`에만 남아 있는 동적 title 경로를 제거하고, Storybook title discovery를 literal `meta.title` 기준으로 단일화한다.
- 변경 내용: `.storybook/main.ts`에서 `FOUNDATION_REGISTRATION.*.title` 전용 인덱싱 경로를 걷어내고, `FOUNDATION_REGISTRATION` helper는 marker/Figma metadata owner로만 남긴다. `taskbar` leaf와 rail stories는 `Taskbar/Components/*`, `Taskbar/Compose/Taskbar` literal title을 직접 가진다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/.storybook/main.ts` | 정리 | taskbar-only dynamic title parser 없이도 Storybook이 story files를 인덱싱한다. | `FOUNDATION_REGISTRATION.*.title`를 읽기 위한 custom indexer 의존이 사라진다. |
| `packages/ui/src/components/taskbar/storybook/foundationFigmaRegistration.ts` | 정리 | helper가 sidebar title owner가 아니라 marker/Figma metadata owner로 축소된다. | helper 안에 Storybook title source 역할이 남지 않는다. |
| `packages/ui/src/components/taskbar/taskbarWindowsButton/taskbarWindowsButton.stories.tsx` | 교체 | Windows leaf story가 `Taskbar/Components/Windows` literal title을 직접 가진다. | imported registration title 없이도 story title이 final taxonomy를 따른다. |
| `packages/ui/src/components/taskbar/taskbarSearch/taskbarSearch.stories.tsx` | 교체 | Search leaf story가 `Taskbar/Components/Search` literal title을 직접 가진다. | imported registration title 없이도 story title이 final taxonomy를 따른다. |
| `packages/ui/src/components/taskbar/taskbarIconButton/taskbarIconButton.stories.tsx` | 교체 | Icon leaf story가 `Taskbar/Components/Icon` literal title을 직접 가진다. | compare state와 marker를 유지한 채 title source만 literal로 바뀐다. |
| `packages/ui/src/components/taskbar/taskbarClock/taskbarClock.stories.tsx` | 교체 | Clock leaf story가 `Taskbar/Components/Clock` literal title을 직접 가진다. | imported registration title 없이도 story title이 final taxonomy를 따른다. |
| `packages/ui/src/components/taskbar/taskbar/taskbar.stories.tsx` | 교체 | rail story가 `Taskbar/Compose/Taskbar` title 아래로 이동한다. | taskbar rail이 leaf catalog와 같은 domain root 안에서 compose owner로 보인다. |

- 이전 상태: taskbar leaf stories만 `FOUNDATION_REGISTRATION.*.title`에 의존하고, `.storybook/main.ts`가 그 imported title을 해석하려고 taskbar 전용 custom indexer를 쓴다. rail story는 `Taskbar Foundation/Taskbar` literal title을 따로 가져 final taxonomy와 엇갈린다.
- 이후 상태: Storybook sidebar title source는 모든 domain에서 literal `meta.title` 하나로 통일되고, `FOUNDATION_REGISTRATION`는 review marker나 Figma recipient metadata만 맡는다. taskbar leaf와 rail 모두 최종 domain-first taxonomy 아래로 들어간다.
- 완료 조건: `packages/ui/.storybook/main.ts`가 taskbar-specific title parser 없이 build 가능하고, taskbar story 파일에 `FOUNDATION_REGISTRATION.*.title` 사용이 남지 않는다. Storybook sidebar에서 Taskbar root 아래 `Components`와 `Compose`가 함께 보인다.
- 관련 영역: `packages/ui/src/components/taskbar/storybook/foundationRegistrationStage.tsx`, `plans/windows-taskbar-05-taskbar-elements-redesign/plan.md`, `plans/windows-taskbar-06-storybook-compare-contract/plan.md`
- 시작 조건: `none`
- 상세: `./phases/01-title-source-reset.md`

### Phase 2. domain taxonomy 재배치

- 목적: `packages/ui`의 기존 story 파일을 도메인-first taxonomy 아래로 재정렬하고, `Components`와 `Compose`의 owner/meta 규칙을 source tree에 반영한다.
- 변경 내용: `Taskbar`, `Windows`, `Search`, `Context` 도메인 아래의 story titles를 `Components` 또는 `Compose`로 재분류한다. canonical component stories는 자기 leaf/component를 `meta.component`로 유지하고, host-composed stories는 host owner를 쓰거나 단일 host가 없으면 `meta.component`를 생략한다. supporting fixture/comment 파일도 같은 `Components`/`Compose` vocabulary로 맞추고, `Reference`와 `Compare*`는 같은 title branch 안에 남기되 `Compare*`의 kind/state key는 바꾸지 않는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx` | 교체 | `Taskbar/Compose/ContextMenu` title과 compose owner 규칙을 따른다. | taskbar attached surface가 taskbar domain compose 아래로 이동한다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx` | 교체 | `Taskbar/Compose/HoverPreview` title과 compose owner 규칙을 따른다. | hover preview가 별도 legacy root 없이 taskbar domain compose 아래로 이동한다. |
| `packages/ui/src/components/panels/windows/windowsPanel/windowsPanel.stories.tsx` | 교체 | `Windows/Components/Panel` title을 가진 canonical panel owner가 된다. | empty panel catalog story가 final taxonomy에서 component owner로 남는다. |
| `packages/ui/src/components/panels/windows/windowsPanelPinnedView/windowsPanelPinnedView.stories.tsx` | 교체 | `Windows/Components/PinnedView` title을 가진다. | pinned subview가 panel compose와 섞이지 않는다. |
| `packages/ui/src/components/panels/windows/windowsPanelAllView/windowsPanelAllView.stories.tsx` | 교체 | `Windows/Components/AllView` title을 가진다. | all-view catalog story가 panel compose와 섞이지 않는다. |
| `packages/ui/src/components/panels/windows/windowsPanelSearchView/windowsPanelSearchView.stories.tsx` | 교체 | `Windows/Components/SearchView` title을 가진다. | search-view catalog story가 panel compose와 섞이지 않는다. |
| `packages/ui/src/components/panels/windows/storybook/windowsPanelContext.stories.tsx` | 교체 | `Windows/Compose/Context` title과 host-compose owner rule을 따른다. | 더 이상 `ContextPanel` canonical catalog owner로 오해되지 않는다. |
| `packages/ui/src/components/panels/search/searchPanel/searchPanel.stories.tsx` | 교체 | `Search/Components/Panel` title을 가진 canonical search panel owner가 된다. | query state catalog와 compose context capture가 다른 branch로 분리된다. |
| `packages/ui/src/components/panels/search/searchPanelDefaultView/searchPanelDefaultView.stories.tsx` | 교체 | `Search/Components/DefaultView` title을 가진다. | default view catalog story가 panel compose와 섞이지 않는다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx` | 교체 | `Search/Compose/Context` title과 host-compose owner rule을 따른다. | search host overlay story가 canonical panel contract owner로 보이지 않는다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelContextFixtures.ts` | 정리 | Search context fixture comment가 `Windows/Compose/Context`, `Search/Compose/Context` owner vocabulary를 따른다. | fixture comment에 legacy owner label이 남지 않는다. |
| `packages/ui/src/components/panels/context/contextPanel/contextPanel.stories.tsx` | 교체 | `Context/Components/Panel` title을 가진 canonical context panel owner가 된다. | context panel leaf contract와 compare state inventory가 component branch에 고정된다. |
| `packages/ui/src/components/panels/context/contextPanel/contextPanelUseCases.stories.tsx` | 교체 | `Context/Compose/UseCases` title과 inventory-only compose rule을 따른다. | host row inventory showcase가 canonical component story와 분리된다. |
| `packages/ui/src/components/panels/context/storybook/contextPanelHostRowInventories.tsx` | 정리 | use-case ownership 설명이 새 taxonomy와 일치한다. | story comment/source note가 `Components`/`Compose` 구분을 그대로 설명한다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts` | 정리 | search panel canonical states와 compose-excluded capture note가 새 taxonomy와 충돌하지 않는다. | fixture 문서가 component owner와 compose owner를 구분한다. |

- 이전 상태: `Windows Panel/*`, `Search Panel/*`, `Context Panel/*`, `Taskbar Context Menu/*`, `Taskbar Hover Preview/*`처럼 도메인 루트와 role 구분이 뒤섞여 있고, `windowsPanelContext.stories.tsx`와 `searchPanelContext.stories.tsx`는 실제 host-composed surface인데 `component: ContextPanel`로 canonical component처럼 보인다.
- 이후 상태: Storybook root는 `Taskbar`, `Windows`, `Search`, `Context` 네 도메인으로 정리되고, 각 파일은 `Components` 또는 `Compose`로만 배치된다. supporting fixture/comment 파일도 같은 vocabulary로 맞춰져 source comment drift가 남지 않는다. `Reference`와 `Compare*`는 같은 title branch 안에서 review/capture 역할만 분리하고, `Compare*` key inventory는 그대로 유지된다.
- 완료 조건: legacy root title이 story files에서 사라지고, compose stories는 host owner 또는 inventory-only compose owner 규칙을 따른다. 같은 사이드바 안에서 component catalog와 capture hub가 구분되지만 분리 앱처럼 갈라지지는 않는다.
- 관련 영역: `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`, `packages/ui/src/components/panels/windows/storybook/windowsPanelReferenceFixtures.ts`, `packages/ui/src/components/panels/search/storybook/searchPanelContextFixtures.ts`, `plans/windows-taskbar-12-context-panel-family/plan.md`
- 시작 조건: Phase 1에서 literal title rule과 taskbar helper 책임 축소가 먼저 고정돼 있어야 한다.
- 상세: `./phases/02-domain-taxonomy-realignment.md`

### Phase 3. CLAUDE 거버넌스 고정

- 목적: source tree에서 합의한 taxonomy/meta/title rule을 `.claude` 운영 문서에도 같은 언어로 고정한다.
- 변경 내용: `.claude/rules/storybook.md`를 domain-first taxonomy, literal title source, `Components`/`Compose` meta ownership, `Reference`/`Compare*` 분류 규칙에 맞게 다시 쓰고, `.claude/CLAUDE.md`의 Storybook 항목과 마지막 안내 문구도 같은 rule을 가리키도록 갱신한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `.claude/rules/storybook.md` | 보강/재구성 | Storybook taxonomy와 meta/title rule의 canonical 운영 문서가 된다. | old `Panel / Use Cases / Context` section taxonomy 대신 `Domain/Components/*`, `Domain/Compose/*` rule이 문서에 고정된다. |
| `.claude/CLAUDE.md` | 갱신 | Storybook governance가 CLAUDE index와 마지막 안내 문구에 함께 노출된다. | `.claude/CLAUDE.md`만 읽어도 Storybook taxonomy rule 문서와 final operating rule을 바로 찾을 수 있다. |

- 이전 상태: `.claude/rules/storybook.md`는 `Panel`, `Use Cases`, `Context` 중심 구조만 설명하고, `.claude/CLAUDE.md`도 Storybook rule을 짧은 색인 수준으로만 가리킨다.
- 이후 상태: `.claude` 문서는 `packages/ui` Storybook이 도메인-first root와 `Components`/`Compose` 역할 분리, literal title source, compose meta ownership, `Reference`/`Compare*` 유지 규칙을 따른다는 점을 명시한다.
- 완료 조건: source tree를 보지 않아도 `.claude/rules/storybook.md`와 `.claude/CLAUDE.md`만으로 새 taxonomy와 금지 패턴을 재현할 수 있다. 이후 Storybook 작업자가 같은 규칙을 다시 열지 않게 된다.
- 관련 영역: `.claude/rules/component-design.md`, `plans/windows-taskbar-11-shell-theme-facade/plan.md`, `plans/windows-ui-storybook-taxonomy-governance/phases/02-domain-taxonomy-realignment.md`
- 시작 조건: Phase 2에서 최종 taxonomy inventory와 meta ownership rule이 확정돼 있어야 한다.
- 상세: `./phases/03-claude-governance-freeze.md`
