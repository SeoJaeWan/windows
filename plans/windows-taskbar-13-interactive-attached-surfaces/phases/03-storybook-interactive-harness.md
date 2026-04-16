# Phase 3. Storybook harness 검증

> 이 문서는 실행용 상세 계약이다. 맨 위 컨트롤러 다이제스트만 읽어도 이 phase의 목표, 파일 단위 변경, 완료 판단, 중단 시점을 알 수 있어야 한다.
> 아래 기술 섹션은 `plan.md`의 같은 phase 요약을 기술적으로 확장하되, 범위나 결론을 새로 바꾸지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | packages/ui Storybook 안에서 hook과 visual leaf를 같이 붙여 볼 수 있는 interactive harness를 추가해 app/web 없이도 현재 slice를 검토 가능하게 만든다. |
| 선행조건 | Phase 2의 hook public contract와 unit test가 stable해야 한다. |
| 완료 판단 | hover/context story에 hook+leaf composition harness가 추가되고 build-storybook이 통과하며, canonical compare inventory는 그대로 유지된다. |
| 중단 조건 | harness story를 만들기 위해 `apps/web` 파일이나 compare inventory 재설계가 필요해지면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/panels/taskbarHoverPreview/taskbarHoverPreview.stories.tsx` | 정리 | canonical visual state story는 유지하고, hook composition을 보여 주는 interactive harness story만 추가한다. compare inventory를 늘리면 안 된다. | hover preview story source에 visual canonical story와 interactive harness story의 역할이 분리돼 있다. |
| `packages/ui/src/components/panels/taskbarHoverPreview/storybook/taskbarHoverPreviewHarness.tsx` | 추가 | story-local trigger ref, surface mount, local desktop stage만 소유한다. public hook contract를 감추는 wrapper가 되어서는 안 된다. | hover harness가 packages/ui hook + visual leaf만으로 open/close/lifecycle review surface를 제공한다. |
| `packages/ui/src/components/panels/taskbarContextMenu/taskbarContextMenu.stories.tsx` | 정리 | canonical pinned/unpinned story는 유지하고 context keyboard/focus harness story만 추가한다. compare kind/state는 그대로 둔다. | context story source에 canonical state와 interactive harness가 분리돼 있다. |
| `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuHarness.tsx` | 추가 | story-local trigger ref, pointer origin, focus restore, hover/context mutual exclusion demo를 packages/ui 안에서만 재현한다. public coordinator API를 새로 만들지 않는다. | context harness가 keyboard close와 focus restore, mutual exclusion demo를 보여 준다. |
| `packages/ui/src/components/panels/taskbarContextMenu/storybook/taskbarContextMenuFixtures.ts` | 정리 | canonical fixture와 harness input이 같은 `appIdentifier.id`/`appRows` contract를 공유한다. | story fixture가 old identifier shape를 다시 열지 않는다. |

### 완료 증거

- Storybook source에 hover harness story, context harness story, local mutual exclusion demo가 packages/ui hook 조합으로 존재한다.
- `build-storybook`이 통과하고 기존 compare story title/kind/state inventory가 변하지 않는다.
- `apps/web` 파일이나 external portal owner 없이도 current slice behavior를 수동 검토할 수 있다.

- owner_agent: `frontend-developer`
- 목적: 현재 slice를 packages/ui 차원에서 바로 검토하고 이후 host integration 전에 contract drift를 잡을 수 있는 review surface를 만든다.
- boundary: `packages/ui/src/components/panels/taskbarHoverPreview/**`, `packages/ui/src/components/panels/taskbarContextMenu/**`의 Storybook source만 write target이다. `.storybook/main.ts`는 read-only unless story discovery가 막힐 때만 최소 수정한다.
- input:
    - Phase 1의 visual leaf contract
    - Phase 2의 `useTaskbarHoverPreview`, `useTaskbarContextPanel` public hook surface
    - 기존 canonical story와 compare inventory(`hover-single`, `hover-multi`, `context-pinned`, `context-unpinned`)
- output:
    - 공개 계약:
        - Storybook에는 hook+leaf composition을 보여 주는 interactive harness story가 추가된다.
        - hover harness는 hover intent와 exit lifecycle을 보여 준다.
        - context harness는 pointer open, keyboard close, focus restore를 보여 준다.
        - story-local combined demo는 hover/context mutual exclusion winner rule을 보여 주되 public coordinator API로 승격하지 않는다.
    - 내부 기본값:
        - harness는 story-local trigger ref와 pointer 좌표만 써서 packages/ui hook을 구동한다.
        - canonical compare inventory와 visual reference stage는 그대로 유지한다.
        - harness helper는 storybook support file이지 public package export가 아니다.
    - 허용하지 않는 대안:
        - harness review를 위해 `apps/web` 파일을 수정하는 방향
        - harness state를 compare inventory나 root public export로 승격하는 방향
        - interactive story를 canonical compare state 개수 증가로 해석하는 방향
- 선행조건:
    - Phase 2에서 hook unit test가 green이고 public return contract가 stable해야 한다.
- 제약:
    - Storybook validation은 packages/ui package boundary 안에서 끝나야 한다.
    - compare kind/state inventory는 기존 canonical visual states를 유지해야 한다.
    - mutual exclusion demo는 public coordinator API가 아니라 story-local composition으로만 보여 준다.
- side effects:
    - Storybook이 packages/ui level behavior review surface 역할을 함께 가지게 된다.
    - harness helper 파일이 생기지만 `@windows/ui` root나 `@windows/ui/interactive` public export에는 추가되지 않는다.
- failure/validation:
    - harness story를 만들기 위해 app/web layer state나 portal owner를 필수로 요구하면 이 phase는 실패다.
    - canonical compare inventory가 interactive harness state까지 흡수하면 이 phase는 실패다.
    - storybook build가 새 harness story 때문에 깨지면 이 phase는 실패다.
- 작업:
    - hover preview story에 hook composition harness story를 추가하고, stage/trigger/harness state는 story-local helper 파일로 분리한다.
    - context menu story에 keyboard/focus harness story를 추가하고, pointer origin·trigger ref·focus restore·mutual exclusion demo는 story-local helper 파일에 모은다.
    - canonical fixture는 새 identifier/callback contract를 따르되 compare state inventory는 그대로 유지한다.
    - 필요하면 `.storybook/main.ts`는 story discovery 범위가 기존 디렉터리 안에서 충분한지 확인만 하고, discovery 문제가 있을 때만 최소 수정한다.
- 검증:
    - [ ] `pnpm --filter @windows/ui build-storybook`
    - [ ] `pnpm --filter @windows/ui storybook` 실행 후 hover interactive story가 hover intent와 exit lifecycle을 보여 주는지 수동 확인한다.
    - [ ] `pnpm --filter @windows/ui storybook` 실행 후 context interactive story가 pointer open, keyboard close, focus restore, mutual exclusion demo를 보여 주는지 수동 확인한다.
    - [ ] 기존 canonical compare story title과 state inventory가 `hover-single`, `hover-multi`, `context-pinned`, `context-unpinned` 그대로 유지되는지 코드로 확인한다.
