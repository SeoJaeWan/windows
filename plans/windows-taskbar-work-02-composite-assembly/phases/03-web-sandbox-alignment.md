# Phase 3. 웹 미리보기 경로 임시 맞추기

> 이 문서는 실행 계약이다. `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위와 완료 조건을 바꾸지 않는다.

- owner_agent: `frontend-developer`
- 목적: `apps/web`의 `/sandbox/taskbar` route가 제거된 `TaskbarStart*` export 없이도 새 `Taskbar` 공개 계약만으로 계속 빌드되고 보이게 한다.
- boundary:
  - `apps/web/src/app/sandbox/taskbar/**`
- input:
  - `plans/windows-taskbar-work-02-composite-assembly/phases/02-composite-surface.md`에서 `TaskbarStart*`가 root export와 interactive entry에서 제거된 상태
  - 현재 `/sandbox/taskbar` route는 raw slot 기반 `Taskbar` 사용과 `TaskbarStartButton`, `TaskbarStartPanel` import에 기대고 있다.
  - `plans/windows-taskbar-work-05-web-sandbox-retirement/phases/01-remove-route-owner.md`는 이 route 자체를 나중에 retire하지만, 그 전까지는 repo 안의 임시 preview consumer로 남는다.
- output:
  - 공개 계약:
    - `/sandbox/taskbar` route는 남아 있는 `@windows/ui` 공개 경로만 사용하고 `TaskbarStartButton`, `TaskbarStartPanel`을 import하지 않는다.
    - preview page의 canonical scene은 `Taskbar`에 `entries/icons/windows/search/clock` 데이터를 넘기는 방식으로 렌더링한다.
    - fixture matrix는 살아남은 taskbar family만 보여 주며 start 전용 카드나 start 전용 import를 다시 만들지 않는다.
  - 내부 기본값:
    - 이 route는 임시 preview consumer일 뿐이고 replacement owner가 아니다. Storybook replacement owner 계약은 별도 `windows-taskbar-work-04-storybook-sandbox` plan이 계속 소유한다.
    - page-local wrapper나 fixture는 새 공개 계약을 보여 주는 역할만 하며 package contract를 다시 정의하지 않는다.
  - 허용하지 않는 대안:
    - 제거된 `TaskbarStart*` export를 internal path import나 app-local 재구현으로 되살리는 구조
    - raw slot 조합을 계속 유지해 route가 새 `Taskbar` 공개 계약을 검증하지 못하는 구조
    - route가 package source의 공식 reference owner처럼 계속 의미를 확장하는 구조
- 선행조건: `plans/windows-taskbar-work-02-composite-assembly/phases/02-composite-surface.md` 완료
- 제약:
  - 이 phase는 route를 유지 가능한 상태로 맞추는 단계다. route 제거와 replacement owner 이전은 후속 `windows-taskbar-work-05-web-sandbox-retirement` plan이 맡는다.
  - package public contract 자체를 다시 바꾸거나 새 export를 추가하지 않는다.
- failure/validation: route가 새 공개 계약으로 빌드되지 않거나, `TaskbarStart*`를 다른 import 경로로라도 되살리면 실패다.
- 작업:
  - `/sandbox/taskbar` page를 data-driven `Taskbar` 사용 방식으로 바꾼다.
  - fixture matrix에서 start 전용 카드와 import를 제거하고 살아남은 surface만 남긴다.
  - route-local test가 제거된 export 없이도 preview route를 설명하도록 맞춘다.
- 검증:
  - [ ] `pnpm --filter @windows/web test`
  - [ ] `pnpm --filter @windows/web build`
  - [ ] `rg -n "TaskbarStartButton|TaskbarStartPanel" .\apps\web\src\app\sandbox\taskbar` 결과에 legacy start import와 route-local 재구현 흔적이 남지 않는다.
