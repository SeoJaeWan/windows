# Phase 3. CLAUDE 거버넌스 고정

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | `.claude` 문서가 source tree와 같은 Storybook taxonomy/meta/title rule을 canonical 운영 규칙으로 설명한다. |
| 선행조건 | Phase 2에서 최종 taxonomy inventory와 compose owner/meta rule이 확정돼 있어야 한다. |
| 완료 판단 | `.claude/rules/storybook.md`와 `.claude/CLAUDE.md`만 읽어도 도메인 root, `Components`/`Compose`, literal title rule, `Reference`/`Compare*` rule, compose meta owner rule을 그대로 재현할 수 있다. |
| 중단 조건 | source tree의 final taxonomy와 `.claude` 문서 서술이 서로 다른 owner rule이나 legacy root를 동시에 허용해야 하는 상황이 나오면 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `.claude/rules/storybook.md` | 보강/재구성 | Storybook governance의 canonical repo-local source다. old `Panel / Use Cases / Context` taxonomy는 역사 설명이 아니라 현재 금지 패턴으로 다뤄야 한다. | 문서가 domain-first root, `Components`/`Compose`, literal title, compose meta owner, `Reference`/`Compare*` 규칙을 모두 담는다. |
| `.claude/CLAUDE.md` | 갱신 | `Rules` 섹션의 Storybook 항목은 단순 index를 넘어 final operating rule을 찾게 해야 한다. 파일 끝쪽 안내 문구도 같은 rule을 가리켜야 한다. | `.claude/CLAUDE.md` 끝에서 Storybook taxonomy rule이 명시적으로 다시 노출된다. |

### 완료 증거

- `.claude/rules/storybook.md`가 새 taxonomy와 금지 패턴을 한 문서 안에서 설명한다.
- `.claude/CLAUDE.md`가 Storybook rule을 index와 final reminder 둘 다에서 가리킨다.
- 이후 Storybook 작업자가 source tree를 열지 않아도 taxonomy rule을 따라갈 수 있다.

- owner_agent: `general-developer`
- 목적:
  - Storybook taxonomy/meta/title rule을 `.claude` 운영 문서에 고정해 이후 planning/review/implementation에서도 같은 기준을 재사용하게 만든다.
- boundary:
  - `.claude/rules/storybook.md`
  - `.claude/CLAUDE.md`
- input:
  - Phase 2에서 final title inventory와 compose owner/meta rule이 확정돼 있다.
  - 현재 `.claude/rules/storybook.md`는 `Panel`, `Use Cases`, `Context` 중심 taxonomy를 설명한다.
  - 현재 `.claude/CLAUDE.md`는 `.claude/rules/storybook.md`를 짧은 index bullet로만 노출한다.
- output:
    - 공개 계약:
      - `.claude/rules/storybook.md`는 `Taskbar`, `Windows`, `Search`, `Context` domain root와 `Components`, `Compose` 하위 taxonomy를 canonical rule로 명시한다.
      - Storybook sidebar title source는 literal `meta.title`만 허용하고 imported const/helper-based title source는 금지 패턴으로 적는다.
      - `Components` stories의 `meta.component`는 canonical component owner와 1:1이어야 한다.
      - `Compose` stories는 host-composed surface나 inventory showcase만 소유하며, 단일 host owner가 있을 때만 `meta.component`를 두고 inventory-only compose는 omit 가능하다고 적는다.
      - `Reference`는 사람 검토용, `Compare*`는 machine capture용이지만 둘 다 같은 title branch 안에 남는다고 적는다.
      - `.claude/CLAUDE.md`는 Storybook rule 항목 설명을 새 taxonomy 기준으로 갱신하고, 문서 마지막 안내에도 같은 Storybook operating rule을 다시 노출한다.
    - 내부 기본값:
      - old taxonomy는 historical 배경이 아니라 current default 금지 예시로만 남긴다.
    - 허용하지 않는 대안:
      - old `Panel / Use Cases / Context` taxonomy를 current convention으로 유지하는 문서화
      - `.claude/CLAUDE.md`에서 Storybook governance를 단순 링크만 남기고 final reminder를 누락하는 방식
- 선행조건:
  - Phase 2 output이 source tree에서 먼저 닫혀 있어야 한다.
- 제약:
  - 이 phase는 source tree title/meta를 다시 바꾸지 않는다.
  - `.claude` 문서는 final taxonomy를 설명해야 하고, legacy naming을 같은 강도로 병기하지 않는다.
- failure/validation:
  - 문서가 source tree보다 더 넓거나 다른 예외를 허용하면 future review가 다시 drift하므로 blocker다.
- 작업:
  - `.claude/rules/storybook.md`를 `도메인 root`, `Components/Compose`, `literal title`, `compose meta owner`, `Reference/Compare*`, `legacy 금지 패턴` 중심으로 재구성한다.
  - `.claude/CLAUDE.md`의 Storybook bullet 설명을 새 taxonomy rule이 보이도록 바꾸고, 문서 끝 안내에 `packages/ui` Storybook 작업 시 이 규칙을 반드시 따른다는 final reminder를 추가한다.
- 검증:
    - [ ] `rg -n "Components|Compose|literal title|meta.component|Reference|Compare" .claude/rules/storybook.md` 결과가 새 운영 규칙을 모두 보여 준다.
    - [ ] `Get-Content ./.claude/CLAUDE.md | Select-Object -Last 12`로 문서 끝 안내에 Storybook operating rule이 다시 노출되는지 확인한다.
    - [ ] `.claude/rules/storybook.md`를 직접 읽어 old `Panel / Use Cases / Context` taxonomy가 current default로 남아 있지 않은지 확인한다.
