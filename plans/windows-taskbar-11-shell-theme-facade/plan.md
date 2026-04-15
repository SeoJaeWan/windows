**Branch:** style/windows-taskbar-11-shell-theme-facade

> Worktree dir: `worktrees/windows-taskbar-11-shell-theme-facade` (plan 폴더명과 동일)
> 이 문서는 검토용 요약이다. 개발을 모르는 사람도 각 phase의 목적과 변화 방향을 이해할 수 있게 쓴다.
> 먼저 `전체 작업 지도`에서 흐름을 보고, 아래 phase 카드에서 무엇이 바뀌는지와 무엇을 확인해야 하는지 본다.
> 기술적인 입력/출력 계약, 파일 경계, 상세 작업, 검증은 각 phase의 상세 문서에서 다룬다.

# Windows Taskbar Shell Theme Facade 실행 계획

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. shell 계약과 runtime 전환 | `@theme`에 shell shared source of truth를 올리고, 얇은 semantic facade utility와 `cn()`/`tailwind-merge` merge 규칙을 만든 뒤 taskbar/panel runtime consumer를 한 번에 shell 계약으로 바꾼다. | runtime component는 raw `var(...)`, `--panel-border` style, 문자열 `className` 결합 없이 `shell-*` shared semantics와 taskbar 전용 semantics만 읽는다. | Storybook이 그대로 채택할 shell facade 이름, taskbar 전용 값 목록, 허용되는 override winner rule |
| Phase 2. Storybook 정렬과 검증 마감 | taskbar/windows panel/search panel Storybook wrapper와 active story render를 같은 shell facade 규칙으로 맞추고, 남겨도 되는 decorative inline style/style tag를 좁힌 뒤 grep/test/build evidence로 종료 조건을 닫는다. | runtime + Storybook이 같은 canonical shell contract를 쓰고, 남은 inline style/style tag는 gradient·`calc()`·compare width 같은 bounded decorative case로만 설명된다. | 이후 `plan-materializer`와 구현자가 그대로 사용할 validation boundary와 residual exception inventory |

## 단계별 실행

### Phase 1. shell 계약과 runtime 전환

- 목적: shared styling source of truth를 `taskbar-*` alias chain이 아니라 `@theme` + 얇은 facade utility + `cn()` 조합으로 재정의하고, runtime consumer를 같은 pass에서 shell/taskbar-specific 계약으로 갈아탄다.
- 변경 내용: `packages/tailwind-config/src/theme.css`에 shell shared single-value token을 정의하고 taskbar-only 값을 분리한다. `packages/tailwind-config/src/utilities.css`에 `border-shell`, `bg-shell`, `text-shell`, `text-shell-muted` 같은 짧은 facade와 필요한 recipe utility를 정리한다. `packages/ui/package.json`에 `clsx`/`tailwind-merge` runtime dependency를 추가하고 내부 `cn()` helper와 custom merge config를 만든 뒤 taskbar/panel runtime component와 windows panel leaf view(`WindowsPanelPinnedView` 포함)의 raw `var(...)`, `--panel-border` style, 문자열 `className` 결합을 치환한다.
- 이전 상태: shared single value는 `:root --taskbar-*`와 `--panel-border -> --taskbar-border` alias chain에 흩어져 있고, runtime consumer는 `border-[var(--panel-border,#ccd0d9)]`, `style={{ "--panel-border": ... }}`, `${className ?? ""}`를 직접 들고 있다.
- 이후 상태: runtime component는 `@theme`가 소유하는 shell token, 짧은 semantic facade utility, `cn()`만으로 shared semantics를 읽고, 실제로 taskbar에만 속한 값은 높이/indicator/rail recipe처럼 taskbar 전용 이름으로 남는다.
- 확인 포인트: runtime source에서 `--panel-border`, raw `var(...)` border/text consumer, string-built `className`, old shared surface(`text-taskbar` 등)가 taskbar/panel runtime과 windows panel leaf view까지 포함해 사라지고, `border-shell`/`text-shell`/`text-shell-muted`와 `cn()`가 canonical surface로 고정돼 있어야 한다. `taskbar-active`, `taskbar-inactive`, `taskbar-height`, rail gradient처럼 실제 taskbar-only 값은 shell로 과잉 일반화되지 않아야 한다.
- 관련 영역: `packages/tailwind-config/src/theme.css`, `packages/tailwind-config/src/utilities.css`, `packages/ui/package.json`, `packages/ui/src/internal/cn.ts`, `packages/ui/src/components/taskbar/**`, `packages/ui/src/components/panels/shared/**`, `packages/ui/src/components/panels/windows/**`, `packages/ui/src/components/panels/search/**`
- 시작 조건: `plans/windows-taskbar-09-tailwind-semantic-cleanup/**`는 historical read-only context로만 취급하고 수정하지 않는다.
- 상세: `./phases/01-shell-theme-and-runtime-facade.md`

### Phase 2. Storybook 정렬과 검증 마감

- 목적: Storybook wrapper/story도 같은 shell facade 규칙에 맞추고, windows/search panel reference wrapper까지 같은 boundary에서 정리한 뒤 repo-local grep/test/build evidence로 마감한다.
- 변경 내용: taskbar/windows panel/search panel Storybook wrapper와 active story render에서 className으로 옮길 수 있는 layout/color/token consumption을 shell/taskbar utility와 `cn()`로 옮긴다. `style={{}}` 또는 scoped `<style>`이 남는 경우는 `calc(var(--spacing-taskbar-height) * n)` 같은 token-relative stage size, gradient desktop backdrop, `CompareRoot` width 고정처럼 decorative-only case로 한정하고 주석/contract를 맞춘다. 최종 grep/test/build-storybook 검증으로 canonical surface와 허용된 예외 목록을 증명한다.
- 이전 상태: Storybook은 `style={{ display: "flex" ... }}`, `color: "var(--taskbar-foreground-muted)"`, `height: "calc(var(--taskbar-height) * 1.5)"`, windows/search panel fixed canvas gradient wrapper, scoped `<style>` width처럼 runtime contract와 장식 wrapper가 섞여 있다.
- 이후 상태: Storybook이 canonical class surface를 positive owner로 소비하고, 남은 inline style/style tag는 plan에서 허용한 decorative cases로만 설명된다. runtime + Storybook은 같은 shell facade 계약을 공유한다.
- 확인 포인트: Storybook source에서 `style={{ "--panel-border": ... }}`나 allowlisted 파일 내부의 raw shared color/border var 소비가 남지 않고, residual inline style/style tag는 허용한 decorative cases로만 남아 있어야 한다. `pnpm --filter @windows/ui test`와 `pnpm --filter @windows/ui build-storybook`가 함께 green이어야 한다.
- 관련 영역: `packages/ui/src/components/taskbar/storybook/**`, `packages/ui/src/components/taskbar/**/*.stories.tsx`, `packages/ui/src/components/panels/windows/storybook/**`, `packages/ui/src/components/panels/windows/**/*.stories.tsx`, `packages/ui/src/components/panels/search/storybook/**`, `packages/ui/src/components/panels/search/**/*.stories.tsx`, `packages/ui/.storybook/storybook.css`, `packages/ui/package.json`
- 시작 조건: Phase 1의 shell runtime contract가 green이고 `border-shell`/`text-shell`/`cn()` 이름이 canonical surface로 고정돼 있어야 한다.
- 상세: `./phases/02-storybook-alignment-and-validation.md`
