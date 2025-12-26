import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely serializes data to JSON for use in HTML (e.g. <script> tags).
 * Prevents XSS via JSON injection by escaping dangerous characters.
 * Specifically handles the case where a string contains "</script>" which can
 * terminate the script block even inside a JSON string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeJsonStringify(value: any): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
