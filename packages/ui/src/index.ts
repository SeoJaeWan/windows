// @windows/ui — server-safe entrypoint
// Next.js-specific APIs (next/link, next/image, next/navigation, etc.) must NOT be added here.
// Add server-safe, framework-agnostic components and utilities below.

export { default as Taskbar } from "./components/taskbar/taskbar";
export { default as TaskbarWindowsButton } from "./components/taskbar/taskbarWindowsButton";
export { default as TaskbarSearch } from "./components/taskbar/taskbarSearch";
export { default as TaskbarIconButton } from "./components/taskbar/taskbarIconButton";
export { default as TaskbarClock } from "./components/taskbar/taskbarClock";

export { default as WindowsPanelShell } from "./components/panels/windows/windowsPanelShell";
export { default as WindowsPanelPinnedBody } from "./components/panels/windows/windowsPanelPinnedBody";
export { default as WindowsPanelAllBody } from "./components/panels/windows/windowsPanelAllBody";
export { default as WindowsPanelSearchBody } from "./components/panels/windows/windowsPanelSearchBody";
