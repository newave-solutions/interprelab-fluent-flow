import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely stringifies a JSON object for inclusion in HTML script tags
 * Prevents XSS attacks by escaping <, >, &, and line terminators
 */
export function safeJsonStringify(obj: unknown): string {
  if (obj === undefined) return '';
  if (obj === null) return 'null';

  return JSON.stringify(obj).replace(/[<>&\u2028\u2029]/g, (match) => {
    switch (match) {
      case '<': return '\\u003c';
      case '>': return '\\u003e';
      case '&': return '\\u0026';
      case '\u2028': return '\\u2028';
      case '\u2029': return '\\u2029';
      default: return match;
    }
  });
}
