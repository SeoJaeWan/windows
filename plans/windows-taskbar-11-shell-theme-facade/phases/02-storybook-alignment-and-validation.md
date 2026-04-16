# Phase 2. Storybook owner inventory와 exception 정렬

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | `packages/ui/src/components/**` story/reference owner 전체를 같은 inventory 기준으로 재분류해 simple wrapper cleanup과 bounded exception allowlist를 full-tree 기준으로 닫는다. |
| 선행조건 | Phase 1의 runtime canonical surface와 legacy surface 제거 상태가 먼저 고정돼 있어야 한다. |
| 완료 판단 | full-tree story/reference inventory에서 `style`/`<style>` owner 목록이 explicit exception owner와 정확히 일치하고, allowlisted 파일 안에도 raw shared color/border var bridge가 남지 않는다. |
| 중단 조건 | exception owner를 줄이려면 compare marker, reference owner, host-composition overlay contract를 흔들어야 하거나, full inventory 기반 allowlist를 phase 내부에서 self-sufficient하게 닫을 수 없으면 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/taskbar/storybook/**`, `packages/ui/src/components/taskbar/**/*.stories.tsx` | 정리/재분류 | taskbar Storybook owner도 canonical inventory의 일부이며 stale subset allowlist를 따르지 않는다. | `compareTaskbarStage`, `foundationRegistrationStage`, `taskbar.stories.tsx` 같은 explicit owner만 남고 `taskbarIconButton.stories.tsx` 같은 simple wrapper drift는 제거된다. |
| `packages/ui/src/components/panels/windows/storybook/**`, `packages/ui/src/components/panels/windows/**/*.stories.tsx` | 정리/재분류 | windows panel reference owner와 host-composition owner를 분리해 설명한다. | `windowsPanelReferenceStage.tsx`와 `windowsPanelContext.stories.tsx`의 역할이 exception taxonomy로 명시되고, 불필요한 wrapper style은 className으로 이동한다. |
| `packages/ui/src/components/panels/search/storybook/**`, `packages/ui/src/components/panels/search/**/*.stories.tsx` | 정리/재분류 | search panel도 windows와 같은 owner taxonomy를 따른다. | `searchPanelReferenceStage.tsx`와 `searchPanelContext.stories.tsx`가 같은 bounded exception rule로 닫힌다. |
| `packages/ui/src/components/panels/context/storybook/**`, `packages/ui/src/components/panels/context/contextPanel/*.stories.tsx` | 정리 | context leaf story는 thin compare wrapper와 simple wrapper story를 구분한다. | `CompareContextPanelStage`만 thin wrapper로 남고 `contextPanel.stories.tsx`, `contextPanelUseCases.stories.tsx`는 allowlist에서 빠진다. |
| `packages/ui/src/components/panels/taskbarContextMenu/**`, `packages/ui/src/components/panels/taskbarHoverPreview/**` | 정리/재분류 | old subset 밖 family도 Storybook allowlist inventory에 반드시 포함한다. | `taskbarContextMenuReferenceStage.tsx`, `taskbarHoverPreviewReferenceStage.tsx`가 explicit decorative owner로 편입된다. |
| `packages/ui/.storybook/storybook.css` | 정리 | repeated Storybook wrapper class를 central owner로 끌어올릴 수 있으면 여기로 이동한다. | per-story inline wrapper style이 줄고 reusable class owner가 생기면 이 파일이 그 책임을 가진다. |

### 완료 증거

- `packages/ui/src/components/**` 전체에서 `**/*.stories.tsx`와 `**/storybook/**`를 스캔한 style/style-tag owner 목록이 explicit exception owner만 남는 형태로 정리된다.
- `taskbarIconButton.stories.tsx`, `contextPanel.stories.tsx`, `contextPanelUseCases.stories.tsx` 같은 simple wrapper drift는 allowlist에서 빠지고 className 기반 wrapper로 정리된다.
- `windowsPanelContext.stories.tsx`, `searchPanelContext.stories.tsx`, `taskbarContextMenuReferenceStage.tsx`, `taskbarHoverPreviewReferenceStage.tsx`는 bounded exception owner 또는 positive host-owner signal로 설명된다.
- `CompareLeafStage`를 포함한 thin compare wrapper inventory가 live repo usage와 문서, 검증에 같은 이름으로 반영된다.

- owner_agent: `frontend-developer`
- 목적: Storybook cleanup boundary를 subset family list에서 `packages/ui/src/components/**` full inventory로 다시 닫고, simple wrapper cleanup과 bounded exception owner를 같은 inventory-derived validation으로 증명한다.
- boundary:
  - writable Storybook inventory: `packages/ui/src/components/**` 중 `**/*.stories.tsx`와 `**/storybook/**`
  - writable supporting owner file: `packages/ui/.storybook/storybook.css`
  - read-only scope anchor: `packages/ui/src/index.ts`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
- input:
  - Phase 1 output:
    - runtime canonical surface와 legacy surface 제거 상태가 고정돼 있다.
    - exported family와 compare-owned family가 canonical inventory에 포함된다는 boundary rule이 이미 문서화돼 있다.
  - 현재 repo context:
    - 기존 allowlist는 taskbar/windows/search subset만 가정했고, `context`, `taskbarContextMenu`, `taskbarHoverPreview` family를 빠뜨렸다.
    - 이미 포함된 family 안에서도 `taskbarIconButton.stories.tsx`, `windowsPanelContext.stories.tsx`, `searchPanelContext.stories.tsx` 같은 drift가 남아 있다.
    - thin compare wrapper 사용 패턴은 `CompareRoot` 직접 사용만 문서화된 상태와 달리 `CompareLeafStage`, `ComparePanelStage`, `CompareContextPanelStage` 같은 wrapper까지 실제로 쓰고 있다.
- output:
  - 공개 계약:
    - className으로 옮길 수 있는 display/flex/gap/padding/alignment/text-color/layout wrapper는 모두 className이나 central Storybook class owner로 이동한다.
    - bounded exception owner는 아래 범주로만 남길 수 있다.
      - decorative desktop backdrop gradient
      - fixed capture canvas 또는 token-relative geometry
      - `CompareRoot` public DOM contract를 보존하기 위한 scoped width rule
      - host-composition overlay absolute placement
    - raw shared color/border var 소비와 runtime bridge는 bounded exception으로 남길 수 없다.
    - thin compare wrapper owner는 `CompareRoot`, `CompareLeafStage`, `ComparePanelStage`, `CompareContextPanelStage`처럼 compare metadata만 소유하는 helper로 고정한다.
    - reference owner marker와 compare owner signal은 positive verification surface로 유지한다.
  - 내부 기본값:
    - simple wrapper style은 individual story에 남기지 않고 className 또는 central Storybook class owner로 옮긴다.
    - allowlist는 canonical inventory 전체를 스캔한 실제 owner 목록을 기준으로 유지한다.
  - 허용하지 않는 대안:
    - subset family path만 스캔해서 allowlist를 green 처리하는 선택
    - host-composition story를 simple wrapper와 같은 규칙으로 처리해 owner signal을 잃는 선택
    - `CompareLeafStage`를 포함한 thin compare wrapper 패턴을 문서에 반영하지 않은 채 plan만 green 처리하는 선택
- 선행조건: Phase 1의 runtime canonical surface가 고정돼 있어야 한다.
- 제약:
  - `apps/web/**`는 writable boundary가 아니다.
  - compare/reference marker, story ID, `data-visual-root`, `data-visual-kind`, `data-marker` contract는 유지해야 한다.
  - allowlist는 same phase 안에서 self-sufficient하게 검증되어야 하며 later phase cleanup을 가정할 수 없다.
- side effects:
  - Storybook wrapper 표현 방식이 className 또는 central class owner 쪽으로 이동한다.
  - 일부 file은 bounded exception owner로 남지만, 그 사유가 explicit taxonomy로 문서화된다.
- failure/validation: full inventory를 스캔했을 때 allowlist가 subset path 가정이나 stale file 목록에 의존하거나, allowlisted 파일 안에 raw shared var bridge가 남아 있으면 이 phase는 실패다.
- 작업:
  - `packages/ui/src/components/**`의 story/reference owner 전체를 다시 스캔해 simple wrapper cleanup 대상과 bounded exception owner를 분리한다.
  - `context`, `taskbarContextMenu`, `taskbarHoverPreview` family를 allowlist와 validation boundary에 포함한다.
  - `taskbarIconButton.stories.tsx`, `contextPanel.stories.tsx`, `contextPanelUseCases.stories.tsx`처럼 simple wrapper drift가 남은 파일은 className 기반 wrapper로 정리한다.
  - `windowsPanelContext.stories.tsx`, `searchPanelContext.stories.tsx`는 host-composition absolute placement owner 여부를 명시하고, reference stage와 compare owner marker를 유지한다.
  - `CompareRoot`, `CompareLeafStage`, `ComparePanelStage`, `CompareContextPanelStage`의 thin-wrapper 역할을 문서와 owner inventory에 맞춘다.
- 검증:
  - [ ] `$actual = rg -l -g '**/*.stories.tsx' -g '**/storybook/*.tsx' -- 'style=\\{\\{|<style>' packages/ui/src/components | ForEach-Object { $_ -replace '\\','/' } | Sort-Object; $expected = @('packages/ui/src/components/taskbar/storybook/compareTaskbarStage.tsx','packages/ui/src/components/taskbar/taskbar/taskbar.stories.tsx','packages/ui/src/components/panels/windows/storybook/windowsPanelReferenceStage.tsx','packages/ui/src/components/panels/windows/storybook/windowsPanelContext.stories.tsx','packages/ui/src/components/panels/search/storybook/searchPanelReferenceStage.tsx','packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx','packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuReferenceStage.tsx','packages/ui/src/components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewReferenceStage.tsx') | Sort-Object; Compare-Object $expected $actual` 결과가 비어 있어 full-tree style owner inventory가 explicit exception owner와 정확히 일치함을 확인한다.
  - [ ] `$files = @('packages/ui/src/components/taskbar/storybook/compareTaskbarStage.tsx','packages/ui/src/components/taskbar/taskbar/taskbar.stories.tsx','packages/ui/src/components/panels/windows/storybook/windowsPanelReferenceStage.tsx','packages/ui/src/components/panels/windows/storybook/windowsPanelContext.stories.tsx','packages/ui/src/components/panels/search/storybook/searchPanelReferenceStage.tsx','packages/ui/src/components/panels/search/storybook/searchPanelContext.stories.tsx','packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuReferenceStage.tsx','packages/ui/src/components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewReferenceStage.tsx'); Get-Item $files | Select-String -Pattern '(color|background(Color)?|border(Color)?):\\s*\"var\\(--(taskbar|shell)-(foreground|foreground-muted|border|surface)' | ForEach-Object { "{0}:{1}:{2}" -f $_.Path.Replace('\','/'), $_.LineNumber, $_.Line.Trim() }` 결과가 비어 있어 allowlisted 파일 안에도 raw shared color/border var inline style이 남지 않았음을 확인한다.
  - [ ] `rg -n -P -g '**/*.stories.tsx' -g '**/storybook/*.tsx' -- '\bborder-taskbar\b(?!-)|\btext-taskbar\b(?!-)|\btext-taskbar-muted\b|\btext-taskbar-search-icon\b|\bshadow-taskbar-search-inset\b|--panel-border|border-\[var\(|text-\[var\(' packages/ui/src/components` 결과가 비어 있어 Storybook도 old shared surface와 raw var consumer를 남기지 않았음을 확인한다.
  - [ ] `rg -n -- 'FOUNDATION_REGISTRATION|data-marker=|data-visual-root|data-visual-kind|CompareLeafStage|CompareContextPanelStage|ComparePanelStage' packages/ui/src/components` 결과가 남아 있어 thin compare wrapper와 positive owner marker가 유지됨을 확인한다.
  - [ ] `pnpm --filter @windows/ui test`가 green이다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 green이다.
