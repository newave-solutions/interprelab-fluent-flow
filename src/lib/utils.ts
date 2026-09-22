import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely stringifies JSON for embedding in HTML script tags.
 * Escapes < characters to prevent XSS.
 * @param obj The object to stringify
 * @returns The stringified object
 */
export function safeJsonStringify(obj: unknown): string {
  if (obj === undefined) return '';
  if (obj === null) return 'null';
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}
