import { getAllPages } from "@/lib/wordpress";
import {
  buildPagePath,
  isReservedNextJsPath,
} from "@/lib/wordpress-pages";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Pages",
  description: "Browse all pages of our site",
  alternates: {
    canonical: "/pages",
  },
};

export default async function Page() {
  const pages = await getAllPages();
  const pagesById = new Map(pages.map((page) => [page.id, page]));

  return (
    <div>
      {pages.map((page) => {
        const path = buildPagePath(page, pagesById);
        if (isReservedNextJsPath(path)) {
          return null;
        }

        return (
          <div key={page.id}>
            <Link href={`/${path}`}>{page.title.rendered}</Link>
          </div>
        );
      })}
    </div>
  );
}
