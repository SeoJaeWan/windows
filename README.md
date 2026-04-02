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

## 명령 계약

루트에서 실행하는 표준 명령:

| 명령 | 설명 |
|---|---|
| `pnpm dev` | 전체 워크스페이스 개발 서버 (turbo) |
| `pnpm build` | 전체 워크스페이스 빌드 (turbo, 의존 순서 보장) |
| `pnpm lint` | 전체 워크스페이스 린트 (turbo) |
| `pnpm test` | 유닛 테스트 전체 실행 (vitest workspace) |
| `pnpm test:coverage` | 유닛 테스트 커버리지 포함 실행 |
| `pnpm test:e2e` | E2E 테스트 실행 (playwright) |
| `pnpm format` | 전체 워크스페이스 포맷 체크 (turbo) |

## 롤백 체크포인트

Phase 1~5 각 단계는 별도 커밋으로 기록되어 있다. 특정 단계로 복원하려면 해당 커밋 해시 또는 태그/브랜치로 체크아웃한다.

```bash
git log --oneline
git checkout <commit-hash>
```
