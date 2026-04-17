# Phase 1. anchor·dismiss runtime 정리

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | context는 trigger 기준 anchor와 global dismiss를 canonical runtime으로 갖고, hover/context 모두 returned root wiring으로 mounted surface root를 등록하며 observable `opening/open/closing` lifecycle을 유지한다. |
| 선행조건 | `none` |
| 완료 판단 | hook source와 unit test만 읽어도 placement winner, returned root wiring 기반 surface root registration, dismiss winner, focus restore, resting pointer no-op, phase lifecycle이 명확해야 한다. |
| 중단 조건 | hover 위치를 고치기 위해 generic public placement API를 새로 열어야 하거나, dismiss가 app-level portal/provider 없이는 성립하지 않으면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarPlacement/index.ts` | 교체 | 가로 winner는 `TaskbarIconButton` 중심이고 세로 winner는 pointer Y가 아니다. viewport clamp는 유지하되 taskbar-center 기준을 다시 열지 않는다. | placement 계산 source에 trigger-centered x, trigger-top 기반 y, clamp rule이 함께 보인다. |
| `packages/ui/src/interactive/taskbar/internal/useTaskbarPlacement/useTaskbarPlacement.test.ts` | 정리 | 기존 pointer-origin assertions는 새 anchor contract를 설명하지 못하므로 교체한다. | test가 trigger-centered x, trigger-top y, 좌우 clamp, 상단 clamp를 직접 검증한다. |
| `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/index.ts` | 교체 | context hook은 triggerRef가 canonical anchor source이며 document-level dismiss와 focus restore를 single owner로 닫는다. mounted surface root는 returned `surfaceProps.ref`로만 등록하고 duplicate close 요청은 no-op이어야 한다. | `surfaceProps.ref`가 canonical capture path로 드러나고 `Escape`/outside `pointerdown`/explicit close가 모두 같은 finalize path로 합쳐지며 `closing`이 leaf exit 전까지 유지된다. |
| `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/useTaskbarContextPanel.test.tsx` | 정리 | context test는 focus inside 여부가 아니라 runtime dismiss contract와 returned `surfaceProps.ref` root registration을 owner로 삼는다. | keyboard open과 pointer open이 같은 horizontal anchor를 쓰고, outside click과 `Escape`가 닫힘과 focus restore를 일으키며, whitelist가 registered surface root를 읽는 것이 test에서 보인다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/index.ts` | 교체 | hover hook은 leave-close를 유지하되 global dismiss와 observable phase lifecycle을 함께 소유한다. mounted surface root는 `getSurfaceProps()`가 돌려주는 package-owned root wiring으로만 등록한다. hover는 여전히 host-positioned public surface다. | `getSurfaceProps()` returned root wiring이 canonical capture path로 드러나고, `Escape`/outside dismiss 후 fresh leave→enter 없이는 reopen되지 않으며, open/close path에서 `opening`/`closing`이 관찰 가능하다. |
| `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx` | 정리 | hover test는 dismiss 후 resting pointer no-op, fresh re-entry winner rule, returned root wiring whitelist capture를 반드시 고정해야 한다. | global dismiss, leave-close, re-entry gate, inside whitelist no-op, registered surface root capture가 test에서 직접 검증된다. |

### 완료 증거

- context placement test가 taskbar 전체 중앙이 아니라 trigger 중심을 canonical output으로 검증한다.
- hover/context hook test가 returned root wiring을 mounted surface root에 붙였을 때만 whitelist가 성립하고, surface focus와 무관한 `Escape`/outside dismiss를 검증한다.
- hook test가 `opening`/`closing` lifecycle을 실제로 관찰하고, reduced motion만 immediate finalize를 허용한다.

- owner_agent: `frontend-developer`
- 목적:
  - attached surface runtime이 pointer 좌표와 local handler에 흔들리지 않고 package-owned trigger/dismiss contract를 소유하게 만든다.
- boundary:
  - `packages/ui/src/interactive/taskbar/internal/useTaskbarPlacement/index.ts`
  - `packages/ui/src/interactive/taskbar/internal/useTaskbarPlacement/useTaskbarPlacement.test.ts`
  - `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/index.ts`
  - `packages/ui/src/interactive/taskbar/useTaskbarContextPanel/useTaskbarContextPanel.test.tsx`
  - `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/index.ts`
  - `packages/ui/src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx`
- input:
  - 현재 `useTaskbarContextPanel`, `useTaskbarHoverPreview`, `useTaskbarPlacement`
  - existing `SurfacePhase` vocabulary와 `onExitComplete` public prop
  - read-only reference:
    - `C:\Users\USER\Desktop\dev\blog\src\hooks\useShowTaskPanel/index.tsx`
    - `C:\Users\USER\Desktop\dev\blog\src\components\atoms\taskIconButton\hooks\usePanel/index.tsx`
  - 사용자 합의:
    - context anchor는 trigger 중심이고 hover는 host-positioned public surface로 유지한다.
    - `Escape`/outside `pointerdown`은 focus와 무관한 canonical dismiss다.
    - `opening/open/closing`은 실제 motion lifecycle에서 관찰 가능해야 한다.
- output:
    - 공개 계약:
      - `calculateTaskbarPlacement`는 trigger 기준 anchor를 입력으로 받아 `x`를 trigger 중심에 맞추고, `y`를 trigger 상단과 fixed gap 기준으로 계산한 뒤 viewport 안으로 clamp한다.
      - `useTaskbarContextPanel.open()`은 pointer/keyboard open entry를 유지하되 placement winner는 trigger 기준 anchor다. pointer 좌표는 fallback 또는 event kind 구분용 보조 정보로만 남는다.
      - `useTaskbarContextPanel.surfaceProps`는 package-owned `ref` callback을 포함하고, consumer는 mounted surface root에 그 returned root wiring을 그대로 spread해야 한다. outside dismiss whitelist는 항상 `triggerRef.current`와 이 `surfaceProps.ref`가 마지막으로 등록한 root element만 읽는다.
      - `useTaskbarHoverPreview.getSurfaceProps()`는 mounted surface root에 붙일 package-owned root wiring object를 반환하고, 그 안의 `ref` callback이 outside dismiss whitelist용 root registration을 소유한다.
      - `useTaskbarContextPanel`은 document-level `Escape`와 outside `pointerdown`을 등록하고, returned root wiring으로 등록된 open surface root와 trigger만 whitelist로 인정한다.
      - `useTaskbarHoverPreview`는 leave-close를 유지하면서 document-level `Escape`와 outside `pointerdown`으로도 닫히며, returned root wiring으로 등록된 surface root와 trigger만 inside whitelist로 인정한다. dismiss 후에는 fresh leave→enter 없이는 reopen되지 않는다.
      - 두 hook 모두 일반 motion 경로에서 `opening`을 즉시 `open`으로 덮어쓰지 않고, close 후 unmount/focus restore는 finalize path에서만 일어난다.
    - 내부 기본값:
      - attached gap 기본값은 blog reference와 같은 `10px` 계열의 file-local constant로 둔다.
      - outside dismiss는 `composedPath()` 기준으로 trigger와 returned root wiring이 등록한 surface root 안쪽을 허용하고 나머지는 전부 close winner로 해석한다.
      - remount 또는 ref 재연결 시 whitelist root는 마지막으로 등록된 surface root로 교체되고, 별도 ad-hoc registration API는 만들지 않는다.
      - reduced motion에서는 close 즉시 finalize를 허용하지만, 일반 motion 경로와 다른 public callback shape를 만들지 않는다.
    - 허용하지 않는 대안:
      - `pointerY - panelHeight`를 canonical vertical anchor로 남기는 방식
      - `left: 50%`/taskbar-center 보정을 runtime contract로 승격하는 방식
      - outside dismiss root를 leaf 내부 ref나 story-local local variable로 암묵 등록하는 방식
      - `registerSurfaceRoot()` 같은 두 번째 public registration API를 따로 여는 방식
      - surface에 focus가 있을 때만 `Escape`가 작동하는 방식
      - hover 위치를 고치기 위해 generic `side/align/flip` API를 `@windows/ui/interactive`에 여는 방식
- 선행조건: `none`
- 제약:
  - root export와 visual leaf public API는 넓히지 않는다.
  - hover placement는 host ownership을 유지한다.
  - mounted surface root registration은 returned root wiring 경로 하나로만 닫는다.
  - duplicate close 요청은 closing 중이거나 already closed 상태에서 side effect를 추가로 만들지 않아야 한다.
- side effects:
  - document-level listener는 surface open 동안만 활성화되고 finalize 시 정리된다.
  - returned root wiring이 mounted surface root를 갱신하면 outside dismiss whitelist가 같은 tick의 최신 root를 읽어야 한다.
  - context close finalize는 trigger focus restore를 수행하고, hover close finalize는 resting pointer를 재open 신호로 오해하지 않아야 한다.
- failure/validation:
  - trigger-centered placement 대신 pointer/canvas center와 같은 두 번째 winner가 남으면 실패다.
  - mounted surface root registration 경로가 `surfaceProps.ref`/`getSurfaceProps().ref` 말고 다른 해석을 허용하면 실패다.
  - `Escape`/outside dismiss가 leaf focus 여부나 Storybook host에 의존하면 실패다.
  - 일반 motion 경로에서 `opening` 또는 `closing`을 test가 관찰할 수 없으면 실패다.
- 작업:
  - `useTaskbarPlacement`를 trigger anchor 기반 계산으로 바꾸고 clamp contract를 다시 정의한다.
  - `useTaskbarContextPanel`에서 open/close lifecycle을 `SurfacePhase` 기준으로 다시 닫고, document-level dismiss와 focus restore를 결합하며, mounted surface root registration을 returned `surfaceProps.ref`로 명시한다.
  - `useTaskbarHoverPreview`에서 leave-close와 global dismiss를 병행하되, mounted surface root registration을 `getSurfaceProps()` returned root wiring으로 명시하고 dismiss 후 fresh leave→enter gate를 유지한다.
  - hook tests를 새 winner rule과 negative output에 맞춰 교체해 local handler 추측 없이 runtime contract와 root whitelist capture를 직접 증명한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui exec vitest run src/interactive/taskbar/internal/useTaskbarPlacement/useTaskbarPlacement.test.ts src/interactive/taskbar/useTaskbarContextPanel/useTaskbarContextPanel.test.tsx src/interactive/taskbar/useTaskbarHoverPreview/useTaskbarHoverPreview.test.tsx`
  - [ ] context hook test가 keyboard open과 pointer open 모두 trigger-centered horizontal anchor를 사용함을 확인한다.
  - [ ] hover/context hook test가 returned root wiring을 mounted surface root에 붙인 상태에서 `Escape`, outside `pointerdown`, inside whitelist no-op를 각각 검증한다.
  - [ ] hover hook test가 dismiss 후 resting pointer no-op와 fresh leave→enter reopen 규칙을 검증한다.
