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
  - reason: 사용자 확인에 따라 이번 plan은 `packages/ui` unit-only로 한정한다. Phase 2에서 plan이 충분히 닫아 둔 실행 경계는 `Icon`의 `src` 우선 / `kind` fallback과 `TaskbarIconButton`의 `default | open | active` 상태 분기다. 구현이 아직 없어도 frozen contract를 먼저 source tree에 고정할 수 있다.

- boundary: `Phase 3 start/search panel mode rendering contract`
  - test type: `unit`
  - action: `create`
  - target file: `packages/ui/src/components/taskbar/taskbarStartPanel/taskbarStartPanel.test.tsx`, `packages/ui/src/components/taskbar/taskbarSearchPanel/taskbarSearchPanel.test.tsx`
  - reason: 최신 plan에서 `TaskbarStartPanel`, `TaskbarSearchPanel` public props가 data-only discriminated union으로 닫혔다. `pinned | all | results`, `default | results` mode별 최소 fixture를 frozen contract test로 바로 source tree에 고정할 수 있다.

- boundary: `Phase 4 hover/context overlay rendering contract`
  - test type: `unit`
  - action: `create`
  - target file: `packages/ui/src/components/taskbar/taskbarHoverPanel/taskbarHoverPanel.test.tsx`, `packages/ui/src/components/taskbar/taskbarContextMenu/taskbarContextMenu.test.tsx`
  - reason: 최신 plan에서 hover/context overlay contract가 server-safe data-only props로 닫혔다. preview item과 action item의 최소 fixture를 frozen contract test로 materialize해 compact preview/menu visual shell 계약을 고정할 수 있다.

- boundary: `Phase 4 final public export boundary`
  - test type: `unit`
  - action: `create`
  - target file: `packages/ui/src/index.test.ts`
  - reason: public export 9종과 internal `Icon`, `SearchField`, `ContentRow` 비노출 규칙은 plan에서 이미 고정됐다. 구현 전에도 package root export contract를 frozen test로 먼저 materialize할 수 있다.

- boundary: `taskbar shell bounded-surface e2e`
  - test type: `skip`
  - action: `skip`
  - target file: `n/a`
  - reason: 사용자 확인에 따라 이번 turn에서는 `web` 소비 surface를 테스트하지 않는다. 따라서 Playwright bounded-surface E2E는 이번 materialization 범위에서 제외한다.

## 결론

- 이번 turn의 materialization 전략은 `packages/ui` unit-only다.
- 구현 전에도 contract가 충분히 닫힌 경계는 frozen test로 먼저 source tree에 고정할 수 있다.
- 이번 materialization에서는 `Icon`, `TaskbarIconButton`, start/search panel, hover/context overlay, package root export boundary 테스트를 추가했다.
- 현재 plan에서 남은 blocker는 구현 자체이지 test contract 부족은 아니다.

## 후속 권장

1. `packages/ui/src/components/taskbar/**` 구현이 들어오면 이번 frozen contract test를 먼저 통과시키고, 그 다음 닫힌 taskbar shell 합성 렌더링 테스트를 추가한다.
2. Phase 2 구현이 들어오면 `Taskbar`, `TaskbarStartButton`, `TaskbarSearch`, `TaskbarClock`를 묶는 닫힌 shell composition test를 추가해 leaf presentational contract를 보강한다.
