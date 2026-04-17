# Storybook 컨벤션

## 도메인 root (canonical 3개)

| Root | 대상 도메인 |
|------|------------|
| `Taskbar` | 태스크바 및 태스크바 소속 컴포넌트 |
| `Panels` | 패널 family — Windows panel, Search panel, Context panel |
| `Windows` | window family — Folder, Browser (실제 윈도우 컴포넌트) |

이 3개 root 외의 legacy root(`Windows Panel`, `Search Panel`, `Context Panel`, `Taskbar Context Menu`, `Taskbar Foundation`, `Search`, `Context` 등)는 사용 금지다.

## Panels/* 분류 체계

`Panels` root 아래에서 panel family를 세그먼트로 구분한다.

| Title | 대상 |
|-------|------|
| `Panels/Windows/*` | WindowsPanel 및 하위 뷰 컴포넌트, context overlay |
| `Panels/Search/*` | SearchPanel 및 하위 뷰 컴포넌트, context overlay |
| `Panels/Context/*` | ContextPanel 컴포넌트 계약 및 use-case inventory |

예시:

```
Panels/Windows/Panel        ← WindowsPanel 단일 컴포넌트 계약
Panels/Windows/PinnedView   ← WindowsPanelPinnedView 단일 컴포넌트 계약
Panels/Windows/AllView      ← WindowsPanelAllView 단일 컴포넌트 계약
Panels/Windows/SearchView   ← WindowsPanelSearchView 단일 컴포넌트 계약
Panels/Windows/Context      ← WindowsPanel 위에 context overlay (host composition)
Panels/Search/Panel         ← SearchPanel 단일 컴포넌트 계약
Panels/Search/DefaultView   ← SearchPanelDefaultView 단일 컴포넌트 계약
Panels/Search/Context       ← SearchPanel context overlay (host composition)
Panels/Context/Panel        ← ContextPanel 단일 컴포넌트 계약
Panels/Context/UseCases     ← ContextPanel use-case inventory
```

## Windows/* 분류 체계

`Windows` root 아래에서 window family를 직접 나열한다 (두 번째 세그먼트가 컴포넌트 이름).

```
Windows/Folder   ← Folder 컴포넌트
Windows/Browser  ← Browser 컴포넌트
```

## Taskbar/* 분류 체계

`Taskbar` root는 기존 `Components` / `Compose` 분리를 유지한다.

```
Taskbar/Components/Clock       ← TaskbarClock 단일 컴포넌트 계약
Taskbar/Components/Icon        ← TaskbarIconButton 단일 컴포넌트 계약
Taskbar/Compose/Taskbar        ← Taskbar 전체 조합 (host-composed)
Taskbar/Compose/ContextMenu    ← TaskbarContextMenu host composition
```

## Literal title rule

`meta.title`은 **literal string만 허용**한다.

```tsx
// 허용
const meta: Meta<typeof ContextPanel> = {
  title: "Panels/Context/Panel",
  ...
};

// 금지 — imported const 기반 title
import { STORY_TITLE } from "./constants";
const meta = { title: STORY_TITLE, ... };

// 금지 — helper function return value 기반 title
const meta = { title: buildTitle("Panels", "Panel"), ... };
```

title이 상수나 함수로 추상화되면 Storybook 정적 분석과 title registry가 깨진다.

## Compose meta owner rule

`meta.component`는 story의 주인 컴포넌트와 1:1 대응한다.

| story 종류 | `meta.component` |
|-----------|-----------------|
| 단일 컴포넌트 계약 story | 해당 컴포넌트와 1:1 (항상 명시) |
| host composition story — 단일 host owner가 있는 경우 | 그 host component |
| inventory-only story (복수 주인, use-case showcase) | omit 가능 |

## Reference / Compare 분류

같은 title branch 안에서 story 성격에 따라 구분한다.

| story 종류 | 목적 |
|-----------|------|
| `Reference` | 사람 검토용 — canonical states를 사람이 읽기 좋게 나열 |
| `Compare*` (`CompareDefault`, `CompareHover` 등) | machine capture용 — visual diff 자동화 대상 |

Compare를 위해 별도 root를 만들지 않는다.

## 금지 패턴

아래 title 패턴은 legacy이며 사용 금지다.

```
# 금지 — legacy flat root
"Windows Panel/Panel"
"Windows Panel/Use Cases"
"Search Panel/Panel"
"Context Panel/Panel"
"Context Panel/Use Cases"
"Taskbar Context Menu/*"
"Taskbar Foundation/*"

# 금지 — old 4-root taxonomy (Windows/Search/Context를 독립 root로 사용)
"Windows/Components/*"
"Windows/Compose/*"
"Search/Components/*"
"Search/Compose/*"
"Context/Components/*"
"Context/Compose/*"

# 금지 — Panel/Use Cases/Context 섹션 패턴 (old taxonomy)
"ComponentName/Panel"
"ComponentName/Use Cases"
"ComponentName/Context"
```

## Compare story 패턴

visual diff는 `CompareRoot kind="…" state="…"` 래퍼를 사용한다.

```tsx
export const CompareDefault: Story = {
  render: () => (
    <CompareRoot kind="context-panel" state="default">
      <ContextPanel items={[...CONTEXT_DEFAULT.items]} />
    </CompareRoot>
  ),
};
```

- kind/state 조합이 artifact 파일명과 1:1 대응: `{kind}-{state}-{reference|current|diff}.png`
- Compare story는 `[data-visual-root]` 요소를 캡처 대상으로 삼는다

## Thin compare wrapper 목록

compare metadata만 소유하는 helper 컴포넌트 전체 목록이다. 이 컴포넌트들은 `className`이나 inline style을 추가하지 않는다.

| 컴포넌트 | 용도 |
|----------|------|
| `CompareRoot` | 모든 compare story의 최상위 래퍼. `data-visual-root` DOM contract 소유 |
| `CompareLeafStage` | 단일 leaf 컴포넌트(e.g. 버튼, 아이콘)를 격리 캡처할 때 사용 |
| `ComparePanelStage` | 패널 단위 컴포넌트를 고정 캔버스 안에 배치할 때 사용 |
| `CompareContextPanelStage` | ContextPanel처럼 overlay가 포함된 패널의 host-composition 캡처에 사용 |

## Bounded exception taxonomy

inline style 또는 `<style>` 태그를 story 파일 안에 남길 수 있는 경우만 나열한다.

**허용 사례 (bounded exception):**

1. **decorative desktop backdrop gradient** — `apps/web` 레벨 배경 효과. 컴포넌트 token과 무관한 시각 장치.
2. **fixed capture canvas 또는 token-relative geometry** — `var(--taskbar-height)` 같은 토큰 기반 geometry 고정. CompareRoot 내부 캔버스 크기 설정에 한함.
3. **CompareRoot public DOM contract 보존을 위한 scoped width rule** — `<style>` 태그로 `[data-visual-root]` 셀렉터에 width를 고정하는 경우. CompareRoot 계약 유지 목적에 한함.
4. **host-composition overlay absolute placement** — `position: relative` 컨테이너 위에 `position: absolute` 오버레이를 배치하는 host story 전용. leaf 컴포넌트 내부에서는 금지.

**금지 사례:**

- raw shared color/border `var(--...)` 직접 소비 — inline style에서도 금지 (token 소비는 className을 통해서만)
- runtime bridge 변수 (`--panel-border` 등) 직접 할당 — story 파일에서 bridge 변수를 생성/덮어쓰기 금지

## 픽스처 파일 확장자

- JSX를 포함하는 픽스처·인벤토리 파일: `.tsx`
- 순수 데이터만인 파일: `.ts`
