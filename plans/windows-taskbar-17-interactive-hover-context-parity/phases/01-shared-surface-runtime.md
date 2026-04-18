# Phase 1. 공용 surface 런타임 정리

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 `실행 계약` 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다. 상단에서 이미 고정한 결론은 반복하지 말고, 실행 순서, 선택 규칙, 불변식, 검증 근거만 보강한다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | hover/context 두 hook이 같이 쓰는 measured placement, phase, dismiss 세션 규칙과 explicit ref 입력 shape를 내부 runtime primitive로 고정한다. |
| 선행조건 | `none` |
| 완료 판단 | 추정 폭/높이에 의존하던 배치 계산이 실제 `surface rect + taskbar root` 기반 helper로 바뀌고, `triggerRef + taskbarRootRef + surfaceRootRef` direct input을 받는 공용 primitive가 준비된다. |
| 중단 조건 | `없음` |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarSurfaceController/index.ts` | 추가 | 내부 전용 primitive다. 입력은 `triggerRef + taskbarRootRef + surfaceRootRef` direct contract로 고정하고, 측정 기반 placement, animation 경계, session guard를 모으되 sibling arbitration은 넣지 않는다. | 두 public hook이 같은 primitive를 호출해도 hover/context 차이를 옵션으로만 분기할 수 있고, caller가 rect snapshot shape를 다시 정의하지 않는다. |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarSurfaceController/useTaskbarSurfaceController.test.tsx` | 추가 | missing ref는 `warn + no-op`, reduced motion은 즉시 finalize, stale closing completion은 reopen 이후 무효라는 계약과 explicit ref input contract를 owner test로 잠근다. | primitive 단독 test가 phase winner/loser path와 required ref vocabulary를 설명 없이 읽을 수 있다. |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarPlacement/index.ts` | 교체 | `panelWidth/panelHeight` 추정 입력을 버리고 `trigger rect + rendered surface rect + taskbar root rect + viewport width`만 canonical input으로 받는다. | helper가 trigger 중심 정렬, `taskbarRoot.height + 10px` 부착, 수평 clamp만 계산한다. |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarPlacement/useTaskbarPlacement.test.ts` | 교체 | 기존 `triggerTop - gap - panelHeight`와 y clamp 기준은 canonical contract에서 제거한다. | helper test가 실제 rect 측정 기준과 가로 clamp만 검증한다. |

### 완료 증거

- 내부 primitive 하나만 읽어도 measured placement, explicit ref input, latest intent wins, warn/no-op, reduced motion finalize 규칙이 동시에 드러난다.
- `useTaskbarPlacement` owner test가 더 이상 `panelWidth/panelHeight` 추정값을 vertical truth로 사용하지 않는다.

## 실행 계약

- owner_agent: `frontend-developer`
- 목적: public hook에 앞서 공용 runtime 계약을 내부 helper와 primitive 수준에서 먼저 고정한다.
- 작업 순서:
    1. `useTaskbarPlacement`를 실제 `DOMRect` 입력과 이름 있는 attached gap 상수 기준으로 다시 정의한다.
    2. 새 `useTaskbarSurfaceController` primitive가 `triggerRef`, explicit `taskbarRootRef`, mounted `surfaceRootRef`를 직접 받고, open/measure 시점마다 primitive 내부에서 현재 rect snapshot을 읽는 계약을 구현한다.
    3. primitive/helper owner test에서 missing ref, stale animation, horizontal clamp, vertical attach 규칙을 고정한다.
- boundary: `packages/ui/src/interactive/taskbar/internal/**` 내부 런타임 한정 변경이다. public export 추가나 hook 간 상호 인식은 허용하지 않는다.
- input: `plan.md`의 `사전 합의`에 고정된 explicit `taskbarRootRef`, measured placement, hover close scope, motion lifecycle, focus restore 차이 계약과 leaf component가 `surfaceProps.ref`와 root `animationend`를 받을 수 있는 기존 merge contract
- output:
    - 공개 계약: 두 public hook은 `triggerRef + taskbarRootRef`를 shared runtime에 직접 넘기고, primitive는 mounted `surfaceRootRef`까지 포함한 세 ref에서 현재 rect snapshot을 내부 측정해 placement/phase runtime을 재사용한다.
    - 내부 기본값: `triggerRef`, `taskbarRootRef`, `surfaceRootRef` 중 측정에 필요한 ref가 비어 있으면 `console.warn` 후 현재 intent를 no-op 처리한다.
    - 허용하지 않는 대안: `panelWidth/panelHeight` 추정값으로 위치를 결정하는 계산, vertical clamp 유지, taskbar root ancestor lookup, caller가 rect snapshot shape를 먼저 확정해서 primitive에 넘기는 설계
- 선행조건: `none`
- 제약: `10px` gap은 shared constant 하나로만 관리하고, 새 open/close intent가 들어오면 이전 transition completion은 stale event로 취급해야 한다.
- side effects: active session일 때만 document listener와 animation boundary listener를 유지하고, finalize 시점에만 선택적으로 focus restore를 허용한다.
- failure/validation: stale `animationend`가 reopen된 surface를 다시 닫으면 안 되고, missing ref 상황에서 ancestor lookup이나 pointer/event 좌표 fallback으로 배치를 추정하면 안 된다.
- 검증:
    - [ ] `useTaskbarSurfaceController` owner test가 `opening -> open`, `open -> closing`, reduced motion immediate finalize, stale closing completion no-op과 explicit ref input contract를 모두 설명한다.
    - [ ] `useTaskbarPlacement` owner test가 trigger 중심 x 정렬, horizontal clamp, `taskbarRoot.height + 10px` 기반 vertical attach만 canonical contract로 잠근다.
