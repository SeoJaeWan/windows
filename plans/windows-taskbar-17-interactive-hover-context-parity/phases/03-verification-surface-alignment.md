# Phase 3. 검증 surface 정합화

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 `실행 계약` 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다. 상단에서 이미 고정한 결론은 반복하지 말고, 실행 순서, 선택 규칙, 불변식, 검증 근거만 보강한다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | hook unit owner와 runtime story owner가 모두 measured placement, explicit ref injection, animation boundary, warn/no-op, consumer-owned exclusivity를 canonical contract로 잠그게 만든다. |
| 선행조건 | `./phases/02-public-hook-parity.md`의 public hook wiring과 story host 경계 |
| 완료 판단 | 더 이상 추정 `panelWidth/panelHeight`, 즉시 `open`, element-only leave, ancestor root lookup이 성공 기준으로 남지 않고, 새 parity contract가 source-tree test owner에 반영된다. |
| 중단 조건 | `없음` |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx` | 교체 | hover unit owner는 document whitelist close, enter animation completion 전 `opening`, explicit `taskbarRootRef` 누락 시 `warn + no-op`, resting pointer gate를 canonical scenario로 삼아야 한다. | hover hook test가 element-only leave, 즉시 `open`, ancestor lookup을 truth로 남기지 않는다. |
| `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/useTaskbarContextPanel.test.tsx` | 교체 | context unit owner는 explicit `taskbarRootRef`, rendered surface rect 기반 placement, focus restore, duplicate close no-op, latest intent wins를 잠가야 한다. | context hook test가 `panelWidth/panelHeight` 추정 입력이나 implicit root sourcing을 geometry truth로 쓰지 않는다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx` | 교체 | runtime owner는 `HoverPreviewHarness`, `ContextPanelHarness`, `MutualExclusionHarness`에서 explicit `taskbarRootRef` injection, animation 경계, consumer-owned winner rule을 직접 검증해야 한다. | runtime test가 hover/context 개별 동작과 consumer-owned exclusivity를 같은 host wiring 계약으로 설명한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.test.tsx` / `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreviewCompareHarness.tsx` | 정리 | 이 pair는 static visual compare owner다. runtime geometry/motion truth를 소유하지 않고, attached visual root와 frozen capture composition만 맡는다. | hover compare owner가 width formula나 immediate-open을 runtime parity 근거로 주장하지 않고, visual baseline 역할만 남긴다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.test.tsx` / `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanelCompareHarness.tsx` | 정리 | 이 pair는 static visual compare owner다. row-derived geometry는 compare 캡처를 위한 고정 배치일 뿐 runtime parity contract가 아니다. | context compare owner가 row-derived top/height를 runtime canonical truth로 남기지 않고, visual baseline 역할만 남긴다. |

### 완료 증거

- 후속 reviewer가 test 파일만 읽어도 missing ref, latest intent wins, focus restore 차이, resting pointer no-op이 어디서 검증되는지 바로 찾을 수 있다.
- `MutualExclusionHarness` 관련 runtime proof가 hook 내부 arbitration이 아니라 host-owned choreography를 canonical contract로 남긴다.
- runtime owner를 읽으면 `taskbarRootRef`는 host가 직접 주입하고 hook 내부 ancestor lookup은 사용하지 않는다는 점이 명시적으로 보인다.
- compare owner를 읽으면 visual baseline selector/구성만 맡고 runtime geometry/motion truth는 맡지 않는다는 점이 명시적으로 보인다.

## 실행 계약

- owner_agent: `frontend-developer`
- 목적: 구현 변경이 끝난 뒤 남는 test owner와 runtime owner를 새 parity contract에 맞춰 다시 잠근다.
- 작업 순서:
    1. hover/context hook unit owner를 measured placement, explicit `taskbarRootRef`, motion boundary, warn/no-op, winner/loser path 기준으로 다시 쓴다.
    2. runtime behavior story owner를 hover/context 개별 시나리오와 mutual exclusion 시나리오까지 확장하고, host가 `taskbarRootRef`를 직접 주입하는 wiring을 검증한다.
    3. compare test/harness pair를 visual baseline owner로 정리하고, 남아 있던 추정 geometry assertion과 element-only close 가정을 runtime canonical owner에서 제거한다.
- boundary: `packages/ui/src/interactive/taskbar/**/*test*`, `taskbarBehaviorHarnesses.tsx`, `taskbar*CompareHarness.tsx`까지만 조정한다. 패키지 전역 snapshot, unrelated panel test, export inventory test는 추가하지 않는다.
- input: Phase 2 public hook contract, 기존 hook unit test owner, story runtime harness owner, 현재 storybook compare owner pair
- output:
    - 공개 계약: hook unit owner와 runtime owner가 measured placement, explicit `taskbarRootRef` injection, `opening/open/closing`, missing ref `warn + no-op`, consumer-owned exclusivity를 같은 시나리오 언어로 검증하고, compare owner는 visual baseline selector와 frozen attached composition만 맡는다.
    - 허용하지 않는 대안: package-wide 회귀 스위프, search/window panel 추가 커버리지, geometry truth와 무관한 export identity test
- 선행조건: `./phases/02-public-hook-parity.md`
- 제약: selected runtime scenario는 hook 경계와 runtime harness owner에만 추가한다. runtime harness는 explicit `taskbarRootRef` injection owner이고, compare/static visual harness는 visual baseline owner로만 유지하며 width-formula·row-derived geometry·phase wording을 runtime canonical owner로 승격하지 않는다.
- side effects: mutual exclusion 검증은 host choreography를 증명할 뿐이며, hook 내부에 arbitration 책임을 다시 부여하면 안 된다.
- failure/validation: 동일 시나리오를 unit과 runtime 양쪽에 중복으로 과도하게 얼리지 말고, owner가 명확한 위치에만 추가한다. runtime owner가 ancestor lookup을 허용하거나 compare owner가 runtime geometry/motion truth를 주장하면 phase는 미완료다.
- 검증:
    - [ ] hover/context unit owner가 각 hook의 must happen, must not happen, stale transition loser path와 explicit `taskbarRootRef` missing path를 직접 설명한다.
    - [ ] runtime owner가 `MutualExclusionHarness`까지 포함해 explicit `taskbarRootRef` injection, consumer-owned winner rule, resting pointer no-op을 실제 host wiring으로 증명한다.
    - [ ] compare owner pair가 visual baseline selector와 attached composition만 검증하고, runtime parity의 canonical geometry/motion owner로 남지 않는다.
