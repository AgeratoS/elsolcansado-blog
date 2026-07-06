import type { Post } from "@/lib/wordpress.d";

export function getPostCategory(post: Post) {
  return post._embedded?.["wp:term"]?.[0]?.[0] ?? null;
}

export function getPostTags(post: Post) {
  return post._embedded?.["wp:term"]?.[1] ?? [];
}
