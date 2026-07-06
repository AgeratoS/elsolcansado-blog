import type { Post } from "@/lib/wordpress.d";

const VIEW_COUNT_META_KEYS = [
  "post_views_count",
  "views",
  "jetpack-post-views",
  "_post_views",
  "pvc_post_views",
] as const;

function parseViewCount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return null;
}

export function getPostViewCount(post: Post): number | null {
  for (const key of VIEW_COUNT_META_KEYS) {
    const count = parseViewCount(post.meta?.[key]);
    if (count !== null) {
      return count;
    }
  }

  return null;
}

export function formatViewCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(".0", "")}м`;
  }

  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(".0", "")}к`;
  }

  return String(count);
}
