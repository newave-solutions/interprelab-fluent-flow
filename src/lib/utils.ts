import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeJsonStringify(obj: unknown): string {
  if (obj === undefined) return "";
  if (obj === null) return "null";
  const str = JSON.stringify(obj);
  return str ? str.replace(/</g, "\\u003c") : "";
}
