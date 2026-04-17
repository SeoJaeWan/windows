# Missing Slug Observation

## Observation

| Field | Value |
|---|---|
| Observation date | 2026-04-16 |
| Bare domain URL | `https://seojaewan.com/blog/__windows-ui-folder-browser-window-family-missing__` |
| WWW domain URL | `https://www.seojaewan.com/blog/__windows-ui-folder-browser-window-family-missing__` |
| Observed HTTP status | 404 |

## Deferred rationale

이 슬러그는 old plan(`windows-ui-folder-browser-window-family`)에서 `browser/desktop-not-found` 및 `browser/mobile-not-found` baseline 캡처에 사용된 테스트용 URL이다.

2026-04-16 기준으로 bare domain, www domain 양쪽 모두 HTTP 404를 반환함을 확인했다. 이는 Next.js 앱 레벨 404 페이지가 아닌 라우팅 단에서 처리됨을 의미한다.

이번 repair plan(`windows-ui-folder-browser-live-fidelity-repair`)의 canonical acceptance scope는 아래 4개 state만 포함한다:

- `folder/desktop-blog`
- `folder/mobile-blog`
- `browser/desktop-article`
- `browser/mobile-article`

**old plan의 `browser/desktop-not-found` 및 `browser/mobile-not-found` baseline은 이번 plan canonical acceptance로 승계하지 않는다.** not-found state의 component 설계는 별도 plan에서 다룬다.
