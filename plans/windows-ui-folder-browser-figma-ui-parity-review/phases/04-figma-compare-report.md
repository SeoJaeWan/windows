# Phase 4. Figma compare report 생성

> 이 문서는 Figma baseline과 current Storybook surface를 같은 key로 대조해 per-state 3-bucket report를 남기는 실행용 상세 계약이다.
> 이 phase는 evidence만 만든다. source-tree 제품 코드는 수정하지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | canonical state 6개를 Figma reference/current/diff artifact와 same key로 묶고 same-path report에 per-state `blocking differences`, `non-blocking differences`, `fixture noise` bucket을 빈 bucket까지 남긴다. |
| 선행조건 | Phase 1 baseline inventory와 Phase 3 current source가 same key와 same geometry contract를 공유해야 한다. |
| 완료 판단 | `visual-compare/report.md`만 읽어도 각 state의 blocker fix 대상과 later-pass 항목, fixture noise를 분리해서 볼 수 있다. |
| 중단 조건 | state key 6개 중 하나라도 artifact naming에서 빠지거나 report가 세 bucket을 합쳐 서술해야만 한다면 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/capture-current.mjs` | 추가 | canonical compare story ID 6개와 `compareWindowStage.tsx`가 소유한 compare stage selector만 current capture 대상으로 쓴다. | script가 same key naming과 exact stage owner를 literal하게 가진다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/visual-compare/run-diff.mjs` | 추가 | reference/current/diff artifact는 모두 same `kind/state` key를 따른다. | `diff-results.json`가 6 state를 same key로 기록한다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/visual-compare/diff-results.json` | 추가/갱신 | pixel/size level raw metrics는 same key로 구조화한다. | all 6 state rows가 존재한다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/visual-compare/report.md` | 추가/갱신 | human-readable report는 state별로 세 bucket을 별도 섹션이나 table로 남기고 empty bucket은 `없음`으로 유지해야 한다. | reviewer가 blocker와 noise를 문맥 추측 없이 읽을 수 있다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/visual-compare/*.png` | 추가/갱신 | current/diff artifact는 same key naming으로 남긴다. | `*-current.png`, `*-diff.png`가 6 state 모두에 대해 존재한다. |

### 완료 증거

- report가 canonical state 6개를 빠짐없이 다룬다.
- report가 state마다 `blocking differences`, `non-blocking differences`, `fixture noise`를 별도 구획으로 적는다.
- current capture가 exact compare story ID와 `compareWindowStage.tsx`가 소유한 `[data-window-compare-stage]` owner만 사용한다.
- artifact filename, report row, raw diff result가 모두 같은 key를 쓴다.
- bucket이 비어도 `없음`으로 구조적으로 남는다.

## 실행 계약

- owner_agent: `visual-comparator`
- 목적:
  - Figma reference와 current package surface의 차이를 key-stable evidence로 남겨 Phase 5가 blocker만 보고 움직일 수 있게 만든다.
- 작업 순서:
  1. canonical compare story 6개를 compare stage owner에서 current PNG로 캡처한다.
  2. Phase 1 reference PNG와 same key로 diff artifact와 raw metrics를 생성한다.
  3. report에 state별 세 bucket과 next action을 기록한다.
- boundary: plan-local capture/diff/report artifact만 쓴다. source-tree 제품 코드는 수정하지 않는다.
- input:
  - 시나리오: maintainer가 Figma reference와 current Storybook surface를 exact state key 단위로 대조해 blocker만 fix phase에 넘겨야 하는 경우
  - exact compare story recipient:
    - `windows-compose-folder--compare-desktop-blog`
    - `windows-compose-folder--compare-desktop-search-open`
    - `windows-compose-folder--compare-mobile-blog`
    - `windows-compose-browser--compare-desktop-article`
    - `windows-compose-browser--compare-desktop-address-open`
    - `windows-compose-browser--compare-mobile-article`
  - exact stage selector:
    - desktop -> `[data-window-compare-stage="desktop"]`
    - mobile -> `[data-window-compare-stage="mobile"]`
  - exact stage owner:
    - DOM owner -> `compareWindowStage.tsx`
    - `WindowFrame`는 stage selector owner가 아니고 inner frame/body marker만 제공한다.
  - exact compare root metadata:
    - one `[data-visual-root]`
    - one `data-visual-kind`
    - one `data-visual-state`
  - per-state report bucket contract:
    - `blocking differences` -> first-pass blocker만 적는다.
    - `non-blocking differences` -> visible mismatch지만 이번 pass fix target은 아닌 항목만 적는다.
    - `fixture noise` -> copy/image/glyph exactness처럼 parity winner가 아닌 항목만 적는다.
  - artifact naming:
    - reference -> `reference-captures/{kind}-{state}.png`
    - current -> `visual-compare/{kind}-{state}-current.png`
    - diff -> `visual-compare/{kind}-{state}-diff.png`
- output:
  - 공개 계약:
    - `report.md`는 state 6개 각각에 대해 세 bucket을 별도 구획으로 남긴다.
    - bucket이 비어 있어도 `없음`으로 구조를 유지한다.
    - `diff-results.json`는 size/ratio/raw pixel 정보를 same key로 남긴다.
    - report는 primary provenance를 Figma file/frame 기준으로 적고 current source provenance를 별도 열로 적는다.
    - capture boundary의 stage selector owner는 `compareWindowStage.tsx` 하나다.
    - fix target은 `blocking differences` bucket만 소비한다.
  - 내부 기본값:
    - bucket에 해당 항목이 없으면 `없음`으로 적고 빈 bucket을 생략하지 않는다.
    - `folder/desktop-search-open`과 `browser/desktop-address-open`의 open-state visual mismatch는 blocker scope와 OOS scope를 다시 분리해 적는다.
  - 허용하지 않는 대안:
    - raw diff pixel 수만으로 blocker를 결정하지 않는다.
    - report prose 한 문단에 blocker/noise를 섞지 않는다.
    - review-only edge state를 compare inventory에 넣지 않는다.
- 선행조건:
  - Phase 1 reference PNG와 Phase 2 canonical state inventory, Phase 3 current surface가 모두 same key contract를 가져야 한다.
- 제약:
  - report와 artifact는 모두 이번 slug folder 아래에 남겨야 한다.
  - report는 Figma primary provenance와 package-local current provenance를 명확히 구분해야 한다.
  - same key naming을 벗어난 alias를 report 안에서 만들지 않는다.
- side effects:
  - Phase 5가 blocking bucket만 소비하는 self-sufficient fix phase가 된다.
  - later reviewer가 non-blocking/noise를 다시 Figma capture와 연결해 볼 수 있다.
- failure/validation:
  - state key 6개 중 하나라도 artifact 또는 report에서 누락되면 blocker다.
  - 세 bucket 중 하나라도 상태별로 생략되면 blocker다.
  - empty bucket이 `없음`으로 남지 않고 silently dropped 되면 blocker다.
  - compare capture가 `compareWindowStage.tsx` owner 대신 inner wrapper나 consumer attr를 캡처하면 blocker다.
- 검증:
  - [ ] `visual-compare/diff-results.json`가 state 6개를 모두 기록한다.
  - [ ] `visual-compare/report.md`가 state 6개 각각에 대해 세 bucket을 명시한다.
  - [ ] 빈 bucket이 있어도 `visual-compare/report.md`에서 `없음`으로 구조가 유지된다.
  - [ ] `visual-compare/*-current.png`와 `*-diff.png`가 same key naming으로 6 state 모두 존재한다.
