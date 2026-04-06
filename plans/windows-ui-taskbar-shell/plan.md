**Branch:** feat/windows-ui-taskbar-shell

> Worktree dir: `worktrees/windows-ui-taskbar-shell` (plan 폴더명과 동일)

# Windows UI 작업 표시줄 쉘 실행 계획

> 요청당 plan 파일은 하나만 생성하고, 실행 순서는 아래 `Phase`들로만 표현한다.
> 추가 top-level section은 사용자 요청이나 별도 정책 요구가 없는 한 넣지 않는다.

## 단계별 실행

### Phase 1

- owner_agent: `frontend-developer`
- 목적: taskbar family가 공통으로 쓰는 server-safe internal primitive와 asset fallback 계약을 먼저 구현해 이후 public shell 단계가 중복 markup 추정 없이 진행되게 한다.
- boundary:
  - `packages/ui/src/components/taskbar/internal/icon/**`
  - `packages/ui/src/components/taskbar/internal/contentRow/**`
  - `packages/ui/src/components/taskbar/internal/searchField/**`
  - `packages/ui/src/components/taskbar/internal/panelTile/**`
- input: `plans/windows-monorepo-validation-contracts/plan.md` Phase 1의 output/검증으로 확보한 `pnpm --filter @windows/ui exec tsc --version` repo-supported validation path, `packages/ui/src/components/taskbar/internal/icon/icon.test.tsx`, `packages/ui/src/components/taskbar/internal/panelTile/panelTile.test.tsx`, 루트 `assets/file*.png` 및 `assets/folder*.png`, `packages/ui/src/index.ts` server-safe entry, `packages/ui/package.json`/`packages/ui/tsconfig.json`/`packages/ui/vitest.config.ts` 검증 계약
- output: `Icon`은 `src`가 있으면 `kind`보다 우선해 해당 이미지를 렌더링하고, `kind="file" | "folder"`만으로도 package-owned fallback asset을 렌더링한다. `PanelTile`은 `framed | compact` variant별로 다른 markup을 렌더링한다. `SearchField`와 `ContentRow`는 taskbar 내부에서만 소비되는 helper로 준비된다. panel surface/header/section chrome은 이번 plan에서 별도 internal helper로 추출하지 않고 각 public panel local markup으로 남긴다. internal helper는 root export와 `@windows/ui/interactive` entry로 노출되지 않는다.
- 선행조건: `plans/windows-monorepo-validation-contracts/plan.md`의 Phase 1이 먼저 완료되어 clean workspace에서 `pnpm --filter @windows/ui exec tsc --version`이 missing binary 없이 통과하는 상태
- 제약: browser state, hooks, portal mount, open/close orchestration, hover delay, dismiss logic, app-specific action naming은 이 단계에서 도입하지 않는다. `PanelSurface`, `PanelHeader`, `PanelSection`는 이번 plan에서 독립 internal component로 추출하지 않는다.
- side effects: taskbar internal helper 파일과 package-local asset import mapping이 추가될 수 있다.
- failure/validation: `Icon`의 `src` 우선 규칙이나 `PanelTile` variant grammar가 흐려지면 이후 public shell 단계로 진행하지 않는다.
- 작업:
  - `Icon`의 `src` 우선 / `kind` fallback / `alt` / `className` contract를 구현한다.
  - `SearchField`와 `ContentRow`를 generic DOM props와 render slot을 유지하는 내부 primitive로 만든다.
  - 반복 grammar가 test로 이미 고정된 범위까지만 `PanelTile`을 비공개 primitive로 정리하고, panel surface/header/section chrome은 각 owning panel의 local markup으로 유지한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/taskbar/internal/icon/icon.test.tsx src/components/taskbar/internal/panelTile/panelTile.test.tsx`
  - [ ] `Icon`과 `PanelTile`이 frozen contract를 깨지 않고 렌더된다.
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] `packages/ui/src/index.ts`와 `packages/ui/src/interactive/index.ts`에 internal helper export가 추가되지 않고 `PanelSurface`, `PanelHeader`, `PanelSection` 같은 새 internal extraction boundary가 도입되지 않는다.

### Phase 2

- owner_agent: `frontend-developer`
- 목적: taskbar shell과 public leaf control을 구현해 start/search/items/clock 조합이 server-safe entry 안에서 안정적으로 렌더되도록 한다.
- boundary:
  - `packages/ui/src/components/taskbar/taskbar/**`
  - `packages/ui/src/components/taskbar/taskbarStartButton/**`
  - `packages/ui/src/components/taskbar/taskbarSearch/**`
  - `packages/ui/src/components/taskbar/taskbarIconButton/**`
  - `packages/ui/src/components/taskbar/taskbarClock/**`
- input: Phase 1 internal primitive, `plans/windows-monorepo-validation-contracts/plan.md` Phase 1의 output/검증으로 확보한 `pnpm --filter @windows/ui exec tsc --version` validation path, `packages/ui/src/components/taskbar/taskbar/taskbar.test.tsx`, `packages/ui/src/components/taskbar/taskbarStartButton/taskbarStartButton.test.tsx`, `packages/ui/src/components/taskbar/taskbarSearch/taskbarSearch.test.tsx`, `packages/ui/src/components/taskbar/taskbarIconButton/taskbarIconButton.test.tsx`, `packages/ui/src/components/taskbar/taskbarClock/taskbarClock.test.tsx`, `packages/ui/src/index.ts` server-safe entry
- output: `Taskbar`는 `startButton`, `search`, `items`, `clock` named slot을 함께 렌더링하고 items cluster 변화가 shell markup 변화로 드러난다. `TaskbarStartButton`은 native button/ARIA prop을 그대로 수용한다. `TaskbarSearch`는 placeholder/value/readOnly와 generic input props를 input-like shell로 렌더링한다. `TaskbarIconButton`은 `default | open | active` 상태를 `data-status`와 distinct markup으로 구분한다. `TaskbarClock`은 `timeLabel`, `dateLabel`, container HTML prop만 해석한다. 이 단계 컴포넌트는 item mapping, panel state 결정, portal mount, app-specific action naming을 소유하지 않는다.
- 선행조건: Phase 1 완료
- 제약: public leaf control은 native DOM prop pass-through와 generic callback만 허용하고 client-only effect나 store 의존성을 추가하지 않는다.
- side effects: leaf component의 class/layout grammar가 internal primitive와 맞물려 정렬된다.
- failure/validation: `Taskbar`가 slot 배치 대신 data mapping을 떠안거나 `TaskbarIconButton`의 세 상태가 같은 markup으로 수렴하면 phase를 멈추고 계약을 다시 맞춘다.
- 작업:
  - `Taskbar`에서 `startButton`, `search`, `items`, `clock` 영역을 명시적으로 배치하고 items cluster 변화가 shell markup에 반영되게 한다.
  - `TaskbarStartButton`과 `TaskbarSearch`는 native button/input contract를 유지하는 닫힌 leaf control로 구현한다.
  - `TaskbarIconButton`은 icon render slot 또는 fallback icon을 수용하면서 `default | open | active` visual state를 분리한다.
  - `TaskbarClock`은 formatter ownership 없이 표시 문자열 두 개만 렌더하는 presentational control로 유지한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/taskbar/taskbar/taskbar.test.tsx src/components/taskbar/taskbarStartButton/taskbarStartButton.test.tsx src/components/taskbar/taskbarSearch/taskbarSearch.test.tsx src/components/taskbar/taskbarIconButton/taskbarIconButton.test.tsx src/components/taskbar/taskbarClock/taskbarClock.test.tsx`
  - [ ] named slot 배치와 leaf control의 native prop pass-through가 frozen test와 일치한다.
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] 이 단계 구현이 app-specific action 이름, open state, portal root를 public contract에 노출하지 않는다.

### Phase 3

- owner_agent: `frontend-developer`
- 목적: start/search overlay shell을 mode-aware public component로 구현해 panel별 canonical mode와 detail/action grammar를 명시적으로 닫는다.
- boundary:
  - `packages/ui/src/components/taskbar/taskbarStartPanel/**`
  - `packages/ui/src/components/taskbar/taskbarSearchPanel/**`
- input: Phase 1 internal primitive, Phase 2 taskbar leaf contract, `plans/windows-monorepo-validation-contracts/plan.md` Phase 1의 output/검증으로 확보한 `pnpm --filter @windows/ui exec tsc --version` validation path, `packages/ui/src/components/taskbar/taskbarStartPanel/taskbarStartPanel.test.tsx`, `packages/ui/src/components/taskbar/taskbarSearchPanel/taskbarSearchPanel.test.tsx`
- output: `TaskbarStartPanel`은 `pinned | all | results` mode별로 각각 search placeholder, heading/view-all, category/section grouping, result list/detail action block을 렌더링한다. `TaskbarSearchPanel`은 `default | results` mode별로 recommended/featured 또는 result list/detail action block을 렌더링한다. 두 panel 모두 `onViewAllClick`, `onCategorySelect`, `onItemSelect`, `onActionSelect`, `onRequestClose` 같은 generic callback만 수용하고, 실제 검색 로직, outside click, focus trap, portal mount, recommendation 계산은 소유하지 않는다.
- 선행조건: Phase 2 완료
- 제약: panel mode는 테스트가 고정한 canonical set만 지원하고, 결과 detail/action object shape를 app-specific handler로 대체하지 않는다.
- side effects: start/search panel이 Phase 1의 `SearchField`, `ContentRow`, `PanelTile`을 재사용하면서 shared grammar가 정리된다.
- failure/validation: `results` mode에서 query/result/detail/action 중 하나라도 다른 sibling shape로 해석되거나 mode 간 markup 차이가 사라지면 이후 export 마감 단계로 진행하지 않는다.
- 작업:
  - `TaskbarStartPanel`을 `pinned | all | results` canonical mode에 맞춰 항목, 섹션, 결과, detail action layout으로 구분해 렌더링한다.
  - `TaskbarSearchPanel`을 `default | results` canonical mode에 맞춰 recommended/featured, result/detail layout을 분리한다.
  - panel 하위 row/tile/detail grammar는 `SearchField`, `ContentRow`, `PanelTile` 같은 이미 고정된 internal primitive만 재사용하고, panel surface/header/section chrome은 각 panel local markup으로 유지한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/taskbar/taskbarStartPanel/taskbarStartPanel.test.tsx src/components/taskbar/taskbarSearchPanel/taskbarSearchPanel.test.tsx`
  - [ ] start/search panel의 mode별 렌더링과 detail action object contract가 frozen test와 일치한다.
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] panel public contract가 generic callback까지만 열리고 실제 검색/오케스트레이션 책임은 바깥에 남는다.

### Phase 4

- owner_agent: `frontend-developer`
- 목적: hover/context compact shell과 최종 root export 경계를 닫아 taskbar public surface를 `@windows/ui` 안에서 완결한다.
- boundary:
  - `packages/ui/src/components/taskbar/taskbarHoverPanel/**`
  - `packages/ui/src/components/taskbar/taskbarContextMenu/**`
  - `packages/ui/src/index.ts`
- input: Phase 1 internal row/tile grammar, Phase 2~3 public shell contract, `plans/windows-monorepo-validation-contracts/plan.md` Phase 1의 output/검증으로 확보한 `pnpm --filter @windows/ui exec tsc --version` validation path, `packages/ui/src/components/taskbar/taskbarHoverPanel/taskbarHoverPanel.test.tsx`, `packages/ui/src/components/taskbar/taskbarContextMenu/taskbarContextMenu.test.tsx`, 현재 비어 있는 `packages/ui/src/index.ts` export surface
- output: `TaskbarHoverPanel`은 title, optional close affordance, preview item thumbnail/caption을 compact preview strip으로 렌더링하고 `onItemSelect`, `onRequestClose` 같은 generic callback만 수용한다. `TaskbarContextMenu`는 `leadingIcon`, `label`, `shortcut`, `disabled`, `destructive`, `selected` visual state를 compact menu row로 렌더링하고 `onActionSelect`만 generic action callback으로 수용한다. context menu row chrome은 이번 plan에서 별도 internal helper로 추출하지 않고 component local markup으로 남긴다. `packages/ui/src/index.ts`는 `Taskbar`, `TaskbarStartButton`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`, `TaskbarStartPanel`, `TaskbarSearchPanel`, `TaskbarHoverPanel`, `TaskbarContextMenu`만 export하고 internal helper는 숨긴다. context positioning, dismiss logic, interactive entry export는 추가되지 않는다.
- 선행조건: Phase 3 완료
- 제약: hover/context는 compact preview/menu shell만 책임지고 cross-route journey, persisted browser state, 실제 close/open orchestration은 소유하지 않는다. `ContextMenuRow`는 이번 plan에서 독립 internal helper로 추출하지 않는다.
- side effects: taskbar public export 표면이 `packages/ui/src/index.ts`에 최종 연결된다.
- failure/validation: root export가 public 9종을 넘거나 internal helper가 root entry로 새어 나오면 이 plan은 완료된 것으로 보지 않는다.
- 작업:
  - `TaskbarHoverPanel`을 title, close affordance, preview item contract를 소화하는 compact preview shell로 구현하고 public callback은 `onItemSelect`, `onRequestClose`까지만 연다.
  - `TaskbarContextMenu`를 action row list와 visual state grammar를 가진 compact menu shell로 구현하고 public callback은 `onActionSelect`까지만 연다. context menu row chrome은 component local markup으로 유지한다.
  - `packages/ui/src/index.ts`에서 public 9종만 export하도록 root surface를 마감한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/taskbar/taskbarHoverPanel/taskbarHoverPanel.test.tsx src/components/taskbar/taskbarContextMenu/taskbarContextMenu.test.tsx`
  - [ ] `pnpm --filter @windows/ui test`
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] `packages/ui/src/index.ts`가 public 9종만 export하고 `ContextMenuRow` 같은 새 internal extraction boundary를 노출하지 않는다.

## 테스트 계획

- `plan-materialize`: `required`
- 보고서: `plans/windows-ui-taskbar-shell/materialize.md` (materialization 후)
- 비고:
  - outcome-selection / boundary-contract / final-interpretation / 로직 boundary의 테스트 여부와 프론트 UI의 bounded-surface E2E 여부는 `plan-materialize`가 로컬 테스트 관례를 보고 결정
  - `architect`는 여기서 테스트 유형 예상이나 후보 spec 구조를 추가로 적지 않는다
  - 실제 테스트 파일은 소스 트리에 생성/수정되며 `plans/`는 durable source of truth가 아니다
