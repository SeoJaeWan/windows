# Phase 1. canonical inventory와 runtime facade

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | `packages/ui/src/components/**` runtime inventory 전체를 shell facade + `cn()` contract로 다시 묶고, old subset 밖이던 exported family까지 같은 cleanup boundary에 포함한다. |
| 선행조건 | `none` |
| 완료 판단 | runtime writable surface에서 raw shared var bridge, old shared surface, 문자열 `className` 결합이 사라지고, `packages/ui/src/index.ts` / `compareRoot.tsx` anchor 기준으로 exported/compare-owned family가 모두 scope 안에 있다. |
| 중단 조건 | shared token과 taskbar-only token을 분리하지 않고는 cleanup이 불가능하거나, read-only anchor와 실제 runtime inventory가 충돌해 한 phase 안에서 boundary를 닫을 수 없으면 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/tailwind-config/src/theme.css` | 정리 | shared single-value token owner는 shell namespace, taskbar-only geometry/value owner는 taskbar namespace로 분리한다. | `--panel-border` 같은 중간 alias chain 없이 runtime consumer가 같은 source of truth를 읽는다. |
| `packages/tailwind-config/src/utilities.css` | 정리 | consumer-facing facade는 짧은 shell semantic 이름만 canonical surface로 둔다. | old shared surface와 중복 facade가 동시에 canonical surface로 남지 않는다. |
| `packages/ui/package.json` | 갱신 | runtime class merge helper에 필요한 package dependency만 adjacent owner로 추가한다. | runtime helper가 local package contract로 고정된다. |
| `packages/ui/src/internal/cn.ts` | 추가/정리 | `cn()`는 internal-only helper이며 root export surface에는 올리지 않는다. | `twMerge(clsx(...))` winner rule이 runtime canonical helper로 남는다. |
| `packages/ui/src/components/taskbar/**` | 교체/정리 | writable runtime scope는 `**/*.stories.tsx`, `**/storybook/**`, `**/*.test.tsx`를 제외한 canonical inventory다. | taskbar runtime family가 raw shared var consumer와 template-string `className` 없이 same contract를 쓴다. |
| `packages/ui/src/components/panels/shared/**` | 교체/정리 | shared panel leaf는 panel-local bridge가 아니라 shell facade owner를 따른다. | `PanelSurface`, `PanelSearchResultsView`가 bridge 없이 canonical surface를 읽는다. |
| `packages/ui/src/components/panels/windows/**`, `packages/ui/src/components/panels/search/**` | 교체/정리 | 기존 subset family도 same runtime cleanup rule을 유지한다. | windows/search runtime drift가 subset 전용 예외 없이 정리된다. |
| `packages/ui/src/components/panels/context/**`, `packages/ui/src/components/panels/taskbarContextMenu/**`, `packages/ui/src/components/panels/taskbarHoverPreview/**` | 교체/정리 | `packages/ui/src/index.ts` export anchor에 있는 family는 silent exclusion 없이 runtime scope에 포함한다. | `ContextPanel`, `TaskbarContextMenu`, `TaskbarHoverPreview`가 old subset 밖 backlog 상태를 벗어난다. |

### 완료 증거

- `packages/ui/src/components/**` runtime inventory에서 explicit negative scope를 제외한 파일에 raw shared `var(...)` border/text consumer, `--panel-border` bridge, 문자열 `className` 결합이 남지 않는다.
- `ContextPanel`, `TaskbarContextMenu`, `TaskbarHoverPreview`와 기존 taskbar/windows/search family가 같은 shell facade + `cn()` contract를 사용한다.
- `packages/ui/src/index.ts` public export와 `compareRoot.tsx` visual-kind inventory를 read-only anchor로 두더라도 plan boundary와 runtime cleanup coverage가 모순되지 않는다.

- owner_agent: `frontend-developer`
- 목적: subset family list로 보이던 runtime cleanup boundary를 `packages/ui/src/components/**` canonical inventory로 다시 닫고, supporting owner 파일과 read-only anchor를 같은 contract 안에서 정렬한다.
- boundary:
  - writable supporting owner files: `packages/tailwind-config/src/theme.css`, `packages/tailwind-config/src/utilities.css`, `packages/ui/package.json`, `packages/ui/src/internal/cn.ts`
  - writable runtime inventory: `packages/ui/src/components/**` 중 `**/*.stories.tsx`, `**/storybook/**`, `**/*.test.tsx`를 제외한 파일
  - read-only scope anchor: `packages/ui/src/index.ts`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
- input:
  - 사용자 합의:
    - canonical scope는 subset family list가 아니라 `packages/ui/src/components/**` 전체다.
    - exported family와 compare-owned family는 read-only anchor를 통해 scope에 포함되며 silent exclusion을 허용하지 않는다.
    - package-wide cleanup에서 explicit negative scope와 matching validation을 같은 phase에 적는다.
  - 현재 repo context:
    - 기존 plan 문구는 taskbar/shared/windows/search subset을 더 강하게 드러냈다.
    - `packages/ui/src/index.ts`는 `ContextPanel`, `TaskbarHoverPreview`, `TaskbarContextMenu`를 이미 public export surface에 올리고 있다.
    - `compareRoot.tsx`는 `context-panel`, `taskbar-hover-preview`, `taskbar-context-menu`, `windows-panel-context`, `search-panel-context` visual-kind를 이미 canonical inventory로 선언하고 있다.
    - runtime implementation에는 raw shared `var(...)`, `--panel-border` bridge, 문자열 `className` 결합이 subset 안팎에 함께 남아 있다.
- output:
  - 공개 계약:
    - runtime cleanup의 canonical inventory는 `packages/ui/src/components/**` 전체이며, stories/storybook/tests는 explicit negative scope다.
    - shared single-value token은 shell namespace가 소유하고, taskbar-only 값은 taskbar namespace가 소유한다.
    - runtime consumer-facing canonical surface는 shell facade utility와 `cn()`다.
    - `ContextPanel`, `TaskbarContextMenu`, `TaskbarHoverPreview`는 exported family라는 이유만으로 runtime cleanup boundary에서 빠질 수 없다.
  - 내부 기본값:
    - supporting owner 파일은 canonical inventory를 뒷받침하는 adjacent boundary로만 다루고, scope 자체를 subset family list로 다시 축소하는 근거로 쓰지 않는다.
    - `packages/ui/src/index.ts`와 `compareRoot.tsx`는 read-only anchor이며 exhaustive owner test가 아니라 inclusion guard로만 사용한다.
  - 허용하지 않는 대안:
    - `packages/ui/src/components/**` 대신 일부 family 경로만 canonical scope로 삼는 선택
    - exported family나 compare-owned family를 별도 follow-up으로 미루면서 현재 plan을 green 처리하는 선택
    - `style={{ "--panel-border": ... }}`, raw shared `var(...)`, old shared surface를 compatibility escape hatch로 남기는 선택
- 선행조건: `none`
- 제약:
  - `plans/windows-taskbar-09-tailwind-semantic-cleanup/**`는 historical read-only context다.
  - `apps/web/**`는 writable boundary가 아니다. package phase의 검증 참고 자료로만 본다.
  - source-tree test 추가는 이 phase 범위가 아니다. 이후 `plan-materializer`가 결정한다.
- side effects:
  - runtime component class precedence가 `cn()` + merge winner rule로 더 명시적으로 바뀐다.
  - exported family 전부가 같은 cleanup boundary에 들어오면서 phase 파일 맵이 넓어진다.
- failure/validation: exported/compare-owned family를 anchor에서 읽어도 writable runtime inventory가 이를 커버하지 못하거나, old subset 바깥 backlog를 남긴 채 phase를 닫아야만 하면 이 phase는 실패다.
- 작업:
  - `packages/tailwind-config` supporting owner 파일에서 shell shared token/facade와 taskbar-only token/facade의 owner를 다시 닫는다.
  - `packages/ui/package.json`, `packages/ui/src/internal/cn.ts`에서 runtime class merge helper와 winner rule을 정리한다.
  - `packages/ui/src/components/**` runtime inventory 전체에서 `**/*.stories.tsx`, `**/storybook/**`, `**/*.test.tsx`를 제외한 파일을 대상으로 raw shared var bridge, old shared surface, 문자열 `className` 결합을 제거한다.
  - `ContextPanel`, `TaskbarContextMenu`, `TaskbarHoverPreview`를 포함한 exported family와 기존 taskbar/windows/search family를 같은 runtime contract로 정리한다.
  - read-only anchor 두 곳을 기준으로 in-scope family를 다시 확인하고, phase 문구와 검증이 그 inventory를 그대로 반영하게 맞춘다.
- 검증:
  - [ ] `rg -n -g '!**/storybook/**' -g '!**/*.stories.tsx' -g '!**/*.test.tsx' -- 'style=\\{\\{.*"--panel-border"|border-\\[var\\(|text-\\[var\\(' packages/ui/src/components` 결과가 비어 있어 runtime raw shared var bridge와 raw border/text var consumer가 제거됐음을 확인한다.
  - [ ] `$files = Get-ChildItem 'packages/ui/src/components' -Recurse -File | Where-Object { $_.FullName -notmatch '\\storybook\\' -and $_.Name -notlike '*.stories.tsx' -and $_.Name -notlike '*.test.tsx' }; $files | Select-String -Pattern '\$\{className\s*(\?\?|\?)' | ForEach-Object { "{0}:{1}:{2}" -f $_.Path.Replace('\','/'), $_.LineNumber, $_.Line.Trim() }` 결과가 비어 있어 runtime template-string 기반 `className` 결합이 제거됐음을 확인한다.
  - [ ] `rg -n -P -g '!**/storybook/**' -g '!**/*.stories.tsx' -g '!**/*.test.tsx' -- '\bborder-taskbar\b(?!-)|\btext-taskbar\b(?!-)|\btext-taskbar-muted\b|\btext-taskbar-search-icon\b|\bshadow-taskbar-search-inset\b|--panel-border' packages/ui/src/components packages/tailwind-config/src` 결과가 비어 있어 old shared surface와 panel bridge가 runtime canonical contract에서 사라졌음을 확인한다.
  - [ ] `rg -n -- 'ContextPanel|TaskbarHoverPreview|TaskbarContextMenu' packages/ui/src/index.ts` 와 `rg -n -- '"context-panel"|"taskbar-hover-preview"|"taskbar-context-menu"|"windows-panel-context"|"search-panel-context"' packages/ui/src/components/taskbar/storybook/compareRoot.tsx` 결과가 모두 남아 있어 read-only anchor가 여전히 same scope inclusion guard로 작동함을 확인한다.
  - [ ] `pnpm --filter @windows/ui test`가 green이다.
