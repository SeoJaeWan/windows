**Branch:** feat/windows-taskbar-04-attached-surfaces

> Worktree dir: `worktrees/windows-taskbar-04-attached-surfaces` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 먼저 `전체 작업 지도`에서 흐름을 보고, 아래 phase 카드에서 무엇이 바뀌는지와 무엇을 확인해야 하는지 본다.
> 기술적인 입력/출력 계약, 파일 경계, 상세 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows Taskbar attached surfaces 실행 계획

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. hover preview surface 계약 정리 | `packages/ui/src/components/panels/taskbarHoverPreview/**` 아래에 direct owner surface를 만들고, `items[]` + `preview: ReactNode` + aspect-ratio-preserving scale-down 규칙으로 `hover-single`, `hover-multi` visual contract를 닫는다. | `taskbarHoverPreview`는 실제 screen subtree preview를 이미지 src가 아닌 React subtree로 받아 single/multi preview card surface를 안정적으로 그리는 package-owned UI contract가 된다. | root export와 compare wiring이 바로 소비할 수 있는 `taskbarHoverPreview` input winner, single/multi state inventory, `IconImage`/Fluent affordance boundary |
| Phase 2. context menu topology 정리 | `packages/ui/src/components/panels/taskbarContextMenu/**` 아래에 direct owner surface를 만들고, caller-owned `appRows`와 package-owned `pin-taskbar` / `close-all` fixed rows를 `context-pinned`, `context-unpinned` winner rule로 닫는다. | `taskbarContextMenu`는 caller가 arbitrary action array를 넘기는 menu가 아니라, app row data만 넘기면 package가 고정 row topology와 pin/unpin label winner를 소유하는 UI surface가 된다. | root export와 compare wiring이 바로 소비할 수 있는 `taskbarContextMenu` app-row shape, fixed row order, pinned/unpinned label winner rule |
| Phase 3. 공개 surface와 compare 기준 고정 | 두 surface를 `@windows/ui` root에 `TaskbarHoverPreview`, `TaskbarContextMenu`로 공개하고, Storybook/compare 기준을 `hover-single`, `hover-multi`, `context-pinned`, `context-unpinned` 네 canonical state로 고정한다. | attached surface는 package root import와 repo-local visual review surface를 모두 갖게 되고, internal helper leakage 없이 direct panel components만 public surface로 남는다. | 구현 handoff와 이후 `plan-materialize`가 그대로 사용할 root export 이름, canonical state inventory, package validation 경계 |

## 단계별 실행

### Phase 1. hover preview surface 계약 정리

- 목적: `taskbarHoverPreview`를 UI only leaf로 정의하고, actual screen subtree preview를 package-owned scaled surface로 닫는다.
- 실제 작업: `packages/ui/src/components/panels/taskbarHoverPreview/**` 아래에 direct owner component와 local story/test 경계를 만들고, required `items[]` item shape를 `{ id, label, iconSrc, preview: ReactNode }`로 고정한다. `items.length === 1`이면 `hover-single`, `items.length > 1`이면 `hover-multi`를 렌더링하도록 winner rule을 닫고, `preview`는 image src가 아니라 actual subtree를 uniform scale-down으로 넣는다. app bitmap icon은 `IconImage`를 쓰고, close affordance 같은 system icon은 Fluent icon으로만 둔다.
- 이전 상태: attached surface 전용 hover preview component가 없고, preview가 이미지인지 actual subtree인지, single/multi state를 어떤 입력이 고르는지, preview scale이 왜곡을 허용하는지가 plan 차원에서 닫혀 있지 않다.
- 이후 상태: `taskbarHoverPreview`는 `attachedSurfaces` 같은 umbrella family 없이 `panels/*` 바로 아래 owner를 가지며, caller는 non-empty `items[]`만 넘기고 package는 preview header grammar와 aspect-ratio-preserving scale-down을 소유한다.
- 확인 포인트: `preview`가 `ReactNode`로 닫혀 있어야 하고 `previewSrc` 같은 sibling contract가 생기면 안 된다. `hover-single`, `hover-multi`는 `items.length`만으로 해석돼야 하며, hover delay, close callback, anchor positioning, state store는 범위에 들어오면 안 된다.
- 관련 영역: `packages/ui/src/components/panels/taskbarHoverPreview/**`, `packages/ui/src/components/common/iconImage/**`, `plans/windows-taskbar-04-attached-surfaces/reference-captures/taskbar-hover-preview.png`, `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskHoverPanel\index.tsx`
- 시작 조건: `windows-common-icon-primitive`의 output인 `packages/ui/src/components/common/iconImage/index.tsx`가 이미 stable해야 한다.
- 상세: `./phases/01-hover-preview-contract.md`

### Phase 2. context menu topology 정리

- 목적: `taskbarContextMenu`를 caller-owned app row data와 package-owned fixed action rows로 분리해 UI only menu topology를 닫는다.
- 실제 작업: `packages/ui/src/components/panels/taskbarContextMenu/**` 아래에 direct owner component와 local story/test 경계를 만들고, required `appRows[]` item shape를 `{ id, label, iconSrc }`로 고정한다. `taskbarPinState: "pinned" | "unpinned"` winner가 `data-action-id="pin-taskbar"` row label을 `작업 표시줄에서 제거` 또는 `작업 표시줄에 고정`으로 고르게 하고, `data-action-id="close-all"` row는 `모든 창 닫기`로 고정한다. caller는 app row data만 넘기고, fixed row order와 divider topology는 package가 소유한다.
- 이전 상태: attached surface 전용 taskbar context menu component가 없고, caller가 전체 action array를 공급하는지 package가 fixed rows를 소유하는지, pinned/unpinned visual state가 어떤 입력으로 갈리는지가 plan 차원에서 닫혀 있지 않다.
- 이후 상태: `taskbarContextMenu`는 `panels/*` 바로 아래 owner를 가지며, app row icon은 `IconImage`, fixed action row icon은 Fluent icon으로 분리되고, `context-pinned`, `context-unpinned` 두 canonical state가 `taskbarPinState`만으로 해석된다.
- 확인 포인트: app rows와 fixed rows가 하나의 generic `actions` contract로 합쳐지면 안 된다. `pin-taskbar` row label winner와 `close-all` row 위치는 package-owned topology로 고정돼야 하고, caller가 fixed row를 재정렬하거나 새 action row를 끼워 넣으면 안 된다.
- 관련 영역: `packages/ui/src/components/panels/taskbarContextMenu/**`, `packages/ui/src/components/common/iconImage/**`, `plans/windows-taskbar-04-attached-surfaces/reference-captures/taskbar-icon-context-menu.png`, `C:\Users\USER\Desktop\dev\blog\src\components\molecules\taskLeftClickPanel\index.tsx`
- 시작 조건: `windows-common-icon-primitive`의 output인 `packages/ui/src/components/common/iconImage/index.tsx`가 이미 stable해야 한다.
- 상세: `./phases/02-context-menu-topology.md`

### Phase 3. 공개 surface와 compare 기준 고정

- 목적: 두 attached surface를 package root public contract와 repo-local visual review surface로 함께 고정한다.
- 실제 작업: `packages/ui/src/index.ts`에서 `TaskbarHoverPreview`, `TaskbarContextMenu`만 root export로 열고, internal preview frame/menu row helper는 package-internal로 남긴다. Storybook/compare helper와 fixture를 정리해 canonical state inventory를 정확히 `hover-single`, `hover-multi`, `context-pinned`, `context-unpinned` 네 개로 고정하고, `taskbar-hover-preview.png`와 `taskbar-icon-context-menu.png`가 어떤 surface grammar를 설명하는지 local review surface에서 드러나게 만든다.
- 이전 상태: 두 surface는 package root import target이 아니고, attached surface compare inventory도 taskbar/windows existing compare helper 안에 등록돼 있지 않다.
- 이후 상태: `@windows/ui`는 direct panel components `TaskbarHoverPreview`, `TaskbarContextMenu`만 public하게 공개하고, Storybook/compare는 네 canonical state를 package-owned review surface로 보여 준다.
- 확인 포인트: root export에 internal helper나 `AttachedSurfaces` namespace가 같이 올라오면 안 된다. canonical state inventory가 네 개를 넘기면 안 되고, decorative stage가 anchor positioning contract처럼 해석되면 안 된다.
- 관련 영역: `packages/ui/src/components/panels/taskbarHoverPreview/**`, `packages/ui/src/components/panels/taskbarContextMenu/**`, `packages/ui/src/components/taskbar/storybook/**`, `packages/ui/src/index.ts`, `packages/ui/package.json`, `plans/windows-taskbar-04-attached-surfaces/reference-captures/**`
- 시작 조건: Phase 1의 `taskbarHoverPreview` input winner와 Phase 2의 `taskbarContextMenu` fixed-row topology가 이미 stable해야 한다.
- 상세: `./phases/03-public-wiring-and-compare.md`
