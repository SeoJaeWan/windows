**Branch:** feat/windows-taskbar-work-05-web-sandbox-retirement

> Worktree dir: `worktrees/windows-taskbar-work-05-web-sandbox-retirement` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 무엇을 없애고 무엇을 별도 계획에 남기는지 빠르게 이해할 수 있게 적는다.
> 세부 경계, 작업, 검증은 각 phase 상세 문서에서 다룬다.

# Windows Web Sandbox Retirement 실행 계획

## 단계별 실행

### Phase 1. taskbar 웹 미리보기 경로 없애기

- 목적: `apps/web`가 taskbar reference를 보여주던 `/sandbox/taskbar` 페이지와 전용 테스트를 없애고, 이 역할이 더 이상 app/web에 남지 않게 한다.
- 변경 내용: `/sandbox/taskbar` route와 route-local test를 source tree에서 제거한다.
- 이전 상태: taskbar reference를 확인하려면 app/web의 `/sandbox/taskbar` route와 그 주변 test를 계속 유지해야 한다.
- 이후 상태: app/web에는 taskbar 전용 미리보기 경로가 남지 않고, 대체 owner 계약은 별도 Storybook 계획이 계속 맡는다.
- 관련 영향: `apps/web/src/app/sandbox/taskbar/**`, route-local test, 후속 route-owned E2E 정리
- 시작 조건: 별도 Storybook 계획에서 대체 owner 계약이 문서화되어 있음
- 상세: `./phases/01-remove-route-owner.md`

### Phase 2. route 전용 브라우저 테스트 없애기

- 목적: retired route만 바라보는 Playwright spec과 잔여 참조를 지워 app/web와 루트 E2E 실행이 `/sandbox/taskbar`를 다시 요구하지 못하게 한다.
- 변경 내용: route 전용 Playwright spec과 route 참조 흔적을 제거하고, 검증 경로가 retired route 없이 끝나도록 정리한다.
- 이전 상태: source tree와 E2E가 여전히 `/sandbox/taskbar`를 찾기 때문에 route 삭제만으로는 정리가 끝나지 않는다.
- 이후 상태: app/web와 루트 E2E 실행은 retired route를 더 이상 찾지 않고, Storybook 쪽 검증은 다른 계획이 계속 맡는다.
- 관련 영향: `e2e/sandbox-taskbar-preview.spec.ts`, app/web 및 e2e search 결과, 후속 legacy cleanup 전제
- 시작 조건: Phase 1 완료
- 상세: `./phases/02-remove-route-verification.md`
