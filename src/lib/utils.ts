import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely stringifies a JSON object, escaping sensitive HTML characters
 * to prevent Cross-Site Scripting (XSS) when embedded in <script> tags.
 */
export function safeJsonStringify(obj: unknown): string {
  if (obj === undefined) return "";
  if (obj === null) return "null";

  const json = JSON.stringify(obj);
  if (!json) return "";

  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
