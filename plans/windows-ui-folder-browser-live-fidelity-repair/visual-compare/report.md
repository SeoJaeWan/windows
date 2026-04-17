# Phase 4 Visual Compare Report

## Canonical 4-state Inventory

| kind/state | baseline provenance | current provenance | size match | diff result | verdict |
|---|---|---|---|---|---|
| folder/desktop-blog | external-source evidence (seojaewan.com/blog, 1280x750) | package-local current (Windows/Folder CompareDesktopBlog, worktree Storybook) | yes (1280x750) | 19.80% mismatch (190118/960000 px) | MISMATCH |
| folder/mobile-blog | external-source evidence (seojaewan.com/blog, 390x794) | package-local current (Windows/Folder CompareMobileBlog, worktree Storybook) | yes (390x794) | 23.71% mismatch (73413/309660 px) | MISMATCH |
| browser/desktop-article | external-source evidence (seojaewan.com/blog/2025-article, 1280x750) | package-local current (Windows/Browser CompareDesktopArticle, worktree Storybook) | yes (1280x750) | 11.00% mismatch (105573/960000 px) | MISMATCH |
| browser/mobile-article | external-source evidence (seojaewan.com/blog/2025-article, 390x794) | package-local current (Windows/Browser CompareMobileArticle, worktree Storybook) | yes (390x794) | 17.70% mismatch (54798/309660 px) | MISMATCH |

pixelmatch threshold: 0.2

## Deferred / Out-of-inventory

- `browser/desktop-not-found`, `browser/mobile-not-found`: deferred -- missing-slug handling은 core Browser acceptance inventory에 포함되지 않는다. (Phase 1 missing-slug-observation.md 참조)

## Mismatch Details

### folder/desktop-blog -- 19.80% mismatch

diff artifact: visual-compare/folder-desktop-blog-diff.png

- Layout structure: baseline은 Windows Explorer 스타일 3열 그리드 (섬네일 카드, 제목만 표시). current는 날짜/카테고리/제목/설명 포함하는 list-card 레이아웃.
- Sidebar: baseline은 왼쪽에 tree navigation (블로그/프로젝트/코딩테스트/소개). current는 수평 필터 탭 (전체/개발/최고).
- Card height: baseline 카드는 섬네일+제목 compact. current 카드는 섬네일+메타+설명으로 높이가 더 큼.
- Titlebar: baseline은 아이콘+텍스트 조합, Explorer chrome. current는 텍스트 전용, favicon 없음.
- Diff concentration: 그리드 섬네일 전 영역, 사이드바 영역, 우측 경계선(스크롤바 위치 차이).

### folder/mobile-blog -- 23.71% mismatch

diff artifact: visual-compare/folder-mobile-blog-diff.png

- Grid columns: baseline은 2열 그리드 (섬네일+제목). current는 단일 컬럼 full-width 카드 (섬네일+날짜+제목+설명).
- Card layout: 섬네일 비율 및 하단 텍스트 영역 높이 차이. baseline 카드는 섬네일-heavy, current는 텍스트 영역이 더 큼.
- Filter tabs: baseline에는 탭 row 없음. current는 수평 탭 row (전체/개발/최고) 상시 표시.
- Titlebar: baseline은 모바일 Explorer chrome (X 버튼, 폴더 아이콘). current는 유사하나 색상/폰트 차이.

### browser/desktop-article -- 11.00% mismatch

diff artifact: visual-compare/browser-desktop-article-diff.png

- Heading size: baseline 헤딩 "2025를 보내며"의 폰트 크기/여백이 current보다 큼. diff에서 헤딩 텍스트 영역이 붉게 표시.
- Content width: baseline 본문 영역이 current보다 좁음 (좌우 margin 더 큼). diff에서 좌측 여백 차이 확인.
- Titlebar chrome: baseline은 얇은 tab+URL bar. current는 URL bar padding 차이.
- Diff concentration: 헤딩 텍스트, 본문 첫 단락, 타이틀바 chrome 영역.

### browser/mobile-article -- 17.70% mismatch

diff artifact: visual-compare/browser-mobile-article-diff.png

- Heading size: baseline 헤딩은 더 작음 (text-2xl 수준). current 헤딩은 더 큼 (text-3xl 수준). diff에서 헤딩 글자 영역 전체가 붉게 표시.
- Body font: 본문 텍스트 크기/행간/폰트 패밀리 차이. 각 줄 단어 경계 어긋남.
- Cover image ratio: baseline 커버 이미지가 현재보다 높이가 큼.
- Scrollbar: baseline에서 오른쪽 scrollbar visible. current에는 없음.
- Diff concentration: 타이틀바, 헤딩, 본문 전 영역에서 광범위한 차이.
