# Phase 2. 공개 export와 검증 기준 바꾸기

> 이 문서는 실행 계약이다. `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위와 완료 조건을 바꾸지 않는다.

- owner_agent: `frontend-developer`
- 목적: 새 `Taskbar` composite를 root export와 package test 기준에서 유일한 taskbar 공개 경로로 굳힌다.
- boundary:
  - `packages/ui/src/index.ts`
  - `packages/ui/src/index.test.ts`
  - `packages/ui/src/interactive/index.ts`
  - `packages/ui/src/components/taskbar/taskbar/taskbar.test.tsx`
- input:
  - `plans/windows-taskbar-work-02-composite-assembly/phases/01-package-assembly.md`에서 `Taskbar`가 package-owned 조합 경로를 가진 상태
  - 현재 `packages/ui/src/index.ts`는 `TaskbarStartButton`, `TaskbarStartPanel` export를 남기고 있지만 `packages/ui/src/index.test.ts`는 이 export가 없어야 한다고 이미 고정한다.
- output:
  - 공개 계약:
    - `@windows/ui` root export는 `Taskbar`, `TaskbarSearch`, `TaskbarIconButton`, `TaskbarClock`, `TaskbarSearchPanel`, `TaskbarHoverPanel`, `TaskbarContextMenu`만 taskbar family 공개 경로로 노출한다.
    - `TaskbarStartButton`, `TaskbarStartPanel`은 root export와 `@windows/ui/interactive` 어디에서도 alias로 다시 열리지 않는다.
    - root export test와 `Taskbar` 설명 문구는 `Taskbar` data-driven 조합 경로만 공식 taskbar 공개 계약으로 설명한다.
  - 내부 기본값:
    - 후속 `plans/windows-taskbar-work-03-reference-visuals/plan.md`, `plans/windows-taskbar-work-04-storybook-sandbox/plan.md`, `plans/windows-taskbar-work-06-legacy-start-retirement/plan.md`는 `TaskbarStart*`가 더 이상 공개 export가 아니라는 계약을 선행조건으로 사용한다.
  - 허용하지 않는 대안:
    - `TaskbarStart*`를 deprecated alias라도 root export에 남겨 두는 구조
    - root export나 test 설명이 새 `Taskbar`보다 legacy start surface를 더 우선하는 구조
    - interactive entry가 taskbar legacy 우회 경로가 되는 구조
- 선행조건: `plans/windows-taskbar-work-02-composite-assembly/phases/01-package-assembly.md` 완료
- 제약:
  - 이 phase는 공개 export 제거와 설명 정렬만 맡는다. source tree 디렉터리 삭제와 web sandbox consumer 수정은 다른 phase가 맡는다.
  - public inventory 전체를 얼리는 단계는 아니고, taskbar 공개 경로를 하나로 닫는 단계다.
- failure/validation: 새 composite가 구현돼도 root export/test가 이를 유일한 공개 경로로 못 박지 못하거나, `TaskbarStart*` alias가 남으면 실패다.
- 작업:
  - root export와 root export test를 새 공개 경로 기준으로 정리한다.
  - `@windows/ui/interactive`가 legacy taskbar 우회 경로를 열지 않도록 확인하거나 정리한다.
  - `Taskbar` 설명 문구를 새 data-driven 조합 경로 기준으로 맞춘다.
- 검증:
  - [ ] `pnpm --filter @windows/ui test`
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] `rg -n "TaskbarStartButton|TaskbarStartPanel" .\packages\ui\src\index.ts .\packages\ui\src\interactive\index.ts` 결과에 legacy public export가 남지 않는다.
  - [ ] `packages/ui/src/index.ts`, `packages/ui/src/index.test.ts`, `packages/ui/src/components/taskbar/taskbar/taskbar.test.tsx`가 `Taskbar`를 유일한 taskbar 공개 경로로 설명한다.
