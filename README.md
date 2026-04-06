# windows

pnpm + Turborepo 기반 모노레포.

## 구조

```
.
├── apps/
│   └── web/          # @windows/web — Next.js App Router
└── packages/
    ├── eslint-config/      # @windows/eslint-config
    ├── tailwind-config/    # @windows/tailwind-config
    ├── typescript-config/  # @windows/typescript-config
    ├── ui/                 # @windows/ui
    └── vitest-config/      # @windows/vitest-config
```

## Clean clone baseline

```bash
git clone <repo-url>
cd windows
pnpm install --frozen-lockfile
```

`pnpm-lock.yaml`은 리포지토리에 커밋되어 있으므로 `--frozen-lockfile`이 항상 유효하다.

## 검증 순서 (Canonical Validation Sequence)

루트에서 아래 순서로 실행한다. CI도 동일한 순서를 따른다.

```bash
pnpm install --frozen-lockfile   # lockfile 기준 의존성 설치
pnpm format                      # 포맷 체크 (turbo — 각 패키지에서 prettier --check 실행)
pnpm lint                        # 린트 (turbo)
pnpm test                        # 유닛 테스트 (vitest, passWithNoTests — 항상 통과)
pnpm build                       # 빌드 (turbo, 의존 순서 보장)
pnpm test:e2e                    # E2E 테스트 (playwright)
```

## 명령 계약

| 명령 | 설명 |
|---|---|
| `pnpm dev` | 전체 워크스페이스 개발 서버 (turbo) |
| `pnpm build` | 전체 워크스페이스 빌드 (turbo, 의존 순서 보장) |
| `pnpm lint` | 전체 워크스페이스 린트 (turbo) |
| `pnpm test` | 유닛 테스트 전체 실행 (vitest workspace) |
| `pnpm test:coverage` | 유닛 테스트 커버리지 포함 실행 |
| `pnpm test:e2e` | E2E 테스트 실행 (playwright) |
| `pnpm format` | 전체 워크스페이스 포맷 체크 (turbo — prettier --check) |

### Zero-test / no-spec 동작

- `pnpm test` — vitest `passWithNoTests` 설정으로 테스트 파일이 없어도 통과한다.
- `pnpm test:e2e` — playwright `--pass-with-no-tests` 플래그로 spec 파일이 없어도 통과한다.

### TDD 상태 안내

`packages/ui`에는 taskbar 컴포넌트 contract test가 존재하지만 구현체가 아직 없다.
`pnpm test`는 `passWithNoTests` 설정으로 인해 현재 상태에서도 exit 0으로 통과한다.
CI canonical sequence에 `pnpm test`가 포함되어 있으며 정상 동작한다.

## 롤백 체크포인트

이 fix 브랜치(`fix/windows-monorepo-validation-contracts`)는 main의 부모 커밋으로 revert할 수 있다.

```bash
# 병합 커밋 확인
git log --oneline main

# 특정 Phase 커밋으로 돌아가려면
git checkout <commit-hash>

# fix 브랜치 전체를 main에서 revert하려면
git revert <merge-commit-hash>
```

개별 Phase는 별도 커밋으로 기록되어 있다. `git log --oneline`에서 커밋 메시지로 Phase를 확인하고
원하는 시점으로 복원할 수 있다.

| Phase | 범위 | 되돌리는 방법 |
|---|---|---|
| Phase 1 | manifest/lockfile 계약 복구 | `git revert <phase-1-commit>` |
| Phase 2 | test runner CLI 계약 정렬 | `git revert <phase-2-commit>` |
| Phase 3 | CI workflow + README 정렬 | `git revert <phase-3-commit>` |
