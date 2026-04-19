# Phase 1. 공유 lifecycle·measurement gate

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| owner_agent | `frontend-developer` |
| 목표 | shared runtime가 actual measurement 뒤 visible open, root animation boundary, fixed `10px` attached gap을 literal하게 소유한다. |
| 다루는 작업 묶음 | `shared lifecycle gate` |
| 시작 조건 | `none` |
| 완료 판단 | `opening/open/closing`이 zero-size provisional frame이나 immediate phase overwrite가 아니라 same mounted root의 measurement + animation lifecycle로 읽힌다. |
| 중단 조건 | root animation boundary와 measured-open winner를 같은 mounted root contract로 설명할 수 없으면 중단한다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarSurfaceController/index.ts` | 교체 | actual open 시점 measurement, visible-open gate, stale transition no-op, missing ref `warn + no-op`를 shared runtime에서 소유한다. | `open()`이 zero-size visible placement를 바로 노출하지 않고 actual measurement가 준비된 뒤에만 visible lifecycle을 시작한다. |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarSurfaceController/useTaskbarSurfaceController.test.tsx` | 정리 | controller owner는 measured-open, stale enter/exit no-op, latest session winner를 직접 잠가야 한다. | first-open zero-size placeholder를 success로 허용하는 assertion이 사라지고 measured-open/animation boundary가 직접 검증된다. |
| `packages/ui/src/interactive/taskbar/internal/usePresencePhase/index.ts` | 교체 | `opening`은 root enter `animationend`까지, `closing`은 finalize까지 유지하는 phase helper가 필요하다. | immediate `opening -> open` overwrite 없이 enter/exit boundary를 같은 vocabulary로 표현한다. |
| `packages/ui/src/interactive/taskbar/internal/usePresencePhase/usePresencePhase.test.tsx` | 정리 | enter confirm과 exit finalize의 terminal-state rule을 helper owner로 잠근다. | `opening`/`closing` loser path가 timer 추측이 아니라 phase helper contract로 보인다. |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarPlacement/index.ts` | 정리 | placement truth는 trigger-centered x와 `taskbarRoot.height + 10px` attached gap뿐이다. | taskbar center, pointer origin, zero-size visible snap을 canonical placement winner로 남기지 않는다. |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarPlacement/useTaskbarPlacement.test.ts` | 정리 | actual winner placement와 negative placement rule을 pure owner test로 고정한다. | test가 trigger 중심 x, attached gap, no provisional visible snap 전제를 직접 설명한다. |
| `packages/ui/src/components/panels/taskbarAttachedSurface/shared.ts`, `motion.ts` | 정리 | same mounted root가 enter/exit animation boundary와 package-owned phase marker를 소유한다. | shared docs/helper가 exit-only contract에 머물지 않고 enter/exit boundary 전체를 설명한다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/index.tsx`, `packages/ui/src/components/panels/taskbarContextMenu/index.tsx` | 정리 | hover/context leaf는 measurement root와 animation boundary가 어떤 element에 묶이는지 같은 vocabulary로 소비해야 한다. | leaf source가 root boundary drift 없이 `opening` confirm과 `closing` finalize를 같은 mounted root에서 읽게 된다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.test.tsx`, `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.test.tsx` | 정리 | leaf owner는 root boundary와 package-owned phase marker를 component boundary에서 잠근다. | leaf test가 root enter/exit boundary와 package-owned `data-phase` winner를 같이 설명한다. |

## 완료 증거

- shared runtime source만 읽어도 visible open이 actual measured placement 이후에만 시작된다는 점이 드러난다.
- phase helper와 attached-surface helper가 `opening`/`closing`을 timer 추측이 아니라 root animation boundary로 설명한다.
- placement owner test가 zero-size visible placement나 pointer-origin fallback을 canonical success로 남기지 않는다.

## 작업 순서

| 순서 | 작업 묶음 | 이번 단계에서 하는 일 | 끝나면 고정되는 것 |
| --- | --- | --- | --- |
| 1 | `shared lifecycle gate` | `useTaskbarSurfaceController`, `usePresencePhase`, `useTaskbarPlacement`를 measured-open + root-boundary contract로 다시 묶는다. | actual measurement, `10px` gap, stale transition no-op vocabulary |
| 2 | `shared lifecycle gate` | attached surface shared helper와 hover/context leaf가 같은 mounted root boundary를 소비하도록 정리한다. | enter/exit animation boundary와 package-owned phase marker contract |
| 3 | `shared lifecycle gate` | controller/helper/leaf owner test를 새 lifecycle winner rule에 맞춰 다시 잠근다. | Phase 2가 literal하게 연결할 foundation proof |

## 작업 묶음 A. shared lifecycle gate

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | 사용자는 visible opening이 measured placement 뒤에만 시작되고, `opening`/`closing`이 root animation boundary까지 유지되길 요구했다. |
| 현재 문제 | 현재 controller는 first open에서 zero-size placeholder rect를 success처럼 계산할 수 있고, `opening`을 같은 call stack에서 `open`으로 덮어써 visible provisional snap과 phase collapse가 가능하다. |
| 목표 상태 | controller/helper가 actual measurement가 준비되기 전 visible open을 허용하지 않고, stale session의 enter/exit completion을 no-op로 처리한다. |
| 유지되는 것 | sibling arbitration, focus restore policy, hover whitelist close는 이 phase에서 소유하지 않는다. |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarSurfaceController/index.ts` | 교체 | visible open과 finalize가 same session measurement/animation boundary를 기준으로 움직인다. |
| `packages/ui/src/interactive/taskbar/internal/usePresencePhase/index.ts` | 교체 | `opening` confirm과 `closing` finalize가 explicit phase API로 남는다. |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarPlacement/index.ts` | 정리 | trigger-centered x와 `taskbarRoot.height + 10px` attached gap만 canonical placement truth로 남는다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | internal runtime only: actual measurement gate, phase helper, pure placement helper |
| state ownership | internal |
| callback / handoff | measured placement 준비 신호와 root animation boundary 신호를 같은 session에서만 소비한다. |
| no-op / invalid rule | missing ref는 `warn + no-op`, stale enter/exit completion은 no-op, zero-size visible placement는 invalid |
| 금지하는 대안 | pointer origin fallback, ancestor lookup fallback, immediate `opening -> open`, first visible frame zero-size snap |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| visible open이 actual measurement 뒤에만 시작된다 | `useTaskbarSurfaceController` unit |
| `opening`과 `closing`이 root boundary까지 유지된다 | `usePresencePhase` unit + leaf component test |
| placement truth가 trigger-centered x + attached gap으로 고정된다 | `useTaskbarPlacement` unit |

## 작업 묶음 B. attached root animation boundary

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | enter boundary를 owner 없이 남기면 implementation이 timer, wrapper, leaf 중 아무 곳에나 phase confirm을 흩뿌릴 수 있다. |
| 현재 문제 | shared helper와 leaf source는 exit `animationend`만 명시하고 enter confirm, measurement root, package-owned phase marker winner를 한 경계에서 설명하지 않는다. |
| 목표 상태 | same mounted root가 package-owned `data-phase`와 enter/exit animation boundary를 함께 소유하고, hover/context leaf가 같은 vocabulary를 공유한다. |
| 유지되는 것 | leaf visual grammar, row/card topology, surfaceProps의 host wiring 역할은 유지한다. |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `packages/ui/src/components/panels/taskbarAttachedSurface/shared.ts` | 정리 | enter/exit boundary와 package-owned marker rule이 같이 문서화된다. |
| `packages/ui/src/components/panels/taskbarAttachedSurface/motion.ts` | 정리 | enter/exit helper가 같은 mounted root contract를 전제로 동작한다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/index.tsx`, `packages/ui/src/components/panels/taskbarContextMenu/index.tsx` | 정리 | hover/context leaf가 같은 root boundary vocabulary를 소비한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | attached surface leaf `phase` consumption과 root animation boundary |
| state ownership | leaf 내부 root + shared helper |
| callback / handoff | same mounted root의 enter/exit completion만 phase confirm/finalize에 전달한다. |
| no-op / invalid rule | child-bubbled event, stale root event, wrapper-only fake confirm은 invalid |
| 금지하는 대안 | hover wrapper와 context leaf가 서로 다른 root truth를 가지는 설계, timer-only open confirm |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| root boundary와 package-owned phase marker가 같은 element에 묶인다 | hover/context leaf test |
| enter/exit boundary drift가 helper와 leaf 사이에 남지 않는다 | source inspection + component test |

## 실행 계약

- owner_agent: `frontend-developer`
- 목적: measured-open과 root animation boundary를 public hook 이전의 shared runtime truth로 먼저 고정한다.
- boundary: `packages/ui/src/interactive/taskbar/internal/**`와 `packages/ui/src/components/panels/taskbarAttachedSurface/**`, hover/context leaf lifecycle까지만 다룬다. hook split이나 consumer-owned exclusivity는 열지 않는다.
- input: locked contract의 fixed `10px` gap, trigger-centered anchor, missing ref `warn + no-op`, `opening`/`closing` persistence, no provisional visible snap
- output:
  - actual measured placement가 준비되기 전 visible open이 시작되지 않는다.
  - `opening`은 root enter `animationend`까지, `closing`은 finalize까지 유지된다.
  - hover/context가 같은 mounted root lifecycle vocabulary를 공유한다.
  - zero-size provisional visible placement, immediate `opening -> open`, stale transition overwrite는 negative output으로 막힌다.
- 선행조건: `none`
- 제약: focus restore와 hover document whitelist close는 이 phase의 owner가 아니다. placement truth는 trigger-centered x와 attached gap 외의 임시 기준을 열지 않는다.
- side effects: session-local measurement와 phase confirm/finalize만 다루며, sibling handoff queue는 만들지 않는다.
- failure/validation: first visible frame이 zero-size placeholder 위치를 보여 주거나, root enter boundary 없이 `opening`이 즉시 사라지면 phase는 미완료다.

## Phase 검증

| 확인 항목 | 방법 | 기대 결과 |
| --- | --- | --- |
| measured-open gate | targeted vitest (`useTaskbarSurfaceController`, `useTaskbarPlacement`, `usePresencePhase`) | zero-size visible open success assertion이 사라지고 actual measurement gate가 직접 증명된다. |
| root animation boundary | hover/context leaf component tests | enter/exit boundary와 `data-phase` owner가 같은 mounted root contract로 읽힌다. |
| foundation handoff readiness | source inspection | Phase 2가 literal하게 재사용할 lifecycle vocabulary가 하나로 정리된다. |
