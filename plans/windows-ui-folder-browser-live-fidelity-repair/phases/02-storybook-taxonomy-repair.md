# Phase 2. Storybook 분류 체계 복구

> 이 문서는 panel family와 `Folder` / `Browser`의 Storybook owner taxonomy를 `Panels/*` + `Windows/*` 구조로 되돌리는 실행용 상세 계약이다.
> source tree와 `.claude` 문서가 같은 분류 체계를 써야 하며, later compare가 쓸 exact Folder/Browser story recipient도 이 phase에서 고정한다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | panel family는 `Panels/*` 아래로 모으고 `Windows/*`는 `Folder`, `Browser`만 남게 하며, `.claude` Storybook 규칙도 같은 방향으로 갱신한다. |
| 선행조건 | Phase 1에서 canonical fidelity inventory와 deferred missing-slug note가 먼저 고정돼 있어야 한다. |
| 완료 판단 | `packages/ui` story source와 `.claude` 문서에서 `Windows/Components/*`, `Search/Components/*`, `Context/Components/*` 같은 old taxonomy가 사라지고, exact Folder/Browser compare story ID가 새 root 아래로 계산된다. |
| 중단 조건 | panel family를 `Panels/*`로 옮기면 later compare나 story recipient가 둘 이상으로 해석되거나, `Windows/*`에 `Folder`/`Browser` 외 surface를 남겨야만 build가 유지된다면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/windows/windowsPanel/windowsPanel.stories.tsx`, `packages/ui/src/components/panels/windows/windowsPanelPinnedView/windowsPanelPinnedView.stories.tsx`, `packages/ui/src/components/panels/windows/windowsPanelAllView/windowsPanelAllView.stories.tsx`, `packages/ui/src/components/panels/windows/windowsPanelSearchView/windowsPanelSearchView.stories.tsx`, `packages/ui/src/components/panels/windows/storybook/windowsPanelContext.stories.tsx` | 교체 | final title은 각각 `Panels/Windows/Panel`, `Panels/Windows/PinnedView`, `Panels/Windows/AllView`, `Panels/Windows/SearchView`, `Panels/Windows/Context`다. compare `kind/state` key는 바꾸지 않는다. | windows panel family stories가 `Panels/Windows/*` 아래에만 존재한다. |
| `packages/ui/src/components/panels/search/searchPanel/searchPanel.stories.tsx`, `packages/ui/src/components/panels/search/searchPanelDefaultView/searchPanelDefaultView.stories.tsx`, `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx` | 교체 | final title은 각각 `Panels/Search/Panel`, `Panels/Search/DefaultView`, `Panels/Search/Context`다. | search panel family stories가 `Panels/Search/*` 아래에만 존재한다. |
| `packages/ui/src/components/panels/context/contextPanel/contextPanel.stories.tsx`, `packages/ui/src/components/panels/context/contextPanel/contextPanelUseCases.stories.tsx` | 교체 | final title은 각각 `Panels/Context/Panel`, `Panels/Context/UseCases`다. | context panel family stories가 `Panels/Context/*` 아래에만 존재한다. |
| `packages/ui/src/components/panels/search/storybook/searchPanelContextFixtures.ts`, `packages/ui/src/components/panels/context/storybook/contextPanelHostRowInventories.tsx`, `packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts` | 정리 | supporting note는 `Panels/Windows/Context`, `Panels/Search/Context`, `Panels/Context/UseCases` vocabulary를 써야 한다. | old taxonomy wording이 file comment에 남지 않는다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 교체 | final title은 `Windows/Folder`, `Windows/Browser`다. compare export는 later compare script가 exact ID를 쓸 수 있게 naming을 고정한다. | `Windows/*` root에 `Folder`, `Browser`만 남고 compare story ID가 단일 값으로 계산된다. |
| `.claude/rules/storybook.md` | 갱신 | Storybook governance 문서는 canonical root를 `Taskbar`, `Panels`, `Windows`로 설명하고 panel family와 window family를 구분해야 한다. | 문서만 읽어도 `Panels/*` + `Windows/*` rule과 금지 패턴을 재현할 수 있다. |
| `.claude/CLAUDE.md` | 갱신 | top-level reminder도 더 이상 `Domain/Components/Name` 4-root 규칙을 canonical rule로 적지 않는다. | `.claude/CLAUDE.md`가 새 taxonomy 문서를 정확히 가리킨다. |

### 완료 증거

- `packages/ui` story file에서 `Windows/Components/*`, `Windows/Compose/*`, `Search/Components/*`, `Search/Compose/*`, `Context/Components/*`, `Context/Compose/*` title이 사라진다.
- Folder/Browser compare story recipient는 exact ID `windows-folder--compare-desktop-blog`, `windows-folder--compare-mobile-blog`, `windows-browser--compare-desktop-article`, `windows-browser--compare-mobile-article`로 단일화된다.
- `.claude/rules/storybook.md`와 `.claude/CLAUDE.md`가 source tree와 같은 taxonomy를 설명한다.

- owner_agent: `frontend-developer`
- 목적:
  - 잘못 landed 된 Storybook taxonomy를 repair하고, later compare와 future 작업자가 같은 root vocabulary를 보게 만든다.
- boundary:
  - primary write target: `packages/ui/src/components/panels/windows/**/*.stories.tsx`
  - primary write target: `packages/ui/src/components/panels/search/**/*.stories.tsx`
  - primary write target: `packages/ui/src/components/panels/context/**/*.stories.tsx`
  - primary write target: `packages/ui/src/components/panels/search/storybook/searchPanelContextFixtures.ts`
  - primary write target: `packages/ui/src/components/panels/context/storybook/contextPanelHostRowInventories.tsx`
  - primary write target: `packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts`
  - primary write target: `packages/ui/src/components/windows/folder/folder.stories.tsx`
  - primary write target: `packages/ui/src/components/windows/browser/browser.stories.tsx`
  - primary write target: `.claude/rules/storybook.md`
  - primary write target: `.claude/CLAUDE.md`
  - read-only prerequisite context: `plans/windows-ui-storybook-taxonomy-governance/plan.md`
  - read-only prerequisite context: `plans/windows-ui-storybook-taxonomy-governance/phases/02-domain-taxonomy-realignment.md`
- input:
  - 시나리오: maintainer가 현재 Storybook taxonomy를 다시 정렬해 panel family와 window family의 owner boundary를 reviewer와 compare tooling이 혼동하지 않게 만들려는 경우
  - exact title target:
    - `Panels/Windows/Panel`
    - `Panels/Windows/PinnedView`
    - `Panels/Windows/AllView`
    - `Panels/Windows/SearchView`
    - `Panels/Windows/Context`
    - `Panels/Search/Panel`
    - `Panels/Search/DefaultView`
    - `Panels/Search/Context`
    - `Panels/Context/Panel`
    - `Panels/Context/UseCases`
    - `Windows/Folder`
    - `Windows/Browser`
- output:
  - 공개 계약:
    - panel family stories는 `Panels/*` 아래에만 존재한다.
    - `Windows/*` root는 `Folder`, `Browser`만 가진다.
    - later compare가 사용할 exact Folder/Browser story recipient는 아래 네 값이다.
      - `windows-folder--compare-desktop-blog`
      - `windows-folder--compare-mobile-blog`
      - `windows-browser--compare-desktop-article`
      - `windows-browser--compare-mobile-article`
  - 내부 기본값:
    - panel/context/search compare `kind/state` key는 taxonomy repair만으로 바꾸지 않는다.
    - supporting fixture/comment는 새 root vocabulary만 정리하고 canonical state inventory는 건드리지 않는다.
  - 중요한 negative output:
    - `Windows/Components/*`와 `Search/Components/*` 같은 old taxonomy를 alias로 남기지 않는다.
    - `Windows/*` 아래에 panel family story를 하나라도 남기지 않는다.
    - `Taskbar/*` taxonomy를 이번 repair 범위에서 다시 설계하지 않는다.
- 선행조건:
  - Phase 1 output인 canonical fidelity inventory와 deferred note가 먼저 존재해야 한다.
- 제약:
  - story title repair가 compare `kind/state` key 변경을 강제해서는 안 된다.
  - `.claude` 문서는 source tree rule을 요약해야지 별도의 예외 체계를 만들면 안 된다.
- side effects:
  - Storybook-generated story ID가 바뀐다. later compare phase는 이 phase가 고정한 exact Folder/Browser recipient만 사용해야 한다.
  - reviewer가 Storybook root만 봐도 panel family와 window family가 분리된 것을 확인할 수 있다.
- failure/validation:
  - exact Folder/Browser compare story recipient를 둘 이상으로 해석할 수 있으면 Phase 4 capture script가 one-hop prerequisite를 잃으므로 blocker다.
  - `.claude` 문서가 old taxonomy를 계속 canonical rule로 남기면 future drift를 다시 열게 되므로 blocker다.
- 작업:
  - panel family story title을 `Panels/Windows/*`, `Panels/Search/*`, `Panels/Context/*`로 옮긴다.
  - `Folder`와 `Browser` story title을 `Windows/Folder`, `Windows/Browser`로 고정하고 later compare용 export naming을 정리한다.
  - supporting fixture/comment 파일에서 old taxonomy wording을 새 vocabulary로 바꾼다.
  - `.claude/rules/storybook.md`와 `.claude/CLAUDE.md`를 같은 taxonomy로 갱신한다.
  - exact Folder/Browser compare story ID를 later phase가 그대로 사용할 수 있게 문서와 source 둘 다 일치시킨다.
- 검증:
  - [ ] `pnpm --filter @windows/ui build-storybook`가 성공한다.
  - [ ] `rg -n 'title: "(Windows/Components/|Windows/Compose/|Search/Components/|Search/Compose/|Context/Components/|Context/Compose/)"' packages/ui/src/components .claude` 결과가 비어 있다.
  - [ ] `rg -n 'title: "(Panels/Windows/|Panels/Search/|Panels/Context/|Windows/Folder|Windows/Browser)"' packages/ui/src/components` 결과가 final taxonomy를 보여 준다.
  - [ ] `rg -n '(Windows/Compose/Context|Search/Compose/Context|Context/Compose/UseCases|Windows/Components/|Search/Components/|Context/Components/)' packages/ui/src/components/panels/search/storybook/searchPanelContextFixtures.ts packages/ui/src/components/panels/context/storybook/contextPanelHostRowInventories.tsx packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts` 결과가 비어 있다.
  - [ ] `rg -n '(Panels/Windows/Context|Panels/Search/Context|Panels/Context/UseCases)' packages/ui/src/components/panels/search/storybook/searchPanelContextFixtures.ts packages/ui/src/components/panels/context/storybook/contextPanelHostRowInventories.tsx packages/ui/src/components/panels/search/storybook/searchPanelReferenceFixtures.ts` 결과가 supporting comment cleanup의 final vocabulary를 보여 준다.
  - [ ] `rg -n '(Windows/Components/Panel|Windows/Compose/Context|Search/Components/Panel|Search/Compose/Context|Context/Components/Panel|Context/Compose/UseCases|Domain/Components/Name|Domain/Compose/Name|canonical domain root는 .*Taskbar.*Windows.*Search.*Context.*4개)' .claude/rules/storybook.md .claude/CLAUDE.md` 결과가 비어 있다.
  - [ ] `rg -n '(Panels/Windows/Panel|Panels/Search/Panel|Panels/Context/Panel|Windows/Folder|Windows/Browser)' .claude/rules/storybook.md .claude/CLAUDE.md` 결과가 `.claude` 문서가 final taxonomy examples를 설명함을 보여 준다.
  - [ ] `packages/ui/storybook-static/index.json`에서 `windows-folder--compare-desktop-blog`, `windows-folder--compare-mobile-blog`, `windows-browser--compare-desktop-article`, `windows-browser--compare-mobile-article`가 각각 정확히 한 번씩 나타난다.
