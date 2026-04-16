# Storybook 컨벤션

## 도메인 root (canonical 4개)

| Root | 대상 도메인 |
|------|------------|
| `Taskbar` | 태스크바 및 태스크바 소속 컴포넌트 |
| `Windows` | 윈도우 패널 및 뷰 컴포넌트 |
| `Search` | 검색 패널 및 뷰 컴포넌트 |
| `Context` | 컨텍스트 패널 |

이 4개 root 외의 legacy root(`Windows Panel`, `Search Panel`, `Context Panel`, `Taskbar Context Menu`, `Taskbar Foundation` 등)는 사용 금지다.

## Components / Compose 역할 분리

`meta.title`의 두 번째 세그먼트는 반드시 `Components` 또는 `Compose` 중 하나다.

| 세그먼트 | 역할 |
|----------|------|
| `Components` | canonical component contract — 단일 컴포넌트의 canonical states + Reference/Compare stories |
| `Compose` | host-composed surface 또는 inventory showcase — 복수 컴포넌트 조합, 호스트 오케스트레이션, use-case inventory |

예시:

```
Taskbar/Components/Clock       ← TaskbarClock 단일 컴포넌트 계약
Taskbar/Components/Icon        ← TaskbarIconButton 단일 컴포넌트 계약
Taskbar/Compose/Taskbar        ← Taskbar 전체 조합 (host-composed)
Taskbar/Compose/ContextMenu    ← TaskbarContextMenu host composition
Windows/Components/Panel       ← WindowsPanel 단일 컴포넌트 계약
Windows/Components/AllView     ← WindowsPanelAllView 단일 컴포넌트 계약
Windows/Compose/Context        ← WindowsPanel 위에 context overlay (host composition)
Context/Components/Panel       ← ContextPanel 단일 컴포넌트 계약
Context/Compose/UseCases       ← ContextPanel use-case inventory
Search/Components/Panel        ← SearchPanel 단일 컴포넌트 계약
Search/Compose/Context         ← SearchPanel context overlay (host composition)
```

## Literal title rule

`meta.title`은 **literal string만 허용**한다.

```tsx
// 허용
const meta: Meta<typeof ContextPanel> = {
  title: "Context/Components/Panel",
  ...
};

// 금지 — imported const 기반 title
import { STORY_TITLE } from "./constants";
const meta = { title: STORY_TITLE, ... };

// 금지 — helper function return value 기반 title
const meta = { title: buildTitle("Context", "Panel"), ... };
```

title이 상수나 함수로 추상화되면 Storybook 정적 분석과 title registry가 깨진다.

## Compose meta owner rule

`meta.component`는 story의 주인 컴포넌트와 1:1 대응한다.

| story 종류 | `meta.component` |
|-----------|-----------------|
| `Components` story | 해당 컴포넌트와 1:1 (항상 명시) |
| `Compose` story — 단일 host owner가 있는 경우 | 그 host component |
| `Compose` story — inventory-only (복수 주인, use-case showcase) | omit 가능 |

## Reference / Compare 분류

`Components` branch 안에서 story 성격에 따라 구분한다.

| story 종류 | 목적 |
|-----------|------|
| `Reference` | 사람 검토용 — canonical states를 사람이 읽기 좋게 나열 |
| `Compare*` (`CompareDefault`, `CompareHover` 등) | machine capture용 — visual diff 자동화 대상 |

둘 다 같은 `Domain/Components/ComponentName` title branch 안에 위치한다. Compare를 위해 별도 root를 만들지 않는다.

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
