# Phase 4. 시각 드리프트 마감

> 이 문서는 Phase 3 compare report가 남긴 blocking mismatch만 `packages/ui` 범위에서 닫는 실행용 상세 계약이다.
> 이 phase는 계약과 inventory를 다시 열지 않고, 같은 four-state compare surface를 rerun pass 또는 explicit blocker로 마감하는 데 집중한다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Phase 3 report의 blocking drift만 `packages/ui` windows boundary 안에서 수정하고 같은 4-state compare를 rerun pass시킨다. |
| 선행조건 | Phase 3 report가 exact mismatch key와 drift category를 남겨야 한다. |
| 완료 판단 | final `visual-compare/report.md`가 canonical 4-state를 다시 평가해 pass 또는 explicit blocker를 exact key 단위로 남긴다. |
| 중단 조건 | mismatch를 닫으려면 consumer runtime wiring, public API 재설계, canonical inventory 확장이 필요하다는 결론이 나오면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/**` | 조정 | `WindowFrame`는 generic shell로 유지된다. fix phase는 address surface/chrome/spacing drift만 다룬다. | editable input, route-aware chrome prop, leaf-specific API 없이 blocking chrome drift만 줄어든다. |
| `packages/ui/src/components/windows/folder/**` | 조정 | `Folder` contract와 exact prop naming은 Phase 2 output을 그대로 유지한다. fix phase는 sidebar geometry, entry spacing, thumbnail ratio, responsive drift만 다룬다. | `folder/desktop-blog`, `folder/mobile-blog` blocking mismatch가 닫히고 controlled contract는 유지된다. |
| `packages/ui/src/components/windows/browser/**` | 조정 | `Browser` contract는 `children` slot 그대로 유지된다. fix phase는 browser chrome/article spacing/responsive drift만 다룬다. | `browser/desktop-article`, `browser/mobile-article` blocking mismatch가 닫히고 public API는 그대로다. |
| `packages/ui/src/components/windows/storybook/**` | 조정 | same story IDs, same review-only boundary, same canonical compare inventory를 유지해야 한다. | fix 이후에도 review-only story와 canonical compare story가 섞이지 않는다. |
| `plans/windows-ui-folder-browser-live-contract-lock/visual-compare/` | 갱신 | rerun compare는 Phase 3와 같은 key naming과 drift rule을 사용한다. | final report가 pass 또는 explicit blocker를 exact key 단위로 기록한다. |

### 완료 증거

- final compare report가 exact four-state key를 다시 평가한다.
- `Folder` / `Browser` source가 Phase 2 prop naming과 story inventory를 유지한 채 blocking drift만 줄인다.
- final report가 pass 또는 scope blocker를 exact key와 함께 남긴다.

- owner_agent: `frontend-developer`
- 목적:
  - compare report가 남긴 blocking visual drift를 같은 contract와 inventory 안에서 닫아 implementation handoff를 마무리한다.
- boundary:
  - primary write target: `packages/ui/src/components/windows/internal/windowFrame/**`
  - primary write target: `packages/ui/src/components/windows/folder/**`
  - primary write target: `packages/ui/src/components/windows/browser/**`
  - primary write target: `packages/ui/src/components/windows/storybook/**`
  - primary write target: `plans/windows-ui-folder-browser-live-contract-lock/visual-compare/`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-contract-lock/reference-captures/baseline-inventory.md`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-contract-lock/visual-compare/report.md`
- input:
  - 시나리오: maintainer가 Phase 3 report에 남은 blocking drift만 `packages/ui` 범위에서 닫으려는 경우
  - exact mismatch owner:
    - `windowFrame` shell/chrome/address surface
    - `Folder` sidebar tree geometry, entry spacing, thumbnail ratio, responsive layout
    - `Browser` chrome/article spacing, responsive layout
  - exact non-blocking rule:
    - font-only difference는 closure 대상이 아니다.
- output:
  - 공개 계약:
    - Phase 2 public prop names와 exact story IDs는 그대로 유지된다.
    - final compare는 same four-state inventory를 사용한다.
    - final report는 pass 또는 explicit blocker를 exact key 단위로 남긴다.
  - 내부 기본값:
    - blocking mismatch가 없으면 no-op rerun compare로 종료할 수 있다.
    - rerun compare artifact naming은 Phase 3와 같은 key 규칙을 유지한다.
  - 중요한 negative output:
    - canonical compare inventory를 늘리지 않는다.
    - support-only review story를 compare inventory에 편입하지 않는다.
    - mismatch를 닫기 위해 consumer runtime wiring이나 새 public API를 끌어오지 않는다.
- 선행조건:
  - Phase 3 report가 exact mismatch key와 drift category를 남겨야 한다.
- 제약:
  - Phase 2 contract와 Storybook recipient를 다시 열지 않는다.
  - font-only difference는 blocking closure 대상이 아니다.
- side effects:
  - final report가 구현 handoff의 acceptance 증거가 된다.
  - `plan-materialize`와 implementation worker는 same prop contract와 same story inventory를 그대로 사용한다.
- failure/validation:
  - blocking mismatch를 닫으려면 consumer wiring이나 scope 밖 runtime orchestration이 필요하면 blocker다.
  - fix phase가 prop naming이나 story recipient를 바꾸려 하면 contract-lock plan의 목적을 깨므로 blocker다.
- 작업:
  - Phase 3 report의 blocking mismatch를 exact key 단위로 읽고 owner file만 수정한다.
  - `WindowFrame`, `Folder`, `Browser`, windows storybook helper 범위 안에서만 visual drift를 줄인다.
  - 같은 four-state compare를 rerun하고 final report를 갱신한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx`가 성공한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 성공한다.
  - [ ] final `visual-compare/report.md`가 canonical four-state key를 다시 평가하고 pass 또는 explicit blocker를 exact key 단위로 남긴다.
