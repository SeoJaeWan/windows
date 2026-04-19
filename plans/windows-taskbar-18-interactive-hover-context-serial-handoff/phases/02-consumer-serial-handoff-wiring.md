# Phase 2. 별도 hook + serial handoff host wiring

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| owner_agent | `frontend-developer` |
| 목표 | separate export를 유지한 hover/context hook과 consumer-owned serial handoff queue contract를 같은 host vocabulary로 연결한다. |
| 다루는 작업 묶음 | `public hook pair`, `serial handoff host` |
| 시작 조건 | `./phases/01-shared-lifecycle-placement-gate.md` |
| 완료 판단 | hover/context 차이는 whitelist close와 focus restore 여부로만 남고, host는 loser finalize 뒤 winner open, latest intent wins, dismiss-cancels-queued-winner를 literal하게 소유한다. |
| 중단 조건 | serial handoff를 hook 내부 sibling awareness 없이는 설명할 수 없게 되면 중단한다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/index.ts` | 교체 | hover hook은 separate export를 유지하고, live와 같은 document whitelist close, no focus restore, missing-ref no-op를 shared lifecycle에 연결한다. | hover source가 serial handoff helper를 직접 소유하지 않고도 whitelist close와 no-focus policy를 분명히 드러낸다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx` | 정리 | hover unit owner는 whitelist close, resting pointer no-op, missing ref, no focus restore, stale queue loser path를 직접 잠가야 한다. | hover test가 consumer-owned handoff 이후에도 same hover contract를 설명한다. |
| `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/index.ts` | 교체 | context hook은 separate export를 유지하고, finalize focus restore, duplicate close no-op, actual-open measurement를 shared lifecycle에 연결한다. | context source가 hover와 같은 lifecycle vocabulary를 쓰되 focus restore owner만 자신에게 남긴다. |
| `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/useTaskbarContextPanel.test.tsx` | 정리 | context unit owner는 focus restore, duplicate close no-op, missing ref, stale transition no-op를 직접 잠가야 한다. | context test가 same runtime vocabulary 위에서 context-only difference를 분리해 보여 준다. |
| `packages/ui/src/interactive/taskbar/internal/**` | 추가/정리 | consumer-owned queue logic을 중복 없이 쓸 internal shared helper 또는 동등한 boundary를 허용하되, package public export로 승격하지 않는다. | serial handoff latest-intent queue가 story-local ad hoc effect만으로 남지 않는다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 교체 | host composition은 hook 내부 arbitration 없이 serial handoff choreography를 literal하게 보여 줘야 한다. | mutual exclusion host가 loser finalize 전 winner를 mount하지 않고, dismiss가 queued winner를 취소하는 path를 보여 준다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx`, `taskbarContextPanel.behavior.stories.tsx`, `taskbarMutualExclusion.behavior.stories.tsx` | 정리 | behavior stories는 hook split과 host-owned queue contract를 reviewable recipient로 고정한다. | story 설명만 읽어도 hover/context 차이와 serial handoff deviation from live가 드러난다. |

## 완료 증거

- `useTaskbarHoverPreview`와 `useTaskbarContextPanel` source를 나란히 읽어도 shared lifecycle vocabulary는 같고 hook 차이는 whitelist close와 focus restore뿐이다.
- host composition은 live의 immediate parallel handoff를 재사용하지 않고 loser finalize 뒤 winner open을 explicit queue contract로 보여 준다.
- queued winner cancel, latest intent wins, actual-open measurement가 story-local ad hoc effect가 아니라 읽을 수 있는 owner boundary로 남는다.

## 작업 순서

| 순서 | 작업 묶음 | 이번 단계에서 하는 일 | 끝나면 고정되는 것 |
| --- | --- | --- | --- |
| 1 | `public hook pair` | hover/context hook을 Phase 1 lifecycle gate와 연결하고 hook-specific difference만 남긴다. | separate export + shared lifecycle vocabulary |
| 2 | `serial handoff host` | consumer-owned queue helper 또는 동등한 host boundary를 추가해 loser/winner rule을 literal하게 만든다. | serial handoff queue contract |
| 3 | `serial handoff host` | behavior harness/stories를 새 queue vocabulary로 정리해 review surface를 고정한다. | Phase 3이 owner test로 잠글 exact host choreography |

## 작업 묶음 A. public hook pair

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | 사용자는 hook split 유지, hover/context 차이 유지, missing-ref no-op 유지, focus restore 차이 유지까지 동시에 요구했다. |
| 현재 문제 | Phase 1 foundation만으로는 hover whitelist close와 context finalize focus restore가 hook 경계에서 어떻게 다르게 남는지 충분히 닫히지 않는다. |
| 목표 상태 | 두 hook은 separate export를 유지한 채 same lifecycle vocabulary를 공유하고, hover/context 차이는 whitelist close와 focus restore 여부만 남는다. |
| 유지되는 것 | `useTaskbarHoverPreview`, `useTaskbarContextPanel` 이름, consumer-owned exclusivity, legacy `panelWidth/panelHeight` backward-compat type slot |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/index.ts` | 교체 | hover hook이 whitelist close, no focus restore, missing-ref no-op를 explicit하게 가진다. |
| `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/index.ts` | 교체 | context hook이 finalize focus restore, duplicate close no-op, same lifecycle vocabulary를 explicit하게 가진다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx`, `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/useTaskbarContextPanel.test.tsx` | 정리 | 두 hook의 차이와 공통점이 unit owner에서 literal하게 보인다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `useTaskbarHoverPreview`, `useTaskbarContextPanel` separate exports |
| state ownership | hook 내부 open/close state, exclusivity는 consumer-owned |
| callback / handoff | hover는 `dismiss()`만, context는 `open()`/`close()`와 finalize focus restore만 소유한다. |
| no-op / invalid rule | missing ref `warn + no-op`, hover focus restore 금지, context duplicate close no-op |
| 금지하는 대안 | hook 내부 sibling registry, merged coordinator export, pointer-origin fallback, ancestor lookup fallback |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| hover/context 차이가 literal하게 분리된다 | hook unit |
| missing ref와 stale path가 hook 경계에서 no-op로 보인다 | hook unit |
| focus restore가 context finalize에만 남는다 | hook unit + source inspection |

## 작업 묶음 B. serial handoff host

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | 이번 task의 핵심 deviation은 live immediate handoff가 아니라 loser finalize 뒤 winner open, latest intent wins, dismiss-cancels-queued-winner다. |
| 현재 문제 | 현재 mutual exclusion host는 context/hover가 같은 시점에 choreography를 바꾸며 loser finalize를 기다리지 않고, queue cancellation과 actual-open measurement timing도 literal contract로 남아 있지 않다. |
| 목표 상태 | consumer host가 shared queue helper 또는 동등한 internal boundary를 통해 loser finalize 후 winner open, latest intent wins, dismiss-cancels-queued-winner를 literal하게 소유한다. winner placement는 queue release 뒤 actual open 시점 measurement만 사용한다. |
| 유지되는 것 | consumer-owned exclusivity, hook split, behavior story가 real trigger composition을 mount한다는 원칙 |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `packages/ui/src/interactive/taskbar/internal/**` | 추가/정리 | serial handoff queue logic이 reusable internal boundary로 모인다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 교체 | host가 loser finalize 전 winner를 mount하지 않고 latest intent/dismiss cancel을 literal하게 보여 준다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarMutualExclusion.behavior.stories.tsx` | 정리 | story 설명과 render가 serial handoff deviation from live를 그대로 노출한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | consumer-owned host choreography와 internal shared queue helper |
| state ownership | host / internal helper |
| callback / handoff | winner request, loser finalize notification, queued winner cancel, actual-open measurement release |
| no-op / invalid rule | stale queued winner, stale finalize, dismiss-after-queue는 no-op/cancel path로 고정 |
| 금지하는 대안 | live `closeGroupPanels` 스타일 immediate parallel handoff, hook 간 직접 import, simultaneous open-before-finalize |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| loser finalize 뒤 winner open이 보인다 | host runtime proof + source inspection |
| latest intent wins와 dismiss cancel이 explicit하다 | internal helper unit 또는 host unit |
| winner placement가 actual open 시점 measurement만 쓴다 | runtime proof + hook unit |

## 실행 계약

- owner_agent: `frontend-developer`
- 목적: separate export hook pair와 consumer-owned serial handoff queue를 한 execution vocabulary로 연결한다.
- boundary: `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/**`, `useTaskbarContextPanel/**`, `internal/**`, `storybook/**` behavior host까지만 다룬다. compare story나 unrelated panel family는 다루지 않는다.
- input: Phase 1 measured-open/root-boundary contract, live read-only `useShowTaskPanel`의 document whitelist close 참고, locked serial handoff rules
- output:
  - hover/context hook split은 유지된다.
  - hover는 document whitelist close + no focus restore, context는 finalize focus restore + duplicate close no-op를 유지한다.
  - serial handoff는 loser finalize 뒤 winner open, latest intent wins, dismiss-cancels-queued-winner를 host-owned contract로 가진다.
  - winner placement는 queued request 시점이 아니라 actual winner open release 시점 measurement를 쓴다.
  - hook internal sibling awareness, merged public coordinator, live immediate handoff reuse는 negative output으로 막힌다.
- 선행조건: `./phases/01-shared-lifecycle-placement-gate.md`
- 제약: consumer-owned exclusivity를 약화시키지 않는다. hook 차이를 없애는 generic surface API는 열지 않는다.
- side effects: host가 queue/close/open choreography를 소유하며, hook은 자기 surface lifecycle만 소유한다.
- failure/validation: loser가 아직 mounted인데 winner가 먼저 visible open되거나, dismiss가 queued winner를 취소하지 못하거나, winner placement가 stale pre-measure snapshot을 재사용하면 phase는 미완료다.

## Phase 검증

| 확인 항목 | 방법 | 기대 결과 |
| --- | --- | --- |
| hook split 유지 + 차이 literal화 | targeted vitest (`useTaskbarHoverPreview`, `useTaskbarContextPanel`) | hover/context 공통점과 차이가 unit owner에서 읽힌다. |
| serial handoff queue | internal helper unit 또는 host boundary test | loser finalize 뒤 winner open, latest intent wins, dismiss cancel이 직접 증명된다. |
| behavior recipient 정리 | source inspection + Storybook source review | story render가 live deviation과 consumer-owned exclusivity를 같은 용어로 설명한다. |
