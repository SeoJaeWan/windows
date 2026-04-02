**Branch:** feat/add-taskbar-ui-shell

> Worktree dir: `worktrees/feat-add-taskbar-ui-shell` (`Branch`의 `/`를 `-`로 치환)

# Windows UI Taskbar Shell 실행 계획

> 요청당 plan 파일은 하나만 생성하고, 실행 순서는 아래 `Phase`들로만 표현한다.

## 단계별 실행

### Phase 1

- owner_agent: `frontend-developer`
- 목적: `packages/ui` 안에서 구현할 taskbar shell의 public/internal 경계와 시각 계약을 먼저 고정해 이후 구현이 레퍼런스와 다른 방향으로 흩어지지 않도록 만든다.
- boundary:
    - `packages/ui/src/index.ts`
    - `packages/ui/src/components/taskbar/**`
    - `packages/ui/src/assets/**`
- input:
    - 현재 `@windows/ui` server-safe entry 계약: `packages/ui/src/index.ts`
    - repo-local validation 계약: `packages/ui/package.json`, `packages/ui/tsconfig.json`, `packages/ui/vitest.config.ts`
    - 기본 이미지 asset: repo root `assets/file.png`, `assets/folder.png`
    - 실제 시각 레퍼런스:
        - `https://www.seojaewan.com/`
        - `C:\Users\USER\Desktop\dev\blog\src\components\templates\bottomBar\index.tsx`
        - `C:\Users\USER\Desktop\dev\blog\src\components\templates\windowsPanel\index.tsx`
        - `C:\Users\USER\Desktop\dev\blog\src\components\organisms\searchPanel\index.tsx`
        - `C:\Users\USER\Desktop\dev\blog\src\components\organisms\windowsPinnedSessions\index.tsx`
        - `C:\Users\USER\Desktop\dev\blog\src\components\organisms\allSessions\index.tsx`
        - `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskSearchResult\index.tsx`
        - `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskHoverPanel\index.tsx`
        - `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskLeftClickPanel\index.tsx`
- output:
    - public API 9종의 경계
    - internal `Icon`, `SearchField`, `ContentRow` 경계
    - package-local asset ownership
    - taskbar/start/search/hover/context의 시각 계약 메모가 반영된 구현 기준
    - start/search/hover/context public prop contract
- 선행조건: `none`
- 제약:
    - 이번 plan은 `packages/ui`만 수정하고 `apps/web`, `packages/ui/src/interactive/**`는 건드리지 않는다.
    - 모든 컴포넌트는 server-safe presentational component로 유지하고 `next/*`, 앱 전용 hook/store, portal positioning, open/close state를 포함하지 않는다.
    - public export는 `Taskbar`, `TaskbarStartButton`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`, `TaskbarStartPanel`, `TaskbarSearchPanel`, `TaskbarHoverPanel`, `TaskbarContextMenu`로 제한한다.
    - `PanelSurface`, `PanelHeader`, `PanelSection`, `PanelTile`, `ContextMenuRow` 같은 하위 조각은 public으로 노출하지 않는다.
    - panel/overlay public contract는 data-only server-safe props로 고정하고, callback을 받는 interactive wrapper는 future `@windows/ui/interactive` scope로 미룬다.
- 작업:
    - 실제 사이트 기준으로 닫힌 taskbar 시각 계약을 고정한다.
      하단 전체 폭의 밝은 반투명 바 위에 `시작 버튼 + 좁은 검색 pill + 폴더 아이콘 4개 + 우측 2줄 시계/날짜`가 배치되고, 아이콘 군은 중앙 정렬, 시계는 우측 끝에 남긴다.
    - 실제 사이트 기준으로 start/search panel 시각 계약을 고정한다.
      start panel은 taskbar 바로 위 중앙의 큰 밝은 카드, 상단 rounded search field, `고정됨` 헤더와 작은 `모두` 버튼, sparse tile grid를 가진다.
      search panel은 더 넓은 밝은 카드로 왼쪽 추천 리스트와 오른쪽 featured card grid를 기본 상태로 가진다.
    - local blog 기준으로 mode별 fallback visual grammar를 고정한다.
      `TaskbarStartPanel`은 `pinned | all | results`, `TaskbarSearchPanel`은 `default | results`를 지원하며, `all`은 카테고리/리스트형, `results`는 좌측 목록과 우측 detail/action block을 가진다.
    - local blog 기준으로 hover/context visual grammar를 고정한다.
      hover panel은 아이콘 위로 뜨는 compact preview strip, context menu는 좁은 light menu에 `leading icon + label` row를 가지는 형태로 제한한다.
    - root asset 직접 참조가 남지 않도록 `file.png`, `folder.png`를 `packages/ui` 내부 asset contract로 흡수하고, `Icon`은 `src` 우선 또는 `kind: 'file' | 'folder'` 규칙으로 고정한다.
    - `TaskbarStartPanel` public prop contract를 `mode` discriminated union으로 고정한다.
      `mode: 'pinned'`는 `searchPlaceholder?`, `heading?`, `viewAllLabel?`, `pinnedItems`를 받고, 각 pinned item은 `id`, `label`, `icon`, `description?`를 가진다.
      `mode: 'all'`은 `searchPlaceholder?`, `categories`, `sections`를 받고, 각 category는 `id`, `label`, `active?`, 각 section은 `id`, `label`, `items`를 가진다.
      `mode: 'results'`는 `query`, `resultItems`, `detail`을 받고, 각 result item은 `id`, `label`, `meta?`, `icon?`, `active?`, `detail`은 `title`, `description?`, `metadata?`, `actions?`를 가진다.
    - `TaskbarSearchPanel` public prop contract를 `mode` discriminated union으로 고정한다.
      `mode: 'default'`는 `searchPlaceholder?`, `recommendedItems`, `featuredItems`를 받고, recommended item은 `id`, `label`, `meta?`, `icon?`, featured item은 `id`, `label`, `description?`, `thumbnailSrc?`, `thumbnailAlt?`를 가진다.
      `mode: 'results'`는 `query`, `resultItems`, `detail`을 받고, result/detail item shape는 start panel의 `results` 모드와 동일한 grammar를 따른다.
    - `TaskbarHoverPanel`과 `TaskbarContextMenu` contract를 server-safe data-only로 고정한다.
      `TaskbarHoverPanel`은 `title?`, `showCloseAffordance?`, `items`를 받고, item은 `id`, `label`, `thumbnailSrc?`, `thumbnailAlt?`, `caption?`를 가진다.
      `TaskbarContextMenu`는 `items`를 받고, action item은 `id`, `label`, `leadingIcon?`, `shortcut?`, `disabled?`, `destructive?`, `selected?`를 가진다.
      close/select affordance는 시각 계약으로만 표현하고 callback은 이번 plan의 public root export에 포함하지 않는다.
- 검증:
    - [ ] public API 9종과 internal 3종이 `packages/ui` 경계 안에서 일관되게 설명되고, 추가 public primitive 없이 Phase 2~4가 진행 가능하다.
    - [ ] panel/overlay public prop contract가 data-only server-safe 규칙으로 닫혀 있어 `plan-materialize`가 mode별 fixture를 도출할 수 있다.
    - [ ] 실제 사이트와 local blog에서 가져온 시각 기준이 phase input/작업에 드러나 있어 구현자가 목표 UI를 추정하지 않고도 작업할 수 있다.

### Phase 2

- owner_agent: `frontend-developer`
- 목적: shared visual internals와 닫힌 taskbar shell을 구현해 실제 사이트의 하단 bar 인상을 `packages/ui` 단독 컴포넌트로 재현한다.
- boundary:
    - `packages/ui/src/components/taskbar/internal/icon/**`
    - `packages/ui/src/components/taskbar/internal/searchField/**`
    - `packages/ui/src/components/taskbar/internal/contentRow/**`
    - `packages/ui/src/components/taskbar/taskbar/**`
    - `packages/ui/src/components/taskbar/taskbarStartButton/**`
    - `packages/ui/src/components/taskbar/taskbarSearch/**`
    - `packages/ui/src/components/taskbar/taskbarIconButton/**`
    - `packages/ui/src/components/taskbar/taskbarClock/**`
    - `packages/ui/src/assets/**`
    - `packages/ui/src/index.ts`
- input:
    - Phase 1의 public/internal 경계와 시각 계약
    - package-local `file`/`folder` asset 계약
- output:
    - `Icon`
    - `SearchField`
    - `ContentRow`
    - `Taskbar`
    - `TaskbarStartButton`
    - `TaskbarSearch`
    - `TaskbarIconButton`
    - `TaskbarClock`
- 선행조건:
    - Phase 1 완료
- 제약:
    - `Icon`은 `src` 또는 `kind`만 책임지고 크기는 `className`으로만 제어한다.
    - `TaskbarIconButton`은 하단 status line까지 내부에서 책임지며, panel tile/button과의 공통 public abstraction을 만들지 않는다.
    - `TaskbarSearch`는 taskbar 안의 닫힌 검색 영역만 표현하고 검색 panel state는 포함하지 않는다.
- 작업:
    - `Icon`, `SearchField`, `ContentRow`를 공통 내부 구현으로 만든다.
      `SearchField`는 사이트의 rounded white input grammar를 따르고, `ContentRow`는 search/context 계열의 `leading icon + text` row grammar를 수용한다.
    - `Taskbar`를 전체 폭 하단 surface로 구현한다.
      사이트처럼 밝은 유리질 background, 얇은 상단 경계, 중앙 cluster, 우측 시계 영역을 포함하되 floating dock가 아니라 full-width shell로 유지한다.
    - `TaskbarStartButton`, `TaskbarSearch`, `TaskbarClock`를 사이트의 닫힌 상태 UI와 맞춘다.
      시작 버튼은 정사각형 심볼 버튼, 검색 영역은 짧은 pill과 placeholder, 시계는 시간/날짜 2줄 right-aligned layout로 구현한다.
    - `TaskbarIconButton`을 이미지 아이콘 기반 버튼으로 구현한다.
      사이트처럼 작은 정사각 hover chrome과 하단 상태선을 가지며 `default | open | active`를 시각적으로 구분한다.
- 검증:
    - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
    - [ ] `pnpm --filter @windows/ui test`
    - [ ] core shell source가 `next/*` import 없이 server-safe entry 계약을 지킨다.

### Phase 3

- owner_agent: `frontend-developer`
- 목적: start/search의 큰 overlay panel 2종을 mode-aware visual shell로 구현해 실제 사이트와 local blog의 시각 구조를 `packages/ui`에서 재사용 가능하게 만든다.
- boundary:
    - `packages/ui/src/components/taskbar/taskbarStartPanel/**`
    - `packages/ui/src/components/taskbar/taskbarSearchPanel/**`
    - `packages/ui/src/index.ts`
- input:
    - Phase 1의 start/search visual contract
    - Phase 1의 start/search public prop contract
    - Phase 2의 `Icon`, `SearchField`, `ContentRow`, core taskbar grammar
- output:
    - `TaskbarStartPanel`
    - `TaskbarSearchPanel`
    - panel 하위 row/tile/detail 구현을 숨긴 package surface
- 선행조건:
    - Phase 2 완료
- 제약:
    - `TaskbarStartPanel`은 `pinned | all | results`, `TaskbarSearchPanel`은 `default | results`만 public mode로 노출한다.
    - panel 하위 tile, section, detail action, row card는 local implementation detail로 유지한다.
    - panel은 visual shell만 책임지고 outside click, focus management, 실제 검색, 실제 추천 데이터 계산은 포함하지 않는다.
    - panel public props는 Phase 1에서 고정한 data-only discriminated union을 따르며 function prop이나 app event handler를 포함하지 않는다.
- 작업:
    - `TaskbarStartPanel`을 실제 사이트 중심으로 구현한다.
      기본 `pinned` 모드는 중앙 큰 밝은 카드, 상단 rounded search field, `고정됨` 제목, 우측 작은 `모두` 버튼, file icon 중심의 sparse tile grid를 가진다.
      `all` 모드는 local blog의 카테고리 전환과 grouped list grammar를 따른다.
      `results` 모드는 local blog의 좌측 result list와 우측 action/detail block grammar를 따른다.
      mode별로 Phase 1에서 고정한 `pinnedItems`, `categories + sections`, `query + resultItems + detail` contract를 그대로 소비한다.
    - `TaskbarSearchPanel`을 실제 사이트 중심으로 구현한다.
      `default` 모드는 좌측 추천 세로 리스트와 우측 featured card grid를 가지는 넓은 panel로 구성한다.
      `results` 모드는 local blog의 search result split layout을 따라 좌측 match list, 우측 detail/action shell을 가진다.
      mode별로 Phase 1에서 고정한 `recommendedItems + featuredItems`, `query + resultItems + detail` contract를 그대로 소비한다.
    - start/search panel 내부에서 `Icon`, `SearchField`, `ContentRow`를 재사용하되, 공통으로 보이는 section wrapper를 별도 public primitive로 추출하지 않는다.
- 검증:
    - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
    - [ ] `pnpm --filter @windows/ui test`
    - [ ] mode별 public prop contract가 discriminated union으로 유지되고 function prop 없이 렌더링 가능하다.
    - [ ] `TaskbarStartPanel`과 `TaskbarSearchPanel`만 export되고 내부 tile/row/detail 조각은 외부로 새어 나오지 않는다.

### Phase 4

- owner_agent: `frontend-developer`
- 목적: hover/context overlay를 local blog 레퍼런스 기반의 compact shell로 구현하고 최종 export surface와 검증을 닫는다.
- boundary:
    - `packages/ui/src/components/taskbar/taskbarHoverPanel/**`
    - `packages/ui/src/components/taskbar/taskbarContextMenu/**`
    - `packages/ui/src/index.ts`
- input:
    - Phase 1의 hover/context visual contract
    - Phase 1의 hover/context public prop contract
    - Phase 2의 `Icon`, `ContentRow`, `TaskbarIconButton`
    - local blog hover/context 레퍼런스:
        - `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskHoverPanel\index.tsx`
        - `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskLeftClickPanel\index.tsx`
        - `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskSearchLeftPanel\index.tsx`
- output:
    - `TaskbarHoverPanel`
    - `TaskbarContextMenu`
    - 최종 `@windows/ui` taskbar public export 정리
- 선행조건:
    - Phase 2 완료
- 제약:
    - `TaskbarHoverPanel`은 `title?`, `showCloseAffordance?`, preview item array만 받고 실제 hover delay, close state, select handler는 포함하지 않는다.
    - `TaskbarContextMenu`는 data-only action item array만 받고 실제 context positioning 계산, dismiss logic, click handler는 포함하지 않는다.
    - 두 패널 모두 compact light shell이어야 하며, start/search panel과 같은 큰 surface grammar를 복제하지 않는다.
    - close/select affordance는 시각적 chrome까지만 책임지고, callback이 필요한 interactive wrapper는 이번 plan 범위 밖으로 둔다.
- 작업:
    - `TaskbarHoverPanel`을 local blog의 preview strip grammar로 구현한다.
      아이콘 위에 뜨는 얕은 밝은 panel, 상단 title row와 우측 close affordance, 하단 preview card/thumbnail 영역을 포함한다.
      Phase 1에서 고정한 `items` contract만으로 title row와 preview strip이 재현되도록 만든다.
    - `TaskbarContextMenu`를 local blog의 left-click/context family grammar로 구현한다.
      좁은 밝은 메뉴에 `leading icon + label` row가 수직으로 쌓이는 구조로 만들고, 이미지 아이콘과 vector icon을 모두 받을 수 있게 한다.
      action item의 `shortcut`, `disabled`, `destructive`, `selected` 시각 상태는 data-only props로만 표현한다.
    - `packages/ui/src/index.ts` export surface를 최종 정리한다.
      public 9종만 노출하고 internal `Icon`, `SearchField`, `ContentRow`와 panel 하위 조각은 숨긴다.
- 검증:
    - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
    - [ ] `pnpm --filter @windows/ui test`
    - [ ] hover/context public prop contract가 callback 없이도 preview/menu visual shell을 완성할 수 있다.
    - [ ] 최종 export가 public 9종으로 닫히고 internal helper 및 하위 조각은 export되지 않는다.

## 테스트 계획

- `plan-materialize`: `required`
- 보고서: `plans/windows-ui-taskbar-shell/materialize.md` (materialization 후)
- 비고:
    - `packages/ui` 안의 taskbar shell은 visual-only scope이지만 component rendering, mode contract, export boundary를 포함하므로 `plan-materialize`가 source-tree test 범위를 결정한다.
