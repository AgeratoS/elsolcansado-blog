import { PostDetailView } from "@/frontend/widgets/post-detail";
import {
  getAuthorByIdGraceful,
  getCommentsByPost,
  getPostBySlug,
  getAllPostSlugs,
  getRecentPostsExcluding,
} from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Author } from "@/lib/wordpress.d";

export async function generateStaticParams() {
  return await getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return generateContentMetadata({
    title: post.title.rendered,
    description: stripHtml(post.excerpt.rendered),
    slug: post.slug,
    basePath: "posts",
  });
}

export const revalidate = 3600;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const embeddedAuthor = post._embedded?.author?.[0];
  const authorFallback: Author = {
    id: post.author,
    name: embeddedAuthor?.name ?? "Автор",
    slug: embeddedAuthor?.slug ?? "",
    description: "",
    url: "",
    link: "",
    avatar_urls: embeddedAuthor?.avatar_urls ?? {},
    meta: {},
  };

  const [author, recentPosts, commentsResponse] = await Promise.all([
    getAuthorByIdGraceful(post.author, authorFallback),
    getRecentPostsExcluding(post.id, 4),
    getCommentsByPost(post.id, 1, 10),
  ]);

  return (
    <PostDetailView
      post={post}
      author={author}
      recentPosts={recentPosts}
      comments={commentsResponse.data}
      totalComments={commentsResponse.headers.total}
    />
  );
}
