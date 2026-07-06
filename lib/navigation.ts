import { coreNavItems, type NavItem } from "@/frontend/shared/config/menu";
import { stripHtml } from "@/lib/metadata";
import { getAllPages } from "@/lib/wordpress";
import { buildPagePath, isReservedNextJsPath } from "@/lib/wordpress-pages";
import type { Page } from "@/lib/wordpress.d";

/** CMS page slugs shown in the footer only, not in the header. */
const FOOTER_ONLY_PAGE_SLUGS = new Set(["privacy-policy"]);

function pageToNavItem(
  page: Page,
  pagesById: Map<number, Page>,
): NavItem | null {
  const path = buildPagePath(page, pagesById);

  if (isReservedNextJsPath(path)) {
    return null;
  }

  return {
    id: String(page.id),
    label: stripHtml(page.title.rendered),
    href: `/${path}`,
  };
}

async function getCmsNavItems(
  options: { excludeSlugs?: Set<string> } = {},
): Promise<NavItem[]> {
  const pages = await getAllPages();
  const pagesById = new Map(pages.map((page) => [page.id, page]));
  const { excludeSlugs } = options;

  return pages
    .filter((page) => page.parent === 0)
    .filter((page) => !excludeSlugs?.has(page.slug))
    .sort((a, b) => a.menu_order - b.menu_order)
    .map((page) => pageToNavItem(page, pagesById))
    .filter((item): item is NavItem => item !== null);
}

export async function getMainNavigation(): Promise<NavItem[]> {
  const cmsItems = await getCmsNavItems();

  return [...coreNavItems, ...cmsItems];
}

export async function getHeaderNavigation(): Promise<NavItem[]> {
  const cmsItems = await getCmsNavItems({
    excludeSlugs: FOOTER_ONLY_PAGE_SLUGS,
  });

  return [...coreNavItems, ...cmsItems];
}
