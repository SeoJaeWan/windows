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

## 픽스처 파일 확장자

- JSX를 포함하는 픽스처·인벤토리 파일: `.tsx`
- 순수 데이터만인 파일: `.ts`
