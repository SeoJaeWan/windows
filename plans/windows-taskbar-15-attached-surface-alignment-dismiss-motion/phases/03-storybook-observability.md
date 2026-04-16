# Phase 3. behavior Storybook 정합성 보강

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | behavior Storybook이 taskbar-center 보정이나 reduced-motion masking 없이 attached-surface의 실제 anchor, dismiss, motion을 보여 주게 만들고, rendered story runtime-proof test가 그 관찰 가능성을 증명한다. |
| 선행조건 | Phase 2의 leaf motion lifecycle이 stable해야 한다. |
| 완료 판단 | `Interactive/Taskbar/*` stories를 실제로 mount하는 runtime-proof test와 Storybook build를 함께 보면 hover/context surface가 trigger 중심에 붙고 `Escape`/outside dismiss와 full motion이 직접 관찰 가능해야 한다. |
| 중단 조건 | Storybook 정합성을 맞추기 위해 component visual inventory나 compare state를 늘려야 하면 범위가 바뀌므로 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 교체 | harness는 behavior-only host다. hover placement는 trigger-centered host example로 보여 주고, context는 hook placement 결과를 그대로 쓴다. runtime-proof test가 쓸 stable selector와 outside target도 이 경계가 소유한다. | taskbar-center `left: 50%` 보정과 forced reduced motion이 사라지고 trigger-centered/outside-dismiss host와 stable runtime-proof selector가 source에 드러난다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx` | 정리 | hover story는 anchor와 motion을 가리는 local CSS trick을 두지 않는다. | title/description/render가 trigger-centered hover attach와 full motion을 설명한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.behavior.stories.tsx` | 정리 | context story는 `Escape`, outside dismiss, focus restore를 explicit contract로 문서화한다. | story source만 읽어도 anchor와 dismiss winner rule이 분명하다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarMutualExclusion.behavior.stories.tsx` | 정리 | mutual exclusion story는 consumer-owned coordination을 유지하되 position/dismiss/motion fidelity를 가리지 않는다. | hover/context winner rule과 resting pointer no-op가 story에서 그대로 드러난다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx` | 추가 | 실제 story render를 mount하는 runtime-proof test가 생기고, trigger-centered alignment, `Escape`/outside dismiss, full motion observability를 rendered behavior story 기준으로 검증한다. | grep/source inspection 없이도 rendered story가 contract를 드러내는지 repo-local test에서 직접 증명된다. |

### 완료 증거

- behavior harness source에 `left: "50%"` taskbar-center hover wrapper와 `motionPreference: 'reduced'`가 남지 않는다.
- runtime-proof test가 실제 `HoverPreview`, `ContextPanel`, `MutualExclusion` story render를 mount해 trigger-centered alignment와 `Escape`/outside dismiss를 검증한다.
- runtime-proof test가 full motion 경로에서 `opening/open/closing` 관찰 또는 동등한 motion marker 전이를 검증한다.

- owner_agent: `frontend-developer`
- 목적:
  - package-local behavior stories를 실제 runtime contract의 observable evidence로 되돌린다.
- boundary:
  - `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.behavior.stories.tsx`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarMutualExclusion.behavior.stories.tsx`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx`
- input:
  - Phase 1의 anchor/dismiss runtime contract
  - Phase 2의 leaf motion lifecycle
  - existing `Interactive/Taskbar/*` story taxonomy
  - repo-local rendered-story test convention:
    - `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`
  - read-only reference:
    - `C:\Users\USER\Desktop\dev\blog\src\hooks\useShowTaskPanel/index.tsx`
    - `C:\Users\USER\Desktop\dev\blog\src\components\atoms\taskIconButton\hooks\usePanel/index.tsx`
  - 사용자 합의:
    - hover/context surface는 taskbar 전체 중앙이 아니라 `TaskbarIconButton` 중심에 붙어야 한다.
    - `Escape`와 outside dismiss가 story에서도 보이는 상태여야 한다.
    - full motion이 보여야 attached-surface direction 차이를 검토할 수 있다.
- output:
    - 공개 계약:
      - `HoverPreview` behavior story는 trigger-centered hover host example과 full motion open/close를 보여 준다.
      - `ContextPanel` behavior story는 trigger-centered placement, `Escape`, outside dismiss, focus restore를 보여 준다.
      - `MutualExclusion` behavior story는 consumer-owned `hover.dismiss()` + `context.close()` coordination, resting pointer no-op, trigger-centered surface positioning을 유지한다.
      - `taskbarBehaviorStories.runtime.test.tsx`는 실제 story exports의 `render()`를 mount해 rendered story 기준으로 trigger-centered placement, `Escape`/outside dismiss, full motion observability를 검증한다.
    - 내부 기본값:
      - shared harness는 trigger ref, surface root, outside-click target, desktop backdrop, taskbar strip를 공통 owner로 두고 runtime-proof test가 쓸 stable selector를 제공한다.
      - motion masking을 피하기 위해 story 기본 경로는 reduced motion override를 쓰지 않는다.
      - runtime-proof test는 existing jsdom + `createRoot`/`act` 관례를 따르고, 필요한 trigger rect와 viewport는 test 안에서 stub한다.
      - build-storybook은 discovery/build smoke로 유지하되, observability proof의 canonical owner는 runtime-proof test다.
      - compare state inventory와 component visual stories는 건드리지 않는다.
    - 허용하지 않는 대안:
      - hover surface를 `left: 50%`로 stage 중앙에 고정하는 방식
      - build-storybook, grep, source inspection만으로 observability proof를 대신하는 방식
      - behavior story에서만 dismiss나 motion을 가리는 demo-only 보정을 넣는 방식
      - visual inventory/compare state를 늘려 behavior Storybook 문제를 덮는 방식
- 선행조건:
  - Phase 2의 leaf motion lifecycle이 안정돼 있어야 한다.
- 제약:
  - Storybook support 파일은 public export가 아니다.
  - component visual inventory와 compare taxonomy는 유지한다.
  - observability proof는 rendered story boundary를 직접 mount하는 repo-local test가 소유해야 한다.
- side effects:
  - Storybook이 attached-surface contract의 package-local 검토 표면이 된다.
  - 이후 cold review와 materialize가 story source뿐 아니라 rendered-story runtime proof test를 repo-local observable evidence로 사용할 수 있다.
- failure/validation:
  - behavior story가 실제 hook/leaf contract가 아닌 story-only position hack에 의존하면 실패다.
  - rendered story를 직접 mount하지 않는 proof surface라면 실패다.
  - reduced motion override가 기본 story 경로에 남아 motion difference를 가리면 실패다.
  - outside dismiss를 검토할 backdrop/host target이 story에서 사라지면 실패다.
- 작업:
  - shared harness를 trigger-centered host와 outside-dismiss target이 보이도록 다시 구성하고, runtime-proof test가 쓸 stable selector를 추가한다.
  - hover/context/mutual exclusion story의 설명과 이름을 새 contract에 맞춰 정리한다.
  - story source에 남아 있는 taskbar-center/reduced-motion masking을 제거하고 consumer-owned coordination만 남긴다.
  - rendered story runtime-proof test를 추가해 실제 story render를 mount하고, trigger-centered alignment, `Escape`/outside dismiss, full motion observability를 검증한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx`
  - [ ] `pnpm --filter @windows/ui build-storybook`
  - [ ] `rg -n 'left: \"50%\"|motionPreference: .reduced.' packages/ui/src/interactive/taskbar/storybook` 결과를 검토해 behavior harness에 taskbar-center 보정과 reduced-motion masking이 남지 않았는지 확인한다.
  - [ ] `rg -n 'Interactive/Taskbar/' packages/ui/src/interactive/taskbar/storybook -g "*.stories.tsx"` 결과가 hover/context/mutual exclusion story를 그대로 보여 주는지 확인한다.
  - [ ] runtime-proof test가 actual story render 기준으로 trigger-centered alignment, `Escape`/outside dismiss, motion phase observability를 각각 검증하는지 확인한다.
  - [ ] Storybook source를 열어 context story가 `Escape`, outside dismiss, focus restore를 render와 설명에서 모두 다루는지 확인한다.
