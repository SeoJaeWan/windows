# Phase 2. route 전용 브라우저 테스트 제거

> 이 문서는 실행 계약이다. `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위와 완료 조건을 바꾸지 않는다.

- owner_agent: `frontend-developer`
- 목적: retired route에 묶인 bounded-surface 검증과 잔여 참조를 지워 app/web와 root test entry가 `/sandbox/taskbar`를 다시 요구하지 못하게 한다.
- boundary:
  - `e2e/sandbox-taskbar-preview.spec.ts`
  - `apps/web/src/app/**`
  - `e2e/**`
- input:
  - `plans/windows-taskbar-work-05-web-sandbox-retirement/phases/01-remove-route-owner.md`에서 `/sandbox/taskbar` route가 제거된 상태
  - 현재 `e2e/sandbox-taskbar-preview.spec.ts`는 `/sandbox/taskbar` bounded-surface route를 owner로 가진다.
  - replacement owner의 Storybook 세부 계약과 검증은 `plans/windows-taskbar-work-04-storybook-sandbox/phases/02-reference-stories.md`가 별도로 관리한다.
- output:
  - 공개 계약:
    - retired `/sandbox/taskbar` route를 owner로 삼는 bounded-surface Playwright spec이 source tree에서 제거된다.
    - app/web와 root test entry는 더 이상 `/sandbox/taskbar`를 taskbar reference prerequisite로 보지 않는다.
  - 내부 기본값:
    - taskbar reference 검토는 별도 Storybook plan이 계속 관리하고, route 기반 bounded-surface E2E는 이 feature의 owner가 아니다.
    - `pnpm test:e2e`는 retired route owner가 루트 실행을 막지 않는지 확인하는 용도이며, Storybook replacement owner 내부 상태를 증명하는 신호로 사용하지 않는다.
  - 허용하지 않는 상태:
    - retired route를 위해 spec만 유지하거나, 임시 no-op page를 만들어 spec을 계속 돌리는 구조
    - Storybook replacement surface를 새 Playwright route로 다시 감싸는 구조
- 선행조건: `plans/windows-taskbar-work-05-web-sandbox-retirement/phases/01-remove-route-owner.md` 완료
- 제약:
  - cross-route regression guard는 범위 밖이다.
  - Storybook smoke, marker 확인, browser automation은 이 plan이 아니라 별도 Storybook 계획 또는 후속 일감이 맡는다.
  - 이 phase는 local source inspection 없이 선행 plan 계약만으로 replacement owner 전제를 소비한다.
- failure/validation: root test entry나 search 결과에 `/sandbox/taskbar` owner가 남아 있으면 실패다. retired route 제거와 무관한 Storybook 내부 검증 부재를 이 phase blocker로 다시 끌어오면 범위가 흔들린다.
- 작업:
  - route 전용 bounded-surface Playwright spec을 retire한다.
  - app/web와 e2e source tree에서 `/sandbox/taskbar` 참조를 정리한다.
  - web build/lint/test가 retired route 없이도 green이 되도록 정리한다.
- 검증:
  - [ ] `pnpm --filter @windows/web lint`
  - [ ] `pnpm --filter @windows/web build`
  - [ ] `pnpm test:e2e`
  - [ ] `rg -n "/sandbox/taskbar" .\\apps\\web .\\e2e` 결과에 retired route 참조가 남지 않는다.
