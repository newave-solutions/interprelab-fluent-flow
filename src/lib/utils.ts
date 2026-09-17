import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeJsonStringify(data: unknown): string {
  if (data === undefined) return '';
  if (data === null) return 'null';
  return JSON.stringify(data)?.replace(/</g, '\\u003c') ?? '';
}
