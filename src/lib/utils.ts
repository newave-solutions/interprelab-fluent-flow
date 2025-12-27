import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeJsonStringify(value: unknown): string {
  const json = JSON.stringify(value);
  return json ? json.replace(/</g, '\\u003c') : '';
}
