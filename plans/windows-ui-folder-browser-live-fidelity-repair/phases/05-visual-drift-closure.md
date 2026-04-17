# Phase 5. 시각 드리프트 마감

> 이 문서는 새 compare report가 남긴 mismatch를 source tree에서 닫는 실행용 상세 계약이다.
> 이번 phase는 old plan의 `의도된 리디자인/no-op` closure를 다시 쓰지 않고, refreshed baseline과 refreshed compare report만으로 pass 또는 blocker를 결정한다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | canonical 4-state compare report의 exact mismatch만 수리하고 같은 inventory로 최종 pass 또는 explicit blocker를 남긴다. |
| 선행조건 | Phase 4가 canonical 4-state별 exact mismatch key와 provenance를 report에 남겨야 한다. |
| 완료 판단 | final report가 canonical 4-state 모두에 대해 pass 또는 explicit blocker를 남기고, not-found는 계속 deferred scope로 유지한다. |
| 중단 조건 | mismatch를 줄이려면 Phase 3 public contract나 Phase 2 taxonomy를 다시 열어야 하거나, old no-op closure를 다시 근거로 삼아야 한다면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/**` | 조정 | shared live shell의 spacing, frame geometry, shared slot drift만 다룬다. public export나 Windows 11 chrome 회귀는 허용하지 않는다. | final compare에서 shell-related mismatch가 사라지거나 explicit blocker 근거가 남는다. |
| `packages/ui/src/components/windows/folder/**` | 조정 | `Folder` canonical contract는 Phase 3 output과 같아야 한다. placeholder tile, old sidebar contract 복귀는 허용하지 않는다. | `folder/desktop-blog`, `folder/mobile-blog` mismatch가 final compare에서 닫힌다. |
| `packages/ui/src/components/windows/browser/**` | 조정 | `Browser` public contract는 `children` slot 그대로 유지한다. 404 전용 public API 추가는 허용하지 않는다. | `browser/desktop-article`, `browser/mobile-article` mismatch가 final compare에서 닫힌다. |
| `packages/ui/src/components/windows/storybook/**` | 조정 | canonical 4-state inventory와 deferred not-found stance를 유지한 채 fixture/stage/test drift만 고친다. | same inventory key와 same deferred note가 final report까지 유지된다. |
| `plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/` | 갱신 | final report는 same key inventory, same provenance rule로 rerun 결과를 남겨야 한다. | canonical 4-state 전부에 대한 final pass 또는 explicit blocker row가 존재한다. |

### 완료 증거

- final report가 canonical 4-state를 모두 다시 평가한다.
- 어떤 mismatch도 old plan의 `의도된 리디자인/no-op` 문구만으로 닫히지 않는다.
- `Browser`는 끝까지 `children` contract를 유지하고 missing-slug는 deferred note로만 남는다.

- owner_agent: `frontend-developer`
- 목적:
  - refreshed compare report의 literal mismatch만 닫아 이번 repair를 실제 pass 또는 explicit blocker로 끝낸다.
- boundary:
  - primary write target: `packages/ui/src/components/windows/internal/windowFrame/**`
  - primary write target: `packages/ui/src/components/windows/folder/**`
  - primary write target: `packages/ui/src/components/windows/browser/**`
  - primary write target: `packages/ui/src/components/windows/storybook/**`
  - primary write target: `plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/report.md`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/baseline-inventory.md`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/missing-slug-observation.md`
- input:
  - 시나리오: Phase 4 compare report가 canonical 4-state 중 일부 mismatch를 남긴 뒤, maintainer가 same inventory 안에서 visual drift만 줄이려는 경우
  - fix target source:
    - exact `kind/state` key
    - mismatch summary
    - baseline/current/diff artifact pair
- output:
  - 공개 계약:
    - final compare report는 canonical 4-state 모두를 pass 또는 explicit blocker로 닫는다.
    - `Folder` public contract는 Phase 3 output과 같은 live-card contract를 유지한다.
    - `Browser` public contract는 `children` slot 그대로 유지한다.
  - 내부 기본값:
    - final compare rerun은 Phase 4와 같은 script, 같은 key naming, 같은 provenance rule을 쓴다.
    - not-found handling은 계속 deferred note로만 남는다.
  - 중요한 negative output:
    - old plan의 `의도된 리디자인/no-op` 결론을 final closure 근거로 재사용하지 않는다.
    - public contract를 다시 열어 mismatch를 숨기지 않는다.
    - `browser/*-not-found`를 final compare pass inventory로 되돌리지 않는다.
- 제약:
  - fix는 Phase 4 mismatch key에 한정한다.
  - taxonomy와 compare inventory naming은 다시 바꾸지 않는다.
- side effects:
  - final report가 implementation handoff와 later materialize의 visual acceptance evidence가 된다.
  - mismatch가 남으면 `explicit blocker`로 문서화돼 재계획 근거가 된다.
- failure/validation:
  - mismatch를 줄이지 못했는데 old plan assumption만으로 `no-op` 처리하면 이번 repair의 core goal을 어기므로 blocker다.
  - final pass를 얻으려면 `Browser`에 404 전용 public API가 필요하다는 결론이 나오면 user-confirmed scope와 충돌하므로 blocker다.
- 작업:
  - Phase 4 report의 exact mismatch key만 source tree에서 수정한다.
  - `WindowFrame`, `Folder`, `Browser`, storybook helper 중 필요한 최소 boundary만 건드린다.
  - same inventory와 same provenance rule로 compare를 다시 실행한다.
  - final report에 pass 또는 explicit blocker를 남긴다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx`가 수정 후에도 성공한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 수정 후에도 성공한다.
  - [ ] final `visual-compare/report.md`가 canonical 4-state에 대해 pass 또는 explicit blocker를 exact key와 함께 남긴다.
  - [ ] final report 어디에도 old plan의 `의도된 리디자인/no-op`를 closure 근거로 쓰지 않는다.
