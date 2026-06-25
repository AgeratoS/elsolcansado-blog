import { getPostBySlug, getAllPostSlugs } from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";

import { cn } from "@/lib/utils";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

  const author = post._embedded?.author?.[0];
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = post._embedded?.["wp:term"]?.[0]?.[0];
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      <h1>{post.title.rendered}</h1>
      <div>
        <p>Published {date}</p>
        {author?.name && (
          <p>by {author.name}</p>
        )}

        {category && (
          <Link href={`/posts/?category=${category.id}`}>{category.name}</Link>
        )}
      </div>

      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </div>
  );
}
