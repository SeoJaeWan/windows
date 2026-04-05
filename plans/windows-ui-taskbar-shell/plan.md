**Branch:** feat/windows-ui-taskbar-shell

> Worktree dir: `worktrees/windows-ui-taskbar-shell` (plan 폴더명과 동일)

# Windows UI Taskbar Shell 실행 계획

> 요청당 plan 파일은 하나만 생성하고, 실행 순서는 아래 `Phase`들로만 표현한다.

## 단계별 실행

### Phase 1

- owner_agent: `frontend-developer`
- 목적: `@windows/ui` 안에서 구현할 taskbar 계열 컴포넌트의 public/internal 경계와 prop grammar를 먼저 고정해 이후 구현이 `data-only` 제약에 묶이지 않으면서도 app-specific 로직 없이 재사용 가능한 presentational shell로 닫히게 만든다.
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
        - `C:\Users\sjw73\Desktop\dev\blog\src\components\templates\bottomBar\index.tsx`
        - `C:\Users\sjw73\Desktop\dev\blog\src\components\templates\windowsPanel\index.tsx`
        - `C:\Users\sjw73\Desktop\dev\blog\src\components\organisms\searchPanel\index.tsx`
        - `C:\Users\sjw73\Desktop\dev\blog\src\components\organisms\windowsPinnedSessions\index.tsx`
        - `C:\Users\sjw73\Desktop\dev\blog\src\components\organisms\allSessions\index.tsx`
        - `C:\Users\sjw73\Desktop\dev\blog\src\components\molecules\taskSearchResult\index.tsx`
        - `C:\Users\sjw73\Desktop\dev\blog\src\components\molecules\taskHoverPanel\index.tsx`
        - `C:\Users\sjw73\Desktop\dev\blog\src\components\molecules\taskLeftClickPanel\index.tsx`
        - `C:\Users\sjw73\Desktop\dev\blog\src\components\molecules\taskSearchLeftPanel\index.tsx`
- output:
    - public API 9종의 역할과 export 경계
    - internal `Icon`, `SearchField`, `ContentRow` 경계
    - 재사용 시 추출할 internal panel primitive 경계(`PanelSurface`, `PanelHeader`, `PanelSection`, `PanelTile`, `ContextMenuRow`)
    - `Taskbar` 조합 방식과 leaf/panel prop grammar
    - package-local asset ownership
    - taskbar/start/search/hover/context의 시각 및 스타일 계약 메모가 반영된 구현 기준
- 선행조건: `none`
- 제약:
    - 이번 plan은 `packages/ui`만 수정하고 `apps/web`, `packages/ui/src/interactive/**`는 건드리지 않는다.
    - 모든 public 컴포넌트는 app-agnostic presentational shell로 유지하고 `next/*`, 앱 전용 hook/store, portal positioning, open/close state orchestration, 도메인 전용 action 함수를 포함하지 않는다.
    - `data-only`만을 강제하지 않고, leaf/panel에서 재사용 가능한 `ReactNode` render slot과 optional generic event callback을 허용한다.
    - 허용하는 callback은 DOM/native event 또는 generic intent 수준(`onClick`, `onChange`, `onRequestClose`, `onItemSelect`, `onActionSelect`)으로 제한하고 `createFile`, `pinToTaskbar`, `openSearchPanel` 같은 app-specific action 이름은 public contract에 넣지 않는다.
    - 스타일 참조는 `https://www.seojaewan.com/`을 우선 기준으로 삼고, local `blog` 레퍼런스는 mode별 fallback shell과 세부 row/tile/panel grammar를 보강하는 보조 기준으로 사용한다.
    - public export는 `Taskbar`, `TaskbarStartButton`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`, `TaskbarStartPanel`, `TaskbarSearchPanel`, `TaskbarHoverPanel`, `TaskbarContextMenu`로 제한한다.
    - `PanelSurface`, `PanelHeader`, `PanelSection`, `PanelTile`, `ContextMenuRow` 같은 하위 조각은 public으로 노출하지 않는다.
    - 같은 visual grammar가 두 개 이상의 public surface에서 반복되면 internal component로 추출하고, 그 순간부터는 상위 panel test에만 의존하지 않고 해당 internal boundary도 unit test 대상으로 본다.
- 작업:
    - `Taskbar`의 public composition grammar를 고정한다.
      `Taskbar`는 full-width 하단 shell layout만 책임지고 `startButton`, `search`, `items`, `clock` 같은 named slot 또는 동등한 명시적 조합 props로 child 영역을 배치한다.
      item mapping, panel mount, portal root, open state 결정은 소유하지 않는다.
    - leaf component의 public prop grammar를 고정한다.
      `TaskbarStartButton`, `TaskbarIconButton`은 native button/ARIA prop pass-through를 허용하고, `TaskbarSearch`는 input-like control로서 `placeholder`, `value`, `readOnly`, `onChange`, `onClick` 같은 generic prop을 허용한다.
      `TaskbarClock`는 `timeLabel`, `dateLabel` 두 개의 display string과 container-level HTML prop만 책임진다.
      시간대 계산, 현재 시각 interval, formatter 함수, `Date`/`dayjs` 객체 입력은 public contract에 포함하지 않는다.
    - icon grammar를 고정한다.
      internal `Icon`은 package-local asset을 소비하는 `src` 우선 또는 `kind: 'file' | 'folder'` fallback을 책임진다.
      public leaf/button/item contract는 `icon` render slot을 기본으로 허용하되, 이미지 기반 consumer를 위해 `iconSrc`, `iconAlt`, `iconKind` 계열 fallback grammar를 함께 열 수 있게 닫는다.
    - panel component의 public prop grammar를 고정한다.
      `TaskbarStartPanel`은 `pinned | all | results`, `TaskbarSearchPanel`은 `default | results` mode를 유지하되, item/action 데이터와 함께 optional generic callback(`onViewAllClick`, `onCategorySelect`, `onItemSelect`, `onActionSelect`, `onRequestClose`)을 허용한다.
      `TaskbarHoverPanel`, `TaskbarContextMenu`도 item/action list와 generic callback만 받고 실제 hover delay, dismiss logic, context positioning 계산은 소유하지 않는다.
    - internal extraction policy를 고정한다.
      `PanelSurface`, `PanelHeader`, `PanelSection`, `PanelTile`, `ContextMenuRow`는 public primitive로 노출하지 않지만, 둘 이상의 taskbar surface가 동일한 shell grammar를 공유하면 internal component로 추출한다.
      단순 wrapper 수준이면 추출하지 않고, variant/slot/spacing grammar를 실제로 공유할 때만 추출한다.
    - action/item shape를 공통 grammar로 정리한다.
      panel detail/action block과 context menu가 공통으로 소비할 수 있도록 action item은 `id`, `label`, `leadingIcon?`, `shortcut?`, `disabled?`, `destructive?`, `selected?`를 기준으로 닫고, callback은 item 내부 필드가 아니라 component-level generic handler로 받는다.
    - tile visual family를 고정한다.
      panel 안에서 반복되는 아이콘+라벨 중심 타일은 internal `PanelTile` candidate로 본다.
      `PanelTile` internal contract는 `variant: 'framed' | 'compact'`, `label`, `graphic?`, `description?`, `selected?`, native button prop, generic `onClick`, `onContextMenu`를 기준으로 닫는다.
      큰 framed tile variant는 둥근 외곽선/여백/상단 media 영역/하단 truncated label을 가지는 카드형 shell로, 작은 compact tile variant는 상단 아이콘과 2줄 이내 centered label을 가지는 간결한 shell로 정의한다.
      동일 tile family가 start/search/preview 등 2개 이상 surface에서 재사용되면 하나의 internal component와 variant prop으로 통합한다.
    - 실제 사이트와 local blog를 기준으로 시각 및 스타일 계약을 고정한다.
      닫힌 taskbar는 하단 전체 폭의 밝은 반투명 바, 시작 버튼, 좁은 검색 pill, 폴더 아이콘 4개, 우측 2줄 시계/날짜를 가진다.
      start/search panel은 큰 밝은 카드형 shell, hover는 compact preview strip, context는 좁은 light menu grammar를 유지한다.
      blur, border alpha, radius, shadow, spacing, hover chrome, typography weight 같은 스타일 문법은 라이브 사이트를 우선 참조하고, local `blog`는 `all/results` 모드와 detail/action row, preview/menu의 스타일 fallback을 보강하는 기준으로 기록한다.
- 검증:
    - [ ] public API 9종과 internal 3종이 `packages/ui` 경계 안에서 일관되게 설명되고 추가 public primitive 없이 Phase 2~4가 진행 가능하다.
    - [ ] leaf/panel contract가 `store/hook-free`, `app-agnostic`, `optional event/render slot 허용` 규칙으로 닫혀 있어 구현자가 callback 허용 범위를 추정하지 않아도 된다.
    - [ ] 실제 사이트와 local blog에서 가져온 시각/스타일 기준과 prop grammar가 phase input/작업에 드러나 있어 구현자가 목표 UI와 허용 props를 동시에 추정하지 않고도 작업할 수 있다.

### Phase 2

- owner_agent: `frontend-developer`
- 목적: shared visual internals와 닫힌 taskbar shell을 구현해 실제 사이트의 하단 bar 인상을 `packages/ui` 단독 컴포넌트로 재현하면서 leaf component가 native DOM props와 render slot을 소화할 수 있게 만든다.
- boundary:
    - `packages/ui/src/components/taskbar/internal/icon/**`
    - `packages/ui/src/components/taskbar/internal/searchField/**`
    - `packages/ui/src/components/taskbar/internal/contentRow/**`
    - `packages/ui/src/components/taskbar/internal/panelSurface/**`
    - `packages/ui/src/components/taskbar/internal/panelHeader/**`
    - `packages/ui/src/components/taskbar/internal/panelSection/**`
    - `packages/ui/src/components/taskbar/internal/panelTile/**`
    - `packages/ui/src/components/taskbar/taskbar/**`
    - `packages/ui/src/components/taskbar/taskbarStartButton/**`
    - `packages/ui/src/components/taskbar/taskbarSearch/**`
    - `packages/ui/src/components/taskbar/taskbarIconButton/**`
    - `packages/ui/src/components/taskbar/taskbarClock/**`
    - `packages/ui/src/assets/**`
    - `packages/ui/src/index.ts`
- input:
    - Phase 1의 public/internal 경계와 prop grammar
    - package-local `file`/`folder` asset 계약
- output:
    - `Icon`
    - `SearchField`
    - `ContentRow`
    - `PanelSurface`
    - `PanelHeader`
    - `PanelSection`
    - `PanelTile`
    - `Taskbar`
    - `TaskbarStartButton`
    - `TaskbarSearch`
    - `TaskbarIconButton`
    - `TaskbarClock`
- 선행조건:
    - Phase 1 완료
- 제약:
    - `Icon`은 `src` 또는 `kind` fallback만 책임하고 크기와 장식은 consumer `className` 또는 wrapper layout으로 제어한다.
    - `Taskbar`는 slot layout만 책임하고 task item 데이터 mapping이나 panel mount orchestration을 포함하지 않는다.
    - `TaskbarStartButton`, `TaskbarIconButton`, `TaskbarSearch`는 native button/input/container prop pass-through를 허용하되 app store/hook 의존을 만들지 않는다.
    - `TaskbarIconButton`은 하단 status line과 `default | open | active` visual state를 책임하지만 panel tile/button과의 공통 public abstraction은 만들지 않는다.
    - `PanelSurface`, `PanelHeader`, `PanelSection`, `PanelTile`는 실제로 둘 이상의 public surface가 grammar를 공유할 때만 구현하고, 단순 class wrapper면 추출하지 않는다.
    - 라이브 사이트의 glass/bar 스타일을 우선 복제하되 local `blog`의 Tailwind class grammar와 spacing 감각을 참고해 `packages/ui`에서 독립적으로 재현 가능한 스타일로 정리한다.
- 작업:
    - `Icon`, `SearchField`, `ContentRow`를 공통 내부 구현으로 만든다.
      `SearchField`는 사이트의 rounded white input grammar를 따르고, `ContentRow`는 search/context/detail action 계열의 `leading icon + text` row grammar를 수용한다.
    - shared panel primitive를 재사용 기준에 맞게 추출한다.
      panel의 공통 surface chrome이 반복되면 `PanelSurface`, 제목/보조 action header가 반복되면 `PanelHeader`, section block이 반복되면 `PanelSection`을 internal component로 만든다.
      tile는 큰 framed card와 작은 compact icon tile을 모두 수용할 수 있도록 `PanelTile` variant grammar를 먼저 맞춘 뒤 재사용한다.
    - `Taskbar`를 전체 폭 하단 surface로 구현한다.
      사이트처럼 밝은 유리질 background, 얇은 상단 경계, 중앙 cluster, 우측 시계 영역을 포함하되 named slot 조합만 배치하고 interactive orchestration은 포함하지 않는다.
    - `TaskbarStartButton`, `TaskbarSearch`, `TaskbarClock`를 닫힌 상태 UI와 맞춘다.
      시작 버튼은 정사각형 심볼 버튼, 검색 영역은 짧은 pill과 placeholder/value shell, 시계는 `timeLabel`/`dateLabel` 기반 2줄 right-aligned layout로 구현한다.
    - `TaskbarIconButton`을 render slot과 source-based icon fallback을 모두 수용하는 이미지 아이콘 버튼으로 구현한다.
      사이트처럼 작은 정사각 hover chrome과 하단 상태선을 가지며 native button props와 ARIA prop을 그대로 수용한다.
    - taskbar shell의 핵심 스타일 문법을 실제 레퍼런스와 맞춘다.
      bar glass blur, white/black alpha 대비, hover 배경, status line 두께, clock 정렬, 검색 pill의 border/background 톤을 `seojaewan.com` 기준으로 맞추고, local `blog` class grammar는 동일한 인상을 `packages/ui` 단독 마크업으로 재현하는 참고로 사용한다.
- 검증:
    - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
    - [ ] `pnpm --filter @windows/ui test`
    - [ ] core shell source가 `next/*` import 없이 server-safe entry 계약을 지키고, leaf component가 generic DOM prop만으로 렌더링 가능하다.

### Phase 3

- owner_agent: `frontend-developer`
- 목적: start/search의 큰 overlay panel 2종을 mode-aware visual shell로 구현해 실제 사이트와 local blog의 시각 구조를 재현하면서 optional generic callback과 render slot을 받는 public contract를 닫는다.
- boundary:
    - `packages/ui/src/components/taskbar/taskbarStartPanel/**`
    - `packages/ui/src/components/taskbar/taskbarSearchPanel/**`
    - `packages/ui/src/index.ts`
- input:
    - Phase 1의 start/search visual contract
    - Phase 1의 start/search public prop grammar
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
    - panel은 visual shell만 책임하고 outside click, focus trap, 실제 검색 로직, 실제 추천 데이터 계산, portal mount는 포함하지 않는다.
    - public props는 item/action 데이터, render slot, generic callback만 포함하고 function prop이 있더라도 app-specific action 의미를 노출하지 않는다.
    - panel styling은 라이브 사이트의 밝은 surface, border, shadow, spacing, 입력 필드 grammar를 우선 기준으로 삼고, local `blog`는 `all/results` 모드와 split layout의 스타일 fallback을 제공하는 참고로 사용한다.
    - start/search 내부에서 같은 tile/section/header grammar가 반복되면 Phase 2에서 만든 internal primitive를 우선 재사용하고, panel별 차이만 variant나 slot으로 분기한다.
- 작업:
    - `TaskbarStartPanel`을 실제 사이트 중심으로 구현한다.
      기본 `pinned` 모드는 중앙 큰 밝은 카드, 상단 rounded search field, `고정됨` 제목, 우측 작은 `모두` 버튼, file icon 중심의 sparse tile grid를 가진다.
      `all` 모드는 local blog의 카테고리 전환과 grouped list grammar를, `results` 모드는 좌측 result list와 우측 detail/action block grammar를 따른다.
    - `TaskbarStartPanel` contract를 optional generic callback과 함께 닫는다.
      `onViewAllClick`, `onCategorySelect`, `onItemSelect`, `onActionSelect`, `onRequestClose` 같은 callback은 허용하되 item 내부에 domain-specific handler를 심지 않는다.
    - `TaskbarSearchPanel`을 실제 사이트 중심으로 구현한다.
      `default` 모드는 좌측 추천 세로 리스트와 우측 featured card grid를 가지는 넓은 panel로 구성하고, `results` 모드는 local blog의 split layout을 따라 좌측 match list, 우측 detail/action shell을 가진다.
    - start/search panel 내부에서 `Icon`, `SearchField`, `ContentRow`를 재사용하되, 공통으로 보이는 section wrapper를 별도 public primitive로 추출하지 않는다.
      recommended/result/detail/action row는 render slot과 source-based icon fallback을 모두 수용하게 구현한다.
      pinned tile, featured tile, compact icon tile이 반복되면 `PanelTile`을 variant 기반 internal component로 재사용한다.
    - start/search panel의 스타일 문법을 레퍼런스에서 가져온다.
      panel surface의 반투명도, 내부 padding, 제목 weight, 버튼 chrome, tile 간격, detail/action block 대비는 라이브 사이트와 local `blog`의 공통 인상을 따르되 `packages/ui`가 독립적으로 재사용 가능한 클래스/마크업 수준으로 정리한다.
- 검증:
    - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
    - [ ] `pnpm --filter @windows/ui test`
    - [ ] mode별 public prop contract가 discriminated union으로 유지되고 generic callback과 render slot이 app-specific 의미 없이 함께 렌더링 가능하다.
    - [ ] `TaskbarStartPanel`과 `TaskbarSearchPanel`만 export되고 내부 tile/row/detail 조각은 외부로 새어 나오지 않는다.

### Phase 4

- owner_agent: `frontend-developer`
- 목적: hover/context overlay를 compact shell로 구현하고 최종 export surface를 닫아 taskbar UI foundation이 `packages/ui`에서 독립적으로 소비 가능하도록 마감한다.
- boundary:
    - `packages/ui/src/components/taskbar/internal/contextMenuRow/**`
    - `packages/ui/src/components/taskbar/taskbarHoverPanel/**`
    - `packages/ui/src/components/taskbar/taskbarContextMenu/**`
    - `packages/ui/src/index.ts`
- input:
    - Phase 1의 hover/context visual contract
    - Phase 1의 hover/context public prop grammar
    - Phase 2의 `Icon`, `ContentRow`, `TaskbarIconButton`
    - local blog hover/context 레퍼런스:
        - `C:\Users\sjw73\Desktop\dev\blog\src\components\molecules\taskHoverPanel\index.tsx`
        - `C:\Users\sjw73\Desktop\dev\blog\src\components\molecules\taskLeftClickPanel\index.tsx`
        - `C:\Users\sjw73\Desktop\dev\blog\src\components\molecules\taskSearchLeftPanel\index.tsx`
- output:
    - `ContextMenuRow`
    - `TaskbarHoverPanel`
    - `TaskbarContextMenu`
    - 최종 `@windows/ui` taskbar public export 정리
- 선행조건:
    - Phase 2 완료
- 제약:
    - `TaskbarHoverPanel`은 preview item array, title/close affordance, generic `onItemSelect`/`onRequestClose`만 받고 실제 hover delay, close state orchestration은 포함하지 않는다.
    - `TaskbarContextMenu`는 action item array와 generic `onActionSelect`만 받고 실제 context positioning 계산, dismiss logic, 도메인 action wiring은 포함하지 않는다.
    - 두 패널 모두 compact light shell이어야 하며 start/search panel과 같은 큰 surface grammar를 복제하지 않는다.
    - close/select affordance는 시각적 chrome과 generic callback까지만 책임지고 callback 구현의 app 의미는 바깥 consumer가 소유한다.
    - hover/context 스타일은 local `blog`의 preview/menu chrome을 직접 참고하되 라이브 사이트의 밝은 glass 톤과 어긋나지 않게 맞춘다.
    - context/detail action row chrome이 반복되면 `ContextMenuRow`를 internal component로 추출하고, 단순 1회성 markup이면 `ContentRow` 재사용에 머문다.
- 작업:
    - `TaskbarHoverPanel`을 local blog의 preview strip grammar로 구현한다.
      아이콘 위에 뜨는 얕은 밝은 panel, 상단 title row와 우측 close affordance, 하단 preview card/thumbnail 영역을 포함한다.
      preview item은 render slot 또는 source-based thumbnail/icon fallback과 generic select callback만으로 재현되게 만든다.
    - `TaskbarContextMenu`를 local blog의 left-click/context family grammar로 구현한다.
      좁은 밝은 메뉴에 `leading icon + label` row가 수직으로 쌓이는 구조로 만들고, `shortcut`, `disabled`, `destructive`, `selected` visual state와 optional action callback을 함께 지원한다.
      동일한 row chrome이 panel detail action block과 겹치면 `ContextMenuRow` internal component로 추출해 재사용한다.
    - `packages/ui/src/index.ts` export surface를 최종 정리한다.
      public 9종만 노출하고 internal `Icon`, `SearchField`, `ContentRow`와 panel 하위 조각은 숨긴다.
- 검증:
    - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
    - [ ] `pnpm --filter @windows/ui test`
    - [ ] hover/context public prop contract가 generic callback과 render slot만으로 preview/menu visual shell을 완성하고 store/hook import 없이 동작한다.
    - [ ] 최종 export가 public 9종으로 닫히고 internal helper 및 하위 조각은 export되지 않으며, hover/context chrome이 live site와 local `blog`의 스타일 인상을 동시에 벗어나지 않는다.

## 테스트 계획

- `plan-materialize`: `required`
- 보고서: `plans/windows-ui-taskbar-shell/materialize.md` (materialization 후)
- 비고:
    - 로직 boundary의 unit test 여부와 프론트 UI의 bounded-surface E2E 여부는 `plan-materialize`가 로컬 테스트 관례를 보고 결정
    - `architect`는 여기서 테스트 유형 예상이나 후보 spec 구조를 추가로 적지 않는다
    - 실제 테스트 파일은 소스 트리에 생성/수정되며 `plans/`는 durable source of truth가 아니다
