# windows-ui-taskbar-styles 테스트 materialization 보고서

- boundary: `Phase 1 internal primitive style hook / final-interpretation boundary`
  - scenario contract summary: `SearchField`, `ContentRow`, `PanelTile`, `Icon`은 taskbar shell/panel/menu가 재사용하는 default chrome과 slot wrapper grammar를 가지며, caller root `className`은 additive override로만 동작해야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `update`
  - target file: `packages/ui/src/components/taskbar/internal/panelTile/panelTile.test.tsx`, `packages/ui/src/components/taskbar/internal/icon/icon.test.tsx`
  - reason: 기존 frozen test가 variant/fallback contract는 소유하지만 default class composition과 additive override를 고정하지 못한다. 같은 boundary를 이미 소유하는 인접 test를 update-first로 보강한다.
  - canonical contract: `default class composition`, `caller className additive merge`, `slot wrapper grammar reused by shell/panel`
  - rejected sibling candidates: `packages/ui/src/index.test.ts`, `packages/ui/src/interactive/index.test.ts`

- boundary: `Phase 1 SearchField / ContentRow local helper final-interpretation boundary`
  - scenario contract summary: `SearchField`는 `leading -> input[type='search'] -> trailing` slot order와 additive root class merge를 유지하고, `ContentRow`는 `leading -> content wrapper -> trailing` slot order와 additive root class merge를 유지해야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `create`
  - target file: `packages/ui/src/components/taskbar/internal/searchField/searchField.test.tsx`, `packages/ui/src/components/taskbar/internal/contentRow/contentRow.test.tsx`
  - reason: 이 두 internal helper는 styles plan에서 독립 final-interpretation boundary로 승격됐고, 현재 source tree에는 이를 직접 소유하는 boundary test가 없다.
  - canonical contract: `slot order`, `root default class non-empty`, `caller className additive merge`
  - rejected sibling candidates: `packages/ui/src/components/taskbar/taskbarSearch/taskbarSearch.test.tsx`, `packages/ui/src/components/taskbar/taskbarStartPanel/taskbarStartPanel.test.tsx`

- boundary: `Phase 2 taskbar shell / leaf control final-interpretation boundary`
  - scenario contract summary: `Taskbar`, `TaskbarStartButton`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`는 외부 utility 없이도 default shell chrome을 가지며, className을 여는 surface는 caller class를 additive override로만 합쳐야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `update`
  - target file: `packages/ui/src/components/taskbar/taskbar/taskbar.test.tsx`, `packages/ui/src/components/taskbar/taskbarStartButton/taskbarStartButton.test.tsx`, `packages/ui/src/components/taskbar/taskbarSearch/taskbarSearch.test.tsx`, `packages/ui/src/components/taskbar/taskbarIconButton/taskbarIconButton.test.tsx`, `packages/ui/src/components/taskbar/taskbarClock/taskbarClock.test.tsx`
  - reason: 기존 frozen test는 named slot, value/status, DOM prop pass-through는 고정하지만 default class grammar와 additive class merge를 직접 검증하지 않는다.
  - canonical contract: `default shell class grammar`, `native prop pass-through 유지`, `caller className additive merge`
  - rejected sibling candidates: `apps/web/src/app/sandbox/taskbar/page.test.tsx`

- boundary: `Phase 3 panel / menu style grammar final-interpretation boundary`
  - scenario contract summary: `TaskbarStartPanel`, `TaskbarSearchPanel`, `TaskbarHoverPanel`, `TaskbarContextMenu`는 root panel chrome을 가지며 active/current/selected/destructive 같은 state row가 plain row와 구별되는 style grammar를 드러내야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `update`
  - target file: `packages/ui/src/components/taskbar/taskbarStartPanel/taskbarStartPanel.test.tsx`, `packages/ui/src/components/taskbar/taskbarSearchPanel/taskbarSearchPanel.test.tsx`, `packages/ui/src/components/taskbar/taskbarHoverPanel/taskbarHoverPanel.test.tsx`, `packages/ui/src/components/taskbar/taskbarContextMenu/taskbarContextMenu.test.tsx`
  - reason: 기존 test는 mode/state content 차이는 고정하지만 package-owned panel/menu class grammar와 state row style reflection을 직접 고정하지 않는다.
  - canonical contract: `root panel class non-empty`, `active/current/selected/destructive row style reflection`, `positioning remains external`
  - rejected sibling candidates: `PanelSurface`, `ContextMenuRow` standalone tests

- boundary: `Phase 3 /sandbox/taskbar bounded-surface style reflection`
  - scenario contract summary: `/sandbox/taskbar` owner route에서 canonical scene과 matrix가 보일 때, preview wrapper chrome 위에 package-owned taskbar/panel/menu surfaces가 non-empty class를 가진 styled output으로 반영되어야 한다.
  - risk pattern summary: `없음`
  - test type: `e2e`
  - action: `update`
  - target file: `e2e/sandbox-taskbar-preview.spec.ts`
  - reason: styles plan의 frontend user-visible boundary는 이미 같은 surface id와 route를 소유하는 bounded-surface Playwright spec이 있으므로 create 대신 update-first가 맞다.
  - canonical contract: `@surface_id sandbox-taskbar-preview`, route `/sandbox/taskbar`, canonical/matrix visibility, package-owned `nav`/`[data-panel]` surface의 non-empty class reflection
  - rejected sibling candidates: `apps/web/src/app/sandbox/taskbar/page.test.tsx`, `playwright-guard`

## 결론

- 이번 materialization은 `packages/ui`의 기존 colocated unit tests를 update-first로 보강하고, 새로 승격된 internal helper boundary 두 곳에만 테스트 파일을 생성한다.
- frontend user-visible boundary는 이미 존재하는 `sandbox-taskbar-preview` Playwright surface spec를 update하는 방식으로 닫는다.
- production code와 test config는 수정하지 않았다.
