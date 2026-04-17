# Phase 2. 윈도우 셸과 공개 surface 고정

> 이 문서는 `WindowFrame`, `Folder`, `Browser`, windows Storybook source를 같은 structural parity contract로 정렬하는 실행용 상세 계약이다.
> 공개 API를 다시 열지 않고 live shell과 live folder grammar를 package-owned boundary 안에서 닫는 것이 목적이다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | thinner `WindowFrame`, live-like `Folder`, shell-only `Browser`, exact compare recipient를 같은 package contract로 고정한다. |
| 선행조건 | Phase 1의 canonical 4-state baseline과 blocking/documentary scope가 고정돼 있어야 한다. |
| 완료 판단 | `packages/ui/src/components/windows/**`와 source-tree positive signal만 읽어도 공개 API를 바꾸지 않은 채 live parity boundary를 설명할 수 있다. |
| 중단 조건 | live parity를 맞추려면 current public prop 이름을 대폭 갈아엎거나 `Browser` body를 package-owned article layout으로 승격해야 한다는 결론이 나오면 이 phase는 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 합의 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 조정 | `WindowFrame`는 internal-only다. thinner/simpler chrome, shell marker, shell/body boundary만 소유하고 leaf-specific API는 열지 않는다. | compare가 읽을 stable shell marker와 live-like chrome geometry가 same file 안에 고정된다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 조정 | current `sidebarItems`/`activeSidebarId`/`expandedSidebarIds`/`entries`/callback contract를 가능한 한 유지한다. | current public prop surface 위에서 live folder sidebar/item grammar가 읽히고 card-style blog grid는 retire된다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 조정 | `Browser` body contract는 계속 `children`만 사용한다. Browser는 shell parity만 소유한다. | `variant`, slug, not-found prop, package-owned article layout 없이 thinner shell만 정렬된다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 조정 | fixture는 structural parity를 설명하는 owner source여야 하며 exact sample-content parity를 새 acceptance로 열면 안 된다. | same public prop names와 same canonical 4-state를 설명하는 fixture source가 된다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 조정 | compare story ID 4개는 exact key와 계속 1:1로 대응해야 한다. review story가 있더라도 compare inventory를 다시 열지 않는다. | Phase 3 capture script가 exact story recipient를 literal하게 읽을 수 있다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`, `packages/ui/src/components/windows/storybook/compareWindowStage.tsx`, `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 조정 | canonical host canvas와 positive signal은 same shell/canvas contract를 읽어야 한다. | compare phase가 exact canvas와 exact recipient를 추측 없이 사용할 수 있다. |
| `packages/ui/src/components/windows/storybook/assets/**` | 조정 | repo-local asset는 structure와 ratio를 설명하는 용도만 가진다. content parity를 새 blocker로 만들지 않는다. | live folder item density와 preview ratio를 설명하는 asset contract가 stable하게 남는다. |

### 완료 증거

- `WindowFrame`가 thinner/simpler shell과 stable shell marker를 internal-only로 소유한다.
- `Folder` source가 current public prop 이름을 유지한 채 live folder sidebar/item grammar를 렌더링한다.
- `Browser` source가 `children` body contract를 그대로 유지한 채 shell parity만 package-owned로 닫는다.
- compare story ID 4개와 inventory positive signal이 same state key를 계속 사용한다.
- reserved compare marker key는 public override surface가 아니고 package-owned marker가 항상 winner라는 rule이 source contract에 그대로 남는다.

## 실행 계약

- owner_agent: `frontend-developer`
- 목적:
  - current public surface를 최대한 유지하면서 package-owned shell과 leaf render grammar를 live structural parity에 맞게 다시 정렬한다.
- 작업:
  1. `WindowFrame`를 thinner/simpler shell로 조정하고 compare가 literal하게 읽을 shell marker를 추가한다.
  2. `Folder`를 current controlled prop names 위에서 live-like sidebar/item grammar로 재구성한다.
  3. `Browser`는 `children` boundary를 유지한 채 shell만 same frame contract로 정렬한다.
  4. fixtures, stories, stages, inventory signal을 exact canonical 4-state와 same capture canvas contract로 맞춘다.
- boundary:
  - primary write target: `packages/ui/src/components/windows/internal/windowFrame/index.tsx`
  - primary write target: `packages/ui/src/components/windows/folder/index.tsx`
  - primary write target: `packages/ui/src/components/windows/browser/index.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts`
  - primary write target: `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx`
  - primary write target: `packages/ui/src/components/windows/folder/folder.stories.tsx`
  - primary write target: `packages/ui/src/components/windows/browser/browser.stories.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/compareWindowStage.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`
  - primary write target: `packages/ui/src/components/windows/storybook/assets/`
  - read-only anchor: `packages/ui/src/index.ts`
  - read-only prerequisite: `plans/windows-ui-folder-browser-live-ui-parity/reference-captures/baseline-inventory.md`
- input:
  - 시나리오: consumer가 current `@windows/ui` entrypoint에서 `Folder`와 `Browser`를 계속 가져오되, package window surface가 live structural grammar를 더 가깝게 소유해야 하는 경우
  - current public Folder inputs:
    - required: `title`, `addressLabel`, `sidebarItems`, `entries`
    - optional: `icon`, `activeSidebarId`, `expandedSidebarIds`, `onSidebarSelect`, `onSidebarToggle`, `onEntryOpen`, native `div` pass-through (reserved marker key 제외)
  - Folder winner rules:
    - `activeSidebarId` exact match가 있을 때만 selected row가 된다.
    - `activeSidebarId`가 없거나 match가 없으면 no-selection이다.
    - `expandedSidebarIds`는 expandable root row id 집합만 받는다.
    - `expandedSidebarIds`가 없거나 빈 배열이면 expanded root는 없다.
    - `entries.thumbnailSrc`가 preview winner field다.
    - entry interaction은 `onEntryOpen(id)`만 소유한다.
  - current public Browser inputs:
    - required: `title`, `addressLabel`, `children`
    - optional: `icon`, native `div` pass-through (reserved marker key 제외)
  - reserved marker ownership:
    - reserved package-owned frame marker key:
      - `data-window-frame-root`
      - `data-window-frame-chrome`
      - `data-window-frame-body`
    - reserved package-owned compare-stage marker key:
      - `data-window-compare-stage`
    - consumer host attrs may add unrelated native attrs and unrelated `data-*`, but reserved marker key는 public override surface가 아니다.
    - implementation winner rule:
      - conflicting reserved marker key는 `...rest` forwarding 전에 strip하거나
      - reserved marker를 spread 뒤에 써서 canonical package-owned value가 항상 최종 DOM에 남아야 한다.
  - exact compare recipient contract:
    - `windows-folder--compare-desktop-blog`
    - `windows-folder--compare-mobile-blog`
    - `windows-browser--compare-desktop-article`
    - `windows-browser--compare-mobile-article`
- output:
  - 공개 계약:
    - `WindowFrame`는 thinner/simpler live-like chrome을 internal-only shared shell로 소유한다.
    - `WindowFrame`는 exact internal marker를 가진다:
      - `[data-window-frame-root]`
      - `[data-window-frame-chrome]`
      - `[data-window-frame-body]`
    - `compareWindowStage`는 exact host canvas marker를 가진다:
      - `[data-window-compare-stage="desktop"]`
      - `[data-window-compare-stage="mobile"]`
    - `Folder`는 current public prop names를 가능한 한 유지한 채 desktop tree sidebar + compact item grammar + mobile collapsed sidebar policy를 소유한다.
    - `Browser`는 current `children` body contract를 유지한 채 same shell을 소비한다.
    - compare story recipient는 exact 4-state inventory만 canonical compare surface로 유지한다.
    - reserved marker ownership은 package-owned compare contract다. conflicting consumer host attr가 들어와도 canonical marker value가 최종 DOM winner다.
  - 파생 기본값:
    - `Folder` item presentation은 exact blog card/sample content가 아니라 preview ratio, label hierarchy, item density를 우선하는 explorer-style grammar로 간다.
    - `Browser`는 article body 내용과 layout을 `children` 쪽에 남기고 shell/body boundary만 package-owned로 유지한다.
  - 중요 negative output:
    - public `WindowFrame` export를 추가하지 않는다.
    - `LiveFolder`, `LiveBrowser`, separate live story family를 만들지 않는다.
    - `Browser`에 `variant`, slug, not-found prop, article data prop을 추가하지 않는다.
    - taskbar나 desktop background를 component contract 안으로 다시 들이지 않는다.
    - current prop names를 대체하는 rename-first redesign을 기본 경로로 택하지 않는다.
    - consumer가 `data-window-frame-root`, `data-window-frame-chrome`, `data-window-frame-body`, `data-window-compare-stage`를 pass-through로 덮어쓰게 열지 않는다.
- 선행조건:
  - Phase 1 baseline inventory가 exact 4-state와 blocking/documentary scope를 고정해 두어야 한다.
- 제약:
  - `packages/ui/src/index.ts`의 public root surface는 read-only anchor로 취급하고 `Folder`, `Browser` export identity를 흐리지 않는다.
  - compare story ID 4개와 state key naming은 later compare script가 그대로 읽을 수 있게 유지한다.
  - `Folder`와 `Browser`는 계속 server-safe entrypoint에서 import 가능한 surface여야 한다.
  - reserved marker key conflict는 strip 또는 package-wins spread order 중 하나로 literal하게 닫혀야 하며 later implementation이 임의로 정하면 안 된다.
- side effects:
  - Phase 3 capture script가 exact story recipient와 exact stage marker를 literal하게 사용할 수 있다.
  - `plan-materialize`가 current prop surface와 compare boundary를 추측 없이 bounded-surface coverage로 내릴 수 있다.
- failure/validation:
  - live folder grammar를 맞추려면 current `sidebarItems`/`entries` surface 자체를 다시 설계해야 한다면 blocker다.
  - browser shell parity를 맞추려면 `children` 밖에 package-owned article layout prop을 열어야 한다면 blocker다.
  - compare stage와 inventory signal이 exact 4-state key를 보장하지 못하면 Phase 3 handoff가 불 literal해지므로 blocker다.
  - reserved marker key를 consumer pass-through가 덮어쓸 수 있게 남기면 compare owner surface가 public attr와 경쟁하게 되므로 blocker다.
- 검증
  - [ ] `pnpm --filter @windows/ui exec vitest run src/components/windows/storybook/windowCompareInventory.test.tsx`가 성공한다.
  - [ ] `pnpm --filter @windows/ui build-storybook`가 성공한다.
  - [ ] `packages/ui/src/index.ts`는 `Folder`, `Browser` 공개 surface를 그대로 유지하고 `WindowFrame`를 export하지 않는다.
  - [ ] `Folder`와 `Browser` source를 읽으면 Phase 1에서 고정한 structural parity scope를 넘어서는 새 public API가 생기지 않았음을 설명할 수 있다.
  - [ ] `Folder`/`Browser`/`WindowFrame` contract를 읽으면 reserved marker key conflict가 strip 또는 package-wins spread order로 닫히고 consumer override surface가 아님을 설명할 수 있다.
