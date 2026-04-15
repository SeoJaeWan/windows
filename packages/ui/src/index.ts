// @windows/ui — server-safe entrypoint
// Next.js-specific APIs (next/link, next/image, next/navigation, etc.) must NOT be added here.
// Add server-safe, framework-agnostic components and utilities below.

export { default as Taskbar } from "./components/taskbar/taskbar";
export { default as TaskbarWindowsButton } from "./components/taskbar/taskbarWindowsButton";
export { default as TaskbarSearch } from "./components/taskbar/taskbarSearch";
export { default as TaskbarIconButton } from "./components/taskbar/taskbarIconButton";
export { default as TaskbarClock } from "./components/taskbar/taskbarClock";

export { default as WindowsPanel } from "./components/panels/windows/windowsPanel";
export { default as WindowsPanelPinnedView } from "./components/panels/windows/windowsPanelPinnedView";
export { default as WindowsPanelAllView } from "./components/panels/windows/windowsPanelAllView";
export { default as WindowsPanelSearchView } from "./components/panels/windows/windowsPanelSearchView";

export { default as SearchPanel } from "./components/panels/search/searchPanel";
