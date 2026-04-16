# Phase 5. visual drift closure

> 이 문서는 Phase 4 compare report가 지적한 drift만 source tree에서 닫는 실행용 상세 계약이다.
> public API와 canonical inventory를 다시 열지 않고, 같은 compare key를 다시 pass시키는 closure만 담당한다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | compare report의 exact mismatch key만 고쳐 canonical 6 state를 다시 pass 또는 no-op closure로 닫는다. |
| 선행조건 | Phase 4가 exact `kind/state` mismatch report를 남겨야 한다. |
| 완료 판단 | final compare report가 canonical 6 state 전체에 대해 pass 또는 no-op closure를 명시한다. |
| 중단 조건 | mismatch를 줄이려면 public API, canonical inventory, internal/public ownership을 다시 열어야 한다는 상황이 생기면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/**` | 조정 | shared frame drift만 고치고 `WindowFrame`를 public surface로 승격하면 안 된다. | report가 지적한 chrome mismatch만 줄고 internal-only boundary는 유지된다. |
| `packages/ui/src/components/windows/folder/**` | 조정 | `Folder` canonical 2 state 외의 새 state나 prop를 만들지 않는다. | `folder/desktop-default`, `folder/mobile-collapsed`가 rerun compare에서 pass 또는 no-op로 닫힌다. |
| `packages/ui/src/components/windows/browser/**` | 조정 | `Browser` canonical 4 state 외의 새 state나 public prop를 만들지 않는다. | `browser/*` canonical 4 state가 rerun compare에서 pass 또는 no-op로 닫힌다. |
| `packages/ui/src/components/windows/storybook/**` | 조정 | supporting reference를 canonical로 승격하거나 key naming을 바꾸면 안 된다. | story/fixture helper가 same key inventory를 유지한다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 조정 | compare recipient drift가 있을 때만 최소 범위에서 수정한다. | rerun compare가 same `folder` / `browser` inventory key를 찾는다. |
| `plans/windows-ui-folder-browser-window-family/visual-compare/` | 갱신 | final report는 first compare와 same inventory key로 closure를 남겨야 한다. | final report가 canonical 6 state에 대한 pass/no-op 결과를 남긴다. |

### 완료 증거

- final compare report가 canonical 6 state를 모두 다시 언급한다.
- source change가 있어도 `Folder`, `Browser`, `WindowFrame` public/내부 경계는 유지된다.
- compare rerun이 같은 `folder` / `browser` key naming을 계속 사용한다.

- owner_agent: `frontend-developer`
- 목적:
  - compare report의 drift만 닫고, plan이 합의한 ownership과 canonical inventory를 다시 열지 않은 채 최종 closure를 만든다.
- boundary:
  - primary write target: `packages/ui/src/components/windows/internal/windowFrame/**`
  - primary write target: `packages/ui/src/components/windows/folder/**`
  - primary write target: `packages/ui/src/components/windows/browser/**`
  - primary write target: `packages/ui/src/components/windows/storybook/**`
  - primary write target: `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
  - primary write target: `plans/windows-ui-folder-browser-window-family/visual-compare/`
  - read-only prerequisite: `plans/windows-ui-folder-browser-window-family/visual-compare/report.md`
- input:
  - 시나리오: Phase 4 compare report가 canonical 6 state 중 일부 mismatch를 남긴 뒤, maintainer가 same inventory 안에서 visual drift만 수리하려는 경우
  - fix target source:
    - exact `kind/state` key
    - drift summary
    - reference/current/diff artifact pair
- output:
  - 공개 계약:
    - final compare report는 canonical 6 state 모두를 pass 또는 no-op로 닫는다.
    - public surface는 여전히 `Folder`, `Browser`만 유지한다.
  - 내부 기본값:
    - shared frame, story helper, compare recipient 수정은 mismatch를 줄이는 최소 범위에서만 허용한다.
  - 중요한 negative output:
    - new public props, new canonical states, public `WindowFrame`, route-aware behavior를 추가하지 않는다.
    - drag/resize/minimize interaction state를 이번 closure에 끼워 넣지 않는다.
- 제약:
  - same `kind/state` inventory를 그대로 rerun해야 한다.
  - 수정은 compare report가 지적한 visual drift에만 한정한다.
- side effects:
  - final report가 implementation handoff용 visual acceptance evidence가 된다.
  - 이후 `plan-materialize`가 same canonical inventory를 기준으로 coverage를 고를 수 있다.
- failure/validation: mismatch를 줄이려면 public API를 다시 열어야 하거나 canonical inventory를 바꿔야 하는 상황이 생기면 current split이 더는 self-sufficient하지 않으므로 blocker다.
- 작업:
  - report의 exact mismatch key만 골라 source tree에서 수정한다.
  - same inventory로 compare를 다시 실행한다.
  - final report에 pass 또는 no-op closure를 남긴다.
- 검증:
  - [ ] `pnpm --filter @windows/ui build-storybook`가 source 수정 후에도 성공해야 한다.
  - [ ] final compare report가 canonical 6 state를 same key로 다시 나열해야 한다.
  - [ ] `Folder`, `Browser`, `WindowFrame` 경계가 수정 후에도 기존 합의와 같아야 한다.
