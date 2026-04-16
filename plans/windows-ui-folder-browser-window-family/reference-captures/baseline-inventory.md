# Baseline Capture Inventory

Phase 1 기준 baseline capture 목록. 모든 artifact는 `external-source evidence`로 분류됨.

| State Key | Source URL | Viewport | Provenance Type | Capture Filename | Notes |
|---|---|---|---|---|---|
| `folder/desktop-default` | https://seojaewan.com/blog | 1280×800 | external-source evidence | `folder-desktop-default.png` | 블로그 폴더 뷰, Windows 탐색기 스타일 그리드 레이아웃 |
| `folder/mobile-collapsed` | https://seojaewan.com/blog | 390×844 | external-source evidence | `folder-mobile-collapsed.png` | 모바일 폴더 뷰, 2열 그리드, 하단 폴더 탭바 |
| `browser/desktop-article` | https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0 | 1280×800 | external-source evidence | `browser-desktop-article.png` | 아티클 상세 뷰 (2025를 보내며), Windows 브라우저 프레임 |
| `browser/mobile-article` | https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0 | 390×844 | external-source evidence | `browser-mobile-article.png` | 아티클 상세 뷰 모바일, 스크롤 가능한 콘텐츠 레이아웃 |
| `browser/desktop-not-found` | https://www.seojaewan.com/blog/__windows-ui-folder-browser-window-family-missing__ | 1280×800 | external-source evidence | `browser-desktop-not-found.png` | 존재하지 않는 슬러그 — 브라우저 수준 DNS 연결 오류 (URL_TYPO_FESTIVAL_DETECTED) |
| `browser/mobile-not-found` | https://www.seojaewan.com/blog/__windows-ui-folder-browser-window-family-missing__ | 390×844 | external-source evidence | `browser-mobile-not-found.png` | 존재하지 않는 슬러그 — 브라우저 수준 DNS 연결 오류 (URL_TYPO_FESTIVAL_DETECTED) |

## 캡처 일시

2026-04-16

## not-found state 관찰

`browser/desktop-not-found` 및 `browser/mobile-not-found`는 Next.js 404 페이지가 아닌 브라우저 수준 연결 오류 화면을 보여준다. `www.seojaewan.com` 서브도메인이 해당 슬러그를 DNS/네트워크 단에서 차단하거나 라우팅하지 못하는 상태임. 이는 현재 live production의 실제 동작이며 implementation phase에서 Next.js 404 컴포넌트 설계의 기준으로 활용한다.
