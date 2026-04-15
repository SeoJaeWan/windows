# Phase 2. Storybook 정렬과 검증 마감

> 이 문서는 실행용 상세 계약이다. 맨 위의 요약만 읽어도 컨트롤러가 이 phase의 목표, 실제 작업, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 그 아래 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

- 한 줄 목표: Storybook wrapper와 story render를 shell facade 기준으로 정리하고, search panel reference wrapper까지 포함한 allowlisted decorative inline style/style tag만 남긴 뒤 grep/test/build-storybook evidence로 최종 경계를 닫는다.
- 실제 작업:
  - taskbar/panel Storybook wrapper와 story render에서 className으로 옮길 수 있는 layout·color·token consumption을 shell/taskbar utility와 `cn()`로 치환한다.
  - 남겨야 하는 inline style/style tag는 gradient backdrop, token-relative `calc()` size, `CompareRoot` width 같은 decorative-only case로만 제한하고 검증 규칙에 반영한다.
- 완료 증거:
  - Storybook source에서 shared token용 raw var consumer와 `--panel-border` bridge가 사라지고, residual inline style/style tag는 allowlisted decorative case로만 남는다.
  - Storybook build와 UI test가 모두 green이며, reference marker와 compare owner surface가 계속 남아 있어 replacement owner가 positive signal로 증명된다.
- 중단 조건:
  - Storybook wrapper가 shell facade로 옮긴 뒤에도 runtime token override를 위해 추가 inline style bridge가 필요하다는 사실이 나오면 Phase 1 계약이 불완전하므로 재계획한다.
  - decorative exception을 제거하려고 compare root marker, fixed capture width, reference marker contract를 흔들어야만 한다면 재계획한다.

- owner_agent: `frontend-developer`
- 목적: Storybook을 fully out-of-scope로 남기지 않고 canonical shell facade를 실제 reference owner가 소비하는 상태까지 정리하되, decorative-only wrapper는 bounded exception으로 명시해 검증 surface를 닫는다.
- boundary: `packages/ui/src/components/taskbar/storybook/compareLeafStage.tsx`, `packages/ui/src/components/taskbar/storybook/compareTaskbarStage.tsx`, `packages/ui/src/components/taskbar/storybook/foundationRegistrationStage.tsx`, `packages/ui/src/components/taskbar/taskbar/taskbar.stories.tsx`, `packages/ui/src/components/taskbar/taskbarIconButton/taskbarIconButton.stories.tsx`, `packages/ui/src/components/taskbar/taskbarClock/taskbarClock.stories.tsx`, `packages/ui/src/components/taskbar/taskbarSearch/taskbarSearch.stories.tsx`, `packages/ui/src/components/taskbar/taskbarWindowsButton/taskbarWindowsButton.stories.tsx`, `packages/ui/src/components/panels/windows/storybook/comparePanelStage.tsx`, `packages/ui/src/components/panels/windows/storybook/windowsPanelReferenceStage.tsx`, `packages/ui/src/components/panels/windows/**/*.stories.tsx`, `packages/ui/src/components/panels/search/storybook/searchPanelReferenceStage.tsx`, `packages/ui/src/components/panels/search/searchPanel/searchPanel.stories.tsx`, `packages/ui/src/components/panels/search/searchPanelDefaultView/searchPanelDefaultView.stories.tsx`, `packages/ui/.storybook/storybook.css`
- input:
  - Phase 1 output:
    - shell shared token/facade 이름과 taskbar-only utility 이름이 canonical contract로 고정돼 있다.
    - runtime component는 `cn()`와 shell facade만으로 shared semantics를 읽고, old shared taskbar facade surface는 사라져 있다.
  - 현재 Storybook context:
    - taskbar storybook wrapper는 `style={{ display: "flex" ... }}`, `color: "var(--taskbar-foreground-muted)"`, `height: "calc(var(--taskbar-height) * 1.5)"` 등을 사용한다.
    - panel storybook wrapper는 fixed canvas size, gradient backdrop, inline layout style을 사용한다.
    - `packages/ui/src/components/panels/search/storybook/searchPanelReferenceStage.tsx`는 windows panel reference wrapper와 같은 fixed canvas gradient inline style을 소유하고, `searchPanel.stories.tsx`와 `searchPanelDefaultView.stories.tsx`가 이를 reference owner로 사용한다.
    - `compareTaskbarStage.tsx`는 `CompareRoot` width를 scoped `<style>`로 고정한다.
- output:
  - 공개 계약:
    - className으로 표현 가능한 Storybook layout, spacing, alignment, text color, shell/taskbar token consumption은 모두 class utility와 `cn()`로 옮긴다.
    - residual inline style/style tag는 아래 decorative-only case로만 제한한다.
      - gradient desktop backdrop background
      - token-relative `calc()` size 또는 fixed capture canvas size처럼 기존 Tailwind scale/class만으로 표현하면 readability가 더 나빠지는 Storybook stage geometry
      - `CompareRoot` public DOM contract를 건드리지 않기 위한 scoped width rule
    - Storybook은 replacement owner surface로서 기존 story ID, `FOUNDATION_REGISTRATION`, `data-marker`, `data-visual-root` contract를 유지한다.
    - active search-panel reference stories는 `searchPanelReferenceStage.tsx`를 통해 계속 같은 decorative desktop canvas를 받되, wrapper 자체도 이번 phase의 cleanup/allowlist boundary 안에서 정리된다.
    - `style={{ "--panel-border": ... }}`나 allowlisted file 내부의 raw shared color/border var 소비는 Storybook에서도 허용되지 않는다. token-relative geometry용 `var(--taskbar-height)`는 decorative wrapper 예외로만 남을 수 있다.
  - 내부 기본값:
    - static `display`, `flexDirection`, `alignItems`, `gap`, `padding`, `rounded`, `width`, `height`, `margin`은 className으로 옮기는 것을 기본값으로 삼는다.
    - decorative exception이 남더라도 이유를 wrapper 주석에 짧게 남기고, shell runtime contract를 우회하는 token override는 남기지 않는다.
  - 허용하지 않는 대안:
    - Storybook을 cleanup scope 밖으로 밀어내는 선택
    - broad `style={{ ... }}` wrapper를 이유 없이 그대로 남기는 선택
    - compare/reference marker contract를 지우거나 story owner surface를 다른 파일로 흩뜨리는 선택
- 선행조건: Phase 1의 `border-shell`/`text-shell`/`cn()` contract가 green 상태여야 한다.
- 제약:
  - `apps/web/**`는 writable boundary가 아니다.
  - `plans/windows-taskbar-09-tailwind-semantic-cleanup/**`는 이번 phase에서도 수정하지 않는다.
  - Storybook은 positive owner verification surface이므로 story ID, marker, compare metadata contract를 제거하지 않는다.
- side effects:
  - Storybook wrapper 주석과 layout 표현 방식이 정리되면서 visual capture ownership이 더 명시적으로 드러난다.
  - 일부 decorative inline style/style tag가 allowlisted exception으로 남을 수 있다.
- failure/validation: residual inline style/style tag가 decorative-only case가 아니라 shared token을 소비하거나 runtime contract를 우회하는 bridge 역할을 한다면 이 phase는 실패다.
- 작업:
  - taskbar story wrapper(`foundationRegistrationStage`, `taskbar.stories`, leaf stories)에서 className으로 옮길 수 있는 layout/text/token consumption을 `cn()`와 shell/taskbar utility로 치환한다.
  - panel story wrapper(`windowsPanelReferenceStage`, panel stories)에서 className으로 옮길 수 있는 static layout을 같은 규칙으로 치환하고, 남아야 하는 gradient/canvas style은 bounded exception으로 남긴다.
  - search panel story wrapper(`searchPanelReferenceStage`)와 이를 reference owner로 쓰는 `searchPanel.stories.tsx`, `searchPanelDefaultView.stories.tsx`를 같은 규칙으로 정리하고, 남아야 하는 decorative canvas style은 windows panel wrapper와 같은 allowlist 규칙으로 닫는다.
  - `compareTaskbarStage.tsx`의 scoped `<style>` width를 유지할지 wrapper class로 옮길지 결정하되, `CompareRoot`에 consumer-injectable style/class surface를 새로 열지 않는다.
  - reference owner marker(`FOUNDATION_REGISTRATION`, `data-marker`, `data-visual-root`)와 shell facade adoption evidence를 같은 phase에서 검증한다.
- 검증:
  - [ ] 아래 PowerShell one-liner를 실행했을 때 출력이 비어 있어 allowlisted decorative inline style/style tag owner가 정확히 다섯 파일로만 제한됐음을 확인할 수 있다.
    `$actual = rg -l -g '**/*.stories.tsx' -g '**/storybook/*.tsx' -- 'style=\{\{|<style>' packages/ui/src/components/taskbar packages/ui/src/components/panels/windows packages/ui/src/components/panels/search | ForEach-Object { $_ -replace '\\','/' } | Sort-Object; $expected = @('packages/ui/src/components/taskbar/storybook/compareTaskbarStage.tsx','packages/ui/src/components/taskbar/storybook/foundationRegistrationStage.tsx','packages/ui/src/components/taskbar/taskbar/taskbar.stories.tsx','packages/ui/src/components/panels/windows/storybook/windowsPanelReferenceStage.tsx','packages/ui/src/components/panels/search/storybook/searchPanelReferenceStage.tsx') | Sort-Object; Compare-Object $expected $actual`
  - [ ] 아래 PowerShell one-liner를 실행했을 때 출력이 비어 있어 allowlisted decorative owner 파일 안에서도 raw shared color/border var inline style이 남지 않았음을 확인할 수 있다.
    `$files = @('packages/ui/src/components/taskbar/storybook/compareTaskbarStage.tsx','packages/ui/src/components/taskbar/storybook/foundationRegistrationStage.tsx','packages/ui/src/components/taskbar/taskbar/taskbar.stories.tsx','packages/ui/src/components/panels/windows/storybook/windowsPanelReferenceStage.tsx','packages/ui/src/components/panels/search/storybook/searchPanelReferenceStage.tsx'); Get-Item $files | Select-String -Pattern '(color|background(Color)?|border(Color)?):\s*"var\(--(taskbar|shell)-(foreground|foreground-muted|border|surface)' | ForEach-Object { "{0}:{1}:{2}" -f $_.Path.Replace('\','/'), $_.LineNumber, $_.Line.Trim() }`
  - [ ] `rg -n -P -g '**/*.stories.tsx' -g '**/storybook/*.tsx' -- '\bborder-taskbar\b(?!-)|\btext-taskbar\b(?!-)|\btext-taskbar-muted\b|\btext-taskbar-search-icon\b|\bshadow-taskbar-search-inset\b|--panel-border|border-\[var\(|text-\[var\(' packages/ui/src/components/taskbar packages/ui/src/components/panels/windows packages/ui/src/components/panels/search` 결과가 비어 있어 Storybook도 old shared surface와 raw var consumer를 남기지 않았음을 확인할 수 있다.
  - [ ] `rg -n -- 'FOUNDATION_REGISTRATION|data-marker=|data-visual-root|SearchPanelReferenceStage' packages/ui/src/components/taskbar packages/ui/src/components/panels/windows packages/ui/src/components/panels/search` 결과가 남아 있어 reference/compare owner surface가 positive signal로 유지됨을 확인할 수 있다.
  - [ ] `pnpm --filter @windows/ui test`가 green이다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 green이다.
