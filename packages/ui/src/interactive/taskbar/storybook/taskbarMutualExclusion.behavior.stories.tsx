import type { Meta, StoryObj } from "@storybook/react";

import { MutualExclusionHarness } from "./taskbarBehaviorHarnesses";

const meta = {
  title: "Interactive/Taskbar/MutualExclusion",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * ConsumerOwnedWinnerRule
 *
 * Demonstrates consumer-owned mutual exclusion via hover.dismiss() + context.close():
 * - Hover winner: hover가 열릴 때 context가 닫힌다 (useEffect가 contextPanel.close()를 호출)
 * - Context open → hover dismissed (pointer-reset gate activated; hover requires
 *   fresh leave → enter to reopen)
 * - Resting pointer with no interaction → no-op (neither surface opens
 *   unexpectedly)
 *
 * Neither hook knows about the other — all coordination is host-owned.
 */
export const ConsumerOwnedWinnerRule: Story = {
  name: "Consumer-owned winner rule",
  render: () => <MutualExclusionHarness />,
};
