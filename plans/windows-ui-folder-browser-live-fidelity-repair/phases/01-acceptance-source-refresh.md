# Phase 1. 라이브 기준선 새로 고정

> 이 문서는 이번 repair가 실제로 따를 external visual reference를 새 plan folder 안에 다시 고정하는 실행용 상세 계약이다.
> 이 phase는 baseline evidence와 deferred observation만 다루고 `packages/ui` source는 수정하지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | canonical live-fidelity baseline 4개와 deferred missing-slug observation을 새 plan folder에 다시 고정한다. |
| 선행조건 | `none` |
| 완료 판단 | `baseline-inventory.md`는 canonical 4-state만 acceptance baseline으로 분류하고, `missing-slug-observation.md`는 2026-04-16 관찰값을 documentary/deferred로 설명한다. |
| 중단 조건 | `/blog` 또는 article route가 canonical state를 재현하지 못하거나, missing-slug 관찰값을 exact URL/date/status로 적지 못해 deferred 범위를 설명할 수 없으면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/baseline-inventory.md` | 추가 | canonical acceptance는 `folder/desktop-blog`, `folder/mobile-blog`, `browser/desktop-article`, `browser/mobile-article` 네 state만 포함한다. 각 row는 source URL, viewport, provenance, capture filename, state role을 적어야 한다. | reviewer가 inventory만 보고 canonical fidelity inventory 4개와 각 artifact recipient를 재현할 수 있다. |
| `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/missing-slug-observation.md` | 추가 | exact observation date는 `2026-04-16`, exact observation URL은 bare/www 두 도메인을 모두 남긴다. 이 문서는 canonical baseline이 아니라 documentary/deferred note다. | exact date, exact URL, observed HTTP status 404, deferred rationale, core Browser contract에 영향을 주지 않는다는 문장이 모두 적혀 있다. |
| `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/` | 추가/정리 | baseline image는 external-source evidence여야 한다. documentary support artifact가 있더라도 canonical baseline image와 같은 naming bucket에 섞이면 안 된다. | canonical 4-state baseline image가 1:1로 존재하고 documentary support가 있으면 별도 note나 구분된 파일명으로 분리돼 있다. |

### 완료 증거

- `baseline-inventory.md`가 canonical 4-state만 acceptance baseline으로 나열한다.
- `missing-slug-observation.md`가 `2026-04-16`과 exact URL, observed 404 status, deferred reason을 함께 남긴다.
- old plan의 `browser/*-not-found` baseline을 그대로 승계하지 않는다는 점이 문서에 분명히 적혀 있다.

- owner_agent: `visual-comparator`
- 목적:
  - 새 repair plan이 실제로 따를 external visual reference와, 이번 범위에서 compare하지 않을 missing-slug observation을 plan-local evidence로 분리한다.
- boundary:
  - primary write target: `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/baseline-inventory.md`
  - primary write target: `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/missing-slug-observation.md`
  - primary write target: `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/`
  - read-only external source: `https://seojaewan.com/blog`
  - read-only external source: `https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`
  - read-only external observation source: `https://seojaewan.com/blog/__windows-ui-folder-browser-window-family-missing__`
  - read-only external observation source: `https://www.seojaewan.com/blog/__windows-ui-folder-browser-window-family-missing__`
  - read-only context: `plans/windows-ui-folder-browser-window-family/reference-captures/baseline-inventory.md`
- input:
  - 시나리오: maintainer가 live site fidelity를 기준으로 새 repair를 시작하기 전에, 무엇이 canonical baseline이고 무엇이 documentary support인지 이번 plan folder 안에서 다시 고정하려는 경우
  - canonical fidelity inventory:
    - `folder/desktop-blog` -> `/blog` desktop window crop
    - `folder/mobile-blog` -> `/blog` mobile window crop
    - `browser/desktop-article` -> `/blog/2025를-보내며` desktop window crop
    - `browser/mobile-article` -> `/blog/2025를-보내며` mobile window crop
  - deferred observation:
    - missing-slug route는 2026-04-16 기준 bare/www 도메인 관찰값만 남기고 core Browser acceptance inventory에는 넣지 않는다.
- output:
  - 공개 계약:
    - canonical acceptance baseline은 `folder/desktop-blog`, `folder/mobile-blog`, `browser/desktop-article`, `browser/mobile-article` 네 state뿐이다.
    - 각 canonical baseline artifact는 `external-source evidence` provenance를 가져야 한다.
    - missing-slug 관찰은 exact date와 URL을 가진 documentary/deferred note로만 남는다.
  - 내부 기본값:
    - canonical window crop target은 desktop `1280x750`, mobile `390x794`를 기준으로 later compare와 같은 geometry를 쓴다.
    - canonical filename은 later compare가 같은 `kind/state` key를 그대로 따라갈 수 있게 정한다.
  - 중요한 negative output:
    - old plan의 `browser/desktop-not-found`, `browser/mobile-not-found` artifact를 이번 plan의 canonical baseline으로 그대로 재사용하지 않는다.
    - missing-slug note를 `Browser` public API나 404 전용 prop 설계 근거로 승격하지 않는다.
    - package-local story capture를 baseline provenance처럼 `reference`로 부르지 않는다.
- 제약:
  - canonical baseline inventory는 phase 안에서 늘어나지 않는다.
  - documentary support는 canonical fidelity inventory를 다시 열지 않는다.
- side effects:
  - later compare phase가 live URL 재탐색 대신 Phase 1 artifact를 읽게 된다.
  - not-found handling은 이번 repair의 core pass/fail inventory에서 빠진 채, exact observation note로만 남는다.
- failure/validation:
  - missing-slug observation이 old plan의 DNS/connection-error note와 달라졌더라도, 그 차이를 explicit deferred note로 기록하지 않으면 stale acceptance를 다시 plan에 들이게 되므로 blocker다.
  - canonical baseline 4개 중 하나라도 provenance, viewport, filename mapping이 빠지면 later compare가 state key를 잃으므로 blocker다.
- 작업:
  - `/blog`와 article route의 desktop/mobile window 영역을 canonical baseline image로 고정한다.
  - exact state key, source URL, viewport, provenance, capture filename을 `baseline-inventory.md`에 기록한다.
  - missing-slug route는 bare/www 두 도메인 모두에 대해 exact date와 observed status를 기록하고, 왜 deferred인지 `missing-slug-observation.md`에 남긴다.
  - old plan의 `browser/*-not-found` baseline이 이번 plan의 canonical acceptance가 아니라는 점을 explicit note로 적는다.
- 검증:
  - [ ] `baseline-inventory.md`가 canonical 4-state와 각 source URL, viewport, provenance, filename을 모두 나열한다.
  - [ ] `missing-slug-observation.md`에 `2026-04-16`, bare/www exact URL, observed HTTP 404 status, deferred rationale가 적혀 있다.
  - [ ] canonical baseline image 4개가 `reference-captures/` 아래에 존재하고 later compare가 같은 key naming을 그대로 따라갈 수 있다.
