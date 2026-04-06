**Branch:** feat/windows-ui-taskbar-styles

> Worktree dir: `worktrees/windows-ui-taskbar-styles` (plan 폴더명과 동일)

# Windows UI Taskbar Styles 실행 계획

> 요청당 plan 파일은 하나만 생성하고, 실행 순서는 아래 `Phase`들로만 표현한다.
> 추가 top-level section은 사용자 요청이나 별도 정책 요구가 없는 한 넣지 않는다.

## 단계별 실행

### Phase 1

- owner_agent: `frontend-developer`
- 목적: `@windows/tailwind-config`와 taskbar internal primitive에 taskbar semantic token과 style hook을 먼저 닫아 이후 shell/panel styling이 prop 확장 없이 공통 기반 위에서 진행되게 한다.
- boundary:
  - `packages/tailwind-config/src/theme.css`
  - `packages/tailwind-config/src/utilities.css`
  - `packages/ui/src/components/taskbar/internal/**`
- input: 사용자와의 최신 합의인 `@windows/ui` 완성형 기본 스타일 소유, `apps/web`의 page placement 전담, root `className` + CSS variable override만 허용한다는 정책, 현재 `apps/web/src/app/globals.css`의 shared Tailwind base import, `packages/ui/src/components/taskbar/internal/*`의 bare markup contract, `packages/ui/package.json`/`packages/ui/tsconfig.json`/`packages/ui/vitest.config.ts`의 server-safe React library validation path
- output: `@windows/tailwind-config`에는 taskbar 계열이 공통 소비하는 최소 `--taskbar-*` semantic token이 추가된다. internal primitive는 taskbar shell/panel/menu가 공통으로 쓸 root chrome, `leading`/`trailing`/content slot wrapper, additive `className` composition 지점을 가진다. `SearchField`와 `ContentRow`는 caller root `className`을 더해도 default chrome과 slot grammar를 유지하고, `PanelTile`/`Icon`은 default class composition 위에 additive override만 허용한다. internal helper는 계속 package-private로 남고 root export나 `@windows/ui/interactive` entry로 새어 나오지 않는다.
- 제약: token은 높이, surface color, border, shadow, blur, accent, focus ring처럼 외부 override 가치가 큰 값만 다루고 내부 정렬용 미세 spacing까지 전부 토큰화하지 않는다. prop 기반 style API, preview 전용 class contract, Next 전용 API는 도입하지 않는다.
- failure/validation: token 이름이 generic app theme token과 섞여 ownership이 흐려지거나, internal primitive가 slot별 class prop을 public contract처럼 노출하면 이 phase를 완료로 보지 않는다.
- 작업:
  - `@windows/tailwind-config`에 taskbar semantic token 기본값과 정말 공용인 최소 utility만 추가한다.
  - `SearchField`, `ContentRow`, `PanelTile`, `Icon`에 default class composition과 slot wrapper grammar를 정리해 이후 visual shell이 같은 내부 문법을 재사용하게 한다.
  - caller root `className`이 additive override로 동작하도록 기본 class와 병합 규칙을 닫고, preview/app 전용 prop은 열지 않는다.
- 검증:
  - [ ] `pnpm --filter @windows/ui test`
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] `SearchField`/`ContentRow`의 additive `className` merge와 slot wrapper grammar, `PanelTile`/`Icon`의 default class composition이 source-tree tests에서 고정되고 internal helper export surface가 root entry와 interactive entry에 추가되지 않는다.

### Phase 2

- owner_agent: `frontend-developer`
- 목적: taskbar shell과 public leaf control이 외부 class 주입 없이도 완성형 chrome을 갖도록 기본 시각 스타일과 상태 문법을 `@windows/ui` 안에서 마감한다.
- boundary:
  - `packages/ui/src/components/taskbar/taskbar/**`
  - `packages/ui/src/components/taskbar/taskbarStartButton/**`
  - `packages/ui/src/components/taskbar/taskbarSearch/**`
  - `packages/ui/src/components/taskbar/taskbarIconButton/**`
  - `packages/ui/src/components/taskbar/taskbarClock/**`
- input: Phase 1의 taskbar semantic token과 internal style hook, 현재 `Taskbar`/leaf component가 유지하는 named slot 및 native prop pass-through contract, `plans/windows-ui-taskbar-shell/plan.md`로 고정된 public component 책임, `apps/web/next.config.ts`의 `transpilePackages: ["@windows/ui"]` consumer build contract
- output: `Taskbar`, `TaskbarStartButton`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`는 아무 외부 utility 없이도 taskbar chrome, spacing, hover/focus/active affordance, open/active state 차이를 가진 완성형 shell로 렌더링된다. caller `className`은 default class grammar 위에 additive override로만 동작하고 native prop pass-through는 유지되지만 default visual grammar를 대체하는 slot-level override API는 생기지 않는다. taskbar는 내부 레이아웃과 기본 높이만 소유하고 viewport bottom docking, wallpaper, route layout은 소유하지 않는다.
- 선행조건: Phase 1 완료
- 제약: `Taskbar` root에 `fixed`, `sticky`, route-coupled width/offset 같은 app placement 책임을 넣지 않는다. live clock, client state, app-specific action naming, responsive page wrapper는 추가하지 않는다.
- failure/validation: 외부 class 없이는 bare HTML로 돌아가거나, 반대로 app placement까지 `Taskbar` 내부에서 소유하게 되면 실패다. `TaskbarIconButton`의 `default | open | active`가 시각적으로 같은 grammar로 수렴해도 완료로 보지 않는다.
- 작업:
  - taskbar bar, start button, search shell, icon button, clock의 기본 chrome과 상태 스타일을 semantic token 기반 utility class로 넣는다.
  - root `className` additive merge와 native DOM prop pass-through를 유지하면서 default class grammar를 닫는다.
  - taskbar가 package-level presentational shell로 머물도록 viewport anchoring과 app wallpaper concern은 배제한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui test`
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] leaf control의 default class grammar와 caller `className` additive merge가 source-tree tests에서 고정되고, 외부 page placement 없이도 shell chrome이 유지된다.

### Phase 3

- owner_agent: `frontend-developer`
- 목적: start/search/hover/context surface를 위치 비의존적인 panel chrome으로 완성해 taskbar family 전체가 동일한 visual language를 공유하도록 마감한다.
- boundary:
  - `packages/ui/src/components/taskbar/taskbarStartPanel/**`
  - `packages/ui/src/components/taskbar/taskbarSearchPanel/**`
  - `packages/ui/src/components/taskbar/taskbarHoverPanel/**`
  - `packages/ui/src/components/taskbar/taskbarContextMenu/**`
- input: Phase 1의 internal primitive style grammar, Phase 2의 taskbar shell visual language, 기존 mode/status contract를 고정한 taskbar panel/menu tests, 그리고 `plans/windows-web-taskbar-sandbox-preview/plan.md` Phase 2가 제공하는 `/sandbox/taskbar` owner route contract: canonical scene과 matrix, title/section chrome, desktop/mobile inspection layout, 고정 heading/landmark, preview styling과 metadata가 route-local 범위에 머물고 `@windows/ui` component source와 app global style을 preview 전용으로 오염시키지 않는 wrapper-only chrome
- output: `TaskbarStartPanel`, `TaskbarSearchPanel`, `TaskbarHoverPanel`, `TaskbarContextMenu`는 panel background, border, shadow, section spacing, row hover/selected/destructive/focus grammar를 가진 기본 크기형 surface로 렌더링된다. 각 surface는 mode/status별 시각 차이를 가져야 하며 absolute position, anchor math, portal mount, outside click, route wrapper는 계속 소유하지 않는다. 결과물은 `plans/windows-web-taskbar-sandbox-preview/plan.md` Phase 2가 정리한 `/sandbox/taskbar` owner route에서 wrapper-only chrome 위에 검토되고 bounded-surface E2E owner surface로 materialize될 수 있는 package-owned chrome으로 남으며, preview styling은 route-local 범위에 머물고 `@windows/ui` component source에 preview 전용 class/prop을 요구하지 않는다.
- 선행조건: Phase 2 완료, 그리고 `plans/windows-web-taskbar-sandbox-preview/plan.md` Phase 2가 완료되어 `/sandbox/taskbar`가 canonical scene과 matrix를 가진 owner route로 존재하고, preview 전용 title/section chrome과 responsive inspection layout, 고정 heading/landmark를 가지며, preview styling과 metadata가 route-local 범위에 머물고 `@windows/ui` component source와 app global style을 preview 전용으로 오염시키지 않는 현재 소스 트리 상태
- 제약: panel의 위치 결정, viewport docking, route-local title/chrome, sandbox metadata는 이 plan에서 소유하지 않는다. public prop은 기존 generic callback과 data shape를 유지하고 preview 전용 prop, slot override prop을 추가하지 않는다.
- side effects: panel/menu/hover surface가 동일한 semantic token을 공유하면서 taskbar family visual language가 package 차원에서 정리된다.
- failure/validation: panel을 스타일링하기 위해 absolute/fixed positioning contract를 내부에 박아 넣거나, `apps/web` preview 요구를 맞추기 위해 public prop을 넓히면 이 phase는 실패다. prerequisite인 `/sandbox/taskbar` route가 preview title/section chrome이나 heading/landmark를 잃거나, preview styling이 wrapper를 넘어 `@windows/ui` component source로 새어 들어오면 consumer validation과 bounded-surface E2E owner가 성립하지 않으므로 이 phase를 진행하지 않는다. start/search results surface와 context menu state row가 같은 plain block처럼 보이면 완료로 보지 않는다.
- 작업:
  - start/search panel의 mode별 section chrome, result/detail split, action row grammar를 package-owned style로 닫는다.
  - hover preview와 context menu row의 compact chrome, thumbnail/label/caption/shortcut/state styling을 같은 token system 위에 정리한다.
  - `@windows/ui` style 결과가 실제 consumer에서 컴파일 가능함을 확인하기 위해 `@windows/web` build contract로 최종 consumer validation을 수행한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui test`
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] `pnpm --filter @windows/web build`
  - [ ] `pnpm --filter @windows/web dev` 실행 후 `http://localhost:3000/sandbox/taskbar`에서 wrapper-only preview chrome 위에 canonical scene과 matrix가 package-owned panel/menu styles를 반영하고, `@windows/ui` component source에 preview 전용 class/prop을 요구하지 않는다.
  - [ ] panel/menu surface가 기본 크기만 소유하고 위치/anchor responsibility는 여전히 외부에 남는다.

## 테스트 계획

- `plan-materialize`: `required`
- 보고서: `plans/windows-ui-taskbar-styles/materialize.md` (materialization 후)
- 비고:
  - outcome-selection / boundary-contract / final-interpretation / 로직 boundary의 테스트 여부와 프론트 UI의 bounded-surface E2E 여부는 `plan-materialize`가 로컬 테스트 관례를 보고 결정
  - `architect`는 여기서 테스트 유형 예상이나 후보 spec 구조를 추가로 적지 않는다
  - 실제 테스트 파일은 소스 트리에 생성/수정되며 `plans/`는 durable source of truth가 아니다
