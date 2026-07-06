import { getAllCategories } from "@/lib/wordpress";
import type { FooterCategory } from "../model/types";

const EXCLUDED_CATEGORY_SLUGS = new Set(["uncategorized"]);

export function mapCategoriesToFooterLinks(
  categories: Awaited<ReturnType<typeof getAllCategories>>
): FooterCategory[] {
  return categories
    .filter(
      (category) =>
        category.parent === 0 &&
        category.count > 0 &&
        !EXCLUDED_CATEGORY_SLUGS.has(category.slug)
    )
    .map((category) => ({
      id: category.id,
      name: category.name,
      href: `/posts?category=${category.id}`,
    }));
}

export async function getFooterCategories(): Promise<FooterCategory[]> {
  const categories = await getAllCategories();
  return mapCategoriesToFooterLinks(categories);
}
