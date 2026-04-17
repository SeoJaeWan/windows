# Phase 3. 기준선 비교 리포트 생성

> 이 문서는 Phase 1의 external baseline과 Phase 2의 canonical Storybook compare surface를 exact `kind/state` key로 비교하는 실행용 상세 계약이다.
> 이 phase는 compare/report만 담당하며, mismatch가 있더라도 product code는 수정하지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | exact four-state inventory를 exact story recipient와 exact artifact key로 캡처·diff·report해 blocking visual drift만 남긴다. |
| 선행조건 | Phase 1의 baseline inventory/image와 Phase 2의 exact story IDs/inventory test가 먼저 안정돼 있어야 한다. |
| 완료 판단 | `visual-compare/report.md`가 canonical 4-state, provenance, blocking/non-blocking drift 분류, exact artifact pair를 모두 남긴다. |
| 중단 조건 | story recipient와 artifact key naming이 서로 어긋나거나, report가 support-only story를 canonical compare evidence로 섞어야만 성립한다면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-contract-lock/capture-current.mjs` | 추가 | current capture 대상은 exact compare story 4개뿐이다. | script가 `windows-folder--compare-desktop-blog`, `windows-folder--compare-mobile-blog`, `windows-browser--compare-desktop-article`, `windows-browser--compare-mobile-article`만 캡처한다. |
| `plans/windows-ui-folder-browser-live-contract-lock/visual-compare/run-diff.mjs` | 추가 | baseline/current/diff/report는 모두 같은 `kind/state` key naming을 써야 한다. | emitted current/diff artifact와 report row가 `folder-desktop-blog` 등 같은 key를 사용한다. |
| `plans/windows-ui-folder-browser-live-contract-lock/visual-compare/` | 추가/정리 | report는 external baseline과 package-local current를 provenance별로 분리해야 한다. font-only drift는 non-blocking, geometry/chrome/spacing/responsive/thumbnail ratio drift는 blocking이다. | current image 4개, diff image 4개, `report.md`가 canonical four-state key와 drift 분류를 함께 남긴다. |

### 완료 증거

- `report.md`가 exact four-state key를 모두 나열한다.
- `report.md`가 `external-source evidence`와 `package-local current` provenance를 분리한다.
- `report.md`가 font-only drift를 non-blocking, geometry/chrome/spacing/responsive/thumbnail ratio drift를 blocking으로 분류한다.

- owner_agent: `visual-comparator`
- 목적:
  - live baseline과 `packages/ui` current surface의 차이를 exact key 단위의 repo-local evidence로 남겨 Phase 4가 product code re-open 없이 mismatch만 닫게 한다.
- boundary:
  - primary write target: `plans/windows-ui-folder-browser-live-contract-lock/capture-current.mjs`
  - primary write target: `plans/windows-ui-folder-browser-live-contract-lock/visual-compare/run-diff.mjs`
  - primary write target: `plans/windows-ui-folder-browser-live-contract-lock/visual-compare/`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-contract-lock/reference-captures/baseline-inventory.md`
  - read-only prerequisite: `packages/ui/src/components/windows/folder/folder.stories.tsx`
  - read-only prerequisite: `packages/ui/src/components/windows/browser/browser.stories.tsx`
  - read-only prerequisite: `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`
- input:
  - 시나리오: maintainer가 exact baseline과 exact Storybook compare surface를 1:1로 비교해 blocking drift만 분류하려는 경우
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
  - drift classification rule:
    - non-blocking: font-only difference
    - blocking: geometry, chrome, spacing, responsive behavior, thumbnail ratio
- output:
  - 공개 계약:
    - report는 canonical four-state key의 pass/fail과 drift summary를 exact key로 남긴다.
    - baseline/current/diff artifact는 모두 같은 `kind/state` key naming을 쓴다.
    - report는 provenance를 `external-source evidence`와 `package-local current`로 분리한다.
  - 내부 기본값:
    - current artifact filename은 `{kind}-{state}-current.png`
    - diff artifact filename은 `{kind}-{state}-diff.png`
    - report row는 state별로 blocking/non-blocking drift 항목을 나눠 적는다.
  - 중요한 negative output:
    - support-only review story current capture를 만들지 않는다.
    - package-local current를 baseline provenance로 부르지 않는다.
    - mismatch가 있다고 해서 이 phase 안에서 source tree를 수정하지 않는다.
- 선행조건:
  - Phase 1의 exact baseline inventory와 Phase 2의 exact story IDs/inventory test가 있어야 한다.
- 제약:
  - canonical compare inventory는 exact four-state key만 유지한다.
  - report prose, current filename, diff filename이 같은 key naming을 써야 한다.
- side effects:
  - Phase 4 fix target이 exact `kind/state` key와 blocking drift category 단위로 결정된다.
  - final acceptance가 old plan compare report가 아니라 새 plan report 기준으로 이동한다.
- failure/validation:
  - story recipient와 artifact key naming이 서로 다르면 compare evidence의 literal handoff가 깨지므로 blocker다.
  - report가 support-only story나 old plan capture를 canonical evidence로 섞으면 compare provenance가 깨지므로 blocker다.
- 작업:
  - exact compare story 4개를 current capture script에 고정한다.
  - baseline image 4개와 current capture 4개를 exact `kind/state` key로 diff한다.
  - report에 provenance, blocking/non-blocking drift 분류, exact artifact pair를 함께 적는다.
- 검증:
  - [ ] `visual-compare/report.md`가 exact four-state key를 모두 나열한다.
  - [ ] `visual-compare/` 아래에 current image 4개와 diff image 4개가 같은 key naming으로 존재한다.
  - [ ] report가 `external-source evidence`와 `package-local current`를 분리하고 blocking/non-blocking drift를 state별로 기록한다.
