# windows-ui-taskbar-shell 테스트 materialization 보고서

- boundary: `Phase 1 Icon fallback contract`
  - scenario contract summary: `src`가 있으면 custom image가 `kind` fallback보다 우선하고, `src`가 없으면 `kind="file" | "folder"`가 package-owned asset fallback을 결정한다.
  - risk pattern summary: `winner/loser 없음`, `src > kind` 우선순위만 고정하면 된다.
  - test type: `unit`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/internal/icon/icon.test.tsx`
  - reason: 기존 frozen test가 `src` 우선, `kind` fallback, `alt/className` pass-through를 이미 canonical contract로 고정한다.
  - canonical contract: `src > kind`, `file/folder asset fallback`, `alt/className pass-through`
  - rejected sibling candidates: `packages/ui/src/index.ts export test`, `packages/ui/src/interactive/index.ts export test`

- boundary: `Phase 1 SearchField/ContentRow internal helper usage`
  - scenario contract summary: start/search panel과 leaf shell이 generic DOM prop과 render slot을 local helper를 통해 소비하되, standalone public contract로 승격하지 않는다.
  - risk pattern summary: `없음`
  - test type: `skip`
  - action: `skip`
  - target file: `n/a`
  - reason: plan이 `SearchField`, `ContentRow`에 독립 frozen output을 부여하지 않았고, 현재 stable contract는 owning public component test에서 이미 간접적으로 닫힌다.
  - rejected sibling candidates: `packages/ui/src/components/taskbar/internal/searchField/*.test.tsx`, `packages/ui/src/components/taskbar/internal/contentRow/*.test.tsx`

- boundary: `Phase 1 PanelTile variant grammar`
  - scenario contract summary: `PanelTile`은 `framed | compact` variant에 따라 다른 markup을 렌더링하고 native button prop을 수용한다.
  - risk pattern summary: `winner/loser 없음`, variant별 final markup difference만 고정하면 된다.
  - test type: `unit`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/internal/panelTile/panelTile.test.tsx`
  - reason: 기존 frozen test가 `framed | compact` variant difference와 label/description/graphic/native button prop contract를 이미 소유한다.
  - canonical contract: `variant-specific markup`, `label/description/graphic`, `button prop pass-through`
  - rejected sibling candidates: `PanelSurface`, `PanelHeader`, `PanelSection` standalone tests

- boundary: `Phase 2 Taskbar shell composition`
  - scenario contract summary: `Taskbar`는 `startButton`, `search`, `items`, `clock` named slot을 함께 렌더링하고 items cluster 변화가 shell markup 변화로 이어져야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/taskbar/taskbar.test.tsx`
  - reason: 기존 test가 named slot composition과 items cluster markup change를 이미 frozen contract로 고정한다.
  - canonical contract: `named slot composition`, `items cluster markup change`

- boundary: `Phase 2 TaskbarStartButton native button contract`
  - scenario contract summary: `TaskbarStartButton`은 app-specific action naming 없이 native button/ARIA prop을 그대로 수용한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/taskbarStartButton/taskbarStartButton.test.tsx`
  - reason: 기존 test가 `aria-label`, `disabled`, disabled에 따른 markup difference를 이미 고정한다.
  - canonical contract: `native button prop pass-through`, `disabled markup difference`

- boundary: `Phase 2 TaskbarSearch input-like contract`
  - scenario contract summary: `TaskbarSearch`는 `placeholder`, `value`, `readOnly`와 generic input prop을 input-like shell로 렌더링한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/taskbarSearch/taskbarSearch.test.tsx`
  - reason: 기존 test가 placeholder/value/readOnly/ARIA contract와 value change에 따른 markup difference를 이미 고정한다.
  - canonical contract: `input-like shell`, `generic input prop pass-through`

- boundary: `Phase 2 TaskbarIconButton status grammar`
  - scenario contract summary: `TaskbarIconButton`은 native button prop과 icon render slot을 수용하면서 `default | open | active`를 `data-status`와 distinct markup으로 구분한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/taskbarIconButton/taskbarIconButton.test.tsx`
  - reason: 기존 test가 status별 `data-status`와 markup difference, native button/ARIA prop pass-through를 이미 고정한다.
  - canonical contract: `default/open/active`, `data-status`, `button prop pass-through`

- boundary: `Phase 2 TaskbarClock label contract`
  - scenario contract summary: `TaskbarClock`은 formatter ownership 없이 `timeLabel`, `dateLabel`, container HTML prop만 해석한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/taskbarClock/taskbarClock.test.tsx`
  - reason: 기존 test가 두 줄 label contract와 container prop pass-through, label change에 따른 markup difference를 이미 고정한다.
  - canonical contract: `time/date labels only`, `container HTML prop pass-through`

- boundary: `Phase 3 Start/Search panel mode rendering`
  - scenario contract summary: `TaskbarStartPanel`은 `pinned | all | results`, `TaskbarSearchPanel`은 `default | results` mode별 canonical content와 detail action block을 렌더링한다.
  - risk pattern summary: `mode selection boundary`, `must happen output`은 mode별 sibling markup difference다.
  - test type: `unit`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/taskbarStartPanel/taskbarStartPanel.test.tsx`, `packages/ui/src/components/taskbar/taskbarSearchPanel/taskbarSearchPanel.test.tsx`
  - reason: 기존 test가 mode별 content, result/detail action object rendering, sibling mode markup difference를 이미 frozen contract로 소유한다.
  - canonical contract: `pinned/all/results`, `default/results`, `detail action block`
  - rejected sibling candidates: `PanelSurface`, `PanelHeader`, `PanelSection` standalone extraction tests

- boundary: `Phase 4 Hover panel compact preview grammar`
  - scenario contract summary: `TaskbarHoverPanel`은 title, preview item thumbnail/caption, optional close affordance를 compact preview strip으로 렌더링하고 close affordance 유무가 item content를 지우지 않아야 한다.
  - risk pattern summary: `must not happen`은 close affordance 토글이 preview item content를 지우는 것이다.
  - test type: `unit`
  - action: `update`
  - target file: `packages/ui/src/components/taskbar/taskbarHoverPanel/taskbarHoverPanel.test.tsx`
  - reason: 기존 test는 text presence만 확인해 close affordance toggle의 negative contract가 약했다. 이번 materialization에서 content preservation과 markup difference를 함께 고정했다.
  - canonical contract: `title + items + optional close affordance`, `content preserved when close affordance=false`

- boundary: `Phase 4 Context menu visual state grammar`
  - scenario contract summary: `TaskbarContextMenu`는 `leadingIcon`, `label`, `shortcut`, `disabled`, `destructive`, `selected`를 compact row grammar로 렌더링하고 stateful row와 plain row가 같은 markup으로 수렴하면 안 된다.
  - risk pattern summary: `must not happen`은 `disabled/destructive/selected`가 plain row와 같은 final markup으로 수렴하는 것이다.
  - test type: `unit`
  - action: `update`
  - target file: `packages/ui/src/components/taskbar/taskbarContextMenu/taskbarContextMenu.test.tsx`
  - reason: 기존 test는 state 존재만 느슨하게 확인했다. 이번 materialization에서 plain row 대비 distinct markup requirement를 명시적으로 고정했다.
  - canonical contract: `leadingIcon/label/shortcut`, `disabled/destructive/selected => distinct markup`
  - rejected sibling candidates: `ContextMenuRow` standalone extraction test

- boundary: `Phase 4 Final public export boundary`
  - scenario contract summary: root export surface는 public 9종으로 닫히고 internal helper는 root entry로 새면 안 된다.
  - risk pattern summary: `없음`
  - test type: `skip`
  - action: `skip`
  - target file: `n/a`
  - reason: 이번 plan은 exhaustive export inventory test를 durable contract로 채택하지 않는다. root surface 회귀는 component boundary test와 TypeScript 해석에 맡긴다.
  - rejected sibling candidates: `packages/ui/src/index.test.ts`

- boundary: `Taskbar bounded-surface E2E`
  - scenario contract summary: 사용자 눈에 보이는 taskbar shell surface 전체를 route owner 위에서 상호작용으로 검증하는 bounded-surface E2E.
  - risk pattern summary: `없음`
  - test type: `skip`
  - action: `skip`
  - target file: `n/a`
  - reason: Playwright setup은 있지만 현재 plan은 `packages/ui` presentational shell만 소유하고 `apps/web` route나 `@windows/ui/interactive` surface owner를 포함하지 않는다. route owner 없이 E2E surface를 추정하지 않는다.
  - rejected sibling candidates: `apps/web` taskbar route spec, `@windows/ui/interactive` overlay interaction spec

## 결론

- 이번 materialization 전략의 중심은 기존 `packages/ui` source-tree unit test 재사용이다.
- 실질적인 source-tree 변경은 약했던 `TaskbarHoverPanel`, `TaskbarContextMenu` frozen contract 보강 두 건이고, 나머지 taskbar 경계는 기존 colocated test가 현재 plan과 이미 맞물린다고 판단했다.
- `PanelSurface`, `PanelHeader`, `PanelSection`, `ContextMenuRow`는 이번 plan에서 아예 추출하지 않기로 확정됐으므로 `block`이 아니라 rejected sibling candidate로만 남긴다.
- E2E는 runner 부재가 아니라 surface owner 부재 때문에 의도적으로 skip했다.

## 후속 권장

1. 구현 중 `SearchField`, `ContentRow`에 standalone final output이 생기거나 `PanelSurface`, `PanelHeader`, `PanelSection`, `ContextMenuRow`가 실제 reusable helper로 추출되면 그 시점에 별도 unit test를 추가하는 편이 좋다.
2. 실제 구현 파일이 생기면 hover/context row chrome에 대해 더 구체적인 accessibility contract가 필요해지는지 다시 검토하는 편이 좋다.
3. 이후 `apps/web` 또는 `@windows/ui/interactive`가 실제 open/close, focus, portal mount surface를 소유하게 되면 그때 bounded-surface Playwright spec을 surface owner 기준으로 materialize하면 된다.
