# Phase 1. start 전용 소스 지우기

> 이 문서는 실행 계약이다. `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위와 완료 조건을 바꾸지 않는다.

- owner_agent: `frontend-developer`
- 목적: 공개 경로에서 이미 빠진 `TaskbarStart*` source와 전용 테스트, start 명칭 흔적을 source tree에서 삭제해 legacy taskbar 경로를 완전히 종료한다.
- boundary:
  - `packages/ui/src/components/taskbar/taskbarStartButton/**`
  - `packages/ui/src/components/taskbar/taskbarStartPanel/**`
  - `packages/ui/src/components/taskbar/taskbarSearchPanel/**`
  - `packages/ui/src/components/taskbar/taskbar/taskbar.test.tsx`
- input:
  - `plans/windows-taskbar-work-02-composite-assembly/phases/02-composite-surface.md`에서 `TaskbarStart*`가 root export와 interactive entry에서 제거된 상태
  - `plans/windows-taskbar-work-02-composite-assembly/phases/03-web-sandbox-alignment.md`에서 app/web sandbox route도 더 이상 `TaskbarStart*`를 import하지 않는 상태
  - 현재 source tree에는 `taskbarStartButton`, `taskbarStartPanel` 디렉터리와 전용 테스트가 남아 있다.
- output:
  - 공개 계약:
    - `taskbarStartButton`, `taskbarStartPanel` source와 전용 테스트가 source tree에서 제거된다.
    - 살아남은 taskbar tests와 설명 문구는 새 `Taskbar` 공개 경로와 windows/search naming만 말한다.
  - 내부 기본값:
    - `taskbarSearchPanel`이나 surviving taskbar test에 start 명칭 흔적이 남아 있으면 같은 phase에서 함께 정리한다.
    - 이 phase 이후 repo 검색 기준으로 `TaskbarStartButton`, `TaskbarStartPanel`은 legacy 기록 외의 live source 이름이 아니다.
  - 허용하지 않는 대안:
    - dead source 디렉터리를 남겨 둔 채 export만 막는 구조
    - surviving test나 설명 문구가 여전히 start 전용 이름을 공식 surface처럼 설명하는 구조
- 선행조건: `plans/windows-taskbar-work-02-composite-assembly/phases/03-web-sandbox-alignment.md` 완료
- 제약:
  - 이 phase는 legacy source 삭제와 wording alignment만 맡는다.
  - 새 interactive runtime, 새 public surface, app/web route replacement owner는 열지 않는다.
- failure/validation: source tree 검색 결과에 `TaskbarStart*` live source가 남거나, surviving test가 start naming을 공식 surface처럼 설명하면 실패다.
- 작업:
  - `taskbarStartButton`, `taskbarStartPanel` source와 전용 test를 삭제한다.
  - surviving taskbar tests와 설명 문구를 새 naming에 맞춘다.
  - repo 빌드와 테스트가 legacy source 없이도 green인지 확인한다.
- 검증:
  - [ ] `pnpm --filter @windows/ui test`
  - [ ] `pnpm --filter @windows/ui exec tsc --noEmit -p tsconfig.json`
  - [ ] `pnpm --filter @windows/web build`
  - [ ] `rg -n "TaskbarStartButton|TaskbarStartPanel" .\packages\ui\src .\apps\web\src .\e2e` 결과에 live source나 consumer reference 흔적이 남지 않는다.
