// @windows/ui — server-safe entrypoint
// Next.js-specific APIs (next/link, next/image, next/navigation, etc.) must NOT be added here.
// Add server-safe, framework-agnostic components and utilities below.

export { default as Taskbar } from "./components/taskbar/taskbar";
export { default as TaskbarWindowsButton } from "./components/taskbar/taskbarWindowsButton";
export { default as TaskbarSearch } from "./components/taskbar/taskbarSearch";
export { default as TaskbarIconButton } from "./components/taskbar/taskbarIconButton";
export { default as TaskbarClock } from "./components/taskbar/taskbarClock";

export { default as WindowsPanelShell } from "./components/taskbar/windowsPanelShell";
export { default as WindowsPanelPinnedBody } from "./components/taskbar/windowsPanelPinnedBody";
export { default as WindowsPanelAllBody } from "./components/taskbar/windowsPanelAllBody";
export { default as WindowsPanelSearchBody } from "./components/taskbar/windowsPanelSearchBody";
