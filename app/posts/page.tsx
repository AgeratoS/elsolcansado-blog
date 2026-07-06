import { PostsPageView, POSTS_PER_PAGE } from "@/frontend/widgets/posts-archive";
import { getPostsPaginated } from "@/lib/wordpress";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Статьи",
  description: "Все записи блога",
};

export const dynamic = "auto";
export const revalidate = 3600;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    author?: string;
    tag?: string;
    category?: string;
    page?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const { author, tag, category, page: pageParam, search } = params;

  const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;

  const postsResponse = await getPostsPaginated(page, POSTS_PER_PAGE, {
    author,
    tag,
    category,
    search,
  });

  const { data: posts, headers } = postsResponse;
  const { total, totalPages } = headers;

  const createPaginationUrl = (newPage: number) => {
    const urlParams = new URLSearchParams();
    if (newPage > 1) urlParams.set("page", newPage.toString());
    if (category) urlParams.set("category", category);
    if (author) urlParams.set("author", author);
    if (tag) urlParams.set("tag", tag);
    if (search) urlParams.set("search", search);
    return `/posts${urlParams.toString() ? `?${urlParams.toString()}` : ""}`;
  };

  return (
    <PostsPageView
      posts={posts}
      currentPage={page}
      total={total}
      totalPages={totalPages}
      createPageUrl={createPaginationUrl}
    />
  );
}
