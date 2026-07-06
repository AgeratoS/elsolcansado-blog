import { Button } from "@/frontend/shared/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  createPageUrl: (page: number) => string;
  onPageChange?: (page: number) => void;
  className?: string;
};

function getVisiblePages(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);
  if (currentPage <= 3) pages.add(2).add(3).add(4);
  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1).add(totalPages - 2).add(totalPages - 3);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];

  for (let index = 0; index < sorted.length; index++) {
    const page = sorted[index];
    const previous = sorted[index - 1];

    if (previous !== undefined && page - previous > 1) {
      result.push("ellipsis");
    }

    result.push(page);
  }

  return result;
}

export function Pagination({
  currentPage,
  totalPages,
  createPageUrl,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Пагинация"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <Button
        variant="outline"
        size="icon"
        asChild={currentPage > 1 && !onPageChange}
        disabled={currentPage <= 1}
        aria-label="Предыдущая страница"
        onClick={
          onPageChange && currentPage > 1
            ? () => onPageChange(currentPage - 1)
            : undefined
        }
      >
        {currentPage > 1 && !onPageChange ? (
          <Link href={createPageUrl(currentPage - 1)}>
            <ChevronLeft />
          </Link>
        ) : (
          <span>
            <ChevronLeft />
          </span>
        )}
      </Button>

      {visiblePages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            asChild={page !== currentPage && !onPageChange}
            aria-label={`Страница ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={
              onPageChange && page !== currentPage
                ? () => onPageChange(page)
                : undefined
            }
          >
            {page === currentPage || onPageChange ? (
              <span>{page}</span>
            ) : (
              <Link href={createPageUrl(page)}>{page}</Link>
            )}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        asChild={currentPage < totalPages && !onPageChange}
        disabled={currentPage >= totalPages}
        aria-label="Следующая страница"
        onClick={
          onPageChange && currentPage < totalPages
            ? () => onPageChange(currentPage + 1)
            : undefined
        }
      >
        {currentPage < totalPages && !onPageChange ? (
          <Link href={createPageUrl(currentPage + 1)}>
            <ChevronRight />
          </Link>
        ) : (
          <span>
            <ChevronRight />
          </span>
        )}
      </Button>
    </nav>
  );
}
