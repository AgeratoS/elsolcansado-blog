import { CmsPageView } from "@/frontend/widgets/cms-page";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";
import { getAllPagePaths, getPageByPath } from "@/lib/wordpress-pages";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllPagePaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");
  const page = await getPageByPath(path);

  if (!page) {
    return {};
  }

  const description = page.excerpt?.rendered
    ? stripHtml(page.excerpt.rendered)
    : stripHtml(page.content.rendered).slice(0, 200) + "...";

  return generateContentMetadata({
    title: page.title.rendered,
    description,
    slug: path,
    basePath: "pages",
    path,
  });
}

export default async function CmsCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.join("/");
  const page = await getPageByPath(path);

  if (!page) {
    notFound();
  }

  return <CmsPageView page={page} />;
}
