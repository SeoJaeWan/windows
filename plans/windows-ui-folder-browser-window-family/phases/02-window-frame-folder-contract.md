# Phase 2. WindowFrame과 Folder 계약 정리

> 이 문서는 internal `WindowFrame` foundation과 `Folder` canonical public surface를 닫는 실행용 상세 계약이다.
> shared foundation을 먼저 만들되, 같은 phase 안에서 `Folder`가 그 foundation을 실제로 소비하도록 범위를 묶어 validation을 self-sufficient하게 유지한다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | internal `WindowFrame`와 data-driven `Folder` public contract를 package source에서 singular surface로 고정한다. |
| 선행조건 | Phase 1의 baseline inventory key와 provenance가 frozen돼 있어야 한다. |
| 완료 판단 | `Folder` source와 story만 읽어도 window-only 범위, `items.imageSrc`, `sidebarItems` shape, `activeSidebarId` winner rule, internal `WindowFrame` boundary가 분명하다. |
| 중단 조건 | `Folder`가 route-aware props, taskbar/background, drag/resize state, public `WindowFrame` export를 필요로 한다는 새 정책이 생기면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 추가 | title, optional icon, `addressLabel`, fixed window control affordance는 shared frame owner가 소유하고 external export로 새면 안 된다. | `Folder`와 이후 `Browser`가 같은 internal frame contract를 literal하게 소비할 수 있다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 추가 | `Folder` v1 public surface는 pure props 기반이며 `sidebarItems`, `activeSidebarId`, `items` winner contract를 명시적으로 가진다. | desktop sidebar, mobile collapse, viewport height, content-only scroll, sidebar selected row winner rule이 component source에 고정된다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts` | 추가 | canonical inventory는 `desktop-default`, `mobile-collapsed` 두 state만 가지며 sidebar winner case를 sample data로 드러내야 한다. | sidebar item sample과 selected winner case가 story/compare owner가 다시 쓰기 쉬운 source로 남는다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx` | 추가 | component 바깥 desktop backdrop은 story-only decoration이고 component contract가 아니다. | desktop/mobile human-review stage가 component API와 분리된다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx` | 추가 | route 이름이나 page wrapper를 public contract처럼 보이게 하면 안 된다. | `Folder` standalone story가 canonical 2 state와 sidebar selected winner를 pure props로 보여 준다. |

### 완료 증거

- `Folder` canonical story가 `desktop-default`, `mobile-collapsed` 두 state를 route-agnostic props로 렌더링한다.
- `WindowFrame`가 package root나 story title에서 public component처럼 노출되지 않는다.
- `sidebarItems` shape와 `activeSidebarId` winner rule이 fixture와 component 양쪽에서 한 가지 surface로만 등장한다.

- owner_agent: `frontend-developer`
- 목적:
  - internal shared frame와 첫 leaf contract를 동시에 닫아 later Browser phase가 foundation semantics를 추측하지 않게 한다.
- boundary:
  - primary write target: `packages/ui/src/components/windows/internal/windowFrame/index.tsx`
  - primary write target: `packages/ui/src/components/windows/folder/index.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts`
  - primary write target: `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`
  - primary write target: `packages/ui/src/components/windows/folder/folder.stories.tsx`
  - read-only reference: `packages/ui/src/components/common/iconImage/index.tsx`
  - read-only reference: `packages/ui/src/components/panels/shared/panelSurface/index.tsx`
  - read-only prerequisite: `plans/windows-ui-folder-browser-window-family/reference-captures/baseline-inventory.md`
- input:
  - 시나리오: consumer가 server-safe entrypoint compatible window leaf를 만들기 위해 `Folder`에 pure data props만 전달하는 경우
  - required public inputs:
    - `title`
    - `addressLabel`
    - `sidebarItems`
    - `items`
  - optional public inputs:
    - `icon`
    - `activeSidebarId`
    - native `div` pass-through (`className` 포함)
  - fixed `Folder` sidebar item shape:
    - `id`
    - `label`
    - optional `icon: ReactNode`
  - fixed `Folder` body item shape:
    - `id`
    - `label`
    - `imageSrc`
  - winner rule:
    - `sidebarItems`는 non-empty unique `id` array다.
    - `activeSidebarId`가 unique item `id`와 일치하면 그 row만 selected winner다.
    - `activeSidebarId`가 없거나 일치 항목이 없으면 `sidebarItems[0]`가 selected winner다.
    - selected winner 외의 row는 모두 unselected row다.
  - expected responsive behavior:
    - desktop에서는 sidebar가 visible
    - mobile에서는 sidebar가 접히고 content 영역만 스크롤
- output:
  - 공개 계약:
    - `Folder`는 fixed chrome + data-driven body를 가진 public component다.
    - `Folder`는 taskbar, outer desktop background, route semantics를 요구하지 않는다.
    - `Folder` body는 `items.imageSrc`를 `IconImage` 계열 render owner로 사용한다.
    - `Folder` sidebar는 caller-owned `sidebarItems`와 `activeSidebarId`로 selected row를 결정한다.
  - 내부 기본값:
    - `WindowFrame`는 title row, address bar, window control affordance를 fixed rendering으로 소유한다.
    - `viewMode`와 drag/resize affordance는 v1 public surface에 넣지 않는다.
  - 중요한 negative output:
    - `WindowFrame`는 public export가 아니다.
    - `Folder`는 route-aware props, taskbar injection, separate mobile component, children-driven body를 요구하지 않는다.
    - sidebar collapse는 visual layout policy이며 open/close state orchestration을 포함하지 않는다.
    - sidebar selected row를 label text나 local index에서 추론하면 안 된다.
- 제약:
  - server-safe entrypoint에 later export될 수 있어야 하므로 framework-specific API를 섞지 않는다.
  - body scroll은 content 영역에서만 일어나고 window 전체 스크롤을 만들지 않는다.
- side effects:
  - 새 `windows` component family의 directory topology가 생긴다.
  - `Browser`가 그대로 재사용할 internal frame contract가 생긴다.
- failure/validation: `Folder` contract가 `urlLabel`처럼 route 의미가 강한 naming, second media field, public window-control props, route-specific body slot으로 다시 열리거나, `sidebarItems` winner rule을 구현자가 local heuristic으로 정해야 하면 blocker다.
- 작업:
  - `WindowFrame` internal contract를 정의한다.
  - `Folder` public props와 fixed render grammar를 정의한다.
  - `sidebarItems` minimum shape와 `activeSidebarId` winner rule을 명시한다.
  - desktop/mobile canonical state fixture를 고정한다.
  - review stage와 standalone stories를 추가해 contract를 visible하게 만든다.
- 검증:
  - [ ] `pnpm --filter @windows/ui build-storybook`가 `Folder` stories를 포함해 성공해야 한다.
  - [ ] `Folder` stories에 `desktop-default`, `mobile-collapsed`가 존재해야 한다.
  - [ ] package root export 또는 story title에서 `WindowFrame`가 public surface처럼 드러나지 않아야 한다.
  - [ ] `Folder` fixture/source에 `sidebarItems` shape와 `activeSidebarId` winner rule이 literal하게 드러나야 한다.
