import { getAllPages } from "@/lib/wordpress";
import type { Page as WPPage } from "@/lib/wordpress.d";
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

  return (
    <div>
      {pages.map((page) => (
        <div key={page.id}>
          <p>{page.title.rendered}</p>
          <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
        </div>
      ))}
    </div>
  );
}
