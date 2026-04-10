---
plan_path: ./plans/windows-taskbar-01-foundation-shell/plan.md
task_slug: windows-taskbar-01-foundation-shell
plan_revision: 2f9fa0f40943870c1d32e28b7b11fb1029400443f5f6d2fcf70c7d3258603938
outcome: completed
blocker_type: none
blocker_code: none
next_action: done
resume_from: none
materialize_signature: 88ad56ea7088
---

# windows-taskbar-01-foundation-shell 테스트 materialization 보고서

## 결과

- boundary: `Phase 1 internal Icon boundary`
  - phase: `Phase 1`
  - clause source: `output`, `validation`
  - clause text: taskbar private `Icon`은 `src` 기반 asset icon wrapper이고, package-owned Windows mark asset과 caller-owned asset을 같은 image grammar로 소비한다.
  - clause kind: `test`
  - boundary: `packages/ui/src/components/taskbar/internal/icon/**`
  - scenario contract summary: `Icon` owner는 `src`와 `alt`를 받아 image asset을 직접 렌더링하고, package-owned/caller-owned asset의 wrapper grammar를 분기 없이 공유한다.
  - risk pattern summary: `없음`
  - test type: `skip`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/internal/icon/icon.test.tsx`
  - reason: existing source-tree owner test가 selected contract를 그대로 닫고 있어 이번 resume pass에서는 수정하지 않았다.

- boundary: `Phase 2 Taskbar shell final-interpretation boundary`
  - phase: `Phase 2`
  - clause source: `output`, `failure-validation`, `validation`
  - clause text: `Taskbar`는 rail 높이, glass 배경, border, blur, radius, shadow를 package-owned wrapper/class로 직접 소유하고, caller는 child와 native DOM prop, `className`만 넘긴다.
  - clause kind: `test`
  - boundary: `packages/ui/src/components/taskbar/taskbar/**`
  - scenario contract summary: `Taskbar`는 child composition을 강제하지 않는 단일 rail shell이어야 하고, caller class는 additive merge로만 붙으며 root DOM prop pass-through가 유지돼야 한다.
  - risk pattern summary: `없음`
  - test type: `skip`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/taskbar/taskbar.test.tsx`
  - reason: existing source-tree owner test가 exact selected clause를 닫고 있어 이번 pass에서는 수정하지 않았다.

- boundary: `Phase 2 TaskbarWindowsButton final-interpretation boundary`
  - phase: `Phase 2`
  - clause source: `output`, `failure-validation`, `validation`
  - clause text: `TaskbarWindowsButton`은 native `button`/ARIA prop과 `className`만 public input으로 열고, `windows-mark.png`를 내부 `Icon`으로 직접 소비해야 한다.
  - clause kind: `test`
  - boundary: `packages/ui/src/components/taskbar/taskbarWindowsButton/**`
  - scenario contract summary: root는 `button`이어야 하고 caller의 native button/ARIA prop, `className` additive merge를 유지하면서도 외부 `src` 없이 package-owned Windows mark asset을 image로 소비해야 한다.
  - risk pattern summary: `없음`
  - test type: `skip`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/taskbarWindowsButton/taskbarWindowsButton.test.tsx`
  - reason: existing source-tree owner test가 selected contract를 그대로 닫고 있어 이번 resume pass에서는 수정하지 않았다.

- boundary: `Phase 2 TaskbarSearch final-interpretation boundary`
  - phase: `Phase 2`
  - clause source: `output`, `failure-validation`, `validation`
  - clause text: `TaskbarSearch`는 `placeholder`, `value`, `readOnly`, generic `input` DOM prop을 public input으로 열고, input과 decorative shell을 컴포넌트 내부에서 직접 렌더링한다.
  - clause kind: `test`
  - boundary: `packages/ui/src/components/taskbar/taskbarSearch/**`
  - scenario contract summary: caller는 native input prop만 넘기고도 internal `input`과 decorative shell을 함께 얻고, `className` additive merge를 유지해야 한다.
  - risk pattern summary: `없음`
  - test type: `skip`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/taskbarSearch/taskbarSearch.test.tsx`
  - reason: existing source-tree owner test가 exact selected clause를 닫고 있어 이번 pass에서는 수정하지 않았다.

- boundary: `Phase 2 TaskbarIconButton final-interpretation boundary`
  - phase: `Phase 2`
  - clause source: `output`, `failure-validation`, `validation`
  - clause text: `TaskbarIconButton`은 `status: \"default\" | \"active\" | \"hide\"`와 `iconSrc`를 winner field로 열고, 같은 caller className이어도 상태 차이는 component-owned output으로 드러나야 한다.
  - clause kind: `test`
  - boundary: `packages/ui/src/components/taskbar/taskbarIconButton/**`
  - scenario contract summary: 같은 `iconSrc`와 같은 caller `className`을 써도 `status` 값만 바꾸면 서로 다른 package-owned markup이 나와야 하고, internal `Icon`은 계속 image asset boundary를 소유해야 한다.
  - risk pattern summary: `winner field must drive mutually distinct outputs`
  - test type: `skip`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/taskbarIconButton/taskbarIconButton.test.tsx`
  - reason: existing source-tree owner test가 selected status contract를 그대로 닫고 있어 이번 resume pass에서는 수정하지 않았다.

- boundary: `Phase 2 TaskbarClock final-interpretation boundary`
  - phase: `Phase 2`
  - clause source: `output`, `failure-validation`, `validation`
  - clause text: `TaskbarClock`은 `timeLabel`, `dateLabel`, container DOM prop만 public input으로 열고, formatter ownership 없이 두 줄 block을 직접 렌더링한다.
  - clause kind: `test`
  - boundary: `packages/ui/src/components/taskbar/taskbarClock/**`
  - scenario contract summary: caller가 준 두 문자열이 final output winner가 되고, `className` additive merge를 유지한 채 한 block 안의 두 줄 구조로 읽혀야 한다.
  - risk pattern summary: `없음`
  - test type: `skip`
  - action: `skip`
  - target file: `packages/ui/src/components/taskbar/taskbarClock/taskbarClock.test.tsx`
  - reason: existing source-tree owner test가 exact selected clause를 닫고 있어 이번 pass에서는 수정하지 않았다.

- boundary: `Phase 1 internal Icon validation`
  - phase: `Phase 1`
  - clause source: `validation`
  - clause text: `pnpm --filter @windows/ui exec vitest run src/components/taskbar/internal/icon/icon.test.tsx`
  - clause kind: `execution`
  - boundary: `@windows/ui` Phase 1 owner-test surface
  - scenario contract summary: `Icon` owner test가 current source tree에서 실행돼야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `run`
  - target file: `packages/ui/src/components/taskbar/internal/icon/icon.test.tsx`
  - targeted run command: `pnpm --filter @windows/ui exec vitest run src/components/taskbar/internal/icon/icon.test.tsx`
  - reason: 실행했다. 현재는 `packages/ui/src/components/taskbar/internal/icon/index` 구현 모듈이 없어 red이며, 이는 selected plan contract를 위한 의도된 TDD red 상태다.

- boundary: `Phase 2 foundation shell validation`
  - phase: `Phase 2`
  - clause source: `validation`
  - clause text: `pnpm --filter @windows/ui exec vitest run src/components/taskbar/internal/icon/icon.test.tsx src/components/taskbar/taskbar/taskbar.test.tsx src/components/taskbar/taskbarWindowsButton/taskbarWindowsButton.test.tsx src/components/taskbar/taskbarSearch/taskbarSearch.test.tsx src/components/taskbar/taskbarIconButton/taskbarIconButton.test.tsx src/components/taskbar/taskbarClock/taskbarClock.test.tsx`
  - clause kind: `execution`
  - boundary: `@windows/ui` Phase 2 owner-test surface
  - scenario contract summary: taskbar shell/leaf/internal Icon owner tests가 current source tree에서 실행돼야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `run`
  - target file: `packages/ui/src/components/taskbar/internal/icon/icon.test.tsx`, `packages/ui/src/components/taskbar/taskbar/taskbar.test.tsx`, `packages/ui/src/components/taskbar/taskbarWindowsButton/taskbarWindowsButton.test.tsx`, `packages/ui/src/components/taskbar/taskbarSearch/taskbarSearch.test.tsx`, `packages/ui/src/components/taskbar/taskbarIconButton/taskbarIconButton.test.tsx`, `packages/ui/src/components/taskbar/taskbarClock/taskbarClock.test.tsx`
  - targeted run command: `pnpm --filter @windows/ui exec vitest run src/components/taskbar/internal/icon/icon.test.tsx src/components/taskbar/taskbar/taskbar.test.tsx src/components/taskbar/taskbarWindowsButton/taskbarWindowsButton.test.tsx src/components/taskbar/taskbarSearch/taskbarSearch.test.tsx src/components/taskbar/taskbarIconButton/taskbarIconButton.test.tsx src/components/taskbar/taskbarClock/taskbarClock.test.tsx`
  - reason: 실행했다. 현재는 six-file owner tests가 모두 red이며, 실패 원인은 각 test가 가리키는 `packages/ui/src/components/taskbar/*/index` 구현 모듈이 아직 없기 때문이다.

- boundary: `Phase 1~2 TypeScript no-emit validation`
  - phase: `Phase 1`, `Phase 2`
  - clause source: `validation`
  - clause text: `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - clause kind: `execution`
  - boundary: `@windows/ui` TypeScript surface
  - scenario contract summary: package-level no-emit typecheck는 foundation shell materialization 동안 계속 green이어야 한다.
  - risk pattern summary: `없음`
  - test type: `unit`
  - action: `run`
  - target file: `packages/ui/src/index.ts`
  - targeted run command: `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - reason: 실행했고 green이다. current source tree에서 package-level no-emit surface는 계속 유지된다.

- boundary: `bounded-surface E2E`
  - phase: `Phase 1`, `Phase 2`
  - clause source: `constraint`
  - clause text: 이번 범위는 `packages/ui` 정적 UI만 소유하고, route/desktop scene/outside click/placement 같은 장면 책임은 범위 밖이다.
  - clause kind: `test`
  - boundary: frontend user-visible route surface
  - scenario contract summary: selected plan은 package-only static shell foundation을 다루므로 `/sandbox/taskbar` 같은 route owner surface는 현재 selected boundary에 포함되지 않는다.
  - risk pattern summary: `없음`
  - test type: `skip`
  - action: `skip`
  - target file: `n/a`
  - reason: existing Playwright surface는 selected plan보다 넓은 route-level contract를 다루므로 이번 materialization에서는 bounded-surface E2E를 추가하거나 수정하지 않았다.

## 결론

- 이번 materialization은 `completed`다.
- 기존 taskbar owner tests는 current plan clauses와 drift 없이 맞아, 이번 resume pass에서는 수정하지 않고 재사용했다.
- Vitest red는 plan ambiguity가 아니라 구현 entry 부재 때문에 발생한 의도된 TDD red 상태다.
- production code와 test config는 수정하지 않았다.
