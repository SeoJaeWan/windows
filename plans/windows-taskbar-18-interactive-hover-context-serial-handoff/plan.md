**Branch:** `fix/windows-taskbar-18-interactive-hover-context-serial-handoff`

> Worktree dir: `worktrees/windows-taskbar-18-interactive-hover-context-serial-handoff`

# Windows Taskbar interactive hover/context serial handoff 실행 계획

| # | Phase | Agent |
| --- | --- | --- |
| 1 | `./phases/01-shared-lifecycle-placement-gate.md` | `frontend-developer` |
| 2 | `./phases/02-consumer-serial-handoff-wiring.md` | `frontend-developer` |
| 3 | `./phases/03-verification-owner-realignment.md` | `frontend-developer` |
| 4 | `./phases/04-behavior-story-browser-acceptance.md` | `frontend-developer` |
| 5 | `./phases/05-storybook-browser-runner-boundary.md` | `general-developer` |
| 6 | `./phases/06-taskbar-behavior-recipient-routing-and-readiness-gate.md` | `general-developer` |

## 요청 대응표

| 사용자 요청 항목 | 이번 계획에서 고정한 범위 | 반영 위치 | 남은 미결정 |
| --- | --- | --- | --- |
| separate exports: `useTaskbarHoverPreview`, `useTaskbarContextPanel` | 두 hook의 이름과 분리 export는 유지하고, 공통 로직은 internal primitive/helper까지만 허용한다. | 작업 묶음 `public hook pair`, Phase 2 | 없음 |
| internal shared primitive is allowed / consumer-owned exclusivity remains | sibling arbitration은 hook 내부가 아니라 host-owned choreography로 고정하고, 공통 helper는 internal boundary로만 둔다. | 작업 묶음 `shared lifecycle gate`, `serial handoff host`, Phase 1~2 | 없음 |
| fixed `10px` gap / trigger-centered placement | canonical placement는 trigger 중심 x와 `taskbarRoot.height + 10px` attached gap으로 고정한다. | 작업 묶음 `shared lifecycle gate`, Phase 1 | 없음 |
| missing refs => `warn + no-op` | trigger, taskbar root, canonical surface root 중 필수 ref가 없으면 경고 후 현재 intent를 무시한다. | 작업 묶음 `shared lifecycle gate`, `public hook pair`, Phase 1~2 | 없음 |
| hover no focus restore / context focus restore on finalize | hover와 context의 차이는 close scope와 focus restore 여부로만 남기고 나머지 lifecycle vocabulary는 공유한다. | 작업 묶음 `public hook pair`, Phase 2 | 없음 |
| hover document-level whitelist close | hover close는 live read-only reference와 같은 document-level whitelist behavior를 유지한다. | 작업 묶음 `public hook pair`, `verification owners`, Phase 2~3 | 없음 |
| `opening` persists until enter `animationend` / `closing` persists until finalize | same mounted root가 enter/exit animation boundary를 소유하고 phase 전이는 그 root lifecycle에 묶인다. | 작업 묶음 `shared lifecycle gate`, Phase 1 | 없음 |
| visible opening waits for measured placement | zero-size placeholder는 internal staging까지만 허용하고, visible open은 actual measured placement 뒤에만 시작한다. | 작업 묶음 `shared lifecycle gate`, `verification owners`, `browser acceptance recipients`, Phase 1 / Phase 3 / Phase 4 | 없음 |
| intentional deviation from live is serial handoff | live repo의 immediate group handoff는 read-only reference로만 두고, 이번 slug에서는 serial handoff를 canonical contract로 닫는다. | 작업 묶음 `serial handoff host`, Phase 2 | 없음 |
| latest intent wins / dismiss cancels queued winner / winner placement measures at actual open | queued winner는 loser finalize 뒤에만 열리고 stale intent는 no-op가 되며 winner placement는 actual open 시점 measurement만 사용한다. | 작업 묶음 `serial handoff host`, `verification owners`, Phase 2~3 | 없음 |
| browser acceptance remains mandatory on exact Storybook behavior stories | browser gate recipient은 exact behavior story surface로 고정하고 compare stories는 대체 recipient에서 제외한다. | 작업 묶음 `browser acceptance recipients`, Phase 4 | 없음 |
| compare stories remain visual baseline only / unit-runtime-browser split must be clear | unit, jsdom runtime, compare owner는 기존 task 18 intent 그대로 유지하고 browser owner만 별도 Storybook bounded surface로 추가한다. | 작업 묶음 `verification owners`, `taskbar behavior recipient routing gate`, Phase 3 / Phase 6 | 없음 |
| task 19 is gone and must not be recreated | task 19를 별도 plan/folder로 복원하지 않고 setup scope를 task 18 Phase 5~6으로만 흡수한다. | 작업 묶음 `storybook browser runner boundary`, `taskbar behavior recipient routing gate`, Phase 5~6 | 없음 |
| dedicated Storybook browser runner boundary only for task 18 | canonical root command와 Storybook-targeted Playwright config를 추가하되 기존 `playwright.config.ts` owner와 분리한다. | 작업 묶음 `storybook browser runner boundary`, Phase 5 | 없음 |
| target `@windows/ui` Storybook at `http://localhost:6006` / keep `@windows/web` separate | Storybook browser owner는 `@windows/ui` / `http://localhost:6006`만 target하고, existing web owner는 `@windows/web` / `http://localhost:3000`으로 유지한다. | 작업 묶음 `storybook browser runner boundary`, Phase 5 | 없음 |
| source-tree browser owner files under `e2e/storybook/**` with exact recipient routing + setup-smoke only | route helper, taskbar behavior surface registry, setup-smoke owner는 `e2e/storybook/**`에 두고 exact `sourcePath` / `storyTitle` / `storyExport` / `selector` contract를 literal하게 적는다. | 작업 묶음 `taskbar behavior recipient routing gate`, Phase 6 | 없음 |
| later materialize must target bounded Storybook browser owner instead of old external setup blocker | setup-smoke owner는 route reachability와 canonical selector availability만 소유하고, full browser behavior assertion은 같은 Storybook bounded surface를 target하는 later materialize로 넘긴다. | 작업 묶음 `taskbar behavior recipient routing gate`, Phase 6 | 없음 |

## 작업 묶음 지도

| 작업 묶음 | 관련 파일/영역 | 이번에 바꾸는 것 | 유지되는 것 | 완료 판단 |
| --- | --- | --- | --- | --- |
| `shared lifecycle gate` | `packages/ui/src/interactive/taskbar/internal/useTaskbarSurfaceController/**`, `usePresencePhase/**`, `useTaskbarPlacement/**`, `packages/ui/src/components/panels/taskbarAttachedSurface/**` | measured placement winner, root animation boundary, `opening/open/closing` persistence, fixed `10px` gap을 공통 runtime truth로 다시 고정한다. | hook split, consumer-owned exclusivity | visible open이 zero-size provisional placement 없이 actual measurement 뒤에만 나타난다. |
| `public hook pair` | `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/**`, `useTaskbarContextPanel/**` | hover/context 차이를 close scope와 focus restore 여부로만 남기고 missing-ref no-op를 hook 경계에 고정한다. | hook 이름과 분리 export, consumer-owned winner rule | 두 hook을 나란히 읽어도 차이는 hover whitelist/no-focus와 context finalize-focus뿐이다. |
| `serial handoff host` | `packages/ui/src/interactive/taskbar/internal/**`, `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx`, `taskbarMutualExclusion.behavior.stories.tsx` | loser finalize 뒤 winner open, latest intent wins, dismiss cancels queued winner를 host-owned choreography로 고정한다. | live immediate handoff 재사용 금지 | mutual exclusion proof가 serial queue contract를 literal하게 보여 준다. |
| `verification owners` | `packages/ui/src/interactive/taskbar/**/*test*`, `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx`, `taskbar*compare*.test.tsx` | unit/runtime/compare owner를 다시 나누고 17 gate의 겹침과 빈 구멍을 제거한다. | compare kind/state inventory, unrelated regression sweep 금지 | 각 contract가 unit, runtime, compare 중 정확히 하나의 owner로 읽힌다. |
| `browser acceptance recipients` | `packages/ui/src/interactive/taskbar/storybook/*.behavior.stories.tsx`, `taskbarBehaviorHarnesses.tsx` | exact behavior story recipient, stable selector, browser-only acceptance vocabulary를 고정한다. | compare stories visual baseline owner 역할, existing web route owner | browser gate가 exact Storybook behavior recipient만 가리킨다. |
| `storybook browser runner boundary` | `package.json`, `playwright.storybook.config.ts`, `packages/ui/package.json`, `playwright.config.ts` | task 18 전용 Storybook browser command / config / target boundary를 root owner로 분리한다. | existing `test:e2e`, `playwright.config.ts`, `@windows/web` owner | Phase 5는 Storybook build readiness와 runner/config boundary inspection만으로 독립적으로 green이 되고, 첫 Storybook owner listing은 Phase 6이 소유한다. |
| `taskbar behavior recipient routing gate` | `e2e/storybook/**`, existing behavior story/harness source | route helper, taskbar behavior surface registry, setup-smoke owner를 source-tree browser owner로 닫고 browser owner split을 explicit하게 만든다. | unit/runtime/compare owners, exact story source | 첫 `e2e/storybook/**` owner가 여기서 생기므로 `pnpm test:e2e:storybook --list`와 bounded-surface materialize handoff도 이 phase가 닫는다. |

## 공개 계약 요약

| 대상 | public surface | state ownership | callback / handoff | 금지 / no-op |
| --- | --- | --- | --- | --- |
| `useTaskbarHoverPreview` | `triggerRef`, `taskbarRootRef`, delay/motion options, `phase`, `placement`, `getTriggerProps()`, `getSurfaceProps()`, `dismiss()` | hook 내부 open/close state, exclusivity는 consumer-owned | `dismiss()`는 hover만 내리고 host가 필요할 때만 handoff에 쓴다. | missing ref는 `warn + no-op`, focus restore 금지 |
| `useTaskbarContextPanel` | `triggerRef`, `taskbarRootRef`, `phase`, `placement`, `surfaceProps`, `open()`, `close()` | hook 내부 open/close state, exclusivity는 consumer-owned | finalize 시 focus restore는 context만 수행하고 `close()`는 serial loser step으로 재사용될 수 있다. | missing ref는 `warn + no-op`, duplicate close는 no-op |
| `Interactive/Taskbar/*` behavior stories | `Interactive/Taskbar/HoverPreview` `HoverLifecycle`, `Interactive/Taskbar/ContextPanel` `PointerOriginAndEscapeClose`, `Interactive/Taskbar/MutualExclusion` `ConsumerOwnedWinnerRule` | Storybook/browser gate owner | browser acceptance와 user gate는 이 recipient만 본다. | compare story, web route, simplified fixture는 browser gate 대체 불가 |
| `test:e2e:storybook` / `e2e/storybook/**` | root command `test:e2e:storybook`, `playwright.storybook.config.ts`, route helper, surface registry, setup-smoke owner | Storybook browser owner only | Phase 6 registry가 exact `sourcePath` / `storyTitle` / `storyExport` / `selector` contract를 materialize까지 전달한다. | existing `playwright.config.ts` / `test:e2e` / `@windows/web` 재사용 금지 |

## 상태/연동 규칙

| surface | owner | 규칙 | 검증 포인트 |
| --- | --- | --- | --- |
| `shared surface lifecycle` | internal shared runtime | actual measured placement가 준비되기 전에는 visible open이 시작되지 않고 `opening`은 enter `animationend`까지, `closing`은 finalize까지 유지된다. | controller/placement unit, runtime story, browser acceptance |
| `hover preview` | `useTaskbarHoverPreview` | live와 같은 document whitelist close를 유지하고 focus restore는 하지 않는다. resting pointer no-op도 handoff 이후 유지된다. | hover unit, runtime story, browser acceptance |
| `context panel` | `useTaskbarContextPanel` | finalize 시 trigger focus를 복원하고 duplicate close는 no-op다. placement는 actual open 시점 measurement만 사용한다. | context unit, runtime story, browser acceptance |
| `serial handoff queue` | consumer host + internal helper | loser가 fully finalize/unmount된 뒤에만 winner가 열리고 latest intent만 남으며 dismiss는 queued winner를 취소한다. | serial handoff unit, mutual runtime story, browser acceptance |
| `storybook browser owner split` | root Storybook runner + `e2e/storybook/**` | browser owner는 `test:e2e:storybook` / `playwright.storybook.config.ts` / `e2e/storybook/**`만 소유하고 setup-smoke는 route reachability + selector availability only를 소유한다. | Storybook build readiness, Storybook-targeted owner listing, setup-smoke inspection |
| `compare baseline` | compare stories/tests | compare owner는 visual baseline selector, kind/state, frozen attached composition만 소유하고 runtime choreography truth를 소유하지 않는다. | compare tests, source inspection |

## 제외 항목

| 항목 | 이번 계획 처리 | 이유 | 사용자 승인 상태 |
| --- | --- | --- | --- |
| `plans/windows-taskbar-17-interactive-hover-context-parity/**` 수정 | 제외 | read-only reference만 허용된다. | 승인됨 |
| search panel, windows panel, 다른 taskbar family | 제외 | 이번 slug는 hover/context interactive surface만 다룬다. | 승인됨 |
| hook-internal sibling registry, merged public coordinator export | 제외 | consumer-owned exclusivity 계약과 충돌한다. | 승인됨 |
| live repo의 immediate parallel handoff 복원 | 제외 | 이번 작업은 intentional deviation으로 serial handoff를 요구한다. | 승인됨 |
| compare stories를 runtime truth 또는 browser owner로 승격 | 제외 | compare owner는 visual baseline only 계약이다. | 승인됨 |
| task 19를 별도 plan/folder로 복원 | 제외 | task 19는 제거되었고 setup scope는 task 18 Phase 5~6으로만 흡수한다. | 승인됨 |
| existing `playwright.config.ts` / `test:e2e`를 Storybook owner로 재사용 | 제외 | `@windows/web` / `http://localhost:3000` owner는 그대로 유지해야 한다. | 승인됨 |
| setup-smoke owner에서 full browser behavior assertion 수행 | 제외 | setup-smoke는 readiness gate only를 소유하고 full assertion은 later materialize로 넘긴다. | 승인됨 |

## 실행 순서

| Phase | 다루는 작업 묶음 | 이번 단계에서 하는 일 | 끝나면 고정되는 상태 | 다음 단계 인계 |
| --- | --- | --- | --- | --- |
| Phase 1. 공유 lifecycle·measurement gate | `shared lifecycle gate` | actual measurement 뒤 visible open, root animation boundary, fixed `10px` gap, trigger-centered placement를 shared runtime truth로 고정한다. | zero-size provisional snap과 immediate `opening -> open`이 canonical contract에서 제거된다. | Phase 2가 literal하게 연결할 shared lifecycle vocabulary |
| Phase 2. 별도 hook + serial handoff host wiring | `public hook pair`, `serial handoff host` | 두 hook split과 hover/context 차이를 유지한 채 consumer-owned serial queue choreography를 host boundary에 연결한다. | hooks는 separate export를 유지하고 host는 loser finalize 뒤 winner open contract를 가진다. | Phase 3이 owner test로 잠글 winner/loser path와 no-op path |
| Phase 3. unit/runtime/compare owner 재정렬 | `verification owners` | unit, jsdom runtime, compare owner를 재정렬하고 17 gate가 왜 부족한지 source-tree owner 기준으로 명시한다. | compare는 visual baseline으로만 남고 runtime truth와 queue logic은 unit/runtime owner로 이동한다. | Phase 4가 browser gate recipient을 exact story surface로 고정할 수 있는 상태 |
| Phase 4. behavior story browser acceptance recipient 고정 | `browser acceptance recipients` | exact Storybook behavior story recipient, selector, browser-only checklist를 literal하게 닫는다. | browser acceptance는 compare story가 아니라 exact behavior story를 대상으로 하고 later materialization도 그 recipient를 벗어나지 못한다. | Phase 5가 Storybook runner boundary를 별도 owner로 닫을 수 있는 상태 |
| Phase 5. Storybook browser runner boundary | `storybook browser runner boundary` | root canonical command, Storybook-targeted Playwright config, `@windows/ui` / `http://localhost:6006` owner를 task 18 전용 browser boundary로 분리한다. | existing `playwright.config.ts` / `test:e2e` / `@windows/web` owner는 그대로 유지되고 build readiness + runner/config self-check만으로 phase가 green이 된다. | Phase 6이 첫 `e2e/storybook/**` owner file과 owner-listing readiness gate를 source-tree로 닫을 수 있는 상태 |
| Phase 6. taskbar behavior recipient routing + readiness gate | `taskbar behavior recipient routing gate` | `e2e/storybook/**` route helper, surface registry, setup-smoke owner를 추가하고 browser owner split을 explicit하게 닫는다. | unit/runtime/compare owners는 그대로 유지되고 browser owner만 exact Storybook bounded surface로 추가되며 `pnpm test:e2e:storybook --list`가 처음으로 real owner set을 보여 준다. | user gate, plan-review, plan-materialize handoff |

## Phase 실행 카드

### Phase 1. 공유 lifecycle·measurement gate

| 항목 | 내용 |
| --- | --- |
| 목표 | visible opening, placement, enter/exit phase persistence가 shared runtime truth로 고정된다. |
| 변경 내용 | `useTaskbarSurfaceController`, `usePresencePhase`, `useTaskbarPlacement`, attached-surface shared helper와 leaf root boundary를 measured-open + root animation boundary 계약으로 다시 묶는다. |
| 파일 경계 | `packages/ui/src/interactive/taskbar/internal/useTaskbarSurfaceController/**`, `usePresencePhase/**`, `useTaskbarPlacement/**`, `packages/ui/src/components/panels/taskbarAttachedSurface/**`, `taskbarHoverPreview/index.tsx`, `taskbarContextMenu/index.tsx` |
| 이전 상태 | first visible frame가 zero-size placeholder placement를 통과시키거나 `opening`이 즉시 `open`으로 collapse될 수 있다. |
| 이후 상태 | actual measurement 뒤에만 visible open이 시작되고 same mounted root가 enter/exit boundary를 소유한다. |
| 다루는 작업 묶음 | `shared lifecycle gate` |
| 관련 영역 | hook split과 consumer-owned exclusivity는 read-only 전제다. |
| 시작 조건 | `none` |
| 완료 조건 | root animation boundary와 actual measurement gate가 source와 unit owner에서 동시에 드러난다. |
| 상세 문서 | `./phases/01-shared-lifecycle-placement-gate.md` |

### Phase 2. 별도 hook + serial handoff host wiring

| 항목 | 내용 |
| --- | --- |
| 목표 | separate export를 유지한 hover/context hook과 host-owned serial handoff queue contract가 literal하게 연결된다. |
| 변경 내용 | hover/context hook 차이를 hook 경계에서 고정하고 internal helper 또는 동등한 host boundary로 loser finalize 뒤 winner open queue를 묶는다. |
| 파일 경계 | `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/**`, `useTaskbarContextPanel/**`, `packages/ui/src/interactive/taskbar/internal/**`, `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx`, `*.behavior.stories.tsx` |
| 이전 상태 | mutual exclusion은 immediate choreography에 가깝고 latest intent, dismiss cancel, actual-open measurement timing이 literal contract로 남아 있지 않다. |
| 이후 상태 | hooks는 separate export를 유지하고 host는 serial queue winner rule을 explicit하게 가진다. |
| 다루는 작업 묶음 | `public hook pair`, `serial handoff host` |
| 관련 영역 | live repo `useShowTaskPanel`의 immediate group-finalize path는 read-only reference만 허용한다. |
| 시작 조건 | `./phases/01-shared-lifecycle-placement-gate.md` |
| 완료 조건 | hover/context 차이, latest intent wins, dismiss-cancels-queued-winner가 hook/host source에서 분명하다. |
| 상세 문서 | `./phases/02-consumer-serial-handoff-wiring.md` |

### Phase 3. unit/runtime/compare owner 재정렬

| 항목 | 내용 |
| --- | --- |
| 목표 | unit, runtime, compare owner가 겹치지 않고 17 gate의 부족한 부분을 대체한다. |
| 변경 내용 | controller/helper/hook unit owner, real-trigger runtime story owner, compare baseline owner를 다시 나누고 각 contract의 canonical owner를 재지정한다. |
| 파일 경계 | `packages/ui/src/interactive/taskbar/**/*test*`, `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx`, `taskbarHoverPreview.compare.test.tsx`, `taskbarContextPanel.compare.test.tsx`, `*CompareHarness.tsx` |
| 이전 상태 | 17 gate와 현재 source-tree owner는 zero-size provisional acceptance, non-serial handoff, compare-led runtime truth를 충분히 분리하지 못한다. |
| 이후 상태 | logic, jsdom runtime, visual baseline이 서로 다른 owner로 잠기고 browser owner만 뒤에 추가할 수 있다. |
| 다루는 작업 묶음 | `verification owners` |
| 관련 영역 | `plans/windows-taskbar-17-interactive-hover-context-parity/**`는 read-only 비교 근거다. |
| 시작 조건 | `./phases/02-consumer-serial-handoff-wiring.md` |
| 완료 조건 | 각 contract가 정확히 하나의 source-tree owner에 매핑되고 compare owner가 runtime truth를 주장하지 않는다. |
| 상세 문서 | `./phases/03-verification-owner-realignment.md` |

### Phase 4. behavior story browser acceptance recipient 고정

| 항목 | 내용 |
| --- | --- |
| 목표 | mandatory browser acceptance가 exact Storybook behavior story recipient를 literal하게 가진다. |
| 변경 내용 | hover/context/mutual behavior story의 exact title/export, stable selector, browser-only checklist를 고정하고 compare/web route fallback을 금지한다. |
| 파일 경계 | `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx`, `taskbarContextPanel.behavior.stories.tsx`, `taskbarMutualExclusion.behavior.stories.tsx`, `taskbarBehaviorHarnesses.tsx` |
| 이전 상태 | browser acceptance는 mandatory지만 exact Storybook recipient와 selector vocabulary가 literal하지 않아 compare story나 web route로 흐를 수 있다. |
| 이후 상태 | browser gate와 later materialization은 같은 behavior story recipient와 selector vocabulary만 사용한다. |
| 다루는 작업 묶음 | `browser acceptance recipients` |
| 관련 영역 | `playwright.config.ts`는 read-only execution contract reference다. |
| 시작 조건 | `./phases/03-verification-owner-realignment.md` |
| 완료 조건 | browser gate가 exact story recipient와 selector를 지목하고 compare stories나 `@windows/web` route가 대체 수단이 되지 못한다. |
| 상세 문서 | `./phases/04-behavior-story-browser-acceptance.md` |

### Phase 5. Storybook browser runner boundary

| 항목 | 내용 |
| --- | --- |
| 목표 | task 18 전용 Storybook browser runner / command / config boundary를 root level에 분리한다. |
| 변경 내용 | `test:e2e:storybook`, `playwright.storybook.config.ts`, `@windows/ui` Storybook `http://localhost:6006` webServer를 고정하고 existing `playwright.config.ts` / `@windows/web` owner는 그대로 남긴다. |
| 파일 경계 | `package.json`, `playwright.storybook.config.ts`, `packages/ui/package.json`, `playwright.config.ts`(read-only owner separation reference) |
| 이전 상태 | root Playwright owner는 `@windows/web` / `http://localhost:3000`만 설명하고 Storybook-targeted browser boundary는 별도로 없다. |
| 이후 상태 | Storybook browser owner는 root command / config로 분리되고 Phase 5는 build readiness와 runner/config inspection만으로 독립적으로 green이 된다. |
| 다루는 작업 묶음 | `storybook browser runner boundary` |
| 관련 영역 | `playwright.config.ts`, `test:e2e`, `e2e/seed.spec.ts`는 web owner reference로만 남는다. |
| 시작 조건 | `./phases/04-behavior-story-browser-acceptance.md` |
| 완료 조건 | Storybook build readiness command와 Storybook-targeted runner/config boundary가 task 18 browser boundary로 정리되고, Phase 5 검증은 `pnpm --filter @windows/ui build-storybook`와 source inspection만으로 끝난다. `pnpm test:e2e:storybook --list`와 첫 owner listing responsibility는 Phase 6으로 넘겨진다. |
| 상세 문서 | `./phases/05-storybook-browser-runner-boundary.md` |

### Phase 6. taskbar behavior recipient routing + readiness gate

| 항목 | 내용 |
| --- | --- |
| 목표 | `e2e/storybook/**` 아래를 task 18 browser owner source-tree boundary로 닫고 exact recipient routing + readiness gate를 만든다. |
| 변경 내용 | route helper, taskbar behavior surface registry, setup-smoke owner를 추가하고 `sourcePath` / `storyTitle` / `storyExport` / `selector` contract를 literal하게 정의한다. |
| 파일 경계 | `e2e/storybook/**`, `packages/ui/src/interactive/taskbar/storybook/*.behavior.stories.tsx`(read-only recipient source reference), `taskbarBehaviorHarnesses.tsx`(read-only selector source reference) |
| 이전 상태 | exact behavior story recipient는 plan/story source에 있지만 source-tree browser owner file, route helper, readiness gate는 없다. |
| 이후 상태 | browser owner split이 `e2e/storybook/**` exact Storybook recipient로 explicit해지고 setup-smoke는 route reachability + canonical selector availability only를 소유한다. 이 phase가 첫 `e2e/storybook/**` owner set을 만들기 때문에 `pnpm test:e2e:storybook --list`도 여기서 처음 green이 된다. later materialize는 same bounded surface를 target한다. |
| 다루는 작업 묶음 | `taskbar behavior recipient routing gate` |
| 관련 영역 | unit/runtime/compare owner는 Phase 3 contract를 그대로 유지한다. |
| 시작 조건 | `./phases/05-storybook-browser-runner-boundary.md` |
| 완료 조건 | `e2e/storybook/**` owner file만 읽어도 exact recipient, selector, setup-smoke role, bounded-surface materialize handoff가 보이고 `pnpm test:e2e:storybook --list`가 첫 Storybook owner set을 양수 신호로 보여 준다. |
| 상세 문서 | `./phases/06-taskbar-behavior-recipient-routing-and-readiness-gate.md` |

## 승인 체크리스트

- [ ] 요청 대응표가 separate exports, consumer-owned exclusivity, measured-open, serial handoff, browser gate를 모두 빠짐없이 닫는다.
- [ ] 작업 묶음 지도만 읽어도 shared lifecycle, hook pair, serial host, verification owner, browser recipient, Storybook runner boundary, routing gate가 왜 분리됐는지 보인다.
- [ ] 공개 계약 요약과 상태/연동 규칙만 읽어도 hover/context 차이, serial handoff winner rule, compare owner 한계, Storybook browser owner split이 드러난다.
- [ ] 제외 항목에 task 19 비재생성, existing web Playwright owner 유지, setup-smoke bounded scope가 literal하게 보인다.
- [ ] 실행 순서와 phase 카드가 unit/runtime/compare/browser responsibility split을 단계별로 이해 가능하게 만든다.
- [ ] Phase 5가 `test:e2e:storybook` / `playwright.storybook.config.ts` / `@windows/ui` `http://localhost:6006` owner를 existing web Playwright owner와 분리하게 보인다.
- [ ] Phase 6이 `e2e/storybook/**` exact recipient routing, setup-smoke readiness gate, bounded-surface Storybook browser materialize handoff를 literal하게 보여 준다.
