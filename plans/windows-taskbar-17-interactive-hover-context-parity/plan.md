**Branch:** `fix/windows-taskbar-17-interactive-hover-context-parity`

> Worktree dir: `worktrees/windows-taskbar-17-interactive-hover-context-parity`

# 태스크바 hover/context parity 실행 계획

| # | Phase | Agent |
| --- | --- | --- |
| 1 | `./phases/01-shared-surface-runtime.md` | `frontend-developer` |
| 2 | `./phases/02-public-hook-parity.md` | `frontend-developer` |
| 3 | `./phases/03-verification-surface-alignment.md` | `frontend-developer` |

## 이번 작업 한눈에 보기

- 목표: `packages/ui`의 `useTaskbarHoverPreview`와 `useTaskbarContextPanel`을 승인된 parity contract 그대로 측정 기반 배치, 모션 수명주기, dismiss 규칙에 맞춘다.
- 이번 계획의 핵심 변경: 두 public hook이 explicit `taskbarRootRef`를 입력으로 받고, 공용 surface runtime primitive는 `triggerRef + taskbarRootRef + surfaceRootRef`를 직접 받아 내부에서 rect snapshot을 측정하며, hover/context별 차이는 public hook 안에서만 유지하고 compare owner는 visual baseline 역할로만 정리한다.
- 완료되면 달라지는 점: hover preview와 context panel 모두 trigger 중심 정렬, `taskbarRoot.height + 10px` 부착, `opening/open/closing` 유지, missing ref 시 `warn + no-op`, 전환 중 새 요청 우선 규칙을 같은 방식으로 따른다.
- 제외 범위: search panel, window panel, taskbar leaf 시각 리디자인, hook 내부의 자동 group arbitration 추가.

## 사전 합의

| 항목 | 합의 내용 | 적용 범위 | 메모 |
| --- | --- | --- | --- |
| 공개 hook 구조 | `useTaskbarHoverPreview`와 `useTaskbarContextPanel`은 계속 별도 export로 유지한다. | 전체 | 공통 로직은 내부 primitive로만 이동 가능 |
| 실행 계약 경계 | 실행 시 authoritative contract는 이 `plan.md`와 linked phase detail 파일만 사용한다. 외부 메모나 live 코드 참조는 배경 정보일 뿐, 실행 의존성으로 남기지 않는다. | 전체 | reviewer/materializer handoff 기준 |
| taskbar root 입력 | 두 public hook은 explicit `taskbarRootRef`를 입력으로 받는다. taskbar root를 trigger ancestor나 `.taskbar` owner에서 탐색하는 계약은 사용하지 않는다. | 전체 | 현재 승인된 제품 결정 |
| 상호 배타성 소유권 | hover/context winner rule은 consumer가 `dismiss()`/`close()` 조합으로 소유하고, primitive는 sibling group을 자동 정리하지 않는다. | 전체 | hook 내부 arbitration 금지 |
| 배치 기준 | 가로는 trigger icon 중심 기준, 세로는 `taskbarRoot.height + 10px` 기준으로 붙이고, 실제 렌더된 panel rect를 사용한다. | 전체 | 가로 clamp만 유지 |
| 모션 수명주기 | `opening/open/closing`을 유지하고, enter 완료 전까지 `opening`, exit 완료 전까지 `closing`, reduced motion은 즉시 finalize로 처리한다. | 전체 | finalize는 root animation 경계 기준 |
| hook별 차이 | hover는 document whitelist 기반 close와 no focus restore, context는 focus restore를 유지한다. | 전체 | missing ref는 `warn + no-op` |
| compare owner 처리 | `storybook/*.compare.test.tsx`와 compare harness pair는 visual baseline owner로만 유지하고, runtime geometry/motion의 canonical owner로 해석하지 않는다. | Phase 3 | 필요 시 assertion/주석을 이 역할에 맞게 정리 |

## Phase 흐름 요약

| Phase | 역할 | 하는 일 | 끝나면 고정되는 상태 | 다음 단계 인계 |
| --- | --- | --- | --- | --- |
| Phase 1. 공용 surface 런타임 정리 | 내부 계약 고정 | 측정 기반 배치 helper와 공용 runtime primitive를 정의하고, explicit ref 입력 shape, 10px 상수, animation 경계, latest intent wins 규칙을 한곳에 모은다. | 두 public hook이 같은 내부 배치/phase/dismiss 계약과 같은 ref vocabulary를 쓸 수 있는 상태 | 내부 primitive API와 helper 검증 기준 |
| Phase 2. 공개 hook parity 적용 | public hook 연결 | 두 hook을 공용 primitive에 연결하고, public option에 `taskbarRootRef`를 고정하며, story harness도 ancestor lookup 대신 explicit ref injection을 하게 맞춘다. | 공개 hook split은 유지하면서 parity 동작과 host wiring 계약이 hook 레벨에서 고정된 상태 | 변경된 hook output과 host wiring 기준 |
| Phase 3. 검증 surface 정합화 | 테스트 소유자 동기화 | hook unit test와 runtime harness test를 measured placement, explicit ref injection, motion, warn/no-op, consumer-owned exclusivity 기준으로 다시 잠그고, compare owner는 visual baseline 역할로 명시 정리한다. | 후속 `plan-materialize`와 구현 리뷰가 어떤 owner가 runtime truth이고 어떤 owner가 visual baseline인지 같은 방식으로 읽을 수 있는 상태 | 실행-ready 검증 surface와 handoff 근거 |

## 단계별 실행

### Phase 1. 공용 surface 런타임 정리

- 목적: hover/context가 함께 써야 하는 측정 기반 배치와 phase 전이 규칙을 내부 primitive 계약으로 먼저 고정한다.
- 왜 먼저 하는가: public hook을 먼저 고치면 배치 계산, missing ref 처리, stale animation 처리 규칙이 다시 갈라진다.
- 시작 조건: `none`
- 핵심 변경:
- `panelWidth/panelHeight` 추정 입력 대신 `trigger rect + rendered surface rect + taskbar root rect` 기반 helper로 교체
- shared primitive 입력을 `triggerRef + taskbarRootRef + surfaceRootRef` direct contract로 고정
- `10px` 고정 gap을 이름 있는 상수로 승격
- root animation 경계와 reduced motion finalize를 공통 primitive에서 소비할 수 있게 정리
- 완료 조건: 두 public hook이 공통 primitive 하나만으로 measured placement, latest intent wins, warn/no-op 규칙을 소비할 수 있다.
- 다음 단계로 넘기는 것: `useTaskbarHoverPreview`와 `useTaskbarContextPanel`이 연결할 내부 primitive API와 helper 검증 기준
- 상세 문서: `./phases/01-shared-surface-runtime.md`

### Phase 2. 공개 hook parity 적용

- 목적: public hook split을 유지한 채 hover/context의 live parity 동작을 hook 경계에 반영한다.
- 왜 이 단계가 필요한가: user-facing contract는 hook 단위로 소비되므로, 내부 primitive만 정리해서는 실제 host wiring과 차이가 남는다.
- 시작 조건: Phase 1의 shared runtime/helper 계약이 고정되어 있다.
- 핵심 변경:
- 두 public hook option에 explicit `taskbarRootRef`를 포함하고 shared runtime으로 그대로 전달
- hover는 document-level whitelist 추적과 pointer-reset gate를 유지하되 element-only leave 의존을 제거
- context는 focus restore와 duplicate close no-op을 유지하면서 측정 기반 placement로 전환
- story behavior harness는 ancestor lookup 대신 explicit `taskbarRootRef`를 직접 주입
- 완료 조건: 두 hook이 live contract대로 동작하고, hook 내부에서 sibling arbitration이나 좌표 fallback을 다시 도입하지 않는다.
- 다음 단계로 넘기는 것: 새 hook output, host wiring, deprecated geometry input 처리 방침
- 상세 문서: `./phases/02-public-hook-parity.md`

### Phase 3. 검증 surface 정합화

- 목적: 기존 hook/unit/runtime owner들이 더 이상 추정 폭·높이나 즉시 `open` 전이를 canonical contract로 잠그지 않게 만든다.
- 왜 마지막 단계인가: 검증 소유자는 Phase 1~2에서 고정된 실제 contract를 기준으로만 다시 써야 한다.
- 시작 조건: public hook parity와 story host wiring이 Phase 2 기준으로 고정되어 있다.
- 핵심 변경:
- hook unit test를 measured placement, warn/no-op, latest intent wins, focus restore 차이로 재정렬
- runtime harness test를 explicit `taskbarRootRef` injection, hover document whitelist, enter animation completion, consumer-owned winner rule로 확장
- compare test/harness pair를 visual baseline owner로 명시 정리하고, width-formula/row-derived geometry를 runtime success criteria로 남기지 않음
- 완료 조건: 후속 reviewer/materializer가 파일만 읽고도 어떤 시나리오를 unit/runtime owner가 맡고 어떤 compare owner가 visual baseline만 맡는지 바로 알 수 있다.
- 최종 산출물: 구현 준비가 끝난 reviewer-facing plan과 phase별 검증 surface 계약
- 상세 문서: `./phases/03-verification-surface-alignment.md`

## 체크포인트

- [ ] Phase 1 완료 시 measured placement, explicit ref 입력 shape, gap 상수, animation 경계, latest intent wins 규칙이 내부 primitive 계약으로 고정된다.
- [ ] Phase 2 완료 시 두 public hook이 split을 유지한 채 explicit `taskbarRootRef` input과 hook별 차이를 정확히 드러낸다.
- [ ] Phase 3 완료 시 unit/runtime owner와 compare visual owner의 역할이 겹치지 않고, runtime owner가 ref injection contract까지 검증한다.
