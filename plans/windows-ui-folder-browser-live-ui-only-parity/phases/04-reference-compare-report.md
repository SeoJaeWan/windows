# Phase 4. 기준 비교 보고서 생성

> 이 문서는 Phase 1의 live baseline과 Phase 2~3의 current surface를 같은 key로 캡처하고 diff/report로 남기는 실행용 상세 계약이다.
> 이 phase는 compare evidence만 만든다. source tree 제품 코드는 수정하지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | live compare state 6개를 같은 key와 같은 stage contract로 캡처하고 drift report를 남긴다. |
| 선행조건 | Phase 1 baseline inventory와 Phase 3 compare story inventory가 exact state key 6개로 잠겨 있어야 한다. |
| 완료 판단 | `visual-compare/report.md`가 state key 6개에 대해 baseline/current/diff provenance와 blocking drift를 exact key로 기록한다. |
| 중단 조건 | compare state 6개가 literal하게 특정되지 않거나 edge-state review surface가 compare inventory에 섞이면 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-ui-only-parity/capture-current.mjs` | 추가 | compare story ID 6개와 canonical stage marker만 current capture 대상으로 사용한다. | script가 exact 6 story ID와 exact stage marker를 literal하게 가진다. |
| `plans/windows-ui-folder-browser-live-ui-only-parity/visual-compare/run-diff.mjs` | 추가 | baseline/current/diff artifact는 모두 같은 `{kind}-{state}` key naming을 쓴다. | report와 artifact가 동일 key로 매칭된다. |
| `plans/windows-ui-folder-browser-live-ui-only-parity/visual-compare/` | 추가/정리 | report는 state key 6개별 baseline/current/diff provenance와 blocking drift를 구분해 적어야 한다. | current PNG, diff PNG, `report.md`가 state key 6개 기준으로 존재한다. |

### 완료 증거

- report가 state key 6개를 모두 나열한다.
- report가 closed state와 desktop open state의 drift를 같은 naming contract로 분리한다.
- capture selector가 package-owned stage marker와 compare root metadata를 사용한다.
- review-only edge state가 compare inventory에 끼어들지 않는다.

## 실행 계약

- owner_agent: `visual-comparator`
- 목적:
  - live baseline과 current package surface의 차이를 repo-local evidence로 남겨 Phase 5가 exact mismatch key만 보고 움직일 수 있게 만든다.
- 작업 순서:
  1. exact story recipient 6개를 canonical stage marker에서 current capture로 생성한다.
  2. baseline/current/diff artifact를 같은 `{kind}-{state}` key naming으로 정렬한다.
  3. report에 state별 provenance, blocking drift, pass/fail 또는 no-op result를 적는다.
- boundary: plan-local capture script, diff script, report artifact만 쓴다. baseline inventory와 windows Storybook compare recipient는 read-only input이다.
- input:
  - 시나리오: maintainer가 live baseline과 current package UI를 state key 6개 단위로 대조해 exact mismatch evidence를 남겨야 하는 경우
  - exact compare story recipient:
    - `windows-folder--compare-desktop-blog`
    - `windows-folder--compare-desktop-search-open`
    - `windows-folder--compare-mobile-blog`
    - `windows-browser--compare-desktop-article`
    - `windows-browser--compare-desktop-address-open`
    - `windows-browser--compare-mobile-article`
  - exact state key:
    - `folder/desktop-blog`
    - `folder/desktop-search-open`
    - `folder/mobile-blog`
    - `browser/desktop-article`
    - `browser/desktop-address-open`
    - `browser/mobile-article`
  - capture contract:
    - stage selector: `[data-window-compare-stage="desktop"]` 또는 `[data-window-compare-stage="mobile"]`
    - inner owner metadata: exact one `[data-visual-root][data-visual-kind][data-visual-state]`
    - review-only edge state는 capture inventory에 포함하지 않는다.
  - report classification:
    - blocking drift는 Phase 1 baseline inventory의 state별 blocking focus를 따른다.
    - runtime behavior, synthetic edge-state copy, article body semantics는 compare blocker로 올리지 않는다.
- output:
  - 공개 계약:
    - report는 state key 6개 모두에 대해 baseline/current/diff provenance와 drift summary를 exact key로 적는다.
    - same key naming이 baseline/current/diff/report 전체에서 유지된다.
    - compare capture는 package-owned stage marker와 compare root metadata를 기준으로 한다.
  - 내부 기본값:
    - desktop open state는 same key naming을 쓰되 story-local harness 결과를 current surface로 본다.
    - mobile compare state는 closed/default shell만 비교 대상으로 둔다.
  - 허용하지 않는 대안:
    - review-only edge state를 canonical compare inventory에 올리지 않는다.
    - compare report 안에서 source tree drift를 즉시 수정하지 않는다.
    - consumer-supplied attr를 compare selector owner로 취급하지 않는다.
- 선행조건:
  - Phase 1 baseline inventory와 Phase 3 compare story inventory가 exact key 6개를 공유해야 한다.
- 제약:
  - artifact naming은 모두 `{kind}-{state}` 규칙을 사용한다.
  - current capture와 diff artifact는 이번 plan folder 안에만 남긴다.
  - report는 desktop open state drift를 closed state drift와 섞지 않는다.
- side effects:
  - Phase 5 fix target이 exact state key와 drift category로 좁혀진다.
  - final acceptance가 this-plan compare report로 이동한다.
- failure/validation:
  - state key 6개 중 하나라도 story recipient 또는 artifact naming에서 빠지면 blocker다.
  - edge-state review surface가 compare inventory에 섞이면 blocker다.
  - capture selector winner가 public attr와 package-owned marker 사이에서 불분명하면 blocker다.
- 검증:
  - [ ] `visual-compare/report.md`가 state key 6개를 모두 나열한다.
  - [ ] `visual-compare/` 아래 current PNG와 diff PNG가 state key 6개 기준으로 존재한다.
  - [ ] report가 baseline provenance와 current provenance를 분리하고 blocking drift만 분류한다.
