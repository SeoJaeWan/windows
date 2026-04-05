**Branch:** fix/windows-monorepo-validation-contracts

> Worktree dir: `worktrees/windows-monorepo-validation-contracts` (plan 폴더명과 동일)

# Windows Monorepo Validation Contracts 실행 계획

> 요청당 plan 파일은 하나만 생성하고, 실행 순서는 아래 `Phase`들로만 표현한다.
> 추가 top-level section은 사용자 요청이나 별도 정책 요구가 없는 한 넣지 않는다.

## 단계별 실행

### Phase 1

- owner_agent: `general-developer`
- 목적: clean clone 기준으로 루트 표준 명령이 즉시 실행될 수 있도록 manifest와 lockfile 계약을 복구한다.
- boundary:
    - 루트 `package.json`
    - `pnpm-lock.yaml`
    - `apps/web/package.json`
    - manifest 정합성에 직접 연결되는 최소 package metadata
- input:
    - 현재 루트 표준 명령 계약(`dev`, `build`, `lint`, `test`, `test:coverage`, `test:e2e`, `format`)
    - clean workspace 검증에서 확인된 missing CLI와 missing type dependency 문제
    - 현재 tracked/untracked lockfile 상태
- output:
    - 루트와 앱 명령이 요구하는 런타임/개발 의존성이 명시된 manifest
    - `--frozen-lockfile` 기준으로 재현 가능한 tracked `pnpm-lock.yaml`
    - 실행 중 dependency auto-install에 의존하지 않는 build baseline
- 선행조건: `none`
- 제약:
    - 기존 workspace topology(`apps/web`, `packages/*`)와 `@windows/*` 스코프를 유지한다.
    - 루트 표준 명령 이름은 바꾸지 않는다.
    - 새 framework나 새 workspace package는 도입하지 않는다.
- 작업:
    - 루트와 `apps/web` 스크립트가 직접 호출하는 CLI를 manifest에 명시적으로 선언한다.
    - `apps/web` build가 요구하는 TypeScript ambient dependency gap을 제거해 `next build`가 실행 중 패키지 설치를 시도하지 않게 한다.
    - manifest 변경과 정합한 `pnpm-lock.yaml`을 생성 또는 갱신하고, 이 파일을 tracked 상태로 고정한다.
- 검증:
    - [ ] clean workspace에서 `pnpm install --frozen-lockfile`가 추가 수정 없이 통과한다.
    - [ ] clean workspace에서 `pnpm format`이 missing binary 없이 통과한다.
    - [ ] clean workspace에서 `pnpm build`가 dependency auto-install 시도 없이 통과한다.

### Phase 2

- owner_agent: `general-developer`
- 목적: 현재 설치된 Vitest/Playwright CLI surface와 호환되는 루트 test 계약으로 재정의해 zero-test와 no-spec baseline을 통과시킨다.
- boundary:
    - 루트 `package.json`
    - `vitest.workspace.ts`
    - `apps/web/vitest.config.ts`
    - 루트 `playwright.config.ts`
    - `e2e/**` 중 baseline runner 계약에 직접 연결되는 최소 파일
- input:
    - Phase 1에서 복구된 manifest/lockfile
    - 현재 Vitest CLI help에서 확인된 `--project`, `--passWithNoTests` 계약
    - 현재 Playwright CLI help에서 확인된 `--pass-with-no-tests` 계약
    - `@windows/web` webServer 실행 계약
- output:
    - 설치된 Vitest 버전과 호환되는 루트 unit test 명령
    - spec 부재 시 종료 코드 0을 반환하는 루트 E2E 명령
    - future test file 추가를 막지 않는 monorepo runner baseline
- 선행조건:
    - Phase 1 완료
- 제약:
    - `test`, `test:coverage`, `test:e2e` 명령 이름은 유지한다.
    - `playwright.config.ts`는 계속 `@windows/web`를 webServer 대상으로 참조한다.
    - 이번 작업에서는 feature unit test나 feature E2E spec 자체를 새로 작성하지 않는다.
- 작업:
    - 루트 Vitest invocation을 현재 버전이 지원하는 workspace/project 실행 방식으로 교체하고, zero-test baseline에서도 종료 코드 0을 반환하게 정리한다.
    - coverage 명령도 같은 실행 계약 위에서 동작하게 맞춘다.
    - 루트 E2E 명령 또는 Playwright invocation에 no-spec 성공 조건을 반영하되, 향후 `e2e/*.spec.ts` discovery와 artifact 경로는 유지한다.
- 검증:
    - [ ] clean workspace에서 `pnpm test`가 zero-test baseline에서도 종료 코드 0을 반환한다.
    - [ ] clean workspace에서 `pnpm test:coverage`가 같은 계약으로 동작한다.
    - [ ] clean workspace에서 `pnpm test:e2e`가 spec 부재 시에도 종료 코드 0을 반환한다.
    - [ ] `playwright.config.ts`는 계속 `@windows/web`를 webServer target으로 참조한다.

### Phase 3

- owner_agent: `general-developer`
- 목적: CI와 운영 문서를 실제로 실행 가능한 루트 검증 계약과 맞추고, 이 보완 작업의 롤백 경계를 명확히 남긴다.
- boundary:
    - `.github/workflows/ci.yml`
    - `README.md`
    - 루트 실행 계약과 직접 연결된 최소 운영 문서
- input:
    - Phase 1~2에서 정리된 manifest, lockfile, runner 계약
    - 현재 CI install/test/build 순서
    - 현재 README 명령 표와 롤백 안내
- output:
    - committed lockfile과 수정된 루트 명령을 기준으로 검증하는 CI
    - clean clone baseline과 canonical validation sequence를 반영한 README
    - 이 보완 작업을 되돌릴 최소 롤백 경계
- 선행조건:
    - Phase 2 완료
- 제약:
    - 루트 명령 surface는 유지한다.
    - 로컬 전용 workaround나 수동 설치 절차를 정상 운영 경로로 문서화하지 않는다.
- 작업:
    - CI workflow를 committed lockfile과 수정된 루트 명령 기준으로 정렬하고, job 순서와 검증 포인트를 canonical sequence에 맞춘다.
    - README에 clean clone baseline, 루트 명령 순서, no-spec E2E semantics, 롤백 체크포인트 사용 방법을 명시한다.
    - clean workspace에서 표준 검증 명령 전체를 다시 실행해 acceptance 증빙이 가능한 상태로 마감한다.
- 검증:
    - [ ] workflow가 untracked lockfile이나 폐기된 경로를 더 이상 가정하지 않는다.
    - [ ] README의 명령 표와 실제 루트 scripts/CI sequence가 일치한다.
    - [ ] clean workspace에서 `pnpm install --frozen-lockfile`, `pnpm format`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:e2e`가 순서대로 통과한다.

## 테스트 계획

- `plan-materialize`: `skip`
- 보고서: `plans/windows-monorepo-validation-contracts/materialize.md` (materialization 후)
- 비고:
    - 이번 작업은 root tooling, runner, CI 계약 복구 범위로 한정하며 source-tree test materialization을 별도로 요구하지 않는다.
    - 실제 검증은 phase별 명령 체크리스트와 clean workspace 실행으로 완료한다.
