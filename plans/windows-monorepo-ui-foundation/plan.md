**Branch:** chore/setup-windows-monorepo-ui-foundation

> Worktree dir: `worktrees/chore-setup-windows-monorepo-ui-foundation` (`Branch`의 `/`를 `-`로 치환)

# Windows Monorepo UI Foundation 실행 계획

> 요청당 plan 파일은 하나만 생성하고, 실행 순서는 아래 `Phase`들로만 표현한다.

## 단계별 실행

### Phase 1

- owner_agent: `general-developer`
- 목적: 루트 저장소를 `pnpm workspace + turbo` 기준으로 실행할 수 있는 모노레포 기본 계약으로 전환한다.
- boundary:
    - 루트 `package.json`
    - `pnpm-workspace.yaml`
    - `turbo.json`
    - 루트 기준 workflow/ignore/documentation 중 경로 계약에 직접 연결되는 파일
- input:
    - 현재 루트 단일 앱 구조
    - 기존 루트 스크립트 계약(`dev`, `build`, `lint`, `test`, `format`)
- output:
    - 루트 workspace 선언 파일
    - `turbo` task graph
    - 루트 표준 명령 계약
- 선행조건: `none`
- 제약:
    - 패키지 스코프는 `@windows/*`를 사용한다.
    - 저장소 기본 구조는 `apps/web` + `packages/*`로 간다.
    - `remote cache`와 `compiled dist build`는 이번 단계에 포함하지 않는다.
- 작업:
    - 루트 `package.json`을 모노레포 오케스트레이션 중심으로 재정의한다.
    - `pnpm-workspace.yaml`에 `apps/*`, `packages/*`를 선언한다.
    - `turbo.json`에 최소 `dev`, `build`, `lint`, `test`, `format` 태스크를 정의한다.
    - 루트에서 유지할 파일과 `apps/web`로 이동할 파일의 기준 경계를 고정한다.
- 검증:
    - [ ] 루트 명령 계약이 `turbo` 중심으로 일관되게 재정의된다.
    - [ ] workspace 패턴이 `apps/*`, `packages/*` 기준으로만 선언된다.
    - [ ] 이 단계 결과가 `dist` 출력 또는 원격 캐시를 요구하지 않는다.

### Phase 2

- owner_agent: `general-developer`
- 목적: 이후 UI 이관을 받을 수 있도록 공유 패키지 경계와 공통 설정 패키지를 먼저 스캐폴딩한다.
- boundary:
    - `packages/ui/**`
    - `packages/tailwind-config/**`
    - `packages/typescript-config/**`
    - `packages/eslint-config/**`
    - `packages/vitest-config/**`
- input:
    - Phase 1의 workspace 계약
    - 현재 Tailwind v4 CSS-first globals 정의
    - 현재 TypeScript, ESLint, Vitest 설정
- output:
    - 공유 패키지 manifest/entrypoint
    - CSS-first Tailwind 공유 설정 패키지
    - 공통 TypeScript, ESLint, Vitest 설정 패키지
- 선행조건:
    - Phase 1 완료
- 제약:
    - `@windows/ui`는 React 패키지이며 `source export` 전략으로 시작한다.
    - `@windows/ui`는 `server-safe` 기본을 유지하고 Next 전용 책임을 소유하지 않는다.
    - `@windows/tailwind-config`는 legacy `tailwind.config.*` 공유가 아니라 CSS-first 공유 설정 패키지다.
    - 기존 앱 컴포넌트는 이번 단계에서 `@windows/ui`로 이동하지 않는다.
- 작업:
    - 각 공유 패키지의 `package.json`, `exports`, 기본 entrypoint, 최소 `tsconfig`를 스캐폴딩한다.
    - `@windows/tailwind-config`에 공통 `@theme`, utility, CSS 변수 정의를 담을 구조를 만든다.
    - 현재 루트 TypeScript, ESLint, Vitest 설정에서 공유 가능한 부분을 각 패키지로 승격한다.
    - `@windows/ui`의 서버 안전 기본 경계와 interactive 분리 가능 경계를 패키지 계약에 반영한다.
- 검증:
    - [ ] 공유 패키지들이 `workspace:*` 기준으로 해석 가능하다.
    - [ ] `@windows/ui`가 Next 전용 API를 소유하지 않는다.
    - [ ] `@windows/tailwind-config`가 CSS-first 패키지로 정의된다.
    - [ ] `@windows/vitest-config`가 단일 앱 경로 별칭에 고정되지 않는다.

### Phase 3

- owner_agent: `frontend-developer`
- 목적: 현재 루트 Next 앱을 `apps/web`로 재배치하고 공유 패키지 소비 계약을 앱 경계에 연결한다.
- boundary:
    - `apps/web/**`
    - 앱 경계로 이동되는 기존 루트 앱 파일
    - `apps/web`가 참조하는 최소 루트 연결 설정
- input:
    - 현재 루트 Next.js 앱 파일과 정적 자산
    - Phase 2에서 준비된 공유 패키지 계약
- output:
    - `apps/web` 기반 Next 앱
    - `@windows/tailwind-config`와 `@windows/ui`를 소비하는 앱 wiring
    - 공유 테스트 설정을 소비하는 앱 테스트 wiring
- 선행조건:
    - Phase 2 완료
- 제약:
    - `apps/web`는 Next.js 앱이며 `next/link`, `next/image`, `next/navigation`, metadata, font, server action 같은 Next 전용 책임을 가진다.
    - 사용자 가시 동작은 유지하고 UI 컴포넌트 이관은 다음 단계로 남긴다.
- 작업:
    - 현재 루트 앱 소스, 정적 자산, 앱 전용 설정 파일을 `apps/web` 경계로 이동한다.
    - 앱 패키지 이름과 스크립트, 의존성을 workspace 기준으로 재정리한다.
    - `globals.css`, PostCSS, Next 설정을 공유 Tailwind 패키지와 연동한다.
    - `@windows/ui` 소비에 필요한 앱 설정(`transpilePackages` 등)을 반영한다.
    - 앱 단위 Vitest 설정을 모노레포 구조와 공유 테스트 설정에 맞게 재배치한다.
- 검증:
    - [ ] `apps/web`가 단일 Next 소비 앱으로 독립 실행 가능하다.
    - [ ] 공유 Tailwind 설정을 import한 뒤에도 앱 스타일 빌드가 정상 동작한다.
    - [ ] 앱 안의 Next 전용 책임이 `packages/ui`로 새어 나가지 않는다.
    - [ ] 기존 unit 테스트가 `apps/web` 기준 경로에서 다시 해석 가능하다.

### Phase 4

- owner_agent: `general-developer`
- 목적: 모노레포 기준 unit/E2E 러너 환경을 고정해 후속 테스트 작성이 설정 부재에 막히지 않도록 만든다.
- boundary:
    - 루트 `vitest` 설정
    - 루트 `playwright.config.*`
    - 루트와 앱의 테스트 스크립트
    - 테스트 전용 setup/fixture 경로
- input:
    - Phase 1~3 산출물
    - 현재 루트 `vitest.config.ts`
    - 기존 unit 테스트 위치
- output:
    - 루트 기준 Vitest project 구성
    - `@windows/vitest-config`를 소비하는 앱 테스트 계약
    - 루트 Playwright 실행 환경
    - `test:e2e` 명령과 artifact 기준
- 선행조건:
    - Phase 3 완료
- 제약:
    - 기존 Vitest 환경은 제거하지 않고 모노레포 기준으로 재배치한다.
    - Playwright는 이번 단계에서 러너, 설정, 스크립트만 도입한다.
    - 실제 feature E2E 시나리오와 guard spec 작성은 이번 단계 범위 밖이다.
- 작업:
    - 루트 Vitest를 monorepo-aware 구성으로 정리하고 `@windows/vitest-config`에 공통 setup을 연결한다.
    - 루트 `playwright.config.*`를 추가하고 `webServer`를 `@windows/web` 실행 계약에 연결한다.
    - `test:e2e` 명령을 추가하고 초기 환경 검증이 가능하도록 구성한다.
    - artifact 위치와 reporter 같은 최소 실행 기준만 고정한다.
- 검증:
    - [ ] 루트 Vitest 설정이 `apps/web`와 future package 경로를 수용한다.
    - [ ] 기존 unit 테스트가 모노레포 경로에서도 실행 가능하다.
    - [ ] Playwright 설정이 `apps/web`를 대상 웹서버로 참조한다.
    - [ ] E2E 스펙이 아직 없어도 환경 검증 명령이 실패하지 않는다.

### Phase 5

- owner_agent: `general-developer`
- 목적: 모노레포 전환 후 루트 기준 개발, 검증, 폴백 계약을 마감한다.
- boundary:
    - 루트 스크립트
    - workflow 및 경로 민감 도구
    - 루트 문서 중 실행 계약과 직접 연결되는 파일
- input:
    - Phase 1~4 산출물
    - 기존 검증 명령 세트와 workflow 경로
- output:
    - 루트 표준 검증 명령
    - 경로 갱신이 반영된 workflow/tooling
    - 롤백 체크포인트
- 선행조건:
    - Phase 4 완료
- 제약:
    - 루트 표준 명령은 `dev`, `build`, `lint`, `test`, `format`을 유지한다.
    - 루트 보조 테스트 명령은 `test:coverage`, `test:e2e`를 노출한다.
- 작업:
    - 루트 `dev`, `build`, `lint`, `test`, `format` 명령을 모노레포 기준으로 정규화한다.
    - `test:coverage`, `test:e2e`를 포함한 루트 테스트 명령 계약을 정리한다.
    - 기존 path-sensitive workflow와 스크립트를 `apps/web`, `packages/*` 구조에 맞게 갱신한다.
    - 루트 기준 운영 문서와 폴백 체크포인트를 정리한다.
- 검증:
    - [ ] 루트 기준 검증 명령이 모두 정의되고 실행 순서가 명확하다.
    - [ ] unit, E2E 관련 루트 명령이 새 구조에서 일관되게 노출된다.
    - [ ] 기존 workflow와 스크립트가 폐기된 루트 앱 경로를 더 이상 가정하지 않는다.
    - [ ] 실패 시 되돌릴 최소 롤백 지점이 명시된다.
