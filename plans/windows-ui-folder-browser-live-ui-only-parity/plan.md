**Branch:** fix/windows-ui-folder-browser-live-ui-only-parity

> Worktree dir: `worktrees/windows-ui-folder-browser-live-ui-only-parity`

| # | Phase | Agent |
| --- | --- | --- |
| 1 | `./phases/01-live-reference-and-ui-scope-lock.md` | `visual-comparator` |
| 2 | `./phases/02-shell-and-responsive-grammar-lock.md` | `frontend-developer` |
| 3 | `./phases/03-ui-state-and-edge-contract-lock.md` | `frontend-developer` |
| 4 | `./phases/04-reference-compare-report.md` | `visual-comparator` |
| 5 | `./phases/05-visual-drift-closure.md` | `frontend-developer` |

## 이번 작업 한눈에 보기

- 목표: `packages/ui/src/components/windows/**` 안에서 `Folder`, `Browser`, `WindowFrame`를 `seojaewan.com`의 현재 폴더/브라우저 UI와 맞추되, 데스크톱/모바일 기본 화면과 필요한 UI 상태 전환까지 포함한 UI-only parity를 고정한다.
- 이번 계획의 핵심 변경: 라이브 기준선과 비교 범위를 먼저 다시 잠그고, 그 위에서 셸/반응형 문법과 UI 상태 surface를 분리해 정렬한다. `Folder`는 host-driven chip surface를, `Browser`는 prop-driven address dropdown item surface를 받되 실제 앱 동작은 열지 않는다.
- 완료되면 달라지는 점: `packages/ui`의 windows 컴포넌트와 Storybook compare surface가 라이브 셸 구조, 툴바 문법, 모바일 축약 규칙, 내부 open state, edge-state 검증 경계를 같은 계약으로 공유한다.
- 제외 범위: 실제 URL 이동, 실제 파일/폴더 열기, 더블클릭 의미, resize/drag/minimize/maximize 동작, 세션/윈도우 매니저 연동, `interactive/windows/*`로의 이동, 내부 chip 선택에 따른 데이터 filtering

## 사전 합의

| 항목 | 합의 내용 | 적용 범위 | 메모 |
| --- | --- | --- | --- |
| 수정 범위 | 수정 위치는 `packages/ui/src/components/windows/**`로 제한한다. | 전체 | `interactive/windows/*`는 read-only 참고 범위다. |
| 목표 수준 | 목표는 runtime parity가 아니라 UI-only parity이며, 데스크톱/모바일 기본 화면과 필요한 UI 상태 전환까지 포함한다. | 전체 | 상태 전환은 시각적 affordance와 controlled contract 범위까지만 다룬다. |
| 동작 제외 | 실제 URL 이동, 실제 파일/폴더 열기, 더블클릭 의미, 창 이동/리사이즈, 세션 연동은 이번 계획 밖이다. | 전체 | callback은 host handoff만 담당하고 내부 app behavior는 만들지 않는다. |
| 제어 전략 | controllable value는 controlled + default 패턴으로 열고, controlled prop이 항상 default/internal state보다 우선한다. | Phase 3, Phase 5 | state winner rule은 테스트 파생 가능하게 명시한다. |
| Folder chip surface | `Folder` chip UI는 host-driven model로 고정한다. chip 목록은 prop으로 받고, 선택값은 외부 제어가 가능하며, callback은 선택 사실만 보고한다. | Phase 3, Phase 5 | chip 선택이 `entries`를 내부에서 filtering하지는 않는다. |
| Browser dropdown surface | `Browser` address dropdown item 목록은 prop으로 받고, 표시 주소는 계속 `addressLabel`이 소유한다. | Phase 3, Phase 5 | open/focus visual state는 public controlled prop으로 열지 않는다. |
| host handoff 규칙 | chip activation과 address dropdown item activation에서 callback이 유일한 host handoff다. invalid controlled/default id, repeated chip activation, `chips = []`, `addressDropdownItems = []`는 명시적 no-op 규칙을 가진다. | Phase 3, Phase 5 | filtering, navigation, body swap, route change는 callback 밖에서 열지 않는다. |
| 내부 open state | `Folder` search panel과 `Browser` address dropdown의 open/focus visual state는 internal-only state로 유지한다. | Phase 3, Phase 4, Phase 5 | compare/review story는 story-local harness로 이 상태를 재현할 수 있다. |
| 모바일 Folder 규칙 | 모바일 `Folder`는 라이브처럼 sidebar와 별도 search trigger를 제거하고 단일 address area만 보여 준다. | Phase 2, Phase 5 | desktop search affordance를 mobile에 복제하지 않는다. |
| edge-state 의무 | 긴 title, 긴 address, no chips, empty dropdown items 상태는 모두 계획 안에서 검증 가능하게 남긴다. | Phase 3, Phase 5 | synthetic edge state이며 canonical live compare state와는 분리할 수 있다. |
| edge validation surface | required edge state는 exact review Storybook recipient와 dedicated review inventory test로 잠근다. | Phase 3, Phase 5 | compare inventory와 별도로 `windowReviewInventory.test.tsx`가 silent drift를 막는다. |
| 라이브 기준 사실 | 2026-04-18 기준 라이브 `Folder`는 desktop에서 `nav + address input + search trigger`, mobile에서 단일 address area를 쓴다. 라이브 `Browser`는 desktop에서 `nav + address input`을 쓰고 address 클릭 시 dropdown-like panel이 열린다. | Phase 1 이후 전 단계 | 이번 plan의 baseline inventory가 이 사실을 plan-local evidence로 고정한다. |

## Phase 흐름 요약

| Phase | 역할 | 하는 일 | 끝나면 고정되는 상태 | 다음 단계 인계 |
| --- | --- | --- | --- | --- |
| Phase 1. 라이브 기준선과 UI 범위 고정 | external reference freeze | 라이브 기본 화면 4개와 desktop open state 2개를 plan-local baseline으로 고정하고, blocking compare focus와 synthetic edge-state 범위를 분리한다. | 이 task가 무엇을 live evidence로 삼고 무엇을 edge review로만 다룰지 더 이상 재해석할 필요가 없어진다. | exact state key, URL, viewport, blocking focus, review-only state taxonomy |
| Phase 2. 셸과 반응형 문법 고정 | shell parity | `WindowFrame`, `Folder`, `Browser`의 titlebar/tab/toolbar/layout 구조를 라이브 셸 방향으로 다시 맞추고 desktop/mobile 기본 화면 문법을 잠근다. | 기본 closed state의 chrome, sidebar policy, mobile 축약 규칙, content density가 package boundary 안에서 고정된다. | shell geometry, responsive rules, default closed-state recipient |
| Phase 3. UI 상태와 edge contract 고정 | stateful UI contract | chip/dropdown prop surface, internal open state harness, compare story inventory, synthetic edge-state review surface를 같은 계약으로 정렬한다. | controlled/default winner rule, callback-only host handoff, internal-only open state, compare story ID 6개, exact review story ID 6개, edge validation surface가 모두 확정된다. | exact compare story ID, exact review story ID, state winner rule, review validation boundary |
| Phase 4. 기준 비교 보고서 생성 | compare evidence | Phase 1 baseline과 Phase 2~3 current surface를 같은 key로 캡처해 diff/report로 남기고 blocking drift를 state별로 분리한다. | 기본 화면과 desktop open state에서 어떤 drift가 남는지 repo-local evidence가 생긴다. | exact mismatch key와 drift category, 또는 pass/no-op result |
| Phase 5. 시각 드리프트 마감 | in-scope drift closure | compare report가 지적한 blocking drift만 `packages/ui/src/components/windows/**` 안에서 닫고 같은 inventory로 재검증한다. | UI-only parity 범위 안의 최종 pass 또는 explicit blocker가 남고, 이후 구현/테스트 materialize가 같은 계약을 그대로 사용한다. | final compare evidence와 implementation handoff |

## 단계별 실행

### Phase 1. 라이브 기준선과 UI 범위 고정

- 목적: 이번 plan이 의존할 live reference state와 UI-only acceptance 범위를 plan-local artifact로 먼저 고정한다.
- 왜 먼저 하는가: desktop open state와 synthetic edge state를 섞어 버리면 이후 셸 수정과 상태 surface 설계가 계속 흔들린다.
- 시작 조건: `state.json.preflight.complete = true`
- 핵심 변경: `folder/desktop-blog`, `folder/desktop-search-open`, `folder/mobile-blog`, `browser/desktop-article`, `browser/desktop-address-open`, `browser/mobile-article` 6개 live reference state의 URL, viewport, open-state trigger, blocking focus를 `baseline-inventory.md`에 고정하고, 긴 title/address와 no chips/empty dropdown 같은 synthetic edge state는 compare inventory 밖 review surface로 분리한다.
- 완료 조건: baseline inventory만 읽어도 live compare state 6개와 review-only edge state를 다시 추측할 필요가 없어야 한다.
- 다음 단계로 넘기는 것: exact state key 6개, exact viewport, open-state trigger note, blocking focus, edge-state negative scope
- 상세 문서: `./phases/01-live-reference-and-ui-scope-lock.md`

### Phase 2. 셸과 반응형 문법 고정

- 목적: public state surface를 다시 열기 전에 라이브 셸 구조와 기본 responsive 문법을 먼저 정렬한다.
- 왜 이 단계가 필요한가: layout parity와 state parity를 한 번에 섞으면 어떤 drift가 chrome 문제인지 state surface 문제인지 분리되지 않는다.
- 시작 조건: Phase 1에서 live state key와 blocking focus가 고정돼 있어야 한다.
- 핵심 변경: `WindowFrame`의 titlebar/tab/address geometry를 라이브 방향으로 얇고 단순한 셸로 옮기고, `Folder` desktop 기본 화면은 `nav + address input + search trigger` 문법을 갖되 mobile에서는 sidebar와 별도 search trigger 없이 단일 address area만 남긴다. `Browser` 기본 화면은 `nav + address input` 셸과 body boundary만 package-owned로 맞춘다.
- 완료 조건: default closed state 기준으로 desktop/mobile 셸 구조와 content density를 `packages/ui/src/components/windows/**`만 읽고 설명할 수 있어야 한다.
- 다음 단계로 넘기는 것: stable shell marker, responsive closed-state layout, mobile Folder 축약 규칙, Browser shell/body boundary
- 상세 문서: `./phases/02-shell-and-responsive-grammar-lock.md`

### Phase 3. UI 상태와 edge contract 고정

- 목적: host-driven chip/dropdown surface와 internal-only open state를 UI-only 범위 안에서 테스트 가능하게 고정한다.
- 왜 이 단계가 필요한가: compare phase가 desktop open state를 캡처하려면 exact story recipient와 state winner rule이 먼저 닫혀 있어야 한다.
- 시작 조건: Phase 2의 closed-state shell과 responsive 규칙이 고정돼 있어야 한다.
- 핵심 변경: `Folder`에 chip 목록/선택 surface와 default-selected contract를 추가하되 internal filtering은 막고 callback-only host handoff와 no-op rule을 함께 고정한다. `Browser`에는 address dropdown items를 prop-driven surface로 추가하고 valid activation callback contract를 명시한다. desktop open state는 story-local harness로 재현하고 public open prop은 만들지 않는다. compare story inventory는 6개 live state로 고정하고, 긴 title/address, no chips, empty dropdown items는 exact review story recipient 6개와 dedicated review inventory test로 남긴다.
- 완료 조건: prop 이름, controlled/default winner rule, callback/no-op contract, internal open-state policy, compare story ID, review story ID, edge validation surface를 Phase 3 문서만 읽고 재해석 없이 설명할 수 있어야 한다.
- 다음 단계로 넘기는 것: exact compare story ID 6개, exact review story ID 6개, exact state winner rule, callback-only host handoff contract, Storybook/review validation boundary
- 상세 문서: `./phases/03-ui-state-and-edge-contract-lock.md`

### Phase 4. 기준 비교 보고서 생성

- 목적: live baseline과 current package surface를 같은 key로 대조해 drift를 state별 evidence로 남긴다.
- 왜 이 단계가 필요한가: final closure는 기억이나 감상 대신 exact mismatch key와 drift category를 받아야 한다.
- 시작 조건: Phase 1 baseline inventory와 Phase 3 compare story inventory가 모두 exact key로 잠겨 있어야 한다.
- 핵심 변경: plan folder 안의 capture/diff/report artifact를 6개 state key에 맞춰 생성하고, desktop open state까지 포함한 blocking drift를 shell/layout/state-affordance 기준으로 기록한다.
- 완료 조건: `visual-compare/report.md`가 6개 compare state의 baseline/current/diff provenance와 blocking drift 요약을 exact key로 남겨야 한다.
- 다음 단계로 넘기는 것: exact mismatch key와 drift category, 또는 final pass/no-op compare result
- 상세 문서: `./phases/04-reference-compare-report.md`

### Phase 5. 시각 드리프트 마감

- 목적: compare report가 지적한 in-scope blocking drift만 닫고 같은 inventory로 최종 상태를 고정한다.
- 왜 마지막 단계인가: 이 단계는 Phase 2~4가 고정한 계약을 다시 열지 않고 남은 차이만 정리해야 하기 때문이다.
- 시작 조건: Phase 4 compare report가 exact mismatch key를 남겨야 한다.
- 핵심 변경: `packages/ui/src/components/windows/**` 안에서 shell/layout/state-affordance drift만 수정하고, controlled/default winner rule, callback-only host handoff, review story recipient 6개, internal-only open-state policy는 그대로 유지한 채 같은 inventory와 review validation surface로 재검증한다.
- 완료 조건: final compare evidence가 6개 live state 모두에 대해 pass 또는 explicit blocker를 exact key로 기록해야 한다.
- 최종 산출물: UI-only parity 범위의 최종 compare evidence, 유지된 public surface 계약, 이후 `plan-materialize`가 그대로 쓸 state/input/output contract
- 상세 문서: `./phases/05-visual-drift-closure.md`

## 체크포인트

- [ ] Phase 1 완료 시 live compare state 6개와 review-only edge state 범위가 plan-local baseline inventory로 고정된다.
- [ ] Phase 2 완료 시 default closed state 기준 셸 구조, toolbar grammar, mobile Folder 축약 규칙이 `packages/ui/src/components/windows/**` 안에서 설명 가능해진다.
- [ ] Phase 3 완료 시 chip/dropdown prop surface, controlled/default winner rule, callback-only host handoff, internal-only open state, compare story ID 6개, review story ID 6개, edge-state validation surface가 모두 고정된다.
- [ ] Phase 4 완료 시 6개 live compare state의 baseline/current/diff/report evidence가 exact key로 남는다.
- [ ] Phase 5 완료 시 같은 6개 state inventory로 final pass 또는 explicit blocker가 기록된다.
