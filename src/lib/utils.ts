import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely stringify data for embedding in HTML script tags (e.g. JSON-LD)
 * Escapes characters that could be used for XSS attacks to their unicode sequences.
 */
export function safeJsonStringify(obj: unknown): string {
  if (obj === undefined) return '';
  if (obj === null) return 'null';

  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
