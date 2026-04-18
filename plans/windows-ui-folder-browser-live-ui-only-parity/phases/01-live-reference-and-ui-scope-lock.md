# Phase 1. 라이브 기준선과 UI 범위 고정

> 이 문서는 `seojaewan.com`의 현재 folder/browser UI를 이번 plan 전용 baseline으로 고정하는 실행용 상세 계약이다.
> desktop open state와 synthetic edge state의 역할을 분리해 이후 phase가 같은 acceptance vocabulary를 공유하도록 만든다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | live compare state 6개와 review-only edge state 범위를 plan-local baseline inventory로 고정한다. |
| 선행조건 | `state.json.preflight.complete = true` |
| 완료 판단 | `baseline-inventory.md`만 읽어도 어떤 상태가 live compare 대상이고 어떤 상태가 review-only edge state인지 재추측이 필요 없어진다. |
| 중단 조건 | live open state를 재현할 수 없거나, desktop open state를 synthetic edge state와 구분하지 못하면 이후 phase가 같은 acceptance를 공유할 수 없으므로 blocker다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-ui-only-parity/reference-captures/baseline-inventory.md` | 추가 | live compare state 6개의 URL, viewport, capture date, open-state trigger, blocking focus, review-only negative scope를 한 문서에 고정한다. | baseline inventory가 state key별 역할과 compare/review 경계를 모두 설명한다. |
| `plans/windows-ui-folder-browser-live-ui-only-parity/reference-captures/` | 추가 | canonical live capture PNG는 `{kind}-{state}.png` 규칙으로 1:1 저장한다. | `folder-desktop-blog.png`, `folder-desktop-search-open.png`, `folder-mobile-blog.png`, `browser-desktop-article.png`, `browser-desktop-address-open.png`, `browser-mobile-article.png`가 존재한다. |

### 완료 증거

- baseline inventory가 2026-04-18 기준 live facts를 state key, URL, viewport, trigger note와 함께 기록한다.
- `Folder` desktop search-open과 `Browser` desktop address-open이 canonical compare state로 승격된다.
- 긴 title/address, no chips, empty dropdown items는 synthetic review-only state로 분리된다.
- 이후 phase가 어떤 state를 diff 대상으로 삼아야 하는지 plan-local artifact만으로 알 수 있다.

## 실행 계약

- owner_agent: `visual-comparator`
- 목적:
  - live site의 현재 folder/browser UI를 이번 task 전용 기준선으로 동결하고, UI-only compare 범위를 state key 단위로 닫는다.
- 작업 순서:
  1. `https://seojaewan.com/blog`와 `https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`를 기준으로 desktop/mobile 기본 화면과 desktop open state를 수집한다.
  2. state별 URL, viewport, open-state trigger, blocking focus, documentary-only drift를 `baseline-inventory.md`에 적는다.
  3. synthetic edge state를 compare inventory 밖 review surface로 명시하고 phase-local PNG 6개를 저장한다.
- boundary: plan-local `reference-captures/` artifact만 쓴다. 기존 parity plan의 baseline 문서는 참고만 하고 이번 plan의 provenance를 대체하지 못한다.
- input:
  - 시나리오: maintainer가 `packages/ui` windows 컴포넌트를 라이브 UI와 맞추기 전에 exact compare baseline과 review-only edge-state 범위를 고정해야 하는 경우
  - exact live compare state:
    - `folder/desktop-blog`
    - `folder/desktop-search-open`
    - `folder/mobile-blog`
    - `browser/desktop-article`
    - `browser/desktop-address-open`
    - `browser/mobile-article`
  - exact source URL:
    - `folder/*` → `https://seojaewan.com/blog`
    - `browser/*` → `https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`
  - viewport contract:
    - desktop compare state → `1280x750`
    - mobile compare state → `390x794`
  - open-state trigger note:
    - `folder/desktop-search-open` → desktop folder toolbar의 search trigger를 열어 chip/tag UI가 보이는 상태
    - `browser/desktop-address-open` → desktop browser address area를 눌러 dropdown-like suggestion panel이 보이는 상태
  - review-only edge state:
    - 긴 `title`
    - 긴 `addressLabel`
    - `Folder`의 no chips
    - `Browser`의 empty dropdown items
- output:
  - 공개 계약:
    - `baseline-inventory.md`는 exact state key 6개를 canonical live compare inventory로 적는다.
    - `baseline-inventory.md`는 synthetic edge state를 live compare 대상 밖 review surface로 적는다.
    - state별 blocking focus는 UI-only parity 범위만 다루고 runtime/app behavior는 포함하지 않는다.
  - 내부 기본값:
    - desktop open state는 baseline evidence에 포함되지만 public prop으로 제어된 상태로 해석하지 않는다.
    - mobile baseline은 closed/default shell과 absence rule을 기준으로 본다.
  - 허용하지 않는 대안:
    - old plan의 baseline inventory를 이번 plan의 authoritative provenance로 재사용하지 않는다.
    - live compare state를 4개 closed state만으로 축소하지 않는다.
    - synthetic edge state를 live reference state처럼 diff inventory에 섞지 않는다.
- 선행조건:
  - `state.json.preflight.review_wiki_root`와 current skill routing이 유효해야 한다.
- 제약:
  - capture date는 `2026-04-18`로 고정한다.
  - baseline artifact는 모두 이번 plan folder 아래에 남겨 later phase가 이전 plan artifact를 참조하지 않게 한다.
  - taskbar, desktop background, 실제 본문 copy, 실제 URL navigation 결과는 compare acceptance 밖이다.
- side effects:
  - Phase 4 compare script와 report가 exact state key 6개를 literal하게 사용할 수 있다.
  - Phase 3 edge-state taxonomy가 live compare inventory와 충돌하지 않는다.
- failure/validation:
  - desktop open state를 stable baseline으로 남기지 못하면 Phase 3 internal-open story contract가 흔들리므로 blocker다.
  - mobile Folder의 sidebar/search absence rule을 baseline에서 못 고정하면 responsive acceptance가 흔들리므로 blocker다.
  - blocking focus에 runtime behavior나 synthetic edge state가 섞이면 blocker다.
- 검증:
  - [ ] `reference-captures/baseline-inventory.md`가 state key 6개, URL, viewport, capture date, trigger note를 모두 기록한다.
  - [ ] `reference-captures/` 아래 PNG 6개가 `{kind}-{state}.png` 규칙으로 존재한다.
  - [ ] baseline inventory가 review-only edge state를 separate negative scope로 분리한다.
