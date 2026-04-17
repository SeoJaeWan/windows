# Supporting Observations

이 파일은 motion/close 관련 source note와 old slug capture를 documentary support로만 기록한다.
아래 항목 중 어느 것도 canonical compare key를 추가하거나 pass/fail baseline으로 승격하지 않는다.

---

## 1. Hover Panel — Close Affordance Path

**provenance**: source-derived evidence (`C:/Users/USER/Desktop/dev/blog/src/components/molecules/taskHoverPanel/index.tsx`)

**observation**:
hover panel 안의 썸네일 close 버튼(`data-testid="thumbnail-close"`)은 `onUpdateStatusSession({ id, status: 'close' })`를 호출하고 이어서 `closePanel()`을 호출한다. 이는 패널 close와 동일한 세션 상태 업데이트 경로다. 구현체는 hover panel 내부 close affordance가 panel close path와 같은 store action을 타야 한다.

**classification**: documentary support — compare state 추가 없음

---

## 2. Context Panel — Enter/Exit Motion Direction

**provenance**: source-derived evidence (`C:/Users/USER/Desktop/dev/blog/src/hooks/useShowTaskPanel/index.tsx`)

**observation**:
`useTaskPanel` 훅은 `isOpen` 상태에 따라 animation class를 전환한다.
- `isOpen === true` → `animate-task-up` (아래→위 방향으로 진입)
- `isOpen === false` → `animate-task-down` (현재 위치→아래 방향으로 퇴장)

context panel의 enter motion은 아래에서 위로, exit motion은 위에서 아래로 이동한다는 규칙이다.
구현체의 `useTaskbarContextPanel`은 이 방향 규칙을 따라야 한다.

**classification**: documentary support — compare state 추가 없음

---

## 3. Old Slug Captures (windows-taskbar-04)

**provenance**: documentary support (`plans/windows-taskbar-04-attached-surfaces/reference-captures/`)

**files**:
- `taskbar-hover-preview.png` — taskbar-04 시점의 hover preview 캡처
- `taskbar-icon-context-menu.png` — taskbar-04 시점의 context menu 캡처

**classification**: documentary support only

이 파일들은 과거 slug에서 캡처된 것이며, 새 slug(`windows-taskbar-16`)의 pass/fail baseline이 아니다. 시각적 참고 자료로만 사용한다. later compare phase가 이 파일들을 `reference` bucket으로 합치지 않는다.

---

## Provenance Summary

| artifact | provenance category | baseline 역할 |
|---|---|---|
| `baseline-inventory.md` 두 key | source-derived evidence (blog) | canonical pass/fail baseline |
| hover close affordance note | source-derived evidence (blog) | documentary support |
| context enter/exit motion note | source-derived evidence (blog) | documentary support |
| `taskbar-hover-preview.png` (taskbar-04) | documentary support (old slug) | documentary support only |
| `taskbar-icon-context-menu.png` (taskbar-04) | documentary support (old slug) | documentary support only |
