# Phase 5. blocking drift closure

> 이 문서는 Phase 4 report가 남긴 blocker만 source-tree 안에서 닫고 same inventory로 final compare를 다시 남기는 실행용 상세 계약이다.
> non-blocking 항목과 fixture noise를 억지로 없애는 phase가 아니다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Phase 4 `blocking differences` bucket만 소비해 6 canonical state의 blocker를 닫되, same-path `visual-compare/report.md`의 6-state/3-bucket 구조는 final rerun까지 그대로 유지한다. |
| 선행조건 | Phase 4 report가 state별 세 bucket을 exact key로 남겨야 한다. |
| 완료 판단 | final same-path report에서 6 state 각각의 `blocking differences`, `non-blocking differences`, `fixture noise`가 모두 구조적으로 남아 있고, blocking bucket이 비어 있거나 explicit blocker가 정확한 이유와 함께 남아 있다. |
| 중단 조건 | blocker를 닫으려면 article copy/content length, `metaLabel`/`summary`, exact glyph swap까지 건드려야 하거나 compare key를 다시 바꿔야 한다면 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 조정 | report가 가리킨 frame/body boundary blocker만 수정한다. | marker owner와 public boundary를 열지 않은 채 blocker가 줄어든다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 조정 | report가 가리킨 toolbar/address dropdown/body boundary blocker만 수정한다. | article copy/content length를 건드리지 않고 blocker를 줄인다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 조정 | report가 가리킨 thumbnail/title/grid/card blocker만 수정한다. | `metaLabel`/`summary`를 parity winner로 승격하지 않고 blocker를 줄인다. |
| `packages/ui/src/components/windows/storybook/**` | 조정 | compare/review inventory와 geometry contract가 blocker closure 뒤에도 유지돼야 한다. | rerun compare가 same key와 same stage contract를 쓴다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/visual-compare/report.md` | 갱신 | final rerun도 같은 path에서 6 state 각각의 `blocking differences`, `non-blocking differences`, `fixture noise`를 모두 유지한다. empty bucket은 `없음`으로 남긴다. | same-path report가 6 state 모두에 대해 3 bucket 구조를 유지한다. |
| `plans/windows-ui-folder-browser-figma-ui-parity-review/visual-compare/**` | 갱신 | rerun current/diff/report artifact를 최신 상태로 갱신한다. | final evidence가 6 state 모두에 대해 최신 결과를 가진다. |

### 완료 증거

- Phase 4 blocker만 소비한 수정이 source-tree에 반영된다.
- non-blocking differences와 fixture noise는 final same-path report 안에 구조적으로 남아도 Phase 5 완료 조건을 깨지 않는다.
- final report가 state 6개 모두에 대해 최신 3 bucket 상태를 가진다.
- compare key, story recipient, stage size contract가 rerun 이후에도 변하지 않는다.
- empty bucket이 있어도 `없음`으로 남아 final artifact shape가 drift하지 않는다.

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - Phase 4 blocker를 windows boundary 안에서만 닫고, final acceptance를 same 6-state report로 다시 확인한다.
- 작업 순서:
  1. Phase 4 report의 `blocking differences`만 fix backlog로 추린다.
  2. windows component/storybook surface 안에서만 blocker를 닫는다.
  3. same capture/diff/report inventory를 rerun해 same-path final evidence와 3 bucket report를 갱신한다.
- boundary: `packages/ui/src/components/windows/**`와 이번 slug의 `visual-compare/**`만 쓴다. old plan artifact나 외부 consumer는 수정하지 않는다.
- input:
  - 시나리오: maintainer가 6 state blocker만 닫고 later-pass 항목은 분리 유지해야 하는 경우
  - exact fix target source:
    - Phase 4 `report.md`의 state별 `blocking differences`
  - exact non-target source:
    - Phase 4 `report.md`의 `non-blocking differences`
    - Phase 4 `report.md`의 `fixture noise`
  - exact final artifact path:
    - `plans/windows-ui-folder-browser-figma-ui-parity-review/visual-compare/report.md`
  - exact final report shape:
    - state 6개 모두 유지
    - each state keeps:
      - `blocking differences`
      - `non-blocking differences`
      - `fixture noise`
    - empty bucket은 `없음`으로 남긴다.
  - exact report success rule:
    - state별 `blocking differences`가 `없음`이면 pass
    - blocker가 남으면 exact state key와 reason을 적은 explicit blocker로 남김
- output:
  - 공개 계약:
    - final acceptance artifact는 same path `visual-compare/report.md`다.
    - final acceptance는 same 6-state report의 blocking bucket 기준으로 판단하지만, report 자체는 state별 3 bucket 구조를 그대로 유지한다.
    - non-blocking/noise가 남아도 blocker가 아니면 phase는 닫을 수 있다.
    - compare key, story recipient, stage geometry는 rerun 후에도 동일하다.
  - 내부 기본값:
    - leaf copy/content noise는 rerun report에서 계속 noise로 남길 수 있다.
    - exact glyph shape는 rerun report에서 non-blocking/noise로 남길 수 있다.
  - 허용하지 않는 대안:
    - blocker를 줄이기 위해 canonical state key나 stage geometry를 다시 바꾸지 않는다.
    - final rerun report에서 `non-blocking differences`나 `fixture noise` bucket을 생략하지 않는다.
    - empty bucket을 숨기거나 삭제하지 않는다.
    - fixture noise를 숨기기 위해 `children` body나 `metaLabel`/`summary`를 비우는 방식으로 통과시키지 않는다.
    - compare pass 기준을 raw pixel 0 mismatch로 다시 정의하지 않는다.
- 선행조건:
  - Phase 4 report가 state별 세 bucket과 evidence artifact를 남겨야 한다.
- 제약:
  - source-tree 수정은 windows package 안에 머물러야 한다.
  - final rerun은 same key naming, same stage selector, same reference PNG를 그대로 사용해야 한다.
  - `plan-materialize`가 later bounded-surface validation을 파생할 수 있도록 compare/review inventory tests는 계속 유지돼야 한다.
- side effects:
  - 이후 execution handoff가 exact blocker-closed state 또는 explicit remaining blocker를 same report path로 참조할 수 있다.
  - later parity pass가 non-blocking bucket부터 재시작할 수 있다.
- failure/validation:
  - article copy/content length나 `metaLabel`/`summary`를 고쳐야만 blocker가 사라진다고 결론 내리면 blocker다.
  - rerun compare가 same key naming을 잃으면 blocker다.
  - final report가 same path를 잃으면 blocker다.
  - final report가 6 state 중 하나를 빠뜨리면 blocker다.
  - final report가 state별 `blocking differences`, `non-blocking differences`, `fixture noise` 중 하나라도 빠뜨리면 blocker다.
  - empty bucket이 `없음`으로 유지되지 않으면 blocker다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx src/components/windows/storybook/windowReviewInventory.test.tsx`가 성공한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 성공한다.
  - [ ] final `visual-compare/report.md`가 same path에서 6 state 모두에 대해 latest 3 bucket 상태를 기록한다.
  - [ ] empty bucket이 있어도 final `visual-compare/report.md`에 `없음`으로 남아 있다.
