---
plan_path: plans/windows-taskbar-18-interactive-hover-context-serial-handoff/plan.md
task_slug: windows-taskbar-18-interactive-hover-context-serial-handoff
plan_revision: 878a36ad7a29c84ce324228e123207c4b2df3a999f47f346b5b796460c587c52
outcome: blocked
gate_status: blocked
blocker_type: external_setup
blocker_code: setup_missing
next_action: stop
resume_from: materialize
materialize_signature: 45acf1f893a0
requires_user_decision: false
blocked_clause_ids:
  - phase-05-storybook-runner-boundary
  - phase-05-storybook-validation-boundary
  - phase-06-storybook-owner-listing-boundary
  - phase-06-storybook-owner-routing-boundary
affected_phase_paths:
  - plans/windows-taskbar-18-interactive-hover-context-serial-handoff/phases/04-behavior-story-browser-acceptance.md
  - plans/windows-taskbar-18-interactive-hover-context-serial-handoff/phases/05-storybook-browser-runner-boundary.md
  - plans/windows-taskbar-18-interactive-hover-context-serial-handoff/phases/06-taskbar-behavior-recipient-routing-and-readiness-gate.md
---

# Materialize Blocker

## 상태

- 결과: `blocked`
- 게이트 상태: `blocked`
- 차단 유형: `external_setup`
- 차단 코드: `setup_missing`
- 재개 지점: `materialize`

이번 차단은 더 이상 예전 Phase 4 단독 recipient 해석 문제가 아닙니다.  
현재 authoritative revision `878a36ad7a29c84ce324228e123207c4b2df3a999f47f346b5b796460c587c52` 기준으로 다시 읽은 결과, 차단의 핵심은 **Phase 5/6이 요구하는 Storybook runner/setup boundary가 아직 소스 트리에 존재하지 않고, 이 materialize 패스는 non-test setup/config 파일을 수정할 수 없다는 점**입니다.

## 현재 revision 기준 재평가

다음 입력을 다시 읽고 판단했습니다.

- `./.codex/artifacts/plan/windows-taskbar-18-interactive-hover-context-serial-handoff/state.json`
- `./plans/windows-taskbar-18-interactive-hover-context-serial-handoff/plan.md`
- `state.json.linked_phase_paths` 의 6개 phase 파일 전체
- `./.codex/artifacts/plan-review/windows-taskbar-18-interactive-hover-context-serial-handoff/review.md`

현재 계획은 browser owner를 예전처럼 막연한 Storybook recipient로만 두지 않습니다.  
대신 아래 boundary를 명시적으로 추가했습니다.

- Phase 5: dedicated Storybook runner boundary
  - root command `test:e2e:storybook`
  - dedicated config `playwright.storybook.config.ts`
  - target `@windows/ui` / `http://localhost:6006`
- Phase 6: bounded Storybook owner boundary
  - `e2e/storybook/**`
  - exact recipient routing helper / registry
  - `setup-smoke` owner
  - first owner listing proof

## 실제 소스 트리 확인 결과

현재 워크트리에서 확인된 상태는 다음과 같습니다.

- `playwright.storybook.config.ts`: 없음
- root `package.json` 의 `test:e2e:storybook` script: 없음
- `e2e/storybook/**`: 없음
- 기존 `playwright.config.ts`: 여전히 `@windows/web` / `http://localhost:3000` 전용
- `packages/ui/package.json`: `storybook`, `build-storybook` script 는 존재

즉, Phase 4의 exact behavior recipient는 계획에 의해 충분히 고정되었지만,  
그 recipient를 실제 browser owner로 소유하기 위한 **Phase 5 runner boundary** 와 **Phase 6 source-tree owner boundary** 가 아직 repo에 없습니다.

## 왜 이 패스에서 계속 막히는가

이번 skill의 write scope는 다음으로 제한됩니다.

- source-tree test files only
- `materialize.md`
- production code / non-test setup / config 수정 금지

그래서 아래 항목은 이번 패스에서 만들 수 없습니다.

- root `package.json` script 추가
- `playwright.storybook.config.ts` 추가
- existing Playwright owner 분리용 non-test setup 정비

반면 current revision의 browser materialization은 바로 그 non-test setup boundary를 prerequisite로 삼습니다.  
즉, blocker는 **Storybook recipient가 불명확해서가 아니라**, 현재 revision의 **Phase 5/6 setup boundary를 materializer가 합법적으로 구현할 수 없기 때문에** 여전히 real blocker 입니다.

## Affected Owner Scan

| owner surface | current owner | decision | reason |
| --- | --- | --- | --- |
| unit owner | `packages/ui/src/interactive/taskbar/internal/*.test.*`, `useTaskbarHoverPreview.test.tsx`, `useTaskbarContextPanel.test.tsx` | keep | browser owner prerequisite가 없는 상태에서 partial owner만 갱신하면 현재 revision 전체 계약을 닫지 못함 |
| runtime owner | `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx` | keep | bounded Storybook browser owner 없이 runtime owner만 먼저 늘리면 current revision의 owner split 완료로 볼 수 없음 |
| compare owner | `taskbarHoverPreview.compare.test.tsx`, `taskbarContextPanel.compare.test.tsx` | keep | compare owner는 visual baseline only로 남아야 하며 browser owner 대체재가 될 수 없음 |
| bounded browser owner | `e2e/storybook/**` | block | 현재 repo에 owner tree 자체가 없고, prerequisite runner/config boundary도 없음 |

## Blocked Clauses

| phase | clause source | clause text | clause kind | boundary | scenario contract summary | risk pattern summary | test type | action | target file | targeted run command | reason | canonical contract | rejected sibling candidates |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Phase 5 | output | root canonical command / dedicated Storybook Playwright config / `@windows/ui` `http://localhost:6006` owner split | execution | root `package.json`, `playwright.storybook.config.ts` | bounded Storybook browser owner가 existing web owner와 분리된 command/config boundary를 가져야 함 | setup prerequisite missing | block | block | `package.json`, `playwright.storybook.config.ts` | none | non-test setup/config 파일이라 이번 materialize 패스에서 수정 불가 | Storybook owner는 web owner와 분리되어야 함 | existing `playwright.config.ts`, `test:e2e`, `@windows/web` route |
| Phase 5 | validation | Storybook build readiness + runner/config self-sufficient validation boundary | execution | same as above | later `e2e/storybook/**` owner가 붙기 전에 Storybook runner boundary가 독립적으로 성립해야 함 | setup prerequisite missing | block | block | `package.json`, `playwright.storybook.config.ts` | `pnpm --filter @windows/ui build-storybook` 이후 dedicated Storybook runner inspection 필요 | build script는 있으나 dedicated runner/config source 자체가 아직 없음 | `@windows/ui` Storybook target boundary | existing web Playwright boundary |
| Phase 6 | output | `e2e/storybook/**` exact recipient routing helper / registry / setup-smoke owner | test | `e2e/storybook/**` | exact `sourcePath` / `storyTitle` / `storyExport` / `selector` contract를 source-tree browser owner로 고정해야 함 | first owner boundary depends on missing runner split | block | block | `e2e/storybook/**` | none | test tree는 만들 수 있어도 runner/config prerequisite 없이 targeted validation 불가, selected Phase 5/6 contract를 합법적으로 닫지 못함 | bounded Storybook owner only | compare stories, `@windows/web` route tests, stale Phase 4-only framing |
| Phase 6 | validation | first Storybook owner listing proof and readiness gate | execution | bounded Storybook runner + `e2e/storybook/**` | first listing proof가 bounded Storybook owner set만 보여야 함 | owner listing depends on missing setup boundary | block | block | `e2e/storybook/**` plus Storybook runner boundary | direct listing command unavailable in current tree | current repo에는 `test:e2e:storybook` script도 dedicated config도 없어 listing validation을 current revision contract대로 실행할 수 없음 | first bounded Storybook owner proof | default Playwright web owner |

## Validation

- targeted validation: 미실행
- reason:
  - current revision의 selected browser clauses는 Phase 5/6 non-test setup boundary를 prerequisite로 삼음
  - 이번 skill은 non-test setup/config 파일을 수정할 수 없음
  - 그래서 affected owner-test set 전체에 대한 narrow validation command를 current revision contract대로 구성할 수 없음

## 현재 blocker가 여전히 real 인가

예. **현재 revision에서도 blocker는 여전히 real** 입니다.

다만 이유는 예전 report처럼 “Storybook recipient가 막연해서”가 아닙니다.  
현재는 recipient 자체는 plan에서 충분히 고정되어 있습니다.

실제 blocker는 아래입니다.

1. Phase 5가 요구하는 dedicated Storybook runner/config boundary가 아직 소스 트리에 없음
2. 그 boundary는 non-test setup/config 파일 수정이 필요함
3. 이번 materialize 패스는 test files와 `materialize.md` 만 수정 가능함
4. 따라서 Phase 6 bounded browser owner를 current revision contract대로 생성하고 검증할 합법적 기반이 없음

## 다음 재개 조건

다음 중 하나가 먼저 충족되면 materialize를 재개할 수 있습니다.

1. non-test setup/config 구현 패스에서 아래를 먼저 추가
   - root `package.json` 에 `test:e2e:storybook`
   - `playwright.storybook.config.ts`
   - Storybook runner target을 `@windows/ui` / `http://localhost:6006` 로 분리
2. 그 이후 materialize 패스에서 아래 test-tree owner를 생성
   - `e2e/storybook/shared/storybookRoute.ts`
   - `e2e/storybook/taskbar/taskbarBehaviorSurfaceRegistry.ts`
   - `e2e/storybook/taskbar/taskbarBehavior.setup-smoke.spec.ts`

현재 패스에서는 위 setup prerequisite가 없으므로 여기서 중단합니다.
