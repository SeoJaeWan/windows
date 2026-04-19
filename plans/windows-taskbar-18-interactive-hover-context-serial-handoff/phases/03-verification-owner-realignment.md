# Phase 3. unit/runtime/compare owner 재정렬

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| owner_agent | `frontend-developer` |
| 목표 | unit, runtime, compare owner를 다시 나눠 17 gate의 빈 구멍과 겹침을 제거한다. |
| 다루는 작업 묶음 | `verification owners` |
| 시작 조건 | `./phases/02-consumer-serial-handoff-wiring.md` |
| 완료 판단 | measured-open, hook difference, serial handoff queue, compare baseline 역할이 각각 정확히 하나의 owner boundary에 매핑된다. |
| 중단 조건 | 같은 contract를 unit/runtime/compare가 동시에 claim하거나, 어떤 contract도 owner로 읽히지 않으면 중단한다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarSurfaceController/useTaskbarSurfaceController.test.tsx`, `usePresencePhase/usePresencePhase.test.tsx`, `useTaskbarPlacement/useTaskbarPlacement.test.ts` | 정리 | shared runtime owner는 measured-open, phase persistence, placement winner를 logic boundary에서 닫아야 한다. | controller/helper unit이 browser-dependent truth를 흉내내지 않고 logic winner/loser path를 직접 잠근다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx`, `useTaskbarContextPanel/useTaskbarContextPanel.test.tsx` | 정리 | hook unit owner는 hover/context 차이, missing ref no-op, focus restore 차이, stale queue loser path를 잠가야 한다. | hook unit이 runtime story나 compare story에 맡기지 않고 must happen / must not happen을 직접 설명한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx` | 교체 | runtime owner는 real trigger composition, measured-open DOM outcome, serial handoff host choreography를 jsdom boundary에서 검증해야 한다. | runtime test가 zero-size provisional snap과 simultaneous handoff를 success처럼 허용하지 않는다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.test.tsx`, `taskbarHoverPreviewCompareHarness.tsx` | 정리 | hover compare owner는 visual baseline selector, attached composition, frozen state만 소유한다. | runtime geometry/motion truth를 claim하는 assertion과 comment가 제거된다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.test.tsx`, `taskbarContextPanelCompareHarness.tsx` | 정리 | context compare owner도 visual baseline only로 제한한다. | row-derived capture geometry가 runtime canonical truth로 남지 않는다. |

## 완료 증거

- shared runtime, hook, runtime story, compare owner를 읽으면 같은 contract가 두 owner에 중복되지 않는다.
- `windows-taskbar-17`에서 허용되던 zero-size provisional placement acceptance와 compare-led runtime truth가 새 owner split 아래에서 제거된다.
- mutual exclusion proof는 host-owned runtime owner와 browser recipient로 이동하고, compare owner는 visual baseline만 남는다.

## 작업 순서

| 순서 | 작업 묶음 | 이번 단계에서 하는 일 | 끝나면 고정되는 것 |
| --- | --- | --- | --- |
| 1 | `verification owners` | shared runtime + hook unit owner가 logic winner/loser path를 다시 잠그게 만든다. | unit owner boundary |
| 2 | `verification owners` | runtime story owner가 real trigger composition과 serial handoff host choreography를 직접 검증하게 만든다. | jsdom runtime owner boundary |
| 3 | `verification owners` | compare owner를 visual baseline only로 낮추고 17 gate insufficiency를 source-tree owner split으로 대체한다. | compare-only boundary + Phase 4 browser prerequisite |

## 작업 묶음 A. unit owner boundary

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | measured-open, latest-intent queue, missing-ref no-op, focus restore 차이는 logic boundary에서 먼저 닫혀야 한다. |
| 현재 문제 | 현재 owner test는 zero-size first open, immediate `open`, stale path, hook 차이를 충분히 분리하지 못해 runtime/browser가 logic truth까지 대신 소유하게 된다. |
| 목표 상태 | controller/helper/hook unit owner가 must happen, must not happen, loser no-op, terminal-state rule을 직접 잠근다. |
| 유지되는 것 | compare owner가 visual selector를 검증하는 역할, runtime owner가 real composition을 mount하는 역할 |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarSurfaceController/useTaskbarSurfaceController.test.tsx` | 정리 | measured-open, stale transition no-op, session winner가 logic boundary에서 닫힌다. |
| `packages/ui/src/interactive/taskbar/internal/usePresencePhase/usePresencePhase.test.tsx`, `useTaskbarPlacement/useTaskbarPlacement.test.ts` | 정리 | phase persistence와 placement winner가 helper owner로 읽힌다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx`, `useTaskbarContextPanel/useTaskbarContextPanel.test.tsx` | 정리 | hover/context 차이, missing ref, focus restore, stale queue loser path가 hook owner로 읽힌다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | shared runtime helpers + hover/context hook unit owner |
| state ownership | internal / hook |
| callback / handoff | loser no-op, terminal-state reset, focus restore 차이, missing-ref guard |
| no-op / invalid rule | zero-size visible open success, stale finalize reopen overwrite, hook 차이 누락은 invalid |
| 금지하는 대안 | compare test나 browser gate가 logic truth를 대신 증명하는 구조 |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| logic winner/loser path가 unit owner에 모인다 | targeted vitest |
| hover/context must not happen output이 explicit하다 | hook unit |

## 작업 묶음 B. runtime story owner boundary

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | consumer-owned winner rule은 simplified button이나 compare harness가 아니라 real trigger composition에서 검증돼야 한다. |
| 현재 문제 | 현재 runtime test는 provisional placement와 immediate open을 허용하고, serial handoff queue 대신 simultaneous choreography를 success처럼 읽을 여지가 있다. |
| 목표 상태 | runtime story owner가 real trigger composition, measured-open DOM outcome, document whitelist close, serial handoff host choreography를 직접 보여 준다. |
| 유지되는 것 | browser-only rendering truth는 Phase 4 browser recipient가 계속 소유한다. |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx` | 교체 | jsdom runtime owner가 host-owned choreography, measured-open DOM outcome, no provisional snap를 직접 검증한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 정리 | runtime proof가 real trigger composition과 same host contract를 읽는다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | real trigger composition runtime proof |
| state ownership | Storybook behavior harness / jsdom runtime |
| callback / handoff | hover/context trigger, surface root, serial handoff host choreography |
| no-op / invalid rule | simplified proxy composition, direct lifecycle callback invocation, loser-before-finalize winner mount |
| 금지하는 대안 | compare harness를 runtime owner로 사용하는 것, host rule을 hook rule로 오인하는 것 |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| serial handoff host choreography가 real trigger composition에서 보인다 | runtime story test |
| no provisional visible snap와 whitelist close가 DOM outcome으로 보인다 | runtime story test |

## 작업 묶음 C. compare owner boundary

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | compare story는 visual baseline proof surface이지 runtime choreography truth가 아니다. |
| 현재 문제 | 현재 compare test/comment 일부는 width formula, row-derived geometry, immediate-open 계열 설명으로 runtime truth와 visual baseline을 섞을 수 있다. |
| 목표 상태 | compare owner는 kind/state selector, frozen attached composition, baseline-only geometry만 소유하고 runtime motion/queue truth를 claim하지 않는다. |
| 유지되는 것 | compare kind/state inventory와 attached visual baseline 역할 |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.test.tsx`, `taskbarHoverPreviewCompareHarness.tsx` | 정리 | hover compare owner가 visual baseline only로 읽힌다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.test.tsx`, `taskbarContextPanelCompareHarness.tsx` | 정리 | context compare owner가 visual baseline only로 읽힌다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | compare kind/state selector, frozen attached composition |
| state ownership | compare harness/test |
| callback / handoff | visual baseline capture만 담당하고 runtime truth는 넘긴다. |
| no-op / invalid rule | runtime measured placement, phase persistence, serial queue는 compare owner의 claim 대상이 아니다. |
| 금지하는 대안 | compare pass를 runtime parity나 browser acceptance pass로 해석하는 것 |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| compare owner가 visual baseline only임이 source에 보인다 | compare test/comment inspection |
| runtime truth가 unit/runtime/browser로 분리된다 | owner split inspection |

## 실행 계약

- owner_agent: `frontend-developer`
- 목적: source-tree test owner를 unit, jsdom runtime, compare로 다시 나눠 17 gate의 부족한 부분을 대체한다.
- boundary: `packages/ui/src/interactive/taskbar/**/*test*`, runtime story proof, compare harness/test까지만 다룬다. browser acceptance recipient 자체는 Phase 4에서 고정한다.
- input: Phase 2 hook/host contract, read-only `plans/windows-taskbar-17-interactive-hover-context-parity/**`의 부족한 gate 사례
- output:
  - logic winner/loser path는 unit owner가 가진다.
  - real trigger composition과 host-owned serial handoff는 jsdom runtime owner가 가진다.
  - compare owner는 visual baseline selector와 frozen composition만 가진다.
  - 17 gate에서 허용되던 zero-size provisional acceptance, non-serial handoff, compare-led runtime truth는 negative output으로 제거된다.
- 선행조건: `./phases/02-consumer-serial-handoff-wiring.md`
- 제약: package-wide regression sweep, unrelated panel coverage, export inventory freeze는 추가하지 않는다.
- side effects: later browser gate가 정확한 recipient를 읽을 수 있도록 compare/runtime owner wording을 정리한다.
- failure/validation: same contract가 unit/runtime/compare 두 군데 이상에 남거나, compare owner가 runtime truth를 계속 claim하면 phase는 미완료다.

## Phase 검증

| 확인 항목 | 방법 | 기대 결과 |
| --- | --- | --- |
| unit owner split | targeted vitest (controller/helper/hook tests) | logic winner/loser path가 unit owner에 닫힌다. |
| runtime owner split | targeted vitest (`taskbarBehaviorStories.runtime.test.tsx`) | real trigger composition과 serial handoff host choreography가 jsdom runtime boundary에 닫힌다. |
| compare owner split | compare test/harness inspection + targeted vitest | compare owner가 visual baseline만 남기고 runtime truth를 넘긴다. |
