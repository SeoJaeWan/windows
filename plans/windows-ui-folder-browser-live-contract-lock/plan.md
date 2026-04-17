**Branch:** feat/windows-ui-folder-browser-live-contract-lock

> Worktree dir: `worktrees/windows-ui-folder-browser-live-contract-lock` (plan 폴더명과 동일)
> 이 문서는 `packages/ui`의 `Folder` / `Browser` 계약과 Storybook 인벤토리를 라이브 기준으로 다시 잠그는 새 실행 계획이다.
> 이전 `windows-ui-folder-browser-live-fidelity-repair`, `windows-ui-folder-browser-window-family` 플랜은 read-only 참고 자료일 뿐이며, 이번 plan의 acceptance와 handoff는 이 폴더 안의 산출물만 기준으로 삼는다.

# Windows UI Folder/Browser 라이브 계약 잠금 실행 계획

## 사전 합의

| 항목 | 합의 내용 | 적용 phase | 메모 |
| --- | --- | --- | --- |
| 새 오케스트레이션 런 | 이번 작업은 `windows-ui-folder-browser-live-contract-lock` 전용 새 런이다. 이전 플랜의 closure, compare report, acceptance 문구를 승계하지 않는다. | 전체 | 이전 plan은 read-only 참고만 허용한다. |
| 라이브 기준선 | external baseline은 2026-04-17 시점의 `https://seojaewan.com/blog` 와 `https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0` 렌더링이다. | Phase 1 / Phase 3 / Phase 4 | compare는 이 날짜와 URL을 plan-local inventory로 다시 고정한다. |
| `WindowFrame` owner boundary | `WindowFrame`는 generic shell만 유지하며 title, icon, address bar, window controls, body slot만 소유한다. leaf-specific sidebar/article composition은 열지 않는다. | Phase 2 / Phase 4 | internal-only boundary를 유지한다. |
| `Folder` sidebar contract | `Folder.sidebarItems`는 root item + optional children의 one-level tree만 허용한다. root item은 children이 있어도 selectable이고, multi-expand를 지원한다. `activeSidebarId`가 없거나 어떤 row와도 일치하지 않으면 selected row는 없고, `expandedSidebarIds`가 없거나 비어 있으면 expanded root도 없다. | Phase 2 / Phase 4 | host-controlled contract만 허용하며 internal fallback state를 열지 않는다. |
| `Folder` state ownership | `Folder` public contract는 `sidebarItems`, `activeSidebarId`, `expandedSidebarIds`, `entries`, `thumbnailSrc`, `onSidebarSelect`, `onSidebarToggle`, `onEntryOpen`, `title`, `icon`, `addressLabel` naming을 기준으로 잠근다. | Phase 2 / Phase 4 | first-row auto-select, internal expand fallback, persistent selected entry state는 금지다. |
| `Folder` entry interaction | `Folder.entries`는 compact explorer thumbnail entry를 렌더링하고, 엔트리 상호작용은 `onEntryOpen`만 연다. selected entry를 고정하는 v1 public state는 두지 않는다. | Phase 2 / Phase 4 | thumbnail ratio는 blocking visual drift다. |
| `Browser` public surface | `Browser`는 body contract를 계속 `children`으로만 연다. article composition은 host concern이며 `variant`, slug, not-found 전용 prop를 public API에 넣지 않는다. | Phase 2 / Phase 4 | `WindowFrame` shell 위에서 slot-driven contract를 유지한다. |
| address bar policy | address bar는 editable input이 아니라 read-only focusable surface이며, hover/focus/pressed UI response만 internal chrome으로 제공한다. | Phase 2 / Phase 4 | consumer가 입력 상태를 주입하는 surface로 다시 열지 않는다. |
| Storybook taxonomy | Storybook leaf root는 `Windows/Folder`, `Windows/Browser`만 사용하고 panel family는 계속 `Panels/*` 아래에 둔다. | Phase 2 | `.claude` 문서는 현재 taxonomy를 read-only prerequisite로 취급한다. |
| canonical compare scope | canonical compare inventory는 정확히 4개 state만 가진다: `folder/desktop-blog`, `folder/mobile-blog`, `browser/desktop-article`, `browser/mobile-article`. | Phase 1 / Phase 2 / Phase 3 / Phase 4 | support-only review story는 추가할 수 있지만 compare inventory에는 넣지 않는다. |
| visual acceptance rule | font 차이는 non-blocking이다. geometry, chrome, spacing, responsive behavior, thumbnail ratio 차이는 blocking visual drift다. | Phase 1 / Phase 3 / Phase 4 | compare report가 이 분류를 그대로 사용해야 한다. |
| UI-only scope | 이번 계획은 `packages/ui` source, storybook, source-tree verification, plan-local compare artifact까지만 다룬다. production runtime wiring, consumer app integration, generic app state orchestration은 범위 밖이다. | 전체 | 구현 전 `plan-materializer`가 자동 선행 단계다. |

## 전체 작업 지도

| Phase | 이번 단계에서 하는 일 | 끝나면 달라지는 상태 | 다음 단계로 넘기는 것 |
| --- | --- | --- | --- |
| Phase 1. 라이브 기준선 고정 | 2026-04-17 live baseline의 4개 canonical state, provenance, viewport, 허용 오차 규칙을 새 plan folder 안에 고정한다. | 새 런이 어떤 external evidence를 acceptance로 쓰는지와 무엇이 blocking visual drift인지 plan-local artifact로 읽힌다. | `reference-captures/baseline-inventory.md`와 canonical baseline image 4개 |
| Phase 2. 리프 계약과 Storybook 인벤토리 잠금 | `WindowFrame`, `Folder`, `Browser`, windows fixtures/stories/stages/test를 함께 갱신해 새 prop contract와 exact story recipient를 잠근다. | `Folder` controlled sidebar contract, `Browser` slot contract, support-only review story, canonical compare story ID가 `packages/ui` source에서 하나의 surface로 닫힌다. | exact prop names, exact story IDs, canonical 4-state compare inventory |
| Phase 3. 기준선 비교 리포트 생성 | pinned baseline과 canonical compare story surface를 1:1로 캡처·diff·report한다. | 어떤 state가 blocking drift인지와 어떤 차이가 font-only non-blocking인지 repo-local evidence로 남는다. | exact mismatch key 목록 또는 4-state pass report |
| Phase 4. 시각 드리프트 마감 | Phase 3 report가 남긴 blocking mismatch만 `packages/ui` 범위 안에서 닫고 같은 inventory를 다시 통과시킨다. | 새 public contract와 같은 4-state inventory가 final compare에서 pass하거나 explicit blocker로 종료된다. | implementation handoff용 final compare evidence와 blocker 여부 |

## 단계별 실행

### Phase 1. 라이브 기준선 고정

- 목적: 새 런의 acceptance source를 2026-04-17 live rendering 기준으로 다시 고정하고, old plan continuity 없이 4-state inventory를 plan-local baseline으로 잠근다.
- 변경 내용: `folder/desktop-blog`, `folder/mobile-blog`는 `/blog`, `browser/desktop-article`, `browser/mobile-article`는 article URL을 각각 desktop/mobile viewport로 capture해 `reference-captures/`에 보관한다. `baseline-inventory.md`는 exact URL, capture date, viewport, provenance, blocking/non-blocking visual rule을 함께 적는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-contract-lock/reference-captures/baseline-inventory.md` | 추가 | canonical 4-state baseline, provenance, viewport, visual tolerance rule이 한 문서에 고정된다. | 네 state의 exact URL, 2026-04-17 date, `external-source evidence` provenance, blocking/non-blocking rule이 모두 적혀 있다. |
| `plans/windows-ui-folder-browser-live-contract-lock/reference-captures/` | 추가 | baseline image 4개가 새 plan folder 안에만 저장된다. | `folder-desktop-blog.png`, `folder-mobile-blog.png`, `browser-desktop-article.png`, `browser-mobile-article.png`가 존재한다. |

- 이전 상태: 라이브 기준선은 사용자 합의 문장으로만 존재하고, 이전 plan artifact와 섞이지 않은 새 baseline inventory가 없다.
- 이후 상태: 이번 plan은 exact 4-state baseline과 visual acceptance 분류를 자기 폴더 안에서 읽을 수 있다.
- 완료 조건: reviewer가 Phase 1 artifact만 열어도 이번 런의 compare 대상, viewport, provenance, blocking visual drift 범위를 다시 추정하지 않아야 한다.
- 관련 영역: `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/`, `plans/windows-ui-folder-browser-window-family/reference-captures/`, `https://seojaewan.com/blog`, `https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`
- 시작 조건: `none`
- 상세: `./phases/01-reference-baseline-lock.md`

### Phase 2. 리프 계약과 Storybook 인벤토리 잠금

- 목적: `packages/ui`에서 `WindowFrame` generic shell, `Folder` controlled Explorer-style leaf, `Browser` slot leaf, exact Storybook recipient를 하나의 canonical contract로 잠근다.
- 변경 내용: `WindowFrame`는 generic shell만 유지하고 read-only focusable address surface를 소유한다. `Folder`는 `sidebarItems`, `activeSidebarId`, `expandedSidebarIds`, `entries`, `onSidebarSelect`, `onSidebarToggle`, `onEntryOpen` naming의 controlled contract로 바뀌고 one-level tree-aware sidebar + compact explorer thumbnails를 렌더링한다. `Browser`는 `children` slot contract를 유지한다. `Windows/Folder`, `Windows/Browser` 아래에서 canonical compare story 4개와 support-only human-review story를 exact export name으로 고정하고 inventory test는 canonical 4-state만 positive signal로 검증한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 조정 | `WindowFrame` generic shell boundary가 다시 읽히고 address bar가 editable input이 아니라 read-only focusable chrome으로 닫힌다. | title, icon, address bar, window controls, body slot 외 leaf-specific API가 이 파일에 추가되지 않는다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 교체 | `Folder` public prop contract가 controlled sidebar + entry-open surface로 잠긴다. | `sidebarItems`, `activeSidebarId`, `expandedSidebarIds`, `entries`, `onSidebarSelect`, `onSidebarToggle`, `onEntryOpen` naming이 source에 드러나고 first-row auto-select가 사라진다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 조정 | `Browser`가 `children` slot만 public body contract로 유지한다. | article/not-found composition prop, slug prop, editable address API가 새지 않는다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 교체 | live-aligned fixture source와 support-only review fixture가 canonical state inventory와 분리된다. | compare state와 review-only state가 같은 파일에서 역할별로 구분되고 `thumbnailSrc` winner가 fixture에 드러난다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 교체 | exact title, exact export name, exact compare recipient가 잠긴다. | `Windows/Folder`, `Windows/Browser` 아래에서 canonical compare export 4개와 review-only export가 분리돼 있다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`, `packages/ui/src/components/windows/storybook/compareWindowStage.tsx` | 조정 | human-review stage와 machine-capture stage가 live baseline viewport와 같은 geometry policy를 유지한다. | review stage decoration이 contract 판단을 흐리지 않고 compare stage는 canonical viewport를 그대로 재현한다. |
| `packages/ui/src/components/windows/storybook/assets/cover-blog-thumbnail.png`, `packages/ui/src/components/windows/storybook/assets/cover-article.png` | 조정 | thumbnail/cover asset ratio가 live baseline과 같은 acceptance surface로 고정된다. | later compare가 ratio drift를 story fixture 차원에서 재현할 수 있다. |
| `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 교체 | canonical 4-state compare inventory의 positive signal이 source-tree test로 남는다. | test가 exact four `kind/state` pair만 `[data-visual-root]` 하나씩 검증하고 review-only story는 포함하지 않는다. |

- 이전 상태: `Folder`는 `navigationItems`/`activeNavigationId` fallback contract를 쓰고, `Browser`는 article-only fixture에 기대며, support-only review story와 controlled sidebar contract가 잠겨 있지 않다.
- 이후 상태: source, fixtures, stories, inventory test를 함께 읽으면 exact prop names, exact story IDs, exact canonical state 4개와 excluded review-only cases가 같은 언어로 드러난다.
- 완료 조건: implementer가 `packages/ui/src/components/windows/**`만 읽고도 `Folder`/`Browser` public surface, review-only story boundary, compare state key를 추정하지 않고 실행할 수 있어야 한다.
- 관련 영역: Phase 1 baseline inventory, `.claude/rules/storybook.md`, `.claude/CLAUDE.md`, `packages/ui/src/components/taskbar/storybook/compareRoot.tsx`
- 시작 조건: Phase 1에서 canonical 4-state baseline과 viewport가 먼저 고정돼 있어야 한다.
- 상세: `./phases/02-leaf-contract-and-storybook-lock.md`

### Phase 3. 기준선 비교 리포트 생성

- 목적: Phase 1 baseline과 Phase 2 canonical compare surface를 exact `kind/state` key로 비교해 blocking visual drift만 inspectable report로 남긴다.
- 변경 내용: `capture-current.mjs`는 exact compare story ID 4개만 캡처한다. `visual-compare/run-diff.mjs`와 `visual-compare/report.md`는 baseline/current/diff artifact를 같은 `kind/state` key로 묶고, font-only 차이는 non-blocking, geometry/chrome/spacing/responsive/thumbnail ratio 차이는 blocking으로 분류한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-contract-lock/capture-current.mjs` | 추가 | canonical compare story 4개만 current capture 대상으로 고정한다. | script가 support-only review story나 old plan artifact를 current capture source로 읽지 않는다. |
| `plans/windows-ui-folder-browser-live-contract-lock/visual-compare/run-diff.mjs` | 추가 | baseline/current/diff/report가 같은 `kind/state` key naming을 공유한다. | emitted artifact 이름과 report row 이름이 모두 `folder-desktop-blog` 등 같은 key를 쓴다. |
| `plans/windows-ui-folder-browser-live-contract-lock/visual-compare/` | 추가/정리 | current image, diff image, report가 provenance와 drift 분류를 함께 남긴다. | `report.md`가 four state 모두를 나열하고 blocking/non-blocking 분류를 key별로 적는다. |

- 이전 상태: 새 baseline과 새 Storybook surface는 있어도, 이번 plan folder 안에서 pass/fail과 drift 분류를 읽을 compare evidence가 없다.
- 이후 상태: reviewer와 Phase 4 implementer가 exact mismatch key와 non-blocking font drift를 같은 report에서 읽을 수 있다.
- 완료 조건: report가 canonical 4-state, provenance, blocking/non-blocking drift 분류를 모두 명시하고 artifact naming drift 없이 남겨야 한다.
- 관련 영역: Phase 1 baseline inventory, Phase 2 story IDs, `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`
- 시작 조건: Phase 1 baseline과 Phase 2 canonical story recipient/inventory가 모두 stable해야 한다.
- 상세: `./phases/03-reference-compare-report.md`

### Phase 4. 시각 드리프트 마감

- 목적: Phase 3 report가 남긴 blocking drift만 `packages/ui` 범위에서 닫고, contract와 inventory를 다시 열지 않은 채 final compare를 통과시킨다.
- 변경 내용: `WindowFrame`, `Folder`, `Browser`, windows storybook helper/asset 범위 안에서 geometry, chrome, spacing, responsive behavior, thumbnail ratio mismatch만 수정한다. final rerun compare는 같은 4-state inventory를 재사용하고, font-only 차이는 non-blocking으로 유지한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/**` | 조정 | shell chrome과 address surface drift가 report 기준으로 줄어든다. | generic shell boundary는 유지한 채 blocking chrome/spacing mismatch만 닫힌다. |
| `packages/ui/src/components/windows/folder/**` | 조정 | sidebar tree geometry, entry spacing, thumbnail ratio, responsive layout drift가 줄어든다. | `folder/desktop-blog`, `folder/mobile-blog`가 final compare에서 blocking mismatch 없이 닫힌다. |
| `packages/ui/src/components/windows/browser/**` | 조정 | browser chrome/article layout drift가 줄어든다. | `browser/desktop-article`, `browser/mobile-article`가 final compare에서 blocking mismatch 없이 닫힌다. |
| `packages/ui/src/components/windows/storybook/**` | 조정 | fixture/stage/asset drift가 있으면 same contract 안에서 정리된다. | canonical 4-state inventory와 review-only story 분리가 그대로 유지된다. |
| `plans/windows-ui-folder-browser-live-contract-lock/visual-compare/` | 갱신 | rerun compare evidence가 final 상태를 남긴다. | report가 pass 또는 explicit blocker를 exact key 단위로 기록한다. |

- 이전 상태: compare report가 blocking mismatch를 지적하지만 final acceptance는 아직 닫히지 않았다.
- 이후 상태: 같은 contract와 inventory로 rerun compare가 pass하거나, `packages/ui` 범위를 벗어나는 blocker가 명시된다.
- 완료 조건: final report가 canonical 4-state를 모두 재평가하고, blocking mismatch가 남으면 exact key와 scope blocker를 남겨야 한다.
- 관련 영역: Phase 2 source contract 전체, Phase 3 compare report
- 시작 조건: Phase 3 report가 exact mismatch key와 drift 분류를 남겨야 한다.
- 상세: `./phases/04-visual-drift-closure.md`
