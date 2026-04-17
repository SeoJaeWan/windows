# Baseline Inventory

canonical compare key는 정확히 두 개다. 이후 모든 compare story, diff script, report는 아래 key를 그대로 사용한다.

## Canonical Compare Keys

| compare key | source path | provenance | capture filename | state role |
|---|---|---|---|---|
| `taskbar-hover-preview/attached-multi` | `C:/Users/USER/Desktop/dev/blog/src/components/molecules/taskHoverPanel/index.tsx` | source-derived evidence (C:/Users/USER/Desktop/dev/blog) | `taskbar-hover-preview-attached-multi-reference.png` | hover preview panel — 다중 세션이 열려 있는 상태. 패널 안에 n개의 썸네일 그리드가 렌더된다. |
| `taskbar-context-menu/attached-pinned` | `C:/Users/USER/Desktop/dev/blog/src/components/molecules/taskLeftClickPanel/index.tsx` | source-derived evidence (C:/Users/USER/Desktop/dev/blog) | `taskbar-context-menu-attached-pinned-reference.png` | context menu — 카테고리가 taskbar에 고정(pinned)된 상태. "작업 표시줄에서 제거" 항목이 노출된다. |

## Filename Rule

compare artifact는 `{kind}-{state}-{reference|current|diff}.png` 패턴을 따른다.

- `kind`는 compare key의 `/` 앞 부분: `taskbar-hover-preview`, `taskbar-context-menu`
- `state`는 compare key의 `/` 뒤 부분: `attached-multi`, `attached-pinned`
- role suffix: `reference` (blog 기준), `current` (구현체), `diff` (pixelmatch 결과)

예시:
```
taskbar-hover-preview-attached-multi-reference.png
taskbar-hover-preview-attached-multi-current.png
taskbar-hover-preview-attached-multi-diff.png
taskbar-context-menu-attached-pinned-reference.png
taskbar-context-menu-attached-pinned-current.png
taskbar-context-menu-attached-pinned-diff.png
```

## Negative Scope

아래 항목은 canonical baseline에 추가하지 않는다.

- Windows/Search panel state
- motion/close 근거 (supporting observation으로만 분류)
- old slug (`windows-taskbar-04`) capture를 새 canonical baseline처럼 표기하는 것
