import type { Metadata } from "next";
import {
  Taskbar,
  TaskbarStartButton,
  TaskbarSearch,
  TaskbarClock,
} from "@windows/ui";

import TaskbarFixtures from "./fixtures";

export const metadata: Metadata = {
  title: "Sandbox — Taskbar Preview",
  robots: { index: false, follow: false },
};

export default function TaskbarSandboxPage() {
  return (
    <div
      data-testid="taskbar-sandbox-preview"
      className="min-h-screen bg-gray-100 text-gray-900"
    >
      {/* ── Page Header ── */}
      <header className="border-b border-gray-300 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Taskbar Sandbox Preview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Taskbar 컴포넌트 인스펙션 페이지
        </p>
      </header>

      {/* ── Canonical Scene ── */}
      <section
        data-testid="taskbar-sandbox-canonical"
        className="px-6 py-6"
      >
        <h2 className="mb-4 text-lg font-semibold">Canonical</h2>
        <div className="relative min-h-[200px] overflow-hidden rounded-lg border border-gray-300 bg-[#0078d4]/10">
          <div className="absolute inset-x-0 bottom-0">
            <Taskbar
              startButton={
                <TaskbarStartButton aria-label="시작">
                  시작
                </TaskbarStartButton>
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
          </div>
        </div>
      </section>

      {/* ── Matrix Section ── */}
      <section
        data-testid="taskbar-sandbox-matrix"
        className="px-6 pb-12"
      >
        <h2 className="mb-4 text-lg font-semibold">Component Matrix</h2>
        <TaskbarFixtures />
      </section>
    </div>
  );
}
