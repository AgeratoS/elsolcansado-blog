import Link from "next/link";

type ArchiveListProps<T extends { id: number }> = {
  title: string;
  items: T[];
  getItemHref: (item: T) => string;
  getItemLabel: (item: T) => string;
  emptyMessage: string;
};

export function ArchiveList<T extends { id: number }>({
  title,
  items,
  getItemHref,
  getItemLabel,
  emptyMessage,
}: ArchiveListProps<T>) {
  return (
    <main className="container flex-1 py-8 lg:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {items.length > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        )}
      </header>

      {items.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={getItemHref(item)}
                className="block rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted"
              >
                {getItemLabel(item)}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">{emptyMessage}</p>
      )}
    </main>
  );
}
