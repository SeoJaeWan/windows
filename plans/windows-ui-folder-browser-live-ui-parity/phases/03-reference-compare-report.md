# Phase 3. 기준 비교 보고서 생성

> 이 문서는 Phase 1에서 고정한 baseline과 Phase 2에서 닫은 current surface를 같은 key로 캡처하고 비교 보고서로 남기는 실행용 상세 계약이다.
> 이 phase는 compare/report만 담당하며 product code를 수정하지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | exact canonical 4-state를 same host canvas와 same key naming으로 캡처하고 structural/documentary 분류가 있는 compare report를 남긴다. |
| 선행조건 | Phase 1 baseline inventory와 Phase 2 exact story recipient 및 stage marker가 고정돼 있어야 한다. |
| 완료 판단 | `visual-compare/report.md`가 canonical 4-state, provenance, exact artifact pair, structural blocking drift, documentary drift를 모두 기록한다. |
| 중단 조건 | report가 같은 key naming을 유지하지 못하거나 documentary drift를 다시 blocker로 판정하려면 compare scope가 깨진 것이므로 이 phase는 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 합의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-ui-parity/capture-current.mjs` | 추가 | canonical story recipient 4개만 current capture 대상이다. capture owner는 Phase 2 stage marker와 `data-visual-root` metadata를 literal하게 사용해야 한다. | script가 exact 4 story ID와 exact host canvas만 캡처한다. |
| `plans/windows-ui-folder-browser-live-ui-parity/visual-compare/run-diff.mjs` | 추가 | baseline/current/diff artifact와 report row는 모두 같은 `kind/state` key naming을 써야 한다. | emitted file name과 report row가 같은 key를 공유한다. |
| `plans/windows-ui-folder-browser-live-ui-parity/visual-compare/` | 추가/정리 | report는 external baseline, package-local current, structural/documentary drift를 구분해 적어야 한다. | current PNG, diff PNG, `report.md`가 canonical 4-state에 대해 모두 존재한다. |

### 완료 증거

- report가 `folder/desktop-blog`, `folder/mobile-blog`, `browser/desktop-article`, `browser/mobile-article`를 모두 나열한다.
- report가 baseline provenance와 current provenance를 분리해서 적는다.
- report가 Folder structural blocker와 Browser shell blocker를 documentary drift와 섞지 않는다.
- capture selector가 consumer-supplied `data-*`가 아니라 package-owned reserved marker contract를 읽는다는 점이 report input에 그대로 남는다.

## 실행 계약

- owner_agent: `visual-comparator`
- 목적:
  - current surface와 live baseline의 차이를 repo-local evidence로 남기고, 다음 phase가 literal mismatch key만 보고 움직일 수 있게 만든다.
- 작업:
  1. exact story recipient 4개를 canonical host canvas에서 current capture로 생성한다.
  2. baseline/current/diff artifact를 같은 `kind/state` key naming으로 정렬한다.
  3. report에 provenance, size match, structural blocking drift, documentary drift를 key별로 적는다.
- boundary:
  - primary write target: `plans/windows-ui-folder-browser-live-ui-parity/capture-current.mjs`
  - primary write target: `plans/windows-ui-folder-browser-live-ui-parity/visual-compare/run-diff.mjs`
  - primary write target: `plans/windows-ui-folder-browser-live-ui-parity/visual-compare/`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-ui-parity/reference-captures/baseline-inventory.md`
  - read-only prerequisite: `packages/ui/src/components/windows/folder/folder.stories.tsx`
  - read-only prerequisite: `packages/ui/src/components/windows/browser/browser.stories.tsx`
  - read-only prerequisite: `packages/ui/src/components/windows/storybook/compareWindowStage.tsx`
  - read-only prerequisite: `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`
- input:
  - 시나리오: maintainer가 exact live baseline과 exact Storybook compare surface를 1:1로 대조해 structural parity evidence를 남겨야 하는 경우
  - exact story recipient:
    - `windows-folder--compare-desktop-blog`
    - `windows-folder--compare-mobile-blog`
    - `windows-browser--compare-desktop-article`
    - `windows-browser--compare-mobile-article`
  - exact capture contract:
    - stage selector: `[data-window-compare-stage="desktop"]` 또는 `[data-window-compare-stage="mobile"]`
    - inner owner metadata: exact one `[data-visual-root][data-visual-kind][data-visual-state]`
    - marker ownership prerequisite:
      - `data-window-frame-root`, `data-window-frame-chrome`, `data-window-frame-body`, `data-window-compare-stage`는 package-owned marker다.
      - conflicting consumer host attr는 strip되거나 package marker가 spread order winner가 되어 capture selector를 바꾸지 못한다.
  - exact artifact key:
    - `folder/desktop-blog`
    - `folder/mobile-blog`
    - `browser/desktop-article`
    - `browser/mobile-article`
  - report classification rule:
    - structural blocking drift는 Phase 1 baseline inventory의 blocking focus를 따른다.
    - documentary drift는 Phase 1 baseline inventory의 documentary-only scope를 따른다.
- output:
  - 공개 계약:
    - report는 canonical 4-state 모두에 대해 pass/fail와 drift summary를 exact key로 적는다.
    - baseline provenance는 `external-source evidence`, current provenance는 `package-local current`다.
    - same key naming이 baseline/current/diff/report 전체에서 유지된다.
    - compare capture는 package-owned reserved marker를 기준으로 한 canonical host canvas를 읽는다.
  - 파생 기본값:
    - Folder는 structural blocker와 sample-content documentary drift를 분리해 적는다.
    - Browser는 shell blocker와 `children` body documentary drift를 분리해 적는다.
  - 중요 negative output:
    - documentary drift를 blocking pass/fail 근거로 올리지 않는다.
    - support-only review story를 canonical compare inventory에 넣지 않는다.
    - mismatch가 있다고 이 phase 안에서 source tree를 바로 수정하지 않는다.
    - consumer-supplied `data-window-*` attr를 compare selector owner로 취급하지 않는다.
- 선행조건:
  - Phase 1 baseline inventory가 canonical 4-state와 scope rule을 고정해야 한다.
  - Phase 2가 exact story recipient와 exact stage marker를 고정해야 한다.
- 제약:
  - report row, current PNG, diff PNG는 모두 같은 key naming을 써야 한다.
  - compare evidence는 이 plan folder 안에만 남겨 later handoff가 previous plan artifact에 의존하지 않게 한다.
  - capture selector owner는 Phase 2의 reserved marker ownership wording을 literal하게 재사용해야 한다.
- side effects:
  - Phase 4 fix target이 exact `kind/state` key와 category로 좁혀진다.
  - final acceptance가 this-plan compare report로 이동한다.
- failure/validation:
  - stage selector나 story recipient를 literal하게 특정하지 못하면 canonical host canvas compare 계약이 깨지므로 blocker다.
  - documentary drift가 report에서 blocker처럼 적히면 Phase 1 scope contract가 깨진 것이므로 blocker다.
  - key naming이 baseline/current/diff/report 사이에서 어긋나면 Phase 4 handoff가 literal하지 않으므로 blocker다.
  - capture selector가 consumer pass-through attr와 package-owned marker 사이에서 winner가 불명확하면 blocker다.
- 검증
  - [ ] `visual-compare/report.md`가 exact canonical 4-state key를 모두 나열한다.
  - [ ] `visual-compare/` 아래 current PNG와 diff PNG가 같은 key naming으로 존재한다.
  - [ ] report가 baseline provenance, current provenance, structural blocker, documentary drift를 명시적으로 분리한다.
  - [ ] compare phase 문구만 읽어도 capture selector가 package-owned reserved marker를 기준으로 한다는 점을 다시 추측할 필요가 없다.
