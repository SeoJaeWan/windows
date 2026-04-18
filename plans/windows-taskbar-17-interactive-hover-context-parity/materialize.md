---
plan_path: plans/windows-taskbar-17-interactive-hover-context-parity/plan.md
task_slug: windows-taskbar-17-interactive-hover-context-parity
plan_revision: da77d85ffc31db44c228712638c92e7b40ff0b9d76441b028d6a7733cae3efca
outcome: completed
blocker_type: none
blocker_code: none
next_action: done
resume_from: none
materialize_signature: a0643b826c5d3001
requires_user_decision: false
blocked_clause_ids: []
affected_phase_paths:
  - plans/windows-taskbar-17-interactive-hover-context-parity/phases/01-shared-surface-runtime.md
  - plans/windows-taskbar-17-interactive-hover-context-parity/phases/02-public-hook-parity.md
  - plans/windows-taskbar-17-interactive-hover-context-parity/phases/03-verification-surface-alignment.md
---

# Materialize Report

## 요약

이번 pass는 승인된 revision 기준으로 source-tree test owner와 runtime/compare support 파일을 갱신했다. production code는 수정하지 않았다.

targeted validation은 `packages/ui` 기준으로 실행했고, 실패는 전부 새 contract 미구현에 대응한다. 대표적으로:

- `useTaskbarSurfaceController` 모듈이 아직 없어 새 owner test가 import 단계에서 실패함
- `useTaskbarPlacement`가 여전히 `triggerAnchor + panelWidth/panelHeight` 입력과 top-based y 계산을 사용함
- 두 public hook이 아직 `taskbarRootRef`, `opening 유지`, `warn + no-op`, latest-intent-wins 계약을 구현하지 않음
- runtime harness가 기대하는 hover `placement`와 bottom-based attach contract가 아직 hook/runtime에 없음

## Clause Mapping

| phase | clause source | clause text | clause kind | boundary | scenario contract summary | risk pattern summary | test type | action | target file | targeted run command | reason | canonical contract | rejected sibling candidates |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `01-shared-surface-runtime` | `output` | `useTaskbarSurfaceController`는 `triggerRef + taskbarRootRef + surfaceRootRef` direct contract로 measured placement, animation 경계, session guard를 모은다. | `test` | internal logic boundary | open/close phase와 required ref vocabulary를 internal primitive owner가 직접 소유한다. | competing completion path, loser path no-op | `unit` | `create` | `packages/ui/src/interactive/taskbar/internal/useTaskbarSurfaceController/useTaskbarSurfaceController.test.tsx` | `pnpm vitest run src/interactive/taskbar/internal/useTaskbarSurfaceController/useTaskbarSurfaceController.test.tsx` | 새 primitive owner가 아직 없어서 새 test file로 contract를 먼저 고정했다. | direct ref input, warn+no-op, reduced-motion immediate finalize, stale close completion no-op | caller-resolved rect snapshot contract, ancestor root lookup |
| `01-shared-surface-runtime` | `validation` | `useTaskbarPlacement` owner test는 trigger 중심 x 정렬, horizontal clamp, `taskbarRoot.height + 10px` 부착만 canonical contract로 잠근다. | `test` | pure helper boundary | helper는 `triggerRect + surfaceRect + taskbarRootRect + viewportWidth`만 입력으로 받고 top-based y truth를 버린다. | none | `unit` | `update` | `packages/ui/src/interactive/taskbar/internal/useTaskbarPlacement/useTaskbarPlacement.test.ts` | `pnpm vitest run src/interactive/taskbar/internal/useTaskbarPlacement/useTaskbarPlacement.test.ts` | 기존 owner test가 `triggerTop - gap - panelHeight`와 vertical clamp를 old truth로 고정하고 있어 전체 교체했다. | measured surface width + fixed bottom attach contract | old `panelWidth/panelHeight` / `viewportHeight` contract |
| `02-public-hook-parity` | `output` | hover hook은 explicit `taskbarRootRef`, document whitelist close, `opening` 유지, missing ref `warn + no-op`을 가진다. | `test` | logic boundary | hover open은 delay 뒤 `opening`으로 들어가고, outside document activity로 close scope를 관리하며, missing root ref는 no-op이어야 한다. | stale transition loser path | `unit` | `update` | `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx` | `pnpm vitest run src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx` | 기존 owner test가 element leave와 즉시 `open`을 truth로 잠가 전면 재작성했다. | explicit root ref, opening before enter completion, document-level outside close, resting pointer gate | element-only leave close, immediate `open`, implicit root discovery |
| `02-public-hook-parity` | `output` | context hook은 explicit `taskbarRootRef`, measured placement, focus restore, duplicate close no-op, stale transition 무효화를 같이 드러낸다. | `test` | logic boundary | context open은 rendered surface rect와 taskbar root height로 placement를 계산하고, close finalize만 focus restore를 허용한다. | stale transition loser path, side effect coupled to state | `unit` | `update` | `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/useTaskbarContextPanel.test.tsx` | `pnpm vitest run src/interactive/taskbar/useTaskbarContextPanel/useTaskbarContextPanel.test.tsx` | 기존 owner test가 top-based y와 immediate `open`을 고정하고 있어 새 contract로 교체했다. | explicit root ref, bottom attach placement, focus restore on finalize, duplicate close no-op | pointer-position fallback, implicit root sourcing |
| `02-public-hook-parity` | `output` | runtime owner harness는 hook에 explicit `taskbarRootRef`를 직접 주입하고 hook-supplied surface wiring을 소비한다. | `test` | runtime host wiring boundary | hover/context/mutual harness는 ancestor lookup 대신 strip ref를 hook input으로 전달해야 한다. | host choreography depends on correct ref source | `unit` | `update` | `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | `pnpm vitest run src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx` | 기존 harness가 hover ad hoc geometry와 implicit host assumptions을 갖고 있어 host wiring contract에 맞게 정리했다. | explicit taskbar strip ref injection + hook placement consumption | host-side geometry formula as runtime truth |
| `03-verification-surface-alignment` | `output` | runtime owner는 explicit `taskbarRootRef` injection, animation 경계, consumer-owned winner rule을 직접 검증한다. | `test` | bounded runtime owner | rendered harness stories에서 hover/context attach bottom, `opening` phase, document-level hover close, host-owned context winner를 검증한다. | consumer-owned winner/loser path | `unit` | `update` | `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx` | `pnpm vitest run src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx` | 기존 runtime owner가 top-based geometry와 immediate-open wording을 허용해 canonical contract를 다시 썼다. | explicit root injection + bottom attach + opening + host-owned mutual exclusion | compare owner, package-wide regression sweep |
| `03-verification-surface-alignment` | `output` | hover compare owner pair는 visual baseline selector와 frozen attached composition만 맡는다. | `test` | compare visual owner | compare story는 trigger + attached hover surface + rested phase만 유지하고 runtime geometry truth를 주장하지 않는다. | none | `unit` | `update` | `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.test.tsx`, `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreviewCompareHarness.tsx` | `pnpm vitest run src/interactive/taskbar/storybook/taskbarHoverPreview.compare.test.tsx` | width formula와 runtime wording을 visual baseline 책임으로 축소했다. | compare root selector + frozen composition only | runtime placement or motion ownership |
| `03-verification-surface-alignment` | `output` | context compare owner pair는 visual baseline selector와 frozen attached composition만 맡는다. | `test` | compare visual owner | compare story는 trigger + attached context surface + pinned rows만 유지하고 row-derived top을 runtime truth로 사용하지 않는다. | none | `unit` | `update` | `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.test.tsx`, `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanelCompareHarness.tsx` | `pnpm vitest run src/interactive/taskbar/storybook/taskbarContextPanel.compare.test.tsx` | row-derived geometry wording을 visual baseline 책임으로 축소했다. | compare root selector + frozen composition only | runtime geometry or hook lifecycle ownership |
| `01-shared-surface-runtime`, `02-public-hook-parity`, `03-verification-surface-alignment` | `validation` | changed owner test files는 가장 좁은 vitest surface로 검증한다. | `execution` | targeted validation | `packages/ui` workdir에서 changed owner test files만 직접 실행한다. | validation failure should stay local to unimplemented contract | `unit` | `run` | `packages/ui` | `pnpm vitest run src/interactive/taskbar/internal/useTaskbarPlacement/useTaskbarPlacement.test.ts src/interactive/taskbar/internal/useTaskbarSurfaceController/useTaskbarSurfaceController.test.tsx src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx src/interactive/taskbar/useTaskbarContextPanel/useTaskbarContextPanel.test.tsx src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx src/interactive/taskbar/storybook/taskbarHoverPreview.compare.test.tsx src/interactive/taskbar/storybook/taskbarContextPanel.compare.test.tsx` | compare owner tests는 통과했고, 나머지 실패는 모두 아직 남아 있는 old implementation / missing primitive에 대응한다. | narrow package-local vitest command only | root-level full suite, package-wide regression sweep |

## Validation 결과

- 성공:
  - `src/interactive/taskbar/storybook/taskbarHoverPreview.compare.test.tsx`
  - `src/interactive/taskbar/storybook/taskbarContextPanel.compare.test.tsx`
- 실패:
  - `src/interactive/taskbar/internal/useTaskbarSurfaceController/useTaskbarSurfaceController.test.tsx`
    - 새 module 미구현으로 import resolve 실패
  - `src/interactive/taskbar/internal/useTaskbarPlacement/useTaskbarPlacement.test.ts`
    - old helper signature(`triggerAnchor`, `panelWidth`, `panelHeight`)와 새 measured-rect contract 불일치
  - `src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx`
    - explicit `taskbarRootRef`, `opening` 유지, document-level outside close, stale loser-path no-op 미구현
  - `src/interactive/taskbar/useTaskbarContextPanel/useTaskbarContextPanel.test.tsx`
    - explicit `taskbarRootRef`, bottom-attach placement, duplicate close/open phase, stale loser-path no-op 미구현
  - `src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx`
    - hover placement output 미구현, context bottom-attach 미구현, runtime host wiring contract 미반영

## 변경 파일

- `packages/ui/src/interactive/taskbar/internal/useTaskbarPlacement/useTaskbarPlacement.test.ts`
- `packages/ui/src/interactive/taskbar/internal/useTaskbarSurfaceController/useTaskbarSurfaceController.test.tsx`
- `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx`
- `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/useTaskbarContextPanel.test.tsx`
- `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx`
- `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx`
- `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.compare.test.tsx`
- `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreviewCompareHarness.tsx`
- `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.compare.test.tsx`
- `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanelCompareHarness.tsx`
