# Phase 3. boundary rule 거버넌스 고정

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | 이번 update pass에서 확정한 `packages/ui/src/components/**` canonical inventory rule과 Storybook bounded exception taxonomy를 `.claude` 운영 문서에 고정한다. |
| 선행조건 | Phase 1과 Phase 2에서 canonical inventory와 bounded exception taxonomy가 plan 문서 수준에서 고정돼 있어야 한다. |
| 완료 판단 | `.claude` 문서만 읽어도 package-wide cleanup에서 canonical inventory, read-only anchor, explicit negative scope, thin compare wrapper, bounded exception owner rule을 재현할 수 있다. |
| 중단 조건 | 운영 규칙 문서가 Phase 1/2 contract와 다른 scope나 예외 taxonomy를 제시해야만 하는 상황이면 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `.claude/CLAUDE.md` | 갱신 | 새 boundary rule은 기존 Storybook/component-design rule과 같은 index 레벨에서 노출돼야 한다. | 관련 작업자가 canonical inventory rule 파일을 바로 찾을 수 있다. |
| `.claude/rules/storybook.md` | 보강 | Storybook rule은 실제 repo 패턴에 맞춰 `CompareLeafStage`를 포함한 thin compare wrapper와 bounded exception owner taxonomy를 포함해야 한다. | `CompareRoot` 직접 사용만 문서화된 drift가 사라진다. |
| `.claude/rules/packages-ui-boundary.md` | 추가 | package-wide styling / semantic facade / rename / Storybook cleanup work는 boundary와 validation이 같은 inventory를 봐야 한다. | explicit negative scope + matching validation rule이 repo-local operating rule로 고정된다. |

### 완료 증거

- `.claude/CLAUDE.md`가 새 package-boundary rule을 기존 rule index에 추가한다.
- `.claude/rules/storybook.md`가 `CompareRoot`, `CompareLeafStage`, `ComparePanelStage`, `CompareContextPanelStage`와 bounded exception owner taxonomy를 현재 repo 패턴에 맞춰 설명한다.
- `.claude/rules/packages-ui-boundary.md`가 canonical inventory, read-only anchor, explicit negative scope, validation alignment rule을 한 파일에 고정한다.

- owner_agent: `general-developer`
- 목적: 이번 plan에서 확인된 boundary/validation alignment rule을 repo-local 운영 규칙으로 남겨 future plan/review/implementation이 같은 scope drift를 반복하지 않게 한다.
- boundary:
  - writable files: `.claude/CLAUDE.md`, `.claude/rules/storybook.md`, `.claude/rules/packages-ui-boundary.md`
  - read-only adjacent references: `.claude/rules/component-design.md`, `plans/windows-taskbar-11-shell-theme-facade/plan.md`
- input:
  - Phase 1 output:
    - canonical runtime inventory는 `packages/ui/src/components/**` 전체이며, stories/storybook/tests는 explicit negative scope라는 점이 고정돼 있다.
  - Phase 2 output:
    - Storybook bounded exception owner taxonomy와 `CompareLeafStage`를 포함한 thin compare wrapper owner가 full-tree validation과 함께 고정돼 있다.
  - 현재 repo context:
    - `.claude/CLAUDE.md`는 storybook/component-design rule만 index하고 있다.
    - `.claude/rules/storybook.md`는 `CompareRoot` 직접 사용 예시만 있고 `CompareLeafStage`를 포함한 thin wrapper와 bounded exception taxonomy를 설명하지 않는다.
    - package-wide boundary와 validation alignment rule은 아직 별도 운영 문서가 없다.
- output:
  - 공개 계약:
    - package-wide styling / semantic facade / rename / Storybook cleanup work in `packages/ui`는 canonical inventory를 `packages/ui/src/components/**`로 본다.
    - `packages/ui/src/index.ts` public export와 `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` visual-kind inventory는 read-only scope anchor다.
    - exclusion이 필요하면 explicit negative scope와 matching validation을 같은 plan/rule에 적어야 한다.
    - Storybook cleanup은 simple wrapper style을 className으로 옮기고, decorative backdrop / fixed canvas / token-relative geometry / host-composition absolute placement만 bounded exception owner로 남긴다.
    - thin compare wrapper는 `CompareRoot`, `CompareLeafStage`, `ComparePanelStage`, `CompareContextPanelStage`처럼 compare metadata를 위임하는 helper로 문서화한다.
  - 내부 기본값:
    - root export와 compare inventory는 inclusion guard이지 brittle exhaustive owner test가 아니다.
    - `component-design.md`의 leaf/host 책임 분리는 유지하되, host-composition bounded exception rule은 `storybook.md`와 새 boundary rule에서 다룬다.
  - 허용하지 않는 대안:
    - subset family list를 canonical scope처럼 다시 문서화하는 선택
    - validation command는 full-tree인데 문서 boundary는 subset으로 적는 선택
    - `CompareLeafStage`를 포함한 thin compare wrapper와 host-composition exception을 규칙 밖에 남겨 future 작업이 다시 ad hoc으로 해석하게 만드는 선택
- 선행조건: Phase 1과 Phase 2의 phase detail 문구가 확정돼 있어야 한다.
- 제약:
  - `.claude` 문서는 repo-local 운영 규칙만 고정하며 production code나 tests를 수정하지 않는다.
  - 새 rule 문구는 existing component-design 원칙과 충돌하지 않아야 한다.
- side effects:
  - future plan/review가 `packages/ui` package-wide 작업에서 같은 canonical inventory rule을 재사용할 수 있다.
  - Storybook 예외 판단 기준이 문서화되어 allowlist drift를 조기에 잡기 쉬워진다.
- failure/validation: `.claude` 문서가 Phase 1/2 contract와 다른 scope anchor나 예외 taxonomy를 말하거나, explicit negative scope rule을 빠뜨린 채 general guidance만 남기면 이 phase는 실패다.
- 작업:
  - `.claude/CLAUDE.md`에 새 package-boundary rule 링크를 추가하고 rule index 설명을 보강한다.
  - `.claude/rules/storybook.md`에 `CompareLeafStage`를 포함한 thin compare wrapper, bounded exception owner, host-composition absolute placement rule을 현재 repo 패턴에 맞춰 추가한다.
  - 새 `.claude/rules/packages-ui-boundary.md`를 만들어 canonical inventory, read-only anchor, explicit negative scope, validation alignment operating rule을 기록한다.
- 검증:
  - [ ] `rg -n -- 'packages/ui/src/components/\\*\\*|packages/ui/src/index.ts|compareRoot.tsx|explicit negative scope|matching validation' .claude/CLAUDE.md .claude/rules/packages-ui-boundary.md` 결과가 남아 있어 canonical inventory와 alignment rule이 문서에 고정됐음을 확인한다.
  - [ ] `rg -n -- 'CompareRoot|CompareLeafStage|ComparePanelStage|CompareContextPanelStage|host-composition|bounded exception|className' .claude/rules/storybook.md` 결과가 남아 있어 thin compare wrapper와 Storybook exception taxonomy가 문서화됐음을 확인한다.
  - [ ] `.claude/CLAUDE.md` rule index가 `.claude/rules/packages-ui-boundary.md`를 포함하고, `.claude/rules/storybook.md` 및 `.claude/rules/component-design.md`와 함께 보이도록 정리됐음을 수동 확인한다.
