# Phase 1. 라이브 기준선 고정

> 이 문서는 `Folder` / `Browser` live contract lock의 external baseline을 새 plan folder 안에 다시 고정하는 실행용 상세 계약이다.
> old plan artifact를 acceptance source로 재사용하지 않고, 2026-04-17 live rendering과 exact four-state inventory만 새 런의 출발점으로 삼는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | 2026-04-17 live rendering 기준의 exact 4-state baseline, provenance, viewport, visual tolerance rule을 새 plan folder 안에 고정한다. |
| 선행조건 | `none` |
| 완료 판단 | `reference-captures/baseline-inventory.md`와 baseline image 4개만 열어도 exact URL, exact state key, exact viewport, blocking/non-blocking visual rule을 다시 추정할 필요가 없다. |
| 중단 조건 | canonical state를 4개보다 넓혀야 하거나, baseline provenance를 old plan capture 또는 package-local proxy로 섞어야만 compare를 진행할 수 있다면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-live-contract-lock/reference-captures/baseline-inventory.md` | 추가 | canonical baseline key는 `folder/desktop-blog`, `folder/mobile-blog`, `browser/desktop-article`, `browser/mobile-article` 네 개뿐이다. baseline provenance는 모두 `external-source evidence`다. | exact URL, 2026-04-17 capture date, viewport, provenance, blocking/non-blocking visual rule이 각 row에 적혀 있다. |
| `plans/windows-ui-folder-browser-live-contract-lock/reference-captures/` | 추가 | baseline image는 exact four-state key에 1:1로 대응해야 하며 old plan capture를 복사해 이름만 바꾸면 안 된다. | `folder-desktop-blog.png`, `folder-mobile-blog.png`, `browser-desktop-article.png`, `browser-mobile-article.png`가 새 plan folder 안에 존재한다. |

### 완료 증거

- `baseline-inventory.md`가 exact state key 4개만 나열한다.
- `baseline-inventory.md`가 `font 차이 = non-blocking`, `geometry/chrome/spacing/responsive/thumbnail ratio = blocking` 규칙을 명시한다.
- baseline image 4개가 모두 `plans/windows-ui-folder-browser-live-contract-lock/reference-captures/` 아래에 있다.

- owner_agent: `visual-comparator`
- 목적:
  - 새 런의 compare acceptance source를 old plan continuity가 아니라 exact live evidence로 다시 고정한다.
- boundary:
  - primary write target: `plans/windows-ui-folder-browser-live-contract-lock/reference-captures/baseline-inventory.md`
  - primary write target: `plans/windows-ui-folder-browser-live-contract-lock/reference-captures/`
  - read-only context: `plans/windows-ui-folder-browser-live-fidelity-repair/reference-captures/`
  - read-only context: `plans/windows-ui-folder-browser-window-family/reference-captures/`
- input:
  - 시나리오: maintainer가 `packages/ui` 구현과 later compare의 기준선을 새 런 기준으로 다시 고정하려는 경우
  - exact live sources:
    - `folder/desktop-blog` → `https://seojaewan.com/blog`
    - `folder/mobile-blog` → `https://seojaewan.com/blog`
    - `browser/desktop-article` → `https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`
    - `browser/mobile-article` → `https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`
  - exact capture date:
    - 2026-04-17
  - exact viewport policy:
    - desktop: `1280x750`
    - mobile: `390x794`
- output:
  - 공개 계약:
    - canonical compare inventory는 exact four-state key만 가진다.
    - baseline provenance는 네 case 모두 `external-source evidence`다.
    - font 차이는 non-blocking이고 geometry, chrome, spacing, responsive behavior, thumbnail ratio 차이는 blocking visual drift다.
  - 내부 기본값:
    - baseline image filename은 `{kind}-{state}.png` 규칙을 따른다.
    - baseline inventory는 exact date와 viewport를 각 case row에 적는다.
  - 중요한 negative output:
    - `browser/*-not-found` baseline을 다시 canonical inventory에 넣지 않는다.
    - old plan capture를 새 plan baseline으로 간주하지 않는다.
    - package-local Storybook capture를 external baseline label로 승격하지 않는다.
- 선행조건:
  - `none`
- 제약:
  - compare acceptance 기준은 exact 4-state inventory를 유지해야 한다.
  - later compare가 다른 viewport를 쓰지 않도록 desktop/mobile viewport를 여기서 먼저 잠가야 한다.
- side effects:
  - Phase 2 story stage와 Phase 3 compare script가 같은 viewport와 key naming을 사용하게 된다.
  - final report의 blocking/non-blocking 해석 경계가 여기서 먼저 고정된다.
- failure/validation:
  - canonical state 수가 네 개를 넘어가면 user-confirmed acceptance boundary를 어기므로 blocker다.
  - baseline provenance가 external evidence와 old plan/package-local proxy를 섞으면 later compare report의 의미가 흐려지므로 blocker다.
- 작업:
  - live URL 두 개를 desktop/mobile viewport로 캡처해 canonical 4-state baseline image를 남긴다.
  - 각 case의 exact URL, capture date, viewport, provenance, visual tolerance rule을 inventory 문서에 적는다.
  - old plan artifact는 read-only 참고로만 두고 새 acceptance source로 연결하지 않는다.
- 검증:
  - [ ] `reference-captures/baseline-inventory.md`가 exact state key 4개만 나열한다.
  - [ ] `reference-captures/` 아래에 baseline image 4개가 존재한다.
  - [ ] inventory 문서가 2026-04-17 date, exact live URL, exact viewport, blocking/non-blocking visual rule을 모두 포함한다.
