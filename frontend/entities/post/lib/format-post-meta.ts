import { stripHtml } from "@/lib/metadata";

const WORDS_PER_MINUTE = 200;

export function formatPostDate(date: string, locale = "ru-RU"): string {
  return new Date(date).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getReadingTimeMinutes(content: string): number {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
