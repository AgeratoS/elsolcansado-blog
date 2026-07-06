import { CardPost } from "@/frontend/entities/post/ui/card";
import { Pagination } from "@/frontend/shared/ui/pagination";
import type { Post } from "@/lib/wordpress.d";

export const POSTS_PER_PAGE = 15;

type PostsPageViewProps = {
  posts: Post[];
  currentPage: number;
  total: number;
  totalPages: number;
  createPageUrl: (page: number) => string;
  onPageChange?: (page: number) => void;
};

function formatPostsCount(total: number): string {
  if (total === 1) return "запись";
  if (total >= 2 && total <= 4) return "записи";
  return "записей";
}

export function PostsPageView({
  posts,
  currentPage,
  total,
  totalPages,
  createPageUrl,
  onPageChange,
}: PostsPageViewProps) {
  return (
    <main className="container flex-1 py-8 lg:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Статьи</h1>
        {total > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {total} {formatPostsCount(total)}
            {totalPages > 1 && ` · страница ${currentPage} из ${totalPages}`}
          </p>
        )}
      </header>

      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <CardPost key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            createPageUrl={createPageUrl}
            onPageChange={onPageChange}
            className="mt-10"
          />
        </>
      ) : (
        <p className="text-muted-foreground">Записей не найдено.</p>
      )}
    </main>
  );
}
