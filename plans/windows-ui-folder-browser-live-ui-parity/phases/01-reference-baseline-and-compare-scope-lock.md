# Phase 1. 라이브 기준선과 비교 초점 고정

> 이 문서는 `windows-ui-folder-browser-live-ui-parity` task가 실제로 따를 external reference와 compare scope를 먼저 plan-local artifact로 고정하는 실행용 상세 계약이다.
> baseline evidence와 blocking/documentary 분류만 다루며, `packages/ui` source는 건드리지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | canonical 4-state live baseline과 structural parity compare scope를 이번 plan folder 안에 다시 고정한다. |
| 선행조건 | `none` |
| 완료 판단 | `baseline-inventory.md`만 읽어도 exact state key, exact viewport, exact provenance, exact blocking/documentary scope를 다시 추측할 필요가 없다. |
| 중단 조건 | canonical state 수가 4개를 벗어나거나, Folder와 Browser의 blocking/documentary 경계가 여전히 암묵적이면 이 phase는 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 합의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-ui-parity/reference-captures/baseline-inventory.md` | 추가 | canonical baseline은 exact 4-state만 가진다. 각 row는 source URL, capture date, viewport, provenance, blocking focus, documentary-only drift를 함께 적어야 한다. | reviewer가 이 문서 하나로 compare scope를 literal하게 설명할 수 있다. |
| `plans/windows-ui-folder-browser-live-ui-parity/reference-captures/` | 추가 | baseline image는 모두 `external-source evidence`여야 하며 old plan capture나 package-local proxy로 대체하면 안 된다. | `folder-desktop-blog.png`, `folder-mobile-blog.png`, `browser-desktop-article.png`, `browser-mobile-article.png`가 exact key와 1:1로 대응한다. |

### 완료 증거

- canonical baseline inventory가 exact 4-state만 나열한다.
- 각 baseline row가 `2026-04-17`, exact live URL, exact viewport, provenance를 함께 적는다.
- Folder structural scope와 Browser shell-only structural scope가 같은 문서 안에서 분리되어 있다.

## 실행 계약

- owner_agent: `visual-comparator`
- 목적:
  - 이전 plan의 mixed blocker wording을 끌고 오지 않고, 이번 task가 실제로 비교할 live evidence와 compare focus를 plan-local하게 다시 고정한다.
- 작업:
  1. `https://seojaewan.com/blog`와 `https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`에서 canonical 4-state baseline image를 fixed viewport로 캡처한다.
  2. `baseline-inventory.md`에 exact state key, exact URL, exact viewport, provenance, blocking structural focus, documentary-only drift를 기록한다.
  3. old plan report와 현재 user decision을 기준으로 negative scope를 명시해 later compare가 sample-content parity나 Browser body layout을 blocker로 다시 여는 일을 막는다.
- boundary:
  - primary write target: `plans/windows-ui-folder-browser-live-ui-parity/reference-captures/baseline-inventory.md`
  - primary write target: `plans/windows-ui-folder-browser-live-ui-parity/reference-captures/`
  - read-only context: `plans/windows-ui-folder-browser-live-contract-lock/reference-captures/baseline-inventory.md`
  - read-only context: `plans/windows-ui-folder-browser-live-contract-lock/visual-compare/report.md`
  - read-only context: `plans/windows-ui-folder-browser-live-fidelity-repair/visual-compare/report.md`
- input:
  - 시나리오: maintainer가 `packages/ui` structural live parity 작업을 시작하기 전에, 무엇을 baseline으로 고정하고 무엇을 blocker로 볼지 이번 task 기준으로 다시 정해야 하는 경우
  - exact canonical inventory:
    - `folder/desktop-blog` -> `https://seojaewan.com/blog`, `1280x750`
    - `folder/mobile-blog` -> `https://seojaewan.com/blog`, `390x794`
    - `browser/desktop-article` -> `https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`, `1280x750`
    - `browser/mobile-article` -> `https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`, `390x794`
  - exact compare-focus rule:
    - Folder blocking scope: thinner chrome, back/forward and address bar geometry, desktop sidebar hierarchy, mobile sidebar collapse policy, item tile ratio, tile density, spacing, desktop 3-column vs mobile 2-column structure
    - Folder documentary-only drift: exact blog title text, exact summary copy, exact thumbnail artwork, per-post content semantics
    - Browser blocking scope: thinner chrome, titlebar height, nav/address geometry, shell-to-body boundary offset, responsive shell spacing
    - Browser documentary-only drift: article hero asset, body typography, body copy, article padding and layout inside `children`
  - negative scope:
    - taskbar and desktop background
    - `browser/*-not-found`
    - separate live variant components
    - exact sample-content parity
- output:
  - 공개 계약:
    - canonical acceptance baseline은 exact 4-state만 가진다.
    - 모든 baseline artifact provenance는 `external-source evidence`다.
    - compare pass/fail은 structural blocking scope 기준으로만 닫힌다.
  - 파생 기본값:
    - Folder는 full window area 안에서 shell/sidebar/item grammar를 structural scope로 본다.
    - Browser는 same window area capture를 남기되 shell/chrome만 blocking scope로 보고 body는 documentary로 분류한다.
  - 중요 negative output:
    - old plan baseline이나 current Storybook capture를 baseline provenance로 승격하지 않는다.
    - `browser/*-not-found`를 canonical state로 다시 넣지 않는다.
    - taskbar나 desktop shell을 window-area acceptance 안으로 다시 넣지 않는다.
- 선행조건: `none`
- 제약:
  - capture date는 2026-04-17로 고정한다.
  - desktop/mobile viewport는 각각 `1280x750`, `390x794`로 고정한다.
  - baseline inventory는 support note 없이도 compare phase가 그대로 읽을 수 있게 literal wording으로 적어야 한다.
- side effects:
  - Phase 2 story inventory와 Phase 3 artifact naming이 같은 `kind/state` key를 그대로 재사용한다.
  - Phase 4에서 documentary drift만 남으면 pass로 닫을 수 있는 근거가 생긴다.
- failure/validation:
  - structural blocking scope와 documentary-only drift 구분이 row마다 명시되지 않으면 later compare가 다시 scope를 추측해야 하므로 blocker다.
  - canonical state 수가 4개보다 많거나 적으면 user-confirmed acceptance boundary를 깨므로 blocker다.
- 검증
  - [ ] `baseline-inventory.md`가 exact 4-state key, exact URL, exact viewport, provenance, blocking/documentary scope를 모두 적는다.
  - [ ] `reference-captures/` 아래 baseline image 4개가 exact key와 1:1로 존재한다.
  - [ ] `browser/*-not-found`, taskbar, exact sample-content parity가 negative scope로 분명하게 적혀 있다.
