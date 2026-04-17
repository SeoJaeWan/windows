# Baseline Capture Inventory

Phase 1 기준 baseline capture 목록. 모든 artifact는 `external-source evidence`로 분류됨.

| State Key | Source URL | Viewport | Provenance | Capture Filename | State Role |
|---|---|---|---|---|---|
| `folder/desktop-blog` | https://seojaewan.com/blog | 1280×750 (원본 1280×800, 하단 50px taskbar 크롭) | external-source evidence | `folder-desktop-blog.png` | 블로그 폴더 뷰 desktop — Windows 탐색기 스타일 그리드 레이아웃, 사이드바 네비게이션 |
| `folder/mobile-blog` | https://seojaewan.com/blog | 390×794 (원본 390×844, 하단 50px taskbar 크롭) | external-source evidence | `folder-mobile-blog.png` | 블로그 폴더 뷰 mobile — 2열 그리드, 타이틀바 포함 |
| `browser/desktop-article` | https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0 | 1280×750 (원본 1280×800, 하단 50px taskbar 크롭) | external-source evidence | `browser-desktop-article.png` | 아티클 상세 뷰 desktop — Windows 브라우저 프레임, 본문 콘텐츠 |
| `browser/mobile-article` | https://www.seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0 | 390×794 (원본 390×844, 하단 50px taskbar 크롭) | external-source evidence | `browser-mobile-article.png` | 아티클 상세 뷰 mobile — 타이틀바 포함, 스크롤 가능한 본문 |

## 캡처 일시

2026-04-17

## Canonical acceptance scope

이 plan의 canonical acceptance state는 위 4개뿐이다.

- `folder/desktop-blog`
- `folder/mobile-blog`
- `browser/desktop-article`
- `browser/mobile-article`

## Canonical filename 규칙

`{kind}-{state}.png` — e.g., `folder-desktop-blog.png`

## Capture scope 정책

모든 baseline 이미지는 **window 컴포넌트 영역만** 포함한다 (taskbar 및 desktop background 제외).
크롭 기준: 원본 이미지 하단 50px taskbar 제거.

- Desktop (1280×800 원본): 크롭 결과 1280×750
- Mobile (390×844 원본): 크롭 결과 390×794
