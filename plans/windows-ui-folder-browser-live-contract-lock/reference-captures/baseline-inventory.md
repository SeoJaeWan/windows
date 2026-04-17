# Baseline Inventory — Folder/Browser Live Contract Lock

capture date: 2026-04-17
provenance: external-source evidence (live seojaewan.com)

## Canonical States (4)

| state key | url | viewport | file |
|-----------|-----|----------|------|
| `folder/desktop-blog` | https://seojaewan.com/blog | 1280x750 | `folder-desktop-blog.png` |
| `folder/mobile-blog` | https://seojaewan.com/blog | 390x794 | `folder-mobile-blog.png` |
| `browser/desktop-article` | https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0 | 1280x750 | `browser-desktop-article.png` |
| `browser/mobile-article` | https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0 | 390x794 | `browser-mobile-article.png` |

## Visual Diff Rules

### Non-blocking differences
- font-only difference (subpixel rendering, antialiasing)

### Blocking differences
- geometry: window chrome dimensions, titlebar height, content area size
- chrome: titlebar buttons (minimize/maximize/close), nav controls (back/forward), address bar
- spacing: padding/margin between elements, gap between grid items
- responsive behavior: column count change, layout reflow at breakpoint
- thumbnail ratio: blog post thumbnail aspect ratio (width/height proportion)

## State Detail

### folder/desktop-blog
- capture date: 2026-04-17
- url: https://seojaewan.com/blog
- viewport: 1280x750
- provenance: external-source evidence
- observable: Windows Folder chrome with left nav panel (블로그/프로젝트/코딩 테스트/소개), 3-column blog post grid with thumbnails, taskbar at bottom

### folder/mobile-blog
- capture date: 2026-04-17
- url: https://seojaewan.com/blog
- viewport: 390x794
- provenance: external-source evidence
- observable: Windows Folder chrome without left nav panel, 2-column blog post grid with thumbnails, taskbar at bottom

### browser/desktop-article
- capture date: 2026-04-17
- url: https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0
- viewport: 1280x750
- provenance: external-source evidence
- observable: Windows Browser chrome with back/forward controls and address bar showing "2025를 보내며", article content with hero image, taskbar at bottom

### browser/mobile-article
- capture date: 2026-04-17
- url: https://seojaewan.com/blog/2025%EB%A5%BC-%EB%B3%B4%EB%82%B4%EB%A9%B0
- viewport: 390x794
- provenance: external-source evidence
- observable: Windows Browser chrome (compact), article content with hero image at full width, body text visible below image, taskbar at bottom

## Negative Scope

- `browser/*-not-found` state: excluded from canonical inventory
- old plan captures: not used as baseline
- canonical state count: exactly 4, no additions permitted
