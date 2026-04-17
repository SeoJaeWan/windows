**Branch:** fix/windows-ui-folder-browser-live-ui-parity

> Worktree dir: `worktrees/windows-ui-folder-browser-live-ui-parity`

| # | Phase | Agent |
| --- | --- | --- |
| 1 | `./phases/01-reference-baseline-and-compare-scope-lock.md` | `visual-comparator` |
| 2 | `./phases/02-window-shell-and-surface-lock.md` | `frontend-developer` |
| 3 | `./phases/03-reference-compare-report.md` | `visual-comparator` |
| 4 | `./phases/04-visual-drift-closure.md` | `frontend-developer` |

## 작업 한눈에 보기

- 목표: `packages/ui` 안의 `WindowFrame`, `Folder`, `Browser`를 `https://seojaewan.com`의 현재 윈도우 내부 구조와 맞추되, 별도 live variant 없이 기존 package surface를 직접 정렬한다.
- 이번 계획의 핵심: `WindowFrame`는 더 얇고 단순한 live chrome으로 옮기고, `Folder`는 현재 card-style blog grid에서 벗어나 live folder/sidebar/item grammar로 재구성하며, `Browser`는 `children` body contract를 유지한 채 shell만 parity 범위로 묶는다.
- 완료되면 달라지는 점: package source, Storybook compare surface, plan-local compare report가 모두 같은 4개 canonical state와 같은 window-area acceptance 규칙을 공유한다.
- 제외 범위: taskbar/desktop shell, consumer article layout, exact post copy나 썸네일 이미지 자체의 샘플 콘텐츠 일치, 별도 live 전용 컴포넌트, 공개 API 재설계

## 사전 합의

| 항목 | 합의 내용 | 적용 범위 | 메모 |
| --- | --- | --- | --- |
| 목표 기준 | 목표는 sample-content parity가 아니라 `packages/ui` window surface의 structural live UI parity다. | 전체 | exact copy나 thumbnail art는 구조 증거가 아닌 documentary drift로 분류할 수 있다. |
| 수정 위치 | 기존 `packages/ui`의 `WindowFrame`, `Folder`, `Browser`를 직접 수정하고 별도 live variant는 만들지 않는다. | Phase 2, Phase 4 | `LiveFolder`, `LiveBrowser` 같은 parallel surface를 열지 않는다. |
| WindowFrame 방향 | `WindowFrame`는 현재 generic Windows 11 스타일에서 벗어나 live 사이트의 더 얇고 단순한 chrome으로 이동한다. | Phase 2, Phase 4 | internal-only boundary는 유지한다. |
| Folder 공개 계약 | `Folder`는 현재 공개 prop 이름을 가능한 한 유지하고, `sidebarItems`/`activeSidebarId`/`expandedSidebarIds`/`entries`/callback contract 위에서 live folder grammar를 회복한다. | Phase 2, Phase 4 | API redesign이 아니라 render grammar realignment다. |
| Browser 공개 계약 | `Browser` body contract는 계속 `children`만 사용하고, 이번 task는 browser chrome과 `WindowFrame` shell parity만 다룬다. | Phase 2, Phase 3, Phase 4 | article layout은 package-owned UI로 승격하지 않는다. |
| marker owner rule | `Folder`/`Browser`는 native `div` pass-through를 계속 받되, compare용 reserved marker key(`data-window-frame-root`, `data-window-frame-chrome`, `data-window-frame-body`, `data-window-compare-stage`)는 public override surface가 아니다. 구현은 conflicting key를 `...rest`에서 strip하거나 marker를 spread 뒤에 써서 package-owned marker가 항상 이긴다. | Phase 2, Phase 3, Phase 4 | unrelated native attrs와 unrelated `data-*`는 pass-through 가능하지만 reserved marker는 consumer가 바꾸지 못한다. |
| 비교 범위 | acceptance는 window area만 비교하며 taskbar와 desktop shell은 out of scope다. Browser에서는 shell/chrome이 blocking compare 대상이고 article body는 documentary-only다. | Phase 1, Phase 3, Phase 4 | Folder는 sidebar와 item grammar까지 package-owned blocking scope다. |
| 증거 기준 | 최종 acceptance는 이 plan folder 안의 baseline inventory와 compare report를 기준으로 판단한다. | Phase 1, Phase 3, Phase 4 | live 사이트 기억이나 이전 plan 보고서만으로 닫지 않는다. |

## Phase 흐름 요약

| Phase | 역할 | 하는 일 | 고정 상태 | 다음 단계 전달 |
| --- | --- | --- | --- | --- |
| Phase 1. 라이브 기준선과 비교 초점 고정 | external reference freeze | canonical 4-state baseline, provenance, viewport, blocking-vs-documentary compare rule을 이 plan folder 안에 다시 고정한다. | 이 task가 어떤 live evidence를 어떤 범위로 비교해야 하는지 더 이상 재해석할 필요가 없어진다. | exact state key, exact viewport, exact blocking scope, exact documentary scope |
| Phase 2. 윈도우 셸과 공개 surface 고정 | package surface realignment | `WindowFrame`, `Folder`, `Browser`, fixtures/stories/stages를 같은 acceptance rule 위에서 정렬하고 compare recipient를 닫는다. | package source만 읽어도 shell owner, Folder live grammar, Browser `children` boundary, canonical story recipient가 분명해진다. | exact compare story ID, shell marker, public surface, validation boundary |
| Phase 3. 기준 비교 보고서 생성 | compare evidence | Phase 1 baseline과 Phase 2 current surface를 같은 key로 캡처/차이 보고서로 남긴다. | blocking structural drift와 documentary drift가 key별로 분리된 repo-local evidence가 생긴다. | exact mismatch key와 category, 또는 pass/no-op compare result |
| Phase 4. 시각 드리프트 마감 | in-scope drift closure | Phase 3 report가 가리킨 blocking structural drift만 package 범위에서 닫고 같은 inventory로 재비교한다. | 같은 4-state inventory와 같은 scope rule로 최종 pass 또는 explicit blocker가 남는다. | implementation handoff와 이후 `plan-materialize`가 그대로 쓸 최종 contract/evidence |

## 단계별 실행

### Phase 1. 라이브 기준선과 비교 초점 고정

- 목적: 이 task가 의존할 live reference와 structural parity acceptance 범위를 먼저 고정한다.
- 왜 지금 이 단계인가: compare와 fix가 이전 plan의 stale blocker 문구나 샘플 콘텐츠 drift를 다시 acceptance로 오인하면 이후 phase가 계속 흔들린다.
- 변경 내용: `folder/desktop-blog`, `folder/mobile-blog`, `browser/desktop-article`, `browser/mobile-article` 네 canonical state를 2026-04-17 기준 live capture로 다시 고정하고, 각 state마다 무엇이 blocking structural drift이고 무엇이 documentary-only drift인지 `baseline-inventory.md`에 명시한다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-ui-parity/reference-captures/baseline-inventory.md` | 추가 | canonical 4-state baseline, provenance, viewport, blocking/documentary compare focus가 한 문서에 고정된다. | reviewer가 이 문서만 읽고 Folder와 Browser의 compare scope를 다시 추측하지 않아도 된다. |
| `plans/windows-ui-folder-browser-live-ui-parity/reference-captures/` | 추가 | baseline image 4개가 이 plan의 acceptance evidence로 plan-local하게 남는다. | `folder-desktop-blog.png`, `folder-mobile-blog.png`, `browser-desktop-article.png`, `browser-mobile-article.png`가 1:1로 존재한다. |

- 이전 상태: current compare blocker는 이전 plan 보고서와 mixed scope note에 의존하고 있어 structural parity와 sample-content drift가 한데 섞여 있다.
- 이후 상태: 이번 task가 어떤 live window area를 어떤 규칙으로 비교하는지 plan-local baseline inventory에서 바로 읽을 수 있다.
- 완료 조건: `baseline-inventory.md`가 exact state key 4개, provenance, viewport, window-area crop, blocking/documentary scope를 모두 적고 있어야 한다.
- 다음 단계로 넘기는 것: exact state key 4개, exact viewport, Folder structural scope, Browser shell-only structural scope
- 관련 영역: `plans/windows-ui-folder-browser-live-contract-lock/reference-captures/**`, `plans/windows-ui-folder-browser-live-contract-lock/visual-compare/report.md`, `https://seojaewan.com/blog`, `https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`
- 상세: `./phases/01-reference-baseline-and-compare-scope-lock.md`

### Phase 2. 윈도우 셸과 공개 surface 고정

- 목적: package-owned shell과 leaf surface를 live 구조에 맞게 정렬하되 공개 API와 compare recipient를 다시 열지 않는다.
- 왜 지금 이 단계인가: compare phase가 의미 있으려면 `WindowFrame`, `Folder`, `Browser`, Storybook recipient가 모두 같은 winner rule과 같은 scope를 먼저 공유해야 한다.
- 변경 내용: internal `WindowFrame`를 thinner/simpler live shell로 조정하고 shell marker를 고정한다. `Folder`는 현재 공개 prop 이름을 유지한 채 live에 더 가까운 sidebar/item grammar로 재구성하고, `Browser`는 `children` body contract를 유지한 채 shell만 same frame 위에서 정렬한다. 이때 public `div` pass-through는 유지하되 reserved compare marker key는 strip 또는 package-wins spread order로 package-owned marker가 항상 우선하게 닫는다. fixtures, stories, stage, compare inventory signal도 exact 4-state contract로 맞춘다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/index.tsx` | 조정 | thinner/simpler shell과 stable shell marker가 internal-only foundation으로 고정된다. | `WindowFrame`가 public export로 새지 않고 compare가 읽을 stable shell boundary를 가진다. |
| `packages/ui/src/components/windows/folder/index.tsx` | 조정 | current `Folder` prop surface를 유지한 채 live-like sidebar/item presentation으로 바뀐다. | card-style blog grid가 사라지고 sidebar/item grammar가 live reference와 같은 방향으로 읽힌다. |
| `packages/ui/src/components/windows/browser/index.tsx` | 조정 | `Browser`가 `children` body contract를 유지하면서 new shell 위에 정렬된다. | article layout prop이나 variant 없이 shell parity만 package-owned로 닫힌다. |
| `packages/ui/src/components/windows/storybook/folderReferenceFixtures.ts`, `packages/ui/src/components/windows/storybook/browserReferenceFixtures.tsx` | 조정 | current public surface와 exact compare state 4개를 설명하는 fixture source가 정리된다. | sample data는 구조 증거만 담당하고 content parity를 새 acceptance로 열지 않는다. |
| `packages/ui/src/components/windows/folder/folder.stories.tsx`, `packages/ui/src/components/windows/browser/browser.stories.tsx` | 조정 | canonical compare story와 review story가 같은 scope rule을 공유한다. | compare story ID 4개가 exact key와 계속 1:1로 대응한다. |
| `packages/ui/src/components/windows/storybook/windowReferenceStage.tsx`, `packages/ui/src/components/windows/storybook/compareWindowStage.tsx`, `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx` | 조정 | human-review stage, machine-capture stage, inventory positive signal이 same shell/canvas contract를 읽는다. | compare phase가 canonical host canvas와 exact recipient를 추측 없이 캡처할 수 있다. |
| `packages/ui/src/components/windows/storybook/assets/**` | 조정 | 구조 검증에 필요한 preview ratio와 shell 주변 visual density가 repo-local asset로 안정화된다. | exact thumbnail art 자체가 아니라 ratio와 structure를 설명하는 asset contract만 남는다. |

- 이전 상태: current source는 이전 live-contract-lock grammar를 따르고 있어 `WindowFrame` chrome이 두껍고, `Folder` item presentation이 live folder item grammar와 다르며, Browser compare는 shell/body scope가 분리돼 있지 않다.
- 이후 상태: package source만 읽어도 thinner shell, Folder live grammar, Browser `children` boundary, exact compare recipient, stable shell marker가 모두 같은 contract로 고정된다.
- 완료 조건: `packages/ui/src/components/windows/**`와 source-tree positive signal만 읽고도 공개 API를 다시 열지 않은 채 live parity boundary를 설명할 수 있어야 한다.
- 다음 단계로 넘기는 것: exact story ID 4개, stable compare canvas selector, stable shell marker, exact public surface and winner rules
- 관련 영역: `packages/ui/src/index.ts`, `packages/ui/package.json`, `plans/windows-ui-folder-browser-live-contract-lock/visual-compare/report.md`, `plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/report.md`
- 상세: `./phases/02-window-shell-and-surface-lock.md`

### Phase 3. 기준 비교 보고서 생성

- 목적: Phase 1 baseline과 Phase 2 current surface를 같은 key로 비교해 repo-local evidence를 만든다.
- 왜 지금 이 단계인가: fix phase는 감상이나 기억이 아니라 exact mismatch key와 exact scope category를 받아야 self-sufficient하게 닫힌다.
- 변경 내용: exact compare story ID 4개와 canonical host canvas를 캡처하는 script를 plan folder에 두고, baseline/current/diff/report artifact를 같은 key naming으로 생성한다. capture selector는 consumer-supplied host attr가 아니라 package-owned reserved marker를 기준으로 고정하고, report는 structural blocking drift와 documentary drift를 분리해 적는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-ui-parity/capture-current.mjs` | 추가 | canonical compare story 4개만 current capture 대상으로 고정된다. | script가 exact story recipient와 canonical host canvas만 캡처한다. |
| `plans/windows-ui-folder-browser-live-ui-parity/visual-compare/run-diff.mjs` | 추가 | baseline/current/diff artifact가 같은 key naming으로 정렬된다. | report row와 artifact file name이 모두 같은 key를 쓴다. |
| `plans/windows-ui-folder-browser-live-ui-parity/visual-compare/` | 추가/정리 | current PNG, diff PNG, `report.md`가 structural/documentary 분류와 함께 남는다. | report가 canonical 4-state를 모두 적고 next phase가 바로 읽을 mismatch key를 남긴다. |

- 이전 상태: 이번 task 전용 compare evidence가 없어 이전 plan의 blocker wording이 그대로 해석 경로를 지배한다.
- 이후 상태: `kind/state -> baseline/current/diff/report` 경로와 blocking/documentary 분류가 이번 plan 전용 artifact로 남는다.
- 완료 조건: `visual-compare/report.md`가 exact 4-state key, provenance, structural/documentary 분류, exact artifact pair를 모두 기록해야 한다.
- 다음 단계로 넘기는 것: exact mismatch key와 blocking category, 또는 final pass/no-op compare result
- 관련 영역: Phase 1 baseline inventory, Phase 2 story recipient/output, `packages/ui/src/components/windows/storybook/windowCompareInventory.test.tsx`
- 상세: `./phases/03-reference-compare-report.md`

### Phase 4. 시각 드리프트 마감

- 목적: compare report가 지적한 blocking structural drift만 package 범위 안에서 닫고 같은 inventory로 재비교한다.
- 왜 지금 이 단계인가: compare phase는 evidence만 만들고 product code를 바꾸지 않으므로, 실제 parity closure는 exact mismatch key를 받은 뒤 분리해 닫아야 한다.
- 변경 내용: `WindowFrame`, `Folder`, `Browser`, windows storybook helper 범위에서 Phase 3 report가 지적한 in-scope drift만 수정한다. marker ownership rule도 Phase 2 wording 그대로 유지해 reserved compare marker가 consumer pass-through에 의해 다시 열리지 않게 하고, 같은 compare inventory와 같은 scope rule로 rerun compare를 남긴다. 남는 차이가 documentary-only라면 pass로 닫는다.
- 파일별 작업:

| 파일 | 작업 방식 | 기대 결과 | 완료 조건 |
| --- | --- | --- | --- |
| `packages/ui/src/components/windows/internal/windowFrame/**` | 조정 | shell chrome 관련 structural drift만 줄인다. | thinner shell contract와 internal-only boundary가 유지된 채 blocker가 닫힌다. |
| `packages/ui/src/components/windows/folder/**` | 조정 | sidebar/item grammar와 responsive density drift를 exact key 기준으로 닫는다. | `folder/desktop-blog`, `folder/mobile-blog`가 structural scope 기준으로 pass 또는 explicit blocker가 된다. |
| `packages/ui/src/components/windows/browser/**` | 조정 | Browser shell drift만 닫고 body ownership은 건드리지 않는다. | `browser/*`는 shell scope 기준으로 pass 또는 explicit blocker가 된다. |
| `packages/ui/src/components/windows/storybook/**` | 조정 | compare recipient와 review helper가 같은 scope를 계속 설명한다. | compare rerun이 같은 key와 같은 host canvas를 계속 찾는다. |
| `plans/windows-ui-folder-browser-live-ui-parity/visual-compare/` | 갱신 | final report가 이번 task의 종료 상태를 남긴다. | canonical 4-state 전부에 대해 pass 또는 explicit blocker가 exact key로 기록된다. |

- 이전 상태: compare report는 blocker를 보여 주지만 아직 source tree가 그 결과를 닫지 않았다.
- 이후 상태: 같은 4-state inventory와 같은 scope rule로 최종 pass 또는 explicit blocker가 남는다.
- 완료 조건: final report가 canonical 4-state 모두를 다시 평가하고, blocking structural drift만을 기준으로 pass 또는 explicit blocker를 적어야 한다.
- 다음 단계로 넘기는 것: implementation handoff, `plan-materialize`용 bounded-surface contract, final compare evidence
- 관련 영역: Phase 2 source contract 전체, Phase 3 compare report, `plans/windows-ui-folder-browser-live-ui-parity/reference-captures/baseline-inventory.md`
- 상세: `./phases/04-visual-drift-closure.md`

## 체크리스트

- [ ] Phase 1 완료 후 `folder/desktop-blog`, `folder/mobile-blog`, `browser/desktop-article`, `browser/mobile-article`의 exact baseline과 structural/documentary compare scope가 plan-local artifact로 고정된다.
- [ ] Phase 2 완료 후 `WindowFrame`, `Folder`, `Browser`, Storybook recipient가 같은 공개 계약, 같은 compare canvas contract, 같은 reserved marker ownership rule을 공유한다.
- [ ] Phase 3 완료 후 canonical 4-state의 baseline/current/diff/report evidence가 exact key로 남고, blocking structural drift가 documentary drift와 분리된다.
- [ ] Phase 4 완료 후 같은 4-state inventory와 같은 scope rule로 final pass 또는 explicit blocker가 기록된다.
