import { siteConfig } from "@/site.config";
import type { Metadata } from "next";

interface ContentMetadataOptions {
  title: string;
  description: string;
  slug: string;
  basePath: "posts" | "pages";
  /** Full public path without leading slash (e.g. "about-me"). Overrides basePath/slug URL. */
  path?: string;
}

export function generateContentMetadata({
  title,
  description,
  slug,
  basePath,
  path,
}: ContentMetadataOptions): Metadata {
  const contentPath = path ?? `${basePath}/${slug}`;
  const contentUrl = `${siteConfig.site_domain}/${contentPath}`;
  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", title);
  ogUrl.searchParams.append("description", description);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: contentUrl,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function truncateHtml(html: string, maxWords: number): string {
  const text = html.replace(/<[^>]*>/g, "").trim();
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
