# Phase 2. behavior Storybook 분리

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | `interactive/taskbar/storybook` 아래에 runtime verification 전용 Storybook branch를 만들고 hover/context behavior를 canonical visual catalog 밖으로 분리한다. |
| 선행조건 | Phase 1의 hover dismiss contract와 tests가 stable해야 한다. |
| 완료 판단 | `Interactive/Taskbar/HoverPreview`, `Interactive/Taskbar/ContextPanel`, `Interactive/Taskbar/MutualExclusion` stories가 discovery되고, component fixture inventory는 read-only source로만 재사용된다. |
| 중단 조건 | 새 behavior stories를 만들기 위해 component compare inventory를 확장하거나, Windows/Search용 새 headless hook을 같은 slice에서 추가해야 하면 범위가 바뀌므로 중단한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/.storybook/main.ts` | 보강 | discovery는 `interactive/taskbar/storybook/**/*.stories.tsx`만 추가하고, 기존 component roots는 건드리지 않는다. | Storybook이 `Interactive/Taskbar/*` branch를 인덱싱한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorFixtures.ts` | 추가 | fixture winner는 existing component fixture가 소유한다. 새 canonical visual state를 invent하면 안 된다. | hover/context behavior stories가 기존 data/asset을 read-only로 재사용한다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx` | 추가 | harness는 storybook support 파일이지 public export가 아니다. consumer-owned mutual exclusion을 이 경계에서만 조합한다. | trigger ref, pointer origin, focus restore, dismiss/close choreography가 한 helper 경계에 모인다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx` | 추가 | title은 `Interactive/Taskbar/HoverPreview`다. `TaskbarIconButton + TaskbarHoverPreview` hover lifecycle만 소유한다. | visual catalog와 분리된 hover behavior story가 열린다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.behavior.stories.tsx` | 추가 | title은 `Interactive/Taskbar/ContextPanel`이다. `TaskbarIconButton + TaskbarContextMenu` pointer/keyboard/focus restore behavior를 소유한다. | context open/close path가 behavior branch에서 확인된다. |
| `packages/ui/src/interactive/taskbar/storybook/taskbarMutualExclusion.behavior.stories.tsx` | 추가 | title은 `Interactive/Taskbar/MutualExclusion`이다. consumer가 `hover.dismiss()`와 `context.close()`를 같이 쓰는 winner rule만 소유한다. | hover/context mutual exclusion과 resting pointer no-op가 독립 story로 검토 가능하다. |

### 완료 증거

- Storybook sidebar에 `Interactive/Taskbar/*` branch가 별도 생긴다.
- behavior stories가 component story folders가 아니라 `interactive/taskbar/storybook` 아래에만 존재한다.
- 기존 compare `kind/state` inventory와 canonical visual fixture state는 새 behavior story 때문에 늘어나지 않는다.

- owner_agent: `frontend-developer`
- 목적:
  - runtime/기능 검증 Storybook을 component catalog에서 분리해 hook behavior와 visual inventory ownership을 일치시킨다.
- boundary:
  - `packages/ui/.storybook/main.ts`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorFixtures.ts`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarBehaviorHarnesses.tsx`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarHoverPreview.behavior.stories.tsx`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarContextPanel.behavior.stories.tsx`
  - `packages/ui/src/interactive/taskbar/storybook/taskbarMutualExclusion.behavior.stories.tsx`
- input:
  - Phase 1의 hover dismiss contract
  - existing `TaskbarHoverPreview`, `TaskbarContextMenu`, `TaskbarIconButton` visual components
  - existing component fixture sources:
    - `packages/ui/src/components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewFixtures.ts`
    - `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuFixtures.ts`
  - 사용자 합의:
    - Storybook in this slice is functional/runtime verification, not component catalog.
    - behavior stories는 `interactive/taskbar/storybook` 아래에 둔다.
    - canonical visual/reference/compare stories는 `components/**`에 남긴다.
- output:
    - 공개 계약:
      - Storybook titles:
        - `Interactive/Taskbar/HoverPreview`
        - `Interactive/Taskbar/ContextPanel`
        - `Interactive/Taskbar/MutualExclusion`
      - `HoverPreview` story는 hover intent, open/close, exit lifecycle을 보여 준다.
      - `ContextPanel` story는 pointer-origin open, Escape close, focus restore를 보여 준다.
      - `MutualExclusion` story는 `context open -> hover dismissed`, `hover winner -> context closes`, `resting pointer no-op`를 보여 준다.
    - 내부 기본값:
      - shared harness helper가 taskbar strip, trigger refs, backdrop, inline placement host를 공통 소유한다.
      - behavior fixture adapter는 existing component fixture state를 read-only로 가져오고, compare kind/state는 추가하지 않는다.
      - behavior stories는 public package export가 아니라 Storybook support surface다.
    - 허용하지 않는 대안:
      - behavior stories를 `Taskbar/Compose/*`나 component story file에 다시 섞는 방식
      - 새 behavior story 때문에 canonical compare state를 추가하는 방식
      - Windows/Search용 새 hook이나 story-only state orchestration을 이번 slice에 끌어오는 방식
- 제약:
  - Storybook branch는 `Interactive/Taskbar/*` 아래로만 열린다.
  - component fixture inventory는 visual state owner로 유지하고 behavior story는 read-only consumer가 된다.
  - harness helper나 story module은 `@windows/ui` 또는 `@windows/ui/interactive` export에 추가되지 않는다.
- side effects:
  - Storybook sidebar에 behavior/runtime verification 전용 branch가 추가된다.
  - canonical visual inventory와 behavior review surface가 서로 다른 디렉터리 경계를 가지게 된다.
- failure/validation:
  - 새 behavior story를 만들기 위해 compare inventory가 늘어나면 실패다.
  - behavior story discovery를 위해 component titles를 바꾸거나 taxonomy를 뒤집어야 하면 실패다.
  - mutual exclusion story가 consumer-owned rule 대신 hidden coordinator helper를 public처럼 감추면 실패다.
- 작업:
  - `.storybook/main.ts`에 `interactive/taskbar/storybook` discovery 경계를 추가한다.
  - shared harness helper에서 taskbar strip, trigger button, pointer origin, focus restore, dismiss/close choreography를 공통화한다.
  - behavior fixture adapter가 existing component fixture state와 icon asset을 read-only로 조합하도록 정리한다.
  - hover/context/mutual exclusion 각각을 독립 story로 작성해 hook/runtime behavior를 component catalog 밖에서 보여 준다.
- 검증:
  - [ ] `pnpm --filter @windows/ui build-storybook`
  - [ ] `rg -n 'title: "Interactive/Taskbar/' packages/ui/src/interactive/taskbar/storybook -g "*.stories.tsx"` 결과가 세 behavior story title을 보여 준다.
  - [ ] `rg -n 'kind=\"taskbar-|state=\"(hover-single|hover-multi|context-pinned|context-unpinned)' packages/ui/src/interactive/taskbar/storybook packages/ui/src/components/panels/taskbarHoverPreview packages/ui/src/components/panels/taskbarContextMenu` 결과를 확인해 새 behavior story가 compare inventory를 추가하지 않았음을 검토한다.
  - [ ] Storybook source를 열어 `MutualExclusion` story가 `hover.dismiss()`와 `context.close()` 조합을 직접 사용하고, resting pointer no-op contract를 문서/코드로 드러내는지 확인한다.
