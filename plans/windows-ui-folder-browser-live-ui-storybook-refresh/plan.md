**Branch:** feat/windows-ui-folder-browser-live-ui-storybook-refresh

> Worktree dir: `worktrees/windows-ui-folder-browser-live-ui-storybook-refresh`

| # | Phase | Agent |
| --- | --- | --- |
| 1 | `./phases/01-window-foundation-and-storybook-ownership-lock.md` | `frontend-developer` |
| 2 | `./phases/02-folder-live-card-and-search-contract.md` | `frontend-developer` |
| 3 | `./phases/03-browser-chrome-and-address-contract.md` | `frontend-developer` |
| 4 | `./phases/04-live-compare-report.md` | `visual-comparator` |
| 5 | `./phases/05-drift-closure-and-storybook-polish.md` | `frontend-developer` |

## 사전 합의

### 요청 추적

| 사용자 요청 | 이번 계획에서 고정하는 해석 | 범위와 제약 |
| --- | --- | --- |
| 기존 계획이 아닌 새로운 계획을 만든다. | 이전 `windows-ui-folder-browser-*` 계획은 참고만 하고, 이번 slug 기준의 새 실행 계획으로 닫는다. | 과거 계획의 문구나 단계 토폴로지를 그대로 재사용하지 않는다. |
| 범위는 `packages/ui/src/components/windows/**` 안에서 닫는다. | 제품 코드와 windows storybook 정리는 해당 트리 안에서 끝낸다. | 시각 비교 산출물은 계획 폴더에 둘 수 있지만, 제품 수정은 windows 패키지 안에서만 수행한다. |
| windows UI와 storybook을 같이 업데이트한다. | 컴포넌트 수정과 story/fixture/inventory 정리를 같은 단계에서 묶는다. | storybook만 따로 맞추거나 UI만 따로 바꾸는 단계로 분리하지 않는다. |
| live와 더 같아지는 방향으로 `Folder` / `Browser` / `WindowFrame`을 다시 잡는다. | 공통 shell은 `WindowFrame`이 소유하고, live 기준과 가까운 chrome과 카드 surface를 compare inventory로 고정한다. | 실제 런타임 동작까지 맞추는 대신 시각적 shell parity와 UI 계약을 우선한다. |
| Browser는 windows frame/chrome만 parity 대상으로 보고, 내부 content는 계속 `children`으로 받는다. | Browser 본문은 계속 host가 넣는 `children` slot이고, parity 범위는 titlebar/tab/toolbar/address chrome까지다. | body content를 component public contract로 제어하지 않는다. |
| Folder는 live처럼 thumbnail + title 정도가 보이는 카드 surface를 기준으로 본다. | Folder의 canonical visible surface는 `thumbnailSrc + title`이다. | `metaLabel`/`summary`는 보조 정보로만 취급하고 parity 승자는 아니다. |
| taskbar 등 다른 영역의 storybook 형식과 맞는 방향으로 windows storybook 구조를 정리한다. | `Windows/Compose/*` story taxonomy와 compare/review 구조를 사람 읽기 쉬운 형태로 정리한다. | helper 소유권은 windows 내부에 두고 taskbar helper를 기본 구조로 삼지 않는다. |
| search/address open UI는 prop으로 받아서 제어되는 방향이다. 사용자의 입력 등도 prop/callback에 반영되는 UI surface여야 한다. | Folder와 Browser 모두 open/value UI를 prop + callback surface로 드러낸다. | 내부 DOM click harness나 `useEffect` 기반 story 제어를 계약으로 남기지 않는다. |
| windows compare/helper는 windows 내부에 둔다. taskbar storybook helper 의존을 기본 구조로 두지 않는다. | compare/review helper와 marker owner를 `packages/ui/src/components/windows/storybook/**` 안으로 고정한다. | taskbar helper import가 남아 있으면 계획 완료로 보지 않는다. |
| mobile도 가능하면 같이 맞춘다. | Folder mobile card와 Browser mobile chrome을 canonical compare inventory에 포함한다. | mobile open-state까지 강제하지 않고, 닫힌 기준 surface부터 맞춘다. |

### 공개 surface 합의

| 대상 | 공개 surface / 계약 | 호환성 방침 |
| --- | --- | --- |
| `WindowFrame` | 공통 shell owner로서 chrome/body 구획과 compare marker strip를 가진다. | internal-only를 유지하고 package root export로 승격하지 않는다. |
| `Folder` | 기존 prop은 유지하고 `searchPanelOpen?`, `onSearchPanelOpenChange?`, `searchValue?`, `searchPlaceholder?`, `onSearchValueChange?`를 additive하게 추가한다. | 기존 호출부를 깨지 않는 additive surface만 허용한다. |
| `Browser` | 기존 prop은 유지하고 `addressDropdownOpen?`, `onAddressDropdownOpenChange?`, `addressValue?`, `onAddressValueChange?`를 additive하게 추가한다. `addressLabel`은 `addressValue`가 없을 때만 fallback으로 쓴다. | body는 계속 `children` slot이고, navigation/route contract는 추가하지 않는다. |
| windows storybook | compare/review/helper를 windows 내부가 소유하고 `Windows/Compose/Folder`, `Windows/Compose/Browser` story title을 기준으로 정리한다. | taskbar storybook helper 의존을 기본 구조로 남기지 않는다. |
| Folder chip / Browser dropdown selection | chip 선택과 dropdown 선택은 UI surface만 보여주고 실제 filtering/navigation은 하지 않는다. | 실제 데이터 변형과 실제 URL 이동은 제외 범위로 유지한다. |

### 제외 항목

| 제외 항목 | 이번 계획에서 제외하는 이유 | 승인 상태 |
| --- | --- | --- |
| 실제 URL 이동 | Browser parity 범위는 chrome UI까지만 고정되기 때문이다. | 고정 |
| 실제 파일/폴더 열기 | Folder는 카드 surface와 search UI까지만 다룬다. | 고정 |
| 더블클릭의 앱 의미 | 앱 실행 의미는 window manager 범위다. | 고정 |
| window resize / drag / minimize / maximize | 이번 계획은 static/live-like shell 정렬과 storybook 정리에 집중한다. | 고정 |
| session/window manager 연결 | UI component 계약만 다루고 런타임 orchestration은 건드리지 않는다. | 고정 |
| `interactive/windows/*` 신규 상태 관리자 도입 | state manager를 새로 도입하지 않고 additive prop/callback으로 닫는다. | 고정 |
| chip 선택에 따른 실제 filtering | chip은 selectable UI surface만 유지하고 데이터 filtering은 제외한다. | 고정 |

## 전체 작업 지도

### 작업 묶음

| 작업 묶음 | 바뀌는 경계 | 이번 계획의 결과물 | 검증 기준 |
| --- | --- | --- | --- |
| `WindowFrame` + windows storybook 기반 정리 | `packages/ui/src/components/windows/internal/windowFrame/index.tsx`, `packages/ui/src/components/windows/storybook/**`, folder/browser story meta | windows 내부 compare/helper ownership, `Windows/Compose/*` taxonomy, compare marker contract | windows inventory tests, storybook build, windows 내부 taskbar helper import 제거 |
| Folder live 카드 + search UI 계약 | `packages/ui/src/components/windows/folder/**`, `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts`, windows inventory tests | thumbnail + title 중심 카드, controlled search open/value surface, mobile card compare state | compare/review story inventory와 storybook build |
| Browser chrome + address UI 계약 | `packages/ui/src/components/windows/browser/**`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx`, windows inventory tests | `children` body boundary 유지, controlled address open/value surface, mobile chrome compare state | compare/review story inventory와 storybook build |
| live 기준 시각 비교 증거 | `plans/windows-ui-folder-browser-live-ui-storybook-refresh/**` 안의 baseline inventory, capture script, diff report | state key별 reference/current/diff 증거와 mismatch 분류 | compare report와 artifact set |
| drift 정리 + 최종 polish | `packages/ui/src/components/windows/**`, windows inventory tests, plan-local visual compare rerun | windows 범위 안에서 최종 drift 수정과 storybook 정리 마감 | compare 재실행, windows inventory tests, storybook build |

### canonical compare / review inventory

| 종류 | 고정 식별자 | 역할 | 비고 |
| --- | --- | --- | --- |
| compare state | `folder/desktop-card`, `folder/desktop-search-open`, `folder/mobile-card`, `browser/desktop-chrome`, `browser/desktop-address-open`, `browser/mobile-chrome` | live 기준 current/reference/diff를 1:1로 비교하는 state key | mobile은 닫힌 기준 surface를 canonical로 둔다. |
| compare story ID | `windows-compose-folder--compare-desktop-card`, `windows-compose-folder--compare-desktop-search-open`, `windows-compose-folder--compare-mobile-card`, `windows-compose-browser--compare-desktop-chrome`, `windows-compose-browser--compare-desktop-address-open`, `windows-compose-browser--compare-mobile-chrome` | current capture가 여는 story | phase 4 capture script와 exact literal로 맞춘다. |
| review story ID | `windows-compose-folder--review-long-title`, `windows-compose-folder--review-long-address`, `windows-compose-folder--review-no-chips`, `windows-compose-browser--review-long-title`, `windows-compose-browser--review-long-address`, `windows-compose-browser--review-empty-dropdown` | synthetic edge-state review 대상 | compare inventory와 분리해서 유지한다. |
| compare provenance | `external-source evidence` | live 기준 acceptance source | package-local proxy가 아니라 외부 reference evidence로 기록한다. |

## 단계별 실행

### Phase 1. WindowFrame 공통 shell과 windows storybook 소유권 고정

| 항목 | 내용 |
| --- | --- |
| 목적 | `WindowFrame`를 공통 shell owner로 고정하고 windows storybook compare/review/helper를 windows 내부에서 읽히는 구조로 정리한다. |
| 변경 내용 | local `windowCompareRoot`, `[data-window-compare-stage]` marker contract, `Windows/Compose/*` story title, windows 내부 helper import 구조를 고정한다. |
| 파일별 작업 | 아래 표 참고 |
| 이전 상태 | windows storybook이 taskbar helper에 기대고 있고 compare/review marker 소유권도 windows 내부에서 한 번에 읽히지 않는다. |
| 이후 상태 | windows 패키지만 봐도 compare/review helper와 story taxonomy, `WindowFrame` marker owner를 이해할 수 있다. |
| 완료 조건 | windows 내부 taskbar compare helper import가 사라지고, windows inventory tests와 storybook build가 foundation 구조를 통과한다. |
| 관련 영역 | `WindowFrame`, windows storybook, folder/browser stories |
| 상세 | `./phases/01-window-foundation-and-storybook-ownership-lock.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | shell marker strip와 chrome/body 경계를 compare owner 기준으로 정리한다. | compare marker strip와 chrome/body boundary가 `WindowFrame` owner 기준으로 읽힌다. | windows inventory tests가 통과한다. |
| `packages/ui/src/components/windows/storybook/windowCompareRoot.tsx` | windows 내부 compare marker owner를 만든다. | `data-visual-*` marker owner가 windows storybook 안에 고정된다. | windows inventory tests가 통과한다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`, `packages/ui/src/components/windows/storybook/compareWindowStage.tsx`, `packages/ui/src/components/windows/storybook/windowReviewRoot.tsx` | reference/compare/review stage 역할을 windows 로컬 구조로 정리한다. | current capture host와 stage 역할 분리가 windows storybook 안에서 읽힌다. | storybook build가 통과한다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | `Windows/Compose/*` title과 local helper import로 story meta를 정리한다. | windows stories가 일관된 title과 helper ownership을 가진다. | storybook build와 import 점검을 통과한다. |

### Phase 2. Folder live 카드와 search prop surface 재정의

| 항목 | 내용 |
| --- | --- |
| 목적 | Folder를 live 기준의 thumbnail + title 중심 카드로 다시 잡고, search open/value UI를 prop surface로 고정한다. |
| 변경 내용 | `searchPanelOpen?`, `onSearchPanelOpenChange?`, `searchValue?`, `searchPlaceholder?`, `onSearchValueChange?`를 additive하게 드러내고 compare/review stories를 explicit args로 재구성한다. |
| 파일별 작업 | 아래 표 참고 |
| 이전 상태 | Folder storybook이 DOM click harness로 search 열림 상태를 만들고, 카드 surface도 보조 정보 비중이 커서 live 기준 카드 판단점이 흐리다. |
| 이후 상태 | Folder의 visible winner는 `thumbnailSrc + title`이고 search UI는 prop/callback surface로 제어된다. |
| 완료 조건 | `folder/desktop-card`, `folder/desktop-search-open`, `folder/mobile-card` compare inventory와 review stories가 exact story ID로 고정된다. |
| 관련 영역 | `Folder`, folder stories, folder fixtures, windows inventory tests |
| 상세 | `./phases/02-folder-live-card-and-search-contract.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/folder/index.tsx` | live-like 카드 surface와 controlled search UI prop contract를 정리한다. | `thumbnailSrc + title` 중심 카드와 search prop surface가 컴포넌트 계약으로 고정된다. | inventory tests가 통과한다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts` | desktop/mobile compare state와 review fixture를 prop-driven shape로 정리한다. | Folder compare/review fixture가 카드 winner와 search prop surface를 직접 드러낸다. | story inventory 점검을 통과한다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx` | DOM click harness 대신 explicit args 기반 compare/review stories로 옮긴다. | search-open UI가 story 조작이 아니라 prop surface로 보인다. | storybook build가 통과한다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`, `packages/ui/src/components/windows/storybook/windowReviewInventory.test.tsx` | Folder exact story ID와 review invariant를 반영한다. | compare/review inventory가 Folder의 새 surface 계약을 고정한다. | windows inventory tests가 통과한다. |

### Phase 3. Browser chrome parity와 address prop surface 재정의

| 항목 | 내용 |
| --- | --- |
| 목적 | Browser를 windows frame/chrome parity 대상으로 다시 고정하고, address open/value UI를 prop surface로 드러낸다. |
| 변경 내용 | `addressDropdownOpen?`, `onAddressDropdownOpenChange?`, `addressValue?`, `onAddressValueChange?`를 additive하게 드러내고 `addressLabel`은 fallback로만 남긴다. |
| 파일별 작업 | 아래 표 참고 |
| 이전 상태 | Browser 주소창 열림/표시 상태가 내부 state와 story 측 DOM 조작에 기대고 있어서 controlled UI surface가 분명하지 않다. |
| 이후 상태 | Browser 본문은 계속 `children` slot이고, address UI는 prop/callback으로 제어되는 chrome surface가 된다. |
| 완료 조건 | `browser/desktop-chrome`, `browser/desktop-address-open`, `browser/mobile-chrome` compare inventory와 review stories가 exact story ID로 고정된다. |
| 관련 영역 | `Browser`, browser stories, browser fixtures, windows inventory tests |
| 상세 | `./phases/03-browser-chrome-and-address-contract.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/browser/index.tsx` | address open/value controlled prop contract와 `children` body boundary를 고정한다. | Browser chrome parity 범위와 `children` body slot 계약이 동시에 읽힌다. | inventory tests가 통과한다. |
| `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | chrome 중심 compare state와 minimal body fixture를 정리한다. | Browser fixture가 chrome parity와 body boundary를 직접 드러낸다. | story inventory 점검을 통과한다. |
| `packages/ui/src/components/windows/browser/browser.stories.tsx` | explicit args 기반 compare/review stories로 정리하고 address-open UI를 prop surface로 보여준다. | address-open UI가 story 조작이 아니라 prop surface로 보인다. | storybook build가 통과한다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`, `packages/ui/src/components/windows/storybook/windowReviewInventory.test.tsx` | Browser exact story ID와 review invariant를 반영한다. | compare/review inventory가 Browser의 새 address 계약을 고정한다. | windows inventory tests가 통과한다. |

### Phase 4. live 기준 시각 비교 증거 수집

| 항목 | 내용 |
| --- | --- |
| 목적 | canonical compare inventory를 기준으로 live reference와 current story canvas를 1:1로 비교하는 증거 세트를 만든다. |
| 변경 내용 | baseline inventory, current capture script, state key별 diff report와 이미지 산출물을 계획 폴더 안에 정리한다. |
| 파일별 작업 | 아래 표 참고 |
| 이전 상태 | live 기준과 current story canvas 사이의 차이가 텍스트 계획으로만 남아 있고, state key별 증거가 없다. |
| 이후 상태 | reference/current/diff와 mismatch 분류가 같은 slug 아래 증거 파일로 남는다. |
| 완료 조건 | compare report가 6개 canonical state를 모두 다루고, 각 state가 exact story ID와 reference provenance에 연결된다. |
| 관련 영역 | plan-local compare artifacts, windows compare inventory |
| 상세 | `./phases/04-live-compare-report.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-ui-storybook-refresh/reference-captures/baseline-inventory.md` | 6개 canonical state의 live reference provenance를 고정한다. | state key별 reference 출처와 매핑 규칙이 문서로 고정된다. | baseline inventory 점검을 통과한다. |
| `plans/windows-ui-folder-browser-live-ui-storybook-refresh/capture-current.mjs` | exact story ID와 `[data-window-compare-stage]`를 이용해 current canvas를 캡처한다. | current capture가 windows storybook의 canonical stage marker를 사용한다. | capture run이 통과한다. |
| `plans/windows-ui-folder-browser-live-ui-storybook-refresh/visual-compare/report.md`, `diff-results.json`, `*.png` | state key별 reference/current/diff와 mismatch 분류를 남긴다. | compare 결과가 문서, 구조화 데이터, 이미지 증거로 함께 남는다. | compare report 점검을 통과한다. |

### Phase 5. drift 정리와 storybook 최종 polish

| 항목 | 내용 |
| --- | --- |
| 목적 | phase 4 증거를 기준으로 windows 범위 안에서 drift를 정리하고 최종 storybook 구조를 마감한다. |
| 변경 내용 | windows package 안의 남은 UI/stories/fixtures/inventory drift를 정리하고 compare를 재실행한다. |
| 파일별 작업 | 아래 표 참고 |
| 이전 상태 | compare report에서 드러난 시각적/구조적 drift가 일부 남아 있고 최종 inventory 검증이 끝나지 않았다. |
| 이후 상태 | windows 범위 안에서 final compare, inventory, storybook build까지 통과하는 마감 상태가 된다. |
| 완료 조건 | final compare 재실행, windows inventory tests, storybook build가 통과하고 windows 내부 taskbar helper import가 다시 생기지 않는다. |
| 관련 영역 | `packages/ui/src/components/windows/**`, windows inventory tests, plan-local compare artifacts |
| 상세 | `./phases/05-drift-closure-and-storybook-polish.md` |

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/**` | compare report가 가리킨 drift를 windows 범위 안에서만 수정한다. | 남은 shell/card/chrome drift가 windows 패키지 안에서 정리된다. | final compare를 통과한다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`, `packages/ui/src/components/windows/storybook/windowReviewInventory.test.tsx` | 최종 story ID와 review invariant drift를 다시 잠근다. | final rerun 이후에도 inventory contract가 흔들리지 않는다. | windows inventory tests가 통과한다. |
| `plans/windows-ui-folder-browser-live-ui-storybook-refresh/visual-compare/**` | final rerun 결과와 최종 diff 상태를 갱신한다. | 최종 compare 증거가 같은 slug 아래 최신 상태로 남는다. | compare report 점검을 통과한다. |
