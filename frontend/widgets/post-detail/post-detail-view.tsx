import { CommentsSection } from "@/frontend/entities/comment/ui/comments-section";
import {
  formatPostDate,
  getReadingTimeMinutes,
} from "@/frontend/entities/post/lib/format-post-meta";
import {
  formatViewCount,
  getPostViewCount,
} from "@/frontend/entities/post/lib/get-post-view-count";
import {
  getPostCategory,
  getPostTags,
} from "@/frontend/entities/post/lib/get-post-terms";
import { PostContent } from "@/frontend/widgets/post-detail/ui/post-content";
import { PostShareButtons } from "@/frontend/widgets/post-detail/post-share-buttons";
import { PostSidebar } from "@/frontend/widgets/post-detail/post-sidebar";
import { Breadcrumbs } from "@/frontend/shared/ui/breadcrumbs";
import { CategoryLabel } from "@/frontend/shared/ui/category-label";
import type { Author, Comment, Post } from "@/lib/wordpress.d";
import { Clock, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type PostDetailViewProps = {
  post: Post;
  author: Author;
  recentPosts: Post[];
  comments: Comment[];
  totalComments: number;
};

export function PostDetailView({
  post,
  author,
  recentPosts,
  comments,
  totalComments,
}: PostDetailViewProps) {
  const category = getPostCategory(post);
  const tags = getPostTags(post);
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const embeddedAuthor = post._embedded?.author?.[0];
  const formattedDate = formatPostDate(post.date);
  const readingTime = getReadingTimeMinutes(post.content.rendered);
  const viewCount = getPostViewCount(post);
  const authorAvatar = embeddedAuthor?.avatar_urls?.["96"] ?? author.avatar_urls?.["96"];

  const postContentClassName =
    "post-content prose prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-teal-800 prose-a:dark:text-teal-400 prose-blockquote:border-l-teal-700 prose-blockquote:dark:border-l-teal-500 prose-blockquote:bg-muted prose-blockquote:py-1 prose-blockquote:not-italic prose-code:before:content-none prose-code:after:content-none";

  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Статьи", href: "/posts" },
    ...(category
      ? [
          {
            label: category.name,
            href: `/posts?category=${category.id}`,
          },
        ]
      : []),
  ];

  return (
    <main className="container flex-1 py-8 lg:py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-12 lg:gap-y-10">
        <article className="min-w-0 lg:col-start-1 lg:row-start-1">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />

          {category && (
            <CategoryLabel
              id={category.id}
              name={category.name}
              href={`/posts?category=${category.id}`}
              className="mb-4"
            />
          )}

          <h1 className="mb-6 text-3xl font-bold leading-tight text-foreground lg:text-4xl">
            {post.title.rendered}
          </h1>

          <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              {authorAvatar && (
                <div className="relative h-9 w-9 overflow-hidden rounded-full bg-muted">
                  <img
                    src={authorAvatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <span className="font-medium text-foreground">{author.name}</span>
            </div>

            <time dateTime={post.date}>{formattedDate}</time>

            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {readingTime} мин чтения
            </span>

            {viewCount !== null && (
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" aria-hidden="true" />
                {formatViewCount(viewCount)} просмотров
              </span>
            )}
          </div>

          {featuredMedia?.source_url && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl bg-muted">
              <Image
                src={featuredMedia.source_url}
                alt={featuredMedia.alt_text || post.title.rendered}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 760px"
                priority
              />
            </div>
          )}

          <PostContent
            html={post.content.rendered}
            className={postContentClassName}
          />

          {tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/posts?tag=${tag.id}`}
                  className="rounded-full bg-muted px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 border-t border-border pt-8">
            <PostShareButtons slug={post.slug} title={post.title.rendered} />
          </div>
        </article>

        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          <CommentsSection
            postId={post.id}
            initialComments={comments}
            totalComments={totalComments}
            commentsOpen={post.comment_status === "open"}
          />
        </div>

        <PostSidebar
          author={author}
          recentPosts={recentPosts}
          className="lg:col-start-2 lg:row-start-1"
        />
      </div>
    </main>
  );
}
