# windows-ui-taskbar-shell 테스트 materialization 보고서

- boundary: `Phase 1 public/internal contract freeze`
  - test type: `skip`
  - action: `skip`
  - target file: `n/a`
  - reason: 구현 전 public/internal 경계, 스타일 우선순위, prop grammar를 고정하는 단계다. 독립 실행 코드 경계가 아니라 이후 렌더링 및 export boundary의 전제 조건이므로 별도 테스트를 만들지 않는다.

- boundary: `Phase 2 internal icon fallback contract`
  - test type: `unit`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/internal/icon/icon.test.tsx`
  - reason: 기존 frozen contract가 이미 `src` 우선 / `kind` fallback / className 전달 경계를 고정하고 있다. 새 plan에서도 이 경계는 그대로 유효하므로 이번 materialization에서는 기존 test를 재사용하고 보고서만 갱신한다.

- boundary: `Phase 2 taskbar icon button native prop contract`
  - test type: `unit`
  - action: `update`
  - target file: `packages/ui/src/components/taskbar/taskbarIconButton/taskbarIconButton.test.tsx`
  - reason: 새 plan은 `TaskbarIconButton`을 render slot뿐 아니라 native button/ARIA prop을 받는 leaf component로 규정한다. 기존 test를 확장해 `status` visual state와 generic button prop pass-through를 함께 고정한다.

- boundary: `Phase 2 taskbar shell composition contract`
  - test type: `unit`
  - action: `create`
  - target file: `packages/ui/src/components/taskbar/taskbar/taskbar.test.tsx`
  - reason: 새 plan에서 `Taskbar`의 named slot 조합(`startButton`, `search`, `items`, `clock`)이 stable contract로 드러났다. `packages/ui` 전용 presentational shell 경계이므로 route 기반 E2E 대신 frozen composition unit test로 먼저 고정한다.

- boundary: `Phase 2 taskbar search input-like contract`
  - test type: `unit`
  - action: `create`
  - target file: `packages/ui/src/components/taskbar/taskbarSearch/taskbarSearch.test.tsx`
  - reason: `TaskbarSearch`는 `placeholder`, `value`, `readOnly`, `onChange`, `onClick`를 허용하는 input-like control로 plan에 명시됐다. generic input prop 수용과 닫힌 검색 shell markup을 unit boundary로 고정할 수 있다.

- boundary: `Phase 2 taskbar start button native button contract`
  - test type: `unit`
  - action: `create`
  - target file: `packages/ui/src/components/taskbar/taskbarStartButton/taskbarStartButton.test.tsx`
  - reason: `TaskbarStartButton`은 app-specific action 없이 native button/ARIA prop pass-through를 허용하는 leaf boundary다. 구현 전에도 `aria-label`, `disabled`, generic click prop 수용 여부를 frozen contract로 고정할 수 있다.

- boundary: `Phase 2 taskbar clock label contract`
  - test type: `unit`
  - action: `create`
  - target file: `packages/ui/src/components/taskbar/taskbarClock/taskbarClock.test.tsx`
  - reason: 최신 plan은 `TaskbarClock` public contract를 `timeLabel`, `dateLabel`, container-level HTML prop으로 명시적으로 닫았다. 포맷 계산 없이 두 줄 clock shell만 책임지는 public boundary이므로 frozen unit test로 바로 고정할 수 있다.

- boundary: `Phase 2 shared panel primitive contract`
  - test type: `unit`
  - action: `block`
  - target file: `n/a`
  - reason: `PanelSurface`, `PanelHeader`, `PanelSection`는 여전히 "반복되면 추출" 정책에 따라 구현 시점에서 exact prop shape가 결정된다. 현 시점에서는 test file 경로와 fixture를 추정하지 않고 block으로 남긴다.

- boundary: `Phase 2 panel tile shared grammar contract`
  - test type: `unit`
  - action: `create`
  - target file: `packages/ui/src/components/taskbar/internal/panelTile/panelTile.test.tsx`
  - reason: 최신 plan은 `PanelTile` internal contract를 `variant: 'framed' | 'compact'`, `label`, `graphic?`, `description?`, `selected?`, native button prop, generic click/contextmenu로 구체화했다. 첨부된 tile UI와 local `blog` tile family를 기준으로 reusable internal boundary를 frozen test로 먼저 고정할 수 있다.

- boundary: `Phase 3 start/search panel mode rendering contract`
  - test type: `unit`
  - action: `update`
  - target file: `packages/ui/src/components/taskbar/taskbarStartPanel/taskbarStartPanel.test.tsx`, `packages/ui/src/components/taskbar/taskbarSearchPanel/taskbarSearchPanel.test.tsx`
  - reason: 새 plan은 panel contract를 `data-only`가 아니라 `render slot + generic callback` 허용 방향으로 바꿨고, detail action도 공통 action object shape로 닫았다. 기존 mode test를 갱신해 `pinned | all | results`, `default | results`와 action object contract를 함께 고정한다.

- boundary: `Phase 4 hover/context overlay rendering contract`
  - test type: `unit`
  - action: `update`
  - target file: `packages/ui/src/components/taskbar/taskbarHoverPanel/taskbarHoverPanel.test.tsx`, `packages/ui/src/components/taskbar/taskbarContextMenu/taskbarContextMenu.test.tsx`
  - reason: hover/context도 `server-safe data-only`가 아니라 generic callback과 render slot을 허용하는 presentational shell로 바뀌었다. 기존 compact preview/menu test를 갱신해 callback-friendly contract와 visual state grammar를 함께 고정한다.

- boundary: `Phase 4 context row shared grammar contract`
  - test type: `unit`
  - action: `block`
  - target file: `n/a`
  - reason: 최신 plan은 `ContextMenuRow`를 context/detail action row chrome이 실제로 반복될 때만 추출하는 internal candidate로 정의한다. 추출 여부와 prop shape가 아직 확정되지 않았으므로 test materialization은 구현 방향이 닫힌 뒤 진행하는 편이 맞다.

- boundary: `Phase 4 final public export boundary`
  - test type: `skip`
  - action: `skip`
  - target file: `n/a`
  - reason: 사용자 결정에 따라 exhaustive root export inventory test는 이번 plan의 durable contract로 채택하지 않는다. public surface 회귀는 각 public component boundary test와 TypeScript export 해석에 맡기고, `packages/ui/src/index.test.ts`는 만들지 않는다.

- boundary: `taskbar shell bounded-surface e2e`
  - test type: `skip`
  - action: `skip`
  - target file: `n/a`
  - reason: 이번 executable plan은 `packages/ui` 전용 presentational shell만 다루고 `apps/web`, `@windows/ui/interactive`를 명시적으로 제외한다. 로컬 Playwright setup은 존재하지만 현재 plan은 route, portal mount, 실제 open/close interaction을 소유하지 않으므로 bounded-surface E2E 대상 surface가 아직 없다.

## 결론

- 이번 materialization 전략의 중심은 `packages/ui` source-tree unit test다.
- 새 plan에 맞춰 기존 panel/context/iconButton frozen contract를 업데이트했고, `Taskbar`, `TaskbarSearch`, `TaskbarStartButton`, `TaskbarClock`, internal `PanelTile` 경계는 새 unit test로 materialize했다.
- `PanelSurface`, `PanelHeader`, `PanelSection`, `ContextMenuRow`는 conditional extraction policy 때문에 여전히 `block`으로 남긴다.
- E2E는 테스트 환경 부재가 아니라 surface ownership 부재 때문에 의도적으로 skip했다.

## 후속 권장

1. 구현 중 `PanelSurface`, `PanelHeader`, `PanelSection`, `ContextMenuRow`가 실제 reusable internal component로 추출되면 그 시점에 별도 unit test를 추가하는 편이 좋다.
2. 구현이 들어오면 `Taskbar`, `TaskbarStartButton`, `TaskbarSearch`, `TaskbarClock`를 묶는 닫힌 shell 합성 렌더링 테스트를 현재 leaf frozen contract 위에 더 강화하는 편이 좋다.
3. 이후 `apps/web` 또는 `@windows/ui/interactive`에서 실제 open/close, focus, portal mount를 소유하게 되면 그때 bounded-surface Playwright spec을 별도 surface owner 기준으로 materialize하면 된다.
