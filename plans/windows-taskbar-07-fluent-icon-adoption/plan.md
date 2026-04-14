**Branch:** feat/windows-taskbar-07-fluent-icon-adoption

> Worktree dir: `worktrees/windows-taskbar-07-fluent-icon-adoption` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 기술적인 입력/출력 계약, 파일 경계, 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows Taskbar Fluent 아이콘 도입 실행 계획

## 단계별 실행

### Phase 1. 아이콘 기반 정리

- 목적: `packages/ui`가 공식 `@fluentui/react-icons`를 직접 의존하고, panel 콘텐츠 아이콘의 내부 owner module과 root entry leak guard까지 package 안에서 먼저 고정한다.
- 변경 내용: `packages/ui` 런타임 의존성 전략을 닫고, 루트 `assets/file.png`와 `assets/folder.png`를 package-owned panel asset owner module로 들여온다. 이 단계에서는 새 내부 asset owner가 root export로 새지 않는다는 점과 Windows 버튼, taskbar 앱 아이콘 슬롯이 그대로 유지된다는 범위도 함께 고정한다.
- 이전 상태: search icon과 chevron은 각자 하드코딩 구현을 쓰고, panel 콘텐츠 아이콘은 이모지 문자열에 기대며, `packages/ui`는 Fluent 아이콘 패키지를 직접 소유하지 않는다.
- 이후 상태: Fluent 시스템 아이콘과 panel 콘텐츠 자산이 모두 `packages/ui` 경계 안에서 준비돼, 다음 단계가 공개 prop 계약과 시각 교체를 같은 기준으로 진행할 수 있다.
- 관련 영역: `packages/ui/package.json`, `pnpm-lock.yaml`, `packages/ui/src/components/panels/windows/internal/contentIcon/**`, `assets/file.png`, `assets/folder.png`
- 시작 조건: `none`
- 상세: `./phases/01-runtime-dependency-and-package-assets.md`

### Phase 2. 패널 콘텐츠 자산 전환

- 목적: panel 본문이 더 이상 이모지를 직접 렌더링하지 않고, package-owned `file`/`folder` 자산을 쓰는 명시적 계약으로 바뀌게 한다.
- 변경 내용: `WindowsPanelPinnedBody`, `WindowsPanelAllBody`, `WindowsPanelSearchBody`의 콘텐츠 item 입력을 `iconSrc` 중심으로 바꾸고, Storybook fixture·stories·component tests를 같은 계약으로 옮긴다. 문서/포스트/체크리스트류는 `file`, 프로젝트/폴더류는 `folder` 자산으로 고정한다.
- 이전 상태: exported panel body들은 `icon: string`을 받아 텍스트 이모지를 그대로 그리며, fixture와 테스트도 그 이모지 surface를 사실상 공용 계약처럼 사용한다.
- 이후 상태: panel 콘텐츠 아이콘은 명시적 asset source로만 들어오고, search preview의 대표 아이콘도 같은 `iconSrc`를 따라가며, fixture/test/story가 모두 같은 winner contract를 공유한다.
- 관련 영역: `packages/ui/src/components/panels/windows/windowsPanelPinnedBody/**`, `packages/ui/src/components/panels/windows/windowsPanelAllBody/**`, `packages/ui/src/components/panels/windows/windowsPanelSearchBody/**`, `packages/ui/src/components/panels/windows/storybook/windowsPanelReferenceFixtures.ts`
- 시작 조건: Phase 1의 package-owned asset과 dependency 전략이 준비돼 있어야 한다.
- 상세: `./phases/02-panel-content-icon-assets.md`

### Phase 3. Fluent 시스템 아이콘 적용

- 목적: taskbar/panel의 시스템 affordance만 공식 Fluent 아이콘으로 바꾸고, 그 회귀 경계를 Storybook과 컴포넌트 검증까지 포함해 닫는다.
- 변경 내용: taskbar search magnifier, panel header chevrons, search result row chevron, search preview action icons를 `@fluentui/react-icons`의 `Regular` variant로 교체한다. 각 recipient는 local test가 바로 확인할 수 있는 slot marker를 함께 갖고, preview action은 여전히 네 개의 고정 한국어 명령만 유지하며 panel 콘텐츠 아이콘은 Fluent로 바꾸지 않는다.
- 이전 상태: search는 data URI mask, chevron은 inline SVG, preview action은 텍스트만 있어서 같은 panel 안에서도 시스템 아이콘 표현이 제각각이다.
- 이후 상태: 시스템 affordance는 모두 공식 Fluent 컴포넌트로 통일되고, panel 콘텐츠는 asset image, taskbar 앱/Windows 버튼은 기존 asset surface를 유지하는 분리 원칙이 package 검증 안에서 고정된다.
- 관련 영역: `packages/ui/src/components/taskbar/taskbarSearch/**`, `packages/ui/src/components/panels/windows/internal/chevron/**`, `packages/ui/src/components/panels/windows/windowsPanelSearchBody/**`, `packages/ui/src/components/panels/windows/windowsPanelPinnedBody/**`, `packages/ui/src/components/panels/windows/windowsPanelAllBody/**`, `packages/ui/src/components/taskbar/storybook/storybookBootstrap.test.ts`
- 시작 조건: Phase 2의 panel 콘텐츠 아이콘 계약과 fixture migration이 끝나 있어야 한다.
- 상세: `./phases/03-fluent-affordance-icons.md`
