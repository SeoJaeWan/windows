# Phase 4. live 기준 시각 비교 증거 수집

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| owner_agent | `visual-comparator` |
| 목적 | canonical compare inventory를 기준으로 live reference와 current story canvas를 1:1로 비교하는 증거 세트를 만든다. |
| boundary | `plans/windows-ui-folder-browser-live-ui-storybook-refresh/reference-captures/**`, `plans/windows-ui-folder-browser-live-ui-storybook-refresh/capture-current.mjs`, `plans/windows-ui-folder-browser-live-ui-storybook-refresh/visual-compare/**` |
| input | phase 2와 phase 3에서 고정한 exact story ID, state key, windows 내부 compare stage marker, external-source evidence 기준이 준비되어 있어야 한다. |
| output | state key별 baseline provenance, current capture, diff image, mismatch 분류, compare report가 같은 slug 아래에 남는다. |
| 작업 | baseline inventory를 작성하고, exact story ID와 stage marker를 이용한 current capture를 수행한 뒤, state key별 diff/report artifacts를 같은 plan slug 아래에 남긴다. |
| 검증 | 아래 완료 증거 체크리스트를 완료한다. |

## 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-ui-storybook-refresh/reference-captures/baseline-inventory.md` | 6개 canonical state의 reference provenance와 매핑 규칙을 기록한다. | state key별 reference 출처와 매핑 규칙이 문서로 고정된다. | baseline inventory 점검을 통과한다. |
| `plans/windows-ui-folder-browser-live-ui-storybook-refresh/capture-current.mjs` | exact story ID와 `[data-window-compare-stage]`를 이용해 current story canvas를 캡처한다. | current capture가 windows storybook의 canonical stage marker를 사용한다. | capture run이 통과한다. |
| `plans/windows-ui-folder-browser-live-ui-storybook-refresh/visual-compare/report.md` | compare 요약과 mismatch 분류를 기록한다. | diff 결과를 사람이 검토 가능한 문서로 남긴다. | compare report 점검을 통과한다. |
| `plans/windows-ui-folder-browser-live-ui-storybook-refresh/visual-compare/diff-results.json` | state key별 정량/정성 diff 결과를 구조화한다. | 기계 판독 가능한 compare 결과가 남는다. | compare report 점검을 통과한다. |
| `plans/windows-ui-folder-browser-live-ui-storybook-refresh/visual-compare/*.png` | reference/current/diff 이미지를 state key별로 남긴다. | 시각 증거 파일이 state key 기준으로 남는다. | compare report 점검을 통과한다. |

## 완료 증거

- [ ] baseline inventory가 `folder/desktop-card`, `folder/desktop-search-open`, `folder/mobile-card`, `browser/desktop-chrome`, `browser/desktop-address-open`, `browser/mobile-chrome` 6개 state를 모두 포함한다.
- [ ] current capture가 exact compare story ID와 `[data-window-compare-stage]` marker를 사용한다.
- [ ] `visual-compare/report.md`가 각 state의 reference/current/diff와 mismatch 분류를 한 번에 보여준다.
- [ ] compare provenance는 `external-source evidence`로 기록되고 package-local proxy reference로 대체되지 않는다.
- [ ] phase 5가 consume할 수 있도록 mismatch key와 drift 범주가 report와 diff-results에 그대로 남는다.
- [ ] 6개 canonical state 모두 reference/current/diff evidence를 가진다.
- [ ] current capture와 baseline provenance가 같은 state key 체계로 연결된다.
- [ ] phase 5가 그대로 소비할 수 있는 mismatch report가 남는다.
