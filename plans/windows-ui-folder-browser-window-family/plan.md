**Branch:** feat/windows-ui-folder-browser-window-family

> Worktree dir: `worktrees/windows-ui-folder-browser-window-family` (plan 폴더명과 동일)
> 이 문서는 `packages/ui`에 새 `Folder` / `Browser` window family를 추가하기 위한 실행형 계획서다.
> 먼저 `사전 합의`와 `전체 작업 지도`에서 고정된 계약과 흐름을 확인하고, 각 phase 카드에서 어떤 파일이 어떻게 바뀌는지와 무엇이 phase 종료 신호인지 본다.

# Windows UI Folder/Browser window family 실행 계획

## 사전 합의

| 항목 | 합의 내용 | 적용 phase | 메모 |
| --- | --- | --- | --- |
| 컴포넌트 범위 | `Folder`와 `Browser`는 window 컴포넌트만 책임지고, taskbar와 바깥 desktop background는 포함하지 않는다. | 전체 | page/layout이 `Taskbar`와 조합한다. |
| 공용 foundation | 두 컴포넌트는 내부 전용 `WindowFrame`을 공유하되 package root에서 `WindowFrame`를 공개하지 않는다. | Phase 1 / Phase 2 / Phase 5 | internal-only boundary를 유지한다. |
| public naming | 공통 chrome label은 URL 전용 이름 대신 `addressLabel` 계열의 중립 naming을 쓴다. | Phase 1 / Phase 2 | route 의미를 public API에 새지 않게 한다. |
| Folder body owner | `Folder`는 data-driven body를 직접 렌더링하고, `items` media field는 `imageSrc`로 고정한다. | Phase 1 / Phase 3 | `children` 기반 본문으로 다시 열지 않는다. |
| Browser body owner | `Browser`는 slot-driven body만 소유하고 article/404 차이는 `children`에서 처리한다. | Phase 2 / Phase 3 | `variant`, route props, 404 전용 public API는 v1 범위 밖이다. |
| chrome configurability | title, icon, address label, fixed window control affordance는 공통 frame이 소유하고, header/chrome은 highly configurable surface로 열지 않는다. | Phase 1 / Phase 2 | 최소화/최대화/닫기 affordance는 visual-only다. |
| responsive policy | 높이는 viewport 기반이고 스크롤은 content-only다. `Folder` sidebar는 모바일에서 접히고 `Browser` chrome은 모바일에서도 유지한다. | Phase 1 / Phase 2 / Phase 3 | desktop용 별도 component를 만들지 않는다. |
| UI-only boundary | route-aware props, taskbar integration, drag/resize, open/close/minimize state orchestration은 이번 계획 범위 밖이다. | 전체 | future interactive layer concern을 섞지 않는다. |
| server-safe entry | `packages/ui/src/index.ts`의 server-safe entrypoint 계약을 유지하고 Next.js 전용 API를 새로 넣지 않는다. | Phase 2 / Phase 5 | public component는 pure props 기반이어야 한다. |
| story taxonomy | canonical state는 `Folder` 2개, `Browser` 4개로 고정하고 supporting reference는 별도로 분류한다. | Phase 3 / Phase 4 / Phase 5 | supporting capture가 canonical inventory를 늘리면 안 된다. |
| visual acceptance | external reference는 `https://seojaewan.com/blog`, `https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`, 고정된 missing slug 404 route를 기준으로 repo-local compare artifact로 닫는다. | Phase 4 / Phase 5 | live site direction을 repo-local evidence로 번역한다. |
| integration scope | 이번 계획은 `packages/ui` source, storybook, compare artifact까지만 다루고 기존 consumer app integration은 따로 잡지 않는다. | 전체 | 기존 UI contact point 특수 처리 없음 |

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. WindowFrame과 Folder 계약 정리 | 내부 shared `WindowFrame`과 data-driven `Folder` canonical surface를 만든다. | `Folder`의 public input, sidebar/mobile collapse, fixed chrome, `imageSrc` item rule이 package source에서 먼저 닫힌다. | Browser가 그대로 재사용할 internal frame contract와 Folder canonical story/fixture source |
| Phase 2. Browser 계약과 공개 wiring 정리 | slot-driven `Browser`와 package root export를 마무리한다. | `Folder`와 `Browser`가 같은 server-safe entry에서 import 가능하고, `Browser`는 route-agnostic `children` slot contract로 닫힌다. | 둘 다 같은 story/compare topology에 태울 수 있는 public surface와 root wiring |
| Phase 3. Story/compare inventory 동결 | desktop/mobile canonical state와 compare inventory를 `Folder` 2개, `Browser` 4개로 고정한다. | story taxonomy와 machine-capture key가 package source에서 하나로 잠기고 supporting reference의 역할이 분리된다. | visual compare가 그대로 쓸 수 있는 exact `kind/state` inventory와 stage helper |
| Phase 4. reference 기반 visual compare 보고 | external live reference와 local story compare surface를 짝지어 capture/diff/report를 남긴다. | 어떤 canonical state가 reference와 맞고 어긋나는지 repo-local artifact로 읽을 수 있다. | mismatch key 목록 또는 전부 pass한 compare evidence |
| Phase 5. visual drift closure | compare report가 지적한 drift만 source tree에서 닫고 같은 inventory를 다시 통과시킨다. | `Folder` / `Browser` family가 fixed public contract와 frozen visual inventory 양쪽에서 함께 닫힌다. | implementation handoff와 이후 `plan-materialize`가 그대로 사용할 최종 contract/evidence |

## 단계별 실행

### Phase 1. WindowFrame과 Folder 계약 정리

- 목적: internal-only `WindowFrame`과 `Folder` public surface를 먼저 닫아 shared foundation과 첫 leaf contract를 같은 package boundary 안에서 고정한다.
- 변경 내용: `WindowFrame`는 title, optional icon, `addressLabel`, fixed window control affordance를 소유하는 internal shared foundation이 된다. `Folder`는 sidebar desktop/mobile collapse, data-driven items grid, viewport-height/content-scroll policy를 가진 public leaf가 되고, `items`는 `id`, `label`, `imageSrc` 중심 contract로 잠근다. `viewMode`, route props, taskbar/background, drag/resize state는 이 단계에서 열지 않는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 추가 | `Folder`와 `Browser`가 공유할 fixed chrome foundation과 internal-only owner boundary가 생긴다. | title/icon/address label/window control affordance가 이 파일에 모이고 public export로 새지 않는다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 추가 | `Folder`가 data-driven body, desktop sidebar, mobile collapse policy를 가진 canonical public component가 된다. | `items.imageSrc`, content-only scroll, viewport-based height, route-agnostic props가 source에 드러난다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts` | 추가 | `Folder` canonical state와 sample data source가 한 곳에 고정된다. | desktop default와 mobile collapsed 기준 data가 같은 파일에서 읽힌다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx` | 추가 | 사람 검토용 desktop/mobile window backdrop stage가 생긴다. | component 바깥 desktop background는 story-only decoration으로 분리돼 있다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx` | 추가 | `Folder` standalone story owner가 생긴다. | `Folder` contract를 설명하는 canonical stories가 route semantics 없이 열린다. |

- 이전 상태: `packages/ui`에는 taskbar/panel family만 있고, reusable window family와 shared window frame, folder-style data contract가 없다.
- 이후 상태: `Folder`는 internal `WindowFrame`를 literal하게 소비하는 첫 leaf가 되고, shared foundation과 leaf contract 경계가 package source에서 읽힌다.
- 완료 조건: source와 story만 읽어도 `Folder`가 window-only component라는 점, `WindowFrame`가 internal-only라는 점, `items.imageSrc` naming과 sidebar/mobile collapse policy가 고정돼 있어야 한다.
- 관련 영역: `packages/ui/src/components/common/iconImage/index.tsx`, `packages/ui/src/components/panels/shared/panelSurface/index.tsx`, `packages/ui/src/components/panels/windows/windowsPanel/index.tsx`
- 시작 조건: `none`
- 상세: `./phases/01-window-frame-folder-contract.md`

### Phase 2. Browser 계약과 공개 wiring 정리

- 목적: shared foundation 위에 `Browser`를 올리고, `Folder` / `Browser`를 server-safe root entry에 연결한다.
- 변경 내용: `Browser`는 same `WindowFrame` 위에서 title, optional icon, `addressLabel`, `children`만 public surface로 갖는 slot-driven window가 된다. article/404 차이는 story fixture child content에서만 표현하고, public API에는 `variant`, route props, sidebar, window-control toggles를 추가하지 않는다. root entry는 `Folder`와 `Browser`만 새로 공개하고 internal frame은 숨긴다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/browser/index.tsx` | 추가 | `Browser`가 fixed chrome + slot body를 가진 canonical public component가 된다. | mobile에서도 chrome이 유지되고, article/404가 `children`으로만 닫힌다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 추가 | article/not-found desktop/mobile child composition source가 한 곳에 정리된다. | Browser canonical states를 만드는 child fragments가 fixture source에 고정된다. |
| `packages/ui/src/components/windows/browser/browser.stories.tsx` | 추가 | `Browser` standalone story owner가 생긴다. | article/not-found canonical stories가 component props 대신 `children` composition으로 설명된다. |
| `packages/ui/src/index.ts` | 추가 | `Folder`와 `Browser`가 server-safe entrypoint에서 import 가능해진다. | public root entry에 `WindowFrame` 없이 `Folder`, `Browser`만 노출된다. |

- 이전 상태: `Folder`만 package-local leaf로 존재하고, browser-style window와 root export wiring은 없다.
- 이후 상태: consumer는 `@windows/ui` root entry에서 `Folder` / `Browser`를 바로 가져올 수 있고, 둘 다 internal `WindowFrame` contract를 공유한다.
- 완료 조건: `packages/ui/src/index.ts`와 각 story source를 읽었을 때 `Folder`, `Browser`가 singular public surface를 가지며 `WindowFrame` 또는 route-specific API가 새지 않는다는 점이 분명해야 한다.
- 관련 영역: `packages/ui/src/index.ts`, `packages/ui/package.json`
- 시작 조건: Phase 1의 `WindowFrame` internal contract와 `Folder` canonical contract가 stable해야 한다.
- 상세: `./phases/02-browser-contract-and-public-wiring.md`

### Phase 3. Story/compare inventory 동결

- 목적: canonical story taxonomy와 machine-capture inventory를 exact state key로 고정해 external visual compare와 later materialize가 같은 surface를 보게 한다.
- 변경 내용: `Folder` canonical inventory는 `desktop-default`, `mobile-collapsed` 두 state로 잠근다. `Browser` canonical inventory는 `desktop-article`, `desktop-not-found`, `mobile-article`, `mobile-not-found` 네 state로 잠근다. compare helper와 `CompareRoot` kind inventory는 `folder`, `browser`를 새로 인식하고, supporting reference는 density/scroll/long-copy 보조 증거로만 분류해 canonical inventory를 다시 열지 않는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 추가 | desktop/mobile window compare wrapper가 생긴다. | compare capture가 viewport별 width/height policy를 일정하게 갖는다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 정리 | `folder`, `browser` compare kind를 기존 machine surface inventory에 추가한다. | `[data-visual-kind]`가 새 window family를 stable key로 읽는다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts` | 정리 | canonical 2 state와 supporting reference의 역할이 분리된다. | supporting sample이 canonical state 수를 늘리지 않는다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 정리 | canonical 4 state와 supporting reference가 분리된다. | article/not-found desktop/mobile 외의 sample이 canonical inventory에 들어가지 않는다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx` | 정리 | `Folder` canonical story와 compare story가 같은 state key를 공유한다. | story title과 compare state가 `desktop-default`, `mobile-collapsed`로 고정된다. |
| `packages/ui/src/components/windows/browser/browser.stories.tsx` | 정리 | `Browser` canonical story와 compare story가 같은 state key를 공유한다. | story title과 compare state가 `desktop-article`, `desktop-not-found`, `mobile-article`, `mobile-not-found`로 고정된다. |

- 이전 상태: component stories는 있어도 compare inventory와 canonical state count, supporting reference 분류가 package source에서 고정되지 않았다.
- 이후 상태: `Folder` 2개 + `Browser` 4개 canonical inventory가 compare stage, story titles, fixture source에서 같은 naming으로 닫힌다.
- 완료 조건: fixture source와 story source만 읽어도 canonical state 수, exact state key, supporting reference boundary가 분명해야 하고, `CompareRoot`가 `folder` / `browser` kind를 안정적으로 받는다는 점이 보여야 한다.
- 관련 영역: `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`, `plans/windows-ui-folder-browser-window-family/reference-captures/`
- 시작 조건: Phase 2의 public component contract와 root wiring이 stable해야 한다.
- 상세: `./phases/03-story-compare-inventory-freeze.md`

### Phase 4. reference 기반 visual compare 보고

- 목적: external live reference를 package-owned compare inventory와 짝지어 repo-local capture/diff/report로 남긴다.
- 변경 내용: `visual-comparator`가 `folder/desktop-default`, `folder/mobile-collapsed`, `browser/desktop-article`, `browser/desktop-not-found`, `browser/mobile-article`, `browser/mobile-not-found` 여섯 state를 exact acceptance inventory로 사용한다. reference side는 `/blog`, article route, 고정 missing slug 404 route의 desktop/mobile capture를 남기고, current side는 package compare story capture와 diff report를 plan folder 아래에 저장한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-window-family/reference-captures/` | 추가/정리 | external reference side capture가 canonical 6 state와 1:1로 남는다. | 각 state key가 어떤 live route/viewport를 의미하는지 artifact 이름이나 report에서 읽힌다. |
| `plans/windows-ui-folder-browser-window-family/visual-compare/` | 추가/정리 | current capture, diff artifact, 판정 report가 같은 state key로 정리된다. | canonical 6 state 각각의 reference/current/diff/report 연결이 남는다. |

- 이전 상태: `Folder` / `Browser` family에 대한 reference compare evidence가 live site 안에만 있고 repo-local artifact가 없다.
- 이후 상태: review와 Phase 5 fix는 subjective direction이 아니라 `kind/state -> capture -> diff -> 판정` 경로로 바로 확인할 수 있다.
- 완료 조건: report에 canonical 6 state가 모두 등장하고, mismatch가 있으면 exact state key와 drift summary가 artifact pair와 함께 남아야 한다.
- 관련 영역: `https://seojaewan.com/blog`, `https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`, `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx`
- 시작 조건: Phase 3의 compare inventory와 story owner가 stable해야 한다.
- 상세: `./phases/04-reference-compare-report.md`

### Phase 5. visual drift closure

- 목적: compare report가 남긴 drift만 source tree에서 닫고 같은 inventory를 다시 통과시킨다.
- 변경 내용: Phase 4 report가 지적한 chrome spacing, sidebar collapse spacing, content density, mobile toolbar 유지, article/not-found child frame alignment 같은 visual drift만 수정한다. 이 phase는 public API와 canonical inventory를 다시 열지 않고, internal `WindowFrame` / `Folder` / `Browser` / storybook helper 범위 안에서 same state keys를 pass시키는 closure만 담당한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/**` | 조정 | shared chrome drift를 report 기준으로 줄인다. | `WindowFrame`의 fixed affordance와 internal-only boundary는 유지한 채 mismatch만 줄어든다. |
| `packages/ui/src/components/windows/folder/**` | 조정 | `Folder` desktop/mobile visual drift를 정리한다. | canonical 2 state가 rerun compare에서 pass 또는 no-op로 닫힌다. |
| `packages/ui/src/components/windows/browser/**` | 조정 | `Browser` desktop/mobile visual drift를 정리한다. | canonical 4 state가 rerun compare에서 pass 또는 no-op로 닫힌다. |
| `packages/ui/src/components/windows/storybook/**` | 조정 | compare stage 또는 fixture drift가 있으면 최소 범위에서 바로잡는다. | canonical state key와 supporting reference 분류가 유지된다. |
| `packages/ui/src/components/taskbar/storybook/compareRoot.tsx` | 조정 | compare kind/state recipient drift가 있으면 최소 범위에서 수리한다. | rerun compare가 같은 `folder` / `browser` inventory key를 계속 찾는다. |
| `plans/windows-ui-folder-browser-window-family/visual-compare/` | 갱신 | final report가 closure 결과를 남긴다. | final report가 canonical 6 state에 대해 pass 또는 no-op closure를 명시한다. |

- 이전 상태: compare report가 존재하지만 일부 canonical state가 live reference와 어긋날 수 있다.
- 이후 상태: 같은 compare inventory를 다시 돌렸을 때 pass 또는 수정 불필요 no-op가 final report에 남는다.
- 완료 조건: final report가 canonical 6 state를 모두 pass로 닫거나, 수정 불필요 no-op를 exact state key와 함께 남겨야 한다.
- 관련 영역: Phase 1~4 write target 전체
- 시작 조건: Phase 4의 compare report가 exact mismatch key를 남겨야 한다.
- 상세: `./phases/05-visual-fix-closure.md`
