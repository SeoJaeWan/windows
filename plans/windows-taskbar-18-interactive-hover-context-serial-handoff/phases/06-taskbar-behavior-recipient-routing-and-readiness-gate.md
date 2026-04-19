# Phase 6. taskbar behavior recipient routing and readiness gate

## Phase 요약

| 항목 | 내용 |
| --- | --- |
| owner_agent | `general-developer` |
| 목표 | `e2e/storybook/**` 아래를 task 18 browser owner source-tree boundary로 닫고 exact behavior recipient routing + setup-smoke readiness gate를 추가한다. |
| 다루는 작업 묶음 | `taskbar behavior recipient routing gate` |
| 시작 조건 | `./phases/05-storybook-browser-runner-boundary.md` |
| 완료 판단 | `e2e/storybook/**` route helper, taskbar behavior surface registry, setup-smoke owner가 exact recipient / selector contract를 literal하게 가지며 unit/runtime/compare owners는 그대로 유지되고 browser owner split이 명시된다. 이 phase는 첫 Storybook owner 파일을 만들기 때문에 `pnpm test:e2e:storybook --list`의 첫 green path도 소유한다. |
| 중단 조건 | setup-smoke owner가 full browser behavior assertion까지 흡수하거나 browser owner가 compare stories / `@windows/web` route로 다시 흐르면 중단한다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `e2e/storybook/shared/storybookRoute.ts` | 추가 | route helper는 registry의 `sourcePath` / `storyTitle` / `storyExport`를 Storybook browser route로 연결해야 한다. | helper만 읽어도 Storybook browser owner가 exact recipient routing을 어떤 입력으로 닫는지 보인다. |
| `e2e/storybook/taskbar/taskbarBehaviorSurfaceRegistry.ts` | 추가 | registry는 세 recipient를 literal하게 가진다: `Interactive/Taskbar/HoverPreview` / `HoverLifecycle`, `Interactive/Taskbar/ContextPanel` / `PointerOriginAndEscapeClose`, `Interactive/Taskbar/MutualExclusion` / `ConsumerOwnedWinnerRule`. | `sourcePath` / `storyTitle` / `storyExport` / `selector` contract가 한 곳에 모인다. |
| `e2e/storybook/taskbar/taskbarBehavior.setup-smoke.spec.ts` | 추가 | setup-smoke owner는 route reachability와 canonical selector availability만 소유한다. full browser behavior assertion은 later materialize가 같은 surface에서 맡는다. | setup-smoke만 읽어도 readiness gate 역할과 소유 범위가 분명하다. |
| `packages/ui/src/interactive/taskbar/storybook/*.behavior.stories.tsx` | 읽기 전용 참조 | canonical `sourcePath` / `storyTitle` / `storyExport` source는 existing behavior story file들이다. | registry가 existing story source를 literal하게 가리킨다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 읽기 전용 참조 | canonical selector source는 existing harness다. | registry selector contract가 existing harness selector와 일치한다. |

## 완료 증거

- `e2e/storybook/**` source-tree owner file들이 task 18 browser owner boundary로 추가된다.
- exact literal recipient 세트가 registry에 그대로 적힌다.
- route helper + registry가 exact `sourcePath` / `storyTitle` / `storyExport` / `selector` contract를 한 번만 닫는다.
- setup-smoke owner는 route reachability와 canonical selector availability만 소유한다.
- unit/runtime/compare owners는 Phase 3 상태 그대로 유지되고 browser owner split만 `e2e/storybook/**`로 추가된다.
- `pnpm test:e2e:storybook --list`가 이 phase에서 처음으로 real `e2e/storybook/**` owner set을 보여 주며, 그 전 단계에서는 validation contract가 아니다.
- later materialize는 같은 bounded Storybook surface를 target해야 하며 old external setup blocker wording으로 돌아가지 않는다.

## 작업 순서

| 순서 | 작업 묶음 | 이번 단계에서 하는 일 | 끝나면 고정되는 것 |
| --- | --- | --- | --- |
| 1 | `taskbar behavior recipient routing gate` | Storybook route helper와 taskbar behavior surface registry를 추가한다. | exact recipient routing source |
| 2 | `taskbar behavior recipient routing gate` | setup-smoke owner를 추가해 route reachability + selector availability만 readiness gate로 닫고 첫 Storybook owner listing을 양수 신호로 만든다. | setup-smoke role boundary + first owner listing |
| 3 | `taskbar behavior recipient routing gate` | unit/runtime/compare owner는 그대로 두고 browser owner split과 later materialize handoff를 explicit하게 적는다. | bounded-surface browser owner split |

## 작업 묶음 A. exact recipient route helper + registry

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | Phase 4 story recipient contract만으로는 source-tree browser owner가 어디에 놓이고 어떤 exact input으로 route되는지 아직 닫히지 않는다. |
| 현재 문제 | exact behavior recipient, sourcePath, selector가 story source / harness / plan 문장에 흩어져 있어 later materialize가 source-tree browser owner를 직접 찾기 어렵다. |
| 목표 상태 | `e2e/storybook/**` 안에 route helper와 taskbar behavior surface registry가 생겨 exact recipient contract를 한 곳에서 읽을 수 있다. |
| 유지되는 것 | existing story titles / exports / harness selectors, unit/runtime/compare owner split |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `e2e/storybook/shared/storybookRoute.ts` | 추가 | route helper가 exact recipient routing 입력을 닫는다. |
| `e2e/storybook/taskbar/taskbarBehaviorSurfaceRegistry.ts` | 추가 | registry가 세 recipient의 `sourcePath` / `storyTitle` / `storyExport` / `selector` contract를 literal하게 가진다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `e2e/storybook/shared/storybookRoute.ts`, `e2e/storybook/taskbar/taskbarBehaviorSurfaceRegistry.ts` |
| state ownership | source-tree Storybook browser routing owner |
| callback / handoff | setup-smoke owner와 later materialize가 모두 같은 registry를 읽는다. |
| no-op / invalid rule | story title을 축약하거나 selector contract를 story-local 문장으로만 남기는 것은 invalid다. |
| 금지하는 대안 | compare story ID, web route, proxy fixture path를 browser owner route source로 쓰는 것 |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| registry가 exact recipient 3개를 literal하게 가진다 | source inspection |
| helper가 registry 입력만으로 Storybook route를 닫는다 | source inspection |

## 작업 묶음 B. setup-smoke readiness gate

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | browser owner가 생겨도 최소 route reachability / selector availability gate가 없으면 later materialize가 다시 setup missing처럼 해석할 수 있다. |
| 현재 문제 | existing source tree에는 Storybook-targeted browser owner spec이 없어 owner listing 자체가 later phase 이전에는 성립하지 않는다. |
| 목표 상태 | `taskbarBehavior.setup-smoke.spec.ts`가 route reachability와 canonical selector availability만 확인하는 bounded readiness gate가 되고, 같은 phase에서 `pnpm test:e2e:storybook --list`가 첫 owner proof가 된다. |
| 유지되는 것 | full browser behavior assertion은 later materialize에서 같은 Storybook surface를 target한다. |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `e2e/storybook/taskbar/taskbarBehavior.setup-smoke.spec.ts` | 추가 | setup-smoke owner가 route reachability + canonical selector availability only를 소유한다. |
| `e2e/storybook/taskbar/taskbarBehaviorSurfaceRegistry.ts` | 참조 | setup-smoke가 exact registry를 그대로 소비한다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | `taskbarBehavior.setup-smoke.spec.ts` |
| state ownership | setup-smoke readiness gate |
| callback / handoff | later materialize는 같은 registry / route helper를 읽어 full browser assertion spec을 같은 bounded surface에 붙인다. |
| no-op / invalid rule | setup-smoke에서 hover/context/serial handoff full assertion까지 수행하는 것은 invalid다. |
| 금지하는 대안 | setup-smoke pass를 browser behavior pass로 해석하는 것 |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| setup-smoke owner가 route reachability만 본다 | source inspection |
| setup-smoke owner가 canonical selector availability만 본다 | source inspection |
| Storybook-targeted owner listing에 setup-smoke owner가 잡힌다 | `pnpm test:e2e:storybook --list` |

## 작업 묶음 C. explicit browser owner split + materialize handoff

| 항목 | 내용 |
| --- | --- |
| 왜 바꾸는가 | user-fixed direction은 unit/runtime/compare owners를 유지한 채 browser owner만 별도 Storybook bounded surface로 닫으라고 요구한다. |
| 현재 문제 | old blocker wording은 browser owner가 외부 설정에 매달린다고 읽히고 compare/runtime owners와 browser owner의 경계도 source-tree 기준으로 닫혀 있지 않다. |
| 목표 상태 | unit/runtime/compare owners는 그대로 유지되고 browser owner만 `e2e/storybook/**` exact Storybook recipient로 명시된다. later materialize는 same bounded surface를 target하고 old external setup blocker wording으로 돌아가지 않는다. |
| 유지되는 것 | Phase 3 owner split, Phase 4 exact behavior story recipient contract, Phase 5 runner boundary |

### 관련 파일

| 파일 | 작업 방식 | 완료 조건 |
| --- | --- | --- |
| `e2e/storybook/**` | 추가 | browser owner split이 source-tree boundary로 보인다. |
| `plans/windows-taskbar-18-interactive-hover-context-serial-handoff/plan.md` | 참조 | top-level topology와 phase handoff가 같은 wording으로 닫힌다. |

### 공개 계약

| 항목 | 내용 |
| --- | --- |
| public surface | bounded Storybook browser owner under `e2e/storybook/**` |
| state ownership | browser owner only |
| callback / handoff | `plan-materialize`는 same bounded surface에 full browser assertions를 붙인다. |
| no-op / invalid rule | compare owner를 browser owner로 승격하거나 `@windows/web` route를 fallback owner로 쓰는 것은 invalid다. |
| 금지하는 대안 | old external setup blocker wording을 그대로 재사용하는 것 |

### 검증 포인트

| 항목 | 확인 방법 |
| --- | --- |
| unit/runtime/compare owners가 유지된다 | Phase 3 + Phase 6 wording parity inspection |
| browser owner split이 `e2e/storybook/**` exact Storybook recipient로 explicit하다 | source inspection |
| later materialize handoff가 bounded surface로 닫힌다 | plan / phase wording inspection |

## 실행 계약

- owner_agent: `general-developer`
- 목적: `e2e/storybook/**` 아래의 exact recipient routing + readiness gate를 source-tree browser owner로 닫는다.
- boundary: `e2e/storybook/shared/storybookRoute.ts`, `e2e/storybook/taskbar/taskbarBehaviorSurfaceRegistry.ts`, `e2e/storybook/taskbar/taskbarBehavior.setup-smoke.spec.ts`를 직접 다루고 existing story / harness source는 read-only reference로만 읽는다.
- input: Phase 4 exact behavior story recipient contract, Phase 5 Storybook runner boundary
- output:
  - source-tree browser owner file들은 `e2e/storybook/**` 아래에 놓인다.
  - exact literal recipients는 다음 세트로 고정된다.
    - `Interactive/Taskbar/HoverPreview` / `HoverLifecycle`
    - `Interactive/Taskbar/ContextPanel` / `PointerOriginAndEscapeClose`
    - `Interactive/Taskbar/MutualExclusion` / `ConsumerOwnedWinnerRule`
  - route helper + registry는 exact `sourcePath` / `storyTitle` / `storyExport` / `selector` contract를 한 곳에서 닫는다.
  - setup-smoke owner는 route reachability + canonical selector availability only를 소유한다.
  - `pnpm test:e2e:storybook --list`는 첫 `e2e/storybook/**` owner set을 이 phase에서 양수 신호로 보여 준다.
  - unit/runtime/compare owners는 그대로 유지되고 browser owner split만 explicit해진다.
  - later materialize는 same bounded Storybook browser owner를 target하며 old external setup blocker wording으로 돌아가지 않는다.
- 선행조건: `./phases/05-storybook-browser-runner-boundary.md`
- 제약:
  - `sourcePath`
    - `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx`
    - `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.behavior.stories.tsx`
    - `packages/ui/src/interactive/taskbar/storybook/taskbarMutualExclusion.behavior.stories.tsx`
  - `selector`
    - hover: `hover-trigger`, `hover-surface-root`, `hover-outside`, `hover-taskbar`, `hover-backdrop`
    - context: `context-trigger`, `context-surface-root`, `context-outside`, `context-taskbar`, `context-backdrop`
    - mutual: `mutual-trigger`, `mutual-hover-surface-root`, `mutual-context-surface-root`, `mutual-outside`, `mutual-taskbar`, `mutual-backdrop`
- side effects: user gate, reviewer, materializer가 모두 같은 source-tree browser owner vocabulary를 읽게 된다.
- failure/validation: recipient / selector / sourcePath contract가 하나라도 흐려지거나 setup-smoke가 full assertion 영역까지 넓어지면 phase는 미완료다.

## Phase 검증

- [ ] `pnpm test:e2e:storybook --list`가 `e2e/storybook/**` owner만 읽는다는 점이 validation contract로 명시된다.
- [ ] `taskbarBehaviorSurfaceRegistry.ts`가 exact `sourcePath` / `storyTitle` / `storyExport` / `selector` contract를 literal하게 가진다.
- [ ] `taskbarBehavior.setup-smoke.spec.ts`는 route reachability + canonical selector availability only를 소유하고 full browser behavior assertion은 later materialize로 넘긴다.
- [ ] unit/runtime/compare owners는 그대로 유지되고 browser owner split만 explicit해진다.
- [ ] `pnpm test:e2e:storybook --list`는 Phase 5 proof가 아니라 첫 `e2e/storybook/**` owner set이 생긴 뒤의 Phase 6 readiness proof로만 사용된다.
