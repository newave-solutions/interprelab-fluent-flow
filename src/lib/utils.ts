import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely stringify JSON to be embedded in an HTML <script> tag.
 * Escapes `<` to prevent XSS.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeJsonStringify(obj: any): string {
  if (obj === undefined) return '';
  if (obj === null) return 'null';
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}
