# windows-ui-taskbar-shell 테스트 materialization 보고서

- boundary: `Phase 1 public/internal contract freeze`
  - test type: `skip`
  - action: `skip`
  - target file: `n/a`
  - reason: 구현 전 contract/asset/export 경계 확정 단계이며, 독립 실행 코드 경계가 아니라 이후 렌더링 boundary의 전제 조건이다.

- boundary: `Phase 2 core shell rendering contract`
  - test type: `unit`
  - action: `create`
  - target file: `packages/ui/src/components/taskbar/internal/icon/icon.test.tsx`, `packages/ui/src/components/taskbar/taskbarIconButton/taskbarIconButton.test.tsx`
  - reason: 사용자 확인에 따라 `packages/ui/src/**` co-location을 local placement로 채택할 수 있고, Phase 2에서 실제로 회귀 위험이 높은 contract는 `Icon`의 `src` 우선 / `kind` fallback과 `TaskbarIconButton`의 `default | open | active` 상태 분기다. `TaskbarSearch`, `TaskbarClock` 같은 단순 문자열/placeholder 렌더링은 현재 범위에선 테스트 신호가 약하다.

- boundary: `Phase 3 start/search panel mode rendering contract`
  - test type: `unit`
  - action: `block`
  - target file: `n/a`
  - reason: `pinned | all | results`, `default | results` mode 자체는 고정됐지만, `pinnedItems`, `all` 그룹 구조, `results` detail/action item shape 같은 panel input contract가 plan에 아직 충분히 고정되지 않아 안정된 test fixture를 생성하기 어렵다.

- boundary: `Phase 4 hover/context overlay rendering contract`
  - test type: `unit`
  - action: `block`
  - target file: `n/a`
  - reason: preview item과 context action item의 구체적 필드 계약이 아직 plan 수준에서 충분히 닫히지 않았다. placement 문제는 해소됐지만 fixture contract가 아직 모호하다.

- boundary: `taskbar shell bounded-surface e2e`
  - test type: `e2e`
  - action: `skip`
  - target file: `n/a`
  - reason: repo root에 Playwright 설정은 존재하지만, 이번 plan은 `packages/ui` visual shell만 다루고 `apps/web` preview route나 소비 surface를 명시적으로 제외한다. 현재는 Playwright가 바인딩할 concrete route/surface가 없으므로 bounded-surface E2E는 이 plan에서 materialize하지 않는다. 이후 `apps/web` 소비 surface가 생기면 그 plan에서 다시 판정해야 한다.

## 결론

- 이번 plan에서 테스트 필요성 자체는 있다.
  - `TaskbarIconButton` 상태선과 `Icon` fallback처럼 단위 테스트 가치가 높은 렌더링 contract가 존재한다.
- 하지만 지금 즉시 source-tree test를 materialize할 조건은 부족하다.
  - unit: Phase 2 core shell은 생성 가능하지만 panel/overlay 쪽은 item fixture contract 부재로 여전히 부분 `block`
  - e2e: app-level 소비 surface 부재로 명시적 `skip`

## 후속 권장

1. panel/overlay item prop contract를 plan 또는 구현 contract에서 더 명시한다.
   예: `TaskbarStartPanel`의 pinned/all/results item shape, `TaskbarContextMenu` action item shape
2. `apps/web`에 taskbar shell preview 또는 실제 소비 route가 생기면 그 plan에서 bounded-surface E2E를 다시 materialize한다.
