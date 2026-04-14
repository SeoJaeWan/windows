**Branch:** refactor/windows-common-icon-primitive

> Worktree dir: `worktrees/windows-common-icon-primitive` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 먼저 `전체 작업 지도`에서 흐름을 보고, 아래 phase 카드에서 무엇이 바뀌는지와 무엇을 확인해야 하는지 본다.
> 기술적인 입력/출력 계약, 파일 경계, 상세 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows 공통 아이콘 프리미티브 실행 계획

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. 공통 프리미티브 정리 | `taskbar/internal/icon`에 있던 이미지 wrapper를 `components/common` 내부 공통 렌더링 컴포넌트로 옮기고, taskbar 두 버튼이 새 owner를 직접 쓰게 만든다. | 공통 이미지 렌더링 책임이 taskbar 밖으로 이동하고, taskbar의 button/status/Windows asset 책임은 그대로 taskbar 경계에 남는다. | panel이 그대로 재사용할 수 있는 internal common icon/image contract와 taskbar 회귀 기준 |
| Phase 2. 패널 재사용 전환 | windows panel 세 본문이 raw `<img>` 대신 공통 렌더링 컴포넌트를 쓰도록 바꾸고, panel tests와 Storybook 회귀를 같은 계약으로 닫는다. | taskbar와 panel이 같은 공통 이미지 렌더링 컴포넌트를 쓰되, panel의 `iconSrc` 의미와 taskbar 전용 affordance 분리가 유지된다. | 구현 전 handoff에 바로 사용할 최종 실행 계약과 패키지 단위 검증 기준 |

## 단계별 실행

### Phase 1. 공통 프리미티브 정리

- 목적: `taskbar` 안에 묶여 있던 공유 이미지 렌더링을 중립 경계로 옮기되, taskbar 버튼 surface와 Windows mark asset ownership은 분리된 상태로 고정한다.
- 실제 작업: `packages/ui/src/components/common/iconImage/**`를 internal owner로 만들고 `TaskbarIconButton`, `TaskbarWindowsButton`, `windows-mark.png` 경로를 새 구조에 맞게 정리한다. `packages/ui/src/components/taskbar/internal/icon/**`는 shim 없이 retire한다.
- 이전 상태: 공통 이미지 wrapper가 taskbar internal에 있고, `TaskbarIconButton`과 `TaskbarWindowsButton`만 그 경로를 직접 알아야 하며, Windows mark asset도 같은 폴더 구조에 매달려 있다.
- 이후 상태: taskbar는 공통 이미지 렌더링 컴포넌트를 소비하는 surface owner가 되고, shared owner 자체는 `components/common`에 모여 panel이 같은 경계를 그대로 재사용할 준비가 된다.
- 확인 포인트: 새 common primitive가 root export에 추가되지 않고, `packages/ui/src/components/taskbar/internal/icon/index.tsx`, `packages/ui/src/components/taskbar/internal/icon/icon.test.tsx`, `packages/ui/src/components/taskbar/internal/icon/assets/windows-mark.png`가 모두 사라진 상태에서 taskbar story/test contract가 같은 marker와 state를 유지한 채 green으로 남아 있어야 한다.
- 관련 영역: `packages/ui/src/components/common/iconImage/**`, `packages/ui/src/components/taskbar/taskbarIconButton/**`, `packages/ui/src/components/taskbar/taskbarWindowsButton/**`, `packages/ui/src/components/taskbar/internal/icon/**`
- 시작 조건: `none`
- 상세: `./phases/01-common-icon-owner-and-taskbar-adoption.md`

### Phase 2. 패널 재사용 전환

- 목적: panel body 세 곳의 content image 렌더링을 공통 렌더링 컴포넌트로 통일하되, panel-owned `iconSrc` semantics와 content asset ownership은 그대로 둔다.
- 실제 작업: `WindowsPanelPinnedBody`, `WindowsPanelAllBody`, `WindowsPanelSearchBody`에서 raw `<img>`를 공통 렌더링 컴포넌트로 바꾸고, component tests와 package Storybook build, `windowsPanelReferenceFixtures.ts`의 5개 고정 state inventory를 그 경계에 맞춰 닫는다.
- 이전 상태: panel fixture는 이미 `iconSrc`와 `contentIcon` asset owner를 쓰지만, 실제 렌더링은 각 body가 제각각 raw `<img>`를 출력한다.
- 이후 상태: taskbar와 panel이 같은 internal image primitive를 공유하고, panel은 여전히 `iconSrc`, empty/index negative output, search preview 공유 규칙, `pinned-default`·`all-list`·`all-index`·`search-results`·`search-empty` reference-state inventory를 자기 경계에서 유지한다.
- 확인 포인트: 세 panel body가 모두 common primitive를 직접 사용하고, `packages/ui/src/components/taskbar/internal/icon/index.tsx`, `packages/ui/src/components/taskbar/internal/icon/icon.test.tsx`, `packages/ui/src/components/taskbar/internal/icon/assets/windows-mark.png`가 다시 등장하지 않아야 하며, `windowsPanelReferenceFixtures.ts`의 5개 고정 state inventory와 `@windows/ui` 테스트, Storybook build가 함께 green이어야 한다.
- 관련 영역: `packages/ui/src/components/panels/windows/windowsPanelPinnedBody/**`, `packages/ui/src/components/panels/windows/windowsPanelAllBody/**`, `packages/ui/src/components/panels/windows/windowsPanelSearchBody/**`, `packages/ui/src/components/panels/windows/storybook/windowsPanelReferenceFixtures.ts`
- 시작 조건: Phase 1에서 `packages/ui/src/components/common/iconImage/index.tsx`가 replacement owner로 고정되고, `TaskbarIconButton`과 `TaskbarWindowsButton`가 이를 직접 사용하며, `packages/ui/src/components/taskbar/internal/icon/index.tsx`, `icon.test.tsx`, `assets/windows-mark.png`가 모두 사라지고 Windows mark asset owner가 `packages/ui/src/components/taskbar/taskbarWindowsButton/assets/windows-mark.png`로만 남아 있어야 한다.
- 상세: `./phases/02-panel-adoption-and-regression-closure.md`
