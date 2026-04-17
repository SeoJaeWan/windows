# Windows 포트폴리오 리메이크

## 프로젝트 개요

https://seojaewan.com (NEU - Never End, Ever Update) 포트폴리오 사이트를 리메이크하는 프로젝트.
기존 사이트의 Windows 테마 인터페이스를 계승하면서, UI와 요소(컴포넌트)를 명확히 분리하는 아키텍처로 재구축한다.

## 기존 사이트 구성

- **블로그** — 기술 문서, 회고글
- **프로젝트** — 개발 포트폴리오
- **코딩 테스트** — 알고리즘 풀이
- **소개** — 이력서/자기소개
- **기술 스택**: Next.js, TypeScript, Tailwind CSS, Jotai, Notion API
- **디자인**: Windows OS 테마 UI, 다크모드 지원, 폴더 아이콘 네비게이션

## 리메이크 목표

- UI(레이아웃, 페이지)와 요소(재사용 가능한 컴포넌트)를 분리
- 모노레포 구조: `@windows/*` 스코프, `apps/web` + `packages/*`
- 빌드: Turborepo + pnpm

## Rules

프로젝트 규칙은 `.claude/rules/` 폴더에서 관리한다. 관련 작업 시 반드시 해당 파일을 확인하고 따른다.

- [아이콘 정책](rules/icons.md) — `@fluentui/react-icons` 사용 규칙
- [Storybook 컨벤션](rules/storybook.md) — domain root taxonomy, Components/Compose 역할 분리, literal title rule, meta.component owner rule, compare 패턴, 픽스처 확장자
- [컴포넌트 설계 원칙](rules/component-design.md) — leaf 컴포넌트 책임 범위, disabled 처리
- [packages/ui 패키지 경계 규칙](rules/packages-ui-boundary.md) — canonical inventory, read-only anchor, explicit negative scope, validation alignment
- [interactive 훅 규칙](rules/interactive-hooks.md) — 폴더 구조(훅별 named 폴더 + index.ts), 테스트 언어(한국어), harness 패턴, public export 경계

## Storybook 운영 규칙 (final reminder)

`packages/ui` Storybook 작업 시 반드시 아래 두 규칙을 따른다.

1. **Taxonomy**: canonical root는 `Taskbar`, `Panels`, `Windows` 3개다.
   - `Taskbar/*` — 태스크바 컴포넌트. `Taskbar/Components/Name` 또는 `Taskbar/Compose/Name` 형식.
   - `Panels/*` — panel family. `Panels/Windows/*`, `Panels/Search/*`, `Panels/Context/*` 세그먼트 사용.
   - `Windows/*` — window family. `Windows/Folder`, `Windows/Browser` 형식 (두 번째 세그먼트가 컴포넌트 이름).
   - `Windows Panel/*`, `Context Panel/*`, `Taskbar Foundation/*`, `Windows/Components/*`, `Search/Components/*`, `Context/Components/*`, `Search/Compose/*`, `Context/Compose/*` 등 legacy root 및 old 4-root taxonomy는 사용 금지.
2. **Literal title**: `meta.title`은 literal string만 허용한다. imported const나 helper function return value 기반 title은 금지.
