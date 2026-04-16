# Phase 1. 기준 baseline capture 고정

> 이 문서는 external live reference의 canonical 6 state를 implementation 전에 repo-local baseline capture와 provenance inventory로 고정하는 실행용 상세 계약이다.
> 이 phase는 reference evidence만 고정하고 product code를 수정하지 않는다.

## 컨트롤러 다이제스트

| 항목 | 내용 |
| --- | --- |
| 한 줄 목표 | canonical 6 state의 external baseline capture와 provenance inventory를 plan folder 안에 먼저 고정한다. |
| 선행조건 | `none` |
| 완료 판단 | `reference-captures/` 아래에 canonical 6 state 이미지가 있고, `baseline-inventory.md`가 각 state의 route/viewport/provenance를 설명한다. |
| 중단 조건 | external route가 canonical state를 더는 재현하지 못하거나, state key/viewport를 둘 이상으로 해석해야 하는 새 정책이 생기면 재계획한다. |

### 파일별 작업

| 파일 | 작업 방식 | 사전 정의 | 완료 조건 |
| --- | --- | --- | --- |
| `plans/windows-ui-folder-browser-window-family/reference-captures/baseline-inventory.md` | 추가 | canonical 6 state, source URL, viewport, provenance type, capture file recipient를 한 문서에 고정해야 한다. | inventory만 읽어도 여섯 state의 baseline provenance를 재현할 수 있다. |
| `plans/windows-ui-folder-browser-window-family/reference-captures/` | 추가/정리 | baseline 이미지는 canonical 6 state와 1:1로 대응하는 external-source evidence여야 한다. | 여섯 state 모두에 대응하는 image artifact가 존재한다. |

### 완료 증거

- `baseline-inventory.md`가 canonical 6 state를 모두 나열한다.
- 각 baseline image가 state key와 viewport를 식별할 수 있는 이름이나 inventory mapping을 가진다.
- 이 phase가 product code를 수정하지 않았다는 점이 inventory note나 handoff에 남는다.

- owner_agent: `visual-comparator`
- 목적:
  - later implementation과 compare가 live site 재탐색 대신 같은 pinned baseline evidence를 쓰게 한다.
- boundary:
  - primary write target: `plans/windows-ui-folder-browser-window-family/reference-captures/baseline-inventory.md`
  - primary write target: `plans/windows-ui-folder-browser-window-family/reference-captures/`
  - read-only external source: `https://seojaewan.com/blog`
  - read-only external source: `https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0`
  - read-only external source: `https://www.seojaewan.com/blog/__windows-ui-folder-browser-window-family-missing__`
- input:
  - 시나리오: maintainer가 external live reference를 acceptance guidance로 쓰기 전에 canonical state별 baseline capture를 repo-local artifact로 얼리는 경우
  - exact baseline inventory:
    - `folder/desktop-default` -> `/blog` desktop viewport
    - `folder/mobile-collapsed` -> `/blog` mobile viewport
    - `browser/desktop-article` -> article route desktop viewport
    - `browser/mobile-article` -> article route mobile viewport
    - `browser/desktop-not-found` -> fixed missing slug route desktop viewport
    - `browser/mobile-not-found` -> fixed missing slug route mobile viewport
  - provenance rule:
    - baseline capture는 `external-source evidence`로 분류한다.
    - live URL 설명만 남기고 image를 생략하면 안 된다.
- output:
  - 공개 계약:
    - canonical 6 state baseline은 repo-local image artifact와 `baseline-inventory.md`로 고정된다.
    - later compare와 fix phase는 이 baseline inventory key를 acceptance source로 쓴다.
  - 내부 기본값:
    - inventory 문서는 state key, source URL, viewport, provenance type, capture file명을 표로 남긴다.
    - desktop/mobile viewport는 later compare와 같은 naming을 사용한다.
  - 중요한 negative output:
    - 이 phase는 `packages/ui` source, stories, tests를 수정하지 않는다.
    - repo-local story capture를 baseline evidence로 대체하지 않는다.
    - 한 장의 screenshot으로 여러 state를 대표시키지 않는다.
- 제약:
  - named external reference state는 모두 image artifact가 있어야 한다.
  - later compare는 Phase 1 baseline을 읽고 진행해야 하며 live site 재탐색을 acceptance prerequisite로 다시 만들면 안 된다.
- side effects:
  - plan folder 아래에 baseline image assets와 provenance inventory가 생긴다.
  - Phase 5 compare report가 baseline provenance를 명시적으로 인용할 수 있다.
- failure/validation: baseline inventory에 여섯 state 중 하나라도 빠지거나 provenance type을 external-source evidence로 명시하지 않으면 later compare가 acceptance baseline을 잃으므로 blocker다.
- 작업:
  - canonical 6 state의 external baseline capture를 만든다.
  - state key, source URL, viewport, provenance를 `baseline-inventory.md`에 기록한다.
  - later compare가 그대로 재사용할 naming을 고정한다.
- 검증:
  - [ ] `baseline-inventory.md`가 canonical 6 state를 모두 나열해야 한다.
  - [ ] `reference-captures/` 아래에 여섯 state 대응 image artifact가 있어야 한다.
  - [ ] 각 artifact가 `external-source evidence` provenance로 분류돼야 한다.
