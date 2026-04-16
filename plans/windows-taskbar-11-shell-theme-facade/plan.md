**Branch:** style/windows-taskbar-11-shell-theme-facade

> Worktree dir: `worktrees/windows-taskbar-11-shell-theme-facade` (plan 폴더명과 동일)
> 이 update pass는 기존 legacy 요약 형식을 architect template 구조로 다시 정렬한 문서다.
> historical plan 폴더는 read-only로 유지하고, 이번 plan만 canonical scope와 validation contract를 다시 닫는다.

# Windows Taskbar Shell Theme Facade 실행 계획

## 사전 합의

| 항목 | 합의 내용 | 적용 phase | 메모 |
| --- | --- | --- | --- |
| canonical scope | 이번 작업의 canonical inventory는 subset family list가 아니라 `packages/ui/src/components/**` 전체다. runtime, Storybook, reference owner, validation은 모두 이 inventory를 기준으로 닫는다. | 전체 | supporting owner 파일은 inventory를 뒷받침하는 adjacent boundary로만 다룬다. |
| read-only scope anchor | `packages/ui/src/index.ts` public export와 `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` visual-kind inventory를 read-only anchor로 사용해 exported family나 compare-owned family가 silent exclusion 되지 않게 한다. | Phase 1, Phase 2 | brittle root-export snapshot test로 승격하지는 않는다. |
| boundary와 validation 정렬 | package-wide styling / semantic facade / rename / Storybook cleanup 작업은 boundary, writable target, validation이 같은 inventory를 봐야 한다. 제외가 필요하면 explicit negative scope와 matching validation을 같은 phase에 적는다. | 전체 | stale subset grep이나 later phase 의존 검증을 금지한다. |
| concrete backlog 포함 | 기존 subset 밖에 있던 `ContextPanel`, `TaskbarContextMenu`, `TaskbarHoverPreview`, stale Phase 2 allowlist, 이미 포함된 family 안의 stale story inventory, thin compare wrapper rule drift를 이번 plan에 모두 포함한다. | Phase 1, Phase 2 | conversation에서 이미 확인된 drift를 plan boundary로 승격한다. |
| Storybook 예외 분류 | simple wrapper style은 `className`으로 옮기고, decorative backdrop / fixed canvas / token-relative geometry / host-composition absolute placement처럼 bounded 예외만 allowlist로 남긴다. | Phase 2 | raw shared color/border var 소비와 runtime bridge는 예외로 남길 수 없다. |
| 운영 규칙 반영 | 이후 작업도 같은 boundary rule을 따르도록 `.claude/CLAUDE.md`와 repo rule 문서를 함께 갱신한다. | Phase 3 | 새 rule 파일을 추가하고 Storybook rule과 연결한다. |

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. canonical inventory와 runtime facade | `packages/ui/src/components/**` runtime inventory 전체를 shell facade + `cn()` 기준으로 다시 묶고, old subset 밖이던 exported family까지 runtime cleanup boundary에 포함한다. | runtime writable surface가 더 이상 subset family list에 묶이지 않고, exported/compare-owned family 전부가 같은 shell facade cleanup contract를 공유한다. | Storybook이 따라야 할 canonical runtime surface, legacy surface 제거 상태, scope anchor parity |
| Phase 2. Storybook owner inventory와 exception 정렬 | `packages/ui/src/components/**` story/reference owner 전체를 스캔해 className으로 옮길 wrapper와 bounded exception owner를 다시 나누고, allowlist와 validation을 full inventory 기준으로 재작성한다. | Storybook/reference owner coverage가 canonical inventory와 맞고, 남는 inline style/style tag가 explicit exception owner로만 설명된다. | `.claude` rule에 기록할 bounded exception taxonomy와 full-tree validation contract |
| Phase 3. boundary rule 거버넌스 고정 | 이번 canonical scope 규칙과 Storybook thin-wrapper / exception taxonomy를 `.claude` 운영 문서에 고정한다. | 이후 plan/review/implementation이 `packages/ui/src/components/**` canonical inventory와 explicit negative-scope rule을 같은 기준으로 사용한다. | future planning/review에서 재사용할 repo-local operating rule |

## 단계별 실행

### Phase 1. canonical inventory와 runtime facade

- 목적: `packages/ui/src/components/**` runtime inventory 전체를 같은 shell facade cleanup boundary로 묶고, old subset 밖이던 exported family까지 같은 canonical runtime contract로 전환한다.
- 변경 내용: `packages/tailwind-config`와 `packages/ui` supporting owner 파일을 정리해 shell facade와 `cn()` merge contract를 다시 세운다. `packages/ui/src/components/**` 안의 runtime 파일은 `**/*.stories.tsx`, `**/storybook/**`, `**/*.test.tsx`를 explicit negative scope로 두고 나머지 inventory 전체를 cleanup 대상에 포함한다. `packages/ui/src/index.ts` export anchor와 `compareRoot.tsx` visual-kind inventory는 read-only anchor로만 사용해 `ContextPanel`, `TaskbarContextMenu`, `TaskbarHoverPreview` 같은 family가 boundary 밖으로 밀리지 않게 한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/tailwind-config/src/theme.css` | 정리 | shared shell token과 taskbar-only token의 owner가 다시 닫힌다. | runtime이 shared single-value token을 alias chain 없이 같은 facade로 읽는다. |
| `packages/tailwind-config/src/utilities.css` | 정리 | `border-shell`, `text-shell*`, shared recipe utility가 canonical surface로 정리된다. | old shared surface와 중복 facade가 남지 않는다. |
| `packages/ui/package.json` | 갱신 | runtime class merge contract를 위한 dependency boundary가 정리된다. | `cn()` helper가 repo-local package contract로 고정된다. |
| `packages/ui/src/internal/cn.ts` | 추가/정리 | `twMerge(clsx(...))` 기반 winner rule helper가 canonical runtime helper가 된다. | runtime component가 문자열 `className` 결합 대신 `cn()`를 사용한다. |
| `packages/ui/src/components/taskbar/**` | 교체/정리 | taskbar runtime inventory 전체가 shell facade와 `cn()` 규칙을 따른다. | taskbar runtime 파일에 raw shared var consumer와 old shared surface가 남지 않는다. |
| `packages/ui/src/components/panels/shared/**` | 교체/정리 | shared panel leaf가 panel bridge 없이 shell facade를 사용한다. | `PanelSurface`, `PanelSearchResultsView`가 raw bridge 없이 canonical surface를 읽는다. |
| `packages/ui/src/components/panels/windows/**`, `packages/ui/src/components/panels/search/**` | 교체/정리 | windows/search runtime inventory가 shell facade cleanup contract에 맞춰진다. | 기존 subset family 안 runtime drift가 같은 규칙으로 정리된다. |
| `packages/ui/src/components/panels/context/**`, `packages/ui/src/components/panels/taskbarContextMenu/**`, `packages/ui/src/components/panels/taskbarHoverPreview/**` | 교체/정리 | old subset 밖이던 exported family도 같은 runtime cleanup boundary에 들어온다. | `ContextPanel`, `TaskbarContextMenu`, `TaskbarHoverPreview`가 silent exclusion 없이 same contract로 정리된다. |

- 이전 상태: plan summary는 taskbar/shared/windows/search subset만 다루는 것처럼 보였고, public export와 compare-owned family 일부는 boundary 밖에 남아 있었다. runtime inventory에는 raw shared `var(...)`, `--panel-border` bridge, 문자열 `className` 결합이 subset 안팎에 함께 남아 있었다.
- 이후 상태: runtime cleanup boundary가 `packages/ui/src/components/**` canonical inventory 전체를 기준으로 닫히고, supporting owner 파일은 이 inventory를 뒷받침하는 adjacent boundary로만 남는다. exported family와 compare-owned family는 read-only anchor를 통해 같은 runtime contract에 포함된다.
- 완료 조건: `packages/ui/src/components/**` runtime inventory에서 explicit negative scope를 제외한 파일에 raw shared var bridge, old shared surface, 문자열 `className` 결합이 남지 않는다. `packages/ui/src/index.ts`와 `compareRoot.tsx` 기준으로 in-scope family가 plan boundary와 모순되지 않는다.
- 관련 영역: `packages/ui/src/index.ts`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`, `plans/windows-taskbar-09-tailwind-semantic-cleanup/**`
- 시작 조건: `plans/windows-taskbar-09-tailwind-semantic-cleanup/**`는 historical read-only context로만 취급한다.
- 상세: `./phases/01-shell-theme-and-runtime-facade.md`

### Phase 2. Storybook owner inventory와 exception 정렬

- 목적: `packages/ui/src/components/**` story/reference owner 전체를 같은 inventory 기준으로 다시 스캔하고, simple wrapper cleanup과 bounded exception owner를 분리해 allowlist와 validation을 full-tree 기준으로 닫는다.
- 변경 내용: `packages/ui/src/components/**` 안에서 `**/*.stories.tsx`와 `**/storybook/**`만 writable Storybook boundary로 삼고, className으로 옮길 수 있는 wrapper style을 제거한다. 기존 stale allowlist에 빠져 있던 `context`, `taskbarContextMenu`, `taskbarHoverPreview` family를 포함하고, 이미 포함된 family 안의 `taskbarIconButton.stories.tsx`, `windowsPanelContext.stories.tsx`, `searchPanelContext.stories.tsx` drift도 같은 inventory에서 다시 분류한다. thin compare wrapper(`CompareRoot`, `ComparePanelStage`, `CompareContextPanelStage`)와 reference owner marker는 positive owner signal로 유지한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/taskbar/storybook/**`, `packages/ui/src/components/taskbar/**/*.stories.tsx` | 정리/재분류 | taskbar Storybook owner가 simple wrapper cleanup과 bounded exception owner로 다시 나뉜다. | `compareTaskbarStage`, `foundationRegistrationStage`, `taskbar.stories.tsx` 외의 stale wrapper drift가 제거된다. |
| `packages/ui/src/components/panels/windows/storybook/**`, `packages/ui/src/components/panels/windows/**/*.stories.tsx` | 정리/재분류 | windows panel compare/reference/context owner가 같은 inventory rule을 따른다. | `windowsPanelContext.stories.tsx`는 host-composition 예외 여부가 명시되고, 나머지 simple wrapper는 className으로 이동한다. |
| `packages/ui/src/components/panels/search/storybook/**`, `packages/ui/src/components/panels/search/**/*.stories.tsx` | 정리/재분류 | search panel reference/context owner가 windows와 같은 exception taxonomy를 공유한다. | `searchPanelContext.stories.tsx`의 absolute host composition과 reference stage의 decorative canvas가 explicit owner로만 남는다. |
| `packages/ui/src/components/panels/context/storybook/**`, `packages/ui/src/components/panels/context/contextPanel/*.stories.tsx` | 정리 | context leaf story는 simple wrapper style을 className으로 옮기고, compare wrapper는 thin owner로만 남긴다. | `contextPanel.stories.tsx`, `contextPanelUseCases.stories.tsx`가 allowlist에서 빠지고 `CompareContextPanelStage`만 canonical thin wrapper로 남는다. |
| `packages/ui/src/components/panels/taskbarContextMenu/**`, `packages/ui/src/components/panels/taskbarHoverPreview/**` | 정리/재분류 | 기존 subset 밖이던 taskbar attached surface의 Storybook owner도 full-tree allowlist에 포함된다. | reference stage는 decorative canvas owner로만 남고, attached surface family가 allowlist 누락 상태를 벗어난다. |
| `packages/ui/.storybook/storybook.css` | 정리 | shared Storybook backdrop/helper class가 필요하면 per-story inline style 대신 central style owner가 된다. | repeated wrapper style을 central class로 끌어올릴 수 있으면 여기로 이동한다. |

- 이전 상태: Storybook cleanup boundary가 taskbar/windows/search subset으로만 적혀 있었고, 실제 `style`/`<style>` owner inventory에는 `context`, `taskbarContextMenu`, `taskbarHoverPreview`, host-composition stories가 더 남아 있었다. thin compare wrapper 사용 패턴도 rule 문서와 어긋나 있었다.
- 이후 상태: `packages/ui/src/components/**` full inventory에서 story/reference owner가 다시 분류되고, 남은 inline style/style tag는 decorative canvas, token-relative geometry, fixed compare width, host-composition absolute placement처럼 bounded exception owner로만 설명된다.
- 완료 조건: full-tree story/reference inventory에서 `style`/`<style>` owner 목록이 explicit exception owner와 정확히 일치한다. allowlisted 파일 안에도 raw shared color/border var bridge가 남지 않고, compare marker와 reference owner signal은 positive check로 유지된다.
- 관련 영역: `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`, `packages/ui/src/index.ts`, `.claude/rules/storybook.md`
- 시작 조건: Phase 1의 runtime canonical surface와 legacy surface 제거 상태가 먼저 고정돼 있어야 한다.
- 상세: `./phases/02-storybook-alignment-and-validation.md`

### Phase 3. boundary rule 거버넌스 고정

- 목적: 이번 update pass에서 확인한 canonical inventory rule과 Storybook exception taxonomy를 `.claude` 운영 문서에 고정해 이후 작업에서도 같은 boundary 실수를 반복하지 않게 한다.
- 변경 내용: `.claude/CLAUDE.md`에 새 package-boundary rule을 연결하고, `.claude/rules/storybook.md`에는 thin compare wrapper와 bounded exception taxonomy를 추가한다. 새 `.claude/rules/packages-ui-boundary.md`에는 package-wide styling / semantic facade / rename / Storybook cleanup 작업이 boundary와 validation을 같은 inventory로 맞춰야 한다는 operating rule을 명시한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `.claude/CLAUDE.md` | 갱신 | 새 boundary rule이 기존 Storybook/component-design rule과 함께 index에 노출된다. | 관련 작업자가 canonical inventory rule 문서를 바로 찾을 수 있다. |
| `.claude/rules/storybook.md` | 보강 | thin compare wrapper, bounded exception owner, host-composition 예외 규칙이 현재 repo 패턴과 맞춰진다. | CompareRoot만 직접 언급하는 낡은 규칙이 사라진다. |
| `.claude/rules/packages-ui-boundary.md` | 추가 | package-wide cleanup에서 canonical inventory, anchor, explicit negative scope rule을 고정한다. | 이후 plan/review가 subset grep이나 silent exclusion 없이 같은 기준을 따를 수 있다. |

- 이전 상태: `.claude/CLAUDE.md`는 storybook/component-design rule만 노출했고, package-wide boundary와 validation alignment 규칙은 repo-local operating rule로 문서화돼 있지 않았다.
- 이후 상태: `.claude` 운영 문서가 `packages/ui/src/components/**` canonical inventory, read-only anchor, explicit negative scope, Storybook bounded exception taxonomy를 같은 기준으로 안내한다.
- 완료 조건: `.claude` 문서만 읽어도 package-wide cleanup work에서 canonical inventory와 validation alignment rule, thin compare wrapper owner, host-composition bounded exception rule을 재현할 수 있다.
- 관련 영역: `.claude/rules/component-design.md`, `plans/windows-taskbar-11-shell-theme-facade/plan.md`
- 시작 조건: Phase 1과 Phase 2에서 canonical inventory와 bounded exception taxonomy가 문서 수준에서 합의돼 있어야 한다.
- 상세: `./phases/03-claude-boundary-governance.md`
