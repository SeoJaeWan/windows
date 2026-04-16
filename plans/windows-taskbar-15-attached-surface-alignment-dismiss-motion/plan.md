**Branch:** fix/windows-taskbar-15-attached-surface-alignment-dismiss-motion

> Worktree dir: `worktrees/windows-taskbar-15-attached-surface-alignment-dismiss-motion` (plan 폴더명과 동일)
> 이 문서는 `@windows/ui` taskbar attached surface의 기준점, dismiss, motion을 새로 고정하는 검토용 실행 계획이다. 먼저 `사전 합의`와 `전체 작업 지도`에서 이번 slice의 경계와 순서를 보고, 아래 phase 카드에서 어떤 파일이 어떻게 바뀌는지와 무엇으로 완료를 판단하는지를 확인한다.
> 기존 `windows-taskbar-13-interactive-attached-surfaces`와 `windows-taskbar-14-interactive-behavior-storybook`은 read-only 선행 참고이며 이번 slug에서 수정하지 않는다.

# Windows Taskbar attached surface alignment dismiss motion 실행 계획

## 사전 합의

| 항목 | 합의 내용 | 적용 phase | 메모 |
| --- | --- | --- | --- |
| 새 plan 경계 | 이번 작업은 새 slug `windows-taskbar-15-attached-surface-alignment-dismiss-motion` 아래에서만 닫고, `windows-taskbar-13`/`14`는 read-only 참고로만 사용한다. | 전체 | 기존 계획의 의도는 계승하되 파일은 수정하지 않는다. |
| context anchor 기준 | taskbar context panel의 가로 기준은 각 `TaskbarIconButton` 중심이고, 세로 기준은 포인터 Y가 아니라 trigger 기준 상단 gap이다. | Phase 1 | taskbar 전체 중앙이나 클릭 지점 높이를 winner로 두지 않는다. |
| hover anchor 소유 | hover preview의 위치는 여전히 host/story owner가 소유하되, package Storybook harness는 `TaskbarIconButton` 중심에 맞춰 붙는 canonical host 예시를 제공한다. | Phase 3 | hover hook public surface에 generic placement API를 새로 열지 않는다. |
| dismiss 기준 | `Escape`와 outside `pointerdown`은 surface focus 유무와 무관하게 닫힘을 일으키는 canonical dismiss다. hover의 leave-close 정책은 유지하되 global dismiss보다 약하다. | Phase 1 / Phase 3 | whitelist는 trigger와 surface root만 허용한다. |
| motion 기준 | open은 taskbar 아래쪽에서 위로 올라오고, close는 현재 위치에서 taskbar 쪽 아래로 내려간다. `SurfacePhase`와 `onExitComplete`는 실제 motion lifecycle을 구동해야 한다. | Phase 1 / Phase 2 | reduced motion shortcut은 유지하되 일반 motion 경로를 대체하는 핑계로 쓰지 않는다. |
| 검증 경계 | 이번 slice의 검증은 `packages/ui` unit test와 `interactive/taskbar/storybook` behavior stories로 닫는다. | Phase 1 / Phase 2 / Phase 3 | 로컬 blog 구현은 read-only 기준으로만 사용한다. |
| reference 해석 | `C:\Users\USER\Desktop\dev\blog\src\hooks\useShowTaskPanel/index.tsx`와 `C:\Users\USER\Desktop\dev\blog\src\app\globals.css`는 attached surface의 anchor/motion 의도를 읽는 참고 source다. | 전체 | 외부 live 사이트는 재현 참고만 하고 이번 plan의 canonical acceptance는 repo-local contract로 번역한다. |

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. anchor·dismiss runtime 정리 | context hook placement를 trigger 기준으로 다시 닫고, hover/context hook 둘 다 global dismiss와 mounted surface root registration, observable phase lifecycle을 갖도록 정리한다. | runtime layer만 읽어도 어떤 기준점과 dismiss가 canonical인지, 어떤 returned root wiring이 mounted surface root를 등록하는지, `opening/open/closing`이 언제 보이는지 알 수 있는 상태가 된다. | trigger-centered placement, root registration, global dismiss, phase lifecycle이 unit-covered 된 hook contract |
| Phase 2. leaf motion lifecycle 정리 | hover/context leaf가 Phase 1의 lifecycle을 실제 위로-아래 motion과 exit finalize로 소비하도록 정리한다. | `phase`와 `onExitComplete`가 data marker가 아니라 실제 motion grammar가 되고 두 leaf가 같은 방향성과 종료 규칙을 공유한다. | Storybook이 그대로 소비할 motion-capable leaf contract와 component tests |
| Phase 3. behavior Storybook 정합성 보강 | behavior harness와 stories를 trigger-centered host 기준으로 다시 맞추고, `Escape`/outside dismiss와 full motion을 가리지 않도록 정리한 뒤 rendered story runtime-proof test로 그 관찰 가능성을 고정한다. | `Interactive/Taskbar/*` stories가 실제 runtime contract를 왜곡하지 않고 attached surface 기준점과 dismiss/motion을 검토 가능하며, 같은 story render를 mount하는 runtime-proof test가 그 사실을 repo-local evidence로 남기는 상태가 된다. | 이후 cold review와 materialize가 그대로 사용할 package-local observable verification surface와 rendered-story proof test |

## 단계별 실행

### Phase 1. anchor·dismiss runtime 정리

- 목적: attached surface runtime이 pointer/taskbar-center 임시 계산이 아니라 trigger 기준 anchor, global dismiss, observable phase lifecycle을 canonical owner로 갖게 만든다.
- 변경 내용: `useTaskbarContextPanel`은 trigger 중심 anchor와 dismiss/focus-restore를 다시 닫고, mounted surface root는 returned `surfaceProps.ref`가 canonical registration path임을 명시한다. `useTaskbarHoverPreview`는 global `Escape`/outside dismiss와 기존 fresh re-entry 규칙을 함께 소유하며, mounted root는 `getSurfaceProps()`가 돌려주는 package-owned root wiring으로 등록한다. hook은 `opening`을 즉시 건너뛰지 않고 leaf가 실제 enter motion을 볼 수 있는 lifecycle을 유지한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarPlacement/index.ts` | 교체 | context placement 계산이 pointer origin이 아니라 trigger 기준 anchor와 viewport clamp를 사용한다. | source에 taskbar-center/pointerY winner가 사라지고 trigger-centered clamp rule이 드러난다. |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarPlacement/useTaskbarPlacement.test.ts` | 정리 | placement test가 trigger-centered x, trigger-top y, viewport clamp를 canonical expectation으로 고정한다. | 기존 pointer-origin assertions가 새 anchor contract로 바뀌고 negative case가 함께 보인다. |
| `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/index.ts` | 교체 | context hook이 global dismiss, trigger anchor, focus restore, mounted surface root registration, observable phase lifecycle을 한 owner에서 닫는다. | `surfaceProps.ref`가 mounted surface root의 canonical capture path로 명시되고, `Escape`/outside click이 focus와 무관하게 닫히며, close finalize 전까지 `closing`이 유지되는 것이 source에서 보인다. |
| `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/useTaskbarContextPanel.test.tsx` | 정리 | context hook test가 trigger-centered placement, `surfaceProps.ref` root registration, `Escape`, outside click, inside whitelist no-op, focus restore를 검증한다. | close path와 placement winner rule, surface root whitelist capture가 test boundary에서 직접 확인된다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/index.ts` | 교체 | hover hook이 leave-close 외에 global dismiss, mounted surface root registration, phase lifecycle을 함께 닫되 placement public API는 넓히지 않는다. | `getSurfaceProps()`가 package-owned root wiring과 함께 반환되고, `Escape`/outside dismiss 후 resting pointer no-op, fresh leave→enter reopen rule이 source에 드러난다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx` | 정리 | hover hook test가 global dismiss, `getSurfaceProps()` root registration, leave-close, fresh re-entry, observable `opening`/`closing` lifecycle을 고정한다. | hover dismiss semantics와 surface root whitelist capture가 story-local 추측 없이 test에서 닫힌다. |

- 이전 상태: context placement는 pointer origin과 viewport 좌표에 기대고, hover/context 닫힘은 focus나 local handler에 의존하며, hook이 `opening`을 곧바로 `open`으로 덮어써 leaf motion이 사실상 보이지 않는다.
- 이후 상태: runtime layer는 trigger 기준 anchor, returned root wiring 기반 surface root registration, document-level dismiss, observable phase lifecycle을 소유하고, hover preview는 여전히 host-positioned public surface로 남는다.
- 완료 조건: hook source와 unit test만 읽어도 어떤 기준점이 canonical인지, 어떤 returned root wiring이 mounted surface root를 등록하는지, 어떤 dismiss가 winner인지, 어떤 시점에 `opening`/`closing`이 보이는지 명확해야 한다.
- 관련 영역: `packages/ui/src/interactive/taskbar/internal/usePresencePhase/index.ts`, `packages/ui/src/interactive/taskbar/internal/useHoverIntent/index.ts`, `C:\Users\USER\Desktop\dev\blog\src\hooks\useShowTaskPanel/index.tsx`
- 시작 조건: `none`
- 상세: `./phases/01-anchor-dismiss-runtime.md`

### Phase 2. leaf motion lifecycle 정리

- 목적: hover/context leaf가 같은 motion grammar와 종료 규칙으로 `SurfacePhase`를 소비하도록 정리한다.
- 변경 내용: taskbar attached surface leaf 두 개에 공통 motion helper를 도입해 enter는 below→up, exit는 current→down 규칙을 공유하게 하고, `onExitComplete`는 closing root motion이 끝날 때만 호출되도록 정리한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarAttachedSurface/shared.ts` | 정리 | `SurfacePhase`와 reserved marker 설명이 실제 motion lifecycle 의미를 반영한다. | `opening/open/closing`과 `onExitComplete`가 marker-only가 아니라 motion contract로 읽힌다. |
| `packages/ui/src/components/panels/taskbarAttachedSurface/motion.ts` | 추가 | hover/context가 공유하는 offset, duration, easing, root animation guard가 한 곳에 모인다. | 두 leaf가 중복 class literal 대신 같은 helper/constant를 소비한다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/index.tsx` | 교체 | hover leaf가 `opening/open/closing`에 따라 아래→위 / 위→아래 motion을 적용하고 closing 종료를 host에 알린다. | `phase`가 바뀔 때 실제 motion class와 finalize wiring이 source에서 드러난다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.test.tsx` | 정리 | hover leaf test가 phase별 motion marker/class, closing-only finalize를 고정한다. | opening/open/closing마다 어떤 root 상태가 나와야 하는지 test에서 확인된다. |
| `packages/ui/src/components/panels/taskbarContextMenu/index.tsx` | 교체 | context menu leaf가 동일한 motion grammar와 exit finalize guard를 공유한다. | roving focus semantics는 유지하면서 motion/finalize contract가 leaf 안에서 닫힌다. |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.test.tsx` | 정리 | context leaf test가 phase별 motion state와 closing-only `onExitComplete`를 검증한다. | nested row interaction이 close finalize를 잘못 일으키지 않는다는 점이 test로 보인다. |

- 이전 상태: leaf는 `data-phase`만 찍고 `onExitComplete`를 사실상 소비하지 않아 motion contract와 runtime finalize가 분리돼 있다.
- 이후 상태: hover/context leaf는 같은 방향성과 종료 규칙을 공유하고, runtime이 제공한 `phase`를 실제 animation lifecycle로 해석한다.
- 완료 조건: leaf source와 component tests만 읽어도 enter/exit 방향, 종료 콜백 타이밍, reserved marker winner rule이 분명해야 한다.
- 관련 영역: `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx`, `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx`, `C:\Users\USER\Desktop\dev\blog\src\app\globals.css`
- 시작 조건: Phase 1의 runtime lifecycle과 dismiss contract가 stable해야 한다.
- 상세: `./phases/02-leaf-motion-lifecycle.md`

### Phase 3. behavior Storybook 정합성 보강

- 목적: behavior Storybook이 실제 attached-surface contract를 가리지 않도록 host 배치와 motion/dismiss 관찰 경계를 다시 맞춘다.
- 변경 내용: shared harness는 hover/context surface를 taskbar 중앙이 아니라 trigger 중심에 붙여 렌더링하고, behavior stories는 full motion으로 `Escape`/outside dismiss와 mutual exclusion을 보여 준다. harness는 rendered-story proof를 위한 stable selector와 outside target을 열고, 별도 runtime-proof test는 실제 story render를 mount해 trigger-centered alignment, dismiss, motion observability를 검증한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 교체 | shared harness가 trigger ref 기준 anchor, outside click target, full motion, consumer-owned winner rule, runtime-proof selector를 실제 contract대로 보여 준다. | `left: 50%` taskbar-center 보정과 forced reduced motion이 제거되고, trigger/surface/outside target을 runtime test가 stable하게 집을 수 있는 host가 보인다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx` | 정리 | hover behavior story가 trigger-centered hover attach와 full open/close motion을 설명한다. | hover story 이름과 설명만 읽어도 attached anchor와 dismiss contract가 드러난다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.behavior.stories.tsx` | 정리 | context behavior story가 trigger-centered placement, `Escape`, outside dismiss, focus restore를 보여 준다. | story 설명과 render가 Phase 1 contract와 같은 방향을 가리킨다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarMutualExclusion.behavior.stories.tsx` | 정리 | mutual exclusion story가 hover/context winner rule과 resting pointer no-op를 contract 그대로 유지한다. | consumer-owned coordination이 position/dismiss/motion을 가리지 않고 드러난다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorStories.runtime.test.tsx` | 추가 | 실제 `Interactive/Taskbar/*` story render를 mount하는 runtime-proof test가 생기고, trigger-centered alignment, `Escape`/outside dismiss, full motion observability를 repo-local evidence로 남긴다. | build/source inspection과 별개로 rendered behavior story가 contract를 드러내는지 runtime test에서 직접 증명된다. |

- 이전 상태: behavior harness는 hover surface를 taskbar 중앙으로 고정하고 reduced motion으로 실행해 실제 anchor/motion 차이를 가려 버린다.
- 이후 상태: `Interactive/Taskbar/*` stories는 trigger 기준 위치, dismiss, motion을 왜곡 없이 보여 주는 package-local verification surface가 되고, 동일한 story render를 mount하는 runtime-proof test가 그 관찰 가능성을 repo-local evidence로 남긴다.
- 완료 조건: rendered behavior story를 직접 mount하는 runtime-proof test와 Storybook build 결과를 함께 보면 hover/context attached surface가 trigger 중심에 붙고, `Escape`/outside dismiss와 full motion이 실제 story 경계에서 관찰 가능하다는 점이 증명돼야 한다.
- 관련 영역: `packages/ui/.storybook/main.ts`, `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorFixtures.ts`, `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`, `C:\Users\USER\Desktop\dev\blog\src\components\atoms\taskIconButton\hooks\usePanel/index.tsx`
- 시작 조건: Phase 2의 leaf motion lifecycle이 stable해야 한다.
- 상세: `./phases/03-storybook-observability.md`
