# Storybook 컨벤션

## 섹션 구조

컴포넌트마다 역할에 따라 섹션을 분리한다.

| 섹션 | 내용 | 예시 |
|------|------|------|
| `ComponentName/Panel` | 컴포넌트 계약 — canonical states + Compare stories | `Context Panel/Panel` |
| `ComponentName/Use Cases` | 실제 사용례 — host row inventories, 구체적 데이터 조합 | `Context Panel/Use Cases` |
| `ComponentName/Context` | 호스트 패널 위에 컨텍스트 메뉴 오버레이 (host composition) | `Windows Panel/Context` |

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
