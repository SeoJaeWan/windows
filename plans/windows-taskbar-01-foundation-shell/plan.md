**Branch:** style/windows-taskbar-01-foundation-shell

> Worktree dir: `worktrees/windows-taskbar-01-foundation-shell` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 기술적인 입력/출력 계약, 파일 경계, 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows Taskbar 기준값 정리 실행 계획

## 단계별 실행

### Phase 1. Taskbar 기준값 정리

- 목적: 블로그 작업 표시줄에서 실제로 쓰는 색, 글자색, 높이, 포커스 표시까지 이번 기준값에 포함하고, 각 값의 출처를 먼저 고정한다.
- 변경 내용: `packages/tailwind-config/src/theme.css`의 작업 표시줄 기본값을 블로그 `globals.css`의 변수와 `.taskbar-glass`, 검색 포커스 스타일, 그리고 `bottomBar` 높이 정의까지 합쳐 다시 잡는다.
- 이전 상태: 공통 설정은 어두운 작업 표시줄 값을 들고 있고, 블로그의 밝은 유리 느낌 작업 표시줄과 맞지 않는다.
- 이후 상태: 공통 설정이 작업 표시줄의 색, 글자색, 높이, 포커스 표시를 모두 블로그의 확인 가능한 근거에 맞춰 제공한다. 그래서 다음 단계가 값을 추측하지 않고 진행될 수 있다.
- 관련 영역: `packages/tailwind-config/src/theme.css`, `~/Desktop/dev/blog/src/app/globals.css`, `~/Desktop/dev/blog/src/components/templates/bottomBar/index.tsx`, `packages/ui/src/components/taskbar/**`
- 시작 조건: 블로그 `globals.css`의 작업 표시줄 변수, 글자색, 검색 포커스 표시와 `bottomBar`의 높이 정의가 서로 다른 곳에 있다는 점을 먼저 확인한다.
- 상세: `./phases/01-taskbar-token-baseline.md`

### Phase 2. 유리 배경 묶음 정리

- 목적: 1단계에서 정한 값만으로 작업 표시줄 바탕의 배경과 포커스 표시를 한곳에서 관리하게 만든다.
- 변경 내용: `packages/tailwind-config/src/utilities.css`에 블로그의 `.taskbar-glass`와 같은 역할을 옮기되, 그라데이션, 기본 배경색, 흐림, 채도, 경계선, 그림자를 모두 1단계에서 정한 값만 읽게 만든다. 포커스 표시는 검색 입력 바깥선이 같은 값을 읽도록 쓸 수 있는 형태로 정리한다.
- 이전 상태: 공통 스타일 묶음은 단순 배경색과 흐림만 제공해서 블로그의 유리 느낌 배경을 끝까지 재현하지 못한다.
- 이후 상태: 공통 스타일 묶음만 불러도 작업 표시줄 바탕의 유리 느낌과 포커스 표시 기준이 함께 고정되고, `packages/ui`의 바깥 틀은 배경, 경계선, 그림자를 따로 적지 않아도 된다. 검색창이나 아이콘 hover처럼 세부 모양은 이번 범위 밖에 남는다.
- 관련 영역: `packages/tailwind-config/src/utilities.css`, `packages/tailwind-config/src/base.css`
- 시작 조건: 1단계에서 작업 표시줄 바탕에 쓸 이름과 값이 정해져 있어야 한다.
- 상세: `./phases/02-taskbar-glass-utilities.md`

### Phase 3. 현재 연결 점검

- 목적: 새 기준값이 지금 연결된 곳에서 바로 읽히는지 확인하고, 꼭 필요한 최소 조정만 남긴다.
- 변경 내용: 작업 표시줄 바깥 틀은 새 공통 스타일을 쓰도록 정리하고, 검색 입력 바깥선은 하드코딩된 `ring-2` 대신 새 포커스 기준값을 읽도록 최소 수정한다. 높이와 글자색도 현재 연결부가 그대로 이어지는지 확인한다. 검증은 `@windows/tailwind-config`가 내보내는 CSS와 이를 읽는 `apps/web`, `packages/ui/.storybook`의 연결에 한정한다.
- 이전 상태: `packages/ui` 작업 표시줄 바깥 틀은 기존 배경 스타일과 이름에 묶여 있어서 공통 기준을 바꾸면 연결부도 함께 흔들릴 수 있다.
- 이후 상태: 어디를 최소한으로 바꾸면 새 기준을 따라갈 수 있는지 분명해지고, 확인 범위도 CSS를 내보내고 불러오는 경계와 현재 작업 표시줄 연결부로 좁혀진다.
- 관련 영역: `packages/tailwind-config/package.json`, `apps/web/src/app/globals.css`, `packages/ui/.storybook/storybook.css`, `packages/ui/src/components/taskbar/taskbar/index.tsx`, `packages/ui/src/components/taskbar/taskbarSearch/index.tsx`
- 시작 조건: Phase 2 utility 계약이 완료돼 있어야 한다.
- 상세: `./phases/03-immediate-token-consumers.md`
