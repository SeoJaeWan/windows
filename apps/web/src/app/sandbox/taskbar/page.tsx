import {
  Taskbar,
  TaskbarStartButton,
  TaskbarSearch,
  TaskbarClock,
} from "@windows/ui";

import TaskbarFixtures from "./fixtures";

export default function TaskbarSandboxPage() {
  return (
    <div data-testid="taskbar-sandbox-preview">
      {/* ── Canonical Scene ── */}
      <section data-testid="taskbar-sandbox-canonical">
        <h2>Canonical</h2>
        <Taskbar
          startButton={
            <TaskbarStartButton aria-label="시작">시작</TaskbarStartButton>
          }
          search={
            <TaskbarSearch
              placeholder="검색"
              value="windows"
              readOnly
              aria-label="작업 표시줄 검색"
            />
          }
          items={[
            <span key="blog" aria-label="블로그 바로가기">
              블로그
            </span>,
            <span key="project">프로젝트</span>,
          ]}
          clock={
            <TaskbarClock
              timeLabel="오전 11:24"
              dateLabel="2026-04-05"
              aria-label="현재 시간과 날짜"
            />
          }
        />
      </section>

      {/* ── Matrix Section ── */}
      <section data-testid="taskbar-sandbox-matrix">
        <TaskbarFixtures />
      </section>
    </div>
  );
}
