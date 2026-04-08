# Phase 1. taskbar 웹 미리보기 경로 제거

> 이 문서는 실행 계약이다. `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위와 완료 조건을 바꾸지 않는다.

- owner_agent: `frontend-developer`
- 목적: `apps/web`의 `/sandbox/taskbar` route와 route-local test를 제거해 app/web가 taskbar reference owner가 아니게 만든다.
- boundary:
  - `apps/web/src/app/sandbox/taskbar/**`
- input:
  - 현재 `apps/web/src/app/sandbox/taskbar/page.tsx`, `fixtures.tsx`, `page.test.tsx`가 taskbar preview와 matrix owner 역할을 한다.
  - `plans/windows-taskbar-work-04-storybook-sandbox/phases/02-reference-stories.md`는 replacement owner 계약을 별도 plan으로 관리한다. 이 phase는 그 계약을 선행조건으로 소비만 하고, Storybook 내부 story/marker 계약을 다시 정의하거나 검증하지 않는다.
- output:
  - 공개 계약:
    - `apps/web` source tree에는 `/sandbox/taskbar` route와 그 route-local test가 남지 않는다.
    - taskbar reference owner는 더 이상 app/web route가 아니며, replacement owner 세부 계약은 별도 Storybook plan이 계속 소유한다.
  - 내부 기본값:
    - 다른 app/web route는 유지되고, 이번 cleanup은 `sandbox/taskbar` 경계에만 국한된다.
    - `plans/windows-taskbar-work-04-storybook-sandbox/phases/02-reference-stories.md`의 story 이름, marker, smoke 검증은 이 phase 범위 밖이다.
  - 허용하지 않는 상태:
    - `/sandbox/taskbar`를 다른 app/web route 이름으로만 바꿔 계속 유지하는 구조
    - replacement owner 세부 계약을 이 phase 안에서 새로 재정의하거나 Storybook 범위를 끌어오는 구조
- 선행조건: `plans/windows-taskbar-work-04-storybook-sandbox/phases/02-reference-stories.md`에 replacement owner 계약이 정리되어 있다.
- 제약:
  - 이 phase는 app/web route owner만 지운다. Playwright spec과 route 전역 search cleanup은 다음 phase가 맡는다.
  - package source와 Storybook owner surface는 수정 대상이 아니다.
- failure/validation: route를 지우지 못했거나 다른 app/web preview 경로로 사실상 되살리면 실패다. Storybook replacement owner 내부 상태를 이 phase의 로컬 검증으로 다시 증명하려고 하면 범위 이탈이다.
- 작업:
  - `apps/web/src/app/sandbox/taskbar/**`를 제거한다.
  - route-local page test도 함께 retire한다.
  - app/web source tree에서 taskbar reference owner 역할이 끝났음을 코드 경계로 닫는다.
- 검증:
  - [ ] `pnpm --filter @windows/web test`
  - [ ] `pnpm --filter @windows/web build`
  - [ ] `rg -n "/sandbox/taskbar|Taskbar Sandbox" .\\apps\\web\\src\\app` 결과에 retired route owner가 남지 않는다.
