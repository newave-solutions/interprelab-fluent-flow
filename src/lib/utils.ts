import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely stringifies data to JSON, escaping characters that could be used for XSS
 * when embedding JSON within HTML script tags.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeJsonStringify(data: any): string {
  if (data === undefined) return '';
  if (data === null) return 'null';

  return JSON.stringify(data).replace(/</g, '\\u003c');
}
