# Phase 4. reference 기반 visual compare 보고

> 이 문서는 external live reference와 local compare story를 짝지어 repo-local capture/diff/report를 남기는 실행용 상세 계약이다.
> 이 phase는 compare/report만 담당하며 product code를 고치지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | canonical 6 state를 external live reference와 대조해 repo-local reference/current/diff/report artifact를 남긴다. |
| 선행조건 | Phase 3의 canonical inventory와 compare story owner가 stable해야 한다. |
| 완료 판단 | plan folder 아래에 canonical 6 state 모두에 대한 compare artifact와 pass/fail report가 남는다. |
| 중단 조건 | compare story가 canonical key를 잃었거나, external live reference route가 acceptance target으로 더 이상 유효하지 않다는 정책 변경이 생기면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-window-family/reference-captures/` | 추가/정리 | reference capture는 canonical 6 state와 1:1로 대응하고 route/viewport provenance를 잃으면 안 된다. | 각 artifact가 어떤 state key의 reference side인지 바로 읽힌다. |
| `plans/windows-ui-folder-browser-window-family/visual-compare/` | 추가/정리 | current capture, diff artifact, report는 same `kind/state` key를 공유해야 한다. | canonical 6 state 각각의 reference/current/diff/report recipient가 연결된다. |

### 완료 증거

- report가 canonical 6 state를 모두 나열한다.
- mismatch가 있으면 exact `kind/state` key와 drift summary가 artifact pair와 함께 적혀 있다.
- report가 이 phase가 product code를 수정하지 않았음을 명시한다.

- owner_agent: `visual-comparator`
- 목적:
  - live site visual direction을 repo-local evidence로 번역해 Phase 5 fix가 subjective taste가 아니라 exact state report를 기준으로 움직이게 한다.
- boundary:
  - primary write target: `plans/windows-ui-folder-browser-window-family/reference-captures/`
  - primary write target: `plans/windows-ui-folder-browser-window-family/visual-compare/`
  - read-only reference: `https://seojaewan.com/blog`
  - read-only reference: `https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`
  - read-only reference: `https://www.seojaewan.com/blog/__windows-ui-folder-browser-window-family-missing__`
  - read-only compare owner: `packages/ui/src/components/windows/folder/folder.stories.tsx`
  - read-only compare owner: `packages/ui/src/components/windows/browser/browser.stories.tsx`
  - read-only compare selector source: `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
- input:
  - 시나리오: canonical 6 state가 package source에서 동결된 뒤, maintainer가 external live reference와 current package implementation의 visual parity를 inspectable artifact로 남기려는 경우
  - exact acceptance inventory:
    - `folder/desktop-default` -> `https://seojaewan.com/blog` desktop viewport
    - `folder/mobile-collapsed` -> `https://seojaewan.com/blog` mobile viewport
    - `browser/desktop-article` -> `https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0` desktop viewport
    - `browser/mobile-article` -> `https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0` mobile viewport
    - `browser/desktop-not-found` -> `https://www.seojaewan.com/blog/__windows-ui-folder-browser-window-family-missing__` desktop viewport
    - `browser/mobile-not-found` -> `https://www.seojaewan.com/blog/__windows-ui-folder-browser-window-family-missing__` mobile viewport
  - compare selector contract:
    - current capture는 `[data-visual-root][data-visual-kind][data-visual-state]` recipient를 따른다.
- output:
  - 공개 계약:
    - report는 canonical 6 state 각각의 pass/fail과 drift summary를 남긴다.
    - reference/current/diff artifact는 같은 `kind/state` key를 공유한다.
  - 내부 기본값:
    - report는 `folder` 2개와 `browser` 4개를 kind별로 묶어 쓴다.
    - desktop/mobile viewport provenance를 artifact 이름이나 report 문장으로 함께 남긴다.
  - 중요한 negative output:
    - 이 phase는 product code, stories, fixtures를 수정하지 않는다.
    - canonical inventory 밖의 supporting sample을 acceptance target으로 확장하지 않는다.
    - taskbar/background 전체 composition을 compare target으로 승격하지 않는다.
- 선행조건:
  - Phase 3에서 `folder` / `browser` compare kind와 canonical 6 state key가 고정돼 있어야 한다.
- 제약:
  - compare evidence는 plan folder에 repo-local artifact로 남아야 한다.
  - reference provenance는 live route와 viewport가 함께 남아 later reviewer가 재현 가능해야 한다.
- side effects:
  - Phase 5의 fix target이 exact `kind/state` key 기반으로 결정된다.
  - plan folder 아래에 capture/diff evidence가 추가된다.
- failure/validation: canonical key 하나라도 누락되거나, reference/current artifact naming이 서로 달라 same state pair를 잃으면 Phase 5가 literal fix target을 받을 수 없으므로 blocker다.
- 작업:
  - canonical 6 state의 reference side capture를 만든다.
  - 같은 6 state의 current side capture를 compare story에서 만든다.
  - pair별 diff artifact와 pass/fail report를 남긴다.
- 검증:
  - [ ] `reference-captures/` 아래에 canonical 6 state를 식별할 수 있는 artifact가 있어야 한다.
  - [ ] `visual-compare/` report가 canonical 6 state를 모두 나열해야 한다.
  - [ ] mismatch가 있으면 exact `kind/state` key와 artifact pair가 같이 남아야 한다.
