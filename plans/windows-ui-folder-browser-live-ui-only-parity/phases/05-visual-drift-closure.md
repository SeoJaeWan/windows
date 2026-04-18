# Phase 5. 시각 드리프트 마감

> 이 문서는 Phase 4 compare report가 남긴 blocking drift만 `packages/ui/src/components/windows/**` 안에서 닫고 같은 inventory로 재검증하는 실행용 상세 계약이다.
> 이전 phase가 고정한 public surface와 state winner rule을 다시 열지 않고 차이만 줄이는 것이 목적이다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | compare report가 지적한 blocking drift를 닫되 UI-only state contract와 public surface는 그대로 유지한다. |
| 선행조건 | Phase 4가 exact mismatch key와 drift category를 남겨야 한다. |
| 완료 판단 | final compare evidence가 state key 6개 모두에 대해 pass 또는 explicit blocker를 exact key로 기록한다. |
| 중단 조건 | drift를 닫으려면 runtime behavior를 추가하거나 public state surface를 다시 열어야 한다면 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 조정 | Phase 2 셸 contract를 유지한 채 compare report가 지적한 chrome drift만 닫는다. | titlebar/tab/address/body boundary drift가 줄어든다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 조정 | Phase 3 chip contract와 mobile absence rule을 유지한 채 folder shell/content/state-affordance drift만 닫는다. | desktop/mobile/default/open state가 same public contract 위에서 라이브 방향으로 수렴한다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 조정 | `addressLabel`, `children`, dropdown-items contract를 유지한 채 browser shell/open-affordance drift만 닫는다. | Browser body ownership을 건드리지 않고 shell/open state drift가 줄어든다. |
| `packages/ui/src/components/windows/storybook/**` | 조정 | compare story ID 6개, review story ID 6개, `windowReviewInventory.test.tsx` validation surface는 유지한다. | rerun compare와 edge review validation이 같은 inventory와 같은 marker contract를 계속 찾는다. |
| `plans/windows-ui-folder-browser-live-ui-only-parity/visual-compare/` | 갱신 | final report는 같은 state key 6개와 같은 naming contract를 유지해야 한다. | pass 또는 explicit blocker가 state key 6개 기준으로 기록된다. |

### 완료 증거

- `Folder`는 chip selection no-filtering rule을 유지한 채 desktop open state와 mobile closed state drift를 줄인다.
- `Browser`는 actual navigation 없이 address dropdown affordance drift를 줄인다.
- `WindowFrame`는 internal-only shell contract를 유지한 채 compare blocker를 닫는다.
- final compare evidence가 같은 state key 6개와 같은 story inventory를 계속 사용한다.
- review-only edge state 6개와 `windowReviewInventory.test.tsx` validation surface도 drift closure 이후 그대로 유지된다.

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - compare report가 남긴 blocking drift만 package scope 안에서 마감하고, UI-only state contract를 later implementation/test가 그대로 재사용할 수 있게 만든다.
- 작업 순서:
  1. Phase 4 report에서 state key별 blocking drift를 읽고 `WindowFrame`, `Folder`, `Browser` 중 어느 boundary에 속하는지 분류한다.
  2. 동일한 public surface, state winner rule, mobile absence rule을 유지한 채 in-scope drift만 수정한다.
  3. 같은 compare inventory 6개와 같은 validation boundary로 rerun compare evidence를 남긴다.
- boundary: `packages/ui/src/components/windows/**`와 windows Storybook helper, 그리고 이번 plan의 `visual-compare/` artifact만 움직인다. baseline inventory와 compare report는 read-only 기준선이다.
- input:
  - 시나리오: maintainer가 Phase 4 report의 blocking drift만 닫아 final UI-only parity 상태를 남겨야 하는 경우
  - immutable contract from earlier phases:
    - `Folder` chip props: `chips`, `selectedChipId`, `defaultSelectedChipId`, `onChipSelect`
    - `Browser` dropdown props: `addressDropdownItems`, `onAddressDropdownItemSelect`
    - controlled prop winner rule
    - callback-only host handoff and explicit loser/no-op rules
    - internal-only open/focus state
    - mobile Folder single-address-area policy
    - compare inventory key 6개
    - review story recipient 6개 and `windowReviewInventory.test.tsx`
- output:
  - 공개 계약:
    - `Folder`, `Browser`, `WindowFrame`는 earlier phase의 public surface와 negative output을 유지한 채 drift만 줄인 상태가 된다.
    - final compare evidence는 state key 6개 모두에 대해 pass 또는 explicit blocker를 기록한다.
    - review-only edge state recipient와 review inventory validation surface는 그대로 유지된다.
  - 내부 기본값:
    - review-only edge state taxonomy는 유지하되 live compare artifact는 canonical 6 state만 갱신한다.
    - rerun compare는 Phase 4와 같은 story ID, same stage marker, same key naming을 사용한다.
  - 허용하지 않는 대안:
    - runtime navigation, file opening, session integration을 추가하지 않는다.
    - `interactive/windows/*`로 책임을 옮기지 않는다.
    - public open-state prop이나 internal filtering behavior를 새로 열지 않는다.
    - review story recipient, review marker contract, review inventory test를 제거하거나 rename하지 않는다.
- 선행조건:
  - Phase 4 report가 state key별 blocking drift를 남겨야 한다.
- 제약:
  - drift closure는 `packages/ui/src/components/windows/**` 범위 밖으로 퍼지지 않는다.
  - compare inventory와 review-only edge-state taxonomy를 재정의하지 않는다.
  - valid activation callback/no-op contract는 Phase 3 wording 그대로 유지한다.
  - `Browser` body는 계속 `children` boundary에 남는다.
- side effects:
  - final compare evidence가 이후 implementation handoff와 `plan-materialize`의 source contract가 된다.
  - package windows surface가 live UI-only parity에 더 가깝게 수렴한다.
- failure/validation:
  - drift를 닫으려면 chip selection filtering, real navigation, session/window manager behavior가 필요하다면 blocker다.
  - compare rerun이 같은 state key 6개를 유지하지 못하면 blocker다.
  - edge-state handling이 compare inventory를 변경하게 만들면 blocker다.
  - review story recipient 6개 또는 `windowReviewInventory.test.tsx` validation surface가 깨지면 blocker다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx src/components/windows/storybook/windowReviewInventory.test.tsx`가 성공한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 성공한다.
  - [ ] final `visual-compare/report.md`가 state key 6개 모두에 대해 pass 또는 explicit blocker를 남긴다.
  - [ ] review-only edge state 6개가 exact review story recipient와 marker contract를 유지한 채 계속 검증된다.
