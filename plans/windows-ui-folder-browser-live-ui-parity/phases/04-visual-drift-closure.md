# Phase 4. 시각 드리프트 마감

> 이 문서는 Phase 3 compare report가 남긴 exact structural blocker만 source tree에서 닫고 같은 inventory로 rerun compare를 남기는 실행용 상세 계약이다.
> public API나 scope를 다시 여는 대신, in-scope drift만 줄여 final pass 또는 explicit blocker를 남기는 것이 목적이다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | Phase 3 report가 가리킨 blocking structural drift만 닫고 같은 canonical 4-state compare로 final pass 또는 explicit blocker를 남긴다. |
| 선행조건 | Phase 3 report가 exact `kind/state` key와 exact blocking category를 남겨야 한다. |
| 완료 판단 | final report가 canonical 4-state 전부에 대해 pass 또는 explicit blocker를 exact key로 적고, documentary-only drift는 blocker로 남지 않는다. |
| 중단 조건 | blocker를 닫으려면 current public API를 다시 설계하거나 Browser body ownership을 package로 옮겨야 한다면 이 phase는 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 합의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/**` | 조정 | thinner shell, internal-only boundary, stable shell marker는 유지한다. | shell blocker가 줄어들고 public surface는 다시 열리지 않는다. |
| `packages/ui/src/components/windows/folder/**` | 조정 | Folder는 current public prop names를 유지한 채 structural live grammar만 닫는다. | `folder/*` blocker가 same API 위에서 pass 또는 explicit blocker로 정리된다. |
| `packages/ui/src/components/windows/browser/**` | 조정 | Browser는 `children` body contract를 유지하고 shell drift만 다룬다. | `browser/*`는 shell scope 기준으로 pass 또는 explicit blocker가 된다. |
| `packages/ui/src/components/windows/storybook/**` | 조정 | same compare recipient, same stage marker, same documentary scope를 유지한다. | rerun compare가 같은 4-state inventory를 그대로 읽는다. |
| `plans/windows-ui-folder-browser-live-ui-parity/visual-compare/` | 갱신 | final compare evidence는 same key naming과 same scope rule을 사용해야 한다. | final report가 canonical 4-state 모두를 다시 평가한다. |

### 완료 증거

- final report가 canonical 4-state를 모두 다시 평가한다.
- remaining 차이가 있더라도 documentary-only drift면 pass로 닫히고 structural blocker만 explicit blocker로 남는다.
- `Folder`, `Browser`, `WindowFrame` 공개/내부 경계가 Phase 2 output과 같은 언어로 유지된다.
- reserved compare marker ownership rule이 fix phase 뒤에도 그대로 유지돼 consumer pass-through가 compare marker를 다시 열지 않는다.

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - compare report가 지적한 exact structural blocker만 닫아 this-plan 기준의 final parity result를 만든다.
- 작업:
  1. Phase 3 report에서 exact `kind/state`와 exact blocker category를 읽는다.
  2. `WindowFrame`, `Folder`, `Browser`, windows storybook helper 범위 안에서 필요한 최소 수정만 적용한다.
  3. 같은 compare inventory와 같은 scope rule로 rerun compare를 실행하고 final report를 갱신한다.
- boundary:
  - primary write target: `packages/ui/src/components/windows/internal/windowFrame/**`
  - primary write target: `packages/ui/src/components/windows/folder/**`
  - primary write target: `packages/ui/src/components/windows/browser/**`
  - primary write target: `packages/ui/src/components/windows/storybook/**`
  - primary write target: `plans/windows-ui-folder-browser-live-ui-parity/visual-compare/`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-ui-parity/reference-captures/baseline-inventory.md`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-ui-parity/visual-compare/report.md`
- input:
  - 시나리오: Phase 3 compare report가 canonical 4-state 중 일부에 blocking structural drift를 남긴 경우
  - exact fix target source:
    - exact `kind/state` key
    - exact blocker category
    - baseline/current/diff artifact pair
  - exact close rule:
    - Folder는 shell/sidebar/item grammar blocker만 닫는다.
    - Browser는 shell/chrome blocker만 닫는다.
    - documentary-only drift는 final blocker 근거가 아니다.
    - reserved marker key conflict는 계속 strip 또는 package-wins spread order로 닫힌다.
- output:
  - 공개 계약:
    - final report는 canonical 4-state 모두를 pass 또는 explicit blocker로 닫는다.
    - `Folder` public contract는 Phase 2 output과 같은 prop names와 winner rule을 유지한다.
    - `Browser` public contract는 여전히 `children` body contract만 가진다.
    - reserved compare marker는 여전히 package-owned contract이며 conflicting consumer host attr보다 항상 우선한다.
  - 파생 기본값:
    - same compare script, same stage marker, same key naming, same scope rule을 rerun compare에서도 그대로 사용한다.
    - structural blocker가 모두 닫히고 documentary drift만 남으면 pass로 종료한다.
  - 중요 negative output:
    - blocker를 줄이기 위해 current public API를 다시 설계하지 않는다.
    - Browser article body를 package-owned UI로 승격하지 않는다.
    - exact sample-content parity를 새 implementation scope로 올리지 않는다.
    - taskbar/desktop shell을 final compare inventory에 넣지 않는다.
    - reserved marker key를 consumer override surface로 다시 열지 않는다.
- 선행조건:
  - Phase 3 report가 exact mismatch key와 category를 남겨야 한다.
- 제약:
  - fix는 Phase 2 contract language를 다시 열지 않는 범위에서만 진행한다.
  - final compare는 같은 4-state inventory와 같은 scope rule을 그대로 사용한다.
  - marker ownership wording은 Phase 2의 strip 또는 package-wins spread order rule을 그대로 유지해야 한다.
- side effects:
  - final report가 implementation handoff와 `plan-materialize`의 acceptance evidence가 된다.
  - blocker가 남으면 out-of-scope가 아니라 exact structural reason을 가진 explicit blocker로 남는다.
- failure/validation:
  - blocker를 닫으려면 current prop surface를 재설계해야 한다면 blocker다.
  - Browser shell parity를 닫으려면 `children` 외에 새 public body API가 필요해지면 blocker다.
  - final report가 documentary drift를 다시 blocker로 올리면 Phase 1 scope contract가 깨진 것이므로 blocker다.
  - fix phase가 reserved marker key ownership을 다시 흐리거나 consumer override를 허용하면 compare contract가 깨지므로 blocker다.
- 검증
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx`가 수정 후에도 성공한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 수정 후에도 성공한다.
  - [ ] final `visual-compare/report.md`가 canonical 4-state 모두를 pass 또는 explicit blocker로 exact key 단위에서 기록한다.
  - [ ] final report 어디에도 Browser body content나 exact sample-content parity가 blocking closure 근거로 적히지 않는다.
  - [ ] final handoff를 읽으면 reserved marker key가 consumer pass-through에 의해 바뀌지 않고 package-owned marker가 계속 winner라는 점을 다시 추측할 필요가 없다.
