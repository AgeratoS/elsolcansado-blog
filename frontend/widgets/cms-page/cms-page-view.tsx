import type { Page } from "@/lib/wordpress.d";

type CmsPageViewProps = {
  page: Page;
};

export function CmsPageView({ page }: CmsPageViewProps) {
  return (
    <main className="container flex-1 py-8 lg:py-12">
      <article className="min-w-0">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            {page.title.rendered}
          </h1>
        </header>
        <div
          className="cms-content prose prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-teal-800 prose-a:dark:text-teal-400 prose-blockquote:border-l-teal-700 prose-blockquote:dark:border-l-teal-500 prose-blockquote:bg-muted prose-blockquote:py-1 prose-blockquote:not-italic"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      </article>
    </main>
  );
}
