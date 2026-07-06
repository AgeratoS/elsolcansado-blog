import { RecentPostItem } from "@/frontend/entities/post/ui/recent-post-item";
import { cn } from "@/lib/utils";
import type { Author, Post } from "@/lib/wordpress.d";
import { stripHtml } from "@/lib/metadata";
import Link from "next/link";

type PostSidebarProps = {
  author: Author;
  recentPosts: Post[];
  className?: string;
};

function getAuthorAvatar(author: Author): string | null {
  return author.avatar_urls?.["96"] ?? null;
}

function getAuthorInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function PostSidebar({
  author,
  recentPosts,
  className,
}: PostSidebarProps) {
  const avatarUrl = getAuthorAvatar(author);
  const authorBio = stripHtml(author.description);

  return (
    <aside
      className={cn(
        "flex flex-col gap-8 lg:h-full",
        className,
      )}
    >
      <section className="shrink-0 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-5 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          О авторе
        </h2>

        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-teal-100 text-xl font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              getAuthorInitials(author.name)
            )}
          </div>

          <h3 className="text-lg font-bold text-foreground">{author.name}</h3>

          {authorBio && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {authorBio}
            </p>
          )}
        </div>
      </section>

      {recentPosts.length > 0 && (
        <div className="min-h-0 lg:flex-1">
          <section className="lg:sticky lg:top-8 rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Последние посты
              </h2>
              <Link
                href="/posts"
                className="text-xs text-foreground transition-colors hover:text-muted-foreground"
              >
                Все статьи
              </Link>
            </div>

            <div className="space-y-4">
              {recentPosts.map((post) => (
                <RecentPostItem key={post.id} post={post} />
              ))}
            </div>
          </section>
        </div>
      )}
    </aside>
  );
}
