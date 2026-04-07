**Branch:** feat/windows-taskbar-01-ui-reference-api

> Worktree dir: `worktrees/windows-taskbar-01-ui-reference-api` (plan 폴더명과 동일)

# Windows Taskbar UI Reference API 실행 계획

> 요청당 plan 파일은 하나만 생성하고, 실행 순서는 아래 `Phase`들로만 표현한다.
> 추가 top-level section은 사용자 요청이나 별도 정책 요구가 없는 한 넣지 않는다.

## 단계별 실행

### Phase 1

- owner_agent: `frontend-developer`
- 목적: `Taskbar`를 raw ReactNode slot 조립기에서 `entries` 기반 data-driven public API로 재정의해 이후 shell/panel styling과 consumer route가 같은 입력 계약을 공유하게 한다.
- boundary:
  - `packages/ui/src/components/taskbar/**`
  - `packages/ui/src/index.ts`
- input: 사용자와의 최신 합의인 `entries` 필수, `icon.category` 기반 entry 연결, `windows/search` metadata optional, `windows` canonical naming, interaction 제외 정책, 현재 `packages/ui/src/components/taskbar/taskbar/index.tsx`의 `startButton/search/items/clock` raw slot contract, `packages/ui/src/index.ts`의 `TaskbarStartButton`/`TaskbarStartPanel` root export, `@windows/ui` server-safe entry contract와 `packages/ui/package.json`/`packages/ui/tsconfig.json` validation path
- output: `Taskbar` public API는 `entries`, `icons`, `windows`, `search`, `clock` data props를 canonical input으로 받고, `entries`는 필수이며 `icon.category`로 관련 entry를 해석한다. canonical `Entry` shape는 `id`, `category`, `title` 필수와 optional `summary`, `meta`, `thumbnailSrc`, `thumbnailAlt`, `href`, `tags`, `windows`, `search`를 가진다. optional `windows` shape는 `{ visible?: boolean; pinned?: boolean; order?: number }`, optional `search` shape는 `{ searchable?: boolean; recommended?: boolean; featured?: boolean; rank?: number }`로 고정되고, `windows/search` metadata가 없으면 `visible/searchable=true`, `pinned/recommended/featured=false`, `order/rank`는 선언 순서를 fallback으로 사용한다. canonical `TaskbarIcon` shape는 `id`, `category`, `kind`, `label`, optional `status`를 가지며 `icon.category="windows"`는 reserved launcher category이고 나머지 값은 `entry.category`와 매핑된다. raw ReactNode slot 조합이나 public `pinnedIds`/`allIds` 제어 없이 default reference shell과 static windows/search surface를 렌더링하며, `entry.type.name` 같은 sibling 식별자나 `TaskbarStart*` legacy naming은 새 public API의 canonical path가 아니다. 이번 단계는 `slots + slotProps` 또는 named component override surface를 canonical usage로 도입하지 않는다.
- 제약: interaction runtime, outside click, portal mount, persisted browser state, live clock, session store, actual search fetching, named component override props는 이번 plan 범위 밖이다.
- failure/validation: `entries` 없이도 성립하는 별도 source-of-truth를 허용하거나, `icon.category` 대신 복수의 경쟁 식별자를 동일 canonical path로 남기면 이 phase를 완료로 보지 않는다.
- 작업:
  - `Entry`와 `TaskbarIcon` 중심의 public schema를 위 canonical field set으로 정의하고, `icon.category -> entry.category` winner rule과 `windows` reserved category를 package contract로 고정한다.
  - `windows`와 `search`의 optional metadata fallback 규칙을 package 내부 outcome-selection contract로 고정한다.
  - 기존 `startButton/search/items/clock` raw slot contract를 새 canonical API 기준으로 치환하고, `TaskbarStart*` legacy naming은 alias 없이 제거하는 migration 경로를 명시한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] `Taskbar` canonical input이 `entries`, `icons`, `windows`, `search`, `clock`로 수렴하고 `Entry`/`TaskbarIcon` field set이 `entry.category` winner rule까지 포함해 명시적으로 고정된다.
  - [ ] `windows` naming이 canonical winner로 고정되고 `start` prop/contract 및 `TaskbarStart*` legacy naming이 새 public API의 primary path나 alias로 남지 않는다.

### Phase 2

- owner_agent: `frontend-developer`
- 목적: `@windows/tailwind-config`와 taskbar leaf shell을 `~/Desktop/dev/blog` 및 `https://seojaewan.com` reference visual language에 맞춰 다시 닫아 `app/web`가 별도 chrome 없이도 기본 taskbar family를 렌더링하게 한다.
- boundary:
  - `packages/tailwind-config/src/theme.css`
  - `packages/tailwind-config/src/utilities.css`
  - `packages/ui/src/components/taskbar/**`
- input: Phase 1의 data-driven API contract, 로컬 reference source인 `C:/Users/USER/Desktop/dev/blog/src/app/globals.css`, `C:/Users/USER/Desktop/dev/blog/src/components/templates/bottomBar/index.tsx`, `C:/Users/USER/Desktop/dev/blog/src/components/atoms/taskInput/index.tsx`, live reference인 `https://seojaewan.com`의 taskbar visual language, 현재 `@windows/tailwind-config` taskbar token과 `Taskbar`/`TaskbarSearch`/`TaskbarIconButton`/`TaskbarClock` 기본 class grammar
- output: `@windows/ui`는 app-specific wrapper 없이도 reference-style glass, typography rhythm, search affordance, icon spacing, clock chrome을 가진 기본 taskbar bar를 렌더링한다. `Taskbar` root는 consumer가 raw leaf node를 직접 조립하지 않아도 `entries/icons/windows/search/clock` props만으로 기본 shell을 완성하며, icon/button/search/clock styling의 source of truth는 `ui` package와 shared taskbar token이다. 결과물은 `app/web` route-local wallpaper나 preview wrapper 없이도 bare HTML 수준으로 퇴행하지 않아야 하며, 반대로 route-specific class나 preview-only prop을 요구해서도 안 된다.
- 선행조건: Phase 1 완료
- 제약: viewport anchoring과 route layout은 아직 package가 소유하지 않지만, 기본 shell visual grammar는 package 내부에서 닫혀야 한다. Next-specific font API, preview-only CSS selector, `app/web` globals 의존은 이번 단계의 canonical path가 아니다.
- side effects: taskbar token과 leaf component class grammar가 기존 generic 스타일에서 reference-parity 지향으로 바뀐다.
- failure/validation: reference visual grammar를 맞추기 위해 `app/web` globals나 route wrapper가 필수 전제가 되면 실패다.
- 작업:
  - `blog`와 live site의 glass/background/border/shadow/typography/task-input affordance를 공통 taskbar token과 utility로 번역한다.
  - `Taskbar`, windows button leaf, search field, icon button, clock의 기본 markup/class grammar를 data-driven 조립과 reference look에 맞춰 재구성한다.
  - leaf component가 여전히 generic DOM prop을 수용하되 기본 visual grammar의 source of truth는 package 내부에 남도록 정리한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui test`
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] `pnpm --filter @windows/web build`
  - [ ] `@windows/ui` 기본 taskbar shell이 `app/web` route-local preview CSS 없이도 reference-style chrome을 유지하고 preview-only prop/class를 요구하지 않는다.

### Phase 3

- owner_agent: `frontend-developer`
- 목적: `entries` projection을 windows/search/hover/context static surface까지 확장해 taskbar family 전체가 같은 data contract와 reference visual language를 공유하게 한다.
- boundary:
  - `packages/ui/src/components/taskbar/**`
- input: Phase 1의 `entries/icons/windows/search/clock` contract, Phase 2의 reference-style leaf shell, `blog`의 `ContentContext`/`useMixList`가 보여주는 shared registry + surface projection 구조, 현재 panel component의 `pinned | all | results` 및 `default | results` mode grammar
- output: `windows.view`는 `pinned | all`, `search.view`는 `default | results` static state를 해석하고, 명시된 view가 없으면 `search.value` 유무와 internal default projection으로 canonical surface를 선택한다. windows/search/hover/context surface는 같은 `entries` registry를 해석해 결과를 렌더링하며, metadata가 없는 entry도 내부 기본 규칙으로 surface에 포함될 수 있다. 각 surface는 reference-style panel chrome을 가지지만 outside click, portal mount, close/open runtime, persisted query state는 소유하지 않는다.
- 선행조건: Phase 2 완료
- 제약: `entries` 외부에 별도 duplicated list source-of-truth를 두지 않는다. `pinnedIds`, `allIds`, `recommendedIds`, `featuredIds`를 public controlled prop으로 열지 않고, 지금 단계의 callback은 `onPinnedSelect`, `onAllSelect`, `onResultSelect`, `onActionSelect` 같은 generic selection event까지만 허용한다.
- failure/validation: 같은 entry가 surface마다 다른 canonical 해석을 가지거나, `windows/search` static state 선택이 consumer 추측에 의존하면 실패다.
- 작업:
  - `entries` registry에서 windows/search/hover/context surface별 projection 규칙과 fallback ordering을 package 내부 helper로 고정한다.
  - `windows.view`/`search.view`와 `search.value` fallback rule을 static reference stage에서 재현 가능한 final-interpretation contract로 닫는다.
  - panel/menu/hover surface class grammar를 `blog`와 live site reference에 맞춰 package-owned visual language로 정리한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui test`
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] windows/search/hover/context surface가 같은 `entries` registry를 해석하고 public controlled ids 없이도 canonical static output을 만든다.

### Phase 4

- owner_agent: `frontend-developer`
- 목적: root export와 consumer validation을 마감해 `apps/web`가 후속 plan에서 바로 소비할 수 있는 단일 package contract를 확정한다.
- boundary:
  - `packages/ui/src/index.ts`
  - `packages/ui/src/interactive/index.ts`
  - `packages/ui/src/components/taskbar/**`
- input: Phase 1~3에서 닫힌 data-driven API, reference-style shell, static windows/search/hover/context surface, `@windows/web` consumer build contract
- output: `@windows/ui`의 `Taskbar` public API가 `entries`, `icons`, `windows`, `search`, `clock` data props를 canonical input으로 받고, `entries`는 필수이며 `Entry` shape는 `id`, `category`, `title` 필수와 optional `summary`, `meta`, `thumbnailSrc`, `thumbnailAlt`, `href`, `tags`, `windows`, `search`로 고정된다. `TaskbarIcon` shape는 `id`, `category`, `kind`, `label`, optional `status`로 고정되고 `icon.category="windows"`는 reserved launcher category이며 나머지 값은 `entry.category`와 매핑된다. `windows/search` metadata가 없으면 `visible/searchable=true`, `pinned/recommended/featured=false`, `order/rank`는 선언 순서를 fallback으로 사용하며, raw ReactNode slot 조합이나 public `pinnedIds`/`allIds` 제어 없이 default reference shell과 static windows/search surface를 렌더링한다. root export는 이 canonical contract만 노출하고 `TaskbarStart*` legacy naming은 alias 없이 제거되며 interactive-only entry 확장은 후속 소비 plan의 prerequisite가 될 수 없도록 정리된다.
- 선행조건: Phase 3 완료
- 제약: 이번 단계는 consumer migration 준비를 끝내는 것이지 `apps/web` route 자체를 수정하지 않는다.
- failure/validation: root export가 legacy `start` naming과 새 `windows` naming을 같은 canonical 수준으로 병치하거나, consumer build가 새 API를 해석하지 못하면 이 plan은 완료된 것으로 보지 않는다.
- 작업:
  - `packages/ui/src/index.ts` export surface를 새 canonical naming과 data-driven API 기준으로 정리한다.
  - `packages/ui/src/interactive/index.ts`가 여전히 비어 있거나 interactive runtime 미도입 상태를 유지하는지 확인한다.
  - 후속 consumer plan이 요구하는 package prerequisite contract를 source-tree validation으로 닫는다.
- 검증:
  - [ ] `pnpm --filter @windows/ui test`
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] `pnpm --filter @windows/web build`
  - [ ] `@windows/ui`의 `Taskbar` public API가 `entries`, `icons`, `windows`, `search`, `clock` data props를 canonical input으로 받고, `Entry`/`TaskbarIcon` schema와 `icon.category -> entry.category` winner rule이 root export 기준으로 고정된다.
  - [ ] root export가 `TaskbarStart*` legacy naming을 alias 없이 제거하고 interactive-only entry 확장을 후속 consumer prerequisite로 남기지 않는다.

## 테스트 계획

- `plan-materialize`: `required`
- 보고서: `plans/windows-taskbar-01-ui-reference-api/materialize.md` (materialization 후)
- 비고:
  - outcome-selection / boundary-contract / final-interpretation / 로직 boundary의 테스트 여부와 프론트 UI의 bounded-surface E2E 여부는 `plan-materialize`가 로컬 테스트 관례를 보고 결정
  - `architect`는 여기서 테스트 유형 예상이나 후보 spec 구조를 추가로 적지 않는다
  - 실제 테스트 파일은 소스 트리에 생성/수정되며 `plans/`는 durable source of truth가 아니다
