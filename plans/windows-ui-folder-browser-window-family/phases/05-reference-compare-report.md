# Phase 5. pinned baseline 기반 visual compare 보고

> 이 문서는 Phase 1에서 고정한 baseline capture와 local compare story를 짝지어 repo-local current/diff/report를 남기는 실행용 상세 계약이다.
> 이 phase는 compare/report만 담당하며 product code를 고치지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | canonical 6 state를 Phase 1 baseline과 current implementation을 대조해 repo-local current/diff/report artifact를 남긴다. |
| 선행조건 | Phase 1의 baseline inventory와 Phase 4의 compare recipient inventory가 stable해야 한다. |
| 완료 판단 | plan folder 아래에 canonical 6 state 모두에 대한 current/diff/report artifact가 남고, report가 baseline provenance를 external-source evidence로 유지한다. |
| 중단 조건 | compare story가 canonical key를 잃었거나, Phase 1 baseline inventory가 acceptance target으로 더 이상 유효하지 않다는 정책 변경이 생기면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-window-family/visual-compare/` | 추가/정리 | current capture, diff artifact, report는 Phase 1 baseline inventory와 same `kind/state` key를 공유해야 한다. | canonical 6 state 각각의 baseline/current/diff/report recipient가 연결된다. |

### 완료 증거

- report가 canonical 6 state를 모두 나열한다.
- mismatch가 있으면 exact `kind/state` key와 drift summary가 artifact pair와 함께 적혀 있다.
- report가 baseline provenance를 `external-source evidence`로 분류하고 current story capture를 baseline으로 부르지 않는다.

- owner_agent: `visual-comparator`
- 목적:
  - pinned baseline evidence를 기준으로 current package implementation의 visual parity를 inspectable report로 남겨 Phase 6 fix가 exact state report를 기준으로 움직이게 한다.
- boundary:
  - primary write target: `plans/windows-ui-folder-browser-window-family/visual-compare/`
  - read-only baseline source: `plans/windows-ui-folder-browser-window-family/reference-captures/baseline-inventory.md`
  - read-only baseline source: `plans/windows-ui-folder-browser-window-family/reference-captures/`
  - read-only compare owner: `packages/ui/src/components/windows/folder/folder.stories.tsx`
  - read-only compare owner: `packages/ui/src/components/windows/browser/browser.stories.tsx`
  - read-only compare selector source: `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
- input:
  - 시나리오: canonical 6 state baseline이 repo-local artifact로 동결된 뒤, maintainer가 current package implementation과 baseline의 visual parity를 inspectable report로 남기려는 경우
  - exact acceptance inventory:
    - `folder/desktop-default`
    - `folder/mobile-collapsed`
    - `browser/desktop-article`
    - `browser/desktop-not-found`
    - `browser/mobile-article`
    - `browser/mobile-not-found`
  - provenance rule:
    - Phase 1 baseline image는 `external-source evidence`
    - current compare story capture는 `package-local current`
    - diff artifact는 pair-specific comparison evidence
  - compare selector contract:
    - current capture는 `[data-visual-root][data-visual-kind][data-visual-state]` recipient를 따른다.
- output:
  - 공개 계약:
    - report는 canonical 6 state 각각의 pass/fail과 drift summary를 남긴다.
    - baseline/current/diff artifact는 같은 `kind/state` key를 공유한다.
    - final pass/fail claim은 Phase 1 baseline provenance를 기준으로 쓴다.
  - 내부 기본값:
    - report는 `folder` 2개와 `browser` 4개를 kind별로 묶어 쓴다.
    - desktop/mobile viewport provenance는 Phase 1 inventory를 그대로 인용한다.
  - 중요한 negative output:
    - 이 phase는 product code, stories, fixtures를 수정하지 않는다.
    - Phase 1 baseline 대신 live URL을 다시 baseline source로 삼지 않는다.
    - current story capture를 proxy baseline처럼 `reference`로 뭉뚱그리지 않는다.
- 선행조건:
  - Phase 1에서 canonical 6 state baseline image와 provenance inventory가 고정돼 있어야 한다.
  - Phase 4에서 compare recipient inventory와 positive signal test가 통과 가능해야 한다.
- 제약:
  - compare evidence는 plan folder에 repo-local artifact로 남아야 한다.
  - report는 baseline provenance와 current provenance를 명시적으로 구분해야 한다.
- side effects:
  - Phase 6의 fix target이 exact `kind/state` key 기반으로 결정된다.
  - plan folder 아래에 current/diff/report evidence가 추가된다.
- failure/validation: canonical key 하나라도 누락되거나, baseline/current artifact naming이 서로 달라 same state pair를 잃거나, provenance 분류가 섞이면 Phase 6가 literal fix target을 받을 수 없으므로 blocker다.
- 작업:
  - Phase 1 baseline image를 reference side로 읽는다.
  - canonical 6 state의 current side capture를 compare story에서 만든다.
  - pair별 diff artifact와 pass/fail report를 남긴다.
  - provenance type을 report에 같이 남긴다.
- 검증:
  - [ ] `visual-compare/` report가 canonical 6 state를 모두 나열해야 한다.
  - [ ] mismatch가 있으면 exact `kind/state` key와 artifact pair가 같이 남아야 한다.
  - [ ] report가 baseline provenance를 `external-source evidence`로 명시해야 한다.
