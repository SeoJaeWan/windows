# Phase 3. reference 기반 composition compare 보고

> 이 문서는 `visual-comparator`가 external reference와 repo compare story를 짝지어 evidence를 남기는 phase다.
> product code를 고치지 않고, 어떤 실사용 composition case가 맞고 틀린지 inspectable report를 남기는 것이 목표다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | 실사용 composition compare 8개를 live/blog reference와 대조해 repo-local capture/diff/report를 남긴다. |
| 선행조건 | Phase 2의 compare kind/state inventory와 story owner가 stable해야 한다. |
| 완료 판단 | `plans/windows-taskbar-12-context-panel-family` 아래에 composition 8개의 reference/current/diff/report artifact가 남고, pass/fail이 case별로 읽힌다. |
| 중단 조건 | compare inventory가 exact case recipient를 잃어 capture가 불가능하거나, external reference가 8개 실사용 case acceptance target으로 더 이상 유효하지 않다는 새 결정이 생기면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-taskbar-12-context-panel-family/reference-captures/` | 추가/정리 | external source capture는 exact composition inventory 8개와 1:1로 대응해야 한다. | 각 capture가 어떤 case acceptance target인지 파일명 또는 report에서 바로 읽힌다. |
| `plans/windows-taskbar-12-context-panel-family/visual-compare/` | 추가/정리 | current capture, diff artifact, report는 같은 inventory key를 써야 한다. | case별 reference/current/diff/report recipient가 모두 연결된다. |

### 완료 증거

- report에 Windows 7개 case와 Search 1개 case가 모두 등장한다.
- mismatch가 있으면 case name과 drift 이유가 file pair와 함께 적혀 있다.
- canonical compare는 external acceptance inventory가 아니라 package-local machine surface라는 note가 report에 남는다.

- owner_agent: `visual-comparator`
- 목적: external direction을 repo-local evidence로 번역해 review와 Phase 4 fix가 subjective taste가 아니라 inspectable case report를 기준으로 움직이게 한다.
- boundary:
  - primary write target: `plans/windows-taskbar-12-context-panel-family/reference-captures/`
  - primary write target: `plans/windows-taskbar-12-context-panel-family/visual-compare/`
  - read-only reference: `https://seojaewan.com`
  - read-only reference: `C:\Users\USER\Desktop\dev\blog\src\components\atoms\leftClickPanel/index.tsx`
  - read-only reference: `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskSearchLeftPanel/index.tsx`
  - read-only reference: `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskWindowsLeftPanel/index.tsx`
  - read-only compare owner: `packages/ui/src/components/panels/windows/storybook/windowsPanelContext.stories.tsx`
  - read-only compare owner: `packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx`
  - read-only compare owner: `packages/ui/src/components/panels/context/contextPanel/contextPanel.stories.tsx`
- input:
  - 시나리오: compare story owner가 이미 stable한 상태에서, maintainer가 external reference와 current package implementation의 visual parity를 repo-local report로 남기려는 경우
  - exact compare inventory:
    - `windows-panel-context/pinned-2025`
    - `windows-panel-context/pinned-values-and-types`
    - `windows-panel-context/pinned-homepage`
    - `windows-panel-context/pinned-data-types`
    - `windows-panel-context/all-pinned-2025`
    - `windows-panel-context/all-unpinned-reference`
    - `windows-panel-context/search-results-reference`
    - `search-panel-context/results-reference`
  - canonical compare note:
    - `context-panel/*` compare states는 package-local machine regression inventory다.
    - external reference report는 위 8개 composition case만 acceptance inventory로 다룬다.
- output:
  - 공개 계약:
    - `plans/windows-taskbar-12-context-panel-family/visual-compare/` report는 위 8개 inventory key 각각에 대해 pass/fail을 남긴다.
    - mismatch가 있으면 Phase 4가 그대로 소비할 수 있게 exact `kind/state` recipient와 drift summary를 남긴다.
  - 내부 기본값:
    - report는 Windows 7개와 Search 1개를 kind별로 분리해 쓴다.
    - capture selector는 repo compare story가 제공하는 `[data-visual-root]` + `data-visual-kind` + `data-visual-state` recipient를 따른다.
  - 중요한 negative output:
    - 이 phase는 product code나 story source를 수정하지 않는다.
    - taskbar-only `taskbarContextMenu`를 acceptance target으로 승격하지 않는다.
    - canonical compare inventory를 external reference pair로 억지 확장하지 않는다.
- 선행조건:
  - Phase 2에서 `windows-panel-context` 7개 case와 `search-panel-context` 1개 case가 literal하게 닫혀 있어야 한다.
- 제약:
  - report는 repo-local artifact로 남아야 한다. live URL이나 blog source만 링크해 두고 끝내면 안 된다.
  - compare phase는 diff/report만 남기고 UI source를 고치지 않는다.
- side effects:
  - plan folder 아래에 capture와 diff evidence가 추가된다.
  - Phase 4의 fix boundary가 case report key 기준으로 결정된다.
- failure/validation: inventory key 하나라도 누락되거나, current capture와 reference capture를 서로 다른 naming/recipient 체계로 남기면 Phase 4가 fix target을 literal하게 받을 수 없으므로 blocker다.
- 작업:
  - live/blog source에서 composition 8개의 reference side capture를 만든다.
  - repo compare story에서 같은 8개 inventory key의 current side capture를 만든다.
  - pair별 diff artifact와 pass/fail summary를 report에 남긴다.
  - canonical compare가 external acceptance inventory가 아니라는 note를 report에 남긴다.
- 검증:
  - [ ] `reference-captures/` 아래에 composition 8개 inventory를 식별할 수 있는 capture가 있어야 한다.
  - [ ] `visual-compare/` report가 위 8개 key를 모두 나열해야 한다.
  - [ ] diff artifact가 존재하면 report에서 같은 key와 연결돼야 한다.
