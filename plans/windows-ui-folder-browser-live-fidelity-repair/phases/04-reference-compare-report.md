# Phase 4. 기준선 비교 리포트 생성

> 이 문서는 refreshed baseline과 refreshed windows compare surface를 1:1로 캡처·diff·report하는 실행용 상세 계약이다.
> 이 phase는 compare/report만 담당하며 source tree product code는 수정하지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | canonical 4-state inventory를 exact story recipient와 exact kind/state key로 캡처하고 repo-local compare report를 남긴다. |
| 선행조건 | Phase 1의 canonical baseline 4개와 Phase 2의 exact Folder/Browser story recipient, Phase 3의 canonical compare inventory가 모두 안정돼 있어야 한다. |
| 완료 판단 | `visual-compare/report.md`가 canonical 4-state와 provenance 분류를 모두 나열하고, mismatch가 있으면 exact artifact pair를 남긴다. |
| 중단 조건 | exact story recipient가 바뀌었거나 canonical 4-state key와 artifact naming이 서로 어긋나면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-fidelity-repair/capture-current.mjs` | 추가 | current capture 대상은 exact story ID 네 개뿐이다: `windows-folder--compare-desktop-blog`, `windows-folder--compare-mobile-blog`, `windows-browser--compare-desktop-article`, `windows-browser--compare-mobile-article`. | script가 canonical 4-state current capture만 생성하고 `browser/*-not-found`를 캡처하지 않는다. |
| `plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/run-diff.mjs` | 추가 | baseline/current/diff artifact는 같은 `kind/state` key naming을 공유해야 한다. | diff artifact가 report row와 같은 key naming을 쓴다. |
| `plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/` | 추가/정리 | report는 external-source evidence baseline과 package-local current를 분리 표기해야 한다. | canonical 4-state 각각의 current PNG, diff PNG, report row가 존재한다. |

### 완료 증거

- report가 `folder/desktop-blog`, `folder/mobile-blog`, `browser/desktop-article`, `browser/mobile-article` 네 key를 모두 나열한다.
- baseline provenance가 `external-source evidence`, current provenance가 `package-local current`로 분리된다.
- missing-slug observation이 compare inventory가 아니라 deferred note라는 점이 report에 같이 적힌다.

- owner_agent: `visual-comparator`
- 목적:
  - refreshed baseline과 refreshed source contract의 차이를 inspectable repo-local evidence로 남겨 Phase 5 fix가 literal mismatch key만 다루게 한다.
- boundary:
  - primary write target: `plans/windows-ui-folder-browser-live-fidelity-repair/capture-current.mjs`
  - primary write target: `plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/run-diff.mjs`
  - primary write target: `plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/baseline-inventory.md`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/missing-slug-observation.md`
  - read-only prerequisite: `packages/ui/src/components/windows/folder/folder.stories.tsx`
  - read-only prerequisite: `packages/ui/src/components/windows/browser/browser.stories.tsx`
  - read-only prerequisite: `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`
- input:
  - 시나리오: maintainer가 새 repair plan의 exact baseline과 exact compare story recipient를 사용해 현재 구현의 visual drift를 문서화하려는 경우
  - exact story recipient:
    - `windows-folder--compare-desktop-blog`
    - `windows-folder--compare-mobile-blog`
    - `windows-browser--compare-desktop-article`
    - `windows-browser--compare-mobile-article`
  - exact artifact key:
    - `folder/desktop-blog`
    - `folder/mobile-blog`
    - `browser/desktop-article`
    - `browser/mobile-article`
- output:
  - 공개 계약:
    - report는 canonical 4-state의 pass/fail, size match, drift summary를 exact key로 남긴다.
    - baseline/current/diff artifact는 같은 `kind/state` key naming을 쓴다.
    - report는 missing-slug handling이 deferred/out-of-inventory라고 명시한다.
  - 내부 기본값:
    - baseline filename은 Phase 1 inventory를 그대로 인용한다.
    - current capture filename은 `{kind}-{state}-current.png`, diff filename은 `{kind}-{state}-diff.png` 형태를 따른다.
  - 중요한 negative output:
    - `browser/*-not-found` compare artifact를 새로 만들지 않는다.
    - package-local current capture를 baseline provenance로 승격하지 않는다.
    - mismatch가 있다고 해서 source tree를 이 phase에서 바로 수정하지 않는다.
- 선행조건:
  - Phase 2 output의 exact story recipient와 Phase 3 output의 exact inventory key가 같아야 한다.
- 제약:
  - report row, current capture, diff capture는 모두 동일 key naming을 써야 한다.
  - compare 결과는 새 plan folder 안에만 남겨야 한다.
- side effects:
  - Phase 5 fix target이 exact `kind/state` mismatch key 단위로 결정된다.
  - final acceptance가 old plan report가 아닌 새 plan report 기준으로 이동한다.
- failure/validation:
  - story recipient와 artifact key naming이 서로 다르면 compare evidence가 literal handoff를 잃으므로 blocker다.
  - report가 missing-slug deferred stance를 다시 canonical compare row처럼 다루면 scope가 흔들리므로 blocker다.
- 작업:
  - exact story recipient 네 개를 current capture script에 고정한다.
  - canonical baseline 4개와 current capture 4개를 1:1로 diff한다.
  - report에 provenance, size match, drift summary, deferred not-found note를 함께 적는다.
- 검증:
  - [ ] `visual-compare/report.md`가 canonical 4-state key를 모두 나열한다.
  - [ ] `visual-compare/` 아래에 `folder-desktop-blog-current.png`, `folder-mobile-blog-current.png`, `browser-desktop-article-current.png`, `browser-mobile-article-current.png`가 존재한다.
  - [ ] report가 `external-source evidence`와 `package-local current`를 분리 표기하고 `browser/*-not-found`를 deferred note로만 언급한다.
