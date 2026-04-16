/**
 * cn — internal-only class merge helper.
 *
 * Combines clsx (conditional class handling) with tailwind-merge
 * (Tailwind conflict resolution). This is the canonical runtime
 * helper for merging className props in @windows/ui components.
 *
 * Internal-only — NOT exported from the package root (src/index.ts).
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
