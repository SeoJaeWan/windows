# Phase 2. 공개 hook parity 적용

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 `실행 계약` 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다. 상단에서 이미 고정한 결론은 반복하지 말고, 실행 순서, 선택 규칙, 불변식, 검증 근거만 보강한다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | 두 public hook이 split은 유지하면서도 explicit `taskbarRootRef` 입력과 parity 배치·dismiss·phase 수명주기를 그대로 드러내게 만든다. |
| 선행조건 | `./phases/01-shared-surface-runtime.md`의 내부 helper/primitive 계약 |
| 완료 판단 | hover는 document whitelist close와 no focus restore, context는 focus restore를 유지하고, 둘 다 explicit `taskbarRootRef` 입력과 실제 렌더된 surface rect 기준 placement, `warn + no-op`을 따른다. |
| 중단 조건 | `없음` |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/index.ts` | 교체 | public hook 이름과 split은 유지한다. option에 explicit `taskbarRootRef`를 포함하고, close 판단은 element-only leave가 아니라 document-level whitelist 추적으로 옮긴다. | hover hook이 `pointermove + mouseover` 기반 close scope, latest intent wins, explicit `taskbarRootRef`, missing ref `warn + no-op`, no focus restore를 명시적으로 가진다. |
| `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/index.ts` | 교체 | public split은 유지한다. option에 explicit `taskbarRootRef`를 포함하고, `panelWidth/panelHeight`는 geometry truth가 아니며 placement는 rendered surface rect와 taskbar root에서 계산한다. | context hook이 focus restore, duplicate close no-op, explicit `taskbarRootRef`, measured placement, stale transition 무효화를 같이 드러낸다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 정리 | runtime owner harness는 hook에 explicit `taskbarRootRef`를 직접 주입해야 한다. ad hoc hover geometry 계산과 ancestor lookup은 canonical truth가 될 수 없다. | hover/context/mutual harness가 같은 ref injection contract를 사용하고 hook-supplied surface wiring을 그대로 소비한다. |

### 완료 증거

- `useTaskbarHoverPreview`와 `useTaskbarContextPanel`을 나란히 읽어도 차이는 hover close scope와 focus restore 여부뿐이고, `taskbarRootRef` 포함 입력 vocabulary와 배치·phase·missing ref 처리 규칙은 같은 내부 vocabulary를 쓴다.
- story behavior harness가 더 이상 독자적인 approximate width/height 규칙으로 hook contract를 우회하지 않는다.

## 실행 계약

- owner_agent: `frontend-developer`
- 목적: 내부 primitive를 public hook 경계에 연결하면서 hook별 정책 차이를 정확히 남긴다.
- 작업 순서:
    1. `useTaskbarHoverPreview` option에 explicit `taskbarRootRef`를 고정하고, shared runtime에 ref를 직접 전달한 뒤 document whitelist 기반 hover close 추적과 pointer-reset gate를 hook 경계에 남긴다.
    2. `useTaskbarContextPanel` option에 explicit `taskbarRootRef`를 고정하고, shared runtime에 ref를 직접 전달한 뒤 focus restore와 duplicate close no-op을 유지하면서 measured placement로 전환한다.
    3. behavior harness를 explicit `taskbarRootRef` injection과 hook-supplied surface wiring 기준으로 정리해 runtime owner를 실제 구현 경계와 맞춘다.
- boundary: `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/**`, `useTaskbarContextPanel/**`, 그리고 해당 hook을 직접 소비하는 story harness까지만 움직인다. search/window panel이나 leaf visual 구조는 건드리지 않는다.
- input: Phase 1 shared runtime/helper, `plan.md`의 `사전 합의`에 고정된 hover/context 차이 계약, 현재 consumer-owned mutual exclusion harness
- output:
    - 공개 계약: `useTaskbarHoverPreview`와 `useTaskbarContextPanel`은 별도 export를 유지하고, 둘 다 public option으로 explicit `taskbarRootRef`를 받으며 shared runtime에 ref를 직접 넘겨 measured placement·phase lifecycle·missing ref `warn + no-op`을 같은 방식으로 따른다.
    - 내부 기본값: `panelWidth/panelHeight`가 타입에 남아도 placement truth로 쓰지 않고, `taskbarRootRef`를 포함한 required ref가 비어 있으면 open request를 no-op 처리한다.
    - 허용하지 않는 대안: pointer 좌표 fallback, element-only leave close, taskbar root ancestor lookup, hook 내부에서 서로를 import하거나 group registry를 자동 조작하는 설계
- 선행조건: `./phases/01-shared-surface-runtime.md`
- 제약: context만 finalize 시 focus restore를 하고 hover는 하지 않는다. hover/context winner rule은 consumer가 `dismiss()`/`close()` 호출로만 소유한다.
- side effects: hover dismiss는 resting pointer no-op을 위해 pointer-reset gate를 남기고, context close는 허용된 finalize 시점에만 trigger focus를 복원한다.
- failure/validation: 새 open intent가 closing 중 들어오면 이전 close completion은 no-op이어야 하며, explicit `taskbarRootRef`가 없을 때는 ancestor lookup 대신 경고 후 현재 상태를 유지해야 한다.
- 검증:
    - [ ] hook 코드를 읽으면 hover는 document whitelist close, context는 focus restore라는 차이만 남고 나머지 ref input/phase/placement 규칙은 shared runtime을 따른다.
    - [ ] story behavior harness가 `MutualExclusionHarness`를 포함해 explicit `taskbarRootRef` injection과 consumer-owned arbitration만 보여주고 hook 내부 ancestor lookup/arbitration은 추가하지 않는다.
