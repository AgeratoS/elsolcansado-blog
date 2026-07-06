import { getPageBySlug, getAllPages } from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";
import { notFound } from "next/navigation";
import * as m from "motion/react-client";

import type { Metadata } from "next";

// Revalidate pages every hour
export const revalidate = 3600;

export async function generateStaticParams() {
  const pages = await getAllPages();

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {};
  }

  const description = page.excerpt?.rendered
    ? stripHtml(page.excerpt.rendered)
    : stripHtml(page.content.rendered).slice(0, 200) + "...";

  return generateContentMetadata({
    title: page.title.rendered,
    description,
    slug: page.slug,
    basePath: "pages",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <m.div>
      <m.h1>{page.title.rendered}</m.h1>
      <m.div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
    </m.div>
  );
}
