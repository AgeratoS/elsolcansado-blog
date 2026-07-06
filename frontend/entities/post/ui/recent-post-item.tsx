import { formatPostDate } from "@/frontend/entities/post/lib/format-post-meta";
import { getPostCategory } from "@/frontend/entities/post/lib/get-post-terms";
import { CategoryLabel } from "@/frontend/shared/ui/category-label";
import type { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type RecentPostItemProps = {
  post: Post;
  className?: string;
};

export function RecentPostItem({ post, className }: RecentPostItemProps) {
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = getPostCategory(post);

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        "group flex gap-4 rounded-lg transition-colors hover:bg-accent",
        className,
      )}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {featuredMedia?.source_url ? (
          <Image
            src={featuredMedia.source_url}
            alt={featuredMedia.alt_text || post.title.rendered}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
        {category && (
          <CategoryLabel
            id={category.id}
            name={category.name}
            className="text-xs"
          />
        )}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-teal-800">
          {post.title.rendered}
        </h3>
        <time
          dateTime={post.date}
          className="text-xs text-muted-foreground"
        >
          {formatPostDate(post.date)}
        </time>
      </div>
    </Link>
  );
}
