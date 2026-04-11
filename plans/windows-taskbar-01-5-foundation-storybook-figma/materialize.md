---
plan_path: ./plans/windows-taskbar-01-5-foundation-storybook-figma/plan.md
task_slug: windows-taskbar-01-5-foundation-storybook-figma
plan_revision: dbf05cccf65c106aedbe119173185a2266698c5e1d5019615f6a371a6bd11dc6
outcome: completed
blocker_type: none
blocker_code: none
next_action: done
resume_from: none
materialize_signature: c55127a1db5e
---

# windows-taskbar-01-5-foundation-storybook-figma 테스트 materialization 보고서

## 결과

- boundary: `Phase 1 Storybook bootstrap config boundary`
  - phase: `Phase 1`
  - clause source: `output`, `constraint`, `failure-validation`
  - clause text: `@windows/ui` package-local Storybook bootstrap은 `packages/ui/package.json`과 `packages/ui/.storybook/**`가 owner여야 하고, taskbar leaf story discovery만 열며 app/web prerequisite와 Phase 2 literal을 아직 요구하지 않아야 한다.
  - clause kind: `test`
  - boundary: `packages/ui/package.json`, `packages/ui/.storybook/**`
  - scenario contract summary: package.json이 `storybook`/`build-storybook` script와 Storybook devDependency ownership을 닫고, `.storybook` main config가 `src/components/taskbar/**/*.stories.tsx`만 discovery 대상으로 잡으면서 `@windows/web dev`, `localhost:3000`, `sandbox/taskbar`, exact title/story id/marker/recipient literal을 끌어오지 않아야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `create`
  - target file: `packages/ui/src/components/taskbar/storybook/storybookBootstrap.test.ts`
  - reason: existing source-tree owner test가 없어서 새 bootstrap boundary test를 추가했다. 현재 red 원인은 package.json에 Storybook script/devDependency가 없고 `.storybook` bootstrap directory가 아직 없기 때문이다.
  - canonical contract: package-local bootstrap only, taskbar leaf-only discovery, no app/web prerequisite, no Phase 2 literal leakage
  - rejected sibling candidates: root Playwright route spec rejected because it owns `/sandbox/taskbar`, not package-local Storybook bootstrap

- boundary: `Phase 2 foundation registration literal and Reference story boundary`
  - phase: `Phase 2`
  - clause source: `output`, `constraint`, `failure-validation`
  - clause text: `foundationFigmaRegistration.ts`와 Windows/Search/Icon/Clock `Reference` stories가 exact title/export/story id/marker/recipient contract, fixed reference props, shared icon asset, no combined Taskbar/route predecessor를 함께 닫아야 한다.
  - clause kind: `test`
  - boundary: `packages/ui/src/components/taskbar/storybook/**`, `packages/ui/src/components/taskbar/*/*.stories.tsx`
  - scenario contract summary: helper가 exact registration literal의 single source of truth여야 하고, 각 leaf story는 package-local registration stage에서 public leaf를 직접 렌더링해야 한다. `TaskbarIconButton`은 같은 owner story 안에서 `default -> active -> hide` trio를 shared asset과 fixed marker로 보여 줘야 한다.
  - risk pattern summary: `TaskbarIconButton reference trio는 같은 owner story에서 fixed order와 shared asset을 유지해야 한다.`
  - test type: `unit`
  - action: `create`
  - target file: `packages/ui/src/components/taskbar/storybook/foundationFigmaRegistration.test.tsx`
  - reason: existing source-tree owner test가 없어 새 registration boundary test를 추가했다. 현재 red 원인은 helper source, icon fixture asset, leaf `.stories.tsx` modules가 모두 아직 없기 때문이다.
  - canonical contract: exact titles/ids/markers + one recipient URL + fixed props (`Windows`, `Search`, `09:41`, `2026-04-10`) + no combined story or app/web prerequisite
  - rejected sibling candidates: config-only grep rejected because it cannot close rendered `Reference` output; root Playwright surface rejected because it is route-scoped and explicitly out of scope

- boundary: `Phase 1~2 package unit validation`
  - phase: `Phase 2`
  - clause source: `validation`
  - clause text: `pnpm --filter @windows/ui test`
  - clause kind: `execution`
  - boundary: `@windows/ui` package test surface
  - scenario contract summary: package test command must execute the new Storybook bootstrap/registration contract tests together with the existing taskbar foundation tests.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `run`
  - target file: `packages/ui/src/components/taskbar/storybook/storybookBootstrap.test.ts`, `packages/ui/src/components/taskbar/storybook/foundationFigmaRegistration.test.tsx`
  - targeted run command: `pnpm --filter @windows/ui test`
  - reason: 실행했다. 기존 foundation owner tests 12개는 green을 유지했고, 새 Storybook contract tests 8개만 missing script/file 때문에 red다.

- boundary: `Phase 1~2 TypeScript no-emit validation`
  - phase: `Phase 1`, `Phase 2`
  - clause source: `validation`
  - clause text: `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - clause kind: `execution`
  - boundary: `@windows/ui` TypeScript surface
  - scenario contract summary: source-tree test additions이 package-level no-emit typecheck를 깨지 않아야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `run`
  - target file: `packages/ui/tsconfig.json`
  - targeted run command: `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - reason: 실행했고 green이다. test setup/config는 건드리지 않고 Storybook contract tests만 추가한 상태에서 타입 표면은 유지된다.

- boundary: `Phase 1 Storybook script discovery validation`
  - phase: `Phase 1`
  - clause source: `validation`
  - clause text: `rg -n '"storybook"|"build-storybook"' .\\packages\\ui\\package.json`
  - clause kind: `execution`
  - boundary: `packages/ui/package.json`
  - scenario contract summary: package-local Storybook scripts가 package.json에 literal로 보여야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `run`
  - target file: `packages/ui/package.json`
  - targeted run command: `rg --no-messages -n '"storybook"|"build-storybook"' .\\packages\\ui\\package.json`
  - reason: 실행했고 no match다. 현재 package.json에는 Storybook script가 아직 없다.

- boundary: `Phase 1 bootstrap build validation`
  - phase: `Phase 1`
  - clause source: `validation`
  - clause text: `pnpm --filter @windows/ui build-storybook`
  - clause kind: `execution`
  - boundary: `@windows/ui` Storybook build surface
  - scenario contract summary: package-local Storybook build 진입점이 exact leaf registration literal 없이도 standalone bootstrap으로 떠야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `run`
  - target file: `packages/ui/package.json`
  - targeted run command: `pnpm --filter @windows/ui build-storybook`
  - reason: 실행했고 `ERR_PNPM_RECURSIVE_RUN_NO_SCRIPT`로 실패했다. bootstrap script 자체가 아직 없다는 점을 새 owner test와 같은 방향으로 증명한다.

- boundary: `Phase 1 bootstrap no-prerequisite validation`
  - phase: `Phase 1`
  - clause source: `validation`
  - clause text: `rg -n "@windows/web dev|localhost:3000|sandbox/taskbar" .\\packages\\ui\\.storybook .\\packages\\ui\\package.json`
  - clause kind: `execution`
  - boundary: `packages/ui/.storybook/**`, `packages/ui/package.json`
  - scenario contract summary: bootstrap source가 app/web route prerequisite를 다시 열지 않아야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `run`
  - target file: `packages/ui/.storybook/**`, `packages/ui/package.json`
  - targeted run command: `rg --no-messages -n '@windows/web dev|localhost:3000|sandbox/taskbar' .\\packages\\ui\\.storybook .\\packages\\ui\\package.json`
  - reason: 실행 결과는 empty였다. 다만 `.storybook` directory 자체가 아직 없으므로 이 empty result만으로 bootstrap contract가 성립한 것은 아니고, missing bootstrap failure는 `storybookBootstrap.test.ts`가 owner로 잡는다.

- boundary: `Phase 2 emitted Storybook proof surface`
  - phase: `Phase 2`
  - clause source: `validation`
  - clause text: `pnpm --filter @windows/ui storybook`의 `iframe.html?id=...` 경로와 `packages/ui/storybook-static/index.json` emitted story id proof surface
  - clause kind: `execution`
  - boundary: `packages/ui/storybook-static/index.json`
  - scenario contract summary: Storybook dev server와 built story index가 `taskbar-foundation-(windows|search|icon|clock)--reference` emitted id와 exact marker를 노출해야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `run`
  - target file: `packages/ui/storybook-static/index.json`
  - targeted run command: `pnpm --filter @windows/ui storybook`, `rg --no-messages -n '"id":"taskbar-foundation-(windows|search|icon|clock)--reference"' .\\packages\\ui\\storybook-static\\index.json`
  - reason: live `storybook` iframe 검증은 script 부재로 아직 실행 불가다. `index.json` grep도 no match이며, 이는 emitted proof surface가 아직 생성되지 않았다는 뜻이다.

- boundary: `Phase 2 recipient literal validation`
  - phase: `Phase 2`
  - clause source: `validation`
  - clause text: `rg -n "NrUGKPZUewpuA8XuHI0v5n" .\\packages\\ui\\src\\components\\taskbar`
  - clause kind: `execution`
  - boundary: `packages/ui/src/components/taskbar/storybook/foundationFigmaRegistration.ts`
  - scenario contract summary: production source tree가 exact Figma recipient URL literal을 보유해야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `run`
  - target file: `packages/ui/src/components/taskbar/storybook/foundationFigmaRegistration.ts`
  - targeted run command: `rg --no-messages -n 'NrUGKPZUewpuA8XuHI0v5n' .\\packages\\ui\\src\\components\\taskbar`
  - reason: 실행했고 no match다. test source가 false positive를 만들지 않도록 raw key literal은 테스트 안에서 분해해 조합했다.

- boundary: `Phase 2 no-combined-story validation`
  - phase: `Phase 2`
  - clause source: `validation`
  - clause text: `rg -n "Taskbar Foundation/Taskbar|Taskbar/Reference Shell|Taskbar/Projection States|Taskbar/Standalone Surfaces|sandbox/taskbar" .\\packages\\ui\\.storybook .\\packages\\ui\\src\\components\\taskbar`
  - clause kind: `execution`
  - boundary: `packages/ui/.storybook/**`, `packages/ui/src/components/taskbar/**`
  - scenario contract summary: combined Taskbar composition story나 route-based predecessor literal이 registration source에 다시 들어오지 않아야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `run`
  - target file: `packages/ui/.storybook/**`, `packages/ui/src/components/taskbar/**`
  - targeted run command: `rg --no-messages -n 'Taskbar Foundation/Taskbar|Taskbar/Reference Shell|Taskbar/Projection States|Taskbar/Standalone Surfaces|sandbox/taskbar' .\\packages\\ui\\.storybook .\\packages\\ui\\src\\components\\taskbar`
  - reason: 실행 결과는 empty였다. 그러나 current tree에는 registration source 자체가 아직 없으므로, selected contract의 positive side는 `foundationFigmaRegistration.test.tsx`가 owner로 닫는다.

## 결론

- 이번 materialization은 `completed`다.
- source-tree test 두 파일을 새로 추가했고, production code와 test config는 수정하지 않았다.
- 현재 red는 Storybook bootstrap script/config와 foundation registration helper/story/asset 부재에만 연결된다.
- `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`은 green이다.
