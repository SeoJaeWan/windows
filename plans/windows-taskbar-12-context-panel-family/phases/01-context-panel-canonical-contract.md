# Phase 1. ContextPanel canonical contract 정리

> 이 문서는 `ContextPanel` leaf의 public contract와 canonical story owner를 executable detail로 닫는다.
> controller는 아래 digest만 읽어도 이 phase가 어디서 멈추고 무엇이 끝나야 하는지 판단할 수 있다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | `ContextPanel`를 `items[]` + optional `onAction(id)`만 여는 200px action-list leaf로 만들고, icon/description/disabled winner rule을 standalone story owner에서 먼저 닫는다. |
| 선행조건 | `none` |
| 완료 판단 | `packages/ui/src/components/panels/context/**`만 읽어도 public props, non-visible description rule, no-icon no-slot rule, disabled row rule, canonical story inventory를 이해할 수 있다. |
| 중단 조건 | `description`을 second line visible copy로 올려야 한다거나, iconless row에도 blank slot을 강제해야 한다거나, v1에 `danger`/`dividerBefore`/positioning behavior를 같이 넣어야 한다는 새 요구가 생기면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/context/contextPanel/index.tsx` | 추가 | public props는 `items`, optional `onAction`, 기존 panel 관례의 native `div` pass-through만 열고, row item shape는 `id`, `label`, optional `description`, optional `icon`, optional `disabled`로 고정한다. | row render가 `icon` 유무, `description` metadata, `disabled` 상태를 exact field winner로 해석한다. |
| `packages/ui/src/components/panels/context/contextPanel/contextPanel.stories.tsx` | 추가 | canonical story는 `ContextPanel` contract만 보여 준다. host-specific label winner나 provider behavior를 끌어오지 않는다. | `default`, `iconless`, `disabled` standalone story와 canonical compare story가 분리돼 있다. |
| `packages/ui/src/components/panels/context/storybook/contextPanelReferenceFixtures.ts` | 추가 | canonical story inventory와 compare inventory를 한 파일에서 분리해 적고, supporting-only sample이 있으면 state로 승격하지 않는다. | fixture source에 canonical state와 supporting sample의 역할 구분이 드러난다. |
| `packages/ui/src/components/panels/context/storybook/compareContextPanelStage.tsx` | 추가 | compare surface는 `[data-visual-root]`만 owner로 가지는 minimal wrapper다. decorative backdrop, width override, host frame을 넣지 않는다. | canonical compare story가 host decoration 없이 capture 가능하다. |

### 완료 증거

- `ContextPanel` source에 `items`, `onAction`, `description`, `icon`, `disabled`, `200px`가 같은 boundary에서 보인다.
- canonical story owner와 fixture owner가 같은 state inventory를 설명하고, host composition story 제목은 Phase 1 source에 나오지 않는다.
- `ContextPanel` compare story가 `[data-visual-root][data-visual-kind="context-panel"]` recipient로 닫힌다.

- owner_agent: `frontend-developer`
- 목적: 새 family의 최소 public contract를 host-agnostic leaf로 먼저 고정해 later materialize가 prop 이름, row winner rule, default shell meaning을 추측하지 않게 한다.
- boundary:
  - primary write target: `packages/ui/src/components/panels/context/contextPanel/index.tsx`
  - primary write target: `packages/ui/src/components/panels/context/contextPanel/contextPanel.stories.tsx`
  - primary write target: `packages/ui/src/components/panels/context/storybook/contextPanelReferenceFixtures.ts`
  - primary write target: `packages/ui/src/components/panels/context/storybook/compareContextPanelStage.tsx`
  - execution contract reference: `packages/ui/package.json`
  - read-only reference: `C:\Users\USER\Desktop\dev\blog\src\components\atoms\leftClickPanel/index.tsx`
  - read-only reference: `C:\Users\USER\Desktop\dev\blog\src\components\atoms\leftPanelButton/index.tsx`
  - read-only reference: `plans/windows-taskbar-04-attached-surfaces/phases/02-context-menu-topology.md`
- input:
  - 시나리오: maintainer가 `packages/ui` 안에 standalone visual action-list leaf를 도입하되, host runtime behavior 없이도 menu shell grammar와 minimum prop surface를 고정하려는 경우
  - 현재 상태:
    - `packages/ui/src/components/panels/**` 아래에는 reusable context panel family가 없다.
    - action-list visual grammar는 `PanelSearchResultsView` preview action buttons와 blog left panel 구현에 분산돼 있다.
    - task04의 `taskbarContextMenu`는 taskbar-only fixed-row topology reference일 뿐, reusable public contract가 아니다.
- output:
  - 공개 계약:
    - `ContextPanel` public props는 `items: ContextPanelItem[]`, optional `onAction(id: string)`, 기존 panel 관례의 native `div` props pass-through다.
    - `ContextPanelItem`은 exact field `id`, `label`, optional `description`, optional `icon: ReactNode`, optional `disabled`만 연다.
    - root width는 200px 고정이다.
    - 각 row는 actionable button recipient를 가지며 `label`을 visible single-line text로 렌더링한다.
    - `description`은 row button `title` recipient로만 해석되고 second-line text나 extra row height를 만들지 않는다.
    - `icon`이 있으면 leading visual slot을 렌더링하고, 없으면 blank slot 없이 text block이 바로 시작한다.
    - `disabled === true`면 row는 visible disabled style을 가지며 `onAction` losing path는 no-op다.
  - 내부 기본값:
    - divider, danger color, submenu arrow, footer slot, header slot, empty-state copy는 v1에서 열지 않는다.
    - row padding, radius, hover background, shadow, border, vertical gap은 package-owned visual grammar로 둔다.
  - 중요한 negative output:
    - right-click detection, positioning, provider/store, open/close orchestration, click-away, keyboard handling은 이 phase output이 아니다.
    - taskbar fixed row ids `pin-taskbar`, `close-all` 같은 host-specific topology는 public contract가 아니다.
    - `description`이 visible second line이나 persistent helper text recipient로 승격되면 안 된다.
- 선행조건: `none`
- 제약:
  - `ContextPanel`는 canonical leaf owner다. Windows/Search host wording이나 state winner rule을 먼저 흡수하지 않는다.
  - source-tree test 생성은 이 phase 범위가 아니며 later `plan-materialize`가 맡는다.
- side effects:
  - 새 family folder `packages/ui/src/components/panels/context/**`가 생긴다.
  - compare kind `context-panel` recipient를 local story owner가 먼저 닫는다.
- failure/validation: public prop shape가 `items[]` 대신 host-specific `actions`, `pinState`, `variant` 같은 sibling contract로 넓어지거나, `description` visible line이 생기거나, iconless row가 blank slot을 유지하면 later materialize가 winner rule과 layout meaning을 추측해야 하므로 blocker다.
- 작업:
  - `ContextPanel` component와 item type을 same boundary에서 정의한다.
  - root container width를 200px로 고정하고 action-list only shell grammar를 구현한다.
  - row render path에서 `icon`, `description`, `disabled`의 exact interpretation을 닫는다.
  - canonical fixture file에서 standalone story state와 compare state를 분리한다.
  - local compare stage를 추가해 canonical compare owner를 host decoration 없이 capture 가능하게 만든다.
- 검증:
  - [ ] `rg -n "items|onAction|description|icon|disabled|200" ".\\packages\\ui\\src\\components\\panels\\context"` 결과로 public prop surface와 width contract가 source에 드러나야 한다.
  - [ ] `rg -n "title=|data-visual-kind=\\\"context-panel\\\"|default|iconless|disabled" ".\\packages\\ui\\src\\components\\panels\\context"` 결과로 non-visible description recipient, canonical story state, compare recipient가 함께 보여야 한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 통과해 standalone story owner가 package Storybook 경계에서 green이어야 한다.
  - [ ] `pnpm --filter @windows/ui test`가 통과해 phase-local source 추가가 기존 package test 경계를 깨지 않아야 한다.
